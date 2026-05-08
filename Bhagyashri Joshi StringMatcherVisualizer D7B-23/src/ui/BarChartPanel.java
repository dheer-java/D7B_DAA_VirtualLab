package ui;

import javax.swing.*;
import java.awt.*;

/**
 * ============================================================
 *  BarChartPanel.java — Live Comparison Counter Bar Chart
 * ============================================================
 *  Draws a simple animated bar that grows taller as more
 *  comparisons are made. This visually represents the
 *  "efficiency" of the chosen algorithm.
 *
 *  We use a single growing bar for the current run.
 *  The bar is drawn using Graphics2D directly (no JFreeChart
 *  dependency needed).
 * ============================================================
 */
public class BarChartPanel extends JPanel {

    // ── State ─────────────────────────────────────────────────
    private int currentCount  = 0;   // current comparison count
    private int maxCount      = 100; // auto-scaling max for the bar

    // ── Colors ────────────────────────────────────────────────
    private static final Color BAR_COLOR   = new Color(70, 130, 200);
    private static final Color BAR_BORDER  = new Color(40, 90, 160);
    private static final Color AXIS_COLOR  = new Color(160, 170, 185);
    private static final Color LABEL_COLOR = new Color(80, 90, 110);

    // ── Constructor ──────────────────────────────────────────
    public BarChartPanel() {
        setOpaque(false);
        setPreferredSize(new Dimension(200, 140));
    }

    /**
     * Called on each animation step to increment the bar height.
     *
     * @param count Total comparisons so far
     */
    public void update(int count) {
        currentCount = count;
        // Auto-scale: if bar reaches 80% of max, double the max
        if (currentCount > maxCount * 0.8) {
            maxCount = (int) (maxCount * 1.5);
        }
        repaint();
    }

    /**
     * Reset the chart when Reset button is pressed.
     */
    public void reset() {
        currentCount = 0;
        maxCount     = 100;
        repaint();
    }

    /**
     * Draw the bar chart using Graphics2D.
     *
     * Layout:
     *   - Y-axis on the left with tick marks
     *   - One bar for the current algorithm run
     *   - Value label on top of the bar
     */
    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        Graphics2D g2 = (Graphics2D) g;
        g2.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        int W = getWidth();
        int H = getHeight();

        // ── Chart margins ─────────────────────────────────────
        int marginLeft   = 40;
        int marginBottom = 30;
        int marginTop    = 20;
        int marginRight  = 20;

        int chartH = H - marginTop - marginBottom;
        int chartW = W - marginLeft - marginRight;

        // ── Draw Y-axis ───────────────────────────────────────
        g2.setColor(AXIS_COLOR);
        g2.setStroke(new BasicStroke(1.0f));
        g2.drawLine(marginLeft, marginTop, marginLeft, marginTop + chartH);
        // X-axis baseline
        g2.drawLine(marginLeft, marginTop + chartH,
                    marginLeft + chartW, marginTop + chartH);

        // ── Y-axis tick marks and labels ──────────────────────
        g2.setFont(new Font("Segoe UI", Font.PLAIN, 9));
        g2.setColor(LABEL_COLOR);
        int ticks = 4;
        for (int i = 0; i <= ticks; i++) {
            int tickValue = (maxCount / ticks) * i;
            int tickY     = marginTop + chartH - (int)((double) tickValue / maxCount * chartH);
            g2.drawLine(marginLeft - 3, tickY, marginLeft, tickY);
            String label = String.valueOf(tickValue);
            FontMetrics fm = g2.getFontMetrics();
            g2.drawString(label, marginLeft - 6 - fm.stringWidth(label), tickY + 4);
        }

        // ── Draw the bar ──────────────────────────────────────
        if (currentCount > 0) {
            // Bar height proportional to currentCount / maxCount
            int barH = (int) ((double) currentCount / maxCount * chartH);
            int barW = Math.min(chartW - 10, 50); // fixed width bar
            int barX = marginLeft + (chartW - barW) / 2;
            int barY = marginTop + chartH - barH;

            // Filled rectangle
            g2.setColor(BAR_COLOR);
            g2.fillRoundRect(barX, barY, barW, barH, 4, 4);

            // Border
            g2.setColor(BAR_BORDER);
            g2.setStroke(new BasicStroke(1.2f));
            g2.drawRoundRect(barX, barY, barW, barH, 4, 4);

            // Count label on top of bar
            g2.setFont(new Font("Segoe UI", Font.BOLD, 11));
            g2.setColor(new Color(30, 60, 120));
            String countStr = String.valueOf(currentCount);
            FontMetrics fm  = g2.getFontMetrics();
            g2.drawString(countStr,
                barX + (barW - fm.stringWidth(countStr)) / 2,
                barY - 4);
        }

        // ── X-axis label ──────────────────────────────────────
        g2.setFont(new Font("Segoe UI", Font.PLAIN, 10));
        g2.setColor(LABEL_COLOR);
        g2.drawString("Comparisons", marginLeft + chartW / 2 - 28, H - 5);
    }
}
