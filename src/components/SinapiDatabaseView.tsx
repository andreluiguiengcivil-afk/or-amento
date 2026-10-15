import React, { useState } from 'react';
import { Search, HardHat, Layers, Package, User, Wrench, Plus, Check, RefreshCw } from 'lucide-react';
import { BANCO_SINAPI } from '../data/sinapiDatabase';
import { ComposicaoPreco, ProjetoOrcamento, ItemOrcamento } from '../types/orcamento';
import { formatarMoeda } from '../utils/bdiCalculator';

interface SinapiDatabaseViewProps {
  projeto: ProjetoOrcamento;
  setProjeto: React.Dispatch<React.SetStateAction<ProjetoOrcamento>>;
  onOpenCpuModal: (item: ItemOrcamento) => void;
  onOpenSinapiUpdater: () => void;
}

export const SinapiDatabaseView: React.FC<SinapiDatabaseViewProps> = ({
  projeto,
  setProjeto,
  onOpenCpuModal,
  onOpenSinapiUpdater
}) => {
  const [busca, setBusca] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState<string>('TODAS');
  const [etapaDestinoId, setEtapaDestinoId] = useState<string>(projeto.etapas[0]?.id || '');
  const [itemAdicionado, setItemAdicionado] = useState<string | null>(null);

  const categorias = [
    'TODAS',
    'SERVIÇOS PRELIMINARES',
    'MOVIMENTO DE TERRA E FUNDAÇÃO',
    'ESTRUTURA (CONCRETO ARMADO)',
    'ALVENARIAS E VEDAÇÕES',
    'COBERTURA E TELHADO',
    'REVESTIMENTOS',
    'PINTURA',
    'ESQUADRIAS',
    'INSTALAÇÕES'
  ];

  const itensFiltrados = BANCO_SINAPI.filter(comp => {
    const matchBusca = comp.descricao.toLowerCase().includes(busca.toLowerCase()) ||
                       comp.codigo.toLowerCase().includes(busca.toLowerCase());
    return matchBusca;
  });

  const adicionarAoOrcamento = (comp: ComposicaoPreco) => {
    if (!etapaDestinoId) return;

    setProjeto(prev => {
      const novasEtapas = prev.etapas.map(etapa => {
        if (etapa.id !== etapaDestinoId) return etapa;
        const novoItemNum = `${etapa.numero}.${etapa.itens.length + 1}`;
        const novoItem: ItemOrcamento = {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          itemNumero: novoItemNum,
          codigo: comp.codigo,
          descricao: comp.descricao,
          unidade: comp.unidade,
          quantidade: 1.0,
          custoUnitario: comp.custoUnitarioDireto,
          composicao: comp
        };
        return { ...etapa, itens: [...etapa.itens, novoItem] };
      });
      return { ...prev, etapas: novasEtapas };
    });

    setItemAdicionado(comp.codigo);
    setTimeout(() => setItemAdicionado(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HardHat className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Banco Oficial de Composições SINAPI (Caixa Econômica)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sistema Nacional de Pesquisa de Custos e Índices da Construção Civil com desagregação de insumos, coeficientes e custos horários.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Botão de Atualização da Base */}
          <button
            type="button"
            onClick={onOpenSinapiUpdater}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 text-xs font-bold transition shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Atualizar Base Caixa / Estado</span>
          </button>

          {/* Destino de inserção rápida */}
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-300 font-medium">Inserir na Etapa:</span>
            <select
              value={etapaDestinoId}
              onChange={e => setEtapaDestinoId(e.target.value)}
              className="bg-slate-900 text-xs font-semibold text-amber-400 rounded-lg px-2.5 py-1 border border-slate-700"
            >
              {projeto.etapas.map(et => (
                <option key={et.id} value={et.id}>{et.nome}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquise por código SINAPI (ex: 98459, 92762) ou palavras-chave (concreto, tubo, viga, porcelanato, telha, pintura)..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Grid de Composições */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {itensFiltrados.map((comp) => {
          const foiAdicionado = itemAdicionado === comp.codigo;

          return (
            <div
              key={comp.codigo}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between gap-4 transition shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    {comp.codigo}
                  </span>
                  <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono font-semibold">
                    {comp.unidade}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-white leading-relaxed">
                  {comp.descricao}
                </h3>

                {/* Subtotais Material / Mão de Obra */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] font-mono">
                  <div className="bg-slate-800/60 p-1.5 rounded border border-slate-800 text-slate-300">
                    <span className="text-[10px] text-slate-500 block">Material</span>
                    <strong className="text-emerald-400">{formatarMoeda(comp.custoMaterial)}</strong>
                  </div>
                  <div className="bg-slate-800/60 p-1.5 rounded border border-slate-800 text-slate-300">
                    <span className="text-[10px] text-slate-500 block">Mão de Obra</span>
                    <strong className="text-blue-400">{formatarMoeda(comp.custoMaoDeObra)}</strong>
                  </div>
                  <div className="bg-slate-800/60 p-1.5 rounded border border-slate-800 text-slate-300">
                    <span className="text-[10px] text-slate-500 block">Equipamento</span>
                    <strong className="text-amber-400">{formatarMoeda(comp.custoEquipamento)}</strong>
                  </div>
                </div>

                {/* Insumos preview */}
                <div className="pt-2 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300 block mb-1">Insumos da Composição ({comp.insumos.length}):</span>
                  <div className="space-y-0.5 max-h-24 overflow-y-auto pr-1">
                    {comp.insumos.map((ins, i) => (
                      <div key={i} className="flex items-center justify-between text-[10px]">
                        <span className="truncate max-w-[200px] text-slate-400">• {ins.descricao}</span>
                        <span className="font-mono text-slate-500">{ins.coeficiente} {ins.unidade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botões e Preço Unitário */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-medium">Custo Unitário Direto</span>
                  <span className="text-sm font-bold text-white font-mono">
                    {formatarMoeda(comp.custoUnitarioDireto)} <span className="text-xs text-slate-400 font-normal">/{comp.unidade}</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => adicionarAoOrcamento(comp)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
                      foiAdicionado
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                    }`}
                  >
                    {foiAdicionado ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Plus className="w-3.5 h-3.5 stroke-[2.5]" />}
                    <span>{foiAdicionado ? 'Adicionado!' : 'Inserir na Planilha'}</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
