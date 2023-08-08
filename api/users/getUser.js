import verifyToken from '../../backend/security/auth.js'
const User = require('../../backend/database/models/user')

module.exports =  async (req, res) => {    
    const validationToken = await verifyToken(req,res)
    if(validationToken == 'token no es valido'){
        return res.status(401).json({ error: 'Acceso denegado' })
    }
    const emailUser = validationToken.email
    console.log('va a buscar', emailUser)
    console.log('termina?',emailUser, await User.userMainData(emailUser))

    res.json({"msg":'success'})
}