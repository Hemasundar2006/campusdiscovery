import { useAuthContext } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import api from '../services/api.jsx';

const GEOAPIFY_KEY = '0e4c1fa8f2be4e238297215bb3e4bc0e';

export default function Dashboard() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('discovery'); // 'discovery', 'manage', 'create'
  const [isHovered, setIsHovered] = useState(false);
  const [liveData, setLiveData] = useState({
    rsvps: [],
    achievements: [],
    myEvents: [],
    loading: true
  });

  // Broadcast Form State
  const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '', category: 'tech', image: null });
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [rsvpRes, achRes, myEvtRes] = await Promise.all([
            api.get('/rsvp/my'),
            api.get(`/achievements?user=${user._id}`),
            api.get('/events/my')
          ]);
          setLiveData({
            rsvps: rsvpRes.data.rsvps || [],
            achievements: achRes.data.achievements || [],
            myEvents: myEvtRes.data.events || [],
            loading: false
          });
        } catch (err) {
          setLiveData(prev => ({ ...prev, loading: false }));
        }
      };
      fetchData();
    }
  }, [user]);

  // Geoapify Logic
  useEffect(() => {
    if (query.length < 3) return;
    const timer = setTimeout(async () => {
      const res = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_KEY}`);
      const data = await res.json();
      setSuggestions(data.features || []);
      setShowSuggestions(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleBroadcast = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => key === 'image' && formData[key] ? data.append('image', formData[key]) : data.append(key === 'location' ? 'locationAddress' : key, formData[key]));
      await api.post('/events', data);
      alert('Event Broadcasted Successfully!');
      setActiveTab('discovery');
      window.location.reload(); // Refresh stats
    } catch (err) { alert('Failed to broadcast'); }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Remove this broadcast?')) {
      await api.delete(`/events/${id}`);
      setLiveData(prev => ({ ...prev, myEvents: prev.myEvents.filter(e => e._id !== id) }));
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-2 border-emerald-500 animate-spin rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex pt-24">
      {/* Precision Floating Sidebar */}
      <motion.aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ width: isHovered ? 260 : 80 }}
        className="fixed left-6 top-32 bottom-8 z-[200] bg-white border border-slate-100 hidden lg:flex flex-col items-center py-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden"
      >
        <div className="flex flex-col items-center w-full px-4 mb-12">
          <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="w-12 h-12 rounded-2xl object-cover shadow-lg" />
        </div>

        <div className="flex-1 w-full px-3 space-y-3">
           <button onClick={() => setActiveTab('discovery')} className={`w-full h-14 rounded-2xl flex items-center transition-all ${activeTab === 'discovery' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400'}`}>
              <div className="w-14 flex items-center justify-center text-xl">🏠</div>
              {isHovered && <span className="font-bold text-[11px] uppercase tracking-widest leading-none mt-1">Discovery Feed</span>}
           </button>
           <button onClick={() => setActiveTab('manage')} className={`w-full h-14 rounded-2xl flex items-center transition-all ${activeTab === 'manage' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400'}`}>
              <div className="w-14 flex items-center justify-center text-xl">🛡️</div>
              {isHovered && <span className="font-bold text-[11px] uppercase tracking-widest leading-none mt-1">My Broadcasts</span>}
           </button>
           <button onClick={() => setActiveTab('create')} className={`w-full h-14 rounded-2xl flex items-center transition-all ${activeTab === 'create' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400'}`}>
              <div className="w-14 flex items-center justify-center text-xl">✨</div>
              {isHovered && <span className="font-bold text-[11px] uppercase tracking-widest leading-none mt-1">Broadcast Event</span>}
           </button>
           <Link to="/admin-login" className="w-full h-14 rounded-2xl flex items-center text-slate-200 hover:text-emerald-500 transition-all group">
              <div className="w-14 flex items-center justify-center text-xl">🤫</div>
              {isHovered && <span className="font-bold text-[9px] uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity mt-1">Staff Portal</span>}
           </Link>
        </div>
      </motion.aside>

      {/* MOBILE: Floating Bottom Rail */}
      <nav className="fixed bottom-6 left-6 right-6 z-[300] lg:hidden">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] h-20 shadow-2xl flex items-center justify-around px-4">
           <button onClick={() => setActiveTab('discovery')} className={`flex flex-col items-center ${activeTab === 'discovery' ? 'text-emerald-600' : 'text-slate-400'}`}>
              <span className="text-xl">🏠</span>
              <span className="text-[9px] font-bold uppercase tracking-widest">Feed</span>
           </button>
           <button onClick={() => setActiveTab('manage')} className={`flex flex-col items-center ${activeTab === 'manage' ? 'text-emerald-600' : 'text-slate-400'}`}>
              <span className="text-xl">🛡️</span>
              <span className="text-[9px] font-bold uppercase tracking-widest">Manage</span>
           </button>
           <button onClick={() => setActiveTab('create')} className={`flex flex-col items-center ${activeTab === 'create' ? 'text-emerald-600' : 'text-slate-400'}`}>
              <span className="text-xl">✨</span>
              <span className="text-[9px] font-bold uppercase tracking-widest">Post</span>
           </button>
           <Link to="/profile/edit" className="flex flex-col items-center text-slate-400">
              <span className="text-xl">⚙️</span>
              <span className="text-[9px] font-bold uppercase tracking-widest">Settings</span>
           </Link>
        </div>
      </nav>

      <main className="flex-1 ml-0 lg:ml-28 p-6 md:p-12 lg:p-20 pb-32 lg:pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'discovery' && (
            <motion.div key="discovery" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
               <header className="mb-12"><h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Welcome, {user.name.split(' ')[0]}</h1></header>
               <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
                  {[{l:'Events',v:liveData.rsvps.length, i:'🎯'}, {l:'Wins',v:liveData.achievements.length, i:'🏆'}, {l:'Active',v:liveData.myEvents.length, i:'📡'}].map((s,i)=>(
                    <div key={i} className="bg-white rounded-[2.5rem] p-10 border border-slate-50 flex items-center justify-between">
                       <div><p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">{s.l}</p><p className="text-5xl font-semibold tracking-tighter">{String(s.v).padStart(2,'0')}</p></div>
                       <div className="text-3xl opacity-20">{s.i}</div>
                    </div>
                  ))}
               </section>
               <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                  <div className="bg-white rounded-[3.5rem] p-12 border border-slate-50 shadow-sm"><h3 className="text-xl font-bold italic mb-8">Recent Feed</h3>
                    {liveData.rsvps.slice(0,3).map(r=>(<div key={r._id} className="p-4 rounded-3xl bg-slate-50 mb-4 font-bold text-slate-800">{r.event.title}</div>))}
                  </div>
                  <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 text-9xl opacity-10">🏟️</div>
                    <h3 className="text-xl font-bold italic mb-8">Victory Records</h3>
                    {liveData.achievements.slice(0,3).map(a=>(<div key={a._id} className="p-4 rounded-3xl bg-white/10 mb-4 font-bold">{a.title}</div>))}
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'manage' && (
            <motion.div key="manage" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }}>
               <header className="mb-12"><h2 className="text-4xl font-semibold tracking-tight">Broadcast Control</h2></header>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {liveData.myEvents.map(evt => (
                    <div key={evt._id} className="bg-white p-10 rounded-[3rem] border border-slate-100">
                       <h4 className="text-xl font-bold mb-6">{evt.title}</h4>
                       <div className="flex gap-4">
                         <Link to={`/events/${evt._id}`} className="px-8 py-3 bg-slate-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest">View</Link>
                         <button onClick={()=>handleDeleteEvent(evt._id)} className="px-8 py-3 bg-red-50 text-red-500 rounded-full text-[10px] font-bold uppercase tracking-widest">Delete</button>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'create' && (
            <motion.div key="create" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}>
               <header className="mb-12"><h2 className="text-4xl font-semibold tracking-tight italic text-emerald-600">Broadcast New Event.</h2></header>
               <form onSubmit={handleBroadcast} className="bg-white p-12 rounded-[4rem] border border-slate-50 shadow-sm space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <input placeholder="Fest Name" className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 focus:border-emerald-500 outline-none font-bold" onChange={e=>setFormData({...formData, title: e.target.value})} />
                     <input placeholder="Timeline (Date)" type="date" className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 font-bold" onChange={e=>setFormData({...formData, date: e.target.value})} />
                  </div>
                  <div className="relative">
                    <input placeholder="Search Venue Location (Geoapify)..." value={query} className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] px-8 py-5 font-bold" onChange={e=>{setQuery(e.target.value); setFormData({...formData, location: e.target.value})}} />
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-3xl shadow-2xl overflow-hidden">
                        {suggestions.map((s,i) => (
                          <button key={i} type="button" onClick={()=>{setQuery(s.properties.formatted); setFormData({...formData, location: s.properties.formatted}); setShowSuggestions(false)}} className="w-full text-left px-8 py-4 hover:bg-emerald-50 text-sm font-bold border-b last:border-0">{s.properties.name || s.properties.address_line1}</button>
                        ))}
                      </div>
                    )}
                  </div>
                  <textarea placeholder="Tell the campus about the vibes..." rows="4" className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] px-8 py-5 font-bold resize-none" onChange={e=>setFormData({...formData, description: e.target.value})} />
                  <button type="submit" className="w-full bg-emerald-600 text-white py-6 rounded-[2.5rem] font-bold uppercase tracking-widest shadow-xl shadow-emerald-500/20">Broadcast Now</button>
               </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
