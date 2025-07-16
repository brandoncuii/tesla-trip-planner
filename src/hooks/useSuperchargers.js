import { useState, useEffect } from 'react';
import { fetchSuperchargers } from '../services/placesAPI';

export const useSuperchargers = () => {
    const [superchargers, setSuperchargers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadSuperchargers = async () => {
            setLoading(true);
            setError(null);
            
            try {
                const data = await fetchSuperchargers();
                
                if (data.length > 0) {
                    setSuperchargers(data);
                } else {
                    // Fallback to dummy data if API fails
                    setSuperchargers([
                        {
                            id: 1,
                            name: "Tesla Supercharger - Palo Alto University Ave",
                            position: { lat: 37.4488, lng: -122.1599 },
                            stalls: 8,
                            power: "250kW",
                            status: "Available"
                        },
                        {
                            id: 2,
                            name: "Tesla Supercharger - Mountain View Whisman",
                            position: { lat: 37.3983, lng: -122.0817 },
                            stalls: 8,
                            power: "250kW",
                            status: "Available"
                        }
                    ]);
                }
            } catch (err) {
                setError(err.message);
                // Set fallback data on error
                setSuperchargers([
                    {
                        id: 1,
                        name: "Tesla Supercharger - Palo Alto University Ave",
                        position: { lat: 37.4488, lng: -122.1599 },
                        stalls: 8,
                        power: "250kW",
                        status: "Available"
                    }
                ]);
            }
            
            setLoading(false);
        };
        
        loadSuperchargers();
    }, []);

    return { superchargers, loading, error };
};