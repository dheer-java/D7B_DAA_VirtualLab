package ui;

import algorithms.AlgorithmStep;
import algorithms.NaiveAlgorithm;
import algorithms.KMPAlgorithm;
import algorithms.RabinKarpAlgorithm;

import javax.swing.*;
import java.awt.*;
import java.util.List;

/**
 * ============================================================
 *  VisualizationPanel.java — The Animation Canvas
 * ============================================================
 *  This panel is the heart of the visualizer.
 *  It does the following:
 *
 *  1. Accepts a text, pattern, and algorithm name.
 *  2. Calls the selected algorithm to get a list of
 *     AlgorithmStep objects (each step = one comparison).
 *  3. Uses javax.swing.Timer to advance one step per tick,
 *     updating the highlight state.
 *  4. Paints each character of text and pattern as a colored
 *     cell using Graphics2D inside paintComponent().
 *
 *  Color scheme:
 *    BLUE   → characters currently being compared
 *    GREEN  → matched characters
 *    RED    → mismatch
 *    ORANGE → full pattern match found
 *    WHITE  → idle / not yet visited
 * ============================================================
 */
public class VisualizationPanel extends JPanel {

    // ── Layout constants ──────────────────────────────────────
    private static final int CELL_SIZE   = 38;  // width + height of each character cell
    private static final int CELL_GAP    = 4;   // gap between cells
    private static final int TEXT_Y      = 60;  // y-position of text row
    private static final int PATTERN_Y   = 140; // y-position of pattern row (shifts)
    private static final int INDEX_Y_TOP = 20;  // y-position of index numbers (above text)

    // ── Animation state ───────────────────────────────────────
    private String text    = "";      // the haystack
    private String pattern = "";      // the needle
    private List<AlgorithmStep> steps; // all steps pre-computed by algorithm
    private int currentStep = -1;     // which step we're displaying now
    private AlgorithmStep activeStep; // the current step's display data
    private Timer animTimer;          // Swing Timer that drives animation
    private boolean isPaused = false; // pause flag
    private int animDelayMs  = 600;   // milliseconds between steps

    // ── Reference to info panel for live updates ──────────────
    private final InfoPanel infoPanel;

    // ── Colors ────────────────────────────────────────────────
    // Text cells
    private static final Color COLOR_TEXT_BG        = new Color(245, 247, 250);
    private static final Color COLOR_TEXT_BORDER     = new Color(180, 190, 200);
    // Pattern cells
    private static final Color COLOR_PATTERN_BG     = new Color(230, 240, 255);
    private static final Color COLOR_PATTERN_BORDER  = new Color(140, 160, 200);
    // Highlight states
    private static final Color COLOR_COMPARING       = new Color(100, 160, 240);  // blue
    private static final Color COLOR_MATCH           = new Color(80,  185, 100);  // green
    private static final Color COLOR_MISMATCH        = new Color(230, 80,  70);   // red
    private static final Color COLOR_FOUND           = new Color(255, 170, 30);   // orange/gold
    // Row labels
    private static final Color COLOR_LABEL           = new Color(100, 110, 130);
    // Index numbers
    private static final Color COLOR_INDEX           = new Color(160, 170, 180);

