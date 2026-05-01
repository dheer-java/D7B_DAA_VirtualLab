package algorithms;

import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================
 *  KMPAlgorithm.java — Knuth-Morris-Pratt Pattern Search
 * ============================================================
 *  KMP is smarter than Naive because it remembers which
 *  characters already matched and avoids re-checking them.
 *
 *  Key idea: preprocess the pattern to build an LPS array.
 *
 *  LPS = "Longest Proper Prefix which is also a Suffix"
 *  ┌────────────────────────────────────────────────────────┐
 *  │  Pattern: A  B  A  B  C                               │
 *  │  LPS:     0  0  1  2  0                               │
 *  │                                                        │
 *  │  lps[3]=2 means "ABAB" has "AB" as both prefix        │
 *  │  and suffix — so on mismatch at j=4, we can jump      │
 *  │  to j=lps[3]=2 instead of restarting from j=0.        │
 *  └────────────────────────────────────────────────────────┘
 *
 *  The search phase never moves the text index i backward.
 *  This gives O(n + m) total time complexity.
 *
 *  Time Complexity:  O(n + m)
 *  Space Complexity: O(m) for LPS array
 * ============================================================
 */
public class KMPAlgorithm {

    /**
     * Run KMP search and record every comparison as an AlgorithmStep.
     *
     * @param text    Haystack
     * @param pattern Needle
     * @return List of steps for the visualizer
     */
    public static List<AlgorithmStep> run(String text, String pattern) {
        List<AlgorithmStep> steps = new ArrayList<>();

        int n = text.length();
        int m = pattern.length();

        // ── Phase 1: Compute LPS array ────────────────────────
        // (not visualized as steps, but shown in the LPS table panel)
        int[] lps = computeLPS(pattern);

        // ── Phase 2: Search using LPS to skip shifts ──────────
        int i = 0; // text pointer (never moves backward!)
        int j = 0; // pattern pointer

        while (i < n) {

            boolean match = (text.charAt(i) == pattern.charAt(j));

            // The "shift" in the visualizer is (i - j), i.e. where
            // the current pattern window starts in the text.
            int patternOffset = i - j;

            if (match) {
                if (j == m - 1) {
                    // ── Full pattern match found ───────────────
                    steps.add(new AlgorithmStep(patternOffset, j, true, patternOffset));
                    // Use LPS to continue searching for more matches
                    j = lps[j - 1];
                } else {
                    // ── Partial match — record and advance both pointers ──
                    steps.add(new AlgorithmStep(patternOffset, j, true, -1));
                    i++;
                    j++;
                }
            } else {
                // ── Mismatch ──────────────────────────────────
                steps.add(new AlgorithmStep(patternOffset, j, false, -1));

                if (j != 0) {
                    // KEY KMP TRICK: use LPS to skip ahead
                    // instead of resetting j to 0, we jump to lps[j-1]
                    // This avoids re-checking characters we already matched
                    j = lps[j - 1];
                    // Note: i is NOT decremented — text pointer never goes back!
                } else {
                    // j is already 0, just advance the text pointer
                    i++;
                }
            }
        }

        return steps;
    }

    /**
     * Compute the LPS (Longest Proper Prefix = Suffix) array for a pattern.
     *
     * Algorithm:
     *  - lps[0] is always 0 (no proper prefix for single char)
     *  - Use two pointers: len tracks the current match length,
     *    i walks from 1 to m-1
     *  - If pattern[i] == pattern[len]: lps[i] = len + 1, advance both
     *  - If mismatch and len > 0: fall back using lps[len-1] (like KMP itself!)
     *  - If mismatch and len == 0: lps[i] = 0, advance i
     *
     * This method is also called by LPSPanel to display the table.
     *
     * @param pattern The pattern string
     * @return The computed LPS array
     */
    public static int[] computeLPS(String pattern) {
        int m   = pattern.length();
        int[] lps = new int[m];

        lps[0] = 0; // Always 0 for the first character

        int len = 0; // length of previous longest prefix suffix
        int i   = 1; // start from second character

        while (i < m) {
            if (pattern.charAt(i) == pattern.charAt(len)) {
                // Characters match — extend the current prefix-suffix
                len++;
                lps[i] = len;
                i++;
            } else {
                if (len != 0) {
                    // Mismatch after some matches — try shorter prefix
                    // This is the key: we don't increment i here
                    len = lps[len - 1];
                } else {
                    // No prefix matches at all
                    lps[i] = 0;
                    i++;
                }
            }
        }

        return lps;
    }
}
