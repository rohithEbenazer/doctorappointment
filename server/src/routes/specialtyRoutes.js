const express = require('express');
const router = express.Router();
const specialtyController = require('../controllers/specialtyController');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');

// Public routes
router.get('/', specialtyController.getSpecialties);
router.get('/:id', specialtyController.getSpecialtyById);

// Admin restricted routes
router.post('/', authenticateUser, authorizeRoles('ADMIN', 'SUPER_ADMIN'), specialtyController.createSpecialty);
router.patch('/:id', authenticateUser, authorizeRoles('ADMIN', 'SUPER_ADMIN'), specialtyController.updateSpecialty);
router.delete('/:id', authenticateUser, authorizeRoles('ADMIN', 'SUPER_ADMIN'), specialtyController.deleteSpecialty);

module.exports = router;
