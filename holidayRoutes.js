const express = require('express');
const router = express.Router();
const { getAllHolidays, createHoliday, updateHoliday, deleteHoliday } = require('../controllers/holidayController');

router.get('/', getAllHolidays);
router.post('/create', createHoliday);
router.put('/:id', updateHoliday);
router.delete('/:id', deleteHoliday);

module.exports = router;
