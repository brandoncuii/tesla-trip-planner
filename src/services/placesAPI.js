const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const BASE_URL = 'https://places.googleapis.com/v1/places:searchNearby';

export const fetchSuperchargersFromFile = async () => {
    try {
        console.log('📁 Loading superchargers from local file...');
        
        const response = await fetch('/superchargers.json');
        const allSites = await response.json();
        
        console.log('📁 Total sites loaded:', allSites.length);
        
        // Filter for California and open sites
        const californiaSites = allSites.filter(site => 
            site.address?.state === 'CA' && site.status === 'OPEN'
        );
        
        console.log('📁 California sites found:', californiaSites.length);
        
        return californiaSites.map(site => ({
            id: site.id,
            name: `Tesla Supercharger - ${site.name}`,
            position: { 
                lat: parseFloat(site.gps.latitude), 
                lng: parseFloat(site.gps.longitude) 
            },
            stalls: site.stallCount || 'Multiple',
            power: site.powerKilowatt ? `${site.powerKilowatt}kW` : '250kW',
            status: 'Available',
            address: `${site.address?.street || ''}, ${site.address?.city || site.name}, CA`
        }));
    } catch (error) {
        console.error('Error loading supercharger file:', error);
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