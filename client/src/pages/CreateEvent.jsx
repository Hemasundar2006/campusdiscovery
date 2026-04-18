import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api.jsx';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', date: '', endDate: '',
    locationAddress: '', locationName: '',
    locationLng: '', locationLat: '',
    category: 'academic', tags: '', maxAttendees: 0, contactEmail: '',
  });
  const [competitions, setCompetitions] = useState([{ name: '', prize: '', rules: '' }]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCompChange = (index, field, value) => {
    const newComps = [...competitions];
    newComps[index][field] = value;
    setCompetitions(newComps);
  };

  const addComp = () => setCompetitions([...competitions, { name: '', prize: '', rules: '' }]);
  const removeComp = (index) => setCompetitions(competitions.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('competitions', JSON.stringify(competitions.filter(c => c.name)));
      if (image) fd.append('image', image);
      const { data } = await api.post('/events', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      navigate(`/events/${data.event._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-white pt-32 pb-20 px-6'>
      <div className='max-w-4xl mx-auto'>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-12'
        >
          <h1 className='text-5xl font-black mb-4 uppercase tracking-tighter'>Create <span className='text-emerald-600'>Experience</span></h1>
          <p className='text-gray-500 font-medium'>Launch your next campus event with our immersive platform.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-12'>
          <div className='space-y-8'>
            <div className='space-y-2'>
              <label className='text-xs font-black uppercase tracking-widest text-emerald-600'>Basic Info</label>
              <input name='title' value={form.title} onChange={handleChange} placeholder='Event Title' className='w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all font-bold text-lg' required />
              <textarea name='description' value={form.description} onChange={handleChange} placeholder='Detailed Description' className='w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all font-medium h-40' required />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <label className='text-xs font-black uppercase tracking-widest text-emerald-600'>Date & Time</label>
                <input name='date' type='datetime-local' value={form.date} onChange={handleChange} className='w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 focus:border-emerald-500 outline-none font-bold' required />
              </div>
              <div className='space-y-2'>
                 <label className='text-xs font-black uppercase tracking-widest text-emerald-600'>Category</label>
                 <select name='category' value={form.category} onChange={handleChange} className='w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 focus:border-emerald-500 outline-none font-bold uppercase'>
                  {['academic', 'social', 'sports', 'arts', 'tech', 'other'].map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className='space-y-2'>
               <label className='text-xs font-black uppercase tracking-widest text-emerald-600'>Location</label>
               <input name='locationAddress' value={form.locationAddress} onChange={handleChange} placeholder='Physical Address or Room Number' className='w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none font-bold' required />
            </div>

            <div className='space-y-2'>
               <label className='text-xs font-black uppercase tracking-widest text-emerald-600'>Event Poster</label>
               <input type='file' accept='image/*' onChange={(e) => setImage(e.target.files?.[0] || null)} className='w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl px-6 py-8 focus:border-emerald-500 outline-none' />
            </div>
          </div>

          <div className='space-y-8'>
            <div className='space-y-4'>
              <div className='flex justify-between items-center'>
                <label className='text-xs font-black uppercase tracking-widest text-emerald-600'>Competitions / Contests</label>
                <button type='button' onClick={addComp} className='text-xs font-black bg-black text-white px-4 py-2 rounded-full hover:bg-emerald-600 transition-colors'>+ Add More</button>
              </div>
              
              <div className='space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar'>
                <AnimatePresence>
                  {competitions.map((comp, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className='bg-gray-50 p-6 rounded-3xl border-2 border-gray-100 relative group'
                    >
                      {idx > 0 && (
                        <button onClick={() => removeComp(idx)} type='button' className='absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-[10px] px-2'>Remove</button>
                      )}
                      <div className='space-y-3'>
                        <input value={comp.name} onChange={(e) => handleCompChange(idx, 'name', e.target.value)} placeholder='Competition Name (e.g. Hackathon)' className='w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-2 focus:border-emerald-500 outline-none font-bold' />
                        <input value={comp.prize} onChange={(e) => handleCompChange(idx, 'prize', e.target.value)} placeholder='Prize / Reward' className='w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-2 focus:border-emerald-500 outline-none text-sm' />
                        <textarea value={comp.rules} onChange={(e) => handleCompChange(idx, 'rules', e.target.value)} placeholder='Brief Rules' className='w-full bg-white border-2 border-gray-100 rounded-xl px-4 py-2 focus:border-emerald-500 outline-none text-sm h-20' />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {error && <p className='text-red-500 font-bold bg-red-50 p-4 rounded-2xl border border-red-100'>{error}</p>}

            <button disabled={loading} className='w-full btn-primary py-6 text-xl uppercase tracking-widest'>
              {loading ? 'Processing...' : 'Publish Experience'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
