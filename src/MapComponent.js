import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';

const MapComponent = () => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const paloAlto = { lat: 37.4419, lng: -122.1430 };

    const [selectedMarker, setSelectedMarker] = useState(null); // sets initial selected marker to none

    // placeholder for supercharger data before fetching from API
    const superchargers = [
        {
            id: 1,
            name: "Tesla Supercharger - Palo Alto University Ave",
            position: { lat: 37.4488, lng: -122.1599 },
            stalls: 8,
            power: "250kW"
        },
        {
            id: 2,
            name: "Tesla Supercharger - Mountain View Whisman",
            position: { lat: 37.3983, lng: -122.0817 },
            stalls: 8,
            power: "250kW"
        },
        {
            id: 3,
            name: "Tesla Supercharger - San Mateo Hillsdale",
            position: { lat: 37.5378, lng: -122.3007 },
            stalls: 16,
            power: "150kW"
        },
        {
            id: 4,
            name: "Tesla Supercharger - Fremont Pacific Commons",
            position: { lat: 37.4977, lng: -121.9166 },
            stalls: 12,
            power: "250kW"
        },
        {
            id: 5,
            name: "Tesla Supercharger - San Jose Santana Row",
            position: { lat: 37.3217, lng: -121.9485 },
            stalls: 20,
            power: "250kW"
        }
    ];

    return (
        <div style={{ height: '400px', width: '100%' }}>
            <APIProvider apiKey={apiKey}>
                <Map
                    defaultCenter={paloAlto} // default center of map
                    defaultZoom={10}
                    mapId="tesla-trip-planner"
                >
                    {/* render all markers */}
                    {superchargers.map((supercharger) => (
                        <AdvancedMarker
                            key={supercharger.id} // unique key from object
                            position={supercharger.position} // marker position used by object
                            onClick={() => setSelectedMarker(supercharger)} // set selected marker on click using useState
                        />
                    ))}

                    {/* info pop up */}
                    {selectedMarker && (
                        <InfoWindow
                            position={selectedMarker.position}
                            onCloseClick={() => setSelectedMarker(null)}
                        >
                            <div style={{ padding: '10px', minWidth: '200px' }}>
                                <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>
                                    {selectedMarker.name}
                                </h3>
                                <p style={{ margin: '5px 0', color: '#666' }}>
                                    <strong>Stalls:</strong> {selectedMarker.stalls}
                                </p>
                                <p style={{ margin: '5px 0', color: '#666' }}>
                                    <strong>Power:</strong> {selectedMarker.power}
                                </p>
                                <p style={{ margin: '5px 0', color: '#666' }}>
                                    <strong>Status:</strong> <span style={{ color: 'green' }}>Available</span>
                                </p>
                            </div>
                        </InfoWindow>
                    )}
                </Map>
            </APIProvider>
        </div>
    );
};

export default MapComponent;