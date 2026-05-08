import React from 'react';

function TheoryTab({ activeTab }) {
  return (
    <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "40px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
      <h1 style={{ color: "#1e293b", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", marginBottom: "20px" }}>
        Selection Sort Algorithm
      </h1>

      {activeTab === "aim" && (
        <div style={{ animation: "fadeIn 0.5s ease" }}>
          <h2 style={{ color: "#2563eb" }}>1. Aim & Objective</h2>
          <p style={{ backgroundColor: "#f8fafc", padding: "20px", borderLeft: "5px solid #3b82f6", borderRadius: "4px", fontSize: "1.1rem", lineHeight: "1.6" }}>
            To implement and analyze the Selection Sort problem using an interactive visualizer, and to evaluate its Time and Space Complexity across different cases.
          </p>
        </div>
      )}

      {activeTab === "theory" && (
        <div style={{ animation: "fadeIn 0.5s ease", lineHeight: "1.7", fontSize: "1.05rem", color: "#334155" }}>
          <h2 style={{ color: "#2563eb" }}>2. Theory & Logic</h2>
          <p>
            Selection sort is a simple and efficient sorting algorithm that works by repeatedly selecting the smallest (or largest) element from the unsorted portion of the list and moving it to the sorted portion of the list. 
          </p>
          
          <h3 style={{ color: "#0f172a", marginTop: "25px" }}>How it works:</h3>
          <ul style={{ marginBottom: "20px" }}>
            <li>Maintains two subarrays: the sorted part at the beginning and the unsorted part at the end.</li>
            <li>Initially, the sorted subarray is empty and the unsorted subarray is the entire list.</li>
            <li>In every iteration, the minimum element from the unsorted subarray is picked and swapped with the leftmost element of the unsorted subarray.</li>
            <li>That element then becomes part of the sorted subarray.</li>
          </ul>

          <h3 style={{ color: "#0f172a", marginTop: "30px" }}>Complexity Analysis:</h3>
          <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
            <div style={{ flex: 1, backgroundColor: "#eff6ff", padding: "20px", borderRadius: "8px", border: "1px solid #bfdbfe" }}>
              <strong style={{ color: "#1d4ed8", display: "block", fontSize: "1.2rem", marginBottom: "10px" }}>Time Complexity</strong>
              <p style={{ margin: 0 }}><strong>O(n²)</strong> for Best, Average, and Worst cases.</p>
              <p style={{ margin: "5px 0 0 0", fontSize: "0.9rem" }}>This is because there are two nested loops: one to select the element and one to iterate over the remaining array to find the minimum.</p>
            </div>
            
            <div style={{ flex: 1, backgroundColor: "#fef3c7", padding: "20px", borderRadius: "8px", border: "1px solid #fde68a" }}>
              <strong style={{ color: "#b45309", display: "block", fontSize: "1.2rem", marginBottom: "10px" }}>Space Complexity</strong>
              <p style={{ margin: 0 }}><strong>O(1)</strong> Auxiliary Space.</p>
              <p style={{ margin: "5px 0 0 0", fontSize: "0.9rem" }}>It is an in-place sorting algorithm and does not require any extra temporary arrays.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TheoryTab;