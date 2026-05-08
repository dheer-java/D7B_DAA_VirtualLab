import { useState, useRef, useEffect } from 'react';
import SimulatorMatrix from './SimulatorMatrix';
import SimulatorLogs from './SimulatorLogs';

export const SIMULATION_STEPS = [
  {
    type: 'info', phase: 0,
    title: 'Simulation Ready',
    label: '',
    formula: '',
    lines: [],
    result: null,
    desc: "Click 'Next Step' to begin.\nWe'll calculate the cost from Start (S) to each dragon using: cost = r + |c|.",
    activeCells: [],
  },
  {
    type: 'calc', phase: 1,
    title: 'Cost to Reach D1 from Start',
    label: 'S(0,0) → D1(1,4)',
    formula: 'cost = r + |c|',
    lines: ['1 + |4|'],
    result: 5,
    desc: 'Dragon D1 is at row 1, column 4.\nTravel 1 step down + 4 steps right = 5.',
    activeCells: ['S', 'D1'],
  },
  {
    type: 'calc', phase: 1,
    title: 'Cost to Reach D2 from Start',
    label: 'S(0,0) → D2(2,2)',
    formula: 'cost = r + |c|',
    lines: ['2 + |2|'],
    result: 4,
    desc: 'Dragon D2 is at row 2, column 2.\nTravel 2 steps down + 2 steps right = 4.',
    activeCells: ['S', 'D2'],
  },
  {
    type: 'calc', phase: 1,
    title: 'Cost to Reach D3 from Start',
    label: 'S(0,0) → D3(3,5)',
    formula: 'cost = r + |c|',
    lines: ['3 + |5|'],
    result: 8,
    desc: 'Dragon D3 is at row 3, column 5.\nTravel 3 steps down + 5 steps right = 8.',
    activeCells: ['S', 'D3'],
  },
  {
    type: 'calc', phase: 1,
    title: 'Cost to Reach D4 from Start',
    label: 'S(0,0) → D4(4,1)',
    formula: 'cost = r + |c|',
    lines: ['4 + |1|'],
    result: 5,
    desc: 'Dragon D4 is at row 4, column 1.\nTravel 4 steps down + 1 step right = 5.',
    activeCells: ['S', 'D4'],
  },
  {
    type: 'info', phase: 2,
    title: 'Phase 2 — Between Dragons',
    label: '',
    formula: '',
    lines: [],
    result: null,
    desc: "Now computing pairwise travel costs between dragons.\nRemember: you can only move DOWN or sideways — never up.",
    activeCells: [],
  },
  {
    type: 'calc', phase: 2,
    title: 'Cost: D1 → D2',
    label: 'D1(1,4) → D2(2,2)',
    formula: 'cost = (rⱼ − rᵢ) + |cⱼ − cᵢ|',
    lines: ['(2 − 1) + |2 − 4|', '1 + 2'],
    result: 3,
    desc: 'Row diff = 2 − 1 = 1\nCol diff = |2 − 4| = 2\nTotal = 3',
    activeCells: ['D1', 'D2'],
  },
  {
    type: 'calc', phase: 2,
    title: 'Cost: D1 → D3',
    label: 'D1(1,4) → D3(3,5)',
    formula: 'cost = (rⱼ − rᵢ) + |cⱼ − cᵢ|',
    lines: ['(3 − 1) + |5 − 4|', '2 + 1'],
    result: 3,
    desc: 'Row diff = 3 − 1 = 2\nCol diff = |5 − 4| = 1\nTotal = 3',
    activeCells: ['D1', 'D3'],
  },
  {
    type: 'calc', phase: 2,
    title: 'Cost: D1 → D4',
    label: 'D1(1,4) → D4(4,1)',
    formula: 'cost = (rⱼ − rᵢ) + |cⱼ − cᵢ|',
    lines: ['(4 − 1) + |1 − 4|', '3 + 3'],
    result: 6,
    desc: 'Row diff = 4 − 1 = 3\nCol diff = |1 − 4| = 3\nTotal = 6',
    activeCells: ['D1', 'D4'],
  },
  {
    type: 'calc', phase: 2,
    title: 'Cost: D2 → D3',
    label: 'D2(2,2) → D3(3,5)',
    formula: 'cost = (rⱼ − rᵢ) + |cⱼ − cᵢ|',
    lines: ['(3 − 2) + |5 − 2|', '1 + 3'],
    result: 4,
    desc: 'Row diff = 3 − 2 = 1\nCol diff = |5 − 2| = 3\nTotal = 4',
    activeCells: ['D2', 'D3'],
  },
  {
    type: 'calc', phase: 2,
    title: 'Cost: D2 → D4',
    label: 'D2(2,2) → D4(4,1)',
    formula: 'cost = (rⱼ − rᵢ) + |cⱼ − cᵢ|',
    lines: ['(4 − 2) + |1 − 2|', '2 + 1'],
    result: 3,
    desc: 'Row diff = 4 − 2 = 2\nCol diff = |1 − 2| = 1\nTotal = 3',
    activeCells: ['D2', 'D4'],
  },
  {
    type: 'calc', phase: 2,
    title: 'Cost: D3 → D4',
    label: 'D3(3,5) → D4(4,1)',
    formula: 'cost = (rⱼ − rᵢ) + |cⱼ − cᵢ|',
    lines: ['(4 − 3) + |1 − 5|', '1 + 4'],
    result: 5,
    desc: 'Row diff = 4 − 3 = 1\nCol diff = |1 − 5| = 4\nTotal = 5',
    activeCells: ['D3', 'D4'],
  },
  {
    type: 'info', phase: 3,
    title: 'Phase 3 — Path Evaluation (K = 2)',
    label: '',
    formula: '',
    lines: [],
    result: null,
    desc: "Evaluating all paths that kill exactly K = 2 dragons.\nDragons must be visited in strictly increasing row order.",
    activeCells: [],
  },
  {
    type: 'eval', phase: 3,
    title: 'Evaluate Path 1',
    label: 'S → D1 → D2',
    formula: 'cost(S→D1) + cost(D1→D2)',
    lines: ['5 + 3'],
    result: 8,
    desc: 'cost(S→D1) = 5\ncost(D1→D2) = 3\nTotal = 8',
    activeCells: ['S', 'D1', 'D2'],
  },
  {
    type: 'eval', phase: 3,
    title: 'Evaluate Path 2',
    label: 'S → D1 → D3',
    formula: 'cost(S→D1) + cost(D1→D3)',
    lines: ['5 + 3'],
    result: 8,
    desc: 'cost(S→D1) = 5\ncost(D1→D3) = 3\nTotal = 8',
    activeCells: ['S', 'D1', 'D3'],
  },
  {
    type: 'eval', phase: 3,
    title: 'Evaluate Path 3',
    label: 'S → D1 → D4',
    formula: 'cost(S→D1) + cost(D1→D4)',
    lines: ['5 + 6'],
    result: 11,
    desc: 'cost(S→D1) = 5\ncost(D1→D4) = 6\nTotal = 11',
    activeCells: ['S', 'D1', 'D4'],
  },
  {
    type: 'eval', phase: 3,
    title: 'Evaluate Path 4',
    label: 'S → D2 → D3',
    formula: 'cost(S→D2) + cost(D2→D3)',
    lines: ['4 + 4'],
    result: 8,
    desc: 'cost(S→D2) = 4\ncost(D2→D3) = 4\nTotal = 8',
    activeCells: ['S', 'D2', 'D3'],
  },
  {
    type: 'eval', phase: 3,
    title: 'Evaluate Path 5  ← New Best!',
    label: 'S → D2 → D4',
    formula: 'cost(S→D2) + cost(D2→D4)',
    lines: ['4 + 3'],
    result: 7,
    desc: 'cost(S→D2) = 4\ncost(D2→D4) = 3\nTotal = 7  ✨ New minimum!',
    activeCells: ['S', 'D2', 'D4'],
  },
  {
    type: 'eval', phase: 3,
    title: 'Evaluate Path 6',
    label: 'S → D3 → D4',
    formula: 'cost(S→D3) + cost(D3→D4)',
    lines: ['8 + 5'],
    result: 13,
    desc: 'cost(S→D3) = 8\ncost(D3→D4) = 5\nTotal = 13',
    activeCells: ['S', 'D3', 'D4'],
  },
  {
    type: 'optimal', phase: 4,
    title: '🏆 Optimal Route Found!',
    label: 'Start → D2(2,2) → D4(4,1)',
    formula: 'Minimum cost across all K=2 paths',
    lines: ['4 + 3'],
    result: 7,
    desc: 'The shortest route to defeat K=2 dragons:\nStart(0,0) → D2(2,2) → D4(4,1)\nMinimum total cost = 7',
    activeCells: ['S', 'D2', 'D4'],
  },
];

