const Router = require('express');
const router = Router();
const brandController = require('../controllers/brandController');
const checkRole = require('../middleware/CheckRoleMiddleware');

router.post('/', checkRole('ADMIN'), brandController.create);
router.get('/', brandController.getAll);

module.exports = router;