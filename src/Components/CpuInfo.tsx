import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, Box  } from "@mui/material";
import { fetchData } from '../services/apiService';

const CpuInfoCard = () => {
  const [cpuData, setCpuData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    // API Abruf
    const fetchCpuInfo = async () => {
        try {
            const data = await fetchData('host/cpu');
            
        } catch (err: any) {
            console.error('Fetch Error:', err);
            setError(err.message);
        }
    };

    // Automatische Aktualisierung
    useEffect(() => {
        fetchCpuInfo();
        const interval = setInterval(fetchCpuInfo, 5000);
        return () => clearInterval(interval);
    }, []);

 

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
    <Card elevation={3} sx={{ borderRadius: 3 }}>
        <CardHeader 
            title="CPU Informationen" 
        />
        <CardContent>
         
        </CardContent>
    </Card>
    </Box>
  );
};

export default CpuInfoCard;