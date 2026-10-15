import React from 'react';
import { X, Info, Calculator, Check, AlertTriangle } from 'lucide-react';
import { BDIConfig } from '../types/orcamento';
import { calcularTaxaBDI, TCU_REFERENCIAS } from '../utils/bdiCalculator';

interface BdiModalProps {
  isOpen: boolean;
  onClose: () => void;
  bdiConfig: BDIConfig;
  onSave: (newConfig: BDIConfig) => void;
}

export const BdiCalculatorModal: React.FC<BdiModalProps> = ({
  isOpen,
  onClose,
  bdiConfig,
  onSave
}) => {
  const [tempConfig, setTempConfig] = React.useState<BDIConfig>(bdiConfig);

  React.useEffect(() => {
    setTempConfig(bdiConfig);
  }, [bdiConfig, isOpen]);

  if (!isOpen) return null;

  const taxaAtual = calcularTaxaBDI(tempConfig);
  const tributosTotal = tempConfig.pis + tempConfig.cofins + tempConfig.iss + (tempConfig.desonerado ? tempConfig.cprb : 0);

  const aplicarValoresTcuMedio = () => {
    setTempConfig(prev => ({
      ...prev,
      ac: TCU_REFERENCIAS.ac.medio,
      sg: TCU_REFERENCIAS.sg.medio,
      r: TCU_REFERENCIAS.r.medio,
      df: TCU_REFERENCIAS.df.medio,
      l: TCU_REFERENCIAS.l.medio,
    }));
  };

  const handleSalvar = () => {
    onSave(tempConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Calculadora Oficial de BDI</h2>
              <p className="text-xs text-slate-400">Acórdão 2622/2013 - Plenário do TCU (Construção de Edifícios)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Fórmula e Banner do BDI Atual */}
          <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-400 font-mono">FÓRMULA REGULAMENTAR TCU:</span>
                <div className="text-xs text-amber-300 font-mono bg-slate-950/80 p-2 rounded mt-1 border border-slate-800">
                  BDI = [ (1 + AC + S + R + G) × (1 + DF) × (1 + L) / (1 - Tributos) ] - 1
                </div>
              </div>
              <div className="text-right sm:min-w-[140px] bg-slate-900/80 p-3 rounded-lg border border-amber-500/30">
                <span className="text-[11px] uppercase text-slate-400 font-semibold block">BDI Resultante</span>
                <span className="text-2xl font-black text-amber-400 font-mono">{taxaAtual.toFixed(2)}%</span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-700/60 text-xs">
              <span className="text-slate-400">Faixa recomendada TCU: <strong>20,34% a 25,00%</strong></span>
              <button
                type="button"
                onClick={aplicarValoresTcuMedio}
                className="text-amber-400 hover:text-amber-300 font-semibold underline underline-offset-2 transition"
              >
                Aplicar Média TCU (22,12%)
              </button>
            </div>
          </div>

          {/* Seção 1: Componentes de Custos Indiretos */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <span>1. Custos Indiretos & Margem</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* AC */}
              <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/70">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-300">Administração Central (AC)</span>
                  <span className="font-mono text-amber-400 font-bold">{tempConfig.ac.toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.05"
                  value={tempConfig.ac}
                  onChange={e => setTempConfig({ ...tempConfig, ac: parseFloat(e.target.value) || 0 })}
                  className="w-full accent-amber-500"
                />
                <span className="text-[10px] text-slate-500 block mt-1">TCU: 3,00% - 4,00% - 5,50%</span>
              </div>

              {/* SG */}
              <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/70">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-300">Seguro e Garantia (S + G)</span>
                  <span className="font-mono text-amber-400 font-bold">{tempConfig.sg.toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.05"
                  value={tempConfig.sg}
                  onChange={e => setTempConfig({ ...tempConfig, sg: parseFloat(e.target.value) || 0 })}
                  className="w-full accent-amber-500"
                />
                <span className="text-[10px] text-slate-500 block mt-1">TCU: 0,80% - 0,80% - 1,00%</span>
              </div>

              {/* Risco */}
              <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/70">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-300">Risco e Imprevistos (R)</span>
                  <span className="font-mono text-amber-400 font-bold">{tempConfig.r.toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.01"
                  value={tempConfig.r}
                  onChange={e => setTempConfig({ ...tempConfig, r: parseFloat(e.target.value) || 0 })}
                  className="w-full accent-amber-500"
                />
                <span className="text-[10px] text-slate-500 block mt-1">TCU: 0,97% - 1,27% - 1,27%</span>
              </div>

              {/* Despesas Financeiras */}
              <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/70">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-300">Despesas Financeiras (DF)</span>
                  <span className="font-mono text-amber-400 font-bold">{tempConfig.df.toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.01"
                  value={tempConfig.df}
                  onChange={e => setTempConfig({ ...tempConfig, df: parseFloat(e.target.value) || 0 })}
                  className="w-full accent-amber-500"
                />
                <span className="text-[10px] text-slate-500 block mt-1">TCU: 0,59% - 1,23% - 1,39%</span>
              </div>

              {/* Lucro Operacional */}
              <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-700/70 sm:col-span-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-300">Lucro Operacional / Margem da Construtora (L)</span>
                  <span className="font-mono text-emerald-400 font-bold">{tempConfig.l.toFixed(2)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  step="0.1"
                  value={tempConfig.l}
                  onChange={e => setTempConfig({ ...tempConfig, l: parseFloat(e.target.value) || 0 })}
                  className="w-full accent-emerald-500"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>Mínimo TCU: 6,16%</span>
                  <span className="text-emerald-400">Médio TCU: 7,40%</span>
                  <span>Máximo TCU: 8,96%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Seção 2: Tributos */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
                2. Tributos Incidentes ({tributosTotal.toFixed(2)}%)
              </h3>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-amber-400 font-medium">
                <input
                  type="checkbox"
                  checked={tempConfig.desonerado}
                  onChange={e => setTempConfig({ ...tempConfig, desonerado: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-amber-500 focus:ring-0"
                />
                <span>Desoneração da Folha (Lei 12.844)</span>
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700">
                <span className="text-[11px] text-slate-400 block mb-1">PIS</span>
                <input
                  type="number"
                  step="0.05"
                  value={tempConfig.pis}
                  onChange={e => setTempConfig({ ...tempConfig, pis: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-white"
                />
              </div>

              <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700">
                <span className="text-[11px] text-slate-400 block mb-1">COFINS</span>
                <input
                  type="number"
                  step="0.10"
                  value={tempConfig.cofins}
                  onChange={e => setTempConfig({ ...tempConfig, cofins: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-white"
                />
              </div>

              <div className="bg-slate-800/50 p-2.5 rounded-lg border border-slate-700">
                <span className="text-[11px] text-slate-400 block mb-1">ISS (Município)</span>
                <input
                  type="number"
                  step="0.25"
                  value={tempConfig.iss}
                  onChange={e => setTempConfig({ ...tempConfig, iss: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-white"
                />
              </div>

              <div className={`p-2.5 rounded-lg border transition ${tempConfig.desonerado ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' : 'bg-slate-800/30 border-slate-800 text-slate-600'}`}>
                <span className="text-[11px] block mb-1 font-medium">CPRB (Deson.)</span>
                <input
                  type="number"
                  disabled={!tempConfig.desonerado}
                  step="0.1"
                  value={tempConfig.cprb}
                  onChange={e => setTempConfig({ ...tempConfig, cprb: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-white disabled:opacity-40"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-end gap-3 sticky bottom-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSalvar}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Aplicar BDI ({taxaAtual.toFixed(2)}%) ao Orçamento</span>
          </button>
        </div>

      </div>
    </div>
  );
};
