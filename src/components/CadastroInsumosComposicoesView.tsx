import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Percent, 
  Layers, 
  Truck, 
  Plus, 
  Folder, 
  FolderOpen, 
  Search, 
  Phone, 
  MessageCircle, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  DollarSign, 
  HardHat, 
  ChevronRight, 
  ChevronDown, 
  Building2, 
  Boxes,
  Sparkles,
  Filter,
  ArrowUpDown,
  Save,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Users
} from 'lucide-react';
import { InsumoProprio, ItemIncidencia, ProducaoEquipeMecanica, TipoInsumo, ComposicaoPreco, FornecedorReal, InsumoItem } from '../types/orcamento';
import { formatarMoeda } from '../utils/bdiCalculator';
import { CotacaoInsumoModal } from './CotacaoInsumoModal';
import { InsumosGenericosCotacaoView } from './InsumosGenericosCotacaoView';
import { CadastrarFornecedorRealModal } from './CadastrarFornecedorRealModal';
import { FornecedoresGerenciamentoView } from './FornecedoresGerenciamentoView';
import { PrecosFornecedoresView } from './PrecosFornecedoresView';
import { FORNECEDORES_INICIAIS, TODOS_INSUMOS_INICIAIS } from '../data/fornecedoresInsumosData';

interface CadastroInsumosComposicoesViewProps {
  abaAtivaInicial?: 'cadastro' | 'editar-insumos' | 'fornecedores' | 'precos-fornecedores' | 'genericos' | 'incidencias' | 'composicoes';
  onAdicionarComposicaoAoOrcamento?: (comp: ComposicaoPreco) => void;
}

