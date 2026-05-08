import { useRef, useEffect, useState } from 'react';

const ROWS = 5;
const COLS = 6;
const DRAGONS = {
  S:  { r: 0, c: 0 },
  D1: { r: 1, c: 4 },
  D2: { r: 2, c: 2 },
  D3: { r: 3, c: 5 },
  D4: { r: 4, c: 1 },
};

const TYPE_COLORS = {
  calc:    { line: '#3b82f6', arrowId: 'arrow-blue'   },
  eval:    { line: '#f59e0b', arrowId: 'arrow-orange' },
  optimal: { line: '#10b981', arrowId: 'arrow-green'  },
  info:    { line: '#94a3b8', arrowId: 'arrow-gray'   },
};

/* Shorten the line so it ends before the arrowhead overlaps the cell */
function shortenLine(x1, y1, x2, y2, offset = 16) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < offset * 2) return { x1, y1, x2, y2 };
  const ratio = offset / len;
  return {
    x1: x1 + dx * ratio,
    y1: y1 + dy * ratio,
    x2: x2 - dx * ratio,
    y2: y2 - dy * ratio,
  };
}

function SimulatorMatrix({ activeData, handleReset }) {
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);

  const updateLines = () => {
    if (!containerRef.current || !activeData?.activeCells || activeData.activeCells.length < 2) {
      setLines([]); return;
    }
    const cRect = containerRef.current.getBoundingClientRect();
    const newLines = [];
    const { line: color, arrowId } = TYPE_COLORS[activeData.type] || TYPE_COLORS.info;

    for (let i = 0; i < activeData.activeCells.length - 1; i++) {
      const el1 = document.getElementById(`gc-${activeData.activeCells[i]}`);
      const el2 = document.getElementById(`gc-${activeData.activeCells[i + 1]}`);
      if (!el1 || !el2) continue;

      const r1 = el1.getBoundingClientRect();
      const r2 = el2.getBoundingClientRect();
      const cx1 = r1.left + r1.width / 2 - cRect.left;
      const cy1 = r1.top  + r1.height / 2 - cRect.top;
      const cx2 = r2.left + r2.width / 2 - cRect.left;
      const cy2 = r2.top  + r2.height / 2 - cRect.top;
      const s   = shortenLine(cx1, cy1, cx2, cy2, 18);
      newLines.push({ id: i, ...s, color, arrowId });
    }
    setLines(newLines);
  };

  useEffect(() => {
    const t = setTimeout(updateLines, 60);
    window.addEventListener('resize', updateLines);
    return () => { clearTimeout(t); window.removeEventListener('resize', updateLines); };
  }, [activeData]);

  /* Cell appearance */
  const getCellProps = (r, c) => {
    const label = Object.keys(DRAGONS).find(k => DRAGONS[k].r === r && DRAGONS[k].c === c) || '';
    const isActive = activeData?.activeCells?.includes(label) ?? false;
    const type = activeData?.type ?? 'info';

    let bg = '#f8fafc', border = '#e2e8f0', anim = 'none', zIdx = 1;
    let icon = '', badgeBg = '#e2e8f0', badgeColor = '#64748b';

    if (label === 'S')           { bg = '#eff6ff'; border = '#bfdbfe'; icon = '🤺'; badgeBg = '#3b82f6'; badgeColor = '#fff'; zIdx = 6; }
    if (label.startsWith('D'))   { bg = '#fff1f2'; border = '#fecdd3'; icon = '🐉'; badgeBg = '#e11d48'; badgeColor = '#fff'; zIdx = 6; }

    if (isActive) {
      zIdx = 12;
      if (type === 'calc')    { bg = '#e0f2fe'; border = '#38bdf8'; anim = 'pulseCalc 1.5s ease-in-out infinite'; }
      if (type === 'eval')    { bg = '#fef3c7'; border = '#fbbf24'; }
      if (type === 'optimal') { bg = '#d1fae5'; border = '#10b981'; anim = 'pulseOptimal 2s ease-in-out infinite'; }
    }

    return { label, icon, isActive, bg, border, anim, zIdx, badgeBg, badgeColor };
  };

  const lineColor = (TYPE_COLORS[activeData?.type] || TYPE_COLORS.info).line;

  return (
    <div style={{ flex: '2 1 480px', minWidth: 0 }}>

      {/* ── Grid header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem', fontWeight: '700' }}>🗺️ Kingdom Grid</h3>
        <button
          onClick={handleReset}
          style={{
            padding: '7px 14px', backgroundColor: '#fef2f2', color: '#ef4444',
            border: '1px solid #fca5a5', borderRadius: '8px',
            cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#fee2e2'; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#fef2f2'; }}
        >
          ↻ Reset
        </button>
      </div>

      {/* ── Grid card ── */}
      <div style={{
        backgroundColor: '#fff', border: '1px solid #e2e8f0',
        borderRadius: '14px', padding: '20px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
        overflowX: 'auto',
      }}>
        <div ref={containerRef} style={{ position: 'relative', maxWidth: '520px', margin: '0 auto' }}>

          {/* ── SVG overlay ── */}
          <svg
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5, overflow: 'visible' }}
          >
            <defs>
              {Object.entries(TYPE_COLORS).map(([, { line, arrowId }]) => (
                <marker
                  key={arrowId}
                  id={arrowId}
                  markerWidth="9" markerHeight="7"
                  refX="8" refY="3.5"
                  orient="auto"
                >
                  <polygon points="0 0, 9 3.5, 0 7" fill={line} />
                </marker>
              ))}
            </defs>

            {lines.map(ln => (
              <line
                key={ln.id}
                x1={ln.x1} y1={ln.y1} x2={ln.x2} y2={ln.y2}
                stroke={ln.color}
                strokeWidth="2.8"
                strokeDasharray="9 7"
                markerEnd={`url(#${ln.arrowId})`}
                style={{ animation: 'dashMove 0.9s linear infinite' }}
              />
            ))}
          </svg>

          {/* ── Grid cells ── */}
          <div style={{ display: 'grid', gridTemplateColumns: `36px repeat(${COLS}, 1fr)`, gap: '8px' }}>

            {/* Column headers */}
            <div />
            {Array.from({ length: COLS }, (_, c) => (
              <div key={`ch-${c}`} style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8', paddingBottom: '2px' }}>
                C{c}
              </div>
            ))}

            {/* Rows */}
            {Array.from({ length: ROWS }, (_, r) => [
              /* Row header */
              <div key={`rh-${r}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: '700', color: '#94a3b8' }}>
                R{r}
              </div>,

              /* Cells */
              ...Array.from({ length: COLS }, (_, c) => {
                const { label, icon, isActive, bg, border, anim, zIdx, badgeBg, badgeColor } = getCellProps(r, c);
                const cellId = label ? `gc-${label}` : `gc-empty-${r}-${c}`;

                return (
                  <div
                    key={`cell-${r}-${c}`}
                    id={cellId}
                    style={{
                      position: 'relative',
                      height: '68px',
                      display: 'flex', flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center',
                      border: `2px solid ${border}`,
                      backgroundColor: bg,
                      borderRadius: '10px',
                      animation: anim,
                      zIndex: zIdx,
                      transition: 'background-color 0.35s, border-color 0.35s',
                    }}
                  >
                    {icon && (
                      <span style={{
                        fontSize: '2rem', lineHeight: 1,
                        filter: isActive ? 'drop-shadow(0 3px 6px rgba(0,0,0,0.25))' : 'none',
                        transition: 'filter 0.3s',
                      }}>
                        {icon}
                      </span>
                    )}
                    {label && (
                      <div style={{
                        position: 'absolute', top: '-9px', right: '-9px',
                        backgroundColor: badgeBg, color: badgeColor,
                        fontSize: '0.65rem', fontWeight: '700',
                        padding: '2px 6px', borderRadius: '8px',
                        border: '2px solid #fff',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                      }}>
                        {label}
                      </div>
                    )}
                  </div>
                );
              }),
            ])}
          </div>
        </div>

        {/* ── Legend ── */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '18px',
          paddingTop: '14px', borderTop: '1px solid #f1f5f9',
        }}>
          {[
            { icon: '🤺', label: 'Hero — Start (0,0)', bg: '#eff6ff', border: '#bfdbfe' },
            { icon: '🐉', label: 'Dragon',             bg: '#fff1f2', border: '#fecdd3' },
            { dot: '#3b82f6', label: 'Calculating cost',  bg: '#e0f2fe' },
            { dot: '#f59e0b', label: 'Evaluating path',   bg: '#fef3c7' },
            { dot: '#10b981', label: 'Optimal route',     bg: '#d1fae5' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              backgroundColor: item.bg || '#f8fafc',
              border: `1px solid ${item.border || item.dot + '40'}`,
              borderRadius: '6px', padding: '4px 10px',
              fontSize: '0.75rem', color: '#374151', fontWeight: '500',
            }}>
              {item.icon
                ? <span style={{ fontSize: '1rem' }}>{item.icon}</span>
                : <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.dot, display: 'inline-block', flexShrink: 0 }} />
              }
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Current step info card ── */}
      {activeData && activeData.result !== null && (
        <div style={{
          marginTop: '14px',
          backgroundColor: lineColor + '12',
          border: `1px solid ${lineColor}40`,
          borderLeft: `4px solid ${lineColor}`,
          borderRadius: '10px', padding: '14px 18px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          animation: 'fadeInUp 0.3s ease',
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '2px' }}>
              {activeData.label}
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: '#374151' }}>
              {activeData.formula}
            </div>
          </div>
          <div style={{
            backgroundColor: lineColor, color: '#fff',
            borderRadius: '10px', padding: '8px 16px',
            textAlign: 'center', minWidth: '60px',
          }}>
            <div style={{ fontSize: '0.65rem', fontWeight: '600', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Cost</div>
            <div style={{ fontSize: '1.5rem', fontWeight: '800', lineHeight: 1.1 }}>{activeData.result}</div>
          </div>
        </div>
      )}


    </div>
  );
}

export default SimulatorMatrix;
