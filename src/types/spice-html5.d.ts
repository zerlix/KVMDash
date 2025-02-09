declare module '@spice-project/spice-html5/src/main' {
    export class SpiceMainConn {
      constructor(options: {
        uri: string;
        screen_id: number;
        password?: string;
        onerror?: (e: any) => void;
        onsuccess?: () => void;
      });
      
      stop(): void;
    }
  }