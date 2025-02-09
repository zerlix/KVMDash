import { useEffect, useRef } from 'react';
import { SpiceMainConn } from '@spice-project/spice-html5/src/main';

interface SpiceViewerProps {
  host: string;
  port: number;
  password?: string;
}

interface SpiceAgent {
  connect_display: (display: HTMLElement) => void;
}

const createSpiceDisplay = (container: HTMLDivElement) => {
  const display = document.createElement('div');
  display.id = 'spice-area';
  Object.assign(display.style, {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%'
  });
  container.appendChild(display);
  return display;
};

const createMessageDiv = (container: HTMLDivElement) => {
  const messageDiv = document.createElement('div');
  messageDiv.id = 'message-div';
  Object.assign(messageDiv.style, {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    zIndex: '1000',
    padding: '5px',
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white'
  });
  container.appendChild(messageDiv);
  return messageDiv;
};

export const SpiceViewer = ({ host, port, password }: SpiceViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const spiceConnectionRef = useRef<any>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';
    container.style.position = 'relative';

    const messageDiv = createMessageDiv(container);
    const display = createSpiceDisplay(container);

    console.log('🖥️ Display Setup:', { container, display, message: messageDiv });

    try {
      spiceConnectionRef.current = new SpiceMainConn({
        uri: `ws://${host}:${port}`,
        screen_id: 'spice-area',  // ID des Display-Containers,
        password: password,
        onerror: (e: Event) => {
          console.error('🔴 SPICE Error:', e);
          messageDiv.textContent = `Fehler: ${e.type}`;
        },
        onsuccess: () => {
          console.log('🟢 SPICE Verbindung hergestellt');
          messageDiv.textContent = 'Verbunden';
          display.focus();
        },
        onagent: (agent: SpiceAgent) => {
          console.log('🤝 SPICE Agent verbunden');
          agent.connect_display(display);
          display.focus();
        }
      });
    } catch (error) {
      console.error('💥 SPICE Initialisierungsfehler:', error);
      messageDiv.textContent = `Initialisierungsfehler: ${error}`;
    }

    return () => spiceConnectionRef.current?.stop();
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
        position: 'relative',
        margin: '0 auto'
      }} 
    />
  );
};