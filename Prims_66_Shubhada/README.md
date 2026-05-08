# Prim’s Algorithm Virtual Lab

A Java Swing-based interactive visual simulator for understanding and learning **Prim’s Algorithm** for generating a **Minimum Spanning Tree (MST)** in a weighted undirected graph.

---

# 📌 Overview

This project provides a graphical and animated implementation of **Prim’s Algorithm** using Java Swing. It allows users to:

- Create graphs dynamically
- Enter edge weights using an adjacency matrix
- Visualize MST construction step-by-step
- Run the algorithm automatically with animations
- Observe MST cost and selected edges in real time

The project is designed as a **Virtual Lab / Educational Tool** for students learning:

- Data Structures
- Graph Theory
- Minimum Spanning Trees
- Greedy Algorithms
- Java GUI Programming

---

# 🎯 Objectives

The main goals of this project are:

- To visually demonstrate Prim’s Algorithm
- To help students understand MST generation
- To provide an interactive learning environment
- To combine algorithm visualization with GUI development

---

# 🧠 What is Prim’s Algorithm?

Prim’s Algorithm is a **greedy algorithm** used to find the **Minimum Spanning Tree (MST)** of a weighted undirected graph.

A Minimum Spanning Tree:

- Connects all vertices
- Uses minimum total edge weight
- Contains no cycles
- Has exactly `V - 1` edges

---

# ⚙️ Features

## ✅ Graph Creation

- User can create graphs with:
  - Minimum: 2 nodes
  - Maximum: 12 nodes

---

## ✅ Adjacency Matrix Input

- Edge weights are entered through a matrix dialog
- `0` indicates:
  - No edge between nodes

---

## ✅ Step-by-Step Execution

- Runs one iteration at a time
- Helps understand:
  - Edge selection
  - Node inclusion
  - MST growth

---

## ✅ Auto Mode

- Automatically executes Prim’s Algorithm
- Uses Swing Timer for animation

---

## ✅ Real-Time Visualization

### Node Colors

| Color | Meaning |
|---|---|
| Green | Node included in MST |
| Orange | Candidate node |
| Gray | Unvisited node |

---

### Edge Colors

| Color | Meaning |
|---|---|
| Blue | Confirmed MST edge |
| Orange/Red | Current candidate edge |
| Light Gray | Normal graph edge |

---

## ✅ Statistics Panel

Displays:

- Total Nodes
- Graph Edges
- MST Edges
- MST Total Cost

---

## ✅ Algorithm Log

Shows:

- Selected edges
- Edge weights
- Running MST cost
- Completion messages
- Disconnected graph warnings

---

# 🖥️ Technologies Used

| Technology | Purpose |
|---|---|
| Java | Core programming language |
| Java Swing | GUI development |
| AWT | Graphics rendering |
| OOP Concepts | Project structure |
| Graph Algorithms | Prim’s Algorithm |

---

# 📂 Project Structure

```text
PrimsVirtualLab.java
│
├── GUI Components
│   ├── Toolbar
│   ├── Sidebar
│   ├── Graph Panel
│   └── Matrix Dialog
│
├── Algorithm Logic
│   ├── stepOnce()
│   ├── resetAlgo()
│   ├── startAuto()
│   └── stopAuto()
│
├── Visualization
│   ├── Node Rendering
│   ├── Edge Rendering
│   └── MST Highlighting
│
└── Main Method
```

---

# 🏗️ Working of the Application

## Step 1 — Create Graph

The user enters the number of nodes and clicks:

```text
Create Graph
```

---

## Step 2 — Enter Adjacency Matrix

The matrix dialog opens.

Example:

```text
    0  1  2  3
0   0  4  6  0
1   4  0  5  3
2   6  5  0  2
3   0  3  2  0
```

---

## Step 3 — Run Prim’s Algorithm

The user can choose:

### Step Mode
Runs one edge selection at a time.

### Auto Mode
Runs automatically every 900ms.

---

## Step 4 — Visualization

The application:

- Highlights candidate edge
- Adds selected edge to MST
- Updates MST cost
- Displays logs

---

# 🔄 Prim’s Algorithm Logic Used

## Algorithm Steps

1. Start from node `0`
2. Mark starting node as selected
3. Find the minimum-weight edge connecting:
   - selected node → unselected node
4. Add edge to MST
5. Repeat until:
   ```
   MST edges = V - 1
   ```

---

# 🧮 Time Complexity

## Prim’s Algorithm (Adjacency Matrix)

| Case | Complexity |
|---|---|
| Best Case | O(V²) |
| Average Case | O(V²) |
| Worst Case | O(V²) |

Where:

- `V` = Number of vertices

---

# 💾 Space Complexity

| Component | Complexity |
|---|---|
| Adjacency Matrix | O(V²) |
| Selected Array | O(V) |
| MST Edge List | O(V) |
| Total | O(V²) |

---

# 🎨 UI Design

## Theme

The application uses a modern light theme.

| Component | Color |
|---|---|
| Background | Off White |
| Sidebar | Light Gray |
| Accent | Steel Blue |
| MST Node | Green |
| Candidate Edge | Orange |
| MST Edge | Blue |

---

# 🖼️ Graph Rendering

Nodes are arranged in a circular layout using trigonometry:

```java
x = cx + r * cos(angle)
y = cy + r * sin(angle)
```

This ensures:

- Equal spacing
- Better readability
- Clean visualization

---

# 📋 Important Classes and Components

## Main Class

```java
public class PrimsVirtualLab extends JFrame
```

Responsible for:

- Window creation
- GUI management
- Algorithm control

---

## GraphPanel Class

```java
class GraphPanel extends JPanel
```

Handles:

- Node drawing
- Edge drawing
- MST visualization
- Candidate animation

---

# 🔑 Important Variables

| Variable | Purpose |
|---|---|
| `V` | Number of vertices |
| `graph[][]` | Adjacency matrix |
| `selected[]` | Tracks MST nodes |
| `mstEdges` | Stores MST edges |
| `totalCost` | MST total weight |
| `candidateEdge` | Current edge animation |

---

# ▶️ How to Run the Project

## Step 1 — Compile

```bash
javac PrimsVirtualLab.java
```

---

## Step 2 — Run

```bash
java PrimsVirtualLab
```

---

# ✅ Requirements

- Java JDK 8 or above
- Any Java IDE:
  - IntelliJ IDEA
  - Eclipse
  - NetBeans
  - VS Code

---

# 📖 Example Output

## Input Graph

```text
0--1 : 4
0--2 : 6
1--2 : 5
1--3 : 3
2--3 : 2
```

---

## MST Generated

```text
2--3 : 2
1--3 : 3
0--1 : 4
```

---

## Total MST Cost

```text
9
```

---

# 🚀 Learning Outcomes

After using this project, students can understand:

- Prim’s Algorithm
- Greedy strategy
- MST construction
- Graph representation
- Java Swing GUI programming
- Event-driven programming
- Graphics rendering in Java

---

# ⚠️ Limitations

- Supports only undirected graphs
- Maximum 12 nodes
- Uses adjacency matrix only
- No negative edge weights
- No drag-and-drop node movement

---


# 📚 Educational Use

This project is suitable for:

- College Mini Projects
- Data Structures Lab
- Algorithm Visualization
- Virtual Labs
- Academic Demonstrations
- Viva Preparation

---

