import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import api from '../services/api.jsx';
import EventGrid from '../components/events/EventGrid.jsx';

const CATS = ['All', 'Academic', 'Social', 'Sports', 'Arts', 'Tech'];

const FeatureImage = ({ src, delay, rotate }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, rotate: 0 }}
    whileInView={{ opacity: 1, scale: 1, rotate }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
    className="relative group perspective-1000"
  >
    <motion.div 
      whileHover={{ scale: 1.05, rotateY: 10, rotateX: -10 }}
      className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white preserve-3d"
    >
      <img src={src} alt="College Event" className="w-full h-64 object-cover" />
    </motion.div>
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
  const textX = useTransform(scrollVelocity, [0, 1], ["0%", "-50%"]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

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
    <div ref={containerRef} className="bg-white text-black pt-20">
      {/* 3D Scrolling Text Background */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center overflow-hidden whitespace-nowrap opacity-[0.03]">
        <motion.h1 
          style={{ x: textX }}
          className="text-[40rem] font-black uppercase"
        >
          CAMPUS DISCOVERY EVENTS DISCOVERY
        </motion.h1>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        <motion.div 
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="text-center z-10 max-w-5xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm uppercase tracking-widest mb-6">
              Empowering Student Life
            </span>
            <h1 className="text-6xl md:text-8xl font-black leading-tight mb-8">
              Discover Every <span className="text-emerald-600">Moment.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12">
              The ultimate 3D hub for campus events. Connect, explore, and create memories that last a lifetime.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, clubs, festivals..."
                className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-emerald-500 focus:outline-none transition-all text-lg shadow-sm"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white p-2 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <Link to="/achievements/post" className="btn-primary py-5 px-8">
              Post Achievement
            </Link>
          </div>
        </motion.div>

        {/* Floating 3D Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [5, 8, 5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[10%] left-[5%] w-32 h-32 bg-emerald-100 rounded-3xl opacity-20"
          />
          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [-10, -15, -10] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[20%] right-[10%] w-48 h-48 bg-emerald-200 rounded-full opacity-30"
          />
        </div>
      </section>

      {/* 3D Gallery Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Moments on Campus</h2>
              <p className="text-gray-600 text-lg font-medium">Capture the energy of our vibrant community through these featured highlights.</p>
            </div>
            <div className="flex gap-4">
              <button className="p-4 rounded-full border-2 border-gray-100 hover:border-emerald-500 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-4 rounded-full bg-black text-white hover:bg-emerald-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <FeatureImage src="/events/concert.png" delay={0.1} rotate={-3} />
            <FeatureImage src="/events/tech.png" delay={0.3} rotate={2} />
            <FeatureImage src="/events/sports.png" delay={0.5} rotate={-1} />
          </div>
        </div>
      </section>

      {/* Achievement Showcase Section */}
      {achievements.length > 0 && (
        <section className="py-24 px-6 bg-gray-50 border-y border-gray-100 italic">
          <div className="max-w-7xl mx-auto">
             <div className="mb-16">
               <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Hall of <span className="text-emerald-600">Fame</span></h2>
               <p className="text-gray-500 font-bold uppercase text-xs mt-2 tracking-widest">Our community's proudest moments</p>
             </div>
             
             <div className="flex overflow-x-auto gap-8 pb-8 custom-scrollbar">
               {achievements.map((ach, i) => (
                 <motion.div 
                  key={ach._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="flex-shrink-0 w-80 bg-white rounded-[2.5rem] p-8 border-2 border-gray-100 shadow-xl shadow-gray-200/50 space-y-4"
                 >
                    {ach.imageUrl && (
                      <div className="h-40 rounded-2xl overflow-hidden mb-4">
                        <img src={ach.imageUrl} alt={ach.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                       <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full">{ach.rank}</span>
                    </div>
                    <h3 className="text-xl font-black uppercase leading-tight">{ach.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-3">{ach.description}</p>
                    <div className="pt-4 border-t border-gray-50 flex items-center gap-3">
                       <img src={ach.user?.avatar || 'https://via.placeholder.com/32'} className="w-8 h-8 rounded-full bg-emerald-100" />
                       <div>
                          <p className="text-xs font-black uppercase">{ach.user?.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 uppercase">{ach.event?.title}</p>
                       </div>
                    </div>
                 </motion.div>
               ))}
             </div>
          </div>
        </section>
      )}

      {/* Filter & Grid Section */}
      <section className="py-20 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-6 overflow-x-auto pb-12 scrollbar-hide">
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`flex-shrink-0 px-8 py-3 rounded-2xl font-bold transition-all ${
                  cat === c
                    ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/30 -translate-y-1'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-black'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="min-h-[400px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                <p className="font-bold text-gray-400">Fetching events...</p>
              </div>
            ) : (
              <EventGrid events={events} />
            )}
          </div>
        </div>
      </section>
      
      {/* Immersive Scroll Section */}
      <section className="h-[50vh] flex items-center justify-center bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
           <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
           <div className="grid grid-cols-10 gap-1 h-full w-full">
             {[...Array(100)].map((_, i) => (
               <div key={i} className="bg-emerald-500/20" />
             ))}
           </div>
        </div>
        <motion.h2 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-4xl md:text-7xl font-black text-center z-10 px-6"
        >
          STEP INTO THE <br/><span className="text-emerald-500">EXPERIENCE</span>
        </motion.h2>
      </section>
    </div>
  );
}
