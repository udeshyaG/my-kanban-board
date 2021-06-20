const tableNames = require('../../src/constants/table-names');

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.tasks, (table) => {
    table.increments('task_id').notNullable();

    table
      .integer('project_id')
      .notNullable()
      .references('project_id')
      .inTable(tableNames.projects)
      .onDelete('CASCADE');

    table
      .string('assigned_user_id')
      .notNullable()
      .references('user_id')
      .inTable(tableNames.users)
      .onDelete('CASCADE');

    table.string('title').notNullable();
    table.string('description');
    table.string('image_url');
    table.string('status', 20).notNullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable(tableNames.tasks);
};
