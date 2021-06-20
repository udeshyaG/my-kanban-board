const express = require('express');
const { body, validationResult } = require('express-validator');

const checkUserLogin = require('../middlewares/check-user-login');
const knex = require('../knex-init');
const tableNames = require('../constants/table-names');

const router = express.Router();

// Create a comment
router.post(
  '/comment/new',
  checkUserLogin,
  [
    body('taskId').isInt().withMessage('Task Id is required'),
    body('text').isString().withMessage('Comment Text is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    // Check if req is correct
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const { taskId, text } = req.body;

    try {
      await knex(tableNames.comments).insert({
        task_id: taskId,
        text,
        user_id: req.currentuser.userId,
      });

      res.send({ msg: 'Comment created successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
);

// get all comments associated with a particular task
router.get('/comments/list/:taskId', checkUserLogin, async (req, res) => {
  try {
    const commentsList = await knex(tableNames.comments)
      .select()
      .where({ task_id: req.params.taskId });

    res.send(commentsList);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Something went wrong' });
  }
});

module.exports = router;
