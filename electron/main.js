const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const isStaging = process.env.NODE_ENV === 'staging';
const isLocalProd = process.env.LOCAL_PROD === 'true';
const { spawn } = require('child_process');

let mainWindow;
let backendProcess;

function startBackend() {
  const backendPath = isDev 
    ? path.join(__dirname, '../backend')
    : path.join(process.resourcesPath, 'backend');

  const nodePath = process.execPath;
  const backendProcess = spawn(nodePath, ['server.js'], {
    cwd: backendPath,
    env: {
      ...process.env,
      NODE_ENV: isDev ? 'development' : 'production'
    }
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend stdout: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend stderr: ${data}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });

  return backendProcess;
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Carrega a URL do frontend baseado no ambiente
  if (isLocalProd) {
    // Carrega a versão de produção localmente
    mainWindow.loadURL(`file://${path.join(__dirname, '../frontend/build/index.html')}`);
  } else {
    mainWindow.loadURL(
      isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../frontend/build/index.html')}`
    );
  }

  // Abre o DevTools em modo de desenvolvimento ou local prod
  if (isDev || isLocalProd) {
    mainWindow.webContents.openDevTools();
  }

  // Configuração de segurança para ambiente local
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Permite apenas URLs locais
    if (url.startsWith('http://localhost:') || url.startsWith('file://')) {
      return { action: 'allow' };
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Configuração de handlers IPC
ipcMain.on('toMain', (event, data) => {
  // Processa mensagens do frontend
  console.log('Mensagem recebida do frontend:', data);
  // Envia resposta de volta para o frontend
  event.reply('fromMain', 'Mensagem recebida com sucesso');
});

app.whenReady().then(() => {
  if (!isDev) {
    backendProcess = startBackend();
  }
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    if (backendProcess) {
      backendProcess.kill();
    }
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
}); 