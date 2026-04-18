import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api.jsx';
import { formatDate } from '../utils/formatDate.jsx';
import CommentList from '../components/comments/CommentList.jsx';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/events/${id}`),
      api.get(`/events/${id}/comments`)
    ]).then(([evtRes, comRes]) => {
      setEvent(evtRes.data.event);
      setComments(comRes.data.comments || []);
    }).catch(err => {
      console.error(err);
      setEvent(null);
    }).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className='min-h-screen flex items-center justify-center bg-white'>
      <div className='w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin' />
    </div>
  );

  if (!event) return (
    <div className='min-h-screen flex items-center justify-center bg-white'>
      <div className='text-center'>
        <h1 className='text-4xl font-black mb-4'>EVENT NOT <span className='text-emerald-600'>FOUND</span></h1>
        <Link to="/" className='text-black font-bold underline hover:text-emerald-600'>Back to Home</Link>
      </div>
    </div>
  );

  return (
    <div className='bg-white text-black pt-32 pb-24'>
      <div className='max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16'>
        
        {/* Main Content */}
        <div className='lg:col-span-2 space-y-12'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='space-y-6'
          >
            <div className='flex items-center gap-3'>
               <span className='px-4 py-1 bg-emerald-100 text-emerald-700 text-xs font-black uppercase tracking-widest rounded-full'>
                 {event.category}
               </span>
               <span className='text-gray-400 font-bold text-sm uppercase'>
                 Posted by {event.organiser?.name || 'Anonymous'}
               </span>
            </div>
            <h1 className='text-5xl md:text-7xl font-black uppercase tracking-tighter leading-tight'>
              {event.title}
            </h1>
            <p className='text-xl text-gray-500 font-medium leading-relaxed max-w-2xl'>
              {event.description}
            </p>
          </motion.div>

          {event.imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className='relative rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-gray-100'
            >
              <img src={event.imageUrl} alt={event.title} className='w-full h-auto max-h-[600px] object-cover' />
            </motion.div>
          )}

          {/* Competitions Section */}
          {event.competitions && event.competitions.length > 0 && (
            <section className='space-y-8'>
              <h2 className='text-3xl font-black uppercase tracking-tighter'>
                Fest <span className='text-emerald-600'>Competitions</span>
              </h2>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {event.competitions.map((comp, idx) => (
                  <div key={idx} className='bg-gray-50 p-8 rounded-[2rem] border-2 border-gray-100 space-y-4 hover:border-emerald-500 transition-all'>
                    <div className='w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm'>
                      <span className='font-black text-emerald-600'>{idx + 1}</span>
                    </div>
                    <h3 className='text-2xl font-black uppercase'>{comp.name}</h3>
                    {comp.prize && (
                      <div className='bg-emerald-50 px-4 py-2 rounded-xl inline-block'>
                        <span className='text-emerald-700 text-sm font-bold'>🏆 Reward: {comp.prize}</span>
                      </div>
                    )}
                    <p className='text-gray-600 text-sm font-medium leading-relaxed'>{comp.rules}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className='space-y-8 pt-12 border-t border-gray-100'>
             <h2 className='text-3xl font-black uppercase tracking-tighter'>Community <span className='text-emerald-600'>Pulse</span></h2>
             <CommentList comments={comments} eventId={id} />
          </section>
        </div>

        {/* Sidebar Info */}
        <div className='lg:col-span-1'>
          <div className='sticky top-32 space-y-8'>
             <div className='bg-black text-white p-10 rounded-[2.5rem] shadow-2xl shadow-emerald-500/10 space-y-8'>
                <div className='space-y-2'>
                  <label className='text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500'>Event Schedule</label>
                  <p className='text-2xl font-black'>{formatDate(event.date)}</p>
                </div>
                
                <div className='space-y-4'>
                  <label className='text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500'>Venue Location</label>
                  <p className='text-lg font-semibold leading-tight'>{event.location?.address}</p>
                  
                  {/* Geoapify / OpenStreetMap Embed */}
                  <div className="w-full h-48 rounded-2xl overflow-hidden border border-emerald-500/20 grayscale hover:grayscale-0 transition-all duration-700">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      style={{ border: 0 }}
                      src={`https://maps.geoapify.com/v1/staticmap?style=osm-bright-smooth&width=600&height=400&center=lonlat:${event.location?.coordinates?.coordinates[0] || 0},${event.location?.coordinates?.coordinates[1] || 0}&zoom=14&marker=lonlat:${event.location?.coordinates?.coordinates[0] || 0},${event.location?.coordinates?.coordinates[1] || 0};color:%2310b981;size:medium&apiKey=0e4c1fa8f2be4e238297215bb3e4bc0e`}
                    ></iframe>
                  </div>

                  <a 
                    href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(event.location?.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center text-[10px] font-bold uppercase tracking-widest text-emerald-500 hover:text-white transition-colors border border-emerald-500/30 rounded-xl py-2"
                  >
                    View on OpenStreetMap ↗
                  </a>
                </div>

                <div className='pt-4'>
                   {event.externalLink ? (
                      <a 
                        href={event.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => api.post(`/events/${event._id}/click`)}
                        className='block text-center w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/10'
                      >
                        Register Now ↗
                      </a>
                   ) : (
                      <button className='w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/10'>
                        Secure Spot (RSVP)
                      </button>
                   )}
                </div>
             </div>

             <div className='bg-gray-50 p-8 rounded-[2.5rem] border-2 border-gray-100 space-y-4'>
                <p className='text-sm font-bold text-gray-500 uppercase tracking-widest'>Have Questions?</p>
                <p className='text-xl font-black'>Reach the organizer</p>
                <p className='text-emerald-600 font-bold underline'>{event.contactEmail || 'Connect via Dashboard'}</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
