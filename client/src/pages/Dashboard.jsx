import { useAuthContext } from '../context/AuthContext.jsx';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuthContext();

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-24 px-6 md:px-12 relative overflow-hidden">
      {/* 3D Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-50 -mr-48 -mt-48" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row items-center gap-8 mb-16"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-black rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <img 
              src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=10b981&color=fff`} 
              alt={user.name} 
              className="relative w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover"
            />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">
              Hello, <span className="text-emerald-600">{user.name.split(' ')[0]}</span>
            </h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm flex items-center justify-center md:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {user.role} Account • {user.email}
            </p>
          </div>
          <div className="md:ml-auto flex gap-4">
             <Link to="/achievements/post" className="btn-primary py-4 px-8 text-sm uppercase tracking-widest">
               Post Victory
             </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Activity Stast */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {[
              { label: 'Event Participations', value: '12', icon: '🎯' },
              { label: 'Wins Recorded', value: '03', icon: '🏆' },
              { label: 'Fest RSVPs', value: '08', icon: '📫' },
              { label: 'Discovery Points', value: '250', icon: '⚡' },
            ].map((stat, i) => (
              <div key={i} className="bg-white border-2 border-gray-100 p-8 rounded-[2.5rem] hover:border-emerald-500 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 group">
                <span className="text-4xl mb-4 block group-hover:scale-125 transition-transform duration-500">{stat.icon}</span>
                <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-4xl font-black tracking-tighter">{stat.value}</p>
              </div>
            ))}
          </motion.div>

          {/* Sidebar Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-black p-10 rounded-[3rem] text-white overflow-hidden relative group">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
              <h2 className="text-xl font-black uppercase tracking-widest mb-6 relative z-10">Campus Bio</h2>
              <p className="text-gray-400 leading-relaxed font-medium relative z-10 italic">
                "{user.bio || 'Representing my campus with excellence and discovery. Passionate about tech fests and networking.'}"
              </p>
              <button className="mt-8 text-emerald-400 text-xs font-black uppercase tracking-widest hover:text-white transition-colors">Edit Profile →</button>
            </div>

            <div className="bg-gray-50 p-10 rounded-[3rem] border-2 border-dashed border-gray-200">
               <h2 className="text-xl font-black uppercase tracking-widest mb-4">Quick Links</h2>
               <div className="space-y-4">
                 <Link to="/" className="block text-sm font-bold text-gray-600 hover:text-emerald-600">→ Browse Active Fests</Link>
                 <Link to="/achievements/post" className="block text-sm font-bold text-gray-600 hover:text-emerald-600">→ Submit Achievement</Link>
                 <a href="#" className="block text-sm font-bold text-gray-600 hover:text-emerald-600">→ Manage My RSVPs</a>
               </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
