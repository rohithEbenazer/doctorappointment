import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { doctorService } from '../services/doctorService';
import { specialtyService } from '../services/specialtyService';
import { DoctorCard } from '../components/DoctorCard';
import { BookingModal } from '../components/BookingModal';
import { SkeletonGrid } from '../components/SkeletonLoader';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';

export const DoctorCatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [meta, setMeta] = useState({ page: 1, limit: 9, total: 0, totalPages: 1 });

  // Filter States
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get('specialty') || '');
  const [sort, setSort] = useState('rating_desc');
  const [maxFee, setMaxFee] = useState('300');
  const [loading, setLoading] = useState(true);

  // Booking Modal Target
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState(null);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [searchParams]);

  const fetchSpecialties = async () => {
    try {
      const res = await specialtyService.getSpecialties();
      setSpecialties(res.data || []);
    } catch (err) {
      console.error('Failed to fetch specialties:', err);
    }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const page = searchParams.get('page') || 1;
      const qSearch = searchParams.get('search') || '';
      const qSpec = searchParams.get('specialty') || '';
      const qSort = searchParams.get('sort') || sort;
      const qFee = searchParams.get('maxFee') || maxFee;

      const res = await doctorService.getDoctors({
        page,
        limit: 9,
        search: qSearch,
        specialty: qSpec,
        sort: qSort,
        maxFee: qFee
      });

      setDoctors(res.data || []);
      setMeta(res.meta || { page: 1, limit: 9, total: 0, totalPages: 1 });
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (selectedSpecialty) params.set('specialty', selectedSpecialty);
    if (sort) params.set('sort', sort);
    if (maxFee) params.set('maxFee', maxFee);
    params.set('page', '1');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedSpecialty('');
    setSort('rating_desc');
    setMaxFee('300');
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    setSearchParams(params);
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 24px' }}>
      {/* Header Title */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a' }}>Find & Book Specialist Doctors</h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', marginTop: '4px' }}>
          Select from board-certified hospital physicians across departments.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '32px', alignItems: 'start' }}>
        {/* Left Filter Sidebar */}
        <div className="card" style={{ padding: '24px', background: '#ffffff', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#0f172a' }}>
              <Filter size={18} color="#0d9488" />
              <span>Filter Directory</span>
            </div>
            <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: '#0d9488', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}>
              Reset
            </button>
          </div>

          {/* Search Input */}
          <div className="form-group">
            <label className="form-label">Doctor Name or Keyword</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Dr. Sarah, Cardio..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
              />
            </div>
          </div>

          {/* Specialty Dropdown */}
          <div className="form-group">
            <label className="form-label">Medical Specialty</label>
            <select
              className="form-select"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              <option value="">All Specialties</option>
              {specialties.map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Fee Range Slider */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', fontWeight: 600, marginBottom: '6px' }}>
              <label>Max Fee: ${maxFee}</label>
            </div>
            <input
              type="range"
              min="50"
              max="300"
              step="10"
              value={maxFee}
              onChange={(e) => setMaxFee(e.target.value)}
              style={{ width: '100%', accentColor: '#0d9488' }}
            />
          </div>

          {/* Sort Selector */}
          <div className="form-group">
            <label className="form-label">Sort Physicians By</label>
            <select
              className="form-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="rating_desc">Highest Rated</option>
              <option value="exp_desc">Most Experienced</option>
              <option value="fee_asc">Consultation Fee: Low to High</option>
              <option value="fee_desc">Consultation Fee: High to Low</option>
            </select>
          </div>

          <button onClick={applyFilters} className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }}>
            Apply Filters
          </button>
        </div>

        {/* Right Doctor Directory Cards Grid */}
        <div style={{ gridColumn: 'span 2' }}>
          {loading ? (
            <SkeletonGrid count={6} />
          ) : doctors.length === 0 ? (
            <div className="card" style={{ padding: '48px', textAlign: 'center', background: '#ffffff' }}>
              <XCircle size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>No doctors found matching criteria</h3>
              <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '24px' }}>
                Try adjusting your search terms or expanding the fee filter.
              </p>
              <button onClick={clearFilters} className="btn btn-secondary">
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: '40px'
              }}>
                {doctors.map(doctor => (
                  <DoctorCard
                    key={doctor._id}
                    doctor={doctor}
                    onBookClick={(doc) => setSelectedDoctorForBooking(doc)}
                  />
                ))}
              </div>

              {/* Pagination Controls */}
              {meta.totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '16px',
                  marginTop: '32px'
                }}>
                  <button
                    disabled={meta.page <= 1}
                    onClick={() => handlePageChange(meta.page - 1)}
                    className="btn btn-secondary btn-sm"
                  >
                    <ChevronLeft size={18} />
                    <span>Previous</span>
                  </button>

                  <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#475569' }}>
                    Page {meta.page} of {meta.totalPages}
                  </span>

                  <button
                    disabled={meta.page >= meta.totalPages}
                    onClick={() => handlePageChange(meta.page + 1)}
                    className="btn btn-secondary btn-sm"
                  >
                    <span>Next</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Booking Slot Modal */}
      {selectedDoctorForBooking && (
        <BookingModal
          doctor={selectedDoctorForBooking}
          onClose={() => setSelectedDoctorForBooking(null)}
        />
      )}
    </div>
  );
};
