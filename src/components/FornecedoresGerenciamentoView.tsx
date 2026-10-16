import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  MessageCircle, 
  Check, 
  Package, 
  DollarSign, 
  FileText, 
  MapPinCheck,
  ShieldCheck,
  Filter,
  X,
  Layers,
  AlertCircle
} from 'lucide-react';
import { FornecedorReal, InsumoItem } from '../types/orcamento';
import { formatarMoeda } from '../utils/bdiCalculator';

interface FornecedoresGerenciamentoViewProps {
  fornecedores: FornecedorReal[];
  insumos: InsumoItem[];
  onAdicionarFornecedor: (fornecedor: FornecedorReal) => void;
  onAtualizarFornecedor: (fornecedor: FornecedorReal) => void;
  onExcluirFornecedor: (id: string) => void;
  onIrParaCadastrarPreco: (fornecedorId: string) => void;
  onExcluirInsumoFornecedor?: (id: string) => void;
  onExcluirMultiplosInsumosFornecedor?: (ids: string[]) => void;
}

export const FornecedoresGerenciamentoView: React.FC<FornecedoresGerenciamentoViewProps> = ({
  fornecedores,
  insumos,
  onAdicionarFornecedor,
  onAtualizarFornecedor,
  onExcluirFornecedor,
  onIrParaCadastrarPreco,
  onExcluirInsumoFornecedor,
  onExcluirMultiplosInsumosFornecedor
}) => {
  const [busca, setBusca] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('TODAS');
  const [exibirFormulario, setExibirFormulario] = useState(false);
  const [fornecedorEmEdicao, setFornecedorEmEdicao] = useState<FornecedorReal | null>(null);
  const [fornecedorInsumosModal, setFornecedorInsumosModal] = useState<FornecedorReal | null>(null);
  const [insumoIdExcluindo, setInsumoIdExcluindo] = useState<string | null>(null);
  const [confirmandoApagarTodos, setConfirmandoApagarTodos] = useState(false);

  // Estados do Formulário (Adicionar / Editar)
  const [nome, setNome] = useState('');
  const [contato, setContato] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('SP');
  const [cep, setCep] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [categoriaPrincipal, setCategoriaPrincipal] = useState('Cimento, Cal & Agregados');
  const [observacoes, setObservacoes] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const categorias = [
    'TODAS',
    'Cimento, Cal & Agregados',
    'Aço CA-50, CA-60 & Telas Soldadas',
    'Blocos Cerâmicos & Tijolos',
    'Madeiras, Pontaletes & Compensados',
    'Tubos, Conexões & Hidráulica',
    'Fios, Cabos & Elétrica',
    'Tintas, Massas & Vernizes',
    'Pisos, Revestimentos & Louças',
    'Locação de Equipamentos'
  ];

  const iniciarEdicao = (f: FornecedorReal) => {
    setFornecedorEmEdicao(f);
    setNome(f.nome);
    setContato(f.contato);
    setTelefone(f.telefone);
    setEmail(f.email);
    setLogradouro(f.endereco.logradouro || '');
    setNumero(f.endereco.numero || '');
    setBairro(f.endereco.bairro || '');
    setCidade(f.endereco.cidade || '');
    setUf(f.endereco.uf || 'SP');
    setCep(f.endereco.cep || '');
    setCnpj(f.cnpj || '');
    setCategoriaPrincipal(f.categoriaPrincipal || 'Cimento, Cal & Agregados');
    setObservacoes(f.observacoes || '');
    setExibirFormulario(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const limparFormulario = () => {
    setFornecedorEmEdicao(null);
    setNome('');
    setContato('');
    setTelefone('');
    setEmail('');
    setLogradouro('');
    setNumero('');
    setBairro('');
    setCidade('');
    setUf('SP');
    setCep('');
    setCnpj('');
    setCategoriaPrincipal('Cimento, Cal & Agregados');
    setObservacoes('');
    setExibirFormulario(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !contato.trim() || !telefone.trim() || !email.trim() || !cidade.trim()) {
      alert('Por favor, preencha os campos obrigatórios: Nome, Contato, Telefone/WhatsApp, E-mail e Cidade.');
      return;
    }

    if (fornecedorEmEdicao) {
      const atualizado: FornecedorReal = {
        ...fornecedorEmEdicao,
        nome: nome.trim(),
        contato: contato.trim(),
        telefone: telefone.trim(),
        email: email.trim(),
        endereco: {
          logradouro: logradouro.trim(),
          numero: numero.trim(),
          bairro: bairro.trim(),
          cidade: cidade.trim(),
          uf: uf.trim().toUpperCase(),
          cep: cep.trim()
        },
        cnpj: cnpj.trim(),
        categoriaPrincipal,
        observacoes: observacoes.trim()
      };
      onAtualizarFornecedor(atualizado);
      setFeedbackMsg(`Fornecedor "${atualizado.nome}" atualizado com sucesso!`);
    } else {
      const novo: FornecedorReal = {
        id: `forn-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        nome: nome.trim(),
        contato: contato.trim(),
        telefone: telefone.trim(),
        email: email.trim(),
        endereco: {
          logradouro: logradouro.trim(),
          numero: numero.trim(),
          bairro: bairro.trim(),
          cidade: cidade.trim(),
          uf: uf.trim().toUpperCase(),
          cep: cep.trim()
        },
        cnpj: cnpj.trim(),
        categoriaPrincipal,
        observacoes: observacoes.trim(),
        dataCadastro: new Date().toISOString().split('T')[0]
      };
      onAdicionarFornecedor(novo);
      setFeedbackMsg(`Fornecedor "${novo.nome}" cadastrado com sucesso!`);
    }

    setTimeout(() => setFeedbackMsg(null), 3000);
    limparFormulario();
  };

  const fornecedoresFiltrados = fornecedores.filter(f => {
    const matchBusca = 
      f.nome.toLowerCase().includes(busca.toLowerCase()) ||
      f.contato.toLowerCase().includes(busca.toLowerCase()) ||
      f.endereco.cidade.toLowerCase().includes(busca.toLowerCase()) ||
      f.email.toLowerCase().includes(busca.toLowerCase()) ||
      (f.cnpj && f.cnpj.includes(busca));

    const matchCategoria = filtroCategoria === 'TODAS' || f.categoriaPrincipal === filtroCategoria;

    return matchBusca && matchCategoria;
  });

  // Quantidade de insumos fornecidos por cada fornecedor (onde base === fornecedor.nome ou fornecedorId === fornecedor.id)
  const getInsumosDoFornecedor = (nomeFornecedor: string, idFornecedor?: string) => {
    return insumos.filter(i => 
      i.base.toLowerCase() === nomeFornecedor.toLowerCase() ||
      (idFornecedor && i.fornecedorId === idFornecedor)
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Banner Principal com Estatísticas */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Building2 className="w-6 h-6 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-white">
                  Página de Fornecedores do Programa
                </h2>
                <span className="text-[10px] font-mono uppercase bg-amber-400/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-400/30">
                  Contatos & Endereços Oficiais
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Cadastre e gerencie fornecedores reais de materiais, serviços e equipamentos com contatos, e-mail e endereços para vinculação direta aos insumos SINAPI.
              </p>
            </div>
          </div>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-xl text-center min-w-[110px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Fornecedores</span>
            <span className="text-xl font-black text-amber-400 font-mono">{fornecedores.length}</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2.5 rounded-xl text-center min-w-[110px]">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Preços Próprios</span>
            <span className="text-xl font-black text-emerald-400 font-mono">
              {insumos.filter(i => i.base !== 'SINAPI').length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (exibirFormulario && !fornecedorEmEdicao) {
                setExibirFormulario(false);
              } else {
                setFornecedorEmEdicao(null);
                setExibirFormulario(true);
              }
            }}
            className="py-2.5 px-5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{exibirFormulario ? 'Fechar Formulário' : 'Adicionar Fornecedor'}</span>
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 px-4 py-3 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in shadow-xs">
          <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* FORMULÁRIO COMPLETO DE ADICIONAR / EDITAR FORNECEDOR */}
      {exibirFormulario && (
        <form onSubmit={handleSubmit} className="bg-white border-2 border-amber-400 rounded-2xl p-6 shadow-xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                {fornecedorEmEdicao ? `Editar Fornecedor: ${fornecedorEmEdicao.nome}` : 'Adicionar Novo Fornecedor'}
              </h3>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              * Campos obrigatórios para cotações e emissão de ordens
            </span>
          </div>

          {/* DADOS GERAIS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Razão Social / Nome Fantasia do Fornecedor *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Votorantim Cimentos S/A ou Madeireira Progresso Ltda"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                CNPJ
              </label>
              <input
                type="text"
                placeholder="00.000.000/0001-00"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contato / Vendedor Responsável *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Carlos Eduardo Mendes (Vendas)"
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Telefone / WhatsApp Comercial *
              </label>
              <input
                type="text"
                required
                placeholder="(11) 99876-5432"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                E-mail Comercial *
              </label>
              <input
                type="email"
                required
                placeholder="vendas@fornecedor.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* ENDEREÇO COMPLETO (SOLICITADO) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-xs font-bold text-slate-800 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>Endereço Completo do Fornecedor / Centro de Distribuição</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-xs">
              <div className="md:col-span-4">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Logradouro (Rua / Av. / Rodovia) *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Av. das Indústrias, Rod. Raposo Tavares"
                  value={logradouro}
                  onChange={(e) => setLogradouro(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Número / KM</label>
                <input
                  type="text"
                  placeholder="Ex: 1500 ou km 23"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Bairro</label>
                <input
                  type="text"
                  placeholder="Ex: Distrito Industrial"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Cidade *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: São Paulo, Campinas, Itu"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">UF (Estado) *</label>
                <input
                  type="text"
                  maxLength={2}
                  required
                  placeholder="SP"
                  value={uf}
                  onChange={(e) => setUf(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold uppercase text-center"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">CEP</label>
                <input
                  type="text"
                  placeholder="00000-000"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-center"
                />
              </div>
            </div>
          </div>

          {/* CATEGORIA E OBSERVAÇÕES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Categoria Principal de Atuação
              </label>
              <select
                value={categoriaPrincipal}
                onChange={(e) => setCategoriaPrincipal(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
              >
                {categorias.filter(c => c !== 'TODAS').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Observações Comerciais (Faturamento mínimo, prazos, frete para canteiro)
              </label>
              <input
                type="text"
                placeholder="Ex: Faturamento mínimo R$ 2.000,00; prazo padrão 28 DDL; frete FOB ou CIF..."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
              />
            </div>
          </div>

          {/* BOTÕES DO FORMULÁRIO */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={limparFormulario}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{fornecedorEmEdicao ? 'Salvar Alterações do Fornecedor' : 'Cadastrar Fornecedor no Programa'}</span>
            </button>
          </div>
        </form>
      )}

      {/* BARRA DE PESQUISA E FILTROS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar fornecedor por razão social, contato, e-mail, cidade ou CNPJ..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar scrollbar-none text-xs">
          <span className="text-slate-500 font-bold whitespace-nowrap flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Categoria:
          </span>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 text-xs focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
          >
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* LISTA / CARDS DE FORNECEDORES CADASTRADOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fornecedoresFiltrados.length === 0 ? (
          <div className="col-span-full bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-800">Nenhum fornecedor encontrado</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {busca ? 'Tente outros termos na pesquisa ou altere o filtro de categoria.' : 'Clique em "Adicionar Fornecedor" para cadastrar contatos e endereços.'}
            </p>
          </div>
        ) : (
          fornecedoresFiltrados.map((forn) => {
            const insumosFornecidos = getInsumosDoFornecedor(forn.nome, forn.id);
            const numeroTelFormatado = forn.telefone.replace(/\D/g, '');

            return (
              <div 
                key={forn.id}
                className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-5 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
              >
                {/* Header do Card */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-black text-sm text-slate-900 leading-snug">
                        {forn.nome}
                      </h4>
                      {forn.categoriaPrincipal && (
                        <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
                          {forn.categoriaPrincipal}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => iniciarEdicao(forn)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer"
                        title="Editar Fornecedor"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Deseja realmente remover o fornecedor "${forn.nome}"?`)) {
                            onExcluirFornecedor(forn.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Excluir Fornecedor"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {forn.cnpj && (
                    <span className="text-[10px] font-mono text-slate-500 block">
                      CNPJ: {forn.cnpj}
                    </span>
                  )}
                </div>

                {/* Contato & Endereço */}
                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="font-semibold">{forn.contato}</span>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <a
                      href={`https://wa.me/55${numeroTelFormatado}?text=Ol%C3%A1%20${encodeURIComponent(forn.contato)}%2C%20tudo%20bem%3F%20Gostaria%20de%20solicitar%20uma%20cota%C3%A7%C3%A3o%20de%20materiais%20para%20nossa%20obra.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <span>{forn.telefone}</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </a>
                  </div>

                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <a
                      href={`mailto:${forn.email}?subject=Solicitação de Cotação - Obra`}
                      className="font-medium text-slate-600 hover:text-blue-600 hover:underline truncate"
                      title={forn.email}
                    >
                      {forn.email}
                    </a>
                  </div>

                  <div className="flex items-start gap-2 text-slate-600 text-[11px] pt-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="leading-tight">
                      {forn.endereco.logradouro}{forn.endereco.numero ? `, ${forn.endereco.numero}` : ''}
                      {forn.endereco.bairro ? ` - ${forn.endereco.bairro}` : ''}
                      {` - ${forn.endereco.cidade}/${forn.endereco.uf}`}
                      {forn.endereco.cep ? ` (CEP: ${forn.endereco.cep})` : ''}
                    </span>
                  </div>

                  {forn.observacoes && (
                    <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg italic">
                      "{forn.observacoes}"
                    </p>
                  )}
                </div>

                {/* Footer do Card: Preços Cadastrados e Ações */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setFornecedorInsumosModal(forn)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/70 transition cursor-pointer text-left group"
                    title="Ver e apagar insumos deste fornecedor"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 transition" />
                    <span className="text-[10px] uppercase font-bold text-slate-500 group-hover:text-rose-900">Insumos:</span>
                    <span className="text-xs font-black font-mono px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900 border border-amber-300 group-hover:bg-rose-100 group-hover:text-rose-900 group-hover:border-rose-300">
                      {insumosFornecidos.length}
                    </span>
                    <span className="text-[10px] text-rose-600 font-bold underline ml-0.5">Apagar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onIrParaCadastrarPreco(forn.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs transition flex items-center gap-1 cursor-pointer"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Cadastrar Preço</span>
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* MODAL DE VISUALIZAR E APAGAR INSUMOS DO FORNECEDOR */}
      {fornecedorInsumosModal && (() => {
        const insumosModal = getInsumosDoFornecedor(fornecedorInsumosModal.nome, fornecedorInsumosModal.id);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
              
              {/* Header do Modal */}
              <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-400 text-slate-950 rounded-xl font-black">
                    <Package className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-white flex items-center gap-2">
                      <span>Insumos do Fornecedor: {fornecedorInsumosModal.nome}</span>
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                        {insumosModal.length} {insumosModal.length === 1 ? 'item' : 'itens'}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Visualize e apague os insumos associados a este fornecedor.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFornecedorInsumosModal(null)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
                  title="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Barra de Ações Rápidas */}
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-medium">
                    Total nesta base: <strong>{insumosModal.length} insumo(s)</strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {insumosModal.length > 0 && (onExcluirMultiplosInsumosFornecedor || onExcluirInsumoFornecedor) && (
                    confirmandoApagarTodos ? (
                      <div className="flex items-center gap-1.5 bg-rose-100 p-1 rounded-xl border border-rose-300 animate-fade-in">
                        <span className="text-[11px] font-bold text-rose-900 px-2">Apagar todos os {insumosModal.length}?</span>
                        <button
                          type="button"
                          onClick={() => {
                            const ids = insumosModal.map(i => i.id);
                            if (onExcluirMultiplosInsumosFornecedor) {
                              onExcluirMultiplosInsumosFornecedor(ids);
                            } else if (onExcluirInsumoFornecedor) {
                              ids.forEach(id => onExcluirInsumoFornecedor(id));
                            }
                            setConfirmandoApagarTodos(false);
                          }}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-lg cursor-pointer"
                        >
                          Sim, Apagar Tudo
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmandoApagarTodos(false)}
                          className="px-2 py-1 bg-white text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-lg cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmandoApagarTodos(true)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-300 font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer text-xs"
                        title="Apagar todos os insumos vinculados a este fornecedor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Apagar Todos os Insumos ({insumosModal.length})</span>
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const fId = fornecedorInsumosModal.id;
                      setFornecedorInsumosModal(null);
                      onIrParaCadastrarPreco(fId);
                    }}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>+ Cadastrar Novos Preços</span>
                  </button>
                </div>
              </div>

              {/* Tabela de Insumos */}
              <div className="overflow-y-auto flex-1 p-6">
                {insumosModal.length === 0 ? (
                  <div className="p-12 text-center text-slate-500 space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <Package className="w-10 h-10 text-slate-300 mx-auto" />
                    <h4 className="font-bold text-slate-700 text-sm">
                      Nenhum insumo cadastrado para {fornecedorInsumosModal.nome}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Este fornecedor ainda não possui insumos vinculados.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        const fId = fornecedorInsumosModal.id;
                        setFornecedorInsumosModal(null);
                        onIrParaCadastrarPreco(fId);
                      }}
                      className="mt-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Cadastrar Preço de Fornecedor
                    </button>
                  </div>
                ) : (
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3 w-20">CÓD.</th>
                          <th className="py-2.5 px-4">Descrição do Insumo</th>
                          <th className="py-2.5 px-2 w-14 text-center">Unid.</th>
                          <th className="py-2.5 px-3 text-right w-28 bg-emerald-50/40">Preço À Vista</th>
                          <th className="py-2.5 px-3 text-right w-28 bg-blue-50/40">Preço A Prazo</th>
                          <th className="py-2.5 px-3 text-right w-28 bg-amber-50/60 font-black">Considerado</th>
                          <th className="py-2.5 px-3 text-center w-24">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {insumosModal.map(item => {
                          const precoAvista = item.precoAvista || 0;
                          const precoPrazo = item.precoPrazo || item.precoUnitario || 0;
                          const condicao = item.tipoPagamentoSelecionado || 'PRAZO';
                          const valorConsiderado = condicao === 'AVISTA' && precoAvista > 0 ? precoAvista : precoPrazo;

                          return (
                            <tr key={item.id} className="hover:bg-slate-50 transition">
                              <td className="py-2.5 px-3">
                                <span className="font-mono font-bold text-[11px] bg-amber-100 text-amber-950 px-2 py-0.5 rounded border border-amber-300">
                                  {item.codigo}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 font-medium text-slate-900">
                                {item.descricao || item.nome}
                              </td>
                              <td className="py-2.5 px-2 text-center font-bold text-slate-600">
                                {item.unidade}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono text-emerald-800 bg-emerald-50/20">
                                {precoAvista > 0 ? formatarMoeda(precoAvista) : '-'}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono text-blue-800 bg-blue-50/20">
                                {precoPrazo > 0 ? formatarMoeda(precoPrazo) : '-'}
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900 bg-amber-50/30">
                                {formatarMoeda(valorConsiderado)}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                {insumoIdExcluindo === item.id ? (
                                  <div className="flex items-center justify-center gap-1 animate-fade-in">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onExcluirInsumoFornecedor?.(item.id);
                                        setInsumoIdExcluindo(null);
                                      }}
                                      className="px-2 py-1 text-[10px] bg-rose-600 hover:bg-rose-700 text-white font-black rounded-lg transition cursor-pointer"
                                      title="Confirmar exclusão deste insumo"
                                    >
                                      Confirmar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setInsumoIdExcluindo(null)}
                                      className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                                      title="Cancelar"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setInsumoIdExcluindo(item.id)}
                                    className="px-2.5 py-1 text-[11px] bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 font-bold rounded-lg transition flex items-center justify-center gap-1 mx-auto cursor-pointer"
                                    title="Apagar este insumo deste fornecedor"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Apagar</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Footer do Modal */}
              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setFornecedorInsumosModal(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Fechar
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};
