import { request } from './api';

export const appointmentService = {
  createAppointment: async (appointmentData) => {
    return await request('/appointments', {
      method: 'POST',
      body: appointmentData
    });
  },

  getMyAppointments: async () => {
    return await request('/appointments/my');
  },

  cancelAppointment: async (id) => {
    return await request(`/appointments/${id}/cancel`, {
      method: 'PATCH'
    });
  },

  getDoctorAppointments: async (doctorId) => {
    const url = doctorId ? `/doctor/appointments?doctorId=${doctorId}` : '/doctor/appointments';
    return await request(url);
  },

  updateStatus: async (id, statusData) => {
    return await request(`/doctor/appointments/${id}/status`, {
      method: 'PATCH',
      body: statusData
    });
  }
};
