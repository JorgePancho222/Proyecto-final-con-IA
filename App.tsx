import React, { useState } from 'react';
import { Scan, ChefHat, CalendarDays, Leaf } from 'lucide-react';
import { ScannerView } from './components/ScannerView';
import { ChefView } from './components/ChefView';
import { PlannerView } from './components/PlannerView';
import { AppMode } from './types';

function App() {
  const [mode, setMode] = useState<AppMode>(AppMode.SCANNER);

  const renderContent = () => {
    switch (mode) {
      case AppMode.SCANNER:
        return <ScannerView />;
      case AppMode.CHEF:
        return <ChefView />;
      case AppMode.PLANNER:
        return <PlannerView />;
      default:
        return <ScannerView />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 text-gray-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-200">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                NutriGenio
              </h1>
            </div>
            
            <nav className="hidden md:flex space-x-1">
              <button
                onClick={() => setMode(AppMode.SCANNER)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  mode === AppMode.SCANNER 
                    ? 'bg-emerald-100 text-emerald-800 font-semibold shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Scan className="w-4 h-4 mr-2" />
                Escáner
              </button>
              <button
                onClick={() => setMode(AppMode.CHEF)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  mode === AppMode.CHEF 
                    ? 'bg-emerald-100 text-emerald-800 font-semibold shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChefHat className="w-4 h-4 mr-2" />
                Chef
              </button>
              <button
                onClick={() => setMode(AppMode.PLANNER)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  mode === AppMode.PLANNER 
                    ? 'bg-emerald-100 text-emerald-800 font-semibold shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <CalendarDays className="w-4 h-4 mr-2" />
                Planificador
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation (Bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
        <div className="flex justify-around p-2">
           <button
              onClick={() => setMode(AppMode.SCANNER)}
              className={`flex flex-col items-center p-2 rounded-lg w-full ${
                mode === AppMode.SCANNER ? 'text-emerald-600' : 'text-gray-400'
              }`}
            >
              <Scan className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Escáner</span>
            </button>
            <button
              onClick={() => setMode(AppMode.CHEF)}
              className={`flex flex-col items-center p-2 rounded-lg w-full ${
                mode === AppMode.CHEF ? 'text-emerald-600' : 'text-gray-400'
              }`}
            >
              <ChefHat className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Chef</span>
            </button>
             <button
              onClick={() => setMode(AppMode.PLANNER)}
              className={`flex flex-col items-center p-2 rounded-lg w-full ${
                mode === AppMode.PLANNER ? 'text-emerald-600' : 'text-gray-400'
              }`}
            >
              <CalendarDays className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Plan</span>
            </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20 md:mb-0">
        {renderContent()}
      </main>
    </div>
  );
}

export default App;