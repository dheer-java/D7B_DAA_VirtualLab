package algorithms;

/**
 * ============================================================
 *  AlgorithmStep.java — Single Visualization Step (Data Class)
 * ============================================================
 *  Each AlgorithmStep captures the complete state of the
 *  algorithm at one comparison moment. The VisualizationPanel
 *  reads these fields to decide:
 *   - Where to draw the pattern (patternOffset)
 *   - Which characters to highlight (textCompareIndices)
 *   - What color to use (isMatch)
 *   - Whether to show a "FOUND" banner (foundAt)
 *
 *  All three algorithms (Naive, KMP, Rabin-Karp) produce a
 *  List<AlgorithmStep> — the visualizer only reads this list,
 *  so it works for any algorithm without special cases.
 * ============================================================
 */
public class AlgorithmStep {

    // ── Fields ────────────────────────────────────────────────

    /**
     * How many positions the pattern is currently shifted right
     * from the start of the text.
     * Example: if text = "ABCDE" and pattern "CD" is being tested
     *   at position 2, patternOffset = 2.
     */
    public int patternOffset;

    /**
     * Which character index within the pattern is being compared
     * right now. Used to highlight the specific pattern cell.
     */
    public int patternCompareIndex;

    /**
     * The corresponding text indices being compared.
     * Usually contains one element: [patternOffset + patternCompareIndex]
     * but kept as an array for flexibility.
     */
    public int[] textCompareIndices;

    /**
     * True if the current character comparison is a match,
     * false if it's a mismatch.
     * Controls whether we color cells GREEN or RED.
     */
    public boolean isMatch;

    /**
     * Set to ≥ 0 when the full pattern is found at this index.
     * Set to -1 otherwise.
     * When foundAt ≥ 0, the visualizer highlights all matching
     * cells in orange/gold.
     */
    public int foundAt;

    // ── Constructor ──────────────────────────────────────────

    /**
     * Create a step for a single character comparison.
     *
     * @param patternOffset        Current window start position in text
     * @param patternCompareIndex  Position within pattern being compared
     * @param isMatch              Whether the characters match
     * @param foundAt              -1 normally; ≥ 0 when full match is found
     */
    public AlgorithmStep(int patternOffset, int patternCompareIndex,
                         boolean isMatch, int foundAt) {
        this.patternOffset       = patternOffset;
        this.patternCompareIndex = patternCompareIndex;
        this.isMatch             = isMatch;
        this.foundAt             = foundAt;
        // Derive text compare index automatically
        this.textCompareIndices  = new int[]{ patternOffset + patternCompareIndex };
    }
}
