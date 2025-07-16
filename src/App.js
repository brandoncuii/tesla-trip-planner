import './App.css';
import MapComponent from './MapComponent';

const App = () => {
  return (
    <div className="App" style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#282c34'  // Add dark background
    }}>
      <header style={{ 
        padding: '10px 20px', 
        backgroundColor: '#f5f5f5', 
        borderBottom: '1px solid #ddd',
        flexShrink: 0
      }}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '22px', color: '#333' }}>Tesla Supercharger Information and Planning</h1>
        <p style={{ margin: '2px 0', fontSize: '13px', color: '#666' }}>Created to plan your road trip with supercharger stops and food • Created by Brandon Cui</p>
      </header>
      <main style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <h2 style={{ margin: '10px 20px', fontSize: '18px', color: 'white' }}>Map View</h2>
        <div style={{ flex: 1, height: '100%' }}>
          <MapComponent />
        </div>
      </main>
    </div>
  );
}

export default App;