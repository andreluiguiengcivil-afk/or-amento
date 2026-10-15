import React, { useState } from 'react';
import { 
  Boxes, 
  Code2, 
  Download, 
  Copy, 
  Check, 
  Terminal, 
  Play, 
  ExternalLink, 
  Layers, 
  CheckCircle2,
  FileCode,
  HardHat
} from 'lucide-react';
import { PythonHubView } from './PythonHubView';
import { ProjetoOrcamento } from '../types/orcamento';

interface PluginBimPythonViewProps {
  projeto: ProjetoOrcamento;
}

export const PluginBimPythonView: React.FC<PluginBimPythonViewProps> = ({ projeto }) => {
  const [subAba, setSubAba] = useState<'bim' | 'python'>('python');

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner de Integração */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
              <Boxes className="w-5 h-5 stroke-[2.2]" />
            </span>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              Integração BIM (Autodesk Revit) & Scripts Python
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Extraia quantitativos diretamente de modelos 3D BIM (Revit / IFC) e execute automações de orçamento em Python.
          </p>
        </div>

        {/* Toggle BIM vs Python */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto text-xs font-bold">
          <button
            type="button"
            onClick={() => setSubAba('python')}
            className={`px-4 py-2 rounded-lg transition ${
              subAba === 'python'
                ? 'bg-white text-cyan-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-cyan-600" />
              <span>Scripts Python Engine</span>
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSubAba('bim')}
            className={`px-4 py-2 rounded-lg transition ${
              subAba === 'bim'
                ? 'bg-white text-cyan-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Boxes className="w-4 h-4 text-teal-600" />
              <span>Plugin BIM (Revit)</span>
            </span>
          </button>
        </div>
      </div>

      {/* Conteúdo Aba BIM */}
      {subAba === 'bim' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Boxes className="w-5 h-5 text-teal-600" />
              <span>Como Funciona o Plugin BIM (Revit 2021 a 2025)</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              O plugin SEOBRA / OrçaEng para Autodesk Revit conecta os parâmetros dos elementos da modelagem BIM (paredes, lajes, sapatas, vigas, portas e janelas) aos códigos de composições do **SINAPI**.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-teal-700 block mb-1">1. Mapeamento de Parâmetros</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  As famílias no Revit recebem o parâmetro compartilhado <code className="text-slate-800 font-mono">SEOBRA_CODIGO_SINAPI</code>.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-teal-700 block mb-1">2. Extração de Quantidades 5D</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Comprimento, áreas líquidas de pintura/alvenaria e volumes de concreto são calculados geometricamente sem desperdício.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-teal-700 block mb-1">3. Sincronização em 1 Clique</span>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Os quantitativos do modelo são enviados para a planilha orçamentária do OrçaEng / SEOBRA 2 instantaneamente.
                </p>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500">Compatível com Autodesk Revit e Dynamo scripts via Python pyRevit.</span>
              <button
                type="button"
                onClick={() => alert('Download do instalador do add-in do Revit (.addin + script Dynamo / pyRevit).')}
                className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-bold shadow-sm transition"
              >
                <Download className="w-4 h-4" />
                <span>Baixar Add-in Revit (BIM 5D)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba Python */}
      {subAba === 'python' && (
        <PythonHubView projeto={projeto} />
      )}

    </div>
  );
};
