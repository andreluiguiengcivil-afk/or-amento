import React, { useState, useMemo, useEffect } from 'react';
import { 
  DollarSign, 
  Building2, 
  Search, 
  Plus, 
  Trash2, 
  TrendingDown, 
  Check, 
  Phone, 
  Mail, 
  MessageCircle, 
  Copy, 
  Layers, 
  Send, 
  Save, 
  X, 
  Zap, 
  Clock, 
  CheckSquare, 
  Square,
  FileCheck2,
  AlertTriangle,
  Edit3
} from 'lucide-react';
import { FornecedorReal, InsumoItem } from '../types/orcamento';
import { formatarMoeda } from '../utils/bdiCalculator';

interface PrecosFornecedoresViewProps {
  fornecedores: FornecedorReal[];
  insumos: InsumoItem[];
  fornecedorPreSelecionadoId?: string | null;
  itemPreSelecionadoId?: string | null;
  onSalvarPrecoFornecedor: (novoInsumo: InsumoItem) => void;
  onExcluirInsumoFornecedor: (id: string) => void;
  onExcluirMultiplosInsumosFornecedor?: (ids: string[]) => void;
  onIrParaFornecedores: () => void;
  onSalvarMultiplosPrecos?: (insumosAtualizados: InsumoItem[]) => void;
}

interface ItemEdicaoState {
  precoAvista: string;
  precoPrazo: string;
  condicaoPagamento: 'AVISTA' | 'PRAZO';
  observacoes: string;
}

