import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TheoryTab from "./components/TheoryTab";
import SimulatorTab from "./components/SimulatorTab";
import "./index.css";

function App() {
  const [activeTab, setActiveTab] = useState("simulator");

  return (
    <div style={{ display: "flex", height: "100vh", backgroundColor: "#f8f9fa", fontFamily: "Arial, sans-serif" }}>
      {/* Left Sidebar Menu */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {/* Right Side Main Content */}
      <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
        {activeTab === "aim" && <TheoryTab activeTab="aim" />}
        {activeTab === "theory" && <TheoryTab activeTab="theory" />}
        {activeTab === "simulator" && <SimulatorTab />}
      </div>
    </div>
  );
}

export default App;