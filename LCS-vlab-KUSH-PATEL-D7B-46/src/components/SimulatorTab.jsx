import { useState, useEffect, useRef } from "react";
import SimulatorInput from "./SimulatorInput";
import SimulatorMatrix from "./SimulatorMatrix";
import SimulatorLogs from "./SimulatorLogs";

function SimulatorTab() {
  // State
  const [string1, setString1] = useState("STOP");
  const [string2, setString2] = useState("STUDENT");
  const [dpTable, setDpTable] = useState([]);
  const [phase, setPhase] = useState("input");

  const [genI, setGenI] = useState(1);
  const [genJ, setGenJ] = useState(1);
  const [activeI, setActiveI] = useState(-1);
  const [activeJ, setActiveJ] = useState(-1);
  const [genLogs, setGenLogs] = useState([]);

  const [currentI, setCurrentI] = useState(-1);
  const [currentJ, setCurrentJ] = useState(-1);
  const [lcsPath, setLcsPath] = useState([]);
  const [finalLcs, setFinalLcs] = useState("");
  const [logs, setLogs] = useState([]);

  const logsEndRef = useRef(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [logs, genLogs]);

  // Logic Functions
  const handleInitialize = () => {
    if (!string1 || !string2) return;
    const m = string1.length;
    const n = string2.length;
    const newTable = Array.from({ length: m + 1 }, () => Array(n + 1).fill(""));
    for (let i = 0; i <= m; i++) newTable[i][0] = 0;
    for (let j = 0; j <= n; j++) newTable[0][j] = 0;
    setDpTable(newTable);
    setGenI(1);
    setGenJ(1);
    setActiveI(-1);
    setActiveJ(-1);
    setPhase("generating");
    setLogs([]);
    setFinalLcs("");
    setLcsPath([]);
    setGenLogs([
      {
        title: "Ready to Generate",
        details: "Click 'Next Cell' to compute.",
        bg: "#f8f9fa",
        border: "#dee2e6",
      },
    ]);
  };

  const handleReset = () => {
    setPhase("input");
    setDpTable([]);
    setLogs([]);
    setGenLogs([]);
    setFinalLcs("");
    setLcsPath([]);
    setActiveI(-1);
    setActiveJ(-1);
  };

  const handleNextGenStep = () => {
    const m = string1.length;
    const n = string2.length;
    let newTable = [...dpTable.map((row) => [...row])];
    let char1 = string1[genI - 1];
    let char2 = string2[genJ - 1];
    let explanation = {};

    if (char1 === char2) {
      newTable[genI][genJ] = newTable[genI - 1][genJ - 1] + 1;
      explanation = {
        title: `Characters Match (${char1} == ${char2})`,
        details: `Adding 1 to Diagonal value.\nDiagonal (${newTable[genI - 1][genJ - 1]}) + 1 = ${newTable[genI][genJ]}`,
        bg: "#d1e7dd",
        border: "#198754",
      };
    } else {
      let topVal = newTable[genI - 1][genJ];
      let leftVal = newTable[genI][genJ - 1];
      newTable[genI][genJ] = Math.max(topVal, leftVal);
      explanation = {
        title: `Characters Differ (${char1} != ${char2})`,
        details: `Taking Max of Top (${topVal}) and Left (${leftVal}).\nMax is ${newTable[genI][genJ]}`,
        bg: "#fff3cd",
        border: "#ffc107",
      };
    }

    setDpTable(newTable);
    setActiveI(genI);
    setActiveJ(genJ);
    setGenLogs((prev) => [...prev, explanation]);

    if (genJ < n) {
      setGenJ(genJ + 1);
    } else if (genI < m) {
      setGenI(genI + 1);
      setGenJ(1);
    } else {
      setPhase("generated");
      setActiveI(-1);
      setActiveJ(-1);
      setGenLogs((prev) => [
        ...prev,
        {
          title: "Table Complete!",
          details:
            "DP Matrix generation is complete. You can now start the backtracking algorithm.",
          bg: "#cfe2ff",
          border: "#0d6efd",
        },
      ]);
    }
  };

  const handleSkipGeneration = () => {
    const m = string1.length;
    const n = string2.length;
    let newTable = [...dpTable.map((row) => [...row])];
    for (let i = genI; i <= m; i++) {
      let startJ = i === genI ? genJ : 1;
      for (let j = startJ; j <= n; j++) {
        if (string1[i - 1] === string2[j - 1]) {
          newTable[i][j] = newTable[i - 1][j - 1] + 1;
        } else {
          newTable[i][j] = Math.max(newTable[i - 1][j], newTable[i][j - 1]);
        }
      }
    }
    setDpTable(newTable);
    setActiveI(-1);
    setActiveJ(-1);
    setPhase("generated");
    setGenLogs((prev) => [
      ...prev,
      {
        title: "Table Complete!",
        details: "Matrix generated instantly. Proceed to backtracking.",
        bg: "#cfe2ff",
        border: "#0d6efd",
      },
    ]);
  };

  const handleStartBacktrack = () => {
    setPhase("backtracking");
    setCurrentI(string1.length);
    setCurrentJ(string2.length);
    setLcsPath([{ i: string1.length, j: string2.length }]);
    setLogs([
      {
        type: "start",
        title: "Initialization",
        details: "Started tracing from bottom-right corner.",
        action: `Locate [${string1.length}][${string2.length}]`,
        bg: "#e2e3e5",
        border: "#6c757d",
      },
    ]);
  };

  const handleNextBacktrackStep = () => {
    if (currentI === 0 || currentJ === 0) {
      setPhase("complete");
      setLogs((prev) => [
        ...prev,
        {
          type: "end",
          title: "Algorithm Finished",
          details: "Reached boundary row (0) or column (0).",
          action: "Process Complete",
          bg: "#cfe2ff",
          border: "#0d6efd",
        },
      ]);
      return;
    }

    let nextI = currentI;
    let nextJ = currentJ;
    let logEntry = {};
    let char1 = string1[currentI - 1];
    let char2 = string2[currentJ - 1];

    if (char1 === char2) {
      logEntry = {
        type: "match",
        title: `Characters Match (${char1} == ${char2})!`,
        details: `Letter '${char1}' is part of LCS.`,
        action: `Moving ↖ DIAGONAL to [${currentI - 1}][${currentJ - 1}]`,
        bg: "#d1e7dd",
        border: "#198754",
      };
      setFinalLcs(char1 + finalLcs);
      nextI--;
      nextJ--;
    } else {
      let topVal = dpTable[currentI - 1][currentJ];
      let leftVal = dpTable[currentI][currentJ - 1];
      if (topVal >= leftVal) {
        logEntry = {
          type: "diff",
          title: `Characters Differ (${char1} != ${char2})!`,
          details: `Top (${topVal}) >= Left (${leftVal})`,
          action: `Moving ⬆ UP to [${currentI - 1}][${currentJ}]`,
          bg: "#fff3cd",
          border: "#ffc107",
        };
        nextI--;
      } else {
        logEntry = {
          type: "diff",
          title: `Characters Differ (${char1} != ${char2})!`,
          details: `Left (${leftVal}) > Top (${topVal})`,
          action: `Moving ⬅ LEFT to [${currentI}][${currentJ - 1}]`,
          bg: "#fff3cd",
          border: "#ffc107",
        };
        nextJ--;
      }
    }

    if (nextI === 0 || nextJ === 0) {
      setPhase("complete");
      setLogs((prev) => [
        ...prev,
        logEntry,
        {
          type: "end",
          title: "Algorithm Finished",
          details: "Reached boundary.",
          action: "Sequence Extracted",
          bg: "#cfe2ff",
          border: "#0d6efd",
        },
      ]);
    } else {
      setLogs((prev) => [...prev, logEntry]);
    }

    setCurrentI(nextI);
    setCurrentJ(nextJ);
    setLcsPath((prev) => [...prev, { i: nextI, j: nextJ }]);
  };

  const getCellColor = (i, j) => {
    if (phase === "generating" && i === activeI && j === activeJ)
      return "#cfe2ff";
    if (phase === "backtracking" || phase === "complete") {
      if (i === currentI && j === currentJ) return "#fff3cd";
      if (lcsPath.some((pos) => pos.i === i && pos.j === j)) return "#d1e7dd";
    }
    return "#ffffff";
  };

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
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
          borderBottom: "2px solid #e9ecef",
          paddingBottom: "15px",
          marginBottom: "25px",
        }}
      >
        <h2
          style={{
            color: "#084298",
            margin: 0,
            fontSize: "1.8rem",
            fontWeight: "bold",
          }}
        >
          Interactive Simulator
        </h2>
        <span
          style={{
            background:
              phase === "input"
                ? "#6c757d"
                : phase === "complete"
                  ? "#198754"
                  : "#0d6efd",
            color: "white",
            padding: "6px 12px",
            borderRadius: "4px",
            fontSize: "0.9rem",
            fontWeight: "bold",
          }}
        >
          {phase.toUpperCase()}
        </span>
      </div>

      <SimulatorInput
        string1={string1}
        setString1={setString1}
        string2={string2}
        setString2={setString2}
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
            string1={string1}
            string2={string2}
            dpTable={dpTable}
            phase={phase}
            currentI={currentI}
            currentJ={currentJ}
            getCellColor={getCellColor}
            handleNextGenStep={handleNextGenStep}
            handleSkipGeneration={handleSkipGeneration}
            handleStartBacktrack={handleStartBacktrack}
          />
          <SimulatorLogs
            phase={phase}
            genLogs={genLogs}
            logs={logs}
            logsEndRef={logsEndRef}
            finalLcs={finalLcs}
            handleNextBacktrackStep={handleNextBacktrackStep}
          />
        </div>
      )}
      <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } } @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }`}</style>
    </div>
  );
}

export default SimulatorTab;
