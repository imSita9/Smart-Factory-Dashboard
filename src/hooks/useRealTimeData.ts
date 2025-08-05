import { useState, useEffect } from 'react';
import { Machine, Alert, HistoricalDataPoint } from '../types/factory';
import { generateSensorData, generateMachineStatus, generateAlert, generateHistoricalData } from '../utils/dataGenerator';

export const useRealTimeData = () => {
  const [machines, setMachines] = useState<Machine[]>([
    {
      id: 'M01',
      name: 'Injection Molding Machine 01',
      status: 'ON',
      lastStatusChange: new Date(),
      sensors: generateSensorData(),
      uptime: 87.5,
    },
    {
      id: 'M02',
      name: 'CNC Milling Machine 02',
      status: 'ON',
      lastStatusChange: new Date(),
      sensors: generateSensorData(),
      uptime: 92.1,
    },
    {
      id: 'M03',
      name: 'Assembly Robot 03',
      status: 'OFF',
      lastStatusChange: new Date(),
      sensors: generateSensorData(),
      uptime: 78.9,
    },
  ]);

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);

  useEffect(() => {
    // Initialize historical data
    const allHistoricalData: HistoricalDataPoint[] = [];
    machines.forEach(machine => {
      allHistoricalData.push(...generateHistoricalData(machine.id));
    });
    setHistoricalData(allHistoricalData);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setMachines(prevMachines => {
        const updatedMachines = prevMachines.map(machine => {
          const newSensors = generateSensorData();
          const newStatus = generateMachineStatus(machine.status);
          
          const updatedMachine = {
            ...machine,
            sensors: newSensors,
            status: newStatus,
            lastStatusChange: newStatus !== machine.status ? new Date() : machine.lastStatusChange,
          };

          // Generate alerts for this machine
          const alert = generateAlert(updatedMachine);
          if (alert) {
            setAlerts(prevAlerts => [alert, ...prevAlerts.slice(0, 9)]); // Keep last 10 alerts
          }

          return updatedMachine;
        });

        // Update historical data
        setHistoricalData(prevData => {
          const newDataPoints: HistoricalDataPoint[] = updatedMachines.map(machine => ({
            timestamp: new Date(),
            machineId: machine.id,
            temperature: machine.sensors.temperature,
            pressure: machine.sensors.pressure,
            vibration: machine.sensors.vibration,
          }));

          // Keep last 24 hours of data (assuming updates every 5-10 seconds, we'll keep more points)
          const maxPoints = 100;
          return [...prevData, ...newDataPoints].slice(-maxPoints);
        });

        return updatedMachines;
      });
    }, Math.random() * 5000 + 5000); // 5-10 seconds

    return () => clearInterval(interval);
  }, []);

  return { machines, alerts, historicalData };
};