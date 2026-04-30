import javax.swing.*;  // provides GUI components like JFrame, JButton, JLabel
import java.awt.*;     // provides graphics, colors, layouts, Point class
import java.awt.event.*; // provides event handling (button clicks etc.)
import java.util.*;    // provides ArrayList, Arrays utility

// Graph coloring means: Assign colors to each node such that no two connected nodes have the same color 
// Use minimum colors or check if coloring is possible with m colors.
// Map coloring (countries sharing borders)
// Exam scheduling (no two exams at same time if students overlap)
// Timetable scheduling
// Register allocation in compilers
// Network frequency assignment 
// BackTracking: For each node:
//Try color 1
//If valid → go to next node
//If stuck → go back and change color: Branch & Bound = Don’t waste time on bad choices

public class GraphColoringUI extends JFrame { // main class extending JFrame (window)

    int V = 0; // number of vertices (nodes currently in graph)

    int[][] graph = new int[20][20]; // adjacency matrix to store edges (max 20 nodes)
    // graph[i][j] = 1 means edge exists between node i and j

    int[] color = new int[20]; // stores color assigned to each node (0 = no color)

    JPanel drawPanel; // panel where graph will be drawn

    ArrayList<Point> nodes = new ArrayList<>(); 
    // stores (x,y) coordinates of each node for drawing on screen

    JTextField colorInput; // input field to enter number of colors


    public GraphColoringUI() { // constructor → builds UI
        setTitle("Graph Coloring Problem"); // window title
        setSize(700, 600); // window size
        setLayout(new BorderLayout()); // layout manager divides frame into regions

        //  Heading
        JLabel heading = new JLabel("Graph Coloring Problem", JLabel.CENTER); // heading text
        heading.setFont(new Font("Arial", Font.BOLD, 24)); // set font style
        add(heading, BorderLayout.NORTH); // place heading at top

        //  Drawing Panel
        drawPanel = new JPanel() {
            protected void paintComponent(Graphics g) { // method called automatically to draw
                super.paintComponent(g); // clears previous drawing

                // draw edges
                g.setColor(Color.BLACK); // set edge color

                for (int i = 0; i < V; i++) { // loop through all nodes
                    for (int j = i + 1; j < V; j++) { // check pairs of nodes
                        if (graph[i][j] == 1) { // if edge exists
                            g.drawLine(nodes.get(i).x, nodes.get(i).y,
                                       nodes.get(j).x, nodes.get(j).y); 
                            // draw line between node i and j using stored coordinates
                        }
                    }
                }

                // draw nodes
                for (int i = 0; i < V; i++) { // loop through each node

                    if (color[i] == 0) // if no color assigned
                        g.setColor(Color.LIGHT_GRAY); // default color
                    else
                        g.setColor(getColor(color[i])); // get actual assigned color

                    g.fillOval(nodes.get(i).x - 15, nodes.get(i).y - 15, 30, 30);
                    // draw circle centered at node position

                    g.setColor(Color.BLACK); // set text color
                    g.drawString("" + i, nodes.get(i).x - 5, nodes.get(i).y + 5);
                    // draw node number inside circle
                }
            }
        };

        drawPanel.setBackground(Color.WHITE); // set background color
        add(drawPanel, BorderLayout.CENTER); // place panel in center

        //  Controls
        JPanel control = new JPanel(); // panel for buttons and input

        JButton addNodeBtn = new JButton("Add Node"); // button to add node
        JButton addEdgeBtn = new JButton("Add Edge"); // button to add edge
        JButton colorBtn = new JButton("Color Graph"); // button to start coloring

        colorInput = new JTextField(5); // text field for number of colors

        control.add(addNodeBtn); // add button to control panel
        control.add(addEdgeBtn);
        control.add(new JLabel("Colors:")); // label for input
        control.add(colorInput); // input field
        control.add(colorBtn);

        add(control, BorderLayout.SOUTH); // place controls at bottom

        //  Add Node
        addNodeBtn.addActionListener(e -> { // action when button clicked
            if (V < 20) { // limit nodes to 20
                nodes.add(new Point(50 + V * 50, 100 + (V % 3) * 80)); 
                // generate position for new node

                V++; // increase node count

                drawPanel.repaint(); // redraw panel to show new node
            }
        });

        //  Add Edge
        addEdgeBtn.addActionListener(e -> {
            try {
                String u = JOptionPane.showInputDialog("Enter first node:");
                String v = JOptionPane.showInputDialog("Enter second node:");
                // take node numbers from user

                int i = Integer.parseInt(u); // convert input to integer
                int j = Integer.parseInt(v);

                graph[i][j] = graph[j][i] = 1; 
                // mark edge in both directions (undirected graph)

                drawPanel.repaint(); // update drawing
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Invalid input!");
                // show error if input is wrong
            }
        });

        //  Color Graph
        colorBtn.addActionListener(e -> {
            try {
                int m = Integer.parseInt(colorInput.getText()); 
                // read number of colors

                Arrays.fill(color, 0); 
                // reset all colors before solving

                if (graphColoring(0, m)) { // start coloring from node 0
                    drawPanel.repaint(); // redraw with colors
                    JOptionPane.showMessageDialog(this, "Solution Found!");
                } else {
                    JOptionPane.showMessageDialog(this, "No Solution!");
                }
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this, "Enter valid number of colors!");
            }
        });

        setDefaultCloseOperation(EXIT_ON_CLOSE); // close app on exit
        setVisible(true); // make window visible
    }

    //  Backtracking Algorithm //Tries to assign colors recursively
    boolean graphColoring(int node, int m) {
        if (node == V) // if all nodes are colored
            return true; // solution found

        for (int c = 1; c <= m; c++) { // try each color from 1 to m
            if (isSafe(node, c)) { // check if color is valid

                color[node] = c; // assign color

                if (graphColoring(node + 1, m)) // recursively color next node
                    return true; // if success, return true

                color[node] = 0; // backtrack (remove color if failed)
            }
        }
        return false; // no valid color found
    }

//Can I safely give this color
    boolean isSafe(int node, int c) {
        for (int i = 0; i < V; i++) { // check all nodes
            if (graph[node][i] == 1 && color[i] == c) 
                // if adjacent node has same color
                return false; // not safe
        }
        return true; // safe to assign
    }

    //  Color mapping
    Color getColor(int c) {
        Color[] colors = {Color.RED, Color.GREEN, Color.BLUE, Color.YELLOW,
                          Color.ORANGE, Color.CYAN, Color.MAGENTA};
        // predefined list of colors

        return colors[(c - 1) % colors.length]; 
        // return color based on index (reuse if exceeds array size)
    }

    public static void main(String[] args) {
        new GraphColoringUI(); // create object → starts program
    }
}