import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthContext } from '../context/AuthContext.jsx';
import api from '../services/api.jsx';

export default function EditProfile() {
  const { user, login } = useAuthContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: '',
    socialLinks: {
      instagram: '',
      linkedin: '',
      website: '',
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
        socialLinks: {
          instagram: user.socialLinks?.instagram || '',
          linkedin: user.socialLinks?.linkedin || '',
          website: user.socialLinks?.website || '',
        }
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { data } = await api.put('/auth/me', formData);
      if (data.success) {
        setSuccess(true);
        // We could refresh the user context here if needed, 
        // usually the AuthContext useEffect will catch up on next mount or we can force it
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12">
          <button onClick={() => navigate(-1)} className="text-[10px] font-black uppercase text-emerald-600 mb-4 hover:tracking-widest transition-all">← Back to discovery</button>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">Refine <span className="text-emerald-600">Profile</span></h1>
        </header>

        {error && <div className="p-4 bg-red-50 text-red-500 rounded-2xl mb-8 font-bold text-sm border border-red-100">{error}</div>}
        {success && <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl mb-8 font-bold text-sm border border-emerald-100">Profile updated successfully!</div>}

        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Profile Image URL</label>
            <input 
              value={formData.avatar}
              onChange={(e) => setFormData({...formData, avatar: e.target.value})}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-bold"
              placeholder="https://image-link.com/photo.jpg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Full Identity</label>
            <input 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-bold"
              placeholder="Display Name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Campus Bio</label>
            <textarea 
              value={formData.bio}
              onChange={(e) => setFormData({...formData, bio: e.target.value})}
              rows="4"
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-bold resize-none"
              placeholder="What defines your campus experience?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 ml-4">Instagram URL</label>
              <input 
                value={formData.socialLinks.instagram}
                onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, instagram: e.target.value}})}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-bold"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 ml-4">LinkedIn URL</label>
              <input 
                value={formData.socialLinks.linkedin}
                onChange={(e) => setFormData({...formData, socialLinks: {...formData.socialLinks, linkedin: e.target.value}})}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-[2rem] px-8 py-5 focus:border-emerald-500 outline-none transition-all font-bold"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-black text-white py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] hover:bg-emerald-600 transition-all text-sm"
          >
            {loading ? 'Propagating Changes...' : 'Save Configuration'}
          </button>
        </form>
      </div>
    </div>
  );
}
