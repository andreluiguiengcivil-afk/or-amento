import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  Plus, 
  Search, 
  Calendar, 
  Database, 
  Upload, 
  Trash2, 
  FileSpreadsheet, 
  Layers, 
  Percent, 
  DollarSign, 
  Calculator, 
  FileText, 
  Tag, 
  Folder, 
  Boxes, 
  Menu,
  Sparkles,
  HardHat,
  Edit3,
  Users,
  ClipboardList,
  TrendingUp,
  Activity,
  Building2
} from 'lucide-react';
import { ProjetoOrcamento } from '../types/orcamento';
import { calcularTaxaBDI, formatarMoeda } from '../utils/bdiCalculator';

interface NavigationProps {
  projeto: ProjetoOrcamento;
  setProjeto: React.Dispatch<React.SetStateAction<ProjetoOrcamento>>;
  activeView: string;
  setActiveView: (view: string) => void;
  onOpenBdiModal: () => void;
  onOpenSinapiUpdater: () => void;
  onOpenAiModal: () => void;
  onNovoOrcamento: () => void;
  onImportarPlanilha: () => void;
  onNovoInsumo: () => void;
  onExportarExcel: () => void;
  onExportarPdf: () => void;
  onOpenMedicoes?: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const TopNavBar: React.FC<NavigationProps> = ({
  projeto,
  activeView,
  setActiveView,
  onOpenBdiModal,
  onOpenSinapiUpdater,
  onOpenAiModal,
  onNovoOrcamento,
  onImportarPlanilha,
  onNovoInsumo,
  onExportarExcel,
  onExportarPdf,
  onOpenMedicoes,
  sidebarOpen,
  setSidebarOpen
}) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Totais rápidos
  const taxaBdi = calcularTaxaBDI(projeto.bdiConfig);
  const fatorBdi = 1 + (taxaBdi / 100);

