# CPU Scheduling Simulator – Priority & Round Robin
**Operating System (315319) Microproject**

An interactive, responsive web-based simulator designed to demonstrate CPU scheduling algorithms for Diploma Computer Engineering students.

---

## 📌 Project Overview
This project simulates two fundamental CPU Scheduling algorithms:
1. **Non-Preemptive Priority Scheduling** (Rule: Smaller Priority Number = Higher Priority)
2. **Preemptive Round Robin Scheduling** (User-defined Time Quantum)

It dynamically renders visual Gantt charts, detailed computation tables (Completion Time, Turnaround Time, Waiting Time, Response Time), and a side-by-side performance comparison.

---

## 🛠️ Technology Stack
- **HTML5**: Semantic web structure & dashboard UI components
- **CSS3**: Modern glassmorphism, responsive grid layouts, custom Gantt charts, animations
- **Vanilla JavaScript**: Pure JS implementation of CPU scheduling algorithms (no external libraries)

---

## 🚀 Features
- **Interactive Process Management**: Add, remove, clear, or load sample process datasets.
- **Validation**: Strict validation preventing duplicate process IDs, negative arrival times, non-positive burst times/priorities, or invalid time quanta.
- **Dynamic Visual Gantt Charts**: Rendered with proportional execution widths, start/end timestamps, process color coding, and CPU idle time styling.
- **Detailed Results Table**: Calculates Completion Time (CT), Turnaround Time (TAT), Waiting Time (WT), and Response Time (RT).
- **Dynamic Performance Comparison**: Calculates average metrics and provides a dynamic conclusion analyzing which algorithm performed better for the given workload.
- **Educational Section**: Clear explanation of OS CPU scheduling terms for students.
- **Algorithm Walkthrough**: Step-by-step logical execution rules.

---

## 📊 Core Formulas
- $\text{Turnaround Time (TAT)} = \text{CT} - \text{AT}$
- $\text{Waiting Time (WT)} = \text{TAT} - \text{BT}$
- $\text{Response Time (RT)} = \text{First CPU Start Time} - \text{AT}$

---

## 📂 Project Structure
```text
CPU-Scheduling-Simulator/
│
├── index.html     # Main HTML5 Dashboard
├── style.css      # CSS3 Glassmorphic Design & Gantt Styles
├── script.js       # Priority & Round Robin Logic
└── README.md      # Microproject Documentation
```

---

## 💻 How to Run the Project
1. Clone or download this project repository.
2. Double-click `index.html` or open it in any modern browser (Google Chrome, Microsoft Edge, Firefox, Brave, Safari).
3. No web server, node installation, database, or backend required!

---

## 📝 Demo Sample Scenario Test
To test the sample scenario mentioned in the microproject prompt:
1. Click the **"Load Sample Data"** button.
2. The dataset will be populated:
   - **P1**: AT = 0, BT = 5, Priority = 2
   - **P2**: AT = 1, BT = 3, Priority = 1
   - **P3**: AT = 2, BT = 4, Priority = 3
   - **P4**: AT = 3, BT = 2, Priority = 2
   - **Time Quantum (TQ)** = 2
3. Click **"Run Simulation"**.
4. Both Priority and Round Robin Gantt charts, result tables, and comparison metrics will be dynamically computed.
