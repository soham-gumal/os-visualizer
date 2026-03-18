import { useState } from 'react';
import { Play, HardDrive, RefreshCw } from 'lucide-react';
import { calculateFIFO } from '../algorithms/memory/fifo';
import { calculateLRU } from '../algorithms/memory/lru';

export default function MemoryLab() {
  const [referenceString, setReferenceString] = useState("7, 0, 1, 2, 0, 3, 0, 4, 2, 3, 0, 3, 2");
  const [frames, setFrames] = useState(3);
  const [selectedAlgo, setSelectedAlgo] = useState('FIFO');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const runSimulation = () => {
    setError('');
    
    // Parse the comma-separated string into an array of integers
    const pagesArray = referenceString
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(Number);

    if (pagesArray.some(isNaN)) {
      setError("Invalid Reference String. Please enter only numbers separated by commas.");
      return;
    }

    if (pagesArray.length === 0) {
      setError("Please enter a valid reference string.");
      return;
    }

    let output;
    if (selectedAlgo === 'FIFO') {
      output = calculateFIFO(pagesArray, frames);
    } else if (selectedAlgo === 'LRU') {
      output = calculateLRU(pagesArray, frames);
    }

    setResults(output);
  };

  const clearAll = () => {
    setReferenceString("");
    setFrames(3);
    setResults(null);
    setError('');
  };

  const hitRatio = results ? ((results.pageHits / (results.pageHits + results.pageFaults)) * 100).toFixed(1) : 0;
  const faultRatio = results ? ((results.pageFaults / (results.pageHits + results.pageFaults)) * 100).toFixed(1) : 0;

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      
      {/* Configuration Panel */}
      <div className="bg-[#1f2028] border border-[#2e303a] rounded-xl p-6 shadow-lg flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-[#2e303a] pb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <HardDrive size={20} className="text-[#c084fc]" />
            Memory Paging Configuration
          </h3>
          <button 
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 px-2 py-1.5 transition-colors"
          >
            <RefreshCw size={14} /> Reset
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">
              Reference String (Memory Requests)
            </label>
            <input 
              type="text" 
              value={referenceString}
              onChange={(e) => {setReferenceString(e.target.value); setResults(null);}}
              placeholder="e.g., 1, 2, 3, 4, 1, 2, 5"
              className="w-full bg-[#16171d] border border-[#2e303a] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#c084fc] font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">
              Page Frames (Capacity)
            </label>
            <input 
              type="number" 
              min="1"
              max="10"
              value={frames}
              onChange={(e) => {setFrames(parseInt(e.target.value) || 1); setResults(null);}}
              className="w-full bg-[#16171d] border border-[#2e303a] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#c084fc]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end mt-2">
           <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">
              Replacement Algorithm
            </label>
            <div className="flex gap-4">
              {['FIFO', 'LRU'].map(algo => (
                <button
                  key={algo}
                  onClick={() => {setSelectedAlgo(algo); setResults(null);}}
                  className={`flex-1 py-3 rounded-lg border font-bold text-sm transition-all ${
                    selectedAlgo === algo 
                      ? 'bg-[#c084fc]/15 border-[#c084fc] text-[#c084fc]' 
                      : 'bg-[#16171d] border-[#2e303a] text-gray-500 hover:text-white'
                  }`}
                >
                  {algo}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={runSimulation}
            className="w-full flex items-center justify-center gap-2 bg-[#c084fc] hover:bg-[#a855f7] text-white font-bold py-3 rounded-lg transition-all shadow-lg active:scale-95"
          >
            <Play size={18} fill="currentColor" />
            ANALYZE PAGING
          </button>
        </div>
      </div>

      {/* Results & Visualizer */}
      {results && (
        <div className="bg-[#1f2028] border border-[#2e303a] rounded-xl p-6 shadow-lg flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#16171d] border border-red-500/20 p-4 rounded-lg flex flex-col items-center">
              <span className="text-xs text-gray-500 uppercase font-bold mb-1">Page Faults (Misses)</span>
              <span className="text-3xl font-mono text-red-400 font-bold">{results.pageFaults}</span>
            </div>
            <div className="bg-[#16171d] border border-green-500/20 p-4 rounded-lg flex flex-col items-center">
              <span className="text-xs text-gray-500 uppercase font-bold mb-1">Page Hits</span>
              <span className="text-3xl font-mono text-green-400 font-bold">{results.pageHits}</span>
            </div>
            <div className="bg-[#16171d] border border-[#2e303a] p-4 rounded-lg flex flex-col items-center">
              <span className="text-xs text-gray-500 uppercase font-bold mb-1">Fault Ratio</span>
              <span className="text-3xl font-mono text-white">{faultRatio}%</span>
            </div>
            <div className="bg-[#16171d] border border-[#2e303a] p-4 rounded-lg flex flex-col items-center">
              <span className="text-xs text-gray-500 uppercase font-bold mb-1">Hit Ratio</span>
              <span className="text-3xl font-mono text-white">{hitRatio}%</span>
            </div>
          </div>

          {/* Grid Visualizer */}
          <div className="mt-4">
            <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">Memory State Visualizer</h4>
            <div className="overflow-x-auto pb-4 no-scrollbar">
              <div className="flex w-max min-w-full border border-[#2e303a] bg-[#16171d] rounded-lg p-6 gap-2">
                
                {/* Row Headers */}
                <div className="flex flex-col gap-2 font-mono text-sm text-gray-400 font-bold text-right pr-6 border-r border-[#2e303a] justify-center">
                  <div className="h-10 flex items-center justify-end text-[#c084fc]">Req</div>
                  {Array.from({ length: results.capacity }).map((_, i) => (
                    <div key={i} className="h-10 flex items-center justify-end">Frame {i + 1}</div>
                  ))}
                  <div className="h-10 flex items-center justify-end">Status</div>
                </div>

                {/* Step Columns */}
                {results.steps.map((step, index) => (
                  <div key={index} className="flex flex-col gap-2 font-mono text-sm group">
                    
                    {/* Requested Page */}
                    <div className="h-10 w-12 flex items-center justify-center text-white font-bold bg-[#2e303a] rounded">
                      {step.page}
                    </div>
                    
                    {/* Memory Frames */}
                    {Array.from({ length: results.capacity }).map((_, i) => {
                      const val = step.memory[i];
                      const isNewlyAdded = step.isFault && val === step.page;
                      
                      return (
                        <div 
                          key={i} 
                          className={`h-10 w-12 flex items-center justify-center rounded border transition-colors
                            ${isNewlyAdded 
                              ? 'border-red-500 text-red-400 bg-red-500/10 font-bold' 
                              : 'border-[#2e303a] text-gray-300 bg-[#1f2028]'}
                          `}
                        >
                          {val !== undefined ? val : '-'}
                        </div>
                      )
                    })}
                    
                    {/* Status Indicator */}
                    <div className={`h-10 w-12 flex items-center justify-center font-bold text-lg
                      ${step.isFault ? 'text-red-500' : 'text-green-500'}
                    `}>
                      {step.isFault ? 'F' : 'H'}
                    </div>

                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              <span className="text-red-400 font-bold">F</span> = Page Fault (Miss) | <span className="text-green-400 font-bold">H</span> = Page Hit
            </p>
          </div>

        </div>
      )}
    </div>
  );
}