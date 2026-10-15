import { FornecedorReal, InsumoItem, TipoInsumo } from '../types/orcamento';

export const FORNECEDORES_INICIAIS: FornecedorReal[] = [
  {
    id: 'forn-01',
    nome: 'Votorantim Cimentos S/A',
    contato: 'Carlos Eduardo Mendes',
    telefone: '(11) 99876-5432',
    email: 'vendas.sp@votorantim.com.br',
    endereco: {
      logradouro: 'Av. das Indústrias',
      numero: '1500',
      bairro: 'Distrito Industrial',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '04578-000'
    },
    cnpj: '01.637.895/0001-32',
    categoriaPrincipal: 'Cimento, Cal & Agregados',
    observacoes: 'Faturamento mínimo R$ 2.000,00. Prazo padrão 28 DDL com aprovação de crédito.',
    dataCadastro: '2025-01-10'
  },
  {
    id: 'forn-02',
    nome: 'Gerdau Aços Brasil S/A',
    contato: 'Mariana Silveira',
    telefone: '(11) 98765-4321',
    email: 'comercial.sp@gerdau.com',
    endereco: {
      logradouro: 'Rodovia Raposo Tavares',
      numero: 'km 23',
      bairro: 'Granja Viana',
      cidade: 'Cotia',
      uf: 'SP',
      cep: '06709-015'
    },
    cnpj: '33.611.500/0001-19',
    categoriaPrincipal: 'Aço CA-50, CA-60 & Telas Soldadas',
    observacoes: 'Entrega com caminhão munk ou descarga no canteiro. Barra reta de 12m ou cortado/dobrado.',
    dataCadastro: '2025-01-12'
  },
  {
    id: 'forn-03',
    nome: 'Cerâmica São José Indústria e Comércio',
    contato: 'Roberto Guimarães',
    telefone: '(19) 99123-4567',
    email: 'contato@ceramicasaojose.ind.br',
    endereco: {
      logradouro: 'Estrada Municipal',
      numero: 'S/N',
      bairro: 'Olaria Central',
      cidade: 'Itu',
      uf: 'SP',
      cep: '13300-000'
    },
    cnpj: '45.123.789/0001-44',
    categoriaPrincipal: 'Blocos Cerâmicos & Tijolos',
    observacoes: 'Paletizado com filme stretch. Frete incluso para Grande SP em cargas fechadas.',
    dataCadastro: '2025-01-15'
  },
  {
    id: 'forn-04',
    nome: 'Madeireira & Compensados Progresso',
    contato: 'Fernando Alencar',
    telefone: '(11) 97654-3210',
    email: 'pedidos@madeireiraprogresso.com.br',
    endereco: {
      logradouro: 'Rua dos Pinheiros',
      numero: '420',
      bairro: 'Brás',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '03012-000'
    },
    cnpj: '56.987.432/0001-88',
    categoriaPrincipal: 'Madeiras, Pontaletes & Compensados',
    observacoes: 'Madeira de reflorestamento certificada FSC. Chapas resinadas e plastificadas.',
    dataCadastro: '2025-01-18'
  },
  {
    id: 'forn-05',
    nome: 'Tigre Tubos e Conexões S/A',
    contato: 'Juliana Costa',
    telefone: '(47) 99234-5678',
    email: 'atendimento.obras@tigre.com',
    endereco: {
      logradouro: 'Rua Gothard Kaesemodel',
      numero: '833',
      bairro: 'Anita Garibaldi',
      cidade: 'Joinville',
      uf: 'SC',
      cep: '89203-400'
    },
    cnpj: '84.684.454/0001-50',
    categoriaPrincipal: 'Tubos, Conexões & Hidráulica',
    observacoes: 'Linhas prediais de esgoto, água fria soldável, PPR termofusão e elétrica condutores.',
    dataCadastro: '2025-01-20'
  },
  {
    id: 'forn-06',
    nome: 'Suvinil Tintas (BASF S/A)',
    contato: 'Marcelo Pires',
    telefone: '(11) 98112-3344',
    email: 'obras.suvinil@basf.com',
    endereco: {
      logradouro: 'Av. Brigadeiro Faria Lima',
      numero: '3600',
      bairro: 'Itaim Bibi',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '04538-132'
    },
    cnpj: '48.539.407/0001-18',
    categoriaPrincipal: 'Tintas, Massas & Vernizes',
    observacoes: 'Fórmula anti-mofo, látex acrílico fosco e semi-brilho, selador acrílico.',
    dataCadastro: '2025-01-22'
  }
];

