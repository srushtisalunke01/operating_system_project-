#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>

#define MAX_PROCESSES 100

// Structure to hold process information
typedef struct {
    char id[10];
    int arrival_time;
    int burst_time;
    int priority;
    
    // Calculated fields
    int remaining_time;
    int first_start_time;
    int completion_time;
    int turnaround_time;
    int waiting_time;
    int response_time;
    bool completed;
} Process;

// Structure for Gantt Chart Block
typedef struct {
    char id[10];
    int start_time;
    int end_time;
} GanttBlock;

// Function prototypes
void solvePriority(Process input_procs[], int n);
void solveRoundRobin(Process input_procs[], int n, int tq);
void printResults(Process procs[], int n, float avg_wt, float avg_tat, float avg_rt, const char *title);
void printGanttChart(GanttBlock gantt[], int gantt_size);

int main() {
    int choice, n = 0, tq = 2;
    Process processes[MAX_PROCESSES];

    printf("=====================================================\n");
    printf("   CPU SCHEDULING SIMULATOR IN C (OS MICROPROJECT)   \n");
    printf("=====================================================\n\n");

    printf("Select Data Input Option:\n");
    printf("1. Use Sample Microproject Dataset (P1, P2, P3, P4)\n");
    printf("2. Enter Custom Processes\n");
    printf("Enter choice (1 or 2): ");
    if (scanf("%d", &choice) != 1) choice = 1;

    if (choice == 1) {
        n = 4;
        tq = 2;
        // P1: AT=0, BT=5, Priority=2
        strcpy(processes[0].id, "P1");
        processes[0].arrival_time = 0; processes[0].burst_time = 5; processes[0].priority = 2;
        
        // P2: AT=1, BT=3, Priority=1
        strcpy(processes[1].id, "P2");
        processes[1].arrival_time = 1; processes[1].burst_time = 3; processes[1].priority = 1;
        
        // P3: AT=2, BT=4, Priority=3
        strcpy(processes[2].id, "P3");
        processes[2].arrival_time = 2; processes[2].burst_time = 4; processes[2].priority = 3;
        
        // P4: AT=3, BT=2, Priority=2
        strcpy(processes[3].id, "P4");
        processes[3].arrival_time = 3; processes[3].burst_time = 2; processes[3].priority = 2;

        printf("\n[Loaded Sample Dataset with Time Quantum = %d]\n", tq);
    } else {
        printf("\nEnter total number of processes: ");
        scanf("%d", &n);

        for (int i = 0; i < n; i++) {
            sprintf(processes[i].id, "P%d", i + 1);
            printf("\n--- Process %s ---\n", processes[i].id);
            printf("Arrival Time: ");
            scanf("%d", &processes[i].arrival_time);
            printf("Burst Time: ");
            scanf("%d", &processes[i].burst_time);
            printf("Priority (Lower # = Higher Priority): ");
            scanf("%d", &processes[i].priority);
        }

        printf("\nEnter Time Quantum for Round Robin: ");
        scanf("%d", &tq);
    }

    printf("\n\n=====================================================\n");
    printf("      1. NON-PREEMPTIVE PRIORITY SCHEDULING          \n");
    printf("=====================================================\n");
    solvePriority(processes, n);

    printf("\n\n=====================================================\n");
    printf("        2. PREEMPTIVE ROUND ROBIN SCHEDULING         \n");
    printf("=====================================================\n");
    solveRoundRobin(processes, n, tq);

    return 0;
}

