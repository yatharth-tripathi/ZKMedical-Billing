import { useState, useEffect } from 'react';
import { ETHERCALC_URL, ETHERCALC_SHEET_ID } from '../utils/constants';

export default function EthercalcViewer() {
  const [iframeUrl, setIframeUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Use direct URL for iframe view
    setIframeUrl(`${ETHERCALC_URL}/${ETHERCALC_SHEET_ID}`);
    
    // Set loading to false after a delay to give iframe time to load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-[500px] border rounded-lg overflow-hidden shadow-lg relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-xl text-gray-500">Loading spreadsheet...</div>
        </div>
      )}
      
      <iframe 
        src={iframeUrl} 
        title="Ethercalc Spreadsheet"
        className={`w-full h-full border-0 ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}