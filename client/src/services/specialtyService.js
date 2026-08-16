import { request } from './api';

export const specialtyService = {
  getSpecialties: async () => {
    return await request('/specialties');
  },
  getSpecialtyById: async (id) => {
    return await request(`/specialties/${id}`);
  }
};
