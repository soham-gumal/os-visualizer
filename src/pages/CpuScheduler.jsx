import { useState } from 'react';
import { Play, Plus, Trash2, Activity, RefreshCw } from 'lucide-react';
import { calculateFCFS } from '../algorithms/scheduling/fcfs';
import { calculateSJF } from '../algorithms/scheduling/sjf';
import { calculateRR } from '../algorithms/scheduling/rr';

export default function CpuScheduler() {
  const [processes, setProcesses] = useState([
    { id: 1, arrivalTime: 0, burstTime: 5 },
    { id: 2, arrivalTime: 2, burstTime: 3 },
    { id: 3, arrivalTime: 4, burstTime: 1 },
  ]);
  
  const [results, setResults] = useState(null);
  const [selectedAlgo, setSelectedAlgo] = useState('FCFS');
  const [timeQuantum, setTimeQuantum] = useState(2);

  const addProcess = () => {
    const newId = processes.length > 0 ? Math.max(...processes.map(p => p.id)) + 1 : 1;
    setProcesses([...processes, { id: newId, arrivalTime: 0, burstTime: 1 }]);
  };

  const removeProcess = (id) => {
    setProcesses(processes.filter(p => p.id !== id));
    setResults(null);
  };

  const clearAll = () => {
    setProcesses([]);
    setResults(null);
  };

  const updateProcess = (id, field, value) => {
    const numValue = parseInt(value) || 0;
    setProcesses(processes.map(p => 
      p.id === id ? { ...p, [field]: numValue >= 0 ? numValue : 0 } : p
    ));
    setResults(null); // Reset results when data changes
  };

  const runSimulation = () => {
    if (processes.length === 0) return;

    let output;
    if (selectedAlgo === 'FCFS') {
      output = calculateFCFS(processes);
    } else if (selectedAlgo === 'SJF') {
      output = calculateSJF(processes);
    } else if (selectedAlgo === 'RR') {
      output = calculateRR(processes, timeQuantum);
    }

    setResults(output);
  };

  const getProcessColor = (id) => {
    if (id === 'Idle') return 'bg-[#2e303a] text-gray-400 border-[#4b4d58]';
    const colors = [
      'bg-blue-500/20 text-blue-400 border-blue-500/50',
      'bg-green-500/20 text-green-400 border-green-500/50',
      'bg-purple-500/20 text-purple-400 border-purple-500/50',
      'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      'bg-pink-500/20 text-pink-400 border-pink-500/50',
      'bg-indigo-500/20 text-indigo-400 border-indigo-500/50',
    ];
    // Use the ID number to pick a color
    const match = id.match(/\d+/);
    const index = match ? parseInt(match[0]) - 1 : 0;
    return colors[index % colors.length];
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Input Table Section */}
        <div className="lg:col-span-2 bg-[#1f2028] border border-[#2e303a] rounded-xl overflow-hidden flex flex-col shadow-lg">
          <div className="p-4 border-b border-[#2e303a] flex justify-between items-center bg-[#1f2028]">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity size={20} className="text-[#c084fc]" />
              Process Configuration
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={clearAll}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-400 px-2 py-1.5 transition-colors"
              >
                <RefreshCw size={14} /> Clear
              </button>
              <button 
                onClick={addProcess}
                className="flex items-center gap-1 text-sm bg-[#2e303a] hover:bg-[#3f414d] text-white px-3 py-1.5 rounded transition-colors"
              >
                <Plus size={16} /> Add Process
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-[#16171d] text-gray-300 uppercase font-medium">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Arrival</th>
                  <th className="px-4 py-3">Burst</th>
                  <th className="px-4 py-3 text-right">Delete</th>
                </tr>
              </thead>
              <tbody>
                {processes.map((p) => (
                  <tr key={p.id} className="border-b border-[#2e303a]/50 hover:bg-[#2e303a]/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-white">P{p.id}</td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        value={p.arrivalTime}
                        onChange={(e) => updateProcess(p.id, 'arrivalTime', e.target.value)}
                        className="w-16 bg-[#16171d] border border-[#2e303a] rounded px-2 py-1 text-white focus:outline-none focus:border-[#c084fc]"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input 
                        type="number" 
                        value={p.burstTime}
                        onChange={(e) => updateProcess(p.id, 'burstTime', e.target.value)}
                        className="w-16 bg-[#16171d] border border-[#2e303a] rounded px-2 py-1 text-white focus:outline-none focus:border-[#c084fc]"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => removeProcess(p.id)} className="text-gray-500 hover:text-red-400 p-1">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Algorithm Settings Section */}
        <div className="bg-[#1f2028] border border-[#2e303a] rounded-xl p-6 shadow-lg flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-white mb-2">Control Panel</h3>
          
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Algorithm</label>
            <select 
              value={selectedAlgo}
              onChange={(e) => {setSelectedAlgo(e.target.value); setResults(null);}}
              className="w-full bg-[#16171d] border border-[#2e303a] text-white rounded-lg px-3 py-2.5 focus:border-[#c084fc]"
            >
              <option value="FCFS">FCFS (First Come First Served)</option>
              <option value="SJF">SJF (Shortest Job First)</option>
              <option value="RR">RR (Round Robin)</option>
            </select>
          </div>

          {selectedAlgo === 'RR' && (
            <div className="animate-in fade-in zoom-in duration-200">
              <label className="block text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Time Quantum</label>
              <input 
                type="number" 
                value={timeQuantum}
                onChange={(e) => {setTimeQuantum(parseInt(e.target.value) || 1); setResults(null);}}
                className="w-full bg-[#16171d] border border-[#2e303a] text-white rounded-lg px-3 py-2.5 focus:border-[#c084fc]"
              />
            </div>
          )}

          <button 
            onClick={runSimulation}
            disabled={processes.length === 0}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-[#c084fc] hover:bg-[#a855f7] text-white font-bold py-3 rounded-lg transition-all shadow-lg active:scale-95 disabled:opacity-30"
          >
            <Play size={18} fill="currentColor" />
            START SIMULATION
          </button>
        </div>
      </div>

      {/* Results Display */}
      {results && (
        <div className="bg-[#1f2028] border border-[#2e303a] rounded-xl p-6 shadow-lg flex flex-col gap-8 animate-in fade-in slide-in-from-top-4 duration-500">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#16171d] border-l-4 border-[#c084fc] p-4 rounded-r-lg">
              <p className="text-xs text-gray-500 uppercase font-bold">Avg. Turnaround Time</p>
              <p className="text-3xl font-mono text-white">{results.averageTurnaroundTime}<span className="text-sm text-gray-500 ml-1">ms</span></p>
            </div>
            <div className="bg-[#16171d] border-l-4 border-yellow-500 p-4 rounded-r-lg">
              <p className="text-xs text-gray-500 uppercase font-bold">Avg. Waiting Time</p>
              <p className="text-3xl font-mono text-white">{results.averageWaitingTime}<span className="text-sm text-gray-500 ml-1">ms</span></p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-500 mb-4 uppercase tracking-widest">Gantt Chart Timeline</h4>
            <div className="flex w-full h-14 bg-[#16171d] rounded border border-[#2e303a] overflow-x-auto no-scrollbar relative">
              {results.ganttChart.map((block, index) => {
                const totalTime = results.ganttChart[results.ganttChart.length - 1].endTime;
                const widthPercentage = ((block.endTime - block.startTime) / totalTime) * 100;
                
                return (
                  <div 
                    key={index} 
                    style={{ width: `${widthPercentage}%`, minWidth: '40px' }}
                    className={`h-full border-r border-[#16171d] flex flex-col items-center justify-center relative group transition-all hover:brightness-125 ${getProcessColor(block.id)}`}
                  >
                    <span className="font-mono font-bold text-xs">{block.id}</span>
                    <span className="absolute -bottom-6 right-0 text-[10px] text-gray-500 font-mono translate-x-1/2">{block.endTime}</span>
                    {index === 0 && <span className="absolute -bottom-6 left-0 text-[10px] text-gray-500 font-mono">0</span>}
                  </div>
                );
              })}
            </div>
            <div className="h-6"></div>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[#2e303a]">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-[#16171d] text-gray-400 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-3">Process</th>
                  <th className="px-4 py-3">Arrival</th>
                  <th className="px-4 py-3">Burst</th>
                  <th className="px-4 py-3">Exit</th>
                  <th className="px-4 py-3">TAT</th>
                  <th className="px-4 py-3">WT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2e303a]">
                {results.processDetails.map((p) => (
                  <tr key={p.id} className="hover:bg-[#2e303a]/30 transition-colors font-mono">
                    <td className="px-4 py-3 text-white">P{p.id}</td>
                    <td className="px-4 py-3">{p.arrivalTime}</td>
                    <td className="px-4 py-3">{p.burstTime}</td>
                    <td className="px-4 py-3 text-[#c084fc] font-bold">{p.completionTime}</td>
                    <td className="px-4 py-3 text-blue-400">{p.turnaroundTime}</td>
                    <td className="px-4 py-3 text-yellow-500">{p.waitingTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}