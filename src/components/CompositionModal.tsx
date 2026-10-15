import React, { useState } from 'react';
import { X, Layers, User, Package, Wrench, Check, Plus, Trash2 } from 'lucide-react';
import { ItemOrcamento, ComposicaoPreco, Insumo, TipoInsumo } from '../types/orcamento';
import { formatarMoeda, formatarNumero } from '../utils/bdiCalculator';

interface CompositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItemOrcamento | null;
  onSaveComposition: (itemId: string, newComposicao: ComposicaoPreco) => void;
}

export const CompositionModal: React.FC<CompositionModalProps> = ({
  isOpen,
  onClose,
  item,
  onSaveComposition
}) => {
  const [composicao, setComposicao] = useState<ComposicaoPreco | null>(null);

  React.useEffect(() => {
    if (item?.composicao) {
      setComposicao(JSON.parse(JSON.stringify(item.composicao)));
    } else if (item) {
      // Cria composição default caso não tenha
      setComposicao({
        codigo: item.codigo,
        descricao: item.descricao,
        unidade: item.unidade,
        origem: 'PROPRIA',
        insumos: [
          {
            codigo: 'MAT-01',
            descricao: 'Materiais Diversos',
            unidade: item.unidade,
            tipo: 'MATERIAL',
            coeficiente: 1.0,
            precoUnitario: item.custoUnitario * 0.65,
            custoTotal: item.custoUnitario * 0.65
          },
          {
            codigo: 'MO-01',
            descricao: 'Mão de Obra Especializada',
            unidade: 'h',
            tipo: 'MAO_DE_OBRA',
            coeficiente: 1.0,
            precoUnitario: item.custoUnitario * 0.35,
            custoTotal: item.custoUnitario * 0.35
          }
        ],
        custoMaterial: item.custoUnitario * 0.65,
        custoMaoDeObra: item.custoUnitario * 0.35,
        custoEquipamento: 0,
        custoUnitarioDireto: item.custoUnitario
      });
    }
  }, [item, isOpen]);

  if (!isOpen || !item || !composicao) return null;

  const atualizarInsumo = (index: number, campo: keyof Insumo, valor: any) => {
    const novosInsumos = [...composicao.insumos];
    const insumoAtual = { ...novosInsumos[index], [campo]: valor };

    if (campo === 'coeficiente' || campo === 'precoUnitario') {
      const coef = campo === 'coeficiente' ? parseFloat(valor) || 0 : insumoAtual.coeficiente;
      const preco = campo === 'precoUnitario' ? parseFloat(valor) || 0 : insumoAtual.precoUnitario;
      insumoAtual.custoTotal = coef * preco;
    }

    novosInsumos[index] = insumoAtual;
    recalcularTotais(novosInsumos);
  };

  const recalcularTotais = (insumos: Insumo[]) => {
    let mat = 0;
    let mo = 0;
    let eq = 0;

    insumos.forEach(i => {
      if (i.tipo === 'MAO_DE_OBRA') mo += i.custoTotal;
      else if (i.tipo === 'EQUIPAMENTO') eq += i.custoTotal;
      else mat += i.custoTotal;
    });

    const totalDireto = mat + mo + eq;
    setComposicao({
      ...composicao,
      insumos,
      custoMaterial: mat,
      custoMaoDeObra: mo,
      custoEquipamento: eq,
      custoUnitarioDireto: totalDireto
    });
  };

  const adicionarInsumo = () => {
    const novo: Insumo = {
      codigo: 'NOVO-01',
      descricao: 'Novo Insumo / Material / Operário',
      unidade: 'un',
      tipo: 'MATERIAL',
      coeficiente: 1.0,
      precoUnitario: 10.0,
      custoTotal: 10.0
    };
    const novos = [...composicao.insumos, novo];
    recalcularTotais(novos);
  };

  const removerInsumo = (idx: number) => {
    const novos = composicao.insumos.filter((_, i) => i !== idx);
    recalcularTotais(novos);
  };

  const handleSalvar = () => {
    onSaveComposition(item.id, composicao);
    onClose();
  };

  const getTipoBadge = (tipo: TipoInsumo) => {
    switch (tipo) {
      case 'MAO_DE_OBRA':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50"><User className="w-3 h-3" /> M.O.</span>;
      case 'EQUIPAMENTO':
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50"><Wrench className="w-3 h-3" /> EQUIP.</span>;
      default:
        return <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-700/50"><Package className="w-3 h-3" /> MAT.</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                  {composicao.codigo}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Unidade: <strong>{composicao.unidade}</strong>
                </span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5 leading-snug">
                {composicao.descricao}
              </h2>
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
          
          {/* Resumo de Custos da Composição */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/70">
              <span className="text-[11px] font-medium text-slate-400 block uppercase">Materiais</span>
              <span className="text-base font-bold text-emerald-400 font-mono mt-0.5 block">
                {formatarMoeda(composicao.custoMaterial)}
              </span>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/70">
              <span className="text-[11px] font-medium text-slate-400 block uppercase">Mão de Obra</span>
              <span className="text-base font-bold text-blue-400 font-mono mt-0.5 block">
                {formatarMoeda(composicao.custoMaoDeObra)}
              </span>
            </div>

            <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/70">
              <span className="text-[11px] font-medium text-slate-400 block uppercase">Equipamentos</span>
              <span className="text-base font-bold text-amber-400 font-mono mt-0.5 block">
                {formatarMoeda(composicao.custoEquipamento)}
              </span>
            </div>

            <div className="bg-slate-800 p-3 rounded-xl border border-amber-500/40 shadow-inner">
              <span className="text-[11px] font-medium text-amber-400 block uppercase">Custo Unitário Direto</span>
              <span className="text-base font-extrabold text-white font-mono mt-0.5 block">
                {formatarMoeda(composicao.custoUnitarioDireto)} <span className="text-xs text-slate-400 font-normal">/{composicao.unidade}</span>
              </span>
            </div>
          </div>

          {/* Tabela de Insumos da CPU */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Insumos Constituintes (Composição Analítica)
              </h3>
              <button
                type="button"
                onClick={adicionarInsumo}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-md border border-amber-500/30 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Insumo</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-700/80">
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">Código</th>
                    <th className="py-2.5 px-3">Tipo</th>
                    <th className="py-2.5 px-3">Descrição do Insumo</th>
                    <th className="py-2.5 px-2 text-center">Unid.</th>
                    <th className="py-2.5 px-3 text-right">Coeficiente</th>
                    <th className="py-2.5 px-3 text-right">Preço Unit. (R$)</th>
                    <th className="py-2.5 px-3 text-right">Custo Total (R$)</th>
                    <th className="py-2.5 px-2 text-center">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900/60 font-mono">
                  {composicao.insumos.map((insumo, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition">
                      <td className="py-2 px-3 text-slate-400 font-semibold">
                        <input
                          type="text"
                          value={insumo.codigo}
                          onChange={e => atualizarInsumo(idx, 'codigo', e.target.value)}
                          className="bg-transparent border border-transparent hover:border-slate-700 rounded px-1 py-0.5 w-16"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <select
                          value={insumo.tipo}
                          onChange={e => atualizarInsumo(idx, 'tipo', e.target.value as TipoInsumo)}
                          className="bg-slate-800 text-[10px] rounded px-1 py-0.5 border border-slate-700 text-slate-300"
                        >
                          <option value="MATERIAL">MATERIAL</option>
                          <option value="MAO_DE_OBRA">MÃO DE OBRA</option>
                          <option value="EQUIPAMENTO">EQUIPAMENTO</option>
                        </select>
                      </td>
                      <td className="py-2 px-3 font-sans text-white min-w-[200px]">
                        <input
                          type="text"
                          value={insumo.descricao}
                          onChange={e => atualizarInsumo(idx, 'descricao', e.target.value)}
                          className="w-full bg-transparent border border-transparent hover:border-slate-700 focus:border-amber-500 rounded px-1.5 py-0.5 text-xs text-white"
                        />
                      </td>
                      <td className="py-2 px-2 text-center text-slate-400">
                        <input
                          type="text"
                          value={insumo.unidade}
                          onChange={e => atualizarInsumo(idx, 'unidade', e.target.value)}
                          className="w-10 text-center bg-transparent border border-transparent hover:border-slate-700 rounded py-0.5"
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          step="0.001"
                          value={insumo.coeficiente}
                          onChange={e => atualizarInsumo(idx, 'coeficiente', e.target.value)}
                          className="w-20 text-right bg-slate-800/70 border border-slate-700 focus:border-amber-500 rounded px-1.5 py-0.5 text-xs text-amber-300 font-mono"
                        />
                      </td>
                      <td className="py-2 px-3 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={insumo.precoUnitario}
                          onChange={e => atualizarInsumo(idx, 'precoUnitario', e.target.value)}
                          className="w-20 text-right bg-slate-800/70 border border-slate-700 focus:border-amber-500 rounded px-1.5 py-0.5 text-xs text-slate-200 font-mono"
                        />
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-400 font-bold">
                        {formatarMoeda(insumo.custoTotal)}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => removerInsumo(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition"
                          title="Remover insumo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/95 flex items-center justify-between sticky bottom-0">
          <div className="text-xs text-slate-400">
            Total Direto da CPU: <strong className="text-white font-mono">{formatarMoeda(composicao.custoUnitarioDireto)}</strong> por {composicao.unidade}
          </div>
          <div className="flex items-center gap-3">
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
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Salvar Composição e Atualizar Item</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
