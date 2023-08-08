const knex = require('../conecction');

class User {
  static async create(data) {
    return await knex('users').insert(data);
  }

  static async read() {
    return await knex('users').select('*');
  }

  static async update(id, data) {
    return await knex('users').where('id', id).update(data);
  }

  static async delete(id) {
    return await knex('users').where('id', id).del();
  }

  static async findOne(data) {
    return await knex('users').where('email', data.email).first();
  }

  static async userMainData(data){
    const user = await this.findOne({email:data})
    console.log('construyendo objeto de usuario', JSON.parse(JSON.stringify(user)))
  }

}

module.exports = User;