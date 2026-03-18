/**
 * Calculates the LRU (Least Recently Used) Page Replacement Algorithm.
 * @param {Array<number>} pages - The reference string array (e.g., [7,0,1,2,0,3])
 * @param {number} capacity - Number of page frames available in memory
 * @returns {Object} - Step-by-step memory states and final fault/hit counts.
 */
export const calculateLRU = (pages, capacity) => {
  let memory = [];
  let steps = [];
  let pageFaults = 0;
  let pageHits = 0;
  let recentlyUsed = []; // Index 0 is Least Recently Used, last is Most Recently Used

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    let isFault = false;
    let replaced = null;

    if (memory.includes(page)) {
      pageHits++;
      // Update its position in recently used array
      recentlyUsed = recentlyUsed.filter(p => p !== page);
      recentlyUsed.push(page);
    } else {
      isFault = true;
      pageFaults++;
      
      if (memory.length < capacity) {
        memory.push(page);
        recentlyUsed.push(page);
      } else {
        // Find the least recently used page
        replaced = recentlyUsed[0];
        recentlyUsed.shift(); // Remove from tracking
        
        // Replace it in actual memory
        const replaceIndex = memory.indexOf(replaced);
        memory[replaceIndex] = page;
        
        // Add new page to recently used tracking
        recentlyUsed.push(page);
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