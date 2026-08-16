import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { adminService } from '../services/adminService';
import { doctorService } from '../services/doctorService';
import { specialtyService } from '../services/specialtyService';
import { Shield, Users, Stethoscope, DollarSign, Calendar, Plus, Trash2, Edit, AlertCircle, X, Check, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboardPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showAddSpecialtyModal, setShowAddSpecialtyModal] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState(null);

  // Form States
  const [docForm, setDocForm] = useState({
    name: '',
    specialtyId: '',
    qualification: '',
    experienceYears: 5,
    consultationFee: 150,
    bio: '',
    clinicLocation: 'Outpatient Care Wing, Suite 101'
  });

  const [specForm, setSpecForm] = useState({
    name: '',
    description: '',
    icon: 'Stethoscope'
  });

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, docRes, specRes] = await Promise.all([
        adminService.getStats(),
        doctorService.getDoctors({ limit: 50 }),
        specialtyService.getSpecialties()
      ]);

      setStats(statsRes.data);
      setDoctors(docRes.data || []);
      setSpecialties(specRes.data || []);
    } catch (err) {
      showToast(err.message || 'Failed to load admin metrics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDoctor = async (e) => {
    e.preventDefault();
    if (!docForm.name || !docForm.specialtyId || !docForm.qualification) {
      showToast('Doctor name, specialty, and qualification are required.', 'error');
      return;
    }

    try {
      await adminService.createDoctor(docForm);
      showToast(`Doctor ${docForm.name} created successfully!`, 'success');
      setShowAddDoctorModal(false);
      setDocForm({
        name: '',
        specialtyId: '',
        qualification: '',
        experienceYears: 5,
        consultationFee: 150,
        bio: '',
        clinicLocation: 'Outpatient Care Wing, Suite 101'
      });
      fetchAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to create doctor profile', 'error');
    }
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    if (!editingDoctor) return;

    try {
      await adminService.updateDoctor(editingDoctor._id, docForm);
      showToast(`Doctor ${docForm.name} profile updated!`, 'success');
      setEditingDoctor(null);
      fetchAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to update doctor profile', 'error');
    }
  };

  const handleDeactivateDoctor = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this doctor profile?')) return;

    try {
      await adminService.deleteDoctor(id);
      showToast('Doctor profile deactivated.', 'success');
      fetchAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to deactivate doctor', 'error');
    }
  };

  const openEditDoctor = (doc) => {
    setEditingDoctor(doc);
    setDocForm({
      name: doc.name || '',
      specialtyId: doc.specialtyId || '',
      qualification: doc.qualification || '',
      experienceYears: doc.experienceYears || 0,
      consultationFee: doc.consultationFee || 0,
      bio: doc.bio || '',
      clinicLocation: doc.clinicLocation || ''
    });
  };

  const handleCreateSpecialty = async (e) => {
    e.preventDefault();
    if (!specForm.name) {
      showToast('Specialty name is required.', 'error');
      return;
    }

    try {
      await adminService.createSpecialty(specForm);
      showToast(`Specialty ${specForm.name} created!`, 'success');
      setShowAddSpecialtyModal(false);
      setSpecForm({ name: '', description: '', icon: 'Stethoscope' });
      fetchAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to create specialty', 'error');
    }
  };

  const handleUpdateSpecialty = async (e) => {
    e.preventDefault();
    if (!editingSpecialty) return;

    try {
      await adminService.updateSpecialty(editingSpecialty._id, specForm);
      showToast(`Specialty ${specForm.name} updated!`, 'success');
      setEditingSpecialty(null);
      fetchAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to update specialty', 'error');
    }
  };

  const handleDeactivateSpecialty = async (id) => {
    if (!window.confirm('Are you sure you want to deactivate this department specialty?')) return;

    try {
      await adminService.deleteSpecialty(id);
      showToast('Specialty deactivated successfully.', 'success');
      fetchAdminData();
    } catch (err) {
      showToast(err.message || 'Failed to deactivate specialty', 'error');
    }
  };

  const openEditSpecialty = (spec) => {
    setEditingSpecialty(spec);
    setSpecForm({
      name: spec.name || '',
      description: spec.description || '',
      icon: spec.icon || 'Stethoscope'
    });
  };

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '40px' }}>
          <Shield size={48} color="#dc2626" style={{ marginBottom: '16px' }} />
          <h2>Admin Authorization Required</h2>
          <p style={{ color: '#64748b', margin: '16px 0 24px' }}>
            You do not have permission to access the Hospital System Administration portal.
          </p>
          <Link to="/login" className="btn btn-primary">Login as Admin</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px' }}>
      {/* Header Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>Hospital Admin Portal</h1>
          <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '4px' }}>
            Manage doctor directory, medical specialties, and system metrics.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => {
            setSpecForm({ name: '', description: '', icon: 'Stethoscope' });
            setShowAddSpecialtyModal(true);
          }} className="btn btn-secondary">
            + New Specialty
          </button>
          <button onClick={() => {
            setDocForm({
              name: '',
              specialtyId: specialties[0]?._id || '',
              qualification: '',
              experienceYears: 5,
              consultationFee: 150,
              bio: '',
              clinicLocation: 'Outpatient Care Wing, Suite 101'
            });
            setShowAddDoctorModal(true);
          }} className="btn btn-primary">
            + Add Doctor Profile
          </button>
        </div>
      </div>

      {/* Metrics Counter Cards */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#0d9488', marginBottom: '8px' }}>
              <Stethoscope size={24} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Active Doctors</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{stats.totalDoctors}</div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#0284c7', marginBottom: '8px' }}>
              <Calendar size={24} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Appointments Today</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{stats.todayAppointments}</div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#16a34a', marginBottom: '8px' }}>
              <Users size={24} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Registered Patients</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{stats.totalPatients}</div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#6366f1', marginBottom: '8px' }}>
              <DollarSign size={24} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Total Revenue</span>
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>${stats.totalRevenue}</div>
          </div>
        </div>
      )}

      {/* Doctor Directory Table */}
      <div className="card" style={{ padding: '28px', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>
          Doctor Directory & Management
        </h2>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>Doctor Name</th>
                <th style={{ padding: '12px' }}>Specialty</th>
                <th style={{ padding: '12px' }}>Qualification</th>
                <th style={{ padding: '12px' }}>Fee</th>
                <th style={{ padding: '12px' }}>Rating</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map(doc => (
                <tr key={doc._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 700, color: '#0f172a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={doc.avatar} alt={doc.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                      <span>{doc.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 12px', color: '#0d9488', fontWeight: 600 }}>{doc.specialtyName}</td>
                  <td style={{ padding: '14px 12px', color: '#64748b' }}>{doc.qualification}</td>
                  <td style={{ padding: '14px 12px', fontWeight: 700 }}>${doc.consultationFee}</td>
                  <td style={{ padding: '14px 12px' }}>{doc.rating ? doc.rating.toFixed(1) : '5.0'} ★</td>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEditDoctor(doc)} className="btn btn-outline btn-sm">
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      <button onClick={() => handleDeactivateDoctor(doc._id)} className="btn btn-danger btn-sm">
                        <Trash2 size={14} />
                        <span>Deactivate</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Specialty Management Table */}
      <div className="card" style={{ padding: '28px', marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Medical Specialties & Departments
          </h2>
          <button onClick={() => {
            setSpecForm({ name: '', description: '', icon: 'Stethoscope' });
            setShowAddSpecialtyModal(true);
          }} className="btn btn-secondary btn-sm">
            + Add Specialty
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', textAlign: 'left', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>Specialty Name</th>
                <th style={{ padding: '12px' }}>Slug</th>
                <th style={{ padding: '12px' }}>Description</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {specialties.map(spec => (
                <tr key={spec._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 12px', fontWeight: 700, color: '#0f172a' }}>
                    {spec.name}
                  </td>
                  <td style={{ padding: '14px 12px', color: '#64748b', fontSize: '0.85rem' }}>{spec.slug}</td>
                  <td style={{ padding: '14px 12px', color: '#475569', maxWidth: '300px' }}>{spec.description}</td>
                  <td style={{ padding: '14px 12px' }}>
                    <span className={spec.isActive ? 'badge badge-success' : 'badge badge-danger'}>
                      {spec.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => openEditSpecialty(spec)} className="btn btn-outline btn-sm">
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      {spec.isActive && (
                        <button onClick={() => handleDeactivateSpecialty(spec._id)} className="btn btn-danger btn-sm">
                          <XCircle size={14} />
                          <span>Deactivate</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Doctor Modal */}
      {(showAddDoctorModal || editingDoctor) && (
        <div className="modal-overlay" onClick={() => { setShowAddDoctorModal(false); setEditingDoctor(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editingDoctor ? `Edit ${editingDoctor.name}` : 'Add New Doctor Profile'}
              </h3>
              <button onClick={() => { setShowAddDoctorModal(false); setEditingDoctor(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={editingDoctor ? handleUpdateDoctor : handleCreateDoctor}>
              <div className="form-group">
                <label className="form-label">Doctor Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Dr. Alexander Vance"
                  value={docForm.name}
                  onChange={(e) => setDocForm({ ...docForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Medical Specialty *</label>
                <select
                  className="form-select"
                  value={docForm.specialtyId}
                  onChange={(e) => setDocForm({ ...docForm, specialtyId: e.target.value })}
                  required
                >
                  <option value="">Select Specialty</option>
                  {specialties.map(s => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Qualifications & Credentials *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. MD, FACC - Senior Cardiologist"
                  value={docForm.qualification}
                  onChange={(e) => setDocForm({ ...docForm, qualification: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Experience (Years)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={docForm.experienceYears}
                    onChange={(e) => setDocForm({ ...docForm, experienceYears: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Consultation Fee ($) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={docForm.consultationFee}
                    onChange={(e) => setDocForm({ ...docForm, consultationFee: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Clinic Location / Wing</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Heart Care Wing, Floor 3, Suite 302"
                  value={docForm.clinicLocation}
                  onChange={(e) => setDocForm({ ...docForm, clinicLocation: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Biography</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Clinical experience bio..."
                  value={docForm.bio}
                  onChange={(e) => setDocForm({ ...docForm, bio: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => { setShowAddDoctorModal(false); setEditingDoctor(null); }} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  {editingDoctor ? 'Save Changes' : 'Create Doctor Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Specialty Modal */}
      {(showAddSpecialtyModal || editingSpecialty) && (
        <div className="modal-overlay" onClick={() => { setShowAddSpecialtyModal(false); setEditingSpecialty(null); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editingSpecialty ? `Edit Specialty: ${editingSpecialty.name}` : 'Create Specialty / Department'}
              </h3>
              <button onClick={() => { setShowAddSpecialtyModal(false); setEditingSpecialty(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <form onSubmit={editingSpecialty ? handleUpdateSpecialty : handleCreateSpecialty}>
              <div className="form-group">
                <label className="form-label">Department Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ophthalmology"
                  value={specForm.name}
                  onChange={(e) => setSpecForm({ ...specForm, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Department scope & clinical care..."
                  value={specForm.description}
                  onChange={(e) => setSpecForm({ ...specForm, description: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" onClick={() => { setShowAddSpecialtyModal(false); setEditingSpecialty(null); }} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  {editingSpecialty ? 'Save Specialty' : 'Create Department'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
