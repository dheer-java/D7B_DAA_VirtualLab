import java.awt.*;                 // Provides classes for GUI components (Color, Font, Graphics, etc.)
import java.util.ArrayList;          // Provides event-handling classes (ActionListener, MouseEvent, etc.)
import javax.swing.*;       // Provides resizable-array implementation of List interface
import javax.swing.border.*;             // Provides lightweight GUI components (JFrame, JPanel, JButton, etc.)

/*
 * =========================================================
 * PRIM'S ALGORITHM VIRTUAL LAB
 * =========================================================
 * This application is a visual simulator for Prim's Algorithm.
 *
 * WHAT IS PRIM'S ALGORITHM?
 * --------------------------
 * Prim's Algorithm is a greedy algorithm that finds the
 * Minimum Spanning Tree (MST) of a weighted undirected graph.
 * An MST connects all vertices with the minimum possible total
 * edge weight, without forming any cycle.
 *
 * HOW THIS PROGRAM WORKS:
 * ------------------------
 * 1. User specifies the number of nodes (vertices) to create.
 * 2. User enters edge weights via an adjacency matrix dialog.
 *    - matrix[i][j] = weight of edge between node i and node j
 *    - 0 means no edge exists between those nodes
 * 3. The user can run the algorithm:
 *    - Step-by-step: one edge added per click
 *    - Auto mode: edges added automatically every 900ms
 * 4. The graph panel visually highlights:
 *    - Nodes already in MST (green filled)
 *    - Current candidate edge being considered (orange)
 *    - Final MST edges (blue lines)
 *    - Non-MST edges (light gray lines)
 * 5. Right sidebar displays:
 *    - Node count, edge count, MST cost
 *    - Step-by-step log messages
 *
 * UI THEME: LIGHT
 * ----------------
 * Background: White / Light Gray
 * Primary Accent: Steel Blue (#2E86C1)
 * MST nodes: Light Green (#27AE60)
 * Candidate edge: Orange (#E67E22)
 * MST edges: Blue (#2980B9)
 */

public class PrimsVirtualLab extends JFrame {

    // =========================================================
    // ALGORITHM STATE VARIABLES
    // =========================================================

    /**
     * V — Total number of vertices (nodes) in the graph.
     * Set when user creates a new graph. Default is 0 (no graph yet).
     */
    private int V = 0;

    /**
     * graph[][] — Adjacency matrix representing edge weights.
     * graph[i][j] > 0 means there is an edge from node i to node j
     * with that weight. graph[i][j] == 0 means no edge.
     * This is a symmetric matrix (undirected graph): graph[i][j] == graph[j][i]
     */
    private int[][] graph;

    /**
     * selected[] — Boolean array tracking which nodes are part of the MST.
     * selected[i] = true  → node i has been added to the MST
     * selected[i] = false → node i is not yet in the MST
     * Initially, only node 0 is selected (starting point of Prim's).
     */
    private boolean[] selected;

    /**
     * mstEdges — List of edges included in the Minimum Spanning Tree so far.
     * Each entry is an int[] of length 2: {sourceNode, destinationNode}.
     * When mstEdges.size() == V - 1, the MST is complete.
     */
    private ArrayList<int[]> mstEdges = new ArrayList<>();

    /**
     * totalCost — Accumulated sum of all MST edge weights.
     * Updated each time a new edge is added to the MST.
     */
    private int totalCost = 0;

    /**
     * candidateEdge — The edge currently being "considered" for inclusion.
     * Used only for visual animation: the edge is shown in orange briefly
     * before being confirmed and added to the MST.
     * Format: int[]{sourceNode, destinationNode}, or null if no candidate.
     */
    private int[] candidateEdge = null;

    /**
     * algoReady — Flag indicating whether the algorithm has been initialized.
     * false = algorithm hasn't started yet (no starting node selected)
     * true  = algorithm is running (node 0 selected, ready to step)
     */
    private boolean algoReady = false;


    // =========================================================
    // UI COMPONENT REFERENCES
    // =========================================================

    /**
     * graphPanel — The central drawing panel where nodes and edges are rendered.
     * Extends JPanel and uses custom paintComponent() to draw the graph.
     */
    private GraphPanel graphPanel;

    /**
     * logArea — A scrollable text area on the right sidebar.
     * Displays step-by-step messages describing algorithm progress,
     * such as which edge was selected and what the running cost is.
     */
    private JTextArea logArea;

    // Control buttons in the top toolbar:
    private JButton stepBtn;    // Advances the algorithm by one step
    private JButton autoBtn;    // Starts automatic step-by-step execution
    private JButton stopBtn;    // Stops automatic execution
    private JButton resetBtn;   // Resets the algorithm (keeps the graph)
    private JButton matrixBtn;  // Opens the edge weight input dialog

