const express = require('express');
const router = express.Router();
const { 
    getAdmissions, 
    submitAdmission, 
    deleteAdmission 
} = require('../controllers/admissionController');

router.get('/', getAdmissions);
router.post('/', submitAdmission);
router.delete('/:id', deleteAdmission);

module.exports = router;
