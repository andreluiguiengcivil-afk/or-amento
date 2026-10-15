import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  Play, 
  Terminal, 
  FileCode, 
  Layers, 
  BookOpen, 
  ExternalLink,
  Cpu,
  Sparkles
} from 'lucide-react';
import { SCRIPTS_PYTHON, PythonScript } from '../data/pythonTemplates';
import { ProjetoOrcamento } from '../types/orcamento';
import { calcularTaxaBDI, formatarMoeda } from '../utils/bdiCalculator';

interface PythonHubViewProps {
  projeto: ProjetoOrcamento;
}

export const PythonHubView: React.FC<PythonHubViewProps> = ({ projeto }) => {
  const [selectedScriptId, setSelectedScriptId] = useState<string>('streamlit-app');
  const [copiado, setCopiado] = useState(false);
  const [executando, setExecutando] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState<string[] | null>(null);

  const selectedScript = SCRIPTS_PYTHON.find(s => s.id === selectedScriptId) || SCRIPTS_PYTHON[0];

  const handleCopiar = () => {
    navigator.clipboard.writeText(selectedScript.codigo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const handleDownload = (script: PythonScript) => {
    const blob = new Blob([script.codigo], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = script.arquivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadTodos = () => {
    SCRIPTS_PYTHON.forEach(s => {
      handleDownload(s);
    });
  };

  const executarSimuladorPython = () => {
    setExecutando(true);
    setTerminalOutput([
      `[PYTHON RUNTIME 3.11] Inicializando ambiente virtual...`,
      `$ python ${selectedScript.arquivo}`,
      `[INFO] Importando pacotes: pandas, openpyxl, plotly...`,
      `[INFO] Carregando banco de composições SINAPI 2025...`,
      `------------------------------------------------------------`,
      `PROJETO: ${projeto.nome}`,
      `RESPONSÁVEL: ${projeto.responsavelTecnico} (${projeto.creaCau})`,
      `ÁREA CONSTRUÍDA: ${projeto.areaConstruidaM2} m²`,
      `DATA-BASE: ${projeto.dataBase}`,
      `------------------------------------------------------------`
    ]);

    setTimeout(() => {
      const taxaBdi = calcularTaxaBDI(projeto.bdiConfig);
      const fatorBdi = 1 + (taxaBdi / 100);
      let totalDireto = 0;
      projeto.etapas.forEach(e => e.itens.forEach(i => totalDireto += (i.quantidade * i.custoUnitario)));
      const totalVenda = totalDireto * fatorBdi;
      const custoM2 = totalVenda / projeto.areaConstruidaM2;

      setTerminalOutput(prev => [
        ...(prev || []),
        `[CÁLCULO TCU 2622/13] Taxa BDI Calculada: ${taxaBdi.toFixed(2)}%`,
        `  -> AC: ${projeto.bdiConfig.ac}% | S+G: ${projeto.bdiConfig.sg}% | Risco: ${projeto.bdiConfig.r}% | DF: ${projeto.bdiConfig.df}% | Lucro: ${projeto.bdiConfig.l}%`,
        `  -> Tributos Totais: ${(projeto.bdiConfig.pis + projeto.bdiConfig.cofins + projeto.bdiConfig.iss).toFixed(2)}%`,
        `------------------------------------------------------------`,
        `[RESULTADOS GLOBAIS]`,
        `  -> Custo Direto Total: ${formatarMoeda(totalDireto)}`,
        `  -> Preço de Venda Global (c/ BDI): ${formatarMoeda(totalVenda)}`,
        `  -> Custo Médio Unitário: ${formatarMoeda(custoM2)}/m²`,
        `------------------------------------------------------------`,
        `[CURVA ABC DE PARETO GERADA COM SUCESSO]`,
        `  -> Classe A (Críticos): 80% do valor orçado concentrado nos primeiros itens`,
        `  -> Curva S física-financeira gerada para ${projeto.prazoMeses} meses`,
        `[STATUS] Execução concluída sem erros (Exit code 0).`
      ]);
      setExecutando(false);
    }, 900);
  };

  return (
    <div className="space-y-6">
      
      {/* Header do Hub Python */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-800/40 p-5 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/30">
              <Code2 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Hub de Código Python para Orçamentos</h2>
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold border border-cyan-500/30">
                  Python 3.10+
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Scripts prontos para execução local com <strong>Streamlit</strong>, classes em <strong>POO</strong> e integração <strong>SINAPI/Pandas</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadTodos}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md transition"
              title="Baixar todos os arquivos .py e requirements.txt"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Todos (.py)</span>
            </button>
          </div>
        </div>

        {/* Guia Rápido de Instalação no Terminal */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider">Passo 1: Criar Ambiente</span>
            <code className="text-cyan-300 font-mono text-[11px] mt-1 block">python -m venv venv</code>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider">Passo 2: Instalar Pacotes</span>
            <code className="text-cyan-300 font-mono text-[11px] mt-1 block">pip install -r requirements.txt</code>
          </div>
          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
            <span className="text-slate-400 font-medium block text-[11px] uppercase tracking-wider">Passo 3: Rodar Aplicativo</span>
            <code className="text-amber-300 font-mono text-[11px] mt-1 block">streamlit run app_orcamento.py</code>
          </div>
        </div>
      </div>

      {/* Editor & Script Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Lista de Scripts na lateral */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2">
            Arquivos do Projeto Python
          </h3>

          {SCRIPTS_PYTHON.map((script) => (
            <button
              key={script.id}
              type="button"
              onClick={() => setSelectedScriptId(script.id)}
              className={`w-full text-left p-3 rounded-xl border transition flex flex-col gap-1 ${
                selectedScriptId === script.id
                  ? 'bg-slate-800 border-cyan-500/80 shadow-md ring-1 ring-cyan-500/20'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                  <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{script.arquivo}</span>
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  {script.categoria}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {script.descricao}
              </p>
            </button>
          ))}

          {/* Teste no Simulador */}
          <div className="pt-3">
            <button
              type="button"
              onClick={executarSimuladorPython}
              disabled={executando}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md transition disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{executando ? 'Executando script...' : 'Executar Simulação Python'}</span>
            </button>
          </div>
        </div>

        {/* Visualizador de Código & Terminal Output */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Card do Código */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
            
            {/* Toolbar do Arquivo */}
            <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 pl-2">
                  {selectedScript.arquivo}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopiar}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                >
                  {copiado ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiado ? 'Copiado!' : 'Copiar'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDownload(selectedScript)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                  title="Baixar este arquivo"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Código Fonte */}
            <div className="p-4 bg-slate-950/70 overflow-x-auto max-h-[500px]">
              <pre className="text-xs font-mono text-slate-300 leading-relaxed tab-4">
                <code>{selectedScript.codigo}</code>
              </pre>
            </div>
          </div>

          {/* Terminal Output Console */}
          {terminalOutput && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg animate-fade-in">
              <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Console Python Interativo (Saída de Execução)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setTerminalOutput(null)}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  Limpar
                </button>
              </div>
              <div className="p-4 font-mono text-xs text-slate-300 space-y-1 max-h-56 overflow-y-auto">
                {terminalOutput.map((linha, idx) => (
                  <div key={idx} className={linha.startsWith('[CÁLCULO') ? 'text-amber-400 font-bold' : (linha.startsWith('[STATUS') ? 'text-emerald-400 font-bold' : 'text-slate-300')}>
                    {linha}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
};
