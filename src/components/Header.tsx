import React from 'react';
import { 
  HardHat, 
  FileSpreadsheet, 
  FileText, 
  Sliders, 
  Sparkles, 
  Save, 
  Upload, 
  RotateCcw,
  Building2,
  Calendar,
  Calculator
} from 'lucide-react';
import { ProjetoOrcamento } from '../types/orcamento';
import { calcularTaxaBDI, formatarMoeda } from '../utils/bdiCalculator';
import { exportarOrcamentoParaExcel } from '../utils/exportExcel';
import { exportarOrcamentoParaPdf } from '../utils/exportPdf';

interface HeaderProps {
  projeto: ProjetoOrcamento;
  setProjeto: React.Dispatch<React.SetStateAction<ProjetoOrcamento>>;
  onOpenBdiModal: () => void;
  onOpenAiModal: () => void;
  onOpenSinapiUpdater: () => void;
  onResetProject: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  projeto,
  setProjeto,
  onOpenBdiModal,
  onOpenAiModal,
  onOpenSinapiUpdater,
  onResetProject,
  activeTab,
  setActiveTab
}) => {
  const taxaBdi = calcularTaxaBDI(projeto.bdiConfig);
  const fatorBdi = 1 + (taxaBdi / 100);

  let totalDireto = 0;
  projeto.etapas.forEach(e => {
    e.itens.forEach(i => {
      totalDireto += (i.quantidade * i.custoUnitario);
    });
  });

  const totalComBdi = totalDireto * fatorBdi;
  const custoM2 = projeto.areaConstruidaM2 > 0 ? totalComBdi / projeto.areaConstruidaM2 : 0;

  const handleSalvarJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projeto, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Orcamento_${projeto.nome.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCarregarJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (parsed.etapas && parsed.bdiConfig) {
            setProjeto(parsed);
          }
        } catch {
          // ignore
        }
      };
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-lg">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Info */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950">
              <HardHat className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  OrçaEng <span className="text-xs uppercase px-2 py-0.5 rounded font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">Pro & Python</span>
                </h1>
                <button
                  type="button"
                  onClick={onOpenSinapiUpdater}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/30 font-semibold transition flex items-center gap-1.5 cursor-pointer"
                  title="Clique para atualizar base SINAPI ou ver como o código atualiza"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>{projeto.dataBase.split('(')[0].trim()}</span>
                </button>
              </div>
              <p className="text-xs text-slate-400 font-medium truncate max-w-md">
                {projeto.nome} • {projeto.responsavelTecnico} ({projeto.creaCau})
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenSinapiUpdater}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-700/60 text-xs font-semibold transition shadow-sm"
              title="Atualizador oficial de tabelas SINAPI Caixa"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Atualizar SINAPI</span>
            </button>
            <button
              onClick={onOpenBdiModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all hover:scale-[1.02]"
              title="Configurar BDI oficial TCU"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>BDI: {taxaBdi.toFixed(2)}%</span>
            </button>

            <button
              onClick={onOpenAiModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>IA Orçamentista</span>
            </button>

            <div className="h-5 w-[1px] bg-slate-800 hidden sm:block"></div>

            <button
              onClick={() => exportarOrcamentoParaExcel(projeto)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-sm"
              title="Exportar planilha Excel completa"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Excel</span>
            </button>

            <button
              onClick={() => exportarOrcamentoParaPdf(projeto)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all shadow-sm"
              title="Gerar relatório em PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            <button
              onClick={handleSalvarJson}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Salvar projeto (JSON)"
            >
              <Save className="w-4 h-4" />
            </button>

            <label className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer" title="Carregar projeto (JSON)">
              <Upload className="w-4 h-4" />
              <input type="file" accept=".json" onChange={handleCarregarJson} className="hidden" />
            </label>

            <button
              onClick={onResetProject}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition"
              title="Restaurar projeto padrão de exemplo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live KPIs bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-800/80">
          <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Custo Direto Total</span>
            <div className="text-base sm:text-lg font-bold text-slate-200 font-mono mt-0.5">
              {formatarMoeda(totalDireto)}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Taxa BDI</span>
              <span className="text-[10px] text-amber-400 font-bold">TCU 2622/13</span>
            </span>
            <div className="text-base sm:text-lg font-bold text-amber-400 font-mono mt-0.5">
              {taxaBdi.toFixed(2)}%
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">Preço Global (c/ BDI)</span>
            <div className="text-base sm:text-lg font-bold text-emerald-400 font-mono mt-0.5">
              {formatarMoeda(totalComBdi)}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-2.5 border border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Custo Médio / m²</span>
              <span className="text-[10px] text-slate-400">{projeto.areaConstruidaM2} m²</span>
            </span>
            <div className="text-base sm:text-lg font-bold text-cyan-400 font-mono mt-0.5">
              {formatarMoeda(custoM2)} <span className="text-xs text-slate-400 font-normal">/m²</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 overflow-x-auto border-t border-slate-800/80 scrollbar-none">
        <button
          onClick={() => setActiveTab('orcamento')}
          className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'orcamento'
              ? 'border-amber-500 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Planilha Orçamentária</span>
        </button>

        <button
          onClick={() => setActiveTab('curva-abc')}
          className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'curva-abc'
              ? 'border-amber-500 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Curva ABC (Pareto)</span>
        </button>

        <button
          onClick={() => setActiveTab('cronograma')}
          className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'cronograma'
              ? 'border-amber-500 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Cronograma & Curva S</span>
        </button>

        <button
          onClick={() => setActiveTab('sinapi')}
          className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'sinapi'
              ? 'border-amber-500 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HardHat className="w-4 h-4" />
          <span>Banco SINAPI Caixa</span>
        </button>

        <button
          onClick={() => setActiveTab('python')}
          className={`flex items-center gap-2 py-2.5 px-3.5 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
            activeTab === 'python'
              ? 'border-cyan-500 text-cyan-400 bg-cyan-500/10'
              : 'border-transparent text-cyan-400/80 hover:text-cyan-300'
          }`}
        >
          <span className="font-mono text-xs px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold">Py</span>
          <span>Aplicativo Python (Código & Scripts)</span>
        </button>
      </div>
    </header>
  );
};
