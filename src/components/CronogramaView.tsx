import React from 'react';
import { Calendar, DollarSign, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { ProjetoOrcamento } from '../types/orcamento';
import { calcularTaxaBDI, formatarMoeda, formatarNumero } from '../utils/bdiCalculator';

interface CronogramaViewProps {
  projeto: ProjetoOrcamento;
  setProjeto: React.Dispatch<React.SetStateAction<ProjetoOrcamento>>;
}

export const CronogramaView: React.FC<CronogramaViewProps> = ({ projeto, setProjeto }) => {
  const taxaBdi = calcularTaxaBDI(projeto.bdiConfig);
  const fatorBdi = 1 + (taxaBdi / 100);
  const mesesQtd = projeto.prazoMeses || 6;
  const mesesArray = Array.from({ length: mesesQtd }, (_, i) => i + 1);

  // Calcula valores de venda de cada etapa
  const etapasComValores = projeto.etapas.map(etapa => {
    let custoDireto = 0;
    etapa.itens.forEach(i => custoDireto += (i.quantidade * i.custoUnitario));
    const precoVenda = custoDireto * fatorBdi;

    // Percentuais mensais (ou array de zeros)
    const percentuais = projeto.cronograma[etapa.id] || Array(mesesQtd).fill(0);
    // Garantir tamanho do array
    const percentuaisAjustados = Array.from({ length: mesesQtd }, (_, idx) => percentuais[idx] || 0);

    return {
      id: etapa.id,
      nome: etapa.nome,
      precoVenda,
      percentuais: percentuaisAjustados
    };
  });

  const totalObraVenda = etapasComValores.reduce((acc, e) => acc + e.precoVenda, 0);

  // Calcula desembolso mensal total e acumulado
  const desembolsoMensal: number[] = Array(mesesQtd).fill(0);
  etapasComValores.forEach(e => {
    e.percentuais.forEach((pct, mesIdx) => {
      desembolsoMensal[mesIdx] += (e.precoVenda * (pct / 100));
    });
  });

  const percentualMensal = desembolsoMensal.map(v => totalObraVenda > 0 ? (v / totalObraVenda) * 100 : 0);

  let acumuladoR$ = 0;
  const desembolsoAcumulado = desembolsoMensal.map(v => {
    acumuladoR$ += v;
    return acumuladoR$;
  });

  const percentualAcumulado = desembolsoAcumulado.map(v => totalObraVenda > 0 ? (v / totalObraVenda) * 100 : 0);

  const atualizarPercentual = (etapaId: string, mesIndex: number, novoPct: number) => {
    setProjeto(prev => {
      const cronogramaAtual = { ...prev.cronograma };
      const arr = [...(cronogramaAtual[etapaId] || Array(mesesQtd).fill(0))];
      arr[mesIndex] = novoPct;
      cronogramaAtual[etapaId] = arr;
      return { ...prev, cronograma: cronogramaAtual };
    });
  };

  const maxMensal = Math.max(...desembolsoMensal, 1);

  return (
    <div className="space-y-6">
      
      {/* Header do Cronograma */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Cronograma Físico-Financeiro & Curva S</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Planejamento temporal das etapas construtivas e fluxo de desembolso mensal da obra.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            <span className="text-xs text-slate-400 font-medium">Prazo da Obra:</span>
            <select
              value={projeto.prazoMeses}
              onChange={e => setProjeto({ ...projeto, prazoMeses: parseInt(e.target.value) || 6 })}
              className="bg-slate-900 text-xs font-bold text-amber-400 rounded px-2 py-1 border border-slate-700"
            >
              <option value={4}>4 meses</option>
              <option value={6}>6 meses</option>
              <option value={8}>8 meses</option>
              <option value={10}>10 meses</option>
              <option value={12}>12 meses</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gráfico Visual: Curva S e Barras Mensais */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Curva S de Desembolso Financeiro Acumulado</span>
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-3 rounded bg-blue-500 inline-block"></span> Desembolso Mensal
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className="w-3 h-1.5 rounded bg-amber-400 inline-block"></span> Curva S Acumulada
            </span>
          </div>
        </div>

        <div className="pt-4 grid grid-cols-6 sm:grid-cols-6 gap-2 sm:gap-4 items-end h-56 border-b border-slate-800 pb-2">
          {mesesArray.map((mes, idx) => {
            const valorMes = desembolsoMensal[idx] || 0;
            const pctMes = percentualMensal[idx] || 0;
            const pctAcum = percentualAcumulado[idx] || 0;
            const alturaBarra = maxMensal > 0 ? (valorMes / maxMensal) * 100 : 0;

            return (
              <div key={mes} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-mono font-bold text-amber-400 opacity-90 mb-1 group-hover:scale-110 transition">
                  {pctAcum.toFixed(0)}%
                </span>
                
                {/* Indicador Curva S pontilhado / linha */}
                <div 
                  className="w-full flex items-center justify-center relative"
                  style={{ height: `${Math.max(12, alturaBarra)}%` }}
                >
                  <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md hover:from-amber-500 hover:to-amber-400 transition-all flex flex-col justify-end p-1 text-center shadow-md">
                    <span className="text-[9px] font-mono font-extrabold text-white hidden sm:block truncate">
                      {pctMes.toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-center">
                  <span className="text-xs font-bold text-slate-200 block">Mês {mes}</span>
                  <span className="text-[10px] text-slate-500 font-mono hidden sm:block">{formatarMoeda(valorMes)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Matriz do Cronograma Físico-Financeiro */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-800/60 border-b border-slate-700/60">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Matriz de Distribuição Percentual das Etapas (Soma por Etapa = 100%)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/40 text-[10px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800 font-mono">
              <tr>
                <th className="py-2.5 px-3 min-w-[220px]">Etapa Construtiva</th>
                <th className="py-2.5 px-3 text-right w-28">Total c/ BDI</th>
                {mesesArray.map(m => (
                  <th key={m} className="py-2.5 px-2 text-center w-20">Mês {m} (%)</th>
                ))}
                <th className="py-2.5 px-3 text-center w-20">Soma</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {etapasComValores.map((etapa) => {
                const somaEtapa = etapa.percentuais.reduce((a, b) => a + b, 0);
                const somaCorreta = Math.abs(somaEtapa - 100) < 0.5;

                return (
                  <tr key={etapa.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-2.5 px-3 font-sans text-slate-200 font-medium">
                      {etapa.nome}
                    </td>
                    <td className="py-2.5 px-3 text-right text-emerald-400 font-bold">
                      {formatarMoeda(etapa.precoVenda)}
                    </td>
                    
                    {mesesArray.map((m, mIdx) => (
                      <td key={m} className="py-2.5 px-1 text-center">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="5"
                          value={etapa.percentuais[mIdx] || 0}
                          onChange={e => atualizarPercentual(etapa.id, mIdx, parseFloat(e.target.value) || 0)}
                          className={`w-14 text-center rounded py-0.5 text-xs font-mono border focus:outline-none focus:border-amber-500 ${
                            (etapa.percentuais[mIdx] || 0) > 0
                              ? 'bg-blue-950/80 text-blue-300 border-blue-800/80 font-bold'
                              : 'bg-slate-800/40 text-slate-600 border-slate-800'
                          }`}
                        />
                      </td>
                    ))}

                    <td className="py-2.5 px-3 text-center">
                      <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                        somaCorreta ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {somaEtapa.toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                );
              })}

              {/* Linha Desembolso Mensal */}
              <tr className="bg-slate-800/80 font-bold border-t-2 border-slate-700">
                <td className="py-3 px-3 text-slate-200 uppercase font-sans">
                  Desembolso Mensal (R$)
                </td>
                <td className="py-3 px-3 text-right text-emerald-400">
                  {formatarMoeda(totalObraVenda)}
                </td>
                {mesesArray.map((m, idx) => (
                  <td key={m} className="py-3 px-1 text-center text-amber-300 text-[11px]">
                    {formatarMoeda(desembolsoMensal[idx] || 0)}
                  </td>
                ))}
                <td className="py-3 px-3 text-center text-slate-400">
                  -
                </td>
              </tr>

              {/* Linha Percentual Mensal */}
              <tr className="bg-slate-800/40 text-slate-400 font-semibold">
                <td className="py-2 px-3 uppercase font-sans text-[11px]">
                  Avanço Físico Mensal (%)
                </td>
                <td className="py-2 px-3 text-right text-slate-400 text-[11px]">
                  100%
                </td>
                {mesesArray.map((m, idx) => (
                  <td key={m} className="py-2 px-1 text-center text-[11px]">
                    {(percentualMensal[idx] || 0).toFixed(1)}%
                  </td>
                ))}
                <td className="py-2 px-3 text-center text-slate-400 text-[11px]">
                  100%
                </td>
              </tr>

              {/* Linha Acumulado (Curva S) */}
              <tr className="bg-slate-800/60 font-bold text-amber-400">
                <td className="py-2.5 px-3 uppercase font-sans text-xs">
                  Avanço Acumulado (Curva S %)
                </td>
                <td className="py-2.5 px-3 text-right text-amber-400 text-xs">
                  -
                </td>
                {mesesArray.map((m, idx) => (
                  <td key={m} className="py-2.5 px-1 text-center text-xs">
                    {(percentualAcumulado[idx] || 0).toFixed(1)}%
                  </td>
                ))}
                <td className="py-2.5 px-3 text-center text-emerald-400 text-xs">
                  100%
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
