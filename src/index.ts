import { Application } from 'probot' // eslint-disable-line no-unused-vars

export = (app: Application) => {
  app.on('pull_request.opened', async (context) => {
    // const pull_requestComment = context.issue({ body: 'Task is here.' })
    app.log(context);
  })
}
