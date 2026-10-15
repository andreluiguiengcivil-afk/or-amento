import React, { useState } from 'react';
import { 
  X, 
  ClipboardList, 
  Calendar, 
  CheckCircle2, 
  FileSpreadsheet, 
  DollarSign, 
  TrendingUp, 
  ArrowRight,
  Plus
} from 'lucide-react';
import { ProjetoOrcamento } from '../types/orcamento';
import { calcularTaxaBDI, formatarMoeda } from '../utils/bdiCalculator';

interface MedicoesModalProps {
  isOpen: boolean;
  onClose: () => void;
  projeto: ProjetoOrcamento;
}

export const MedicoesModal: React.FC<MedicoesModalProps> = ({
  isOpen,
  onClose,
  projeto
}) => {
  const [numeroMedicao, setNumeroMedicao] = useState<number>(1);
  const [dataMedicao, setDataMedicao] = useState<string>('2025-02-28');
  
  // Percentual executado por etapa nesta medição
  const [percentualExecutado, setPercentualExecutado] = useState<Record<string, number>>({
    'etapa-1': 100, // Preliminares 100%
    'etapa-2': 100, // Fundações 100%
    'etapa-3': 45,  // Estrutura 45%
    'etapa-4': 10,  // Alvenarias 10%
    'etapa-5': 0,
    'etapa-6': 0,
    'etapa-7': 15,  // Instalações tubulação 15%
    'etapa-8': 0,
    'etapa-9': 0,
    'etapa-10': 0
  });

  if (!isOpen) return null;

  const taxaBdi = calcularTaxaBDI(projeto.bdiConfig);
  const fatorBdi = 1 + (taxaBdi / 100);

  // Calcula valores medidos
  let totalPrevistoObra = 0;
  let totalMedidoAcumulado = 0;

  const linhasMedicao = projeto.etapas.map(etapa => {
    let custoDireto = 0;
    etapa.itens.forEach(i => custoDireto += (i.quantidade * i.custoUnitario));
    const precoTotalEtapa = custoDireto * fatorBdi;
    const pct = percentualExecutado[etapa.id] || 0;
    const valorMedido = precoTotalEtapa * (pct / 100);

    totalPrevistoObra += precoTotalEtapa;
    totalMedidoAcumulado += valorMedido;

    return {
      id: etapa.id,
      nome: etapa.nome,
      precoTotalEtapa,
      pct,
      valorMedido
    };
  });

  const pctGeralObra = totalPrevistoObra > 0 ? (totalMedidoAcumulado / totalPrevistoObra) * 100 : 0;

  const atualizarPct = (id: string, val: number) => {
    setPercentualExecutado(prev => ({
      ...prev,
      [id]: Math.min(100, Math.max(0, val))
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-slate-800">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 text-teal-800 rounded-xl border border-teal-200">
              <ClipboardList className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Módulo de Medições de Obras</span>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-mono font-bold px-2 py-0.5 rounded">
                  BM Nº {String(numeroMedicao).padStart(2, '0')}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Boletim de Medição Física e Liberação de Recursos Financeiros
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Dados da Medição e KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">Data da Medição</span>
              <input
                type="date"
                value={dataMedicao}
                onChange={e => setDataMedicao(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-mono font-bold text-slate-800 mt-1"
              />
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">Valor Total Previsto</span>
              <span className="text-base font-black text-slate-800 font-mono mt-1 block">
                {formatarMoeda(totalPrevistoObra)}
              </span>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase block">Avanço Físico Global</span>
              <span className="text-base font-black text-teal-700 font-mono mt-1 block">
                {pctGeralObra.toFixed(1)}% <span className="text-xs font-normal text-slate-500">concluído</span>
              </span>
            </div>

            <div className="bg-teal-50 p-3.5 rounded-xl border border-teal-200">
              <span className="text-[11px] font-semibold text-teal-800 uppercase block">Valor a Liberar (BM)</span>
              <span className="text-base font-black text-teal-800 font-mono mt-1 block">
                {formatarMoeda(totalMedidoAcumulado)}
              </span>
            </div>
          </div>

          {/* Tabela de Medição por Etapa */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] uppercase font-mono font-semibold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Etapa Construtiva</th>
                  <th className="py-2.5 px-3 text-right">Valor Total c/ BDI</th>
                  <th className="py-2.5 px-3 text-center w-28">% Executado</th>
                  <th className="py-2.5 px-3 text-right">Valor Medido Acumulado</th>
                  <th className="py-2.5 px-3 text-right">Saldo a Executar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {linhasMedicao.map((linha) => {
                  const saldo = linha.precoTotalEtapa - linha.valorMedido;

                  return (
                    <tr key={linha.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-900">
                        {linha.nome}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-600">
                        {formatarMoeda(linha.precoTotalEtapa)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="5"
                            value={linha.pct}
                            onChange={e => atualizarPct(linha.id, parseFloat(e.target.value) || 0)}
                            className="w-14 text-center rounded border border-slate-300 py-0.5 text-xs font-mono font-bold text-teal-800 bg-white focus:outline-none focus:border-teal-500"
                          />
                          <span className="text-slate-400">%</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-teal-700">
                        {formatarMoeda(linha.valorMedido)}
                      </td>
                      <td className="py-2.5 px-3 text-right text-slate-500">
                        {formatarMoeda(saldo)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between sticky bottom-0">
          <div className="text-xs text-slate-500">
            Total da Medição: <strong className="text-teal-700 font-mono">{formatarMoeda(totalMedidoAcumulado)}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert(`Boletim de Medição Nº ${numeroMedicao} emitido com sucesso!`)}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              Emitir Boletim de Medição (BM)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
