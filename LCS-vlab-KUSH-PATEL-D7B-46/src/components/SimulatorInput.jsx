function SimulatorInput({
  string1,
  setString1,
  string2,
  setString2,
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
        padding: "20px",
        backgroundColor: "#ffffff",
        borderRadius: "8px",
        border: "1px solid #dee2e6",
        alignItems: "flex-end",
        flexWrap: "wrap",
        boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
      }}
    >
      <div style={{ flex: 1, minWidth: "200px" }}>
        <label
          style={{
            display: "block",
            fontSize: "0.95rem",
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#084298",
          }}
        >
          String 1 (Rows)
        </label>
        <input
          type="text"
          value={string1}
          onChange={(e) =>
            setString1(e.target.value.toUpperCase().replace(/\s/g, ""))
          }
          disabled={phase !== "input"}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "2px solid #ced4da",
            backgroundColor: phase !== "input" ? "#e9ecef" : "white",
            color: "#212529",
            fontSize: "1.1rem",
            letterSpacing: "2px",
            fontWeight: "bold",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>
      <div style={{ flex: 1, minWidth: "200px" }}>
        <label
          style={{
            display: "block",
            fontSize: "0.95rem",
            fontWeight: "bold",
            marginBottom: "8px",
            color: "#084298",
          }}
        >
          String 2 (Cols)
        </label>
        <input
          type="text"
          value={string2}
          onChange={(e) =>
            setString2(e.target.value.toUpperCase().replace(/\s/g, ""))
          }
          disabled={phase !== "input"}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "6px",
            border: "2px solid #ced4da",
            backgroundColor: phase !== "input" ? "#e9ecef" : "white",
            color: "#212529",
            fontSize: "1.1rem",
            letterSpacing: "2px",
            fontWeight: "bold",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        {phase === "input" ? (
          <button
            onClick={handleInitialize}
            style={{
              padding: "12px 25px",
              backgroundColor: "#0d6efd",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              transition: "0.2s",
            }}
          >
            Initialize DP Table
          </button>
        ) : (
          <button
            onClick={handleReset}
            style={{
              padding: "12px 25px",
              backgroundColor: "white",
              color: "#dc3545",
              border: "2px solid #dc3545",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
              transition: "0.2s",
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
