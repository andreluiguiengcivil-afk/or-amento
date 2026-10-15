import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertCircle, Filter, Package, Wrench, User } from 'lucide-react';
import { ProjetoOrcamento, CurvaABCItem } from '../types/orcamento';
import { calcularCurvaAbcServicos, calcularCurvaAbcInsumos } from '../utils/curvaAbcCalculator';
import { formatarMoeda, formatarPorcentagem } from '../utils/bdiCalculator';

interface CurvaAbcViewProps {
  projeto: ProjetoOrcamento;
}

export const CurvaAbcView: React.FC<CurvaAbcViewProps> = ({ projeto }) => {
  const [visao, setVisao] = useState<'SERVICOS' | 'INSUMOS'>('SERVICOS');
  const [filtroClasse, setFiltroClasse] = useState<'TODOS' | 'A' | 'B' | 'C'>('TODOS');

  const dadosServicos = calcularCurvaAbcServicos(projeto.etapas);
  const dadosInsumos = calcularCurvaAbcInsumos(projeto.etapas);

  const dadosAtuais = visao === 'SERVICOS' ? dadosServicos.itens : dadosInsumos.insumos;
  const totalGeral = visao === 'SERVICOS' ? dadosServicos.totalGeral : dadosInsumos.totalGeral;

  const itensFiltrados = dadosAtuais.filter(it => {
    if (filtroClasse === 'TODOS') return true;
    return it.classe === filtroClasse;
  });

  // Cálculos de resumo
  const totalClasseA = dadosAtuais.filter(i => i.classe === 'A').reduce((acc, i) => acc + i.custoTotal, 0);
  const totalClasseB = dadosAtuais.filter(i => i.classe === 'B').reduce((acc, i) => acc + i.custoTotal, 0);
  const totalClasseC = dadosAtuais.filter(i => i.classe === 'C').reduce((acc, i) => acc + i.custoTotal, 0);

  const qtdClasseA = dadosAtuais.filter(i => i.classe === 'A').length;
  const qtdClasseB = dadosAtuais.filter(i => i.classe === 'B').length;
  const qtdClasseC = dadosAtuais.filter(i => i.classe === 'C').length;

  const pctClasseA = totalGeral > 0 ? (totalClasseA / totalGeral) * 100 : 0;
  const pctClasseB = totalGeral > 0 ? (totalClasseB / totalGeral) * 100 : 0;
  const pctClasseC = totalGeral > 0 ? (totalClasseC / totalGeral) * 100 : 0;

  // 12 primeiros itens para gráfico visual
  const topItensGrafico = dadosAtuais.slice(0, 10);
  const maxCusto = topItensGrafico.length > 0 ? topItensGrafico[0].custoTotal : 1;

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <span>Curva ABC (Princípio de Pareto 80/20)</span>
            </h2>
            <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">
              Gestão Estratégica de Custos
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Foque 80% do seu esforço de cotação e negociação nos itens da <strong>Classe A</strong>.
          </p>
        </div>

        {/* Toggle Serviços vs Insumos */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setVisao('SERVICOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              visao === 'SERVICOS'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Curva ABC de Serviços
          </button>
          <button
            type="button"
            onClick={() => setVisao('INSUMOS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              visao === 'INSUMOS'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Curva ABC de Insumos
          </button>
        </div>
      </div>

      {/* Cards de Classificação A, B, C */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Classe A */}
        <div 
          onClick={() => setFiltroClasse(filtroClasse === 'A' ? 'TODOS' : 'A')}
          className={`cursor-pointer bg-slate-900 border p-4 rounded-xl transition ${
            filtroClasse === 'A' ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-rose-500/30 hover:border-rose-500/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-bold font-mono">
              CLASSE A (Críticos)
            </span>
            <span className="text-xs font-mono text-slate-400">{qtdClasseA} itens</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white font-mono">{formatarMoeda(totalClasseA)}</span>
            <div className="flex items-center justify-between text-xs text-rose-400 mt-1 font-semibold">
              <span>{pctClasseA.toFixed(1)}% do orçamento</span>
              <span className="text-slate-500 font-normal">Meta: até 80%</span>
            </div>
          </div>
        </div>

        {/* Classe B */}
        <div 
          onClick={() => setFiltroClasse(filtroClasse === 'B' ? 'TODOS' : 'B')}
          className={`cursor-pointer bg-slate-900 border p-4 rounded-xl transition ${
            filtroClasse === 'B' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-amber-500/30 hover:border-amber-500/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold font-mono">
              CLASSE B (Intermediários)
            </span>
            <span className="text-xs font-mono text-slate-400">{qtdClasseB} itens</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white font-mono">{formatarMoeda(totalClasseB)}</span>
            <div className="flex items-center justify-between text-xs text-amber-400 mt-1 font-semibold">
              <span>{pctClasseB.toFixed(1)}% do orçamento</span>
              <span className="text-slate-500 font-normal">Meta: 15%</span>
            </div>
          </div>
        </div>

        {/* Classe C */}
        <div 
          onClick={() => setFiltroClasse(filtroClasse === 'C' ? 'TODOS' : 'C')}
          className={`cursor-pointer bg-slate-900 border p-4 rounded-xl transition ${
            filtroClasse === 'C' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-emerald-500/30 hover:border-emerald-500/60'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold font-mono">
              CLASSE C (Rotineiros)
            </span>
            <span className="text-xs font-mono text-slate-400">{qtdClasseC} itens</span>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-black text-white font-mono">{formatarMoeda(totalClasseC)}</span>
            <div className="flex items-center justify-between text-xs text-emerald-400 mt-1 font-semibold">
              <span>{pctClasseC.toFixed(1)}% do orçamento</span>
              <span className="text-slate-500 font-normal">Meta: 5%</span>
            </div>
          </div>
        </div>

      </div>

      {/* Gráfico Visual dos Principais Itens */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
          <span>Top 10 Itens de Maior Impacto Financeiro</span>
          <span className="text-slate-500 font-mono font-normal">Ordenação Decrescente</span>
        </h3>

        <div className="space-y-3 pt-2">
          {topItensGrafico.map((item, idx) => {
            const larguraBarra = maxCusto > 0 ? (item.custoTotal / maxCusto) * 100 : 0;
            const badgeCor = item.classe === 'A' 
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
              : (item.classe === 'B' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40');

            return (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate max-w-lg">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${badgeCor}`}>
                      {item.classe}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">{item.codigo}</span>
                    <span className="text-slate-200 truncate">{item.descricao}</span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-right flex-shrink-0">
                    <span className="text-slate-400 text-[11px]">{item.percentual.toFixed(1)}% ({item.percentualAcumulado.toFixed(1)}% acum.)</span>
                    <strong className="text-white text-xs">{formatarMoeda(item.custoTotal)}</strong>
                  </div>
                </div>

                {/* Barra de Progresso */}
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      item.classe === 'A' ? 'bg-gradient-to-r from-rose-600 to-rose-400' : (item.classe === 'B' ? 'bg-gradient-to-r from-amber-600 to-amber-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400')
                    }`}
                    style={{ width: `${larguraBarra}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabela Detalhada com Filtros */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-800/60 border-b border-slate-700/60 flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-400" />
            <span>Planilha Classificada da Curva ABC ({itensFiltrados.length} itens)</span>
          </h3>

          <div className="flex items-center gap-1">
            {(['TODOS', 'A', 'B', 'C'] as const).map(opcao => (
              <button
                key={opcao}
                type="button"
                onClick={() => setFiltroClasse(opcao)}
                className={`text-xs px-2.5 py-1 rounded-md font-semibold transition ${
                  filtroClasse === opcao
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {opcao === 'TODOS' ? 'Todos' : `Classe ${opcao}`}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/40 text-[10px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800 font-mono">
              <tr>
                <th className="py-2.5 px-3 w-16 text-center">Classe</th>
                <th className="py-2.5 px-3 w-28">Código</th>
                <th className="py-2.5 px-3">Descrição</th>
                <th className="py-2.5 px-2 text-center w-14">Unid.</th>
                <th className="py-2.5 px-3 text-right w-24">Qtd. Total</th>
                <th className="py-2.5 px-3 text-right w-28">Custo Unit. (R$)</th>
                <th className="py-2.5 px-3 text-right w-28">Custo Total (R$)</th>
                <th className="py-2.5 px-3 text-right w-20">% do Total</th>
                <th className="py-2.5 px-3 text-right w-24">% Acumulado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {itensFiltrados.map((it, idx) => {
                const classeBadge = it.classe === 'A'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : (it.classe === 'B' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30');

                return (
                  <tr key={idx} className="hover:bg-slate-800/30 transition">
                    <td className="py-2 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${classeBadge}`}>
                        {it.classe}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-slate-400 font-semibold">{it.codigo}</td>
                    <td className="py-2 px-3 font-sans text-white">{it.descricao}</td>
                    <td className="py-2 px-2 text-center text-slate-400">{it.unidade}</td>
                    <td className="py-2 px-3 text-right text-slate-300">{it.quantidade.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right text-slate-300">{formatarMoeda(it.custoUnitario)}</td>
                    <td className="py-2 px-3 text-right font-bold text-amber-300">{formatarMoeda(it.custoTotal)}</td>
                    <td className="py-2 px-3 text-right text-slate-400">{it.percentual.toFixed(2)}%</td>
                    <td className="py-2 px-3 text-right font-semibold text-slate-200">{it.percentualAcumulado.toFixed(2)}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
