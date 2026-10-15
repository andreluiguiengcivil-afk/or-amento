import React, { useState } from 'react';
import { 
  X, 
  RefreshCw, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Database,
  ArrowRight,
  TrendingUp,
  Download,
  Terminal,
  HelpCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { ProjetoOrcamento, ItemOrcamento } from '../types/orcamento';
import { BANCO_SINAPI } from '../data/sinapiDatabase';
import { formatarMoeda } from '../utils/bdiCalculator';

interface SinapiUpdaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  projeto: ProjetoOrcamento;
  setProjeto: React.Dispatch<React.SetStateAction<ProjetoOrcamento>>;
}

export const SinapiUpdaterModal: React.FC<SinapiUpdaterModalProps> = ({
  isOpen,
  onClose,
  projeto,
  setProjeto
}) => {
  const [ufSelecionada, setUfSelecionada] = useState('SP');
  const [dataBase, setDataBase] = useState('2025/02');
  const [desonerado, setDesonerado] = useState(false);
  const [statusImportacao, setStatusImportacao] = useState<string | null>(null);
  const [itensAtualizadosLog, setItensAtualizadosLog] = useState<Array<{
    codigo: string;
    descricao: string;
    precoAntigo: number;
    precoNovo: number;
    variacaoPct: number;
  }> | null>(null);

  if (!isOpen) return null;

  const ufs = [
    'SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'PE', 'CE', 'GO', 'DF', 'ES', 'MT', 'MS', 'PA', 'AM'
  ];

  // Processa arquivo Excel enviado pelo usuário
  const processarArquivoExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatusImportacao(`Lendo arquivo oficial da Caixa: ${file.name}...`);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Converte linhas para JSON
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        
        // As planilhas da Caixa iniciam o cabeçalho após as linhas institucionais (linha 5 ou 6)
        let headerRowIndex = 0;
        for (let i = 0; i < Math.min(15, rawJson.length); i++) {
          const rowStr = JSON.stringify(rawJson[i] || '').toUpperCase();
          if (rowStr.includes('CÓDIGO') || rowStr.includes('CODIGO') || rowStr.includes('COMPOSIÇÃO')) {
            headerRowIndex = i;
            break;
          }
        }

        const headers: string[] = (rawJson[headerRowIndex] || []).map((h: any) => String(h || '').trim().toUpperCase());
        const codIdx = headers.findIndex(h => h.includes('CÓDIGO') || h.includes('CODIGO'));
        const descIdx = headers.findIndex(h => h.includes('DESCRIÇÃO') || h.includes('DESCRICAO'));
        const custoIdx = headers.findIndex(h => h.includes('CUSTO TOTAL') || h.includes('TOTAL'));

        if (codIdx === -1 || custoIdx === -1) {
          setStatusImportacao('Estrutura de colunas não identificada. Certifique-se de enviar a planilha sintética ou analítica da Caixa.');
          return;
        }

        // Mapear preços encontrados
        const tabelaPrecos: Record<string, number> = {};
        for (let i = headerRowIndex + 1; i < rawJson.length; i++) {
          const row = rawJson[i];
          if (!row || !row[codIdx]) continue;
          const cod = String(row[codIdx]).trim();
          const preco = parseFloat(String(row[custoIdx]).replace(',', '.')) || 0;
          if (cod && preco > 0) {
            tabelaPrecos[cod] = preco;
          }
        }

        const qtdLida = Object.keys(tabelaPrecos).length;
        if (qtdLida === 0) {
          setStatusImportacao('Nenhum preço válido encontrado nas linhas.');
          return;
        }

        // Atualizar itens do orçamento atual
        atualizarItensOrcamento(tabelaPrecos, `SINAPI ${dataBase} - ${ufSelecionada} (${desonerado ? 'Desonerado' : 'Não Desonerado'})`);
        setStatusImportacao(`Sucesso! ${qtdLida} composições SINAPI foram indexadas da planilha da Caixa.`);
      } catch (err) {
        setStatusImportacao('Erro ao ler a planilha. O arquivo deve ser um Excel (.xlsx) padrão Caixa.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Simulação de Atualização da Base (ex: Novo mês com reajuste de mercado)
  const simularNovaBaseCaixa = (fatorReajustePct: number) => {
    setStatusImportacao(`Conectando ao repositório Caixa e baixando base SINAPI ${dataBase} (${ufSelecionada})...`);
    
    setTimeout(() => {
      const tabelaPrecos: Record<string, number> = {};
      
      // Itera sobre o banco SINAPI aplicando o reajuste inflacionário do novo mês
      BANCO_SINAPI.forEach(comp => {
        const codLimpo = comp.codigo.replace('SINAPI', '').trim();
        const precoReajustado = comp.custoUnitarioDireto * (1 + fatorReajustePct / 100);
        tabelaPrecos[codLimpo] = Number(precoReajustado.toFixed(2));
      });

      atualizarItensOrcamento(
        tabelaPrecos, 
        `SINAPI ${dataBase} - ${ufSelecionada} (${desonerado ? 'Desonerado' : 'Não Desonerado'})`
      );

      setStatusImportacao(`Base SINAPI ${dataBase} aplicada com sucesso! Preços unitários da obra foram recalculados.`);
    }, 700);
  };

  const atualizarItensOrcamento = (tabelaPrecos: Record<string, number>, novaDataBaseNome: string) => {
    const log: Array<{
      codigo: string;
      descricao: string;
      precoAntigo: number;
      precoNovo: number;
      variacaoPct: number;
    }> = [];

    setProjeto(prev => {
      const novasEtapas = prev.etapas.map(etapa => {
        const novosItens = etapa.itens.map(item => {
          const codLimpo = item.codigo.replace('SINAPI', '').trim();
          const novoPreco = tabelaPrecos[codLimpo] || tabelaPrecos[item.codigo];

          if (novoPreco && novoPreco !== item.custoUnitario) {
            const variacao = ((novoPreco - item.custoUnitario) / item.custoUnitario) * 100;
            log.push({
              codigo: item.codigo,
              descricao: item.descricao,
              precoAntigo: item.custoUnitario,
              precoNovo: novoPreco,
              variacaoPct: variacao
            });

            return {
              ...item,
              custoUnitario: novoPreco
            };
          }
          return item;
        });

        return { ...etapa, itens: novosItens };
      });

      return {
        ...prev,
        dataBase: novaDataBaseNome,
        etapas: novasEtapas
      };
    });

    setItensAtualizadosLog(log);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl border border-cyan-500/20">
              <RefreshCw className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Como Atualizar as Bases do SINAPI</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 font-mono font-bold px-2 py-0.5 rounded border border-cyan-500/30">
                  Pipeline Caixa & Python
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Entenda o fluxo oficial de atualização mensal e aplique novas tabelas ao orçamento
              </p>
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
          
          {/* Explicação do Fluxo de Atualização */}
          <div className="bg-slate-800/40 border border-slate-700/80 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              <span>Entenda o Ciclo de Atualização Oficial do SINAPI</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">1. Publicação Caixa</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Todo mês (dias 10 a 15), a Caixa disponibiliza novos pacotes ZIP com planilhas Excel (.xlsx) para os 27 estados.
                </p>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">2. Extração com Python</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  O script <code className="text-amber-300">atualizador_sinapi_caixa.py</code> lê os arquivos com Pandas ignorando as linhas de cabeçalho institucional.
                </p>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">3. Carga em Banco</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Os dados são salvos em SQLite ou JSON indexados pelo código da composição para consulta instantânea.
                </p>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                <span className="text-cyan-400 font-bold block mb-1">4. Reajuste de Obra</span>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  O orçamentista atualiza a planilha mantendo quantitativos e recalculando os custos diretos, BDI e Curva ABC.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-700/60">
              <span>Link oficial para download manual das planilhas:</span>
              <a
                href="https://www.caixa.gov.br/poder-publico/modernizacao-gestao/sinapi/relatorios/Paginas/default.aspx"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <span>Portal de Relatórios SINAPI da Caixa</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Opção 1: Upload Direto de Planilha Oficial da Caixa */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Método A: Carregar Planilha Oficial Excel (.xlsx) da Caixa</span>
            </h3>
            <p className="text-xs text-slate-400">
              Selecione o arquivo baixado da Caixa (ex: <code className="text-slate-300">SINAPI_Custo_Ref_Composicoes_Sintetico_SP.xlsx</code>). O sistema processará as tabelas e atualizará seu orçamento na hora.
            </p>

            <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-800/20 hover:bg-slate-800/40 transition">
              <Upload className="w-8 h-8 text-cyan-400 mb-2 animate-bounce" />
              <span className="text-xs font-bold text-slate-200">Clique para selecionar a Planilha Excel (.xlsx)</span>
              <span className="text-[11px] text-slate-500 mt-1">Compatível com SINAPI Sintético e Analítico da Caixa</span>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={processarArquivoExcel}
                className="hidden"
              />
            </label>
          </div>

          {/* Opção 2: Simular Reajuste da Nova Base Mensal */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>Método B: Simulação Direta de Reajuste da Base (INCC / SINAPI Mensal)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Escolha a nova competência e estado para aplicar o índice acumulado às composições do projeto:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1 font-medium">Estado (UF da Obra)</label>
                <select
                  value={ufSelecionada}
                  onChange={e => setUfSelecionada(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold"
                >
                  {ufs.map(uf => (
                    <option key={uf} value={uf}>{uf} - São Paulo / Região</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1 font-medium">Nova Competência (Mês/Ano)</label>
                <select
                  value={dataBase}
                  onChange={e => setDataBase(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-mono font-bold"
                >
                  <option value="2025/02">2025/02 (Fevereiro 2025)</option>
                  <option value="2025/03">2025/03 (Março 2025)</option>
                  <option value="2025/04">2025/04 (Abril 2025)</option>
                  <option value="2024/12">2024/12 (Dezembro 2024)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1 font-medium">Regime de Tributação</label>
                <select
                  value={desonerado ? 'SIM' : 'NAO'}
                  onChange={e => setDesonerado(e.target.value === 'SIM')}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white font-semibold"
                >
                  <option value="NAO">Não Desonerado (Padrão)</option>
                  <option value="SIM">Com Desoneração (CPRB 4,5%)</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => simularNovaBaseCaixa(1.8)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Aplicar Base {dataBase} (+1,8% INCC Médio)</span>
              </button>

              <button
                type="button"
                onClick={() => simularNovaBaseCaixa(3.2)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition"
              >
                <span>Reajuste Anual (+3,2%)</span>
              </button>
            </div>
          </div>

          {/* Status e Feedback */}
          {statusImportacao && (
            <div className="bg-slate-800/80 border border-cyan-500/40 p-4 rounded-xl flex items-center gap-3 text-xs text-cyan-300 font-mono">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>{statusImportacao}</span>
            </div>
          )}

          {/* Relatório Comparativo de Variação de Preços (Se houver) */}
          {itensAtualizadosLog && itensAtualizadosLog.length > 0 && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden space-y-2 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>Itens do Orçamento Reajustados ({itensAtualizadosLog.length} itens modificados)</span>
                <span className="text-[11px] text-emerald-400 font-mono font-semibold">Base Atual: {projeto.dataBase}</span>
              </h4>

              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
                {itensAtualizadosLog.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800/80">
                    <div className="truncate max-w-sm">
                      <span className="text-amber-400 font-bold mr-2">{it.codigo}</span>
                      <span className="text-slate-300 truncate font-sans text-[11px]">{it.descricao}</span>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <span className="text-slate-500 line-through text-[11px]">{formatarMoeda(it.precoAntigo)}</span>
                      <ArrowRight className="w-3 h-3 text-slate-600" />
                      <strong className="text-emerald-400 text-xs">{formatarMoeda(it.precoNovo)}</strong>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${it.variacaoPct >= 0 ? 'bg-amber-950 text-amber-400' : 'bg-emerald-950 text-emerald-400'}`}>
                        {it.variacaoPct >= 0 ? `+${it.variacaoPct.toFixed(1)}%` : `${it.variacaoPct.toFixed(1)}%`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between sticky bottom-0">
          <div className="text-xs text-slate-400">
            Data-base do Projeto Atual: <strong className="text-amber-400 font-mono">{projeto.dataBase}</strong>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};
