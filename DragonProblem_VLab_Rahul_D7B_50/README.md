# Dragon Problem — DP Virtual Lab

An interactive virtual laboratory for exploring the **Dragon Problem** — a constrained shortest-path problem solved using **Dynamic Programming**.

## About

This lab was built as a DAA (Design and Analysis of Algorithms) college project. It demonstrates how to find the minimum-cost route to slay exactly **K dragons** on an R × C grid, starting from (0, 0), moving only downward, left, or right.

## Features

- **Aim tab** — Problem statement, parameters, and input/output format
- **Theory tab** — Full DP walkthrough with formulas, cost tables, and optimal path derivation
- **Simulator tab** — Step-by-step interactive simulation with animated grid visualization

## Algorithm

The Dragon Problem is solved using a DP recurrence:

```
dp[1][j]  =  r_j + |c_j|                          // cost from Start to dragon j
dp[i][j]  =  min over k (r_k < r_j):
               dp[i-1][k] + (r_j - r_k) + |c_j - c_k|
answer    =  min over j: dp[K][j]
```

**Time Complexity:** O(K · D²) | **Space:** O(K · D)

## Tech Stack

- React 19
- Vite 8

## Running Locally

```bash
npm install
npm run dev
```
