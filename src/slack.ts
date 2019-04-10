const { WebClient } = require('@slack/client');

const token = process.env.SLACK_OAUTH;
const web = new WebClient(token);
const appId = process.env.SLACK_APP_ID;
const groupId = process.env.SLACK_GROUP_ID;

// @TODO: Finish this.
export const postMessage = (message: {}) => {
  (async () => {
    // See: https://api.slack.com/methods/chat.postMessage
    const res = await web.chat.postMessage({ channel: '#choice-dev', ...message });

    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
  })();
};