const environment = process.env.NODE_ENV || 'development';

const knexFile = require('../knexfile');
const knex = require('knex')(knexFile[environment]);

module.exports = knex;
