const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');

const checkUserLogin = require('../middlewares/check-user-login');
const knex = require('../knex-init');
const tableNames = require('../constants/table-names');
const taskStatus = require('../constants/task-status');
const { body, validationResult } = require('express-validator');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

// Create a new Task for a particular project
router.post(
  '/tasks/new',
  checkUserLogin,
  upload.single('file'),
  async (req, res) => {
    const image = req.file;

    const { projectId, title, description, assignedUserId } = req.body;

    const s3bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KET,
      region: process.env.AWS_REGION,
    });

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `tasks/` + image.originalname,
      Body: image.buffer,
      ContentType: image.mimetype,
      ACL: 'public-read',
    };

    s3bucket.upload(params, async (err, data) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send({ error: 'Error while uploading image to S3' });
      }

      const imageUrl = `https://my-kanban-board.s3.amazonaws.com/tasks/${image.originalname}`;

      try {
        await knex(tableNames.tasks).insert({
          project_id: projectId,
          title,
          description,
          image_url: imageUrl,
          assigned_user_id: assignedUserId,
          status: taskStatus.todo,
        });

        res.status(201).send({ msg: 'New Task created successfully' });
      } catch (error) {
        console.log(error);
        res.status(500).send({ error: 'Something went wrong' });
      }
    });
  }
);

// Update the status of a Task
// Only user who is assigned to the task can update the status
router.post(
  '/task/update',
  checkUserLogin,
  [
    body('taskId').isInt().withMessage('Task Id is required'),
    body('status').isString().withMessage('New Status is required'),
    body('newAssignedUserId')
      .isString()
      .withMessage('New Assigned user id is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // Check if req is correct
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const { taskId, status, newAssignedUserId } = req.body;

    const task = await knex(tableNames.tasks)
      .select('assigned_user_id')
      .where({ task_id: taskId });

    if (task[0].assigned_user_id !== req.currentuser.userId) {
      console.log('Ass = ', task[0].assigned_user_id);
      console.log('Current User = ', req.currentuser.userId);
      console.log('Task Id = ', taskId);
      return res
        .status(400)
        .send({ error: 'You are not allowed to change status of this task' });
    }

    try {
      await knex(tableNames.tasks)
        .select()
        .where({ task_id: taskId })
        .update({ status: status, assigned_user_id: newAssignedUserId });

      res.send({ msg: 'Status updated successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
);

// Get all tasks associated with a particular project
router.get('/tasks/list/:projectId', checkUserLogin, async (req, res) => {
  try {
    const tasksList = await knex(tableNames.tasks)
      .select()
      .where({ project_id: req.params.projectId });

    res.send(tasksList);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Something went wrong' });
  }
});

module.exports = router;
