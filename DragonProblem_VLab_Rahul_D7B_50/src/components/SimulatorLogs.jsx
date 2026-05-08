/* ─────────────────────────────────────────────────────────
   SimulatorLogs.jsx — Dragon Problem Virtual Lab
   Shows step-by-step logic log with structured cards
───────────────────────────────────────────────────────── */

const PHASE_META = {
  0: { label: 'Init',         color: '#6b7280', bg: '#f9fafb' },
  1: { label: 'Phase 1',      color: '#3b82f6', bg: '#eff6ff' },
  2: { label: 'Phase 2',      color: '#8b5cf6', bg: '#f5f3ff' },
  3: { label: 'Phase 3',      color: '#f59e0b', bg: '#fffbeb' },
  4: { label: 'Optimal',      color: '#10b981', bg: '#ecfdf5' },
};

const TYPE_ACCENT = {
  info:    '#6b7280',
  calc:    '#3b82f6',
  eval:    '#f59e0b',
  optimal: '#10b981',
};

/* Parse the multiline desc and render styled lines */
function StepDesc({ desc, type }) {
  const lines = (desc || '').split('\n').filter(Boolean);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {lines.map((line, i) => {
        const isCostLine    = /^(cost|total|cost\()/i.test(line.trim());
        const isFormulaLine = /formula/i.test(line.trim());
        const isMinimum     = line.includes('✨') || line.includes('minimum') || line.includes('Minimum');
        const isPath        = line.startsWith('Path:') || line.startsWith('S →') || line.startsWith('Start');

        if (isMinimum) {
          return (
            <div key={i} style={{
              marginTop: '6px', padding: '6px 10px', borderRadius: '6px',
              backgroundColor: '#d1fae5', color: '#065f46',
              fontWeight: '700', fontSize: '0.92rem',
              display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <span>✨</span> {line.replace('✨', '').trim()}
            </div>
          );
        }
        if (isCostLine) {
          return (
            <div key={i} style={{
              fontFamily: 'monospace', fontWeight: '700',
              color: TYPE_ACCENT[type] || '#374151',
              fontSize: '0.97rem', padding: '2px 0',
            }}>
              {line}
            </div>
          );
        }
        if (isFormulaLine) {
          return (
            <div key={i} style={{
              fontFamily: 'monospace', fontSize: '0.83rem',
              color: '#6b7280', padding: '2px 0', fontStyle: 'italic',
            }}>
              {line}
            </div>
          );
        }
        if (isPath) {
          return (
            <div key={i} style={{
              fontFamily: 'monospace', fontSize: '0.88rem',
              color: '#374151', padding: '2px 0',
            }}>
              {line}
            </div>
          );
        }
        return (
          <div key={i} style={{ color: '#4b5563', fontSize: '0.9rem', lineHeight: '1.55' }}>
            {line}
          </div>
        );
      })}
    </div>
  );
}

function LogCard({ log, index, isLatest }) {
  const accent  = TYPE_ACCENT[log.type] || '#94a3b8';
  const phase   = PHASE_META[log.phase] || PHASE_META[0];

  return (
    <div style={{
      borderRadius: '10px',
      border: `1px solid ${isLatest ? accent + '60' : '#e2e8f0'}`,
      borderLeft: `4px solid ${accent}`,
      backgroundColor: isLatest
        ? (log.type === 'optimal' ? '#ecfdf5' : log.type === 'eval' ? '#fffbeb' : '#fff')
        : '#fafafa',
      opacity: isLatest ? 1 : 0.55,
      padding: '13px 16px',
      transition: 'all 0.3s',
      animation: isLatest ? 'slideInRight 0.3s ease-out' : 'none',
    }}>
      {/* Card header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <h4 style={{
          margin: 0, color: '#0f172a', fontSize: '0.92rem', fontWeight: '700',
          flex: 1, paddingRight: '8px', lineHeight: 1.3,
        }}>
          {log.title}
        </h4>
        <span style={{
          backgroundColor: phase.color + '18',
          color: phase.color,
          fontSize: '0.65rem', fontWeight: '700',
          padding: '2px 8px', borderRadius: '10px',
          whiteSpace: 'nowrap', flexShrink: 0,
          border: `1px solid ${phase.color}30`,
        }}>
          {phase.label}
        </span>
      </div>

      {/* Formula chip */}
      {log.formula && (
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          backgroundColor: '#f1f5f9', borderRadius: '5px',
          padding: '2px 8px', marginBottom: '8px',
          fontFamily: 'monospace', fontSize: '0.78rem', color: '#475569',
        }}>
          {log.formula}
        </div>
      )}

      {/* Description */}
      <StepDesc desc={log.desc} type={log.type} />

      {/* Result badge */}
      {log.result !== null && isLatest && (
        <div style={{
          marginTop: '10px', display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          {log.lines.map((ln, i) => (
            <span key={i} style={{
              fontFamily: 'monospace', fontSize: '0.85rem',
              backgroundColor: accent + '18', color: accent,
              padding: '3px 10px', borderRadius: '6px',
              fontWeight: '600', border: `1px solid ${accent}30`,
            }}>
              {ln} = <strong>{log.result}</strong>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function SimulatorLogs({ currentStep, steps, logsEndRef, handleNext, handlePrev, isFinished, isFirst }) {
  return (
    <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', height: '580px', minWidth: '280px' }}>

      {/* ── Panel header with controls ── */}
      <div style={{
        padding: '13px 16px',
        backgroundColor: '#ffffff',
        borderRadius: '12px 12px 0 0',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1rem' }}>📋</span>
          <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>Logic Log</strong>
          <span style={{
            backgroundColor: '#f3f4f6', color: '#6b7280',
            fontSize: '0.7rem', padding: '2px 7px', borderRadius: '8px', fontWeight: '600',
          }}>
            {currentStep + 1}/{steps.length}
          </span>
        </div>

        {/* Nav buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={handlePrev}
            disabled={isFirst}
            title="Previous step"
            style={{
              padding: '6px 12px',
              backgroundColor: isFirst ? '#f3f4f6' : '#e5e7eb',
              color: isFirst ? '#9ca3af' : '#374151',
              border: '1px solid ' + (isFirst ? '#e5e7eb' : '#d1d5db'),
              borderRadius: '7px',
              cursor: isFirst ? 'not-allowed' : 'pointer',
              fontWeight: '700', fontSize: '0.85rem',
              transition: 'all 0.2s',
            }}
          >
            ◀ Prev
          </button>
          <button
            onClick={handleNext}
            disabled={isFinished}
            title="Next step"
            style={{
              padding: '6px 14px',
              background: isFinished
                ? '#f3f4f6'
                : 'linear-gradient(135deg,#1d4ed8,#6366f1)',
              color: isFinished ? '#9ca3af' : '#fff',
              border: isFinished ? '1px solid #e5e7eb' : 'none',
              borderRadius: '7px',
              cursor: isFinished ? 'not-allowed' : 'pointer',
              fontWeight: '700', fontSize: '0.85rem',
              boxShadow: isFinished ? 'none' : '0 2px 8px rgba(99,102,241,0.4)',
              transition: 'all 0.2s',
            }}
          >
            {isFinished ? 'Done ✅' : 'Next ▶'}
          </button>
        </div>
      </div>

      {/* ── Log entries ── */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '14px',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderTop: 'none',
        borderRadius: '0 0 12px 12px',
        display: 'flex', flexDirection: 'column', gap: '10px',
      }}>
        {steps.slice(0, currentStep + 1).map((log, index) => (
          <LogCard
            key={index}
            log={log}
            index={index}
            isLatest={index === currentStep}
          />
        ))}

        {/* Completion summary */}
        {isFinished && (
          <div style={{
            marginTop: '4px',
            backgroundColor: '#ecfdf5', border: '2px solid #10b981',
            borderRadius: '10px', padding: '16px',
            textAlign: 'center',
            animation: 'slideInRight 0.4s ease-out',
          }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>🏆</div>
            <div style={{ fontWeight: '800', color: '#065f46', fontSize: '1rem', marginBottom: '4px' }}>
              Simulation Complete!
            </div>
            <div style={{ fontSize: '0.85rem', color: '#047857', lineHeight: '1.6' }}>
              Optimal: <strong>S → D2 → D4</strong><br />
              Minimum Cost: <strong>4 + 3 = 7</strong>
            </div>
          </div>
        )}

        <div ref={logsEndRef} />
      </div>


    </div>
  );
}

export default SimulatorLogs;
