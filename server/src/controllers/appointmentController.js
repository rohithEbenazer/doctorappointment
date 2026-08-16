const db = require('../config/db');

exports.createAppointment = (req, res) => {
  try {
    const patientId = req.user._id;
    const { doctorId, appointmentDate, timeSlot, reason, patientNotes } = req.body;

    if (!doctorId || !appointmentDate || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID, appointmentDate (YYYY-MM-DD), and timeSlot are required.',
        error: 'VALIDATION_ERROR'
      });
    }

    const doctor = db.doctors.find(d => d._id === doctorId && d.isActive);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'The selected doctor profile does not exist or is inactive.',
        error: 'DOCTOR_NOT_FOUND'
      });
    }

    // Double Booking Check
    const existingBooking = db.appointments.find(
      apt => apt.doctorId === doctorId &&
             apt.appointmentDate === appointmentDate &&
             apt.timeSlot === timeSlot &&
             ['PENDING', 'CONFIRMED'].includes(apt.status)
    );

    if (existingBooking) {
      return res.status(409).json({
        success: false,
        message: 'This time slot has already been booked. Please select another slot.',
        error: 'SLOT_UNAVAILABLE'
      });
    }

    const newAppointment = {
      _id: `apt_${Date.now()}`,
      patientId,
      patientName: req.user.name,
      patientEmail: req.user.email,
      patientPhone: req.user.phone,
      doctorId: doctor._id,
      doctorName: doctor.name,
      specialtyId: doctor.specialtyId,
      appointmentDate,
      timeSlot,
      status: 'CONFIRMED', // Instant confirmation
      reason: reason ? reason.trim() : 'General consultation',
      patientNotes: patientNotes ? patientNotes.trim() : '',
      doctorNotes: '',
      fee: doctor.consultationFee,
      paymentStatus: 'PAID',
      createdAt: new Date().toISOString()
    };

    db.appointments.push(newAppointment);

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully!',
      data: newAppointment
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message
    });
  }
};

exports.getMyAppointments = (req, res) => {
  try {
    const patientId = req.user._id;
    const userAppointments = db.appointments.filter(a => a.patientId === patientId);

    // Enrich with doctor metadata
    const data = userAppointments.map(apt => {
      const doc = db.doctors.find(d => d._id === apt.doctorId);
      const spec = db.specialties.find(s => s._id === apt.specialtyId);
      return {
        ...apt,
        doctorAvatar: doc ? doc.avatar : '',
        doctorQualification: doc ? doc.qualification : '',
        clinicLocation: doc ? doc.clinicLocation : 'Main Hospital Wing',
        specialtyName: spec ? spec.name : 'General Care'
      };
    });

    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      message: 'Appointments retrieved successfully',
      data
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve appointments',
      error: error.message
    });
  }
};

exports.cancelAppointment = (req, res) => {
  try {
    const { id } = req.params;
    const patientId = req.user._id;

    const aptIndex = db.appointments.findIndex(a => a._id === id);
    if (aptIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
        error: 'APPOINTMENT_NOT_FOUND'
      });
    }

    const apt = db.appointments[aptIndex];
    if (apt.patientId !== patientId && req.user.role !== 'ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to cancel this appointment.',
        error: 'FORBIDDEN'
      });
    }

    if (apt.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Completed appointments cannot be cancelled.',
        error: 'INVALID_ACTION'
      });
    }

    db.appointments[aptIndex].status = 'CANCELLED';
    db.appointments[aptIndex].updatedAt = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: db.appointments[aptIndex]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message
    });
  }
};

exports.getDoctorAppointments = (req, res) => {
  try {
    let doctorId = req.query.doctorId;

    // If user is a Doctor, auto-map to doctor profile
    if (req.user.role === 'DOCTOR') {
      const doc = db.doctors.find(d => d.userId === req.user._id || d.email === req.user.email);
      if (doc) doctorId = doc._id;
    }

    let appointments = db.appointments;
    if (doctorId) {
      appointments = appointments.filter(a => a.doctorId === doctorId);
    }

    appointments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return res.status(200).json({
      success: true,
      message: 'Doctor appointments queue fetched',
      data: appointments
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor appointments',
      error: error.message
    });
  }
};

exports.updateAppointmentStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, doctorNotes } = req.body;

    const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        error: 'VALIDATION_ERROR'
      });
    }

    const aptIndex = db.appointments.findIndex(a => a._id === id);
    if (aptIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
        error: 'APPOINTMENT_NOT_FOUND'
      });
    }

    db.appointments[aptIndex].status = status;
    if (doctorNotes !== undefined) {
      db.appointments[aptIndex].doctorNotes = doctorNotes.trim();
    }
    db.appointments[aptIndex].updatedAt = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: `Appointment status updated to ${status}`,
      data: db.appointments[aptIndex]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update appointment status',
      error: error.message
    });
  }
};
