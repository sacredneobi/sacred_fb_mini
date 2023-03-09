const data = {
  apiDomain: "https://graph.facebook.com",
  apiVersion: "v16.0",

  pageId: "",
  appId: "",
  pageAccessToken: "",
  appSecret: "",
  verifyToken: "other_string",

  appUrl: "",
  shopUrl: "https://sacredapp.us",

  port: 81,
  webhookRoute: "fb_event_hook",
};

module.exports = {
  ...data,
  apiUrl: `${data.apiDomain}/${data.apiVersion}`,
  webhookUrl: `${data.appUrl}`,
  whitelistedDomains: [data.appUrl, data.shopUrl],
};
