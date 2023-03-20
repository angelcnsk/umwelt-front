// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host : '206.81.3.192',
      port : 3306,
      user : 'angel',
      password : 'apeironws#%)',
      database : 'umwelt'
    },
    useNullAsDefault: true
  }

};
