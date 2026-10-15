import React, { useState } from 'react';
import { 
  DollarSign, 
  Building2, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingDown, 
  TrendingUp, 
  Check, 
  Calendar, 
  Phone, 
  Mail, 
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Filter
} from 'lucide-react';
import { FornecedorReal, InsumoItem } from '../types/orcamento';
import { formatarMoeda } from '../utils/bdiCalculator';

interface PrecosFornecedoresViewProps {
  fornecedores: FornecedorReal[];
  insumos: InsumoItem[];
  fornecedorPreSelecionadoId?: string | null;
  onSalvarPrecoFornecedor: (novoInsumo: InsumoItem) => void;
  onExcluirInsumoFornecedor: (id: string) => void;
  onIrParaFornecedores: () => void;
}

export const PrecosFornecedoresView: React.FC<PrecosFornecedoresViewProps> = ({
  fornecedores,
  insumos,
  fornecedorPreSelecionadoId,
  onSalvarPrecoFornecedor,
  onExcluirInsumoFornecedor,
  onIrParaFornecedores
}) => {
  // Lista de Insumos Oficiais SINAPI (onde base === 'SINAPI')
  const insumosSinapi = insumos.filter(i => i.base === 'SINAPI');
  
  // Lista de Insumos com Base de Fornecedor Real (onde base !== 'SINAPI')
  const insumosFornecedores = insumos.filter(i => i.base !== 'SINAPI');

  // Estados de Filtro da Tabela
  const [buscaTabela, setBuscaTabela] = useState('');
  const [filtroFornecedorTabela, setFiltroFornecedorTabela] = useState<string>('TODOS');
  const [filtroEconomia, setFiltroEconomia] = useState<'TODOS' | 'MAIS_BARATO' | 'MAIS_CARO'>('TODOS');

  // Estados do Formulário de Preço
  const [fornecedorId, setFornecedorId] = useState<string>(
    fornecedorPreSelecionadoId || (fornecedores[0]?.id || '')
  );
  const [sinapiCodigoSelecionado, setSinapiCodigoSelecionado] = useState<string>('');
  const [buscaInsumoSinapi, setBuscaInsumoSinapi] = useState('');
  const [precoDigitado, setPrecoDigitado] = useState('');
  const [prazoDias, setPrazoDias] = useState('3');
  const [condicoesPagamento, setCondicoesPagamento] = useState('28 DDL');
  const [observacoes, setObservacoes] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Edição rápida inline
  const [itemEmEdicaoId, setItemEmEdicaoId] = useState<string | null>(null);
  const [precoInline, setPrecoInline] = useState('');

  // Fornecedor Selecionado no formulário
  const fornecedorSelecionado = fornecedores.find(f => f.id === fornecedorId);

  // Insumo SINAPI Selecionado no formulário
  const insumoSinapiSelecionado = insumosSinapi.find(i => i.codigo === sinapiCodigoSelecionado);

  // Cálculos de variação no formulário
  const precoNum = parseFloat(precoDigitado.replace(',', '.')) || 0;
  const precoSinapiRef = insumoSinapiSelecionado?.precoUnitario || 0;
  const diferencaValor = precoNum > 0 ? precoNum - precoSinapiRef : 0;
  const diferencaPerc = precoSinapiRef > 0 && precoNum > 0 ? ((precoNum - precoSinapiRef) / precoSinapiRef) * 100 : 0;

  // Filtrar Insumos SINAPI para seleção
  const insumosSinapiFiltrados = insumosSinapi.filter(i => 
    i.descricao.toLowerCase().includes(buscaInsumoSinapi.toLowerCase()) ||
    i.codigo.toLowerCase().includes(buscaInsumoSinapi.toLowerCase())
  ).slice(0, 10);

  const handleSalvarPreco = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fornecedorSelecionado) {
      alert('Selecione um fornecedor cadastrado.');
      return;
    }
    if (!insumoSinapiSelecionado) {
      alert('Selecione o insumo SINAPI para o qual deseja registrar o preço.');
      return;
    }
    if (!precoNum || precoNum <= 0) {
      alert('Informe o preço unitário praticado por este fornecedor.');
      return;
    }

    // Regra do Usuário:
    // "Quando o fornecedor for cadastrado, haverá a criação de uma novo insumo,
    // com o mesmo código do sinapi, mas com bases diferentes. No sinapi, o item base
    // deve ser escrito SINAPI, nos fornecedores deve aparecer o nome do fornecedor."
    const novoInsumo: InsumoItem = {
      id: `ins-forn-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      codigo: insumoSinapiSelecionado.codigo, // MESMO CÓDIGO DO SINAPI!
      descricao: insumoSinapiSelecionado.descricao,
      nome: insumoSinapiSelecionado.descricao,
      unidade: insumoSinapiSelecionado.unidade,
      tipo: insumoSinapiSelecionado.tipo,
      base: fornecedorSelecionado.nome, // NOME DO FORNECEDOR COMO BASE!
      fornecedor: fornecedorSelecionado.nome,
      whatsappFornecedor: fornecedorSelecionado.telefone || '',
      precoUnitario: precoNum,
      fornecedorId: fornecedorSelecionado.id,
      fornecedorNome: fornecedorSelecionado.nome,
      contatoFornecedor: fornecedorSelecionado.contato,
      telefoneFornecedor: fornecedorSelecionado.telefone,
      emailFornecedor: fornecedorSelecionado.email,
      enderecoFornecedor: `${fornecedorSelecionado.endereco.logradouro}, ${fornecedorSelecionado.endereco.numero || ''} - ${fornecedorSelecionado.endereco.cidade}/${fornecedorSelecionado.endereco.uf}`,
      prazoEntregaDias: parseInt(prazoDias) || 3,
      condicoesPagamento: condicoesPagamento.trim(),
      observacoes: observacoes.trim(),
      dataAtualizacao: new Date().toISOString().split('T')[0]
    };

    onSalvarPrecoFornecedor(novoInsumo);
    setFeedback(`Preço cadastrado com sucesso! Insumo [${novoInsumo.codigo}] com base "${novoInsumo.base}" criado por ${formatarMoeda(novoInsumo.precoUnitario)}.`);
    setTimeout(() => setFeedback(null), 3500);

    // Resetar formulário parcial
    setPrecoDigitado('');
    setSinapiCodigoSelecionado('');
    setBuscaInsumoSinapi('');
    setObservacoes('');
  };

  const handleSalvarEdicaoInline = (item: InsumoItem) => {
    const novoPreco = parseFloat(precoInline.replace(',', '.'));
    if (!novoPreco || novoPreco <= 0) {
      alert('Informe um preço válido.');
      return;
    }

    const atualizado: InsumoItem = {
      ...item,
      precoUnitario: novoPreco,
      dataAtualizacao: new Date().toISOString().split('T')[0]
    };

    onSalvarPrecoFornecedor(atualizado);
    setItemEmEdicaoId(null);
    setPrecoInline('');
  };

  // Filtragem da tabela de preços cadastrados
  const itensTabelaFiltrados = insumosFornecedores.filter(item => {
    const matchBusca = 
      item.descricao.toLowerCase().includes(buscaTabela.toLowerCase()) ||
      item.codigo.toLowerCase().includes(buscaTabela.toLowerCase()) ||
      item.base.toLowerCase().includes(buscaTabela.toLowerCase());

    const matchFornecedor = filtroFornecedorTabela === 'TODOS' || item.base === filtroFornecedorTabela;

    // Encontrar preço SINAPI correspondente
    const sinapiRef = insumosSinapi.find(s => s.codigo === item.codigo);
    const precoSinapi = sinapiRef ? sinapiRef.precoUnitario : 0;

    let matchEco = true;
    if (filtroEconomia === 'MAIS_BARATO' && precoSinapi > 0) {
      matchEco = item.precoUnitario < precoSinapi;
    } else if (filtroEconomia === 'MAIS_CARO' && precoSinapi > 0) {
      matchEco = item.precoUnitario > precoSinapi;
    }

    return matchBusca && matchFornecedor && matchEco;
  });

  return (
    <div className="space-y-6">
      
      {/* Banner Principal com a Lógica da Base */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <DollarSign className="w-6 h-6 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-white">
                  Cadastrar Preço de Fornecedor
                </h2>
                <span className="text-[10px] font-mono uppercase bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  Gestão Multi-Bases
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Regra ativa: no SINAPI a base é escrita <strong>SINAPI</strong>; nos fornecedores reais a base é escrita com o <strong>nome do fornecedor</strong>, mantendo o <strong>mesmo código do SINAPI</strong>.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onIrParaFornecedores}
            className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Gerenciar Fornecedores ({fornecedores.length})</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
          <span>{feedback}</span>
        </div>
      )}

      {/* FORMULÁRIO DE CADASTRO DE PREÇO */}
      <form onSubmit={handleSalvarPreco} className="bg-white border-2 border-amber-400 rounded-2xl p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
              Registrar Nova Cotação / Preço de Fornecedor
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Selecione o Fornecedor &rarr; Escolha o Insumo SINAPI &rarr; Digite o Preço
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* PASSO 1: ESCOLHER O FORNECEDOR */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
              <span>1. Fornecedor Real (Base do Novo Insumo) *</span>
              <button
                type="button"
                onClick={onIrParaFornecedores}
                className="text-[10px] text-amber-600 hover:underline font-bold"
              >
                + Novo Fornecedor
              </button>
            </label>
            <select
              required
              value={fornecedorId}
              onChange={(e) => setFornecedorId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
            >
              {fornecedores.map(f => (
                <option key={f.id} value={f.id}>
                  {f.nome} ({f.endereco.cidade}/{f.endereco.uf})
                </option>
              ))}
            </select>

            {fornecedorSelecionado && (
              <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-0.5">
                <span className="font-bold text-slate-800 block">{fornecedorSelecionado.nome}</span>
                <span className="block">Contato: {fornecedorSelecionado.contato} | Tel: {fornecedorSelecionado.telefone}</span>
                <span className="text-[10px] text-slate-500 block truncate">{fornecedorSelecionado.email}</span>
              </div>
            )}
          </div>

          {/* PASSO 2: ESCOLHER O INSUMO SINAPI */}
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              2. Selecionar Insumo Oficial do SINAPI (pelo Código ou Descrição) *
            </label>
            
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquise o insumo SINAPI (ex: 1379, cimento, areia, brita, aço, servente)..."
                  value={buscaInsumoSinapi}
                  onChange={(e) => setBuscaInsumoSinapi(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                />
              </div>

              {/* Sugestões rápidas de Insumos SINAPI */}
              {buscaInsumoSinapi && (
                <div className="max-h-40 overflow-y-auto border border-amber-300 rounded-xl bg-white shadow-lg p-1 space-y-1">
                  {insumosSinapiFiltrados.length === 0 ? (
                    <div className="p-2 text-center text-xs text-slate-500">
                      Nenhum insumo SINAPI encontrado com esse termo.
                    </div>
                  ) : (
                    insumosSinapiFiltrados.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSinapiCodigoSelecionado(item.codigo);
                          setBuscaInsumoSinapi('');
                        }}
                        className={`p-2 rounded-lg cursor-pointer flex items-center justify-between text-xs transition ${
                          sinapiCodigoSelecionado === item.codigo
                            ? 'bg-amber-100 text-amber-950 font-bold'
                            : 'hover:bg-slate-100 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded text-[10px]">
                            SINAPI {item.codigo}
                          </span>
                          <span className="font-medium truncate max-w-md">{item.descricao}</span>
                        </div>
                        <span className="font-mono font-bold whitespace-nowrap text-slate-600">
                          {formatarMoeda(item.precoUnitario)} / {item.unidade}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Insumo SINAPI Selecionado */}
              {insumoSinapiSelecionado ? (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between gap-3 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 bg-amber-500 text-slate-950 font-black font-mono rounded-lg text-xs">
                      SINAPI {insumoSinapiSelecionado.codigo}
                    </span>
                    <div>
                      <span className="font-bold text-xs text-slate-900 block leading-tight">
                        {insumoSinapiSelecionado.descricao}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Unidade: <strong className="text-slate-800">{insumoSinapiSelecionado.unidade}</strong> | Base Oficial: <strong className="text-blue-700">SINAPI</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Preço Base SINAPI</span>
                    <span className="text-sm font-black text-slate-900 font-mono">
                      {formatarMoeda(insumoSinapiSelecionado.precoUnitario)} / {insumoSinapiSelecionado.unidade}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center text-xs text-slate-500">
                  Digite na busca acima para escolher o insumo oficial SINAPI a ser cotado.
                </div>
              )}
            </div>
          </div>

        </div>

        {/* PASSO 3: DIGITAR O PREÇO E CONDIÇÕES */}
        {insumoSinapiSelecionado && fornecedorSelecionado && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-4 animate-fade-in text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>3. Preço e Condições Comerciais deste Fornecedor</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                Base resultante: "{fornecedorSelecionado.nome}"
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Preço Praticado pelo Fornecedor (R$ por {insumoSinapiSelecionado.unidade}) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">R$</span>
                  <input
                    type="text"
                    required
                    placeholder="0,00"
                    value={precoDigitado}
                    onChange={(e) => setPrecoDigitado(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-base font-black font-mono text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Prazo de Entrega no Canteiro
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    value={prazoDias}
                    onChange={(e) => setPrazoDias(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    dias úteis
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Condições de Pagamento
                </label>
                <input
                  type="text"
                  value={condicoesPagamento}
                  onChange={(e) => setCondicoesPagamento(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
                  placeholder="Ex: 28 DDL / À vista com 3% desc."
                />
              </div>
            </div>

            {/* COMPARATIVO EM TEMPO REAL */}
            {precoNum > 0 && (
              <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                diferencaValor < 0 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                  : diferencaValor > 0 
                  ? 'bg-amber-50 border-amber-200 text-amber-950' 
                  : 'bg-slate-100 border-slate-200 text-slate-800'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black ${
                    diferencaValor < 0 ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'
                  }`}>
                    {diferencaValor < 0 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="font-bold text-xs block">
                      {diferencaValor < 0 ? 'Economia em relação ao SINAPI' : diferencaValor > 0 ? 'Preço superior ao SINAPI' : 'Preço idêntico'}
                    </span>
                    <span className="text-[11px] text-slate-600">
                      SINAPI: {formatarMoeda(precoSinapiRef)} &rarr; Fornecedor: {formatarMoeda(precoNum)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-sm font-black font-mono block ${
                    diferencaValor < 0 ? 'text-emerald-700' : 'text-amber-700'
                  }`}>
                    {diferencaValor < 0 ? '-' : '+'}{formatarMoeda(Math.abs(diferencaValor))} ({diferencaPerc > 0 ? '+' : ''}{diferencaPerc.toFixed(1)}%)
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Por {insumoSinapiSelecionado.unidade}</span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Observações Comerciais (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Cotação válida por 15 dias, entrega paletizada com munk..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium"
              />
            </div>
          </div>
        )}

        {/* BOTÃO DE CONFIRMAR CADASTRO */}
        <div className="flex justify-end pt-3 border-t border-slate-200">
          <button
            type="submit"
            disabled={!insumoSinapiSelecionado || !fornecedorSelecionado || !precoNum || precoNum <= 0}
            className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Gravar Preço & Criar Insumo com Base "{fornecedorSelecionado ? fornecedorSelecionado.nome : 'Fornecedor'}"</span>
          </button>
        </div>
      </form>

      {/* TABELA DE PREÇOS CADASTRADOS POR FORNECEDORES */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden space-y-4 p-5">
        
        {/* Header da Tabela com Filtros */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                Tabela de Insumos com Base de Fornecedores Reais ({insumosFornecedores.length})
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Insumos gerados a partir do código SINAPI com base gravada com o nome de cada fornecedor real.
            </p>
          </div>

          {/* Filtros da Tabela */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filtrar tabela..."
                value={buscaTabela}
                onChange={(e) => setBuscaTabela(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>

            <select
              value={filtroFornecedorTabela}
              onChange={(e) => setFiltroFornecedorTabela(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
            >
              <option value="TODOS">Todos os Fornecedores</option>
              {fornecedores.map(f => (
                <option key={f.id} value={f.nome}>{f.nome}</option>
              ))}
            </select>

            <select
              value={filtroEconomia}
              onChange={(e) => setFiltroEconomia(e.target.value as any)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
            >
              <option value="TODOS">Todas as Variações</option>
              <option value="MAIS_BARATO">&darr; Mais Barato que SINAPI</option>
              <option value="MAIS_CARO">&uarr; Mais Caro que SINAPI</option>
            </select>
          </div>
        </div>

        {/* Tabela de Preços */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <th className="py-2.5 px-3">Cód. SINAPI</th>
                <th className="py-2.5 px-3">Descrição do Insumo</th>
                <th className="py-2.5 px-3">Unid.</th>
                <th className="py-2.5 px-3">Base (Fornecedor Real)</th>
                <th className="py-2.5 px-3 text-right">Preço Fornecedor</th>
                <th className="py-2.5 px-3 text-right">Preço SINAPI</th>
                <th className="py-2.5 px-3 text-right">Variação vs SINAPI</th>
                <th className="py-2.5 px-3">Prazo / Pagto</th>
                <th className="py-2.5 px-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {itensTabelaFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 text-xs">
                    Nenhum preço de fornecedor encontrado com os filtros selecionados.
                  </td>
                </tr>
              ) : (
                itensTabelaFiltrados.map((item) => {
                  const sinapiRef = insumosSinapi.find(s => s.codigo === item.codigo);
                  const precoSinapi = sinapiRef ? sinapiRef.precoUnitario : 0;
                  const delta = precoSinapi > 0 ? item.precoUnitario - precoSinapi : 0;
                  const deltaPerc = precoSinapi > 0 ? ((item.precoUnitario - precoSinapi) / precoSinapi) * 100 : 0;
                  const isEditing = itemEmEdicaoId === item.id;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 rounded border border-amber-300 text-[11px]">
                          {item.codigo}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-medium text-slate-900 max-w-xs">
                        <span className="block truncate" title={item.descricao}>{item.descricao}</span>
                        {item.observacoes && (
                          <span className="text-[10px] text-slate-400 block truncate italic">
                            "{item.observacoes}"
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 font-mono text-slate-600 uppercase">
                        {item.unidade}
                      </td>

                      <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full bg-slate-900 text-amber-400 font-mono text-[11px] border border-slate-700">
                          {item.base}
                        </span>
                      </td>

                      {/* Preço do Fornecedor (com Edição Rápida) */}
                      <td className="py-2.5 px-3 text-right font-mono font-black text-slate-900 whitespace-nowrap">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="text"
                              value={precoInline}
                              onChange={(e) => setPrecoInline(e.target.value)}
                              className="w-20 px-2 py-1 bg-white border border-amber-400 rounded text-right font-mono text-xs"
                              autoFocus
                            />
                            <button
                              type="button"
                              onClick={() => handleSalvarEdicaoInline(item)}
                              className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-500 cursor-pointer"
                              title="Salvar"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-emerald-700">
                            {formatarMoeda(item.precoUnitario)}
                          </span>
                        )}
                      </td>

                      {/* Preço Base SINAPI */}
                      <td className="py-2.5 px-3 text-right font-mono text-slate-500 whitespace-nowrap">
                        {precoSinapi > 0 ? formatarMoeda(precoSinapi) : '-'}
                      </td>

                      {/* Variação vs SINAPI */}
                      <td className="py-2.5 px-3 text-right whitespace-nowrap">
                        {precoSinapi > 0 ? (
                          <span className={`inline-flex items-center gap-0.5 font-mono font-bold text-[11px] px-1.5 py-0.2 rounded ${
                            delta < 0 ? 'bg-emerald-100 text-emerald-800' : delta > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {delta < 0 ? <TrendingDown className="w-3 h-3 text-emerald-600" /> : <TrendingUp className="w-3 h-3 text-amber-600" />}
                            {deltaPerc > 0 ? '+' : ''}{deltaPerc.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      {/* Prazo e Pagamento */}
                      <td className="py-2.5 px-3 text-[11px] text-slate-600 whitespace-nowrap">
                        <span>{item.prazoEntregaDias || 3}d | {item.condicoesPagamento || '28 DDL'}</span>
                      </td>

                      {/* Ações */}
                      <td className="py-2.5 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setItemEmEdicaoId(item.id);
                              setPrecoInline(item.precoUnitario.toString());
                            }}
                            className="p-1 rounded text-slate-400 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                            title="Editar Preço"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {item.telefoneFornecedor && (
                            <a
                              href={`https://wa.me/55${item.telefoneFornecedor.replace(/\D/g, '')}?text=Ol%C3%A1%2C%20gostaria%20de%20confirmar%20o%20valor%20cotado%20do%20item%20${encodeURIComponent(item.descricao)}%20(R%24%20${item.precoUnitario.toFixed(2)})`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 rounded text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                              title="Conversar no WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Excluir preço do fornecedor "${item.base}" para o insumo ${item.codigo}?`)) {
                                onExcluirInsumoFornecedor(item.id);
                              }
                            }}
                            className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
