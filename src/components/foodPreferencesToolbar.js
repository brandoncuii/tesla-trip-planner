import React from 'react';

const FoodPreferencesToolbar = ({ selectedFilter, onFilterChange, walkingRadius, onRadiusChange }) => {
    const FilterButton = ({ filterType, label, emoji, isActive, onClick }) => (
        <button
            onClick={onClick}
            style={{
                padding: '8px 12px',
                margin: '0 4px',
                fontSize: '14px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: isActive ? '#1976d2' : 'white',
                color: isActive ? 'white' : '#333',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                transition: 'all 0.2s ease',
                fontWeight: isActive ? '500' : 'normal'
            }}
            onMouseEnter={(e) => {
                if (!isActive) {
                    e.target.style.backgroundColor = '#f5f5f5';
                }
            }}
            onMouseLeave={(e) => {
                if (!isActive) {
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
            gap: '20px',
            flexWrap: 'wrap'
        }}>
            {/* Food Preferences Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                        isActive={selectedFilter === 'all'}
                        onClick={() => onFilterChange('all')}
                    />
                    <FilterButton
                        filterType="highRated"
                        label="4+ Stars"
                        emoji="⭐"
                        isActive={selectedFilter === 'highRated'}
                        onClick={() => onFilterChange('highRated')}
                    />
                    <FilterButton
                        filterType="fastFood"
                        label="Fast Food"
                        emoji="🍔"
                        isActive={selectedFilter === 'fastFood'}
                        onClick={() => onFilterChange('fastFood')}
                    />
                    <FilterButton
                        filterType="casual"
                        label="Sit-Down"
                        emoji="🍝"
                        isActive={selectedFilter === 'casual'}
                        onClick={() => onFilterChange('casual')}
                    />
                    <FilterButton
                        filterType="coffee"
                        label="Coffee"
                        emoji="☕"
                        isActive={selectedFilter === 'coffee'}
                        onClick={() => onFilterChange('coffee')}
                    />
                </div>
            </div>

            {/* Walking Distance Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#333',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                }}>
                    🚶‍♂️ Walking Distance:
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0' }}>
                    <FilterButton
                        label="2 min"
                        emoji="🏃‍♂️"
                        isActive={walkingRadius === 200}
                        onClick={() => onRadiusChange(200)}
                    />
                    <FilterButton
                        label="5 min"
                        emoji="🚶‍♂️"
                        isActive={walkingRadius === 500}
                        onClick={() => onRadiusChange(500)}
                    />
                    <FilterButton
                        label="10 min"
                        emoji="🚶‍♀️"
                        isActive={walkingRadius === 800}
                        onClick={() => onRadiusChange(800)}
                    />
                    <FilterButton
                        label="15 min"
                        emoji="🚶"
                        isActive={walkingRadius === 1200}
                        onClick={() => onRadiusChange(1200)}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginLeft: 'auto' }}>
                {selectedFilter !== 'all' && (
                    <div style={{
                        fontSize: '12px',
                        color: '#1976d2',
                        padding: '4px 8px',
                        backgroundColor: '#e3f2fd',
                        borderRadius: '4px'
                    }}>
                        {selectedFilter === 'highRated' ? '4+ star restaurants' :
                         selectedFilter === 'fastFood' ? 'Fast food places' :
                         selectedFilter === 'casual' ? 'Sit-down restaurants' :
                         selectedFilter === 'coffee' ? 'Coffee shops' : 'Filtered restaurants'}
                    </div>
                )}
                
                <div style={{
                    fontSize: '12px',
                    color: '#666',
                    padding: '4px 8px',
                    backgroundColor: '#f0f0f0',
                    borderRadius: '4px'
                }}>
                    Within {walkingRadius === 200 ? '2 min' :
                            walkingRadius === 500 ? '5 min' :
                            walkingRadius === 800 ? '10 min' : '15 min'} walk
                </div>
            </div>
        </div>
    );
};

export default FoodPreferencesToolbar;