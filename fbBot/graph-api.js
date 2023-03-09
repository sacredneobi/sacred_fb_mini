const { config } = require("../config");
const axios = require("axios");
const { URL, URLSearchParams } = require("url");

const sendData = (url_data, data, search = {}, isGet, isDelete) => {
  let url = new URL(`${config.apiUrl}/${url_data}`);
  url.search = new URLSearchParams({
    access_token: config.pageAccessToken,
    ...search,
  });

  let query;

  if (isGet) {
    query = axios.get(url, { headers: { "Content-Type": "application/json" } });
  } else if (isDelete) {
    query = axios.delete(url, data, {
      headers: { "Content-Type": "application/json" },
    });
  } else {
    query = axios.post(url, data, {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Promise((resolve, reject) => {
    if (query) {
      query
        .then((data) => resolve(data.data))
        .catch((err) => {
          if (!err?.response?.data) {
            console.log(err);
          }
          reject(err?.response?.data);
        });
    } else {
      reject("not found protocol");
    }
  });
};

const accessFields =
  "messages, messaging_postbacks, messaging_optins, message_deliveries, messaging_referrals";

const callSendApi = (requestBody) => {
  return sendData("me/messages", requestBody);
};

const callMessengerProfileAPI = (requestBody) => {
  return sendData("me/messenger_profile", requestBody);
};

const callMessengerProfileDeleteAPI = (requestBody) => {
  return sendData("me/messenger_profile", null, requestBody, false, true);
};

const callSubscriptionsAPI = (data) => {
  return sendData(`${data.appId}/subscriptions`, null, {
    access_token: `${data.appId}|${data.appSecret}`,
    object: "page",
    callback_url: data.webhookUrl + "/" + data.webhookRoute,
    verify_token: data.verifyToken,
    fields: accessFields,
    include_values: "true",
  });
};

const callSubscribedApps = () => {
  return sendData(`${config.pageId}/subscribed_apps`, null, {
    subscribed_fields: accessFields,
  });
};

const getUserProfile = (senderId) =>
  sendData(
    senderId,
    null,
    {
      fields: "first_name, last_name, gender, locale, timezone",
    },
    true
  ).then((data) => ({
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    gender: data.gender,
    locale: data.locale,
    timezone: data.timezone,
  }));

module.exports = {
  callSendApi,
  callMessengerProfileAPI,
  callMessengerProfileDeleteAPI,
  callSubscriptionsAPI,
  callSubscribedApps,
  getUserProfile,
};
