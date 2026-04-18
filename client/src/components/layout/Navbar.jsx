import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = user ? [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Achievements', path: '/achievements/post' },
    ...(user.role === 'admin' ? [{ label: 'Admin', path: '/admin' }] : []),
  ] : [
    { label: 'Login', path: '/login' },
    { label: 'Register', path: '/register', primary: true },
  ];

  return (
    <>
      <header className='fixed top-0 left-0 right-0 z-[100] bg-white/70 backdrop-blur-xl border-b border-gray-100'>
        <nav className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
          <Link to='/' className='text-xl lg:text-2xl font-black tracking-tighter text-black'>
            CAMPUS<span className='text-emerald-600'>DISCOVERY</span>
          </Link>

          {/* Desktop Nav */}
          <div className='hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest'>
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={link.primary ? 'px-6 py-2 rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-900 hover:text-emerald-600 transition-colors'}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <button onClick={logout} className='text-red-500 hover:tracking-[0.2em] transition-all'>Logout</button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <motion.span animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }} className="w-6 h-0.5 bg-black block" />
            <motion.span animate={{ opacity: isOpen ? 0 : 1 }} className="w-6 h-0.5 bg-black block" />
            <motion.span animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }} className="w-6 h-0.5 bg-black block" />
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[90] bg-white pt-32 px-10 md:hidden"
          >
            <div className="flex flex-col gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={link.path}
                >
                  <Link 
                    to={link.path} 
                    onClick={() => setIsOpen(false)}
                    className="text-4xl font-black uppercase tracking-tighter italic hover:text-emerald-600 transition-all"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {user && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => { logout(); setIsOpen(false); }}
                  className="text-red-500 text-left text-xl font-black uppercase tracking-widest mt-4"
                >
                  Logout
                </motion.button>
              )}
            </div>
            
            <div className="absolute bottom-20 left-10">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">© 2026 Discovery</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
