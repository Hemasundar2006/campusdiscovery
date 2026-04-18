import { useAuthContext } from '../context/AuthContext.jsx';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Dashboard() {
  const { user } = useAuthContext();
  const [activeTab, setActiveTab] = useState('overview');

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const stats = [
    { label: 'Events', value: '12', icon: '🎯' },
    { label: 'Wins', value: '03', icon: '🏆' },
    { label: 'RSVPs', value: '08', icon: '📫' },
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex">
      {/* Side Navigation */}
      <motion.aside 
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        className="w-80 bg-white border-r border-gray-100 hidden lg:flex flex-col p-10 pt-32 fixed inset-y-0"
      >
        <div className="space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: '🏠' },
            { id: 'events', label: 'My events', icon: '✨' },
            { id: 'achievements', label: 'Victories', icon: '👑' },
            { id: 'settings', label: 'Account Settings', icon: '⚙️', link: '/profile/edit' },
          ].map((item) => (
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

        <div className="mt-auto">
          <div className="bg-emerald-50 p-6 rounded-[2rem]">
             <p className="text-[10px] font-black uppercase text-emerald-600 mb-2">Campus Pro</p>
             <p className="text-xs font-bold text-emerald-900 leading-relaxed">Upgrade to host unlimited fests.</p>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-80 p-8 lg:p-20 pt-32">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-emerald-600 mb-4">Command Center</h2>
            <h1 className="text-6xl font-black tracking-tighter uppercase italic">{user.name.split(' ')[0]}<span className="text-gray-200">.</span></h1>
          </div>
          <div className="flex gap-4">
            <Link to="/achievements/post" className="bg-black text-white px-8 py-5 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">Submit Win</Link>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stats.map((s, i) => (
             <div key={i} className="bg-white rounded-[3rem] p-10 border border-gray-100 relative overflow-hidden group shadow-sm hover:shadow-2xl transition-all">
                <div className="absolute top-0 right-0 p-8 text-4xl opacity-20 group-hover:opacity-100 transition-opacity">{s.icon}</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{s.label}</p>
                <p className="text-5xl font-black tracking-tighter">{s.value}</p>
             </div>
          ))}
        </section>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* Recent Activity Card */}
          <div className="bg-white rounded-[3.5rem] p-12 shadow-sm border border-gray-50">
             <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-black uppercase tracking-tighter italic">Recent Discovery</h3>
                <span className="text-[10px] font-black text-emerald-500 uppercase">Live Feed</span>
             </div>
             
             <div className="space-y-8">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-center gap-6 group cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all text-2xl">🎪</div>
                    <div>
                      <h4 className="font-bold text-gray-800">TechnoFest 2024</h4>
                      <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">RSVP Confirmed • 2h ago</p>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* User Bio Card */}
          <div className="bg-emerald-600 rounded-[4rem] p-12 text-white relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 text-9xl opacity-10 pointer-events-none">✨</div>
             <div className="relative z-10">
                <h3 className="text-xl font-black uppercase tracking-tighter italic mb-8">My Legacy</h3>
                <p className="text-emerald-100 text-lg font-medium leading-relaxed mb-10 italic">
                  "{user.bio || 'Building a campus experience redefined by technology and community discovery.'}"
                </p>
                <div className="flex gap-4">
                  <Link to="/profile/edit" className="bg-white text-emerald-600 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest">Edit Profile</Link>
                </div>
             </div>
          </div>
        </section>
      </main>
    </div>
  );
}
