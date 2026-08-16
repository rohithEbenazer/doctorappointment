import React from 'react';

export const SkeletonDoctorCard = () => (
  <div className="card" style={{ height: '360px', padding: '0', overflow: 'hidden' }}>
    <div className="skeleton" style={{ height: '180px', width: '100%' }} />
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div className="skeleton" style={{ height: '24px', width: '70%' }} />
      <div className="skeleton" style={{ height: '16px', width: '40%' }} />
      <div className="skeleton" style={{ height: '16px', width: '90%' }} />
      <div className="skeleton" style={{ height: '40px', width: '100%', marginTop: 'auto' }} />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6 }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
    width: '100%'
  }}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonDoctorCard key={i} />
    ))}
  </div>
);
