# Full Stack Kanban Board

### [Click Here](https://ancient-waters-77774.herokuapp.com) to view app 🚀

### Technology used

- React (Front End Framework) ⚛
- Node JS with Express (Back end)
- Postgres SQL (Database) 💾
- AWS S3 (Image storage) ☁
- Heroku (Deployment) ⚡
- Travis CI (Automated Testing) 👷‍♂️

---

1. `Kanban Board`
<img src="screenshots/kanban-table-ss.JPG" />

2. `Travis CI dashboard for automated testing`
<img src="screenshots/travis-ci-dashboard.JPG" width="700" />

3. `Add a new task to the board. Image of the task get saved to S3 ☁`
<img src="screenshots/kanban-add-task.JPG" width="700" />

4. `Add a new Project and add members to the project`
<img src="screenshots/kanban-add-project.JPG" width="700" />

4. `Register a new User`
<img src="screenshots/kanban-register-user.JPG" width="700" />

3. `Details of a task and comments for a task. All members can see the details. Only the user who is assigned can edit a task`
<img src="screenshots/kanban-table-comments.JPG" height="500" />

5. `List all projects associated with a member. Clicking on the project opens the Kanban Board`
<img src="screenshots/kanban-project-list.JPG" height="300" />

---

### Steps to run project locally
Make sure you have `PostgresSQL` and `NodeJS` installed locally

1. Clone the Github repository

2. Install all dependencies for node and react

3. Migrate the database and run backend server
```
npm run migrate
npm run start
```

3. Run the react client server
```
cd client
npm run start
```