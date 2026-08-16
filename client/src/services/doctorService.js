import { request } from './api';

export const doctorService = {
  getDoctors: async (params = {}) => {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.search) query.append('search', params.search);
    if (params.specialty) query.append('specialty', params.specialty);
    if (params.minFee) query.append('minFee', params.minFee);
    if (params.maxFee) query.append('maxFee', params.maxFee);
    if (params.sort) query.append('sort', params.sort);

    return await request(`/doctors?${query.toString()}`);
  },

  getDoctorById: async (id) => {
    return await request(`/doctors/${id}`);
  },

  getDoctorBySlug: async (slug) => {
    return await request(`/doctors/slug/${slug}`);
  },

  getAvailableSlots: async (doctorId, dateStr) => {
    return await request(`/doctors/${doctorId}/available-slots?date=${dateStr}`);
  }
};
