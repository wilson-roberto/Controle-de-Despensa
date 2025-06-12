# Script para trocar as variáveis de ambiente do frontend para produção
$envDevPath = ".env.development"
$envProdPath = ".env.production"

# Verifica se o arquivo .env.production existe
if (-not (Test-Path $envProdPath)) {
    Write-Host "Erro: Arquivo .env.production não encontrado!"
    exit 1
}

# Faz backup do .env.development se existir
if (Test-Path $envDevPath) {
    Copy-Item $envDevPath "$envDevPath.backup" -Force
    Write-Host "Backup do .env.development criado"
}

# Copia .env.production para .env.development
Copy-Item $envProdPath $envDevPath -Force
Write-Host "Variáveis de ambiente alteradas para produção com sucesso!" 