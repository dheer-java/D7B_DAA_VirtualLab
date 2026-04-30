import java.awt.*;
import java.util.*;
import java.util.List;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;

public class KruskalGraphVirtualLab extends JFrame {

    static class Edge {
        int src, dest, weight;
        boolean inMST;

        Edge(int src, int dest, int weight) {
            this.src = src;
            this.dest = dest;
            this.weight = weight;
            this.inMST = false;
        }
    }

    static class DSU {
        int[] parent;
        int[] rank;

        DSU(int n) {
            parent = new int[n];
            rank = new int[n];
            for (int i = 0; i < n; i++) {
                parent[i] = i;
                rank[i] = 0;
            }
        }

        int find(int x) {
            if (parent[x] != x) {
                parent[x] = find(parent[x]);
            }
            return parent[x];
        }

        boolean union(int x, int y) {
            int px = find(x);
            int py = find(y);

            if (px == py) return false;

            if (rank[px] < rank[py]) {
                parent[px] = py;
            } else if (rank[px] > rank[py]) {
                parent[py] = px;
            } else {
                parent[py] = px;
                rank[px]++;
            }
            return true;
        }
    }

    class GraphPanel extends JPanel {
        Point[] nodePositions;

        GraphPanel() {
            setPreferredSize(new Dimension(500, 500));
            setBackground(Color.WHITE);
        }

        private void calculateNodePositions() {
            if (vertices <= 0) return;

            nodePositions = new Point[vertices];
            int w = getWidth();
            int h = getHeight();
            int centerX = w / 2;
            int centerY = h / 2;
            int radius = Math.min(w, h) / 2 - 70;

            for (int i = 0; i < vertices; i++) {
                double angle = 2 * Math.PI * i / vertices - Math.PI / 2;
                int x = centerX + (int) (radius * Math.cos(angle));
                int y = centerY + (int) (radius * Math.sin(angle));
                nodePositions[i] = new Point(x, y);
            }
        }

        @Override
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);

            if (vertices <= 0) return;

            calculateNodePositions();
            Graphics2D g2 = (Graphics2D) g;
            g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

            for (Edge edge : edges) {
                Point p1 = nodePositions[edge.src];
                Point p2 = nodePositions[edge.dest];

                if (edge.inMST) {
                    g2.setColor(new Color(34, 139, 34));
                    g2.setStroke(new BasicStroke(4));
                } else {
                    g2.setColor(Color.GRAY);
                    g2.setStroke(new BasicStroke(2));
                }

                g2.drawLine(p1.x, p1.y, p2.x, p2.y);

                int midX = (p1.x + p2.x) / 2;
                int midY = (p1.y + p2.y) / 2;

                g2.setColor(Color.RED);
                g2.setFont(new Font("Arial", Font.BOLD, 14));
                g2.drawString(String.valueOf(edge.weight), midX, midY);
            }

