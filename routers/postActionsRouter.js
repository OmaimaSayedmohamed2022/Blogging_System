const express = require('express')
const router = express.Router()
const postActionController = require('../controllers/postActionsController')
const {userAuthentication,postAuthentication,authorAuthentication,commentAuthentication} = require('../middleware/Authentication')

// post actions
router.post('/createAction',userAuthentication,postActionController.createAction)
router.delete('/deleteAction',userAuthentication , postActionController.deleteAction)

// comment actions
router.post('/createComment',userAuthentication, postActionController.createComment)
router.delete('/deleteComment', commentAuthentication, postActionController.deleteComment)
router.post('/likeComment', commentAuthentication, postActionController.likeComment)
router.patch('/hideComment', postActionController.hideComment)
router.post('/replyOnComment',postActionController.replyOnComment)
router.get("/getCommentReplies",postActionController.getCommentReplies)

module.exports= router