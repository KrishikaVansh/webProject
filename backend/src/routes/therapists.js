const express = require('express');
const router = express.Router();
const TherapistController = require('../controllers/therapistsController');

router.get('/', TherapistController.list);
router.get('/:id/availability', TherapistController.availability);

module.exports = router;
