import React from 'react';
import { Thermometer, Gauge, Activity } from 'lucide-react';
import { SensorData } from '../types/factory';
import { isValueInDanger } from '../utils/dataGenerator';

interface SensorCardProps {
  machineId: string;
  machineName: string;
  sensors: SensorData;
}

export const SensorCard: React.FC<SensorCardProps> = ({ machineId, machineName, sensors }) => {
  const getStatusColor = (value: number, type: 'temperature' | 'pressure' | 'vibration') => {
    if (isValueInDanger(value, type)) return 'text-red-500';
    return 'text-green-500';
  };

  const getStatusBg = (value: number, type: 'temperature' | 'pressure' | 'vibration') => {
    if (isValueInDanger(value, type)) return 'bg-red-50 border-red-200';
    return 'bg-green-50 border-green-200';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{machineId}</h3>
        <span className="text-sm text-gray-500">{machineName}</span>
      </div>
      
      <div className="space-y-4">
        <div className={`p-3 rounded-lg border ${getStatusBg(sensors.temperature, 'temperature')}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Thermometer className={`w-5 h-5 ${getStatusColor(sensors.temperature, 'temperature')}`} />
              <span className="text-sm font-medium text-gray-700">Temperature</span>
            </div>
            <span className={`text-lg font-bold ${getStatusColor(sensors.temperature, 'temperature')}`}>
              {sensors.temperature}°C
            </span>
          </div>
        </div>

        <div className={`p-3 rounded-lg border ${getStatusBg(sensors.pressure, 'pressure')}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className={`w-5 h-5 ${getStatusColor(sensors.pressure, 'pressure')}`} />
              <span className="text-sm font-medium text-gray-700">Pressure</span>
            </div>
            <span className={`text-lg font-bold ${getStatusColor(sensors.pressure, 'pressure')}`}>
              {sensors.pressure} PSI
            </span>
          </div>
        </div>

        <div className={`p-3 rounded-lg border ${getStatusBg(sensors.vibration, 'vibration')}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className={`w-5 h-5 ${getStatusColor(sensors.vibration, 'vibration')}`} />
              <span className="text-sm font-medium text-gray-700">Vibration</span>
            </div>
            <span className={`text-lg font-bold ${getStatusColor(sensors.vibration, 'vibration')}`}>
              {sensors.vibration} mm/s
            </span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          Last updated: {sensors.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};