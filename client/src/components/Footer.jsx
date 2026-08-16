import React from 'react';
import { Stethoscope, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer style={{
      background: '#0f172a',
      color: '#94a3b8',
      paddingTop: '60px',
      paddingBottom: '30px',
      marginTop: '80px',
      borderTop: '1px solid #1e293b'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '40px'
        }}>
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: '#0d9488',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Stethoscope size={20} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>CarePulse Hospital</span>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '16px' }}>
              Leading multi-specialty healthcare system providing accessible, world-class medical consultation and appointment booking.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10b981', fontWeight: 600, fontSize: '0.85rem' }}>
              <ShieldCheck size={18} />
              <span>HIPAA Compliant & Secure Data Protection</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/doctors" style={{ color: '#94a3b8' }}>Find a Doctor</Link></li>
              <li><Link to="/patient/appointments" style={{ color: '#94a3b8' }}>My Appointments</Link></li>
              <li><Link to="/login" style={{ color: '#94a3b8' }}>Patient Portal Login</Link></li>
              <li><Link to="/register" style={{ color: '#94a3b8' }}>New Patient Registration</Link></li>
            </ul>
          </div>

          {/* Emergency Contact */}
          <div>
            <h4 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>Emergency Care</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="#0d9488" />
                <span>24/7 Helpline: <strong>+1 (800) 555-CARE</strong></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="#0d9488" />
                <span>appointments@carepulse.hospital</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={18} color="#0d9488" />
                <span>742 Evergreen Medical Parkway, Suite 100</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid #1e293b',
          paddingTop: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          fontSize: '0.85rem'
        }}>
          <div>© {new Date().getFullYear()} CarePulse Healthcare Network. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            Built with <Heart size={14} color="#f43f5e" fill="#f43f5e" /> for patient wellness
          </div>
        </div>
      </div>
    </footer>
  );
};
