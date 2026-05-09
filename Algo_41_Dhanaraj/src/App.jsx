import React, { useState } from 'react';
import { getKruskalSteps } from './utils/kruskal';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('aim'); // 'aim', 'theory', 'simulator'

  // --- SIMULATION STATES ---
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [mode, setMode] = useState('addNode'); 
  const [selectedNode, setSelectedNode] = useState(null);
  const [edgeCounter, setEdgeCounter] = useState(1);
  const [edgeStatus, setEdgeStatus] = useState({});
  const [mstWeight, setMstWeight] = useState(null); 
  const [speed, setSpeed] = useState(1000); 

  // --- SIMULATION LOGIC ---
  const handleSvgClick = (e) => {
    if (mode === 'addNode') {
      let nodeName = prompt("Enter node name (e.g., A, B, Pune, Delhi):");
      if (!nodeName || nodeName.trim() === "") return;
      nodeName = nodeName.trim();
      
      const nameExists = nodes.some(n => n.id.toLowerCase() === nodeName.toLowerCase());
      if (nameExists) {
        alert(`A node with the name '${nodeName}' already exists.`);
        return;
      }
      
      const rect = e.target.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      // FIX: Boundary check to prevent nodes from getting cut off at the edges
      // Circle radius is 25, so we keep a safe padding of 30 pixels from all sides
      const padding = 30;
      x = Math.max(padding, Math.min(x, rect.width - padding));
      y = Math.max(padding, Math.min(y, rect.height - padding));

      setNodes([...nodes, { id: nodeName, x, y }]);
      resetSimulationState();
    }
  };

  const handleNodeClick = (e, nodeId) => {
    e.stopPropagation(); 
    if (mode === 'deleteNode') {
      setNodes(nodes.filter(n => n.id !== nodeId));
      setEdges(edges.filter(e => e.source !== nodeId && e.target !== nodeId));
      resetSimulationState();
      return;
    }
    if (mode === 'addEdge') {
      if (!selectedNode) {
        setSelectedNode(nodeId); 
      } else {
        if (selectedNode !== nodeId) {
          const edgeExists = edges.some(e => 
            (e.source === selectedNode && e.target === nodeId) || 
            (e.source === nodeId && e.target === selectedNode)
          );
          if (!edgeExists) {
            const weight = prompt(`Enter edge weight between ${selectedNode} and ${nodeId}:`);
            if (weight && !isNaN(weight)) {
              setEdges([...edges, { id: `e${edgeCounter}`, source: selectedNode, target: nodeId, weight: parseInt(weight) }]);
              setEdgeCounter(edgeCounter + 1);
              resetSimulationState();
            }
          } else {
            alert("Edge already exists between these nodes!");
          }
        }
        setSelectedNode(null); 
      }
    }
  };

  const handleEdgeClick = (e, edgeId) => {
    e.stopPropagation();
    if (mode === 'deleteEdge') {
      setEdges(edges.filter(edge => edge.id !== edgeId));
      resetSimulationState();
    }
  };

  const resetSimulationState = () => {
    setEdgeStatus({});
    setMstWeight(null);
  };

  const handleClearAll = () => {
    setNodes([]);
    setEdges([]);
    setEdgeStatus({});
    setEdgeCounter(1);
    setMstWeight(null);
    setSelectedNode(null);
  };

  const simulateKruskal = () => {
    if (nodes.length === 0 || edges.length === 0) {
      alert("Please draw some nodes and edges first!");
      return;
    }
    const { steps, finalMst } = getKruskalSteps(nodes, edges);
    let stepIndex = 0;
    resetSimulationState();
    const interval = setInterval(() => {
      if (stepIndex >= steps.length) {
        clearInterval(interval);
        const total = finalMst.reduce((sum, edge) => sum + edge.weight, 0);
        setMstWeight(total);
        return;
      }
      const currentStep = steps[stepIndex];
      setEdgeStatus(prev => ({ ...prev, [currentStep.edgeId]: currentStep.type }));
      stepIndex++;
    }, speed); 
  };

  return (
    <div className="lab-container">
      {/* SIDEBAR NAVIGATION */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h3>Algorithms Lab</h3>
          <p>Computer Science Dept.</p>
        </div>
        <ul className="nav-links">
          <li className={activeTab === 'aim' ? 'active' : ''} onClick={() => setActiveTab('aim')}>
            1. Aim
          </li>
          <li className={activeTab === 'theory' ? 'active' : ''} onClick={() => setActiveTab('theory')}>
            2. Theory & Logic
          </li>
          <li className={activeTab === 'simulator' ? 'active' : ''} onClick={() => setActiveTab('simulator')}>
            3. Simulator
          </li>
        </ul>
        <div className="sidebar-footer">Exp: Kruskal's MST</div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="content-area">
        
        {/* --- AIM SECTION --- */}
        {activeTab === 'aim' && (
          <div className="card-section">
            <h1 className="section-title">Kruskal's Algorithm (Minimum Spanning Tree)</h1>
            <h2 className="sub-title">1. Aim</h2>
            <div className="content-box">
              <p>
                To implement, analyze, and build an interactive Virtual Lab for finding the Minimum Spanning Tree (MST) of a graph using Kruskal's Algorithm (a Greedy approach). 
              </p>
              <p>
                The objective is to minimize the total cost (weight) of the graph while ensuring all nodes remain connected without forming any closed loops or cycles.
              </p>
            </div>
          </div>
        )}

        {/* --- THEORY SECTION --- */}
        {activeTab === 'theory' && (
          <div className="card-section">
            <h1 className="section-title">Kruskal's Algorithm (Minimum Spanning Tree)</h1>
            <h2 className="sub-title">2. Theory & Logic</h2>
            <div className="content-box theory-text">
              <p><strong>What is a Minimum Spanning Tree (MST)?</strong></p>
              <p>A spanning tree of a connected, undirected graph is a subgraph that is a tree and includes all the vertices of the graph. A Minimum Spanning Tree is a spanning tree whose sum of edge weights is as small as possible.</p>
              
              <p><strong>Kruskal's Approach (Greedy Algorithm):</strong></p>
              <ul>
                <li><strong>Step 1:</strong> Sort all the edges from lowest weight to highest weight.</li>
                <li><strong>Step 2:</strong> Pick the smallest edge. Check if it forms a cycle with the spanning tree formed so far.</li>
                <li><strong>Step 3:</strong> If a cycle is not formed, include this edge in the MST. Else, discard it.</li>
                <li><strong>Step 4:</strong> Repeat until there are exactly <strong>(V - 1)</strong> edges in the tree (where V is the number of vertices).</li>
              </ul>

              <p><strong>Cycle Detection (Union-Find):</strong></p>
              <p>To check if adding an edge creates a cycle, the algorithm uses the <strong>Disjoint Set Union (DSU)</strong> data structure. If the source and target nodes of an edge belong to the same parent set, adding that edge will create a loop. If they belong to different sets, they are joined (unioned).</p>

              <p><strong>Complexity:</strong></p>
              <ul>
                <li><strong>Time Complexity:</strong> O(E log E) or O(E log V) primarily due to the sorting of edges.</li>
                <li><strong>Space Complexity:</strong> O(V + E) for storing the graph and the Union-Find parent array.</li>
              </ul>
            </div>
          </div>
        )}

        {/* --- SIMULATOR SECTION --- */}
        {activeTab === 'simulator' && (
          <div className="card-section">
            <h1 className="section-title">Simulator</h1>
            
            <div className="controls-container">
              <div className="toolbar">
                <button onClick={() => { setMode('addNode'); setSelectedNode(null); }} className={mode === 'addNode' ? 'active-btn' : ''}>+ Add Node</button>
                <button onClick={() => setMode('addEdge')} className={mode === 'addEdge' ? 'active-btn' : ''}>Draw Edge</button>
                <button onClick={() => { setMode('deleteNode'); setSelectedNode(null); }} className={mode === 'deleteNode' ? 'danger-btn active-danger' : 'danger-btn'}>Delete Node</button>
                <button onClick={() => { setMode('deleteEdge'); setSelectedNode(null); }} className={mode === 'deleteEdge' ? 'danger-btn active-danger' : 'danger-btn'}>Delete Edge</button>
                <button onClick={simulateKruskal} className="success-btn">Give Solution</button>
                <button onClick={handleClearAll} className="danger-btn-solid">Clear All</button>
              </div>

              <div className="speed-control">
                <label>Animation Speed:</label>
                <input type="range" min="200" max="2000" step="200" value={2200 - speed} onChange={(e) => setSpeed(2200 - e.target.value)} />
                <span>Mode: <strong>{mode.toUpperCase()}</strong></span>
              </div>
            </div>

            {mstWeight !== null && (
              <div className="result-banner">
                Minimum Spanning Tree Found! Total Cost: {mstWeight}
              </div>
            )}

            <div className="canvas-container">
              <svg width="100%" height="500" className={`graph-canvas ${mode === 'addNode' ? 'crosshair' : ''}`} onClick={handleSvgClick}>
                {/* Edges */}
                {edges.map(edge => {
                  const sourceNode = nodes.find(n => n.id === edge.source);
                  const targetNode = nodes.find(n => n.id === edge.target);
                  if (!sourceNode || !targetNode) return null;

                  let strokeColor = '#999';
                  let strokeWidth = 2;
                  if (edgeStatus[edge.id] === 'CHECKING') { strokeColor = 'orange'; strokeWidth = 4; }
                  if (edgeStatus[edge.id] === 'ADDED') { strokeColor = 'green'; strokeWidth = 5; }
                  if (edgeStatus[edge.id] === 'CYCLE_DETECTED') { strokeColor = '#ef5350'; strokeWidth = 2; }

                  return (
                    <g key={edge.id} onClick={(e) => handleEdgeClick(e, edge.id)} className={mode === 'deleteEdge' ? 'pointer' : ''}>
                      <line x1={sourceNode.x} y1={sourceNode.y} x2={targetNode.x} y2={targetNode.y} stroke="transparent" strokeWidth="15" />
                      <line x1={sourceNode.x} y1={sourceNode.y} x2={targetNode.x} y2={targetNode.y} stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={edgeStatus[edge.id] === 'CYCLE_DETECTED' ? "5,5" : "0"} />
                      <rect x={(sourceNode.x + targetNode.x) / 2 - 12} y={(sourceNode.y + targetNode.y) / 2 - 12} width="24" height="24" fill="#fff" rx="4" />
                      <text x={(sourceNode.x + targetNode.x) / 2} y={(sourceNode.y + targetNode.y) / 2 + 5} fill="#000" fontWeight="bold" textAnchor="middle">{edge.weight}</text>
                    </g>
                  );
                })}

                {/* Nodes */}
                {nodes.map(node => (
                  <g key={node.id} onClick={(e) => handleNodeClick(e, node.id)} className={(mode === 'addEdge' || mode === 'deleteNode') ? 'pointer' : ''}>
                    <circle cx={node.x} cy={node.y} r="25" fill={mode === 'deleteNode' ? '#ef5350' : (selectedNode === node.id ? "#ffeb3b" : "#2196F3")} stroke="#000" strokeWidth="2" />
                    <text x={node.x} y={node.y + 5} textAnchor="middle" fill="#fff" fontWeight="bold" fontSize="14px">{node.id}</text>
                  </g>
                ))}
              </svg>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;