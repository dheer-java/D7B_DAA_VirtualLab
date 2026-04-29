# Kruskal's Algorithm Minimum Spanning Tree Visualizer

A Java Swing application that provides an interactive visualization of Kruskal's algorithm for finding the Minimum Spanning Tree (MST) in a graph. This tool is designed for educational purposes to help understand how Kruskal's algorithm works step-by-step.

## Features

- **Interactive Graph Visualization**: Visual representation of the graph with nodes placed in a circle and edges connecting them.
- **Step-by-Step Execution**: Detailed logging of each step in Kruskal's algorithm, including edge selection/rejection decisions.
- **Sorted Edge Display**: Shows all edges sorted in ascending order of their weights before algorithm execution.
- **Real-Time Animation**: Animated visualization of edge selection with a constant slow speed for better understanding.
- **User-Friendly Interface**: Simple input area for entering graph edges, run/reset buttons, and a log panel for algorithm output.
- **MST Highlighting**: Selected MST edges are highlighted in red on the graph.

## Requirements

- Java Development Kit (JDK) 8 or higher
- A Java IDE or command-line tools for compilation and execution

## Installation and Setup

1. **Clone or Download**: Ensure the `KruskalVisualizer.java` file is in your working directory.

2. **Compile the Program**:
   ```
   javac KruskalVisualizer.java
   ```

3. **Run the Application**:
   ```
   java KruskalVisualizer
   ```

   This will launch the GUI window.

## Usage

### Input Format
Enter the graph edges in the input text area using the format:
```
u v w
```
Where:
- `u` and `v` are the vertex indices (starting from 0)
- `w` is the edge weight (integer)

Example input:
```
0 1 10
0 2 6
0 3 5
1 3 15
2 3 4
```

### Controls
- **Run Kruskal**: Parses the input, sorts the edges, and starts the animated algorithm execution.
- **Reset**: Clears the MST selection and log, allowing you to run the algorithm again.

### Visualization
- **Graph Panel**: Displays the graph with blue nodes and gray edges initially.
- **Log Panel**: Shows:
  - Sorted list of all edges
  - Step-by-step algorithm execution with decisions
  - Final MST cost

During animation:
- Edges are checked one by one in weight order
- Selected edges turn red
- The log updates with each decision

## Algorithm Overview

Kruskal's algorithm works by:
1. Sorting all edges in ascending order of weight
2. Iteratively adding the smallest edge that doesn't form a cycle
3. Using Union-Find (Disjoint Set Union) with path compression and union by rank for cycle detection

## Code Structure

- `KruskalVisualizer`: Main class extending JFrame, handles UI and algorithm execution
- `Edge`: Inner class representing graph edges with source, destination, weight, and selection status
- `GraphPanel`: Inner class for custom graph drawing using Java 2D
- Union-Find operations: `find()` and `union()` methods with optimizations

## Educational Value

This visualizer helps students and learners:
- Understand the greedy nature of Kruskal's algorithm
- See how edge sorting affects the process
- Visualize cycle detection in real-time
- Comprehend MST properties and construction

## Limitations

- Supports undirected graphs only
- Vertex indices must be consecutive starting from 0
- No support for disconnected graphs (will show forest if applicable)
- Fixed animation speed (constant slow)

## Future Enhancements

Potential improvements could include:
- Variable animation speed control
- Support for directed graphs
- Graph file import/export
- Multiple algorithm comparisons
- Performance metrics display

## License

This project is open-source and available under the MIT License. Feel free to use, modify, and distribute.

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests to improve the visualizer.</content>
<parameter name="filePath">README.md