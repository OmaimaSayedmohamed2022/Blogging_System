const express = require('express')
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController')

router.post('/userSubscribeAuthor', subscriptionController. userSubscribeAuthor)
router.delete('/userUnSubscribeAuthor', subscriptionController.userUnSubscribeAuthor)
router.get('/getAllSubscribedAuthors',subscriptionController.getAllSubscribedAuthors)


module.exports= router