package ui;

import javax.swing.*;
import java.awt.*;

/**
 * ============================================================
 *  MainFrame.java — Top-Level Application Window
 * ============================================================
 *  This is the JFrame that holds everything together.
 *  It creates the main window, sets its size/title/icon,
 *  and adds the MainPanel which contains all sub-panels.
 * ============================================================
 */
public class MainFrame extends JFrame {

    // ── Constructor ──────────────────────────────────────────
    public MainFrame() {
        initFrame();
    }

    /**
     * Configure the JFrame properties and add the main panel.
     */
    private void initFrame() {
        // Window title shown in the title bar
        setTitle("String Matching Algorithm Visualizer");

        // Close the app when the X button is clicked
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // Fixed size — feels like a structured visualizer tool
        setSize(1050, 780);

        // Center the window on screen
        setLocationRelativeTo(null);

        // Prevent resizing so layout stays intact
        setResizable(false);

        // Set a clean background
        getContentPane().setBackground(new Color(240, 242, 245));

        // ── Add the main panel ────────────────────────────────
        // MainPanel contains: InputPanel + VisualizationPanel + InfoPanel
        MainPanel mainPanel = new MainPanel();
        add(mainPanel);

        // Apply the layout to the frame
        pack();

        // Re-center after pack() recalculates preferred sizes
        setLocationRelativeTo(null);
    }
}
