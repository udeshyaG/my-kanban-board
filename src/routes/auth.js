const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const knex = require('../knex-init');
const tableNames = require('../constants/table-names');
const checkUserLogin = require('../middlewares/check-user-login');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Signup a new user
router.post('/auth/signup', upload.single('file'), async (req, res) => {
  const image = req.file;

  const { userId, name, desig, password } = req.body;

  if (
    typeof image === 'undefined' ||
    typeof userId === 'undefined' ||
    typeof name === 'undefined' ||
    typeof desig === 'undefined' ||
    typeof password === 'undefined'
  ) {
    return res.status(400).send({ error: 'Please fill all fields' });
  }

  const s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KET,
    region: process.env.AWS_REGION,
  });

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `users/` + image.originalname,
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

    const imageUrl = `https://my-kanban-board.s3.amazonaws.com/users/${image.originalname}`;

    // Hash the password
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);

    //   Now save data to database
    try {
      await knex(tableNames.users).insert({
        user_id: userId,
        name,
        desig,
        image_url: imageUrl,
        password: hashedPassword,
      });

      // Create the JWT token
      const newUser = {
        userId,
        name,
        desig,
        imageUrl,
      };
      const userJWT = jwt.sign(newUser, process.env.JWT_KEY);

      req.session = {
        jwt: userJWT,
      };

      res.status(201).send({
        msg: 'New User created successfully',
        ...newUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: 'Something went wrong' });
    }
  });
});

router.post(
  '/auth/signin',
  [
    body('userId').isString().withMessage('User Id is required'),
    body('password').isLength({ min: 4 }).withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    // Check if req is correct
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.array() });
    }

    const { userId, password } = req.body;

    try {
      const existingUser = await knex(tableNames.users)
        .select()
        .where({ user_id: userId });

      // the given userid does not exist
      if (existingUser.length == 0) {
        return res
          .status(400)
          .send({ error: 'Unable to Login. Provide Valid Credentials' });
      }

      const validPassword = await bcrypt.compare(
        password,
        existingUser[0].password
      );

      if (!validPassword) {
        return res
          .status(400)
          .send({ error: 'Unable to Login. Provide Valid Credentials' });
      }

      // UserId and Password both are correct
      // Create the JWT token
      const loggedInUser = {
        userId: existingUser[0].user_id,
        name: existingUser[0].name,
        desig: existingUser[0].desig,
        imageUrl: existingUser[0].image_url,
      };
      const userJWT = jwt.sign(loggedInUser, process.env.JWT_KEY);

      req.session = {
        jwt: userJWT,
      };

      res.status(200).send({ msg: 'Login Successful', ...loggedInUser });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: 'Something went wrong' });
    }
  }
);

router.get('/auth/currentuser', checkUserLogin, async (req, res) => {
  res.send({ user: req.currentuser });
});

// Sign out a user
router.post('/auth/signout', (req, res) => {
  req.session = null;

  res.send({});
});

module.exports = router;
