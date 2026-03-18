import { useState } from 'react';
import { Play, Disc, RefreshCw } from 'lucide-react';
import { calculateSCAN } from '../algorithms/disk/scan';

export default function DiskLab() {
  const [requestString, setRequestString] = useState('82, 170, 43, 140, 24, 16, 190');
  const [initialHead, setInitialHead] = useState(50);
  const [maxTrack, setMaxTrack] = useState(200);
  const [direction, setDirection] = useState('right');
  const [results, setResults] = useState(null);

  const runSimulation = () => {
    const requests = requestString
      .split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n));

    if (requests.length === 0) return;

    // Filter out invalid requests
    const validRequests = requests.filter(r => r >= 0 && r < maxTrack);
    
    const output = calculateSCAN(validRequests, initialHead, maxTrack, direction);
    setResults(output);
  };

  const clearAll = () => {
    setRequestString('');
    setResults(null);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Input Configuration */}
        <div className="lg:col-span-2 bg-[#1f2028] border border-[#2e303a] rounded-xl overflow-hidden flex flex-col shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Disc size={20} className="text-[#c084fc]" />
              Disk Track Requests
            </h3>
            <button 
              onClick={clearAll}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 px-2 py-1.5 transition-colors"
            >
              <RefreshCw size={14} /> Clear
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Track Queue (Comma Separated)</label>
              <textarea 
                value={requestString}
                onChange={(e) => {setRequestString(e.target.value); setResults(null);}}
                placeholder="e.g., 98, 183, 37, 122, 14, 124, 65, 67"
                className="w-full h-20 bg-[#16171d] border border-[#2e303a] rounded-lg p-3 text-white font-mono focus:border-[#c084fc] focus:outline-none resize-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="block text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Initial Head Position</label>
                  <input 
                    type="number" 
                    min="0"
                    value={initialHead}
                    onChange={(e) => {setInitialHead(parseInt(e.target.value) || 0); setResults(null);}}
                    className="w-full bg-[#16171d] border border-[#2e303a] text-white rounded-lg px-3 py-2.5 focus:border-[#c084fc] focus:outline-none"
                  />
               </div>
               <div>
                  <label className="block text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Max Cylinders (Tracks)</label>
                  <input 
                    type="number" 
                    min="1"
                    value={maxTrack}
                    onChange={(e) => {setMaxTrack(parseInt(e.target.value) || 1); setResults(null);}}
                    className="w-full bg-[#16171d] border border-[#2e303a] text-white rounded-lg px-3 py-2.5 focus:border-[#c084fc] focus:outline-none"
                  />
               </div>
            </div>
          </div>
        </div>

        {/* Algorithm Settings */}
        <div className="bg-[#1f2028] border border-[#2e303a] rounded-xl p-6 shadow-lg flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-white mb-2">Control Panel</h3>
          
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Algorithm</label>
            <select 
              disabled
              className="w-full bg-[#16171d] border border-[#2e303a] text-gray-400 rounded-lg px-3 py-2.5 focus:outline-none cursor-not-allowed opacity-70"
            >
              <option>SCAN (Elevator Algorithm)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold mt-2">Initial Direction</label>
            <select 
              value={direction}
              onChange={(e) => {setDirection(e.target.value); setResults(null);}}
              className="w-full bg-[#16171d] border border-[#2e303a] text-white rounded-lg px-3 py-2.5 focus:border-[#c084fc] focus:outline-none"
            >
              <option value="right">Right (Towards End)</option>
              <option value="left">Left (Towards 0)</option>
            </select>
          </div>

          <button 
            onClick={runSimulation}
            disabled={!requestString.trim()}
            className="mt-auto w-full flex items-center justify-center gap-2 bg-[#c084fc] hover:bg-[#a855f7] text-white font-bold py-3 rounded-lg transition-all shadow-lg active:scale-95 disabled:opacity-30"
          >
            <Play size={18} fill="currentColor" />
            START SIMULATION
          </button>
        </div>
      </div>

      {/* Visualizer & Results */}
      {results && (
        <div className="bg-[#1f2028] border border-[#2e303a] rounded-xl p-6 shadow-lg flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-500">
          
          {/* Metrics */}
          <div className="bg-[#16171d] border-l-4 border-[#c084fc] p-4 rounded-r-lg inline-block w-max">
            <p className="text-xs text-gray-500 uppercase font-bold">Total Seek Operations (Distance)</p>
            <p className="text-3xl font-mono text-white">{results.seekCount} <span className="text-sm text-gray-500 font-sans font-normal">tracks</span></p>
          </div>

          {/* Graphical Representation */}
          <div>
            <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">Head Movement Graph</h4>
            <div className="bg-[#16171d] border border-[#2e303a] rounded-lg p-6 overflow-x-auto">
              <div className="min-w-[600px] h-[300px] relative">
                
                {/* SVG Graph for Head Movement */}
                <svg width="100%" height="100%" className="overflow-visible">
                  {/* Draw vertical grid lines for the X-axis mapping */}
                  <line x1="0%" y1="0" x2="0%" y2="100%" stroke="#2e303a" strokeWidth="1" strokeDasharray="4" />
                  <line x1="100%" y1="0" x2="100%" y2="100%" stroke="#2e303a" strokeWidth="1" strokeDasharray="4" />
                  
                  {results.sequence.map((track, i) => {
                    if (i === 0) return null;
                    const prevTrack = results.sequence[i - 1];
                    const x1 = (prevTrack / (maxTrack - 1)) * 100;
                    const y1 = ((i - 1) / (results.sequence.length - 1)) * 100;
                    const x2 = (track / (maxTrack - 1)) * 100;
                    const y2 = (i / (results.sequence.length - 1)) * 100;

                    return (
                      <g key={`line-${i}`}>
                        <line 
                          x1={`${x1}%`} y1={`${y1}%`} 
                          x2={`${x2}%`} y2={`${y2}%`} 
                          stroke="#c084fc" strokeWidth="2" 
                          className="animate-in fade-in duration-1000"
                        />
                        <circle cx={`${x2}%`} cy={`${y2}%`} r="4" fill="#a855f7" />
                        <text 
                          x={`${x2}%`} y={`${y2}%`} 
                          dy={y2 > 90 ? -10 : 15} dx={x2 > 90 ? -15 : 5}
                          fill="#9ca3af" fontSize="10" fontFamily="monospace"
                        >
                          {track}
                        </text>
                      </g>
                    );
                  })}
                  
                  {/* Initial Node */}
                  <circle cx={`${(results.sequence[0] / (maxTrack - 1)) * 100}%`} cy="0%" r="5" fill="#3b82f6" />
                  <text 
                    x={`${(results.sequence[0] / (maxTrack - 1)) * 100}%`} y="0%" 
                    dy="-10" dx="5"
                    fill="#3b82f6" fontSize="12" fontFamily="monospace" fontWeight="bold"
                  >
                    Start: {results.sequence[0]}
                  </text>
                </svg>

                {/* X-Axis Labels */}
                <div className="absolute -bottom-6 w-full flex justify-between text-xs text-gray-500 font-mono">
                  <span>0</span>
                  <span>{maxTrack - 1}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sequence Sequence Path */}
          <div className="mt-4">
             <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Execution Path</h4>
             <div className="flex flex-wrap gap-2">
               {results.sequence.map((track, idx) => (
                 <div key={`seq-${idx}`} className="flex items-center">
                   <div className={`font-mono px-3 py-1 rounded text-sm ${idx === 0 ? 'bg-blue-500/20 text-blue-400' : 'bg-[#2e303a]/50 text-gray-300 border border-[#2e303a]'}`}>
                     {track}
                   </div>
                   {idx < results.sequence.length - 1 && (
                     <span className="mx-1 text-gray-600">→</span>
                   )}
                 </div>
               ))}
             </div>
          </div>

        </div>
      )}
    </div>
  );
}