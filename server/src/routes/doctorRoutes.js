const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');

// Public routes
router.get('/', doctorController.getDoctors);
router.get('/slug/:slug', doctorController.getDoctorBySlug);
router.get('/:id', doctorController.getDoctorById);
router.get('/:id/available-slots', doctorController.getDoctorAvailableSlots);

// Admin / Doctor restricted routes
router.post('/', authenticateUser, authorizeRoles('ADMIN', 'SUPER_ADMIN'), doctorController.createDoctor);
router.patch('/:id', authenticateUser, authorizeRoles('ADMIN', 'SUPER_ADMIN', 'DOCTOR'), doctorController.updateDoctor);
router.delete('/:id', authenticateUser, authorizeRoles('ADMIN', 'SUPER_ADMIN'), doctorController.deleteDoctor);

module.exports = router;