            for (int i = 0; i < vertices; i++) {
                Point p = nodePositions[i];
                int r = 36;

                g2.setColor(new Color(70, 130, 180));
                g2.fillOval(p.x - r / 2, p.y - r / 2, r, r);

                g2.setColor(Color.BLACK);
                g2.setStroke(new BasicStroke(2));
                g2.drawOval(p.x - r / 2, p.y - r / 2, r, r);

                g2.setColor(Color.WHITE);
                g2.setFont(new Font("Arial", Font.BOLD, 14));
                String label = String.valueOf(i);
                FontMetrics fm = g2.getFontMetrics();
                int tx = p.x - fm.stringWidth(label) / 2;
                int ty = p.y + fm.getAscent() / 2 - 3;
                g2.drawString(label, tx, ty);
            }
        }
    }

    private JTextField verticesField;
    private JTextField srcField;
    private JTextField destField;
    private JTextField weightField;

    private JButton setVerticesButton;
    private JButton addEdgeButton;
    private JButton runButton;
    private JButton resetButton;
    private JButton sampleButton;

    private JTable edgeTable;
    private DefaultTableModel tableModel;
    private JTextArea outputArea;
    private GraphPanel graphPanel;

    private int vertices = 0;
    private List<Edge> edges = new ArrayList<>();

    public KruskalGraphVirtualLab() {
        setTitle("Virtual Lab - Kruskal's Algorithm with Graph");
        setSize(1200, 700);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLayout(new BorderLayout(10, 10));

        JPanel topPanel = new JPanel(new GridLayout(2, 1, 5, 5));

        JPanel vertexPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        vertexPanel.setBorder(BorderFactory.createTitledBorder("Graph Setup"));

        vertexPanel.add(new JLabel("Number of Vertices:"));
        verticesField = new JTextField(5);
        vertexPanel.add(verticesField);

        setVerticesButton = new JButton("Set Vertices");
        vertexPanel.add(setVerticesButton);

        sampleButton = new JButton("Load Sample");
        vertexPanel.add(sampleButton);

        topPanel.add(vertexPanel);

        JPanel inputPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        inputPanel.setBorder(BorderFactory.createTitledBorder("Add Edge"));

        inputPanel.add(new JLabel("Source:"));
        srcField = new JTextField(5);
        inputPanel.add(srcField);

        inputPanel.add(new JLabel("Destination:"));
        destField = new JTextField(5);
        inputPanel.add(destField);

        inputPanel.add(new JLabel("Weight:"));
        weightField = new JTextField(5);
        inputPanel.add(weightField);

        addEdgeButton = new JButton("Add Edge");
        inputPanel.add(addEdgeButton);

        runButton = new JButton("Run Kruskal");
        inputPanel.add(runButton);

        resetButton = new JButton("Reset");
        inputPanel.add(resetButton);

        topPanel.add(inputPanel);

        add(topPanel, BorderLayout.NORTH);

        tableModel = new DefaultTableModel(new String[]{"Source", "Destination", "Weight"}, 0);
        edgeTable = new JTable(tableModel);
        JScrollPane tableScrollPane = new JScrollPane(edgeTable);
        tableScrollPane.setBorder(BorderFactory.createTitledBorder("Edges"));

        outputArea = new JTextArea();
        outputArea.setEditable(false);
        outputArea.setFont(new Font("Monospaced", Font.PLAIN, 14));
        JScrollPane outputScrollPane = new JScrollPane(outputArea);
        outputScrollPane.setBorder(BorderFactory.createTitledBorder("Output / Steps"));

        JPanel leftPanel = new JPanel(new BorderLayout(10, 10));
        leftPanel.add(tableScrollPane, BorderLayout.CENTER);
        leftPanel.add(outputScrollPane, BorderLayout.SOUTH);
        outputScrollPane.setPreferredSize(new Dimension(350, 220));

        graphPanel = new GraphPanel();
        graphPanel.setBorder(BorderFactory.createTitledBorder("Graph Visualization"));

        JSplitPane splitPane = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, leftPanel, graphPanel);
        splitPane.setDividerLocation(420);
        add(splitPane, BorderLayout.CENTER);

        addEdgeButton.setEnabled(false);
        runButton.setEnabled(false);

        setVerticesButton.addActionListener(e -> setVertices());
        addEdgeButton.addActionListener(e -> addEdge());
        runButton.addActionListener(e -> runKruskal());
        resetButton.addActionListener(e -> resetAll());
        sampleButton.addActionListener(e -> loadSample());
    }

    private void setVertices() {
        try {
            int v = Integer.parseInt(verticesField.getText().trim());
            if (v <= 0) {
                JOptionPane.showMessageDialog(this, "Number of vertices must be greater than 0.");
                return;
            }

            vertices = v;
            edges.clear();
            tableModel.setRowCount(0);
            outputArea.setText("Vertices set to " + vertices + "\n");
            addEdgeButton.setEnabled(true);
            runButton.setEnabled(true);
            graphPanel.repaint();

        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Enter a valid integer for vertices.");
        }
    }

    private void addEdge() {
        if (vertices == 0) {
            JOptionPane.showMessageDialog(this, "Set number of vertices first.");
            return;
        }

        try {
            int src = Integer.parseInt(srcField.getText().trim());
            int dest = Integer.parseInt(destField.getText().trim());
            int weight = Integer.parseInt(weightField.getText().trim());

            if (src < 0 || dest < 0 || src >= vertices || dest >= vertices) {
                JOptionPane.showMessageDialog(this, "Vertex values must be between 0 and " + (vertices - 1));
                return;
            }

            if (src == dest) {
                JOptionPane.showMessageDialog(this, "Source and destination cannot be same.");
                return;
            }

            Edge edge = new Edge(src, dest, weight);
            edges.add(edge);
            tableModel.addRow(new Object[]{src, dest, weight});

            srcField.setText("");
            destField.setText("");
            weightField.setText("");

            graphPanel.repaint();

        } catch (NumberFormatException ex) {
            JOptionPane.showMessageDialog(this, "Enter valid integers for source, destination, and weight.");
        }
    }

    private void runKruskal() {
        if (vertices == 0) {
            JOptionPane.showMessageDialog(this, "Set number of vertices first.");
            return;
        }

        if (edges.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Add at least one edge.");
            return;
        }

        for (Edge edge : edges) {
            edge.inMST = false;
        }

        List<Edge> sortedEdges = new ArrayList<>(edges);
        sortedEdges.sort(Comparator.comparingInt(e -> e.weight));

        DSU dsu = new DSU(vertices);
        List<Edge> mst = new ArrayList<>();
        int totalCost = 0;

        StringBuilder sb = new StringBuilder();
        sb.append("Kruskal's Algorithm Execution\n");
        sb.append("--------------------------------------------------\n");
        sb.append("Edges sorted by weight:\n");

        for (Edge edge : sortedEdges) {
            sb.append(edge.src).append(" - ").append(edge.dest).append(" : ").append(edge.weight).append("\n");
        }

        sb.append("\nStep-by-step selection:\n");

        for (Edge edge : sortedEdges) {
            sb.append("Checking edge ").append(edge.src).append(" - ").append(edge.dest)
                    .append(" (Weight = ").append(edge.weight).append(") -> ");

            if (dsu.union(edge.src, edge.dest)) {
                edge.inMST = true;
                mst.add(edge);
                totalCost += edge.weight;
                sb.append("Selected\n");
            } else {
                sb.append("Rejected (Cycle formed)\n");
            }

            if (mst.size() == vertices - 1) {
                break;
            }
        }

        sb.append("\nMinimum Spanning Tree:\n");

        if (mst.size() != vertices - 1) {
            sb.append("MST cannot be formed. Graph is disconnected.\n");
        } else {
            for (Edge edge : mst) {
                sb.append(edge.src).append(" - ").append(edge.dest).append(" : ").append(edge.weight).append("\n");
            }
            sb.append("\nTotal Minimum Cost = ").append(totalCost).append("\n");
        }

        outputArea.setText(sb.toString());
        graphPanel.repaint();
    }

    private void resetAll() {
        vertices = 0;
        edges.clear();

        verticesField.setText("");
        srcField.setText("");
        destField.setText("");
        weightField.setText("");

        tableModel.setRowCount(0);
        outputArea.setText("");

        addEdgeButton.setEnabled(false);
        runButton.setEnabled(false);

        graphPanel.repaint();
    }

    private void loadSample() {
        vertices = 5;
        verticesField.setText("5");
        edges.clear();
        tableModel.setRowCount(0);

        int[][] sampleEdges = {
                {0, 1, 2},
                {0, 3, 6},
                {1, 2, 3},
                {1, 3, 8},
                {1, 4, 5},
                {2, 4, 7},
                {3, 4, 9}
        };

        for (int[] e : sampleEdges) {
            Edge edge = new Edge(e[0], e[1], e[2]);
            edges.add(edge);
            tableModel.addRow(new Object[]{e[0], e[1], e[2]});
        }

        outputArea.setText("Sample graph loaded.\nNow click Run Kruskal.\n");
        addEdgeButton.setEnabled(true);
        runButton.setEnabled(true);

        graphPanel.repaint();
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new KruskalGraphVirtualLab().setVisible(true));
    }
}
    

