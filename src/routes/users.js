const express = require('express');
const checkUserLogin = require('../middlewares/check-user-login');
const knex = require('../knex-init');
const tableNames = require('../constants/table-names');

const router = express.Router();

router.get('/users/all', checkUserLogin, async (req, res) => {
  const currentUserId = req.currentuser.userId;

  try {
    const users = await knex(tableNames.users)
      .select('user_id', 'name', 'desig', 'image_url')
      .whereNot({ user_id: currentUserId });

    res.send(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Something went wrong' });
  }
});

module.exports = router;
