import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronRight, 
  Layers, 
  HardHat, 
  Edit3, 
  FileText,
  DollarSign,
  Maximize2,
  FolderPlus
} from 'lucide-react';
import { ProjetoOrcamento, EtapaOrcamento, ItemOrcamento } from '../types/orcamento';
import { calcularTaxaBDI, formatarMoeda, formatarNumero } from '../utils/bdiCalculator';

interface BudgetTableProps {
  projeto: ProjetoOrcamento;
  setProjeto: React.Dispatch<React.SetStateAction<ProjetoOrcamento>>;
  onOpenCpuModal: (item: ItemOrcamento) => void;
  onOpenSinapiSearch: (etapaId: string) => void;
}

export const BudgetTable: React.FC<BudgetTableProps> = ({
  projeto,
  setProjeto,
  onOpenCpuModal,
  onOpenSinapiSearch
}) => {
  const [collapsedEtapas, setCollapsedEtapas] = useState<Record<string, boolean>>({});
  const [editandoInfo, setEditandoInfo] = useState(false);

  const taxaBdi = calcularTaxaBDI(projeto.bdiConfig);
  const fatorBdi = 1 + (taxaBdi / 100);

  // Calcula total geral direto para ponderação percentual
  let totalGeralDireto = 0;
  projeto.etapas.forEach(e => {
    e.itens.forEach(i => {
      totalGeralDireto += (i.quantidade * i.custoUnitario);
    });
  });

  const toggleEtapa = (id: string) => {
    setCollapsedEtapas(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const atualizarItem = (etapaId: string, itemId: string, campo: keyof ItemOrcamento, valor: any) => {
    setProjeto(prev => {
      const novasEtapas = prev.etapas.map(etapa => {
        if (etapa.id !== etapaId) return etapa;
        const novosItens = etapa.itens.map(item => {
          if (item.id !== itemId) return item;
          return { ...item, [campo]: valor };
        });
        return { ...etapa, itens: novosItens };
      });
      return { ...prev, etapas: novasEtapas };
    });
  };

  const removerItem = (etapaId: string, itemId: string) => {
    setProjeto(prev => {
      const novasEtapas = prev.etapas.map(etapa => {
        if (etapa.id !== etapaId) return etapa;
        return { ...etapa, itens: etapa.itens.filter(i => i.id !== itemId) };
      });
      return { ...prev, etapas: novasEtapas };
    });
  };

  const adicionarItemVazio = (etapaId: string) => {
    setProjeto(prev => {
      const novasEtapas = prev.etapas.map(etapa => {
        if (etapa.id !== etapaId) return etapa;
        const novoItemNumero = `${etapa.numero}.${etapa.itens.length + 1}`;
        const novoItem: ItemOrcamento = {
          id: `item-${Date.now()}`,
          itemNumero: novoItemNumero,
          codigo: 'PRÓPRIO',
          descricao: 'Novo Serviço de Construção Civil',
          unidade: 'm²',
          quantidade: 1.0,
          custoUnitario: 50.0
        };
        return { ...etapa, itens: [...etapa.itens, novoItem] };
      });
      return { ...prev, etapas: novasEtapas };
    });
  };

  const adicionarNovaEtapa = () => {
    const novoNum = projeto.etapas.length + 1;
    const novaEtapa: EtapaOrcamento = {
      id: `etapa-${Date.now()}`,
      numero: novoNum,
      nome: `${novoNum}. NOVA ETAPA CONSTRUTIVA`,
      itens: []
    };
    setProjeto(prev => ({
      ...prev,
      etapas: [...prev.etapas, novaEtapa]
    }));
  };

  const removerEtapa = (etapaId: string) => {
    if (confirm('Tem certeza que deseja remover esta etapa e todos os seus itens?')) {
      setProjeto(prev => ({
        ...prev,
        etapas: prev.etapas.filter(e => e.id !== etapaId)
      }));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Dados Gerais da Obra (Barra de Informações Editáveis) */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/60">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Ficha Técnica do Orçamento</span>
              <button
                type="button"
                onClick={() => setEditandoInfo(!editandoInfo)}
                className="text-xs text-amber-400 hover:text-amber-300 font-normal flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>{editandoInfo ? 'Concluir Edição' : 'Editar Dados'}</span>
              </button>
            </h3>
            <p className="text-xs text-slate-400">Identificação da obra, cliente, localização e parâmetros de metragem</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-md bg-slate-900 text-amber-400 font-mono font-bold border border-slate-700">
              {projeto.dataBase}
            </span>
          </div>
        </div>

        {editandoInfo ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-medium">Nome do Empreendimento</label>
              <input
                type="text"
                value={projeto.nome}
                onChange={e => setProjeto({ ...projeto, nome: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-medium">Cliente</label>
              <input
                type="text"
                value={projeto.cliente}
                onChange={e => setProjeto({ ...projeto, cliente: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-medium">Responsável Técnico (Engenheiro/Arquiteto)</label>
              <input
                type="text"
                value={projeto.responsavelTecnico}
                onChange={e => setProjeto({ ...projeto, responsavelTecnico: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-medium">Registro CREA / CAU</label>
              <input
                type="text"
                value={projeto.creaCau}
                onChange={e => setProjeto({ ...projeto, creaCau: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-medium">Área Construída Total (m²)</label>
              <input
                type="number"
                step="0.1"
                value={projeto.areaConstruidaM2}
                onChange={e => setProjeto({ ...projeto, areaConstruidaM2: parseFloat(e.target.value) || 1 })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1 font-medium">Local da Obra</label>
              <input
                type="text"
                value={projeto.local}
                onChange={e => setProjeto({ ...projeto, local: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3 text-xs">
            <div>
              <span className="text-slate-500 block">Obra:</span>
              <span className="font-semibold text-slate-200">{projeto.nome}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Cliente:</span>
              <span className="font-medium text-slate-300">{projeto.cliente}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Responsável / CREA:</span>
              <span className="font-medium text-slate-300">{projeto.responsavelTecnico} ({projeto.creaCau})</span>
            </div>
            <div>
              <span className="text-slate-500 block">Área & Custo Paramétrico:</span>
              <span className="font-semibold text-amber-400 font-mono">{projeto.areaConstruidaM2} m²</span>
            </div>
          </div>
        )}
      </div>

      {/* Planilha Orçamentária Principal */}
      <div className="space-y-4">
        {projeto.etapas.map((etapa) => {
          const isCollapsed = collapsedEtapas[etapa.id];
          
          let subtotalDiretoEtapa = 0;
          etapa.itens.forEach(i => subtotalDiretoEtapa += (i.quantidade * i.custoUnitario));
          const subtotalVendaEtapa = subtotalDiretoEtapa * fatorBdi;
          const pesoEtapa = totalGeralDireto > 0 ? (subtotalDiretoEtapa / totalGeralDireto) * 100 : 0;

          return (
            <div key={etapa.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              
              {/* Header da Etapa */}
              <div className="bg-slate-800/80 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleEtapa(etapa.id)}
                    className="p-1 text-slate-400 hover:text-white transition rounded"
                  >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <input
                    type="text"
                    value={etapa.nome}
                    onChange={e => {
                      const novoNome = e.target.value;
                      setProjeto(prev => ({
                        ...prev,
                        etapas: prev.etapas.map(et => et.id === etapa.id ? { ...et, nome: novoNome } : et)
                      }));
                    }}
                    className="bg-transparent font-bold text-sm text-amber-300 hover:bg-slate-700/50 rounded px-1.5 py-0.5 focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 max-w-sm sm:max-w-md"
                  />
                  <span className="text-[11px] font-mono text-slate-400 font-medium px-2 py-0.5 bg-slate-900 rounded border border-slate-800">
                    {pesoEtapa.toFixed(1)}% da obra
                  </span>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase block">Subtotal com BDI</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-400 font-mono">
                      {formatarMoeda(subtotalVendaEtapa)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onOpenSinapiSearch(etapa.id)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 px-2 py-1 rounded transition"
                      title="Inserir composição do banco SINAPI"
                    >
                      <HardHat className="w-3 h-3" />
                      <span>+ SINAPI</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => adicionarItemVazio(etapa.id)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2 py-1 rounded transition"
                      title="Adicionar item customizado"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Item</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => removerEtapa(etapa.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition"
                      title="Excluir etapa inteira"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabela de Itens da Etapa */}
              {!isCollapsed && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/40 text-[10px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800 font-mono">
                      <tr>
                        <th className="py-2.5 px-3 w-12 text-center">Item</th>
                        <th className="py-2.5 px-3 w-28">Código</th>
                        <th className="py-2.5 px-3">Descrição dos Serviços</th>
                        <th className="py-2.5 px-2 text-center w-14">Unid.</th>
                        <th className="py-2.5 px-3 text-right w-24">Qtd.</th>
                        <th className="py-2.5 px-3 text-right w-28">Custo Unit. (R$)</th>
                        <th className="py-2.5 px-3 text-right w-28">Total Direto (R$)</th>
                        <th className="py-2.5 px-3 text-right w-32">Total c/ BDI (R$)</th>
                        <th className="py-2.5 px-2 text-center w-20">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {etapa.itens.map((item) => {
                        const custoTotalItem = item.quantidade * item.custoUnitario;
                        const precoVendaItem = custoTotalItem * fatorBdi;

                        return (
                          <tr key={item.id} className="hover:bg-slate-800/30 transition group">
                            
                            {/* Item Number */}
                            <td className="py-2.5 px-3 text-center text-slate-400 font-semibold">
                              <input
                                type="text"
                                value={item.itemNumero}
                                onChange={e => atualizarItem(etapa.id, item.id, 'itemNumero', e.target.value)}
                                className="w-10 text-center bg-transparent border-b border-transparent hover:border-slate-700 focus:border-amber-500 focus:outline-none"
                              />
                            </td>

                            {/* Código (SINAPI / Próprio) */}
                            <td className="py-2.5 px-3">
                              <span className="text-[11px] font-bold text-amber-400/90 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 inline-block">
                                {item.codigo}
                              </span>
                            </td>

                            {/* Descrição */}
                            <td className="py-2.5 px-3 font-sans text-slate-200">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={item.descricao}
                                  onChange={e => atualizarItem(etapa.id, item.id, 'descricao', e.target.value)}
                                  className="w-full bg-transparent hover:bg-slate-800/60 rounded px-1.5 py-0.5 focus:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs"
                                />
                                {item.composicao && (
                                  <button
                                    type="button"
                                    onClick={() => onOpenCpuModal(item)}
                                    className="p-1 rounded text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 border border-blue-500/20 transition flex-shrink-0"
                                    title="Ver Composição de Preço Unitário (CPU) analítica"
                                  >
                                    <Layers className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* Unidade */}
                            <td className="py-2.5 px-2 text-center text-slate-400">
                              <input
                                type="text"
                                value={item.unidade}
                                onChange={e => atualizarItem(etapa.id, item.id, 'unidade', e.target.value)}
                                className="w-12 text-center bg-transparent hover:bg-slate-800/60 rounded py-0.5"
                              />
                            </td>

                            {/* Quantidade */}
                            <td className="py-2.5 px-3 text-right">
                              <input
                                type="number"
                                step="0.01"
                                value={item.quantidade}
                                onChange={e => atualizarItem(etapa.id, item.id, 'quantidade', parseFloat(e.target.value) || 0)}
                                className="w-20 text-right bg-slate-800/60 border border-slate-700/60 focus:border-amber-500 rounded px-1.5 py-0.5 text-xs text-amber-300 font-mono"
                              />
                            </td>

                            {/* Custo Unitário Direto */}
                            <td className="py-2.5 px-3 text-right">
                              <input
                                type="number"
                                step="0.01"
                                value={item.custoUnitario}
                                onChange={e => atualizarItem(etapa.id, item.id, 'custoUnitario', parseFloat(e.target.value) || 0)}
                                className="w-24 text-right bg-slate-800/60 border border-slate-700/60 focus:border-amber-500 rounded px-1.5 py-0.5 text-xs text-slate-200 font-mono"
                              />
                            </td>

                            {/* Total Direto */}
                            <td className="py-2.5 px-3 text-right font-bold text-slate-200">
                              {formatarMoeda(custoTotalItem)}
                            </td>

                            {/* Total com BDI */}
                            <td className="py-2.5 px-3 text-right font-extrabold text-emerald-400">
                              {formatarMoeda(precoVendaItem)}
                            </td>

                            {/* Ações */}
                            <td className="py-2.5 px-2 text-center">
                              <div className="flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={() => onOpenCpuModal(item)}
                                  className="p-1 text-slate-400 hover:text-blue-400 transition"
                                  title="Composição Unitária (CPU)"
                                >
                                  <Layers className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removerItem(etapa.id, item.id)}
                                  className="p-1 text-slate-500 hover:text-rose-400 transition"
                                  title="Remover item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        );
                      })}

                      {etapa.itens.length === 0 && (
                        <tr>
                          <td colSpan={9} className="py-6 text-center text-slate-500">
                            Nenhum item adicionado nesta etapa ainda. Clique em <strong>+ SINAPI</strong> ou <strong>Item</strong> para adicionar.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}

        {/* Botão Adicionar Nova Etapa */}
        <button
          type="button"
          onClick={adicionarNovaEtapa}
          className="w-full py-3.5 border-2 border-dashed border-slate-800 hover:border-amber-500/60 rounded-xl text-xs font-bold text-slate-400 hover:text-amber-400 flex items-center justify-center gap-2 bg-slate-900/40 hover:bg-slate-900 transition"
        >
          <FolderPlus className="w-4 h-4" />
          <span>ADICIONAR NOVA ETAPA CONSTRUTIVA</span>
        </button>
      </div>

    </div>
  );
};