// Catálogo Mestre: Insumos oficiais do SINAPI (com base = "SINAPI")
const INSUMOS_SINAPI_BASE_RAW = [
  {
    id: 'sin-1379',
    codigo: '1379',
    descricao: 'CIMENTO PORTLAND COMPOSTO CP II-32',
    unidade: 'kg',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 0.72,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-370',
    codigo: '370',
    descricao: 'AREIA MEDIA - POSTO JAZIDA/FORNECEDOR (RETIRADO)',
    unidade: 'm³',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 110.00,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-4721',
    codigo: '4721',
    descricao: 'PEDRA BRITADA N. 2 (19 A 38 MM) POSTO PEDREIRA/FORNECEDOR',
    unidade: 'm³',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 95.00,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-4718',
    codigo: '4718',
    descricao: 'PEDRA BRITADA N. 1 (9,5 A 19 MM) POSTO PEDREIRA/FORNECEDOR',
    unidade: 'm³',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 98.00,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-337',
    codigo: '337',
    descricao: 'ACO CA-50, 10,0 MM, VERGALHAO',
    unidade: 'kg',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 7.80,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-336',
    codigo: '336',
    descricao: 'ACO CA-50, 8,0 MM, VERGALHAO',
    unidade: 'kg',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 7.95,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-338',
    codigo: '338',
    descricao: 'ACO CA-50, 12,5 MM, VERGALHAO',
    unidade: 'kg',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 7.65,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-343',
    codigo: '343',
    descricao: 'ACO CA-60, 5,0 MM, EM ROLO',
    unidade: 'kg',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 8.00,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-43132',
    codigo: '43132',
    descricao: 'ARAME RECOZIDO 16 BWG, D = 1,65 MM (0,016 KG/M)',
    unidade: 'kg',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 17.20,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-684',
    codigo: '684',
    descricao: 'BLOCO CERAMICO FURADO 9 X 19 X 19 CM (ALVENARIA DE VEDAÇÃO)',
    unidade: 'mil',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 950.00,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-685',
    codigo: '685',
    descricao: 'BLOCO CERAMICO FURADO 14 X 19 X 39 CM',
    unidade: 'un',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 2.80,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-4430',
    codigo: '4430',
    descricao: 'CHAPA COMPENSADO RESINADO 6MM (2,20 X 1,10 M)',
    unidade: 'm²',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 32.50,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-4431',
    codigo: '4431',
    descricao: 'CHAPA COMPENSADO RESINADO 12MM (3 REAPROVEITAMENTOS)',
    unidade: 'm²',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 68.00,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-4432',
    codigo: '4432',
    descricao: 'CHAPA COMPENSADO PLASTIFICADO 14MM',
    unidade: 'm²',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 95.00,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-4491',
    codigo: '4491',
    descricao: 'PONTALETE DE PINUS 7,5 X 7,5 CM NAO APARELHADO',
    unidade: 'm',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 8.80,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-4438',
    codigo: '4438',
    descricao: 'TABUA DE PINUS 2,5 X 15 CM NAO APARELHADA',
    unidade: 'm',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 11.20,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-5068',
    codigo: '5068',
    descricao: 'PREGO DE ACO POLIDO COM CABECA 18 X 27 (2 1/2 X 10)',
    unidade: 'kg',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 16.60,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-11145',
    codigo: '11145',
    descricao: 'CONCRETO USINADO BOMBEAVEL CLASSE C25, BRITA 1 E 2, SLUMP 10 +/- 2 CM',
    unidade: 'm³',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 450.00,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-7192',
    codigo: '7192',
    descricao: 'TELHA CERAMICA PORTUGUESA NATURAL',
    unidade: 'mil',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 2200.00,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-7356',
    codigo: '7356',
    descricao: 'TUBO PVC RIGIDO SOLDAVEL MARROM DN 25 MM (3/4)',
    unidade: 'm',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 6.80,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-7358',
    codigo: '7358',
    descricao: 'TUBO PVC ESGOTO SERIE NORMAL DN 100 MM (4 POL)',
    unidade: 'm',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 24.50,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-7348',
    codigo: '7348',
    descricao: 'TINTA LATEX ACRILICA PREMIUM COR BRANCA',
    unidade: 'l',
    tipo: 'MATERIAL',
    base: 'SINAPI',
    precoUnitario: 32.00,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-88309',
    codigo: '88309',
    descricao: 'PEDREIRO COM ENCARGOS COMPLEMENTARES',
    unidade: 'h',
    tipo: 'MAO_DE_OBRA',
    base: 'SINAPI',
    precoUnitario: 27.80,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-88316',
    codigo: '88316',
    descricao: 'SERVENTE COM ENCARGOS COMPLEMENTARES',
    unidade: 'h',
    tipo: 'MAO_DE_OBRA',
    base: 'SINAPI',
    precoUnitario: 21.27,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-88262',
    codigo: '88262',
    descricao: 'CARPINTEIRO DE FORMAS COM ENCARGOS COMPLEMENTARES',
    unidade: 'h',
    tipo: 'MAO_DE_OBRA',
    base: 'SINAPI',
    precoUnitario: 28.50,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-88245',
    codigo: '88245',
    descricao: 'ARMADOR COM ENCARGOS COMPLEMENTARES',
    unidade: 'h',
    tipo: 'MAO_DE_OBRA',
    base: 'SINAPI',
    precoUnitario: 26.50,
    dataAtualizacao: '2025-01-01'
  },
  {
    id: 'sin-88830',
    codigo: '88830',
    descricao: 'BETONEIRA CAPACIDADE 400 L - CHP DIURNO',
    unidade: 'h',
    tipo: 'EQUIPAMENTO',
    base: 'SINAPI',
    precoUnitario: 14.00,
    dataAtualizacao: '2025-01-01'
  }
];

