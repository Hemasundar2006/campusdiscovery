import { useAuthContext } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api.jsx';

export default function Dashboard() {
  const { user } = useAuthContext();
  const [isHovered, setIsHovered] = useState(false);
  const [liveData, setLiveData] = useState({
    rsvps: [],
    achievements: [],
    loading: true
  });

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [rsvpRes, achRes] = await Promise.all([
            api.get('/rsvp/my'),
            api.get(`/achievements?user=${user._id}`)
          ]);
          setLiveData({
            rsvps: rsvpRes.data.rsvps || [],
            achievements: achRes.data.achievements || [],
            loading: false
          });
        } catch (err) {
          setLiveData(prev => ({ ...prev, loading: false }));
        }
      };
      fetchData();
    }
  }, [user]);

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const stats = [
    { label: 'Participations', value: liveData.rsvps.length, icon: '🎯' },
    { label: 'Victories', value: liveData.achievements.length, icon: '🏆' },
    { label: 'Upcoming', value: liveData.rsvps.filter(r => new Date(r.event.date) >= new Date()).length, icon: '📫' },
  ];

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '🏠', path: '/dashboard' },
    { id: 'achievements', label: 'My Victories', icon: '👑', path: '/achievements/post' },
    { id: 'settings', label: 'Profile Settings', icon: '⚙️', path: '/profile/edit' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex pt-24">
      {/* Interactive Collapsible Sidebar (Desktop) */}
      <motion.aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ width: isHovered ? 280 : 88 }}
        className="bg-white border-r border-slate-100 hidden lg:flex flex-col p-4 pt-12 fixed inset-y-24 left-6 rounded-[3rem] shadow-2xl shadow-slate-200/50 z-[110] transition-all duration-500 ease-in-out"
      >
        <div className="flex flex-col items-center gap-10">
          {/* User Small Avatar */}
          <div className="relative">
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`} 
              className="w-12 h-12 rounded-2xl object-cover shadow-lg"
              alt="User"
            />
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} 
                animate={{ opacity: 1, x: 0 }}
                className="absolute left-16 top-1 text-left whitespace-nowrap"
              >
                <p className="font-bold text-sm leading-none">{user.name.split(' ')[0]}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified User</p>
              </motion.div>
            )}
          </div>

          <div className="w-full space-y-4 px-2">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-4 p-4 rounded-[1.5rem] transition-all group ${
                  item.id === 'overview' ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/30' : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                {isHovered && (
                  <motion.span 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="font-bold text-[11px] uppercase tracking-widest"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-0 lg:ml-32 p-6 md:p-12 lg:p-20 overflow-x-hidden">
        <header className="mb-16">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-emerald-600 mb-2">My Experience</h2>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
            Welcome back, {user.name.split(' ')[0]}<span className="text-emerald-500 italic">.</span>
          </h1>
        </header>

        {/* NEW: Quick Post Section */}
        <section className="bg-white rounded-[3rem] p-8 md:p-10 mb-16 border border-slate-50 flex flex-col md:flex-row items-center gap-8 shadow-sm">
           <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center text-3xl">🗓️</div>
           <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold tracking-tight text-slate-800 mb-1">Know an upcoming fest?</h3>
              <p className="text-slate-400 text-sm font-medium">Broadcast event details, competitions, and fests to the whole campus.</p>
           </div>
           <Link to="/events/create" className="bg-slate-900 text-white px-10 py-5 rounded-full font-bold text-sm tracking-tight shadow-xl shadow-slate-900/10 hover:bg-emerald-600 transition-all">
             Share Event
           </Link>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
          {stats.map((s, i) => (
             <div key={i} className="bg-white rounded-[2.5rem] p-10 border border-slate-50 flex items-center justify-between group hover:shadow-2xl transition-all duration-500">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
                  <p className="text-5xl font-semibold tracking-tighter text-slate-900">
                    {liveData.loading ? '...' : String(s.value).padStart(2, '0')}
                  </p>
                </div>
                <div className="text-3xl opacity-20 group-hover:opacity-100 transition-all">{s.icon}</div>
             </div>
          ))}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* Feed Card */}
          <div className="bg-white rounded-[3.5rem] p-12 shadow-sm border border-slate-50">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-semibold tracking-tight italic">My Discovery Feed</h3>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Live Activity</span>
             </div>
             
             <div className="space-y-8">
                {liveData.rsvps.length > 0 ? (
                  liveData.rsvps.slice(0, 3).map((rsvp) => (
                    <div key={rsvp._id} className="flex items-center gap-6 p-2 rounded-[2rem] hover:bg-slate-50 transition-all cursor-pointer">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">🎪</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 truncate">{rsvp.event.title}</h4>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{new Date(rsvp.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-500">Joined</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 font-medium italic">Your campus journey starts here. Explore a fest!</p>
                )}
             </div>
          </div>

          {/* Identity Card */}
          <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl" />
             <div className="relative z-10">
                <h3 className="text-xl font-semibold tracking-tight italic mb-8">Personal Records</h3>
                <p className="text-slate-400 text-lg font-medium leading-relaxed mb-10 italic">
                  "{user.bio || 'Your campus legacy is defined by the moments you choose to capture and share.'}"
                </p>
                <Link to="/profile/edit" className="inline-block bg-white text-slate-900 px-10 py-4 rounded-full text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">Update Identity</Link>
             </div>
          </div>
        </section>
      </main>

      {/* Mobile Feed Nav */}
      <div className="lg:hidden fixed bottom-8 left-8 right-8 z-[200] flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-2xl border border-slate-100 rounded-full px-10 py-5 flex gap-12 shadow-2xl">
           {stats.map((s, i) => (
             <span key={i} className="text-xl grayscale opacity-40">{s.icon}</span>
           ))}
        </div>
      </div>
    </div>
  );
}
