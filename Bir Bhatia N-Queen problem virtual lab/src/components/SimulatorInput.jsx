function SimulatorInput({
  boardSize,
  setBoardSize,
  phase,
  handleInitialize,
  handleReset,
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        marginBottom: "30px",
        padding: "24px",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        alignItems: "flex-end",
        flexWrap: "wrap",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div style={{ flex: 1, minWidth: "200px", maxWidth: "300px" }}>
        <label
          style={{
            display: "block",
            fontSize: "0.9rem",
            fontWeight: "600",
            marginBottom: "8px",
            color: "#334155",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Board Size (N)
        </label>
        <input
          type="number"
          min="4"
          max="8"
          value={boardSize}
          onChange={(e) => {
            const val = parseInt(e.target.value);
            if (!isNaN(val)) setBoardSize(val);
            else setBoardSize("");
          }}
          disabled={phase !== "input"}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            border: "1px solid #cbd5e1",
            backgroundColor: phase !== "input" ? "#f1f5f9" : "white",
            color: "#0f172a",
            fontSize: "1.1rem",
            fontWeight: "600",
            outline: "none",
            boxSizing: "border-box",
            transition: "all 0.2s",
          }}
        />
        <small style={{ color: "#94a3b8", display: "block", marginTop: "5px" }}>
          * Recommended between 4 and 8
        </small>
      </div>

      <div style={{ display: "flex", gap: "10px", paddingBottom: "18px" }}>
        {phase === "input" ? (
          <button
            onClick={() => {
              if (boardSize >= 4 && boardSize <= 10) handleInitialize();
              else alert("Please enter a board size N between 4 and 10.");
            }}
            style={{
              padding: "14px 28px",
              backgroundColor: "#0f172a",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem",
              transition: "0.2s",
            }}
          >
            Start Simulation
          </button>
        ) : (
          <button
            onClick={handleReset}
            style={{
              padding: "13px 28px",
              backgroundColor: "white",
              color: "#334155",
              border: "1px solid #cbd5e1",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "1rem",
              transition: "all 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#f8fafc";
              e.currentTarget.style.color = "#0f172a";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "#334155";
            }}
          >
            Reset Lab
          </button>
        )}
      </div>
    </div>
  );
}
export default SimulatorInput;
