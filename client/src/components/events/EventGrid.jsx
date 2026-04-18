import EventCard from './EventCard.jsx';

export default function EventGrid({ events }) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {events.map((event) => <EventCard key={event._id} event={event} />)}
    </div>
  );
}
