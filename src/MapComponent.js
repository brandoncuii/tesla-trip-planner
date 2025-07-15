import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

const MapComponent = () => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const paloAlto = { lat: 37.4419, lng: -122.1430 };

    //placeholder for supercharger dta
    const superchargers = [
        {
            id: 1,
            name: "Tesla Supercharger - Palo Alto University Ave",
            position: { lat: 37.4488, lng: -122.1599 } // Actual location on University Ave
        },
        {
            id: 2,
            name: "Tesla Supercharger - Mountain View Whisman",
            position: { lat: 37.3983, lng: -122.0817 } // Whisman School District location
        },
        {
            id: 3,
            name: "Tesla Supercharger - San Mateo Hillsdale",
            position: { lat: 37.5378, lng: -122.3007 } // Hillsdale Mall
        },
        {
            id: 4,
            name: "Tesla Supercharger - Fremont Pacific Commons",
            position: { lat: 37.4977, lng: -121.9166 } // Pacific Commons
        },
        {
            id: 5,
            name: "Tesla Supercharger - San Jose Santana Row",
            position: { lat: 37.3217, lng: -121.9485 } // Santana Row
        },
        {
            id: 6,
            name: "Tesla Supercharger - Gilroy Premium Outlets",
            position: { lat: 37.0297, lng: -121.5667 } // South Bay location
        }
    ];

    return (
        <div style={{ height: '400px', width: '100%' }}>
            <APIProvider apiKey={apiKey}>
                <Map
                    defaultCenter={paloAlto}
                    defaultZoom={10}
                    mapId="tesla-trip-planner"
                >
                    {superchargers.map((supercharger) => (
                        <AdvancedMarker
                            key={supercharger.id}
                            position={supercharger.position}
                        />
                    ))}
                </Map>
            </APIProvider>
        </div>
    );
};

export default MapComponent;