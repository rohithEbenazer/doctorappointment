const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const doctorController = require('../controllers/doctorController');
const specialtyController = require('../controllers/specialtyController');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');

router.use(authenticateUser, authorizeRoles('ADMIN', 'SUPER_ADMIN'));

router.get('/stats', adminController.getAdminStats);

// Admin Doctor Management APIs
router.post('/doctors', doctorController.createDoctor);
router.patch('/doctors/:id', doctorController.updateDoctor);
router.delete('/doctors/:id', doctorController.deleteDoctor);

// Admin Specialty Management APIs
router.post('/specialties', specialtyController.createSpecialty);
router.patch('/specialties/:id', specialtyController.updateSpecialty);
router.delete('/specialties/:id', specialtyController.deleteSpecialty);

module.exports = router;
