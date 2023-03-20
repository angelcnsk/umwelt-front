const app = require('express')()
var cors = require('cors');
app.use(cors());


// const knex = require('../backend/database/conecction')
const User = require('../backend/database/models/user')

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    )
    // const usuarios = await knex.table('users').select('*');

    // await User.create({
    //     "name":'Ángel Contreras',
    //     "email":"angel@apeironws.com",
    //     "password":"8hrun34j84",
    //     "avatar":null,
    //     "signature":null
    // })

    res.send({"user":req.email, "password":req.password})
    // res.status(200).send('Hello, world!');
};
