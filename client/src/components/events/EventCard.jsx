import { Link } from 'react-router-dom';
import { formatDate } from '../../utils/formatDate.jsx';

export default function EventCard({ event }) {
  return (
    <article className='group relative rounded-3xl border-2 border-gray-100 bg-white overflow-hidden hover:border-emerald-500 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2'>
      {event.imageUrl ? (
        <div className='overflow-hidden h-52'>
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            loading="lazy"
            className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110' 
          />
        </div>
      ) : (
        <div className='w-full h-52 bg-emerald-50 flex items-center justify-center'>
           <span className='text-emerald-300 font-black text-4xl opacity-20 uppercase'>Discovery</span>
        </div>
      )}
      <div className='p-6 space-y-4'>
        <div className='flex justify-between items-start'>
          <h3 className='font-black text-xl line-clamp-1 text-black group-hover:text-emerald-700 transition-colors uppercase'>{event.title}</h3>
        </div>
        <div className='flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full w-fit'>
           {formatDate(event.date)}
        </div>
        <p className='text-slate-600 text-sm line-clamp-2 leading-relaxed font-medium'>{event.description}</p>
        <Link 
          to={`/events/${event._id}`} 
          aria-label={`View details for ${event.title}`}
          className='inline-flex items-center gap-2 text-black text-sm font-black uppercase tracking-wider group/link'
        >
          View details
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover/link:translate-x-1" role="img" aria-hidden="true" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </article>
  );
}
