function TheoryTab({ activeTab }) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
        padding: "40px",
        transition: "all 0.3s",
        minHeight: "80%",
      }}
    >
      <h1
        style={{
          color: "#212529",
          margin: "0 0 25px 0",
          fontSize: "2rem",
          borderBottom: "2px solid #e9ecef",
          paddingBottom: "15px",
        }}
      >
        Longest Common Subsequence (LCS)
      </h1>

      {activeTab === "aim" && (
        <div
          style={{
            animation: "fadeIn 0.5s ease",
            lineHeight: "1.8",
            fontSize: "1.1rem",
          }}
        >
          <h2 style={{ color: "#084298" }}>1. Aim</h2>
          <p
            style={{
              backgroundColor: "#f8f9fa",
              padding: "20px",
              borderLeft: "5px solid #0d6efd",
              borderRadius: "4px",
            }}
          >
            Implement and analyze the Longest Common Subsequence (LCS) problem
            using a Dynamic Programming approach, including the generation of
            the DP table and backtracking to find the sequence.
          </p>
        </div>
      )}

      {activeTab === "theory" && (
        <div
          style={{
            animation: "fadeIn 0.5s ease",
            lineHeight: "1.8",
            fontSize: "1.1rem",
            color: "#343a40",
          }}
        >
          <p style={{ marginBottom: "15px" }}>
            The Longest Common Subsequence (LCS) problem is a classic computer
            science problem that aims to find the longest subsequence common to
            all sequences in a set of sequences (often just two sequences).
          </p>

          <ul style={{ paddingLeft: "20px" }}>
            <li style={{ marginBottom: "15px" }}>
              <strong>Subsequence vs. Substring:</strong>
              <br />A subsequence is a sequence that appears in the same
              relative order, but not necessarily contiguous. For example,
              "abc", "abg", "bdf", "aeg", "acefg", etc., are subsequences of
              "abcdefg".
            </li>

            <li style={{ marginBottom: "15px" }}>
              <strong>Why Dynamic Programming?</strong>
              <br />
              The naive recursive approach to solving the LCS problem generates
              all subsequences of both strings and compares them, which takes
              exponential time{" "}
              <span
                style={{
                  fontFamily: "serif",
                  fontSize: "1.15em",
                  fontStyle: "italic",
                }}
              >
                O(2<sup>n</sup>)
              </span>
              . However, the LCS problem has two important properties:
              <ol
                style={{
                  paddingLeft: "25px",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                <li style={{ marginBottom: "5px" }}>
                  <em>Optimal Substructure:</em> The optimal solution to the
                  problem contains optimal solutions to subproblems.
                </li>
                <li>
                  <em>Overlapping Subproblems:</em> The recursive solution
                  solves the same subproblems repeatedly.
                </li>
              </ol>
            </li>

            <li style={{ marginBottom: "15px" }}>
              By using Dynamic Programming (Tabulation), we can avoid this
              redundant computation. We build a 2D matrix (DP table) where
              dp[i][j] represents the length of the LCS of the prefixes
              X[0...i-1] and Y[0...j-1].
            </li>

            <li style={{ marginBottom: "25px" }}>
              <strong>Recurrence Relation:</strong>
              <ul
                style={{
                  listStyleType: "circle",
                  paddingLeft: "25px",
                  marginTop: "10px",
                }}
              >
                <li style={{ marginBottom: "10px" }}>
                  If{" "}
                  <span
                    style={{
                      fontFamily: "serif",
                      fontSize: "1.3em",
                      fontStyle: "italic",
                    }}
                  >
                    X[i &minus; 1] == Y[j &minus; 1]
                  </span>{" "}
                  : LCS[i][j] = LCS[i-1][j-1] + 1
                </li>
                <li>
                  If{" "}
                  <span
                    style={{
                      fontFamily: "serif",
                      fontSize: "1.3em",
                      fontStyle: "italic",
                    }}
                  >
                    X[i &minus; 1] &ne; Y[j &minus; 1]
                  </span>{" "}
                  : LCS[i][j] = max(LCS[i-1][j], LCS[i][j-1])
                </li>
              </ul>
            </li>

            <li style={{ marginBottom: "15px" }}>
              <strong>Time Complexity:</strong>
              <br />
              The time complexity of generating the DP table is{" "}
              <span
                style={{
                  fontFamily: "serif",
                  fontSize: "1.2em",
                  fontStyle: "italic",
                }}
              >
                O(m &times; n)
              </span>
              , where{" "}
              <span
                style={{
                  fontFamily: "serif",
                  fontSize: "1.2em",
                  fontStyle: "italic",
                }}
              >
                m
              </span>{" "}
              and{" "}
              <span
                style={{
                  fontFamily: "serif",
                  fontSize: "1.2em",
                  fontStyle: "italic",
                }}
              >
                n
              </span>{" "}
              are the lengths of strings{" "}
              <span
                style={{
                  fontFamily: "serif",
                  fontSize: "1.2em",
                  fontStyle: "italic",
                }}
              >
                X
              </span>{" "}
              and{" "}
              <span
                style={{
                  fontFamily: "serif",
                  fontSize: "1.2em",
                  fontStyle: "italic",
                }}
              >
                Y
              </span>{" "}
              respectively. This is because we use a nested loop to fill up a 2D
              array of size{" "}
              <span
                style={{
                  fontFamily: "serif",
                  fontSize: "1.2em",
                  fontStyle: "italic",
                }}
              >
                (m + 1) &times; (n + 1)
              </span>
              . The backtracking step takes{" "}
              <span
                style={{
                  fontFamily: "serif",
                  fontSize: "1.2em",
                  fontStyle: "italic",
                }}
              >
                O(m + n)
              </span>{" "}
              time in the worst case as we move from the bottom-right cell to
              the top-left cell. Therefore, the overall Time Complexity is{" "}
              <span
                style={{
                  fontFamily: "serif",
                  fontSize: "1.2em",
                  fontStyle: "italic",
                }}
              >
                O(m &times; n)
              </span>
              .
            </li>

            <li>
              <strong>Space Complexity:</strong>
              <br />
              The space complexity is{" "}
              <span
                style={{
                  fontFamily: "serif",
                  fontSize: "1.2em",
                  fontStyle: "italic",
                }}
              >
                O(m &times; n)
              </span>{" "}
              because we need to allocate memory for the 2D matrix dp[m+1][n+1]
              to store the intermediate subproblem results. Additional space of{" "}
              <span
                style={{
                  fontFamily: "serif",
                  fontSize: "1.2em",
                  fontStyle: "italic",
                }}
              >
                O(min(m, n))
              </span>{" "}
              is used to store the final LCS string characters.
            </li>
          </ul>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

export default TheoryTab;
