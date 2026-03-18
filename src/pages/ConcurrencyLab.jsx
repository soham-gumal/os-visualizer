import { useState, useEffect } from 'react';
import { Play, Lock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { calculateBankers } from '../algorithms/concurrency/bankers';

export default function ConcurrencyLab() {
  const [numProcesses, setNumProcesses] = useState(5);
  const [numResources, setNumResources] = useState(3);
  
  // Default data based on classic OS textbook example
  const [totalResources, setTotalResources] = useState([10, 5, 7]);
  const [allocation, setAllocation] = useState([
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2]
  ]);
  const [max, setMax] = useState([
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3]
  ]);

  const [results, setResults] = useState(null);

  // Auto-resize matrices when rows/cols change
  useEffect(() => {
    const newAlloc = Array.from({ length: numProcesses }, (_, i) => 
      Array.from({ length: numResources }, (_, j) => (allocation[i] && allocation[i][j]) || 0)
    );
    const newMax = Array.from({ length: numProcesses }, (_, i) => 
      Array.from({ length: numResources }, (_, j) => (max[i] && max[i][j]) || 0)
    );
    const newTotal = Array.from({ length: numResources }, (_, j) => totalResources[j] || 0);

    setAllocation(newAlloc);
    setMax(newMax);
    setTotalResources(newTotal);
    setResults(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numProcesses, numResources]);

  const handleMatrixChange = (matrixType, i, j, value) => {
    const numValue = parseInt(value) || 0;
    if (matrixType === 'allocation') {
      const newAlloc = [...allocation];
      newAlloc[i][j] = numValue;
      setAllocation(newAlloc);
    } else if (matrixType === 'max') {
      const newMax = [...max];
      newMax[i][j] = numValue;
      setMax(newMax);
    } else if (matrixType === 'total') {
      const newTotal = [...totalResources];
      newTotal[j] = numValue;
      setTotalResources(newTotal);
    }
    setResults(null);
  };

  const runSimulation = () => {
    const output = calculateBankers(allocation, max, totalResources);
    setResults(output);
  };

  const resourceLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G'].slice(0, numResources);

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Input Configuration Left Side */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Controls */}
          <div className="bg-[#1f2028] border border-[#2e303a] rounded-xl p-4 flex gap-6 shadow-lg items-end">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Processes</label>
              <input 
                type="number" min="1" max="10" value={numProcesses}
                onChange={(e) => setNumProcesses(parseInt(e.target.value) || 1)}
                className="w-24 bg-[#16171d] border border-[#2e303a] rounded text-white px-3 py-1.5 focus:border-[#c084fc]"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Resource Types</label>
              <input 
                type="number" min="1" max="5" value={numResources}
                onChange={(e) => setNumResources(parseInt(e.target.value) || 1)}
                className="w-24 bg-[#16171d] border border-[#2e303a] rounded text-white px-3 py-1.5 focus:border-[#c084fc]"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Total System Resources Instances</label>
              <div className="flex gap-2">
                {resourceLabels.map((lbl, j) => (
                  <div key={`total-${j}`} className="flex items-center gap-1 bg-[#16171d] border border-[#2e303a] rounded px-2">
                    <span className="text-[#c084fc] font-bold text-sm">{lbl}:</span>
                    <input 
                      type="number" min="0" value={totalResources[j] || 0}
                      onChange={(e) => handleMatrixChange('total', 0, j, e.target.value)}
                      className="w-12 bg-transparent text-white py-1.5 focus:outline-none text-center font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Matrices */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Allocation Matrix */}
            <div className="bg-[#1f2028] border border-[#2e303a] rounded-xl overflow-hidden shadow-lg">
              <div className="bg-[#16171d] p-3 border-b border-[#2e303a] font-semibold text-white text-sm text-center">
                ALLOCATION MATRIX
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-center">
                  <thead>
                    <tr>
                      <th className="pb-2 text-xs text-gray-500">P ID</th>
                      {resourceLabels.map(l => <th key={`ah-${l}`} className="pb-2 text-[#c084fc]">{l}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {allocation.map((row, i) => (
                      <tr key={`alloc-row-${i}`}>
                        <td className="py-1 text-gray-400 font-mono text-sm">P{i}</td>
                        {row.map((val, j) => (
                          <td key={`alloc-${i}-${j}`} className="p-1">
                            <input 
                              type="number" min="0" value={val}
                              onChange={(e) => handleMatrixChange('allocation', i, j, e.target.value)}
                              className="w-12 bg-[#16171d] border border-[#2e303a] rounded py-1 text-white text-center focus:border-[#c084fc]"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Max Matrix */}
            <div className="bg-[#1f2028] border border-[#2e303a] rounded-xl overflow-hidden shadow-lg">
              <div className="bg-[#16171d] p-3 border-b border-[#2e303a] font-semibold text-white text-sm text-center">
                MAXIMUM REQUIREMENT MATRIX
              </div>
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-center">
                  <thead>
                    <tr>
                      <th className="pb-2 text-xs text-gray-500">P ID</th>
                      {resourceLabels.map(l => <th key={`mh-${l}`} className="pb-2 text-[#c084fc]">{l}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {max.map((row, i) => (
                      <tr key={`max-row-${i}`}>
                        <td className="py-1 text-gray-400 font-mono text-sm">P{i}</td>
                        {row.map((val, j) => (
                          <td key={`max-${i}-${j}`} className="p-1">
                            <input 
                              type="number" min="0" value={val}
                              onChange={(e) => handleMatrixChange('max', i, j, e.target.value)}
                              className="w-12 bg-[#16171d] border border-[#2e303a] rounded py-1 text-white text-center focus:border-[#c084fc]"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="bg-[#1f2028] border border-[#2e303a] rounded-xl p-6 shadow-lg flex flex-col gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <Lock size={20} className="text-[#c084fc]" /> Simulation
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Enter the Current Allocation, Maximum Requirement, and Total System Resources. The Banker's algorithm will calculate the NEED matrix and determine if a Deadlock will occur.
            </p>
          </div>
          
          <button 
            onClick={runSimulation}
            className="w-full flex items-center justify-center gap-2 bg-[#c084fc] hover:bg-[#a855f7] text-white font-bold py-4 rounded-lg transition-all shadow-lg active:scale-95"
          >
            <Play size={18} fill="currentColor" />
            CHECK SAFETY
          </button>
        </div>
      </div>

      {/* Results Display */}
      {results && (
        <div className={`border-2 rounded-xl p-6 shadow-lg flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-500 ${results.isSafe ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
          
          <div className="flex items-center gap-4">
            {results.isSafe ? (
              <CheckCircle2 size={40} className="text-green-500" />
            ) : (
              <AlertTriangle size={40} className="text-red-500" />
            )}
            <div>
              <h2 className={`text-2xl font-bold ${results.isSafe ? 'text-green-500' : 'text-red-500'}`}>
                {results.isSafe ? 'System is in a SAFE State' : 'DEADLOCK DETECTED (Unsafe State)'}
              </h2>
              <p className="text-gray-400">
                {results.isSafe 
                  ? 'All processes can finish execution without entering a deadlock.' 
                  : 'The system cannot fulfill the resource requests. A deadlock is inevitable.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            
            {/* Auto-Calculated Need Matrix */}
            <div className="bg-[#16171d] border border-[#2e303a] rounded-lg p-4">
              <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest text-center">Calculated NEED Matrix</h4>
              <table className="w-full text-center">
                <thead>
                  <tr>
                    <th className="pb-2 text-xs text-gray-500">P ID</th>
                    {resourceLabels.map(l => <th key={`nh-${l}`} className="pb-2 text-blue-400">{l}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {results.needMatrix.map((row, i) => (
                    <tr key={`need-row-${i}`} className="border-t border-[#2e303a]/50">
                      <td className="py-2 text-white font-mono text-sm">P{i}</td>
                      {row.map((val, j) => (
                        <td key={`need-${i}-${j}`} className="py-2 text-gray-300 font-mono">{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Execution Sequence & Available Tracking */}
            <div className="flex flex-col gap-4">
              
              <div className="bg-[#16171d] border border-[#2e303a] rounded-lg p-4">
                <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Initial Available Resources</h4>
                <div className="flex gap-4 justify-center">
                  {results.initialAvailable.map((val, j) => (
                    <div key={`init-av-${j}`} className="flex flex-col items-center">
                      <span className="text-xs text-gray-500">{resourceLabels[j]}</span>
                      <span className="text-xl font-bold text-white font-mono">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {results.isSafe && (
                <div className="bg-[#16171d] border border-green-500/30 rounded-lg p-4 flex-1 flex flex-col justify-center items-center">
                   <h4 className="text-xs font-bold text-green-500/70 mb-4 uppercase tracking-widest">Safe Execution Sequence</h4>
                   <div className="flex flex-wrap gap-2 justify-center">
                     {results.sequence.map((pIndex, idx) => (
                       <div key={`seq-${idx}`} className="flex items-center">
                         <div className="bg-green-500/20 border border-green-500/50 text-green-400 font-mono font-bold px-4 py-2 rounded-lg text-lg shadow-lg">
                           P{pIndex}
                         </div>
                         {idx < results.sequence.length - 1 && (
                           <span className="mx-2 text-gray-600 font-bold">→</span>
                         )}
                       </div>
                     ))}
                   </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}