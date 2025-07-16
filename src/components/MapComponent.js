// src/MapComponent.js
// Simplified main map component

import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import SuperchargerInfoWindow from './superchargerInfoWindow';
import { useSuperchargers } from '../hooks/useSuperchargers';

const MapComponent = () => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const paloAlto = { lat: 37.4419, lng: -122.1430 };
    
    const { superchargers, loading } = useSuperchargers();
    const [selectedMarker, setSelectedMarker] = useState(null);

    const handleMarkerClick = (supercharger) => {
        setSelectedMarker(supercharger);
    };

    const handleInfoWindowClose = () => {
        setSelectedMarker(null);
    };

    if (loading) {
        return (
            <div style={{ 
                height: '100%', 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white'
            }}>
                Loading Superchargers...
            </div>
        );
    }

    return (
        <div style={{ height: '100%', width: '100%' }}>
            <APIProvider apiKey={apiKey} libraries={['places']}>
                <Map
                    defaultCenter={paloAlto}
                    defaultZoom={10}
                    mapId="tesla-trip-planner"
                    style={{ width: '100%', height: '100%' }}
                >
                    {superchargers.map((supercharger) => (
                        <AdvancedMarker
                            key={supercharger.id}
                            position={supercharger.position}
                            onClick={() => handleMarkerClick(supercharger)}
                        />
                    ))}

                    {selectedMarker && (
                        <SuperchargerInfoWindow
                            supercharger={selectedMarker}
                            onClose={handleInfoWindowClose}
                        />
                    )}
                </Map>
            </APIProvider>
        </div>
    );
};

export default MapComponent;