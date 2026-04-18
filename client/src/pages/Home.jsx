import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import api from '../services/api.jsx';
import EventGrid from '../components/events/EventGrid.jsx';
import NativeAdBlock from '../components/ads/NativeAdBlock.jsx';

const CATS = ['All', 'Academic', 'Social', 'Sports', 'Arts', 'Tech'];

const FeatureImage = ({ src, alt, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay }}
    className="relative group p-4 bg-white/50 backdrop-blur-md rounded-[2.5rem] border border-white/50 shadow-lg"
  >
    <div className="rounded-[2rem] overflow-hidden">
      <img 
        src={src} 
        alt={alt || "College Event"} 
        loading="lazy"
        className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700" 
      />
    </div>
  </motion.div>
);

export default function Home() {
  const containerRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('All');
  const [search, setSearch] = useState('');

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const scrollVelocity = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const textX = useTransform(scrollVelocity, [0, 1], ["0%", "-30%"]);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = {};
        if (cat !== 'All') params.category = cat.toLowerCase();
        if (search.trim()) params.search = search.trim();
        const { data } = await api.get('/events', { params });
        setEvents(data.events || []);
      } catch (err) {
        console.error('Failed to load events.');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [cat, search]);

  useEffect(() => {
    api.get('/achievements').then(res => setAchievements(res.data.achievements || [])).catch(e => console.error(e));
  }, []);

  return (
    <div ref={containerRef} className="bg-[#f8fafc] overflow-hidden pt-32">
      <Helmet>
        <title>Home | CampusDiscovery - Connect & Explore Events</title>
        <meta name="description" content="Welcome to CampusDiscovery. Find the most exciting college fests, academic seminars, and social gatherings happening on your campus right now." />
        <link rel="canonical" href="https://campusdiscovery.vercel.app/" />
      </Helmet>

      {/* Subtle Moving Background Text */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center overflow-hidden whitespace-nowrap opacity-[0.02] select-none">
        <motion.div 
          style={{ x: textX }}
          className="text-[30rem] font-bold"
        >
          Campus Discovery Campus Discovery
        </motion.div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6">
        <div className="text-center z-10 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="inline-block px-5 py-2 rounded-full bg-emerald-50 text-emerald-600 font-semibold text-xs uppercase tracking-widest mb-8 border border-emerald-100/50">
              Transforming Student Discovery
            </span>
            <h1 className="text-5xl md:text-8xl font-semibold leading-[1.1] tracking-tight text-slate-900 mb-10">
              One platform. <br/><span className="text-emerald-700 italic">Every moment.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-14 leading-relaxed font-medium">
              Join the elite campus hub where fests, achievements and students unite through high-performance discovery.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-5 justify-center items-center">
            <div className="relative w-full max-w-lg">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find your next experience..."
                aria-label="Search for events"
                className="w-full px-8 py-5 rounded-[2rem] bg-white border border-slate-100 focus:border-emerald-500 focus:outline-none transition-all text-base shadow-sm font-medium"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6">Gallery of Energy</h2>
            <p className="text-slate-500 font-medium text-lg">Visual highlights from our top trending fests.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureImage src="/events/concert.png" alt="Live college concert and music fest" delay={0.1} />
            <FeatureImage src="/events/tech.png" alt="Technical seminar and coding competition" delay={0.3} />
            <FeatureImage src="/events/sports.png" alt="Inter-college sports meet and athletics" delay={0.5} />
          </div>
        </div>
      </section>

      {/* Native Ad Placement */}
      <NativeAdBlock />

      {/* Hall of Fame - Infinite Marquee */}
      {achievements.length > 0 && (
        <section className="py-24 bg-white border-y border-slate-100 overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-6 mb-16">
             <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">The <span className="text-emerald-600 italic">Hall of Fame</span></h2>
             <p className="text-slate-400 font-medium mt-3 uppercase text-[10px] tracking-[0.3em]">Celebrating live campus victories</p>
          </div>

          <div className="flex relative">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                duration: 50, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="flex gap-8 whitespace-nowrap"
            >
              {[...achievements, ...achievements].map((ach, i) => (
                <div key={i} className="flex-shrink-0 w-[400px] bg-slate-50 rounded-[3rem] p-10 border border-slate-100 group hover:border-emerald-500 hover:bg-white transition-all duration-500">
                   {ach.imageUrl && (
                     <div className="h-48 rounded-[2.5rem] overflow-hidden mb-6 relative">
                       <img 
                        src={ach.imageUrl} 
                        alt={ach.title} 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                       />
                       <div className="absolute top-4 left-4">
                          <span className="px-4 py-1 bg-white/90 backdrop-blur-md text-emerald-700 text-[10px] font-bold uppercase rounded-full tracking-widest shadow-sm">
                            {ach.rank}
                          </span>
                       </div>
                     </div>
                   )}
                   <h3 className="text-xl font-bold tracking-tight mb-3 whitespace-normal">{ach.title}</h3>
                   <p className="text-slate-500 text-sm leading-relaxed mb-8 whitespace-normal line-clamp-2">{ach.description}</p>
                   
                   <div className="flex items-center gap-4">
                      <img 
                        src={ach.user?.avatar || `https://ui-avatars.com/api/?name=${ach.user?.name}`} 
                        className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover" 
                      />
                      <div>
                         <p className="text-xs font-bold text-slate-800">{ach.user?.name}</p>
                         <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">{ach.event?.title}</p>
                      </div>
                   </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Events Explore */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-10">
            <h2 className="text-4xl font-semibold tracking-tight">Explore Fests</h2>
            <div className="flex items-center gap-4 p-2 bg-white border border-slate-100 rounded-[2rem] overflow-x-auto no-scrollbar">
              {CATS.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`px-6 py-2.5 rounded-2xl text-[12px] font-bold tracking-wide transition-all ${
                    cat === c ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <EventGrid events={events} />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
