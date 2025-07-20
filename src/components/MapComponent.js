import React, { useState } from 'react';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import SuperchargerInfoWindow from './superchargerInfoWindow';
import FoodPreferencesToolbar from './foodPreferencesToolbar';
import { useSuperchargers } from '../hooks/useSuperchargers';

const MapComponent = () => {
    const { superchargers, loading, error } = useSuperchargers();
    const [selectedSupercharger, setSelectedSupercharger] = useState(null);
    const [foodFilter, setFoodFilter] = useState('all');
    const [walkingRadius, setWalkingRadius] = useState(500);

    const handleMarkerClick = (supercharger) => {
        setSelectedSupercharger(supercharger);
    };

    const handleInfoWindowClose = () => {
        setSelectedSupercharger(null);
    };

    const handleFoodFilterChange = (newFilter) => {
        setFoodFilter(newFilter);
        console.log('🍕 Food filter changed to:', newFilter);
    };

    const handleWalkingRadiusChange = (newRadius) => {
        setWalkingRadius(newRadius);
        const minutes = newRadius === 200 ? '2' : newRadius === 500 ? '5' : newRadius === 800 ? '10' : '15';
        console.log(`🚶‍♂️ Walking radius changed to: ${newRadius}m (${minutes} min)`);
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '400px',
                fontSize: '18px',
                color: '#666'
            }}>
                Loading superchargers...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '400px',
                fontSize: '18px',
                color: '#d32f2f'
            }}>
                Error: {error}
            </div>
        );
    }

    if (superchargers.length === 0) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '400px',
                fontSize: '18px',
                color: '#666'
            }}>
                No Tesla Superchargers found in this area
            </div>
        );
    }

    return (
        <div style={{ width: '100%', height: '100vh' }}>
            {/* Food Preferences Toolbar with Walking Distance */}
            <FoodPreferencesToolbar 
                selectedFilter={foodFilter}
                onFilterChange={handleFoodFilterChange}
                walkingRadius={walkingRadius}
                onRadiusChange={handleWalkingRadiusChange}
            />
            
            {/* Map */}
            <Map
                defaultCenter={{ lat: 36.7783, lng: -119.4179 }} // Center of California
                defaultZoom={6}
                mapId="tesla-supercharger-map"
                style={{ width: '100%', height: 'calc(100vh - 80px)' }}
            >
                {superchargers.map((supercharger) => (
                    <AdvancedMarker
                        key={supercharger.id}
                        position={supercharger.position}
                        onClick={() => handleMarkerClick(supercharger)}
                        title={supercharger.name}
                    />
                ))}

                {selectedSupercharger && (
                    <SuperchargerInfoWindow
                        supercharger={selectedSupercharger}
                        onClose={handleInfoWindowClose}
                        foodFilter={foodFilter}
                        walkingRadius={walkingRadius}
                    />
                )}
            </Map>
        </div>
    );
};

export default MapComponent;