const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const BASE_URL = 'https://places.googleapis.com/v1/places:searchNearby';

export const fetchSuperchargers = async () => {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': API_KEY,
                'X-Goog-FieldMask':
                    'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.primaryTypeDisplayName'
            },
            body: JSON.stringify({
                includedTypes: ['electric_vehicle_charging_station'],
                maxResultCount: 20,
                locationRestriction: {
                    circle: {
                        center: { latitude: 37.4419, longitude: -122.1430 },
                        radius: 50000
                    }
                }
            })
        });

        if (!response.ok) {
            console.error('API Response:', response.status, response.statusText);
            throw new Error(`Google Places API error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Raw API response:', data);
        
        if (!data.places || data.places.length === 0) {
            console.warn('No EV stations found in this area.');
            return [];
        }

        // Simplified filtering - only exclude obvious dealerships
        const filteredPlaces = data.places.filter(place => {
            const name = place.displayName?.text?.toLowerCase() || '';
            
            // Only exclude obvious car dealerships
            const isCarDealership = 
                name.includes('volvo') && name.includes('cars') ||
                name.includes('bmw') && name.includes('dealership') ||
                name.includes('mercedes') && name.includes('dealership') ||
                name.includes('honda') && name.includes('dealership') ||
                name.includes('toyota') && name.includes('dealership');
            
            return !isCarDealership;
        });

        console.log('Filtered places:', filteredPlaces.length);

        return filteredPlaces.map((place) => ({
            id: place.id,
            name: place.displayName?.text || 'Unknown Charging Station',
            position: {
                lat: place.location.latitude,
                lng: place.location.longitude
            },
            address: place.formattedAddress || 'Address not available',
            stalls: 'Multiple',
            power: '250kW',
            status: 'Check Status',
            rating: place.rating || 'N/A'
        }));
    } catch (error) {
        console.error('Error fetching superchargers:', error);
        return [];
    }
};

export const fetchNearbyRestaurants = async (supercharger) => {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': API_KEY,
                'X-Goog-FieldMask':
                    'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.types'
            },
            body: JSON.stringify({
                includedTypes: ['restaurant'],
                maxResultCount: 10,
                locationRestriction: {
                    circle: {
                        center: { 
                            latitude: supercharger.position.lat, 
                            longitude: supercharger.position.lng 
                        },
                        radius: 500
                    }
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Google Places API error: ${response.statusText}`);
        }

        const data = await response.json();
        if (!data.places || data.places.length === 0) {
            console.warn('No restaurants found near this location.');
            return [];
        }

        return data.places.map((place) => ({
            name: place.displayName?.text || 'Unknown Restaurant',
            rating: place.rating || 'N/A',
            types: place.types || ['restaurant'],
            address: place.formattedAddress || 'Address not available'
        }));
    } catch (error) {
        console.error('Error fetching nearby restaurants:', error);
        return [];
    }
};