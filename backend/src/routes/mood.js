const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const MoodController = require('../controllers/moodController');

router.use(authMiddleware);
router.get('/', MoodController.listForUser);
router.post('/', MoodController.create);
// therapist-only
router.get('/client/:clientId', roleMiddleware('therapist'), MoodController.listForClient);

module.exports = router;
