import React from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';

const MapComponent = () => {
  const apiKey = "AIzaSyDLN8iuLnZS36foGYMaRSIe5h3QZp2F1EE";
  
  const paloAlto = { lat: 37.4419, lng: -122.1430 };

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={paloAlto}
          defaultZoom={13}
          mapId="tesla-trip-planner"
        />
      </APIProvider>
    </div>
  );
};

export default MapComponent;