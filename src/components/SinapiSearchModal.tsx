import React, { useState } from 'react';
import { X, Search, Plus, HardHat, Check, ArrowRight } from 'lucide-react';
import { BANCO_SINAPI } from '../data/sinapiDatabase';
import { ComposicaoPreco, EtapaOrcamento } from '../types/orcamento';
import { formatarMoeda } from '../utils/bdiCalculator';

interface SinapiSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  etapas: EtapaOrcamento[];
  onSelectItem: (etapaId: string, composicao: ComposicaoPreco) => void;
  defaultEtapaId?: string;
}

export const SinapiSearchModal: React.FC<SinapiSearchModalProps> = ({
  isOpen,
  onClose,
  etapas,
  onSelectItem,
  defaultEtapaId
}) => {
  const [termo, setTermo] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState<string>('TODOS');
  const [selectedEtapaId, setSelectedEtapaId] = useState<string>(defaultEtapaId || etapas[0]?.id || '');

  React.useEffect(() => {
    if (defaultEtapaId) setSelectedEtapaId(defaultEtapaId);
  }, [defaultEtapaId, isOpen]);

  if (!isOpen) return null;

  const itensFiltrados = BANCO_SINAPI.filter(c => {
    const matchTermo = c.descricao.toLowerCase().includes(termo.toLowerCase()) ||
                       c.codigo.toLowerCase().includes(termo.toLowerCase());
    return matchTermo;
  });

  const handleInserir = (comp: ComposicaoPreco) => {
    if (!selectedEtapaId && etapas.length > 0) {
      onSelectItem(etapas[0].id, comp);
    } else {
      onSelectItem(selectedEtapaId, comp);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Catálogo de Composições SINAPI Caixa</h2>
              <p className="text-xs text-slate-400">Pesquise composições de custos unitários e insira na planilha</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Destination Stage */}
        <div className="p-6 pb-2 border-b border-slate-800/80 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ex: 98459, concreto, porcelanato, aço CA-50, alvenaria..."
                value={termo}
                onChange={e => setTermo(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                autoFocus
              />
            </div>

            {/* Target Etapa Select */}
            <div className="sm:w-64">
              <select
                value={selectedEtapaId}
                onChange={e => setSelectedEtapaId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
              >
                {etapas.map(etapa => (
                  <option key={etapa.id} value={etapa.id}>
                    Destino: {etapa.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
            <span>Encontrados <strong>{itensFiltrados.length}</strong> itens no catálogo</span>
            <span className="text-[11px] text-amber-400/90 font-mono">Bases de Preço Referenciais SINAPI</span>
          </div>
        </div>

        {/* Items List */}
        <div className="p-6 space-y-3 overflow-y-auto max-h-[500px]">
          {itensFiltrados.map((comp) => (
            <div
              key={comp.codigo}
              className="bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/70 hover:border-amber-500/50 rounded-xl p-4 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-bold">
                    {comp.codigo}
                  </span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-semibold">
                    Unidade: {comp.unidade}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {comp.insumos.length} insumos analíticos
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                  {comp.descricao}
                </h4>
                
                {/* Detalhe de Material e Mão de Obra */}
                <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-1">
                  <span>Mat: <strong className="text-emerald-400">{formatarMoeda(comp.custoMaterial)}</strong></span>
                  <span>M.O.: <strong className="text-blue-400">{formatarMoeda(comp.custoMaoDeObra)}</strong></span>
                  {comp.custoEquipamento > 0 && (
                    <span>Equip: <strong className="text-amber-400">{formatarMoeda(comp.custoEquipamento)}</strong></span>
                  )}
                </div>
              </div>

              {/* Price and Insert Button */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-700/60">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] uppercase text-slate-400 block">Custo Direto</span>
                  <span className="text-base font-extrabold text-amber-400 font-mono">
                    {formatarMoeda(comp.custoUnitarioDireto)} <span className="text-xs text-slate-400 font-normal">/{comp.unidade}</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleInserir(comp)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold transition shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Adicionar ao Orçamento</span>
                </button>
              </div>
            </div>
          ))}

          {itensFiltrados.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Search className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm">Nenhuma composição encontrada para "{termo}".</p>
              <p className="text-xs text-slate-500 mt-1">Tente pesquisar por termos mais gerais como "concreto", "argamassa", "pintura" ou código numérico.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
