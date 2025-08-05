import React, { useState } from 'react';
import { Cloud, BarChart3, Settings } from 'lucide-react';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { SensorCard } from './SensorCard';
import { StatusPanel } from './StatusPanel';
import { KPICards } from './KPICards';
import { HistoricalChart } from './HistoricalChart';
import { AlertPanel } from './AlertPanel';

export const Dashboard: React.FC = () => {
  const { machines, alerts, historicalData } = useRealTimeData();
  const [isCloudConnected, setIsCloudConnected] = useState(false);

  const handleCloudConnect = () => {
    setIsCloudConnected(!isCloudConnected);
    // Simulate cloud connection
    setTimeout(() => {
      alert(isCloudConnected ? 'Disconnected from Azure IoT Hub' : 'Connected to Azure IoT Hub successfully!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Settings className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Smart Factory Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleCloudConnect}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isCloudConnected
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <Cloud className="w-4 h-4" />
                {isCloudConnected ? 'Connected' : 'Connect to Cloud'}
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <BarChart3 className="w-4 h-4" />
                Power BI
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="mb-8">
          <KPICards machines={machines} alerts={alerts} />
        </div>

        {/* Sensor Data and Status */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {machines.map((machine) => (
                <SensorCard
                  key={machine.id}
                  machineId={machine.id}
                  machineName={machine.name}
                  sensors={machine.sensors}
                />
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <StatusPanel machines={machines} />
          </div>
        </div>

        {/* Historical Chart and Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <HistoricalChart 
              data={historicalData} 
              machines={machines.map(m => m.id)} 
            />
          </div>
          
          <div className="lg:col-span-1">
            <AlertPanel alerts={alerts} />
          </div>
        </div>
      </main>
    </div>
  );
};