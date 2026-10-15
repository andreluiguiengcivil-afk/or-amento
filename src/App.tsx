/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ProjetoOrcamento, ItemOrcamento, ComposicaoPreco, BDIConfig } from './types/orcamento';
import { PROJETO_PADRAO } from './data/defaultProject';
import { TopNavBar } from './components/TopNavBar';
import { LeftSidebar } from './components/LeftSidebar';
import { SeobraDashboardView } from './components/SeobraDashboardView';
import { BudgetTable } from './components/BudgetTable';
import { CurvaAbcView } from './components/CurvaAbcView';
import { CronogramaView } from './components/CronogramaView';
import { SinapiDatabaseView } from './components/SinapiDatabaseView';
import { BdiCalculatorModal } from './components/BdiCalculatorModal';
import { CompositionModal } from './components/CompositionModal';
import { SinapiSearchModal } from './components/SinapiSearchModal';
import { SinapiUpdaterModal } from './components/SinapiUpdaterModal';
import { CadastrosAuxiliaresModal } from './components/CadastrosAuxiliaresModal';
import { MedicoesModal } from './components/MedicoesModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { CadastroInsumosComposicoesView } from './components/CadastroInsumosComposicoesView';
import { exportarOrcamentoParaExcel } from './utils/exportExcel';
import { exportarOrcamentoParaPdf } from './utils/exportPdf';
import { 
  Building2, 
  Calculator, 
  Calendar, 
  HardHat, 
  ArrowLeft,
  FileSpreadsheet,
  CheckCircle2,
  Boxes
} from 'lucide-react';

const STORAGE_KEY = 'seobra_orcaeng_projeto_v2';

