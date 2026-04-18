import { useEffect, useRef } from 'react';

export default function LeaderboardAd() {
  const adRef = useRef(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.firstChild) {
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.innerHTML = `
        atOptions = {
          'key' : '0e4fe57ddd168eb35858c90c7af13a2e',
          'format' : 'iframe',
          'height' : 90,
          'width' : 728,
          'params' : {}
        };
      `;
      
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = '//www.highperformanceformat.com/0e4fe57ddd168eb35858c90c7af13a2e/invoke.js';

      adRef.current.appendChild(confScript);
      adRef.current.appendChild(invokeScript);
    }
  }, []);

  return (
    <div className="flex justify-center items-center py-8 bg-slate-50 border-y border-slate-100 overflow-hidden">
      <div 
        ref={adRef} 
        style={{ width: '728px', height: '90px' }} 
        className="bg-white/50 backdrop-blur-sm rounded-lg shadow-sm flex items-center justify-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]"
      >
        {/* Ad will be injected here */}
        Advertisement
      </div>
    </div>
  );
}
