import { useEffect, useRef } from 'react';

export default function SidebarAd() {
  const adRef = useRef(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.firstChild) {
      const confScript = document.createElement('script');
      confScript.type = 'text/javascript';
      confScript.innerHTML = `
        atOptions = {
          'key' : '28f1976b687078c814157bae361d68e1',
          'format' : 'iframe',
          'height' : 600,
          'width' : 160,
          'params' : {}
        };
      `;
      
      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = 'https://motortape.com/28f1976b687078c814157bae361d68e1/invoke.js';

      adRef.current.appendChild(confScript);
      adRef.current.appendChild(invokeScript);
    }
  }, []);

  return (
    <div className="flex justify-center items-center py-4 bg-slate-50 border border-slate-100 rounded-3xl overflow-hidden min-h-[600px]">
      <div 
        ref={adRef} 
        className="bg-white rounded-lg shadow-sm flex items-center justify-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.2em]"
      >
        Advertisement
      </div>
    </div>
  );
}
