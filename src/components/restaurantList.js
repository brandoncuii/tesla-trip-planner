import React from 'react';

const RestaurantList = ({ restaurants, loading, hasSearched }) => {
    if (loading) {
        return (
            <div style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
                Finding restaurants...
            </div>
        );
    }

    if (!hasSearched) {
        return null;
    }
    
    if (hasSearched && restaurants.length === 0) {
        return (
            <div style={{ marginTop: '15px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
                    Nearby Restaurants:
                </h4>
                <div style={{ 
                    padding: '10px', 
                    backgroundColor: '#f9f9f9', 
                    borderRadius: '4px',
                    color: '#666',
                    fontSize: '14px',
                    fontStyle: 'italic'
                }}>
                    No restaurants found within walking distance. Try a different charging station!
                </div>
            </div>
        );
    }

    return (
        <div style={{ marginTop: '15px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#333' }}>
                Nearby Restaurants:
            </h4>
            {restaurants.slice(0, 3).map((restaurant, index) => (
                <div 
                    key={restaurant.id || index}
                    style={{ 
                        padding: '6px 0', 
                        borderBottom: '1px solid #eee',
                        fontSize: '14px'
                    }}
                >
                    <strong>{restaurant.name || 'Unnamed Restaurant'}</strong><br/>
                    <span style={{ color: '#666' }}>
                        {restaurant.rating}⭐ • {restaurant.types?.[0] || 'Restaurant'}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default RestaurantList;