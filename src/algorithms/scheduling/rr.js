/**
 * Calculates the Round Robin (RR) Scheduling Algorithm.
 * @param {Array} processes - Array of objects: { id: number, arrivalTime: number, burstTime: number }
 * @param {number} timeQuantum - The maximum time a process can run before being preempted.
 * @returns {Object} - Contains ganttChart sequence, detailed process metrics, and averages.
 */
export const calculateRR = (processes, timeQuantum) => {
  if (!processes || processes.length === 0 || timeQuantum <= 0) {
    return {
      ganttChart: [],
      processDetails: [],
      averageTurnaroundTime: 0,
      averageWaitingTime: 0,
    };
  }

  // Deep copy and sort by arrival time
  const sortedProcesses = [...processes]
    .map(p => ({ ...p, remainingBurstTime: p.burstTime }))
    .sort((a, b) => a.arrivalTime - b.arrivalTime);

  let currentTime = 0;
  let completed = 0;
  const n = sortedProcesses.length;
  
  const readyQueue = [];
  const ganttChart = [];
  const processDetails = [];
  
  let processIndex = 0; // Tracks which processes have been added to the ready queue

  while (completed < n) {
    // 1. Add all processes that have arrived up to the currentTime to the Ready Queue
    while (processIndex < n && sortedProcesses[processIndex].arrivalTime <= currentTime) {
      readyQueue.push(sortedProcesses[processIndex]);
      processIndex++;
    }

    // 2. If the queue is empty but there are still pending processes, the CPU is Idle
    if (readyQueue.length === 0) {
      const nextArrival = sortedProcesses[processIndex].arrivalTime;
      ganttChart.push({
        id: 'Idle',
        startTime: currentTime,
        endTime: nextArrival,
      });
      currentTime = nextArrival;
      continue;
    }

    // 3. Dequeue the first process in the line
    const currentProcess = readyQueue.shift();
    const startTime = currentTime;
    
    // 4. Run the process for either the Time Quantum or its remaining time (whichever is smaller)
    const executeTime = Math.min(currentProcess.remainingBurstTime, timeQuantum);
    
    currentTime += executeTime;
    currentProcess.remainingBurstTime -= executeTime;

    // 5. Add this execution block to the Gantt Chart
    // If the previous block was the same process (can happen if no one else is in queue), merge them for a cleaner chart
    const lastBlock = ganttChart[ganttChart.length - 1];
    if (lastBlock && lastBlock.id === `P${currentProcess.id}`) {
      lastBlock.endTime = currentTime;
    } else {
      ganttChart.push({
        id: `P${currentProcess.id}`,
        startTime: startTime,
        endTime: currentTime,
      });
    }

    // 6. VERY IMPORTANT: Check if any NEW processes arrived while this process was executing
    // They must be added to the queue BEFORE the current process is pushed back
    while (processIndex < n && sortedProcesses[processIndex].arrivalTime <= currentTime) {
      readyQueue.push(sortedProcesses[processIndex]);
      processIndex++;
    }

    // 7. If the current process still needs more time, put it at the back of the queue
    if (currentProcess.remainingBurstTime > 0) {
      readyQueue.push(currentProcess);
    } else {
      // 8. If the process is fully complete, calculate its final metrics
      completed++;
      const completionTime = currentTime;
      const turnaroundTime = completionTime - currentProcess.arrivalTime;
      const waitingTime = turnaroundTime - currentProcess.burstTime;

      processDetails.push({
        id: currentProcess.id,
        arrivalTime: currentProcess.arrivalTime,
        burstTime: currentProcess.burstTime,
        completionTime: completionTime,
        turnaroundTime: turnaroundTime,
        waitingTime: waitingTime,
      });
    }
  }

  // Sort details by ID so the table looks neat
  processDetails.sort((a, b) => a.id - b.id);

  const totalTAT = processDetails.reduce((sum, p) => sum + p.turnaroundTime, 0);
  const totalWT = processDetails.reduce((sum, p) => sum + p.waitingTime, 0);

  return {
    ganttChart,
    processDetails,
    averageTurnaroundTime: Number((totalTAT / n).toFixed(2)),
    averageWaitingTime: Number((totalWT / n).toFixed(2)),
  };
};