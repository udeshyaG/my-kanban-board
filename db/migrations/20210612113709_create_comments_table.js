const tableNames = require('../../src/constants/table-names');

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.comments, (table) => {
    table.increments('comment_id').notNullable();

    table
      .integer('task_id')
      .notNullable()
      .references('task_id')
      .inTable(tableNames.tasks)
      .onDelete('CASCADE');

    table.string('text').notNullable();

    table
      .string('user_id')
      .notNullable()
      .references('user_id')
      .inTable(tableNames.users)
      .onDelete('CASCADE');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable(tableNames.comments);
};
