const express = require('express')
const connectDB = require('./db/connect')
require('dotenv').config()

const userRouter = require('./routes/users')
const postRouter = require('./routes/posts')

connectDB()

const app = express()

app.use(express.json({ extened: false }))

app.get('/', (req , res) =>{
    res.send('API running Working')
})

app.use('/api/users' ,userRouter)
app.use('/api/posts' ,postRouter)

const PORT = process.env.PORT || 1354

app.listen(PORT , () =>{
    console.log(`Server running on ${PORT}`)
})