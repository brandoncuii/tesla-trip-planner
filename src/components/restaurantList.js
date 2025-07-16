import React from 'react';

const RestaurantList = ({ restaurants, loading }) => {
    if (loading) {
        return (
            <div style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
                Finding restaurants...
            </div>
        );
    }

    if (restaurants.length === 0) {
        return null;
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