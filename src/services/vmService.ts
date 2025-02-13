import { fetchData } from './apiService';

interface VmData {
    name: string;
    state: string;
    id: number;
}

export const fetchVmList = async (): Promise<VmData[]> => {
    try {
        const response = await fetchData<VmData[]>('qemu/list');
        if (response.status === 'success') {
            return response.data;
        } else {
            throw new Error(response.message || 'Unbekannter Fehler');
        }
    } catch (err: any) {
        throw new Error(err.message);
    }
};
