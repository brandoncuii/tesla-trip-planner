import React from 'react';

const FoodPreferencesToolbar = ({ selectedFilter, onFilterChange }) => {
    const FilterButton = ({ filterType, label, emoji }) => (
        <button
            onClick={() => onFilterChange(filterType)}
            style={{
                padding: '8px 12px',
                margin: '0 4px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: selectedFilter === filterType ? '#1976d2' : 'white',
                color: selectedFilter === filterType ? 'white' : '#333',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s ease',
                fontWeight: selectedFilter === filterType ? '500' : 'normal'
            }}
            onMouseEnter={(e) => {
                if (selectedFilter !== filterType) {
                    e.target.style.backgroundColor = '#f5f5f5';
                }
            }}
            onMouseLeave={(e) => {
                if (selectedFilter !== filterType) {
                    e.target.style.backgroundColor = 'white';
                }
            }}
        >
            {emoji && <span>{emoji}</span>}
            {label}
        </button>
    );

    return (
        <div style={{
            padding: '12px 20px',
            backgroundColor: '#f9f9f9',
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
        }}>
            <div style={{
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
            }}>
                🍕 Food Preferences:
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0' }}>
                <FilterButton
                    filterType="all"
                    label="All"
                    emoji="🍽️"
                />
                <FilterButton
                    filterType="highRated"
                    label="4+ Stars"
                    emoji="⭐"
                />
                <FilterButton
                    filterType="fastFood"
                    label="Fast Food"
                    emoji="🍔"
                />
                <FilterButton
                    filterType="casual"
                    label="Sit-Down"
                    emoji="🍝"
                />
                <FilterButton
                    filterType="coffee"
                    label="Coffee"
                    emoji="☕"
                />
            </div>
            
            {selectedFilter !== 'all' && (
                <div style={{
                    fontSize: '12px',
                    color: '#666',
                    fontStyle: 'italic',
                    marginLeft: '8px'
                }}>
                    Restaurant results will be filtered automatically
                </div>
            )}
        </div>
    );
};

export default FoodPreferencesToolbar;