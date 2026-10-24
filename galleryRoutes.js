const express = require('express');
const router = express.Router();
const { 
    getGalleryByCategory, 
    uploadImage, 
    deleteImage 
} = require('../controllers/galleryController');
const upload = require('../middleware/upload');

router.get('/:category', getGalleryByCategory);
router.post('/upload', upload.single('image'), uploadImage);
router.delete('/:id', deleteImage);

module.exports = router;
