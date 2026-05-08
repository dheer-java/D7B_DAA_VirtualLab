package ui;

import javax.swing.*;
import javax.swing.border.TitledBorder;
import java.awt.*;
import java.awt.event.ActionEvent;

/**
 * ============================================================
 *  InputPanel.java — Top Control Bar
 * ============================================================
 *  Contains:
 *   • Text input field        — the haystack string
 *   • Pattern input field     — the needle string
 *   • Algorithm dropdown      — Naive / KMP / Rabin-Karp
 *   • Speed slider            — controls animation delay
 *   • Start / Pause / Reset buttons
 * ============================================================
 */
public class InputPanel extends JPanel {

    // ── References ───────────────────────────────────────────
    private final VisualizationPanel vizPanel; // we'll call methods on this

    // ── Input components ─────────────────────────────────────
    private JTextField textField;     // main text input
    private JTextField patternField;  // pattern input
    private JComboBox<String> algoCombo; // algorithm selector
    private JSlider speedSlider;      // animation speed

    // ── Buttons ──────────────────────────────────────────────
    private JButton startBtn;
    private JButton pauseBtn;
    private JButton resetBtn;

    // ── Algorithm names shown in the dropdown ─────────────────
    public static final String NAIVE      = "Naive Algorithm";
    public static final String KMP        = "KMP Algorithm";
    public static final String RABIN_KARP = "Rabin-Karp Algorithm";

    // ── Constructor ──────────────────────────────────────────
    public InputPanel(VisualizationPanel vizPanel) {
        this.vizPanel = vizPanel;
        initComponents();
    }