// -------------------------------------------------------------------
// 1. Non-Preemptive Priority Scheduling Implementation
// -------------------------------------------------------------------
void solvePriority(Process input_procs[], int n) {
    Process procs[MAX_PROCESSES];
    GanttBlock gantt[MAX_PROCESSES * 2];
    int gantt_size = 0;

    for (int i = 0; i < n; i++) {
        procs[i] = input_procs[i];
        procs[i].completed = false;
        procs[i].first_start_time = -1;
    }

    int current_time = 0;
    int completed_count = 0;

    while (completed_count < n) {
        int idx = -1;
        int highest_priority = 999999;

        // Find arrived process with highest priority (smallest priority number)
        for (int i = 0; i < n; i++) {
            if (!procs[i].completed && procs[i].arrival_time <= current_time) {
                if (procs[i].priority < highest_priority) {
                    highest_priority = procs[i].priority;
                    idx = i;
                } else if (procs[i].priority == highest_priority) {
                    // Tie-breaker: earlier arrival time
                    if (procs[i].arrival_time < procs[idx].arrival_time) {
                        idx = i;
                    }
                }
            }
        }

        if (idx == -1) {
            // CPU is IDLE
            int min_next_at = 999999;
            for (int i = 0; i < n; i++) {
                if (!procs[i].completed && procs[i].arrival_time < min_next_at) {
                    min_next_at = procs[i].arrival_time;
                }
            }
            gantt[gantt_size].start_time = current_time;
            gantt[gantt_size].end_time = min_next_at;
            strcpy(gantt[gantt_size].id, "IDLE");
            gantt_size++;
            current_time = min_next_at;
            continue;
        }

        // Execute process to completion (Non-Preemptive)
        int start = current_time;
        int end = start + procs[idx].burst_time;

        procs[idx].first_start_time = start;
        procs[idx].completion_time = end;
        procs[idx].turnaround_time = procs[idx].completion_time - procs[idx].arrival_time;
        procs[idx].waiting_time = procs[idx].turnaround_time - procs[idx].burst_time;
        procs[idx].response_time = procs[idx].first_start_time - procs[idx].arrival_time;
        procs[idx].completed = true;

        gantt[gantt_size].start_time = start;
        gantt[gantt_size].end_time = end;
        strcpy(gantt[gantt_size].id, procs[idx].id);
        gantt_size++;

        current_time = end;
        completed_count++;
    }

    // Calculations
    float total_wt = 0, total_tat = 0, total_rt = 0;
    for (int i = 0; i < n; i++) {
        total_wt += procs[i].waiting_time;
        total_tat += procs[i].turnaround_time;
        total_rt += procs[i].response_time;
    }

    printGanttChart(gantt, gantt_size);
    printResults(procs, n, total_wt / n, total_tat / n, total_rt / n, "Priority Scheduling Results");
}

