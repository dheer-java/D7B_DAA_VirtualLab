package Kruskal_Algo_D7B_70;
import java.awt.*;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;

public class KruskalVisualizer extends JFrame {

    static class Edge {
        int u, v, weight;
        boolean selected = false;

        Edge(int u, int v, int w) {
            this.u = u;
            this.v = v;
            this.weight = w;
        }
    }

    int V = 6;
    List<Edge> edges = new ArrayList<>();
    List<Edge> mst = new ArrayList<>();

    int[] parent;

    JTable table;
    DefaultTableModel model;

    GraphPanel graphPanel;
    JButton startBtn;

    int step = 0;
    javax.swing.Timer timer; 

    Point[] nodes = new Point[V];

    public KruskalVisualizer() {
        setTitle("Kruskal Visualizer (Random Graphs)");
        setSize(800, 500);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        parent = new int[V];

        // LEFT TABLE
        model = new DefaultTableModel(new String[]{"U", "V", "W"}, 0);
        table = new JTable(model);

        JPanel leftPanel = new JPanel(new BorderLayout());
        leftPanel.add(new JLabel("Sorted Edges"), BorderLayout.NORTH);
        leftPanel.add(new JScrollPane(table), BorderLayout.CENTER);
        leftPanel.setPreferredSize(new Dimension(200, 0));

        // GRAPH PANEL
        graphPanel = new GraphPanel();

        // BUTTON
        startBtn = new JButton("Start (Random Graph)");
        startBtn.addActionListener(e -> startKruskal());

        add(leftPanel, BorderLayout.WEST);
        add(graphPanel, BorderLayout.CENTER);
        add(startBtn, BorderLayout.SOUTH);

        randomizeNodePositions(); 
    }

    void startKruskal() {
        // Generate a new random graph
        generateRandomGraph();
        randomizeNodePositions();

        // Sort edges
        edges.sort(Comparator.comparingInt(e -> e.weight));

        // Fill table
        model.setRowCount(0);
        for (Edge e : edges) {
            model.addRow(new Object[]{e.u, e.v, e.weight});
        }

        step = 0;
        mst.clear();
        for (int i = 0; i < V; i++) parent[i] = i;

        // Start animation
        if (timer != null) timer.stop();
        timer = new javax.swing.Timer(800, e -> processStep());
        timer.start();

        graphPanel.repaint();
    }

    void processStep() {
        if (step >= edges.size()) {
            timer.stop();
            return;
        }

        Edge e = edges.get(step);

        int pu = find(e.u);
        int pv = find(e.v);

        if (pu != pv) {
            parent[pu] = pv;
            e.selected = true;
            mst.add(e);
        }

        // Highlight current row
        table.setRowSelectionInterval(step, step);

        step++;
        graphPanel.repaint();
    }

    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }

    // Random graph generator
    void generateRandomGraph() {
        edges.clear();
        mst.clear();

        Random rand = new Random();
        int edgeCount = 8; // number of edges

        Set<String> used = new HashSet<>();
        while (edges.size() < edgeCount) {
            int u = rand.nextInt(V);
            int v = rand.nextInt(V);
            if (u == v) continue;

            String key = Math.min(u, v) + "-" + Math.max(u, v);
            if (used.contains(key)) continue;
            used.add(key);

            int weight = rand.nextInt(9) + 1; // 1–9
            edges.add(new Edge(u, v, weight));
        }
    }

    // Randomize node positions
    void randomizeNodePositions() {
        Random rand = new Random();
        for (int i = 0; i < V; i++) {
            nodes[i] = new Point(
                    50 + rand.nextInt(600),
                    50 + rand.nextInt(350)
            );
        }
    }

    class GraphPanel extends JPanel {
        protected void paintComponent(Graphics g) {
            super.paintComponent(g);

            // Draw all edges (light gray)
            g.setColor(Color.LIGHT_GRAY);
            for (Edge e : edges) {
                Point p1 = nodes[e.u];
                Point p2 = nodes[e.v];
                g.drawLine(p1.x, p1.y, p2.x, p2.y);

                int mx = (p1.x + p2.x) / 2;
                int my = (p1.y + p2.y) / 2;
                g.drawString(String.valueOf(e.weight), mx, my);
            }

            // Draw MST edges (red)
            g.setColor(Color.RED);
            for (Edge e : mst) {
                Point p1 = nodes[e.u];
                Point p2 = nodes[e.v];
                g.drawLine(p1.x, p1.y, p2.x, p2.y);
            }

            // Draw nodes
            g.setColor(Color.BLACK);
            for (int i = 0; i < nodes.length; i++) {
                g.fillOval(nodes[i].x - 10, nodes[i].y - 10, 20, 20);
                g.drawString(String.valueOf(i), nodes[i].x - 5, nodes[i].y - 15);
            }
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new KruskalVisualizer().setVisible(true));
    }
}
