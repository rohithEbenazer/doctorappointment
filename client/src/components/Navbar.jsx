import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Stethoscope, User, Calendar, Shield, LogOut, PlusCircle } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #e2e8f0'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0d9488, #0f766e)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
          }}>
            <Stethoscope size={24} />
          </div>
          <div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>Care</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0d9488' }}>Pulse</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link to="/" style={{
            fontWeight: 600,
            color: isActive('/') ? '#0d9488' : '#475569',
            textDecoration: 'none',
            fontSize: '0.95rem'
          }}>
            Home
          </Link>
          <Link to="/doctors" style={{
            fontWeight: 600,
            color: isActive('/doctors') ? '#0d9488' : '#475569',
            textDecoration: 'none',
            fontSize: '0.95rem'
          }}>
            Find Doctors
          </Link>

          {user && user.role === 'PATIENT' && (
            <Link to="/patient/appointments" style={{
              fontWeight: 600,
              color: isActive('/patient/appointments') ? '#0d9488' : '#475569',
              textDecoration: 'none',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Calendar size={18} />
              My Appointments
            </Link>
          )}

          {user && (user.role === 'DOCTOR' || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
            <Link to="/doctor/dashboard" style={{
              fontWeight: 600,
              color: isActive('/doctor/dashboard') ? '#0d9488' : '#475569',
              textDecoration: 'none',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <User size={18} />
              Doctor Queue
            </Link>
          )}

          {user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
            <Link to="/admin/dashboard" style={{
              fontWeight: 600,
              color: isActive('/admin/dashboard') ? '#0d9488' : '#475569',
              textDecoration: 'none',
              fontSize: '0.95rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Shield size={18} />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Auth CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                textAlign: 'right',
                display: 'none',
                smDisplay: 'block'
              }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a' }}>{user.name}</div>
                <span className="badge badge-info">{user.role}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log out">
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Book Appointment
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
