# 🖥️ OS-Visualizer: An Interactive Kernel Lab

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BA5?style=for-the-badge&logo=vite&logoColor=FFD62E)

**OS-Visualizer** is a web-based educational simulation tool designed for the System Programming and Operating System (SPOS) curriculum. It bridges the gap between theoretical OS algorithms and practical execution through real-time, high-fidelity visual simulations.

## ✨ Core Modules Implemented

### 1. CPU Scheduling (Unit III)
Visualizes how the OS kernel allocates CPU time to different processes.
* **Supported Algorithms:** FCFS (First-Come, First-Served), SJF (Shortest Job First), Round Robin.
* **Features:** Live Gantt Chart generation, automatic Wait Time (WT) and Turnaround Time (TAT) calculations.

### 2. Memory Management (Unit V)
Demonstrates how Physical Memory (RAM) handles page requests and page faults.
* **Supported Algorithms:** LRU (Least Recently Used), FIFO (First-In, First-Out).
* **Features:** Interactive Memory Grid, Page Hit/Fault color-coded tracking, Hit Ratio calculations.

### 3. Concurrency Control (Unit IV)
Simulates resource allocation to prevent system deadlocks.
* **Supported Algorithms:** Banker's Algorithm.
* **Features:** Need Matrix auto-calculation, Safe Sequence generation, Safe/Unsafe state detection.

### 4. Disk Scheduling (Unit VI)
Visualizes how the hard drive head moves to access data cylinders.
* **Supported Algorithms:** SCAN (Elevator Algorithm).
* **Features:** Zig-Zag Head Movement Graph, Total Seek Distance calculation.

---

## 🚀 How to Run the Project Locally

1. **Clone or Download** the repository to your local machine.
2. **Open the terminal** and navigate to the project directory:
   ```bash
   cd os-visualizer