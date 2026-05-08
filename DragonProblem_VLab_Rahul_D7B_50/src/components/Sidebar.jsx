function Sidebar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'aim',       label: 'Aim',                  icon: '🎯', sub: 'Problem Statement'   },
    { id: 'theory',    label: 'Theory & Logic',        icon: '📚', sub: 'DP Formulas & Steps' },
    { id: 'simulator', label: 'Interactive Simulator', icon: '⚗️', sub: 'Step-by-step Demo'   },
  ];

  return (
    <div style={{
      width: '272px',
      minWidth: '272px',
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 10,
      borderRight: '1px solid #e5e7eb',
      boxShadow: '1px 0 3px rgba(0,0,0,0.05)',
    }}>
      {/* ── Logo ── */}
      <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '42px', height: '42px',
            background: 'linear-gradient(135deg, #6366f1, #3b82f6)',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', flexShrink: 0,
            boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
          }}>
            🐉
          </div>
          <div>
            <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.05rem', fontWeight: '700', letterSpacing: '-0.01em' }}>
              Dragon Lab
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: '#6b7280', fontWeight: '600', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              Algorithms • CS Dept.
            </p>
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        <p style={{
          margin: '0 0 10px 8px',
          fontSize: '0.68rem', color: '#9ca3af', fontWeight: '700',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          Experiment Sections
        </p>

        {tabs.map((tab, i) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%',
                padding: '12px 14px',
                marginBottom: '6px',
                textAlign: 'left',
                background: isActive
                  ? '#eff6ff'
                  : 'transparent',
                border: isActive ? '1px solid #bfdbfe' : '1px solid transparent',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease',
                outline: 'none',
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <div style={{
                width: '34px', height: '34px', borderRadius: '8px', flexShrink: 0,
                backgroundColor: isActive ? '#dbeafe' : '#f3f4f6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.05rem',
                transition: 'all 0.2s',
              }}>
                {tab.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.87rem',
                  fontWeight: isActive ? '700' : '500',
                  color: isActive ? '#1d4ed8' : '#4b5563',
                  lineHeight: 1.2,
                  marginBottom: '2px',
                }}>
                  {i + 1}. {tab.label}
                </div>
                <div style={{
                  fontSize: '0.72rem',
                  color: isActive ? '#3b82f6' : '#9ca3af',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  {tab.sub}
                </div>
              </div>
              {isActive && (
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#3b82f6', flexShrink: 0 }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── Footer card ── */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ backgroundColor: '#f9fafb', borderRadius: '10px', padding: '14px 16px', border: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem' }}>💡</span>
            <span style={{ fontSize: '0.72rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Key Concept</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#374151', lineHeight: '1.6' }}>
            <span style={{ color: '#1d4ed8', fontWeight: '600' }}>Dragon Problem</span> is solved
            via <span style={{ color: '#7c3aed' }}>Dynamic Programming</span> on a
            constrained grid path.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
