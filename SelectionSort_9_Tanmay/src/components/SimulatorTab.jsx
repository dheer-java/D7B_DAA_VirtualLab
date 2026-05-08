import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw, CheckCircle, XCircle, ArrowRight, MousePointerClick } from 'lucide-react';

// Helper function naya random array generate karne ke liye
const generateRandomArray = (size = 8) => {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 10);
};

function SimulatorTab() {
  const [array, setArray] = useState(generateRandomArray());
  const [mode, setMode] = useState('manual'); // 'manual' ya 'auto'
  
  // Algorithm States
  const [i, setI] = useState(0); // Start of current pass
  const [j, setJ] = useState(1); // Currently iterating element
  const [currentMinIndex, setCurrentMinIndex] = useState(0); // Minimum in current pass
  const [isComplete, setIsComplete] = useState(false);
  
  // Feedback State
  const [feedback, setFeedback] = useState({ text: "Simulation Ready. Start by checking the first element.", type: "info" });
  
  // Auto Mode States
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const timerRef = useRef(null);

  // --- LOGIC: ADVANCE ITERATION (For both Manual & Auto) ---
  const advanceIteration = (currentArr, currentI, currentJ, currentMinIdx) => {
    let nextJ = currentJ + 1;
    let nextArr = [...currentArr];
    let nextI = currentI;
    let nextMinIdx = currentMinIdx;
    let newFeedback = { ...feedback };

    if (nextJ < nextArr.length) {
      setJ(nextJ);
    } else {
      // End of Pass: Swap elements
      let temp = nextArr[nextI];
      nextArr[nextI] = nextArr[nextMinIdx];
      nextArr[nextMinIdx] = temp;
      setArray(nextArr);

      nextI = nextI + 1;
      if (nextI >= nextArr.length - 1) {
        setIsComplete(true);
        setIsPlaying(false);
        setI(nextArr.length); // Mark all sorted
        newFeedback = { text: "Array is completely sorted! 🎉", type: "success" };
      } else {
        setI(nextI);
        setJ(nextI + 1);
        setCurrentMinIndex(nextI);
        newFeedback = { text: `Pass complete. Elements swapped. Starting next pass.`, type: "info" };
      }
    }
    return newFeedback;
  };

  // --- MANUAL MODE HANDLERS ---
  const handleNext = () => {
    if (isComplete) return;
    
    // Validation: Check if user missed a smaller element
    if (array[j] < array[currentMinIndex]) {
      setFeedback({ text: "Incorrect! This element is smaller than the current minimum. Press 'Update Minimum' first.", type: "error" });
      return;
    }
    
    // Correct Action
    let newFeedback = advanceIteration(array, i, j, currentMinIndex);
    if(newFeedback.type !== "success" && newFeedback.type !== "info") {
       setFeedback({ text: "Correct! Moving to next element.", type: "success" });
    } else {
       setFeedback(newFeedback);
    }
  };

  const handleUpdateMin = () => {
    if (isComplete) return;

    // Validation: Check if user wrongly clicked update
    if (array[j] >= array[currentMinIndex]) {
      setFeedback({ text: "Incorrect! This element is greater than or equal to the current minimum. Press 'Next'.", type: "error" });
      return;
    }

    // Correct Action
    setCurrentMinIndex(j);
    let newFeedback = advanceIteration(array, i, j, j); // Passing j as new minIndex
    if(newFeedback.type !== "success" && newFeedback.type !== "info") {
       setFeedback({ text: `Correct! Minimum updated to ${array[j]}.`, type: "success" });
    } else {
       setFeedback(newFeedback);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setArray(generateRandomArray());
    setI(0);
    setJ(1);
    setCurrentMinIndex(0);
    setIsComplete(false);
    setFeedback({ text: "New Array Generated. Ready to start.", type: "info" });
  };

  // --- AUTO MODE LOGIC ---
  useEffect(() => {
    if (isPlaying && !isComplete && mode === 'auto') {
      timerRef.current = setTimeout(() => {
        // Auto decides the correct action
        if (array[j] < array[currentMinIndex]) {
           setCurrentMinIndex(j);
           setFeedback(advanceIteration(array, i, j, j));
        } else {
           setFeedback(advanceIteration(array, i, j, currentMinIndex));
        }
      }, speed);
    }
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, array, i, j, currentMinIndex, isComplete, mode, speed]);


  // --- STYLING HELPERS ---
  const getBoxStyle = (index) => {
    if (index < i || isComplete) {
      // Sorted
      return { bg: "#e2e8f0", text: "#64748b", border: "#cbd5e1" };
    }
    if (index === currentMinIndex) {
      // Current Minimum
      return { bg: "#0f172a", text: "#ffffff", border: "#0f172a" };
    }
    if (index === j) {
      // Currently Iterating
      return { bg: "#bbf7d0", text: "#166534", border: "#4ade80" };
    }
    // Unsorted remaining
    return { bg: "#dbeafe", text: "#1e3a8a", border: "#93c5fd" };
  };

  return (
    <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "30px", boxShadow: "0 8px 16px rgba(0,0,0,0.05)", height: "100%", display: "flex", flexDirection: "column" }}>
      
      {/* Header & Mode Toggle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: "2px solid #e2e8f0", paddingBottom: "15px", marginBottom: "30px" }}>
        <h2 style={{ color: "#1e40af", margin: 0 }}>Selection Sort Lab</h2>
        
        <div style={{ display: "flex", gap: "10px", backgroundColor: "#f1f5f9", padding: "5px", borderRadius: "8px" }}>
          <button 
            onClick={() => { setMode('manual'); setIsPlaying(false); }}
            style={{ padding: "8px 16px", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", transition: "0.2s", backgroundColor: mode === 'manual' ? "#ffffff" : "transparent", color: mode === 'manual' ? "#2563eb" : "#64748b", boxShadow: mode === 'manual' ? "0 2px 4px rgba(0,0,0,0.1)" : "none" }}
          >
            Practice Mode (Manual)
          </button>
          <button 
            onClick={() => { setMode('auto'); handleReset(); }}
            style={{ padding: "8px 16px", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer", transition: "0.2s", backgroundColor: mode === 'auto' ? "#ffffff" : "transparent", color: mode === 'auto' ? "#2563eb" : "#64748b", boxShadow: mode === 'auto' ? "0 2px 4px rgba(0,0,0,0.1)" : "none" }}
          >
            Auto Simulation
          </button>
        </div>
      </div>

      {/* Array Visualizer */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '40px', flexWrap: 'wrap' }}>
        {array.map((val, idx) => {
          const style = getBoxStyle(idx);
          return (
            <div key={idx} style={{ 
              width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.5rem", fontWeight: "bold", borderRadius: "8px", transition: "all 0.3s ease",
              backgroundColor: style.bg, color: style.text, border: `2px solid ${style.border}`,
              transform: idx === j ? "scale(1.1)" : "scale(1)"
            }}>
              {val}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', fontSize: '0.9rem', color: "#475569" }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '16px', height: '16px', backgroundColor: '#e2e8f0', border: '1px solid #cbd5e1', borderRadius: '4px' }}></div> Sorted Elements</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '16px', height: '16px', backgroundColor: '#0f172a', borderRadius: '4px' }}></div> Min in current iteration</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '16px', height: '16px', backgroundColor: '#bbf7d0', border: '1px solid #4ade80', borderRadius: '4px' }}></div> Element being iterated</span>
      </div>

      {/* Observations / Feedback Box */}
      <div style={{ 
        backgroundColor: feedback.type === 'error' ? '#fef2f2' : feedback.type === 'success' ? '#f0fdf4' : '#f8fafc',
        border: `1px solid ${feedback.type === 'error' ? '#fecaca' : feedback.type === 'success' ? '#bbf7d0' : '#e2e8f0'}`,
        padding: "20px", borderRadius: "8px", marginBottom: "30px", display: "flex", alignItems: "center", gap: "15px"
      }}>
        {feedback.type === 'error' ? <XCircle color="#ef4444" size={28} /> : feedback.type === 'success' ? <CheckCircle color="#22c55e" size={28} /> : <MousePointerClick color="#3b82f6" size={28} />}
        <div>
          <h4 style={{ margin: "0 0 5px 0", color: feedback.type === 'error' ? '#b91c1c' : feedback.type === 'success' ? '#15803d' : '#1e40af' }}>Observation</h4>
          <p style={{ margin: 0, color: "#334155", fontSize: "1.05rem" }}>{feedback.text}</p>
        </div>
      </div>

      {/* Controls Area */}
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "center", gap: "15px" }}>
        
        {mode === 'manual' ? (
          <>
            <button onClick={handleNext} disabled={isComplete} style={{ padding: "12px 24px", backgroundColor: isComplete ? "#cbd5e1" : "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "bold", cursor: isComplete ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
              Next <ArrowRight size={20} />
            </button>
            <button onClick={handleUpdateMin} disabled={isComplete} style={{ padding: "12px 24px", backgroundColor: isComplete ? "#cbd5e1" : "#10b981", color: "white", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "bold", cursor: isComplete ? "not-allowed" : "pointer" }}>
              Update Minimum
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setIsPlaying(!isPlaying)} disabled={isComplete} style={{ padding: "12px 24px", backgroundColor: isComplete ? "#cbd5e1" : isPlaying ? "#f59e0b" : "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "bold", cursor: isComplete ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
              {isPlaying ? <><Pause size={20} /> Pause</> : <><Play size={20} /> Start Auto</>}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", backgroundColor: "#f8fafc", padding: "0 15px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
              <label style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "bold" }}>Speed:</label>
              <input type="range" min="100" max="2000" step="100" value={2100 - speed} onChange={(e) => setSpeed(2100 - e.target.value)} disabled={isPlaying} style={{ cursor: "pointer" }} />
            </div>
          </>
        )}

        <button onClick={handleReset} style={{ padding: "12px 24px", backgroundColor: "#ffffff", color: "#ef4444", border: "2px solid #ef4444", borderRadius: "8px", fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
          <RefreshCw size={20} /> Reset (New Array)
        </button>

      </div>

    </div>
  );
}

export default SimulatorTab;