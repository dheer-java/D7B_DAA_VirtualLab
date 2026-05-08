function SimulatorMatrix({
  string1,
  string2,
  dpTable,
  phase,
  currentI,
  currentJ,
  getCellColor,
  handleNextGenStep,
  handleSkipGeneration,
  handleStartBacktrack,
}) {
  return (
    <div style={{ flex: "2 1 500px", minWidth: 0 }}>
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
            color: "#084298",
            fontSize: "1.2rem",
            fontWeight: "bold",
          }}
        >
          DP Matrix Visualization
        </h3>
        <div style={{ display: "flex", gap: "10px" }}>
          {phase === "generating" && (
            <>
              <button
                onClick={handleNextGenStep}
                style={{
                  padding: "8px 20px",
                  backgroundColor: "#0d6efd",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ▶ Next Cell
              </button>
              <button
                onClick={handleSkipGeneration}
                style={{
                  padding: "8px 20px",
                  backgroundColor: "#e9ecef",
                  color: "#495057",
                  border: "1px solid #ced4da",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                ⏭ Skip to Full
              </button>
            </>
          )}
          {phase === "generated" && (
            <button
              onClick={handleStartBacktrack}
              style={{
                padding: "10px 25px",
                backgroundColor: "#198754",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "bold",
                boxShadow: "0 4px 6px rgba(25, 135, 84, 0.2)",
              }}
            >
              Start Backtracking
            </button>
          )}
        </div>
      </div>

      <div
        style={{
          overflowX: "auto",
          backgroundColor: "#ffffff",
          border: "1px solid #dee2e6",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <table style={{ borderCollapse: "collapse", margin: "0 auto" }}>
          <thead>
            <tr>
              <th
                style={{
                  padding: "15px",
                  border: "1px solid #dee2e6",
                  background: "#f8f9fa",
                  color: "#adb5bd",
                }}
              >
                ∅
              </th>
              <th
                style={{
                  padding: "15px",
                  border: "1px solid #dee2e6",
                  background: "#f8f9fa",
                  color: "#adb5bd",
                }}
              >
                0
              </th>
              {string2.split("").map((char, index) => (
                <th
                  key={index}
                  style={{
                    padding: "15px",
                    border: "1px solid #dee2e6",
                    background: "#e9ecef",
                    color: "#084298",
                    fontWeight: "bold",
                    minWidth: "50px",
                    fontSize: "1.1rem",
                  }}
                >
                  {char}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dpTable.map((row, i) => (
              <tr key={i}>
                <th
                  style={{
                    padding: "15px",
                    border: "1px solid #dee2e6",
                    background: i === 0 ? "#f8f9fa" : "#e9ecef",
                    color: i === 0 ? "#adb5bd" : "#084298",
                    fontSize: "1.1rem",
                  }}
                >
                  {i === 0 ? "0" : string1[i - 1]}
                </th>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    style={{
                      border: "1px solid #dee2e6",
                      transition: "all 0.3s ease",
                      backgroundColor: getCellColor(i, j),
                      width: "60px",
                      height: "60px",
                      textAlign: "center",
                      fontSize: "1.2rem",
                      color:
                        i === currentI && j === currentJ
                          ? "#d9480f"
                          : "#212529",
                      fontWeight:
                        cell !== "" && phase !== "generating"
                          ? "bold"
                          : "normal",
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default SimulatorMatrix;
