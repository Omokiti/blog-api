const express = require('express')
const passport = require('passport')
const { createPost, getAllPosts,getUserPosts,editPost,updatePost,deletePost,updateState,getSinglePost } = require('../controllers/blog');
const  blogRoute= express.Router()

blogRoute.post('/create', passport.authenticate('jwt', { session: false }),
createPost );


blogRoute.get('/posts', getAllPosts)

blogRoute.get('/userposts',passport.authenticate('jwt', { session: false }),getUserPosts)

blogRoute.get('/userposts/:id',passport.authenticate('jwt', { session: false }),getSinglePost)

blogRoute.get('/userposts/:id/edit',passport.authenticate('jwt', { session: false }),editPost)

blogRoute.put('/userposts/:id',passport.authenticate('jwt', { session: false }), updatePost)

blogRoute.delete('/userposts/:id',passport.authenticate('jwt', { session: false }), deletePost)

blogRoute.put('/userposts/:id/publish',passport.authenticate('jwt', { session: false }),updateState )

module.exports= blogRoute;