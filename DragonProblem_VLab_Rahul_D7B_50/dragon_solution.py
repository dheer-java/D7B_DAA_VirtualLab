"""
Dragon Problem Solution - Dynamic Programming with Intermediate Steps
======================================================================
Problem: Find shortest path to kill exactly K dragons on R×C grid.
- Start at (0,0)
- Can move: Left, Right, Down (NOT Up)
- Each row has at most 1 dragon
- Cost = row_distance + column_distance (Manhattan distance)
"""

# ==================== STEP 1: Input Setup ====================
# Grid dimensions
R, C = 5, 6

# Dragons with their positions
dragons = {
    'D1': (1, 4),
    'D2': (2, 2),
    'D3': (3, 5),
    'D4': (4, 1),
}

# Start position
start = (0, 0)

# Number of dragons to kill
K = 2

print("=" * 60)
print("DRAGON PROBLEM SOLUTION")
print("=" * 60)
print(f"Grid: {R} rows × {C} columns")
print(f"Dragons: {dragons}")
print(f"Kill exactly: {K} dragons")
print(f"Start position: {start}")
print()


# ==================== STEP 2: Cost from Start to Each Dragon ====================
print("STEP 1: Cost from Start S(0,0) to Each Dragon")
print("-" * 60)

# Formula: cost = row + |column|
cost_from_start = {}

for name, (r, c) in dragons.items():
    cost = r + abs(c)
    cost_from_start[name] = cost
    print(f"{name}({r},{c}) → Cost = {r} + |{c}| = {cost}")

print(f"\nResult: {cost_from_start}")
print()


# ==================== STEP 3: Cost Between Two Dragons ====================
print("STEP 2: Cost Between Dragons (Di → Dj)")
print("-" * 60)

# Formula: cost = (r2 - r1) + |c2 - c1|
cost_between = {}

dragon_list = sorted(dragons.keys(), key=lambda x: dragons[x][0])  # Sort by row

for i, name1 in enumerate(dragon_list):
    for name2 in dragon_list[i+1:]:
        r1, c1 = dragons[name1]
        r2, c2 = dragons[name2]

        # Only valid if r2 > r1 (can only go down)
        cost = (r2 - r1) + abs(c2 - c1)
        cost_between[(name1, name2)] = cost

        print(f"{name1}({r1},{c1}) → {name2}({r2},{c2}) = ({r2}-{r1}) + |{c2}-{c1}| = {cost}")

print(f"\nResult: {cost_between}")
print()


# ==================== STEP 4: Dynamic Programming ====================
print(f"STEP 3: DP to Find Minimum Path (K={K})")
print("-" * 60)

# DP state: dp[i][j] = min cost to kill i dragons with j-th dragon being last killed
# i ranges from 1 to K
# j ranges over all dragons in increasing row order

dragon_list = sorted(dragons.keys(), key=lambda x: dragons[x][0])

# Initialize DP table
# dp[kill_count][dragon_index] = (min_cost, previous_dragon)
dp = {}

# Base case: Kill 1 dragon (first kill)
print(f"\nBase Case (Kill 1 dragon):")
for j, dragon in enumerate(dragon_list):
    cost = cost_from_start[dragon]
    dp[(1, j)] = (cost, None)
    print(f"  dp[1][{j}] = {dragon} → Cost = {cost}")

# Recurrence: Kill i-th dragon
print(f"\nRecurrence (Fill DP table):")
for i in range(2, K + 1):
    print(f"\n  Kill dragon #{i}:")
    for j, curr_dragon in enumerate(dragon_list):
        # Try all previous dragons
        min_cost = float('inf')
        best_prev = None

        for k in range(j):
            prev_dragon = dragon_list[k]
            prev_cost = dp[(i-1, k)][0]
            edge_cost = cost_between[(prev_dragon, curr_dragon)]
            total_cost = prev_cost + edge_cost

            if total_cost < min_cost:
                min_cost = total_cost
                best_prev = k

        dp[(i, j)] = (min_cost, best_prev)
        print(f"    dp[{i}][{j}] = {curr_dragon} → Cost = {min_cost} (from {dragon_list[best_prev]})")

print()


# ==================== STEP 5: Find Optimal Solution ====================
print("STEP 4: Find Optimal Path")
print("-" * 60)

# Find minimum cost to kill exactly K dragons
min_total_cost = float('inf')
best_last_dragon_idx = -1

print(f"\nFinal costs after killing {K} dragons:")
for j, dragon in enumerate(dragon_list):
    cost = dp[(K, j)][0]
    print(f"  {dragon}: {cost}")
    if cost < min_total_cost:
        min_total_cost = cost
        best_last_dragon_idx = j

print(f"\n🏆 OPTIMAL COST: {min_total_cost}")

# Backtrack to find the path
path = []
current_idx = best_last_dragon_idx

for i in range(K, 0, -1):
    path.append(dragon_list[current_idx])
    _, prev_idx = dp[(i, current_idx)]
    current_idx = prev_idx

path.reverse()
path = ['S'] + path

print(f"🐉 OPTIMAL PATH: {' → '.join(path)}")
print()

# Verify the path cost
print("Verification:")
total = 0
next_dragon = path[1]
print(f"  S(0,0) → {next_dragon}{dragons[next_dragon]}")
total += cost_from_start[next_dragon]
print(f"    Cost = {cost_from_start[next_dragon]}")

for i in range(1, len(path) - 1):
    curr = path[i+1]
    prev = path[i]
    edge_cost = cost_between[(prev, curr)]
    print(f"  {prev}{dragons[prev]} → {curr}{dragons[curr]}")
    print(f"    Cost = {edge_cost}")
    total += edge_cost

print("\nTotal Cost =", total)
print("=" * 60)
