#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Verificando status do projeto Controle de Despensa...\n');

// Função para verificar se um arquivo existe
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Função para verificar se um diretório existe
function dirExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

// Função para verificar versão do Node.js
function checkNodeVersion() {
  try {
    const version = process.version;
    const majorVersion = parseInt(version.slice(1).split('.')[0]);
    
    if (majorVersion >= 18) {
      console.log(`✅ Node.js ${version} - OK`);
      return true;
    } else {
      console.log(`❌ Node.js ${version} - Versão muito antiga (mínimo 18)`);
      return false;
    }
  } catch (error) {
    console.log('❌ Erro ao verificar versão do Node.js');
    return false;
  }
}

// Função para verificar versão do npm
function checkNpmVersion() {
  try {
    const version = execSync('npm --version', { encoding: 'utf8' }).trim();
    const majorVersion = parseInt(version.split('.')[0]);
    
    if (majorVersion >= 9) {
      console.log(`✅ npm ${version} - OK`);
      return true;
    } else {
      console.log(`❌ npm ${version} - Versão muito antiga (mínimo 9)`);
      return false;
    }
  } catch (error) {
    console.log('❌ Erro ao verificar versão do npm');
    return false;
  }
}

// Função para verificar MongoDB
function checkMongoDB() {
  try {
    execSync('mongod --version', { stdio: 'ignore' });
    console.log('✅ MongoDB detectado');
    return true;
  } catch (error) {
    console.log('⚠️  MongoDB não detectado');
    return false;
  }
}

// Função para verificar arquivos de ambiente
function checkEnvFiles() {
  const envFiles = [
    { path: '.env', name: 'Projeto Principal' },
    { path: 'backend/.env', name: 'Backend' },
    { path: 'frontend/.env', name: 'Frontend' }
  ];

  let allExist = true;
  
  envFiles.forEach(({ path: filePath, name }) => {
    if (fileExists(filePath)) {
      console.log(`✅ ${name} (.env) - OK`);
    } else {
      console.log(`❌ ${name} (.env) - Faltando`);
      allExist = false;
    }
  });

  return allExist;
}

// Função para verificar dependências
function checkDependencies() {
  const packageFiles = [
    { path: 'package.json', name: 'Projeto Principal' },
    { path: 'frontend/package.json', name: 'Frontend' },
    { path: 'backend/package.json', name: 'Backend' }
  ];

  let allExist = true;
  
  packageFiles.forEach(({ path: filePath, name }) => {
    if (fileExists(filePath)) {
      console.log(`✅ ${name} (package.json) - OK`);
    } else {
      console.log(`❌ ${name} (package.json) - Faltando`);
      allExist = false;
    }
  });

  return allExist;
}

// Função para verificar diretórios node_modules
function checkNodeModules() {
  const nodeModulesDirs = [
    { path: 'node_modules', name: 'Projeto Principal' },
    { path: 'frontend/node_modules', name: 'Frontend' },
    { path: 'backend/node_modules', name: 'Backend' }
  ];

  let allExist = true;
  
  nodeModulesDirs.forEach(({ path: dirPath, name }) => {
    if (dirExists(dirPath)) {
      console.log(`✅ ${name} (node_modules) - OK`);
    } else {
      console.log(`❌ ${name} (node_modules) - Faltando`);
      allExist = false;
    }
  });

  return allExist;
}

// Função para verificar scripts
function checkScripts() {
  const scripts = [
    { path: 'scripts/setup.js', name: 'Setup' },
    { path: 'scripts/build.js', name: 'Build' },
    { path: 'scripts/dev.js', name: 'Dev' },
    { path: 'scripts/check.js', name: 'Check' }
  ];

  let allExist = true;
  
  scripts.forEach(({ path: filePath, name }) => {
    if (fileExists(filePath)) {
      console.log(`✅ Script ${name} - OK`);
    } else {
      console.log(`❌ Script ${name} - Faltando`);
      allExist = false;
    }
  });

  return allExist;
}