export default function App() {
  const [projeto, setProjeto] = useState<ProjetoOrcamento>(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo) {
        const parsed = JSON.parse(salvo);
        if (parsed.etapas && parsed.bdiConfig) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return PROJETO_PADRAO;
  });

  // Visão Ativa (Navegação SEOBRA 2)
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Estados dos Modais
  const [isBdiModalOpen, setIsBdiModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSinapiUpdaterOpen, setIsSinapiUpdaterOpen] = useState(false);
  const [isMedicoesOpen, setIsMedicoesOpen] = useState(false);
  const [selectedCpuItem, setSelectedCpuItem] = useState<ItemOrcamento | null>(null);
  const [isSinapiSearchOpen, setIsSinapiSearchOpen] = useState(false);
  const [targetEtapaIdForSinapi, setTargetEtapaIdForSinapi] = useState<string>('');
  
  // Modal de Cadastros Auxiliares (Encargos, Memória, Memorial, Marcadores, Pastas)
  const [cadastroModalTipo, setCadastroModalTipo] = useState<
    'encargos-sociais' | 'formulas-memoria' | 'memorial-descritivo' | 'marcadores' | 'pastas' | null
  >(null);

  // Salvar no localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projeto));
    } catch {
      // ignore
    }
  }, [projeto]);

  const handleResetProject = () => {
    if (confirm('Deseja restaurar o projeto exemplo original de Residência Unifamiliar (165 m²)?')) {
      setProjeto(PROJETO_PADRAO);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleOpenCpuModal = (item: ItemOrcamento) => {
    setSelectedCpuItem(item);
  };

  const handleSaveComposition = (itemId: string, newComposicao: ComposicaoPreco) => {
    setProjeto(prev => {
      const novasEtapas = prev.etapas.map(etapa => {
        const novosItens = etapa.itens.map(item => {
          if (item.id === itemId) {
            return {
              ...item,
              custoUnitario: newComposicao.custoUnitarioDireto,
              composicao: newComposicao
            };
          }
          return item;
        });
        return { ...etapa, itens: novosItens };
      });
      return { ...prev, etapas: novasEtapas };
    });
  };

  const handleOpenSinapiSearch = (etapaId: string) => {
    setTargetEtapaIdForSinapi(etapaId);
    setIsSinapiSearchOpen(true);
  };

  const handleSelectSinapiItem = (etapaId: string, comp: ComposicaoPreco) => {
    setProjeto(prev => {
      const novasEtapas = prev.etapas.map(etapa => {
        if (etapa.id !== etapaId) return etapa;
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
  };

  const handleSaveBdi = (newConfig: BDIConfig) => {
    setProjeto(prev => ({
      ...prev,
      bdiConfig: newConfig
    }));
  };

  const handleCadastrosView = (tipo: 'encargos-sociais' | 'formulas-memoria' | 'memorial-descritivo' | 'marcadores' | 'pastas') => {
    setCadastroModalTipo(tipo);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* 1. TOP NAVBAR ORÇAPRO ENGENHARIA */}
      <TopNavBar
        projeto={projeto}
        setProjeto={setProjeto}
        activeView={activeView}
        setActiveView={(view) => {
          if (['encargos-sociais', 'formulas-memoria', 'memorial-descritivo', 'marcadores', 'pastas'].includes(view)) {
            handleCadastrosView(view as any);
          } else {
            setActiveView(view);
          }
        }}
        onOpenBdiModal={() => setIsBdiModalOpen(true)}
        onOpenSinapiUpdater={() => setIsSinapiUpdaterOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenMedicoes={() => setIsMedicoesOpen(true)}
        onNovoOrcamento={() => {
          setActiveView('planilha-orcamentaria');
        }}
        onImportarPlanilha={() => setIsSinapiUpdaterOpen(true)}
        onNovoInsumo={() => {
          setActiveView('insumos-pesquisar');
        }}
        onExportarExcel={() => exportarOrcamentoParaExcel(projeto)}
        onExportarPdf={() => exportarOrcamentoParaPdf(projeto)}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* 2. CORPO PRINCIPAL COM SIDEBAR LATERAL E ÁREA DE CONTEÚDO */}
      <div className="flex flex-1">
        
        {/* Menu Lateral Estilo SEOBRA 2 */}
        <LeftSidebar
          activeView={activeView}
          setActiveView={(view) => {
            if (view === 'orcamentos-lista') {
              setActiveView('dashboard');
            } else {
              setActiveView(view);
            }
          }}
          isOpen={sidebarOpen}
          onOpenMedicoes={() => setIsMedicoesOpen(true)}
          onOpenSinapiUpdater={() => setIsSinapiUpdaterOpen(true)}
          onNovoOrcamento={() => setActiveView('planilha-orcamentaria')}
        />

        {/* Área de Conteúdo */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 overflow-y-auto">
          
          {/* Dashboard Inicial com os Cards (LISTAR ORÇAMENTOS, CRIAR ORÇAMENTO, IMPORTAÇÃO) */}
          {(activeView === 'dashboard' || activeView === 'orcamentos-lista') && (
            <SeobraDashboardView
              projeto={projeto}
              setProjeto={setProjeto}
              onOpenPlanilha={() => setActiveView('planilha-orcamentaria')}
              onOpenNovoOrcamento={() => setActiveView('planilha-orcamentaria')}
              onOpenImportar={() => setIsSinapiUpdaterOpen(true)}
              onOpenSinapiUpdater={() => setIsSinapiUpdaterOpen(true)}
              onOpenBdi={() => setIsBdiModalOpen(true)}
              onOpenCurvaAbc={() => setActiveView('curva-abc')}
              onOpenCronograma={() => setActiveView('cronograma')}
              onOpenPesquisaInsumos={() => setActiveView('insumos-pesquisar')}
            />
          )}

          {/* Planilha Orçamentária em Edição */}
          {activeView === 'planilha-orcamentaria' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveView('dashboard')}
                  className="flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar aos Orçamentos</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveView('curva-abc')}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 transition"
                  >
                    <Calculator className="w-3.5 h-3.5 text-rose-500" />
                    <span>Curva ABC (Pareto)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveView('cronograma')}
                    className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 transition"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>Cronograma & Curva S</span>
                  </button>
                </div>
              </div>

              <BudgetTable
                projeto={projeto}
                setProjeto={setProjeto}
                onOpenCpuModal={handleOpenCpuModal}
                onOpenSinapiSearch={handleOpenSinapiSearch}
              />
            </div>
          )}

          {/* Curva ABC (Pareto 80/20) */}
          {activeView === 'curva-abc' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveView('planilha-orcamentaria')}
                  className="flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar à Planilha Orçamentária</span>
                </button>
              </div>
              <CurvaAbcView projeto={projeto} />
            </div>
          )}

          {/* Cronograma Físico-Financeiro */}
          {activeView === 'cronograma' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveView('planilha-orcamentaria')}
                  className="flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar à Planilha Orçamentária</span>
                </button>
              </div>
              <CronogramaView projeto={projeto} setProjeto={setProjeto} />
            </div>
          )}

          {/* Insumos & Composições (4 Cartões Amarelos, Pastas de Fornecedores e Banco SINAPI) */}
          {(activeView.startsWith('insumos') || activeView === 'sinapi' || activeView === 'fontes-proprias') && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveView('dashboard')}
                  className="flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-800 transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar aos Orçamentos</span>
                </button>

                {/* Sub-abas de Insumos & Composições */}
                {/* Sub-abas de Insumos & Fornecedores */}
                <div className="flex items-center bg-slate-200/80 p-1 rounded-xl text-xs font-bold gap-1 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActiveView('insumos-editar')}
                    className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      activeView === 'insumos-editar'
                        ? 'bg-amber-400 text-slate-950 shadow-sm border border-amber-500 font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Banco de Insumos (SINAPI & Fornecedores)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('insumos-fornecedores')}
                    className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      activeView === 'insumos-fornecedores'
                        ? 'bg-slate-900 text-amber-400 shadow-sm font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Página de Fornecedores</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('insumos-precos')}
                    className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      activeView === 'insumos-precos'
                        ? 'bg-emerald-600 text-white shadow-sm border border-emerald-700 font-black'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Cadastrar Preço de Fornecedor</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('insumos-genericos')}
                    className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      activeView === 'insumos-genericos'
                        ? 'bg-white text-emerald-800 shadow-sm border border-emerald-300 font-black'
                        : 'text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50'
                    }`}
                  >
                    <span>Insumos Genéricos & RFQ</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('insumos-novo')}
                    className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                      activeView === 'insumos-novo' || activeView === 'fontes-proprias' || activeView === 'insumos-proprios'
                        ? 'bg-white text-amber-900 shadow-sm border border-amber-300'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    4 Cartões Amarelos & Pastas
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('insumos-pesquisar')}
                    className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap cursor-pointer ${
                      activeView === 'insumos-pesquisar' || activeView === 'sinapi'
                        ? 'bg-white text-teal-800 shadow-sm border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Catálogo SINAPI Caixa
                  </button>
                </div>
              </div>

              {/* Renderiza a View com a sub-aba solicitada */}
              {(activeView === 'insumos-novo' || activeView === 'fontes-proprias' || activeView === 'insumos-proprios') && (
                <CadastroInsumosComposicoesView abaAtivaInicial="cadastro" />
              )}
              {activeView === 'insumos-editar' && (
                <CadastroInsumosComposicoesView abaAtivaInicial="editar-insumos" />
              )}
              {activeView === 'insumos-fornecedores' && (
                <CadastroInsumosComposicoesView abaAtivaInicial="fornecedores" />
              )}
              {activeView === 'insumos-precos' && (
                <CadastroInsumosComposicoesView abaAtivaInicial="precos-fornecedores" />
              )}
              {activeView === 'insumos-genericos' && (
                <CadastroInsumosComposicoesView abaAtivaInicial="genericos" />
              )}
              {(activeView === 'insumos-pesquisar' || activeView === 'sinapi') && (
                <SinapiDatabaseView
                  projeto={projeto}
                  setProjeto={setProjeto}
                  onOpenCpuModal={handleOpenCpuModal}
                  onOpenSinapiUpdater={() => setIsSinapiUpdaterOpen(true)}
                />
              )}
            </div>
          )}


          {/* Gestão de Obras [BETA] */}
          {activeView === 'gestao-obras' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                  <span>Gestão de Obras [BETA]</span>
                  <span className="text-[10px] bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded font-mono">BETA</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setIsMedicoesOpen(true)}
                  className="px-3 py-1.5 bg-teal-700 hover:bg-teal-600 text-white rounded-lg text-xs font-bold transition shadow-sm"
                >
                  Abrir Módulo de Medições
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div 
                  onClick={() => setIsMedicoesOpen(true)}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition"
                >
                  <span className="font-bold text-slate-800 block">Boletim de Medição (BM)</span>
                  <p className="text-slate-500 mt-1">Acompanhe a evolução física da obra e libere faturamentos.</p>
                </div>
                <div 
                  onClick={() => setActiveView('cronograma')}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition"
                >
                  <span className="font-bold text-slate-800 block">Curva S de Desembolso</span>
                  <p className="text-slate-500 mt-1">Compare o previsto vs realizado no cronograma temporal.</p>
                </div>
                <div 
                  onClick={() => alert('Diário de Obra Digital com fotos e registro de ocorrências climáticas.')}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer transition"
                >
                  <span className="font-bold text-slate-800 block">Diário de Obras Digital</span>
                  <p className="text-slate-500 mt-1">Registro de efetivo de operários, equipamentos e clima.</p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 3. MODAIS TÉCNICOS INTEGRADOS */}
      <BdiCalculatorModal
        isOpen={isBdiModalOpen}
        onClose={() => setIsBdiModalOpen(false)}
        bdiConfig={projeto.bdiConfig}
        onSave={handleSaveBdi}
      />

      <CompositionModal
        isOpen={!!selectedCpuItem}
        onClose={() => setSelectedCpuItem(null)}
        item={selectedCpuItem}
        onSaveComposition={handleSaveComposition}
      />

      <SinapiSearchModal
        isOpen={isSinapiSearchOpen}
        onClose={() => setIsSinapiSearchOpen(false)}
        etapas={projeto.etapas}
        onSelectItem={handleSelectSinapiItem}
        defaultEtapaId={targetEtapaIdForSinapi}
      />

      <SinapiUpdaterModal
        isOpen={isSinapiUpdaterOpen}
        onClose={() => setIsSinapiUpdaterOpen(false)}
        projeto={projeto}
        setProjeto={setProjeto}
      />

      <MedicoesModal
        isOpen={isMedicoesOpen}
        onClose={() => setIsMedicoesOpen(false)}
        projeto={projeto}
      />

      <CadastrosAuxiliaresModal
        isOpen={!!cadastroModalTipo}
        onClose={() => setCadastroModalTipo(null)}
        tipo={cadastroModalTipo || 'encargos-sociais'}
        projeto={projeto}
        setProjeto={setProjeto}
      />

      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        projeto={projeto}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3 px-6 text-center text-xs text-slate-500">
        <p>
          SEOBRA 2 / OrçaEng • Sistema Profissional de Orçamento de Obras Civis, SINAPI Caixa & Automação Python • Padrão IBRAOP / TCU 2622/2013
        </p>
      </footer>

    </div>
  );
}
