import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Plus, 
  Search, 
  Layers, 
  Upload, 
  ArrowRight, 
  TrendingUp, 
  Calendar, 
  HardHat, 
  Percent, 
  CheckCircle2, 
  ExternalLink,
  DollarSign,
  FolderOpen,
  Boxes
} from 'lucide-react';
import { ProjetoOrcamento } from '../types/orcamento';
import { calcularTaxaBDI, formatarMoeda } from '../utils/bdiCalculator';

interface SeobraDashboardProps {
  projeto: ProjetoOrcamento;
  setProjeto: React.Dispatch<React.SetStateAction<ProjetoOrcamento>>;
  onOpenPlanilha: () => void;
  onOpenNovoOrcamento: () => void;
  onOpenImportar: () => void;
  onOpenSinapiUpdater: () => void;
  onOpenBdi: () => void;
  onOpenCurvaAbc: () => void;
  onOpenCronograma: () => void;
  onOpenPesquisaInsumos: () => void;
}

export const SeobraDashboardView: React.FC<SeobraDashboardProps> = ({
  projeto,
  setProjeto,
  onOpenPlanilha,
  onOpenNovoOrcamento,
  onOpenImportar,
  onOpenSinapiUpdater,
  onOpenBdi,
  onOpenCurvaAbc,
  onOpenCronograma,
  onOpenPesquisaInsumos
}) => {
  const [dragOver, setDragOver] = useState(false);
  const taxaBdi = calcularTaxaBDI(projeto.bdiConfig);
  const fatorBdi = 1 + (taxaBdi / 100);

  let totalDireto = 0;
  projeto.etapas.forEach(e => e.itens.forEach(i => totalDireto += (i.quantidade * i.custoUnitario)));
  const totalComBdi = totalDireto * fatorBdi;
  const totalItens = projeto.etapas.reduce((acc, e) => acc + e.itens.length, 0);

  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      
      {/* 1. SEÇÃO PRINCIPAL: PAINEL DE ORÇAMENTOS & OBRAS */}
      <div className="space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-900 text-amber-400 rounded-xl border border-slate-700">
              <FileSpreadsheet className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Painel de Orçamentos
              </h2>
              <p className="text-xs text-slate-500">
                Gerencie, crie e importe suas planilhas de obras de construção civil
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-600 font-medium">
              Data-base: <strong className="text-slate-800 font-mono">{projeto.dataBase}</strong>
            </span>
          </div>
        </div>

        {/* Grid de Cards de Orçamentos */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Card 1: LISTAR ORÇAMENTOS */}
          <div
            onClick={onOpenPlanilha}
            className="cursor-pointer bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-amber-400 rounded-2xl p-6 transition-all duration-200 shadow-sm flex flex-col justify-between group min-h-[160px]"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-amber-50 text-amber-700 rounded-xl group-hover:bg-amber-400 group-hover:text-slate-950 transition">
                <Search className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-amber-800">
                {projeto.etapas.length} Etapas
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block mb-0.5">
                VISUALIZAR PLANILHA
              </span>
              <h3 className="text-base font-black text-slate-800 group-hover:text-teal-700 transition">
                LISTAR ORÇAMENTOS
              </h3>
            </div>
          </div>

          {/* Card 2: CRIAR NOVO ORÇAMENTO */}
          <div
            onClick={onOpenNovoOrcamento}
            className="cursor-pointer bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-teal-500 rounded-2xl p-6 transition-all duration-200 shadow-sm flex flex-col justify-between group min-h-[160px]"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition">
                <Plus className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Novo
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block mb-0.5">
                DO ZERO OU MODELO
              </span>
              <h3 className="text-base font-black text-slate-800 group-hover:text-teal-700 transition">
                CRIAR ORÇAMENTO
              </h3>
            </div>
          </div>

          {/* Card 3: UNIÃO DE ORÇAMENTOS */}
          <div
            onClick={() => alert('Módulo de União de Orçamentos: Permite consolidar múltiplos lotes ou sub-orçamentos em uma planilha máster.')}
            className="cursor-pointer bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-teal-500 rounded-2xl p-6 transition-all duration-200 shadow-sm flex flex-col justify-between group min-h-[160px]"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 bg-teal-50 text-teal-600 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition">
                <Layers className="w-6 h-6 stroke-[2.2]" />
              </div>
              <span className="text-xs font-mono font-bold text-slate-400">
                Multi-obras
              </span>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 block mb-0.5">
                CONSOLIDAÇÃO
              </span>
              <h3 className="text-base font-black text-slate-800 group-hover:text-teal-700 transition">
                UNIÃO DE ORÇAMENTOS
              </h3>
            </div>
          </div>

          {/* Card 4: IMPORTAÇÃO DE PLANILHAS (BOX COM ARRASTE E SOLTE) */}
          <div
            onClick={onOpenImportar}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); onOpenImportar(); }}
            className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 transition-all flex flex-col items-center justify-center text-center min-h-[160px] ${
              dragOver 
                ? 'border-teal-600 bg-teal-50 text-teal-900' 
                : 'border-slate-300 hover:border-teal-500 bg-slate-50/50 hover:bg-slate-50 text-slate-600'
            }`}
          >
            <div className="p-3 bg-white text-teal-600 rounded-xl shadow-sm mb-2 border border-slate-200">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              Importação de planilhas
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Arraste e solte sua planilha Excel aqui (.xlsx / .csv)
            </p>
          </div>

        </div>
      </div>

      {/* 2. CARD DO ORÇAMENTO ATIVO EM DESTAQUE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded font-mono font-bold bg-teal-100 text-teal-800 text-[10px] uppercase">
                EM ANDAMENTO
              </span>
              <h3 className="text-lg font-bold text-slate-800">
                {projeto.nome}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Cliente: <strong>{projeto.cliente}</strong> • Resp. Técnico: <strong>{projeto.responsavelTecnico}</strong> ({projeto.creaCau})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenPlanilha}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <span>Abrir Planilha Orçamentária</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metadados e Valores */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Total Custo Direto</span>
            <span className="text-base sm:text-lg font-black text-slate-800 font-mono mt-0.5 block">
              {formatarMoeda(totalDireto)}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Taxa BDI (TCU 2622)</span>
            <span 
              onClick={onOpenBdi}
              className="text-base sm:text-lg font-black text-amber-600 font-mono mt-0.5 block cursor-pointer hover:underline"
            >
              {taxaBdi.toFixed(2)}%
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Preço Global com BDI</span>
            <span className="text-base sm:text-lg font-black text-teal-700 font-mono mt-0.5 block">
              {formatarMoeda(totalComBdi)}
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 uppercase block">Área & Custo/m²</span>
            <span className="text-base sm:text-lg font-black text-slate-800 font-mono mt-0.5 block">
              {formatarMoeda(totalComBdi / projeto.areaConstruidaM2)} <span className="text-xs font-normal text-slate-500">/m²</span>
            </span>
          </div>
        </div>

        {/* Atalhos Rápidos de Engenharia */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mt-4 border-t border-slate-100 text-xs">
          <button
            type="button"
            onClick={onOpenCurvaAbc}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold transition"
          >
            <span className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-500" />
              <span>Curva ABC (Pareto 80/20)</span>
            </span>
            <span className="text-slate-400">Ver gráfico →</span>
          </button>

          <button
            type="button"
            onClick={onOpenCronograma}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold transition"
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>Cronograma & Curva S</span>
            </span>
            <span className="text-slate-400">6 meses →</span>
          </button>

          <button
            type="button"
            onClick={onOpenBdi}
            className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-semibold transition"
          >
            <span className="flex items-center gap-2">
              <Percent className="w-4 h-4 text-amber-500" />
              <span>Composições BDI Oficial TCU</span>
            </span>
            <span className="text-slate-400">Editar →</span>
          </button>
        </div>
      </div>

      {/* 3. SEÇÃO INSUMOS & COMPOSIÇÕES (SINAPI + PRÓPRIOS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-teal-50 text-teal-700 rounded-lg border border-teal-200">
              <Boxes className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                Insumos & Composições
              </h2>
              <p className="text-xs text-slate-500">
                Banco oficial SINAPI Caixa com custos desonerados e não-desonerados
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenPesquisaInsumos}
            className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>Ver Catálogo Completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={onOpenPesquisaInsumos}
            className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-3 transition"
          >
            <div className="p-2.5 bg-teal-50 text-teal-700 rounded-xl">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Listar / Pesquisar</h4>
              <p className="text-[11px] text-slate-500">Mais de 40 composições SINAPI</p>
            </div>
          </div>

          <div
            onClick={onOpenSinapiUpdater}
            className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-3 transition"
          >
            <div className="p-2.5 bg-cyan-50 text-cyan-700 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Localizar Versão</h4>
              <p className="text-[11px] text-slate-500">Bases estaduais mensais da Caixa</p>
            </div>
          </div>

          <div
            onClick={onOpenImportar}
            className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-3 transition"
          >
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
              <HardHat className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800">Importar Insumos Próprios</h4>
              <p className="text-[11px] text-slate-500">Adicione cotações da sua construtora</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
