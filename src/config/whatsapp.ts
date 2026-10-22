/**
 * Configuração de contato via WhatsApp para o projeto Cultura em Cena.
 *
 * Canal direto de acolhimento e suporte a artistas e produtores culturais
 * de Indaiatuba e região (DDD 19).
 *
 * Formato: DDI + DDD + Número sem caracteres especiais (ex: '5519987654321').
 * Aceita substituição via variável de ambiente VITE_WHATSAPP_NUMBER.
 */
export const WHATSAPP_NUMBER: string =
  (import.meta.env.VITE_WHATSAPP_NUMBER as string)?.trim() || '5519987654321';

export const WHATSAPP_DEFAULT_MESSAGE: string =
  'Olá! Vim pela plataforma Cultura em Cena e gostaria de suporte para preparação de editais culturais.';