/* Phase metadata */
const PHASES = [
  { id: 1, label: 'Cost from Start',      color: '#3b82f6', range: [1, 4]  },
  { id: 2, label: 'Cost Between Dragons', color: '#8b5cf6', range: [5, 11] },
  { id: 3, label: 'Path Evaluation',      color: '#f59e0b', range: [12, 18] },
  { id: 4, label: 'Optimal Route',        color: '#10b981', range: [19, 19] },
];

function getPhaseInfo(stepIndex) {
  for (const p of PHASES) {
    if (stepIndex >= p.range[0] && stepIndex <= p.range[1]) return p;
  }
  return null;
}

function SimulatorTab() {
  const [currentStep, setCurrentStep] = useState(0);
  const logsEndRef = useRef(null);
  const total = SIMULATION_STEPS.length;

  const activeData = SIMULATION_STEPS[currentStep];
  const isFinished = currentStep === total - 1;
  const isFirst = currentStep === 0;
  const progressPct = Math.round((currentStep / (total - 1)) * 100);
  const currentPhase = getPhaseInfo(currentStep);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [currentStep]);

  const handleNext  = () => { if (!isFinished) setCurrentStep(p => p + 1); };
  const handlePrev  = () => { if (!isFirst)    setCurrentStep(p => p - 1); };
  const handleReset = () => setCurrentStep(0);

  return (
    <div style={{
      backgroundColor: '#fff', borderRadius: '16px',
      boxShadow: '0 4px 32px rgba(0,0,0,0.07)',
      padding: '30px 34px',
      animation: 'fadeInUp 0.35s ease',
      minHeight: '100%',
    }}>
      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '22px' }}>
        <div>
          <h2 style={{ margin: '4px 0 0', color: '#0f172a', fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
            ⚗️ Dragon DP Simulator
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {currentPhase && (
            <span style={{
              background: currentPhase.color + '18',
              color: currentPhase.color,
              border: `1px solid ${currentPhase.color}40`,
              padding: '5px 12px', borderRadius: '20px',
              fontSize: '0.78rem', fontWeight: '700',
            }}>
              Phase {currentPhase.id}: {currentPhase.label}
            </span>
          )}
          <span style={{
            background: isFinished
              ? 'linear-gradient(135deg,#059669,#10b981)'
              : 'linear-gradient(135deg,#1d4ed8,#6366f1)',
            color: '#fff',
            padding: '6px 14px', borderRadius: '20px',
            fontSize: '0.82rem', fontWeight: '700',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}>
            {isFinished ? '✅ COMPLETE' : `${currentStep + 1} / ${total}`}
          </span>
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
          {PHASES.map(p => {
            const active = currentStep >= p.range[0] && currentStep <= p.range[1];
            const done   = currentStep > p.range[1];
            return (
              <div key={p.id} style={{
                flex: 1, marginRight: p.id < 4 ? '6px' : '0',
                height: '5px', borderRadius: '3px',
                backgroundColor: done ? p.color : active ? p.color + '80' : '#e2e8f0',
                transition: 'background-color 0.4s',
              }} />
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {PHASES.map(p => (
            <div key={p.id} style={{
              flex: 1, fontSize: '0.68rem', fontWeight: '600',
              color: currentStep >= p.range[0] ? p.color : '#94a3b8',
              textAlign: 'center', marginRight: p.id < 4 ? '6px' : '0',
              transition: 'color 0.3s',
            }}>
              {p.label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Main Content ── */}
      <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <SimulatorMatrix activeData={activeData} handleReset={handleReset} />
        <SimulatorLogs
          currentStep={currentStep}
          steps={SIMULATION_STEPS}
          logsEndRef={logsEndRef}
          handleNext={handleNext}
          handlePrev={handlePrev}
          handleReset={handleReset}
          isFinished={isFinished}
          isFirst={isFirst}
        />
      </div>


    </div>
  );
}

export default SimulatorTab;
