function TheoryTab({ activeTab }) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
        padding: "40px",
        transition: "all 0.3s",
        minHeight: "80%",
        border: "1px solid #e2e8f0",
      }}
    >
      <h1
        style={{
          color: "#0f172a",
          margin: "0 0 25px 0",
          fontSize: "2rem",
          borderBottom: "2px solid #f1f5f9",
          paddingBottom: "15px",
        }}
      >
        N-Queen Problem (Backtracking)
      </h1>

      {activeTab === "aim" && (
        <div
          style={{
            animation: "fadeIn 0.5s ease",
            lineHeight: "1.8",
            fontSize: "1.1rem",
          }}
        >
          <h2 style={{ color: "#0f172a" }}>1. Aim</h2>
          <p
            style={{
              backgroundColor: "#f8fafc",
              padding: "20px",
              borderLeft: "5px solid #0f172a",
              borderRadius: "4px",
              color: "#334155",
            }}
          >
            Implement and analyze the N-Queen Problem using a Backtracking approach, 
            visually demonstrating the algorithmic process of placing queens and backtracking upon detecting conflicts.
          </p>
        </div>
      )}

      {activeTab === "theory" && (
        <div
          style={{
            animation: "fadeIn 0.5s ease",
            lineHeight: "1.8",
            fontSize: "1.1rem",
            color: "#334155",
          }}
        >
          <p style={{ marginBottom: "15px" }}>
            The <strong>N-Queen Problem</strong> is the problem of placing N chess queens on an N×N chessboard 
            so that no two queens threaten each other. Thus, a solution requires that no two queens share the 
            same row, column, or diagonal.
          </p>

          <ul style={{ paddingLeft: "20px" }}>
            <li style={{ marginBottom: "15px" }}>
              <strong>The Backtracking Approach:</strong>
              <br />
              Backtracking is an algorithmic technique for solving problems recursively by trying to build a solution 
              incrementally, one piece at a time, removing those solutions that fail to satisfy the constraints of the problem.
            </li>

            <li style={{ marginBottom: "15px" }}>
              <strong>Algorithm Steps:</strong>
              <ol style={{ paddingLeft: "25px", marginTop: "10px", marginBottom: "10px" }}>
                <li style={{ marginBottom: "5px" }}>Start in the leftmost column.</li>
                <li style={{ marginBottom: "5px" }}>If all queens are placed, return true (Solution Found).</li>
                <li style={{ marginBottom: "5px" }}>Try all rows in the current column. For each row:</li>
                <ul style={{ listStyleType: "circle", paddingLeft: "25px", marginBottom: "5px" }}>
                  <li>If the queen can be placed safely in this row, mark this [row, column] as part of the solution and recursively check if placing queen here leads to a solution.</li>
                  <li>If placing the queen at [row, column] leads to a solution, we are done.</li>
                  <li>If placing the queen doesn't lead to a solution, <strong>backtrack</strong>—unmark this [row, column] and try other rows.</li>
                </ul>
                <li>If all rows have been tried and nothing works, return false to trigger backtracking at the previous step.</li>
              </ol>
            </li>

            <li style={{ marginBottom: "15px" }}>
              <strong>Safety Constraints:</strong>
              <br />
              A queen is considered "safe" to place at `(row, col)` if:
              <ul style={{ listStyleType: "square", paddingLeft: "25px", marginTop: "10px" }}>
                <li>No other queen exists in the same <strong>row</strong> to the left.</li>
                <li>No other queen exists on the <strong>upper diagonal</strong> to the left.</li>
                <li>No other queen exists on the <strong>lower diagonal</strong> to the left.</li>
              </ul>
            </li>

            <li style={{ marginBottom: "15px" }}>
              <strong>Time Complexity:</strong>
              <br />
              The time complexity of the Backtracking algorithm is <span style={{ fontFamily: "serif", fontSize: "1.2em", fontStyle: "italic" }}>O(N!)</span>. 
              While it is much better than the naive approach (<span style={{ fontFamily: "serif", fontSize: "1.2em", fontStyle: "italic" }}>O(N<sup>N</sup>)</span>), 
              the search space grows factorially, which is why N is usually kept small (e.g., N=8) in visual simulations.
            </li>

            <li>
              <strong>Space Complexity:</strong>
              <br />
              The space complexity is <span style={{ fontFamily: "serif", fontSize: "1.2em", fontStyle: "italic" }}>O(N)</span> for the call stack 
              due to the recursion depth, plus the extra <span style={{ fontFamily: "serif", fontSize: "1.2em", fontStyle: "italic" }}>O(N<sup>2</sup>)</span> 
              space to maintain the board state.
            </li>
          </ul>
        </div>
      )}

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

export default TheoryTab;
