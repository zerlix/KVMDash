import type { VmFormData } from '../types/vm.types';
import type { VmList } from '../types/vm.types';

export interface ApiConfig {
    baseUrl: string;
    token: string | null;
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
        list: async (): Promise<VmList> => {
            return this.get<VmList>('qemu/list');
        },
        start: async (name: string): Promise<void> => {
            return this.post(`qemu/start/${name}`);
        },
        stop: async (name: string): Promise<void> => {
            return this.post(`qemu/stop/${name}`);
        },
        reboot: async (name: string): Promise<void> => {
            return this.post(`qemu/reboot/${name}`);
        },
        delete: async (name: string, deleteVhdFiles?: boolean): Promise<void> => {
            return this.post(`qemu/delete/${name}${deleteVhdFiles ? '?delete_vhd=true' : ''}`);
        },
        create: async (data: VmFormData): Promise<void> => {
            return this.post('qemu/create', data);
        }
    };

    public async get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'GET' });
    }

    public async post<T>(endpoint: string, body?: unknown): Promise<T> {
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
        
        // Debug-Log
        console.log('Raw API Response:', endpoint, data);
        
        // Wenn data.data existiert, gib data.data zurück, sonst data
        return data.data || data;
    }
}

export const api = new ApiClient();