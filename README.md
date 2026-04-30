\# Dijkstra's Algorithm Virtual Lab

An interactive web‑based simulation that visualizes \*\*Dijkstra’s shortest‑path algorithm\*\* on weighted graphs.    
Designed for students and educators to understand the greedy strategy, relaxation, and priority‑queue behaviour in real time.

\> “Seeing a greedy algorithm step‑by‑step transforms abstract theory into lasting intuition.”

\---

\#\# Overview

Dijkstra’s algorithm finds the shortest path from a single source node to all other nodes in a graph with \*\*non‑negative edge weights\*\*.    
This virtual lab provides:

\- Three ready‑to‑explore graph examples  
\- Step‑by‑step visualisation with node / edge highlighting  
\- A live distance table and status log  
\- A separate “Concept” tab with static trace diagrams, state tables and pseudocode

The entire tool runs in a browser – no installation or setup required.

\---

\#\# Key Features

\- \*\*Three built‑in graph examples\*\* – from simple 5‑node to complex 8‑node networks.  
\- \*\*Interactive animation\*\* – play, pause, reset and control speed (100–2000 ms per step).  
\- \*\*Visual feedback\*\* – colour‑coded nodes:    
  🟢 \*\*Visited (teal)\*\* | 🟠 \*\*Evaluating (orange)\*\* | 🔵 \*\*Unvisited (grey)\*\*    
  Edges: \*\*Shortest path (blue)\*\* | \*\*Active relaxation (orange)\*\*  
\- \*\*Distance table\*\* – shows current shortest distance and parent node for every vertex.  
\- \*\*Educational tabs\*\* – \*Aim\* (learning outcomes), \*Concept\* (trace, state table, pseudocode, applications) and \*Simulation\* (interactive lab).  
\- \*\*Progress bar & step counter\*\* – track the algorithm’s progress.  
\- \*\*Mobile‑friendly layout\*\* – adapts to different screen sizes.

\---

\#\# Technologies Used

\- \*\*HTML5\*\* – document structure & tab navigation  
\- \*\*CSS3\*\* – custom styling with CSS variables, flexbox, grid  
\- \*\*JavaScript (ES6)\*\* – Dijkstra’s logic, frame generation, SVG rendering  
\- \*\*SVG\*\* – dynamic graph drawing with markers for edges  
\- \*\*No external libraries\*\* – pure vanilla implementation

\---

\#\# How to Run the Project

Because the project is a single HTML file, you have two simple options:

