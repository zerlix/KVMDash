import { fetchData } from './apiService';

export const fetchVmList = async () => {
    try {
        const response = await fetchData('qemu/list');
        if (response.status === 'success') {
            return response.data;
        } else {
            throw new Error(response.message || 'Unbekannter Fehler');
        }
    } catch (err: any) {
        throw new Error(err.message);
    }
};
