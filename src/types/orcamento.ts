export type TipoInsumo = 'MATERIAL' | 'MAO_DE_OBRA' | 'EQUIPAMENTO' | 'SERVICO';

export interface Insumo {
  codigo: string;
  descricao: string;
  unidade: string;
  tipo: TipoInsumo;
  coeficiente: number;
  precoUnitario: number;
  custoTotal: number;
}

export interface ComposicaoPreco {
  codigo: string;
  descricao: string;
  unidade: string;
  origem: 'SINAPI' | 'SICRO' | 'PROPRIA' | 'TCPO';
  insumos: Insumo[];
  custoMaterial: number;
  custoMaoDeObra: number;
  custoEquipamento: number;
  custoUnitarioDireto: number;
}

export interface ItemOrcamento {
  id: string;
  itemNumero: string; // ex: 1.1, 1.2, 2.1
  codigo: string; // ex: SINAPI 98459
  descricao: string;
  unidade: string; // m², m³, kg, un, vb, etc.
  quantidade: number;
  custoUnitario: number; // Custo direto unitário
  bdiPercentual?: number; // Override opcional ou padrão
  composicao?: ComposicaoPreco;
}

export interface EtapaOrcamento {
  id: string;
  numero: number;
  nome: string; // ex: "1. SERVIÇOS PRELIMINARES"
  itens: ItemOrcamento[];
}

export interface BDIConfig {
  ac: number; // Administração Central (%)
  sg: number; // Seguro e Garantia (%)
  r: number;  // Risco (%)
  df: number; // Despesas Financeiras (%)
  l: number;  // Lucro Bruto (%)
  pis: number; // PIS (%)
  cofins: number; // COFINS (%)
  iss: number; // ISS (%)
  cprb: number; // Contribuição Previdenciária sobre Receita Bruta / Desoneração (%)
  desonerado: boolean; // Se folha é desonerada ou não
  encargosSociaisHora: number; // % sobre hora (ex: 114.78% sem desoneração / 84.04% com desoneração)
  encargosSociaisMes: number; // % sobre mensalista (ex: 71.05% sem desoneração / 47.78% com desoneração)
}

export interface ProjetoOrcamento {
  id: string;
  nome: string;
  cliente: string;
  responsavelTecnico: string;
  creaCau: string;
  local: string;
  dataBase: string; // ex: "SINAPI 01/2025 Não Desonerado - SP"
  areaConstruidaM2: number;
  prazoMeses: number;
  etapas: EtapaOrcamento[];
  bdiConfig: BDIConfig;
  cronograma: {
    [etapaId: string]: number[]; // array com percentuais para cada mês (soma = 100%)
  };
}

export interface CurvaABCItem {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  quantidade: number;
  custoUnitario: number;
  custoTotal: number;
  percentual: number;
  percentualAcumulado: number;
  classe: 'A' | 'B' | 'C';
  tipo?: TipoInsumo | 'SERVICO';
}

export interface EnderecoFornecedor {
  logradouro: string;
  numero?: string;
  bairro?: string;
  cidade: string;
  uf: string;
  cep?: string;
}

export interface FornecedorReal {
  id: string;
  nome: string; // Ex: "Votorantim Cimentos S/A"
  contato: string; // Ex: "Carlos Eduardo" (responsável/vendedor)
  telefone: string; // Ex: "(11) 99876-5432"
  email: string; // Ex: "vendas@votorantim.com.br"
  endereco: EnderecoFornecedor;
  cnpj?: string; // Ex: "01.234.567/0001-89"
  categoriaPrincipal?: string; // Ex: "Cimentos & Agregados"
  observacoes?: string;
  dataCadastro: string;
}

export interface InsumoItem {
  id: string;
  codigo: string; // Código SINAPI, ex: "1379", "370", "4721", "88316"
  descricao: string;
  nome: string; // Sinônimo para compatibilidade com interfaces anteriores
  unidade: string;
  tipo: TipoInsumo;
  base: string; // "SINAPI" ou o Nome do Fornecedor Real (ex: "Votorantim Cimentos S/A")
  precoUnitario: number;
  fornecedor: string; // Sinônimo para base quando for fornecedor
  whatsappFornecedor: string; // Sinônimo para telefone/WhatsApp do fornecedor
  fornecedorId?: string; // Presente quando base !== 'SINAPI'
  fornecedorNome?: string;
  contatoFornecedor?: string;
  telefoneFornecedor?: string;
  emailFornecedor?: string;
  enderecoFornecedor?: string;
  prazoEntregaDias?: number;
  condicoesPagamento?: string;
  dataAtualizacao?: string;
  observacoes?: string;
}

