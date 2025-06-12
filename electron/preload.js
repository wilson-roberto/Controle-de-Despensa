const { contextBridge, ipcRenderer } = require('electron');

// Expondo APIs seguras para o frontend
contextBridge.exposeInMainWorld('electronAPI', {
  // Exemplo de método para comunicação com o processo principal
  sendMessage: (channel, data) => {
    // Lista de canais permitidos
    const validChannels = ['toMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  
  // Exemplo de método para receber mensagens do processo principal
  receiveMessage: (channel, func) => {
    const validChannels = ['fromMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
}); 