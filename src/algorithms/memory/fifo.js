/**
 * Calculates the FIFO (First-In-First-Out) Page Replacement Algorithm.
 * @param {Array<number>} pages - The reference string array (e.g., [7,0,1,2,0,3])
 * @param {number} capacity - Number of page frames available in memory
 * @returns {Object} - Step-by-step memory states and final fault/hit counts.
 */
export const calculateFIFO = (pages, capacity) => {
  let memory = [];
  let steps = [];
  let pageFaults = 0;
  let pageHits = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    let isFault = false;
    let replaced = null;

    if (memory.includes(page)) {
      pageHits++;
    } else {
      isFault = true;
      pageFaults++;
      
      if (memory.length < capacity) {
        memory.push(page);
      } else {
        replaced = memory[0]; // The oldest page
        memory.shift();       // Remove oldest
        memory.push(page);    // Add newest to the end
      }
    }

    steps.push({
      step: i + 1,
      page: page,
      memory: [...memory],
      isFault: isFault,
      replaced: replaced
    });
  }

  return { steps, pageFaults, pageHits, capacity };
};