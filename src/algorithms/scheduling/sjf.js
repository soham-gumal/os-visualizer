/**
 * Calculates the Shortest Job First (SJF) - Non-Preemptive Scheduling Algorithm.
 * @param {Array} processes - Array of objects: { id: number, arrivalTime: number, burstTime: number }
 * @returns {Object} - Contains ganttChart sequence, detailed process metrics, and averages.
 */
export const calculateSJF = (processes) => {
  if (!processes || processes.length === 0) {
    return {
      ganttChart: [],
      processDetails: [],
      averageTurnaroundTime: 0,
      averageWaitingTime: 0,
    };
  }

  // Work with a copy to avoid side effects
  let pendingProcesses = [...processes].map(p => ({ ...p }));
  let currentTime = 0;
  const processDetails = [];
  const ganttChart = [];

  const totalProcesses = processes.length;

  while (pendingProcesses.length > 0) {
    // 1. Filter processes that have already arrived
    const availableProcesses = pendingProcesses.filter(p => p.arrivalTime <= currentTime);

    if (availableProcesses.length === 0) {
      // 2. If no process has arrived, CPU is Idle until the next process arrives
      const nextArrival = Math.min(...pendingProcesses.map(p => p.arrivalTime));
      ganttChart.push({
        id: 'Idle',
        startTime: currentTime,
        endTime: nextArrival,
      });
      currentTime = nextArrival;
      continue;
    }

    // 3. Pick the process with the SHORTEST Burst Time (The core of SJF)
    availableProcesses.sort((a, b) => {
      if (a.burstTime === b.burstTime) {
        return a.arrivalTime - b.arrivalTime; // Tie-breaker: Arrival Time
      }
      return a.burstTime - b.burstTime;
    });

    const selectedProcess = availableProcesses[0];

    // 4. Calculate Metrics
    const startTime = currentTime;
    const completionTime = startTime + selectedProcess.burstTime;
    const turnaroundTime = completionTime - selectedProcess.arrivalTime;
    const waitingTime = turnaroundTime - selectedProcess.burstTime;

    ganttChart.push({
      id: `P${selectedProcess.id}`,
      startTime: startTime,
      endTime: completionTime,
    });

    processDetails.push({
      id: selectedProcess.id,
      arrivalTime: selectedProcess.arrivalTime,
      burstTime: selectedProcess.burstTime,
      startTime: startTime,
      completionTime: completionTime,
      turnaroundTime: turnaroundTime,
      waitingTime: waitingTime,
    });

    // 5. Update clock and remove process from pending list
    currentTime = completionTime;
    pendingProcesses = pendingProcesses.filter(p => p.id !== selectedProcess.id);
  }

  // Sort by ID for clean table display
  processDetails.sort((a, b) => a.id - b.id);

  const totalTAT = processDetails.reduce((sum, p) => sum + p.turnaroundTime, 0);
  const totalWT = processDetails.reduce((sum, p) => sum + p.waitingTime, 0);

  return {
    ganttChart,
    processDetails,
    averageTurnaroundTime: Number((totalTAT / totalProcesses).toFixed(2)),
    averageWaitingTime: Number((totalWT / totalProcesses).toFixed(2)),
  };
};