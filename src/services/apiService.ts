import type { ApiResponse, RequestOptions } from '../types/api.types';


export const fetchData = async <T>(
    endpoint: string,
    options: RequestOptions = { method: 'GET' }
): Promise<ApiResponse<T>> => {

    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('Nicht authentifiziert');
    }

    try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/${endpoint}`;
        const response = await fetch(apiUrl, {
            method: options.method,
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: options.body
        });

        const data = await response.json() as ApiResponse<T>;

        // Prüfe explizit auf error status von der API
        if (data.status === 'error') {
            throw new Error(data.message || 'Unbekannter API-Fehler');
        }

        // Prüfe auf HTTP-Fehler
        if (!response.ok) {
            throw new Error(`HTTP-Fehler: ${response.status}`);
        }

        // Validiere ApiResponse Struktur
        if (!data || !data.hasOwnProperty('status') || !data.hasOwnProperty('data')) {
            throw new Error('Ungültige API-Antwort-Struktur');
        }

        return data;
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Unerwarteter Fehler beim API-Aufruf');
    }
};

// old function fetchData() 
export const fetchData_ = async <T>(endpoint: string, options: RequestOptions = { method: 'GET' }): Promise<ApiResponse<T>> => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Nicht authentifiziert');
    }

    const apiUrl = `${import.meta.env.VITE_API_URL}/${endpoint}`;
    const response = await fetch(apiUrl, {
        method: options.method,
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        },
        body: options.body
    });


    const text = await response.text();
    let data;
    try {
        data = JSON.parse(text);
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : 'Unbekannter Fehler';
        throw new Error(`Ungültiges JSON Format vom Server: ${errorMessage}`);
    }


    if (!response.ok) {
        throw new Error(data.message || `Status: ${response.status}`);
    }

    return data;
};

