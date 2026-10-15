import React, { useState } from 'react';
import { 
  X, 
  Percent, 
  DollarSign, 
  Calculator, 
  FileText, 
  Tag, 
  Folder, 
  Check, 
  Plus, 
  Trash2,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { ProjetoOrcamento, BDIConfig } from '../types/orcamento';
import { formatarMoeda, formatarPorcentagem } from '../utils/bdiCalculator';

interface CadastrosAuxiliaresModalProps {
  isOpen: boolean;
  onClose: () => void;
  tipo: 'encargos-sociais' | 'formulas-memoria' | 'memorial-descritivo' | 'marcadores' | 'pastas';
  projeto: ProjetoOrcamento;
  setProjeto: React.Dispatch<React.SetStateAction<ProjetoOrcamento>>;
}

export const CadastrosAuxiliaresModal: React.FC<CadastrosAuxiliaresModalProps> = ({
  isOpen,
  onClose,
  tipo,
  projeto,
  setProjeto
}) => {
  const [novoMarcador, setNovoMarcador] = useState('');
  const [marcadores, setMarcadores] = useState<string[]>([
    'Fundação e Baldrame',
    'Concreto Estrutural',
    'Acabamento Fino',
    'Aditivo Contratual',
    'Itens Classe A'
  ]);

  if (!isOpen) return null;

  const getTitulo = () => {
    switch (tipo) {
      case 'encargos-sociais': return 'Tabela de Encargos Sociais sobre a Mão de Obra';
      case 'formulas-memoria': return 'f(x) Fórmulas & Memória de Cálculo de Quantitativos';
      case 'memorial-descritivo': return 'Memorial Descritivo da Obra';
      case 'marcadores': return 'Gestão de Marcadores (Tags de Orçamento)';
      case 'pastas': return 'Pastas e Diretórios de Obras';
      default: return 'Cadastros Auxiliares';
    }
  };

  const getIcone = () => {
    switch (tipo) {
      case 'encargos-sociais': return <DollarSign className="w-5 h-5 text-emerald-500" />;
      case 'formulas-memoria': return <Calculator className="w-5 h-5 text-blue-500" />;
      case 'memorial-descritivo': return <FileText className="w-5 h-5 text-indigo-500" />;
      case 'marcadores': return <Tag className="w-5 h-5 text-amber-500" />;
      case 'pastas': return <Folder className="w-5 h-5 text-teal-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-slate-800">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-50 rounded-xl border border-slate-200">
              {getIcone()}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{getTitulo()}</h2>
              <p className="text-xs text-slate-500">Módulo Cadastros SEOBRA 2 / OrçaEng</p>
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
        <div className="p-6 space-y-6 text-xs text-slate-600">
          
          {/* 1. ENCARGOS SOCIAIS */}
          {tipo === 'encargos-sociais' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Padrão SINAPI / Caixa Econômica Federal</span>
                <p className="leading-relaxed">
                  Os encargos sociais incidem sobre os custos de mão de obra direta (Grupo A: Previdência/INSS, FGTS, Salário Educação, SESI/SENAI, SEBRAE, INCRA; Grupo B: Férias, 13º, Auxílio Enfermidade, Licenças; Grupo C: Aviso prévio; Grupo D: Reincidências).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900">SEM Desoneração (Padrão)</span>
                    <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">Ativo</span>
                  </div>
                  <ul className="space-y-2 font-mono">
                    <li className="flex justify-between border-b pb-1">
                      <span>Mão de Obra Horista:</span>
                      <strong className="text-slate-900">114,78%</strong>
                    </li>
                    <li className="flex justify-between border-b pb-1">
                      <span>Mão de Obra Mensalista:</span>
                      <strong className="text-slate-900">71,05%</strong>
                    </li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900">COM Desoneração (CPRB 4,5%)</span>
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Opcional</span>
                  </div>
                  <ul className="space-y-2 font-mono">
                    <li className="flex justify-between border-b pb-1">
                      <span>Mão de Obra Horista:</span>
                      <strong className="text-slate-900">84,04%</strong>
                    </li>
                    <li className="flex justify-between border-b pb-1">
                      <span>Mão de Obra Mensalista:</span>
                      <strong className="text-slate-900">47,78%</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 2. FÓRMULAS & MEMÓRIA DE CÁLCULO */}
          {tipo === 'formulas-memoria' && (
            <div className="space-y-3">
              <p>Fórmulas paramétricas recomendadas para levantamento quantitativo em projetos de engenharia civil:</p>
              
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 border rounded-xl">
                  <span className="font-bold text-slate-900 block">Concreto Estrutural de Lajes, Vigas e Pilares</span>
                  <code className="text-teal-700 font-mono text-[11px] block mt-1">V_concreto (m³) = Área_Construída × 0,20 (médio)</code>
                </div>

                <div className="p-3 bg-slate-50 border rounded-xl">
                  <span className="font-bold text-slate-900 block">Armação em Aço CA-50</span>
                  <code className="text-teal-700 font-mono text-[11px] block mt-1">Massa_Aço (kg) = V_concreto (m³) × 90 a 100 kg/m³</code>
                </div>

                <div className="p-3 bg-slate-50 border rounded-xl">
                  <span className="font-bold text-slate-900 block">Área de Fôrmas de Madeira</span>
                  <code className="text-teal-700 font-mono text-[11px] block mt-1">Área_Fôrmas (m²) = V_concreto (m³) × 10,5 a 12 m²/m³</code>
                </div>

                <div className="p-3 bg-slate-50 border rounded-xl">
                  <span className="font-bold text-slate-900 block">Alvenaria de Vedação</span>
                  <code className="text-teal-700 font-mono text-[11px] block mt-1">Área_Parede (m²) = Perímetro × Pé_Direito - Vãos_Esquadrias (desconto 50% dos vãos &lt; 2m²)</code>
                </div>
              </div>
            </div>
          )}

          {/* 3. MEMORIAL DESCRITIVO */}
          {tipo === 'memorial-descritivo' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Memorial Descritivo do Empreendimento</span>
                <p>
                  Obra: <strong>{projeto.nome}</strong> | Cliente: <strong>{projeto.cliente}</strong> | Área: <strong>{projeto.areaConstruidaM2} m²</strong>
                </p>
                <div className="mt-3 text-[11px] leading-relaxed text-slate-700 space-y-1.5 font-sans">
                  <p>• <strong>1. Serviços Preliminares:</strong> Instalação de canteiro, tapumes de compensado resinado e locação com gabarito contínuo.</p>
                  <p>• <strong>2. Estrutura:</strong> Concreto usinado bombeável classe C25 (fck 25 MPa), formas de madeira resinada e armação em aço CA-50/CA-60.</p>
                  <p>• <strong>3. Alvenarias:</strong> Blocos cerâmicos furados 9x19x19 cm assentados com argamassa mista de cimento, cal e areia 1:2:8.</p>
                  <p>• <strong>4. Revestimentos:</strong> Chapisco 1:3 e reboco desempenado traço 1:2:8, piso em porcelanato retificado 60x60 cm.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => alert('Memorial Descritivo exportado em formato padrão de engenharia.')}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-xs shadow-sm transition"
              >
                Copiar Memorial Descritivo Completo
              </button>
            </div>
          )}

          {/* 4. MARCADORES */}
          {tipo === 'marcadores' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Novo marcador / tag..."
                  value={novoMarcador}
                  onChange={e => setNovoMarcador(e.target.value)}
                  className="flex-1 border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-teal-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (novoMarcador.trim()) {
                      setMarcadores([...marcadores, novoMarcador.trim()]);
                      setNovoMarcador('');
                    }
                  }}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl font-bold text-xs transition"
                >
                  Adicionar
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {marcadores.map((tag, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs border border-slate-200">
                    <Tag className="w-3 h-3 text-teal-600" />
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => setMarcadores(marcadores.filter((_, i) => i !== idx))}
                      className="ml-1 text-slate-400 hover:text-rose-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 5. PASTAS */}
          {tipo === 'pastas' && (
            <div className="space-y-3">
              <p>Organize seus orçamentos em pastas por cliente, ano ou tipo de obra:</p>
              <div className="space-y-2">
                <div className="p-3 border rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Folder className="w-4 h-4 text-teal-600" />
                    <span>Obras Residenciais 2025 (4 projetos)</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Ativa</span>
                </div>
                <div className="p-3 border rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <Folder className="w-4 h-4 text-teal-600" />
                    <span>Licitações e Obras Públicas (2 projetos)</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Ativa</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition"
          >
            Concluir
          </button>
        </div>

      </div>
    </div>
  );
};
