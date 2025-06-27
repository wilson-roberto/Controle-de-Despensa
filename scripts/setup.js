#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Iniciando setup do projeto Controle de Despensa...\n');

// Função para verificar se um comando existe
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
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
    process.exit(1);
  }
  
  console.log(`✅ Node.js ${version} detectado`);
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

// Função para instalar dependências
function installDependencies() {
  console.log('\n📦 Instalando dependências...');
  
  try {
    // Instalar dependências do projeto principal
    console.log('   Instalando dependências do projeto principal...');
    execSync('npm install', { stdio: 'inherit' });
    
    // Instalar dependências do frontend
    console.log('   Instalando dependências do frontend...');
    execSync('cd frontend && npm install', { stdio: 'inherit' });
    
    // Instalar dependências do backend
    console.log('   Instalando dependências do backend...');
    execSync('cd backend && npm install', { stdio: 'inherit' });
    
    console.log('✅ Todas as dependências foram instaladas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao instalar dependências:', error.message);
    process.exit(1);
  }
}

// Função para verificar MongoDB
function checkMongoDB() {
  console.log('\n🗄️  Verificando MongoDB...');
  
  if (commandExists('mongod')) {
    console.log('✅ MongoDB detectado no sistema');
  } else {
    console.log('⚠️  MongoDB não detectado');
    console.log('   Para instalar MongoDB:');
    console.log('   - Windows: https://www.mongodb.com/try/download/community');
    console.log('   - macOS: brew install mongodb-community');
    console.log('   - Linux: https://docs.mongodb.com/manual/administration/install-on-linux/');
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

// Função principal
function main() {
  try {
    checkNodeVersion();
    createDirectories();
    createEnvFiles();
    checkMongoDB();
    installDependencies();
    
    console.log('\n🎉 Setup concluído com sucesso!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Configure as variáveis de ambiente nos arquivos .env');
    console.log('2. Inicie o MongoDB');
    console.log('3. Execute: npm run dev (para desenvolvimento)');
    console.log('4. Execute: npm run build (para produção)');
    console.log('\n📚 Documentação:');
    console.log('- README.md - Visão geral do projeto');
    console.log('- backend/docs/setup.md - Configuração do backend');
    console.log('- backend/docs/api.md - Documentação da API');
    console.log('- PRODUCTION.md - Guia de produção');
    
  } catch (error) {
    console.error('❌ Erro durante o setup:', error.message);
    process.exit(1);
  }
}

// Executar setup
main(); 