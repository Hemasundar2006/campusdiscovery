import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api.jsx';

export default function PostAchievement() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({
    event: '', title: '', description: '', competitionName: '', rank: 'Winner'
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/events?past=true').then(res => setEvents(res.data.events)).catch(err => console.error(err));
  }, []);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.event) return setError('Please select an event');
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (image) fd.append('image', image);
      await api.post('/achievements', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post achievement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-white pt-32 pb-20 px-6'>
      <div className='max-w-2xl mx-auto'>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-12 text-center'
        >
          <h1 className='text-5xl font-black mb-4 uppercase tracking-tighter'>Share Your <span className='text-emerald-600'>Victory</span></h1>
          <p className='text-gray-500 font-medium'>Did you win something big? Tell the community about your success!</p>
        </motion.div>

        <form onSubmit={handleSubmit} className='space-y-6 bg-gray-50 p-10 rounded-[2.5rem] border-2 border-gray-100 shadow-xl shadow-gray-200/50'>
          <div className='space-y-2'>
            <label className='text-xs font-black uppercase tracking-widest text-emerald-600'>Linked Event</label>
            <select name='event' value={form.event} onChange={handleChange} className='w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none font-bold' required>
              <option value="">Select the event you won in</option>
              {events.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
            </select>
          </div>

          <div className='space-y-2'>
            <label className='text-xs font-black uppercase tracking-widest text-emerald-600'>Achievement Title</label>
            <input name='title' value={form.title} onChange={handleChange} placeholder='e.g. First Prize in Hackathon' className='w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none font-bold' required />
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div className='space-y-2'>
              <label className='text-xs font-black uppercase tracking-widest text-emerald-600'>Competition Name</label>
              <input name='competitionName' value={form.competitionName} onChange={handleChange} placeholder='e.g. CodeSprint 2024' className='w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none font-bold' />
            </div>
            <div className='space-y-2'>
              <label className='text-xs font-black uppercase tracking-widest text-emerald-600'>Rank / Honor</label>
              <input name='rank' value={form.rank} onChange={handleChange} placeholder='e.g. Winner, Runner Up' className='w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none font-bold' />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-xs font-black uppercase tracking-widest text-emerald-600'>Story of Success</label>
            <textarea name='description' value={form.description} onChange={handleChange} placeholder='Tell us how you felt and what you did to win!' className='w-full bg-white border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none font-medium h-32' required />
          </div>

          <div className='space-y-2'>
             <label className='text-xs font-black uppercase tracking-widest text-emerald-600'>Victory Photo / Certificate</label>
             <input type='file' accept='image/*' onChange={(e) => setImage(e.target.files?.[0] || null)} className='w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl px-6 py-8 focus:border-emerald-500 outline-none' />
          </div>

          {error && <p className='text-red-500 font-bold text-center'>{error}</p>}

          <button disabled={loading} className='w-full btn-primary py-5 text-lg uppercase tracking-widest'>
            {loading ? 'Posting...' : 'Post Achievement'}
          </button>
        </form>
      </div>
    </div>
  );
}
