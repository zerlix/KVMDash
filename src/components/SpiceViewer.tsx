import { useEffect, useRef } from 'react';
import { SpiceMainConn } from '@spice-project/spice-html5/src/main';

interface SpiceViewerProps {
    host: string;
    port: number;
    password?: string;
}

interface SpiceAgent {
    connect_display?: (display: HTMLElement) => void;
    main?: {
        connect_display: (display: HTMLElement) => void;
        agent?: {
            connect_display: (display: HTMLElement) => void;
        }
    };
}

const createSpiceDisplay = (container: HTMLDivElement) => {
    const display = document.createElement('div');
    display.id = 'spice-area';
    Object.assign(display.style, {
        position: 'absolute',
        top: '50%',               // Vertikale Zentrierung
        left: '50%',             // Horizontale Zentrierung
        transform: 'translate(-50%, -50%)', // Perfekte Zentrierung
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
    const renderLoopRef = useRef<number | undefined>(undefined); // Animation Frame Referenz

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        // Sicherstellen, dass alte Elemente entfernt werden
        const oldDisplay = document.getElementById('spice-area');
        const oldMessage = document.getElementById('message-div');
        if (oldDisplay) oldDisplay.remove();
        if (oldMessage) oldMessage.remove();

        container.innerHTML = '';
        container.style.position = 'relative';

        const messageDiv = createMessageDiv(container);
        const display = createSpiceDisplay(container);

        let isComponentMounted = true; // Flag für Cleanup

        try {
            spiceConnectionRef.current = new SpiceMainConn({
                uri: `ws://${host}:${port}`,
                screen_id: 'spice-area',
                password: password,
                onerror: (e: Event) => {
                    if (!isComponentMounted) return;
                    console.error('🔴 SPICE Error:', e);
                    messageDiv.textContent = `Fehler: ${e.type}`;
                },
                onsuccess: () => {
                    if (!isComponentMounted) return;
                    console.log('🟢 SPICE Verbindung hergestellt');
                    messageDiv.textContent = 'Verbunden';
                    display.focus();
                },
                onagent: (agent: SpiceAgent) => {
                    if (!isComponentMounted) return;
                    
                    // Erweiterte Debug-Ausgabe
                    console.log('🤝 SPICE Agent Details:', {
                        agent,
                        hasConnectDisplay: typeof agent.connect_display === 'function',
                        hasMain: !!agent.main,
                        mainMethods: agent.main ? Object.keys(agent.main) : [],
                        prototype: Object.getPrototypeOf(agent)
                    });
                
                    let isConnected = false;
                
                    const connectDisplay = () => {
                        // Erweiterte Prüfung für verschiedene Display-Server
                        if (typeof agent.connect_display === 'function') {
                            console.log('📺 Verwende direkten connect_display');
                            return agent.connect_display;
                        } else if (agent.main?.connect_display) {
                            console.log('📺 Verwende main.connect_display');
                            return agent.main.connect_display;
                        } else if (agent.main?.agent?.connect_display) {
                            console.log('📺 Verwende main.agent.connect_display');
                            return agent.main.agent.connect_display;
                        }
                
                        // Wenn keine Methode gefunden wurde, versuche display direkt zu verbinden
                        console.log('⚠️ Keine standard connect_display Methode gefunden');
                        return (display: HTMLElement) => {
                            if (agent.main) {
                                // Versuche display direkt zu setzen
                                (agent.main as any).display = display;
                                return true;
                            }
                            return false;
                        };
                    };

                    const displayConnector = connectDisplay();
                    if (!displayConnector) {
                      console.error('🔴 Agent hat keine connect_display Funktion:', agent);
                      messageDiv.textContent = 'Agent Verbindungsfehler';
                      return;
                    }

                    const renderLoop = () => {
                        if (!isComponentMounted) return;

                        try {
                            if (!isConnected && spiceConnectionRef.current) {
                                if (display instanceof HTMLElement) {
                                    displayConnector(display);
                                    isConnected = true;
                                    console.log('🔗 Display verbunden');
                                } else {
                                    throw new Error('Display ist kein HTMLElement');
                                }
                            }
                            renderLoopRef.current = requestAnimationFrame(renderLoop);
                        } catch (error) {
                            console.error('🔴 Display Connection Error:', error, {
                                agent,
                                display,
                                isConnected
                            });
                            messageDiv.textContent = 'Verbindungsfehler';
                        }
                    };

                    renderLoopRef.current = requestAnimationFrame(renderLoop);
                    display.focus();
                }
            });
        } catch (error) {
            console.error('💥 SPICE Initialisierungsfehler:', error);
            messageDiv.textContent = `Initialisierungsfehler: ${error}`;
        }

        // Verbessertes Cleanup
        return () => {
            isComponentMounted = false; // Verhindert weitere Updates

            // Animation Frame stoppen
            if (renderLoopRef.current !== undefined) {
                cancelAnimationFrame(renderLoopRef.current);
                renderLoopRef.current = undefined;
            }

            // SPICE Verbindung beenden
            if (spiceConnectionRef.current) {
                try {
                    spiceConnectionRef.current.stop();
                    spiceConnectionRef.current = null;
                } catch (error) {
                    console.error('Cleanup error:', error);
                }
            }

            // Explizites DOM Cleanup
            const spiceArea = document.getElementById('spice-area');
            const messageDiv = document.getElementById('message-div');
            if (spiceArea) spiceArea.remove();
            if (messageDiv) messageDiv.remove();

            // Container leeren
            if (container) {
                container.innerHTML = '';
            }
        };
    }, [host, port, password]);



    return (
        <div
            ref={containerRef}
            style={{
                width: '100%',
                height: '800px',          // Feste Höhe statt 100vh
                maxWidth: '1280px',       // Kleinere max-width
                border: '1px solid #ccc',
                overflow: 'hidden',
                backgroundColor: '#000',
                position: 'relative',
                margin: '0 auto'          // Nur horizontale Zentrierung
            }}
        />
    );
};