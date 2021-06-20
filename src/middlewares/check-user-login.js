const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  if (!req.session.jwt) {
    return res.status(401).send({ error: 'Not authorized' });
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY);

    if (!payload.userId) {
      return res.status(401).send({ error: 'Not authorized' });
    }

    req.currentuser = payload;

    next();
  } catch (error) {
    return res.status(401).send({ error: 'Not authorised' });
  }
};
