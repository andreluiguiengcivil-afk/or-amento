import React from 'react';
import { 
  Boxes, 
  Layers, 
  Database, 
  FileSpreadsheet, 
  Activity, 
  ChevronRight, 
  Calendar, 
  Search, 
  Percent, 
  DollarSign, 
  ClipboardList, 
  Edit3, 
  MessageCircle, 
  Users,
  HardHat,
  TrendingUp,
  Package,
  Building2
} from 'lucide-react';

interface LeftSidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  isOpen: boolean;
  onOpenMedicoes: () => void;
  onOpenSinapiUpdater: () => void;
  onNovoOrcamento: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  activeView,
  setActiveView,
  isOpen,
  onOpenMedicoes,
  onOpenSinapiUpdater,
  onNovoOrcamento
}) => {
  if (!isOpen) return null;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col flex-shrink-0 z-30 shadow-xl min-h-[calc(100vh-56px)] select-none animate-fade-in">
      
      {/* Header do Menu Lateral */}
      <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardHat className="w-4 h-4 text-amber-400" />
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 font-sans">
            MÓDULOS DE ENGENHARIA
          </span>
        </div>
        <span className="text-[9px] font-mono font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20">
          PRO
        </span>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 py-3 px-3 space-y-4 overflow-y-auto text-xs font-semibold">
        
        {/* GRUPO 1: Insumos & Fornecedores */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-1">
            Insumos & Fornecedores
          </span>

          {/* BANCO DE INSUMOS (SINAPI & FORNECEDORES) */}
          <button
            type="button"
            onClick={() => setActiveView('insumos-editar')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
              activeView === 'insumos-editar' 
                ? 'bg-amber-400 text-slate-950 font-black shadow-sm' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Boxes className={`w-4 h-4 ${activeView === 'insumos-editar' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>Banco de Insumos</span>
            </div>
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${activeView === 'insumos-editar' ? 'bg-slate-900 text-amber-300' : 'bg-slate-800 text-slate-400'}`}>
              SINAPI & FORN
            </span>
          </button>

          {/* PÁGINA DE FORNECEDORES */}
          <button
            type="button"
            onClick={() => setActiveView('insumos-fornecedores')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
              activeView === 'insumos-fornecedores' 
                ? 'bg-slate-800 text-amber-400 font-black border border-amber-400/30' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Building2 className={`w-4 h-4 ${activeView === 'insumos-fornecedores' ? 'text-amber-400' : 'text-amber-300'}`} />
              <span>Fornecedores</span>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-300">
              CADASTRO
            </span>
          </button>

          {/* CADASTRAR PREÇO DE FORNECEDOR */}
          <button
            type="button"
            onClick={() => setActiveView('insumos-precos')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
              activeView === 'insumos-precos' 
                ? 'bg-emerald-600 text-white font-black shadow-sm' 
                : 'text-emerald-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <DollarSign className={`w-4 h-4 ${activeView === 'insumos-precos' ? 'text-white' : 'text-emerald-400'}`} />
              <span>Preços Fornecedor</span>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300">
              MULTI-BASE
            </span>
          </button>

          {/* INSUMOS GENÉRICOS & LISTA FINAL POR FORNECEDOR */}
          <button
            type="button"
            onClick={() => setActiveView('insumos-genericos')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
              activeView === 'insumos-genericos' 
                ? 'bg-emerald-600 text-white font-black shadow-sm' 
                : 'text-emerald-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Users className={`w-4 h-4 ${activeView === 'insumos-genericos' ? 'text-white' : 'text-emerald-400'} stroke-[2.2]`} />
              <span>Insumos Genéricos (RFQ)</span>
            </div>
            <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${activeView === 'insumos-genericos' ? 'bg-emerald-950 text-emerald-200' : 'bg-emerald-500/20 text-emerald-300'}`}>
              COTAÇÃO
            </span>
          </button>

          {/* 4 Cartões Amarelos & Pastas */}
          <button
            type="button"
            onClick={() => setActiveView('insumos-novo')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
              activeView === 'insumos-novo' 
                ? 'bg-amber-400 text-slate-950 font-black shadow-sm' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Boxes className={`w-4 h-4 ${activeView === 'insumos-novo' ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>4 Cartões Amarelos</span>
            </div>
            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${activeView === 'insumos-novo' ? 'bg-slate-900 text-amber-300' : 'bg-amber-400/10 text-amber-300'}`}>
              PASTAS
            </span>
          </button>

          {/* COTAÇÃO RÁPIDA WHATSAPP */}
          <button
            type="button"
            onClick={() => setActiveView('insumos-novo')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-4 h-4 text-emerald-400 stroke-[2.2]" />
              <span>Cotação Direta WhatsApp</span>
            </div>
          </button>

          {/* Catálogo SINAPI */}
          <button
            type="button"
            onClick={() => setActiveView('insumos-pesquisar')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
              activeView === 'insumos-pesquisar' || activeView === 'sinapi'
                ? 'bg-slate-800 text-amber-400 font-bold border border-slate-700' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Catálogo SINAPI Caixa</span>
            </div>
          </button>
        </div>

        {/* GRUPO 2: Orçamentos & Custos */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-1">
            Orçamentos & Custos
          </span>

          <button
            type="button"
            onClick={() => setActiveView('orcamentos-lista')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
              activeView === 'orcamentos-lista' || activeView === 'dashboard'
                ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-sm' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>Painel de Orçamentos</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            type="button"
            onClick={() => setActiveView('planilha-orcamentaria')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
              activeView === 'planilha-orcamentaria'
                ? 'bg-slate-800 text-white font-bold border border-slate-700 shadow-sm' 
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Planilha Orçamentária</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('curva-abc')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
              activeView === 'curva-abc'
                ? 'bg-slate-800 text-rose-400 font-bold border border-slate-700' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-4 h-4 text-rose-400" />
              <span>Curva ABC (Pareto)</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('cronograma')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
              activeView === 'cronograma'
                ? 'bg-slate-800 text-blue-400 font-bold border border-slate-700' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span>Cronograma Físico-Financeiro</span>
            </div>
          </button>
        </div>

        {/* GRUPO 3: Medições & Gestão de Obra */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-1">
            Campo & Acompanhamento
          </span>

          <button
            type="button"
            onClick={onOpenMedicoes}
            className="w-full py-2.5 px-3 rounded-xl bg-teal-800 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition flex items-center justify-center gap-2 border border-teal-600/40 cursor-pointer"
          >
            <ClipboardList className="w-4 h-4 stroke-[2.2]" />
            <span>MÓDULO DE MEDIÇÕES</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('gestao-obras')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer ${
              activeView === 'gestao-obras' 
                ? 'bg-slate-800 text-cyan-400 font-bold border border-slate-700' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Acompanhamento Físico</span>
            </div>
          </button>
        </div>

        {/* GRUPO 4: Parâmetros Técnicos */}
        <div className="border-t border-slate-800 pt-3 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-1">
            Parâmetros & Bases
          </span>

          <button
            type="button"
            onClick={() => setActiveView('encargos-sociais')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>Encargos Sociais</span>
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenSinapiUpdater}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Atualizar Base SINAPI</span>
            </div>
          </button>
        </div>

      </div>

      {/* Footer do Menu */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-500 flex items-center justify-between">
        <span>ORÇAPRO Engenharia</span>
        <span className="font-mono text-slate-600">v2.5</span>
      </div>

    </aside>
  );
};