// Função para verificar documentação
function checkDocumentation() {
  const docs = [
    { path: 'README.md', name: 'README' },
    { path: 'REBUILD.md', name: 'REBUILD' },
    { path: 'REBUILD_CHECKLIST.md', name: 'REBUILD_CHECKLIST' },
    { path: 'CHANGELOG.md', name: 'CHANGELOG' },
    { path: 'PRODUCTION.md', name: 'PRODUCTION' }
  ];

  let allExist = true;
  
  docs.forEach(({ path: filePath, name }) => {
    if (fileExists(filePath)) {
      console.log(`✅ Documentação ${name} - OK`);
    } else {
      console.log(`❌ Documentação ${name} - Faltando`);
      allExist = false;
    }
  });

  return allExist;
}

// Função para verificar estrutura do projeto
function checkProjectStructure() {
  const dirs = [
    { path: 'frontend', name: 'Frontend' },
    { path: 'backend', name: 'Backend' },
    { path: 'electron', name: 'Electron' },
    { path: 'scripts', name: 'Scripts' }
  ];

  let allExist = true;
  
  dirs.forEach(({ path: dirPath, name }) => {
    if (dirExists(dirPath)) {
      console.log(`✅ Diretório ${name} - OK`);
    } else {
      console.log(`❌ Diretório ${name} - Faltando`);
      allExist = false;
    }
  });

  return allExist;
}

// Função para verificar se os serviços estão rodando
function checkServices() {
  console.log('\n🔍 Verificando serviços...');
  
  try {
    // Verificar se a porta 5000 está em uso (backend)
    execSync('netstat -ano | findstr :5000', { stdio: 'ignore' });
    console.log('✅ Backend (porta 5000) - Rodando');
  } catch (error) {
    console.log('❌ Backend (porta 5000) - Não está rodando');
  }

  try {
    // Verificar se a porta 3000 está em uso (frontend)
    execSync('netstat -ano | findstr :3000', { stdio: 'ignore' });
    console.log('✅ Frontend (porta 3000) - Rodando');
  } catch (error) {
    console.log('❌ Frontend (porta 3000) - Não está rodando');
  }
}

// Função principal
function main() {
  console.log('📋 Verificando pré-requisitos...');
  const nodeOk = checkNodeVersion();
  const npmOk = checkNpmVersion();
  const mongoOk = checkMongoDB();

  console.log('\n📁 Verificando estrutura do projeto...');
  const structureOk = checkProjectStructure();
  const scriptsOk = checkScripts();
  const docsOk = checkDocumentation();

  console.log('\n⚙️ Verificando configuração...');
  const envOk = checkEnvFiles();
  const depsOk = checkDependencies();
  const nodeModulesOk = checkNodeModules();

  console.log('\n🔍 Verificando serviços...');
  checkServices();

  // Resumo
  console.log('\n📊 Resumo da Verificação:');
  console.log('========================');
  
  const checks = [
    { name: 'Node.js', status: nodeOk },
    { name: 'npm', status: npmOk },
    { name: 'MongoDB', status: mongoOk },
    { name: 'Estrutura do Projeto', status: structureOk },
    { name: 'Scripts', status: scriptsOk },
    { name: 'Documentação', status: docsOk },
    { name: 'Arquivos .env', status: envOk },
    { name: 'package.json', status: depsOk },
    { name: 'node_modules', status: nodeModulesOk }
  ];

  const passed = checks.filter(check => check.status).length;
  const total = checks.length;

  checks.forEach(check => {
    const icon = check.status ? '✅' : '❌';
    console.log(`${icon} ${check.name}`);
  });

  console.log(`\n📈 Resultado: ${passed}/${total} verificações passaram`);

  if (passed === total) {
    console.log('\n🎉 Projeto pronto para uso!');
    console.log('\n🚀 Comandos disponíveis:');
    console.log('   npm run setup    - Configurar projeto');
    console.log('   npm run dev      - Iniciar desenvolvimento');
    console.log('   npm run build    - Build para produção');
    console.log('   npm test         - Executar testes');
  } else {
    console.log('\n⚠️  Alguns problemas foram encontrados.');
    console.log('   Execute: npm run setup');
  }
}

// Executar verificação
main(); 