  let totalDireto = 0;
  projeto.etapas.forEach(e => e.itens.forEach(i => totalDireto += (i.quantidade * i.custoUnitario)));
  const totalComBdi = totalDireto * fatorBdi;

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(prev => (prev === name ? null : name));
  };

  const handleItemClick = (action: () => void) => {
    action();
    setOpenDropdown(null);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 text-slate-100 shadow-md select-none" ref={dropdownRef}>
      
      {/* Barra Superior - Identidade Própria ORÇAPRO */}
      <div className="flex items-center justify-between px-3 sm:px-6 h-14">
        
        {/* Esquerda: Toggle Menu + Logo Próprio */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="Abrir/Fechar Menu Lateral"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo Brand Própria */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group" 
            onClick={() => setActiveView('orcamentos-lista')}
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-slate-950 shadow-md shadow-amber-400/20 group-hover:scale-105 transition-transform">
              <HardHat className="w-5 h-5 stroke-[2.4]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5 leading-none">
                <span className="text-lg font-black tracking-tight text-white font-sans">
                  ORÇA<span className="text-amber-400">PRO</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 font-mono tracking-wider">
                  Engenharia
                </span>
              </div>
              <span className="text-[9px] text-slate-400 tracking-wide font-medium mt-0.5 hidden sm:block">
                Gestão de Custos & Obras
              </span>
            </div>
          </div>
        </div>

        {/* Centro: Menus com Estilo Próprio (Sem BIM, Sem Cursos, Sem Planos) */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-200">
          
          {/* 1. ABA: Insumos & Fornecedores */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('insumos')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition cursor-pointer ${
                openDropdown === 'insumos' || activeView.startsWith('insumos') 
                  ? 'bg-slate-800 text-amber-400 font-bold' 
                  : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
              }`}
            >
              <span>Insumos & Cotações</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {openDropdown === 'insumos' && (
              <div className="absolute left-0 mt-1 w-64 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-1.5 z-50 animate-fade-in text-slate-200 text-xs">
                
                <button
                  type="button"
                  onClick={() => handleItemClick(() => setActiveView('insumos-editar'))}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left font-bold text-amber-300 cursor-pointer"
                >
                  <Boxes className="w-4 h-4 text-amber-400" />
                  <span>Banco de Insumos (SINAPI & Fornecedores)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleItemClick(() => setActiveView('insumos-fornecedores'))}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left font-bold text-slate-100 hover:text-amber-400 cursor-pointer"
                >
                  <Building2 className="w-4 h-4 text-amber-400" />
                  <span>Página de Fornecedores (Contatos & Endereço)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleItemClick(() => setActiveView('insumos-precos'))}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left font-bold text-emerald-400 cursor-pointer"
                >
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Cadastrar Preço de Fornecedor</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleItemClick(() => { onNovoInsumo(); setActiveView('insumos-novo'); })}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left font-medium hover:text-amber-400 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>4 Cartões Amarelos & Pastas</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleItemClick(() => setActiveView('insumos-pesquisar'))}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left font-medium hover:text-white cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-400" />
                  <span>Catálogo de Insumos SINAPI</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleItemClick(() => onOpenSinapiUpdater())}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left font-medium hover:text-white cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Bases Estaduais SINAPI Caixa</span>
                </button>

                <div className="my-1 border-t border-slate-800 px-4 pt-2 pb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Gestão Própria</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleItemClick(() => setActiveView('fontes-proprias'))}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left font-medium hover:text-white cursor-pointer"
                >
                  <Database className="w-4 h-4 text-slate-400" />
                  <span>Pastas de Fornecedores</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleItemClick(() => onImportarPlanilha())}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left font-medium hover:text-white cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span>Importar Planilha de Insumos</span>
                </button>
              </div>
            )}
          </div>

          {/* 2. ABA: Orçamentos */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('orcamentos')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition cursor-pointer ${
                openDropdown === 'orcamentos' || activeView.startsWith('orcamento') || activeView === 'planilha-orcamentaria'
                  ? 'bg-slate-800 text-amber-400 font-bold' 
                  : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
              }`}
            >
              <span>Orçamentos</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {openDropdown === 'orcamentos' && (
              <div className="absolute left-0 mt-1 w-60 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-1.5 z-50 animate-fade-in text-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => handleItemClick(() => onNovoOrcamento())}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left font-medium hover:text-amber-400 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Novo Orçamento</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleItemClick(() => setActiveView('orcamentos-lista'))}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left font-medium hover:text-white cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                  <span>Painel de Obras & Orçamentos</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleItemClick(() => setActiveView('planilha-orcamentaria'))}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left font-medium hover:text-white cursor-pointer"
                >
                  <Layers className="w-4 h-4 text-slate-400" />
                  <span>Planilha Orçamentária</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleItemClick(() => onImportarPlanilha())}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left font-medium hover:text-white cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span>Importar Planilha Excel / SINAPI</span>
                </button>
                
                <div className="my-1 border-t border-slate-800"></div>

                <button
                  type="button"
                  onClick={() => handleItemClick(() => setActiveView('curva-abc'))}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left font-medium hover:text-rose-400 cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4 text-rose-400" />
                  <span>Curva ABC (Pareto)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleItemClick(() => setActiveView('cronograma'))}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left font-medium hover:text-blue-400 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-blue-400" />
                  <span>Cronograma Físico-Financeiro</span>
                </button>
              </div>
            )}
          </div>

          {/* 3. ABA: Parâmetros Técnicos & BDI */}
          <div className="relative">
            <button
              type="button"
              onClick={() => toggleDropdown('cadastros')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition cursor-pointer ${
                openDropdown === 'cadastros' || ['encargos-sociais', 'formulas-memoria', 'memorial-descritivo'].includes(activeView)
                  ? 'bg-slate-800 text-amber-400 font-bold' 
                  : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
              }`}
            >
              <span>Parâmetros Técnicos</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {openDropdown === 'cadastros' && (
              <div className="absolute left-0 mt-1 w-64 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-1.5 z-50 animate-fade-in text-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => handleItemClick(() => onOpenBdiModal())}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left font-medium hover:text-amber-400 cursor-pointer"
                >
                  <Percent className="w-4 h-4 text-amber-400" />
                  <span>Composição BDI (TCU 2622)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleItemClick(() => setActiveView('encargos-sociais'))}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left font-medium hover:text-emerald-400 cursor-pointer"
                >
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Encargos Sociais da Construção</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleItemClick(() => setActiveView('formulas-memoria'))}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left font-medium hover:text-blue-400 cursor-pointer"
                >
                  <Calculator className="w-4 h-4 text-blue-400" />
                  <span>Fórmulas de Memória de Cálculo f(x)</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleItemClick(() => setActiveView('memorial-descritivo'))}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left font-medium hover:text-purple-400 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-purple-400" />
                  <span>Memorial Descritivo da Obra</span>
                </button>
                <div className="my-1 border-t border-slate-800"></div>
                <button
                  type="button"
                  onClick={() => handleItemClick(() => setActiveView('marcadores'))}
                  className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-slate-800 text-left font-medium text-slate-400 hover:text-white cursor-pointer"
                >
                  <Tag className="w-4 h-4 text-slate-400" />
                  <span>Marcadores & Tags</span>
                </button>
              </div>
            )}
          </div>

          {/* 4. ABA: Medições de Campo (Substitui Plugin BIM e Cursos) */}
          <button
            type="button"
            onClick={() => {
              if (onOpenMedicoes) onOpenMedicoes();
              else setActiveView('medicoes');
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-white transition cursor-pointer"
            title="Módulo de Medições de Obras e Boletins de Campo"
          >
            <ClipboardList className="w-3.5 h-3.5 text-teal-400" />
            <span>Medições de Campo</span>
          </button>

          {/* 5. ABA: Gestão de Obras */}
          <button
            type="button"
            onClick={() => setActiveView('gestao-obras')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition cursor-pointer ${
              activeView === 'gestao-obras' 
                ? 'bg-slate-800 text-cyan-400 font-bold' 
                : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Acompanhamento Físico</span>
          </button>
        </nav>

        {/* Direita: Ações Rápidas (IA, Excel, PDF, Base Atual) */}
        <div className="flex items-center gap-2">
          
          {/* Base SINAPI Caixa */}
          <button
            type="button"
            onClick={onOpenSinapiUpdater}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-mono font-semibold border border-slate-700 transition cursor-pointer"
            title="Clique para atualizar base SINAPI"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{projeto.dataBase.split('(')[0].trim()}</span>
          </button>

          {/* Botão IA Orçamentista */}
          <button
            type="button"
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30 transition cursor-pointer"
            title="Assistente IA de Engenharia de Custos"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">IA Orçamentista</span>
          </button>

          {/* Exportações Excel & PDF */}
          <button
            type="button"
            onClick={onExportarExcel}
            className="p-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/60 transition cursor-pointer"
            title="Exportar Planilha Excel (.xlsx)"
          >
            <FileSpreadsheet className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onExportarPdf}
            className="p-2 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 transition cursor-pointer"
            title="Gerar Relatório Executivo PDF"
          >
            <FileText className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Subbarra com Indicador do Orçamento em Edição */}
      <div className="bg-slate-950 border-t border-slate-800/90 px-4 sm:px-6 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 truncate">
          <span className="text-amber-400 font-bold uppercase text-[10px] tracking-wider font-mono">
            Obra Ativa:
          </span>
          <span className="font-bold text-white truncate">{projeto.nome}</span>
          <span className="text-slate-500 hidden md:inline">• {projeto.responsavelTecnico} ({projeto.creaCau})</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono self-end sm:self-auto text-slate-300">
          <div>
            <span className="text-slate-500 mr-1">Custo Direto:</span>
            <strong className="text-white">{formatarMoeda(totalDireto)}</strong>
          </div>
          <div>
            <span className="text-slate-500 mr-1">BDI:</span>
            <button
              onClick={onOpenBdiModal}
              className="text-amber-400 hover:underline font-bold px-1 rounded cursor-pointer"
            >
              {taxaBdi.toFixed(2)}%
            </button>
          </div>
          <div>
            <span className="text-slate-500 mr-1">Total c/ BDI:</span>
            <strong className="text-emerald-400 font-extrabold">{formatarMoeda(totalComBdi)}</strong>
          </div>
        </div>
      </div>

    </header>
  );
};