    // Stat labels shown in the right sidebar:
    private JLabel statNodes;   // Shows total number of nodes
    private JLabel statEdges;   // Shows number of MST edges added so far
    private JLabel statCost;    // Shows current MST total cost
    private JLabel statGEdges;  // Shows total number of graph edges (non-zero entries)

    /**
     * autoTimer — A Swing Timer that fires every 900 milliseconds.
     * When running in auto mode, it repeatedly calls runAutoStep()
     * to advance Prim's algorithm without user clicking.
     */
    private javax.swing.Timer autoTimer;


    // =========================================================
    // LIGHT THEME COLOR PALETTE
    // =========================================================

    // Main background for window and panels
    private static final Color BG_MAIN       = new Color(245, 247, 250); // Soft off-white

    // Background for the graph drawing area
    private static final Color BG_GRAPH      = new Color(255, 255, 255); // Pure white canvas

    // Background for sidebar (stats + log)
    private static final Color BG_SIDEBAR    = new Color(235, 240, 245); // Light steel gray

    // Primary accent color (buttons, borders, highlights)
    private static final Color ACCENT        = new Color(46, 134, 193);  // Steel blue

    // Button hover / secondary shade
    private static final Color ACCENT_DARK   = new Color(21, 101, 157);  // Darker blue

    // Color for nodes already added to the MST
    private static final Color NODE_MST      = new Color(39, 174, 96);   // Green

    // Color for nodes not yet in the MST
    private static final Color NODE_DEFAULT  = new Color(189, 195, 199); // Light gray

    // Color for the node currently being highlighted/selected
    private static final Color NODE_SELECT   = new Color(230, 126, 34);  // Orange

    // Color for MST edges (final confirmed edges)
    private static final Color EDGE_MST      = new Color(41, 128, 185);  // Blue

    // Color for candidate edge (being animated before confirmed)
    private static final Color EDGE_CAND     = new Color(231, 76, 60);   // Red-orange

    // Color for regular graph edges (not in MST)
    private static final Color EDGE_DEFAULT  = new Color(189, 195, 199); // Very light gray

    // Text color for node labels
    private static final Color TEXT_NODE     = Color.WHITE;

    // Text color for edge weight labels
    private static final Color TEXT_WEIGHT   = new Color(44, 62, 80);    // Dark charcoal

    // General text/label color used in sidebar
    private static final Color TEXT_MAIN     = new Color(44, 62, 80);    // Dark charcoal


    // =========================================================
    // CONSTRUCTOR — BUILDS AND SHOWS THE MAIN WINDOW
    // =========================================================

    public PrimsVirtualLab() {

        // ---- Window Setup ----
        setTitle("Prim's Algorithm Virtual Lab");  // Window title bar text
        setSize(1050, 680);                         // Initial window dimensions (width x height)
        setDefaultCloseOperation(EXIT_ON_CLOSE);    // Terminate JVM when window is closed

        // ---- Root Container ----
        // BorderLayout divides window into 5 zones: NORTH, SOUTH, EAST, WEST, CENTER
        // Here we use NORTH (toolbar), CENTER (graph), EAST (sidebar)
        JPanel root = new JPanel(new BorderLayout(8, 8)); // 8px horizontal & vertical gap
        root.setBackground(BG_MAIN);
        root.setBorder(new EmptyBorder(10, 10, 10, 10)); // 10px padding on all sides
        setContentPane(root); // Replace default content pane with our custom root

        // ---- Top Toolbar ----
        // buildTopBar() creates a panel with input field and action buttons
        root.add(buildTopBar(), BorderLayout.NORTH);

        // ---- Graph Canvas (CENTER) ----
        // GraphPanel is our custom drawing canvas defined below
        graphPanel = new GraphPanel();
        root.add(graphPanel, BorderLayout.CENTER);

        // ---- Right Sidebar ----
        // buildSidebar() creates stat labels and the log area
        root.add(buildSidebar(), BorderLayout.EAST);

        // ---- Auto-Execution Timer ----
        // This timer fires every 900ms and calls runAutoStep()
        // It is only started when user clicks "Auto" button
        // setRepeats(true) by default means it keeps firing until stopped
        autoTimer = new javax.swing.Timer(900, e -> runAutoStep());

        // ---- Show Window ----
        setVisible(true);
    }


    // =========================================================
    // TOP TOOLBAR BUILDER
    // =========================================================

