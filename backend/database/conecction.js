const knex = require('knex')({
  client: 'mysql',
  connection: {
      host : '206.81.3.192',
      port : 3306,
      user : 'angel',
      password : 'apeironws#%)',
      database : 'umwelt'
  },
  pool: {min:0, max:10},
  debug: true
});

module.exports = knex;
