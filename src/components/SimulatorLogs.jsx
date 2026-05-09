function SimulatorLogs({
  phase,
  genLogs,
  logs,
  logsEndRef,
  finalLcs,
  handleNextBacktrackStep,
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
          border: "1px solid #dee2e6",
          borderBottom: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px 8px 0 0",
        }}
      >
        <strong style={{ color: "#084298", fontSize: "1.1rem" }}>
          {phase === "generating" || phase === "generated"
            ? "Generation Log"
            : "Backtracking Log"}
        </strong>
        {(phase === "backtracking" || phase === "complete") && (
          <button
            onClick={handleNextBacktrackStep}
            disabled={phase === "complete"}
            style={{
              padding: "8px 15px",
              backgroundColor: phase === "complete" ? "#e9ecef" : "#0d6efd",
              color: phase === "complete" ? "#adb5bd" : "white",
              border: "none",
              borderRadius: "6px",
              cursor: phase === "complete" ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {phase === "complete" ? "Finished ✅" : "Next Step ▶"}
          </button>
        )}
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "20px",
          backgroundColor: "#ffffff",
          border: "1px solid #dee2e6",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        {(phase === "generating" || phase === "generated") &&
          genLogs.map((log, index) => (
            <div
              key={index}
              style={{
                padding: "15px",
                borderRadius: "8px",
                backgroundColor: log.bg,
                borderLeft: `6px solid ${log.border}`,
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                animation: "slideIn 0.3s ease-out",
              }}
            >
              <h4
                style={{
                  margin: "0 0 8px 0",
                  color: "#212529",
                  fontSize: "1.05rem",
                }}
              >
                {log.title}
              </h4>
              <p
                style={{
                  margin: 0,
                  whiteSpace: "pre-line",
                  color: "#495057",
                  fontSize: "0.95rem",
                  lineHeight: "1.5",
                }}
              >
                {log.details}
              </p>
            </div>
          ))}
        {(phase === "backtracking" || phase === "complete") &&
          logs.map((log, index) => (
            <div
              key={index}
              style={{
                padding: "15px",
                borderRadius: "8px",
                backgroundColor: log.bg,
                borderLeft: `6px solid ${log.border}`,
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                animation: "slideIn 0.3s ease-out",
              }}
            >
              <h4
                style={{
                  margin: "0 0 8px 0",
                  color: "#212529",
                  fontSize: "1.05rem",
                }}
              >
                {log.title}
              </h4>
              <p
                style={{
                  margin: "0 0 10px 0",
                  color: "#495057",
                  fontSize: "0.95rem",
                }}
              >
                {log.details}
              </p>
              <strong
                style={{
                  display: "inline-block",
                  backgroundColor: "rgba(255,255,255,0.6)",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  color: "#212529",
                }}
              >
                {log.action}
              </strong>
            </div>
          ))}
        <div ref={logsEndRef} />
      </div>

      {(phase === "backtracking" || phase === "complete") && (
        <div
          style={{
            padding: "20px",
            border: "1px solid #dee2e6",
            borderTop: "none",
            backgroundColor: "#cfe2ff",
            textAlign: "center",
            borderRadius: "0 0 8px 8px",
          }}
        >
          <span
            style={{
              fontSize: "0.9rem",
              color: "#084298",
              display: "block",
              textTransform: "uppercase",
              fontWeight: "bold",
              marginBottom: "5px",
            }}
          >
            Extracted Sequence
          </span>
          <strong
            style={{ fontSize: "2rem", color: "#0d6efd", letterSpacing: "5px" }}
          >
            {finalLcs || "---"}
          </strong>
        </div>
      )}
    </div>
  );
}
export default SimulatorLogs;
