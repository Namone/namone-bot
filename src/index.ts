import { Application } from 'probot'; // eslint-disable-line no-unused-vars
const { WebClient } = require('@slack/client');

const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);
const appId = process.env.SLACK_APP_ID;
const channelId = process.env.SLACK_CHOICE_DEV_ID;

export = (app: Application) => {
  app.on('pull_request.opened', async (context) => {
    const pattern = /\b[a-zA-Z]{3}\-{1}\d{3}\b|\b\d{6}\b/g;
    const { number, title, body, head: { repo: { name }}, base: { user: { login }}, ...remaining } = context.payload.pull_request;
    app.log(number);
    const isMatch = title.match(pattern);
    if (!isMatch)
      return await app.log("No task ID found. Supplied title data: " + title);

    let bodyOutput = "";
    isMatch.forEach((taskId: String, index: any) => {
      const link = taskId.match(/\b[a-zA-Z]{3}\b/g) ? "https://bluetent.atlassian.net/browse/" : "https://system.na2.netsuite.com/app/accounting/project/projecttask.nl?id=";
      let displayIndex = index + 1;
      const taskCount = isMatch.length > 1 ? " (" + displayIndex + "/" + isMatch.length + ")" : "";
      bodyOutput += "[This pull request relates to this task." + taskCount + "](" + link + taskId.toUpperCase() + ")";

      if (taskCount.length > 0 && displayIndex < isMatch.length) {
        bodyOutput += "\n \n";
      }
    });

    if (body.length > 0) {
      bodyOutput += "\n \n";
    }

    // Post a comment for the PR body
    await context.github.pullRequests.update({
      repo: name,
      owner: login,
      number: number,
      body: bodyOutput + body,
    });
  });

  app.on('pull_request.closed', async (context) => {
    app.log(context.payload);

    const { number, title, merged, head: {label, user: {login} }, ...remaining } = context.payload.pull_request;
    // `res` contains information about the posted message

    if(!merged) {
      return;
    }

    (async () => {
      // See: https://api.slack.com/methods/chat.postMessage
      const res = await web.chat.postMessage({ 
        channel: channelId, 
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:  title + ' - (' + label + "/" + number  + ')',
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:  'Merged by: ' + login,
            }
          },
        ]
      });

      // `res` contains information about the posted message
      app.log(res);
    })();
  });

  app.on('deployment_status', async (context) => {
    const { deployment: { ref }, deployment_status: { state, creator: { login } } } = context.payload;

    const trackedBranches = [
      'master',
    ];
    
    if(!trackedBranches.includes(ref)) {
      return;
    }

    (async () => {
      // See: https://api.slack.com/methods/chat.postMessage
      const res = await web.chat.postMessage({ 
        channel: appId, 
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Deployment to `" + ref + "` completed with status: " + state,
            }
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text:  'Merged by: ' + login,
            }
          },
        ]
      });

      // `res` contains information about the posted message
      console.log(res);
    })();
  });
}
