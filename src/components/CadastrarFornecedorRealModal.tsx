import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Check, 
  Plus, 
  Search, 
  AlertCircle,
  CheckSquare,
  Square,
  Sparkles,
  Info
} from 'lucide-react';
import { FornecedorReal, InsumoItem } from '../types/orcamento';
import { formatarMoeda } from '../utils/bdiCalculator';

interface CadastrarFornecedorRealModalProps {
  insumo: InsumoItem | null;
  fornecedores: FornecedorReal[];
  isOpen: boolean;
  onClose: () => void;
  onAdicionarFornecedor: (novoFornecedor: FornecedorReal) => void;
  onCriarInsumoComBaseFornecedor?: (novoInsumo: InsumoItem) => void;
  onVincularFornecedores?: (insumo: InsumoItem, fornecedoresIds: string[]) => void;
  insumosExistentes?: InsumoItem[];
}

export const CadastrarFornecedorRealModal: React.FC<CadastrarFornecedorRealModalProps> = ({
  insumo,
  fornecedores,
  isOpen,
  onClose,
  onAdicionarFornecedor,
  onCriarInsumoComBaseFornecedor,
  onVincularFornecedores,
  insumosExistentes = []
}) => {
  // Seleção múltipla de fornecedores
  const [fornecedoresSelecionadosIds, setFornecedoresSelecionadosIds] = useState<string[]>([]);
  const [buscaFornecedor, setBuscaFornecedor] = useState('');
  const [modoNovoFornecedor, setModoNovoFornecedor] = useState(false);

  // Formulário de Cadastro Rápido de Novo Fornecedor caso o usuário deseje criar um
  const [novoNome, setNovoNome] = useState('');
  const [novoContato, setNovoContato] = useState('');
  const [novoTelefone, setNovoTelefone] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novoLogradouro, setNovoLogradouro] = useState('');
  const [novoNumero, setNovoNumero] = useState('');
  const [novoBairro, setNovoBairro] = useState('');
  const [novaCidade, setNovaCidade] = useState('');
  const [novoUf, setNovoUf] = useState('SP');
  const [novoCep, setNovoCep] = useState('');
  const [novoCnpj, setNovoCnpj] = useState('');
  const [novaCategoria, setNovaCategoria] = useState('Cimento, Cal & Agregados');

  if (!isOpen || !insumo) return null;

  // Regra do Usuário: Adicionar fornecedores é apenas na base oficial SINAPI
  const isSinapi = (insumo.base || insumo.fornecedor) === 'SINAPI';
  if (!isSinapi) {
    return null;
  }

  const fornecedoresFiltrados = fornecedores.filter(f => 
    f.nome.toLowerCase().includes(buscaFornecedor.toLowerCase()) ||
    f.contato.toLowerCase().includes(buscaFornecedor.toLowerCase()) ||
    f.endereco.cidade.toLowerCase().includes(buscaFornecedor.toLowerCase()) ||
    (f.categoriaPrincipal && f.categoriaPrincipal.toLowerCase().includes(buscaFornecedor.toLowerCase()))
  );

  const toggleFornecedor = (id: string) => {
    setFornecedoresSelecionadosIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const selecionarTodos = () => {
    const todosIds = fornecedoresFiltrados.map(f => f.id);
    setFornecedoresSelecionadosIds(todosIds);
  };

  const desmarcarTodos = () => {
    setFornecedoresSelecionadosIds([]);
  };

  const handleSalvarNovoFornecedor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNome.trim()) {
      alert('Por favor, informe a Razão Social ou Nome Fantasia do fornecedor.');
      return;
    }

    const fornecedorCriado: FornecedorReal = {
      id: `forn-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      nome: novoNome.trim(),
      contato: novoContato.trim() || 'Comercial / Vendas',
      telefone: novoTelefone.trim() || '(11) 99999-9999',
      email: novoEmail.trim() || 'vendas@fornecedor.com.br',
      endereco: {
        logradouro: novoLogradouro.trim() || 'Rua Principal',
        numero: novoNumero.trim() || 'S/N',
        bairro: novoBairro.trim() || 'Centro',
        cidade: novaCidade.trim() || 'São Paulo',
        uf: novoUf || 'SP',
        cep: novoCep.trim() || '01000-000'
      },
      cnpj: novoCnpj.trim(),
      categoriaPrincipal: novaCategoria,
      dataCadastro: new Date().toISOString().split('T')[0]
    };

    onAdicionarFornecedor(fornecedorCriado);
    setFornecedoresSelecionadosIds(prev => [...prev, fornecedorCriado.id]);
    setModoNovoFornecedor(false);

    // Limpar campos
    setNovoNome('');
    setNovoContato('');
    setNovoTelefone('');
    setNovoEmail('');
    setNovoLogradouro('');
    setNovoNumero('');
    setNovoBairro('');
    setNovaCidade('');
    setNovoCep('');
    setNovoCnpj('');
  };

  const handleConfirmarOk = () => {
    if (fornecedoresSelecionadosIds.length === 0) {
      alert('Selecione pelo menos um fornecedor da lista para vincular ao insumo.');
      return;
    }

    if (onVincularFornecedores) {
      onVincularFornecedores(insumo, fornecedoresSelecionadosIds);
    } else if (onCriarInsumoComBaseFornecedor) {
      // Fallback: criar um por um
      fornecedoresSelecionadosIds.forEach(fId => {
        const forn = fornecedores.find(f => f.id === fId);
        if (forn) {
          const novoInsumo: InsumoItem = {
            id: `ins-forn-${forn.id}-${insumo.codigo}-${Date.now()}`,
            codigo: insumo.codigo,
            descricao: insumo.descricao,
            nome: insumo.descricao,
            unidade: insumo.unidade,
            tipo: insumo.tipo,
            base: forn.nome,
            precoUnitario: 0,
            precoPrazo: 0,
            precoAvista: 0,
            descontoAvistaPercentual: 0,
            tipoPagamentoSelecionado: 'PRAZO',
            fornecedor: forn.nome,
            whatsappFornecedor: forn.telefone || '',
            fornecedorId: forn.id,
            fornecedorNome: forn.nome,
            contatoFornecedor: forn.contato,
            telefoneFornecedor: forn.telefone,
            emailFornecedor: forn.email,
            enderecoFornecedor: `${forn.endereco.logradouro}, ${forn.endereco.numero || ''} - ${forn.endereco.cidade}/${forn.endereco.uf}`,
            prazoEntregaDias: 3,
            condicoesPagamento: 'A prazo',
            dataAtualizacao: new Date().toISOString().split('T')[0]
          };
          onCriarInsumoComBaseFornecedor(novoInsumo);
        }
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Header do Modal */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Building2 className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight text-white">
                  + Fornecedor Real no Insumo
                </h3>
                <span className="text-[10px] font-mono uppercase bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                  Seleção Múltipla de Fornecedores
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Vincule um ou mais fornecedores reais mantendo o código oficial SINAPI.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Detalhes do Insumo Selecionado */}
        <div className="bg-amber-50/80 border-b border-amber-200/80 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 bg-amber-400 text-slate-950 font-black font-mono rounded-lg shadow-2xs">
              CÓD. {insumo.codigo}
            </span>
            <div>
              <span className="font-bold text-slate-900 block leading-tight">{insumo.descricao || insumo.nome}</span>
              <span className="text-slate-500 text-[11px]">
                Unidade: <strong className="text-slate-700">{insumo.unidade}</strong> | Tipo: <strong className="text-slate-700">{insumo.tipo}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Preço Base SINAPI</span>
              <span className="text-sm font-black text-slate-900 font-mono">
                {formatarMoeda(insumo.precoUnitario)} / {insumo.unidade}
              </span>
            </div>
          </div>
        </div>

        {/* Informação Clara de que nenhum dado é inserido nesta etapa */}
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-2.5 flex items-center gap-2.5 text-xs text-blue-900">
          <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
          <p className="text-[11px] leading-relaxed">
            <strong>Instrução:</strong> Selecione os fornecedores desejados abaixo. 
            Nesta etapa <strong>não é necessário inserir nenhum dado ou preço</strong>. 
            Ao clicar em <strong>OK</strong>, o insumo será criado na base de dados com o nome de cada fornecedor e 
            estará visível ao alterar o filtro de bases. Os preços poderão ser lançados na aba <strong>Cadastrar Preço de Fornecedor</strong>.
          </p>
        </div>

        {/* Corpo do Modal: Seleção dos Fornecedores */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>Selecione os Fornecedores ({fornecedoresSelecionadosIds.length} selecionado{fornecedoresSelecionadosIds.length === 1 ? '' : 's'})</span>
              </label>
              <span className="text-[11px] text-slate-500">
                Marque um ou vários fornecedores para criar as bases correspondentes
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={selecionarTodos}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              >
                Selecionar Todos ({fornecedoresFiltrados.length})
              </button>
              <button
                type="button"
                onClick={desmarcarTodos}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
              >
                Desmarcar
              </button>
              <button
                type="button"
                onClick={() => setModoNovoFornecedor(!modoNovoFornecedor)}
                className="px-3 py-1 text-xs font-black rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 transition cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>{modoNovoFornecedor ? 'Voltar à Lista' : '+ Novo Fornecedor'}</span>
              </button>
            </div>
          </div>

          {/* FORMULÁRIO RÁPIDO PARA NOVO FORNECEDOR */}
          {modoNovoFornecedor ? (
            <form onSubmit={handleSalvarNovoFornecedor} className="bg-slate-50 border-2 border-amber-300 rounded-2xl p-4 space-y-3 animate-fade-in shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>Cadastrar Fornecedor Real Rápido</span>
                </h4>
                <span className="text-[10px] text-slate-500">Adiciona ao programa e seleciona automaticamente</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Razão Social / Nome Fantasia *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Comercial Esperança de Materiais"
                    value={novoNome}
                    onChange={(e) => setNovoNome(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Contato / Vendedor *</label>
                  <input
                    type="text"
                    placeholder="Ex: Rodrigo Vendas / Mariana"
                    value={novoContato}
                    onChange={(e) => setNovoContato(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    placeholder="(11) 98765-4321"
                    value={novoTelefone}
                    onChange={(e) => setNovoTelefone(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">E-mail Comercial</label>
                  <input
                    type="email"
                    placeholder="vendas@fornecedor.com.br"
                    value={novoEmail}
                    onChange={(e) => setNovoEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Cidade / UF</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Cidade"
                      value={novaCidade}
                      onChange={(e) => setNovaCidade(e.target.value)}
                      className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                    />
                    <input
                      type="text"
                      maxLength={2}
                      placeholder="UF"
                      value={novoUf}
                      onChange={(e) => setNovoUf(e.target.value.toUpperCase())}
                      className="w-16 px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Categoria Principal</label>
                  <select
                    value={novaCategoria}
                    onChange={(e) => setNovaCategoria(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="Cimento, Cal & Agregados">Cimento, Cal & Agregados</option>
                    <option value="Aço CA-50, CA-60 & Ferragens">Aço CA-50, CA-60 & Ferragens</option>
                    <option value="Blocos, Tijolos & Alvenaria">Blocos, Tijolos & Alvenaria</option>
                    <option value="Madeiras, Formas & Escoras">Madeiras, Formas & Escoras</option>
                    <option value="Tubos, Conexões & Hidráulica">Tubos, Conexões & Hidráulica</option>
                    <option value="Fios, Cabos & Elétrica">Fios, Cabos & Elétrica</option>
                    <option value="Tintas, Impermeabilizantes & Pintura">Tintas, Impermeabilizantes & Pintura</option>
                    <option value="Pisos, Revestimentos & Louças">Pisos, Revestimentos & Louças</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModoNovoFornecedor(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-black uppercase bg-emerald-600 hover:bg-emerald-500 text-white transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Cadastrar & Selecionar</span>
                </button>
              </div>
            </form>
          ) : (
            /* LISTAGEM DE FORNECEDORES COM CHECKBOXES */
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar fornecedores por nome, contato, cidade ou categoria..."
                  value={buscaFornecedor}
                  onChange={(e) => setBuscaFornecedor(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                />
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {fornecedoresFiltrados.length === 0 ? (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                    Nenhum fornecedor encontrado para "{buscaFornecedor}". 
                    Clique em "+ Novo Fornecedor" acima para cadastrar.
                  </div>
                ) : (
                  fornecedoresFiltrados.map((forn) => {
                    const isSelected = fornecedoresSelecionadosIds.includes(forn.id);
                    // Checar se já existe insumo com este código nesta base
                    const jaExiste = insumosExistentes.some(
                      i => i.codigo === insumo.codigo && i.base.toLowerCase() === forn.nome.toLowerCase()
                    );

                    return (
                      <div
                        key={forn.id}
                        onClick={() => toggleFornecedor(forn.id)}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-2 ring-amber-400/40'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFornecedor(forn.id);
                            }}
                            className={`w-5 h-5 rounded flex items-center justify-center transition cursor-pointer flex-shrink-0 ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 font-black'
                                : 'border-2 border-slate-300 hover:border-slate-400 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>

                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-xs text-slate-900">{forn.nome}</span>
                              {forn.categoriaPrincipal && (
                                <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 font-medium">
                                  {forn.categoriaPrincipal}
                                </span>
                              )}
                              {jaExiste && (
                                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-200">
                                  Já vinculado na base
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3 text-slate-400" />
                                {forn.contato}
                              </span>
                              <span className="flex items-center gap-1 font-mono">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {forn.telefone}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {forn.endereco.cidade}/{forn.endereco.uf}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <span className={`text-[11px] font-bold px-2 py-1 rounded-lg ${
                            isSelected 
                              ? 'bg-amber-400 text-slate-950 font-black shadow-2xs' 
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            {isSelected ? 'Selecionado' : 'Clique p/ selecionar'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer do Modal com botão OK */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
          >
            Cancelar
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">
              {fornecedoresSelecionadosIds.length === 0 ? (
                'Nenhum fornecedor selecionado'
              ) : (
                <strong>{fornecedoresSelecionadosIds.length} fornecedor(es) selecionado(s)</strong>
              )}
            </span>

            <button
              type="button"
              disabled={fornecedoresSelecionadosIds.length === 0}
              onClick={handleConfirmarOk}
              className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>OK - Criar Insumo na Base de Dados</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