    // ── Constructor ──────────────────────────────────────────
    public VisualizationPanel(InfoPanel infoPanel) {
        this.infoPanel = infoPanel;
        setPreferredSize(new Dimension(1030, 260));
        setBackground(new Color(252, 253, 255));
        setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(210, 215, 220), 1, true),
            BorderFactory.createEmptyBorder(8, 8, 8, 8)
        ));
    }

    // ── Public API ────────────────────────────────────────────

    /**
     * Called by InputPanel's Start button.
     * Runs the selected algorithm and begins animation.
     *
     * @param text    The main (haystack) string
     * @param pattern The pattern (needle) string
     * @param algo    Algorithm name constant from InputPanel
     */
    public void startVisualization(String text, String pattern, String algo) {
        // Store for painting
        this.text    = text;
        this.pattern = pattern;
        this.currentStep = -1;
        this.activeStep  = null;

        // ── 1. Run the algorithm to collect all steps ─────────
        // Each algorithm returns a List<AlgorithmStep> that records
        // exactly what comparisons happened and their outcome.
        switch (algo) {
            case InputPanel.NAIVE:
                steps = NaiveAlgorithm.run(text, pattern);
                break;
            case InputPanel.KMP:
                steps = KMPAlgorithm.run(text, pattern);
                infoPanel.showLPSTable(pattern); // KMP special: show LPS array
                break;
            case InputPanel.RABIN_KARP:
                steps = RabinKarpAlgorithm.run(text, pattern);
                break;
            default:
                steps = NaiveAlgorithm.run(text, pattern);
        }

        // Update info panel with algorithm explanation
        infoPanel.updateExplanation(algo);
        infoPanel.resetStats();

        // ── 2. Start the Swing Timer ──────────────────────────
        // The Timer fires every animDelayMs milliseconds.
        // Each tick calls advanceStep() which moves one step forward.
        if (animTimer != null && animTimer.isRunning()) {
            animTimer.stop();
        }
        animTimer = new Timer(animDelayMs, e -> advanceStep());
        animTimer.start();

        repaint();
    }

    /**
     * Toggle pause/resume. Returns true if now paused.
     */
    public boolean togglePause() {
        isPaused = !isPaused;
        if (isPaused) {
            animTimer.stop();
        } else {
            animTimer.start();
        }
        return isPaused;
    }

    /**
     * Stop animation and clear the canvas.
     */
    public void resetVisualization() {
        if (animTimer != null) animTimer.stop();
        text        = "";
        pattern     = "";
        steps       = null;
        currentStep = -1;
        activeStep  = null;
        isPaused    = false;
        infoPanel.resetStats();
        infoPanel.hideLPSTable();
        repaint();
    }

    /**
     * Update animation speed from the speed slider.
     * Slider value 1–10 maps to delay 1000ms–50ms (inverted).
     *
     * @param sliderValue 1 (slowest) to 10 (fastest)
     */
    public void setAnimationSpeed(int sliderValue) {
        // Map: slider 1 → 1000ms, slider 10 → 50ms
        animDelayMs = 1050 - (sliderValue * 100);
        if (animTimer != null) {
            animTimer.setDelay(animDelayMs);
        }
    }

    /** Expose the info panel so InputPanel can call updateExplanation. */
    public InfoPanel getInfoPanel() {
        return infoPanel;
    }

    // ── Animation Logic ───────────────────────────────────────

    /**
     * Advance one step in the algorithm visualization.
     * Called by the Swing Timer on each tick.
     */
    private void advanceStep() {
        if (steps == null || currentStep >= steps.size() - 1) {
            // All steps done — stop the timer
            animTimer.stop();
            notifyParentComplete();
            return;
        }

        // Move to next step
        currentStep++;
        activeStep = steps.get(currentStep);

        // Update comparison counter and match results in the info panel
        infoPanel.updateStats(activeStep);

        // Trigger a repaint so paintComponent() draws the new state
        repaint();
    }

    /**
     * Walk up the component tree to find InputPanel and call onAnimationComplete().
     * This re-enables the Start button when the animation finishes.
     */
    private void notifyParentComplete() {
        Container parent = getParent(); // MainPanel
        if (parent == null) return;
        parent = parent.getParent();    // JFrame content pane
        if (parent == null) return;
        // InputPanel is nested inside MainPanel, find it
        for (Component c : ((JPanel) getParent()).getComponents()) {
            if (c instanceof InputPanel) {
                ((InputPanel) c).onAnimationComplete();
                return;
            }
        }
    }

    // ── Painting ─────────────────────────────────────────────

    /**
     * Main paint method — called by Swing whenever repaint() is triggered.
     *
     * Drawing order:
     *  1. Background
     *  2. Index row (0, 1, 2 … above text)
     *  3. "Text" label
     *  4. Text character cells (with highlights)
     *  5. "Pattern" label
     *  6. Pattern character cells (shifted to current alignment)
     *  7. Status message at bottom
     */
    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g); // clear background

        // Use Graphics2D for anti-aliasing
        Graphics2D g2 = (Graphics2D) g;
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);
        g2.setRenderingHint(RenderingHints.KEY_TEXT_ANTIALIASING, RenderingHints.VALUE_TEXT_ANTIALIAS_ON);

        if (text.isEmpty()) {
            // Draw a friendly placeholder message
            drawPlaceholder(g2);
            return;
        }

        // Calculate left margin to center the text row
        int totalWidth  = text.length() * (CELL_SIZE + CELL_GAP) - CELL_GAP;
        int startX      = (getWidth() - totalWidth) / 2;

        drawIndexRow(g2, startX);
        drawTextRow(g2, startX);

        if (activeStep != null) {
            drawPatternRow(g2, startX);
            drawStatusMessage(g2);
        }
    }

    /**
     * Draw tiny index numbers (0, 1, 2 …) above each text cell.
     */
    private void drawIndexRow(Graphics2D g2, int startX) {
        g2.setFont(new Font("Monospaced", Font.PLAIN, 10));
        g2.setColor(COLOR_INDEX);
        for (int i = 0; i < text.length(); i++) {
            int x = startX + i * (CELL_SIZE + CELL_GAP);
            // Center the number over the cell
            String idx = String.valueOf(i);
            FontMetrics fm = g2.getFontMetrics();
            int tw = fm.stringWidth(idx);
            g2.drawString(idx, x + (CELL_SIZE - tw) / 2, INDEX_Y_TOP);
        }
    }

    /**
     * Draw the main text row with per-character background highlight.
     *
     * Highlight logic:
     *  - If this text index is in the current step's "comparing" range → COLOR_COMPARING
     *  - If it's marked as a "match"  → COLOR_MATCH
     *  - If it's marked as "mismatch" → COLOR_MISMATCH
     *  - If it's part of a full "found" match → COLOR_FOUND
     *  - Otherwise → default COLOR_TEXT_BG
     */
    private void drawTextRow(Graphics2D g2, int startX) {
        // "Text" row label
        g2.setFont(new Font("Segoe UI", Font.BOLD, 12));
        g2.setColor(COLOR_LABEL);
        g2.drawString("TEXT", startX - 48, TEXT_Y + CELL_SIZE / 2 + 5);

        for (int i = 0; i < text.length(); i++) {
            int x = startX + i * (CELL_SIZE + CELL_GAP);
            Color bg = getTextCellColor(i);
            drawCell(g2, x, TEXT_Y, String.valueOf(text.charAt(i)), bg, COLOR_TEXT_BORDER);
        }
    }

    /**
     * Determine what background color to use for a text cell at position i.
     */
    private Color getTextCellColor(int i) {
        if (activeStep == null) return COLOR_TEXT_BG;

        // Check if this index is in a full-pattern match highlight
        if (activeStep.foundAt >= 0) {
            if (i >= activeStep.foundAt && i < activeStep.foundAt + pattern.length()) {
                return COLOR_FOUND;
            }
        }

        // Check if comparing
        if (activeStep.textCompareIndices != null) {
            for (int idx : activeStep.textCompareIndices) {
                if (idx == i) {
                    // Determine color from step outcome at this position
                    return activeStep.isMatch ? COLOR_MATCH : COLOR_MISMATCH;
                }
            }
        }

        return COLOR_TEXT_BG;
    }

    /**
     * Draw the pattern row, shifted right by patternOffset cells.
     * This makes the pattern appear "sliding" under the text row.
     */
    private void drawPatternRow(Graphics2D g2, int startX) {
        if (activeStep == null) return;

        // "Pattern" label
        g2.setFont(new Font("Segoe UI", Font.BOLD, 12));
        g2.setColor(COLOR_LABEL);
        g2.drawString("PATTERN", startX - 62, PATTERN_Y + CELL_SIZE / 2 + 5);

        // The offset is how many cells the pattern is shifted right
        int offset = activeStep.patternOffset;

        for (int j = 0; j < pattern.length(); j++) {
            // x-position = text start + shift + pattern character position
            int x = startX + (offset + j) * (CELL_SIZE + CELL_GAP);

            Color bg = getPatternCellColor(j);
            drawCell(g2, x, PATTERN_Y, String.valueOf(pattern.charAt(j)), bg, COLOR_PATTERN_BORDER);
        }

        // Draw a small "shift indicator" arrow below the pattern
        drawShiftArrow(g2, startX, offset);
    }

    /**
     * Determine the background color for a pattern cell at position j.
     */
    private Color getPatternCellColor(int j) {
        if (activeStep == null) return COLOR_PATTERN_BG;

        // Full match → all cells orange
        if (activeStep.foundAt >= 0) return COLOR_FOUND;

        // Is this pattern position currently being compared?
        if (activeStep.patternCompareIndex == j) {
            return activeStep.isMatch ? COLOR_MATCH : COLOR_MISMATCH;
        }

        // Was it already matched (prefix already verified)?
        if (j < activeStep.patternCompareIndex) {
            return COLOR_MATCH; // previously matched characters
        }

        return COLOR_PATTERN_BG;
    }

    /**
     * Draw a small downward arrow with "shift=N" text below the pattern.
     * This labels the current position of the pattern window.
     */
    private void drawShiftArrow(Graphics2D g2, int startX, int offset) {
        int arrowX = startX + offset * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2;
        int arrowY = PATTERN_Y + CELL_SIZE + 8;

        g2.setColor(new Color(120, 130, 160));
        g2.setFont(new Font("Segoe UI", Font.ITALIC, 11));
        g2.drawString("shift=" + offset, arrowX - 18, arrowY + 12);
    }

    /**
     * Draw a status message at the bottom of the panel showing what just happened.
     */
    private void drawStatusMessage(Graphics2D g2) {
        if (activeStep == null) return;

        String msg;
        Color  color;

        if (activeStep.foundAt >= 0) {
            // Pattern was found
            msg   = "✔  Pattern found at index " + activeStep.foundAt + "!";
            color = new Color(30, 130, 60);
        } else if (activeStep.isMatch && activeStep.patternCompareIndex == pattern.length() - 1) {
            msg   = "Checking position " + activeStep.patternOffset + " — comparing…";
            color = new Color(40, 90, 180);
        } else if (!activeStep.isMatch) {
            // Mismatch at this step
            msg   = "✗  Mismatch at text[" +
                    (activeStep.patternOffset + activeStep.patternCompareIndex) +
                    "] vs pattern[" + activeStep.patternCompareIndex + "] — shift pattern";
            color = new Color(170, 50, 40);
        } else {
            msg   = "✓  Match: text[" +
                    (activeStep.patternOffset + activeStep.patternCompareIndex) +
                    "] == pattern[" + activeStep.patternCompareIndex + "]";
            color = new Color(30, 130, 60);
        }

        // Draw centered at the bottom of the panel
        g2.setFont(new Font("Segoe UI", Font.BOLD, 13));
        g2.setColor(color);
        FontMetrics fm = g2.getFontMetrics();
        int x = (getWidth() - fm.stringWidth(msg)) / 2;
        g2.drawString(msg, x, PATTERN_Y + CELL_SIZE + 40);
    }

    /**
     * Draw a single character cell (rectangle + centered letter).
     *
     * @param g2     Graphics context
     * @param x      Top-left x
     * @param y      Top-left y
     * @param ch     The character to draw inside
     * @param bg     Background fill color
     * @param border Border color
     */
    private void drawCell(Graphics2D g2, int x, int y, String ch, Color bg, Color border) {
        // Fill
        g2.setColor(bg);
        g2.fillRoundRect(x, y, CELL_SIZE, CELL_SIZE, 6, 6);

        // Border
        g2.setColor(border);
        g2.setStroke(new BasicStroke(1.2f));
        g2.drawRoundRect(x, y, CELL_SIZE, CELL_SIZE, 6, 6);

        // Character — centered in the cell
        g2.setFont(new Font("Monospaced", Font.BOLD, 16));
        g2.setColor(new Color(30, 35, 50));
        FontMetrics fm = g2.getFontMetrics();
        int charX = x + (CELL_SIZE - fm.stringWidth(ch)) / 2;
        int charY = y + (CELL_SIZE + fm.getAscent() - fm.getDescent()) / 2;
        g2.drawString(ch, charX, charY);
    }

    /**
     * Draw a friendly placeholder when no visualization has started yet.
     */
    private void drawPlaceholder(Graphics2D g2) {
        g2.setFont(new Font("Segoe UI", Font.PLAIN, 15));
        g2.setColor(new Color(170, 180, 200));
        String msg = "Enter text and pattern above, then click  ▶ Start";
        FontMetrics fm = g2.getFontMetrics();
        g2.drawString(msg,
            (getWidth() - fm.stringWidth(msg)) / 2,
            getHeight() / 2);
    }
}
