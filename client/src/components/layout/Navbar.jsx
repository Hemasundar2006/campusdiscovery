import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = user ? [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Hall of Fame', path: '/' },
    ...(user.role === 'admin' ? [{ label: 'Admin', path: '/admin' }] : []),
  ] : [
    { label: 'Marketplace', path: '/' },
    { label: 'Sign In', path: '/login' },
    { label: 'Get Started', path: '/register', primary: true },
  ];

  return (
    <>
      <header className='fixed top-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-b border-slate-100'>
        <nav className='max-w-7xl mx-auto px-6 py-5 flex items-center justify-between'>
          <Link to='/' className='text-2xl font-bold tracking-tight text-slate-900'>
            Campus<span className='text-emerald-600 font-light'>Discovery</span>
          </Link>

          {/* Desktop Nav */}
          <div className='hidden md:flex items-center gap-10 text-[13px] font-semibold tracking-wide'>
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                className={link.primary ? 'btn-primary py-2 px-6' : 'text-slate-500 hover:text-emerald-600 transition-colors'}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <button onClick={logout} className='text-slate-400 hover:text-red-500 transition-colors'>Logout</button>
            )}
          </div>

          {/* Mobile Toggle */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <motion.span animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }} className="w-6 h-0.5 bg-slate-900 block" />
            <motion.span animate={{ opacity: isOpen ? 0 : 1 }} className="w-6 h-0.5 bg-slate-900 block" />
            <motion.span animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }} className="w-6 h-0.5 bg-slate-900 block" />
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[90] bg-white/98 backdrop-blur-2xl flex items-center justify-center md:hidden"
          >
            <div className="flex flex-col gap-10 text-center">
              {navLinks.map((link, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={link.path}
                >
                  <Link 
                    to={link.path} 
                    onClick={() => setIsOpen(false)}
                    className="text-4xl font-bold tracking-tight hover:text-emerald-600 transition-all"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              {user && (
                <button onClick={() => { logout(); setIsOpen(false); }} className="text-red-500 font-bold text-xl">Sign Out</button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
