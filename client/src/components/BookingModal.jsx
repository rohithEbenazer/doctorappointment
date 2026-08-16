import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import { X, Calendar, Clock, AlertCircle, CheckCircle2, User, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BookingModal = ({ doctor, onClose, onBookingSuccess }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Tomorrow's date default YYYY-MM-DD
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(getTomorrowStr());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch available slots when doctor or date changes
  useEffect(() => {
    if (doctor && selectedDate) {
      fetchSlots();
    }
  }, [doctor, selectedDate]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    setSelectedSlot('');
    try {
      const res = await doctorService.getAvailableSlots(doctor._id, selectedDate);
      setAvailableSlots(res.data.slots || []);
    } catch (err) {
      showToast(err.message || 'Failed to load doctor availability slots', 'error');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showToast('Please log in to complete your appointment booking.', 'info');
      navigate('/login');
      return;
    }

    if (!selectedSlot) {
      showToast('Please select an available consultation time slot.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await appointmentService.createAppointment({
        doctorId: doctor._id,
        appointmentDate: selectedDate,
        timeSlot: selectedSlot,
        reason: reason.trim() || 'General health consultation'
      });

      showToast(`Appointment confirmed with ${doctor.name} on ${selectedDate} at ${selectedSlot}!`, 'success');
      if (onBookingSuccess) onBookingSuccess();
      onClose();
    } catch (err) {
      showToast(err.message || 'Booking failed. Slot may no longer be available.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (!doctor) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <img
              src={doctor.avatar}
              alt={doctor.name}
              style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover' }}
            />
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{doctor.name}</h3>
              <div style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: 600 }}>{doctor.qualification}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            <X size={20} />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          {/* Fee & Location Box */}
          <div style={{
            background: '#f0fdfa',
            border: '1px solid #ccfbf1',
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#0f766e', fontWeight: 600 }}>Consultation Fee</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>${doctor.consultationFee}</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#475569' }}>
              <div>{doctor.specialtyName}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{doctor.clinicLocation}</div>
            </div>
          </div>

          {/* Date Selector */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Calendar size={16} color="#0d9488" />
              <span>Select Appointment Date</span>
            </label>
            <input
              type="date"
              className="form-input"
              min={new Date().toISOString().split('T')[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </div>

          {/* Time Slot Picker */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="#0d9488" />
              <span>Available Time Slots ({selectedDate})</span>
            </label>

            {loadingSlots ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                Generating available slots...
              </div>
            ) : availableSlots.length === 0 ? (
              <div style={{
                padding: '16px',
                background: '#fff1f2',
                borderRadius: '8px',
                color: '#be123c',
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <AlertCircle size={18} />
                <span>No available slots on this date. Please pick another date.</span>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                gap: '10px',
                marginTop: '10px'
              }}>
                {availableSlots.map((slotObj) => (
                  <button
                    key={slotObj.timeSlot}
                    type="button"
                    disabled={!slotObj.isAvailable}
                    onClick={() => setSelectedSlot(slotObj.timeSlot)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: selectedSlot === slotObj.timeSlot ? '2px solid #0d9488' : '1px solid #e2e8f0',
                      background: selectedSlot === slotObj.timeSlot ? '#f0fdfa' : slotObj.isAvailable ? '#ffffff' : '#f1f5f9',
                      color: slotObj.isAvailable ? (selectedSlot === slotObj.timeSlot ? '#0d9488' : '#0f172a') : '#cbd5e1',
                      fontWeight: selectedSlot === slotObj.timeSlot ? 700 : 500,
                      fontSize: '0.85rem',
                      cursor: slotObj.isAvailable ? 'pointer' : 'not-allowed',
                      textDecoration: slotObj.isAvailable ? 'none' : 'line-through'
                    }}
                  >
                    {slotObj.timeSlot}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Symptom / Reason Input */}
          <div className="form-group">
            <label className="form-label">Consultation Reason / Symptoms (Optional)</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="Describe your health symptoms, medical history notes, or reason for visit..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {!user && (
            <div style={{
              background: '#fef3c7',
              color: '#92400e',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Lock size={16} />
              <span>You must be logged in as a patient to book this appointment.</span>
            </div>
          )}

          {/* Footer Submit */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !selectedSlot}
              className="btn btn-primary"
              style={{ flex: 2 }}
            >
              {submitting ? 'Confirming...' : user ? 'Confirm Appointment' : 'Log In & Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
