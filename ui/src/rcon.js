import { store } from './store.js';

export class RconBridge {
  constructor() {
    this.queue = Promise.resolve();
    this.isTesting = false;
  }

  getInvoke() {
    if (window.__TAURI__?.core?.invoke) {
      return window.__TAURI__.core.invoke;
    }
    if (window.__TAURI__?.invoke) {
      return window.__TAURI__.invoke;
    }
    return null;
  }

  async rawSend(command, configOverride = null) {
    const invoke = this.getInvoke();
    const config = configOverride || store.getState().rconConfig;

    if (!config.password && !configOverride) {
      throw new Error('Contraseña RCON no configurada');
    }

    if (!invoke) {
      console.warn('[RCON Simulado - Sin backend Tauri]', command);
      return `[SIMULADO] Ejecutado con éxito: ${command}`;
    }

    try {
      const response = await invoke('send_rcon', {
        host: config.host || '127.0.0.1',
        port: Number(config.port) || 25575,
        password: config.password,
        command
      });
      store.setRconStatus('CONECTADO');
      return response;
    } catch (err) {
      store.setRconStatus('ERROR');
      throw typeof err === 'string' ? new Error(err) : err;
    }
  }

  sendCommand(command) {
    if (!command || typeof command !== 'string' || !command.trim()) {
      return Promise.resolve('');
    }

    const trimmed = command.trim();

    return new Promise((resolve, reject) => {
      this.queue = this.queue
        .then(() => this.rawSend(trimmed))
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          console.error(`Error ejecutando comando RCON "${trimmed}":`, err);
          reject(err);
        });
    });
  }

  async testConnection(config) {
    try {
      const result = await this.rawSend('/list', config);
      store.setRconStatus('CONECTADO');
      return { success: true, message: result || 'Conectado exitosamente. Servidor respondió.' };
    } catch (err) {
      store.setRconStatus('ERROR');
      return { success: false, message: err.message || 'Error de conexión a RCON' };
    }
  }
}

export const rconBridge = new RconBridge();
