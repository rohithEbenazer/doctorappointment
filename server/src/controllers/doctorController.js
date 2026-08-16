const db = require('../config/db');

exports.getDoctors = (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      search = '',
      specialty = '',
      minFee,
      maxFee,
      minRating,
      sort = 'rating_desc'
    } = req.query;

    let filtered = db.doctors.filter(d => d.isActive);

    // Filter by Search (Name, qualification, bio, location)
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.qualification.toLowerCase().includes(q) ||
        d.bio.toLowerCase().includes(q) ||
        d.clinicLocation.toLowerCase().includes(q)
      );
    }

    // Filter by Specialty ID or slug
    if (specialty && specialty.trim()) {
      const spec = db.specialties.find(s => s._id === specialty || s.slug === specialty);
      const specId = spec ? spec._id : specialty;
      filtered = filtered.filter(d => d.specialtyId === specId);
    }

    // Filter by Price Range
    if (minFee !== undefined && !isNaN(Number(minFee))) {
      filtered = filtered.filter(d => d.consultationFee >= Number(minFee));
    }
    if (maxFee !== undefined && !isNaN(Number(maxFee))) {
      filtered = filtered.filter(d => d.consultationFee <= Number(maxFee));
    }

    // Filter by Rating
    if (minRating !== undefined && !isNaN(Number(minRating))) {
      filtered = filtered.filter(d => d.rating >= Number(minRating));
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sort === 'fee_asc') return a.consultationFee - b.consultationFee;
      if (sort === 'fee_desc') return b.consultationFee - a.consultationFee;
      if (sort === 'exp_desc') return b.experienceYears - a.experienceYears;
      if (sort === 'name_asc') return a.name.localeCompare(b.name);
      // Default: highest rating first
      return b.rating - a.rating;
    });

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const total = filtered.length;
    const totalPages = Math.ceil(total / limitNum) || 1;

    const startIndex = (pageNum - 1) * limitNum;
    const paginatedDoctors = filtered.slice(startIndex, startIndex + limitNum);

    // Populate specialty info in response
    const data = paginatedDoctors.map(doc => {
      const spec = db.specialties.find(s => s._id === doc.specialtyId);
      return {
        ...doc,
        specialtyName: spec ? spec.name : 'General',
        specialtyIcon: spec ? spec.icon : 'Stethoscope'
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Doctors retrieved successfully',
      data,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve doctors',
      error: error.message
    });
  }
};

exports.getDoctorById = (req, res) => {
  try {
    const { id } = req.params;
    const doctor = db.doctors.find(d => d._id === id || d.slug === id);

    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
        error: 'DOCTOR_NOT_FOUND'
      });
    }

    const spec = db.specialties.find(s => s._id === doctor.specialtyId);

    return res.status(200).json({
      success: true,
      message: 'Doctor profile fetched successfully',
      data: {
        ...doctor,
        specialtyName: spec ? spec.name : 'General Care',
        specialtyIcon: spec ? spec.icon : 'Stethoscope'
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor profile',
      error: error.message
    });
  }
};

exports.getDoctorBySlug = (req, res) => {
  try {
    const { slug } = req.params;
    const doctor = db.doctors.find(d => d.slug === slug || d._id === slug);

    if (!doctor || !doctor.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Doctor profile not found',
        error: 'DOCTOR_NOT_FOUND'
      });
    }

    const spec = db.specialties.find(s => s._id === doctor.specialtyId);

    return res.status(200).json({
      success: true,
      message: 'Doctor profile fetched by slug',
      data: {
        ...doctor,
        specialtyName: spec ? spec.name : 'General Care',
        specialtyIcon: spec ? spec.icon : 'Stethoscope'
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor profile by slug',
      error: error.message
    });
  }
};

