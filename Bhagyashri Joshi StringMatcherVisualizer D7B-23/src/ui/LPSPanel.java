package ui;

import algorithms.KMPAlgorithm;
import javax.swing.*;
import javax.swing.table.*;
import java.awt.*;
import java.util.Arrays;

/**
 * ============================================================
 *  LPSPanel.java — KMP Longest Prefix Suffix Table
 * ============================================================
 *  This panel renders the LPS (Failure Function) array that
 *  KMP uses to avoid redundant comparisons.
 *
 *  Example for pattern "ABABC":
 *   Index :  0  1  2  3  4
 *   Pattern: A  B  A  B  C
 *   LPS   :  0  0  1  2  0
 *
 *  Meaning:
 *   lps[0] = 0 → no proper prefix that's also a suffix for "A"
 *   lps[2] = 1 → "A" is both prefix and suffix of "ABA"
 *   lps[3] = 2 → "AB" is both prefix and suffix of "ABAB"
 * ============================================================
 */
public class LPSPanel extends JPanel {

    // ── Constructor ──────────────────────────────────────────
    public LPSPanel() {
        setLayout(new BorderLayout());
        setOpaque(false);
    }

    /**
     * Build and display the LPS table for the given pattern.
     * Called when KMP is selected and Start is pressed.
     *
     * @param pattern The pattern string (already uppercase)
     */
    public void buildTable(String pattern) {
        removeAll(); // clear any previous table

        // ── 1. Compute the LPS array ──────────────────────────
        int[] lps = KMPAlgorithm.computeLPS(pattern);

        // ── 2. Build a JTable with 3 rows ─────────────────────
        //   Row 0: Index numbers  (0, 1, 2, …)
        //   Row 1: Pattern chars  (A, B, A, B, C)
        //   Row 2: LPS values     (0, 0, 1, 2, 0)
        int n = pattern.length();
        Object[][] data = new Object[3][n];

        for (int i = 0; i < n; i++) {
            data[0][i] = i;                              // index
            data[1][i] = String.valueOf(pattern.charAt(i)); // character
            data[2][i] = lps[i];                         // lps value
        }

        // Row headers (displayed as a separate column)
        String[] colHeaders = new String[n];
        Arrays.fill(colHeaders, "");
        JTable table = new JTable(data, colHeaders);

        // ── 3. Style the table ────────────────────────────────
        table.setFont(new Font("Monospaced", Font.BOLD, 13));
        table.setRowHeight(24);
        table.setGridColor(new Color(200, 210, 220));
        table.setShowGrid(true);
        table.setEnabled(false); // read-only
        table.setTableHeader(null); // hide column headers

        // Custom renderer to color each row differently
        table.setDefaultRenderer(Object.class, new DefaultTableCellRenderer() {
            @Override
            public Component getTableCellRendererComponent(
                    JTable t, Object value, boolean isSelected,
                    boolean hasFocus, int row, int column) {
                Component c = super.getTableCellRendererComponent(
                        t, value, isSelected, hasFocus, row, column);
                c.setFont(new Font("Monospaced", Font.BOLD, 12));
                ((JLabel) c).setHorizontalAlignment(CENTER);

                switch (row) {
                    case 0: // Index row → light gray
                        c.setBackground(new Color(235, 238, 242));
                        c.setForeground(new Color(110, 120, 140));
                        break;
                    case 1: // Pattern row → light blue
                        c.setBackground(new Color(225, 238, 255));
                        c.setForeground(new Color(30, 70, 150));
                        break;
                    case 2: // LPS row → color-coded by value
                        int val = (Integer) value;
                        if (val == 0) {
                            c.setBackground(new Color(250, 240, 240));
                            c.setForeground(new Color(160, 50, 50));
                        } else {
                            // Higher LPS values get darker green
                            int green = Math.max(120, 200 - val * 20);
                            c.setBackground(new Color(220, 245, 220));
                            c.setForeground(new Color(30, green / 2, 50));
                        }
                        break;
                }
                return c;
            }
        });

        // ── 4. Add row labels on the left ─────────────────────
        // A tiny non-editable panel with "Index / Char / LPS" labels
        JPanel rowLabels = new JPanel(new GridLayout(3, 1));
        rowLabels.setOpaque(false);
        String[] labels = { "Index", "Char", "LPS" };
        Color[]  lColors = {
            new Color(100, 110, 130),
            new Color(30,  70,  150),
            new Color(30,  110, 50)
        };
        for (int i = 0; i < 3; i++) {
            JLabel l = new JLabel(labels[i], SwingConstants.RIGHT);
            l.setFont(new Font("Segoe UI", Font.BOLD, 11));
            l.setForeground(lColors[i]);
            l.setBorder(BorderFactory.createEmptyBorder(0, 0, 0, 4));
            rowLabels.add(l);
        }

        // ── 5. Explanatory note below the table ───────────────
        JLabel note = new JLabel("LPS[i] = length of longest proper prefix = suffix for pattern[0..i]");
        note.setFont(new Font("Segoe UI", Font.ITALIC, 10));
        note.setForeground(new Color(130, 140, 160));

        JScrollPane scroll = new JScrollPane(table);
        scroll.setOpaque(false);
        scroll.getViewport().setOpaque(false);
        scroll.setBorder(null);

        add(rowLabels, BorderLayout.WEST);
        add(scroll,    BorderLayout.CENTER);
        add(note,      BorderLayout.SOUTH);

        revalidate();
        repaint();
    }
}
