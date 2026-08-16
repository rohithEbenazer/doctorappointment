import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { specialtyService } from '../services/specialtyService';
import { doctorService } from '../services/doctorService';
import { SpecialtyCard } from '../components/SpecialtyCard';
import { DoctorCard } from '../components/DoctorCard';
import { BookingModal } from '../components/BookingModal';
import { SkeletonGrid } from '../components/SkeletonLoader';
import { Search, ShieldCheck, Clock, Award, Users, ArrowRight, HeartPulse, Sparkles } from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [topDoctors, setTopDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [specRes, docRes] = await Promise.all([
        specialtyService.getSpecialties(),
        doctorService.getDoctors({ limit: 4, sort: 'rating_desc' })
      ]);
      setSpecialties(specRes.data || []);
      setTopDoctors(docRes.data || []);
    } catch (err) {
      console.error('Failed to load home page data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/doctors');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        padding: '80px 24px 100px 24px',
        overflow: 'hidden'
      }}>
        {/* Background Decorative Glow */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(13, 148, 136, 0.25) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '48px', alignItems: 'center' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 16px',
                borderRadius: '30px',
                background: 'rgba(13, 148, 136, 0.15)',
                border: '1px solid rgba(13, 148, 136, 0.3)',
                color: '#2dd4bf',
                fontWeight: 700,
                fontSize: '0.85rem',
                marginBottom: '20px'
              }}>
                <Sparkles size={16} />
                <span>24/7 Verified Hospital Doctor Consultations</span>
              </div>

              <h1 style={{
                fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                marginBottom: '20px',
                letterSpacing: '-0.03em'
              }}>
                Your Health, <span style={{ color: '#2dd4bf' }}>Simplified.</span> Book Specialist Doctors Today.
              </h1>

              <p style={{
                fontSize: '1.1rem',
                color: '#94a3b8',
                lineHeight: 1.6,
                marginBottom: '32px',
                maxWidth: '540px'
              }}>
                Connect with top-rated medical specialists across Cardiology, Neurology, Pediatrics, Orthopedics, and more with instant slot reservation.
              </p>

              {/* Instant Doctor Search Bar */}
              <form onSubmit={handleSearchSubmit} style={{
                display: 'flex',
                background: '#ffffff',
                borderRadius: '16px',
                padding: '6px 8px 6px 16px',
                boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
                maxWidth: '520px',
                alignItems: 'center',
                gap: '12px'
              }}>
                <Search size={20} color="#94a3b8" />
                <input
                  type="text"
                  placeholder="Search doctor by name, specialty, or condition..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '0.95rem',
                    color: '#0f172a'
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{ borderRadius: '12px', whiteSpace: 'nowrap' }}>
                  Search
                </button>
              </form>

              {/* Quick Credentials Badge */}
              <div style={{
                display: 'flex',
                gap: '24px',
                marginTop: '40px',
                paddingTop: '24px',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                color: '#cbd5e1',
                fontSize: '0.85rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="#2dd4bf" />
                  <span>100% Board Certified</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={18} color="#2dd4bf" />
                  <span>Instant Slot Confirmation</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="glass-panel" style={{
              borderRadius: '24px',
              padding: '32px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  background: '#0d9488',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <HeartPulse size={32} color="#ffffff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>CarePulse Medical Center</h3>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Outpatient & Specialist Care</p>
                </div>
              </div>

              {/* Stats Counters */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '14px' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2dd4bf' }}>50+</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Specialist Doctors</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '14px' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2dd4bf' }}>15k+</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Patients Served</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '14px' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2dd4bf' }}>4.9 ★</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Patient Satisfaction</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '14px' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2dd4bf' }}>0 Min</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Wait Time Guarantee</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Medical Specialties Section */}
      <section style={{ maxWidth: '1280px', margin: '80px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Specialized Care
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Browse Medical Departments</h2>
          </div>
          <Link to="/doctors" style={{ color: '#0d9488', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>View All Specialties</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={4} />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px'
          }}>
            {specialties.map(spec => (
              <SpecialtyCard key={spec._id} specialty={spec} />
            ))}
          </div>
        )}
      </section>

      {/* Top-Rated Doctors Section */}
      <section style={{ maxWidth: '1280px', margin: '90px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '36px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Expert Physicians
            </div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a' }}>Top-Rated Medical Specialists</h2>
          </div>
          <Link to="/doctors" style={{ color: '#0d9488', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>See Full Directory</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={4} />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {topDoctors.map(doctor => (
              <DoctorCard
                key={doctor._id}
                doctor={doctor}
                onBookClick={(doc) => setSelectedDoctorForBooking(doc)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose CarePulse Section */}
      <section style={{
        maxWidth: '1280px',
        margin: '100px auto 0',
        padding: '48px 24px',
        background: '#ffffff',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        boxShadow: 'var(--shadow-md)'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 48px' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>
            Why Patients Choose CarePulse
          </h2>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>
            We combine clinical excellence with intelligent digital scheduling for a seamless healthcare experience.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: '#f0fdfa',
              color: '#0d9488',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Award size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Verified Credentials</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Every physician undergoes rigorous background verification, license auditing, and hospital accreditation checks.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: '#f0fdfa',
              color: '#0d9488',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Clock size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Real-Time Slot Engine</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Choose your exact consultation time without long waiting room delays or double-booking conflicts.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: '#f0fdfa',
              color: '#0d9488',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px'
            }}>
              <Users size={32} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '8px' }}>Patient-Centric Care</h3>
            <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Manage your consultation history, view doctor notes, and receive instant digital status updates.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Slot Modal */}
      {selectedDoctorForBooking && (
        <BookingModal
          doctor={selectedDoctorForBooking}
          onClose={() => setSelectedDoctorForBooking(null)}
          onBookingSuccess={() => {
            navigate('/patient/appointments');
          }}
        />
      )}
    </div>
  );
};
