import api from './api.jsx';

export const getEvents = (params) => api.get('/events', { params });
export const getEventById = (id) => api.get(`/events/${id}`);
export const createEvent = (formData) => api.post('/events', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateEvent = (id, formData) => api.put(`/events/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
