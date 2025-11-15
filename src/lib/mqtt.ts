import mqtt, { MqttClient } from 'mqtt';

export interface MachineStatus {
  totalCans: number;
  cansInProcess: number;
  completedCans: number;
  averageTime: string;
}

export interface CycleStatus {
  isActive: boolean;
  startedAt?: string;
}

class MQTTService {
  private client: MqttClient | null = null;
  private statusCallbacks: ((status: MachineStatus) => void)[] = [];
  private cycleCallbacks: ((cycle: CycleStatus) => void)[] = [];
  
  // Tópicos MQTT
  private readonly TOPICS = {
    STATUS: 'choppcontrol/status',
    CYCLE: 'choppcontrol/cycle',
    COMMAND: 'choppcontrol/command',
  };

  constructor() {
    this.connect();
  }

  private connect() {
    // Conecta via WebSockets na porta 9001 configurada no Mosquitto
    const brokerUrl = 'ws://localhost:9001';
    
    this.client = mqtt.connect(brokerUrl, {
      clientId: `web_client_${Math.random().toString(16).slice(2, 10)}`,
      clean: true,
      reconnectPeriod: 1000,
    });

    this.client.on('connect', () => {
      console.log('✅ Conectado ao broker MQTT');
      
      // Inscreve nos tópicos de status
      this.client?.subscribe([this.TOPICS.STATUS, this.TOPICS.CYCLE], (err) => {
        if (err) {
          console.error('❌ Erro ao se inscrever nos tópicos:', err);
        } else {
          console.log('📡 Inscrito nos tópicos de status');
        }
      });
    });

    this.client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        
        if (topic === this.TOPICS.STATUS) {
          this.statusCallbacks.forEach(callback => callback(payload));
        } else if (topic === this.TOPICS.CYCLE) {
          this.cycleCallbacks.forEach(callback => callback(payload));
        }
      } catch (error) {
        console.error('❌ Erro ao processar mensagem MQTT:', error);
      }
    });

    this.client.on('error', (error) => {
      console.error('❌ Erro na conexão MQTT:', error);
    });

    this.client.on('reconnect', () => {
      console.log('🔄 Reconectando ao broker MQTT...');
    });

    this.client.on('close', () => {
      console.log('⚠️ Conexão MQTT fechada');
    });
  }

  // Publica o início de um ciclo
  public startCycle() {
    const cycleData: CycleStatus = {
      isActive: true,
      startedAt: new Date().toISOString(),
    };
    
    this.publish(this.TOPICS.CYCLE, cycleData);
    console.log('🚀 Ciclo iniciado publicado no MQTT');
  }

  // Publica o fim de um ciclo
  public stopCycle() {
    const cycleData: CycleStatus = {
      isActive: false,
    };
    
    this.publish(this.TOPICS.CYCLE, cycleData);
    console.log('🛑 Ciclo finalizado publicado no MQTT');
  }

  // Publica dados de status da máquina
  public publishStatus(status: MachineStatus) {
    this.publish(this.TOPICS.STATUS, status);
  }

  // Publica um comando para a máquina
  public publishCommand(command: string, data?: any) {
    this.publish(this.TOPICS.COMMAND, { command, data, timestamp: new Date().toISOString() });
  }

  // Método genérico de publicação
  private publish(topic: string, data: any) {
    if (!this.client?.connected) {
      console.warn('⚠️ Cliente MQTT não conectado. Tentando publicar mesmo assim...');
    }
    
    this.client?.publish(topic, JSON.stringify(data), { qos: 1 }, (error) => {
      if (error) {
        console.error(`❌ Erro ao publicar em ${topic}:`, error);
      }
    });
  }

  // Registra callback para receber atualizações de status
  public onStatusUpdate(callback: (status: MachineStatus) => void) {
    this.statusCallbacks.push(callback);
    
    // Retorna função para remover o callback
    return () => {
      this.statusCallbacks = this.statusCallbacks.filter(cb => cb !== callback);
    };
  }

  // Registra callback para receber atualizações de ciclo
  public onCycleUpdate(callback: (cycle: CycleStatus) => void) {
    this.cycleCallbacks.push(callback);
    
    // Retorna função para remover o callback
    return () => {
      this.cycleCallbacks = this.cycleCallbacks.filter(cb => cb !== callback);
    };
  }

  // Desconecta do broker
  public disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
      console.log('🔌 Desconectado do broker MQTT');
    }
  }

  // Verifica se está conectado
  public isConnected(): boolean {
    return this.client?.connected ?? false;
  }
}

// Exporta instância singleton
export const mqttService = new MQTTService();