    /**
     * Build and lay out all input components.
     */
    private void initComponents() {
        // Panel appearance
        setBackground(new Color(255, 255, 255));
        setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(210, 215, 220), 1, true),
            BorderFactory.createEmptyBorder(10, 14, 10, 14)
        ));
        setLayout(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets  = new Insets(4, 6, 4, 6);
        gbc.fill    = GridBagConstraints.HORIZONTAL;
        gbc.anchor  = GridBagConstraints.WEST;

        // ── Row 0: Text input ─────────────────────────────────
        gbc.gridx = 0; gbc.gridy = 0; gbc.weightx = 0;
        add(makeLabel("Main Text:"), gbc);

        textField = new JTextField("ABABDABACDABABCABAB", 28);
        styleTextField(textField);
        gbc.gridx = 1; gbc.weightx = 1.0; gbc.gridwidth = 3;
        add(textField, gbc);

        // ── Row 0: Algorithm label + dropdown ────────────────
        gbc.gridx = 4; gbc.weightx = 0; gbc.gridwidth = 1;
        add(makeLabel("Algorithm:"), gbc);

        algoCombo = new JComboBox<>(new String[]{ NAIVE, KMP, RABIN_KARP });
        algoCombo.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        algoCombo.setBackground(Color.WHITE);
        algoCombo.setPreferredSize(new Dimension(170, 30));
        // When algorithm changes, update the explanation panel immediately
        algoCombo.addActionListener(e ->
            vizPanel.getInfoPanel().updateExplanation((String) algoCombo.getSelectedItem())
        );
        gbc.gridx = 5;
        add(algoCombo, gbc);

        // ── Row 1: Pattern input ──────────────────────────────
        gbc.gridx = 0; gbc.gridy = 1; gbc.weightx = 0; gbc.gridwidth = 1;
        add(makeLabel("Pattern:"), gbc);

        patternField = new JTextField("ABABC", 18);
        styleTextField(patternField);
        gbc.gridx = 1; gbc.weightx = 1.0; gbc.gridwidth = 3;
        add(patternField, gbc);

        // ── Row 1: Speed label + slider ───────────────────────
        gbc.gridx = 4; gbc.weightx = 0; gbc.gridwidth = 1;
        add(makeLabel("Speed:"), gbc);

        // Slider: 1 = very slow (1000 ms delay), 10 = very fast (50 ms delay)
        speedSlider = new JSlider(1, 10, 4);
        speedSlider.setMajorTickSpacing(3);
        speedSlider.setMinorTickSpacing(1);
        speedSlider.setPaintTicks(true);
        speedSlider.setBackground(Color.WHITE);
        speedSlider.setToolTipText("Drag to control animation speed");
        // Update the Timer delay in real-time as slider moves
        speedSlider.addChangeListener(e ->
            vizPanel.setAnimationSpeed(speedSlider.getValue())
        );
        gbc.gridx = 5;
        add(speedSlider, gbc);

        // ── Row 2: Buttons ────────────────────────────────────
        JPanel btnPanel = buildButtonPanel();
        gbc.gridx = 0; gbc.gridy = 2; gbc.gridwidth = 6;
        gbc.fill  = GridBagConstraints.NONE;
        gbc.anchor = GridBagConstraints.CENTER;
        add(btnPanel, gbc);
    }

    /**
     * Create the Start / Pause / Reset button row.
     */
    private JPanel buildButtonPanel() {
        JPanel p = new JPanel(new FlowLayout(FlowLayout.CENTER, 12, 0));
        p.setBackground(Color.WHITE);

        // ── Start button ──────────────────────────────────────
        startBtn = makeButton("▶  Start", new Color(34, 139, 34));
        startBtn.addActionListener((ActionEvent e) -> {
            String text    = textField.getText().trim().toUpperCase();
            String pattern = patternField.getText().trim().toUpperCase();
            String algo    = (String) algoCombo.getSelectedItem();

            // Basic validation before starting
            if (text.isEmpty() || pattern.isEmpty()) {
                JOptionPane.showMessageDialog(this,
                    "Please enter both Text and Pattern.",
                    "Input Required", JOptionPane.WARNING_MESSAGE);
                return;
            }
            if (pattern.length() > text.length()) {
                JOptionPane.showMessageDialog(this,
                    "Pattern cannot be longer than the main text.",
                    "Invalid Input", JOptionPane.WARNING_MESSAGE);
                return;
            }
            if (text.length() > 40) {
                JOptionPane.showMessageDialog(this,
                    "Please keep text to 40 characters or fewer for best visualization.",
                    "Text Too Long", JOptionPane.WARNING_MESSAGE);
                return;
            }

            // Kick off the visualization
            vizPanel.startVisualization(text, pattern, algo);
            startBtn.setEnabled(false);
            pauseBtn.setEnabled(true);
        });

        // ── Pause / Resume button ─────────────────────────────
        pauseBtn = makeButton("⏸  Pause", new Color(200, 140, 0));
        pauseBtn.setEnabled(false); // disabled until animation starts
        pauseBtn.addActionListener(e -> {
            boolean wasPaused = vizPanel.togglePause();
            // Toggle button label based on state
            pauseBtn.setText(wasPaused ? "▶  Resume" : "⏸  Pause");
        });

        // ── Reset button ──────────────────────────────────────
        resetBtn = makeButton("↺  Reset", new Color(160, 50, 50));
        resetBtn.addActionListener(e -> {
            vizPanel.resetVisualization();
            startBtn.setEnabled(true);
            pauseBtn.setEnabled(false);
            pauseBtn.setText("⏸  Pause");
        });

        p.add(startBtn);
        p.add(pauseBtn);
        p.add(resetBtn);
        return p;
    }

    // ── Helpers ───────────────────────────────────────────────

    /** Create a bold, right-aligned label for form fields. */
    private JLabel makeLabel(String text) {
        JLabel l = new JLabel(text);
        l.setFont(new Font("Segoe UI", Font.BOLD, 13));
        l.setForeground(new Color(60, 60, 70));
        l.setHorizontalAlignment(SwingConstants.RIGHT);
        return l;
    }

    /** Apply consistent styling to text input fields. */
    private void styleTextField(JTextField tf) {
        tf.setFont(new Font("Monospaced", Font.PLAIN, 14));
        tf.setBorder(BorderFactory.createCompoundBorder(
            BorderFactory.createLineBorder(new Color(190, 200, 210), 1, true),
            BorderFactory.createEmptyBorder(4, 8, 4, 8)
        ));
        tf.setBackground(new Color(250, 251, 252));
    }

    /**
     * Build a colored action button with consistent styling.
     *
     * @param label  Button text
     * @param color  Background color
     */
    private JButton makeButton(String label, Color color) {
        JButton btn = new JButton(label);
        btn.setFont(new Font("Segoe UI", Font.BOLD, 13));
        btn.setBackground(color);
        btn.setForeground(Color.WHITE);
        btn.setFocusPainted(false);
        btn.setBorderPainted(false);
        btn.setOpaque(true);
        btn.setPreferredSize(new Dimension(130, 34));
        btn.setCursor(Cursor.getPredefinedCursor(Cursor.HAND_CURSOR));
        // Hover: slightly darker shade
        btn.addMouseListener(new java.awt.event.MouseAdapter() {
            public void mouseEntered(java.awt.event.MouseEvent e) {
                btn.setBackground(color.darker());
            }
            public void mouseExited(java.awt.event.MouseEvent e) {
                btn.setBackground(color);
            }
        });
        return btn;
    }

    /** Called by VisualizationPanel to re-enable Start when animation finishes. */
    public void onAnimationComplete() {
        startBtn.setEnabled(true);
        pauseBtn.setEnabled(false);
        pauseBtn.setText("⏸  Pause");
    }
}
