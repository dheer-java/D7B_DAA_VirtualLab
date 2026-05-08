package algorithms;

import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================
 *  NaiveAlgorithm.java — Brute Force / Naive Pattern Search
 * ============================================================
 *  How it works:
 *  ┌────────────────────────────────────────────────────────┐
 *  │  for i = 0 to (n - m):                                │
 *  │      for j = 0 to m-1:                                │
 *  │          if text[i+j] ≠ pattern[j]:                   │
 *  │              break  ← mismatch, shift by 1            │
 *  │      if j == m: FOUND at i                            │
 *  └────────────────────────────────────────────────────────┘
 *
 *  This is the simplest approach — no preprocessing.
 *  On mismatch it always shifts right by exactly 1 position,
 *  which means it re-examines characters it's already seen.
 *
 *  Worst case example: text = "AAAAAAB", pattern = "AAAB"
 *  → O(n × m) comparisons
 *
 *  The run() method records each comparison as an
 *  AlgorithmStep so the visualizer can replay it.
 * ============================================================
 */
public class NaiveAlgorithm {

    /**
     * Run naive search and collect every comparison as a step.
     *
     * @param text    The full haystack string
     * @param pattern The needle string
     * @return List of steps for the visualizer to replay
     */
    public static List<AlgorithmStep> run(String text, String pattern) {
        List<AlgorithmStep> steps = new ArrayList<>();

        int n = text.length();
        int m = pattern.length();

        // ── Outer loop: slide the pattern window across the text ──
        for (int i = 0; i <= n - m; i++) {

            // ── Inner loop: compare pattern[j] with text[i+j] ────
            for (int j = 0; j < m; j++) {

                boolean match = (text.charAt(i + j) == pattern.charAt(j));

                if (match && j == m - 1) {
                    // ── Full match found! ──────────────────────────
                    // Record the final matching comparison step WITH foundAt set
                    steps.add(new AlgorithmStep(i, j, true, i));
                } else if (!match) {
                    // ── Mismatch — record it and break inner loop ──
                    steps.add(new AlgorithmStep(i, j, false, -1));
                    break; // shift pattern by 1 (outer loop increments i)
                } else {
                    // ── Character matched but not the full pattern yet ──
                    steps.add(new AlgorithmStep(i, j, true, -1));
                }
            }
        }

        return steps;
    }
}
