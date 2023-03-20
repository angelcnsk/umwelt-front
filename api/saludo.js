const app = require('express')()
var cors = require('cors');
app.use(cors());

console.log('trae cors', app)
// const knex = require('../backend/database/conecction')
const User = require('../backend/database/models/user')

module.exports = async (req, res) => {
    // const usuarios = await knex.table('users').select('*');

    await User.create({
        "name":'Ángel Contreras',
        "email":"angel@apeironws.com",
        "password":"8hrun34j84",
        "avatar":null,
        "signature":null
    })

    res.send({"msg":'success'})
    // res.status(200).send('Hello, world!');
};
