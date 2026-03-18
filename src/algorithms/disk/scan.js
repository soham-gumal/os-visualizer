/**
 * Calculates the SCAN (Elevator) Disk Scheduling Algorithm.
 * @param {Array<number>} requests - Array of track requests.
 * @param {number} initialHead - Starting position of the disk head.
 * @param {number} maxTrack - Total number of tracks/cylinders (e.g., 200 means 0 to 199).
 * @param {string} direction - Direction of initial head movement ('left' or 'right').
 * @returns {Object} - Contains the sequence of head movements and total seek operations.
 */
export const calculateSCAN = (requests, initialHead, maxTrack, direction) => {
  if (!requests || requests.length === 0) return null;

  let seekCount = 0;
  const sequence = [];
  const left = [];
  const right = [];

  // 1. Add end tracks based on direction to force the head to go to the end
  if (direction === "left") {
    left.push(0);
  } else if (direction === "right") {
    right.push(maxTrack - 1);
  }

  // 2. Divide the requests into left and right of the initial head
  for (let i = 0; i < requests.length; i++) {
    if (requests[i] < initialHead) {
      left.push(requests[i]);
    }
    if (requests[i] > initialHead) {
      right.push(requests[i]);
    }
  }

  // 3. Sort the arrays
  left.sort((a, b) => a - b);
  right.sort((a, b) => a - b);

  let currHead = initialHead;
  let currentDirection = direction;
  sequence.push(currHead);

  // 4. Run the elevator (Two passes)
  for (let run = 0; run < 2; run++) {
    if (currentDirection === "left") {
      // Scan leftwards
      for (let i = left.length - 1; i >= 0; i--) {
        sequence.push(left[i]);
        seekCount += Math.abs(currHead - left[i]);
        currHead = left[i];
      }
      currentDirection = "right"; // Reverse direction at the end
    } else if (currentDirection === "right") {
      // Scan rightwards
      for (let i = 0; i < right.length; i++) {
        sequence.push(right[i]);
        seekCount += Math.abs(currHead - right[i]);
        currHead = right[i];
      }
      currentDirection = "left"; // Reverse direction at the end
    }
  }

  return {
    sequence,
    seekCount
  };
};