# String Matching Algorithm Visualizer

A Java Swing based desktop application that provides an interactive visualization of popular string matching algorithms. This project is designed for educational purposes to help students understand how pattern searching algorithms work step-by-step using animations, color highlights, and graphical panels.

---

## 📌 Project Overview

String matching is an important topic in Design and Analysis of Algorithms (DAA). This visualizer demonstrates how different algorithms search for a pattern inside a given text.

The application allows users to enter custom text and pattern values, select an algorithm, control animation speed, and observe each comparison visually.

---

## ✨ Features

### 🎯 Interactive GUI
- Built using Java Swing
- Clean and structured desktop interface
- Fixed-size application window for better layout

### 🔍 Supported Algorithms
- Naive String Matching Algorithm
- Knuth-Morris-Pratt (KMP) Algorithm
- Rabin-Karp Algorithm

### 🎬 Step-by-Step Visualization
Each character comparison is shown visually using colored cells.

Color Meaning:

- 🔵 Blue → Current comparison
- 🟢 Green → Match found
- 🔴 Red → Mismatch
- 🟠 Orange → Full pattern match

### ⚙️ User Controls
- Start Visualization
- Pause Animation
- Reset Execution
- Select Algorithm from Dropdown
- Speed Control Slider

### 📊 Extra Panels
- Information Panel for algorithm details
- LPS Array Panel for KMP algorithm
- Visualization Canvas for text-pattern matching animation

---

## 🧠 Algorithms Included

### 1. Naive String Matching
Checks the pattern at every possible position one by one.

**Time Complexity:** O(n × m)

### 2. KMP Algorithm
Uses LPS (Longest Prefix Suffix) array to skip unnecessary comparisons.

**Time Complexity:** O(n + m)

### 3. Rabin-Karp Algorithm
Uses hashing technique for efficient pattern searching.

**Average Time Complexity:** O(n + m)

---

## 🖥️ User Interface Structure

### MainFrame.java
Creates the main application window.

### MainPanel.java
Combines all sub-panels together.

### InputPanel.java
Contains:
- Text input field
- Pattern input field
- Algorithm selector
- Speed slider
- Start / Pause / Reset buttons

### VisualizationPanel.java
Main animation panel that draws text and pattern comparisons using Graphics2D.

### InfoPanel.java
Displays live algorithm information.

### LPSPanel.java
Displays prefix table for KMP algorithm.

---

## 📁 Project Structure

```text
src/
 ├── algorithms/
 │   ├── NaiveAlgorithm.java
 │   ├── KMPAlgorithm.java
 │   ├── RabinKarpAlgorithm.java
 │   └── AlgorithmStep.java
 │
 ├── ui/
 │   ├── MainFrame.java
 │   ├── MainPanel.java
 │   ├── InputPanel.java
 │   ├── VisualizationPanel.java
 │   ├── InfoPanel.java
 │   └── LPSPanel.java
 │
 └── main/
     └── Main.java