// -------------------------------------------------------------------
// 2. Preemptive Round Robin Scheduling Implementation
// -------------------------------------------------------------------
void solveRoundRobin(Process input_procs[], int n, int tq) {
    Process procs[MAX_PROCESSES];
    GanttBlock gantt[MAX_PROCESSES * 10];
    int gantt_size = 0;

    int ready_queue[MAX_PROCESSES * 50];
    int head = 0, tail = 0;
    bool enqueued[MAX_PROCESSES] = {false};

    for (int i = 0; i < n; i++) {
        procs[i] = input_procs[i];
        procs[i].remaining_time = procs[i].burst_time;
        procs[i].completed = false;
        procs[i].first_start_time = -1;
    }

    int current_time = 0;
    int completed_count = 0;

    // Enqueue processes arriving at t=0
    for (int i = 0; i < n; i++) {
        if (procs[i].arrival_time <= current_time) {
            ready_queue[tail++] = i;
            enqueued[i] = true;
        }
    }

    while (completed_count < n) {
        if (head == tail) { // Queue is empty
            int min_next_at = 999999;
            for (int i = 0; i < n; i++) {
                if (!procs[i].completed && !enqueued[i] && procs[i].arrival_time < min_next_at) {
                    min_next_at = procs[i].arrival_time;
                }
            }
            if (min_next_at != 999999) {
                gantt[gantt_size].start_time = current_time;
                gantt[gantt_size].end_time = min_next_at;
                strcpy(gantt[gantt_size].id, "IDLE");
                gantt_size++;
                current_time = min_next_at;

                for (int i = 0; i < n; i++) {
                    if (!enqueued[i] && procs[i].arrival_time <= current_time) {
                        ready_queue[tail++] = i;
                        enqueued[i] = true;
                    }
                }
            }
            continue;
        }

        int idx = ready_queue[head++];

        if (procs[idx].first_start_time == -1) {
            procs[idx].first_start_time = current_time;
        }

        int exec_time = (procs[idx].remaining_time < tq) ? procs[idx].remaining_time : tq;
        int start = current_time;
        int end = start + exec_time;

        gantt[gantt_size].start_time = start;
        gantt[gantt_size].end_time = end;
        strcpy(gantt[gantt_size].id, procs[idx].id);
        gantt_size++;

        current_time = end;
        procs[idx].remaining_time -= exec_time;

        // Enqueue processes arriving during execution time slice (start, end]
        for (int i = 0; i < n; i++) {
            if (!enqueued[i] && procs[i].arrival_time > start && procs[i].arrival_time <= current_time) {
                ready_queue[tail++] = i;
                enqueued[i] = true;
            }
        }

        // If current process is not completed, re-enqueue
        if (procs[idx].remaining_time > 0) {
            ready_queue[tail++] = idx;
        } else {
            procs[idx].completed = true;
            procs[idx].completion_time = current_time;
            procs[idx].turnaround_time = procs[idx].completion_time - procs[idx].arrival_time;
            procs[idx].waiting_time = procs[idx].turnaround_time - procs[idx].burst_time;
            procs[idx].response_time = procs[idx].first_start_time - procs[idx].arrival_time;
            completed_count++;
        }
    }

    // Calculations
    float total_wt = 0, total_tat = 0, total_rt = 0;
    for (int i = 0; i < n; i++) {
        total_wt += procs[i].waiting_time;
        total_tat += procs[i].turnaround_time;
        total_rt += procs[i].response_time;
    }

    printGanttChart(gantt, gantt_size);
    printResults(procs, n, total_wt / n, total_tat / n, total_rt / n, "Round Robin Scheduling Results");
}

// -------------------------------------------------------------------
// Helper: Print Results Table
// -------------------------------------------------------------------
void printResults(Process procs[], int n, float avg_wt, float avg_tat, float avg_rt, const char *title) {
    printf("\n--- %s ---\n", title);
    printf("+---------+--------------+------------+----------+-----------------+-----------------+--------------+---------------+--+\n");
    printf("| PID     | Arrival Time | Burst Time | Priority | Completion Time | Turnaround Time | Waiting Time | Response Time |\n");
    printf("+---------+--------------+------------+----------+-----------------+-----------------+--------------+---------------+--+\n");

    for (int i = 0; i < n; i++) {
        printf("| %-7s | %-12d | %-10d | %-8d | %-15d | %-15d | %-12d | %-13d |\n",
               procs[i].id, procs[i].arrival_time, procs[i].burst_time, procs[i].priority,
               procs[i].completion_time, procs[i].turnaround_time, procs[i].waiting_time, procs[i].response_time);
    }
    printf("+---------+--------------+------------+----------+-----------------+-----------------+--------------+---------------+--+\n");
    printf("Average Waiting Time (WT)    : %.2f ms\n", avg_wt);
    printf("Average Turnaround Time (TAT): %.2f ms\n", avg_tat);
    printf("Average Response Time (RT)   : %.2f ms\n", avg_rt);
}

// -------------------------------------------------------------------
// Helper: Print Visual ASCII Gantt Chart
// -------------------------------------------------------------------
void printGanttChart(GanttBlock gantt[], int gantt_size) {
    printf("\n--- Visual Gantt Chart ---\n");

    // Top border
    for (int i = 0; i < gantt_size; i++) {
        printf("+-------");
    }
    printf("+\n|");

    // Process IDs
    for (int i = 0; i < gantt_size; i++) {
        printf("  %-4s |", gantt[i].id);
    }
    printf("\n");

    // Bottom border
    for (int i = 0; i < gantt_size; i++) {
        printf("+-------");
    }
    printf("+\n");

    // Time Markers
    printf("%d", gantt[0].start_time);
    for (int i = 0; i < gantt_size; i++) {
        printf("       %d", gantt[i].end_time);
    }
    printf("\n");
}
