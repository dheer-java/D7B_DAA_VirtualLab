/* ─────────────────────────────────────────────────────────────
   TheoryTab.jsx  –  Dragon Problem Virtual Lab
   Covers: Aim tab + Theory tab (full DP walkthrough)
───────────────────────────────────────────────────────────── */

/* ── Shared sub-components ── */
const Section = ({ title, children }) => (
  <div style={{ marginBottom: '36px' }}>
    <h2 style={{
      color: '#1e3a8a', fontSize: '1.25rem', fontWeight: '700',
      margin: '0 0 14px', paddingBottom: '10px',
      borderBottom: '2px solid #e0e7ff', display: 'flex', alignItems: 'center', gap: '8px',
    }}>
      {title}
    </h2>
    {children}
  </div>
);

const InfoBox = ({ accent, bg, icon, children }) => (
  <div style={{
    backgroundColor: bg, borderLeft: `4px solid ${accent}`,
    borderRadius: '10px', padding: '14px 18px', margin: '14px 0',
    display: 'flex', gap: '12px', alignItems: 'flex-start',
  }}>
    <span style={{ fontSize: '1.15rem', flexShrink: 0, marginTop: '2px' }}>{icon}</span>
    <div style={{ fontSize: '0.97rem', color: '#374151', lineHeight: '1.75' }}>{children}</div>
  </div>
);

const CodeBlock = ({ children }) => (
  <div style={{
    backgroundColor: '#0f172a', color: '#e2e8f0',
    padding: '18px 22px', borderRadius: '10px',
    fontFamily: "'Fira Code','Courier New',monospace",
    fontSize: '0.92rem', lineHeight: '1.9', margin: '14px 0',
    overflowX: 'auto', border: '1px solid #1e293b', whiteSpace: 'pre',
  }}>
    {children}
  </div>
);

const FormulaBox = ({ children }) => (
  <div style={{
    backgroundColor: '#0f172a', borderRadius: '10px',
    padding: '18px 24px', margin: '14px 0', textAlign: 'center',
    fontFamily: "'Fira Code','Courier New',monospace",
    fontSize: '1.15rem', letterSpacing: '0.04em', border: '1px solid #1e293b',
  }}>
    {children}
  </div>
);

const DataTable = ({ headers, rows, highlightLast }) => (
  <table style={{ width: '100%', borderCollapse: 'collapse', margin: '14px 0', fontSize: '0.92rem' }}>
    <thead>
      <tr>
        {headers.map((h, i) => (
          <th key={i} style={{
            padding: '11px 16px',
            backgroundColor: '#1e3a8a', color: '#fff',
            textAlign: i === 0 ? 'left' : 'center', fontWeight: '600',
            fontSize: '0.82rem', letterSpacing: '0.04em',
            borderRadius: i === 0 ? '8px 0 0 0' : i === headers.length - 1 ? '0 8px 0 0' : '0',
          }}>
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, ri) => {
        const isHighlight = highlightLast && ri === rows.length - 1 || (row[row.length - 1] || '').includes('✅');
        return (
          <tr key={ri} style={{ backgroundColor: isHighlight ? '#ecfdf5' : (ri % 2 === 0 ? '#f8fafc' : '#fff') }}>
            {row.map((cell, ci) => (
              <td key={ci} style={{
                padding: '11px 16px', borderBottom: '1px solid #e2e8f0',
                textAlign: ci === 0 ? 'left' : 'center',
                fontWeight: isHighlight && ci === row.length - 1 ? '700' : 'normal',
                color: isHighlight ? '#065f46' : ci === row.length - 1 ? '#1e3a8a' : '#374151',
              }}>
                {cell}
              </td>
            ))}
          </tr>
        );
      })}
    </tbody>
  </table>
);

