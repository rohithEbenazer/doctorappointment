import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { appointmentService } from '../services/appointmentService';
import { StatusBadge } from '../components/StatusBadge';
import { Calendar, Clock, MapPin, XCircle, FileText, CheckCircle2, User, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PatientDashboardPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getMyAppointments();
      setAppointments(res.data || []);
    } catch (err) {
      showToast(err.message || 'Failed to fetch appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (aptId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment slot?')) return;

    try {
      await appointmentService.cancelAppointment(aptId);
      showToast('Appointment cancelled successfully.', 'success');
      fetchAppointments();
    } catch (err) {
      showToast(err.message || 'Failed to cancel appointment', 'error');
    }
  };

  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '40px' }}>
          <AlertCircle size={48} color="#0d9488" style={{ marginBottom: '16px' }} />
          <h2>Patient Authentication Required</h2>
          <p style={{ color: '#64748b', margin: '16px 0 24px' }}>Please log in to view your booked medical appointments.</p>
          <Link to="/login" className="btn btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  // Filter Appointments by status tab
  const filteredAppointments = appointments.filter(a => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'UPCOMING') return a.status === 'CONFIRMED' || a.status === 'PENDING';
    return a.status === activeTab;
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px' }}>
      {/* Patient Header Banner */}
      <div className="card" style={{
        padding: '32px',
        background: 'linear-gradient(135deg, #0d9488, #0f766e)',
        color: '#ffffff',
        marginBottom: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '20px'
      }}>
        <div>
          <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.9 }}>
            Patient Portal
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome back, {user.name}</h1>
          <p style={{ opacity: 0.9, fontSize: '0.95rem', marginTop: '4px' }}>{user.email} • {user.phone || 'Patient Account'}</p>
        </div>
        <Link to="/doctors" className="btn btn-secondary" style={{ background: '#ffffff', color: '#0d9488', fontWeight: 700 }}>
          + Book New Appointment
        </Link>
      </div>

      {/* Main Appointments List */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>My Booked Appointments</h2>

        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'ALL', label: 'All' },
            { id: 'UPCOMING', label: 'Upcoming' },
            { id: 'COMPLETED', label: 'Completed' },
            { id: 'CANCELLED', label: 'Cancelled' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: 'none',
                background: activeTab === t.id ? '#0d9488' : '#f1f5f9',
                color: activeTab === t.id ? '#ffffff' : '#475569',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer'
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading appointments...</div>
      ) : filteredAppointments.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center', background: '#ffffff' }}>
          <Calendar size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            No appointments found for "{activeTab.toLowerCase()}"
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px' }}>
            Browse our list of board-certified specialists and schedule your consultation today.
          </p>
          <Link to="/doctors" className="btn btn-primary">
            Find a Doctor
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredAppointments.map((apt) => (
            <div key={apt._id} className="card" style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '280px' }}>
                <Link to={`/doctors/${apt.doctorId}`}>
                  <img
                    src={apt.doctorAvatar || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop'}
                    alt={apt.doctorName}
                    style={{ width: '60px', height: '60px', borderRadius: '14px', objectFit: 'cover' }}
                  />
                </Link>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Link to={`/doctors/${apt.doctorId}`} style={{ textDecoration: 'none' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{apt.doctorName}</h3>
                    </Link>
                    <StatusBadge status={apt.status} />
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: 600 }}>{apt.specialtyName}</div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                    <MapPin size={14} />
                    <span>{apt.clinicLocation}</span>
                  </div>
                </div>
              </div>

              {/* Date & Slot Info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.9rem', color: '#334155' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} color="#0d9488" />
                  <span style={{ fontWeight: 700 }}>Date: {apt.appointmentDate}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} color="#0d9488" />
                  <span style={{ fontWeight: 600 }}>Time: {apt.timeSlot}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Fee: <strong style={{ color: '#0f172a' }}>${apt.fee}</strong> ({apt.paymentStatus})
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => setSelectedAppointment(apt)}
                  className="btn btn-secondary btn-sm"
                >
                  <FileText size={16} />
                  <span>View Details</span>
                </button>

                {['PENDING', 'CONFIRMED'].includes(apt.status) && (
                  <button
                    onClick={() => handleCancel(apt._id)}
                    className="btn btn-danger btn-sm"
                  >
                    <XCircle size={16} />
                    <span>Cancel</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="modal-overlay" onClick={() => setSelectedAppointment(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Appointment Summary</h3>
              <StatusBadge status={selectedAppointment.status} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem' }}>
              <div>
                <strong style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Doctor</strong>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>{selectedAppointment.doctorName}</div>
                <div style={{ color: '#0d9488', fontSize: '0.85rem' }}>{selectedAppointment.specialtyName}</div>
              </div>

              <div>
                <strong style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Date & Slot</strong>
                <div style={{ fontWeight: 600 }}>{selectedAppointment.appointmentDate} at {selectedAppointment.timeSlot}</div>
              </div>

              <div>
                <strong style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Symptoms / Reason</strong>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', marginTop: '4px', fontSize: '0.9rem' }}>
                  {selectedAppointment.reason || 'No specific symptoms noted.'}
                </div>
              </div>

              {selectedAppointment.doctorNotes && (
                <div>
                  <strong style={{ color: '#0d9488', fontSize: '0.8rem', textTransform: 'uppercase' }}>Doctor Consultation Notes</strong>
                  <div style={{ background: '#f0fdfa', border: '1px solid #ccfbf1', padding: '12px', borderRadius: '8px', marginTop: '4px', fontSize: '0.9rem', color: '#0f766e' }}>
                    {selectedAppointment.doctorNotes}
                  </div>
                </div>
              )}
            </div>

            <button onClick={() => setSelectedAppointment(null)} className="btn btn-secondary" style={{ width: '100%', marginTop: '28px' }}>
              Close Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
