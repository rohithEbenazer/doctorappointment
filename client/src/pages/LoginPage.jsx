import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, Link } from 'react-router-dom';
import { Stethoscope, Lock, Mail, ArrowRight, UserCheck } from 'lucide-react';

export const LoginPage = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter your email and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await login({ email, password });
      showToast(`Welcome back, ${res.data.user.name}!`, 'success');

      if (res.data.user.role === 'ADMIN' || res.data.user.role === 'SUPER_ADMIN') {
        navigate('/admin/dashboard');
      } else if (res.data.user.role === 'DOCTOR') {
        navigate('/doctor/dashboard');
      } else {
        navigate('/patient/appointments');
      }
    } catch (err) {
      showToast(err.message || 'Login failed. Check credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    showToast(`Pre-filled ${demoRole} credentials! Click Sign In.`, 'info');
  };

  return (
    <div style={{ maxWidth: '460px', margin: '60px auto', padding: '0 24px' }}>
      <div className="card" style={{ padding: '36px', background: '#ffffff' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #0d9488, #0f766e)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            marginBottom: '12px'
          }}>
            <Stethoscope size={28} />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Sign In to CarePulse</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
            Access your patient account or medical staff portal
          </p>
        </div>

        {/* Pre-filled Demo Logins */}
        <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0d9488', textTransform: 'uppercase', marginBottom: '8px' }}>
            Quick Demo Login Accounts
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleQuickLogin('patient@hospital.com', 'Patient')}
              style={{ background: '#e0f2fe', color: '#0369a1', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('doctor.smith@hospital.com', 'Doctor')}
              style={{ background: '#f0fdfa', color: '#0d9488', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Doctor
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@hospital.com', 'Admin')}
              style={{ background: '#fef3c7', color: '#b45309', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('superadmin@hospital.com', 'Super Admin')}
              style={{ background: '#fae8ff', color: '#86198f', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
            >
              Super Admin
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="name@hospital.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '12px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: '#64748b' }}>
          Don't have a patient account?{' '}
          <Link to="/register" style={{ color: '#0d9488', fontWeight: 700 }}>
            Register Now
          </Link>
        </div>
      </div>
    </div>
  );
};