export const PrecosFornecedoresView: React.FC<PrecosFornecedoresViewProps> = ({
  fornecedores,
  insumos,
  fornecedorPreSelecionadoId,
  itemPreSelecionadoId,
  onSalvarPrecoFornecedor,
  onExcluirInsumoFornecedor,
  onExcluirMultiplosInsumosFornecedor,
  onIrParaFornecedores,
  onSalvarMultiplosPrecos
}) => {
  // Insumos SINAPI oficiais (para referência)
  const insumosSinapi = useMemo(() => insumos.filter(i => i.base === 'SINAPI'), [insumos]);
  
  // Insumos com base de fornecedores reais (onde base !== 'SINAPI')
  const insumosFornecedores = useMemo(() => insumos.filter(i => i.base !== 'SINAPI'), [insumos]);

  // Fornecedor Ativo Selecionado (ID ou 'TODOS')
  const [fornecedorAtivoId, setFornecedorAtivoId] = useState<string>(() => {
    if (fornecedorPreSelecionadoId) return fornecedorPreSelecionadoId;
    return fornecedores[0]?.id || 'TODOS';
  });

  // Item específico focado para alteração direta de preço
  const [itemFocadoId, setItemFocadoId] = useState<string | null>(itemPreSelecionadoId || null);

  // Sincroniza fornecedor ativo caso fornecedorPreSelecionadoId mude externamente
  useEffect(() => {
    if (fornecedorPreSelecionadoId) {
      setFornecedorAtivoId(fornecedorPreSelecionadoId);
    }
  }, [fornecedorPreSelecionadoId]);

  // Sincroniza e rola automaticamente para o item específico selecionado na aba Banco de Insumos
  useEffect(() => {
    if (itemPreSelecionadoId) {
      setItemFocadoId(itemPreSelecionadoId);
      setBuscaTexto(''); // Limpa texto para não ocultar o item selecionado

      const timer = setTimeout(() => {
        const elementoLinha = document.getElementById(`insumo-fornecedor-row-${itemPreSelecionadoId}`);
        if (elementoLinha) {
          elementoLinha.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        const inputPreco = document.getElementById(`input-preco-avista-${itemPreSelecionadoId}`) as HTMLInputElement | null;
        if (inputPreco) {
          inputPreco.focus();
          inputPreco.select();
        }
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [itemPreSelecionadoId]);

  // Filtros de busca
  const [buscaTexto, setBuscaTexto] = useState('');
  
  // Notificações e feedback
  const [feedback, setFeedback] = useState<string | null>(null);
  const [copiadoFeedback, setCopiadoFeedback] = useState(false);

  // Seleção de itens específicos para cotação com o fornecedor
  const [selecionadosParaCotar, setSelecionadosParaCotar] = useState<{ [itemId: string]: boolean }>({});

  // Modal de Exportação WhatsApp da Lista
  const [modalWhatsAppAberto, setModalWhatsAppAberto] = useState(false);
  const [fornecedorParaExportar, setFornecedorParaExportar] = useState<FornecedorReal | null>(null);

  // Modal para Adicionar Insumo SINAPI ao Fornecedor
  const [modalAdicionarInsumoAberto, setModalAdicionarInsumoAberto] = useState(false);
  const [buscaNovoInsumoSinapi, setBuscaNovoInsumoSinapi] = useState('');
  const [sinapiSelecionadoParaAdicionar, setSinapiSelecionadoParaAdicionar] = useState<InsumoItem | null>(null);
  const [novoPrecoAvista, setNovoPrecoAvista] = useState('');
  const [novoPrecoPrazo, setNovoPrecoPrazo] = useState('');
  const [novaCondicaoPagamento, setNovaCondicaoPagamento] = useState<'AVISTA' | 'PRAZO'>('PRAZO');
  const [novasObservacoes, setNovasObservacoes] = useState('');

  // Estado local para edição em lote / inline
  const [edicoesLocais, setEdicoesLocais] = useState<{ [itemId: string]: ItemEdicaoState }>({});
  const [itensSalvosRecentemente, setItensSalvosRecentemente] = useState<{ [itemId: string]: boolean }>({});

  // Modal de Confirmação de Exclusão (100% à prova de bloqueio de window.confirm em iframe)
  const [modalExcluir, setModalExcluir] = useState<{
    tipo: 'individual' | 'selecionados' | 'todos';
    item?: InsumoItem;
    ids: string[];
    titulo: string;
    mensagem: string;
    itensPreview?: { codigo: string; descricao: string }[];
  } | null>(null);

  // Executa exclusão confirmada com limpeza de estado e feedback
  const executarExclusaoConfirmada = () => {
    if (!modalExcluir) return;
    const idsParaRemover = modalExcluir.ids;

    if (onExcluirMultiplosInsumosFornecedor) {
      onExcluirMultiplosInsumosFornecedor(idsParaRemover);
    } else {
      idsParaRemover.forEach(id => onExcluirInsumoFornecedor(id));
    }

    // Limpar seleção dos itens removidos
    setSelecionadosParaCotar(prev => {
      const novo = { ...prev };
      idsParaRemover.forEach(id => delete novo[id]);
      return novo;
    });

    // Limpar edições locais dos itens removidos
    setEdicoesLocais(prev => {
      const novo = { ...prev };
      idsParaRemover.forEach(id => delete novo[id]);
      return novo;
    });

    setFeedback(`${idsParaRemover.length} insumo(s) apagado(s) com sucesso da base!`);
    setTimeout(() => setFeedback(null), 3500);

    setModalExcluir(null);
  };

  // Obter Fornecedor Ativo objeto
  const fornecedorAtivo = useMemo(() => {
    if (fornecedorAtivoId === 'TODOS') return null;
    return fornecedores.find(f => f.id === fornecedorAtivoId) || null;
  }, [fornecedores, fornecedorAtivoId]);

  // Insumo atualmente focado para alteração direta
  const itemAlvoEdicao = useMemo(() => {
    if (!itemFocadoId) return null;
    return insumosFornecedores.find(i => i.id === itemFocadoId) || null;
  }, [itemFocadoId, insumosFornecedores]);

  // Função auxiliar para calcular desconto à vista (%)
  const calcularDesconto = (avista: number, prazo: number): number => {
    if (prazo > 0 && avista > 0 && avista < prazo) {
      return ((prazo - avista) / prazo) * 100;
    }
    return 0;
  };

  // Inicializar estado de edição de um item caso não exista
  const getEdicaoItem = (item: InsumoItem): ItemEdicaoState => {
    if (edicoesLocais[item.id]) {
      return edicoesLocais[item.id];
    }
    const prazoVal = item.precoPrazo !== undefined && item.precoPrazo !== null ? item.precoPrazo : item.precoUnitario;
    const avistaVal = item.precoAvista !== undefined && item.precoAvista !== null ? item.precoAvista : prazoVal;
    const condicaoVal: 'AVISTA' | 'PRAZO' = item.tipoPagamentoSelecionado || 'PRAZO';

    return {
      precoAvista: avistaVal > 0 ? avistaVal.toString() : '',
      precoPrazo: prazoVal > 0 ? prazoVal.toString() : '',
      condicaoPagamento: condicaoVal,
      observacoes: item.observacoes || ''
    };
  };

  const handleUpdateEdicaoField = (itemId: string, field: keyof ItemEdicaoState, value: any) => {
    const itemOriginal = insumos.find(i => i.id === itemId);
    if (!itemOriginal) return;

    const estadoAtual = getEdicaoItem(itemOriginal);
    const novoEstado = {
      ...estadoAtual,
      [field]: value
    };

    setEdicoesLocais(prev => ({
      ...prev,
      [itemId]: novoEstado
    }));
  };

  // Salvar alterações de um item individual
  const handleSalvarItem = (item: InsumoItem) => {
    const edicao = getEdicaoItem(item);
    const precoAvistaNum = parseFloat(edicao.precoAvista.replace(',', '.')) || 0;
    const precoPrazoNum = parseFloat(edicao.precoPrazo.replace(',', '.')) || 0;
    
    // Regra do Usuário:
    // A condição de pagamento deve ser selecionada entre 'AVISTA' ou 'PRAZO' para saber qual valor será considerado.
    // Se nenhuma opção for clicada, o preço a prazo será o usado.
    const condicaoFinal = edicao.condicaoPagamento || 'PRAZO';
    let precoConsiderado = precoPrazoNum > 0 ? precoPrazoNum : precoAvistaNum;

    if (condicaoFinal === 'AVISTA' && precoAvistaNum > 0) {
      precoConsiderado = precoAvistaNum;
    } else if (condicaoFinal === 'PRAZO' && precoPrazoNum > 0) {
      precoConsiderado = precoPrazoNum;
    }

    const descontoPerc = calcularDesconto(precoAvistaNum, precoPrazoNum);

    const itemAtualizado: InsumoItem = {
      ...item,
      precoAvista: precoAvistaNum,
      precoPrazo: precoPrazoNum,
      descontoAvistaPercentual: parseFloat(descontoPerc.toFixed(2)),
      tipoPagamentoSelecionado: condicaoFinal,
      precoUnitario: precoConsiderado,
      condicoesPagamento: condicaoFinal === 'AVISTA' ? 'À vista' : 'A prazo',
      observacoes: edicao.observacoes,
      dataAtualizacao: new Date().toISOString().split('T')[0]
    };

    onSalvarPrecoFornecedor(itemAtualizado);

    // Feedback visual
    setItensSalvosRecentemente(prev => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setItensSalvosRecentemente(prev => ({ ...prev, [item.id]: false }));
    }, 2500);

    setFeedback(`Valores do insumo [${item.codigo}] salvos com sucesso! Preço considerado: ${formatarMoeda(precoConsiderado)}.`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Salvar todos os itens do fornecedor ativo
  const handleSalvarTodosDoFornecedor = () => {
    if (!fornecedorAtivo) return;

    const itensDoFornecedor = insumosFornecedores.filter(i => 
      i.base.toLowerCase() === fornecedorAtivo.nome.toLowerCase() ||
      i.fornecedorId === fornecedorAtivo.id
    );

    const itensAtualizados: InsumoItem[] = itensDoFornecedor.map(item => {
      const edicao = getEdicaoItem(item);
      const precoAvistaNum = parseFloat(edicao.precoAvista.replace(',', '.')) || 0;
      const precoPrazoNum = parseFloat(edicao.precoPrazo.replace(',', '.')) || 0;
      const condicaoFinal = edicao.condicaoPagamento || 'PRAZO';

      let precoConsiderado = precoPrazoNum > 0 ? precoPrazoNum : precoAvistaNum;
      if (condicaoFinal === 'AVISTA' && precoAvistaNum > 0) {
        precoConsiderado = precoAvistaNum;
      } else if (condicaoFinal === 'PRAZO' && precoPrazoNum > 0) {
        precoConsiderado = precoPrazoNum;
      }

      const descontoPerc = calcularDesconto(precoAvistaNum, precoPrazoNum);

      return {
        ...item,
        precoAvista: precoAvistaNum,
        precoPrazo: precoPrazoNum,
        descontoAvistaPercentual: parseFloat(descontoPerc.toFixed(2)),
        tipoPagamentoSelecionado: condicaoFinal,
        precoUnitario: precoConsiderado,
        condicoesPagamento: condicaoFinal === 'AVISTA' ? 'À vista' : 'A prazo',
        observacoes: edicao.observacoes,
        dataAtualizacao: new Date().toISOString().split('T')[0]
      };
    });

    if (onSalvarMultiplosPrecos) {
      onSalvarMultiplosPrecos(itensAtualizados);
    } else {
      itensAtualizados.forEach(item => onSalvarPrecoFornecedor(item));
    }

    setFeedback(`Todas as cotações de ${fornecedorAtivo.nome} foram salvas com sucesso!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Insumos a serem exibidos na tabela/lista
  const insumosExibidos = useMemo(() => {
    let lista = insumosFornecedores;

    // Filtrar por fornecedor ativo
    if (fornecedorAtivo) {
      lista = lista.filter(i => 
        i.base.toLowerCase() === fornecedorAtivo.nome.toLowerCase() ||
        i.fornecedorId === fornecedorAtivo.id
      );
    }

    // Filtrar por busca de texto
    if (buscaTexto.trim()) {
      const termo = buscaTexto.toLowerCase();
      lista = lista.filter(i => 
        i.descricao.toLowerCase().includes(termo) ||
        i.codigo.toLowerCase().includes(termo) ||
        i.base.toLowerCase().includes(termo)
      );
    }

    // Se houver um item focado para edição que não esteja na lista, inclui-o no topo
    if (itemFocadoId && !lista.some(i => i.id === itemFocadoId)) {
      const itemFocado = insumosFornecedores.find(i => i.id === itemFocadoId);
      if (itemFocado) {
        lista = [itemFocado, ...lista];
      }
    }

    return lista;
  }, [insumosFornecedores, fornecedorAtivo, buscaTexto, itemFocadoId]);

  // Gestão de Itens Selecionados para Cotar com o Fornecedor
  const isItemSelecionadoParaCotar = (id: string): boolean => {
    return selecionadosParaCotar[id] !== false; // Padrão: selecionado a menos que explicitamente false
  };

  const toggleItemSelecionadoParaCotar = (id: string) => {
    setSelecionadosParaCotar(prev => ({
      ...prev,
      [id]: prev[id] === false ? true : false
    }));
  };

  const selecionarTodosItensParaCotar = () => {
    const mapaAtualizado: { [id: string]: boolean } = { ...selecionadosParaCotar };
    insumosExibidos.forEach(item => {
      mapaAtualizado[item.id] = true;
    });
    setSelecionadosParaCotar(mapaAtualizado);
  };

  const desmarcarTodosItensParaCotar = () => {
    const mapaAtualizado: { [id: string]: boolean } = { ...selecionadosParaCotar };
    insumosExibidos.forEach(item => {
      mapaAtualizado[item.id] = false;
    });
    setSelecionadosParaCotar(mapaAtualizado);
  };

  // Itens atualmente selecionados para a cotação
  const itensSelecionadosLista = useMemo(() => {
    return insumosExibidos.filter(item => isItemSelecionadoParaCotar(item.id));
  }, [insumosExibidos, selecionadosParaCotar]);

  // Contagem de insumos por fornecedor
  const contagemPorFornecedor = useMemo(() => {
    const mapa: { [fornecedorNome: string]: number } = {};
    insumosFornecedores.forEach(item => {
      mapa[item.base] = (mapa[item.base] || 0) + 1;
    });
    return mapa;
  }, [insumosFornecedores]);

  // Gerador de mensagem WhatsApp EXATAMENTE conforme as regras solicitadas:
  // "A mensagem deve ser:
  // Olá, tudo bem? Gostaria de pedir a cotação dos seguintes insumos:
  // E aí seria os insumos sem o código, mas com o seu nome. A unidade. O Preço de avista e a prazo, sem prazo de entrega.
  // Além disso, quando for fazer uma cotação, não é para aparecer o preço já cadastrado"
  const gerarMensagemWhatsAppLista = (fornecedor: FornecedorReal, itens: InsumoItem[]) => {
    const itensValidos = itens.filter(i => 
      (i.base.toLowerCase() === fornecedor.nome.toLowerCase() || i.fornecedorId === fornecedor.id) &&
      isItemSelecionadoParaCotar(i.id)
    );

    let texto = `Olá, tudo bem? Gostaria de pedir a cotação dos seguintes insumos:\n\n`;

    itensValidos.forEach((item, index) => {
      const nomeInsumo = item.descricao || item.nome;

      texto += `${index + 1}) ${nomeInsumo}\n`;
      texto += `   - Unidade: ${item.unidade}\n`;
      texto += `   - Preço à vista:\n`;
      texto += `   - Preço a prazo:\n\n`;
    });

    return texto.trim();
  };

  const abrirModalWhatsApp = (fornecedor: FornecedorReal) => {
    setFornecedorParaExportar(fornecedor);
    setModalWhatsAppAberto(true);
  };

  const handleCotarItemIndividual = (item: InsumoItem) => {
    const fornecedorItem = fornecedores.find(f => 
      f.nome.toLowerCase() === item.base.toLowerCase() || f.id === item.fornecedorId
    ) || fornecedorAtivo;

    if (!fornecedorItem) {
      alert('Fornecedor não encontrado para este insumo.');
      return;
    }

    // Seleciona especificamente este insumo para cotar com este fornecedor
    const novoMapa: { [id: string]: boolean } = {};
    insumosFornecedores.forEach(i => {
      novoMapa[i.id] = (i.id === item.id);
    });
    setSelecionadosParaCotar(novoMapa);
    abrirModalWhatsApp(fornecedorItem);
  };

  const enviarWhatsAppDireto = () => {
    if (!fornecedorParaExportar) return;

    const texto = gerarMensagemWhatsAppLista(fornecedorParaExportar, insumosFornecedores);
    const telLimpo = fornecedorParaExportar.telefone.replace(/\D/g, '');
    const numeroFinal = telLimpo.length <= 11 ? `55${telLimpo}` : telLimpo;
    const url = `https://wa.me/${numeroFinal}?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  const copiarMensagemWhatsApp = () => {
    if (!fornecedorParaExportar) return;
    const texto = gerarMensagemWhatsAppLista(fornecedorParaExportar, insumosFornecedores);
    navigator.clipboard.writeText(texto);
    setCopiadoFeedback(true);
    setTimeout(() => setCopiadoFeedback(false), 2500);
  };

  // Salvar novo insumo adicionado ao fornecedor
  const handleSalvarNovoInsumoParaFornecedor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sinapiSelecionadoParaAdicionar || !fornecedorAtivo) {
      alert('Selecione o insumo SINAPI.');
      return;
    }

    const avistaNum = parseFloat(novoPrecoAvista.replace(',', '.')) || 0;
    const prazoNum = parseFloat(novoPrecoPrazo.replace(',', '.')) || 0;
    const condicaoFinal = novaCondicaoPagamento || 'PRAZO';

    let precoConsiderado = prazoNum > 0 ? prazoNum : avistaNum;
    if (condicaoFinal === 'AVISTA' && avistaNum > 0) {
      precoConsiderado = avistaNum;
    } else if (condicaoFinal === 'PRAZO' && prazoNum > 0) {
      precoConsiderado = prazoNum;
    }

    const descontoPerc = calcularDesconto(avistaNum, prazoNum);

    const novoInsumo: InsumoItem = {
      id: `ins-forn-${fornecedorAtivo.id}-${sinapiSelecionadoParaAdicionar.codigo}-${Date.now()}`,
      codigo: sinapiSelecionadoParaAdicionar.codigo,
      descricao: sinapiSelecionadoParaAdicionar.descricao,
      nome: sinapiSelecionadoParaAdicionar.descricao,
      unidade: sinapiSelecionadoParaAdicionar.unidade,
      tipo: sinapiSelecionadoParaAdicionar.tipo,
      base: fornecedorAtivo.nome, // NOME DO FORNECEDOR COMO BASE!
      precoPrazo: prazoNum,
      precoAvista: avistaNum,
      descontoAvistaPercentual: parseFloat(descontoPerc.toFixed(2)),
      tipoPagamentoSelecionado: condicaoFinal,
      precoUnitario: precoConsiderado,
      fornecedor: fornecedorAtivo.nome,
      whatsappFornecedor: fornecedorAtivo.telefone || '',
      fornecedorId: fornecedorAtivo.id,
      fornecedorNome: fornecedorAtivo.nome,
      contatoFornecedor: fornecedorAtivo.contato,
      telefoneFornecedor: fornecedorAtivo.telefone,
      emailFornecedor: fornecedorAtivo.email,
      enderecoFornecedor: `${fornecedorAtivo.endereco.logradouro}, ${fornecedorAtivo.endereco.numero || ''} - ${fornecedorAtivo.endereco.cidade}/${fornecedorAtivo.endereco.uf}`,
      condicoesPagamento: condicaoFinal === 'AVISTA' ? 'À vista' : 'A prazo',
      observacoes: novasObservacoes.trim(),
      dataAtualizacao: new Date().toISOString().split('T')[0]
    };

    onSalvarPrecoFornecedor(novoInsumo);
    setModalAdicionarInsumoAberto(false);
    setSinapiSelecionadoParaAdicionar(null);
    setNovoPrecoAvista('');
    setNovoPrecoPrazo('');
    setNovasObservacoes('');

    setFeedback(`Insumo [${novoInsumo.codigo}] adicionado à lista de ${fornecedorAtivo.nome} com sucesso!`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const todosSelecionados = insumosExibidos.length > 0 && itensSelecionadosLista.length === insumosExibidos.length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* BANNER PRINCIPAL COM INSTRUÇÃO DE PREÇO À VISTA / A PRAZO E WHATSAPP */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md">
              <DollarSign className="w-6 h-6 stroke-[2.4]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-white">
                  Cadastrar Preço de Fornecedor
                </h2>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Cotação WhatsApp com Seleção de Itens
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Selecione os itens desejados para cotar pelo WhatsApp com o fornecedor. 
                Os preços à vista e a prazo calculam automaticamente a porcentagem de desconto à vista. 
                A condição (à vista ou a prazo) define o valor considerado (padrão: <em>a prazo</em>).
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={onIrParaFornecedores}
            className="py-2.5 px-3.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Fornecedores Cadastrados ({fornecedores.length})</span>
          </button>
        </div>
      </div>

      {/* FEEDBACK DE SALVAMENTO */}
      {feedback && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-950 px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between animate-fade-in shadow-xs">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-emerald-700 hover:text-emerald-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SELETOR DE FORNECEDOR EM ABAS / CARDS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-amber-500" />
            <span>Selecione o Fornecedor para Visualizar e Cotar Insumos</span>
          </label>
          <span className="text-xs text-slate-500">
            {insumosFornecedores.length} insumos em {fornecedores.length} fornecedores
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar scrollbar-none pb-1 text-xs font-bold">
          <button
            type="button"
            onClick={() => setFornecedorAtivoId('TODOS')}
            className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              fornecedorAtivoId === 'TODOS'
                ? 'bg-slate-900 text-amber-400 shadow-sm font-black'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>Todos os Fornecedores</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-200">
              {insumosFornecedores.length}
            </span>
          </button>

          {fornecedores.map(forn => {
            const isAtivo = fornecedorAtivoId === forn.id;
            const qtdItens = contagemPorFornecedor[forn.nome] || 0;

            return (
              <button
                key={forn.id}
                type="button"
                onClick={() => setFornecedorAtivoId(forn.id)}
                className={`px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isAtivo
                    ? 'bg-amber-400 text-slate-950 shadow-sm border border-amber-500 font-black'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Building2 className={`w-3.5 h-3.5 ${isAtivo ? 'text-slate-950' : 'text-amber-600'}`} />
                <span>{forn.nome}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isAtivo ? 'bg-slate-900 text-amber-300 font-black' : 'bg-slate-200 text-slate-700'
                }`}>
                  {qtdItens}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CARD DO FORNECEDOR SELECIONADO COM BOTÃO DE EXPORTAR PARA WHATSAPP */}
      {fornecedorAtivo && (
        <div className="bg-gradient-to-r from-amber-50/90 via-amber-50/40 to-white border-2 border-amber-300 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 bg-slate-900 text-amber-400 font-mono font-bold text-xs rounded-md">
                  Fornecedor Ativo
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {fornecedorAtivo.nome}
                </h3>
                {fornecedorAtivo.categoriaPrincipal && (
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300">
                    {fornecedorAtivo.categoriaPrincipal}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <strong>Tel/WhatsApp:</strong> {fornecedorAtivo.telefone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <strong>E-mail:</strong> {fornecedorAtivo.email}
                </span>
                <span>
                  <strong>Contato:</strong> {fornecedorAtivo.contato}
                </span>
                <span>
                  <strong>Cidade/UF:</strong> {fornecedorAtivo.endereco.cidade}/{fornecedorAtivo.endereco.uf}
                </span>
              </div>
            </div>

            {/* BOTÕES DE AÇÃO: EXPORTAR SELEÇÃO PARA WHATSAPP, ADICIONAR E SALVAR */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  if (itensSelecionadosLista.length === 0) {
                    alert('Selecione pelo menos um insumo nas caixas de seleção da tabela para cotar com este fornecedor.');
                    return;
                  }
                  abrirModalWhatsApp(fornecedorAtivo);
                }}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer border border-emerald-700"
                title="Exportar os insumos selecionados para cotação via WhatsApp"
              >
                <MessageCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Cotar Selecionados ({itensSelecionadosLista.length}) no WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setModalAdicionarInsumoAberto(true)}
                className="px-3.5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                title="Adicionar um novo insumo SINAPI a esta lista"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Adicionar Insumo</span>
              </button>

              <button
                type="button"
                onClick={handleSalvarTodosDoFornecedor}
                className="px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                title="Salvar todas as alterações deste fornecedor"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>Salvar Tudo</span>
              </button>

              {fornecedorAtivo && insumosExibidos.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setModalExcluir({
                      tipo: 'todos',
                      ids: insumosExibidos.map(i => i.id),
                      titulo: `Apagar Todos os Insumos de ${fornecedorAtivo.nome}`,
                      mensagem: `Atenção: Deseja realmente APAGAR TODOS os ${insumosExibidos.length} insumos cadastrados nesta base? Esta ação removerá todos os itens vinculados a este fornecedor.`,
                      itensPreview: insumosExibidos.slice(0, 5).map(i => ({ codigo: i.codigo, descricao: i.descricao || i.nome }))
                    });
                  }}
                  className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer border border-rose-300"
                  title="Apagar todos os insumos cadastrados desta base de fornecedor"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Apagar Todos ({insumosExibidos.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* BANNER DE INSUMO EM EDIÇÃO DIRETA (REDIRECIONADO DA ABA BANCO DE INSUMOS) */}
      {itemAlvoEdicao && (
        <div className="bg-gradient-to-r from-amber-50 via-amber-100/60 to-amber-50 border-2 border-amber-400 text-amber-950 p-4 rounded-2xl flex items-center justify-between shadow-xs animate-fade-in flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-400 text-slate-950 rounded-xl font-black shadow-xs flex-shrink-0">
              <Edit3 className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                  Insumo em Edição Direta
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-amber-300">
                  CÓD: {itemAlvoEdicao.codigo}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                {itemAlvoEdicao.descricao || itemAlvoEdicao.nome} &bull; Fornecedor: <strong className="text-amber-950">{itemAlvoEdicao.base}</strong>
              </p>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Altere o preço praticado à vista ou a prazo na linha destacada abaixo e clique no botão <strong>Salvar</strong> ou saia do campo para atualizar o orçamento.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setItemFocadoId(null)}
            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition cursor-pointer shadow-2xs"
          >
            Fechar Destaque
          </button>
        </div>
      )}

      {/* BARRA DE FILTROS, PESQUISA E SELEÇÃO DE ITENS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar insumo por código, descrição ou base..."
            value={buscaTexto}
            onChange={(e) => setBuscaTexto(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-amber-500 focus:bg-white transition"
          />
        </div>

        {/* Controles de Seleção de Itens para Cotação */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={todosSelecionados ? desmarcarTodosItensParaCotar : selecionarTodosItensParaCotar}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            {todosSelecionados ? (
              <>
                <CheckSquare className="w-3.5 h-3.5 text-amber-600" />
                <span>Desmarcar Todos</span>
              </>
            ) : (
              <>
                <Square className="w-3.5 h-3.5 text-slate-400" />
                <span>Selecionar Todos ({insumosExibidos.length})</span>
              </>
            )}
          </button>

          <span className="text-[11px] font-bold text-slate-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
            {itensSelecionadosLista.length} de {insumosExibidos.length} selecionados para cotar
          </span>

          {itensSelecionadosLista.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setModalExcluir({
                  tipo: 'selecionados',
                  ids: itensSelecionadosLista.map(i => i.id),
                  titulo: `Apagar ${itensSelecionadosLista.length} Insumo(s) Selecionado(s)`,
                  mensagem: `Deseja realmente apagar os ${itensSelecionadosLista.length} insumos selecionados da base deste fornecedor? Esta ação não pode ser desfeita.`,
                  itensPreview: itensSelecionadosLista.slice(0, 5).map(i => ({ codigo: i.codigo, descricao: i.descricao || i.nome }))
                });
              }}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-700 font-bold rounded-lg transition flex items-center gap-1.5 cursor-pointer text-xs shadow-xs"
              title="Apagar os insumos selecionados deste fornecedor"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Apagar Selecionados ({itensSelecionadosLista.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* TABELA DE INSUMOS COM SELEÇÃO, PREÇO À VISTA, PREÇO A PRAZO E CONDIÇÃO (SEM PRAZO DE ENTREGA) */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-700" />
            <h3 className="text-sm font-bold text-slate-800">
              Insumos de {fornecedorAtivo ? fornecedorAtivo.nome : 'Todos os Fornecedores'} ({insumosExibidos.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">
            Marque a caixa de seleção dos itens que deseja incluir na mensagem de cotação do WhatsApp.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <th className="py-3 px-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={todosSelecionados}
                    onChange={todosSelecionados ? desmarcarTodosItensParaCotar : selecionarTodosItensParaCotar}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                    title="Selecionar todos os itens para cotação"
                  />
                </th>
                <th className="py-3 px-3 w-16">CÓD.</th>
                <th className="py-3 px-4 min-w-[200px]">Descrição do Insumo</th>
                <th className="py-3 px-2 w-14 text-center">Unid.</th>
                {fornecedorAtivoId === 'TODOS' && (
                  <th className="py-3 px-3 w-40">Base (Fornecedor)</th>
                )}
                <th className="py-3 px-3 text-right w-32 bg-emerald-50/40">Preço À Vista (R$)</th>
                <th className="py-3 px-3 text-right w-32 bg-blue-50/40">Preço A Prazo (R$)</th>
                <th className="py-3 px-3 text-center w-36">Desconto À Vista</th>
                <th className="py-3 px-3 text-center w-40">Condição Selecionada</th>
                <th className="py-3 px-3 text-right w-32 bg-amber-50/60 font-black">Valor Considerado</th>
                <th className="py-3 px-3 text-center w-24">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {insumosExibidos.length === 0 ? (
                <tr>
                  <td colSpan={fornecedorAtivoId === 'TODOS' ? 11 : 10} className="py-12 text-center text-slate-400">
                    <DollarSign className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-semibold">Nenhum insumo encontrado para este fornecedor.</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Vá até a aba <strong>Banco de Insumos</strong> e clique em <strong>+ Fornecedor Real</strong> no insumo oficial SINAPI, ou use o botão <strong>+ Adicionar Insumo</strong> acima.
                    </p>
                  </td>
                </tr>
              ) : (
                insumosExibidos.map((item) => {
                  const edicao = getEdicaoItem(item);
                  const precoAvistaNum = parseFloat(edicao.precoAvista.replace(',', '.')) || 0;
                  const precoPrazoNum = parseFloat(edicao.precoPrazo.replace(',', '.')) || 0;
                  const descontoPerc = calcularDesconto(precoAvistaNum, precoPrazoNum);
                  
                  // Regra da condição de pagamento:
                  // Se nenhuma for clicada, o preço a prazo é o usado!
                  const condicao = edicao.condicaoPagamento || 'PRAZO';
                  let valorConsiderado = precoPrazoNum > 0 ? precoPrazoNum : precoAvistaNum;
                  if (condicao === 'AVISTA' && precoAvistaNum > 0) {
                    valorConsiderado = precoAvistaNum;
                  } else if (condicao === 'PRAZO' && precoPrazoNum > 0) {
                    valorConsiderado = precoPrazoNum;
                  }

                  const isChecked = isItemSelecionadoParaCotar(item.id);
                  const salvoRecente = itensSalvosRecentemente[item.id];

                  // Encontrar preço SINAPI original para referência
                  const sinapiRef = insumosSinapi.find(s => s.codigo === item.codigo);

                  return (
                    <tr 
                      id={`insumo-fornecedor-row-${item.id}`}
                      key={item.id} 
                      className={`transition-all duration-300 group ${
                        itemFocadoId === item.id 
                          ? 'bg-amber-100/90 ring-2 ring-amber-500 shadow-md font-medium' 
                          : isChecked 
                            ? 'hover:bg-amber-50/20' 
                            : 'opacity-60 bg-slate-50/40 hover:opacity-100'
                      }`}
                    >
                      
                      {/* Checkbox de Seleção para Cotação no WhatsApp */}
                      <td className="py-3 px-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleItemSelecionadoParaCotar(item.id)}
                          className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                          title="Marcar para incluir na cotação WhatsApp"
                        />
                      </td>

                      {/* Código SINAPI */}
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-950 rounded border border-amber-300 text-[11px] inline-flex items-center gap-1.5">
                          {item.codigo}
                          {itemFocadoId === item.id && (
                            <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider animate-pulse">
                              Editando
                            </span>
                          )}
                        </span>
                      </td>

                      {/* Descrição do Insumo */}
                      <td className="py-3 px-4 font-medium text-slate-900">
                        <div className="space-y-0.5">
                          <span className="font-semibold block leading-tight">{item.descricao || item.nome}</span>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            {sinapiRef && (
                              <span>Ref. SINAPI: <strong className="text-blue-700">{formatarMoeda(sinapiRef.precoUnitario)}</strong></span>
                            )}
                            {item.observacoes && (
                              <span className="italic truncate max-w-xs">"{item.observacoes}"</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Unidade */}
                      <td className="py-3 px-2 text-center font-mono font-bold text-slate-700 uppercase">
                        {item.unidade}
                      </td>

                      {/* Base / Fornecedor (se visão TODOS) */}
                      {fornecedorAtivoId === 'TODOS' && (
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full bg-slate-900 text-amber-400 font-mono text-[10px] border border-slate-700">
                            {item.base}
                          </span>
                        </td>
                      )}

                      {/* PREÇO PRATICADO À VISTA (EDITÁVEL) */}
                      <td className="py-3 px-3 text-right bg-emerald-50/30">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">R$</span>
                          <input
                            id={`input-preco-avista-${item.id}`}
                            type="text"
                            placeholder="0,00"
                            value={edicao.precoAvista}
                            onChange={(e) => handleUpdateEdicaoField(item.id, 'precoAvista', e.target.value)}
                            onBlur={() => handleSalvarItem(item)}
                            className={`w-24 pl-6 pr-2 py-1.5 bg-white border rounded-lg text-right font-mono font-bold text-slate-900 text-xs focus:ring-1 focus:ring-emerald-400 transition ${
                              itemFocadoId === item.id 
                                ? 'border-amber-500 ring-2 ring-amber-400 shadow-sm' 
                                : 'border-emerald-300 focus:border-emerald-500'
                            }`}
                          />
                        </div>
                      </td>

                      {/* PREÇO PRATICADO A PRAZO (EDITÁVEL) */}
                      <td className="py-3 px-3 text-right bg-blue-50/30">
                        <div className="relative">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400">R$</span>
                          <input
                            id={`input-preco-prazo-${item.id}`}
                            type="text"
                            placeholder="0,00"
                            value={edicao.precoPrazo}
                            onChange={(e) => handleUpdateEdicaoField(item.id, 'precoPrazo', e.target.value)}
                            onBlur={() => handleSalvarItem(item)}
                            className="w-24 pl-6 pr-2 py-1.5 bg-white border border-blue-300 focus:border-blue-500 rounded-lg text-right font-mono font-bold text-slate-900 text-xs focus:ring-1 focus:ring-blue-400 transition"
                          />
                        </div>
                      </td>

                      {/* % DESCONTO AUTOMÁTICO NO À VISTA */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        {descontoPerc > 0 ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-mono font-black text-[11px] border border-emerald-300 flex items-center gap-1 shadow-2xs">
                              <TrendingDown className="w-3 h-3 text-emerald-700" />
                              {descontoPerc.toFixed(1)}% OFF
                            </span>
                            <span className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                              - {formatarMoeda(precoPrazoNum - precoAvistaNum)}
                            </span>
                          </div>
                        ) : precoAvistaNum > 0 && precoPrazoNum > 0 && precoAvistaNum === precoPrazoNum ? (
                          <span className="text-[10px] text-slate-400 font-medium">Mesmo valor</span>
                        ) : (
                          <span className="text-[10px] text-slate-400">-</span>
                        )}
                      </td>

                      {/* CONDIÇÃO DE PAGAMENTO: SELETOR ENTRE À VISTA E A PRAZO (PADRÃO: A PRAZO) */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="inline-flex rounded-lg border border-slate-300 p-0.5 bg-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateEdicaoField(item.id, 'condicaoPagamento', 'AVISTA');
                              setTimeout(() => handleSalvarItem({ ...item, tipoPagamentoSelecionado: 'AVISTA' }), 50);
                            }}
                            className={`px-2.5 py-1 text-[10px] font-black rounded-md transition cursor-pointer flex items-center gap-1 ${
                              condicao === 'AVISTA'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                            title="Considerar preço à vista no orçamento"
                          >
                            <Zap className="w-3 h-3" />
                            <span>À Vista</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateEdicaoField(item.id, 'condicaoPagamento', 'PRAZO');
                              setTimeout(() => handleSalvarItem({ ...item, tipoPagamentoSelecionado: 'PRAZO' }), 50);
                            }}
                            className={`px-2.5 py-1 text-[10px] font-black rounded-md transition cursor-pointer flex items-center gap-1 ${
                              condicao === 'PRAZO'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                            title="Considerar preço a prazo no orçamento (Padrão)"
                          >
                            <Clock className="w-3 h-3" />
                            <span>A Prazo</span>
                          </button>
                        </div>
                      </td>

                      {/* VALOR CONSIDERADO FINAL (BASEADO NA CONDIÇÃO) */}
                      <td className="py-3 px-3 text-right bg-amber-50/50 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-mono font-black text-slate-900 text-sm block">
                            {formatarMoeda(valorConsiderado)}
                          </span>
                          <span className={`text-[9px] font-bold uppercase tracking-wider block ${
                            condicao === 'AVISTA' ? 'text-emerald-700' : 'text-blue-700'
                          }`}>
                            ({condicao === 'AVISTA' ? 'À Vista' : 'A Prazo'})
                          </span>
                        </div>
                      </td>

                      {/* AÇÕES NO ITEM */}
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleCotarItemIndividual(item)}
                            className="p-1.5 text-emerald-700 hover:text-emerald-950 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                            title="Conversar: Cotar este insumo via WhatsApp"
                            aria-label="Conversar"
                          >
                            <MessageCircle className="w-4 h-4 stroke-[2.2]" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSalvarItem(item)}
                            className={`p-1.5 rounded-lg transition cursor-pointer ${
                              salvoRecente 
                                ? 'bg-emerald-600 text-white' 
                                : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50'
                            }`}
                            title="Salvar alterações deste insumo"
                          >
                            {salvoRecente ? <Check className="w-4 h-4 stroke-[3]" /> : <Save className="w-4 h-4" />}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setModalExcluir({
                                tipo: 'individual',
                                item,
                                ids: [item.id],
                                titulo: 'Apagar Insumo da Base',
                                mensagem: `Deseja realmente apagar o insumo [CÓD. ${item.codigo}] "${item.descricao || item.nome}" da base "${item.base}"?`,
                                itensPreview: [{ codigo: item.codigo, descricao: item.descricao || item.nome }]
                              });
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                            title="Apagar este insumo da base do fornecedor"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé da Tabela com Resumo */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Cotação selecionada:</span>
            <span>
              <strong>{itensSelecionadosLista.length}</strong> de {insumosExibidos.length} insumo(s) marcados para cotação no WhatsApp.
            </span>
          </div>

          {fornecedorAtivo && (
            <button
              type="button"
              disabled={itensSelecionadosLista.length === 0}
              onClick={() => abrirModalWhatsApp(fornecedorAtivo)}
              className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Exportar {itensSelecionadosLista.length} selecionados para WhatsApp de {fornecedorAtivo.nome} &rarr;</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          MODAL DE EXPORTAÇÃO SIMPLES DA LISTA PARA O WHATSAPP COM SELEÇÃO DE ITENS
         ========================================================================= */}
      {modalWhatsAppAberto && fornecedorParaExportar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
            
            {/* Header Modal WhatsApp */}
            <div className="bg-emerald-700 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white text-emerald-800 flex items-center justify-center font-black shadow-md">
                  <MessageCircle className="w-6 h-6 stroke-[2.4]" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight text-white">
                    Cotação de Insumos via WhatsApp
                  </h3>
                  <p className="text-xs text-emerald-100 mt-0.5">
                    Fornecedor: <strong>{fornecedorParaExportar.nome}</strong> ({fornecedorParaExportar.telefone})
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalWhatsAppAberto(false)}
                className="p-2 rounded-xl text-emerald-200 hover:text-white hover:bg-emerald-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Itens Incluídos e Seleção Rápida */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between gap-3 text-xs">
              <span className="font-bold text-slate-700">
                {itensSelecionadosLista.length} insumo(s) selecionado(s) para cotar
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selecionarTodosItensParaCotar}
                  className="text-[11px] text-emerald-700 hover:underline font-bold cursor-pointer"
                >
                  Marcar Todos
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={desmarcarTodosItensParaCotar}
                  className="text-[11px] text-slate-500 hover:underline font-bold cursor-pointer"
                >
                  Desmarcar Todos
                </button>
              </div>
            </div>

            {/* Seleção Interativa de Itens deste Fornecedor */}
            {fornecedorParaExportar && (
              <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
                  Selecione quais itens deseja cotar com {fornecedorParaExportar.nome}:
                </span>
                <div className="bg-white border border-slate-200 rounded-xl p-2.5 max-h-40 overflow-y-auto space-y-1 shadow-2xs">
                  {insumosFornecedores
                    .filter(i => 
                      i.base.toLowerCase() === fornecedorParaExportar.nome.toLowerCase() || 
                      i.fornecedorId === fornecedorParaExportar.id
                    )
                    .map(item => {
                      const isChecked = isItemSelecionadoParaCotar(item.id);
                      return (
                        <label
                          key={item.id}
                          className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition select-none text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleItemSelecionadoParaCotar(item.id)}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                          <span className={`flex-1 ${isChecked ? 'text-slate-900 font-bold' : 'text-slate-400 font-medium'}`}>
                            {item.descricao || item.nome}
                          </span>
                          <span className="font-mono text-[10px] text-slate-500 uppercase font-semibold">
                            ({item.unidade})
                          </span>
                        </label>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Corpo com Prévia da Mensagem (Formato solicitado) */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Mensagem Formatada para Envio
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  Sem código • Com nome e unidade • Preços à vista e a prazo
                </span>
              </div>

              <div className="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs leading-relaxed whitespace-pre-wrap max-h-80 overflow-y-auto border border-slate-800 selection:bg-emerald-500 selection:text-white">
                {itensSelecionadosLista.length === 0 ? (
                  <span className="text-slate-400 italic">
                    Nenhum insumo selecionado para este fornecedor. Marque os itens desejados acima.
                  </span>
                ) : (
                  gerarMensagemWhatsAppLista(fornecedorParaExportar, insumosFornecedores)
                )}
              </div>

              {copiadoFeedback && (
                <div className="bg-emerald-100 text-emerald-900 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
                  <Check className="w-4 h-4 text-emerald-700 stroke-[3]" />
                  <span>Mensagem copiada para a área de transferência com sucesso!</span>
                </div>
              )}
            </div>

            {/* Footer com Botões de Ação */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setModalWhatsAppAberto(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
              >
                Fechar
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={itensSelecionadosLista.length === 0}
                  onClick={copiarMensagemWhatsApp}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 shadow-xs transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copiar Mensagem</span>
                </button>

                <button
                  type="button"
                  disabled={itensSelecionadosLista.length === 0}
                  onClick={enviarWhatsAppDireto}
                  className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                  <span>Abrir no WhatsApp</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL PARA VINCULAR/ADICIONAR INSUMO SINAPI AO FORNECEDOR SELECIONADO
         ========================================================================= */}
      {modalAdicionarInsumoAberto && fornecedorAtivo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
            
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <Plus className="w-5 h-5 stroke-[3]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">
                    Adicionar Insumo a {fornecedorAtivo.nome}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Selecione o insumo oficial SINAPI para registrar na base deste fornecedor
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalAdicionarInsumoAberto(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSalvarNovoInsumoParaFornecedor} className="p-6 space-y-4 text-xs">
              
              {/* Busca de Insumo SINAPI */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  1. Buscar Insumo SINAPI *
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Digite código ou descrição (ex: 1379, cimento, areia, brita, tubo)..."
                    value={buscaNovoInsumoSinapi}
                    onChange={(e) => setBuscaNovoInsumoSinapi(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                {buscaNovoInsumoSinapi && (
                  <div className="mt-1 max-h-40 overflow-y-auto border border-amber-300 rounded-xl bg-white shadow-md p-1 space-y-1">
                    {insumosSinapi
                      .filter(i => 
                        i.descricao.toLowerCase().includes(buscaNovoInsumoSinapi.toLowerCase()) ||
                        i.codigo.toLowerCase().includes(buscaNovoInsumoSinapi.toLowerCase())
                      )
                      .slice(0, 8)
                      .map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setSinapiSelecionadoParaAdicionar(item);
                            setBuscaNovoInsumoSinapi('');
                          }}
                          className="p-2 hover:bg-amber-50 rounded-lg cursor-pointer flex items-center justify-between text-xs transition"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold px-1.5 py-0.2 bg-amber-400 text-slate-950 rounded text-[10px]">
                              {item.codigo}
                            </span>
                            <span className="truncate max-w-xs">{item.descricao}</span>
                          </div>
                          <span className="font-mono text-slate-600">{formatarMoeda(item.precoUnitario)}/{item.unidade}</span>
                        </div>
                      ))}
                  </div>
                )}

                {sinapiSelecionadoParaAdicionar && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-300 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="px-2 py-0.5 bg-amber-400 text-slate-950 font-black font-mono rounded text-[10px]">
                        CÓD. {sinapiSelecionadoParaAdicionar.codigo}
                      </span>
                      <span className="font-bold text-slate-900 block mt-1">{sinapiSelecionadoParaAdicionar.descricao}</span>
                      <span className="text-[11px] text-slate-500">Unidade: {sinapiSelecionadoParaAdicionar.unidade}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-700">
                      Ref: {formatarMoeda(sinapiSelecionadoParaAdicionar.precoUnitario)}
                    </span>
                  </div>
                )}
              </div>

              {/* Preços À Vista e A Prazo */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preço À Vista (R$)</label>
                  <input
                    type="text"
                    placeholder="0,00"
                    value={novoPrecoAvista}
                    onChange={(e) => setNovoPrecoAvista(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs font-bold focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preço A Prazo (R$)</label>
                  <input
                    type="text"
                    placeholder="0,00"
                    value={novoPrecoPrazo}
                    onChange={(e) => setNovoPrecoPrazo(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-mono text-xs font-bold focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Condição de Pagamento */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Condição a Considerar</label>
                <select
                  value={novaCondicaoPagamento}
                  onChange={(e) => setNovaCondicaoPagamento(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-xs"
                >
                  <option value="PRAZO">A Prazo (Padrão)</option>
                  <option value="AVISTA">À Vista</option>
                </select>
              </div>

              {/* Botões do Formulário */}
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setModalAdicionarInsumoAberto(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!sinapiSelecionadoParaAdicionar}
                  className="px-5 py-2 rounded-xl text-xs font-black uppercase bg-amber-400 hover:bg-amber-500 text-slate-950 transition cursor-pointer disabled:opacity-40"
                >
                  Salvar na Lista de {fornecedorAtivo.nome}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMAÇÃO DE EXCLUSÃO (SEM DEPENDER DE WINDOW.CONFIRM) */}
      {modalExcluir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-5 bg-rose-50 border-b border-rose-100 flex items-start gap-3">
              <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl shrink-0">
                <Trash2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-slate-900 text-base">
                  {modalExcluir.titulo}
                </h3>
                <p className="text-xs text-rose-800 font-medium mt-1 leading-relaxed">
                  {modalExcluir.mensagem}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalExcluir(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalExcluir.itensPreview && modalExcluir.itensPreview.length > 0 && (
              <div className="p-4 bg-slate-50 border-b border-slate-200 max-h-48 overflow-y-auto">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Itens a serem removidos ({modalExcluir.ids.length}):
                </p>
                <div className="space-y-1.5">
                  {modalExcluir.itensPreview.map((item, idx) => (
                    <div key={idx} className="text-xs text-slate-700 bg-white p-2 rounded-lg border border-slate-200 flex items-center gap-2">
                      <span className="font-mono font-bold text-[10px] bg-amber-100 text-amber-950 px-1.5 py-0.5 rounded border border-amber-300">
                        {item.codigo}
                      </span>
                      <span className="truncate flex-1 font-medium">{item.descricao}</span>
                    </div>
                  ))}
                  {modalExcluir.ids.length > modalExcluir.itensPreview.length && (
                    <p className="text-[11px] text-slate-500 italic pl-1">
                      ... e mais {modalExcluir.ids.length - modalExcluir.itensPreview.length} insumo(s).
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="p-4 bg-white flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setModalExcluir(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={executarExclusaoConfirmada}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sim, Apagar Agora</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
