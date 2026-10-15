import { BDIConfig } from '../types/orcamento';

/**
 * Calcula a taxa de BDI conforme a fórmula padrão do TCU (Acórdão 2622/2013 - Plenário):
 * BDI = { [ (1 + AC + S + R + G) * (1 + DF) * (1 + L) ] / (1 - T) } - 1
 */
export function calcularTaxaBDI(config: BDIConfig): number {
  const ac = config.ac / 100;
  const sg = config.sg / 100;
  const r = config.r / 100;
  const df = config.df / 100;
  const l = config.l / 100;
  
  // Soma dos tributos
  const tributos = (config.pis + config.cofins + config.iss + (config.desonerado ? config.cprb : 0)) / 100;

  if (tributos >= 1) {
    return 0;
  }

  const numerador = (1 + ac + sg + r) * (1 + df) * (1 + l);
  const denominador = 1 - tributos;

  const bdiDecimal = (numerador / denominador) - 1;
  return Number((bdiDecimal * 100).toFixed(2));
}

export function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(valor || 0);
}

export function formatarNumero(valor: number, decimais: number = 2): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: decimais,
    maximumFractionDigits: decimais,
  }).format(valor || 0);
}

export function formatarPorcentagem(valor: number, decimais: number = 2): string {
  return `${formatarNumero(valor, decimais)}%`;
}

// Parâmetros médios de referência do TCU (Edificações - Acórdão 2622/2013)
export const TCU_REFERENCIAS = {
  ac: { min: 3.00, medio: 4.00, max: 5.50, desc: 'Administração Central' },
  sg: { min: 0.80, medio: 0.80, max: 1.00, desc: 'Seguro e Garantia' },
  r: { min: 0.97, medio: 1.27, max: 1.27, desc: 'Risco e Imprevistos' },
  df: { min: 0.59, medio: 1.23, max: 1.39, desc: 'Despesas Financeiras' },
  l: { min: 6.16, medio: 7.40, max: 8.96, desc: 'Lucro Operacional' },
  tributosPadrao: {
    pis: 0.65,
    cofins: 3.00,
    iss: 5.00, // varia de 2% a 5% conforme município
    cprb: 4.50, // se desonerado
  },
  bdiReferencia: {
    min: 20.34,
    medio: 22.12,
    max: 25.00,
  }
};
