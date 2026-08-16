const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { authenticateUser, authorizeRoles } = require('../middleware/auth');

// Patient routes
router.post('/', authenticateUser, appointmentController.createAppointment);
router.get('/my', authenticateUser, appointmentController.getMyAppointments);
router.patch('/:id/cancel', authenticateUser, appointmentController.cancelAppointment);

// Doctor & Admin routes
router.get('/doctor/queue', authenticateUser, authorizeRoles('DOCTOR', 'ADMIN', 'SUPER_ADMIN'), appointmentController.getDoctorAppointments);
router.patch('/:id/status', authenticateUser, authorizeRoles('DOCTOR', 'ADMIN', 'SUPER_ADMIN'), appointmentController.updateAppointmentStatus);

module.exports = router;
