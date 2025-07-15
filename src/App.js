import './App.css';
import MapComponent from './MapComponent';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Tesla Trip Planner</h1>
        <p>Plan your road trip with supercharger stops and food!</p>
        <p>Created by Brandon Cui</p>
      </header>
      <main style={{ padding: '20px' }}>
        <h2>Map View</h2>
        <MapComponent />
      </main>
    </div>
  );
}

export default App;