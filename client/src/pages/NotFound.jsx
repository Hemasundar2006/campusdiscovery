import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className='max-w-2xl mx-auto px-6 py-20 text-center'>
      <h1 className='text-4xl font-bold mb-3'>404</h1>
      <p className='text-gray-600 mb-6'>The page you requested does not exist.</p>
      <Link to='/' className='px-4 py-2 rounded bg-blue-600 text-white'>Back to home</Link>
    </div>
  );
}
