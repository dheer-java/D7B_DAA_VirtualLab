# Dijkstra's Algorithm Virtual Lab

An interactive web‑based simulation that visualizes **Dijkstra’s shortest‑path algorithm** on weighted graphs.  
Designed for students and educators to understand the greedy strategy, relaxation, and priority‑queue behaviour in real time.

---

## Overview

Dijkstra’s algorithm finds the shortest path from a single source node to all other nodes in a graph with **non‑negative edge weights**.  
This virtual lab provides:

- Three ready‑to‑explore graph examples
- Step‑by‑step visualisation with node / edge highlighting
- A live distance table and status log
- A separate “Concept” tab with static trace diagrams, state tables and pseudocode

The entire tool runs in a browser – no installation required.

---

## Features

- **Three built‑in graph examples** – from simple 5‑node to complex 8‑node networks.
- **Interactive animation** – play, pause, reset and control speed (100–2000 ms per step).
- **Visual feedback** – colour‑coded nodes:  
  🟢 Visited (teal) | 🟠 Evaluating (orange) | 🔵 Unvisited (grey)  
  Edges: Shortest path (blue) | Active relaxation (orange)
- **Distance table** – shows current shortest distance and parent node for every vertex.
- **Educational tabs** – *Aim* (learning outcomes), *Concept* (trace, state table, pseudocode, applications) and *Simulation* (interactive lab).
- **Progress bar & step counter** – track the algorithm’s progress.

---

## Technologies Used

- **HTML5** – structure & tab navigation
- **CSS3** – custom styling with CSS variables, flexbox, grid
- **JavaScript (ES6)** – Dijkstra’s logic, frame generation, SVG rendering
- **SVG** – dynamic graph drawing
- **No external libraries** – pure vanilla implementation

---

## How to Run

### Option 1 – Local execution (no Git)
1. Download the file `dijkstra_virtual_lab.html`
2. Double‑click it – it opens in your default web browser.

### Option 2 – After cloning the repository
Open `Dijkstra_Algorithm_Gayatri_D7B01/dijkstra_virtual_lab.html` in any browser.

> All modern browsers (Chrome, Firefox, Edge, Safari) are supported.

---

## How to Use the Simulation

1. Open `dijkstra_virtual_lab.html`
2. Click the **Simulation** tab.
3. Choose a graph from the dropdown (Basic, Multiple Paths, Complex Network).
4. Press **▶ Play** – watch Dijkstra’s algorithm step through the graph.
5. Use **⏸ Pause** to stop and inspect.  
   **↺ Reset** restarts the animation.
6. Adjust animation speed with the slider (100 ms = fast, 2000 ms = very slow).
7. Watch the right panel:
   - Nodes change colour (teal = finalised, orange = being processed).
   - Edges become blue when part of the shortest‑path tree.
   - Distance table updates every step.
   - Status message explains each decision (e.g., “Relaxed! Updated d(B) = 7, via A.”).

---

## Sample Input & Output

### Example 1 – Basic 5‑node graph

**Graph (edges with weights):**  
A‑B(4), A‑D(2), B‑C(5), B‑D(1), B‑E(6), C‑E(3), D‑E(8)  
Source = A

**Output after running Dijkstra:**  

| Node | Shortest distance from A | Path       |
|------|--------------------------|------------|
| A    | 0                        | –          |
| B    | 3                        | A → D → B  |
| C    | 8                        | A → B → C  |
| D    | 2                        | A → D      |
| E    | 8                        | A → B → E  |

---

## Algorithm Explanation

Dijkstra’s algorithm is a **greedy** algorithm that maintains a set of vertices whose shortest distance from the source is already known.

### Working Principle (as shown in the simulation)

1. **Initialisation** – distance to source = 0, all other nodes = ∞.
2. **Extract‑Min** – pick the unvisited node with the smallest distance.
3. **Relaxation** – for each neighbour, check if going through the current node gives a shorter path. If yes, update the distance and parent.
4. **Mark visited** – the extracted node is now final (its distance cannot be improved because all edge weights are non‑negative).
5. **Repeat** until all reachable nodes are visited.

### Pseudocode
DIJKSTRA(G, w, s):
for each vertex v in G.V:
v.d = ∞
v.parent = NIL
s.d = 0
Q = min-priority queue of all vertices keyed by .d
while Q ≠ ∅:
u = EXTRACT-MIN(Q)
for each vertex v in G.Adj[u]:
if v.d > u.d + w(u, v):
v.d = u.d + w(u, v)
v.parent = u
DECREASE-KEY(Q, v, v.d)

---

## Complexity Analysis

| Implementation          | Time Complexity       | Space Complexity |
|-------------------------|-----------------------|------------------|
| Standard (array)        | O(V²)                 | O(V + E)         |
| **Min‑heap (used here)** | **O((V + E) log V)**  | **O(V + E)**     |

---

## Applications

- **GPS navigation** – fastest route between two locations.
- **Network routing (OSPF)** – Internet routers build shortest‑path trees.
- **Robotics** – autonomous path planning in weighted grids.
- **Telecommunications** – minimise latency or bandwidth cost.
- **Social networks** – degrees of separation / influence propagation.

---

## Limitations & Future Enhancements

### Current Limitations
- Only three pre‑defined graphs (not user‑editable in the UI).
- Animation speed is per‑step, not continuous transition.
- Directed graphs not explicitly shown.

### Possible Improvements
- Add a graph editor (click to add nodes/edges, assign weights).
- Let the user choose the source node interactively.
- Support directed edges with arrowheads.
- Compare Dijkstra with A*.

---

## Project Structure
Dijkstra_Algorithm_Gayatri_D7B01/
├── dijkstra_virtual_lab.html # Main application (HTML/CSS/JS)
└── README.md # This files

---

## Author

**Gayatri** (D7B_01)  
Course – Design and Analysis of Algorithms (DAA)  
Date – April 2026

---

## License

This project is open‑source and can be freely used, modified, and distributed for educational purposes.