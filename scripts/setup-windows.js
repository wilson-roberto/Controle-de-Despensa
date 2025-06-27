#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Iniciando setup do projeto Controle de Despensa (Windows)...\n');

// Função para verificar se um comando existe no Windows
function commandExists(command) {
  try {
    execSync(`where ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Função para verificar versão do Node.js
function checkNodeVersion() {
  const version = process.version;
  const majorVersion = parseInt(version.slice(1).split('.')[0]);
  
  if (majorVersion < 18) {
    console.error('❌ Node.js versão 18 ou superior é necessária');
    console.error(`   Versão atual: ${version}`);
    console.error('   Baixe em: https://nodejs.org/');
    process.exit(1);
  }
  
  console.log(`✅ Node.js ${version} detectado`);
}

// Função para verificar versão do npm
function checkNpmVersion() {
  try {
    const version = execSync('npm --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(version.split('.')[0]);
    
    if (majorVersion < 9) {
      console.error('❌ npm versão 9 ou superior é necessária');
      console.error(`   Versão atual: ${version}`);
      process.exit(1);
    }
    
    console.log(`✅ npm ${version} detectado`);
  } catch (error) {
    console.error('❌ Erro ao verificar versão do npm:', error.message);
    process.exit(1);
  }
}

// Função para criar arquivos .env
function createEnvFiles() {
  const envFiles = [
    { source: 'env.example', target: '.env' },
    { source: 'backend/env.example', target: 'backend/.env' },
    { source: 'frontend/env.example', target: 'frontend/.env' }
  ];

  envFiles.forEach(({ source, target }) => {
    if (fs.existsSync(source) && !fs.existsSync(target)) {
      fs.copyFileSync(source, target);
      console.log(`✅ Arquivo ${target} criado`);
    } else if (fs.existsSync(target)) {
      console.log(`ℹ️  Arquivo ${target} já existe`);
    } else {
      console.log(`⚠️  Arquivo ${source} não encontrado`);
    }
  });
}

// Função para instalar dependências no Windows
function installDependencies() {
  console.log('\n📦 Instalando dependências...');
  
  try {
    // Instalar dependências do projeto principal
    console.log('   Instalando dependências do projeto principal...');
    execSync('npm install', { stdio: 'inherit', shell: true });
    
    // Instalar dependências do frontend
    console.log('   Instalando dependências do frontend...');
    execSync('cd frontend && npm install', { stdio: 'inherit', shell: true });
    
    // Instalar dependências do backend
    console.log('   Instalando dependências do backend...');
    execSync('cd backend && npm install', { stdio: 'inherit', shell: true });
    
    console.log('✅ Todas as dependências foram instaladas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao instalar dependências:', error.message);
    console.error('\n💡 Soluções possíveis:');
    console.error('1. Execute como administrador');
    console.error('2. Limpe o cache: npm cache clean --force');
    console.error('3. Delete node_modules e package-lock.json e tente novamente');
    process.exit(1);
  }
}

// Função para verificar MongoDB no Windows
function checkMongoDB() {
  console.log('\n🗄️  Verificando MongoDB...');
  
  if (commandExists('mongod')) {
    console.log('✅ MongoDB detectado no sistema');
  } else {
    console.log('⚠️  MongoDB não detectado');
    console.log('\n📥 Para instalar MongoDB no Windows:');
    console.log('1. Baixe o MongoDB Community Server:');
    console.log('   https://www.mongodb.com/try/download/community');
    console.log('2. Execute o instalador como administrador');
    console.log('3. Adicione MongoDB ao PATH do sistema');
    console.log('4. Crie o diretório de dados:');
    console.log('   mkdir C:\\data\\db');
    console.log('5. Inicie o MongoDB:');
    console.log('   mongod --dbpath C:\\data\\db');
  }
}

// Função para criar diretórios necessários
function createDirectories() {
  const directories = [
    'backend/logs',
    'frontend/build',
    'dist'
  ];

  directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Diretório ${dir} criado`);
    }
  });
}

// Função para configurar permissões no Windows
function setupWindowsPermissions() {
  console.log('\n🔐 Configurando permissões...');
  
  try {
    // Verificar se o PowerShell está disponível
    execSync('powershell -Command "Get-ExecutionPolicy"', { stdio: 'ignore' });
    console.log('✅ PowerShell configurado');
  } catch (error) {
    console.log('⚠️  PowerShell não configurado corretamente');
    console.log('   Execute como administrador: Set-ExecutionPolicy RemoteSigned');
  }
}

// Função para verificar portas
function checkPorts() {
  console.log('\n🔌 Verificando portas...');
  
  try {
    // Verificar porta 3000
    execSync('netstat -ano | findstr :3000', { stdio: 'ignore' });
    console.log('⚠️  Porta 3000 está em uso');
  } catch {
    console.log('✅ Porta 3000 disponível');
  }
  
  try {
    // Verificar porta 5000
    execSync('netstat -ano | findstr :5000', { stdio: 'ignore' });
    console.log('⚠️  Porta 5000 está em uso');
  } catch {
    console.log('✅ Porta 5000 disponível');
  }
}

// Função principal
function main() {
  try {
    checkNodeVersion();
    checkNpmVersion();
    createDirectories();
    createEnvFiles();
    setupWindowsPermissions();
    checkMongoDB();
    checkPorts();
    installDependencies();
    
    console.log('\n🎉 Setup concluído com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Configure as variáveis de ambiente nos arquivos .env');
    console.log('2. Inicie o MongoDB: mongod --dbpath C:\\data\\db');
    console.log('3. Execute: npm run dev (para desenvolvimento)');
    console.log('4. Execute: npm run build (para produção)');
    console.log('\n🔧 Comandos úteis:');
    console.log('   npm run dev - Ambiente de desenvolvimento');
    console.log('   npm run build - Build para produção');
    console.log('   npm test - Executar testes');
    console.log('\n📚 Documentação:');
    console.log('- README.md - Visão geral do projeto');
    console.log('- backend/docs/setup.md - Configuração do backend');
    console.log('- backend/docs/api.md - Documentação da API');
    console.log('- PRODUCTION.md - Guia de produção');
    console.log('- REBUILD.md - Guia de rebuild');
    
  } catch (error) {
    console.error('❌ Erro durante o setup:', error.message);
    process.exit(1);
  }
}

// Executar setup
main(); 