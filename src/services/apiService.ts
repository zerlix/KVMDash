export interface ApiConfig {
    baseUrl: string;
    token: string | null;
}

export interface VmList {
    [key: string]: {
        'state.state': string;
        'state.reason': string;
        'balloon.current': string;  // Änderung von number zu string
        'vcpu.current': number;
    }
}

class ApiClient {
    private config: ApiConfig;

    constructor() {
        this.config = {
            baseUrl: import.meta.env.VITE_API_URL,
            token: localStorage.getItem('token')
        };
    }

    vm = {
        list: async () => {
            return this.get<VmList>('qemu/list');
        },
        start: async (name: string) => {
            return this.post(`qemu/start/${name}`);
        },
        stop: async (name: string) => {
            return this.post(`qemu/stop/${name}`);
        },
        delete: async (name: string, deleteVhdFiles?: boolean) => {
            return this.post(`qemu/delete/${name}${deleteVhdFiles ? '?delete_vhd=true' : ''}`);
        },
        create: async (data: any) => {
            return this.post('qemu/create', data);
        }
    };

    public async get<T>(endpoint: string) {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    public  async post<T>(endpoint: string, body?: unknown) {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }

    private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
        if (!this.config.token) {
            throw new Error('Nicht authentifiziert');
        }

        const response = await fetch(`${this.config.baseUrl}/${endpoint}`, {
            ...options,
            headers: {
                'Authorization': this.config.token,
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        const data = await response.json();
        if (!response.ok || data.status === 'error') {
            throw new Error(data.message || `HTTP-Fehler: ${response.status}`);
        }

        return data.data;
    }
}

export const api = new ApiClient();