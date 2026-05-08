package ui;

import algorithms.AlgorithmStep;
import javax.swing.*;
import javax.swing.border.TitledBorder;
import java.awt.*;
import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================
 *  InfoPanel.java — Bottom Statistics & Explanation Panel
 * ============================================================
 *  Contains three sub-sections side by side:
 *
 *   ┌──────────────────┬──────────────────┬────────────────┐
 *   │  Stats           │  Algorithm       │  LPS Table /   │
 *   │  - Comparisons   │  Description     │  Bar Chart     │
 *   │  - Matches found │                  │                │
 *   │  - Current shift │                  │                │
 *   └──────────────────┴──────────────────┴────────────────┘
 * ============================================================
 */
public class InfoPanel extends JPanel {

    // ── Stat labels (updated live during animation) ───────────
    private JLabel comparisonCountLabel; // total comparisons so far
    private JLabel matchCountLabel;       // how many full matches found
    private JLabel shiftLabel;            // current pattern shift position

    // ── Algorithm explanation text ────────────────────────────
    private JTextArea explanationArea;

    // ── LPS panel (shown for KMP only) ────────────────────────
    private LPSPanel lpsPanel;
    private JPanel   lpsContainer;

    // ── Bar chart panel (comparison counts per algorithm) ─────
    private BarChartPanel barChartPanel;

    // ── Running totals ────────────────────────────────────────
    private int totalComparisons = 0;
    private int totalMatches     = 0;

    // Constructor
    public InfoPanel() {
        initComponents();
    }

    private void initComponents() {
        setLayout(new GridLayout(1, 3, 8, 0)); // 3 equal columns
        setBackground(new Color(240, 242, 245));
        setBorder(BorderFactory.createEmptyBorder(4, 0, 0, 0));
        setPreferredSize(new Dimension(1030, 200));

        add(buildStatsPanel());
        add(buildExplanationPanel());
        add(buildRightPanel());
    }

    // ── Stats Panel ───────────────────────────────────────────

    private JPanel buildStatsPanel() {
        JPanel p = makeCard("Statistics");
        p.setLayout(new GridLayout(5, 1, 0, 6));

        comparisonCountLabel = makeStatLabel("Total Comparisons: 0");
        matchCountLabel      = makeStatLabel("Pattern Found: 0 time(s)");
        shiftLabel           = makeStatLabel("Current Shift: —");

        // Color legend
        JPanel legend = buildColorLegend();

        p.add(comparisonCountLabel);
        p.add(matchCountLabel);
        p.add(shiftLabel);
        p.add(new JSeparator());
        p.add(legend);
        return p;
    }

