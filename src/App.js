import React from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import MapComponent from './components/MapComponent';
import './App.css';

const App = () => {
  return (
    <APIProvider apiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <div className="App">
        <header style={{ 
          textAlign: 'center', 
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderBottom: '1px solid #ddd'
        }}>
          <h1 style={{ margin: 0, color: '#333' }}>
            Tesla Supercharger Information and Planning
          </h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>
            Created to plan your road trip with supercharger stops and food • Created by Brandon Cui
          </p>
        </header>
        
        <MapComponent />
      </div>
    </APIProvider>
  );
}

export default App;