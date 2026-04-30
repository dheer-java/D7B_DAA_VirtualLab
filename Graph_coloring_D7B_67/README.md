# Graph Coloring Visualizer (A Java Swing Project)

---

## **Overview**

> *“Graph Coloring is a classic problem in computer science that demonstrates how constraints can be satisfied using systematic search techniques.”*

This project presents an interactive **Graph Coloring Visualizer** developed using **Java Swing**, where users can construct a graph and observe how colors are assigned to vertices such that no two adjacent vertices share the same color.

The application is designed not just to solve the problem, but to **visually demonstrate the working of the Backtracking Algorithm**, making it easier to understand both theoretically and practically.

---

## **Key Features**

> *“Visualization transforms abstract algorithms into intuitive understanding.”*

* **Dynamic Node Creation**
  Users can add vertices interactively, allowing flexible graph construction.

* **Custom Edge Formation**
  Edges can be created between any two nodes, enabling testing of different graph structures.

* **Color Assignment using Backtracking**
  The system automatically assigns colors based on constraints and available color count.

* **Real-Time Graph Rendering**
  The graph updates instantly whenever nodes, edges, or colors change.

* **Conflict Detection**
  If coloring is not possible with the given number of colors, the system clearly indicates failure.

* **User-Friendly GUI**
  Built using Java Swing, providing a simple and interactive interface.

---

## **Algorithm Explanation**

> *“Backtracking is a problem-solving approach that builds solutions incrementally and abandons them when they fail to satisfy constraints.”*

This project uses the **Backtracking Algorithm** to solve the Graph Coloring Problem.

### **Working Principle**

* The algorithm starts from the first vertex and assigns a color.
* It checks whether the color assignment is valid using a safety condition.
* If valid, it moves to the next vertex.
* If a conflict occurs (same color assigned to adjacent vertices), the algorithm **backtracks** and tries another color.
* This process continues until either:

  * A valid coloring is found
  * Or all possibilities are exhausted

> *“The algorithm ensures correctness by exploring all feasible combinations while eliminating invalid ones early.”*

---

## **Technologies Used**

> *“A strong combination of logic and interface enhances both learning and usability.”*

* **Java** – Core programming language
* **Java Swing** – GUI development
* **AWT (Abstract Window Toolkit)** – Graphics and rendering
* **Data Structures** – Arrays and ArrayList for managing graph data

---

## **Project Structure**

```
GraphColoringUI.java   → Contains complete implementation (UI + Logic)
```

> *“The project follows a single-file structure for simplicity and ease of execution.”*

---

## **How to Run the Project**

> *“Execution simplicity ensures accessibility for all users.”*

### **Step 1: Compile the Program**

```bash
javac GraphColoringUI.java
```

### **Step 2: Run the Program**

```bash
java GraphColoringUI
```

---

## **How to Use the Application**

> *“The system is designed to be intuitive and interactive.”*

1. Click **“Add Node”** to create vertices
2. Click **“Add Edge”** and enter node indices
3. Enter the number of colors in the input field
4. Click **“Color Graph”** to execute the algorithm
5. Observe the colored graph output

---

## **Input Constraints**

> *“Defined limits ensure controlled and efficient execution.”*

* Maximum number of nodes supported: **20**
* Node indexing starts from **0**
* Graph is considered **undirected**
* User must add nodes before creating edges

---

## **Sample Input and Output**

> *“Example-based understanding strengthens conceptual clarity.”*

### **Input**

* Nodes: 6
* Edges:
  0–1, 0–2, 1–2, 1–3, 2–4, 3–4, 3–5, 4–5
* Number of Colors: 3

### **Output**

* Graph is successfully colored with no adjacent nodes sharing the same color
* If constraints fail → system displays **“No Solution”**

---

## **Complexity Analysis**

> *“Efficiency analysis helps understand the limitations of an algorithm.”*

* **Time Complexity:** O(M^V)
* **Space Complexity:** O(V²)

Where:

* *V* = Number of vertices
* *M* = Number of colors

> *“The exponential time complexity reflects the combinatorial nature of the problem.”*

---

## **Concepts Covered**

> *“This project bridges theory with implementation.”*

* Graph Theory
* Backtracking Algorithm
* Constraint Satisfaction Problems
* Recursion
* GUI Programming
* Event-Driven Programming

---

##  **Applications**

> *“Graph Coloring is widely used in real-world problem solving.”*

* **Scheduling Problems** (exam timetables, task allocation)
* **Register Allocation** in compilers
* **Frequency Assignment** in mobile networks
* **Map Coloring Problems**
* **Puzzle Solving**

---

## **Conclusion**

> *“Understanding complex problems becomes easier through visualization and interaction.”*

This project successfully demonstrates how the **Graph Coloring Problem** can be solved using the **Backtracking Algorithm** and visualized through a graphical interface. It highlights the importance of constraint satisfaction and shows how recursive techniques can systematically explore possible solutions.

The integration of **algorithm + visualization** makes the learning process more intuitive, engaging, and effective.

