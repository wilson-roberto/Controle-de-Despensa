#!/usr/bin/env node

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando ambiente de desenvolvimento...\n');

let processes = [];

// Função para verificar se os arquivos .env existem
function checkEnvFiles() {
  const envFiles = [
    '.env',
    'backend/.env',
    'frontend/.env'
  ];

  const missingFiles = envFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    console.error('❌ Arquivos de ambiente não encontrados:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    console.error('\nExecute primeiro: node scripts/setup.js');
    process.exit(1);
  }
  
  console.log('✅ Arquivos de ambiente verificados');
}

// Função para iniciar o backend
function startBackend() {
  console.log('🔧 Iniciando backend...');
  
  const backendProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, '../backend'),
    stdio: 'inherit',
    shell: true
  });

  backendProcess.on('error', (error) => {
    console.error('❌ Erro ao iniciar backend:', error.message);
  });

  processes.push(backendProcess);
  return backendProcess;
}

// Função para iniciar o frontend
function startFrontend() {
  console.log('🎨 Iniciando frontend...');
  
  const frontendProcess = spawn('npm', ['start'], {
    cwd: path.join(__dirname, '../frontend'),
    stdio: 'inherit',
    shell: true
  });

  frontendProcess.on('error', (error) => {
    console.error('❌ Erro ao iniciar frontend:', error.message);
  });

  processes.push(frontendProcess);
  return frontendProcess;
}

// Função para iniciar o Electron
function startElectron() {
  console.log('⚡ Iniciando Electron...');
  
  // Aguarda um pouco para o frontend e backend iniciarem
  setTimeout(() => {
    const electronProcess = spawn('npm', ['start'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      shell: true
    });

    electronProcess.on('error', (error) => {
      console.error('❌ Erro ao iniciar Electron:', error.message);
    });

    processes.push(electronProcess);
  }, 5000);
}

// Função para gerenciar o encerramento dos processos
function setupGracefulShutdown() {
  const shutdown = () => {
    console.log('\n🛑 Encerrando processos...');
    
    processes.forEach(process => {
      if (process && !process.killed) {
        process.kill('SIGTERM');
      }
    });
    
    setTimeout(() => {
      processes.forEach(process => {
        if (process && !process.killed) {
          process.kill('SIGKILL');
        }
      });
      process.exit(0);
    }, 5000);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  process.on('exit', shutdown);
}

// Função para mostrar informações de desenvolvimento
function showDevInfo() {
  console.log('\n📋 Informações de Desenvolvimento:');
  console.log('   Backend: http://localhost:5000');
  console.log('   Frontend: http://localhost:3000');
  console.log('   Electron: Aplicação desktop');
  console.log('\n🔧 Comandos úteis:');
  console.log('   Ctrl+C - Parar todos os processos');
  console.log('   npm run test - Executar testes');
  console.log('   npm run build - Build para produção');
  console.log('\n📚 Documentação:');
  console.log('   README.md - Visão geral');
  console.log('   backend/docs/api.md - API');
  console.log('   PRODUCTION.md - Produção');
}

// Função principal
function main() {
  try {
    checkEnvFiles();
    setupGracefulShutdown();
    
    console.log('🔄 Iniciando serviços...\n');
    
    startBackend();
    
    // Aguarda um pouco antes de iniciar o frontend
    setTimeout(() => {
      startFrontend();
      
      // Aguarda um pouco antes de iniciar o Electron
      setTimeout(() => {
        startElectron();
      }, 3000);
    }, 2000);
    
    showDevInfo();
    
    console.log('\n✅ Ambiente de desenvolvimento iniciado!');
    console.log('   Aguarde alguns segundos para todos os serviços estarem prontos...\n');
    
  } catch (error) {
    console.error('❌ Erro ao iniciar desenvolvimento:', error.message);
    process.exit(1);
  }
}

// Executar desenvolvimento
main(); 