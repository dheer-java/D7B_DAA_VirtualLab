import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TheoryTab from "./components/TheoryTab";
import SimulatorTab from "./components/SimulatorTab";

function App() {
  const [activeTab, setActiveTab] = useState("aim");

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        backgroundColor: "transparent",
        color: "#343a40",
      }}
    >
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "40px",
          backgroundColor: "transparent",
        }}
      >
        {activeTab === "aim" || activeTab === "theory" ? (
          <TheoryTab activeTab={activeTab} />
        ) : (
          <SimulatorTab />
        )}
      </div>
    </div>
  );
}

export default App;
