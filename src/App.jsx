import { useState } from 'react';
import { LayoutDashboard, Cpu, HardDrive, Lock, Disc, Menu, X, Terminal } from 'lucide-react';
import CpuScheduler from './pages/CpuScheduler';
import MemoryLab from './pages/MemoryLab';
import ConcurrencyLab from './pages/ConcurrencyLab';
import DiskLab from './pages/DiskLab';

export default function App() {
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    { id: 'dashboard', name: 'System Overview', icon: LayoutDashboard },
    { id: 'cpu', name: 'CPU Scheduling', icon: Cpu },
    { id: 'memory', name: 'Memory Management', icon: HardDrive },
    { id: 'concurrency', name: 'Concurrency Lab', icon: Lock },
    { id: 'disk', name: 'Disk Scheduling', icon: Disc },
  ];

  return (
    <div className="flex h-screen bg-[#16171d] text-gray-300 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 bg-[#1f2028] border-r border-[#2e303a] flex flex-col z-20`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#2e303a]">
          {isSidebarOpen && (
            <div className="flex items-center gap-2 font-bold text-white tracking-wide">
              <Terminal size={24} className="text-[#c084fc]" />
              <span>OS-Visualizer</span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-[#2e303a] text-gray-400 hover:text-white transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 py-4 px-2 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id)}
                className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg transition-all ${
                  isActive 
                    ? 'bg-[#c084fc]/15 text-[#c084fc] border border-[#c084fc]/50' 
                    : 'text-gray-400 hover:bg-[#2e303a] hover:text-white'
                } ${!isSidebarOpen && 'justify-center'}`}
                title={!isSidebarOpen ? item.name : ''}
              >
                <Icon size={20} />
                {isSidebarOpen && (
                  <span className="font-medium text-sm whitespace-nowrap">
                    {item.name}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {isSidebarOpen && (
          <div className="p-4 border-t border-[#2e303a] text-xs text-gray-500 text-center">
            PBL Project - SPOS Module
          </div>
        )}
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#16171d]">
        <header className="h-16 flex items-center px-8 border-b border-[#2e303a] bg-[#1f2028]/50 shrink-0">
          <h2 className="text-xl font-semibold text-white">
            {navigation.find(n => n.id === activeModule)?.name}
          </h2>
        </header>

        <div className="flex-1 overflow-auto p-8">
          {/* Module Routing Area */}
          {activeModule === 'dashboard' && (
            <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="p-8 rounded-xl bg-[#1f2028] border border-[#2e303a] shadow-lg">
                <h1 className="text-3xl font-bold text-white mb-4">Welcome to OS-Visualizer</h1>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Select a module from the sidebar to begin. This interactive laboratory is designed to demonstrate core Operating System concepts including Process Scheduling, Memory Allocation, Concurrency Control, and Disk Management in real-time.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-[#2e303a]/50 border border-[#2e303a]">
                    <Cpu className="text-[#c084fc] mb-2" size={24} />
                    <h3 className="text-white font-medium mb-1">CPU Scheduler</h3>
                    <p className="text-sm text-gray-500">FCFS, SJF, Round Robin</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#2e303a]/50 border border-[#2e303a]">
                    <HardDrive className="text-[#c084fc] mb-2" size={24} />
                    <h3 className="text-white font-medium mb-1">Memory Manager</h3>
                    <p className="text-sm text-gray-500">Paging & LRU Analysis</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#2e303a]/50 border border-[#2e303a]">
                    <Lock className="text-[#c084fc] mb-2" size={24} />
                    <h3 className="text-white font-medium mb-1">Concurrency</h3>
                    <p className="text-sm text-gray-500">Banker's Algorithm</p>
                  </div>
                  <div className="p-4 rounded-lg bg-[#2e303a]/50 border border-[#2e303a]">
                    <Disc className="text-[#c084fc] mb-2" size={24} />
                    <h3 className="text-white font-medium mb-1">Disk Lab</h3>
                    <p className="text-sm text-gray-500">SCAN / Elevator Algo</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeModule === 'cpu' && (
            <CpuScheduler />
          )}

          {activeModule === 'memory' && (
            <MemoryLab />
          )}

          {activeModule === 'concurrency' && (
            <ConcurrencyLab />
          )}

          {activeModule === 'disk' && (
            <DiskLab />
          )}
        </div>
      </main>
    </div>
  );
}