    /** Build a small color key that explains the highlight colors. */
    private JPanel buildColorLegend() {
        JPanel p = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 0));
        p.setOpaque(false);
        p.add(colorDot(new Color(100, 160, 240))); p.add(tinyLabel("Comparing"));
        p.add(colorDot(new Color(80,  185, 100))); p.add(tinyLabel("Match"));
        p.add(colorDot(new Color(230, 80,  70)));  p.add(tinyLabel("Mismatch"));
        p.add(colorDot(new Color(255, 170, 30)));  p.add(tinyLabel("Found"));
        return p;
    }

    private JLabel colorDot(Color c) {
        JLabel l = new JLabel("●");
        l.setForeground(c);
        l.setFont(new Font("Monospaced", Font.PLAIN, 14));
        return l;
    }

    private JLabel tinyLabel(String t) {
        JLabel l = new JLabel(t);
        l.setFont(new Font("Segoe UI", Font.PLAIN, 11));
        l.setForeground(new Color(80, 80, 100));
        return l;
    }

    // ── Explanation Panel ────────────────────────────────────

    private JPanel buildExplanationPanel() {
        JPanel p = makeCard("Algorithm Explanation");
        p.setLayout(new BorderLayout());

        explanationArea = new JTextArea();
        explanationArea.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        explanationArea.setLineWrap(true);
        explanationArea.setWrapStyleWord(true);
        explanationArea.setEditable(false);
        explanationArea.setOpaque(false);
        explanationArea.setForeground(new Color(50, 55, 70));
        explanationArea.setText(getExplanationText(InputPanel.NAIVE)); // default

        JScrollPane scroll = new JScrollPane(explanationArea);
        scroll.setBorder(null);
        scroll.setOpaque(false);
        scroll.getViewport().setOpaque(false);
        p.add(scroll, BorderLayout.CENTER);
        return p;
    }

    // ── Right Panel: LPS or Bar Chart ─────────────────────────

    private JPanel buildRightPanel() {
        JPanel outer = new JPanel(new CardLayout());
        outer.setOpaque(false);

        // LPS container (visible only for KMP)
        lpsContainer = makeCard("KMP — LPS Array");
        lpsContainer.setLayout(new BorderLayout());
        lpsPanel = new LPSPanel();
        lpsContainer.add(lpsPanel, BorderLayout.CENTER);

        // Bar chart (always available)
        JPanel chartCard = makeCard("Comparisons Chart");
        chartCard.setLayout(new BorderLayout());
        barChartPanel = new BarChartPanel();
        chartCard.add(barChartPanel, BorderLayout.CENTER);

        outer.add(lpsContainer, "lps");
        outer.add(chartCard,    "chart");

        // Start showing bar chart by default
        ((CardLayout) outer.getLayout()).show(outer, "chart");

        // Keep a reference so we can switch later
        this.lpsContainer = outer; // reuse field to hold the outer card container
        this.barChartPanel = barChartPanel;

        return outer;
    }

    // ── Public API (called from VisualizationPanel) ───────────

    /**
     * Update stats display on each animation step.
     */
    public void updateStats(AlgorithmStep step) {
        totalComparisons++;
        if (step.foundAt >= 0) {
            totalMatches++;
        }

        comparisonCountLabel.setText("Total Comparisons: " + totalComparisons);
        matchCountLabel.setText("Pattern Found: " + totalMatches + " time(s)");
        shiftLabel.setText("Current Shift: " + step.patternOffset);

        // Update bar chart with running comparison count
        barChartPanel.update(totalComparisons);
    }

    /** Reset all stats (called on Reset). */
    public void resetStats() {
        totalComparisons = 0;
        totalMatches     = 0;
        comparisonCountLabel.setText("Total Comparisons: 0");
        matchCountLabel.setText("Pattern Found: 0 time(s)");
        shiftLabel.setText("Current Shift: —");
        barChartPanel.reset();
    }

    /** Update the explanation text for the selected algorithm. */
    public void updateExplanation(String algo) {
        explanationArea.setText(getExplanationText(algo));
        explanationArea.setCaretPosition(0); // scroll to top
    }

    /** Show the LPS table panel (KMP only). */
    public void showLPSTable(String pattern) {
        if (lpsContainer instanceof JPanel) {
            CardLayout cl = (CardLayout) lpsContainer.getLayout();
            cl.show(lpsContainer, "lps");
            lpsPanel.buildTable(pattern);
        }
    }

    /** Hide LPS table and show bar chart. */
    public void hideLPSTable() {
        if (lpsContainer instanceof JPanel) {
            CardLayout cl = (CardLayout) lpsContainer.getLayout();
            cl.show(lpsContainer, "chart");
        }
    }

    // ── Algorithm explanations ────────────────────────────────

    /**
     * Return a short paragraph explaining the selected algorithm.
     * Shown in the middle panel — helps in viva.
     */
    private String getExplanationText(String algo) {
        switch (algo) {
            case InputPanel.NAIVE:
                return "NAIVE ALGORITHM\n\n" +
                       "The Naive (Brute Force) approach checks every possible position " +
                       "in the text. For each position i, it compares the pattern " +
                       "character-by-character against the text starting at i.\n\n" +
                       "If a mismatch is found at any position, the pattern shifts " +
                       "right by 1 and comparison restarts from the beginning.\n\n" +
                       "Time Complexity: O((n - m + 1) × m)\n" +
                       "Space Complexity: O(1)\n\n" +
                       "Drawback: Re-checks characters already known to match.";

            case InputPanel.KMP:
                return "KMP ALGORITHM\n\n" +
                       "The Knuth-Morris-Pratt algorithm avoids re-examining characters " +
                       "already matched. It pre-processes the pattern to build an LPS " +
                       "(Longest Proper Prefix which is also Suffix) array.\n\n" +
                       "On a mismatch, instead of shifting by 1, it uses the LPS array " +
                       "to skip several positions at once, never moving the text pointer " +
                       "backward.\n\n" +
                       "Time Complexity: O(n + m)\n" +
                       "Space Complexity: O(m) for LPS array\n\n" +
                       "Advantage: Significantly fewer comparisons than Naive.";

            case InputPanel.RABIN_KARP:
                return "RABIN-KARP ALGORITHM\n\n" +
                       "Uses hashing to quickly eliminate positions where the pattern " +
                       "cannot match. A rolling hash is computed for each window of " +
                       "text the same length as the pattern.\n\n" +
                       "If the hash values match, a character-by-character verification " +
                       "is done (to handle hash collisions). The hash is updated " +
                       "efficiently in O(1) using a 'rolling' technique.\n\n" +
                       "Time Complexity: O(n + m) average, O(nm) worst case\n" +
                       "Space Complexity: O(1)\n\n" +
                       "Best suited for multiple pattern searches.";

            default:
                return "";
        }
    }

    // ── Helpers ───────────────────────────────────────────────

    /** Make a white card panel with a titled border. */
    private JPanel makeCard(String title) {
        JPanel p = new JPanel();
        p.setBackground(Color.WHITE);
        p.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(210, 215, 220), 1, true),
            BorderFactory.createEmptyBorder(8, 10, 8, 10)
        ));
        TitledBorder tb = BorderFactory.createTitledBorder(
            BorderFactory.createLineBorder(new Color(210, 215, 220), 1, true),
            title,
            TitledBorder.LEFT, TitledBorder.TOP,
            new Font("Segoe UI", Font.BOLD, 11),
            new Color(100, 110, 140)
        );
        p.setBorder(tb);
        return p;
    }

    private JLabel makeStatLabel(String text) {
        JLabel l = new JLabel(text);
        l.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        l.setForeground(new Color(40, 50, 70));
        return l;
    }
}
