import { formatWhatsAppNumbers } from '../utils/whatsappFormatter';

export const itemService = {
  prepareItemData: (formData) => {
    const quantidadeEntrada = Number(formData.quantidadeEntrada || 0);
    const quantidadeSaida = Number(formData.quantidadeSaida || 0);
    const totalEstoque = Math.floor(quantidadeEntrada - quantidadeSaida);
    
    return {
      ...formData,
      nome: formData.nome.trim(),
      unidade: formData.unidade.trim(),
      quantidadeEntrada,
      quantidadeSaida,
      totalEstoque,
      limiteEstoque: Number(formData.limiteEstoque || 0),
      whatsapp: formatWhatsAppNumbers(formData.whatsapp)
    };
  }
}; 