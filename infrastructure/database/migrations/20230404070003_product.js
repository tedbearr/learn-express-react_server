/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("products", function (table) {
    table.increments("id");
    table.string("name", 255).notNullable();
    table.string("stock").notNullable();
    table.string("price").notNullable();
    table.string("description").notNullable();
    table.json("images", 255).notNullable();
    table.string("status").nullable().defaultTo("A");
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
  return knex.schema.dropTable("products");
};
