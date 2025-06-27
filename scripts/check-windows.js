#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verificando ambiente do projeto Controle de Despensa (Windows)...\n');

// Função para verificar versão do Node.js
function checkNodeVersion() {
  const version = process.version;
  const majorVersion = parseInt(version.slice(1).split('.')[0]);
  
  if (majorVersion < 18) {
    console.error('❌ Node.js versão 18 ou superior é necessária');
    console.error(`   Versão atual: ${version}`);
    return false;
  }
  
  console.log(`✅ Node.js ${version} - OK`);
  return true;
}

// Função para verificar versão do npm
function checkNpmVersion() {
  try {
    const version = execSync('npm --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(version.split('.')[0]);
    
    if (majorVersion < 9) {
      console.error('❌ npm versão 9 ou superior é necessária');
      console.error(`   Versão atual: ${version}`);
      return false;
    }
    
    console.log(`✅ npm ${version} - OK`);
    return true;
  } catch (error) {
    console.error('❌ Erro ao verificar versão do npm:', error.message);
    return false;
  }
}

// Função para verificar arquivos .env
function checkEnvFiles() {
  const envFiles = [
    { path: '.env', name: 'Projeto Principal' },
    { path: 'backend/.env', name: 'Backend' },
    { path: 'frontend/.env', name: 'Frontend' }
  ];

  let allOk = true;

  envFiles.forEach(({ path: envPath, name }) => {
    if (fs.existsSync(envPath)) {
      console.log(`✅ ${name} (.env) - OK`);
    } else {
      console.error(`❌ ${name} (.env) - FALTANDO`);
      allOk = false;
    }
  });

  return allOk;
}

// Função para verificar dependências instaladas
function checkDependencies() {
  const directories = [
    { path: 'node_modules', name: 'Projeto Principal' },
    { path: 'frontend/node_modules', name: 'Frontend' },
    { path: 'backend/node_modules', name: 'Backend' }
  ];

  let allOk = true;

  directories.forEach(({ path: dirPath, name }) => {
    if (fs.existsSync(dirPath)) {
      console.log(`✅ ${name} (node_modules) - OK`);
    } else {
      console.error(`❌ ${name} (node_modules) - FALTANDO`);
      allOk = false;
    }
  });

  return allOk;
}

// Função para verificar MongoDB
function checkMongoDB() {
  try {
    execSync('mongod --version', { stdio: 'ignore' });
    console.log('✅ MongoDB - OK');
    return true;
  } catch {
    console.log('⚠️  MongoDB - NÃO DETECTADO');
    console.log('   Instale em: https://www.mongodb.com/try/download/community');
    return false;
  }
}

// Função para verificar portas
function checkPorts() {
  console.log('\n🔌 Verificando portas...');
  
  try {
    execSync('netstat -ano | findstr :3000', { stdio: 'ignore' });
    console.log('⚠️  Porta 3000 - EM USO');
  } catch {
    console.log('✅ Porta 3000 - DISPONÍVEL');
  }
  
  try {
    execSync('netstat -ano | findstr :5000', { stdio: 'ignore' });
    console.log('⚠️  Porta 5000 - EM USO');
  } catch {
    console.log('✅ Porta 5000 - DISPONÍVEL');
  }
}

// Função para verificar diretórios necessários
function checkDirectories() {
  const directories = [
    'backend/logs',
    'frontend/build',
    'dist'
  ];

  let allOk = true;

  directories.forEach(dir => {
    if (fs.existsSync(dir)) {
      console.log(`✅ Diretório ${dir} - OK`);
    } else {
      console.log(`⚠️  Diretório ${dir} - NÃO EXISTE (será criado automaticamente)`);
    }
  });

  return allOk;
}

// Função para verificar scripts
function checkScripts() {
  const scripts = [
    'scripts/setup.js',
    'scripts/setup-windows.js',
    'scripts/build.js',
    'scripts/build-windows.js',
    'scripts/dev.js',
    'scripts/check.js'
  ];

  let allOk = true;

  scripts.forEach(script => {
    if (fs.existsSync(script)) {
      console.log(`✅ Script ${script} - OK`);
    } else {
      console.error(`❌ Script ${script} - FALTANDO`);
      allOk = false;
    }
  });

  return allOk;
}

// Função para verificar package.json
function checkPackageJson() {
  const packageFiles = [
    'package.json',
    'frontend/package.json',
    'backend/package.json'
  ];

  let allOk = true;

  packageFiles.forEach(pkg => {
    if (fs.existsSync(pkg)) {
      console.log(`✅ ${pkg} - OK`);
    } else {
      console.error(`❌ ${pkg} - FALTANDO`);
      allOk = false;
    }
  });

  return allOk;
}

// Função para verificar dependências do sistema
function checkSystemDependencies() {
  console.log('\n🔧 Verificando dependências do sistema...');
  
  try {
    execSync('python --version', { stdio: 'ignore' });
    console.log('✅ Python - OK');
  } catch {
    console.log('⚠️  Python - NÃO DETECTADO');
    console.log('   Pode ser necessário para algumas dependências');
  }
  
  try {
    execSync('where cl', { stdio: 'ignore' });
    console.log('✅ Visual Studio Build Tools - OK');
  } catch {
    console.log('⚠️  Visual Studio Build Tools - NÃO DETECTADO');
    console.log('   Pode ser necessário para compilar dependências nativas');
  }
}

// Função principal
function main() {
  console.log('📋 Checklist de Verificação:\n');
  
  let allChecksPassed = true;
  
  // Verificações críticas
  allChecksPassed = checkNodeVersion() && allChecksPassed;
  allChecksPassed = checkNpmVersion() && allChecksPassed;
  allChecksPassed = checkEnvFiles() && allChecksPassed;
  allChecksPassed = checkDependencies() && allChecksPassed;
  allChecksPassed = checkPackageJson() && allChecksPassed;
  allChecksPassed = checkScripts() && allChecksPassed;
  
  // Verificações de aviso
  checkMongoDB();
  checkDirectories();
  checkSystemDependencies();
  checkPorts();
  
  console.log('\n📊 Resumo da Verificação:');
  
  if (allChecksPassed) {
    console.log('✅ Ambiente pronto para rebuild!');
    console.log('\n🚀 Próximos passos:');
    console.log('1. npm run dev - Para desenvolvimento');
    console.log('2. npm run build-windows - Para build de produção');
    console.log('3. npm test - Para executar testes');
  } else {
    console.log('❌ Ambiente não está pronto para rebuild');
    console.log('\n🔧 Execute primeiro:');
    console.log('npm run setup-windows');
  }
  
  console.log('\n📚 Documentação disponível:');
  console.log('- README.md - Visão geral');
  console.log('- REBUILD.md - Guia de rebuild');
  console.log('- REBUILD_CHECKLIST.md - Checklist detalhado');
  console.log('- PRODUCTION.md - Guia de produção');
}

// Executar verificação
main(); 