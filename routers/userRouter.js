const userControlller= require('../controllers/userController')
const express = require('express')
const router = express.Router()

router.post('/createUser',userControlller.createNewUser)
router.patch('/updateUser',userControlller.updateUser)
router.get('/getAllUser',userControlller.getAllUsers)
router.delete('/deleteUser',userControlller.deleteUser)
//login
router.post('/loginUser', userControlller.loginUser)



module.exports = router;