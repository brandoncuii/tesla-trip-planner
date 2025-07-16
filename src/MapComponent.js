import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';

const MapComponent = () => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const paloAlto = { lat: 37.4419, lng: -122.1430 };

    const [selectedMarker, setSelectedMarker] = useState(null);
    const [superchargers, setSuperchargers] = useState([]);
    const [loadingSuperchargers, setLoadingSuperchargers] = useState(true);
    const [restaurants, setRestaurants] = useState([]);
    const [loadingFood, setLoadingFood] = useState(false);

    const loadGoogleMapsPlaces = () => {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps && window.google.maps.places) {
                resolve();
                return;
            }

            if (window.google && window.google.maps) {
                let attempts = 0;
                const checkForPlaces = () => {
                    attempts++;
                    if (window.google.maps.places) {
                        resolve();
                    } else if (attempts < 50) {
                        setTimeout(checkForPlaces, 100);
                    } else {
                        reject(new Error('Places API not available'));
                    }
                };
                checkForPlaces();
            } else {
                reject(new Error('Google Maps not loaded'));
            }
        });
    };

    const fetchRealSuperchargers = async () => {
        try {
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout after 10 seconds')), 10000)
            );
            
            await Promise.race([loadGoogleMapsPlaces(), timeoutPromise]);
            
            const service = new window.google.maps.places.PlacesService(document.createElement('div'));
            
            return new Promise((resolve) => {
                service.textSearch({
                    query: 'Tesla Supercharger',
                    location: new window.google.maps.LatLng(37.4419, -122.1430),
                    radius: 50000
                }, (results, status) => {
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        const superchargers = results.map((place, index) => {
                            // Better name logic - use the full place name or create a descriptive one
                            let name = place.name;
                            if (!name || name === "Tesla Supercharger") {
                                // Extract location from address
                                const location = place.vicinity || 
                                               (place.formatted_address ? place.formatted_address.split(',')[0] : null) ||
                                               "Unknown Location";
                                name = `Tesla Supercharger - ${location}`;
                            }
                            
                            return {
                                id: place.place_id || index + 1,
                                name: name,
                                position: {
                                    lat: place.geometry.location.lat(),
                                    lng: place.geometry.location.lng()
                                },
                                stalls: 'Multiple',
                                power: '250kW',
                                status: place.business_status === 'OPERATIONAL' ? 'Available' : 'Check Status',
                                rating: place.rating || 'N/A',
                                address: place.formatted_address || 'Address not available'
                            };
                        });
                        resolve(superchargers);
                    } else {
                        resolve([]);
                    }
                });
            });
        } catch (error) {
            return [];
        }
    };

    React.useEffect(() => {
        const loadSuperchargers = async () => {
            setLoadingSuperchargers(true);
            
            try {
                const realSuperchargers = await fetchRealSuperchargers();
                setSuperchargers(realSuperchargers);
            } catch (error) {
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
            
            setLoadingSuperchargers(false);
        };
        
        loadSuperchargers();
    }, []);

    const findNearbyFood = async (supercharger) => {
        setLoadingFood(true);
        setRestaurants([]);
        
        try {
            await loadGoogleMapsPlaces();
            
            const service = new window.google.maps.places.PlacesService(document.createElement('div'));
            
            const request = {
                location: new window.google.maps.LatLng(
                    supercharger.position.lat, 
                    supercharger.position.lng
                ),
                radius: 500,
                type: 'restaurant'
            };
            
            service.nearbySearch(request, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    setRestaurants(results);
                } else {
                    setRestaurants([]);
                }
                setLoadingFood(false);
            });
            
        } catch (error) {
            setLoadingFood(false);
        }
    };
    
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
                            onClick={() => {
                                setSelectedMarker(supercharger);
                                setRestaurants([]);
                            }}
                        />
                    ))}

                    {selectedMarker && (
                        <InfoWindow
                            position={selectedMarker.position}
                            onCloseClick={() => setSelectedMarker(null)}
                        >
                            <div style={{ padding: '10px', minWidth: '250px' }}>
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
                                
                                <button 
                                    onClick={() => findNearbyFood(selectedMarker)}
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

                                {restaurants.length > 0 && (
                                    <div style={{ marginTop: '15px' }}>
                                        <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
                                            Nearby Restaurants:
                                        </h4>
                                        {restaurants.slice(0, 3).map((restaurant, index) => (
                                            <div key={index} style={{ 
                                                padding: '6px 0', 
                                                borderBottom: '1px solid #eee',
                                                fontSize: '14px'
                                            }}>
                                                <strong>{restaurant.name}</strong><br/>
                                                <span style={{ color: '#666' }}>
                                                    {restaurant.rating}⭐ • {restaurant.types?.[0] || 'Restaurant'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </InfoWindow>
                    )}
                </Map>
            </APIProvider>
        </div>
    );
};

export default MapComponent;