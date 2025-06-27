#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🍎 Iniciando build do projeto Controle de Despensa para macOS...\n');

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

// Função para limpar builds anteriores
function cleanPreviousBuilds() {
  console.log('🧹 Limpando builds anteriores...');
  
  const dirsToClean = [
    'frontend/build',
    'dist'
  ];

  dirsToClean.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log(`   Limpo: ${dir}`);
    }
  });
}

// Função para build do frontend
function buildFrontend() {
  console.log('\n🏗️  Build do frontend...');
  
  try {
    execSync('cd frontend && npm run build', { stdio: 'inherit' });
    console.log('✅ Frontend buildado com sucesso');
  } catch (error) {
    console.error('❌ Erro no build do frontend:', error.message);
    process.exit(1);
  }
}

// Função para build do backend
function buildBackend() {
  console.log('\n🔧 Build do backend...');
  
  try {
    execSync('cd backend && npm run build', { stdio: 'inherit' });
    console.log('✅ Backend buildado com sucesso');
  } catch (error) {
    console.error('❌ Erro no build do backend:', error.message);
    process.exit(1);
  }
}

// Função para build do Electron para macOS
function buildElectron() {
  console.log('\n⚡ Build do Electron para macOS...');
  
  try {
    execSync('npx electron-builder --mac', { stdio: 'inherit' });
    console.log('✅ Electron buildado com sucesso para macOS');
  } catch (error) {
    console.error('❌ Erro no build do Electron:', error.message);
    process.exit(1);
  }
}

// Função para verificar se o build foi bem-sucedido
function verifyBuild() {
  console.log('\n🔍 Verificando build...');
  
  const requiredFiles = [
    'frontend/build/index.html',
    'dist'
  ];

  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    console.error('❌ Arquivos de build não encontrados:');
    missingFiles.forEach(file => console.error(`   - ${file}`));
    process.exit(1);
  }
  
  console.log('✅ Build verificado com sucesso');
}

// Função para mostrar informações do build
function showBuildInfo() {
  console.log('\n📊 Informações do Build:');
  
  if (fs.existsSync('dist')) {
    const distContents = fs.readdirSync('dist');
    const macFiles = distContents.filter(file => 
      file.includes('.dmg') || file.includes('.zip') || file.includes('mac')
    );
    
    console.log(`   Arquivos macOS gerados: ${macFiles.length}`);
    macFiles.forEach(file => {
      const filePath = path.join('dist', file);
      const stats = fs.statSync(filePath);
      console.log(`   - ${file} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    });
  }
  
  if (fs.existsSync('frontend/build')) {
    const buildStats = fs.statSync('frontend/build');
    console.log(`   Tamanho do frontend: ${(buildStats.size / 1024 / 1024).toFixed(2)} MB`);
  }
}

// Função principal
function main() {
  try {
    checkEnvFiles();
    cleanPreviousBuilds();
    buildFrontend();
    buildBackend();
    buildElectron();
    verifyBuild();
    showBuildInfo();
    
    console.log('\n🎉 Build para macOS concluído com sucesso!');
    console.log('\n📁 Arquivos gerados:');
    console.log('- dist/ - Aplicação Electron para macOS');
    console.log('- frontend/build/ - Frontend otimizado');
    console.log('\n🚀 Para executar em desenvolvimento: npm run dev');
    console.log('📦 Para distribuir: Use os arquivos .dmg e .zip em dist/');
    
  } catch (error) {
    console.error('❌ Erro durante o build:', error.message);
    process.exit(1);
  }
}

// Executar build
main(); 