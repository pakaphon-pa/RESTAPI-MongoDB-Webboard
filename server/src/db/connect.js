const mongoose = require('mongoose')
require('dotenv').config()

const db = process.env.mongoURI

const connectDB = async () =>{
    try {
        await mongoose.connect(db,{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('Connect database...')
        console.log('!!!!!!!!!!!!!!!!!!!!')
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}

module.exports = connectDB