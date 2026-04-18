import { useEffect } from 'react';

export default function NativeAdBlock() {
  useEffect(() => {
    // Only load the script once the component mounts
    const script = document.createElement('script');
    script.src = 'https://motortape.com/6fd0506de92d836436bd59c32fdb54c5/invoke.js';
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    
    document.body.appendChild(script);

    return () => {
      // Cleanup if necessary (though some ad scripts don't handle removal well)
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div 
        id="container-6fd0506de92d836436bd59c32fdb54c5" 
        className="rounded-[2.5rem] overflow-hidden min-h-[150px] bg-slate-50 flex items-center justify-center border border-slate-100"
      >
        <span className="text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]">Advertisement Showcase</span>
      </div>
    </div>
  );
}
