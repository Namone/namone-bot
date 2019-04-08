const { WebClient } = require('@slack/client');

const token = process.env.SLACK_OAUTH;
const web = new WebClient(token);
const appId = process.env.SLACK_APP_ID;
const groupId = process.env.SLACK_GROUP_ID;

// @TODO: Finish this.
export const postMessage = (data: {}) => {
  (async () => {
    const testUser = 'DCJB50M9C';
    // See: https://api.slack.com/methods/chat.postMessage
    const res = await web.chat.postMessage({ channel: testUser, text: 'Hello there' });

    // `res` contains information about the posted message
    console.log('Message sent: ', res.ts);
  })();
};

// app.on('pull_request.closed', async (context) => {
//   app.log(context.payload);

//   const { number, title, merged, head: {label, user: {login} }, ...remaining } = context.payload.pull_request;
//   // `res` contains information about the posted message

//   if(!merged) {
//     return;
//   }

//   (async () => {
//     // See: https://api.slack.com/methods/chat.postMessage
//     const res = await web.chat.postMessage({ 
//       channel: channelId, 
//       blocks: [
//         {
//           type: "section",
//           text: {
//             type: "mrkdwn",
//             text:  title + ' - (' + label + "/" + number  + ')',
//           }
//         },
//         {
//           type: "section",
//           text: {
//             type: "mrkdwn",
//             text:  'Merged by: ' + login,
//           }
//         },
//       ]
//     });

//     // `res` contains information about the posted message
//     app.log(res);
//   })();
// });

// app.on('deployment_status', async (context) => {
//   const { deployment: { ref }, deployment_status: { state, creator: { login } } } = context.payload;

//   const trackedBranches = [
//     'master',
//   ];
  
//   if(!trackedBranches.includes(ref)) {
//     return;
//   }

//   (async () => {
//     // See: https://api.slack.com/methods/chat.postMessage
//     const res = await web.chat.postMessage({ 
//       channel: appId, 
//       blocks: [
//         {
//           type: "section",
//           text: {
//             type: "mrkdwn",
//             text: "Deployment to `" + ref + "` completed with status: " + state,
//           }
//         },
//         {
//           type: "section",
//           text: {
//             type: "mrkdwn",
//             text:  'Merged by: ' + login,
//           }
//         },
//       ]
//     });

//     // `res` contains information about the posted message
//     console.log(res);
//   })();
// });