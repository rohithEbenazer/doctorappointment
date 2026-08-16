import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Calendar, Clock, DollarSign, Award, ArrowUpRight } from 'lucide-react';

export const DoctorCard = ({ doctor, onBookClick }) => {
  const profileLink = `/doctors/${doctor.slug || doctor._id}`;

  return (
    <div className="card" style={{
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      height: '100%'
    }}>
      {/* Header Image & Rating Badge */}
      <Link to={profileLink} style={{ position: 'relative', height: '200px', backgroundColor: '#f1f5f9', display: 'block', textDecoration: 'none' }}>
        <img
          src={doctor.avatar}
          alt={doctor.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop';
          }}
        />
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(4px)',
          color: '#ffffff',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Star size={14} color="#f59e0b" fill="#f59e0b" />
          <span>{doctor.rating ? doctor.rating.toFixed(1) : '5.0'}</span>
          <span style={{ color: '#94a3b8', fontWeight: 500 }}>({doctor.reviewCount || 1})</span>
        </div>

        {/* Specialty Pill */}
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '12px',
          background: '#0d9488',
          color: '#ffffff',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 700,
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}>
          {doctor.specialtyName || 'Specialist'}
        </div>
      </Link>

      {/* Card Content */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <Link to={profileLink} style={{ textDecoration: 'none' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>{doctor.name}</span>
            <ArrowUpRight size={16} color="#0d9488" />
          </h3>
        </Link>
        <div style={{ fontSize: '0.85rem', color: '#0d9488', fontWeight: 600, marginBottom: '12px' }}>
          {doctor.qualification}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Award size={16} color="#0d9488" />
            <span>{doctor.experienceYears} Years Clinical Experience</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={16} color="#0d9488" />
            <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {doctor.clinicLocation}
            </span>
          </div>
        </div>

        {/* Fee & Booking CTA */}
        <div style={{
          marginTop: 'auto',
          paddingTop: '16px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Consultation Fee</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              ${doctor.consultationFee}
            </div>
          </div>
          <button
            onClick={() => onBookClick(doctor)}
            className="btn btn-primary btn-sm"
          >
            <Calendar size={16} />
            <span>Book Slot</span>
          </button>
        </div>
      </div>
    </div>
  );
};
