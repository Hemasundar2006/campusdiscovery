import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Force a reload or use AuthContext to sync state
      window.location.href = '/dashboard';
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-6" />
      <h1 className="text-2xl font-black uppercase tracking-tighter">Syncing your <span className="text-emerald-600">Account</span></h1>
      <p className="text-gray-400 font-medium mt-2">Connecting to Google Services...</p>
    </div>
  );
}
