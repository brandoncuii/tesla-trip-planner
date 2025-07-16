export const loadGoogleMapsPlaces = () => {
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

export const fetchSuperchargers = async () => {
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
                        let name = place.name;
                        if (!name || name === "Tesla Supercharger") {
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

export const fetchNearbyRestaurants = async (supercharger) => {
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
        
        return new Promise((resolve) => {
            service.nearbySearch(request, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    resolve(results);
                } else {
                    resolve([]);
                }
            });
        });
    } catch (error) {
        return [];
    }
};