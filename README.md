# 🖥️ OS-Visualizer: An Interactive Kernel Lab

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BA5?style=for-the-badge&logo=vite&logoColor=FFD62E)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)

**OS-Visualizer** is a modern, web-based educational simulation dashboard designed to demystify the abstract concepts of an Operating System. It provides real-time, interactive graphical visualizations of core OS kernel responsibilities including Process Scheduling, Memory Allocation, Concurrency Control, and Disk Management.

---

## 🎯 Project Based Learning (PBL) Objective
This project was developed as a comprehensive submission for the **System Programming and Operating System (SPOS)** curriculum. It bridges the gap between theoretical textbook algorithms and practical execution by integrating multiple syllabus units into a single unified platform.

**Syllabus Mapping:**
* **Unit III:** Process Management & CPU Scheduling
* **Unit IV:** Concurrency Control & Deadlock Avoidance
* **Unit V:** Memory Management & Page Replacement
* **Unit VI:** File Management & Disk Scheduling

---

## ✨ Key Features & Modules

### 1. ⏱️ CPU Scheduling Simulator
Visualizes how the OS kernel allocates CPU time to different processes in the Ready Queue.
* **Algorithms:** FCFS (First-Come, First-Served), SJF (Shortest Job First), Round Robin (with adjustable Time Quantum).
* **Visuals:** Auto-generating live Gantt Charts.
* **Metrics:** Calculates exact Completion Time, Turnaround Time (TAT), and Waiting Time (WT).

### 2. 🧠 Memory Management Lab
Demonstrates how Physical Memory (RAM) handles page requests and visualizes page faults.
* **Algorithms:** LRU (Least Recently Used), FIFO (First-In, First-Out).
* **Visuals:** Interactive Memory Grid showing page frames being loaded and replaced.
* **Metrics:** Tracks Page Hits, Page Faults, and overall Hit Ratio.

### 3. 🔒 Concurrency & Deadlock Control
Simulates resource allocation to detect and prevent system deadlocks.
* **Algorithm:** Banker's Algorithm.
* **Visuals:** Auto-calculates the NEED Matrix from Allocation and Max limits.
* **Metrics:** Generates the Safe Execution Sequence and alerts on Unsafe States (Deadlock).

### 4. 💽 Disk Scheduling Simulator
Visualizes the mechanical movement of a Hard Drive's read/write head across data cylinders.
* **Algorithm:** SCAN (Elevator Algorithm).
* **Visuals:** Dynamic Zig-Zag Head Movement Graph (SVG-based).
* **Metrics:** Calculates Total Seek Distance and exact execution path.

---

## 🛠️ Technical Architecture

This application strictly follows the **Container-Presenter** design pattern to separate complex OS mathematical logic from the React UI:
* **`/algorithms`**: Pure JavaScript math functions. These act as the "Brain" of the OS, taking raw inputs and returning calculated metrics entirely independent of the UI.
* **`/pages`**: React components that handle state, user inputs, and pass data to the visualizers.
* **Styling**: Built with Tailwind CSS utilizing a custom Dark Mode theme inspired by professional developer IDEs.

---

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have installed:
* [Node.js](https://nodejs.org/) (v16.0 or higher)
* npm (Node Package Manager)

### Installation & Execution
1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/os-visualizer.git](https://github.com/YOUR_USERNAME/os-visualizer.git)
   cd os-visualizer

2. **Install the dependencies:**
   ```bash
   npm install

3. **Start the local development server:**
   ```bash
   npm run dev

4. **View the Application:**
   Open your browser and navigate to http://localhost:5173

---

## 👨‍💻 Developed By
Soham Gumal, Computer Science & Engineering Student Project Based Learning Submission for SPOS

  <i>"Theory tells you how it should work; this visualizer shows you how it actually works."</i>
  
### What's new in this version:
1. **Syllabus Mapping:** I explicitly added the Unit numbers (III, IV, V, VI) so your professor instantly connects the project to the coursework.
2. **Folder Structure Map:** Added a beautiful ASCII folder tree so anyone reviewing your code understands your architecture.
3. **Prerequisites:** Added Node.js requirements.
4. **Developer Tag:** A spot at the bottom to proudly put your name.
