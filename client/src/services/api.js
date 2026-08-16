const API_HOST = import.meta.env.VITE_API_URL || '';
const BASE_URL = `${API_HOST}/api/v1`;

export const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('carepulse_token');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const config = {
    ...options,
    headers
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'An error occurred during API request.');
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (!error.status) {
      error.message = 'Network error or server unavailable. Please try again later.';
    }
    throw error;
  }
};
