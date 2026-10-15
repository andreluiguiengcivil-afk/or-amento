import { ProjetoOrcamento } from '../types/orcamento';
import { BANCO_SINAPI } from './sinapiDatabase';

// Localizador rápido por código
const getComposicao = (cod: string) => BANCO_SINAPI.find(c => c.codigo.includes(cod)) || BANCO_SINAPI[0];

export const PROJETO_PADRAO: ProjetoOrcamento = {
  id: 'proj-001',
  nome: 'Residência Unifamiliar Alto Padrão - 165 m²',
  cliente: 'Dr. Roberto Mendes & Família',
  responsavelTecnico: 'Eng. Civil André Luigui',
  creaCau: 'CREA-SP 5070891234/D',
  local: 'Condomínio Residencial Bougainville, Lote 14, Quadra B - São Paulo/SP',
  dataBase: 'SINAPI 2025/01 - SP (Não Desonerado)',
  areaConstruidaM2: 165.0,
  prazoMeses: 6,
  bdiConfig: {
    ac: 4.00,  // Administração Central
    sg: 0.80,  // Seguro e Garantia
    r: 1.27,   // Risco e Imprevistos
    df: 1.23,  // Despesas Financeiras
    l: 7.40,   // Lucro Líquido Operacional
    pis: 0.65, // PIS
    cofins: 3.00, // COFINS
    iss: 4.00, // ISS municipal
    cprb: 4.50, // CPRB se desonerado
    desonerado: false,
    encargosSociaisHora: 114.78,
    encargosSociaisMes: 71.05
  },
  etapas: [
    {
      id: 'etapa-1',
      numero: 1,
      nome: '1. SERVIÇOS PRELIMINARES E CANTEIRO',
      itens: [
        {
          id: 'item-1-1',
          itemNumero: '1.1',
          codigo: 'SINAPI 98459',
          descricao: 'Tapume com chapa compensada resinada e pontaletes de pinus h=2,20 m',
          unidade: 'm²',
          quantidade: 55.0,
          custoUnitario: 65.20,
          composicao: getComposicao('98459')
        },
        {
          id: 'item-1-2',
          itemNumero: '1.2',
          codigo: 'SINAPI 98458',
          descricao: 'Locação convencional de obra com gabarito de tábuas corridas',
          unidade: 'm',
          quantidade: 62.0,
          custoUnitario: 33.30,
          composicao: getComposicao('98458')
        },
        {
          id: 'item-1-3',
          itemNumero: '1.3',
          codigo: 'SINAPI 98460',
          descricao: 'Placa de obra com chapa galvanizada e identificação CREA/Responsável',
          unidade: 'm²',
          quantidade: 2.4,
          custoUnitario: 230.00,
          composicao: getComposicao('98460')
        }
      ]
    },
    {
      id: 'etapa-2',
      numero: 2,
      nome: '2. MOVIMENTO DE TERRA E FUNDAÇÕES',
      itens: [
        {
          id: 'item-2-1',
          itemNumero: '2.1',
          codigo: 'SINAPI 93358',
          descricao: 'Escavação manual de valas para baldrames e sapatas (prof. até 1,50 m)',
          unidade: 'm³',
          quantidade: 28.5,
          custoUnitario: 68.06,
          composicao: getComposicao('93358')
        },
        {
          id: 'item-2-2',
          itemNumero: '2.2',
          codigo: 'SINAPI 96523',
          descricao: 'Lastro de concreto magro espessura 5 cm para fundo de vigas baldrames',
          unidade: 'm²',
          quantidade: 42.0,
          custoUnitario: 35.40,
          composicao: getComposicao('96523')
        },
        {
          id: 'item-2-3',
          itemNumero: '2.3',
          codigo: 'SINAPI 93382',
          descricao: 'Reaterro manual apiloado em camadas de 20 cm',
          unidade: 'm³',
          quantidade: 18.0,
          custoUnitario: 38.29,
          composicao: getComposicao('93382')
        }
      ]
    },
    {
      id: 'etapa-3',
      numero: 3,
      nome: '3. ESTRUTURA EM CONCRETO ARMADO',
      itens: [
        {
          id: 'item-3-1',
          itemNumero: '3.1',
          codigo: 'SINAPI 92434',
          descricao: 'Fôrmas para pilares retangulares em chapa compensada resinada 12 mm',
          unidade: 'm²',
          quantidade: 98.0,
          custoUnitario: 96.30,
          composicao: getComposicao('92434')
        },
        {
          id: 'item-3-2',
          itemNumero: '3.2',
          codigo: 'SINAPI 92440',
          descricao: 'Fôrmas e escoramento metálico para vigas e lajes',
          unidade: 'm²',
          quantidade: 145.0,
          custoUnitario: 101.10,
          composicao: getComposicao('92440')
        },
        {
          id: 'item-3-3',
          itemNumero: '3.3',
          codigo: 'SINAPI 92762',
          descricao: 'Armação de vigas e pilares em aço CA-50 de 10,0 mm cortado e dobrado',
          unidade: 'kg',
          quantidade: 2450.0,
          custoUnitario: 12.30,
          composicao: getComposicao('92762')
        },
        {
          id: 'item-3-4',
          itemNumero: '3.4',
          codigo: 'SINAPI 92761',
          descricao: 'Armação de estribos em aço CA-60 de 5,0 mm',
          unidade: 'kg',
          quantidade: 820.0,
          custoUnitario: 13.00,
          composicao: getComposicao('92761')
        },
        {
          id: 'item-3-5',
          itemNumero: '3.5',
          codigo: 'SINAPI 103672',
          descricao: 'Concreto usinado bombeável fck 25 MPa lançado e adensado',
          unidade: 'm³',
          quantidade: 34.0,
          custoUnitario: 598.50,
          composicao: getComposicao('103672')
        }
      ]
    },
    {
      id: 'etapa-4',
      numero: 4,
      nome: '4. ALVENARIAS E VEDAÇÕES',
      itens: [
        {
          id: 'item-4-1',
          itemNumero: '4.1',
          codigo: 'SINAPI 89907',
          descricao: 'Alvenaria de vedação com bloco cerâmico 9x19x19 cm e argamassa 1:2:8',
          unidade: 'm²',
          quantidade: 280.0,
          custoUnitario: 64.00,
          composicao: getComposicao('89907')
        },
        {
          id: 'item-4-2',
          itemNumero: '4.2',
          codigo: 'SINAPI 93184',
          descricao: 'Vergas e contravergas pré-moldadas de concreto armado para vãos',
          unidade: 'm',
          quantidade: 36.0,
          custoUnitario: 36.50,
          composicao: getComposicao('93184')
        }
      ]
    },
    {
      id: 'etapa-5',
      numero: 5,
      nome: '5. COBERTURA E TELHADO',
      itens: [
        {
          id: 'item-5-1',
          itemNumero: '5.1',
          codigo: 'SINAPI 94210',
          descricao: 'Estrutura de madeira serrada com tesouras para telhado',
          unidade: 'm²',
          quantidade: 195.0,
          custoUnitario: 130.00,
          composicao: getComposicao('94210')
        },
        {
          id: 'item-5-2',
          itemNumero: '5.2',
          codigo: 'SINAPI 94215',
          descricao: 'Telhamento cerâmico tipo americana/portuguesa natural',
          unidade: 'm²',
          quantidade: 195.0,
          custoUnitario: 68.80,
          composicao: getComposicao('94215')
        },
        {
          id: 'item-5-3',
          itemNumero: '5.3',
          codigo: 'SINAPI 94228',
          descricao: 'Rufos e pingadeiras em chapa de aço galvanizado 24 com vedação PU',
          unidade: 'm',
          quantidade: 48.0,
          custoUnitario: 43.70,
          composicao: getComposicao('94228')
        }
      ]
    },
    {
      id: 'etapa-6',
      numero: 6,
      nome: '6. REVESTIMENTOS, PISOS E RODAPÉS',
      itens: [
        {
          id: 'item-6-1',
          itemNumero: '6.1',
          codigo: 'SINAPI 87878',
          descricao: 'Chapisco traço 1:3 manual em alvenarias e tetos',
          unidade: 'm²',
          quantidade: 560.0,
          custoUnitario: 8.20,
          composicao: getComposicao('87878')
        },
        {
          id: 'item-6-2',
          itemNumero: '6.2',
          codigo: 'SINAPI 87529',
          descricao: 'Massa única (emboço/reboco) traço 1:2:8 espessura 20 mm',
          unidade: 'm²',
          quantidade: 560.0,
          custoUnitario: 34.00,
          composicao: getComposicao('87529')
        },
        {
          id: 'item-6-3',
          itemNumero: '6.3',
          codigo: 'SINAPI 87620',
          descricao: 'Contrapiso regularizado em argamassa traço 1:4 espessura 3,0 cm',
          unidade: 'm²',
          quantidade: 165.0,
          custoUnitario: 34.50,
          composicao: getComposicao('87620')
        },
        {
          id: 'item-6-4',
          itemNumero: '6.4',
          codigo: 'SINAPI 98689',
          descricao: 'Piso em porcelanato retificado 60x60 cm acetinado com argamassa AC-III',
          unidade: 'm²',
          quantidade: 150.0,
          custoUnitario: 112.70,
          composicao: getComposicao('98689')
        },
        {
          id: 'item-6-5',
          itemNumero: '6.5',
          codigo: 'SINAPI 98692',
          descricao: 'Rodapé de porcelanato h = 8 cm assentado',
          unidade: 'm',
          quantidade: 125.0,
          custoUnitario: 19.70,
          composicao: getComposicao('98692')
        }
      ]
    },
    {
      id: 'etapa-7',
      numero: 7,
      nome: '7. INSTALAÇÕES ELÉTRICAS E HIDROSSANITÁRIAS',
      itens: [
        {
          id: 'item-7-1',
          itemNumero: '7.1',
          codigo: 'SINAPI 91926',
          descricao: 'Ponto de luz no teto ou tomada de uso geral com fiação 2,5 mm²',
          unidade: 'pt',
          quantidade: 74.0,
          custoUnitario: 100.00,
          composicao: getComposicao('91926')
        },
        {
          id: 'item-7-2',
          itemNumero: '7.2',
          codigo: 'SINAPI 101878',
          descricao: 'Quadro de distribuição de embutir 18 circuitos com barramento e disjuntores DIN',
          unidade: 'un',
          quantidade: 1.0,
          custoUnitario: 650.00,
          composicao: getComposicao('101878')
        },
        {
          id: 'item-7-3',
          itemNumero: '7.3',
          codigo: 'SINAPI 89961',
          descricao: 'Ponto de água fria em PVC soldável 25 mm embutido em alvenaria',
          unidade: 'pt',
          quantidade: 18.0,
          custoUnitario: 93.00,
          composicao: getComposicao('89961')
        },
        {
          id: 'item-7-4',
          itemNumero: '7.4',
          codigo: 'SINAPI 89957',
          descricao: 'Ponto de esgoto secundário e primário até caixa sifonada',
          unidade: 'pt',
          quantidade: 14.0,
          custoUnitario: 147.00,
          composicao: getComposicao('89957')
        }
      ]
    },
    {
      id: 'etapa-8',
      numero: 8,
      nome: '8. ESQUADRIAS E VIDROS',
      itens: [
        {
          id: 'item-8-1',
          itemNumero: '8.1',
          codigo: 'SINAPI 91341',
          descricao: 'Porta de madeira pronta 80x210 cm completa com marcos e fechadura',
          unidade: 'un',
          quantidade: 9.0,
          custoUnitario: 545.00,
          composicao: getComposicao('91341')
        },
        {
          id: 'item-8-2',
          itemNumero: '8.2',
          codigo: 'SINAPI 94569',
          descricao: 'Janelas em alumínio anodizado preto linha suprema com vidro 4 mm',
          unidade: 'm²',
          quantidade: 18.5,
          custoUnitario: 515.00,
          composicao: getComposicao('94569')
        }
      ]
    },
    {
      id: 'etapa-9',
      numero: 9,
      nome: '9. PINTURA GERAL',
      itens: [
        {
          id: 'item-9-1',
          itemNumero: '9.1',
          codigo: 'SINAPI 88489',
          descricao: 'Massa acrílica/corrida duas demãos com lixamento em paredes internas e tetos',
          unidade: 'm²',
          quantidade: 480.0,
          custoUnitario: 21.40,
          composicao: getComposicao('88489')
        },
        {
          id: 'item-9-2',
          itemNumero: '9.2',
          codigo: 'SINAPI 88497',
          descricao: 'Pintura látex acrílico fosco premium duas demãos',
          unidade: 'm²',
          quantidade: 480.0,
          custoUnitario: 23.30,
          composicao: getComposicao('88497')
        }
      ]
    },
    {
      id: 'etapa-10',
      numero: 10,
      nome: '10. LOUÇAS, METAIS E LIMPEZA FINAL',
      itens: [
        {
          id: 'item-10-1',
          itemNumero: '10.1',
          codigo: 'SINAPI 95305',
          descricao: 'Bacia sanitária com caixa acoplada duo 3/6 L completa instalada',
          unidade: 'un',
          quantidade: 3.0,
          custoUnitario: 498.00,
          composicao: getComposicao('95305')
        },
        {
          id: 'item-10-2',
          itemNumero: '10.2',
          codigo: 'SINAPI 99814',
          descricao: 'Limpeza geral fina pós-obra para entrega das chaves',
          unidade: 'm²',
          quantidade: 165.0,
          custoUnitario: 7.30,
          composicao: getComposicao('99814')
        }
      ]
    }
  ],
  cronograma: {
    'etapa-1': [70, 30, 0, 0, 0, 0],
    'etapa-2': [80, 20, 0, 0, 0, 0],
    'etapa-3': [20, 60, 20, 0, 0, 0],
    'etapa-4': [0, 30, 60, 10, 0, 0],
    'etapa-5': [0, 0, 50, 50, 0, 0],
    'etapa-6': [0, 0, 20, 50, 30, 0],
    'etapa-7': [0, 15, 35, 30, 20, 0],
    'etapa-8': [0, 0, 0, 20, 60, 20],
    'etapa-9': [0, 0, 0, 0, 60, 40],
    'etapa-10': [0, 0, 0, 0, 20, 80]
  }
};
