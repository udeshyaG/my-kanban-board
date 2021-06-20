const tableNames = require('../../src/constants/table-names');

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.projects, (table) => {
    table.increments('project_id').notNullable();
    table.string('project_name').notNullable();
    table.string('date_created').notNullable();
    table
      .string('created_by_user_id')
      .notNullable()
      .references('user_id')
      .inTable(tableNames.users)
      .onDelete('CASCADE');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable(tableNames.projects);
};
