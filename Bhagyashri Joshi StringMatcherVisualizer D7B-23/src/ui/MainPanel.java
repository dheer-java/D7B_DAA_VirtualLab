package ui;

import javax.swing.*;
import java.awt.*;

/**
 * ============================================================
 *  MainPanel.java — Master Layout Panel
 * ============================================================
 *  Assembles the three major sections of the UI:
 *
 *   ┌─────────────────────────────────────┐
 *   │  InputPanel  (top)                  │  ← text/pattern inputs, controls
 *   ├─────────────────────────────────────┤
 *   │  VisualizationPanel  (middle)       │  ← animated cell grid
 *   ├─────────────────────────────────────┤
 *   │  InfoPanel  (bottom)                │  ← stats, algo description, LPS
 *   └─────────────────────────────────────┘
 * ============================================================
 */
public class MainPanel extends JPanel {

    // ── Child panels ─────────────────────────────────────────
    private InputPanel        inputPanel;
    private VisualizationPanel visualizationPanel;
    private InfoPanel          infoPanel;

    // ── Constructor ──────────────────────────────────────────
    public MainPanel() {
        initLayout();
    }

    /**
     * Build the vertical stack layout and wire panels together.
     */
    private void initLayout() {
        // BorderLayout so we can stack North / Center / South
        setLayout(new BorderLayout(0, 6));
        setBackground(new Color(240, 242, 245));
        setBorder(BorderFactory.createEmptyBorder(10, 10, 10, 10));

        // ── 1. Create sub-panels ──────────────────────────────
        infoPanel          = new InfoPanel();
        visualizationPanel = new VisualizationPanel(infoPanel);
        inputPanel         = new InputPanel(visualizationPanel);

        // ── 2. Add to layout ──────────────────────────────────
        add(inputPanel,         BorderLayout.NORTH);   // inputs + buttons
        add(visualizationPanel, BorderLayout.CENTER);  // animation area
        add(infoPanel,          BorderLayout.SOUTH);   // stats + explanation
    }
}
