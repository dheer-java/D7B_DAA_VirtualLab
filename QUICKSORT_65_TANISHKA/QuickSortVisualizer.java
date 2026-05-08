
/*
 * ============================================================
 * QUICK SORT VISUALIZATION IN JAVA SWING
 * ============================================================
 *
 * FEATURES:
 * ------------------------------------------------------------
 * ✅ User input array
 * ✅ Random array generation
 * ✅ Visual bars
 * ✅ Pivot highlighting
 * ✅ Comparison highlighting
 * ✅ Swap highlighting
 * ✅ Sorted element highlighting
 * ✅ Pause / Resume
 * ✅ Reset
 * ✅ Step counter
 * ✅ Current Pivot display
 * ✅ Time Complexity display
 * ✅ Quick Sort pseudocode panel
 * ✅ Dynamic pseudocode highlighting
 * ✅ Dark modern UI
 * ✅ Smooth animations using Thread.sleep()
 *
 * ============================================================
 * WORKS IN:
 * IntelliJ IDEA
 * Eclipse
 * NetBeans
 * ============================================================
 */

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import java.awt.*;
import java.util.Random;

public class QuickSortVisualizer extends JFrame {

    // ================= ARRAY VARIABLES =================

    private int[] array = {};
    private final int BAR_WIDTH = 40;

    // Indices used for visualization
    private int pivotIndex = -1;
    private int comparingIndex1 = -1;
    private int comparingIndex2 = -1;
    private int sortedIndex = -1;

    // ================= CONTROL VARIABLES =================

    private boolean isPaused = false;
    private boolean isSorting = false;

    private int stepCount = 0;

    // ================= GUI COMPONENTS =================

    private JTextField inputField;

    private JButton startButton;
    private JButton randomButton;
    private JButton resetButton;
    private JButton pauseButton;

    private JLabel stepLabel;
    private JLabel pivotLabel;
    private JLabel complexityLabel;

    private DrawPanel drawPanel;

    private JTextArea pseudoCodeArea;

    // Current highlighted pseudocode line
    private int currentPseudoLine = -1;

    // ================= CONSTRUCTOR =================

    public QuickSortVisualizer() {

        setTitle("Quick Sort Visualizer");
        setSize(1400, 800);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);

        // Dark Theme Background
        getContentPane().setBackground(new Color(18, 18, 18));
        setLayout(new BorderLayout());

        // ================= TOP PANEL =================

        JPanel topPanel = new JPanel();
        topPanel.setBackground(new Color(28, 28, 28));
        topPanel.setBorder(new EmptyBorder(10, 10, 10, 10));

        inputField = new JTextField(25);
        inputField.setFont(new Font("Arial", Font.PLAIN, 18));

        startButton = createButton("Start Sorting");
        randomButton = createButton("Generate Random Array");
        resetButton = createButton("Reset");
        pauseButton = createButton("Pause");

        topPanel.add(new JLabel("Array: "));
        topPanel.add(inputField);

        topPanel.add(startButton);
        topPanel.add(randomButton);
        topPanel.add(resetButton);
        topPanel.add(pauseButton);

        add(topPanel, BorderLayout.NORTH);

        // ================= CENTER PANEL =================

        JPanel centerPanel = new JPanel(new GridLayout(1, 2));
        centerPanel.setBackground(new Color(18, 18, 18));

        // Draw Panel
        drawPanel = new DrawPanel();
        centerPanel.add(drawPanel);

        // Pseudocode Panel
        pseudoCodeArea = new JTextArea();

        pseudoCodeArea.setEditable(false);
        pseudoCodeArea.setFont(new Font("Consolas", Font.PLAIN, 18));
        pseudoCodeArea.setBackground(new Color(30, 30, 30));
        pseudoCodeArea.setForeground(Color.WHITE);

