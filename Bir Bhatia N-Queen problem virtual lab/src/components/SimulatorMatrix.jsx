import React from "react";

function SimulatorMatrix({
  phase,
  boardSize,
  currentStepData,
  solutions,
  handleNextStep,
  handleSkipToEnd,
}) {
  const getCellColor = (i, j) => {
    const isDark = (i + j) % 2 === 1;
    const baseColor = isDark ? "#cbd5e1" : "#f8fafc";

    if (!currentStepData) return baseColor;

    const { type, row, col, conflicts } = currentStepData;

    if (i === row && j === col) {
      if (type === "clash") return "#fca5a5";
      if (type === "placed_safe" || type === "solution") return "#86efac";
      if (type === "placing") return "#fef08a";
      if (type === "backtrack") return "#fca5a5";
    }

    if (
      type === "clash" &&
      conflicts?.some((conflict) => conflict.row === i && conflict.col === j)
    ) {
      return "#fca5a5";
    }

    return baseColor;
  };

  const currentBoard = currentStepData ? currentStepData.board : null;
  const showSolutionGallery = phase === "complete";

  const renderBoard = (board, boardKey, isCompact = false) => (
    <div
      key={boardKey}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
        border: "2px solid #0f172a",
        width: "fit-content",
        margin: "0 auto",
      }}
    >
      {Array.from({ length: boardSize }).map((_, i) =>
        Array.from({ length: boardSize }).map((_, j) => {
          const hasQueen = board && board[i][j] === 1;
          const isDark = (i + j) % 2 === 1;

          return (
            <div
              key={`${boardKey}-${i}-${j}`}
              style={{
                width: isCompact ? "48px" : "60px",
                height: isCompact ? "48px" : "60px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: isCompact
                  ? isDark
                    ? "#cbd5e1"
                    : "#f8fafc"
                  : getCellColor(i, j),
                fontSize: isCompact ? "1.5rem" : "2rem",
                transition: "background-color 0.3s ease",
              }}
            >
              {hasQueen && (
                <span
                  style={{
                    animation: "fadeIn 0.3s",
                    textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
                  }}
                >
                  {"\u265B"}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );

  return (
    <div style={{ flex: "2 1 400px", minWidth: 0 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "15px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <h3
          style={{
            margin: 0,
            color: "#0f172a",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          {showSolutionGallery
            ? `All ${solutions.length} Solutions`
            : "Chessboard Status"}
        </h3>
        <div style={{ display: "flex", gap: "10px" }}>
          {phase === "simulating" && (
            <>
              <button
                onClick={handleNextStep}
                style={{
                  padding: "8px 20px",
                  backgroundColor: "#0f172a",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Next Step
              </button>
              <button
                onClick={handleSkipToEnd}
                style={{
                  padding: "8px 20px",
                  backgroundColor: "#f8fafc",
                  color: "#334155",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Skip to Final Results
              </button>
            </>
          )}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "24px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        }}
      >
        {showSolutionGallery ? (
          <div
            style={{
              width: "100%",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "20px",
              alignItems: "start",
            }}
          >
            {solutions.map((solution, index) => (
              <div
                key={`solution-card-${index}`}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  padding: "16px",
                  backgroundColor: "#f8fafc",
                }}
              >
                <h4
                  style={{
                    margin: "0 0 14px 0",
                    textAlign: "center",
                    color: "#0f172a",
                    fontSize: "1rem",
                  }}
                >
                  {`Solution ${index + 1}`}
                </h4>
                {renderBoard(solution, `solution-${index}`, true)}
              </div>
            ))}
          </div>
        ) : (
          renderBoard(currentBoard, "current-board")
        )}
      </div>
    </div>
  );
}

export default SimulatorMatrix;
