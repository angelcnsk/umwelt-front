/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('users', function(t) {
        t.increments('id').unsigned().primary();
        t.string('name',250).nullable();
        t.string('email',250).nullable();
        t.string('password',250).nullable();
        t.string('avatar',250).nullable();
        t.text('signature').nullable();
        t.tinyint('active',1).defaultTo(1);

        t.timestamps();
        
        // t.text('decription').nullable();
        // t.decimal('price', 6, 2).notNull();
        // t.enum('category', ['apparel', 'electronics', 'furniture']).notNull();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  
};
