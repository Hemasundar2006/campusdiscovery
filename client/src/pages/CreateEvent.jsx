import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api.jsx';

const GEOAPIFY_KEY = '0e4c1fa8f2be4e238297215bb3e4bc0e';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'tech',
    image: null,
    externalLink: '',
    lastDate: '',
    eventDates: '',
  });
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Custom Autocomplete State
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Geoapify Autocomplete Logic
  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_KEY}`);
        const data = await res.json();
        setSuggestions(data.features || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error('Geoapify error:', err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const selectPlace = (place) => {
    const address = place.properties.formatted;
    setFormData({ ...formData, location: address });
    setQuery(address);
    setShowSuggestions(false);
  };

  const addCompetition = () => {
    setCompetitions([...competitions, { name: '', prize: '', rules: '' }]);
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
        } else if (key === 'location') {
           data.append('locationAddress', formData[key]);
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
          <p className="text-slate-500 font-medium text-lg mt-4">Share fests and fests using your new Geoapify location system.</p>
        </header>

        {error && <div className="p-5 bg-red-50 text-red-500 rounded-[1.5rem] border border-red-100 font-bold mb-10">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-12">
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
                placeholder="What makes this event unique?"
                className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-medium resize-none"
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Smart Geoapify Venue Input */}
            <div className="space-y-2 relative">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Venue Location (Geoapify)</label>
              <input 
                type="text"
                required
                value={query}
                placeholder="Search Campus Venue / Hall..."
                className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-medium"
                onChange={e => {
                  setQuery(e.target.value);
                  setFormData({...formData, location: e.target.value});
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              />
              
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-[100] w-full mt-2 bg-white border border-slate-100 rounded-[1.5rem] shadow-2xl overflow-hidden"
                  >
                    {suggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => selectPlace(s)}
                        className="w-full text-left px-8 py-4 hover:bg-emerald-50 text-sm font-medium border-b border-slate-50 last:border-0 transition-colors"
                      >
                        <p className="text-slate-900 truncate">{s.properties.name || s.properties.address_line1}</p>
                        <p className="text-slate-400 text-xs truncate">{s.properties.address_line2}</p>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
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
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Last Date (Deadline)</label>
                <input 
                  type="date"
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-medium"
                  onChange={e => setFormData({ ...formData, lastDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">Event Dates (Display Text)</label>
                <input 
                  type="text"
                  placeholder="e.g. 12th - 14th Oct"
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-medium"
                  onChange={e => setFormData({ ...formData, eventDates: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-400 ml-4">External Registration Link</label>
                <input 
                  type="url"
                  placeholder="https://forms.gle/..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-medium"
                  onChange={e => setFormData({ ...formData, externalLink: e.target.value })}
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

          <div className="space-y-8">
            <div className="flex justify-between items-center px-4">
              <h2 className="text-2xl font-bold tracking-tight">Competitions <span className="text-slate-400">({competitions.length})</span></h2>
              <button type="button" onClick={addCompetition} className="text-xs font-bold uppercase tracking-widest text-emerald-600 hover:text-black transition-colors">+ Add Contest</button>
            </div>

            <div className="space-y-6">
              {competitions.map((comp, i) => (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={i} className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm relative">
                  <button type="button" onClick={() => removeCompetition(i)} className="absolute top-8 right-8 text-slate-300 hover:text-red-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                    <input placeholder="Competition Name" className="w-full bg-slate-50 border-b border-slate-100 py-4 focus:border-emerald-500 outline-none font-bold" value={comp.name} onChange={e => updateCompetition(i, 'name', e.target.value)} />
                    <input placeholder="Prize Pool" className="w-full bg-slate-50 border-b border-slate-100 py-4 focus:border-emerald-500 outline-none font-bold" value={comp.prize} onChange={e => updateCompetition(i, 'prize', e.target.value)} />
                  </div>
                  <textarea placeholder="Short description & rules..." className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-6 py-4 focus:border-emerald-500 outline-none font-medium text-sm h-24" value={comp.rules} onChange={e => updateCompetition(i, 'rules', e.target.value)} />
                </motion.div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-bold uppercase tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10">
            {loading ? 'Initializing Broadcast...' : 'Broadcast Event Details'}
          </button>
        </form>
      </div>
    </div>
  );
}
