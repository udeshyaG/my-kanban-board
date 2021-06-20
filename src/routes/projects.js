const express = require('express');
const checkUserLogin = require('../middlewares/check-user-login');
const knex = require('../knex-init');
const tableNames = require('../constants/table-names');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Create a new Project
router.post(
  '/projects/new',
  checkUserLogin,
  [body('projectName').isString().withMessage('Project Name is required')],
  async (req, res) => {
    const errors = validationResult(req);
    // Check if req is correct
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    try {
      const resultProjectId = await knex(tableNames.projects)
        .insert({
          project_name: req.body.projectName,
          date_created: new Date().toISOString(),
          created_by_user_id: req.currentuser.userId,
        })
        .returning('project_id');

      await knex(tableNames.projectMembers).insert({
        project_id: parseInt(resultProjectId),
        user_id: req.currentuser.userId,
      });

      res
        .status(201)
        .send({
          msg: 'New Project Created successfully',
          projectId: resultProjectId,
        });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
);

// Add members to a project
router.post(
  '/projects/add-members',
  checkUserLogin,
  [
    body('projectId').isInt().withMessage('Project Id is required'),
    body('usersList').isArray().withMessage('Users List is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // Check if req is correct
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const { projectId, usersList } = req.body;

    let databaseList = [];
    usersList.forEach((user) => {
      databaseList.push({ project_id: projectId, user_id: user });
    });

    try {
      await knex(tableNames.projectMembers).insert(databaseList);

      res.status(201).send({ msg: 'Members added for the project' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
);

// List all members of a project
router.get('/project/members/:projectId', checkUserLogin, async (req, res) => {
  try {
    const memberIds = await knex(tableNames.projectMembers)
      .select('user_id')
      .where({ project_id: req.params.projectId });

    let queryArr = [];
    memberIds.forEach((member) => {
      queryArr.push(member.user_id);
    });

    const membersList = await knex(tableNames.users)
      .select('user_id', 'name', 'desig', 'image_url')
      .whereIn('user_id', queryArr);

    res.send(membersList);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Something went wrong' });
  }
});

// List all projects of which a user is a member
router.get('/projects/list', checkUserLogin, async (req, res) => {
  const projectIds = await knex(tableNames.projectMembers)
    .select('project_id')
    .where({ user_id: req.currentuser.userId });

  let queryArr = [];
  projectIds.forEach((project) => {
    queryArr.push(project.project_id);
  });

  const projectList = await knex(tableNames.projects)
    .select()
    .whereIn('project_id', queryArr);

  res.send(projectList);
});

// send details of a particular project
router.get('/project/details/:projectId', checkUserLogin, async (req, res) => {
  const projectDetails = await knex(tableNames.projects).select().where({project_id: req.params.projectId});

  res.send(projectDetails)
})

module.exports = router;
