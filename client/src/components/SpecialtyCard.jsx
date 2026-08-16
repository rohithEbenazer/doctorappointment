import React from 'react';
import { Heart, Brain, Bone, Baby, Sparkles, Stethoscope, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const getIcon = (iconName) => {
  switch (iconName) {
    case 'Heart': return <Heart size={28} color="#0d9488" />;
    case 'Brain': return <Brain size={28} color="#0d9488" />;
    case 'Bone': return <Bone size={28} color="#0d9488" />;
    case 'Baby': return <Baby size={28} color="#0d9488" />;
    case 'Sparkles': return <Sparkles size={28} color="#0d9488" />;
    default: return <Stethoscope size={28} color="#0d9488" />;
  }
};

export const SpecialtyCard = ({ specialty }) => {
  return (
    <Link to={`/doctors?specialty=${specialty._id}`} className="card" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      textDecoration: 'none',
      color: 'inherit',
      height: '100%',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        width: '56px',
        height: '56px',
        borderRadius: '14px',
        background: '#f0fdfa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px',
        border: '1px solid #ccfbf1'
      }}>
        {getIcon(specialty.icon)}
      </div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
        {specialty.name}
      </h3>
      <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, marginBottom: '20px' }}>
        {specialty.description}
      </p>

      <div style={{
        marginTop: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: '#0d9488',
        fontWeight: 700,
        fontSize: '0.85rem'
      }}>
        <span>Browse Specialists</span>
        <ArrowRight size={16} />
      </div>
    </Link>
  );
};
