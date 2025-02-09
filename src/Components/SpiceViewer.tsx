import { useEffect, useRef } from 'react';
import { SpiceMainConn } from '@spice-project/spice-html5/src/main';

interface SpiceViewerProps {
  host: string;
  port: number;
  password?: string;
}

export const SpiceViewer = ({ host, port, password }: SpiceViewerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      if (!containerRef.current) return;
  
      const display = document.createElement('div');
      display.id = 'spice-area';
      containerRef.current.appendChild(display);
  
      const spice = new SpiceMainConn({
        uri: `ws://${host}:${port}`,
        screen_id: 0,
        password: password,
        onerror: (e) => console.error('Spice error:', e),
        onsuccess: () => {
          console.log('Spice connected successfully');
          // Nach Verbindung 1x die VM-Liste aktualisieren
          setTimeout(() => {
            display.focus();
          }, 1000);
        }
      });
  
      return () => {
        spice.stop();
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
      };
    }, [host, port, password]);
  
    return (
      <div 
        ref={containerRef} 
        style={{ 
          width: '800px', 
          height: '600px',
          backgroundColor: '#000',
          overflow: 'hidden'
        }} 
      />
    );
  };