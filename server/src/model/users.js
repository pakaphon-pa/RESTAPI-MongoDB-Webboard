const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

require('dotenv').config()

const jwtSecret = process.env.jwtSecret

const UserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        min: 10,
        max: 20
    },
    username:{
        type: String,
        unique: true,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    last_login_at:{
        type: Date,
        default: Date.now
    }
})

UserSchema.methods.genarateAuthToken = async function(){
    const user = this

    const payload = {
        user:{
            id: user.id
        }
    }

    const token = jwt.sign(
        payload,
        jwtSecret,
        { expiresIn: "10h" }
     
    )

    return token

}

module.exports = User = mongoose.model('user', UserSchema)