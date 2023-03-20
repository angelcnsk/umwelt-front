const knex = require('../conecction');

class User {
  static async create(data) {
    return knex('users').insert(data);
  }

  static async read() {
    return knex('users').select('*');
  }

  static async update(id, data) {
    return knex('users').where('id', id).update(data);
  }

  static async delete(id) {
    return knex('users').where('id', id).del();
  }
}

module.exports = User;