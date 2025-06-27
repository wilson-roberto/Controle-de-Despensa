#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔨 Iniciando build do projeto Controle de Despensa (Windows)...\n');

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
    console.error('\nExecute primeiro: node scripts/setup-windows.js');
    process.exit(1);
  }
  
  console.log('✅ Arquivos de ambiente verificados');
}

// Função para limpar builds anteriores no Windows
function cleanPreviousBuilds() {
  console.log('🧹 Limpando builds anteriores...');
  
  const dirsToClean = [
    'frontend/build',
    'dist'
  ];

  dirsToClean.forEach(dir => {
    if (fs.existsSync(dir)) {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`   Limpo: ${dir}`);
      } catch (error) {
        console.log(`   ⚠️  Erro ao limpar ${dir}: ${error.message}`);
      }
    }
  });
}

// Função para build do frontend no Windows
function buildFrontend() {
  console.log('\n🏗️  Build do frontend...');
  
  try {
    execSync('cd frontend && npm run build', { stdio: 'inherit', shell: true });
    console.log('✅ Frontend buildado com sucesso');
  } catch (error) {
    console.error('❌ Erro no build do frontend:', error.message);
    console.error('\n💡 Soluções possíveis:');
    console.error('1. Verifique se todas as dependências estão instaladas');
    console.error('2. Execute: cd frontend && npm install');
    console.error('3. Limpe o cache: npm cache clean --force');
    process.exit(1);
  }
}

// Função para build do backend no Windows
function buildBackend() {
  console.log('\n🔧 Build do backend...');
  
  try {
    execSync('cd backend && npm run build', { stdio: 'inherit', shell: true });
    console.log('✅ Backend buildado com sucesso');
  } catch (error) {
    console.error('❌ Erro no build do backend:', error.message);
    console.error('\n💡 Soluções possíveis:');
    console.error('1. Verifique se todas as dependências estão instaladas');
    console.error('2. Execute: cd backend && npm install');
    process.exit(1);
  }
}

// Função para build do Electron no Windows
function buildElectron() {
  console.log('\n⚡ Build do Electron...');
  
  try {
    execSync('npm run build', { stdio: 'inherit', shell: true });
    console.log('✅ Electron buildado com sucesso');
  } catch (error) {
    console.error('❌ Erro no build do Electron:', error.message);
    console.error('\n💡 Soluções possíveis:');
    console.error('1. Verifique se todas as dependências estão instaladas');
    console.error('2. Execute: npm install');
    console.error('3. Verifique se o Python está instalado (necessário para algumas dependências)');
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
    try {
      const distStats = fs.statSync('dist');
      console.log(`   Tamanho do build: ${(distStats.size / 1024 / 1024).toFixed(2)} MB`);
      
      const distContents = fs.readdirSync('dist');
      console.log(`   Arquivos gerados: ${distContents.length}`);
      
      // Listar arquivos principais
      distContents.forEach(file => {
        if (file.endsWith('.exe') || file.endsWith('.msi')) {
          console.log(`   📦 Instalador: ${file}`);
        }
      });
    } catch (error) {
      console.log(`   ⚠️  Erro ao verificar dist: ${error.message}`);
    }
  }
  
  if (fs.existsSync('frontend/build')) {
    try {
      const buildStats = fs.statSync('frontend/build');
      console.log(`   Tamanho do frontend: ${(buildStats.size / 1024 / 1024).toFixed(2)} MB`);
    } catch (error) {
      console.log(`   ⚠️  Erro ao verificar frontend/build: ${error.message}`);
    }
  }
}

// Função para verificar dependências do sistema
function checkSystemDependencies() {
  console.log('\n🔍 Verificando dependências do sistema...');
  
  try {
    // Verificar se o Python está instalado (necessário para algumas dependências)
    execSync('python --version', { stdio: 'ignore' });
    console.log('✅ Python detectado');
  } catch {
    console.log('⚠️  Python não detectado');
    console.log('   Algumas dependências podem precisar do Python');
    console.log('   Baixe em: https://www.python.org/downloads/');
  }
  
  try {
    // Verificar se o Visual Studio Build Tools estão instalados
    execSync('where cl', { stdio: 'ignore' });
    console.log('✅ Visual Studio Build Tools detectados');
  } catch {
    console.log('⚠️  Visual Studio Build Tools não detectados');
    console.log('   Pode ser necessário para compilar dependências nativas');
    console.log('   Instale via: npm install --global windows-build-tools');
  }
}

// Função principal
function main() {
  try {
    checkEnvFiles();
    checkSystemDependencies();
    cleanPreviousBuilds();
    buildFrontend();
    buildBackend();
    buildElectron();
    verifyBuild();
    showBuildInfo();
    
    console.log('\n🎉 Build concluído com sucesso!');
    console.log('\n📁 Arquivos gerados:');
    console.log('- dist/ - Aplicação Electron pronta para distribuição');
    console.log('- frontend/build/ - Frontend otimizado');
    console.log('\n🚀 Para executar em desenvolvimento: npm run dev');
    console.log('📦 Para distribuir: Use os arquivos em dist/');
    console.log('\n💡 Dicas para Windows:');
    console.log('- Execute como administrador se houver problemas de permissão');
    console.log('- Verifique se o antivírus não está bloqueando o build');
    console.log('- Use o PowerShell para melhor compatibilidade');
    
  } catch (error) {
    console.error('❌ Erro durante o build:', error.message);
    process.exit(1);
  }
}

// Executar build
main(); 