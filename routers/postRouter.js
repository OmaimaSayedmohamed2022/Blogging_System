const postController = require('../controllers/postController')
const express=require('express')
const router= express.Router()

//posts
router.post('/createPost',postController.createPost)
router.patch('/publishPost',postController.publishPost)
router.patch('/unpublishPost',postController.unpublishPost)
router.patch('/updatePost',postController.updatePost)
router.delete('/deletePost',postController.deletePost)
// get Authors posts
router.get('/getAuthorPosts', postController.getAuthorPosts);
//savedPosts
router.post('/savePostsForUser' ,postController.savePostsForUser)
router.get('/getSavedPostsForUser' , postController.getSavedPostsForUser)
router.delete('/removeSavedPostForUser',postController.removeSavedPostForUser)



module.exports = router