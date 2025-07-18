import React, { useState } from 'react';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import SuperchargerInfoWindow from './superchargerInfoWindow';
import FoodPreferencesToolbar from './foodPreferencesToolbar';
import { useSuperchargers } from '../hooks/useSuperchargers';

const MapComponent = () => {
    const { superchargers, loading, error } = useSuperchargers();
    const [selectedSupercharger, setSelectedSupercharger] = useState(null);
    const [foodFilter, setFoodFilter] = useState('all');

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
            <FoodPreferencesToolbar 
                selectedFilter={foodFilter}
                onFilterChange={handleFoodFilterChange}
            />
            
            <Map
                defaultCenter={{ lat: 36.7783, lng: -119.4179 }} // Center of California
                defaultZoom={6}
                mapId="tesla-supercharger-map"
                style={{ width: '100%', height: 'calc(100vh - 60px)' }}
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
                    />
                )}
            </Map>
        </div>
    );
};

export default MapComponent;