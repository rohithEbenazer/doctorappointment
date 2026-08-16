import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doctorService } from '../services/doctorService';
import { appointmentService } from '../services/appointmentService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { SkeletonGrid } from '../components/SkeletonLoader';
import {
  Star, MapPin, Calendar, Clock, Award, ShieldCheck,
  ChevronLeft, CheckCircle2, User, Lock, HeartPulse, Sparkles
} from 'lucide-react';

export const DoctorDetailPage = () => {
  const { id, slug } = useParams();
  const targetParam = slug || id;

  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loadingDoctor, setLoadingDoctor] = useState(true);

  // Booking states
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

  useEffect(() => {
    fetchDoctor();
  }, [targetParam]);

  useEffect(() => {
    if (doctor && selectedDate) {
      fetchSlots();
    }
  }, [doctor, selectedDate]);

  const fetchDoctor = async () => {
    setLoadingDoctor(true);
    try {
      let res;
      if (slug) {
        res = await doctorService.getDoctorBySlug(slug);
      } else {
        res = await doctorService.getDoctorById(targetParam);
      }
      setDoctor(res.data);
    } catch (err) {
      console.error('Failed to load doctor profile:', err);
      showToast(err.message || 'Failed to load doctor details', 'error');
    } finally {
      setLoadingDoctor(false);
    }
  };

  const fetchSlots = async () => {
    if (!doctor) return;
    setLoadingSlots(true);
    setSelectedSlot('');
    try {
      const res = await doctorService.getAvailableSlots(doctor._id, selectedDate);
      setAvailableSlots(res.data.slots || []);
    } catch (err) {
      showToast(err.message || 'Failed to load available slots', 'error');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookingSubmit = async (e) => {
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
      navigate('/patient/appointments');
    } catch (err) {
      showToast(err.message || 'Booking failed. Slot may no longer be available.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDoctor) {
    return (
      <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px' }}>
        <SkeletonGrid count={2} />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div style={{ maxWidth: '600px', margin: '80px auto', padding: '0 24px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '40px', background: '#ffffff' }}>
          <h2>Doctor Profile Not Found</h2>
          <p style={{ color: '#64748b', margin: '16px 0 24px' }}>
            The requested doctor profile does not exist or may have been deactivated.
          </p>
          <Link to="/doctors" className="btn btn-primary">Back to Find Doctors</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1140px', margin: '32px auto', padding: '0 24px' }}>
      {/* Back Button */}
      <Link to="/doctors" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        color: '#0d9488',
        fontWeight: 700,
        fontSize: '0.9rem',
        marginBottom: '24px',
        textDecoration: 'none'
      }}>
        <ChevronLeft size={18} />
        <span>Back to All Doctors</span>
      </Link>

      {/* Main Profile Header Banner */}
      <div className="card" style={{
        padding: '32px',
        background: '#ffffff',
        marginBottom: '32px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '32px',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
          <img
            src={doctor.avatar}
            alt={doctor.name}
            style={{
              width: '140px',
              height: '140px',
              borderRadius: '20px',
              objectFit: 'cover',
              border: '4px solid #f0fdfa',
              boxShadow: 'var(--shadow-md)'
            }}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop';
            }}
          />

          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#f0fdfa',
              color: '#0d9488',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '10px'
            }}>
              <HeartPulse size={14} />
              <span>{doctor.specialtyName || 'Specialist'}</span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              {doctor.name}
            </h1>

            <p style={{ fontSize: '1rem', color: '#0f766e', fontWeight: 600, marginBottom: '14px' }}>
              {doctor.qualification}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.875rem', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 700 }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                <span>{doctor.rating ? doctor.rating.toFixed(1) : '5.0'}</span>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>({doctor.reviewCount || 100} reviews)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Award size={16} color="#0d9488" />
                <span>{doctor.experienceYears} Years Clinical Experience</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={16} color="#0d9488" />
                <span>{doctor.clinicLocation}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fee & Instant Booking Box */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a, #1e293b)',
          color: '#ffffff',
          padding: '24px',
          borderRadius: '16px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Consultation Fee
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#2dd4bf', margin: '4px 0 12px' }}>
            ${doctor.consultationFee}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '0.85rem', color: '#cbd5e1' }}>
            <ShieldCheck size={16} color="#2dd4bf" />
            <span>Verified Board Certified Specialist</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Bio + Schedule on Left, Slot Booking Engine on Right */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Left Column: Biography & Shift Schedule */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Biography Card */}
          <div className="card" style={{ padding: '28px', background: '#ffffff' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px' }}>
              About & Clinical Expertise
            </h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, whitespace: 'pre-line' }}>
              {doctor.bio || `${doctor.name} is a dedicated medical specialist with over ${doctor.experienceYears} years of clinical expertise. Providing comprehensive diagnostic and therapeutic patient care.`}
            </p>
          </div>

          {/* Weekly Availability Shifts Card */}
          <div className="card" style={{ padding: '28px', background: '#ffffff' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} color="#0d9488" />
              <span>Weekly Consultation Hours</span>
            </h3>

            {doctor.availability && doctor.availability.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {doctor.availability.map((shift, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0'
                  }}>
                    <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
                      {shift.dayOfWeek}
                    </span>
                    <span style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: 600 }}>
                      {shift.startTime} - {shift.endTime} ({shift.slotDurationMinutes || 30} min slots)
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Monday to Friday: 09:00 AM - 05:00 PM</p>
            )}
          </div>
        </div>

        {/* Right Column: Slot Selection & Appointment Form */}
        <div className="card" style={{ padding: '28px', background: '#ffffff', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #e2e8f0' }}>
            <Calendar size={22} color="#0d9488" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              Schedule Appointment
            </h3>
          </div>

          <form onSubmit={handleBookingSubmit}>
            {/* Date Input */}
            <div className="form-group">
              <label className="form-label">Select Date</label>
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
              <label className="form-label">Available Slots for {selectedDate}</label>

              {loadingSlots ? (
                <div style={{ padding: '20px', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                  Generating real-time availability slots...
                </div>
              ) : availableSlots.length === 0 ? (
                <div style={{
                  padding: '16px',
                  background: '#fff1f2',
                  borderRadius: '10px',
                  color: '#be123c',
                  fontSize: '0.875rem'
                }}>
                  No available consultation slots on this date. Please pick another day.
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                  gap: '8px',
                  maxHeight: '220px',
                  overflowY: 'auto',
                  marginTop: '8px',
                  paddingRight: '4px'
                }}>
                  {availableSlots.map((s) => (
                    <button
                      key={s.timeSlot}
                      type="button"
                      disabled={!s.isAvailable}
                      onClick={() => setSelectedSlot(s.timeSlot)}
                      style={{
                        padding: '8px 6px',
                        borderRadius: '8px',
                        border: selectedSlot === s.timeSlot ? '2px solid #0d9488' : '1px solid #e2e8f0',
                        background: selectedSlot === s.timeSlot ? '#f0fdfa' : s.isAvailable ? '#ffffff' : '#f1f5f9',
                        color: s.isAvailable ? (selectedSlot === s.timeSlot ? '#0d9488' : '#0f172a') : '#cbd5e1',
                        fontWeight: selectedSlot === s.timeSlot ? 700 : 500,
                        fontSize: '0.825rem',
                        cursor: s.isAvailable ? 'pointer' : 'not-allowed',
                        textDecoration: s.isAvailable ? 'none' : 'line-through'
                      }}
                    >
                      {s.timeSlot}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Consultation Reason */}
            <div className="form-group">
              <label className="form-label">Symptoms / Reason for Visit</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Describe symptoms, medical concerns, or questions..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {!user && (
              <div style={{
                background: '#fef3c7',
                color: '#92400e',
                padding: '12px 14px',
                borderRadius: '8px',
                fontSize: '0.825rem',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Lock size={16} />
                <span>You will be prompted to log in before completing booking.</span>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || !selectedSlot}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '8px' }}
            >
              {submitting ? 'Confirming...' : user ? 'Confirm Appointment Booking' : 'Log In & Book Slot'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
