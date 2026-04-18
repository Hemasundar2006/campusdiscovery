import { useAuthContext } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api.jsx';

export default function Dashboard() {
  const { user } = useAuthContext();
  const location = useLocation();
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
    { id: 'achievements', label: 'Victories', icon: '👑', path: '/achievements/post' },
    { id: 'settings', label: 'Identity', icon: '⚙️', path: '/profile/edit' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex pt-24">
      {/* Precision Floating Sidebar */}
      <motion.aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{ width: isHovered ? 260 : 80 }}
        className="fixed left-6 top-32 bottom-8 z-[200] bg-white border border-slate-100 hidden lg:flex flex-col items-center py-10 rounded-[3rem] shadow-2xl shadow-slate-200/50 overflow-hidden"
      >
        {/* Profile Head */}
        <div className="flex flex-col items-center w-full px-4 mb-12">
          <div className="relative">
             <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`} 
                className="w-12 h-12 rounded-2xl object-cover shadow-lg border-2 border-slate-50"
                alt="Avatar"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
          </div>
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 text-center overflow-hidden"
              >
                <p className="font-bold text-sm text-slate-800 whitespace-nowrap">{user.name}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Verified Member</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Core */}
        <div className="flex-1 w-full px-3 space-y-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`relative flex items-center h-14 rounded-2xl transition-all duration-300 group ${
                  isActive ? 'bg-emerald-50 text-emerald-600' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="w-14 flex items-center justify-center flex-shrink-0">
                  <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                </div>
                
                {isHovered && (
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="font-bold text-[11px] uppercase tracking-[0.1em] whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}

                {/* Active Indicator Bar */}
                {isActive && (
                  <motion.div 
                    layoutId="sidebarActive"
                    className="absolute left-0 w-1 h-6 bg-emerald-500 rounded-r-full" 
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* System Toggle */}
        <div className="w-full px-3">
           <button className="w-full h-14 flex items-center justify-center rounded-2xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all">
              <span className="text-xl">🚪</span>
              {isHovered && <span className="ml-4 font-bold text-[10px] uppercase tracking-widest">Logout</span>}
           </button>
        </div>
      </motion.aside>

      {/* MOBILE: Floating Bottom Rail */}
      <nav className="fixed bottom-6 left-6 right-6 z-[300] lg:hidden">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2.5rem] h-20 shadow-2xl flex items-center justify-around px-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 transition-all ${
                  isActive ? 'text-emerald-600 scale-110' : 'text-slate-400'
                }`}
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${isActive ? 'bg-emerald-50' : ''}`}>
                  <span className="text-xl">{item.icon}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
              </Link>
            );
          })}
          <button className="flex flex-col items-center justify-center gap-1 text-slate-400">
             <div className="w-10 h-10 flex items-center justify-center text-xl">🚪</div>
             <span className="text-[10px] font-bold uppercase tracking-widest">Exit</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 ml-0 lg:ml-28 p-6 md:p-12 lg:p-20 pb-32 lg:pb-20">
        <header className="mb-16">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-500 mb-2">Observatory Stats</h2>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-slate-900">
            Welcome, {user.name.split(' ')[0]}<span className="text-emerald-500 italic">.</span>
          </h1>
        </header>

        {/* Quick Event Submission */}
        <section className="bg-white rounded-[3rem] p-8 md:p-10 mb-16 border border-slate-50 flex flex-col md:flex-row items-center gap-10 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform">🗓️</div>
           <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-50 flex items-center justify-center text-3xl">🗓️</div>
           <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold tracking-tight text-slate-800 mb-1">Know an upcoming fest?</h3>
              <p className="text-slate-400 text-sm font-medium">Broadcast event details, competitions, and fests to the whole campus.</p>
           </div>
           <Link to="/events/create" className="bg-slate-900 text-white px-10 py-5 rounded-full font-bold text-sm tracking-tight shadow-xl shadow-slate-900/10 hover:bg-emerald-600 transition-all">
             Share Event
           </Link>
        </section>

        {/* Stats Pulse */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
          {stats.map((s, i) => (
             <div key={i} className="bg-white rounded-[2.5rem] p-10 border border-slate-50 flex items-center justify-between group hover:shadow-2xl transition-all duration-500">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
                  <p className="text-5xl font-semibold tracking-tighter text-slate-900">
                    {liveData.loading ? '...' : String(s.value).padStart(2, '0')}
                  </p>
                </div>
                <div className="text-3xl opacity-20 group-hover:opacity-100 transition-all scale-110 grayscale group-hover:grayscale-0">{s.icon}</div>
             </div>
          ))}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* Feed Card */}
          <div className="bg-white rounded-[3.5rem] p-12 shadow-sm border border-slate-50">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-semibold tracking-tight italic">Live Discovery</h3>
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Active Now</span>
             </div>
             
             <div className="space-y-6">
                {liveData.rsvps.length > 0 ? (
                  liveData.rsvps.slice(0, 3).map((rsvp) => (
                    <div key={rsvp._id} className="flex items-center gap-6 p-4 rounded-3xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">🎪</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 truncate">{rsvp.event.title}</h4>
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{new Date(rsvp.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-500 whitespace-nowrap">RSVP ✅</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 font-medium italic">Discover your first fest to see live updates.</p>
                )}
             </div>
          </div>

          {/* Achievements Record Card */}
          <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl opacity-50" />
             <div className="relative z-10">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-xl font-semibold tracking-tight italic">My Victories</h3>
                   <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Hall of Fame</span>
                </div>
                
                <div className="space-y-6">
                  {liveData.achievements.length > 0 ? (
                    liveData.achievements.slice(0, 3).map((ach) => (
                      <div key={ach._id} className="flex items-center gap-6 p-4 rounded-3xl bg-white/5 backdrop-blur-md border border-white/5 hover:bg-white/10 transition-all group">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                          {ach.rank.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-white truncate">{ach.title}</h4>
                          <p className="text-[10px] font-semibold text-emerald-500/60 uppercase tracking-widest truncate">{ach.event?.title || 'Campus Event'}</p>
                        </div>
                        <Link to="/achievements/post" className="opacity-0 group-hover:opacity-100 transition-opacity text-emerald-400">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                           </svg>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center">
                       <p className="text-slate-500 font-medium italic mb-6">No victories recorded yet.</p>
                       <Link to="/achievements/post" className="bg-emerald-600 text-white px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-all">Submit First Win</Link>
                    </div>
                  )}
                </div>
                
                {liveData.achievements.length > 0 && (
                  <div className="mt-10 pt-8 border-t border-white/5">
                    <Link to="/achievements/post" className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 hover:text-white transition-colors">Post new achievement →</Link>
                  </div>
                )}
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
