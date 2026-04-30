function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div
      style={{
        width: "260px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #e2e8f0",
        boxShadow: "2px 0 15px rgba(0,0,0,0.02)",
        display: "flex",
        flexDirection: "column",
        zIndex: 10,
      }}
    >
      <div
        style={{
          padding: "25px 20px",
          borderBottom: "1px solid #e2e8f0",
          backgroundColor: "#ffffff",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#0f172a",
            fontSize: "1.3rem",
            fontWeight: "bold",
            lineHeight: "1.2",
          }}
        >
          Algorithms Lab
        </h2>
        <p
          style={{ margin: "5px 0 0 0", fontSize: "0.85rem", color: "#64748b" }}
        >
          Computer Science Dept.
        </p>
      </div>

      <ul style={{ listStyle: "none", padding: 0, margin: 0, flex: 1 }}>
        {["aim", "theory", "simulator"].map((tab) => (
          <li key={tab}>
            <button
              onClick={() => setActiveTab(tab)}
              style={{
                width: "100%",
                padding: "15px 20px",
                textAlign: "left",
                background: activeTab === tab ? "#f8fafc" : "transparent",
                border: "none",
                borderLeft:
                  activeTab === tab
                    ? "4px solid #0f172a"
                    : "4px solid transparent",
                cursor: "pointer",
                fontSize: "1rem",
                color: activeTab === tab ? "#0f172a" : "#475569",
                fontWeight: activeTab === tab ? "600" : "normal",
                transition: "all 0.2s ease",
              }}
            >
              {tab === "aim"
                ? "1. Aim"
                : tab === "theory"
                  ? "2. Theory & Logic"
                  : "3. Interactive Simulator"}
            </button>
          </li>
        ))}
      </ul>

      <div
        style={{
          padding: "20px",
          borderTop: "1px solid #e2e8f0",
          fontSize: "0.8rem",
          color: "#94a3b8",
          textAlign: "center",
        }}
      >
        Exp 6: N-Queen Backtracking
      </div>
    </div>
  );
}

export default Sidebar;
