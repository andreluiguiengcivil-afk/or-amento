import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Check, 
  Plus, 
  Search, 
  TrendingDown, 
  TrendingUp, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { FornecedorReal, InsumoItem } from '../types/orcamento';
import { formatarMoeda } from '../utils/bdiCalculator';

interface CadastrarFornecedorRealModalProps {
  insumo: InsumoItem | null;
  fornecedores: FornecedorReal[];
  isOpen: boolean;
  onClose: () => void;
  onAdicionarFornecedor: (novoFornecedor: FornecedorReal) => void;
  onCriarInsumoComBaseFornecedor: (novoInsumo: InsumoItem) => void;
}

export const CadastrarFornecedorRealModal: React.FC<CadastrarFornecedorRealModalProps> = ({
  insumo,
  fornecedores,
  isOpen,
  onClose,
  onAdicionarFornecedor,
  onCriarInsumoComBaseFornecedor
}) => {
  const [fornecedorSelecionadoId, setFornecedorSelecionadoId] = useState<string>('');
  const [buscaFornecedor, setBuscaFornecedor] = useState('');
  const [precoInformado, setPrecoInformado] = useState('');
  const [prazoEntrega, setPrazoEntrega] = useState('3');
  const [condicoesPagto, setCondicoesPagto] = useState('28 DDL');
  const [observacoes, setObservacoes] = useState('');
  const [modoNovoFornecedor, setModoNovoFornecedor] = useState(false);

  // Formulário de Cadastro Rápido de Novo Fornecedor
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
  const [novaCategoria, setNovaCategoria] = useState('Materiais Básicos');

  if (!isOpen || !insumo) return null;

  const fornecedoresFiltrados = fornecedores.filter(f => 
    f.nome.toLowerCase().includes(buscaFornecedor.toLowerCase()) ||
    f.contato.toLowerCase().includes(buscaFornecedor.toLowerCase()) ||
    f.endereco.cidade.toLowerCase().includes(buscaFornecedor.toLowerCase()) ||
    (f.categoriaPrincipal && f.categoriaPrincipal.toLowerCase().includes(buscaFornecedor.toLowerCase()))
  );

  const fornecedorAtual = fornecedores.find(f => f.id === fornecedorSelecionadoId);

  // Cálculo de variação em relação ao preço SINAPI
  const precoNum = parseFloat(precoInformado.replace(',', '.')) || 0;
  const precoSinapi = insumo.precoUnitario;
  const diferenca = precoNum > 0 ? precoNum - precoSinapi : 0;
  const diferencaPerc = precoSinapi > 0 && precoNum > 0 ? ((precoNum - precoSinapi) / precoSinapi) * 100 : 0;

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
        logradouro: novoLogradouro.trim() || 'Rua das Indústrias',
        numero: novoNumero.trim() || 'S/N',
        bairro: novoBairro.trim() || 'Industrial',
        cidade: novaCidade.trim() || 'São Paulo',
        uf: novoUf || 'SP',
        cep: novoCep.trim() || '00000-000'
      },
      cnpj: novoCnpj.trim(),
      categoriaPrincipal: novaCategoria,
      dataCadastro: new Date().toISOString().split('T')[0]
    };

    onAdicionarFornecedor(fornecedorCriado);
    setFornecedorSelecionadoId(fornecedorCriado.id);
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

  const handleConfirmarVinculo = () => {
    if (!fornecedorAtual) {
      alert('Selecione um fornecedor da lista ou cadastre um novo fornecedor.');
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
    const novoInsumoFornecedor: InsumoItem = {
      id: `ins-forn-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      codigo: insumo.codigo, // MESMO CÓDIGO DO SINAPI!
      descricao: insumo.descricao || (insumo as any).nome || '',
      nome: insumo.descricao || (insumo as any).nome || '',
      unidade: insumo.unidade,
      tipo: insumo.tipo,
      base: fornecedorAtual.nome, // NOME DO FORNECEDOR COMO BASE!
      fornecedor: fornecedorAtual.nome,
      whatsappFornecedor: fornecedorAtual.telefone || '',
      precoUnitario: precoNum,
      fornecedorId: fornecedorAtual.id,
      fornecedorNome: fornecedorAtual.nome,
      contatoFornecedor: fornecedorAtual.contato,
      telefoneFornecedor: fornecedorAtual.telefone,
      emailFornecedor: fornecedorAtual.email,
      enderecoFornecedor: `${fornecedorAtual.endereco.logradouro}, ${fornecedorAtual.endereco.numero || ''} - ${fornecedorAtual.endereco.cidade}/${fornecedorAtual.endereco.uf}`,
      prazoEntregaDias: parseInt(prazoEntrega) || 3,
      condicoesPagamento: condicoesPagto,
      observacoes: observacoes.trim(),
      dataAtualizacao: new Date().toISOString().split('T')[0]
    };

    onCriarInsumoComBaseFornecedor(novoInsumoFornecedor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        
        {/* Header do Modal */}
        <div className="bg-slate-900 text-white px-6 py-4.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
              <Building2 className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black tracking-tight text-white">
                  Cadastro de Fornecedor Real no Insumo
                </h3>
                <span className="text-[10px] font-mono uppercase bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                  Base SINAPI &rarr; Base Fornecedor
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Cria um novo insumo com o <strong>mesmo código SINAPI</strong>, tendo como <strong>base o nome do fornecedor</strong>.
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
        <div className="bg-amber-50/70 border-b border-amber-200/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="px-2.5 py-1 bg-amber-500 text-slate-950 font-black font-mono rounded-lg shadow-2xs">
              SINAPI {insumo.codigo}
            </span>
            <div>
              <span className="font-bold text-slate-900 block leading-tight">{insumo.descricao}</span>
              <span className="text-slate-500 text-[11px]">Unidade: <strong className="text-slate-700">{insumo.unidade}</strong> | Tipo: <strong className="text-slate-700">{insumo.tipo}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Preço Base SINAPI</span>
              <span className="text-sm font-black text-slate-900 font-mono">
                {formatarMoeda(insumo.precoUnitario)} / {insumo.unidade}
              </span>
            </div>
            <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
              Base: {insumo.base || 'SINAPI'}
            </span>
          </div>
        </div>

        {/* Corpo do Modal */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Seção 1: Selecionar Fornecedor Cadastrado OU Cadastrar Novo */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>1. Selecionar Fornecedor Cadastrado no Programa ({fornecedores.length} disponíveis)</span>
              </label>

              <button
                type="button"
                onClick={() => setModoNovoFornecedor(!modoNovoFornecedor)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                  modoNovoFornecedor 
                    ? 'bg-slate-200 text-slate-800' 
                    : 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-xs'
                }`}
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                <span>{modoNovoFornecedor ? 'Voltar para Lista' : '+ Cadastrar Novo Fornecedor'}</span>
              </button>
            </div>

            {/* FORMULÁRIO DE NOVO FORNECEDOR (CASO ATIVADO) */}
            {modoNovoFornecedor ? (
              <form onSubmit={handleSalvarNovoFornecedor} className="bg-slate-50 border-2 border-amber-300 rounded-2xl p-5 space-y-4 animate-fade-in shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <span>Adicionar Novo Fornecedor ao Programa</span>
                  </h4>
                  <span className="text-[10px] text-slate-500">Campos completos de contato e endereço</span>
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
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">CNPJ (Opcional)</label>
                    <input
                      type="text"
                      placeholder="00.000.000/0001-00"
                      value={novoCnpj}
                      onChange={(e) => setNovoCnpj(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Contato / Vendedor Responsável *</label>
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
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">E-mail Comercial *</label>
                    <input
                      type="email"
                      placeholder="vendas@fornecedor.com.br"
                      value={novoEmail}
                      onChange={(e) => setNovoEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Categoria Principal</label>
                    <select
                      value={novaCategoria}
                      onChange={(e) => setNovaCategoria(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                    >
                      <option value="Cimento, Cal & Agregados">Cimento, Cal & Agregados</option>
                      <option value="Aço CA-50, CA-60 & Ferragens">Aço CA-50, CA-60 & Ferragens</option>
                      <option value="Blocos, Tijolos & Alvenaria">Blocos, Tijolos & Alvenaria</option>
                      <option value="Madeiras, Formas & Escoras">Madeiras, Formas & Escoras</option>
                      <option value="Tubos, Conexões & Hidráulica">Tubos, Conexões & Hidráulica</option>
                      <option value="Fios, Cabos & Elétrica">Fios, Cabos & Elétrica</option>
                      <option value="Tintas, Impermeabilizantes & Pintura">Tintas, Impermeabilizantes & Pintura</option>
                      <option value="Pisos, Revestimentos & Louças">Pisos, Revestimentos & Louças</option>
                      <option value="Locação de Equipamentos">Locação de Equipamentos</option>
                    </select>
                  </div>

                  {/* Endereço */}
                  <div className="md:col-span-2 pt-2 border-t border-slate-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-2">
                      Endereço Completo do Fornecedor
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          placeholder="Logradouro / Rua / Avenida"
                          value={novoLogradouro}
                          onChange={(e) => setNovoLogradouro(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Número / Compl."
                          value={novoNumero}
                          onChange={(e) => setNovoNumero(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Bairro"
                          value={novoBairro}
                          onChange={(e) => setNovoBairro(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <input
                          type="text"
                          placeholder="Cidade"
                          value={novaCidade}
                          onChange={(e) => setNovaCidade(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          maxLength={2}
                          placeholder="UF (ex: SP)"
                          value={novoUf}
                          onChange={(e) => setNovoUf(e.target.value.toUpperCase())}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs uppercase"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="CEP (ex: 01234-567)"
                          value={novoCep}
                          onChange={(e) => setNovoCep(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setModoNovoFornecedor(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-black uppercase bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Salvar Fornecedor & Selecionar</span>
                  </button>
                </div>
              </form>
            ) : (
              /* LISTA DE FORNECEDORES EXISTENTES */
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filtrar fornecedores por nome, contato, cidade ou categoria..."
                    value={buscaFornecedor}
                    onChange={(e) => setBuscaFornecedor(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-amber-400 focus:outline-hidden"
                  />
                </div>

                <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                  {fornecedoresFiltrados.length === 0 ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                      Nenhum fornecedor encontrado. Clique em "+ Cadastrar Novo Fornecedor" acima.
                    </div>
                  ) : (
                    fornecedoresFiltrados.map((forn) => {
                      const isSelected = forn.id === fornecedorSelecionadoId;
                      return (
                        <div
                          key={forn.id}
                          onClick={() => setFornecedorSelecionadoId(forn.id)}
                          className={`p-3 rounded-xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isSelected
                              ? 'border-amber-500 bg-amber-50/80 shadow-xs ring-2 ring-amber-400/50'
                              : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/80'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900">{forn.nome}</span>
                              {forn.categoriaPrincipal && (
                                <span className="text-[10px] px-2 py-0.2 rounded-full bg-slate-100 text-slate-600 font-medium">
                                  {forn.categoriaPrincipal}
                                </span>
                              )}
                              {isSelected && (
                                <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded bg-amber-400 text-slate-950 flex items-center gap-1 shadow-2xs">
                                  <Check className="w-3 h-3 stroke-[3]" /> Selecionado
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500">
                              <span className="flex items-center gap-1">
                                <User className="w-3 h-3 text-slate-400" />
                                {forn.contato}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {forn.telefone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />
                                {forn.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {forn.endereco.cidade}/{forn.endereco.uf}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setFornecedorSelecionadoId(forn.id);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500 text-slate-950 font-black'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected ? 'Selecionado' : 'Escolher Fornecedor'}
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Seção 2: Preço e Condições Comerciais deste Fornecedor */}
          {fornecedorAtual && (
            <div className="bg-amber-50/50 border border-amber-300 rounded-2xl p-5 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-950">
                    2. Cadastrar Preço do Fornecedor para o Código SINAPI {insumo.codigo}
                  </h4>
                </div>
                <span className="text-[11px] font-mono font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                  Base que será gravada: "{fornecedorAtual.nome}"
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Preço Praticado pelo Fornecedor (R$ por {insumo.unidade}) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                      R$
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="0,00"
                      value={precoInformado}
                      onChange={(e) => setPrecoInformado(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-black font-mono text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Prazo de Entrega Estimado
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={prazoEntrega}
                      onChange={(e) => setPrazoEntrega(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                      placeholder="Dias úteis"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      dias úteis
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Condição de Pagamento
                  </label>
                  <input
                    type="text"
                    value={condicoesPagto}
                    onChange={(e) => setCondicoesPagto(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    placeholder="Ex: 28 DDL / À vista"
                  />
                </div>
              </div>

              {/* CARD DE COMPARATIVO: SINAPI vs FORNECEDOR */}
              {precoNum > 0 && (
                <div className={`p-4 rounded-xl border flex items-center justify-between ${
                  diferenca < 0 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950' 
                    : diferenca > 0 
                    ? 'bg-amber-50 border-amber-200 text-amber-950' 
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                      diferenca < 0 ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {diferenca < 0 ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">
                        {diferenca < 0 
                          ? 'Economia em relação ao SINAPI Oficial' 
                          : diferenca > 0 
                          ? 'Preço superior ao SINAPI Oficial' 
                          : 'Preço idêntico ao SINAPI'}
                      </span>
                      <span className="text-[11px] text-slate-600">
                        SINAPI: <strong>{formatarMoeda(precoSinapi)}</strong> &rarr; {fornecedorAtual.nome}: <strong>{formatarMoeda(precoNum)}</strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-sm font-black font-mono block ${
                      diferenca < 0 ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {diferenca < 0 ? '-' : '+'}{formatarMoeda(Math.abs(diferenca))} ({diferencaPerc > 0 ? '+' : ''}{diferencaPerc.toFixed(1)}%)
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-bold">Variação por {insumo.unidade}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Observações Comerciais ou Técnicas (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Preço especial para carga fechada, frete incluso para canteiro..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              {/* Explicação da Lógica Solicitada */}
              <div className="bg-white border border-amber-300/80 p-3 rounded-xl flex items-start gap-2.5 text-xs text-amber-950">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold">Resultado do cadastro no programa:</span>
                  <p className="text-[11px] text-slate-600">
                    Será criado um novo insumo com código <strong>{insumo.codigo}</strong> (mesmo código do SINAPI), mas com a base <strong>"{fornecedorAtual.nome}"</strong>. No SINAPI original a base permanece <strong>"SINAPI"</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer do Modal */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={!fornecedorAtual || !precoNum || precoNum <= 0}
            onClick={handleConfirmarVinculo}
            className="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Criar Novo Insumo com Base "{fornecedorAtual ? fornecedorAtual.nome : 'Fornecedor'}"</span>
          </button>
        </div>

      </div>
    </div>
  );
};
