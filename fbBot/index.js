const { EventEmitter } = require("events");
const { callSendApi, getUserProfile } = require("./graph-api");
const { genQuickReply, genImageReply } = require("./response");
const { setWebhook, setThread } = require("./setting.js");

class FBBot extends EventEmitter {
  constructor(verifyToken, debug = false) {
    super();
    this.verifyToken = verifyToken;
    this.debug = debug;
  }

  reply(senderId) {
    return function (messages) {
      for (let message of messages) {
        if (message === undefined || message === null) {
          return;
        }

        const recipient = { id: senderId };

        callSendApi({ recipient, message })
          .then((data) => {
            console.logUserSuccess("SEND", JSON.stringify(data));
          })
          .catch((err) => {
            console.logUserErr("SEND", JSON.stringify(err));
          });
      }
    };
  }

  hook(app, name) {
    app.get(`/${name}`, (req, res) => {
      let mode = req.query["hub.mode"];
      let token = req.query["hub.verify_token"];
      let challenge = req.query["hub.challenge"];

      if (mode && token) {
        if (mode === "subscribe" && token === this.verifyToken) {
          console.logUserDone("WEBHOOK_VERIFIED");
          res.status(200).send(challenge);
        } else {
          res.sendStatus(403);
        }
      }
    });
    app.post(`/${name}`, (req, res) => {
      let body = req.body;
      if (this.debug) {
        console.logUserDone(`EVENT`, JSON.stringify(body));
      }

      if (body.object === "page") {
        res.status(200).send("EVENT_RECEIVED");
        this.process(body);
      } else {
        res.sendStatus(404);
      }
    });
  }

  handleMessage(userId, webhookEvent, botId) {
    let event = webhookEvent;

    const context = { reply: this.reply(userId), userId, botId };

    if (event.message) {
      let message = event.message;

      context.message = message;
      context.messageId = message.mid;
      if (message.text) {
        context.message = message.text;
      }

      if (message.quick_reply) {
        context.command = message.quick_reply.payload;
        context.quickReply = message.quick_reply;
        this.emit("command", context);
      } else if (message.attachments) {
        context.attachments = message.attachments;
        delete context.message;
        this.emit("attachments", context);
      } else if (message.text) {
        this.emit("text", context);
      }
    } else if (event.postback) {
      const { timestamp, postback, sender, recipient, ...otherEvent } = event;
      const { mid, ...other } = postback;

      context.postback = other;
      context.command = event.postback.payload;
      context.messageId = mid;
      context.timestamp = timestamp;
      this.emit("command", context);
    }
  }

  process(data) {
    if (data.object === "page") {
      data.entry.forEach((entry) => {
        entry.messaging.forEach((webhookEvent) => {
          this.handleMessage(
            webhookEvent.sender?.id,
            webhookEvent,
            webhookEvent.recipient?.id
          );
        });
      });
    }
  }
}

module.exports = {
  genQuickReply,
  genImageReply,
  FBBot,
  getUserProfile,
  setWebhook,
  setThread,
};
