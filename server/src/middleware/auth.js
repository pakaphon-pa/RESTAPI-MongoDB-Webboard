const jwt = require('jsonwebtoken')
const User = require('../model/users')
require('dotenv').config()

const jwtToken = process.env.jwtSecret

const auth = async (req, res, next) =>{
    console.log('auth middleware')

    try {
        const token = req.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token, jwtToken)
        console.log('ID:', decode.user.id)
        console.log('Token:', token)

        const user = await User.findOne({ id:decode.id })

        if(!user){
            res.status(400).json({ errors: [{ msg: 'ไม่มีข้อมูล' }]})
        }

        req.user = user 
        req.token = token
        next()

    } catch (error) {
        console.log(error.message)
        res.status(401).send({ errors : 'กรุณาเข้าสู่ระบบ' })
    }
}

module.exports = auth