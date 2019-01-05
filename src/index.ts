import { Application } from 'probot' // eslint-disable-line no-unused-vars

export = (app: Application) => {
  app.on('pull_request.opened', async (context) => {
    const pattern = /\b[a-zA-Z]{3}\-{1}\d{3}\b/g;
    const { number, title, user: { login }, head: { repo: { name }}, ...remaining } = context.payload.pull_request;

    const isMatch = title.match(pattern);
    if (!isMatch)
      return await app.log("Improper title task ID: " + title);

    const body = "<a href='https://bluetent.atlassian.net/browse/" + isMatch[0].toUpperCase() + "'>This is the task.</a>";
    // Post a comment for the PR body
    await context.github.pullRequests.update({
      repo: name,
      owner: login,
      number: number,
      body: body,
    });
  })
}
