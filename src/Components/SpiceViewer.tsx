import { useEffect, useRef } from 'react';
import { SpiceMainConn } from '@spice-project/spice-html5/src/main';

interface SpiceViewerProps {
  host: string;
  port: number;
  password?: string;
}

// SpiceAgent Interface für TypeScript
interface SpiceAgent {
  connect_display: (display: HTMLElement) => void;
}

export const SpiceViewer = ({ host, port, password }: SpiceViewerProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const spiceConnectionRef = useRef<any>(null);
    
    useEffect(() => {
      if (!containerRef.current) return;

      // Container vorbereiten
      const container = containerRef.current;
      container.innerHTML = '';
      container.style.position = 'relative';
  
      // Message-Container
      const messageDiv = document.createElement('div');
      messageDiv.id = 'message-div';
      messageDiv.style.position = 'absolute';
      messageDiv.style.bottom = '0';
      messageDiv.style.left = '0';
      messageDiv.style.right = '0';
      messageDiv.style.zIndex = '1000';
      container.appendChild(messageDiv);

      // Display Canvas
      const display = document.createElement('div');
      display.id = 'spice-area';
      display.style.position = 'absolute';
      display.style.top = '0';
      display.style.left = '0';
      display.style.width = '100%';
      display.style.height = '100%';
      container.appendChild(display);

      // Debug Logging
      console.log('Display setup:', {
        container: container,
        display: display,
        message: messageDiv
      });

      try {
        // @ts-ignore
        spiceConnectionRef.current = new SpiceMainConn({
          uri: `ws://${host}:${port}`,
          screen_id: 'spice-area',  // ID des Display-Containers
          password: password,
          onerror: (e: Event) => {
            console.error('SPICE Error:', e);
            messageDiv.textContent = `Fehler: ${e.type}`;
          },
          onsuccess: () => {
            console.log('SPICE Verbindung hergestellt');
            messageDiv.textContent = 'Verbunden';
            display.focus();
          },
          onagent: (agent: SpiceAgent) => {
            console.log('SPICE Agent verbunden');
            agent.connect_display(display);
            display.focus();
          }
        });
      } catch (error) {
        console.error('SPICE Initialisierungsfehler:', error);
        messageDiv.textContent = `Initialisierungsfehler: ${error}`;
      }

      return () => {
        if (spiceConnectionRef.current) {
          spiceConnectionRef.current.stop();
        }
      };
    }, [host, port, password]);

    return (
      <div 
        ref={containerRef} 
        style={{ 
          width: '1024px',
          height: '768px',
          border: '1px solid #ccc',
          overflow: 'hidden',
          backgroundColor: '#000',
          position: 'relative'
        }} 
      />
    );
};