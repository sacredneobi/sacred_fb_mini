const { config } = require("./config");
const express = require("express");
const {
  FBBot,
  genQuickReply,
  genImageReply,
  getUserProfile,
  setWebhook,
  setThread,
} = require("./fbBot");

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const fb = new FBBot(config.verifyToken);

fb.hook(app, config.webhookRoute);

fb.on("text", (ctx) => {
  console.log(ctx);
  ctx.reply([
    genQuickReply("Чем мы можем вам помочь?", [
      {
        title: "Советы по выбору",
        payload: "CURATION",
      },
      {
        title: "Поговорить с агентом",
        payload: "CARE_HELP",
      },
    ]),
  ]);
});

fb.on("attachments", (ctx) => {
  console.log(ctx);
  ctx.reply([
    genQuickReply(
      "Спасибо за вложение. Вы можете прямо сейчас связаться с агентом, чтобы он его посмотрел, или начать заново.",
      [
        {
          title: "Поговорить с агентом",
          payload: "CARE_HELP",
        },
        {
          title: "Начать заново",
          payload: "GET_STARTED",
        },
      ]
    ),
  ]);
});

fb.on("command", (ctx) => {
  console.log(ctx);
  ctx.reply([
    genImageReply(
      "Привет _ new",
      {
        subtitle: "Сгенерированное сообщение",
        img: "https://sacredapp.us/456.jpg",
        defAction: { url: "https://sacredapp.us/?type=facebook" },
      },
      [
        {
          url: "https://sacredapp.us/?type=facebook",
          title: "Открыть магазин",
        },
        {
          title: "Кнопка 1",
          payload: "TEST 1",
        },
        {
          title: "Кнопка 2",
          payload: "TEST 2",
        },
      ]
    ),
  ]);
});

app.get("/profile", async (req, res) => {
  setWebhook(config)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });

  setThread(
    config.whitelistedDomains,
    "Привет в тестовом магазине, нажми 'начать' чтобы продолжить",
    [
      {
        title: "Начать 1",
        type: "postback",
        payload: "GET_STARTED",
      },
      {
        title: "Кнопка с postback 1",
        type: "postback",
        payload: "CURATION_OTHER_STYLE",
      },
    ]
  );

  const data = {
    webhook: config.webhookUrl + "/" + config.webhookRoute,
    profileBotId: config.pageId,
    whitelistedDomains: config.whitelistedDomains,
  };
  res.status(200).send(data);
});

var listener = app.listen(config.port, function () {
  console.logUserDone("PORT", listener.address().port);

  if (config.pageId) {
    console.logUserDone("URL", `https://m.me/${config.pageId}`);
  }
  if (config.appUrl && config.verifyToken) {
    console.logUserDone("SETTING", `${config.appUrl}/profile`);
  }
});
