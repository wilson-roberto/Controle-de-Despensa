# use-prod-env.ps1
# Este script copia o .env.production para .env, sobrescrevendo o existente

$source = ".env.production"
$dest = ".env"

if (Test-Path $source) {
    Copy-Item -Path $source -Destination $dest -Force
    Write-Host "Arquivo .env configurado para PRODUÇÃO." -ForegroundColor Green
} else {
    Write-Host "Arquivo $source não encontrado!" -ForegroundColor Red
}