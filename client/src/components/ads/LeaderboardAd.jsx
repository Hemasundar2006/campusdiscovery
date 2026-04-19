import { useEffect, useRef } from 'react';

export default function LeaderboardAd() {
  const adRef = useRef(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.firstChild) {
      const isMobile = window.innerWidth < 768;
      const width = isMobile ? 320 : 728;
      const height = isMobile ? 50 : 90;

      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.innerHTML = `
        atOptions = {
          'key' : '0e4fe57ddd168eb35858c90c7af13a2e',
          'format' : 'iframe',
          'height' : ${height},
          'width' : ${width},
          'params' : {}
        };
      `;
      
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = 'https://motortape.com/0e4fe57ddd168eb35858c90c7af13a2e/invoke.js';

      adRef.current.style.width = \`${width}px\`;
      adRef.current.style.height = \`${height}px\`;
      adRef.current.appendChild(confScript);
      adRef.current.appendChild(invokeScript);
    }
  }, []);

  return (
    <div className="flex justify-center items-center py-6 bg-slate-50 border-y border-slate-100 overflow-hidden min-h-[60px]">
      <div 
        ref={adRef} 
        className="bg-white/50 backdrop-blur-sm rounded-lg shadow-sm flex items-center justify-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]"
      >
        Advertisement
      </div>
    </div>
  );
}
