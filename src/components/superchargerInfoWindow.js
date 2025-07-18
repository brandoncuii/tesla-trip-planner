import React, { useState, useEffect } from 'react';
import { InfoWindow } from '@vis.gl/react-google-maps';
import RestaurantList from './restaurantList';
import { fetchNearbyRestaurants } from '../services/placesAPI';

const SuperchargerInfoWindow = ({ supercharger, onClose, foodFilter }) => {
    const [restaurants, setRestaurants] = useState([]);
    const [loadingFood, setLoadingFood] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    // Clear restaurants when supercharger changes
    useEffect(() => {
        setRestaurants([]);
        setHasSearched(false);
    }, [supercharger.id]);

    const applyFoodFilter = (restaurantList) => {
        switch (foodFilter) {
            case 'highRated':
                return restaurantList.filter(restaurant => 
                    restaurant.rating && parseFloat(restaurant.rating) >= 4.0
                );
            case 'fastFood':
                return restaurantList.filter(restaurant =>
                    restaurant.types.some(type => 
                        type.includes('fast_food') || 
                        type.includes('meal_takeaway') ||
                        type.includes('quick_service_restaurant')
                    )
                );
            case 'casual':
                return restaurantList.filter(restaurant =>
                    restaurant.types.some(type => 
                        type.includes('restaurant') && 
                        !type.includes('fast_food') && 
                        !type.includes('meal_takeaway')
                    )
                );
            case 'coffee':
                return restaurantList.filter(restaurant =>
                    restaurant.types.some(type => 
                        type.includes('cafe') || 
                        type.includes('coffee') ||
                        type.includes('bakery')
                    )
                );
            case 'all':
            default:
                return restaurantList;
        }
    };

    const handleFindFood = async () => {
        setLoadingFood(true);
        setRestaurants([]);
        setHasSearched(true);
        
        try {
            const results = await fetchNearbyRestaurants(supercharger);
            const filteredResults = applyFoodFilter(results);
            setRestaurants(filteredResults);
            
            // Log for debugging
            console.log(`🍕 Found ${results.length} restaurants, showing ${filteredResults.length} after "${foodFilter}" filter`);
        } catch (error) {
            console.error('Error finding restaurants:', error);
            setRestaurants([]);
        }
        
        setLoadingFood(false);
    };

    useEffect(() => {
        if (hasSearched && restaurants.length > 0) {
            const refetchWithNewFilter = async () => {
                try {
                    const results = await fetchNearbyRestaurants(supercharger);
                    const filteredResults = applyFoodFilter(results);
                    setRestaurants(filteredResults);
                    console.log(`🍕 Re-filtered: showing ${filteredResults.length} restaurants for "${foodFilter}" filter`);
                } catch (error) {
                    console.error('Error re-filtering restaurants:', error);
                }
            };
            refetchWithNewFilter();
        }
    }, [foodFilter, supercharger.id]); // Re-run when filter or supercharger changes

    const getFilterDisplayName = () => {
        switch (foodFilter) {
            case 'highRated': return '4+ star restaurants';
            case 'fastFood': return 'fast food places';
            case 'casual': return 'sit-down restaurants';
            case 'coffee': return 'coffee shops';
            case 'all':
            default: return 'all restaurants';
        }
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
                        cursor: loadingFood ? 'not-allowed' : 'pointer',
                        width: '100%'
                    }}
                >
                    {loadingFood ? 'Finding Food...' : `🍕 Find ${getFilterDisplayName()}`}
                </button>

                {foodFilter !== 'all' && hasSearched && (
                    <div style={{
                        marginTop: '8px',
                        padding: '6px 8px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '4px',
                        fontSize: '12px',
                        color: '#1976d2',
                        textAlign: 'center'
                    }}>
                        Showing {getFilterDisplayName()} only
                    </div>
                )}

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