// Exemplos iniciais de insumos com Fornecedores Reais vinculados
// Regra do usuário: Mesmo código do SINAPI, mas com base = Nome do Fornecedor!
const INSUMOS_FORNECEDORES_INICIAIS_RAW = [
  {
    id: 'forn-ins-01',
    codigo: '1379',
    descricao: 'CIMENTO PORTLAND COMPOSTO CP II-32',
    unidade: 'kg',
    tipo: 'MATERIAL' as const,
    base: 'Votorantim Cimentos S/A',
    precoUnitario: 0.68, // Cotação direta com desconto por volume
    fornecedorId: 'forn-01',
    fornecedorNome: 'Votorantim Cimentos S/A',
    contatoFornecedor: 'Carlos Eduardo Mendes',
    telefoneFornecedor: '(11) 99876-5432',
    emailFornecedor: 'vendas.sp@votorantim.com.br',
    enderecoFornecedor: 'Av. das Indústrias, 1500 - São Paulo/SP',
    prazoEntregaDias: 3,
    condicoesPagamento: '28 DDL faturado',
    dataAtualizacao: '2025-01-15',
    observacoes: 'Paletizado em saco de 50kg (R$ 34,00/saco). Descarga inclusa no canteiro.'
  },
  {
    id: 'forn-ins-02',
    codigo: '337',
    descricao: 'ACO CA-50, 10,0 MM, VERGALHAO',
    unidade: 'kg',
    tipo: 'MATERIAL' as const,
    base: 'Gerdau Aços Brasil S/A',
    precoUnitario: 7.35,
    fornecedorId: 'forn-02',
    fornecedorNome: 'Gerdau Aços Brasil S/A',
    contatoFornecedor: 'Mariana Silveira',
    telefoneFornecedor: '(11) 98765-4321',
    emailFornecedor: 'comercial.sp@gerdau.com',
    enderecoFornecedor: 'Rodovia Raposo Tavares, km 23 - Cotia/SP',
    prazoEntregaDias: 5,
    condicoesPagamento: '30 DDL',
    dataAtualizacao: '2025-01-18',
    observacoes: 'Barra reta de 12 metros. Carga amarrada com certificado de qualidade.'
  },
  {
    id: 'forn-ins-03',
    codigo: '684',
    descricao: 'BLOCO CERAMICO FURADO 9 X 19 X 19 CM (ALVENARIA DE VEDAÇÃO)',
    unidade: 'mil',
    tipo: 'MATERIAL' as const,
    base: 'Cerâmica São José Indústria e Comércio',
    precoUnitario: 890.00,
    fornecedorId: 'forn-03',
    fornecedorNome: 'Cerâmica São José Indústria e Comércio',
    contatoFornecedor: 'Roberto Guimarães',
    telefoneFornecedor: '(19) 99123-4567',
    emailFornecedor: 'contato@ceramicasaojose.ind.br',
    enderecoFornecedor: 'Estrada Municipal, S/N - Itu/SP',
    prazoEntregaDias: 4,
    condicoesPagamento: 'À vista com 3% desc. ou 21 DDL',
    dataAtualizacao: '2025-01-20',
    observacoes: 'Paletes com 600 peças. Índice de quebra garantido inferior a 1,5%.'
  },
  {
    id: 'forn-ins-04',
    codigo: '4431',
    descricao: 'CHAPA COMPENSADO RESINADO 12MM (3 REAPROVEITAMENTOS)',
    unidade: 'm²',
    tipo: 'MATERIAL' as const,
    base: 'Madeireira & Compensados Progresso',
    precoUnitario: 62.50,
    fornecedorId: 'forn-04',
    fornecedorNome: 'Madeireira & Compensados Progresso',
    contatoFornecedor: 'Fernando Alencar',
    telefoneFornecedor: '(11) 97654-3210',
    emailFornecedor: 'pedidos@madeireiraprogresso.com.br',
    enderecoFornecedor: 'Rua dos Pinheiros, 420 - São Paulo/SP',
    prazoEntregaDias: 2,
    condicoesPagamento: '28 DDL',
    dataAtualizacao: '2025-01-21',
    observacoes: 'Chapas 2,20 x 1,10m resinadas com bordas seladas.'
  },
  {
    id: 'forn-ins-05',
    codigo: '7348',
    descricao: 'TINTA LATEX ACRILICA PREMIUM COR BRANCA',
    unidade: 'l',
    tipo: 'MATERIAL' as const,
    base: 'Suvinil Tintas (BASF S/A)',
    precoUnitario: 29.50,
    fornecedorId: 'forn-06',
    fornecedorNome: 'Suvinil Tintas (BASF S/A)',
    contatoFornecedor: 'Marcelo Pires',
    telefoneFornecedor: '(11) 98112-3344',
    emailFornecedor: 'obras.suvinil@basf.com',
    enderecoFornecedor: 'Av. Brigadeiro Faria Lima, 3600 - São Paulo/SP',
    prazoEntregaDias: 3,
    condicoesPagamento: '30/60 DDL',
    dataAtualizacao: '2025-01-22',
    observacoes: 'Lata 18L por R$ 531,00. Rendimento até 500m² por demão.'
  }
];

// Exportação com os campos obrigatórios da interface InsumoItem
export const INSUMOS_SINAPI_BASE: InsumoItem[] = INSUMOS_SINAPI_BASE_RAW.map(item => ({
  ...item,
  tipo: item.tipo as TipoInsumo,
  nome: item.descricao,
  fornecedor: item.base,
  whatsappFornecedor: ''
}));

export const INSUMOS_FORNECEDORES_INICIAIS: InsumoItem[] = INSUMOS_FORNECEDORES_INICIAIS_RAW.map(item => ({
  ...item,
  tipo: item.tipo as TipoInsumo,
  nome: item.descricao,
  fornecedor: item.base,
  whatsappFornecedor: item.telefoneFornecedor || ''
}));

// Lista consolidada inicial: Insumos do SINAPI + Insumos de Fornecedores Reais
export const TODOS_INSUMOS_INICIAIS: InsumoItem[] = [
  ...INSUMOS_SINAPI_BASE,
  ...INSUMOS_FORNECEDORES_INICIAIS
];
