package algorithms;

import java.util.ArrayList;
import java.util.List;

/**
 * ============================================================
 *  RabinKarpAlgorithm.java — Rolling Hash Pattern Search
 * ============================================================
 *  Rabin-Karp uses HASHING to quickly skip positions where
 *  the pattern cannot match.
 *
 *  Core idea:
 *  ┌────────────────────────────────────────────────────────┐
 *  │  1. Compute hash(pattern)                             │
 *  │  2. Compute hash(text[0..m-1])                        │
 *  │  3. Slide window across text:                         │
 *  │       if hash(window) == hash(pattern):               │
 *  │           → do character-by-character check           │
 *  │           → this handles hash COLLISIONS              │
 *  │       else:                                           │
 *  │           → skip this window (no need to compare)     │
 *  │  4. Update hash in O(1) using rolling hash formula:   │
 *  │       h_new = (h_old − text[i] × h^(m-1)) × d + text[i+m]│
 *  └────────────────────────────────────────────────────────┘
 *
 *  Rolling Hash Formula Used:
 *   hash = (hash - text[i] * h) % q
 *   hash = (hash * d + text[i + m]) % q
 *
 *  where:
 *   d = number of characters in alphabet (256 for ASCII)
 *   q = a large prime (reduces collisions)
 *   h = d^(m-1) % q  (precomputed)
 *
 *  Time Complexity:  O(n + m) average, O(nm) worst case
 *  Space Complexity: O(1)
 * ============================================================
 */
public class RabinKarpAlgorithm {

    // ── Constants ─────────────────────────────────────────────
    private static final int D = 256;   // alphabet size (ASCII characters)
    private static final int Q = 101;   // a prime number to reduce collisions

    /**
     * Run Rabin-Karp search and record each step for visualization.
     *
     * @param text    Haystack string
     * @param pattern Needle string
     * @return List of AlgorithmStep objects for the visualizer
     */
    public static List<AlgorithmStep> run(String text, String pattern) {
        List<AlgorithmStep> steps = new ArrayList<>();

        int n = text.length();
        int m = pattern.length();

        // ── Precompute h = d^(m-1) % q ────────────────────────
        // h is used in the rolling hash to remove the leading character
        int h = 1;
        for (int i = 0; i < m - 1; i++) {
            h = (h * D) % Q;
        }

        // ── Compute initial hashes ────────────────────────────
        int patternHash = 0; // hash of pattern
        int windowHash  = 0; // hash of current text window

        for (int i = 0; i < m; i++) {
            patternHash = (D * patternHash + pattern.charAt(i)) % Q;
            windowHash  = (D * windowHash  + text.charAt(i))    % Q;
        }

        // ── Slide the window across the text ──────────────────
        for (int i = 0; i <= n - m; i++) {

            if (windowHash == patternHash) {
                // ── Hash match — verify character by character ─
                // This step guards against false positives (hash collisions)
                boolean fullMatch = true;
                for (int j = 0; j < m; j++) {
                    boolean charMatch = (text.charAt(i + j) == pattern.charAt(j));

                    if (j == m - 1 && charMatch) {
                        // Last character also matches → full pattern found
                        steps.add(new AlgorithmStep(i, j, true, i));
                    } else {
                        steps.add(new AlgorithmStep(i, j, charMatch, -1));
                    }

                    if (!charMatch) {
                        fullMatch = false;
                        break; // hash collision — not a real match
                    }
                }
            } else {
                // ── Hash mismatch — record a single "skip" step ─
                // We record position 0 as the comparison to show the window is moving
                steps.add(new AlgorithmStep(i, 0, false, -1));
            }

            // ── Update rolling hash for next window ───────────
            // Remove leading character, add trailing character
            if (i < n - m) {
                windowHash = (D * (windowHash - text.charAt(i) * h) + text.charAt(i + m)) % Q;

                // Handle negative hash (Java modulo can return negative)
                if (windowHash < 0) {
                    windowHash += Q;
                }
            }
        }

        return steps;
    }
}
