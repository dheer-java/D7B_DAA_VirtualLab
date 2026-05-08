function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div
      style={{
        width: "260px",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #dee2e6",
        boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
        display: "flex",
        flexDirection: "column",
        zIndex: 10,
      }}
    >
      <div
        style={{
          padding: "25px 20px",
          borderBottom: "1px solid #dee2e6",
          backgroundColor: "#f8f9fa",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#084298",
            fontSize: "1.3rem",
            fontWeight: "bold",
          }}
        >
          Algorithms Lab
        </h2>
        <p
          style={{ margin: "5px 0 0 0", fontSize: "0.85rem", color: "#6c757d" }}
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
                background: activeTab === tab ? "#cfe2ff" : "transparent",
                border: "none",
                borderLeft:
                  activeTab === tab
                    ? "4px solid #0d6efd"
                    : "4px solid transparent",
                cursor: "pointer",
                fontSize: "1rem",
                color: activeTab === tab ? "#084298" : "#495057",
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
          borderTop: "1px solid #dee2e6",
          fontSize: "0.8rem",
          color: "#adb5bd",
          textAlign: "center",
        }}
      >
        Exp 6: LCS Visualization
      </div>
    </div>
  );
}

export default Sidebar;
