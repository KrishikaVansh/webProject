const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const JournalController = require('../controllers/journalController');

router.use(authMiddleware);
router.get('/', JournalController.listForUser);
router.post('/', JournalController.create);
router.get('/:id', JournalController.get);
router.put('/:id', JournalController.update);
router.delete('/:id', JournalController.remove);
// therapist access to client journals
router.get('/client/:clientId', roleMiddleware('therapist'), JournalController.listForClient);

module.exports = router;
