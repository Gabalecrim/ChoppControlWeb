import { useEffect, useState } from "react";
import { mqttService, type MachineStatus, type CycleStatus } from "@/lib/mqtt";

export function useMachineStatus() {
  const [status, setStatus] = useState<MachineStatus>({
    totalCans: 0,
    cansInProcess: 0,
    completedCans: 0,
    averageTime: "00:00",
  });

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Registra callback para atualizações de status
    const unsubscribe = mqttService.onStatusUpdate((newStatus) => {
      setStatus(newStatus);
    });

    // Verifica conexão periodicamente
    const checkConnection = setInterval(() => {
      setIsConnected(mqttService.isConnected());
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(checkConnection);
    };
  }, []);

  return { status, isConnected };
}

export function useCycleStatus() {
  const [cycle, setCycle] = useState<CycleStatus>({
    isActive: false,
  });

  useEffect(() => {
    // Registra callback para atualizações de ciclo
    const unsubscribe = mqttService.onCycleUpdate((newCycle) => {
      setCycle(newCycle);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const startCycle = () => {
    mqttService.startCycle();
  };

  const stopCycle = () => {
    mqttService.stopCycle();
  };

  return { cycle, startCycle, stopCycle };
}

export function useMQTTPublish() {
  const publishStatus = (status: MachineStatus) => {
    mqttService.publishStatus(status);
  };

  const publishCommand = (command: string, data?: string) => {
    mqttService.publishCommand(command, data);
  };

  return { publishStatus, publishCommand };
}
