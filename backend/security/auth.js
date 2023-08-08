const jwt = require('jsonwebtoken')

// middleware to validate token (rutas protegidas)
const verifyToken = (req, res, next) => {
    let token = false
    if(req.headers.authorization && req.headers.authorization != ''){
        token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) return res.status(401).json({ error: 'Acceso denegado' })
    
    try {
        const verified = jwt.verify(token, process.env.TOKEN_JTW_SIGNATURE)
        // console.log('el usuario es:', verified.email)
        return verified
    } catch (error) {
        // console.log('el token no es válido:', error)
        return 'token no es valido'
    }
}

module.exports = verifyToken;