/* ── Main Component ── */
function TheoryTab({ activeTab }) {
  return (
    <div style={{
      backgroundColor: '#fff', borderRadius: '16px',
      boxShadow: '0 4px 32px rgba(0,0,0,0.07)',
      padding: '44px 52px', maxWidth: '920px',
      animation: 'fadeInUp 0.35s ease',
    }}>

      {/* ════════════════ AIM TAB ════════════════ */}
      {activeTab === 'aim' && (
        <div>
          {/* Hero */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '36px', paddingBottom: '24px', borderBottom: '2px solid #e0e7ff' }}>
            <div style={{
              width: '60px', height: '60px', borderRadius: '16px', flexShrink: 0,
              background: 'linear-gradient(135deg,#6366f1,#3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.8rem', boxShadow: '0 8px 20px rgba(99,102,241,0.35)',
            }}>🐉</div>
            <div>
              <h1 style={{ margin: '4px 0 0', color: '#0f172a', fontSize: '1.9rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                Dragon Problem
              </h1>
              <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.95rem' }}>
                Constrained Shortest Path on a Grid · Dynamic Programming
              </p>
            </div>
          </div>

          <Section title="🎯 Aim">
            <InfoBox accent="#3b82f6" bg="#eff6ff" icon="📌">
              To find the <strong>minimum-cost route</strong> to kill exactly <strong>K dragons</strong> on an
              R × C grid, starting from <strong>(0,0)</strong>, travelling only <strong>downward, left, or right</strong>.
            </InfoBox>
          </Section>

          <Section title="📖 Problem Story">
            <p style={{ color: '#374151', lineHeight: '1.85', fontSize: '0.97rem', marginBottom: '14px' }}>
              The kingdom is falling into ruin. Dragons pillage, kill, and cause as much havoc as they can.
              The king has sent a royal decree:
            </p>
            <div style={{
              backgroundColor: '#fefce8', border: '1px solid #fde68a',
              borderLeft: '5px solid #f59e0b', borderRadius: '8px',
              padding: '16px 20px', margin: '14px 0',
              fontStyle: 'italic', color: '#78350f', fontSize: '0.97rem', lineHeight: '1.8',
            }}>
              "To any man out there who is able to bring me the heads of K dragons, I shall bequeath
              a lordship — to him, his sons and his grandsons, till the end of time."
            </div>
            <p style={{ color: '#374151', lineHeight: '1.85', fontSize: '0.97rem' }}>
              You've accepted the challenge. The kingdom is arranged on a hill — you travel only{' '}
              <strong>downward</strong> (never up), but may move <strong>left or right</strong> as you
              wish. Each row holds at most one dragon. Slay exactly K of them via the shortest route.
            </p>
          </Section>

          <Section title="📐 Problem Parameters">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', margin: '14px 0' }}>
              {[
                { key: 'R', desc: 'Rows in the grid  (0 to R−1)',      color: '#6366f1', bg: '#eef2ff' },
                { key: 'C', desc: 'Columns in the grid (0 to C−1)',    color: '#0ea5e9', bg: '#f0f9ff' },
                { key: 'D', desc: 'Total dragons in the kingdom',       color: '#f59e0b', bg: '#fffbeb' },
                { key: 'K', desc: 'Dragons you must kill',              color: '#ef4444', bg: '#fef2f2' },
                { key: '(0,0)', desc: 'Your starting position',         color: '#10b981', bg: '#ecfdf5' },
                { key: '≤1/row', desc: 'Dragons are territorial!',      color: '#8b5cf6', bg: '#f5f3ff' },
              ].map(item => (
                <div key={item.key} style={{
                  backgroundColor: item.bg, border: `1px solid ${item.color}30`,
                  borderRadius: '10px', padding: '16px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '1.45rem', fontWeight: '800', color: item.color, fontFamily: 'monospace', marginBottom: '6px' }}>{item.key}</div>
                  <div style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: '1.5' }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section title="📊 Input / Output">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ backgroundColor: '#f8fafc', borderRadius: '10px', padding: '20px', border: '1px solid #e2e8f0' }}>
                <h4 style={{ margin: '0 0 12px', color: '#374151', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  📥 Input
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#4b5563', lineHeight: '2.1', fontSize: '0.93rem' }}>
                  <li>Grid dimensions (R, C)</li>
                  <li>Dragon count D and target K</li>
                  <li>Each dragon's position (r, c)</li>
                </ul>
              </div>
              <div style={{ backgroundColor: '#ecfdf5', borderRadius: '10px', padding: '20px', border: '1px solid #a7f3d0' }}>
                <h4 style={{ margin: '0 0 12px', color: '#065f46', fontSize: '0.82rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  📤 Output
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', color: '#047857', lineHeight: '2.1', fontSize: '0.93rem' }}>
                  <li>Minimum total travel cost</li>
                  <li>Optimal dragon-kill sequence</li>
                </ul>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* ════════════════ THEORY TAB ════════════════ */}
      {activeTab === 'theory' && (
        <div>
          {/* Header */}
          <div style={{ marginBottom: '36px', paddingBottom: '24px', borderBottom: '2px solid #e0e7ff' }}>
            <h1 style={{ margin: '4px 0 0', color: '#0f172a', fontSize: '1.9rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
              Theory &amp; Logic
            </h1>
            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.95rem' }}>
              Full DP walkthrough with formulas, cost tables, and optimal path derivation
            </p>
          </div>

          {/* Grid Setup */}
          <Section title="🗺️ Grid Setup (Example)">
            <p style={{ color: '#374151', lineHeight: '1.8', marginBottom: '10px', fontSize: '0.97rem' }}>
              For our demo: <strong>5 rows × 6 columns</strong>, <strong>D = 4 dragons</strong>,
              <strong> K = 2</strong> to slay. You start at <strong>S(0,0)</strong>.
            </p>
            <CodeBlock>{`Columns →  0   1   2   3   4   5
Rows
  0       [S]  ·   ·   ·   ·   ·
  1        ·   ·   ·   ·  D1   ·
  2        ·   ·  D2   ·   ·   ·
  3        ·   ·   ·   ·   ·  D3
  4        ·  D4   ·   ·   ·   ·`}</CodeBlock>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '10px' }}>
              {[
                { badge: 'S', label: 'Start at (0, 0)', bg: '#dbeafe', color: '#1d4ed8' },
                { badge: 'Di', label: 'Dragon i',        bg: '#fee2e2', color: '#dc2626' },
                { badge: '·',  label: 'Empty cell',      bg: '#f1f5f9', color: '#64748b' },
              ].map(item => (
                <div key={item.badge} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#374151' }}>
                  <span style={{ padding: '2px 10px', backgroundColor: item.bg, borderRadius: '5px', fontWeight: '700', color: item.color, fontFamily: 'monospace' }}>{item.badge}</span>
                  {item.label}
                </div>
              ))}
            </div>
          </Section>

          {/* Movement Rules */}
          <Section title="⚙️ Movement Rules">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '12px' }}>
              {[
                { icon: '←→', label: 'Left / Right',  desc: 'Move horizontally, freely', ok: true  },
                { icon: '↓',  label: 'Downward',       desc: 'Move to the row below',    ok: true  },
                { icon: '↑',  label: 'Upward',         desc: 'Strictly forbidden!',       ok: false },
              ].map(r => (
                <div key={r.label} style={{
                  backgroundColor: r.ok ? '#f0fdf4' : '#fff1f2',
                  border: `1px solid ${r.ok ? '#86efac' : '#fca5a5'}`,
                  borderRadius: '10px', padding: '18px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{r.icon}</div>
                  <div style={{ fontWeight: '700', color: r.ok ? '#15803d' : '#dc2626', marginBottom: '4px' }}>
                    {r.label} {r.ok ? '✅' : '❌'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>{r.desc}</div>
                </div>
              ))}
            </div>
            <InfoBox accent="#f59e0b" bg="#fffbeb" icon="💡">
              <strong>Key Insight:</strong> Since you can <em>never go up</em>, dragons must be visited
              in <strong>strictly increasing row order</strong>. This ordering constraint is exactly
              what makes a DP approach correct and efficient.
            </InfoBox>
          </Section>

          {/* Step 1 */}
          <Section title="📐 Step 1 — Cost from Start to Each Dragon">
            <p style={{ color: '#374151', lineHeight: '1.8', marginBottom: '10px', fontSize: '0.97rem' }}>
              From <strong>S(0,0)</strong> the minimum cost to reach any dragon at (r, c) is:
            </p>
            <FormulaBox>
              <span style={{ color: '#94a3b8' }}>cost(S → D)  =  </span>
              <span style={{ color: '#38bdf8' }}>r</span>
              <span style={{ color: '#94a3b8' }}>  +  </span>
              <span style={{ color: '#f472b6' }}>| c |</span>
            </FormulaBox>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '0 0 12px', lineHeight: '1.7' }}>
              You travel <em>r</em> rows straight down, then at most <em>|c|</em> steps left or right to
              reach column c. (Start is at column 0, so it's just |c|.)
            </p>
            <DataTable
              headers={['Dragon', 'Position (r, c)', 'r  +  |c|', 'Cost']}
              rows={[
                ['D1', '(1, 4)', '1 + 4', '5'],
                ['D2', '(2, 2)', '2 + 2', '4'],
                ['D3', '(3, 5)', '3 + 5', '8'],
                ['D4', '(4, 1)', '4 + 1', '5'],
              ]}
            />
          </Section>

          {/* Step 2 */}
          <Section title="📐 Step 2 — Cost Between Two Dragons">
            <p style={{ color: '#374151', lineHeight: '1.8', marginBottom: '10px', fontSize: '0.97rem' }}>
              From dragon Dᵢ at (rᵢ, cᵢ) to dragon Dⱼ at (rⱼ, cⱼ), where rⱼ &gt; rᵢ:
            </p>
            <FormulaBox>
              <span style={{ color: '#94a3b8' }}>cost(Dᵢ → Dⱼ)  =  </span>
              <span style={{ color: '#38bdf8' }}>( rⱼ − rᵢ )</span>
              <span style={{ color: '#94a3b8' }}>  +  </span>
              <span style={{ color: '#f472b6' }}>| cⱼ − cᵢ |</span>
            </FormulaBox>
            <DataTable
              headers={['From → To', 'Row diff  (rⱼ − rᵢ)', 'Col diff  |cⱼ − cᵢ|', 'Total Cost']}
              rows={[
                ['D1(1,4) → D2(2,2)', '2 − 1 = 1', '|2 − 4| = 2', '3'],
                ['D1(1,4) → D3(3,5)', '3 − 1 = 2', '|5 − 4| = 1', '3'],
                ['D1(1,4) → D4(4,1)', '4 − 1 = 3', '|1 − 4| = 3', '6'],
                ['D2(2,2) → D3(3,5)', '3 − 2 = 1', '|5 − 2| = 3', '4'],
                ['D2(2,2) → D4(4,1)', '4 − 2 = 2', '|1 − 2| = 1', '3'],
                ['D3(3,5) → D4(4,1)', '4 − 3 = 1', '|1 − 5| = 4', '5'],
              ]}
            />
          </Section>

          {/* Step 3 */}
          <Section title="🏆 Step 3 — Find Minimum Path (K = 2)">
            <p style={{ color: '#374151', lineHeight: '1.8', marginBottom: '10px', fontSize: '0.97rem' }}>
              Enumerate every pair of dragons in row-increasing order. The path cost is:
              <strong> cost(S → Dᵢ) + cost(Dᵢ → Dⱼ)</strong>.
            </p>
            <DataTable
              headers={['Path', 'Breakdown', 'Total Cost', 'Notes']}
              rows={[
                ['S → D1 → D2', '5 + 3', '8',  ''],
                ['S → D1 → D3', '5 + 3', '8',  ''],
                ['S → D1 → D4', '5 + 6', '11', ''],
                ['S → D2 → D3', '4 + 4', '8',  ''],
                ['S → D2 → D4', '4 + 3', '7',  '✅ Minimum!'],
                ['S → D3 → D4', '8 + 5', '13', ''],
              ]}
            />
            <InfoBox accent="#10b981" bg="#ecfdf5" icon="🏆">
              <strong>Optimal Route:</strong>&nbsp; Start(0,0) → D2(2,2) → D4(4,1) &nbsp;·&nbsp;
              Total cost = <strong>4 + 3 = 7</strong>
            </InfoBox>
          </Section>

          {/* DP Recurrence */}
          <Section title="💻 General DP Recurrence">
            <p style={{ color: '#374151', lineHeight: '1.8', marginBottom: '10px', fontSize: '0.97rem' }}>
              Let <code>dp[i][j]</code> = minimum cost of having killed exactly <em>i</em> dragons,
              with the <em>i</em>-th kill being dragon j:
            </p>
            <CodeBlock>{`// Base case  (first kill)
dp[1][j]  =  rⱼ + |cⱼ|          // cost from Start to Dⱼ

// Recurrence  (i-th kill, last dragon is j)
dp[i][j]  =  min over all k where rₖ < rⱼ:
                 dp[i-1][k]  +  (rⱼ - rₖ) + |cⱼ - cₖ|

// Final answer
answer  =  min over all j:  dp[K][j]`}</CodeBlock>
            <InfoBox accent="#6366f1" bg="#eef2ff" icon="⏱️">
              <strong>Time Complexity:</strong> O(K · D²) — for each of K kills, we check all D² dragon
              pairs. <strong>Space:</strong> O(K · D) for the DP table.
            </InfoBox>
          </Section>
        </div>
      )}


    </div>
  );
}

export default TheoryTab;