    private JPanel buildTopBar() {

        // FlowLayout aligns components left-to-right with 6px gaps
        JPanel bar = new JPanel(new FlowLayout(FlowLayout.LEFT, 6, 4));
        bar.setBackground(BG_MAIN);

        // ---- Node Count Input ----
        JLabel lbl = new JLabel("Nodes:");
        lbl.setForeground(TEXT_MAIN);
        lbl.setFont(new Font("Segoe UI", Font.BOLD, 13));

        // Text field where user types number of nodes (e.g., "5")
        JTextField nodeField = new JTextField("5", 4);
        nodeField.setFont(new Font("Segoe UI", Font.PLAIN, 13));

        // ---- Create Graph Button ----
        // Reads value from nodeField and calls initGraph(n)
        JButton createBtn = makeBtn("Create Graph", ACCENT);
        createBtn.addActionListener(e -> {
            try {
                int n = Integer.parseInt(nodeField.getText().trim()); // Parse node count
                if (n < 2 || n > 12) {                               // Validate range
                    JOptionPane.showMessageDialog(this,
                        "Please enter between 2 and 12 nodes.");
                    return;
                }
                initGraph(n); // Initialize graph with n nodes
            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(this, "Enter a valid integer.");
            }
        });

        // ---- Matrix Input Button ----
        // Re-opens edge weight matrix dialog (only if a graph exists)
        matrixBtn = makeBtn("Matrix", new Color(108, 117, 125));
        matrixBtn.addActionListener(e -> {
            if (V > 0) openMatrixDialog(); // Only open if graph is initialized
        });

        // ---- Step Button ----
        // Runs one iteration of Prim's algorithm
        stepBtn = makeBtn("Step", new Color(39, 174, 96)); // Green
        stepBtn.addActionListener(e -> stepOnce());
        stepBtn.setEnabled(false); // Disabled until matrix is set

        // ---- Auto Button ----
        // Starts automatic execution (timer-based)
        autoBtn = makeBtn("Auto", new Color(52, 152, 219)); // Blue
        autoBtn.addActionListener(e -> startAuto());
        autoBtn.setEnabled(false); // Disabled until matrix is set

        // ---- Stop Button ----
        // Stops automatic execution; initially hidden
        stopBtn = makeBtn("Stop", new Color(231, 76, 60)); // Red
        stopBtn.addActionListener(e -> stopAuto());
        stopBtn.setVisible(false); // Only shown when auto mode is active

        // ---- Reset Button ----
        // Resets algorithm state but keeps current graph/matrix
        resetBtn = makeBtn("Reset", new Color(230, 126, 34)); // Orange
        resetBtn.addActionListener(e -> {
            logArea.setText(""); // Clear log messages
            resetAlgo();         // Re-initialize algorithm from node 0
        });

        // ---- Add All Components to Toolbar ----
        bar.add(lbl);
        bar.add(nodeField);
        bar.add(createBtn);
        bar.add(matrixBtn);
        bar.add(Box.createHorizontalStrut(12)); // Spacer
        bar.add(stepBtn);
        bar.add(autoBtn);
        bar.add(stopBtn);
        bar.add(Box.createHorizontalStrut(12)); // Spacer
        bar.add(resetBtn);

        return bar;
    }


    // =========================================================
    // RIGHT SIDEBAR BUILDER
    // =========================================================

    /**
     * buildSidebar() — Constructs the right-side panel.
     *
     * Contains two sections:
     * 1. STATS PANEL — Shows current graph statistics (node/edge counts, cost)
     * 2. LOG PANEL   — Shows scrollable text log of algorithm steps
     *
     * @return JPanel containing stats and log components
     */
    private JPanel buildSidebar() {

        // Vertical box layout stacks components top-to-bottom
        JPanel side = new JPanel();
        side.setLayout(new BoxLayout(side, BoxLayout.Y_AXIS));
        side.setBackground(BG_SIDEBAR);
        side.setBorder(new EmptyBorder(4, 8, 4, 4));
        side.setPreferredSize(new Dimension(210, 0)); // Fixed width of 210px

        // ---- Statistics Section Header ----
        JLabel statsTitle = new JLabel("Statistics");
        statsTitle.setFont(new Font("Segoe UI", Font.BOLD, 14));
        statsTitle.setForeground(ACCENT);
        side.add(statsTitle);
        side.add(Box.createVerticalStrut(6)); // Vertical spacer

        // ---- Individual Stat Labels ----
        // These are updated by updateStats() whenever the algorithm advances

        statNodes  = makeStatLabel("Nodes: 0");     // Total nodes in graph
        statGEdges = makeStatLabel("Graph Edges: 0"); // Total graph edges
        statEdges  = makeStatLabel("MST Edges: 0");  // Edges added to MST so far
        statCost   = makeStatLabel("MST Cost: 0");   // Running total cost

        side.add(statNodes);
        side.add(statGEdges);
        side.add(statEdges);
        side.add(statCost);
        side.add(Box.createVerticalStrut(14)); // Spacer between stats and log

        // ---- Log Section Header ----
        JLabel logTitle = new JLabel("Algorithm Log");
        logTitle.setFont(new Font("Segoe UI", Font.BOLD, 14));
        logTitle.setForeground(ACCENT);
        side.add(logTitle);
        side.add(Box.createVerticalStrut(4));

        // ---- Log Text Area ----
        // Non-editable, auto-scrolling area for log messages
        logArea = new JTextArea();
        logArea.setEditable(false);         // Read-only
        logArea.setLineWrap(true);          // Wrap long lines
        logArea.setWrapStyleWord(true);     // Wrap at word boundaries
        logArea.setFont(new Font("Consolas", Font.PLAIN, 11)); // Monospaced for readability
        logArea.setBackground(Color.WHITE);
        logArea.setForeground(TEXT_MAIN);
        logArea.setBorder(new EmptyBorder(4, 4, 4, 4));

        // Wrap log area in a scroll pane so it scrolls vertically
        JScrollPane scroll = new JScrollPane(logArea);
        scroll.setPreferredSize(new Dimension(190, 380));
        scroll.setBorder(new LineBorder(new Color(200, 210, 220), 1)); // Light border
        side.add(scroll);

        return side;
    }


