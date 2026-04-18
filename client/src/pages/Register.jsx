import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth.jsx';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-white relative flex items-center justify-center px-6 overflow-hidden py-24'>
      {/* 3D Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 80, 0], rotate: [0, -60, 0] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -top-32 -right-20 w-[35rem] h-[35rem] bg-emerald-50 rounded-[6rem] opacity-30 blur-3xl" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 45, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute bottom-1/4 left-0 w-80 h-80 bg-emerald-100/20 rounded-full blur-3xl" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-black text-gray-50 uppercase select-none z-0 tracking-tighter">
          JOIN US
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className='relative z-10 w-full max-w-2xl bg-white/80 backdrop-blur-3xl border-2 border-white shadow-[0_48px_80px_-16px_rgba(0,0,0,0.08)] rounded-[3.5rem] p-12 md:p-20'
      >
        <div className='mb-12'>
          <h1 className='text-5xl font-black uppercase tracking-tighter mb-4'>Start Your <span className='text-emerald-600'>Journey</span></h1>
          <p className='text-gray-500 font-medium'>Create an account to discover, share, and lead campus life.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            className='mb-8 p-5 bg-red-50 text-red-500 text-sm font-bold rounded-2xl border border-red-100'
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='space-y-2'>
              <label className='text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-4'>Full Name</label>
              <input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder='John Doe' 
                className='w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-bold' 
                required 
              />
            </div>
            <div className='space-y-2'>
              <label className='text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-4'>Email Address</label>
              <input 
                type='email' 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder='your@email.com' 
                className='w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-bold' 
                required 
              />
            </div>
          </div>

          <div className='space-y-2'>
            <label className='text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-4'>Create Password</label>
            <input 
              type='password' 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder='••••••••' 
              className='w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-bold' 
              required 
            />
          </div>
          
          <div className="relative py-2 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button 
            type="button"
            onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'https://campusdiscovery.onrender.com/api'}/auth/google`}
            className='w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-100 py-4 rounded-[2rem] font-bold hover:border-emerald-500 transition-all group'
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.79 1.7L20.3 3.3C18.15 1.25 15.28 0 12 0 7.46 0 3.57 2.58 1.64 6.36l4.07 3.16c.92-2.76 3.48-4.48 6.29-4.48z"/>
              <path fill="#4285F4" d="M23.49 12.27c0-.8-.07-1.56-.19-2.3H12v4.35h6.44c-.28 1.48-1.13 2.73-2.4 3.58l3.73 2.88c2.18-2.01 3.44-4.97 3.44-8.51z"/>
              <path fill="#34A853" d="M5.71 14.12c-.24-.71-.37-1.46-.37-2.24s.13-1.53.37-2.24L1.64 6.36C.6 8.5 0 10.9 0 13.5c0 2.6.6 5 1.64 7.14l4.07-3.16z"/>
              <path fill="#FBBC05" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.73-2.88c-1.1.74-2.5 1.18-4.2 1.18-3.23 0-5.97-2.18-6.95-5.11L1.64 20.64C3.57 24.42 7.46 27 12 27z" transform="scale(.888)"/>
            </svg>
            <span className='group-hover:text-emerald-600 transition-colors uppercase text-sm tracking-wider'>Join with Google</span>
          </button>

          <div className='pt-4'>
            <button 
              disabled={loading}
              className='w-full btn-primary py-6 text-xl uppercase tracking-widest shadow-2xl shadow-emerald-500/20'
            >
              {loading ? 'Creating Experience...' : 'Join Discovery'}
            </button>
          </div>
        </form>

        <div className='mt-12 text-center border-t border-gray-100 pt-10'>
          <p className='text-gray-500 font-medium'>
            Already a member? {' '}
            <Link to='/login' className='text-black font-black uppercase tracking-wider hover:text-emerald-600 transition-colors'>
              Login Here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
