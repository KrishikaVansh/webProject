const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const AppController = require('../controllers/appointmentsController');

router.use(authMiddleware);
router.get('/', AppController.listForUser);
router.post('/', AppController.create);
router.delete('/:id', AppController.cancel);

module.exports = router;
