const tableNames = require('../../src/constants/table-names');

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.projectMembers, (table) => {
    table
      .integer('project_id')
      .notNullable()
      .references('project_id')
      .inTable(tableNames.projects)
      .onDelete('CASCADE');

    table
      .string('user_id')
      .notNullable()
      .references('user_id')
      .inTable(tableNames.users)
      .onDelete('CASCADE');

    table.primary(['project_id', 'user_id']);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable(tableNames.projectMembers);
};
