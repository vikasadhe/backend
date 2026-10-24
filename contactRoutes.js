const express = require('express');
const router = express.Router();
const { 
    getContacts, 
    submitContact, 
    deleteContact 
} = require('../controllers/contactController');

router.get('/', getContacts);
router.post('/', submitContact);
router.delete('/:id', deleteContact);

module.exports = router;