\#\#\# Option 1 – Local execution (no Git)  
1\. Download the file \`dijkstra\_virtual\_lab.html\`  
2\. Double‑click it – it will open in your default web browser.

\#\#\# Option 2 – After pushing to GitHub  
Once you have pushed the file to a GitHub repository, enable \*\*GitHub Pages\*\*:  
\- Go to repository \*\*Settings → Pages\*\*  
\- Under “Branch”, select \`main\` (or \`master\`) and save  
\- Your lab will be live at:    
  \`https://\<your-username\>.github.io/\<repository-name\>/dijkstra\_virtual\_lab.html\`

\> ⚠️ All modern browsers (Chrome, Firefox, Edge, Safari) are supported.    
\> No web server is needed – the file runs entirely client‑side.

\---

\#\# How to Use the Simulation

1\. \*\*Open the file\*\* in a browser.  
2\. \*\*Click the \`Simulation\` tab\*\*.  
3\. \*\*Choose a graph\*\* from the dropdown (Basic, Multiple Paths, Complex Network).  
4\. \*\*Press \`▶ Play\`\*\* – watch Dijkstra’s algorithm step through the graph.  
5\. \*\*Use \`⏸ Pause\`\*\* to stop and inspect the current state.    
   \*\*\`↺ Reset\`\*\* restarts the animation from the beginning.  
6\. \*\*Adjust animation speed\*\* with the slider (100 ms \= fast, 2000 ms \= very slow).  
7\. \*\*Watch the right panel\*\*:  
   \- Nodes change colour (teal \= finalised, orange \= being processed).  
   \- Edges become blue when they are part of the shortest‑path tree.  
   \- The \*\*distance table\*\* updates every step.  
   \- The \*\*status message\*\* explains each decision (e.g., “Relaxed\! Updated d(B) \= 7, via A.”).

\#\#\# Input Constraints (built‑in examples)  
\- All edge weights are \*\*positive integers\*\*.  
\- The graph is \*\*undirected\*\* (the algorithm works for directed graphs too – edges are treated as bidirectional for simplicity).  
\- Source node is fixed per graph:    
  \- Example 1 → \`A\`    
  \- Example 2 → \`S\`    
  \- Example 3 → \`A\`

\> You cannot manually edit the graph or add nodes – this lab focuses on visualising three carefully chosen examples.    
\> However, you can easily extend the code (see \`GRAPHS\` array) to add your own graphs.

\---

\#\# Sample Input & Output

\#\#\# Example 1 – Basic 5‑node graph

\*\*Graph (edges with weights):\*\*    
A‑B(4), A‑D(2), B‑C(5), B‑D(1), B‑E(6), C‑E(3), D‑E(8)    
Source \= A

\*\*Output after running Dijkstra:\*\*  

| Node | Shortest distance from A | Path       |  
|------|--------------------------|------------|  
| A    | 0                        | –          |  
| B    | 3                        | A → D → B  |  
| C    | 8                        | A → B → C  |  
| D    | 2                        | A → D      |  
| E    | 8                        | A → B → E  |

\> The animation will show each relaxation step, and the final shortest‑path tree is drawn in blue.

\---

\#\# Algorithm Explanation

Dijkstra’s algorithm is a \*\*greedy\*\* algorithm that maintains a set of vertices whose shortest distance from the source is already known.

\#\#\# Working Principle (as shown in the simulation)

1\. \*\*Initialisation\*\* – distance to source \= 0, all other nodes \= ∞.  
2\. \*\*Extract‑Min\*\* – pick the unvisited node with the smallest distance.  
3\. \*\*Relaxation\*\* – for each neighbour, check if going through the current node gives a shorter path. If yes, update the distance and parent.  
4\. \*\*Mark visited\*\* – the extracted node is now final (its distance cannot be improved because all edge weights are non‑negative).  
5\. \*\*Repeat\*\* until all reachable nodes are visited.

\> The animation strictly follows this sequence – you see exactly which node is extracted, which edges are relaxed, and when a distance improves.

\#\#\# Pseudocode (used in the lab)

function Dijkstra(Graph, source):  
for each vertex v in Graph:  
dist\[v\] \= INFINITY  
prev\[v\] \= NULL  
dist\[source\] \= 0

Q \= min‑priority queue (all vertices, keyed by dist)  
while Q is not empty:  
u \= Q.extractMin()  
for each neighbour v of u:  
alt \= dist\[u\] \+ weight(u, v)  
if alt \< dist\[v\]:  
dist\[v\] \= alt  
prev\[v\] \= u  
Q.decreaseKey(v, alt)

\---

\#\# Complexity Analysis

| Implementation          | Time Complexity       | Space Complexity |  
|-------------------------|-----------------------|------------------|  
| Standard (array)        | O(V²)                 | O(V \+ E)         |  
| \*\*Min‑heap (used here)\*\* | \*\*O((V \+ E) log V)\*\*  | \*\*O(V \+ E)\*\*     |

\- \*\*V\*\* \= number of vertices, \*\*E\*\* \= number of edges.  
\- The heap‑based version is efficient for sparse graphs.  
\- This lab uses a simplified priority queue (linear scan) for clarity – perfect for small demonstration graphs.

\---

\#\# Applications of Dijkstra’s Algorithm

\- \*\*GPS navigation\*\* – fastest route between two locations.  
\- \*\*Network routing (OSPF)\*\* – Internet routers build shortest‑path trees.  
\- \*\*Robotics\*\* – autonomous path planning in weighted grids.  
\- \*\*Telecommunications\*\* – minimise latency or bandwidth cost.  
\- \*\*Social networks\*\* – degrees of separation / influence propagation.

\---

\#\# Educational Value

This virtual lab helps learners:

\- Understand \*\*why\*\* Dijkstra fails with negative weights (explained in the “Concept” tab).  
\- Connect the \*\*state table\*\* and \*\*priority queue\*\* behaviour to the visual animation.  
\- Experiment with different graph topologies and observe how distances converge.  
\- See \*\*greedy selection\*\* in action – the algorithm never revisits a finalised node.

\---

\#\# Limitations & Future Enhancements

\#\#\# Current Limitations  
\- Only three pre‑defined graphs (not user‑editable in the UI).  
\- Animation speed is per‑step, not continuous transition.  
\- Directed graphs not explicitly shown (edges are drawn bidirectionally, but the algorithm works identically).  
\- No support for very large graphs (\>20 nodes would clutter the SVG).

\#\#\# Possible Improvements  
\- Add a graph editor (click to add nodes/edges, assign weights).  
\- Let the user choose the source node interactively.  
\- Support directed edges with arrowheads.  
\- Show the priority queue contents dynamically.  
\- Compare Dijkstra with A\* (heuristic search).

\---

\#\# Project Structure

Because this is a \*\*single‑file\*\* web application, all components are inside \`dijkstra\_virtual\_lab.html\`:

dijkstra\_virtual\_lab.html  
├── `<style>` … `</style>` – all CSS (responsive, dark/light compatible)  
├── `<div id="app">` … `</div>` – HTML structure (tabs, simulation panel)  
└── `<script>` … `</script>` – complete JavaScript logic:  
├── GRAPHS definition (3 examples)  
├── generateFrames() – produces animation frames from Dijkstra execution  
├── renderFrame() – updates SVG and distance table  
├── playback controls (play/pause/reset/speed)  
└── concept visuals builder 