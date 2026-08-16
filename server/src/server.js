const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const specialtyRoutes = require('./routes/specialtyRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

const { authenticateUser, authorizeRoles } = require('./middleware/auth');
const appointmentController = require('./controllers/appointmentController');

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/specialties', specialtyRoutes);
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/admin', adminRoutes);

// Doctor Portal API Aliases (Section 10 Spec)
const doctorApptRouter = express.Router();
doctorApptRouter.use(authenticateUser, authorizeRoles('DOCTOR', 'ADMIN', 'SUPER_ADMIN'));
doctorApptRouter.get('/appointments', appointmentController.getDoctorAppointments);
doctorApptRouter.patch('/appointments/:id/status', appointmentController.updateAppointmentStatus);
app.use('/api/v1/doctor', doctorApptRouter);

// Health Check
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Doctor Appointment API Server is operational',
    timestamp: new Date().toISOString()
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Requested API endpoint not found',
    error: 'NOT_FOUND'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: err.code || 'SERVER_ERROR'
  });
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`  Doctor Appointment API Server running on port ${PORT}`);
  console.log(`  Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`=================================================`);
});
