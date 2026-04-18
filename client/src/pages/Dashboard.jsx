import { useAuthContext } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api.jsx';

export default function Dashboard() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('discovery'); // 'discovery' or 'manage'
  const [isHovered, setIsHovered] = useState(false);
  const [liveData, setLiveData] = useState({
    rsvps: [],
    achievements: [],
    myEvents: [],
    loading: true
  });

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

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to remove this event broadcast?')) {
      try {
        await api.delete(`/events/${id}`);
        setLiveData(prev => ({
          ...prev,
          myEvents: prev.myEvents.filter(e => e._id !== id)
        }));
      } catch (err) { alert('Failed to delete event'); }
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-2 border-emerald-500 animate-spin rounded-full" /></div>;

  const stats = [
    { label: 'Participations', value: liveData.rsvps.length, icon: '🎯' },
    { label: 'Victories', value: liveData.achievements.length, icon: '🏆' },
    { label: 'My Broadcasts', value: liveData.myEvents.length, icon: '📡' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex pt-24">
      {/* Sidebar */}
      <motion.aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ width: isHovered ? 260 : 80 }}
        className="fixed left-6 top-32 bottom-8 z-[200] bg-white border border-slate-100 hidden lg:flex flex-col items-center py-10 rounded-[3rem] shadow-2xl overflow-hidden"
      >
        <div className="flex flex-col items-center w-full px-4 mb-12">
           <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} className="w-12 h-12 rounded-2xl object-cover" />
        </div>

        <div className="flex-1 w-full px-3 space-y-3">
           <button onClick={() => setActiveTab('discovery')} className={`w-full h-14 rounded-2xl flex items-center transition-all ${activeTab === 'discovery' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400'}`}>
              <div className="w-14 flex items-center justify-center text-xl">🏠</div>
              {isHovered && <span className="font-bold text-[11px] uppercase tracking-widest leading-none mt-1">Discovery</span>}
           </button>
           <button onClick={() => setActiveTab('manage')} className={`w-full h-14 rounded-2xl flex items-center transition-all ${activeTab === 'manage' ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400'}`}>
              <div className="w-14 flex items-center justify-center text-xl">🛡️</div>
              {isHovered && <span className="font-bold text-[11px] uppercase tracking-widest leading-none mt-1">Manage</span>}
           </button>
           <Link to="/events/create" className="w-full h-14 rounded-2xl flex items-center text-slate-400 hover:bg-slate-50 transition-all">
              <div className="w-14 flex items-center justify-center text-xl">✨</div>
              {isHovered && <span className="font-bold text-[11px] uppercase tracking-widest mt-1">Broadcast</span>}
           </Link>
           <Link to="/achievements/post" className="w-full h-14 rounded-2xl flex items-center text-slate-400 hover:bg-slate-50 transition-all">
              <div className="w-14 flex items-center justify-center text-xl">👑</div>
              {isHovered && <span className="font-bold text-[11px] uppercase tracking-widest mt-1">Victories</span>}
           </Link>
           <Link to="/admin-login" className="w-full h-14 rounded-2xl flex items-center text-slate-200 hover:text-emerald-500 transition-all group">
              <div className="w-14 flex items-center justify-center text-xl">🤫</div>
              {isHovered && <span className="font-bold text-[9px] uppercase tracking-[0.2em] opacity-40 group-hover:opacity-100 transition-opacity mt-1">Staff</span>}
           </Link>
        </div>
      </motion.aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-6 left-6 right-6 z-[300] lg:hidden">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] h-20 shadow-2xl flex items-center justify-around px-4">
           <button onClick={() => setActiveTab('discovery')} className={`flex flex-col items-center ${activeTab === 'discovery' ? 'text-emerald-600' : 'text-slate-400'}`}>
              <span className="text-xl">🏠</span>
              <span className="text-[9px] font-bold uppercase tracking-widest">Feed</span>
           </button>
           <Link to="/events/create" className="flex flex-col items-center text-slate-400">
              <span className="text-xl">✨</span>
              <span className="text-[9px] font-bold uppercase tracking-widest">Post</span>
           </Link>
           <Link to="/achievements/post" className="flex flex-col items-center text-slate-400">
              <span className="text-xl">👑</span>
              <span className="text-[9px] font-bold uppercase tracking-widest">Win</span>
           </Link>
           <button onClick={() => setActiveTab('manage')} className={`flex flex-col items-center ${activeTab === 'manage' ? 'text-emerald-600' : 'text-slate-400'}`}>
              <span className="text-xl">🛡️</span>
              <span className="text-[9px] font-bold uppercase tracking-widest">Mine</span>
           </button>
        </div>
      </nav>

      <main className="flex-1 ml-0 lg:ml-28 p-6 md:p-12 lg:p-20 pb-32 lg:pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'discovery' ? (
            <motion.div key="discovery" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
               <header className="mb-12"><h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Welcome Area.</h1></header>
               <section className="bg-white rounded-[3rem] p-8 md:p-10 mb-12 border border-slate-50 flex flex-col md:flex-row items-center gap-10">
                  <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center text-3xl">🗓️</div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold text-slate-800">Share some fests?</h3>
                    <p className="text-slate-400 text-sm font-medium">Broadcast event details to the whole campus.</p>
                  </div>
                  <Link to="/events/create" className="bg-slate-900 text-white px-10 py-5 rounded-full font-bold text-sm tracking-tight shadow-xl shadow-slate-900/10 hover:bg-emerald-600 transition-all">Broadcast Event</Link>
               </section>
               <section className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  {stats.map((s,i)=>(
                    <div key={i} className="bg-white rounded-[2.5rem] p-10 border border-slate-50 flex items-center justify-between">
                       <div><p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">{s.label}</p><p className="text-5xl font-semibold tracking-tighter">{String(s.value).padStart(2,'0')}</p></div>
                       <div className="text-3xl opacity-20">{s.icon}</div>
                    </div>
                  ))}
               </section>
            </motion.div>
          ) : (
            <motion.div key="manage" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
               <header className="mb-12"><h2 className="text-4xl font-semibold tracking-tight">Manage Your Broadcasts.</h2></header>
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
        </AnimatePresence>
      </main>
    </div>
  );
}
