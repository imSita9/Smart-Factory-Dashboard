import React, { useState, useMemo } from 'react';
import { HistoricalDataPoint } from '../types/factory';

interface HistoricalChartProps {
  data: HistoricalDataPoint[];
  machines: string[];
}

export const HistoricalChart: React.FC<HistoricalChartProps> = ({ data, machines }) => {
  const [selectedMetric, setSelectedMetric] = useState<'temperature' | 'pressure' | 'vibration'>('temperature');
  const [selectedMachine, setSelectedMachine] = useState<string>('all');

  const filteredData = useMemo(() => {
    let filtered = data;
    if (selectedMachine !== 'all') {
      filtered = data.filter(d => d.machineId === selectedMachine);
    }
    return filtered.slice(-24); // Last 24 data points
  }, [data, selectedMachine]);

  const chartData = useMemo(() => {
    return filteredData.map(point => ({
      timestamp: point.timestamp.toLocaleTimeString(),
      value: point[selectedMetric],
      machineId: point.machineId,
    }));
  }, [filteredData, selectedMetric]);

  const maxValue = Math.max(...chartData.map(d => d.value));
  const minValue = Math.min(...chartData.map(d => d.value));
  const range = maxValue - minValue;

  const getMetricUnit = (metric: string) => {
    switch (metric) {
      case 'temperature': return '°C';
      case 'pressure': return 'PSI';
      case 'vibration': return 'mm/s';
      default: return '';
    }
  };

  const getMetricColor = (machineId: string) => {
    const colors = {
      'M01': 'stroke-blue-500',
      'M02': 'stroke-green-500',
      'M03': 'stroke-purple-500',
    };
    return colors[machineId as keyof typeof colors] || 'stroke-gray-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 lg:mb-0">Historical Trends</h3>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="temperature">Temperature</option>
            <option value="pressure">Pressure</option>
            <option value="vibration">Vibration</option>
          </select>
          
          <select
            value={selectedMachine}
            onChange={(e) => setSelectedMachine(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Machines</option>
            {machines.map(machine => (
              <option key={machine} value={machine}>{machine}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="h-64 relative">
        {chartData.length > 0 ? (
          <svg className="w-full h-full" viewBox="0 0 800 200">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={i}
                x1="50"
                y1={40 + i * 30}
                x2="750"
                y2={40 + i * 30}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4].map(i => (
              <text
                key={i}
                x="40"
                y={45 + i * 30}
                fontSize="12"
                fill="#6b7280"
                textAnchor="end"
              >
                {(maxValue - (range * i / 4)).toFixed(1)}
              </text>
            ))}
            
            {/* Data lines */}
            {selectedMachine === 'all' ? (
              machines.map(machineId => {
                const machineData = chartData.filter(d => d.machineId === machineId);
                if (machineData.length < 2) return null;
                
                const pathData = machineData.map((point, index) => {
                  const x = 50 + (index * (700 / (machineData.length - 1)));
                  const y = 40 + ((maxValue - point.value) / range) * 120;
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ');
                
                return (
                  <g key={machineId}>
                    <path
                      d={pathData}
                      fill="none"
                      className={getMetricColor(machineId)}
                      strokeWidth="2"
                    />
                    {/* Data points */}
                    {machineData.map((point, index) => {
                      const x = 50 + (index * (700 / (machineData.length - 1)));
                      const y = 40 + ((maxValue - point.value) / range) * 120;
                      return (
                        <circle
                          key={index}
                          cx={x}
                          cy={y}
                          r="3"
                          className={getMetricColor(machineId).replace('stroke-', 'fill-')}
                        />
                      );
                    })}
                  </g>
                );
              })
            ) : (
              (() => {
                if (chartData.length < 2) return null;
                const pathData = chartData.map((point, index) => {
                  const x = 50 + (index * (700 / (chartData.length - 1)));
                  const y = 40 + ((maxValue - point.value) / range) * 120;
                  return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ');
                
                return (
                  <g>
                    <path
                      d={pathData}
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                    {chartData.map((point, index) => {
                      const x = 50 + (index * (700 / (chartData.length - 1)));
                      const y = 40 + ((maxValue - point.value) / range) * 120;
                      return (
                        <circle
                          key={index}
                          cx={x}
                          cy={y}
                          r="3"
                          fill="#3b82f6"
                        />
                      );
                    })}
                  </g>
                );
              })()
            )}
            
            {/* Axis labels */}
            <text x="400" y="190" fontSize="12" fill="#6b7280" textAnchor="middle">
              Time (Last 24 readings)
            </text>
            <text x="25" y="100" fontSize="12" fill="#6b7280" textAnchor="middle" transform="rotate(-90 25 100)">
              {selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)} ({getMetricUnit(selectedMetric)})
            </text>
          </svg>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No data available
          </div>
        )}
      </div>

      {/* Legend */}
      {selectedMachine === 'all' && (
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200">
          {machines.map(machineId => (
            <div key={machineId} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getMetricColor(machineId).replace('stroke-', 'bg-')}`}></div>
              <span className="text-sm text-gray-600">{machineId}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};