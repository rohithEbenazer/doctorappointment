const db = require('../config/db');

exports.getSpecialties = (req, res) => {
  try {
    const activeSpecialties = db.specialties.filter(s => s.isActive);
    return res.status(200).json({
      success: true,
      message: 'Specialties retrieved successfully',
      data: activeSpecialties
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve specialties',
      error: error.message
    });
  }
};

exports.getSpecialtyById = (req, res) => {
  try {
    const { id } = req.params;
    const specialty = db.specialties.find(s => s._id === id || s.slug === id);

    if (!specialty) {
      return res.status(404).json({
        success: false,
        message: 'Specialty not found',
        error: 'SPECIALTY_NOT_FOUND'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Specialty details fetched',
      data: specialty
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch specialty',
      error: error.message
    });
  }
};

exports.createSpecialty = (req, res) => {
  try {
    const { name, description, icon } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Specialty name is required.',
        error: 'VALIDATION_ERROR'
      });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const existing = db.specialties.find(s => s.slug === slug || s.name.toLowerCase() === name.toLowerCase().trim());
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'A specialty with this name already exists.',
        error: 'DUPLICATE_SPECIALTY'
      });
    }

    const newSpecialty = {
      _id: `spec_${Date.now()}`,
      name: name.trim(),
      slug,
      description: description ? description.trim() : '',
      icon: icon || 'Stethoscope',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    db.specialties.push(newSpecialty);

    return res.status(201).json({
      success: true,
      message: 'Specialty created successfully',
      data: newSpecialty
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create specialty',
      error: error.message
    });
  }
};

exports.updateSpecialty = (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, isActive } = req.body;

    const specialtyIndex = db.specialties.findIndex(s => s._id === id);
    if (specialtyIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Specialty not found',
        error: 'SPECIALTY_NOT_FOUND'
      });
    }

    const existing = db.specialties[specialtyIndex];
    let updatedSlug = existing.slug;

    if (name && name.trim() !== existing.name) {
      updatedSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const duplicate = db.specialties.find(s => s._id !== id && (s.slug === updatedSlug || s.name.toLowerCase() === name.trim().toLowerCase()));
      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'Another specialty with this name already exists.',
          error: 'DUPLICATE_SPECIALTY'
        });
      }
    }

    const updatedSpecialty = {
      ...existing,
      name: name ? name.trim() : existing.name,
      slug: updatedSlug,
      description: description !== undefined ? description.trim() : existing.description,
      icon: icon || existing.icon,
      isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
      updatedAt: new Date().toISOString()
    };

    db.specialties[specialtyIndex] = updatedSpecialty;

    return res.status(200).json({
      success: true,
      message: 'Specialty updated successfully',
      data: updatedSpecialty
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update specialty',
      error: error.message
    });
  }
};

exports.deleteSpecialty = (req, res) => {
  try {
    const { id } = req.params;
    const specialtyIndex = db.specialties.findIndex(s => s._id === id || s.slug === id);

    if (specialtyIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Specialty not found',
        error: 'SPECIALTY_NOT_FOUND'
      });
    }

    const specId = db.specialties[specialtyIndex]._id;
    const activeDoctorCount = db.doctors.filter(d => d.specialtyId === specId && d.isActive).length;

    if (activeDoctorCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot deactivate specialty because ${activeDoctorCount} active physician(s) are currently assigned to it. Please reassign physicians first.`,
        error: 'SPECIALTY_IN_USE'
      });
    }

    // Soft deactivate instead of hard delete to protect existing references
    db.specialties[specialtyIndex].isActive = false;
    db.specialties[specialtyIndex].updatedAt = new Date().toISOString();

    return res.status(200).json({
      success: true,
      message: 'Specialty deactivated successfully',
      data: db.specialties[specialtyIndex]
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete specialty',
      error: error.message
    });
  }
};
