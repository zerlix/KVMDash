interface ApiResponse {
    status: string;
    data: any;
    message?: string;
}

interface RequestOptions {
    method?: 'GET' | 'POST';
    body?: any;
}

export const fetchData = async (endpoint: string, options: RequestOptions = { method: 'GET' }) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        throw new Error('Nicht authentifiziert');
    }

    const response = await fetch(`http://kvmdash.back/api/${endpoint}`, {
        method: options.method,
        headers: {
            'Authorization': token,
            'Content-Type': 'application/json'
        }
    });

    const text = await response.text();
    let data;
    
    try {
        data = JSON.parse(text);
    } catch (e) {
        console.error('Raw response:', text);
        throw new Error('Ungültiges JSON Format vom Server');
    }

    if (!response.ok) {
        throw new Error(data.message || `Status: ${response.status}`);
    }

    return data;
};