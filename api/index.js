const app = require('express')()
module.exports = (req, res) => {
    app.get('/', (req, res) => {
        res.send({"saludo":'hola'})
    })
    // res.status(200).send('Hello, world!');
  };