export type InsumoProprio = InsumoItem;

export interface ItemIncidencia {
  id: string;
  codigo: string;
  nome: string;
  descricao: string;
  baseCalculo: 'MAO_DE_OBRA' | 'MATERIAL' | 'EQUIPAMENTO' | 'TOTAL_DIRETO';
  percentual: number; // ex: 5.0%
}

export interface ProducaoEquipeMecanica {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string; // ex: m³, m², t, km
  origem: 'SICRO' | 'DER' | 'DNIT' | 'PROPRIA';
  producaoHora: number; // Capacidade horária da equipe mecânica (ex: 45 m³/h)
  equipamentos: Insumo[];
  maoDeObra: Insumo[];
  custoHorarioTotal: number;
  custoUnitarioProducao: number;
}

export type StatusFornecedorCotacao = 'PENDENTE' | 'ENVIADO' | 'RESPONDIDO' | 'SELECIONADO';

export interface FornecedorCotacao {
  id: string;
  nomeFornecedor: string; // Ex: Votorantim, Gerdau, Loja do Construtor
  contatoVendedor?: string; // Nome do consultor ou vendedor
  whatsapp: string; // WhatsApp com DDD
  email?: string;
  precoInformado?: number; // Preço unitário respondido pelo fornecedor
  prazoEntregaDias?: number; // Prazo de entrega em dias
  condicoesPagamento?: string; // Ex: 28 DDL, À vista com 5% desc., Boleto faturado
  status: StatusFornecedorCotacao;
  dataEnvio?: string;
  dataResposta?: string;
  observacao?: string;
}

export interface CotacaoInsumo {
  id: string;
  titulo: string; // Ex: "Cotação de Cimento CP II para Fundações"
  insumoNome: string; // Ex: "Cimento Portland CP II-32 - Saco 50kg"
  insumoCodigo?: string; // Ex: "CIM-01"
  unidade: string; // Ex: "sc", "kg", "m²", "m³"
  quantidadeEstimada: number; // Ex: 250
  especificacaoTecnica?: string; // Ex: "Entrega no canteiro, paletizado, descarga inclusa"
  dataCriacao: string;
  status: 'EM_ANDAMENTO' | 'FINALIZADA' | 'CANCELADA';
  fornecedores: FornecedorCotacao[];
  fornecedorVencedorId?: string;
}

export interface InsumoGenerico {
  id: string;
  codigo: string; // Ex: GEN-CIM-01
  nome: string; // Ex: Cimento Portland CP II-32
  descricao?: string;
  unidade: string; // Ex: sc, kg, m³, m², un
  tipo: TipoInsumo; // 'MATERIAL' | 'MAO_DE_OBRA' | 'EQUIPAMENTO' | 'SERVICO'
  quantidadeEstimada: number; // Quantidade prevista na obra
  especificacaoTecnica?: string; // Especificação / marcas de referência
  dataCriacao: string;
  fornecedoresCotacao: FornecedorCotacao[];
  fornecedorVencedorId?: string;
  precoReferenciaEstimado?: number;
}

export interface ItemCotacaoFornecedor {
  insumoGenericoId: string;
  insumoCodigo: string;
  insumoNome: string;
  unidade: string;
  quantidade: number;
  especificacaoTecnica?: string;
  precoInformado?: number;
  prazoEntregaDias?: number;
  condicoesPagamento?: string;
  status: StatusFornecedorCotacao;
  fornecedorCotacaoId: string;
}

export interface CotacaoAgrupadaPorFornecedor {
  fornecedorNome: string;
  whatsapp: string;
  contatoVendedor?: string;
  email?: string;
  itens: ItemCotacaoFornecedor[];
  totalItens: number;
  totalRespondidos: number;
  valorTotalEstimado: number;
  statusGeral: 'PENDENTE' | 'ENVIADO' | 'RESPONDIDO_PARCIAL' | 'RESPONDIDO_TOTAL';
  dataUltimoEnvio?: string;
}

