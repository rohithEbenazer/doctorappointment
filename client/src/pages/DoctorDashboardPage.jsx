import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { appointmentService } from '../services/appointmentService';
import { doctorService } from '../services/doctorService';
import { StatusBadge } from '../components/StatusBadge';
import { UserCheck, CheckCircle2, Clock, XCircle, FileText, User, Calendar, Edit3, DollarSign, Filter, ChevronRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DoctorDashboardPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingApt, setEditingApt] = useState(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await appointmentService.getDoctorAppointments();
      setQueue(res.data || []);
    } catch (err) {
      showToast(err.message || 'Failed to fetch doctor consultation queue', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (aptId, newStatus) => {
    try {
      await appointmentService.updateStatus(aptId, { status: newStatus });
      showToast(`Appointment status updated to ${newStatus}`, 'success');
      fetchQueue();
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    }
  };

  const handleSaveNotes = async (e) => {
    e.preventDefault();
    if (!editingApt) return;

    try {
      await appointmentService.updateStatus(editingApt._id, {
        status: editingApt.status,
        doctorNotes
      });
      showToast('Doctor consultation notes saved.', 'success');
      setEditingApt(null);
      fetchQueue();
    } catch (err) {
      showToast(err.message || 'Failed to save notes', 'error');
    }
  };

  if (!user || (user.role !== 'DOCTOR' && user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '40px' }}>
          <UserCheck size={48} color="#0d9488" style={{ marginBottom: '16px' }} />
          <h2>Doctor / Staff Access Restricted</h2>
          <p style={{ color: '#64748b', margin: '16px 0 24px' }}>
            You must be logged in with a Doctor or Admin account to access patient queue management.
          </p>
          <Link to="/login" className="btn btn-primary">Login as Doctor / Admin</Link>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const completedCount = queue.filter(a => a.status === 'COMPLETED').length;
  const pendingCount = queue.filter(a => a.status === 'PENDING').length;
  const confirmedCount = queue.filter(a => a.status === 'CONFIRMED').length;
  const totalRevenue = queue
    .filter(a => a.status === 'COMPLETED' || a.status === 'CONFIRMED')
    .reduce((sum, a) => sum + (a.fee || 0), 0);

  // Filter Queue based on active tab
  const filteredQueue = queue.filter(a => {
    if (activeTab === 'ALL') return true;
    return a.status === activeTab;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 24px' }}>
      {/* Doctor Banner */}
      <div className="card" style={{
        padding: '32px',
        background: 'linear-gradient(135deg, #0f172a, #1e293b)',
        color: '#ffffff',
        marginBottom: '36px',
        borderRadius: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2dd4bf', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Doctor Consultation Portal
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Welcome, {user.name}</h1>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '4px' }}>
              Real-time patient queue, clinical note entries, and schedule status tracking.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '36px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, marginBottom: '6px' }}>Total Patients Queue</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{queue.length}</div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 700, marginBottom: '6px' }}>Completed Consultations</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a' }}>{completedCount}</div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: '#d97706', fontWeight: 700, marginBottom: '6px' }}>Pending / Confirmed</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706' }}>{pendingCount + confirmedCount}</div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: 700, marginBottom: '6px' }}>Consultation Revenue</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0d9488' }}>${totalRevenue}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap', borderBottom: '1px solid #e2e8f0', paddingBottom: '12px' }}>
        {['ALL', 'CONFIRMED', 'PENDING', 'COMPLETED', 'CANCELLED'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === tab ? '#0d9488' : '#f1f5f9',
              color: activeTab === tab ? '#ffffff' : '#475569',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab === 'ALL' ? 'All Queue' : tab}
          </button>
        ))}
      </div>

      {/* Queue List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>Loading patient appointments...</div>
      ) : filteredQueue.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center', background: '#ffffff' }}>
          <Calendar size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>
            No appointments found in tab "{activeTab}"
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Upcoming patient bookings will appear here in real time.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {filteredQueue.map(apt => (
            <div key={apt._id} className="card" style={{ padding: '24px', display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{apt.patientName || 'Patient'}</h3>
                  <StatusBadge status={apt.status} />
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>
                  {apt.patientEmail} • {apt.patientPhone || 'No Phone'}
                </div>
                <div style={{ fontSize: '0.85rem', background: '#f8fafc', padding: '8px 12px', borderRadius: '6px', color: '#334155' }}>
                  <strong>Reason:</strong> {apt.reason || 'General consultation'}
                </div>
              </div>

              {/* Slot & Fee Info */}
              <div style={{ fontSize: '0.9rem', color: '#334155' }}>
                <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={16} color="#0d9488" />
                  <span>Date: {apt.appointmentDate}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <Clock size={16} color="#0d9488" />
                  <span>Slot: {apt.timeSlot}</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '4px' }}>
                  Fee: <strong style={{ color: '#0f172a' }}>${apt.fee}</strong>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                {apt.status !== 'COMPLETED' && (
                  <button
                    onClick={() => handleStatusChange(apt._id, 'COMPLETED')}
                    className="btn btn-primary btn-sm"
                  >
                    <CheckCircle2 size={16} />
                    <span>Complete</span>
                  </button>
                )}

                {apt.status !== 'CONFIRMED' && apt.status !== 'COMPLETED' && apt.status !== 'CANCELLED' && (
                  <button
                    onClick={() => handleStatusChange(apt._id, 'CONFIRMED')}
                    className="btn btn-secondary btn-sm"
                  >
                    Confirm
                  </button>
                )}

                {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
                  <button
                    onClick={() => handleStatusChange(apt._id, 'CANCELLED')}
                    className="btn btn-danger btn-sm"
                  >
                    <XCircle size={16} />
                    <span>Cancel</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    setEditingApt(apt);
                    setDoctorNotes(apt.doctorNotes || '');
                  }}
                  className="btn btn-outline btn-sm"
                >
                  <Edit3 size={16} />
                  <span>Notes</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Doctor Notes Modal */}
      {editingApt && (
        <div className="modal-overlay" onClick={() => setEditingApt(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
              Doctor Notes for {editingApt.patientName}
            </h3>

            <form onSubmit={handleSaveNotes}>
              <div className="form-group">
                <label className="form-label">Clinical Observations & Prescription Recommendations</label>
                <textarea
                  className="form-textarea"
                  rows={5}
                  placeholder="Enter medical notes, diagnosis summary, or prescription follow-up..."
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button type="button" onClick={() => setEditingApt(null)} className="btn btn-secondary" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  Save Doctor Notes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
