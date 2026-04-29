import java.awt.*;
import java.awt.event.*;
import java.util.*;
import javax.swing.*;

// Main class for GUI and algorithm
public class KruskalVisualizer extends JFrame implements ActionListener {

    JTextArea inputArea, logArea;
    JButton runButton, resetButton;
    GraphPanel graphPanel;

    ArrayList<Edge> edges = new ArrayList<>();
    ArrayList<Edge> mstEdges = new ArrayList<>();
    int vertices = 0;
    int animationDelay = 700;

    // Constructor - sets up UI
    public KruskalVisualizer() {
        setTitle("Kruskal MST Visualizer");
        setSize(1200, 800);
        setLayout(new BorderLayout());
        setDefaultCloseOperation(EXIT_ON_CLOSE);

        // Input section
        inputArea = new JTextArea(5, 30);
        inputArea.setText("0 1 10\n0 2 6\n0 3 5\n1 3 15\n2 3 4");
        inputArea.setFont(new Font("Monospaced", Font.PLAIN, 12));

        runButton = new JButton("Run Kruskal");
        runButton.addActionListener(this);
        runButton.setBackground(new Color(34, 139, 34));
        runButton.setForeground(Color.WHITE);

        resetButton = new JButton("Reset");
        resetButton.addActionListener(this);
        resetButton.setBackground(new Color(220, 20, 60));
        resetButton.setForeground(Color.WHITE);

        JPanel topPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(5, 5, 5, 5);

        gbc.gridx = 0; gbc.gridy = 0; gbc.anchor = GridBagConstraints.WEST;
        topPanel.add(new JLabel("Enter edges (u v w):"), gbc);

        gbc.gridx = 0; gbc.gridy = 1; gbc.gridwidth = 3; gbc.fill = GridBagConstraints.BOTH;
        topPanel.add(new JScrollPane(inputArea), gbc);

        gbc.gridwidth = 1; gbc.fill = GridBagConstraints.NONE;
        gbc.gridx = 0; gbc.gridy = 2;
        topPanel.add(runButton, gbc);

        gbc.gridx = 1; gbc.gridy = 2;
        topPanel.add(resetButton, gbc);

        add(topPanel, BorderLayout.NORTH);

        // Log panel for step-by-step output
        logArea = new JTextArea();
        logArea.setEditable(false);
        logArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        logArea.setBackground(new Color(245, 245, 245));
        add(new JScrollPane(logArea), BorderLayout.EAST);

        // Graph drawing panel
        graphPanel = new GraphPanel();
        add(graphPanel, BorderLayout.CENTER);

        setVisible(true);
    }

    // Edge structure
    class Edge {
        int src, dest, weight;
        boolean selected = false; // true if part of MST

        Edge(int s, int d, int w) {
            src = s;
            dest = d;
            weight = w;
        }
    }

    // Find with path compression
    int find(int parent[], int i) {
        if (parent[i] != i)
            parent[i] = find(parent, parent[i]);
        return parent[i];
    }

    // Union by rank
    void union(int parent[], int rank[], int x, int y) {
        int rootX = find(parent, x);
        int rootY = find(parent, y);

        if (rank[rootX] < rank[rootY])
            parent[rootX] = rootY;
        else if (rank[rootX] > rank[rootY])
            parent[rootY] = rootX;
        else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
    }

    // Kruskal algorithm with logging
    void kruskal() {
        mstEdges.clear();
        logArea.setText("");

        // Step 1: sort edges
        edges.sort(Comparator.comparingInt(e -> e.weight));

        logArea.append("Sorted edges:\n");
        for (Edge e : edges) {
            logArea.append(e.src + "-" + e.dest + " (" + e.weight + ")\n");
        }
        logArea.append("\nStep-by-step execution:\n");

        int parent[] = new int[vertices];
        int rank[] = new int[vertices];

        for (int i = 0; i < vertices; i++) {
            parent[i] = i;
            rank[i] = 0;
        }

        logArea.append("Step-by-step execution:\n");

        // Step 2: pick edges one by one
        for (Edge e : edges) {
            logArea.append("\nChecking edge: " + e.src + "-" + e.dest + " (" + e.weight + ")\n");

            int x = find(parent, e.src);
            int y = find(parent, e.dest);

            // Step 3: check cycle
            if (x != y) {
                logArea.append("✔ Selected\n");
                mstEdges.add(e);
                e.selected = true;
                union(parent, rank, x, y);
            } else {
                logArea.append("✘ Rejected (cycle)\n");
            }

            graphPanel.repaint();

            try { Thread.sleep(animationDelay); } catch (InterruptedException ex) {}
        }

        // Total cost
        int total = 0;
        for (Edge e : mstEdges) total += e.weight;

        logArea.append("\nTotal MST Cost: " + total);
    }

    // Convert input text to edges
    void parseInput() {
        edges.clear();
        String[] lines = inputArea.getText().split("\n");

        int max = 0;

        for (String line : lines) {
            String[] p = line.trim().split(" ");
            int u = Integer.parseInt(p[0]);
            int v = Integer.parseInt(p[1]);
            int w = Integer.parseInt(p[2]);

            edges.add(new Edge(u, v, w));
            max = Math.max(max, Math.max(u, v));
        }

        vertices = max + 1;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == runButton) {
            parseInput();
            new Thread(() -> kruskal()).start();
        } else if (e.getSource() == resetButton) {
            mstEdges.clear();
            for (Edge edge : edges) edge.selected = false;
            logArea.setText("");
            graphPanel.repaint();
        }
    }

    // Panel for drawing graph
    class GraphPanel extends JPanel {

        int radius = 250;
        int centerX = 400, centerY = 300;

        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);
            Graphics2D g2d = (Graphics2D) g;
            g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            Point[] points = new Point[vertices];

            // Draw vertices in circle
            for (int i = 0; i < vertices; i++) {
                double angle = 2 * Math.PI * i / vertices;
                int x = centerX + (int)(radius * Math.cos(angle));
                int y = centerY + (int)(radius * Math.sin(angle));

                points[i] = new Point(x, y);

                g2d.setColor(Color.BLUE);
                g2d.fillOval(x - 20, y - 20, 40, 40);

                g2d.setColor(Color.WHITE);
                g2d.setFont(new Font("Arial", Font.BOLD, 16));
                FontMetrics fm = g2d.getFontMetrics();
                int textX = x - fm.stringWidth("" + i) / 2;
                int textY = y + fm.getAscent() / 2;
                g2d.drawString("" + i, textX, textY);
            }

            // Draw edges
            for (Edge e : edges) {
                Point p1 = points[e.src];
                Point p2 = points[e.dest];

                g2d.setColor(e.selected ? Color.RED : Color.LIGHT_GRAY);
                g2d.setStroke(new BasicStroke(e.selected ? 3 : 1));
                g2d.drawLine(p1.x, p1.y, p2.x, p2.y);

                int midX = (p1.x + p2.x) / 2;
                int midY = (p1.y + p2.y) / 2;

                g2d.setColor(Color.BLACK);
                g2d.setFont(new Font("Arial", Font.PLAIN, 12));
                FontMetrics fm = g2d.getFontMetrics();
                int weightX = midX - fm.stringWidth("" + e.weight) / 2;
                int weightY = midY - 5;
                g2d.drawString("" + e.weight, weightX, weightY);
            }
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new KruskalVisualizer());
    }
}