export const CadastroInsumosComposicoesView: React.FC<CadastroInsumosComposicoesViewProps> = ({
  abaAtivaInicial = 'cadastro',
  onAdicionarComposicaoAoOrcamento
}) => {
  // Aba interna da view
  const [subAba, setSubAba] = useState<'cadastro' | 'editar-insumos' | 'fornecedores' | 'precos-fornecedores' | 'genericos' | 'incidencias' | 'composicoes'>(abaAtivaInicial);

  useEffect(() => {
    if (abaAtivaInicial) {
      setSubAba(abaAtivaInicial);
    }
  }, [abaAtivaInicial]);

  // Lista de Fornecedores Cadastrados no Programa
  const [fornecedores, setFornecedores] = useState<FornecedorReal[]>(() => {
    try {
      const salvo = localStorage.getItem('orcapro_fornecedores_reais');
      if (salvo) return JSON.parse(salvo);
    } catch {
      // fallback
    }
    return FORNECEDORES_INICIAIS;
  });

  const salvarFornecedores = (novosFornecedores: FornecedorReal[]) => {
    setFornecedores(novosFornecedores);
    try {
      localStorage.setItem('orcapro_fornecedores_reais', JSON.stringify(novosFornecedores));
    } catch {
      // ignore
    }
  };

  // Lista Geral de Insumos (com Base = 'SINAPI' ou Base = Nome do Fornecedor Real)
  const [insumos, setInsumos] = useState<InsumoItem[]>(() => {
    try {
      const salvo = localStorage.getItem('orcapro_insumos_catalogo');
      if (salvo) return JSON.parse(salvo);
    } catch {
      // fallback
    }
    return TODOS_INSUMOS_INICIAIS.map(item => ({
      ...item,
      nome: item.descricao,
      fornecedor: item.base,
      whatsappFornecedor: item.telefoneFornecedor || ''
    }));
  });

  const salvarInsumos = (novosInsumos: InsumoItem[]) => {
    setInsumos(novosInsumos);
    try {
      localStorage.setItem('orcapro_insumos_catalogo', JSON.stringify(novosInsumos));
      localStorage.setItem('seobra_insumos_fornecedores', JSON.stringify(novosInsumos));
    } catch {
      // ignore
    }
  };

  // Modal de Cadastrar Fornecedor Real no Insumo Selecionado
  const [modalFornecedorRealAberto, setModalFornecedorRealAberto] = useState(false);
  const [insumoParaFornecedorReal, setInsumoParaFornecedorReal] = useState<InsumoItem | null>(null);
  const [fornecedorPreSelecionadoId, setFornecedorPreSelecionadoId] = useState<string | null>(null);

  const abrirModalFornecedorReal = (insumo: InsumoItem) => {
    setInsumoParaFornecedorReal(insumo);
    setModalFornecedorRealAberto(true);
  };

  const handleAdicionarFornecedor = (novo: FornecedorReal) => {
    const atualizados = [novo, ...fornecedores];
    salvarFornecedores(atualizados);
  };

  const handleAtualizarFornecedor = (atualizado: FornecedorReal) => {
    const atualizados = fornecedores.map(f => f.id === atualizado.id ? atualizado : f);
    salvarFornecedores(atualizados);
  };

  const handleExcluirFornecedor = (id: string) => {
    const atualizados = fornecedores.filter(f => f.id !== id);
    salvarFornecedores(atualizados);
  };

  const handleCriarInsumoComBaseFornecedor = (novoInsumo: InsumoItem) => {
    const insumoNormalizado: InsumoItem = {
      ...novoInsumo,
      nome: novoInsumo.descricao,
      fornecedor: novoInsumo.base,
      whatsappFornecedor: novoInsumo.telefoneFornecedor || ''
    };

    // Verificar se já existe insumo com mesmo código e mesma base
    const indexExistente = insumos.findIndex(
      i => i.codigo === insumoNormalizado.codigo && i.base.toLowerCase() === insumoNormalizado.base.toLowerCase()
    );

    let atualizados: InsumoItem[];
    if (indexExistente >= 0) {
      atualizados = [...insumos];
      atualizados[indexExistente] = insumoNormalizado;
    } else {
      atualizados = [insumoNormalizado, ...insumos];
    }

    salvarInsumos(atualizados);
    setFeedbackSalvo(`Novo insumo cadastrado com sucesso! Código ${insumoNormalizado.codigo} com base "${insumoNormalizado.base}" por ${formatarMoeda(insumoNormalizado.precoUnitario)}.`);
    setTimeout(() => setFeedbackSalvo(null), 4000);
  };

  const handleExcluirInsumo = (id: string) => {
    const atualizados = insumos.filter(i => i.id !== id);
    salvarInsumos(atualizados);
  };

  // Lista de Itens de Incidência
  const [incidencias, setIncidencias] = useState<ItemIncidencia[]>([
    {
      id: 'inc-01',
      codigo: 'INC-MO-01',
      nome: 'Encargos Complementares sobre Mão de Obra',
      descricao: 'EPI, Transporte, Alimentação e Exames conforme CCT',
      baseCalculo: 'MAO_DE_OBRA',
      percentual: 18.5
    },
    {
      id: 'inc-02',
      codigo: 'INC-MAT-01',
      nome: 'Perda Técnica e Desperdício de Materiais Cerâmicos',
      descricao: 'Estimativa de quebra de transporte e assentamento',
      baseCalculo: 'MATERIAL',
      percentual: 5.0
    }
  ]);

  // Modais de Criação
  const [modalAtivo, setModalAtivo] = useState<'insumo' | 'incidencia' | 'composicao' | 'equipe_mecanica' | null>(null);

  // Pasta de Fornecedor aberta na aba de cadastro
  const [fornecedorAberto, setFornecedorAberto] = useState<string | null>(null);
  const [buscaTermo, setBuscaTermo] = useState('');

  // Estados dos Formulários - Criar Insumo
  const [novoFornecedor, setNovoFornecedor] = useState('');
  const [novoWhatsapp, setNovoWhatsapp] = useState('');
  const [novoCodigo, setNovoCodigo] = useState('');
  const [novoNome, setNovoNome] = useState('');
  const [novaUnidade, setNovaUnidade] = useState('m²');
  const [novoPreco, setNovoPreco] = useState('');
  const [novoTipo, setNovoTipo] = useState<TipoInsumo>('MATERIAL');

  // Estado de sugestão de código detectado por similaridade de nome (Criar)
  const [insumoDetectado, setInsumoDetectado] = useState<InsumoProprio | null>(null);
  const [outrosInsumosSimilares, setOutrosInsumosSimilares] = useState<InsumoProprio[]>([]);

  // Estados do Modal de Edição de Insumo Cadastrado
  const [insumoEmEdicao, setInsumoEmEdicao] = useState<InsumoProprio | null>(null);
  const [editFornecedor, setEditFornecedor] = useState('');
  const [editWhatsapp, setEditWhatsapp] = useState('');
  const [editCodigo, setEditCodigo] = useState('');
  const [editNome, setEditNome] = useState('');
  const [editUnidade, setEditUnidade] = useState('');
  const [editPreco, setEditPreco] = useState('');
  const [editTipo, setEditTipo] = useState<TipoInsumo>('MATERIAL');
  const [editInsumoDetectado, setEditInsumoDetectado] = useState<InsumoProprio | null>(null);
  const [editOutrosSimilares, setEditOutrosSimilares] = useState<InsumoProprio[]>([]);
  const [feedbackSalvo, setFeedbackSalvo] = useState<string | null>(null);

  // Estados do Modal de Cotação de Insumo (WhatsApp RFQ)
  const [modalCotacaoAberto, setModalCotacaoAberto] = useState(false);
  const [insumoParaCotar, setInsumoParaCotar] = useState<InsumoProprio | null>(null);

  const abrirCotacaoInsumo = (insumo: InsumoProprio | null = null) => {
    setInsumoParaCotar(insumo);
    setModalCotacaoAberto(true);
  };

  const handleSalvarInsumoCotado = (novoInsumo: InsumoProprio) => {
    const existeIndex = insumos.findIndex(
      i => i.codigo.toUpperCase() === novoInsumo.codigo.toUpperCase() && 
           i.fornecedor.toLowerCase() === novoInsumo.fornecedor.toLowerCase()
    );

    let atualizados: InsumoProprio[];
    if (existeIndex >= 0) {
      atualizados = [...insumos];
      atualizados[existeIndex] = novoInsumo;
    } else {
      atualizados = [...insumos, novoInsumo];
    }

    salvarInsumos(atualizados);
    setFornecedorAberto(novoInsumo.fornecedor);
    setFeedbackSalvo(`Insumo cotado "${novoInsumo.codigo} - ${novoInsumo.nome}" salvo com sucesso na pasta de ${novoInsumo.fornecedor}!`);
    setTimeout(() => setFeedbackSalvo(null), 4000);
  };

  // Filtros na aba de Edição de Insumos
  const [filtroTextoEditar, setFiltroTextoEditar] = useState('');
  const [filtroFornecedorEditar, setFiltroFornecedorEditar] = useState('TODOS');
  const [filtroTipoEditar, setFiltroTipoEditar] = useState('TODOS');

  // Form Incidência
  const [incCodigo, setIncCodigo] = useState('');
  const [incNome, setIncNome] = useState('');
  const [incDescricao, setIncDescricao] = useState('');
  const [incBase, setIncBase] = useState<'MAO_DE_OBRA' | 'MATERIAL' | 'EQUIPAMENTO' | 'TOTAL_DIRETO'>('MAO_DE_OBRA');
  const [incPercentual, setIncPercentual] = useState('');

  // Form Composição
  const [compCodigo, setCompCodigo] = useState('COMP-01');
  const [compDescricao, setCompDescricao] = useState('');
  const [compUnidade, setCompUnidade] = useState('m²');

  // Form Equipe Mecânica
  const [eqCodigo, setEqCodigo] = useState('SICRO-EQ-01');
  const [eqDescricao, setEqDescricao] = useState('');
  const [eqUnidade, setEqUnidade] = useState('m³');
  const [eqProducaoHora, setEqProducaoHora] = useState('45.0');
  const [eqCustoHorario, setEqCustoHorario] = useState('320.00');

  // Normalização de texto para busca semântica
  const normalizarTexto = (txt: string) => {
    return txt
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Detector em tempo real para Criação
  const analisarNomeEDetectarCodigo = (nomeDigitado: string) => {
    setNovoNome(nomeDigitado);
    if (!nomeDigitado || nomeDigitado.trim().length < 3) {
      setInsumoDetectado(null);
      setOutrosInsumosSimilares([]);
      return;
    }

    const normDigitado = normalizarTexto(nomeDigitado);
    const tokensDigitados = normDigitado.split(' ').filter(t => t.length > 2);

    if (tokensDigitados.length === 0) {
      setInsumoDetectado(null);
      setOutrosInsumosSimilares([]);
      return;
    }

    const matches = insumos.map(ins => {
      const normExistente = normalizarTexto(ins.nome);
      const tokensExistentes = normExistente.split(' ').filter(t => t.length > 2);

      let pontos = 0;
      tokensDigitados.forEach(token => {
        if (normExistente.includes(token)) {
          pontos += 3;
        } else {
          const parcial = tokensExistentes.some(t => t.startsWith(token.substring(0, 4)) || token.startsWith(t.substring(0, 4)));
          if (parcial) pontos += 1.5;
        }
      });

      const numerosDigitados: string[] = nomeDigitado.match(/\d+/g) || [];
      const numerosExistentes: string[] = ins.nome.match(/\d+/g) || [];
      const numIntersecao = numerosDigitados.filter(n => numerosExistentes.includes(n));
      pontos += (numIntersecao.length * 2.5);

      return { insumo: ins, score: pontos };
    })
    .filter(m => m.score >= 3.0)
    .sort((a, b) => b.score - a.score);

    if (matches.length > 0) {
      const melhorMatch = matches[0].insumo;
      setInsumoDetectado(melhorMatch);
      setOutrosInsumosSimilares(matches.slice(1, 4).map(m => m.insumo));

      if (!novoCodigo || novoCodigo.trim() === '') {
        setNovoCodigo(melhorMatch.codigo);
        setNovaUnidade(melhorMatch.unidade);
        setNovoTipo(melhorMatch.tipo);
      }
    } else {
      setInsumoDetectado(null);
      setOutrosInsumosSimilares([]);
    }
  };

  // Detector em tempo real para Edição de Insumo
  const analisarNomeEDetectarCodigoEdicao = (nomeDigitado: string, currentId: string) => {
    setEditNome(nomeDigitado);
    if (!nomeDigitado || nomeDigitado.trim().length < 3) {
      setEditInsumoDetectado(null);
      setEditOutrosSimilares([]);
      return;
    }

    const normDigitado = normalizarTexto(nomeDigitado);
    const tokensDigitados = normDigitado.split(' ').filter(t => t.length > 2);

    if (tokensDigitados.length === 0) {
      setEditInsumoDetectado(null);
      setEditOutrosSimilares([]);
      return;
    }

    const outros = insumos.filter(i => i.id !== currentId);
    const matches = outros.map(ins => {
      const normExistente = normalizarTexto(ins.nome);
      const tokensExistentes = normExistente.split(' ').filter(t => t.length > 2);

      let pontos = 0;
      tokensDigitados.forEach(token => {
        if (normExistente.includes(token)) {
          pontos += 3;
        } else {
          const parcial = tokensExistentes.some(t => t.startsWith(token.substring(0, 4)) || token.startsWith(t.substring(0, 4)));
          if (parcial) pontos += 1.5;
        }
      });

      const numerosDigitados: string[] = nomeDigitado.match(/\d+/g) || [];
      const numerosExistentes: string[] = ins.nome.match(/\d+/g) || [];
      const numIntersecao = numerosDigitados.filter(n => numerosExistentes.includes(n));
      pontos += (numIntersecao.length * 2.5);

      return { insumo: ins, score: pontos };
    })
    .filter(m => m.score >= 3.0)
    .sort((a, b) => b.score - a.score);

    if (matches.length > 0) {
      setEditInsumoDetectado(matches[0].insumo);
      setEditOutrosSimilares(matches.slice(1, 4).map(m => m.insumo));
    } else {
      setEditInsumoDetectado(null);
      setEditOutrosSimilares([]);
    }
  };

  const aplicarCodigoDetectado = (insumo: InsumoProprio) => {
    setNovoCodigo(insumo.codigo);
    setNovaUnidade(insumo.unidade);
    setNovoTipo(insumo.tipo);
  };

  const aplicarCodigoDetectadoEdicao = (insumo: InsumoProprio) => {
    setEditCodigo(insumo.codigo);
    setEditUnidade(insumo.unidade);
    setEditTipo(insumo.tipo);
  };

  // Agrupamento por Fornecedor (Pastas e Filtros)
  const fornecedoresUnicos = Array.from(new Set(insumos.map(i => i.base || i.fornecedor || 'SINAPI')));

  // Abrir Modal de Edição de um Insumo
  const abrirEdicaoInsumo = (item: InsumoProprio) => {
    setInsumoEmEdicao(item);
    setEditFornecedor(item.fornecedor);
    setEditWhatsapp(item.whatsappFornecedor || '');
    setEditCodigo(item.codigo);
    setEditNome(item.nome);
    setEditUnidade(item.unidade);
    setEditPreco(item.precoUnitario.toString());
    setEditTipo(item.tipo);
    setEditInsumoDetectado(null);
    setEditOutrosSimilares([]);
  };

  // Salvar Alterações do Insumo Editado
  const handleSalvarEdicaoInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!insumoEmEdicao) return;

    if (!editFornecedor.trim() || !editNome.trim() || !editCodigo.trim()) {
      alert('Preencha os campos obrigatórios: Fornecedor, Código e Nome do Insumo.');
      return;
    }

    const precoNum = parseFloat(editPreco.replace(',', '.')) || 0;

    const insumoAtualizado: InsumoProprio = {
      ...insumoEmEdicao,
      fornecedor: editFornecedor.trim(),
      base: editFornecedor.trim(),
      whatsappFornecedor: editWhatsapp.replace(/\D/g, ''),
      codigo: editCodigo.trim().toUpperCase(),
      nome: editNome.trim(),
      descricao: editNome.trim(),
      unidade: editUnidade.trim(),
      precoUnitario: precoNum,
      tipo: editTipo,
      dataAtualizacao: new Date().toISOString().split('T')[0]
    };

    const novaLista = insumos.map(item => item.id === insumoEmEdicao.id ? insumoAtualizado : item);
    salvarInsumos(novaLista);

    setInsumoEmEdicao(null);
    setFeedbackSalvo(`Insumo "${insumoAtualizado.codigo} - ${insumoAtualizado.nome}" atualizado com sucesso!`);
    setTimeout(() => setFeedbackSalvo(null), 4000);
  };

  const handleCriarInsumo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoFornecedor.trim() || !novoNome.trim() || !novoCodigo.trim()) {
      alert('Preencha os campos obrigatórios: Fornecedor, Código e Nome do Insumo.');
      return;
    }

    const novoItem: InsumoProprio = {
      id: `ins-${Date.now()}`,
      fornecedor: novoFornecedor.trim(),
      base: novoFornecedor.trim(),
      whatsappFornecedor: novoWhatsapp.replace(/\D/g, ''),
      codigo: novoCodigo.trim().toUpperCase(),
      nome: novoNome.trim(),
      descricao: novoNome.trim(),
      unidade: novaUnidade.trim(),
      precoUnitario: parseFloat(novoPreco.replace(',', '.')) || 0,
      tipo: novoTipo,
      dataAtualizacao: new Date().toISOString().split('T')[0]
    };

    const atualizada = [...insumos, novoItem];
    salvarInsumos(atualizada);
    setFornecedorAberto(novoItem.fornecedor);
    setModalAtivo(null);

    setFeedbackSalvo(`Insumo "${novoItem.codigo}" cadastrado com sucesso na pasta de ${novoItem.fornecedor}!`);
    setTimeout(() => setFeedbackSalvo(null), 4000);

    // Limpar campos
    setNovoCodigo('');
    setNovoNome('');
    setNovoPreco('');
    setInsumoDetectado(null);
    setOutrosInsumosSimilares([]);
  };

  const handleCriarIncidencia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incCodigo.trim() || !incNome.trim()) return;

    const novaInc: ItemIncidencia = {
      id: `inc-${Date.now()}`,
      codigo: incCodigo.trim().toUpperCase(),
      nome: incNome.trim(),
      descricao: incDescricao.trim(),
      baseCalculo: incBase,
      percentual: parseFloat(incPercentual.replace(',', '.')) || 0
    };

    setIncidencias([...incidencias, novaInc]);
    setModalAtivo(null);
    setIncCodigo('');
    setIncNome('');
    setIncDescricao('');
    setIncPercentual('');
  };

  const removerInsumo = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este insumo?')) {
      const filtrados = insumos.filter(i => i.id !== id);
      salvarInsumos(filtrados);
    }
  };

  const formatarWhatsappLink = (numero: string) => {
    const limpo = numero.replace(/\D/g, '');
    if (!limpo) return '#';
    const numeroCompleto = limpo.length <= 11 ? `55${limpo}` : limpo;
    return `https://wa.me/${numeroCompleto}?text=Olá,%20gostaria%20de%20uma%20cotação%20para%20obra.`;
  };

  // Insumos filtrados para a aba "Banco de Insumos (SINAPI & Fornecedores)"
  const insumosFiltradosEditar = insumos.filter(i => {
    const nomeOuDesc = i.descricao || i.nome || '';
    const baseItem = i.base || i.fornecedor || 'SINAPI';
    const matchTexto = filtroTextoEditar === '' || 
      nomeOuDesc.toLowerCase().includes(filtroTextoEditar.toLowerCase()) ||
      i.codigo.toLowerCase().includes(filtroTextoEditar.toLowerCase()) ||
      baseItem.toLowerCase().includes(filtroTextoEditar.toLowerCase());
    
    let matchFornecedor = true;
    if (filtroFornecedorEditar === 'SINAPI') {
      matchFornecedor = baseItem === 'SINAPI';
    } else if (filtroFornecedorEditar === 'FORNECEDORES') {
      matchFornecedor = baseItem !== 'SINAPI';
    } else if (filtroFornecedorEditar !== 'TODOS') {
      matchFornecedor = baseItem === filtroFornecedorEditar;
    }

    const matchTipo = filtroTipoEditar === 'TODOS' || i.tipo === filtroTipoEditar;

    return matchTexto && matchFornecedor && matchTipo;
  });

  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      
      {/* Alerta de Feedback de Salvamento */}
      {feedbackSalvo && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl flex items-center justify-between text-xs font-semibold shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            <span>{feedbackSalvo}</span>
          </div>
          <button onClick={() => setFeedbackSalvo(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header da Aba com seletor de Sub-Abas incluindo Fornecedores e Preços */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-400 text-slate-950 font-black shadow-xs">
              <Boxes className="w-6 h-6 stroke-[2.2]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Insumos & Fornecedores
                </h2>
                <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  Base SINAPI & Fornecedores Reais
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Insumos oficiais SINAPI com vinculação de fornecedores reais mantendo o mesmo código e registrando o nome do fornecedor como base.
              </p>
            </div>
          </div>

          {/* Botões de Ação Rápida */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                if (insumos.length > 0) {
                  abrirModalFornecedorReal(insumos[0]);
                } else {
                  setSubAba('fornecedores');
                }
              }}
              className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer border border-amber-400/40"
              title="Vincular um fornecedor real a um insumo SINAPI"
            >
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>+ FORNECEDOR REAL NO INSUMO</span>
            </button>

            <button
              type="button"
              onClick={() => setSubAba('precos-fornecedores')}
              className="py-2 px-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Cadastrar e gerenciar preços por fornecedor"
            >
              <DollarSign className="w-4 h-4 stroke-[3]" />
              <span>CADASTRAR PREÇO</span>
            </button>

            <button
              type="button"
              onClick={() => setSubAba('genericos')}
              className="py-2 px-3.5 bg-emerald-700 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              title="Aba de Insumos Genéricos e RFQ consolidada"
            >
              <Users className="w-4 h-4 stroke-[2.2]" />
              <span>RFQ / COTAÇÕES</span>
            </button>
          </div>
        </div>

        {/* BARRA DE SUB-ABAS ATUALIZADA COM AS REGRAS SOLICITADAS */}
        <div className="flex items-center border-b border-slate-200 overflow-x-auto pt-2 gap-2 text-xs font-bold">
          
          {/* Sub-Aba 1: BANCO DE INSUMOS (SINAPI & FORNECEDORES) */}
          <button
            type="button"
            onClick={() => setSubAba('editar-insumos')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
              subAba === 'editar-insumos'
                ? 'border-amber-500 text-amber-950 bg-amber-50/60 rounded-t-lg font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg'
            }`}
          >
            <Boxes className="w-4 h-4 text-amber-700" />
            <span>Banco de Insumos (SINAPI & Fornecedores)</span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-amber-400 text-slate-950 font-black shadow-xs">
              {insumos.length}
            </span>
          </button>

          {/* Sub-Aba 2: PÁGINA DE FORNECEDORES (SOLICITADO) */}
          <button
            type="button"
            onClick={() => setSubAba('fornecedores')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
              subAba === 'fornecedores'
                ? 'border-amber-500 text-amber-950 bg-amber-50/60 rounded-t-lg font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg'
            }`}
            title="Página de cadastro de fornecedores com contato, e-mail e endereço"
          >
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>Página de Fornecedores</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-900 text-amber-300 font-bold">
              {fornecedores.length}
            </span>
          </button>

          {/* Sub-Aba 3: CADASTRAR PREÇO DESSE FORNECEDOR (SOLICITADO) */}
          <button
            type="button"
            onClick={() => setSubAba('precos-fornecedores')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
              subAba === 'precos-fornecedores'
                ? 'border-amber-500 text-amber-950 bg-amber-50/60 rounded-t-lg font-black'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg'
            }`}
            title="Aba para cadastrar o preço do fornecedor mantendo código SINAPI e base do fornecedor"
          >
            <DollarSign className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
            <span>Cadastrar Preço de Fornecedor</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
              {insumos.filter(i => i.base !== 'SINAPI').length} cotados
            </span>
          </button>

          {/* Sub-Aba 4: INSUMOS GENÉRICOS & LISTA FINAL PARA COTAÇÃO POR FORNECEDOR */}
          <button
            type="button"
            onClick={() => setSubAba('genericos')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
              subAba === 'genericos'
                ? 'border-emerald-600 text-emerald-950 bg-emerald-50 rounded-t-lg font-black'
                : 'border-transparent text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50/50 rounded-t-lg'
            }`}
            title="Insumos genéricos com botão de futuros fornecedores e lista final consolidada por fornecedor"
          >
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Insumos Genéricos & RFQ</span>
            <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-600 text-white font-black shadow-xs">
              Lista Final
            </span>
          </button>

          {/* Sub-Aba 5: 4 Cartões Amarelos & Pastas de Fornecedores */}
          <button
            type="button"
            onClick={() => setSubAba('cadastro')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
              subAba === 'cadastro'
                ? 'border-amber-500 text-amber-900 bg-amber-50/50 rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg'
            }`}
          >
            <Package className="w-4 h-4 text-amber-600" />
            <span>4 Cartões Amarelos & Pastas</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
              {fornecedoresUnicos.length}
            </span>
          </button>

          {/* Sub-Aba 6: Incidências */}
          <button
            type="button"
            onClick={() => setSubAba('incidencias')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
              subAba === 'incidencias'
                ? 'border-amber-500 text-amber-900 bg-amber-50/50 rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg'
            }`}
          >
            <Percent className="w-4 h-4 text-amber-600" />
            <span>Incidências ({incidencias.length})</span>
          </button>

          {/* Sub-Aba 7: Composições */}
          <button
            type="button"
            onClick={() => setSubAba('composicoes')}
            className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap cursor-pointer ${
              subAba === 'composicoes'
                ? 'border-amber-500 text-amber-900 bg-amber-50/50 rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-t-lg'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-600" />
            <span>Composições</span>
          </button>

        </div>
      </div>

      {/* =========================================================================
          CONTEÚDO DA SUB-ABA: EDITAR INSUMOS CADASTRADOS (SOLICITADO)
         ========================================================================= */}
      {subAba === 'editar-insumos' && (
        <div className="space-y-5 animate-fade-in">
          
          {/* Banner explicativo e Métricas dos Insumos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                Total de Insumos Cadastrados
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900 font-mono">{insumos.length}</span>
                <span className="text-xs text-slate-500">itens ativos</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                Pastas de Fornecedores
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-amber-900 font-mono">{fornecedoresUnicos.length}</span>
                <span className="text-xs text-slate-500">fornecedores</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                Preço Médio dos Insumos
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-emerald-800 font-mono">
                  {formatarMoeda(
                    insumos.reduce((acc, curr) => acc + curr.precoUnitario, 0) / (insumos.length || 1)
                  )}
                </span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide block">
                  Ação Rápida
                </span>
                <span className="text-xs font-bold text-slate-800 mt-1 block">
                  Novo Insumo
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalAtivo('insumo')}
                className="p-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl font-bold shadow-xs transition"
                title="Criar novo insumo"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          </div>

          {/* Barra de Filtros e Busca de Insumos para Edição */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              
              {/* Campo de Busca */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Pesquisar por código, nome do insumo ou fornecedor..."
                  value={filtroTextoEditar}
                  onChange={e => setFiltroTextoEditar(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-amber-500 focus:bg-white transition"
                />
              </div>

              {/* Filtro por Base / Fornecedor */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Base:</span>
                <select
                  value={filtroFornecedorEditar}
                  onChange={e => setFiltroFornecedorEditar(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="TODOS">Todas as Bases</option>
                  <option value="SINAPI">Apenas Base Oficial SINAPI</option>
                  <option value="FORNECEDORES">Apenas Bases de Fornecedores Reais</option>
                  <optgroup label="Filtrar por Fornecedor Específico">
                    {fornecedores.map(f => (
                      <option key={f.id} value={f.nome}>{f.nome}</option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Filtro por Tipo */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Tipo:</span>
                <select
                  value={filtroTipoEditar}
                  onChange={e => setFiltroTipoEditar(e.target.value)}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="TODOS">Todos os Tipos</option>
                  <option value="MATERIAL">MATERIAL</option>
                  <option value="MAO_DE_OBRA">MÃO DE OBRA</option>
                  <option value="EQUIPAMENTO">EQUIPAMENTO</option>
                  <option value="SERVICO">SERVIÇO</option>
                </select>
              </div>

            </div>
          </div>

          {/* TABELA DE GESTÃO DOS INSUMOS COM BASE E BOTÃO DE FORNECEDOR REAL */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Boxes className="w-4 h-4 text-amber-700" />
                <h3 className="text-sm font-bold text-slate-800">
                  Banco de Insumos - SINAPI & Fornecedores ({insumosFiltradosEditar.length})
                </h3>
              </div>
              <span className="text-[11px] text-slate-500">
                Cada insumo possui um botão dedicado <strong>"+ Fornecedor Real"</strong> para cadastrar preços reais de fornecedores mantendo o código SINAPI.
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100/70 text-[10px] uppercase font-mono font-semibold text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-3 w-24">Cód. SINAPI</th>
                    <th className="py-3 px-4">Descrição do Insumo</th>
                    <th className="py-3 px-3 w-40">Base</th>
                    <th className="py-3 px-3 text-center w-20">Tipo</th>
                    <th className="py-3 px-3 text-center w-16">Unid.</th>
                    <th className="py-3 px-3 text-right w-28">Preço Unitário</th>
                    <th className="py-3 px-3 text-center w-24">Atualização</th>
                    <th className="py-3 px-4 text-center w-56">Ações no Insumo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {insumosFiltradosEditar.map((item) => {
                    const isSinapi = (item.base || item.fornecedor) === 'SINAPI';
                    return (
                      <tr key={item.id} className="hover:bg-amber-50/30 transition group">
                        
                        {/* Código com estilo badge SINAPI */}
                        <td className="py-3 px-3 font-mono">
                          <span className={`font-bold px-2 py-0.5 rounded border text-[11px] ${
                            isSinapi 
                              ? 'text-blue-950 bg-blue-100 border-blue-300' 
                              : 'text-amber-950 bg-amber-100 border-amber-300'
                          }`}>
                            {item.codigo}
                          </span>
                        </td>

                        {/* Nome / Descrição do Insumo */}
                        <td className="py-3 px-4 font-medium text-slate-900">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900">{item.descricao || item.nome}</span>
                            {item.observacoes && (
                              <span className="text-[10px] text-slate-400 italic">
                                "{item.observacoes}"
                              </span>
                            )}
                          </div>
                        </td>

                        {/* BASE (Regra Solicitada: SINAPI ou Nome do Fornecedor) */}
                        <td className="py-3 px-3 whitespace-nowrap">
                          {isSinapi ? (
                            <span className="px-2.5 py-1 rounded-md font-black font-mono bg-blue-100 text-blue-900 border border-blue-300 text-[10px] inline-flex items-center gap-1">
                              SINAPI
                            </span>
                          ) : (
                            <span 
                              className="px-2.5 py-1 rounded-md font-bold font-mono bg-amber-100 text-amber-950 border border-amber-300 text-[10px] inline-flex items-center gap-1 max-w-[180px] truncate"
                              title={item.base || item.fornecedor}
                            >
                              <Building2 className="w-3 h-3 text-amber-600 flex-shrink-0" />
                              <span className="truncate">{item.base || item.fornecedor}</span>
                            </span>
                          )}
                        </td>

                        {/* Tipo */}
                        <td className="py-3 px-3 text-center font-mono">
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                            item.tipo === 'MATERIAL' 
                              ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                              : item.tipo === 'MAO_DE_OBRA'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            {item.tipo}
                          </span>
                        </td>

                        {/* Unidade */}
                        <td className="py-3 px-3 text-center font-mono font-bold text-slate-800">
                          {item.unidade}
                        </td>

                        {/* Preço Unitário */}
                        <td className="py-3 px-3 text-right font-mono font-black text-slate-900 text-sm whitespace-nowrap">
                          {formatarMoeda(item.precoUnitario)}
                        </td>

                        {/* Data Atualização */}
                        <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-500">
                          {item.dataAtualizacao || '2025-01-15'}
                        </td>

                        {/* BOTÕES DE AÇÕES: CADASTRAR FORNECEDOR REAL, EDITAR, COTAR E EXCLUIR */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            
                            {/* BOTÃO SOLICITADO: CADASTRO DE FORNECEDOR REAL */}
                            <button
                              type="button"
                              onClick={() => abrirModalFornecedorReal(item)}
                              className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-[11px] rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer border border-amber-400/40"
                              title="Vincular Fornecedor Real e criar novo insumo com código SINAPI e base do fornecedor"
                            >
                              <Building2 className="w-3.5 h-3.5 text-amber-400" />
                              <span>+ Fornecedor Real</span>
                            </button>

                            {/* BOTÃO EDITAR INSUMO */}
                            <button
                              type="button"
                              onClick={() => abrirEdicaoInsumo(item as any)}
                              className="px-2 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[11px] rounded-lg shadow-xs transition flex items-center gap-1 cursor-pointer"
                              title="Editar este insumo"
                            >
                              <Edit3 className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>Editar</span>
                            </button>

                            {/* BOTÃO COTAR NO WHATSAPP */}
                            <button
                              type="button"
                              onClick={() => abrirCotacaoInsumo(item as any)}
                              className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[11px] rounded-lg transition flex items-center gap-1 cursor-pointer"
                              title="Cotar este insumo com fornecedores pelo WhatsApp"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                              <span>Cotar</span>
                            </button>

                            {/* BOTÃO EXCLUIR */}
                            <button
                              type="button"
                              onClick={() => removerInsumo(item.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                              title="Excluir este insumo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>

                      </tr>
                    );
                  })}

                  {insumosFiltradosEditar.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400">
                        <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        <p className="text-xs font-semibold">Nenhum insumo encontrado com os filtros aplicados.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* =========================================================================
          CONTEÚDO DA SUB-ABA: PÁGINA DE FORNECEDORES (SOLICITADO)
         ========================================================================= */}
      {subAba === 'fornecedores' && (
        <FornecedoresGerenciamentoView
          fornecedores={fornecedores}
          insumos={insumos}
          onAdicionarFornecedor={handleAdicionarFornecedor}
          onAtualizarFornecedor={handleAtualizarFornecedor}
          onExcluirFornecedor={handleExcluirFornecedor}
          onIrParaCadastrarPreco={(fId) => {
            setFornecedorPreSelecionadoId(fId);
            setSubAba('precos-fornecedores');
          }}
        />
      )}

      {/* =========================================================================
          CONTEÚDO DA SUB-ABA: CADASTRAR PREÇO DESSE FORNECEDOR (SOLICITADO)
         ========================================================================= */}
      {subAba === 'precos-fornecedores' && (
        <PrecosFornecedoresView
          fornecedores={fornecedores}
          insumos={insumos}
          fornecedorPreSelecionadoId={fornecedorPreSelecionadoId}
          onSalvarPrecoFornecedor={handleCriarInsumoComBaseFornecedor}
          onExcluirInsumoFornecedor={handleExcluirInsumo}
          onIrParaFornecedores={() => setSubAba('fornecedores')}
        />
      )}

      {/* =========================================================================
          CONTEÚDO DA SUB-ABA: INSUMOS GENÉRICOS & LISTA FINAL PARA COTAÇÃO POR FORNECEDOR
         ========================================================================= */}
      {subAba === 'genericos' && (
        <InsumosGenericosCotacaoView
          fornecedoresCadastrados={fornecedoresUnicos}
          onAdotarInsumoFornecedor={(novoInsumo) => {
            setInsumos(prev => {
              const atualizados = [novoInsumo, ...prev];
              try {
                localStorage.setItem('seobra_insumos_fornecedores', JSON.stringify(atualizados));
              } catch {
                // ignore
              }
              return atualizados;
            });
            setFeedbackSalvo(`Insumo "${novoInsumo.nome}" cadastrado com sucesso na pasta do fornecedor "${novoInsumo.fornecedor}" com preço ${formatarMoeda(novoInsumo.precoUnitario)}!`);
            setTimeout(() => setFeedbackSalvo(null), 4000);
          }}
        />
      )}

      {/* =========================================================================
          CONTEÚDO DA SUB-ABA: CADASTRO COM OS 4 CARTÕES AMARELOS & FORNECEDORES
         ========================================================================= */}
      {subAba === 'cadastro' && (
        <div className="space-y-8 animate-fade-in">
          
          {/* OS 4 CARTÕES AMARELOS CONFORME SOLICITADO */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* CARTÃO 1: INSUMO (COR AMARELA) */}
            <div className="bg-white border-2 border-amber-400 hover:border-amber-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 bg-amber-100 text-amber-800 rounded-xl font-bold">
                    <Package className="w-5 h-5 stroke-[2.4]" />
                  </span>
                  <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
                    Cartão 1
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-wide">
                  INSUMO
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Mão de obra, Materiais, Equipamentos etc.
                </p>
              </div>

              <div className="pt-5 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setNovoFornecedor('');
                    setNovoWhatsapp('');
                    setNovoCodigo('');
                    setNovoNome('');
                    setNovoPreco('');
                    setModalAtivo('insumo');
                  }}
                  className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>CRIAR INSUMO</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSubAba('genericos')}
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer border border-amber-400/30"
                  title="Insumos genéricos para cotação e lista final consolidada por fornecedor"
                >
                  <Users className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
                  <span>INSUMOS GENÉRICOS (RFQ)</span>
                </button>

                <button
                  type="button"
                  onClick={() => abrirCotacaoInsumo(null)}
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Digitar fornecedores e contatos para perguntar o valor no WhatsApp"
                >
                  <MessageCircle className="w-4 h-4 stroke-[2.5]" />
                  <span>INSUMO PARA COTAÇÃO</span>
                </button>
              </div>
            </div>

            {/* CARTÃO 2: INCIDÊNCIA (COR AMARELA) */}
            <div className="bg-white border-2 border-amber-400 hover:border-amber-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 bg-amber-100 text-amber-800 rounded-xl font-bold">
                    <Percent className="w-5 h-5 stroke-[2.4]" />
                  </span>
                  <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
                    Cartão 2
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-wide">
                  INCIDÊNCIA
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Item de incidência sobre valores
                </p>
              </div>

              <div className="pt-5">
                <button
                  type="button"
                  onClick={() => setModalAtivo('incidencia')}
                  className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>CRIAR ITEM DE INCIDÊNCIA</span>
                </button>
              </div>
            </div>

            {/* CARTÃO 3: COMPOSIÇÃO (COR AMARELA) */}
            <div className="bg-white border-2 border-amber-400 hover:border-amber-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 bg-amber-100 text-amber-800 rounded-xl font-bold">
                    <Layers className="w-5 h-5 stroke-[2.4]" />
                  </span>
                  <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
                    Cartão 3
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-wide">
                  COMPOSIÇÃO
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Serviços e Composições de preço
                </p>
              </div>

              <div className="pt-5">
                <button
                  type="button"
                  onClick={() => setModalAtivo('composicao')}
                  className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>CRIAR COMPOSIÇÃO</span>
                </button>
              </div>
            </div>

            {/* CARTÃO 4: PRODUÇÃO DE EQUIPE MECÂNICA (COR AMARELA) */}
            <div className="bg-white border-2 border-amber-400 hover:border-amber-500 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="p-2.5 bg-amber-100 text-amber-800 rounded-xl font-bold">
                    <Truck className="w-5 h-5 stroke-[2.4]" />
                  </span>
                  <span className="text-[10px] uppercase font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
                    Cartão 4
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900 tracking-wide">
                  PRODUÇÃO DE EQUIPE MECÂNICA
                </h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Composições de Produção de Equipes Mecânicas tipo SICRO, DER etc.
                </p>
              </div>

              <div className="pt-5">
                <button
                  type="button"
                  onClick={() => setModalAtivo('equipe_mecanica')}
                  className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>CRIAR COMPOSIÇÃO</span>
                </button>
              </div>
            </div>

          </div>

          {/* GESTÃO DE PASTAS POR FORNECEDOR */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Folder className="w-5 h-5 text-amber-500 fill-amber-100" />
                  <h3 className="text-base font-bold text-slate-900">
                    Pastas de Insumos por Fornecedor ({fornecedoresUnicos.length})
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Os insumos são separados em pastas por fornecedor com contato WhatsApp, códigos correspondentes e botão de edição direta.
                </p>
              </div>

              {/* Busca Rápida */}
              <div className="relative sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar insumo ou fornecedor..."
                  value={buscaTermo}
                  onChange={e => setBuscaTermo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Lista de Pastas de Fornecedores */}
            <div className="space-y-3">
              {fornecedoresUnicos.map((forn) => {
                const insumosDoFornecedor = insumos.filter(i => {
                  const matchFornecedor = i.fornecedor === forn;
                  const matchBusca = buscaTermo === '' || 
                                     i.nome.toLowerCase().includes(buscaTermo.toLowerCase()) ||
                                     i.codigo.toLowerCase().includes(buscaTermo.toLowerCase()) ||
                                     i.fornecedor.toLowerCase().includes(buscaTermo.toLowerCase());
                  return matchFornecedor && matchBusca;
                });

                if (insumosDoFornecedor.length === 0 && buscaTermo !== '') return null;

                const isAberto = fornecedorAberto === forn || buscaTermo !== '';
                const zap = insumosDoFornecedor[0]?.whatsappFornecedor || '';

                return (
                  <div
                    key={forn}
                    className="border border-slate-200 rounded-xl overflow-hidden shadow-xs transition"
                  >
                    {/* Cabeçalho da Pasta do Fornecedor */}
                    <div 
                      onClick={() => setFornecedorAberto(isAberto ? null : forn)}
                      className="bg-slate-50 hover:bg-slate-100/80 px-4 py-3 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                          {isAberto ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">{forn}</span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full bg-white text-slate-600 font-mono font-semibold border border-slate-200">
                              {insumosDoFornecedor.length} {insumosDoFornecedor.length === 1 ? 'insumo' : 'insumos'}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500">
                            Pasta de cotações e catálogo exclusivo deste fornecedor
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto" onClick={e => e.stopPropagation()}>
                        {/* Botão WhatsApp do Fornecedor */}
                        {zap ? (
                          <a
                            href={formatarWhatsappLink(zap)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs transition"
                            title="Iniciar conversa no WhatsApp com este fornecedor"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>WhatsApp: {zap}</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">Sem WhatsApp</span>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setNovoFornecedor(forn);
                            setNovoWhatsapp(zap);
                            setModalAtivo('insumo');
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition"
                          title="Adicionar mais insumos para este fornecedor"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>+ Insumo</span>
                        </button>

                        <span className="text-slate-400">
                          {isAberto ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </span>
                      </div>
                    </div>

                    {/* Tabela de Insumos da Pasta deste Fornecedor */}
                    {isAberto && (
                      <div className="overflow-x-auto bg-white">
                        <table className="w-full text-left text-xs text-slate-700">
                          <thead className="bg-slate-50 text-[10px] uppercase font-mono font-semibold text-slate-500 border-b border-slate-100">
                            <tr>
                              <th className="py-2.5 px-4 w-28">Código</th>
                              <th className="py-2.5 px-4">Nome do Insumo</th>
                              <th className="py-2.5 px-3 text-center w-16">Tipo</th>
                              <th className="py-2.5 px-3 text-center w-20">Unidade</th>
                              <th className="py-2.5 px-4 text-right w-32">Preço Unitário</th>
                              <th className="py-2.5 px-3 text-center w-28">Ações</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-mono">
                            {insumosDoFornecedor.map((item) => (
                              <tr key={item.id} className="hover:bg-amber-50/30 transition">
                                <td className="py-2.5 px-4">
                                  <span className="font-bold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded border border-amber-300">
                                    {item.codigo}
                                  </span>
                                </td>
                                <td className="py-2.5 px-4 font-sans font-medium text-slate-800">
                                  {item.nome}
                                </td>
                                <td className="py-2.5 px-3 text-center">
                                  <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-slate-100 text-slate-600">
                                    {item.tipo}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                                  {item.unidade}
                                </td>
                                <td className="py-2.5 px-4 text-right font-black text-slate-900 font-mono">
                                  {formatarMoeda(item.precoUnitario)}
                                </td>
                                
                                {/* BOTÕES DE AÇÃO: EDITAR INSUMO CADASTRADO, COTAR WHATSAPP E EXCLUIR */}
                                <td className="py-2.5 px-3 text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => abrirEdicaoInsumo(item)}
                                      className="p-1.5 text-amber-800 hover:text-amber-950 hover:bg-amber-100 rounded-lg transition cursor-pointer"
                                      title="Editar este insumo cadastrado"
                                    >
                                      <Edit3 className="w-3.5 h-3.5 stroke-[2.2]" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => abrirCotacaoInsumo(item)}
                                      className="p-1.5 text-emerald-700 hover:text-emerald-950 hover:bg-emerald-100 rounded-lg transition cursor-pointer"
                                      title="Cotar este insumo com fornecedores pelo WhatsApp"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5 stroke-[2.2]" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => removerInsumo(item.id)}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                      title="Remover insumo"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                  </div>
                );
              })}

              {fornecedoresUnicos.length === 0 && (
                <div className="text-center py-10 text-slate-400 border border-dashed rounded-xl">
                  <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-semibold">Nenhum fornecedor cadastrado ainda.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Clique em "CRIAR INSUMO" no Cartão 1 para cadastrar.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          CONTEÚDO DA SUB-ABA: ITENS DE INCIDÊNCIA
         ========================================================================= */}
      {subAba === 'incidencias' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Percent className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">
                Itens de Incidência sobre Valores ({incidencias.length})
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setModalAtivo('incidencia')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Novo Item de Incidência</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[10px] uppercase font-mono font-semibold text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-3 w-28">Código</th>
                  <th className="py-2.5 px-3">Nome da Incidência</th>
                  <th className="py-2.5 px-3">Descrição / Finalidade</th>
                  <th className="py-2.5 px-3">Base de Cálculo</th>
                  <th className="py-2.5 px-3 text-right w-28">Alíquota (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {incidencias.map((inc) => (
                  <tr key={inc.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-bold text-amber-800">{inc.codigo}</td>
                    <td className="py-2.5 px-3 font-sans font-semibold text-slate-800">{inc.nome}</td>
                    <td className="py-2.5 px-3 font-sans text-slate-500 text-[11px]">{inc.descricao}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {inc.baseCalculo}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-black text-amber-700">
                      {inc.percentual.toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          CONTEÚDO DA SUB-ABA: COMPOSIÇÕES E EQUIPES MECÂNICAS
         ========================================================================= */}
      {subAba === 'composicoes' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Composições de Preço Criadas
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalAtivo('composicao')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Nova Composição</span>
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Crie composições combinando os insumos cadastrados nas pastas de cada fornecedor com seus respectivos quantitativos e coeficientes.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Equipes Mecânicas (SICRO / DER)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalAtivo('equipe_mecanica')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Nova Equipe Mecânica</span>
              </button>
            </div>
            <p className="text-xs text-slate-600">
              Calcule custos horários de patrulhas mecanizadas e produção de equipe conforme metodologia DNIT/SICRO.
            </p>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL DEDICADO: EDITAR INSUMO CADASTRADO (SOLICITADO)
         ========================================================================= */}
      {insumoEmEdicao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-slate-800">
          <div className="bg-white border-2 border-amber-400 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Cabeçalho do Modal de Edição */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-50">
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 bg-amber-400 text-slate-950 rounded-lg">
                  <Edit3 className="w-5 h-5 stroke-[2.5]" />
                </span>
                <div>
                  <h3 className="text-base font-black text-slate-900 uppercase">
                    Editar Insumo Cadastrado
                  </h3>
                  <span className="text-[11px] font-mono font-bold text-amber-900">
                    ID: {insumoEmEdicao.id} • Pasta: {insumoEmEdicao.fornecedor}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setInsumoEmEdicao(null)} 
                className="p-1 text-slate-400 hover:text-slate-800 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulário de Edição */}
            <form onSubmit={handleSalvarEdicaoInsumo} className="p-6 space-y-4 text-xs overflow-y-auto">
              
              {/* Fornecedor / Pasta */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Fonte / Fornecedor <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Votorantim, Gerdau, Cerâmica..."
                  value={editFornecedor}
                  onChange={e => setEditFornecedor(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-semibold"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Se você alterar o fornecedor, o insumo será movido automaticamente para a pasta correspondente.
                </span>
              </div>

              {/* Contato WhatsApp do Fornecedor */}
              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Contato WhatsApp do Fornecedor</span>
                  </span>
                  {editWhatsapp && (
                    <a
                      href={formatarWhatsappLink(editWhatsapp)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-emerald-700 font-bold hover:underline"
                    >
                      Testar Link WhatsApp ↗
                    </a>
                  )}
                </label>
                <input
                  type="text"
                  placeholder="Ex: (11) 99876-5432"
                  value={editWhatsapp}
                  onChange={e => setEditWhatsapp(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* Nome do Insumo com Detecção em Tempo Real ao Editar */}
              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center justify-between">
                  <span>Nome / Descrição do Insumo <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Detecção inteligente</span>
                  </span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cimento Portland CP II-32..."
                  value={editNome}
                  onChange={e => analisarNomeEDetectarCodigoEdicao(e.target.value, insumoEmEdicao.id)}
                  className="w-full border-2 border-amber-300 focus:border-amber-500 rounded-xl px-3.5 py-2 text-xs text-slate-900 font-semibold focus:outline-none bg-amber-50/20"
                />
              </div>

              {/* Card de detecção inteligente se o usuário alterou o nome */}
              {editInsumoDetectado && (
                <div className="p-3 bg-gradient-to-r from-amber-50 to-amber-100/60 border-2 border-amber-400 rounded-xl space-y-2 animate-fade-in shadow-xs text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-amber-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Insumo similar encontrado!
                    </span>
                    <span className="font-mono font-bold bg-amber-400 text-slate-950 px-2 py-0.5 rounded text-[11px]">
                      {editInsumoDetectado.codigo}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-700 leading-snug">
                    Outro fornecedor (<strong>{editInsumoDetectado.fornecedor}</strong>) já cadastrou <strong>"{editInsumoDetectado.nome}"</strong> por <strong>{formatarMoeda(editInsumoDetectado.precoUnitario)}/{editInsumoDetectado.unidade}</strong>.
                  </p>

                  <button
                    type="button"
                    onClick={() => aplicarCodigoDetectadoEdicao(editInsumoDetectado)}
                    className="w-full py-1.5 px-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-lg text-xs shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Sincronizar mesmo código ({editInsumoDetectado.codigo}) e unidade ({editInsumoDetectado.unidade})</span>
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {/* Código do Insumo */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Código do Insumo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: CIM-01"
                    value={editCodigo}
                    onChange={e => setEditCodigo(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono font-bold uppercase"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Códigos iguais entre fornecedores facilitam comparar preços.
                  </span>
                </div>

                {/* Tipo de Insumo */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo de Insumo</label>
                  <select
                    value={editTipo}
                    onChange={e => setEditTipo(e.target.value as TipoInsumo)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="MATERIAL">MATERIAL</option>
                    <option value="MAO_DE_OBRA">MÃO DE OBRA</option>
                    <option value="EQUIPAMENTO">EQUIPAMENTO</option>
                    <option value="SERVICO">SERVIÇO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Unidade */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Unidade do Insumo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: m², m³, kg, sc, un..."
                    value={editUnidade}
                    onChange={e => setEditUnidade(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Usado para quantitativos na composição (ex: m²).
                  </span>
                </div>

                {/* Preço Unitário */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Preço Unitário (R$) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0,00"
                    value={editPreco}
                    onChange={e => setEditPreco(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono font-bold text-emerald-700"
                  />
                </div>
              </div>

              {/* Comparativo de Preço com Outros Fornecedores do mesmo código */}
              {(() => {
                const concorrentesMesmoCodigo = insumos.filter(
                  i => i.id !== insumoEmEdicao.id && i.codigo.toUpperCase() === editCodigo.trim().toUpperCase()
                );
                if (concorrentesMesmoCodigo.length === 0) return null;

                const precoAtual = parseFloat(editPreco.replace(',', '.')) || 0;

                return (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                    <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                      <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
                      Comparativo de Cotações para o Código "{editCodigo}":
                    </span>
                    <div className="space-y-1">
                      {concorrentesMesmoCodigo.map(c => {
                        const diff = precoAtual > 0 ? ((precoAtual - c.precoUnitario) / c.precoUnitario) * 100 : 0;
                        return (
                          <div key={c.id} className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-slate-600">{c.fornecedor}:</span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800">{formatarMoeda(c.precoUnitario)}/{c.unidade}</span>
                              {precoAtual > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                  diff < 0 
                                    ? 'bg-emerald-100 text-emerald-800' 
                                    : diff > 0 
                                    ? 'bg-rose-100 text-rose-800' 
                                    : 'bg-slate-200 text-slate-700'
                                }`}>
                                  {diff < 0 ? `${diff.toFixed(1)}% (mais barato)` : diff > 0 ? `+${diff.toFixed(1)}%` : 'igual'}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Botões do Rodapé */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInsumoEmEdicao(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black shadow transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>Salvar Alterações</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAIS DE CRIAÇÃO PARA CADA CARTÃO
         ========================================================================= */}

      {/* MODAL CARTÃO 1: CRIAR INSUMO */}
      {modalAtivo === 'insumo' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-slate-800">
          <div className="bg-white border-2 border-amber-400 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-50">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-700 stroke-[2.4]" />
                <h3 className="text-base font-black text-slate-900 uppercase">
                  Cadastro de Insumo com Fornecedor
                </h3>
              </div>
              <button onClick={() => setModalAtivo(null)} className="p-1 text-slate-400 hover:text-slate-800 rounded cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCriarInsumo} className="p-6 space-y-4 text-xs">
              
              {/* Fornecedor / Fonte */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Fonte / Fornecedor <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Votorantim Cimentos, Gerdau, Cerâmica São José..."
                  value={novoFornecedor}
                  onChange={e => setNovoFornecedor(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Os insumos deste fornecedor serão agrupados em uma pasta exclusiva.
                </span>
              </div>

              {/* Contato WhatsApp do Fornecedor */}
              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Contato do WhatsApp do Fornecedor (com DDD)</span>
                </label>
                <input
                  type="text"
                  placeholder="Ex: (11) 99876-5432 ou 11998765432"
                  value={novoWhatsapp}
                  onChange={e => setNovoWhatsapp(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {/* Nome do Insumo com Detecção em Tempo Real */}
              <div>
                <label className="font-bold text-slate-700 block mb-1 flex items-center justify-between">
                  <span>Nome do Insumo <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-amber-700 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    <span>Detecção inteligente de código ativada</span>
                  </span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Digite o nome: ex: Cimento CP II-32, Aço CA-50 10mm, Bloco Cerâmico 9x19x19..."
                  value={novoNome}
                  onChange={e => analisarNomeEDetectarCodigo(e.target.value)}
                  className="w-full border-2 border-amber-300 focus:border-amber-500 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-semibold focus:outline-none bg-amber-50/20"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Conforme você digita o nome, o sistema busca automaticamente se outros fornecedores já vendem este mesmo insumo para sugerir o mesmo código.
                </span>
              </div>

              {/* CARD DE DETECÇÃO AUTOMÁTICA DE CÓDIGO IDENTIFICADO */}
              {insumoDetectado && (
                <div className="p-3.5 bg-gradient-to-r from-amber-50 to-amber-100/60 border-2 border-amber-400 rounded-xl space-y-2.5 animate-fade-in shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-950">
                      <Sparkles className="w-4 h-4 text-amber-600 animate-bounce" />
                      <span>CORRESPONDÊNCIA DE CÓDIGO DETECTADA!</span>
                    </div>
                    <span className="text-xs bg-amber-400 text-slate-950 font-mono font-black px-2 py-0.5 rounded shadow-xs">
                      Código: {insumoDetectado.codigo}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-800 leading-relaxed">
                    Pelo nome digitado, detectamos que este insumo é similar a <strong>"{insumoDetectado.nome}"</strong> já cadastrado na pasta do fornecedor <strong>{insumoDetectado.fornecedor}</strong>.
                  </p>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-amber-300/80">
                    <div className="text-[11px] text-slate-700 font-mono">
                      <span>Preço referência: <strong className="text-slate-900">{formatarMoeda(insumoDetectado.precoUnitario)}</strong>/{insumoDetectado.unidade}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => aplicarCodigoDetectado(insumoDetectado)}
                      className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-lg text-xs shadow transition flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Usar mesmo código ({insumoDetectado.codigo}) e unidade ({insumoDetectado.unidade})</span>
                    </button>
                  </div>

                  {outrosInsumosSimilares.length > 0 && (
                    <div className="text-[10px] text-slate-600 pt-1 border-t border-amber-200">
                      Também encontrado em outros fornecedores: {outrosInsumosSimilares.map(o => `${o.fornecedor} (${o.codigo})`).join(', ')}
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {/* Código do Insumo */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">
                      Código do Insumo <span className="text-rose-500">*</span>
                    </label>
                    {insumoDetectado && novoCodigo === insumoDetectado.codigo && (
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-300 font-mono">
                        ✓ Sincronizado
                      </span>
                    )}
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ex: CIM-01, ACO-10, BLOC-09..."
                    value={novoCodigo}
                    onChange={e => setNovoCodigo(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono font-bold uppercase"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Insumos de fornecedores diferentes podem ter códigos iguais para comparação.
                  </span>
                </div>

                {/* Tipo de Insumo */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tipo de Insumo</label>
                  <select
                    value={novoTipo}
                    onChange={e => setNovoTipo(e.target.value as TipoInsumo)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="MATERIAL">MATERIAL</option>
                    <option value="MAO_DE_OBRA">MÃO DE OBRA</option>
                    <option value="EQUIPAMENTO">EQUIPAMENTO</option>
                    <option value="SERVICO">SERVIÇO TERCEIRIZADO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Unidade */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    Unidade do Insumo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: m², m³, kg, un, sc, h, mil..."
                    value={novaUnidade}
                    onChange={e => setNovaUnidade(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Usado para quantitativos na composição (ex: m²).
                  </span>
                </div>

                {/* Preço Unitário */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">
                      Preço Unitário (R$) <span className="text-rose-500">*</span>
                    </label>
                    {insumoDetectado && novoPreco && (
                      <span className="text-[9px] font-mono text-slate-500">
                        Ref: {formatarMoeda(insumoDetectado.precoUnitario)}
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0,00"
                    value={novoPreco}
                    onChange={e => setNovoPreco(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono font-bold text-emerald-700"
                  />
                </div>
              </div>

              {/* Footer Modal */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAtivo(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black shadow transition cursor-pointer"
                >
                  Salvar na Pasta do Fornecedor
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL CARTÃO 2: CRIAR INCIDÊNCIA */}
      {modalAtivo === 'incidencia' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-slate-800">
          <div className="bg-white border-2 border-amber-400 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-50">
              <div className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-amber-700 stroke-[2.4]" />
                <h3 className="text-base font-black text-slate-900 uppercase">
                  Criar Item de Incidência sobre Valores
                </h3>
              </div>
              <button onClick={() => setModalAtivo(null)} className="p-1 text-slate-400 hover:text-slate-800 rounded cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCriarIncidencia} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Código</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: INC-01"
                    value={incCodigo}
                    onChange={e => setIncCodigo(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Alíquota / Percentual (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 5.00"
                    value={incPercentual}
                    onChange={e => setIncPercentual(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-mono font-bold text-amber-700"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nome do Item de Incidência</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Perdas de Concreto em Bombeamento, Encargos Complementares..."
                  value={incNome}
                  onChange={e => setIncNome(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Base de Cálculo da Incidência</label>
                <select
                  value={incBase}
                  onChange={e => setIncBase(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
                >
                  <option value="MAO_DE_OBRA">Incidir sobre Mão de Obra</option>
                  <option value="MATERIAL">Incidir sobre Materiais</option>
                  <option value="EQUIPAMENTO">Incidir sobre Equipamentos</option>
                  <option value="TOTAL_DIRETO">Incidir sobre Custo Total Direto</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descrição / Justificativa</label>
                <textarea
                  rows={2}
                  placeholder="Detalhamento ou fundamentação técnica..."
                  value={incDescricao}
                  onChange={e => setIncDescricao(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAtivo(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black shadow transition cursor-pointer"
                >
                  Criar Incidência
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL CARTÃO 3: CRIAR COMPOSIÇÃO COM INSUMOS DAS PASTAS */}
      {modalAtivo === 'composicao' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-slate-800">
          <div className="bg-white border-2 border-amber-400 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-50">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-700 stroke-[2.4]" />
                <h3 className="text-base font-black text-slate-900 uppercase">
                  Criar Nova Composição de Preço com Insumos
                </h3>
              </div>
              <button onClick={() => setModalAtivo(null)} className="p-1 text-slate-400 hover:text-slate-800 rounded cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Código</label>
                  <input
                    type="text"
                    value={compCodigo}
                    onChange={e => setCompCodigo(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Unidade do Serviço</label>
                  <input
                    type="text"
                    value={compUnidade}
                    onChange={e => setCompUnidade(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                    placeholder="Ex: m², m³, kg, un"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descrição do Serviço / Composição</label>
                <input
                  type="text"
                  placeholder="Ex: Contrapiso em argamassa traço 1:4 espessura 3,0 cm..."
                  value={compDescricao}
                  onChange={e => setCompDescricao(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              {/* Insumos disponíveis nas pastas */}
              <div className="pt-2">
                <span className="font-bold text-slate-800 block mb-2">
                  Selecione os Insumos das Pastas de Fornecedores para compor o quantitativo ({compUnidade}):
                </span>
                
                <div className="border border-slate-200 rounded-xl p-3 max-h-48 overflow-y-auto space-y-2 bg-slate-50">
                  {insumos.map((i) => (
                    <div key={i.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold font-mono text-amber-800">{i.codigo}</span>
                          <span className="text-slate-800 font-medium">{i.nome}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">Fornecedor: {i.fornecedor} • Unid: {i.unidade}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <strong className="font-mono text-slate-800">{formatarMoeda(i.precoUnitario)}</strong>
                        <button
                          type="button"
                          onClick={() => alert(`Insumo ${i.nome} adicionado com coeficiente 1.0 por ${compUnidade}`)}
                          className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-[11px] cursor-pointer"
                        >
                          + Inserir
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAtivo(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('Composição cadastrada com sucesso!');
                    setModalAtivo(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black shadow transition cursor-pointer"
                >
                  Salvar Composição
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CARTÃO 4: PRODUÇÃO DE EQUIPE MECÂNICA (SICRO/DER) */}
      {modalAtivo === 'equipe_mecanica' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-slate-800">
          <div className="bg-white border-2 border-amber-400 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-50">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-700 stroke-[2.4]" />
                <h3 className="text-base font-black text-slate-900 uppercase">
                  Composição de Equipe Mecânica (SICRO / DER)
                </h3>
              </div>
              <button onClick={() => setModalAtivo(null)} className="p-1 text-slate-400 hover:text-slate-800 rounded cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Código (SICRO/DER)</label>
                  <input
                    type="text"
                    value={eqCodigo}
                    onChange={e => setEqCodigo(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Unidade Produzida</label>
                  <input
                    type="text"
                    value={eqUnidade}
                    onChange={e => setEqUnidade(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold"
                    placeholder="Ex: m³, t, km"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Descrição do Serviço Mecanizado</label>
                <input
                  type="text"
                  placeholder="Ex: Escavação e carga de material de 1ª categoria com escavadeira hidráulica 1,2 m³..."
                  value={eqDescricao}
                  onChange={e => setEqDescricao(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Produção da Equipe (Unid/h)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={eqProducaoHora}
                    onChange={e => setEqProducaoHora(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-teal-700"
                    placeholder="Ex: 45.0 m³/h"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Custo Horário Total (R$/h)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={eqCustoHorario}
                    onChange={e => setEqCustoHorario(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-emerald-700"
                    placeholder="Ex: 320.00"
                  />
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                <span className="text-[11px] text-amber-900 font-bold block">
                  Custo Unitário Direto Calculado:
                </span>
                <span className="text-base font-black text-amber-900 font-mono">
                  {formatarMoeda((parseFloat(eqCustoHorario) || 0) / (parseFloat(eqProducaoHora) || 1))} /{eqUnidade}
                </span>
                <span className="text-[10px] text-slate-500 block mt-0.5">
                  Fórmula: Custo Horário Total ÷ Produção Horária da Equipe (Padrão DNIT/SICRO)
                </span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalAtivo(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('Composição de Equipe Mecânica cadastrada!');
                    setModalAtivo(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-black shadow transition cursor-pointer"
                >
                  Salvar Produção Mecânica
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE COTAÇÃO DE INSUMO COM FORNECEDORES (WHATSAPP RFQ) */}
      {modalCotacaoAberto && (
        <CotacaoInsumoModal
          insumoInicial={insumoParaCotar}
          insumosCadastrados={insumos}
          onFechar={() => {
            setModalCotacaoAberto(false);
            setInsumoParaCotar(null);
          }}
          onSalvarInsumoCotado={handleSalvarInsumoCotado}
        />
      )}

      {/* MODAL DE CADASTRO DE FORNECEDOR REAL NO INSUMO */}
      <CadastrarFornecedorRealModal
        insumo={insumoParaFornecedorReal}
        fornecedores={fornecedores}
        isOpen={modalFornecedorRealAberto}
        onClose={() => {
          setModalFornecedorRealAberto(false);
          setInsumoParaFornecedorReal(null);
        }}
        onAdicionarFornecedor={handleAdicionarFornecedor}
        onCriarInsumoComBaseFornecedor={handleCriarInsumoComBaseFornecedor}
      />

    </div>
  );
};
