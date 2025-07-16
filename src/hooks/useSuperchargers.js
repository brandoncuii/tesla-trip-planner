import { useState, useEffect } from 'react';
import { fetchSuperchargersFromFile } from '../services/placesAPI';

export const useSuperchargers = () => {
    const [superchargers, setSuperchargers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadSuperchargers = async () => {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchSuperchargersFromFile();
                setSuperchargers(data);
            } catch (err) {
                console.error('Error in useSuperchargers:', err);
                setError(err.message);
                setSuperchargers([]);
            }

            setLoading(false);
        };

        loadSuperchargers();
    }, []);

    return { superchargers, loading, error };
};
