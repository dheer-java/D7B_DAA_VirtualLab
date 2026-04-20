import React from "react";

function SimulatorLogs({
  phase,
  steps,
  currentStepIndex,
  logsEndRef,
  solutionCount,
}) {
  return (
    <div
      style={{
        flex: "1 1 300px",
        display: "flex",
        flexDirection: "column",
        height: "550px",
        minWidth: "300px",
      }}
    >
      <div
        style={{
          padding: "15px 20px",
          border: "1px solid #e2e8f0",
          borderBottom: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#ffffff",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <strong style={{ color: "#0f172a", fontSize: "1.1rem" }}>
          Backtracking Log
        </strong>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {steps.slice(0, currentStepIndex + 1).map((step, index) => {
          const { log } = step;
          if (!log) return null;

          return (
            <div
              key={index}
              style={{
                padding: "15px",
                borderRadius: "8px",
                backgroundColor: log.bg,
                borderLeft: `6px solid ${log.border}`,
                boxShadow:
                  index === currentStepIndex
                    ? "0 4px 6px rgba(0,0,0,0.1)"
                    : "0 1px 3px rgba(0,0,0,0.02)",
                opacity: index === currentStepIndex ? 1 : 0.7,
                transform:
                  index === currentStepIndex ? "scale(1.02)" : "scale(1)",
                transition: "all 0.3s ease",
                animation: "slideIn 0.3s ease-out",
              }}
            >
              <h4
                style={{
                  margin: "0 0 8px 0",
                  color: "#0f172a",
                  fontSize: "1.05rem",
                }}
              >
                {log.title}
              </h4>
              <p
                style={{
                  margin: 0,
                  whiteSpace: "pre-line",
                  color: "#334155",
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
                }}
              >
                {log.details}
              </p>
            </div>
          );
        })}
        <div ref={logsEndRef} />
      </div>

      {(phase === "simulating" || phase === "complete") && (
        <div
          style={{
            padding: "20px",
            border: "1px solid #e2e8f0",
            borderTop: "none",
            backgroundColor: "#ffffff",
            textAlign: "center",
            borderRadius: "0 0 12px 12px",
          }}
        >
          <span
            style={{
              fontSize: "0.85rem",
              color: "#64748b",
              display: "block",
              textTransform: "uppercase",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            Algorithm Status
          </span>
          <strong
            style={{
              fontSize: "1.2rem",
              color: phase === "complete" ? "#22c55e" : "#0f172a",
              letterSpacing: "1px",
            }}
          >
            {phase === "complete"
              ? `${solutionCount} Solutions Found`
              : "Searching..."}
          </strong>
        </div>
      )}
    </div>
  );
}

export default SimulatorLogs;
