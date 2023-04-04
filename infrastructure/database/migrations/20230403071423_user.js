/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("users", function (table) {
    table.increments("id");
    table.string("username", 255).notNullable();
    table.string("password", 255).notNullable();
    table.string("status").nullable().defaultTo("A");
    table.string("access_token", 255).nullable();
    table.string("refresh_token", 255).nullable();
    table.timestamp("created_at");
    table.string("created_by").nullable();
    table.timestamp("updated_at");
    table.string("updated_by").nullable();
    table.timestamp("deleted_at");
    table.string("deleted_by").nullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
