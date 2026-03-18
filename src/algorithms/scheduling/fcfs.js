/**
 * Calculates the First-Come, First-Served (FCFS) CPU Scheduling Algorithm.
 * * @param {Array} processes - Array of objects: { id: number, arrivalTime: number, burstTime: number }
 * @returns {Object} - Contains ganttChart sequence, detailed process metrics, and averages.
 */
export const calculateFCFS = (processes) => {
  if (!processes || processes.length === 0) {
    return {
      ganttChart: [],
      processDetails: [],
      averageTurnaroundTime: 0,
      averageWaitingTime: 0,
    };
  }

  // Clone the array to avoid mutating the original state and sort by Arrival Time
  const sortedProcesses = [...processes].sort((a, b) => {
    if (a.arrivalTime === b.arrivalTime) {
      return a.id - b.id; // Resolve ties by Process ID
    }
    return a.arrivalTime - b.arrivalTime;
  });

  let currentTime = 0;
  const processDetails = [];
  const ganttChart = [];

  let totalTurnaroundTime = 0;
  let totalWaitingTime = 0;

  for (const process of sortedProcesses) {
    // If the CPU is idle (current time is less than the next process's arrival time)
    if (currentTime < process.arrivalTime) {
      ganttChart.push({
        id: 'Idle',
        startTime: currentTime,
        endTime: process.arrivalTime,
      });
      currentTime = process.arrivalTime;
    }

    const startTime = currentTime;
    const completionTime = startTime + process.burstTime;
    const turnaroundTime = completionTime - process.arrivalTime;
    const waitingTime = turnaroundTime - process.burstTime;

    // Add to Gantt Chart sequence
    ganttChart.push({
      id: `P${process.id}`,
      startTime: startTime,
      endTime: completionTime,
    });

    // Store calculated details for the results table
    processDetails.push({
      id: process.id,
      arrivalTime: process.arrivalTime,
      burstTime: process.burstTime,
      startTime: startTime,
      completionTime: completionTime,
      turnaroundTime: turnaroundTime,
      waitingTime: waitingTime,
    });

    // Accumulate totals for averages
    totalTurnaroundTime += turnaroundTime;
    totalWaitingTime += waitingTime;

    // Advance the CPU clock
    currentTime = completionTime;
  }

  // Sort details back by Process ID so the final UI table looks organized
  processDetails.sort((a, b) => a.id - b.id);

  const averageTurnaroundTime = Number((totalTurnaroundTime / processes.length).toFixed(2));
  const averageWaitingTime = Number((totalWaitingTime / processes.length).toFixed(2));

  return {
    ganttChart,
    processDetails,
    averageTurnaroundTime,
    averageWaitingTime,
  };
};