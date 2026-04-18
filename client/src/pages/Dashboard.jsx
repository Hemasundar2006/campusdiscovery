import { useAuthContext } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../services/api.jsx';

export default function Dashboard() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const stats = [
    { label: 'Participations', value: liveData.rsvps.length, icon: '🎯' },
    { label: 'Wins', value: liveData.achievements.length, icon: '🏆' },
    { label: 'Fests', value: liveData.rsvps.filter(r => new Date(r.event.date) >= new Date()).length, icon: '📫' },
  ];

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'events', label: 'My events', icon: '✨' },
    { id: 'achievements', label: 'Victories', icon: '👑' },
    { id: 'settings', label: 'Profile', icon: '⚙️', link: '/profile/edit' },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex flex-col lg:flex-row pt-20">
      {/* Side Navigation (Desktop) */}
      <motion.aside 
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className="w-80 bg-white border-r border-gray-100 hidden lg:flex flex-col p-10 pt-16 fixed inset-y-0"
      >
        <div className="space-y-2">
          {menuItems.map((item) => (
            item.link ? (
              <Link
                key={item.id}
                to={item.link}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-400 font-bold uppercase text-[10px] tracking-widest hover:bg-gray-50 transition-all"
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ) : (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all ${
                  activeTab === item.id ? 'bg-black text-white shadow-xl shadow-black/20' : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            )
          ))}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-80 p-6 md:p-12 lg:p-20">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 lg:mb-16">
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mb-2">Live Status</h2>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
              {user.name.split(' ')[0]}<span className="text-emerald-500">.</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <Link to="/achievements/post" className="flex-1 md:flex-none text-center bg-black text-white px-8 py-4 md:py-5 rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Submit Win</Link>
          </div>
        </header>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 lg:mb-16">
          {stats.map((s, i) => (
             <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-gray-100 flex items-center justify-between group shadow-sm hover:shadow-xl transition-all">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">{s.label}</p>
                  <p className="text-4xl font-black tracking-tighter">
                    {liveData.loading ? '...' : String(s.value).padStart(2, '0')}
                  </p>
                </div>
                <div className="text-3xl opacity-20 group-hover:opacity-100 transition-opacity">{s.icon}</div>
             </div>
          ))}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-12">
          {/* Recent Activity Card */}
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-50">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter italic">Live Feed</h3>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Global Activity</span>
             </div>
             
             <div className="space-y-6">
                {liveData.rsvps.length > 0 ? (
                  liveData.rsvps.slice(0, 3).map((rsvp) => (
                    <div key={rsvp._id} className="flex items-center gap-4 group cursor-pointer">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all">🎪</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-800 truncate">{rsvp.event.title}</h4>
                        <p className="text-[9px] font-medium text-gray-400 uppercase tracking-widest truncate">{new Date(rsvp.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 font-bold italic text-sm">Join a fest to see activity.</p>
                )}
             </div>
          </div>

          {/* User Bio Card */}
          <div className="bg-emerald-600 rounded-[3rem] p-8 md:p-12 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 text-7xl opacity-10 pointer-events-none">✨</div>
             <div className="relative z-10">
                <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter italic mb-6">Identity</h3>
                <p className="text-emerald-50 text-base md:text-lg font-medium leading-relaxed mb-10 italic">
                  "{user.bio || 'Representing my campus with excellence and discovery.'}"
                </p>
                <div className="flex">
                  <Link to="/profile/edit" className="bg-white text-emerald-600 px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl shadow-black/10">Edit Profile</Link>
                </div>
             </div>
          </div>
        </section>
      </main>

      {/* Mobile Quick-Navigation */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50 flex items-center justify-center">
        <div className="bg-black/90 backdrop-blur-xl rounded-full px-8 py-4 flex gap-8 shadow-2xl shadow-black/40">
           {menuItems.slice(0, 3).map((item) => (
             <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={`text-xl transition-all ${activeTab === item.id ? 'scale-125' : 'opacity-40'}`}
             >
               {item.icon}
             </button>
           ))}
        </div>
      </div>
    </div>
  );
}