    private JButton makeBtn(String text, Color bg) {
        JButton btn = new JButton(text);
        btn.setBackground(bg);
        btn.setForeground(Color.WHITE);           // White text on colored background
        btn.setFont(new Font("Segoe UI", Font.BOLD, 12));
        btn.setFocusPainted(false);               // Remove focus ring
        btn.setBorder(new EmptyBorder(5, 12, 5, 12)); // Padding inside button
        btn.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR)); // Pointer cursor on hover
        return btn;
    }


    // =========================================================
    // HELPER: CREATE STYLED STAT LABEL
    // =========================================================

    /**
     * makeStatLabel() — Creates a JLabel styled for stat display in the sidebar.
     *
     * @param text  Initial text to display
     * @return      A styled JLabel with consistent font and color
     */
    private JLabel makeStatLabel(String text) {
        JLabel lbl = new JLabel(text);
        lbl.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        lbl.setForeground(TEXT_MAIN);
        lbl.setBorder(new EmptyBorder(2, 0, 2, 0)); // Small top/bottom padding
        return lbl;
    }


    // =========================================================
    // GRAPH INITIALIZATION
    // =========================================================

    /**
     * initGraph() — Initializes a fresh graph with n nodes.
     *
     * Steps performed:
     * 1. Stops any running auto-timer
     * 2. Resets all algorithm variables
     * 3. Creates a new V×V adjacency matrix (all zeros)
     * 4. Places nodes in a circular layout on the graph panel
     * 5. Opens the edge-weight input dialog
     *
     * @param n  Number of nodes (vertices) to create (2 ≤ n ≤ 12)
     */
    private void initGraph(int n) {

        stopAuto(); // Stop any currently running auto-execution

        V = n; // Store node count globally

        // Create fresh adjacency matrix — all values default to 0 (no edges)
        graph = new int[V][V];

        // Create fresh selected array — all nodes start as unselected
        selected = new boolean[V];

        // Clear any leftover MST data from previous runs
        mstEdges.clear();
        totalCost = 0;
        candidateEdge = null;
        algoReady = false; // Mark algorithm as not yet started

        graphPanel.placeNodesCircle(V);
        graphPanel.repaint(); // Redraw the panel with new nodes

        updateStats(); // Refresh sidebar statistics

        log("Graph created with " + V + " nodes. Enter edge weights using matrix.");

        // Disable Step and Auto buttons — user must fill matrix first
        stepBtn.setEnabled(false);
        autoBtn.setEnabled(false);

        // Open the matrix input dialog for edge weights
        openMatrixDialog();
    }


    private void openMatrixDialog() {

        // Modal dialog — blocks interaction with main window until closed
        JDialog dlg = new JDialog(this, "Enter Adjacency Matrix (0 = no edge)", true);
        dlg.setLayout(new BorderLayout(8, 8));
        dlg.getContentPane().setBackground(BG_MAIN);

        // ---- Header Label ----
        JLabel header = new JLabel(
            "Enter edge weights. Use 0 for no connection.",
            SwingConstants.CENTER
        );
        header.setFont(new Font("Segoe UI", Font.ITALIC, 12));
        header.setForeground(new Color(100, 110, 120));
        header.setBorder(new EmptyBorder(8, 4, 4, 4));
        dlg.add(header, BorderLayout.NORTH);

        // ---- Grid of Text Fields ----
        // GridLayout creates a perfect V×V table
        JPanel grid = new JPanel(new GridLayout(V + 1, V + 1, 3, 3));
        grid.setBackground(BG_MAIN);
        grid.setBorder(new EmptyBorder(4, 8, 4, 8));

        JTextField[][] cells = new JTextField[V][V]; // 2D array to hold cell references

        // ---- Header Row (column labels: blank, 0, 1, 2, ...) ----
        grid.add(new JLabel()); // Top-left corner cell is empty
        for (int j = 0; j < V; j++) {
            JLabel colLbl = new JLabel(String.valueOf(j), SwingConstants.CENTER);
            colLbl.setFont(new Font("Segoe UI", Font.BOLD, 12));
            colLbl.setForeground(ACCENT);
            grid.add(colLbl);
        }

        // ---- Data Rows (row label + input cells) ----
        for (int i = 0; i < V; i++) {

            // Row label (node index)
            JLabel rowLbl = new JLabel(String.valueOf(i), SwingConstants.CENTER);
            rowLbl.setFont(new Font("Segoe UI", Font.BOLD, 12));
            rowLbl.setForeground(ACCENT);
            grid.add(rowLbl);

            // Input cells for each column in this row
            for (int j = 0; j < V; j++) {

                cells[i][j] = new JTextField(
                    String.valueOf(graph[i][j]), // Pre-fill with existing value
                    3
                );
                cells[i][j].setHorizontalAlignment(JTextField.CENTER);
                cells[i][j].setFont(new Font("Consolas", Font.PLAIN, 12));
                cells[i][j].setBackground(Color.WHITE);
                cells[i][j].setForeground(TEXT_MAIN);

                // Diagonal cells (self-loops) are disabled — a node can't connect to itself
                if (i == j) {
                    cells[i][j].setEditable(false);
                    cells[i][j].setBackground(new Color(230, 230, 230)); // Gray out diagonal
                }

                grid.add(cells[i][j]);
            }
        }

        dlg.add(grid, BorderLayout.CENTER);

        // ---- OK Button ----
        JButton ok = makeBtn("OK", ACCENT);
        ok.addActionListener(e -> {

            // Read and validate all input values
            for (int i = 0; i < V; i++) {
                for (int j = 0; j < V; j++) {
                    if (i == j) continue; // Skip diagonal (always 0)
                    try {
                        int val = Integer.parseInt(cells[i][j].getText().trim());
                        if (val < 0) throw new NumberFormatException(); // Negative weights invalid
                        graph[i][j] = val; // Store valid weight
                    } catch (NumberFormatException ex) {
                        JOptionPane.showMessageDialog(dlg,
                            "Invalid input at cell [" + i + "][" + j + "]. Enter 0 or positive integer.");
                        return; // Stop processing if any cell is invalid
                    }
                }
            }

            // ---- Enforce Symmetry ----
            // Prim's works on undirected graphs.
            // If user enters weight for (i,j) but not (j,i), we auto-fill (j,i).
            // If both are entered, we take the minimum to avoid inconsistency.
            for (int i = 0; i < V; i++) {
                for (int j = i + 1; j < V; j++) {
                    int w = Math.max(graph[i][j], graph[j][i]); // Take max if both filled
                    // Actually use the higher entered value for fairness
                    if (graph[i][j] != graph[j][i]) {
                        w = Math.max(graph[i][j], graph[j][i]);
                        graph[i][j] = w;
                        graph[j][i] = w;
                    }
                }
            }

            // Matrix accepted — enable execution controls
            stepBtn.setEnabled(true);
            autoBtn.setEnabled(true);

            log("Matrix accepted. Click Step or Auto to run Prim's algorithm.");
            updateStats();        // Refresh edge count in sidebar
            graphPanel.repaint(); // Redraw graph with new edges
            dlg.dispose();        // Close the dialog
        });

        // Bottom panel for the OK button
        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.CENTER));
        btnPanel.setBackground(BG_MAIN);
        btnPanel.add(ok);
        dlg.add(btnPanel, BorderLayout.SOUTH);

        dlg.pack();                        // Size dialog to fit contents
        dlg.setLocationRelativeTo(this);   // Center relative to main window
        dlg.setVisible(true);              // Show dialog (blocks until closed)
    }


    // =========================================================
    // PRIM'S ALGORITHM — SINGLE STEP
    // =========================================================

    /**
     * stepOnce() — Executes one iteration of Prim's algorithm.
     *
     * ALGORITHM LOGIC:
     * ----------------
     * At each step, Prim's algorithm:
     * 1. Looks at all edges that connect a selected node (in MST)
     *    to an unselected node (not yet in MST).
     * 2. Among all such edges, picks the one with the MINIMUM weight.
     * 3. Adds the destination node and that edge to the MST.
     * 4. Repeats until V-1 edges have been added (MST complete).
     *
     * ANIMATION:
     * ----------
     * Before confirming the edge, it is shown in orange (candidateEdge)
     * for 350ms, then confirmed and turned blue (MST edge).
     */
    private void stepOnce() {

        // ---- Initialize if First Step ----
        // On first call, resetAlgo() selects node 0 as the starting node
        if (!algoReady) {
            resetAlgo();
        }

        // ---- Check if MST is Already Complete ----
        // An MST of V nodes has exactly V-1 edges
        if (mstEdges.size() == V - 1) {
            log("MST complete! Total cost = " + totalCost);
            stopAuto(); // Stop auto timer if running
            return;
        }

        // ---- Find Minimum Weight Edge (Prim's Core) ----
        int min = Integer.MAX_VALUE; // Track minimum weight found so far
        int x = -1, y = -1;         // Track source and destination of minimum edge

        for (int i = 0; i < V; i++) {

            // Only consider nodes already in the MST
            if (!selected[i]) continue;

            for (int j = 0; j < V; j++) {

                /*
                 * An edge (i → j) is a valid candidate if ALL of:
                 *   1. j is not yet selected (not in MST)
                 *   2. graph[i][j] > 0 (edge exists; 0 = no edge)
                 *   3. graph[i][j] < min (it's cheaper than current best)
                 */
                if (!selected[j] && graph[i][j] > 0 && graph[i][j] < min) {
                    min = graph[i][j];
                    x = i; // Remember source node
                    y = j; // Remember destination node
                }
            }
        }

        // ---- Handle Disconnected Graph ----
        // If no valid edge found, graph has isolated components — MST not possible
        if (x == -1) {
            log("Graph appears disconnected. Cannot complete MST.");
            stopAuto();
            return;
        }

        // ---- Show Candidate Edge Animation (orange flash) ----
        // Store the selected edge temporarily as candidateEdge
        // GraphPanel will draw this in orange color
        candidateEdge = new int[]{x, y};
        graphPanel.repaint(); // Trigger redraw to show orange edge

        /*
         * WHY final copies?
         * -----------------
         * Java lambdas (and anonymous classes) can only capture local variables
         * that are "effectively final" — i.e., never reassigned after declaration.
         * x, y, and min were mutated inside the for-loops above, so the compiler
         * rejects them inside the lambda. We copy their final values here so the
         * lambda can safely close over them.
         */
        final int fx = x;     // Final copy of source node index
        final int fy = y;     // Final copy of destination node index
        final int fmin = min; // Final copy of the minimum edge weight

        // ---- Confirm Edge After 350ms Delay ----
        // A one-shot timer fires after 350ms to confirm the edge into MST
        new javax.swing.Timer(350, e -> {

            selected[fy] = true;                // Mark destination node as selected
            mstEdges.add(new int[]{fx, fy});    // Add edge to MST edge list
            totalCost += fmin;                  // Add edge weight to total MST cost
            candidateEdge = null;               // Remove orange highlight

            log("Edge [" + fx + " - " + fy + "] | Weight: " + fmin +
                " | MST Cost so far: " + totalCost);

            updateStats();        // Refresh sidebar statistics
            graphPanel.repaint(); // Redraw with updated MST

        }) {{ setRepeats(false); }}.start();
        // setRepeats(false) ensures this timer fires ONLY ONCE, not repeatedly
    }


    // =========================================================
    // ALGORITHM RESET
    // =========================================================

    /**
     * resetAlgo() — Resets the algorithm to its initial state.
     *
     * Does NOT change the graph structure or edge weights.
     * Only resets: selected[], mstEdges, totalCost, candidateEdge.
     * After reset, node 0 is selected again as the starting point.
     *
     * Called:
     * - When user clicks "Reset" button
     * - At the start of the first stepOnce() call
     */
    private void resetAlgo() {

        if (V == 0) return; // No graph exists yet — nothing to reset

        stopAuto(); // Stop auto timer if it was running

        // ---- Reinitialize algorithm state ----
        selected = new boolean[V]; // All nodes unselected
        selected[0] = true;        // Node 0 is the starting node for Prim's

        mstEdges.clear();  // Remove all previously found MST edges
        totalCost = 0;     // Reset cost counter
        candidateEdge = null; // Clear any pending candidate

        algoReady = true;  // Mark algorithm as initialized and ready

        log("Algorithm reset. Starting from node 0.");

        updateStats();
        graphPanel.repaint();
    }


    // =========================================================
    // AUTO EXECUTION CONTROL
    // =========================================================

    /**
     * startAuto() — Begins automatic step-by-step execution.
     *
     * The autoTimer fires every 900ms and calls runAutoStep().
     * The "Auto" button is hidden and replaced by the "Stop" button.
     */
    private void startAuto() {

        // Initialize algorithm if not started yet
        if (!algoReady) resetAlgo();

        // Swap button visibility: hide Auto, show Stop
        autoBtn.setVisible(false);
        stopBtn.setVisible(true);

        autoTimer.start(); // Start the repeating timer
    }

    /**
     * runAutoStep() — Called by autoTimer every 900ms.
     * Simply delegates to stepOnce() to advance algorithm by one step.
     */
    private void runAutoStep() {
        stepOnce();
    }

    /**
     * stopAuto() — Stops the automatic execution timer.
     *
     * Restores the button visibility: shows Auto, hides Stop.
     * Safe to call even if auto mode is not running.
     */
    private void stopAuto() {
        autoTimer.stop();           // Stop the timer
        autoBtn.setVisible(true);   // Show Auto button
        stopBtn.setVisible(false);  // Hide Stop button
    }


    // =========================================================
    // STATISTICS UPDATE
    // =========================================================

    /**
     * updateStats() — Refreshes all stat labels in the sidebar.
     *
     * Counts:
     * - Total nodes (V)
     * - Total graph edges (non-zero entries in upper triangle of matrix)
     * - MST edges added so far
     * - Current MST total cost
     */
    private void updateStats() {

        // Count total edges in the graph
        // Only count upper triangle (i < j) to avoid double-counting
        // since the matrix is symmetric (undirected graph)
        int gEdges = 0;
        if (graph != null) {
            for (int i = 0; i < V; i++)
                for (int j = i + 1; j < V; j++)
                    if (graph[i][j] > 0) gEdges++; // Count edge if weight is non-zero
        }

        // Update all stat labels
        statNodes.setText("Nodes: " + V);
        statGEdges.setText("Graph Edges: " + gEdges);
        statEdges.setText("MST Edges: " + mstEdges.size());
        statCost.setText("MST Cost: " + totalCost);
    }


 
    // LOGGING
  


    private void log(String msg) {

        if (logArea == null) return; // Guard against null reference during init

        String current = logArea.getText();

        if (current.isEmpty())
            logArea.setText(msg);           // First message — set directly
        else
            logArea.setText(current + "\n" + msg); // Subsequent — append with newline

        // Auto-scroll to bottom so latest message is visible
        logArea.setCaretPosition(logArea.getDocument().getLength());
    }


    // =========================================================
    // GRAPH PANEL — CUSTOM DRAWING CANVAS
    // =========================================================


    class GraphPanel extends JPanel {

        // Arrays storing the pixel coordinates of each node on screen
        private int[] nx; // X coordinate of each node's center
        private int[] ny; // Y coordinate of each node's center

        private static final int R = 22; // Radius of each node circle (pixels)

        /**
         * placeNodesCircle() — Arranges nodes in a circular layout.
         *
         * Uses trigonometry to place V nodes evenly around a circle.
         * Center of circle = center of panel.
         * Radius of circle = 40% of the smaller panel dimension.
         *
         * @param count  Number of nodes to place
         */
        void placeNodesCircle(int count) {
            nx = new int[count];
            ny = new int[count];

            // Panel center point
            int cx = getWidth() / 2;
            int cy = getHeight() / 2;

            // Use 40% of smaller dimension as circle radius to fit all nodes
            int cr = (int)(Math.min(cx, cy) * 0.8);

            for (int i = 0; i < count; i++) {
                // Distribute nodes equally: angle = (2π / count) * i
                // Subtract π/2 to start from top (12 o'clock position)
                double angle = 2 * Math.PI * i / count - Math.PI / 2;
                nx[i] = cx + (int)(cr * Math.cos(angle)); // X = cx + r*cos(θ)
                ny[i] = cy + (int)(cr * Math.sin(angle)); // Y = cy + r*sin(θ)
            }
        }

        /**
         * paintComponent() — Custom rendering method called by Swing.
         *
         * Rendering order (back to front):
         * 1. White background
         * 2. All graph edges (gray, with weight labels)
         * 3. MST edges (blue, thick)
         * 4. Candidate edge (orange/red, dashed)
         * 5. All nodes (colored circles with index labels)
         *
         * @param g  Graphics context provided by Swing
         */
        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g); // Clear previous drawing

            // Use Graphics2D for anti-aliasing and stroke control
            Graphics2D g2 = (Graphics2D) g;
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            // ---- White Background ----
            g2.setColor(BG_GRAPH);
            g2.fillRect(0, 0, getWidth(), getHeight());

            // Guard: do nothing if nodes haven't been placed yet
            if (nx == null || V == 0) return;

        // ---- STEP 1: Draw All Graph Edges (gray, thin) ----
        // These show the full graph structure before MST overlay
        g2.setStroke(new BasicStroke(1.5f)); // Thin stroke for non-MST edges
        for (int i = 0; i < V; i++) {
            for (int j = i + 1; j < V; j++) { // j > i to avoid drawing each edge twice
                if (graph != null && graph[i][j] > 0) {

                    // ---- Check if this edge is a confirmed MST edge ----
                    boolean isMst = false;
                    for (int[] e : mstEdges) {
                        if ((e[0] == i && e[1] == j) || (e[0] == j && e[1] == i)) {
                            isMst = true;
                            break;
                        }
                    }

                    // ---- Check if this is the current candidate edge ----
                    boolean isCand = candidateEdge != null &&
                        ((candidateEdge[0] == i && candidateEdge[1] == j) ||
                         (candidateEdge[0] == j && candidateEdge[1] == i));

                    // Draw non-MST, non-candidate edges as light gray
                    if (!isMst && !isCand) {
                        g2.setColor(EDGE_DEFAULT);
                        g2.drawLine(nx[i], ny[i], nx[j], ny[j]);

                        // Draw weight label at edge midpoint
                        int mx = (nx[i] + nx[j]) / 2;
                        int my = (ny[i] + ny[j]) / 2;
                        g2.setColor(new Color(160, 170, 180)); // Muted label color
                        g2.setFont(new Font("Segoe UI", Font.PLAIN, 10));
                        g2.drawString(String.valueOf(graph[i][j]), mx + 3, my - 3);
                    }
                }
            }
        }

        // ---- STEP 2: Draw MST Edges (blue, thick) ----
        // These are the confirmed edges chosen by Prim's algorithm
        g2.setStroke(new BasicStroke(3.0f)); // Thicker stroke for MST edges
        g2.setColor(EDGE_MST);
        for (int[] e : mstEdges) {
            g2.drawLine(nx[e[0]], ny[e[0]], nx[e[1]], ny[e[1]]);

            // Draw weight label for MST edges (more prominent)
            int mx = (nx[e[0]] + nx[e[1]]) / 2;
            int my = (ny[e[0]] + ny[e[1]]) / 2;
            g2.setColor(EDGE_MST);
            g2.setFont(new Font("Segoe UI", Font.BOLD, 11));
            g2.drawString(String.valueOf(graph[e[0]][e[1]]), mx + 3, my - 3);
            g2.setColor(EDGE_MST); // Reset color for next edge
        }

        // ---- STEP 3: Draw Candidate Edge (orange, dashed) ----
        // This is the edge currently being "considered" during animation
        if (candidateEdge != null) {
            float[] dashPattern = {6f, 4f}; // 6px dash, 4px gap
            g2.setStroke(new BasicStroke(2.5f, BasicStroke.CAP_ROUND, BasicStroke.JOIN_ROUND,
                10f, dashPattern, 0f));
            g2.setColor(EDGE_CAND);
            g2.drawLine(
                nx[candidateEdge[0]], ny[candidateEdge[0]],
                nx[candidateEdge[1]], ny[candidateEdge[1]]
            );
        }

        // ---- STEP 4: Draw Nodes (circles with labels) ----
        g2.setStroke(new BasicStroke(2.0f));
        for (int i = 0; i < V; i++) {

            // Determine node fill color based on its current state
            Color fill;
            if (selected != null && selected[i]) {
                // Node is in MST → green
                fill = NODE_MST;
            } else if (candidateEdge != null &&
                       (candidateEdge[1] == i)) {
                // Node is candidate destination → orange
                fill = NODE_SELECT;
            } else {
                // Node is not yet selected → gray
                fill = NODE_DEFAULT;
            }

            // Draw filled circle (node body)
            g2.setColor(fill);
            g2.fillOval(nx[i] - R, ny[i] - R, 2 * R, 2 * R);

            // Draw circle border
            g2.setColor(fill.darker()); // Slightly darker border for depth
            g2.drawOval(nx[i] - R, ny[i] - R, 2 * R, 2 * R);

            // Draw node index label centered inside circle
            g2.setColor(TEXT_NODE);
            g2.setFont(new Font("Segoe UI", Font.BOLD, 13));
            FontMetrics fm = g2.getFontMetrics();
            String label = String.valueOf(i);
            // Center text: subtract half width and half height of text bounding box
            g2.drawString(label,
                nx[i] - fm.stringWidth(label) / 2,
                ny[i] + fm.getAscent() / 2 - 1
            );
        }
    } // end paintComponent

    } // end GraphPanel


    // =========================================================
    // MAIN METHOD — ENTRY POINT
    // =========================================================

  
    public static void main(String[] args) {
        SwingUtilities.invokeLater(PrimsVirtualLab::new);
    }

} // end PrimsVirtualLab