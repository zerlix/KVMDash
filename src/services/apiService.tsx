interface ApiResponse {
    status: string;
    data: any;
}

export const fetchData = async (endpoint: string) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        throw new Error('Nicht authentifiziert');
    }

    const response = await fetch(`http://kvmdash.back/api/${endpoint}`, {
        headers: {
            'Authorization': token
        }
    });

    if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
    }

    const result: ApiResponse = await response.json();
    if (result.status === 'success') {
        console.log(result.data);
        return(result.data);
    }

    throw new Error('Ungültige Daten');
};