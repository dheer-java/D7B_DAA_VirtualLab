import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TheoryTab from './components/TheoryTab';
import SimulatorTab from './components/SimulatorTab';

function App() {
  const [activeTab, setActiveTab] = useState('aim');

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      width: '100%',
      overflow: 'hidden',
      backgroundColor: '#f1f5f9',
      color: '#0f172a',
    }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: '36px 40px',
        background: 'linear-gradient(145deg, #eef2ff 0%, #f8fafc 45%, #f0fdf4 100%)',
      }}>
        {activeTab === 'aim' || activeTab === 'theory' ? (
          <TheoryTab activeTab={activeTab} />
        ) : (
          <SimulatorTab />
        )}
      </main>
    </div>
  );
}

export default App;
