const express = require('express');
const router = express.Router();
const upload = require("../middleware/multer"); 
const uploadIamgeController = require("../controllers/uploadImageController");

router.post('/upload', upload.single('images'), uploadIamgeController.uploadImage);

module.exports = router;
