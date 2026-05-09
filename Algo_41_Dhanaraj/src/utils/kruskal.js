  // Union-Find Data Structure
class UnionFind {
  constructor(elements) {
    this.parent = {};
    elements.forEach(e => (this.parent[e] = e));
  }

  find(i) {
    if (this.parent[i] === i) return i;
    return this.parent[i] = this.find(this.parent[i]); // Path compression
  }

  union(i, j) {
    let rootI = this.find(i);
    let rootJ = this.find(j);
    if (rootI !== rootJ) {
      this.parent[rootI] = rootJ;
      return true; // Union successful
    }
    return false; // Cycle detected
  }
}

// Kruskal's Algorithm Generator (Returns steps for animation)
export const getKruskalSteps = (nodes, edges) => {
  const steps = [];
  const mstEdges = [];
  
  // Extract node IDs for Union-Find
  const nodeIds = nodes.map(n => n.id);
  const uf = new UnionFind(nodeIds);

  // Step 1: Sort edges by weight in ascending order
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

  // Step 2: Iterate through sorted edges
  for (let edge of sortedEdges) {
    steps.push({ type: 'CHECKING', edgeId: edge.id });

    if (uf.union(edge.source, edge.target)) {
      mstEdges.push(edge);
      steps.push({ type: 'ADDED', edgeId: edge.id, mstEdges: [...mstEdges] });
    } else {
      steps.push({ type: 'CYCLE_DETECTED', edgeId: edge.id });
    }
  }

  return { steps, finalMst: mstEdges };
};