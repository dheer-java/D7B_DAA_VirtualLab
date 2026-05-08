import React from 'react';

function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'aim', label: '1. Aim & Objective' },
    { id: 'theory', label: '2. Theory & Logic' },
    { id: 'simulator', label: '3. Interactive Simulator' }
  ];

  return (
    <div style={{ width: '260px', backgroundColor: '#ffffff', borderRight: '1px solid #dee2e6', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '25px 20px', borderBottom: '1px solid #dee2e6', backgroundColor: '#eef2ff' }}>
        <h2 style={{ margin: 0, color: '#1d4ed8', fontSize: '1.3rem', fontWeight: 'bold' }}>VLab: DAA</h2>
        <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#64748b' }}>Selection Sort</p>
      </div>
      
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
        {tabs.map(tab => (
          <li key={tab.id}>
            <button
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%', padding: '15px 20px', textAlign: 'left',
                background: activeTab === tab.id ? '#eff6ff' : 'transparent',
                border: 'none', borderLeft: activeTab === tab.id ? '4px solid #3b82f6' : '4px solid transparent',
                cursor: 'pointer', fontSize: '1rem', color: activeTab === tab.id ? '#1e40af' : '#475569',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal', transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;