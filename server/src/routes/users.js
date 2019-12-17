const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const { check , validationResult } = require('express-validator')

const User = require('../model/users')

router.post('/register', 
                        [ check('password',
                                'password ต้องมีมากกว่า 10 ตัว ต้องประกอบด้วย ตัวอักษรเล็ก ตัวอักษรใหญ่และตัวเลข'
                                ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}$/, "i")
                         ,check('email',
                                'กรอก email ให้ถูกต้อง').isEmail()
                         ,check('username',
                                'กรุณากรอก username').not().isEmpty()],
                        async (req , res) =>{

    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({ errors: error.array() })
    }
    const { username , email , password } = req.body
    try {
        let match  = await User.findOne({ username })
        if(match){
            return res.status(400).json({
                errors: [{ msg : 'มี username นี้อยู่ในระบบแล้ว' }]
            })
        }

        user = new User({
            username,
            email,
            password
        })

        const salt = await bcrypt.genSalt(10)

        user.password = await bcrypt.hash(password , salt)

        await user.save()
        const token = await user.genarateAuthToken()
        res.status(201).send({ token })
      
    } catch (error) {
        console.log(error.message)
        res.status(500).send('Server error')
    }
})

router.post('/login',
                     [ check('username', 'กรุณากรอก username').not().isEmpty()
                      ,check('password', 'กรุณากรอก password').not().isEmpty()]
                      ,async (req ,res) =>{
                          
            const error = validationResult(req)
            if(!error.isEmpty()){
                return res.status(400).json({ errors: error.array() })
            }
            const { username , password } = req.body

            try {
                let user = await User.findOne({ username })
                if(!user){
                    return res.status(400).json({ errors: [{ msg: 'กรุณากรอกข้อมูลให้ถูกต้อง' }]})
                    
                }

                const isMatch = await bcrypt.compare(password, user.password)
                if(!isMatch){
                    return res.status(400).json({ errors: [{ msg: 'กรุณากรอกข้อมูลให้ถูกต้อง' }] })
                }

                await User.findByIdAndUpdate(user._id, { 'last_login_at': Date.now() })

                const token = await user.genarateAuthToken()
                res.status(201).send({ token })

            } catch (error) {
                console.log(error.message)
                res.status(500).send('Server error')
            }

})

module.exports = router