// CPU Scheduling Simulator - Priority & Round Robin
// Operating System (315319) Microproject

document.addEventListener('DOMContentLoaded', () => {
    // Application State
    let processes = [];
    
    // Process Color Palette Map
    const processColors = [
        { bg: 'linear-gradient(135deg, #6366f1, #4f46e5)', border: '#818cf8' }, // Indigo
        { bg: 'linear-gradient(135deg, #06b6d4, #0891b2)', border: '#67e8f9' }, // Cyan
        { bg: 'linear-gradient(135deg, #10b981, #059669)', border: '#34d399' }, // Emerald
        { bg: 'linear-gradient(135deg, #a855f7, #7e22ce)', border: '#c084fc' }, // Purple
        { bg: 'linear-gradient(135deg, #f59e0b, #d97706)', border: '#fbbf24' }, // Amber
        { bg: 'linear-gradient(135deg, #f43f5e, #e11d48)', border: '#fb7185' }, // Rose
        { bg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', border: '#60a5fa' }, // Blue
        { bg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', border: '#a78bfa' }  // Violet
    ];

    // DOM Elements
    const addProcessForm = document.getElementById('add-process-form');
    const inputProcessId = document.getElementById('process-id');
    const inputArrivalTime = document.getElementById('arrival-time');
    const inputBurstTime = document.getElementById('burst-time');
    const inputPriority = document.getElementById('priority');
    const inputTimeQuantum = document.getElementById('time-quantum');
    const displayTimeQuantum = document.getElementById('display-tq');

    const btnSampleData = document.getElementById('btn-sample-data');
    const btnReset = document.getElementById('btn-reset');
    const btnRunSimulation = document.getElementById('btn-run-simulation');
    const btnClearAll = document.getElementById('btn-clear-all');

    const processTableBody = document.getElementById('process-table-body');
    const emptyState = document.getElementById('empty-state');
    const processCountEl = document.getElementById('process-count');
    const toastContainer = document.getElementById('toast-container');

    // Priority Result Elements
    const priorityGantt = document.getElementById('priority-gantt');
    const priorityResultBody = document.getElementById('priority-result-body');
    const pAvgWt = document.getElementById('p-avg-wt');
    const pAvgTat = document.getElementById('p-avg-tat');
    const pAvgRt = document.getElementById('p-avg-rt');

    // Round Robin Result Elements
    const rrGantt = document.getElementById('rr-gantt');
    const rrResultBody = document.getElementById('rr-result-body');
    const rrAvgWt = document.getElementById('rr-avg-wt');
    const rrAvgTat = document.getElementById('rr-avg-tat');
    const rrAvgRt = document.getElementById('rr-avg-rt');

    // Comparison Elements
    const compPWt = document.getElementById('comp-p-wt');
    const compRRWt = document.getElementById('comp-rr-wt');
    const compPTat = document.getElementById('comp-p-tat');
    const compRRTat = document.getElementById('comp-rr-tat');

    const barPWt = document.getElementById('bar-p-wt');
    const barRRWt = document.getElementById('bar-rr-wt');
    const barPTat = document.getElementById('bar-p-tat');
    const barRRTat = document.getElementById('bar-rr-tat');

    const conclusionTitle = document.getElementById('conclusion-title');
    const conclusionText = document.getElementById('conclusion-text');

    // Initial setup: Load default process ID suggestion
    updateSuggestedProcessId();

    // Event Listeners
    addProcessForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleAddProcess();
    });

    btnSampleData.addEventListener('click', loadSampleData);
    btnReset.addEventListener('click', resetAll);
    btnClearAll.addEventListener('click', clearProcesses);
    btnRunSimulation.addEventListener('click', runSimulation);

    inputTimeQuantum.addEventListener('change', () => {
        const val = parseInt(inputTimeQuantum.value, 10);
        if (!val || val <= 0) {
            showToast('Time Quantum must be a positive integer greater than 0.', 'error');
            inputTimeQuantum.value = 2;
        } else {
            displayTimeQuantum.textContent = val;
        }
    });

    // Helper: Toast Notification
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icon = type === 'error' 
            ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`
            : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;

        toast.innerHTML = `${icon} <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(50px)';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // Auto-generate Process ID (P1, P2, P3...)
    function updateSuggestedProcessId() {
        let count = processes.length + 1;
        while (processes.some(p => p.id.toUpperCase() === `P${count}`)) {
            count++;
        }
        inputProcessId.value = `P${count}`;
    }

    // Add Process Handler
    function handleAddProcess() {
        const id = inputProcessId.value.trim().toUpperCase();
        const at = parseInt(inputArrivalTime.value, 10);
        const bt = parseInt(inputBurstTime.value, 10);
        const priority = parseInt(inputPriority.value, 10);

        // Validation
        if (!id) {
            showToast('Process ID cannot be empty.', 'error');
            return;
        }
        if (processes.some(p => p.id.toUpperCase() === id)) {
            showToast(`Process ID "${id}" already exists. Use a unique ID.`, 'error');
            return;
        }
        if (isNaN(at) || at < 0) {
            showToast('Arrival Time must be a non-negative integer (>= 0).', 'error');
            return;
        }
        if (isNaN(bt) || bt <= 0) {
            showToast('Burst Time must be a positive integer (> 0).', 'error');
            return;
        }
        if (isNaN(priority) || priority <= 0) {
            showToast('Priority must be a positive integer (> 0).', 'error');
            return;
        }

        processes.push({ id, at, bt, priority });
        renderProcessTable();
        updateSuggestedProcessId();
        showToast(`Process ${id} added successfully.`, 'success');
    }

    // Remove single process
    window.removeProcess = function(id) {
        processes = processes.filter(p => p.id !== id);
        renderProcessTable();
        updateSuggestedProcessId();
        showToast(`Process ${id} removed.`, 'info');
    };

    // Render Process Queue Table
    function renderProcessTable() {
        processTableBody.innerHTML = '';
        processCountEl.textContent = processes.length;

        if (processes.length === 0) {
            emptyState.style.display = 'flex';
        } else {
            emptyState.style.display = 'none';
            processes.forEach(p => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td><strong>${p.id}</strong></td>
                    <td>${p.at}</td>
                    <td>${p.bt}</td>
                    <td>${p.priority}</td>
                    <td>
                        <button class="btn-delete-row" onclick="removeProcess('${p.id}')">Remove</button>
                    </td>
                `;
                processTableBody.appendChild(tr);
            });
        }
    }

    // Clear all processes
    function clearProcesses() {
        processes = [];
        renderProcessTable();
        updateSuggestedProcessId();
        clearResults();
        showToast('Process queue cleared.', 'info');
    }

    // Load Sample Data
    function loadSampleData() {
        processes = [
            { id: 'P1', at: 0, bt: 5, priority: 2 },
            { id: 'P2', at: 1, bt: 3, priority: 1 },
            { id: 'P3', at: 2, bt: 4, priority: 3 },
            { id: 'P4', at: 3, bt: 2, priority: 2 }
        ];
        inputTimeQuantum.value = 2;
        displayTimeQuantum.textContent = 2;

        renderProcessTable();
        updateSuggestedProcessId();
        showToast('Sample dataset loaded (P1, P2, P3, P4 | TQ=2).', 'success');

        // Automatically trigger simulation for sample data demo
        runSimulation();
    }

    // Reset All
    function resetAll() {
        processes = [];
        inputTimeQuantum.value = 2;
        displayTimeQuantum.textContent = 2;
        renderProcessTable();
        updateSuggestedProcessId();
        clearResults();
        showToast('Simulator reset to initial state.', 'info');
    }

    // Clear Result Tables & Gantt Charts
    function clearResults() {
        priorityGantt.innerHTML = '';
        priorityResultBody.innerHTML = '';
        pAvgWt.textContent = '0.00';
        pAvgTat.textContent = '0.00';
        pAvgRt.textContent = '0.00';

        rrGantt.innerHTML = '';
        rrResultBody.innerHTML = '';
        rrAvgWt.textContent = '0.00';
        rrAvgTat.textContent = '0.00';
        rrAvgRt.textContent = '0.00';

        compPWt.textContent = '0.00 ms';
        compRRWt.textContent = '0.00 ms';
        compPTat.textContent = '0.00 ms';
        compRRTat.textContent = '0.00 ms';

        barPWt.style.width = '0%';
        barRRWt.style.width = '0%';
        barPTat.style.width = '0%';
        barRRTat.style.width = '0%';

        conclusionTitle.textContent = 'Algorithm Performance Analysis';
        conclusionText.textContent = 'Run the simulation to see dynamic performance comparison results based on your process queue input.';
    }

    // Get Color for Process ID
    function getProcessColor(id) {
        if (id === 'IDLE') return null;
        let hash = 0;
        for (let i = 0; i < id.length; i++) {
            hash += id.charCodeAt(i);
        }
        return processColors[hash % processColors.length];
    }

    // ==========================================
    // 1. Non-Preemptive Priority Scheduling
    // ==========================================
    function solvePriority(inputProcesses) {
        let procs = inputProcesses.map(p => ({ ...p, completed: false, firstStart: -1 }));
        let currentTime = 0;
        let completedCount = 0;
        let gantt = [];

        while (completedCount < procs.length) {
            // Find processes that have arrived and are incomplete
            let arrived = procs.filter(p => !p.completed && p.at <= currentTime);

            if (arrived.length === 0) {
                // CPU is Idle until next process arrives
                let remainingUnarrived = procs.filter(p => !p.completed);
                let nextAT = Math.min(...remainingUnarrived.map(p => p.at));
                
                gantt.push({
                    id: 'IDLE',
                    start: currentTime,
                    end: nextAT,
                    duration: nextAT - currentTime
                });
                currentTime = nextAT;
                continue;
            }

            // Select highest priority (smallest priority number)
            // Tie-breaker: earliest Arrival Time (AT), then original list order
            arrived.sort((a, b) => {
                if (a.priority !== b.priority) return a.priority - b.priority;
                if (a.at !== b.at) return a.at - b.at;
                return procs.indexOf(a) - procs.indexOf(b);
            });

            let currentProc = arrived[0];
            let startTime = currentTime;
            let endTime = startTime + currentProc.bt;

            currentProc.firstStart = startTime;
            currentProc.ct = endTime;
            currentProc.tat = currentProc.ct - currentProc.at;
            currentProc.wt = currentProc.tat - currentProc.bt;
            currentProc.rt = currentProc.firstStart - currentProc.at;
            currentProc.completed = true;

            gantt.push({
                id: currentProc.id,
                start: startTime,
                end: endTime,
                duration: currentProc.bt
            });

            currentTime = endTime;
            completedCount++;
        }

        // Calculate Averages
        const totalWT = procs.reduce((acc, p) => acc + p.wt, 0);
        const totalTAT = procs.reduce((acc, p) => acc + p.tat, 0);
        const totalRT = procs.reduce((acc, p) => acc + p.rt, 0);
        const count = procs.length;

        return {
            results: procs,
            gantt: gantt,
            avgWT: (totalWT / count),
            avgTAT: (totalTAT / count),
            avgRT: (totalRT / count)
        };
    }

    // ==========================================
    // 2. Preemptive Round Robin Scheduling
    // ==========================================
    function solveRoundRobin(inputProcesses, tq) {
        let procs = inputProcesses.map(p => ({
            ...p,
            remainingBt: p.bt,
            firstStart: -1,
            completed: false,
            ct: 0,
            tat: 0,
            wt: 0,
            rt: 0
        }));

        let currentTime = 0;
        let completedCount = 0;
        let gantt = [];
        let readyQueue = [];
        let enqueuedSet = new Set();

        // Sort processes by arrival time initially for initial queueing
        let sortedProcs = [...procs].sort((a, b) => {
            if (a.at !== b.at) return a.at - b.at;
            return procs.indexOf(a) - procs.indexOf(b);
        });

        // Enqueue processes arriving at t=0
        sortedProcs.forEach(p => {
            if (p.at <= currentTime) {
                readyQueue.push(p);
                enqueuedSet.add(p.id);
            }
        });

        while (completedCount < procs.length) {
            if (readyQueue.length === 0) {
                // If queue empty, find next arrival time among remaining processes
                let unarrived = procs.filter(p => !p.completed && !enqueuedSet.has(p.id));
                if (unarrived.length > 0) {
                    let nextAT = Math.min(...unarrived.map(p => p.at));
                    gantt.push({
                        id: 'IDLE',
                        start: currentTime,
                        end: nextAT,
                        duration: nextAT - currentTime
                    });
                    currentTime = nextAT;

                    // Enqueue processes that arrived at nextAT
                    sortedProcs.forEach(p => {
                        if (!enqueuedSet.has(p.id) && p.at <= currentTime) {
                            readyQueue.push(p);
                            enqueuedSet.add(p.id);
                        }
                    });
                }
                continue;
            }

            let currentProc = readyQueue.shift();

            if (currentProc.firstStart === -1) {
                currentProc.firstStart = currentTime;
            }

            let execTime = Math.min(currentProc.remainingBt, tq);
            let startTime = currentTime;
            let endTime = startTime + execTime;

            gantt.push({
                id: currentProc.id,
                start: startTime,
                end: endTime,
                duration: execTime
            });

            currentTime = endTime;
            currentProc.remainingBt -= execTime;

            // Enqueue newly arrived processes during this time slice (startTime, endTime]
            sortedProcs.forEach(p => {
                if (!enqueuedSet.has(p.id) && p.at > startTime && p.at <= currentTime) {
                    readyQueue.push(p);
                    enqueuedSet.add(p.id);
                }
            });

            // If current process still has remaining burst time, add back to queue
            if (currentProc.remainingBt > 0) {
                readyQueue.push(currentProc);
            } else {
                currentProc.completed = true;
                currentProc.ct = currentTime;
                currentProc.tat = currentProc.ct - currentProc.at;
                currentProc.wt = currentProc.tat - currentProc.bt;
                currentProc.rt = currentProc.firstStart - currentProc.at;
                completedCount++;
            }
        }

        // Calculate Averages
        const totalWT = procs.reduce((acc, p) => acc + p.wt, 0);
        const totalTAT = procs.reduce((acc, p) => acc + p.tat, 0);
        const totalRT = procs.reduce((acc, p) => acc + p.rt, 0);
        const count = procs.length;

        return {
            results: procs,
            gantt: gantt,
            avgWT: (totalWT / count),
            avgTAT: (totalTAT / count),
            avgRT: (totalRT / count)
        };
    }

    // Render Gantt Chart Visuals
    function renderGanttChart(container, ganttList) {
        container.innerHTML = '';
        if (!ganttList || ganttList.length === 0) return;

        const totalDuration = ganttList[ganttList.length - 1].end;

        ganttList.forEach((block) => {
            const el = document.createElement('div');
            el.className = 'gantt-block';
            
            // Calculate flex allocation based on execution duration
            el.style.flex = `${block.duration} 0 0%`;

            if (block.id === 'IDLE') {
                el.classList.add('idle-block');
                el.innerHTML = `
                    <span class="pid">IDLE</span>
                    <span class="duration">${block.duration} ms</span>
                    <div class="gantt-time-range">
                        <span class="time-marker-start">${block.start}</span>
                        <span class="time-marker-end">${block.end}</span>
                    </div>
                `;
            } else {
                const color = getProcessColor(block.id);
                if (color) {
                    el.style.background = color.bg;
                    el.style.border = `1px solid ${color.border}`;
                }
                el.innerHTML = `
                    <span class="pid">${block.id}</span>
                    <span class="duration">${block.duration} ms</span>
                    <div class="gantt-time-range">
                        <span class="time-marker-start">${block.start}</span>
                        <span class="time-marker-end">${block.end}</span>
                    </div>
                `;
            }

            container.appendChild(el);
        });
    }

    // Render Results Table
    function renderResultTable(tbody, results) {
        tbody.innerHTML = '';
        // Sort processes by original ID/AT for clean tabular display
        let sorted = [...results].sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));

        sorted.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${p.id}</strong></td>
                <td>${p.at}</td>
                <td>${p.bt}</td>
                <td>${p.priority}</td>
                <td>${p.ct}</td>
                <td>${p.tat}</td>
                <td>${p.wt}</td>
                <td>${p.rt}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    // Main Simulation Handler
    function runSimulation() {
        if (processes.length === 0) {
            showToast('Process queue is empty. Please add processes or load sample data.', 'error');
            return;
        }

        const tq = parseInt(inputTimeQuantum.value, 10);
        if (isNaN(tq) || tq <= 0) {
            showToast('Time Quantum must be a positive integer greater than 0.', 'error');
            return;
        }

        // 1. Solve Priority
        const priorityRes = solvePriority(processes);
        renderGanttChart(priorityGantt, priorityRes.gantt);
        renderResultTable(priorityResultBody, priorityRes.results);

        pAvgWt.textContent = priorityRes.avgWT.toFixed(2);
        pAvgTat.textContent = priorityRes.avgTAT.toFixed(2);
        pAvgRt.textContent = priorityRes.avgRT.toFixed(2);

        // 2. Solve Round Robin
        const rrRes = solveRoundRobin(processes, tq);
        renderGanttChart(rrGantt, rrRes.gantt);
        renderResultTable(rrResultBody, rrRes.results);

        rrAvgWt.textContent = rrRes.avgWT.toFixed(2);
        rrAvgTat.textContent = rrRes.avgTAT.toFixed(2);
        rrAvgRt.textContent = rrRes.avgRT.toFixed(2);

        // 3. Update Comparison
        compPWt.textContent = `${priorityRes.avgWT.toFixed(2)} ms`;
        compRRWt.textContent = `${rrRes.avgWT.toFixed(2)} ms`;
        compPTat.textContent = `${priorityRes.avgTAT.toFixed(2)} ms`;
        compRRTat.textContent = `${rrRes.avgTAT.toFixed(2)} ms`;

        // Calculate progress bar relative widths
        const maxWT = Math.max(priorityRes.avgWT, rrRes.avgWT, 1);
        barPWt.style.width = `${(priorityRes.avgWT / maxWT) * 100}%`;
        barRRWt.style.width = `${(rrRes.avgWT / maxWT) * 100}%`;

        const maxTAT = Math.max(priorityRes.avgTAT, rrRes.avgTAT, 1);
        barPTat.style.width = `${(priorityRes.avgTAT / maxTAT) * 100}%`;
        barRRTat.style.width = `${(rrRes.avgTAT / maxTAT) * 100}%`;

        // Dynamic Conclusion Logic
        if (priorityRes.avgWT < rrRes.avgWT) {
            conclusionTitle.textContent = "Priority Scheduling Performed Better for Waiting Time";
            conclusionText.textContent = `For this process workload, Non-Preemptive Priority Scheduling achieved a lower average waiting time (${priorityRes.avgWT.toFixed(2)} ms vs ${rrRes.avgWT.toFixed(2)} ms for Round Robin).`;
        } else if (rrRes.avgWT < priorityRes.avgWT) {
            conclusionTitle.textContent = "Round Robin Scheduling Performed Better for Waiting Time";
            conclusionText.textContent = `For this process workload, Preemptive Round Robin Scheduling achieved a lower average waiting time (${rrRes.avgWT.toFixed(2)} ms vs ${priorityRes.avgWT.toFixed(2)} ms for Priority Scheduling).`;
        } else {
            conclusionTitle.textContent = "Both Algorithms Achieved Equal Average Waiting Time";
            conclusionText.textContent = `For this process workload, both Priority Scheduling and Round Robin Scheduling resulted in identical average waiting time (${priorityRes.avgWT.toFixed(2)} ms).`;
        }

        // Scroll smoothly to results
        document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
        showToast('Simulation executed successfully!', 'success');
    }
});
