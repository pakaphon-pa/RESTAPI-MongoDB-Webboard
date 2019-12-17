const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true,
        trim: true
    },
    content:{
        type: String,
        require: true,
        trim: true
    },
    username:{
        type: String,
        require: true
    },
    create_at:{
        type: Date,
        default: Date.now
    },
    edit_at:{
        type: Date,
        default: Date.now
    }
})

module.exports = Post = mongoose.model('post', PostSchema)