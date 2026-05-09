# 🧬 LCS Virtual Lab: Dynamic Programming Simulator

Welcome to the **Longest Common Subsequence (LCS) Virtual Lab**! This project is a state-of-the-art, interactive educational platform designed to demystify the LCS algorithm using Dynamic Programming.

Built with modern web technologies, this lab provides an IIT-level pedagogical experience, complete with step-by-step matrix visualization, comprehensive theory modules, and an interactive backtracking engine.

## ✨ Key Features

- **Interactive Matrix Generation:** Watch the DP table populate cell-by-cell. Real-time logical explanations (Action Cards) are provided for every calculation (Match vs. Mismatch).
- **Step-by-Step Backtracking:** Visualizes the path-finding process from the bottom-right corner to the top-left, extracting the final sequence dynamically.
- **Persistent Path Highlighting:** Traced paths are permanently highlighted in the matrix to give students a clear visual understanding of the optimal route.
- **Academic Theory Module:** A dedicated tab featuring the aim, theory, recurrence relations, and complexity analysis formatted beautifully for academic reference.
- **Responsive & Eye-Soothing UI:** Built with a "Cool Slate Blue" professional theme, utilizing a modular component architecture that adapts flawlessly to different screen sizes.

## 🛠️ Tech Stack

- **Frontend Framework:** React.js
- **Build Tool:** Vite
- **Styling:** Pure CSS (Flexbox, CSS Animations)
- **Architecture:** Modular Component-based Design

## 📂 Project Structure

```text
src/
├── App.jsx                 # Master Layout & Tab Routing
├── index.css               # Global CSS Reset & Theme Palette
└── components/
    ├── Sidebar.jsx         # Fixed Left Navigation Menu
    ├── TheoryTab.jsx       # Comprehensive Academic Notes & Formulas
    ├── SimulatorTab.jsx    # Main Container for the Interactive Lab
    ├── SimulatorInput.jsx  # Input Fields & Initialization Controls
    ├── SimulatorMatrix.jsx # Dynamic DP Table Rendering
    └── SimulatorLogs.jsx   # Scrollable Action Cards & Logic Logs
```

## 🚀 Installation & Setup

To run this Virtual Lab locally on your machine, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone [https://github.com/dheer-java/D7B_DAA_VirtualLab.git](https://github.com/dheer-java/D7B_DAA_VirtualLab.git)
   ```

2. **Navigate to the project directory:**

   ```bash
   cd D7B_DAA_VirtualLab
   ```

3. **Install the dependencies:**

   ```bash
   npm install
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` (or the URL provided in your terminal) to explore the lab!

## 🎓 Educational Value

This project was developed to assist computer science students in visualizing complex Dynamic Programming concepts. Instead of tracing matrices on paper or reading static console logs, users can interact with the algorithm, making the learning process intuitive and highly effective.

---

_Developed as a continuous assessment project that evolved into a departmental prototype for interactive learning._
