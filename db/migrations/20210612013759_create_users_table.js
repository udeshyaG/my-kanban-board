const tableNames = require('../../src/constants/table-names');

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.users, (table) => {
    table.string('user_id', 20).notNullable().unique();
    table.string('name', 20).notNullable();
    table.string('desig', 20).notNullable();
    table.string('image_url').notNullable();
    table.string('password').notNullable();

    table.primary('user_id');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable(tableNames.users);
};
