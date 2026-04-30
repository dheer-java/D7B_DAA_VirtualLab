import { useState, useEffect, useRef } from "react";
import SimulatorInput from "./SimulatorInput";
import SimulatorMatrix from "./SimulatorMatrix";
import SimulatorLogs from "./SimulatorLogs";

function SimulatorTab() {
  // State
  const [boardSize, setBoardSize] = useState(4);
  const [phase, setPhase] = useState("input"); // 'input', 'simulating', 'complete'
  const [steps, setSteps] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  const logsEndRef = useRef(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [currentStepIndex]);

  // Logic Functions
  const generateSteps = (N) => {
    let internalBoard = Array(N)
      .fill(0)
      .map(() => Array(N).fill(0));
    let localSteps = [];
    const solutions = []; // Array to store all solutions

    const getConflicts = (r, c) => {
      let conflicts = [];
      // left row
      for (let i = 0; i < c; i++) {
        if (internalBoard[r][i] === 1) conflicts.push({ row: r, col: i });
      }
      // upper diagonal left
      for (let i = r, j = c; i >= 0 && j >= 0; i--, j--) {
        if (internalBoard[i][j] === 1) conflicts.push({ row: i, col: j });
      }
      // lower diagonal left
      for (let i = r, j = c; j >= 0 && i < N; i++, j--) {
        if (internalBoard[i][j] === 1) conflicts.push({ row: i, col: j });
      }
      return conflicts;
    };

    const clone = () => internalBoard.map((row) => [...row]);

    const solve = (col) => {
      if (col >= N) {
        localSteps.push({
          type: "solution",
          board: clone(),
          log: {
            title: `Solution ${solutions.length + 1} Found!`,
            details:
              "All queens successfully placed without threatening each other.",
            bg: "#dcfce7",
            border: "#22c55e",
          },
        });
        solutions.push(clone()); // Store the solution board
        return false; // Continue searching for other solutions
      }

      for (let row = 0; row < N; row++) {
        localSteps.push({
          type: "placing",
          row,
          col,
          board: clone(),
          log: {
            title: `Testing [Row ${row}, Col ${col}]`,
            details: "Checking if a Queen can be safely placed here.",
            bg: "#fef9c3",
            border: "#eab308",
          },
        });

        const conflicts = getConflicts(row, col);

        if (conflicts.length === 0) {
          internalBoard[row][col] = 1;
          localSteps.push({
            type: "placed_safe",
            row,
            col,
            board: clone(),
            log: {
              title: `Placed Queen at [Row ${row}, Col ${col}]`,
              details: "Safe position. Moving to next column.",
              bg: "#e0f2fe",
              border: "#38bdf8",
            },
          });

          solve(col + 1); // Continue to the next column

          internalBoard[row][col] = 0; // Backtrack
          localSteps.push({
            type: "backtrack",
            row,
            col,
            board: clone(),
            log: {
              title: `Backtracking from [Col ${col}]`,
              details: `Dead end reached in subsequent columns. Removing Queen at [Row ${row}, Col ${col}] and trying next row.`,
              bg: "#fef2f2",
              border: "#ef4444",
            },
          });
        } else {
          localSteps.push({
            type: "clash",
            row,
            col,
            conflicts,
            board: clone(),
            log: {
              title: `Clash at [Row ${row}, Col ${col}]`,
              details: "Threatened by existing Queen(s). Cannot place here.",
              bg: "#fee2e2",
              border: "#f87171",
            },
          });
        }
      }
      return false;
    };

    solve(0);
    return { steps: localSteps, solutions };
  };

  const handleInitialize = () => {
    if (!boardSize || boardSize < 4 || boardSize > 10) return;

    // Generate the path silently
    const generatedSteps = generateSteps(boardSize);

    setSteps(generatedSteps.steps);
    setSolutions(generatedSteps.solutions);
    setCurrentStepIndex(0); // Start at first step naturally
    setPhase("simulating");
  };

  const handleReset = () => {
    setPhase("input");
    setSteps([]);
    setSolutions([]);
    setCurrentStepIndex(-1);
  };

  const handleNextStep = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      if (nextIndex === steps.length - 1) {
        setPhase("complete");
      }
    }
  };

  const handleSkipToEnd = () => {
    setCurrentStepIndex(steps.length - 1);
    setPhase("complete");
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        border: "1px solid #e2e8f0",
        padding: "30px",
        animation: "fadeIn 0.5s ease",
        minHeight: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid #f1f5f9",
          paddingBottom: "15px",
          marginBottom: "25px",
        }}
      >
        <h2
          style={{
            color: "#0f172a",
            margin: 0,
            fontSize: "1.8rem",
            fontWeight: "bold",
          }}
        >
          Interactive N-Queen Simulator
        </h2>
        <span
          style={{
            background:
              phase === "input"
                ? "#64748b"
                : phase === "complete"
                  ? "#22c55e"
                  : "#0f172a",
            color: "white",
            padding: "6px 12px",
            borderRadius: "4px",
            fontSize: "0.9rem",
            fontWeight: "bold",
            transition: "all 0.3s ease",
          }}
        >
          {phase.toUpperCase()}
        </span>
      </div>

      <SimulatorInput
        boardSize={boardSize}
        setBoardSize={setBoardSize}
        phase={phase}
        handleInitialize={handleInitialize}
        handleReset={handleReset}
      />

      {phase !== "input" && (
        <div
          style={{
            display: "flex",
            gap: "30px",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <SimulatorMatrix
            phase={phase}
            boardSize={boardSize}
            currentStepData={steps[currentStepIndex]}
            solutions={solutions}
            handleNextStep={handleNextStep}
            handleSkipToEnd={handleSkipToEnd}
          />
          <SimulatorLogs
            phase={phase}
            steps={steps}
            currentStepIndex={currentStepIndex}
            logsEndRef={logsEndRef}
            solutionCount={solutions.length}
          />
        </div>
      )}
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );
}

export default SimulatorTab;
