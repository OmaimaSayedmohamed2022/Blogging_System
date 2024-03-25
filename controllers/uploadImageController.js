// const Post = require('../models/postModel');
const fs = require('fs');
const path = require('path');


const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const imagePath = path.join(__dirname, '..', req.file.path)

        if (!fs.existsSync(imagePath)) 
        {
            return res.status(404).json({ message: "Uploaded file not found" });
        }
     console.log("imagepath:",imagePath)

    return res.status(200).json({ message: "Uploaded image successfully", imageUrl: imagePath});
    }catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error uploading image" });
    }
};

module.exports = {
    uploadImage,
}