exports.getDoctorAvailableSlots = (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.query; // YYYY-MM-DD format

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter date (YYYY-MM-DD) is required.',
        error: 'VALIDATION_ERROR'
      });
    }

    const doctor = db.doctors.find(d => d._id === id || d.slug === id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
        error: 'DOCTOR_NOT_FOUND'
      });
    }

    // Determine Day of the Week from YYYY-MM-DD without UTC timezone shift
    const [year, month, day] = date.split('-').map(Number);
    const targetDate = new Date(year, month - 1, day);
    const dayOfWeekStr = targetDate.toLocaleDateString('en-US', { weekday: 'long' });

    // Check doctor availability schedule for this day
    const daySchedule = doctor.availability.find(
      a => a.dayOfWeek.toLowerCase() === dayOfWeekStr.toLowerCase()
    );

    if (!daySchedule) {
      return res.status(200).json({
        success: true,
        message: `Doctor is not available on ${dayOfWeekStr}`,
        data: {
          doctorId: doctor._id,
          date,
          dayOfWeek: dayOfWeekStr,
          slots: []
        }
      });
    }

    // Deterministic 12-hour formatted time slot generator
    const generateSlots = (start, end, durationMinutes = 30) => {
      const slots = [];
      const [startH, startM] = start.split(':').map(Number);
      const [endH, endM] = end.split(':').map(Number);

      let currentMins = startH * 60 + startM;
      const endMins = endH * 60 + endM;

      while (currentMins < endMins) {
        const h = Math.floor(currentMins / 60);
        const m = currentMins % 60;
        const period = h >= 12 ? 'PM' : 'AM';
        const displayH = h % 12 === 0 ? 12 : h % 12;
        const hStr = displayH < 10 ? `0${displayH}` : `${displayH}`;
        const mStr = m < 10 ? `0${m}` : `${m}`;
        slots.push(`${hStr}:${mStr} ${period}`);
        currentMins += durationMinutes;
      }
      return slots;
    };

    const allSlots = generateSlots(daySchedule.startTime, daySchedule.endTime, daySchedule.slotDurationMinutes || 30);

    // Find already booked appointments for this doctor on this date
    const bookedAppointments = db.appointments.filter(
      apt => apt.doctorId === doctor._id &&
             apt.appointmentDate === date &&
             ['PENDING', 'CONFIRMED'].includes(apt.status)
    );

    const bookedTimes = new Set(bookedAppointments.map(a => a.timeSlot));

    // Filter available slots
    const availableSlots = allSlots.map(time => ({
      timeSlot: time,
      isAvailable: !bookedTimes.has(time)
    }));

    return res.status(200).json({
      success: true,
      message: 'Available time slots generated',
      data: {
        doctorId: doctor._id,
        date,
        dayOfWeek: dayOfWeekStr,
        slots: availableSlots
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate available slots',
      error: error.message
    });
  }
};

exports.createDoctor = (req, res) => {
  try {
    const {
      name,
      specialtyId,
      qualification,
      experienceYears,
      consultationFee,
      bio,
      clinicLocation,
      avatar,
      availability
    } = req.body;

    if (!name || !specialtyId || !qualification || consultationFee === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, specialtyId, qualification, and consultationFee are required.',
        error: 'VALIDATION_ERROR'
      });
    }

    const specialty = db.specialties.find(s => s._id === specialtyId);
    if (!specialty) {
      return res.status(400).json({
        success: false,
        message: 'Referenced specialtyId does not exist.',
        error: 'INVALID_SPECIALTY'
      });
    }

    // Enforce "Dr." title prefix requirement
    let docName = name.trim();
    if (!/^dr\.?\s+/i.test(docName)) {
      docName = `Dr. ${docName}`;
    }

    const slug = docName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newDocId = `doc_${Date.now()}`;

    const newDoctor = {
      _id: newDocId,
      userId: `usr_doc_${Date.now()}`,
      name: docName,
      slug,
      specialtyId,
      qualification: qualification.trim(),
      experienceYears: Math.max(0, parseInt(experienceYears, 10) || 0),
      consultationFee: Math.max(0, Number(consultationFee)),
      bio: bio ? bio.trim() : '',
      rating: 5.0,
      reviewCount: 1,
      avatar: avatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop',
      clinicLocation: clinicLocation || 'Main Medical Outpatient Wing',
      isAvailable: true,
      isActive: true,
      availability: availability || [
        { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30 },
        { dayOfWeek: 'Friday', startTime: '09:00', endTime: '17:00', slotDurationMinutes: 30 }
      ],
      createdAt: new Date().toISOString()
    };

    db.doctors.push(newDoctor);

    return res.status(201).json({
      success: true,
      message: 'Doctor profile created successfully',
      data: newDoctor
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create doctor profile',
      error: error.message
    });
  }
};

exports.updateDoctor = (req, res) => {
  try {
    const { id } = req.params;
    const docIndex = db.doctors.findIndex(d => d._id === id);

    if (docIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
        error: 'DOCTOR_NOT_FOUND'
      });
    }

    const existing = db.doctors[docIndex];

    // Ownership check for Doctor role
    if (req.user && req.user.role === 'DOCTOR' && existing.userId !== req.user._id && existing.email !== req.user.email) {
      return res.status(403).json({
        success: false,
        message: 'Doctors can only modify their own profile details.',
        error: 'FORBIDDEN'
      });
    }

    const updates = { ...req.body };

    if (updates.name && updates.name.trim()) {
      let docName = updates.name.trim();
      if (!/^dr\.?\s+/i.test(docName)) {
        docName = `Dr. ${docName}`;
      }
      updates.name = docName;
      updates.slug = docName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const updatedDoctor = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    db.doctors[docIndex] = updatedDoctor;

    return res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully',
      data: updatedDoctor
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update doctor profile',
      error: error.message
    });
  }
};

exports.deleteDoctor = (req, res) => {
  try {
    const { id } = req.params;
    const docIndex = db.doctors.findIndex(d => d._id === id);

    if (docIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
        error: 'DOCTOR_NOT_FOUND'
      });
    }

    db.doctors[docIndex].isActive = false;

    return res.status(200).json({
      success: true,
      message: 'Doctor deactivated successfully',
      data: db.doctors[docIndex]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete doctor',
      error: error.message
    });
  }
};
