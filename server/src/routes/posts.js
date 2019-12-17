const express = require('express')
const Post = require('../model/posts')
const auth = require('../middleware/auth')
const router = express.Router()
const { check, validationResult } = require('express-validator/check');


router.post('/posts' ,auth ,[
    check('title', 'กรุณากรอกหัวข้อ').not().isEmpty(),
    check('content', 'กรุณากรอกเนื้อหา').not().isEmpty()
] ,async (req, res) =>{
    
    const error = validationResult(req)
    if(!error.isEmpty()){
        return res.status(400).json({ errors: error.array() })
    }

    const { title, content } = req.body
    const post = new Post({
        title,
        content,
        username: req.user.username
    })

    try {
        await post.save()
        res.status(201).send(post)
    } catch (error) {
        res.status(400).send(error)
    }

})

router.get('/posts', async (req, res) =>{
    try {
        const posts = await Post.find().sort({ create_at: -1 })
        res.json(posts)
    } catch (error) {
        res.status(500).send(error)   
    }
})

router.get('/posts/:id', async(req, res) =>{
    try {
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(400).json({ msg: 'ไม่มีโพสต์นี้อยู่' })
        }
        res.json(post)
    } catch (error) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
          return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
})

router.delete('/posts/:id',auth , async(req, res) =>{
    try {
        const post = await Post.findById(req.params.id)

        if(!post){
            return res.status(400).json({ msg: 'ไม่มีโพสต์นี้อยู่' })
        }

        if(post.username.toString() !== req.user.username){
            return res.status(401).json({ msg: 'ไม่มีสิทธิ์ลบโพสต์นี้' });
        }

        await post.remove();

        res.json({ msg: 'ลบ เรียบร้อย' });

    } catch (error) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
          return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
})

router.patch('/posts/:id', [ check('content', 'กรุณากรอกเนื้อหา').not().isEmpty() ], auth, async (req,res) =>{
        
        const error = validationResult(req)
            if(!error.isEmpty()){
                return res.status(400).json({ errors: error.array() })
            }

        try {
            const post = await Post.findById(req.params.id)

            if(!post){
                return res.status(400).json({ msg: 'ไม่มีโพสต์นี้อยู่' })
            }
    
            if(post.username.toString() !== req.user.username){
                return res.status(401).json({ msg: 'ไม่มีสิทธิ์แก้ไขโพสต์นี้' });
            }
            
            await Post.findByIdAndUpdate(req.params.id, { 'content': req.body.content });

            res.json({ msg: 'แก้ไขเรียบร้อย' });


        } catch (error) {
            console.error(err.message);
        if (err.kind === 'ObjectId') {
          return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
        }
})

module.exports = router