import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth.jsx';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(email, password);
      // Explicit check for admin role
      if (res.user.role === 'admin') {
        navigate('/admin');
      } else {
        setError('Access Denied: You do not have administrative privileges.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-black relative flex items-center justify-center px-6 overflow-hidden'>
      {/* Matrix-style Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
        <div className="grid grid-cols-12 gap-1 h-full w-full">
          {[...Array(144)].map((_, i) => (
            <motion.div 
              key={i} 
              animate={{ opacity: [0.1, 0.5, 0.1] }}
              transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
              className="bg-emerald-500/20 h-24 w-full" 
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className='relative z-20 w-full max-w-lg bg-zinc-900/50 backdrop-blur-3xl border border-emerald-500/30 rounded-[3rem] p-12 md:p-16 shadow-[0_0_100px_rgba(16,185,129,0.1)]'
      >
        <div className='text-center mb-12'>
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-emerald-500/20">
             <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
             </svg>
          </div>
          <h1 className='text-4xl font-black uppercase tracking-tighter text-white mb-2'>Admin <span className='text-emerald-500'>Portal</span></h1>
          <p className='text-zinc-500 font-bold uppercase tracking-widest text-[10px]'>Authorized Personnel Only</p>
        </div>

        {error && (
          <div className='mb-8 p-4 bg-red-950/30 text-red-400 text-xs font-bold rounded-2xl border border-red-500/30 text-center'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <input 
              type='email' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder='ADMIN EMAIL' 
              className='w-full bg-black/50 border border-zinc-800 rounded-2xl px-8 py-5 text-white focus:border-emerald-500 outline-none transition-all font-bold placeholder:text-zinc-700' 
              required 
            />
          </div>

          <div className='space-y-2'>
            <input 
              type='password' 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder='SECURITY KEY' 
              className='w-full bg-black/50 border border-zinc-800 rounded-2xl px-8 py-5 text-white focus:border-emerald-500 outline-none transition-all font-bold placeholder:text-zinc-700' 
              required 
            />
          </div>

          <button 
            disabled={loading}
            className='w-full bg-emerald-600 text-black py-5 rounded-2xl font-black uppercase tracking-widest mt-4 hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10'
          >
            {loading ? 'Decrypting Access...' : 'Initialize Session'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
