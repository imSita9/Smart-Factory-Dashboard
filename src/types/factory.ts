export interface SensorData {
  temperature: number;
  pressure: number;
  vibration: number;
  timestamp: Date;
}

export interface Machine {
  id: string;
  name: string;
  status: 'ON' | 'OFF' | 'FAULT';
  lastStatusChange: Date;
  sensors: SensorData;
  uptime: number;
}

export interface KPIData {
  totalMachinesRunning: number;
  totalFaultsToday: number;
  averageUptime: number;
  maintenanceAlerts: number;
}

export interface Alert {
  id: string;
  machineId: string;
  type: 'warning' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

export interface HistoricalDataPoint {
  timestamp: Date;
  temperature: number;
  pressure: number;
  vibration: number;
  machineId: string;
}