const db = require('../config/db');

exports.getAdminStats = (req, res) => {
  try {
    const totalDoctors = db.doctors.filter(d => d.isActive).length;
    const totalSpecialties = db.specialties.filter(s => s.isActive).length;
    const totalPatients = db.users.filter(u => u.role === 'PATIENT').length;
    const totalAppointments = db.appointments.length;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayAppointments = db.appointments.filter(a => a.appointmentDate === todayStr).length;

    const totalRevenue = db.appointments
      .filter(a => a.status === 'COMPLETED' || a.paymentStatus === 'PAID')
      .reduce((sum, a) => sum + (a.fee || 0), 0);

    return res.status(200).json({
      success: true,
      message: 'Admin metrics retrieved',
      data: {
        totalDoctors,
        totalSpecialties,
        totalPatients,
        totalAppointments,
        todayAppointments,
        totalRevenue
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve admin stats',
      error: error.message
    });
  }
};
