import api from './api.jsx';

export const getComments = (eventId) => api.get(`/events/${eventId}/comments`);
export const addComment = (eventId, text, parentComment = null) => api.post(`/events/${eventId}/comments`, { text, parentComment });
