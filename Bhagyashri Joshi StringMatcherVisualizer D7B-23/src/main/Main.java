package main;

import ui.MainFrame;
import javax.swing.SwingUtilities;

/**
 * ============================================================
 *  Main.java — Entry Point
 * ============================================================
 *  This is the starting point of the entire application.
 *  SwingUtilities.invokeLater() ensures the GUI is created
 *  on the Event Dispatch Thread (EDT), which is the correct
 *  way to start a Swing application safely.
 * ============================================================
 */
public class Main {

    public static void main(String[] args) {
        // Schedule GUI creation on the Swing Event Dispatch Thread
        SwingUtilities.invokeLater(() -> {
            // Create and show the main application window
            MainFrame frame = new MainFrame();
            frame.setVisible(true);
        });
    }
}
