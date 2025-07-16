import React, { useState, useEffect } from 'react';
import { InfoWindow } from '@vis.gl/react-google-maps';
import RestaurantList from './restaurantList';
import { fetchNearbyRestaurants } from '../services/placesAPI';

const SuperchargerInfoWindow = ({ supercharger, onClose }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [loadingFood, setLoadingFood] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        setRestaurants([]);
        setHasSearched(false);
    }, [supercharger.id]);

    const handleFindFood = async () => {
        setLoadingFood(true);
        setRestaurants([]);
        setHasSearched(true);
        
        try {
            const results = await fetchNearbyRestaurants(supercharger);
            setRestaurants(results);
        } catch (error) {
            console.error('Error finding restaurants:', error);
            setRestaurants([]);
        }
        
        setLoadingFood(false);
    };

    return (
        <InfoWindow
            position={supercharger.position}
            onCloseClick={onClose}
        >
            <div style={{ padding: '10px', minWidth: '250px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                    {supercharger.name}
                </h3>
                <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Stalls:</strong> {supercharger.stalls}
                </p>
                <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Power:</strong> {supercharger.power}
                </p>
                <p style={{ margin: '5px 0', color: '#666' }}>
                    <strong>Status:</strong> <span style={{ color: 'green' }}>Available</span>
                </p>
                
                <button 
                    onClick={handleFindFood}
                    disabled={loadingFood}
                    style={{
                        marginTop: '10px',
                        padding: '8px 12px',
                        backgroundColor: loadingFood ? '#ccc' : '#1976d2',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loadingFood ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loadingFood ? 'Finding Food...' : '🍕 Find Food Nearby'}
                </button>

                <RestaurantList 
                    restaurants={restaurants} 
                    loading={loadingFood} 
                    hasSearched={hasSearched}
                />
            </div>
        </InfoWindow>
    );
};

export default SuperchargerInfoWindow;