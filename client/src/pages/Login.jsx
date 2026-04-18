import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useAuth from '../hooks/useAuth.jsx';

export default function Login() {
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
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen bg-white relative flex items-center justify-center px-6 overflow-hidden'>
      {/* 3D Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 100, 0], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-50 rounded-[4rem] opacity-40 blur-3xl" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -100, 0], rotate: [0, -45, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -bottom-20 -right-20 w-[30rem] h-[30rem] bg-emerald-100/30 rounded-full blur-3xl" 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30rem] font-black text-gray-50/50 uppercase select-none z-0">
          LOGIN
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='relative z-10 w-full max-w-lg bg-white/70 backdrop-blur-2xl border-2 border-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3rem] p-12 md:p-16'
      >
        <div className='text-center mb-12'>
          <h1 className='text-5xl font-black uppercase tracking-tighter mb-4'>Welcome <span className='text-emerald-600'>Back</span></h1>
          <p className='text-gray-500 font-medium'>Access your campus discovery account</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className='mb-8 p-4 bg-red-50 text-red-500 text-sm font-bold rounded-2xl border border-red-100 text-center'
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className='space-y-6'>
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

          <div className='space-y-2'>
            <label className='text-[10px] font-black uppercase tracking-widest text-emerald-600 ml-4'>Password</label>
            <input 
              type='password' 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder='••••••••' 
              className='w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-bold' 
              required 
            />
          </div>
          
          <div className="relative py-4 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <a 
            href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/google`}
            className='w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-100 py-4 rounded-[2rem] font-bold hover:border-emerald-500 transition-all group'
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.79 1.7L20.3 3.3C18.15 1.25 15.28 0 12 0 7.46 0 3.57 2.58 1.64 6.36l4.07 3.16c.92-2.76 3.48-4.48 6.29-4.48z"/>
              <path fill="#4285F4" d="M23.49 12.27c0-.8-.07-1.56-.19-2.3H12v4.35h6.44c-.28 1.48-1.13 2.73-2.4 3.58l3.73 2.88c2.18-2.01 3.44-4.97 3.44-8.51z"/>
              <path fill="#34A853" d="M5.71 14.12c-.24-.71-.37-1.46-.37-2.24s.13-1.53.37-2.24L1.64 6.36C.6 8.5 0 10.9 0 13.5c0 2.6.6 5 1.64 7.14l4.07-3.16z"/>
              <path fill="#FBBC05" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.73-2.88c-1.1.74-2.5 1.18-4.2 1.18-3.23 0-5.97-2.18-6.95-5.11L1.64 20.64C3.57 24.42 7.46 27 12 27z" transform="scale(.888)"/>
            </svg>
            <span className='group-hover:text-emerald-600 transition-colors uppercase text-sm tracking-wider'>Continue with Google</span>
          </a>

          <button 
            disabled={loading}
            className='w-full btn-primary py-5 text-lg uppercase tracking-widest mt-4'
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className='mt-10 text-center border-t border-gray-100 pt-8'>
          <p className='text-gray-500 font-medium'>
            Don't have an account? {' '}
            <Link to='/register' className='text-black font-black uppercase tracking-wider hover:text-emerald-600 transition-colors'>
              Create Experience
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