        pseudoCodeArea.setText(
                "QUICK SORT PSEUDOCODE\n\n" +
                "1. quickSort(low, high)\n" +
                "2. if low < high\n" +
                "3.    pivot = partition(low, high)\n" +
                "4.    quickSort(low, pivot-1)\n" +
                "5.    quickSort(pivot+1, high)\n\n" +
                "PARTITION:\n\n" +
                "6. pivot = array[high]\n" +
                "7. i = low - 1\n" +
                "8. for j = low to high-1\n" +
                "9.    if array[j] < pivot\n" +
                "10.      swap(i, j)\n" +
                "11. swap(i+1, high)\n"
        );

        JScrollPane scrollPane = new JScrollPane(pseudoCodeArea);
        centerPanel.add(scrollPane);

        add(centerPanel, BorderLayout.CENTER);

        // ================= BOTTOM PANEL =================

        JPanel bottomPanel = new JPanel();
        bottomPanel.setBackground(new Color(28, 28, 28));

        stepLabel = createLabel("Steps: 0");
        pivotLabel = createLabel("Pivot: None");
        complexityLabel = createLabel("Time Complexity: O(n log n)");

        bottomPanel.add(stepLabel);
        bottomPanel.add(Box.createHorizontalStrut(40));
        bottomPanel.add(pivotLabel);
        bottomPanel.add(Box.createHorizontalStrut(40));
        bottomPanel.add(complexityLabel);

        add(bottomPanel, BorderLayout.SOUTH);

        // ================= BUTTON ACTIONS =================

        randomButton.addActionListener(e -> generateRandomArray());

        resetButton.addActionListener(e -> resetArray());

        pauseButton.addActionListener(e -> {
            isPaused = !isPaused;

            if (isPaused) {
                pauseButton.setText("Resume");
            } else {
                pauseButton.setText("Pause");
            }
        });

        startButton.addActionListener(e -> {

            if (isSorting)
                return;

            readUserInput();

            if (array.length == 0)
                return;

            isSorting = true;

            new Thread(() -> {
                try {

                    quickSort(0, array.length - 1);

                    // Mark all sorted
                    for (int i = 0; i < array.length; i++) {
                        sortedIndex = i;
                        repaintAndSleep();
                    }

                    pivotLabel.setText("Pivot: Completed");

                } catch (Exception ex) {
                    ex.printStackTrace();
                }

                isSorting = false;

            }).start();
        });

