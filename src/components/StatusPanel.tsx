import React from 'react';
import { Power, AlertTriangle, CheckCircle } from 'lucide-react';
import { Machine } from '../types/factory';

interface StatusPanelProps {
  machines: Machine[];
}

export const StatusPanel: React.FC<StatusPanelProps> = ({ machines }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ON':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'FAULT':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'OFF':
        return <Power className="w-5 h-5 text-gray-500" />;
      default:
        return <Power className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'ON':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'FAULT':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'OFF':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Machine Status</h3>
      
      <div className="space-y-4">
        {machines.map((machine) => (
          <div key={machine.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(machine.status)}
              <div>
                <h4 className="font-medium text-gray-800">{machine.id}</h4>
                <p className="text-sm text-gray-600">{machine.name}</p>
              </div>
            </div>
            
            <div className="text-right">
              <span className={getStatusBadge(machine.status)}>
                {machine.status}
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Changed: {machine.lastStatusChange.toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};