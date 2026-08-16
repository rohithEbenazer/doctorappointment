import { request } from './api';

export const adminService = {
  getStats: async () => {
    return await request('/admin/stats');
  },

  createDoctor: async (doctorData) => {
    return await request('/admin/doctors', {
      method: 'POST',
      body: doctorData
    });
  },

  updateDoctor: async (id, doctorData) => {
    return await request(`/admin/doctors/${id}`, {
      method: 'PATCH',
      body: doctorData
    });
  },

  deleteDoctor: async (id) => {
    return await request(`/admin/doctors/${id}`, {
      method: 'DELETE'
    });
  },

  createSpecialty: async (specialtyData) => {
    return await request('/admin/specialties', {
      method: 'POST',
      body: specialtyData
    });
  },

  updateSpecialty: async (id, specialtyData) => {
    return await request(`/admin/specialties/${id}`, {
      method: 'PATCH',
      body: specialtyData
    });
  },

  deleteSpecialty: async (id) => {
    return await request(`/admin/specialties/${id}`, {
      method: 'DELETE'
    });
  }
};
