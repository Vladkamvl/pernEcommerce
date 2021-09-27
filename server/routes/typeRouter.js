const Router = require('express');
const router = Router();
const typeController = require('../controllers/typeController');
const checkRole = require('../middleware/CheckRoleMiddleware');

router.post('/', checkRole('ADMIN'), typeController.create);
router.get('/', typeController.getAll);

module.exports = router;