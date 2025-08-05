import { Machine, SensorData, Alert, HistoricalDataPoint } from '../types/factory';

export const generateSensorData = (): SensorData => ({
  temperature: Math.round((Math.random() * 40 + 60) * 10) / 10, // 60-100°C
  pressure: Math.round((Math.random() * 50 + 100) * 10) / 10, // 100-150 PSI
  vibration: Math.round((Math.random() * 5 + 1) * 100) / 100, // 1-6 mm/s
  timestamp: new Date(),
});

export const isValueInDanger = (value: number, type: 'temperature' | 'pressure' | 'vibration'): boolean => {
  switch (type) {
    case 'temperature':
      return value > 95 || value < 65;
    case 'pressure':
      return value > 140 || value < 110;
    case 'vibration':
      return value > 5;
    default:
      return false;
  }
};

export const generateMachineStatus = (currentStatus: string): 'ON' | 'OFF' | 'FAULT' => {
  const random = Math.random();
  if (currentStatus === 'FAULT') {
    // 30% chance to recover from fault
    return random < 0.3 ? 'ON' : 'FAULT';
  }
  if (currentStatus === 'OFF') {
    // 20% chance to turn on
    return random < 0.2 ? 'ON' : 'OFF';
  }
  // If ON, 5% chance of fault, 10% chance to turn off
  if (random < 0.05) return 'FAULT';
  if (random < 0.15) return 'OFF';
  return 'ON';
};

export const generateAlert = (machine: Machine): Alert | null => {
  const { sensors, id, name } = machine;
  const alerts: Alert[] = [];

  if (isValueInDanger(sensors.temperature, 'temperature')) {
    alerts.push({
      id: `${id}-temp-${Date.now()}`,
      machineId: id,
      type: 'error',
      message: `${name} temperature ${sensors.temperature > 95 ? 'critical high' : 'critically low'}: ${sensors.temperature}°C`,
      timestamp: new Date(),
    });
  }

  if (isValueInDanger(sensors.pressure, 'pressure')) {
    alerts.push({
      id: `${id}-pressure-${Date.now()}`,
      machineId: id,
      type: 'warning',
      message: `${name} pressure ${sensors.pressure > 140 ? 'high' : 'low'}: ${sensors.pressure} PSI`,
      timestamp: new Date(),
    });
  }

  if (isValueInDanger(sensors.vibration, 'vibration')) {
    alerts.push({
      id: `${id}-vibration-${Date.now()}`,
      machineId: id,
      type: 'error',
      message: `${name} excessive vibration detected: ${sensors.vibration} mm/s`,
      timestamp: new Date(),
    });
  }

  return alerts.length > 0 ? alerts[0] : null;
};

export const generateHistoricalData = (machineId: string, points: number = 24): HistoricalDataPoint[] => {
  const data: HistoricalDataPoint[] = [];
  const now = new Date();

  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000); // hourly data
    const sensorData = generateSensorData();
    data.push({
      timestamp,
      machineId,
      ...sensorData,
    });
  }

  return data;
};