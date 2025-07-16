import React, { useState, useEffect } from 'react';
import { APIProvider, Map, AdvancedMarker, InfoWindow } from '@vis.gl/react-google-maps';

const MapComponent = () => {
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const paloAlto = { lat: 37.4419, lng: -122.1430 };

    const [selectedMarker, setSelectedMarker] = useState(null); // sets initial selected marker to none

    const [superchargers, setSuperchargers] = useState([]);
    const [loadingSuperchargers, setLoadingSuperchargers] = useState(true);
    
    const [restaurants, setRestaurants] = useState([]); // useState for nearby restraurant data
    const [loadingFood, setLoadingFood] = useState(false);

    // helper function to load Google Maps Places API dynamically
    const loadGoogleMapsPlaces = () => {
        return new Promise((resolve, reject) => {
            // Check if Places API is already loaded
            if (window.google && window.google.maps && window.google.maps.places) {
                resolve();
                return;
            }
    
            if (window.google && window.google.maps) {
                const script = document.createElement('script');
                script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
                script.async = true;
                script.defer = true;
                
                script.onload = () => {
                    setTimeout(() => {
                        if (window.google && window.google.maps && window.google.maps.places) {
                            resolve();
                        } else {
                            reject(new Error('Places library failed to load'));
                        }
                    }, 100);
                };
                
                script.onerror = () => reject(new Error('Failed to load Places library'));
                document.head.appendChild(script);
            } else {
                reject(new Error('Google Maps not loaded'));
            }
        });
    };

    const fetchRealSuperchargers = async () => {
        try {
            console.log("Fetching real Tesla Superchargers...");
            
            // Load Places API
            await loadGoogleMapsPlaces();
            
            const service = new window.google.maps.places.PlacesService(document.createElement('div'));
            
            return new Promise((resolve) => {
                service.textSearch({
                    query: 'Tesla Supercharger',
                    location: new window.google.maps.LatLng(37.4419, -122.1430), // Bay Area center
                    radius: 50000 // 50km radius
                }, (results, status) => {
                    console.log("Supercharger search status:", status);
                    console.log("Supercharger results:", results);
                    
                    if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                        const superchargers = results.map((place, index) => ({
                            id: place.place_id || index + 1, // Use place_id for unique IDs
                            name: place.name,
                            position: {
                                lat: place.geometry.location.lat(),
                                lng: place.geometry.location.lng()
                            },
                            stalls: 'Multiple', // Places API doesn't have exact count
                            power: '250kW', // Assume modern superchargers
                            status: place.business_status === 'OPERATIONAL' ? 'Available' : 'Check Status',
                            rating: place.rating || 'N/A',
                            address: place.formatted_address || 'Address not available'
                        }));
                        resolve(superchargers);
                    } else {
                        console.error('Places search failed:', status);
                        resolve([]); // Return empty array on failure
                    }
                });
            });
        } catch (error) {
            console.error('Error fetching real superchargers:', error);
            return [];
        }
    };

    React.useEffect(() => {
        const loadSuperchargers = async () => {
            setLoadingSuperchargers(true);
            
            const realSuperchargers = await fetchRealSuperchargers();
            setSuperchargers(realSuperchargers); // Use real data or empty array
            
            setLoadingSuperchargers(false);
        };
        
        loadSuperchargers();
    }, []);

    const findNearbyFood = async (supercharger) => {
        setLoadingFood(true);
        setRestaurants([]);
        
        try {
            console.log("Searching for food near:", supercharger.name);
            
            // Load Places API dynamically
            await loadGoogleMapsPlaces();
            
            console.log("Places API loaded successfully");
            
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
                console.log("Places API status:", status);
                console.log("Places API results:", results);
                
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    setRestaurants(results);
                } else {
                    console.error('Places service failed:', status);
                    setRestaurants([]);
                }
                setLoadingFood(false);
            });
            
        } catch (error) {
            console.error('Error finding food:', error);
            setLoadingFood(false);
        }
    };
    
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
                                
                                {/* find food button below supercharger information */}
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

                                {/* restaurant results */}
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