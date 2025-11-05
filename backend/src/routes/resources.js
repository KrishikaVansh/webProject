const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const ResourceController = require('../controllers/resourcesController');

router.get('/', ResourceController.list);
router.get('/:id', ResourceController.get);
router.use(authMiddleware);
// only therapists (or admin) can create/update/delete
router.post('/', roleMiddleware('therapist'), ResourceController.create);
router.put('/:id', roleMiddleware('therapist'), ResourceController.update);
router.delete('/:id', roleMiddleware('therapist'), ResourceController.remove);

module.exports = router;
