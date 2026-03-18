/**
 * Calculates the Banker's Algorithm to determine if a system is in a Safe State.
 * @param {Array<Array<number>>} allocation - The currently allocated resources for each process.
 * @param {Array<Array<number>>} max - The maximum requested resources for each process.
 * @param {Array<number>} totalResources - Total instances of each resource type in the OS.
 * @returns {Object} - Contains boolean isSafe, safeSequence, needMatrix, and step-by-step available resources.
 */
export const calculateBankers = (allocation, max, totalResources) => {
  if (!allocation || !max || !totalResources || allocation.length === 0) {
    return null;
  }

  const numProcesses = allocation.length;
  const numResources = totalResources.length;

  // 1. Calculate Initial Available Resources (Total - Sum of Allocated)
  const available = [...totalResources];
  for (let j = 0; j < numResources; j++) {
    let sumAllocated = 0;
    for (let i = 0; i < numProcesses; i++) {
      sumAllocated += allocation[i][j];
    }
    available[j] -= sumAllocated;
  }

  // 2. Calculate NEED Matrix (Max - Allocation)
  const need = [];
  for (let i = 0; i < numProcesses; i++) {
    const processNeed = [];
    for (let j = 0; j < numResources; j++) {
      processNeed.push(max[i][j] - allocation[i][j]);
    }
    need.push(processNeed);
  }

  // 3. Safety Algorithm Execution
  const finish = Array(numProcesses).fill(false);
  const safeSequence = [];
  let work = [...available]; // 'work' represents current available resources in the simulation
  const availableSteps = [[...work]]; // Track how available resources grow as processes finish

  let count = 0;
  while (count < numProcesses) {
    let found = false;
    
    for (let p = 0; p < numProcesses; p++) {
      if (!finish[p]) {
        // Check if the current process's Needs can be satisfied by Work (Available)
        let canAllocate = true;
        for (let j = 0; j < numResources; j++) {
          if (need[p][j] > work[j]) {
            canAllocate = false;
            break;
          }
        }

        // If it can be allocated, the process runs, finishes, and returns its allocated resources
        if (canAllocate) {
          for (let j = 0; j < numResources; j++) {
            work[j] += allocation[p][j];
          }
          safeSequence.push(p);
          availableSteps.push([...work]);
          finish[p] = true;
          found = true;
          count++;
        }
      }
    }

    // If we loop through all processes and cannot find a single one that can execute, we are in a Deadlock
    if (!found) {
      return {
        isSafe: false,
        sequence: safeSequence, // Partial sequence before failure
        needMatrix: need,
        initialAvailable: available,
        availableSteps: availableSteps
      };
    }
  }

  // If we reach here, all processes finished successfully
  return {
    isSafe: true,
    sequence: safeSequence,
    needMatrix: need,
    initialAvailable: available,
    availableSteps: availableSteps
  };
};