        setVisible(true);
    }

    // ============================================================
    // CREATE STYLED BUTTON
    // ============================================================

    private JButton createButton(String text) {

        JButton button = new JButton(text);

        button.setFocusPainted(false);

        button.setBackground(new Color(50, 50, 50));
        button.setForeground(Color.WHITE);

        button.setFont(new Font("Arial", Font.BOLD, 15));

        return button;
    }

    // ============================================================
    // CREATE STYLED LABEL
    // ============================================================

    private JLabel createLabel(String text) {

        JLabel label = new JLabel(text);

        label.setForeground(Color.WHITE);
        label.setFont(new Font("Arial", Font.BOLD, 18));

        return label;
    }

    // ============================================================
    // GENERATE RANDOM ARRAY
    // ============================================================

    private void generateRandomArray() {

        Random random = new Random();

        array = new int[12];

        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < array.length; i++) {

            array[i] = random.nextInt(300) + 20;

            sb.append(array[i]);

            if (i != array.length - 1)
                sb.append(",");
        }

        inputField.setText(sb.toString());

        repaint();
    }

    // ============================================================
    // RESET
    // ============================================================

    private void resetArray() {

        array = new int[]{};

        stepCount = 0;

        pivotIndex = -1;
        comparingIndex1 = -1;
        comparingIndex2 = -1;
        sortedIndex = -1;

        stepLabel.setText("Steps: 0");
        pivotLabel.setText("Pivot: None");

        repaint();
    }

    // ============================================================
    // READ USER INPUT
    // ============================================================

    private void readUserInput() {

        try {

            String text = inputField.getText().trim();

            if (text.isEmpty())
                return;

            String[] parts = text.split(",");

            array = new int[parts.length];

            for (int i = 0; i < parts.length; i++) {
                array[i] = Integer.parseInt(parts[i].trim());
            }

            repaint();

        } catch (Exception e) {

            JOptionPane.showMessageDialog(this,
                    "Enter valid numbers separated by commas");

        }
    }

    // ============================================================
    // QUICK SORT
    // ============================================================

    private void quickSort(int low, int high) throws Exception {

        highlightPseudo(1);

        if (low < high) {

            highlightPseudo(2);

            int pivot = partition(low, high);

            highlightPseudo(3);

            quickSort(low, pivot - 1);

            highlightPseudo(4);

            quickSort(pivot + 1, high);
        }
    }

    // ============================================================
    // PARTITION
    // ============================================================

    private int partition(int low, int high) throws Exception {

        highlightPseudo(6);

        int pivot = array[high];

        pivotIndex = high;

        pivotLabel.setText("Pivot: " + pivot);

        int i = low - 1;

        highlightPseudo(7);

        for (int j = low; j < high; j++) {

            comparingIndex1 = j;

            highlightPseudo(8);

            repaintAndSleep();

            if (array[j] < pivot) {

                highlightPseudo(9);

                i++;

                swap(i, j);

                highlightPseudo(10);
            }
        }

        swap(i + 1, high);

        highlightPseudo(11);

        pivotIndex = i + 1;

        return i + 1;
    }

    // ============================================================
    // SWAP
    // ============================================================

    private void swap(int i, int j) throws Exception {

        comparingIndex1 = i;
        comparingIndex2 = j;

        repaintAndSleep();

        int temp = array[i];
        array[i] = array[j];
        array[j] = temp;

        stepCount++;

        stepLabel.setText("Steps: " + stepCount);

        repaintAndSleep();
    }

    // ============================================================
    // HIGHLIGHT PSEUDOCODE
    // ============================================================

    private void highlightPseudo(int line) {

        currentPseudoLine = line;
        repaint();
    }

    // ============================================================
    // PAUSE + DELAY
    // ============================================================

    private void repaintAndSleep() throws Exception {

        repaint();

        while (isPaused) {
            Thread.sleep(100);
        }

        Thread.sleep(500);
    }

    // ============================================================
    // DRAW PANEL
    // ============================================================

    class DrawPanel extends JPanel {

        DrawPanel() {
            setBackground(new Color(18, 18, 18));
        }

        @Override
        protected void paintComponent(Graphics g) {

            super.paintComponent(g);

            Graphics2D g2 = (Graphics2D) g;

            // Smooth rendering
            g2.setRenderingHint(
                    RenderingHints.KEY_ANTIALIASING,
                    RenderingHints.VALUE_ANTIALIAS_ON);

            int width = getWidth();
            int height = getHeight();

            // ================= DRAW ARRAY BARS =================

            for (int i = 0; i < array.length; i++) {

                int barHeight = array[i];

                int x = 60 + i * (BAR_WIDTH + 15);

                int y = height - barHeight - 60;

                // Default color
                Color color = new Color(100, 149, 237);

                // Pivot color
                if (i == pivotIndex) {
                    color = Color.RED;
                }

                // Comparing color
                if (i == comparingIndex1 || i == comparingIndex2) {
                    color = Color.YELLOW;
                }

                // Sorted color
                if (i <= sortedIndex) {
                    color = Color.GREEN;
                }

                g2.setColor(color);

                // Rounded bars
                g2.fillRoundRect(x, y, BAR_WIDTH,
                        barHeight, 15, 15);

                // Value text
                g2.setColor(Color.WHITE);

                g2.drawString(
                        String.valueOf(array[i]),
                        x + 8,
                        y - 10
                );
            }

            // ================= HIGHLIGHT CURRENT PSEUDOCODE =================

            if (currentPseudoLine != -1) {

                g2.setColor(new Color(0, 255, 150));

                int lineY = 35 + currentPseudoLine * 28;

                g2.fillRect(width - 20, lineY, 10, 10);
            }
        }
    }

    // ============================================================
    // MAIN METHOD
    // ============================================================

    public static void main(String[] args) {

        SwingUtilities.invokeLater(() -> new QuickSortVisualizer());
    }
}
