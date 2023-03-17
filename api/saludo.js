const app = require('express')()
module.exports = (req, res) => {
    res.send({"saludo":'hola', 'inst':app})
    // res.status(200).send('Hello, world!');
  };
