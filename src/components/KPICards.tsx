import React from 'react';
import { Activity, AlertTriangle, Clock, Wrench } from 'lucide-react';
import { Machine, Alert } from '../types/factory';

interface KPICardsProps {
  machines: Machine[];
  alerts: Alert[];
}

export const KPICards: React.FC<KPICardsProps> = ({ machines, alerts }) => {
  const runningMachines = machines.filter(m => m.status === 'ON').length;
  const faultsToday = machines.filter(m => m.status === 'FAULT').length;
  const averageUptime = machines.reduce((acc, m) => acc + m.uptime, 0) / machines.length;
  const maintenanceAlerts = alerts.filter(a => a.type === 'error').length;

  const kpiData = [
    {
      title: 'Machines Running',
      value: `${runningMachines}/${machines.length}`,
      icon: Activity,
      color: runningMachines === machines.length ? 'text-green-600' : 'text-yellow-600',
      bgColor: runningMachines === machines.length ? 'bg-green-100' : 'bg-yellow-100',
    },
    {
      title: 'Active Faults',
      value: faultsToday.toString(),
      icon: AlertTriangle,
      color: faultsToday === 0 ? 'text-green-600' : 'text-red-600',
      bgColor: faultsToday === 0 ? 'bg-green-100' : 'bg-red-100',
    },
    {
      title: 'Average Uptime',
      value: `${averageUptime.toFixed(1)}%`,
      icon: Clock,
      color: averageUptime > 85 ? 'text-green-600' : 'text-yellow-600',
      bgColor: averageUptime > 85 ? 'bg-green-100' : 'bg-yellow-100',
    },
    {
      title: 'Maintenance Alerts',
      value: maintenanceAlerts.toString(),
      icon: Wrench,
      color: maintenanceAlerts === 0 ? 'text-green-600' : 'text-orange-600',
      bgColor: maintenanceAlerts === 0 ? 'bg-green-100' : 'bg-orange-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{kpi.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
              <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};