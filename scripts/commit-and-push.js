#!/usr/bin/env node

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 Commit e Push Automático - Controle de Despensa\n');

// Função para executar comandos
function execCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ Erro ao executar: ${command}`);
    return false;
  }
}

// Função para fazer commit
async function commit() {
  return new Promise((resolve) => {
    rl.question('📝 Digite a mensagem do commit: ', (message) => {
      if (!message.trim()) {
        console.log('❌ Mensagem não pode estar vazia');
        resolve(false);
        return;
      }

      console.log('\n🔄 Fazendo commit...');
      const success = execCommand(`git add . && git commit -m "${message}"`);
      resolve(success);
    });
  });
}

// Função para fazer push
function push() {
  console.log('\n🚀 Fazendo push...');
  return execCommand('git push origin main');
}

// Função principal
async function main() {
  try {
    // Verificar se há mudanças
    console.log('🔍 Verificando mudanças...');
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (!status.trim()) {
      console.log('✅ Nenhuma mudança para commitar');
      rl.close();
      return;
    }

    console.log('📋 Mudanças encontradas:');
    console.log(status);

    // Fazer commit
    const commitSuccess = await commit();
    if (!commitSuccess) {
      console.log('❌ Falha no commit');
      rl.close();
      return;
    }

    // Fazer push
    const pushSuccess = push();
    if (!pushSuccess) {
      console.log('❌ Falha no push');
      rl.close();
      return;
    }

    console.log('\n🎉 Commit e push realizados com sucesso!');
    console.log('\n📊 Próximos passos:');
    console.log('1. GitHub Actions iniciará automaticamente');
    console.log('2. Builds serão gerados para todas as plataformas');
    console.log('3. Acompanhe em: https://github.com/seu-usuario/seu-repo/actions');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    rl.close();
  }
}

// Executar
main(); 