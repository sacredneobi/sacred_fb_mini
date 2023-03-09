const {
  callMessengerProfileAPI,
  callMessengerProfileDeleteAPI,
  callSubscriptionsAPI,
  callSubscribedApps,
} = require("./graph-api");

const setWebhook = (data) => {
  return new Promise((resolve, reject) => {
    callSubscriptionsAPI(data)
      .then((dataAPI) => {
        callSubscribedApps()
          .then((data) =>
            resolve([
              { name: "callSubscriptionsAPI", dataAPI },
              { name: "callSubscribedApps", data },
            ])
          )
          .catch((err) => {
            reject({ name: "callSubscribedApps", err });
          });
      })
      .catch((err) => {
        reject({ name: "callSubscriptionsAPI", err });
      });
  });
};

const setThread = (whitelisted_domains, greeting, menu, question) => {
  const profilePayload = {
    get_started: {
      payload: "GET_STARTED",
    },
    whitelisted_domains,
  };

  if (greeting) {
    profilePayload.greeting = [
      {
        locale: "default",
        text: greeting,
      },
    ];
  }

  if (Array.isArray(question)) {
    profilePayload.ice_breakers = [
      {
        locale: "default",
        call_to_actions: question.map((item) => item),
      },
    ];
  }

  if (Array.isArray(menu)) {
    profilePayload.persistent_menu = [
      {
        locale: "default",
        call_to_actions: menu.map((item) => item),
        composer_input_disabled: false,
      },
    ];
  }

  callMessengerProfileAPI(profilePayload)
    .then((data) => {
      console.logUserDone("callMessengerProfileAPI", data);
      if (!question || !menu || !greeting) {
        const fields = [
          !question ? '"ice_breakers"' : null,
          !menu ? '"persistent_menu"' : null,
          !greeting ? '"greeting"' : null,
        ]
          .filter(Boolean)
          .join(",");

        callMessengerProfileDeleteAPI({ fields: `[${fields}]` })
          .then((data) =>
            console.logUserDone("callMessengerProfileDeleteAPI", data)
          )
          .catch((err) => {
            console.logUserErr("callMessengerProfileDeleteAPI", err);
          });
      }
    })
    .catch((err) => {
      console.logUserErr("callMessengerProfileAPI", err);
    });
};

module.exports = { setWebhook, setThread };
