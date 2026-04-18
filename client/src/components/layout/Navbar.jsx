import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className='fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100'>
      <nav className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
        <Link to='/' className='text-2xl font-black tracking-tighter text-black'>
          CAMPUS<span className='text-emerald-600'>DISCOVERY</span>
        </Link>
        <div className='flex items-center gap-6 text-sm font-semibold uppercase tracking-wider'>
          {user ? (
            <>
              <Link to='/dashboard' className='text-black hover:text-emerald-600 transition-colors'>Dashboard</Link>
              {user.role === 'admin' && <Link to='/admin' className='text-black hover:text-emerald-600 transition-colors'>Admin</Link>}
              <button onClick={logout} className='px-5 py-2 rounded-full bg-black text-white hover:bg-emerald-700 transition-all'>Logout</button>
            </>
          ) : (
            <>
              <Link to='/login' className='text-black hover:text-emerald-600 transition-colors'>Login</Link>
              <Link to='/register' className='px-6 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-all shadow-md shadow-emerald-500/20'>Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
