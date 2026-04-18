export default function Footer() {
  return (
    <footer className='bg-black text-white py-12 px-6'>
      <div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8'>
        <div className='text-2xl font-black tracking-tighter'>
          CAMPUS<span className='text-emerald-500'>DISCOVERY</span>
        </div>
        <div className='text-gray-400 text-sm'>
          &copy; 2026 CampusDiscovery. All rights reserved.
        </div>
        <div className='flex gap-6'>
          <a href='#' className='hover:text-emerald-500 transition-colors'>Twitter</a>
          <a href='#' className='hover:text-emerald-500 transition-colors'>Instagram</a>
          <a href='#' className='hover:text-emerald-500 transition-colors'>LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
