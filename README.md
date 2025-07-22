# Tesla Supercharger Trip Planner

A full-stack web application for Tesla road trip planning with real-time charging station locations across California and intelligent restaurant recommendations.
Created for solving the issue of not having great food options while driving between home and school.

Created by **Brandon Cui** | [LinkedIn](https://linkedin.com/in/brandoncui)

## Features

### **Comprehensive Charging Station Coverage**
- **200+ Tesla Superchargers** across all of California
- Real charging station data including stall counts and power levels
- Interactive map with custom markers and info windows
- Statewide coverage from San Diego to San Francisco and beyond

### **Smart Restaurant Discovery**
- **Location-based recommendations** within walking distance of charging stations
- **Dynamic filtering** by cuisine type (All, 4+ Stars, Fast Food, Sit-Down, Coffee)
- **Customizable walking distance** (2min, 5min, 10min, 15min radius)
- Real-time restaurant data with ratings and reviews

### **Advanced Filtering System**
- **Food Preferences Toolbar** - Set preferences once, applied to all stations
- **Walking Distance Control** - Choose how far you're willing to walk
- **Automatic filtering** - No need to re-select filters for each station
- **Smart status indicators** showing current filter settings

## Technology Stack

- **Frontend**: React.js, JavaScript, HTML/CSS
- **Maps**: Google Maps API with custom markers and info windows
- **Data Sources**: 
  - Supercharge.info database (local JSON parsing)
  - Google Places API (real-time restaurant data)
- **State Management**: React Hooks (useState, useEffect)
- **Build Tool**: Create React App
- **Version Control**: Git

## Architecture

### **Hybrid Data Strategy**
- **Charging Stations**: Local JSON file from supercharge.info (no API limits, complete coverage)
- **Restaurants**: Google Places API (real-time data, reviews, ratings)
- **Smart combination** eliminates rate limiting while maintaining data freshness

### **Component Structure**
src/
├── components/
│   ├── MapComponent.js           # Main map with supercharger markers
│   ├── FoodPreferencesToolbar.js # Filter controls for food & distance
│   ├── SuperchargerInfoWindow.js # Popup with station details & restaurant finder
│   └── RestaurantList.js         # Restaurant results display
├── hooks/
│   └── useSuperchargers.js       # Custom hook for loading charging stations
├── services/
│   └── placesAPI.js              # API functions for restaurants & charging data
└── public/
└── superchargers.json        # Local database of Tesla Superchargers

## Getting Started

### **Prerequisites**
- Node.js (v14 or higher)
- Google Maps API key with Places API enabled

### **Installation**

1. **Clone the repository**
    ```bash
    git clone https://github.com/brandoncui/tesla-trip-planner.git
    cd tesla-trip-planner

2. **Install dependencies**
    ```bash
    npm install

3. **Set up environment variables** Create a .env file in the root directory:
    REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here

4. **Start the development server**
    ```bash
    npm start

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

### **Getting a Google Maps API Key**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Maps JavaScript API** and **Places API**
4. Create credentials (API Key)
5. Add the key to your `.env` file

## How to Use

1. **Set Your Preferences**
   - Choose food type (All, 4+ Stars, Fast Food, Sit-Down, Coffee)
   - Select walking distance (2min, 5min, 10min, 15min)

2. **Explore the Map**
   - View all Tesla Superchargers across California
   - Click any charging station marker

3. **Find Restaurants**
   - Click "Find [food type] within [distance]" in the popup
   - View filtered restaurant recommendations
   - See ratings and restaurant types

4. **Plan Your Trip**
   - Identify charging stops along your route
   - Find meals during charging sessions
   - Plan breaks based on your food preferences

## Key Problems Solved

### **API Rate Limiting**
- **Problem**: Google Places API had radius limitations and quota restrictions
- **Solution**: Hybrid approach using local supercharge.info database for charging stations, Google API only for restaurants

### **Limited Coverage**
- **Problem**: Small search radius only covered Bay Area
- **Solution**: Local database provides complete California coverage (200+ stations)

### **Poor User Experience**
- **Problem**: Having to set filters repeatedly for each station
- **Solution**: Global preferences toolbar that applies to all stations

### **Real-World Utility**
- **Problem**: Most EV apps don't consider food during charging stops
- **Solution**: Walking distance-based restaurant recommendations with smart filtering

## Future Enhancements

- [ ] **Multi-state filtering**
- [ ] **Route planning** between multiple charging stations
- [ ] **Restaurant markers** on map with walking routes
- [ ] **Real-time charging station availability**
- [ ] **User reviews** and favorite stations
- [ ] **Mobile app** version

## Acknowledgments

- **Supercharge.info** for providing comprehensive Tesla Supercharger database
- **Google Maps Platform** for mapping and places data
- **Tesla community** for inspiration and feedback
- **React team** for the excellent framework

---