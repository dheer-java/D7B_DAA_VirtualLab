import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [array, setArray] = useState([29, 10, 45, 3, 18, 7, 33, 21]);
  const [leftPart, setLeftPart] = useState([]);
  const [rightPart, setRightPart] = useState([]);
  const [merged, setMerged] = useState([]);
  const [speed, setSpeed] = useState(500);
  const [caseType, setCaseType] = useState("random");
  const [timeTaken, setTimeTaken] = useState(null);
  const [isSorting, setIsSorting] = useState(false);
  const [treeLevels, setTreeLevels] = useState([]);

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  // Generate Array
  const generateArray = () => {
    let newArr = [];

    if (caseType === "best") {
      newArr = Array.from({ length: 8 }, (_, i) => i + 1);
    } else if (caseType === "worst") {
      newArr = Array.from({ length: 8 }, (_, i) => 8 - i);
    } else {
      newArr = Array.from({ length: 8 }, () =>
        Math.floor(Math.random() * 50) + 1
      );
    }

    setArray(newArr);
    setLeftPart([]);
    setRightPart([]);
    setMerged([]);
    setTimeTaken(null);
    setTreeLevels([]);
  };

  const merge = async (left, right) => {
    let result = [];
    let i = 0, j = 0;

    while (i < left.length && j < right.length) {
      await sleep(speed);

      if (left[i] < right[j]) result.push(left[i++]);
      else result.push(right[j++]);

      setMerged([...result]);
    }

    return [...result, ...left.slice(i), ...right.slice(j)];
  };

  // Merge Sort with tree
  const mergeSortVisual = async (arr, level = 0, tempTree) => {
    if (arr.length <= 1) return arr;

    if (!tempTree[level]) tempTree[level] = [];
    tempTree[level].push(arr);

    let mid = Math.floor(arr.length / 2);
    let left = arr.slice(0, mid);
    let right = arr.slice(mid);

    setLeftPart(left);
    setRightPart(right);
    setMerged([]);

    await sleep(speed + 300);

    let sortedLeft = await mergeSortVisual(left, level + 1, tempTree);
    let sortedRight = await mergeSortVisual(right, level + 1, tempTree);

    let mergedArr = await merge(sortedLeft, sortedRight);

    setMerged(mergedArr);
    await sleep(speed + 300);

    return mergedArr;
  };

  const startSort = async () => {
    if (isSorting) return;

    setIsSorting(true);
    let tempTree = [];

    const start = performance.now();
    const sorted = await mergeSortVisual(array, 0, tempTree);
    const end = performance.now();

    setArray(sorted);
    setLeftPart([]);
    setRightPart([]);
    setIsSorting(false);
    setTreeLevels(tempTree);

    setTimeTaken((end - start).toFixed(2));
  };

  return (
    <div className="main">
      <h1>Merge Sort Visualizer</h1>

      <div className="layout">

        {/* LEFT */}
        <div className="left-panel">

          <div className="controls">
            <label>Case:</label>
            <select value={caseType} onChange={(e) => setCaseType(e.target.value)}>
              <option value="random">Random</option>
              <option value="best">Best</option>
              <option value="worst">Worst</option>
            </select>

            <button onClick={generateArray}>Generate</button>
          </div>

          <div className="controls">
            <label>Speed:</label>
            <input
              type="range"
              min="100"
              max="1000"
              step="100"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            />
            <span>{speed} ms</span>
          </div>

          <div className="section">
            <h3>Original</h3>
            <div className="array">
              {array.map((v, i) => (
                <div key={i} className="box">{v}</div>
              ))}
            </div>
          </div>

          <div className="split-container">
            <div>
              <h3>Left</h3>
              <div className="array">
                {leftPart.map((v, i) => (
                  <div key={i} className="box left">{v}</div>
                ))}
              </div>
            </div>

            <div>
              <h3>Right</h3>
              <div className="array">
                {rightPart.map((v, i) => (
                  <div key={i} className="box right">{v}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="section">
            <h3>Merged</h3>
            <div className="array">
              {merged.map((v, i) => (
                <div key={i} className="box merge">{v}</div>
              ))}
            </div>
          </div>

          <button onClick={startSort} disabled={isSorting}>
            {isSorting ? "Sorting..." : "Start Sort"}
          </button>

        </div>

        {/* RIGHT */}
        <div className="right-panel">

          {timeTaken && (
            <div className="analysis">
              <h3>Analysis</h3>
              <p>Case: {caseType}</p>
              <p>Time: {timeTaken} ms</p>
              <p>Time Complexity: O(n log n)</p>
            </div>
          )}

          {timeTaken && (
            <div className="analysis">
              <h3>Recursion Tree</h3>

              {treeLevels.map((level, i) => (
                <div key={i} className="tree-level">
                  <strong>Level {i}</strong>
                  <div className="array">
                    {level.map((node, idx) => (
                      <div key={idx} className="box">
                        [{node.join(", ")}]
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}




// git init
// git add README.md
// git commit -m "first commit"
// git branch -M main
// git remote add origin https://github.com/MarvelDevloper/VidyaZopemam_DAA_VirtualLab.git
// git push -u origin main