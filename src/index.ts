import { Application } from 'probot' // eslint-disable-line no-unused-vars

export = (app: Application) => {
  app.on('pull_request.opened', async (context) => {
    const pattern = /\b[a-zA-Z]{3}\-{1}\d{3}\b|\b\d{6}\b/g;
    const { number, title, body, user: { login }, head: { repo: { name }}, ...remaining } = context.payload.pull_request;

    const isMatch = title.match(pattern);
    if (!isMatch)
      return await app.log("No task ID found. Supplied title data: " + title);

    let bodyOutput = "";
    isMatch.forEach((taskId: String, index: any) => {
      const link = taskId.match(/\b[a-zA-Z]{3}\b/g) ? "https://bluetent.atlassian.net/browse/" : "https://system.na2.netsuite.com/app/accounting/project/projecttask.nl?id=";
      let displayIndex = index + 1;
      const taskCount = isMatch.length > 1 ? " (" + displayIndex + "/" + isMatch.length + ")" : "";
      bodyOutput += "[This pull request relates to this task." + taskCount + "](" + link + taskId.toUpperCase() + ")";
    });

    if (body.length > 0) {
      body.bodyOutput += "\s\s\s\s";
    }

    // Post a comment for the PR body
    await context.github.pullRequests.update({
      repo: name,
      owner: login,
      number: number,
      body: bodyOutput + body,
    });
  })
}
