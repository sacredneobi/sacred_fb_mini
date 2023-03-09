### Mini project facebook bot

1. Need create app
   > https://developers.facebook.com/
   > Register and go to "My Apps"
2. Press create app and select other
3. Fill name app
4. Select your app
5. Top left press on select project and press "create test app"
6. Add product to project "messenger" and "webhooks"
7. Go to Graph Explorer
   > https://developers.facebook.com/tools/explorer/
8. Select app meta and select your app
9. Added access <code>pages_messaging, pages_manage_metadata, pages_show_list</code>
10. Press <code>"Generate Access Token"</code>
11. Select your page
12. Select in <code>"User or page"</code> your app
13. Copy "token" and past in config/appData.js in pageAccessToke
14. filed <code>appId, pageId, appUrl, shopUrl and appSecret</code> from app page setting
15. Install all dependency npm i
16. npm start
17. Go to <code>${appUrl}/profile</code> and apply setting to app
