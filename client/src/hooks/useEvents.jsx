import { useCallback, useEffect, useState } from 'react';
import api from '../services/api.jsx';

export default function useEvents(initialParams = {}) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchEvents = useCallback(async (params = initialParams) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/events', { params });
      setEvents(data.events || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [initialParams]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, refetch: fetchEvents };
}
