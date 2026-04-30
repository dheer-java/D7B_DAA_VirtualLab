package NQueen_D7B_69;

import javax.swing.*;
import java.awt.*;
import java.util.Stack;

public class NQueensVisualizer extends JFrame {
    private final int N = 8;
    private final JButton[][] cells = new JButton[N][N];
    private final int[] queens = new int[N]; // queens[row] = col
    private int currentRow = 0;
    private Timer timer;
    private final JLabel statusLabel = new JLabel("Press Start to begin...");
    
    public NQueensVisualizer() {
        // This is the Setup Crew. It builds the window, paints the chessboard pattern (alternating white/gray), and adds the buttons (Start, Pause, Reset).
        for(int i=0; i<N; i++) queens[i] = -1;

        setTitle("DAA Lab: N-Queens Backtracking Simulation");
        setSize(700, 750);
        setDefaultCloseOperation(EXIT_ON_CLOSE);
        setLayout(new BorderLayout());

        // 1. Grid Panel
        JPanel grid = new JPanel(new GridLayout(N, N));
        for (int r = 0; r < N; r++) {
            for (int c = 0; c < N; c++) {
                cells[r][c] = new JButton();
                cells[r][c].setBackground((r + c) % 2 == 0 ? new Color(240, 240, 240) : new Color(200, 200, 200));
                cells[r][c].setFont(new Font("Serif", Font.BOLD, 24));
                grid.add(cells[r][c]);
            }
        }

        // 2. Control Panel
        JPanel controls = new JPanel();
        JButton startBtn = new JButton("Start/Resume");
        JButton pauseBtn = new JButton("Pause");
        JButton resetBtn = new JButton("Reset");
        JSlider speedSlider = new JSlider(100, 1000, 500);

        controls.add(startBtn);
        controls.add(pauseBtn);
        controls.add(resetBtn);
        controls.add(new JLabel("Delay (ms):"));
        controls.add(speedSlider);

        add(grid, BorderLayout.CENTER);
        add(controls, BorderLayout.SOUTH);
        add(statusLabel, BorderLayout.NORTH);

        // 3. Logic - The Step-by-Step Backtracker
        // Every few milliseconds, it "ticks" and tells the computer to run the next step of the algorithm. Without this, the computer would solve the puzzle in a split second, and you wouldn't see the animation.
        timer = new Timer(speedSlider.getValue(), e -> {
            if (currentRow >= N) {
                timer.stop();
                statusLabel.setText("Solution Found!");
                return;
            }
            solveStep();
        });

        speedSlider.addChangeListener(e -> timer.setDelay(speedSlider.getValue()));
        startBtn.addActionListener(e -> timer.start());
        pauseBtn.addActionListener(e -> timer.stop());
        resetBtn.addActionListener(e -> resetBoard());

        setVisible(true);
    }

    private void solveStep() {
    int col = queens[currentRow] + 1;
    
    // Clear current row visual
    if (queens[currentRow] != -1) {
        cells[currentRow][queens[currentRow]].setText("");
        cells[currentRow][queens[currentRow]].setBackground(getTileColor(currentRow, queens[currentRow]));
    }

    while (col < N) {
        if (isSafe(currentRow, col)) {
            queens[currentRow] = col;
            
            // Using the solid Chess Queen Unicode
            cells[currentRow][col].setText("\u265B"); 
            cells[currentRow][col].setForeground(new Color(50, 50, 50)); // Dark color for the queen
            
            currentRow++;
            statusLabel.setText("Placing Queen at Row " + (currentRow - 1));
            return;
        } else {
            // Flash conflict visually (Red/Pink)
            cells[currentRow][col].setBackground(new Color(255, 150, 150));
            col++;
        }
    }

    // Backtrack Logic
    queens[currentRow] = -1;
    currentRow--;
    statusLabel.setText("No safe spot! Backtracking to row " + currentRow);
    
    if (currentRow < 0) {
        timer.stop();
        JOptionPane.showMessageDialog(this, "Simulation Finished!");
    }
}

    private boolean isSafe(int r, int c) {
        // Before a queen is placed, it checks three things:
        // 1.  Is there a queen already in this column?
        // 2. Is there a queen on the upward-left diagonal?
        // 3. Is there a queen on the upward-right diagonal?
        // If any are true, it says "False" (Illegal move).
        for (int i = 0; i < r; i++) {
            if (queens[i] == c || Math.abs(queens[i] - c) == Math.abs(i - r)) return false;
        }
        return true;
    }

    private Color getTileColor(int r, int c) {
        return (r + c) % 2 == 0 ? new Color(240, 240, 240) : new Color(200, 200, 200);
    }

    private void resetBoard() {
        timer.stop();
        currentRow = 0;
        for (int i = 0; i < N; i++) {
            queens[i] = -1;
            for (int j = 0; j < N; j++) {
                cells[i][j].setText("");
                cells[i][j].setBackground(getTileColor(i, j));
            }
        }
        statusLabel.setText("Board Reset.");
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(NQueensVisualizer::new);
    }
}
