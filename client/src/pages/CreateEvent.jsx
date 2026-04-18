import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api.jsx';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'tech',
    image: null,
  });
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addCompetition = () => {
    setCompetitions([...competitions, { name: '', description: '', prize: '', rules: '' }]);
  };

  const removeCompetition = (index) => {
    setCompetitions(competitions.filter((_, i) => i !== index));
  };

  const updateCompetition = (index, field, value) => {
    const updated = [...competitions];
    updated[index][field] = value;
    setCompetitions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'image' && formData[key]) {
          data.append('image', formData[key]);
        } else {
          data.append(key, formData[key]);
        }
      });
      data.append('competitions', JSON.stringify(competitions));

      await api.post('/events', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to broadcast event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-32 px-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-16">
          <button onClick={() => navigate(-1)} className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 mb-4">← Back to Dashboard</button>
          <h1 className="text-5xl md:text-6xl font-semibold tracking-tight text-slate-900 italic">Broadcast <span className="text-emerald-600">Event.</span></h1>
          <p className="text-slate-500 font-medium text-lg mt-4">Share the details of an upcoming campus fest or activity.</p>
        </header>

        {error && <div className="p-5 bg-red-50 text-red-500 rounded-[1.5rem] border border-red-100 font-bold mb-10">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Base Info Card */}
          <div className="bg-white rounded-[3.5rem] p-10 md:p-14 border border-slate-50 shadow-sm space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Event Identity</label>
                <input 
                  type="text"
                  required
                  placeholder="Official Fest Name"
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-medium"
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Discovery Category</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-medium"
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="tech">Technical</option>
                  <option value="arts">Arts & Culture</option>
                  <option value="sports">Sports</option>
                  <option value="social">Social</option>
                  <option value="academic">Academic</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Event Narrative</label>
              <textarea 
                required
                rows="4"
                placeholder="What makes this event unique? Provide a compelling description..."
                className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-medium resize-none"
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Timeline (Date)</label>
                <input 
                  type="date"
                  required
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-medium"
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Location</label>
                <input 
                  type="text"
                  required
                  placeholder="Campus Venue / Lab / Ground"
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-medium"
                  onChange={e => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Event Visual (Poster)</label>
              <input 
                type="file"
                accept="image/*"
                className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-medium"
                onChange={e => setFormData({ ...formData, image: e.target.files[0] })}
              />
            </div>
          </div>

          {/* Competitions Section */}
          <div className="space-y-8">
            <div className="flex justify-between items-center px-4">
              <h2 className="text-2xl font-bold tracking-tight">Competitions <span className="text-slate-400">({competitions.length})</span></h2>
              <button 
                type="button" 
                onClick={addCompetition}
                className="text-xs font-bold uppercase tracking-widest text-emerald-600 hover:text-black transition-colors"
              >
                + Add Contest
              </button>
            </div>

            <div className="space-y-6">
              {competitions.map((comp, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={i} 
                  className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative"
                >
                  <button 
                    type="button" 
                    onClick={() => removeCompetition(i)}
                    className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <input 
                      placeholder="Competition Name"
                      className="w-full bg-slate-50 border-b border-slate-100 py-4 focus:border-emerald-500 outline-none font-bold"
                      value={comp.name}
                      onChange={e => updateCompetition(i, 'name', e.target.value)}
                    />
                    <input 
                      placeholder="Prize Pool / Award"
                      className="w-full bg-slate-50 border-b border-slate-100 py-4 focus:border-emerald-500 outline-none font-bold"
                      value={comp.prize}
                      onChange={e => updateCompetition(i, 'prize', e.target.value)}
                    />
                  </div>
                  <textarea 
                    placeholder="Short description & rules..."
                    className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-4 focus:border-emerald-500 outline-none font-medium text-sm h-24"
                    value={comp.description}
                    onChange={e => updateCompetition(i, 'description', e.target.value)}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-bold uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10"
          >
            {loading ? 'Initializing Broadcast...' : 'Broadcast Event Details'}
          </button>
        </form>
      </div>
    </div>
  );
}
