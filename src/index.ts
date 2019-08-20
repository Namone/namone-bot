import { Application } from 'probot'; // eslint-disable-line no-unused-vars
import * as SlackAPI from './slack';
const { Octokit } = require('@octokit/rest');

const octokit = Octokit({
    auth: process.env.WEBHOOK_SECRET,
    userAgent: 'TaskBot 1.6.0',
    baseUrl: 'https://api.github.com'
});

export = (app: Application) => {
  app.on('pull_request.opened', async (context) => {
    const pattern = /\b[a-zA-Z]{3}\-{1}\d{3}\b|\b\d{6}\b/g;
    const { number, title, body, head: { repo: { name }}, base: { user: { login }}, ...remaining } = context.payload.pull_request;

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
    await octokit.pulls.update({
      repo: name,
      owner: login,
      number: number,
      body: bodyOutput + body
    });
  });

  // app.on('pull_request.opened', async (context) => {
  //   const { number, url, title, body, head: { repo: { name }}, base: { user: { login }}, ...remaining } = context.payload.pull_request;

  // });

  // When PR Draft is ready for review
  app.on('pull_request.ready_for_review', async (context) => {
    const { number, html_url, title, body, head: { repo: { name }}, base: { user: { login }}, ...remaining } = context.payload.pull_request;
    
    const message = {
      "attachments": [
          {
              "fallback": "TaskBot: Review Pull Request",
              "color": "good",
              "author_name": login,
              "title": "Review Pull Request (" + name + ")",
              "title_link": html_url,
              "text": "Pull request #" + number + " is ready to be reviewed.",
              "fields": [],
              "footer": "TaskBot",
          }
        ]
      };

    SlackAPI.postMessage(message);
  });

  // When review is edited, deleted, or submitted on a PR
  // app.on('pull_request_review', async (context) => {
  //   // const { user: { login } } = context.payload.review;
  //   const { number, html_url, title, body, head: { repo: { name }}, base: { user: { login }}, ...remaining } = context.payload.pull_request;
    
  //   const message = {
  //     "attachments": [
  //         {
  //             "fallback": "TaskBot: Review Pull Request",
  //             "color": "good",
  //             "author_name": login,
  //             "title": "Review Pull Request (" + name + ")",
  //             "title_link": html_url,
  //             "text": "Pull request #" + number + " is ready to be reviewed.",
  //             "fields": [],
  //             "footer": "TaskBot",
  //         }
  //       ]
  //     };

  //   SlackAPI.postMessage(message);
  // });

  app.on('pull_request.closed', async (context) => {
    const { number, html_url, title, merged, body, head: { repo: {name}, label, user: {login} }, ...remaining } = context.payload.pull_request;
    let message = {};

    if(!merged) {
      message = {
      "attachments": [
          {
              "fallback": "TaskBot: Closed Pull Request",
              "color": "warning",
              "author_name": login,
              "title": "PR #" + number + " Closed",
              "title_link": html_url,
              "text": "*" + title + " (" + number + ")* \n>>>" + body,
              "fields": [
                  {
                      "title": "Merged",
                      "value": "FALSE",
                      "short": false
                  }
              ],
              "footer": "TaskBot",
          }
        ]
      };
    }
    else {
      message = {
      "attachments": [
          {
              "fallback": "TaskBot: Merged Pull Request",
              "color": "good",
              "author_name": login,
              "title": "PR #" + number + " Closed",
              "title_link": html_url,
              "text": "*" + title + " (" + number + ")* \n>>>" + body,
              "fields": [
                  {
                      "title": "Merged",
                      "value": "TRUE",
                      "short": false
                  }
              ],
              "footer": "TaskBot",
          }
        ]
      };
    }
    
    SlackAPI.postMessage(message);
  });

  app.on('deployment_status', async (context) => {
    const { deployment: { ref, url, environment }, deployment_status: { state, creator: { login } } } = context.payload;

    const trackedBranches = [
      'master',
    ];
    
    if(!trackedBranches.includes(ref)) {
      return;
    }

    const message = {
      "attachments": [
          {
              "fallback": "TaskBot: Deployment Completed",
              "color": "#42525A",
              "author_name": login,
              "title": ref + " (" + environment + ")",
              "title_link": url,
              "text": "Deployment (started by " + login + ") has completed.",
              "fields": [
                  {
                      "title": "Deployment Status",
                      "value": state,
                      "short": false
                  }
              ],
              "footer": "TaskBot",
          }
        ]
      };

    SlackAPI.postMessage(message);
  });
  
}


