
interface ApiResponse<T = unknown> {
    status: 'success' | 'error';
    data: T;
    message?: string;
}


interface RequestOptions {
    method?: string;
    body?: string;
    headers?: {
        [key: string]: string;
    };
}

export const fetchData = async <T>(endpoint: string, options: RequestOptions = { method: 'GET' }): Promise<ApiResponse<T>> => {
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

