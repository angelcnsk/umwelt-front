const app = require('express')()
var cors = require('cors');
app.use(cors());

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

// const knex = require('../backend/database/conecction')
const User = require('../backend/database/models/user')
const claveSecreta = process.env.TOKEN_JTW_SIGNATURE


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
    
    const Joi = require('@hapi/joi');

    const schemaLogin = Joi.object({
        email: Joi.string().min(6).max(255).required().email(),
        password: Joi.string().min(6).max(1024).required()
    })

    const { error } = schemaLogin.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message })

    const row = await User.findOne({ email: req.body.email });
    const user = JSON.parse(JSON.stringify(row));

    if (!user) return res.status(400).json({ error: 'Usuario no encontrado' });
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    
    if (!validPassword) return res.status(400).json({ error: 'contraseña no válida' })

    const token = jwt.sign({
        email: user.email,
        id: user._id
    }, claveSecreta, {expiresIn: '5s'})
    
    res.setHeader('auth-token', token).json({
        accessToken: token
    })
    
    // const usuarios = await knex.table('users').select('*');
    
    // await User.create({
    //     "name":'Ángel Contreras',
    //     "email":"angel@apeironws.com",
    //     "password":"8hrun34j84",
    //     "avatar":null,
    //     "signature":null
    // })
};
