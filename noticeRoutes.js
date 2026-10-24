const express = require('express');
const router = express.Router();
const { 
    getNoticesByCategory, 
    createNotice, 
    deleteNotice 
} = require('../controllers/noticeController');

router.get('/:category', getNoticesByCategory);
router.post('/create', createNotice);
router.delete('/:id', deleteNotice);

module.exports = router;
