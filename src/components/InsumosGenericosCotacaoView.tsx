import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, 
  MessageCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Copy, 
  ExternalLink, 
  DollarSign, 
  Building2, 
  Phone, 
  Users, 
  Sparkles, 
  FileSpreadsheet, 
  Printer, 
  TrendingDown, 
  Award, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Search, 
  ArrowRight, 
  Send, 
  Layers, 
  X,
  AlertCircle
} from 'lucide-react';
import { 
  InsumoGenerico, 
  FornecedorCotacao, 
  InsumoProprio, 
  TipoInsumo, 
  CotacaoAgrupadaPorFornecedor,
  ItemCotacaoFornecedor,
  StatusFornecedorCotacao
} from '../types/orcamento';
import { formatarMoeda } from '../utils/bdiCalculator';

interface InsumosGenericosCotacaoViewProps {
  onAdotarInsumoFornecedor?: (insumo: InsumoProprio) => void;
  fornecedoresCadastrados?: string[];
}

// Insumos Genéricos iniciais com futuros fornecedores predefinidos para teste e uso prático
const INSUMOS_GENERICOS_INICIAIS: InsumoGenerico[] = [
  {
    id: 'gen-01',
    codigo: 'GEN-CIM-01',
    nome: 'Cimento Portland CP II-32 (Saco 50 kg)',
    descricao: 'Cimento para concreto estrutural e alvenaria de vedação',
    unidade: 'sc',
    tipo: 'MATERIAL',
    quantidadeEstimada: 350,
    especificacaoTecnica: 'Entrega paletizada no canteiro, descarga inclusa, padrão ABNT NBR 16697.',
    precoReferenciaEstimado: 38.00,
    dataCriacao: '2025-01-20',
    fornecedoresCotacao: [
      {
        id: 'fc-cim-1',
        nomeFornecedor: 'Depósito Silva & Cia',
        contatoVendedor: 'Marcos Silva',
        whatsapp: '5511999998888',
        email: 'vendas@depositosilva.com.br',
        precoInformado: 36.50,
        prazoEntregaDias: 2,
        condicoesPagamento: '28 DDL faturado',
        status: 'RESPONDIDO'
      },
      {
        id: 'fc-cim-2',
        nomeFornecedor: 'Votorantim Cimentos S/A',
        contatoVendedor: 'Paula Ramos',
        whatsapp: '5511998765432',
        email: 'comercial@votorantim.com',
        precoInformado: 35.80,
        prazoEntregaDias: 4,
        condicoesPagamento: '30 DDL boleto',
        status: 'RESPONDIDO'
      },
      {
        id: 'fc-cim-3',
        nomeFornecedor: 'Constrular Distribuidora',
        contatoVendedor: 'Roberto Santos',
        whatsapp: '5511977776666',
        email: 'cotacao@constrular.com.br',
        status: 'PENDENTE'
      }
    ]
  },
  {
    id: 'gen-02',
    codigo: 'GEN-ARE-01',
    nome: 'Areia Média Lavada a Granel',
    descricao: 'Areia para confecção de argamassas e concreto',
    unidade: 'm³',
    tipo: 'MATERIAL',
    quantidadeEstimada: 45,
    especificacaoTecnica: 'Isenta de matéria orgânica e argila dessecada. Carga fechada em caminhão basculante.',
    precoReferenciaEstimado: 120.00,
    dataCriacao: '2025-01-20',
    fornecedoresCotacao: [
      {
        id: 'fc-are-1',
        nomeFornecedor: 'Depósito Silva & Cia',
        contatoVendedor: 'Marcos Silva',
        whatsapp: '5511999998888',
        email: 'vendas@depositosilva.com.br',
        precoInformado: 115.00,
        prazoEntregaDias: 1,
        condicoesPagamento: '28 DDL faturado',
        status: 'RESPONDIDO'
      },
      {
        id: 'fc-are-2',
        nomeFornecedor: 'Mineração Tietê Areias',
        contatoVendedor: 'Carlos Souza',
        whatsapp: '5511988884444',
        email: 'contato@tieteareias.com.br',
        precoInformado: 108.00,
        prazoEntregaDias: 2,
        condicoesPagamento: 'À vista transferência',
        status: 'RESPONDIDO'
      },
      {
        id: 'fc-are-3',
        nomeFornecedor: 'Constrular Distribuidora',
        contatoVendedor: 'Roberto Santos',
        whatsapp: '5511977776666',
        status: 'PENDENTE'
      }
    ]
  },
  {
    id: 'gen-03',
    codigo: 'GEN-BRI-01',
    nome: 'Brita 1 Basáltica Graduada',
    descricao: 'Agregado graúdo para concreto usinado e armado',
    unidade: 'm³',
    tipo: 'MATERIAL',
    quantidadeEstimada: 30,
    especificacaoTecnica: 'Granulometria 9,5 mm a 19 mm, lavada e isenta de finos.',
    precoReferenciaEstimado: 95.00,
    dataCriacao: '2025-01-21',
    fornecedoresCotacao: [
      {
        id: 'fc-bri-1',
        nomeFornecedor: 'Depósito Silva & Cia',
        contatoVendedor: 'Marcos Silva',
        whatsapp: '5511999998888',
        status: 'PENDENTE'
      },
      {
        id: 'fc-bri-2',
        nomeFornecedor: 'Mineração Tietê Areias',
        contatoVendedor: 'Carlos Souza',
        whatsapp: '5511988884444',
        precoInformado: 92.00,
        prazoEntregaDias: 2,
        condicoesPagamento: 'À vista',
        status: 'RESPONDIDO'
      }
    ]
  },
  {
    id: 'gen-04',
    codigo: 'GEN-ACO-10',
    nome: 'Aço CA-50 Barra Reta d=10,0 mm (3/8") 12m',
    descricao: 'Vergalhão nervurado para armaduras estruturais',
    unidade: 'kg',
    tipo: 'MATERIAL',
    quantidadeEstimada: 1200,
    especificacaoTecnica: 'Certificado de conformidade ABNT NBR 7480. Feixes amarrados.',
    precoReferenciaEstimado: 7.50,
    dataCriacao: '2025-01-21',
    fornecedoresCotacao: [
      {
        id: 'fc-aco-1',
        nomeFornecedor: 'Gerdau Aços Brasil',
        contatoVendedor: 'Fernando Lima',
        whatsapp: '5511987654321',
        email: 'vendas@gerdau.com',
        precoInformado: 7.15,
        prazoEntregaDias: 3,
        condicoesPagamento: '30/60 DDL',
        status: 'RESPONDIDO'
      },
      {
        id: 'fc-aco-2',
        nomeFornecedor: 'Depósito Silva & Cia',
        contatoVendedor: 'Marcos Silva',
        whatsapp: '5511999998888',
        precoInformado: 7.60,
        prazoEntregaDias: 1,
        condicoesPagamento: '28 DDL',
        status: 'RESPONDIDO'
      },
      {
        id: 'fc-aco-3',
        nomeFornecedor: 'Constrular Distribuidora',
        contatoVendedor: 'Roberto Santos',
        whatsapp: '5511977776666',
        status: 'PENDENTE'
      }
    ]
  },
  {
    id: 'gen-05',
    codigo: 'GEN-BLOC-09',
    nome: 'Bloco Cerâmico de Vedação 8 Furos 9x19x19 cm',
    descricao: 'Alvenaria de vedação estruturalmente não portante',
    unidade: 'mil',
    tipo: 'MATERIAL',
    quantidadeEstimada: 4.5,
    especificacaoTecnica: 'Entrega paletizada com quebra máxima admissível de 2%. NBR 15270.',
    precoReferenciaEstimado: 900.00,
    dataCriacao: '2025-01-22',
    fornecedoresCotacao: [
      {
        id: 'fc-bloc-1',
        nomeFornecedor: 'Cerâmica São José',
        contatoVendedor: 'Antônio José',
        whatsapp: '5519991234567',
        precoInformado: 870.00,
        prazoEntregaDias: 5,
        condicoesPagamento: 'Entrada + 30 dias',
        status: 'RESPONDIDO'
      },
      {
        id: 'fc-bloc-2',
        nomeFornecedor: 'Depósito Silva & Cia',
        contatoVendedor: 'Marcos Silva',
        whatsapp: '5511999998888',
        status: 'PENDENTE'
      }
    ]
  }
];

export const InsumosGenericosCotacaoView: React.FC<InsumosGenericosCotacaoViewProps> = ({
  onAdotarInsumoFornecedor,
  fornecedoresCadastrados = []
}) => {
  // Aba interna da gestão:
  // 'genericos' (Lista de insumos genéricos com botão de futuros fornecedores)
  // 'lista-fornecedor' (Lista final consolidada por fornecedor)
  // 'comparativo' (Mapa comparativo de menor preço)
  const [visaoAtiva, setVisaoAtiva] = useState<'genericos' | 'lista-fornecedor' | 'comparativo'>('genericos');

  // Estado dos Insumos Genéricos
  const [insumosGenericos, setInsumosGenericos] = useState<InsumoGenerico[]>(() => {
    try {
      const salvo = localStorage.getItem('seobra_insumos_genericos');
      if (salvo) return JSON.parse(salvo);
    } catch {
      // fallback
    }
    return INSUMOS_GENERICOS_INICIAIS;
  });

  // Salvar no localStorage sempre que alterar
  useEffect(() => {
    try {
      localStorage.setItem('seobra_insumos_genericos', JSON.stringify(insumosGenericos));
    } catch {
      // ignore
    }
  }, [insumosGenericos]);

  // Filtros de busca
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('TODOS');

  // Modal: Gerenciar Fornecedores e Cotação de um Insumo Genérico específico
  const [insumoSelecionadoParaCotar, setInsumoSelecionadoParaCotar] = useState<InsumoGenerico | null>(null);

  // Modal: Criar ou Editar Insumo Genérico
  const [modalNovoInsumoAberto, setModalNovoInsumoAberto] = useState(false);
  const [insumoEmEdicao, setInsumoEmEdicao] = useState<InsumoGenerico | null>(null);

  // Form novo insumo genérico
  const [formCodigo, setFormCodigo] = useState('');
  const [formNome, setFormNome] = useState('');
  const [formUnidade, setFormUnidade] = useState('un');
  const [formTipo, setFormTipo] = useState<TipoInsumo>('MATERIAL');
  const [formQuantidade, setFormQuantidade] = useState('100');
  const [formEspecificacao, setFormEspecificacao] = useState('');
  const [formPrecoRef, setFormPrecoRef] = useState('');

  // Form no modal de futuros fornecedores do insumo
  const [novoFornNome, setNovoFornNome] = useState('');
  const [novoFornZap, setNovoFornZap] = useState('');
  const [novoFornContato, setNovoFornContato] = useState('');
  const [novoFornEmail, setNovoFornEmail] = useState('');

  // Modal de Folha de Cotação para Impressão / PDF de um fornecedor
  const [fornecedorParaFolha, setFornecedorParaFolha] = useState<CotacaoAgrupadaPorFornecedor | null>(null);

  // Modal para digitar preços respondidos por fornecedor na lista final
  const [fornecedorParaDigitarPrecos, setFornecedorParaDigitarPrecos] = useState<CotacaoAgrupadaPorFornecedor | null>(null);

  // Notificações / toast feedback
  const [toastMensagem, setToastMensagem] = useState<string | null>(null);
  const exibirToast = (msg: string) => {
    setToastMensagem(msg);
    setTimeout(() => setToastMensagem(null), 3500);
  };

  // =========================================================================
  // LÓGICA CRUCIAL: AGRUPAMENTO POR FORNECEDOR (LISTA FINAL DE COTAÇÃO)
  // Transforma os insumos genéricos e seus fornecedores numa lista única por fornecedor!
  // =========================================================================
  const listaFinalPorFornecedor = useMemo<CotacaoAgrupadaPorFornecedor[]>(() => {
    const mapaFornecedores: Record<string, CotacaoAgrupadaPorFornecedor> = {};

    insumosGenericos.forEach((insumo) => {
      insumo.fornecedoresCotacao.forEach((fc) => {
        const chave = fc.nomeFornecedor.trim().toLowerCase();
        if (!mapaFornecedores[chave]) {
          mapaFornecedores[chave] = {
            fornecedorNome: fc.nomeFornecedor.trim(),
            whatsapp: fc.whatsapp,
            contatoVendedor: fc.contatoVendedor,
            email: fc.email,
            itens: [],
            totalItens: 0,
            totalRespondidos: 0,
            valorTotalEstimado: 0,
            statusGeral: 'PENDENTE'
          };
        }

        const fornecedor = mapaFornecedores[chave];
        // Atualiza WhatsApp e dados de contato caso mais recente
        if (fc.whatsapp && !fornecedor.whatsapp) fornecedor.whatsapp = fc.whatsapp;
        if (fc.contatoVendedor && !fornecedor.contatoVendedor) fornecedor.contatoVendedor = fc.contatoVendedor;

        const itemCotacao: ItemCotacaoFornecedor = {
          insumoGenericoId: insumo.id,
          insumoCodigo: insumo.codigo,
          insumoNome: insumo.nome,
          unidade: insumo.unidade,
          quantidade: insumo.quantidadeEstimada,
          especificacaoTecnica: insumo.especificacaoTecnica,
          precoInformado: fc.precoInformado,
          prazoEntregaDias: fc.prazoEntregaDias,
          condicoesPagamento: fc.condicoesPagamento,
          status: fc.status,
          fornecedorCotacaoId: fc.id
        };

        fornecedor.itens.push(itemCotacao);
        fornecedor.totalItens += 1;
        if (fc.precoInformado && fc.precoInformado > 0) {
          fornecedor.totalRespondidos += 1;
          fornecedor.valorTotalEstimado += fc.precoInformado * insumo.quantidadeEstimada;
        }
      });
    });

    // Calcula status geral de cada fornecedor
    return Object.values(mapaFornecedores).map((forn) => {
      if (forn.totalRespondidos === forn.totalItens && forn.totalItens > 0) {
        forn.statusGeral = 'RESPONDIDO_TOTAL';
      } else if (forn.totalRespondidos > 0) {
        forn.statusGeral = 'RESPONDIDO_PARCIAL';
      } else if (forn.itens.some(i => i.status === 'ENVIADO')) {
        forn.statusGeral = 'ENVIADO';
      } else {
        forn.statusGeral = 'PENDENTE';
      }
      return forn;
    }).sort((a, b) => b.totalItens - a.totalItens);
  }, [insumosGenericos]);

  // Lista de todos os nomes de fornecedores únicos conhecidos
  const nomesFornecedoresConhecidos = useMemo(() => {
    const nomes = new Set<string>();
    insumosGenericos.forEach(i => i.fornecedoresCotacao.forEach(f => nomes.add(f.nomeFornecedor.trim())));
    fornecedoresCadastrados.forEach(f => nomes.add(f.trim()));
    return Array.from(nomes).sort();
  }, [insumosGenericos, fornecedoresCadastrados]);

  // Insumos genéricos filtrados
  const insumosFiltrados = useMemo(() => {
    return insumosGenericos.filter(item => {
      const matchTexto = 
        item.nome.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        item.codigo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        (item.especificacaoTecnica && item.especificacaoTecnica.toLowerCase().includes(filtroTexto.toLowerCase()));
      const matchTipo = filtroTipo === 'TODOS' || item.tipo === filtroTipo;
      return matchTexto && matchTipo;
    });
  }, [insumosGenericos, filtroTexto, filtroTipo]);

  // Gerador de mensagem individual de WhatsApp para um insumo específico
  const gerarMensagemWhatsAppItem = (insumo: InsumoGenerico, fc: FornecedorCotacao) => {
    const saudacao = fc.contatoVendedor 
      ? `Olá ${fc.contatoVendedor} (${fc.nomeFornecedor})!` 
      : `Olá equipe de vendas da ${fc.nomeFornecedor}!`;

    return (
      `${saudacao}\n\n` +
      `Aqui é do setor de Engenharia / Compras de Obras.\n` +
      `Gostaríamos de solicitar cotação para o insumo abaixo:\n\n` +
      `📌 *ITEM:* ${insumo.nome}\n` +
      `🏷️ *Código:* ${insumo.codigo}\n` +
      `📏 *Quantidade Estimada:* ${insumo.quantidadeEstimada} ${insumo.unidade}\n` +
      (insumo.especificacaoTecnica ? `ℹ️ *Especificação:* ${insumo.especificacaoTecnica}\n` : '') +
      `\n` +
      `Poderiam nos informar por gentileza:\n` +
      `1️⃣ *Preço unitário* (com impostos inclusos)\n` +
      `2️⃣ *Prazo de entrega* no canteiro da obra\n` +
      `3️⃣ *Condições de pagamento* (faturado, boleto ou à vista)\n` +
      `4️⃣ *Marca / Fabricante* cotado\n\n` +
      `Agradecemos a atenção e aguardamos seu retorno!`
    );
  };

  // Gerador de mensagem CONSOLIDADA no WhatsApp para um fornecedor com TODOS os seus itens (Aba Lista Final)
  const gerarMensagemWhatsAppConsolidada = (fornecedor: CotacaoAgrupadaPorFornecedor) => {
    const saudacao = fornecedor.contatoVendedor 
      ? `Olá ${fornecedor.contatoVendedor} (${fornecedor.fornecedorNome})!` 
      : `Olá equipe da ${fornecedor.fornecedorNome}!`;

    let itensTexto = '';
    fornecedor.itens.forEach((item, idx) => {
      itensTexto += 
        `\n${idx + 1}) *${item.insumoNome}*\n` +
        `   • Código: ${item.insumoCodigo}\n` +
        `   • Quantidade: ${item.quantidade} ${item.unidade}\n` +
        (item.especificacaoTecnica ? `   • Obs: ${item.especificacaoTecnica}\n` : '');
    });

    return (
      `${saudacao}\n\n` +
      `Aqui é da equipe de Engenharia e Orçamentos de Obra.\n` +
      `Estamos abrindo processo de cotação para nossa obra e selecionamos sua empresa para os *${fornecedor.totalItens} itens* abaixo:\n` +
      itensTexto +
      `\n` +
      `📋 *Solicitamos informar:*\n` +
      `• Preço unitário de cada item (R$ / unidade)\n` +
      `• Prazo de entrega no canteiro da obra\n` +
      `• Condições de pagamento (faturamento / parcelamento)\n` +
      `• Validade da proposta\n\n` +
      `Muito obrigado pela parceria!`
    );
  };

  // Disparo de WhatsApp
  const dispararWhatsApp = (whatsapp: string, mensagem: string) => {
    const numeroLimpo = whatsapp.replace(/\D/g, '');
    const url = `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Copiar para a área de transferência
  const copiarTexto = (texto: string, label: string) => {
    navigator.clipboard.writeText(texto);
    exibirToast(`Copiado para a área de transferência: ${label}`);
  };

  // Adicionar fornecedor ao insumo genérico selecionado
  const handleAdicionarFornecedorAoInsumo = () => {
    if (!insumoSelecionadoParaCotar) return;
    if (!novoFornNome.trim()) {
      alert('Digite o nome do fornecedor');
      return;
    }

    const novoFornecedor: FornecedorCotacao = {
      id: `fc-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      nomeFornecedor: novoFornNome.trim(),
      whatsapp: novoFornZap.trim(),
      contatoVendedor: novoFornContato.trim() || undefined,
      email: novoFornEmail.trim() || undefined,
      status: 'PENDENTE'
    };

    const atualizados = insumosGenericos.map(item => {
      if (item.id === insumoSelecionadoParaCotar.id) {
        return {
          ...item,
          fornecedoresCotacao: [...item.fornecedoresCotacao, novoFornecedor]
        };
      }
      return item;
    });

    setInsumosGenericos(atualizados);
    // Atualiza modal ativo
    const atual = atualizados.find(i => i.id === insumoSelecionadoParaCotar.id);
    if (atual) setInsumoSelecionadoParaCotar(atual);

    setNovoFornNome('');
    setNovoFornZap('');
    setNovoFornContato('');
    setNovoFornEmail('');
    exibirToast(`Fornecedor "${novoFornecedor.nomeFornecedor}" adicionado para cotação!`);
  };

  // Remover fornecedor do insumo selecionado
  const handleRemoverFornecedorDoInsumo = (fcId: string) => {
    if (!insumoSelecionadoParaCotar) return;
    if (!confirm('Deseja remover este fornecedor da lista de cotação deste insumo?')) return;

    const atualizados = insumosGenericos.map(item => {
      if (item.id === insumoSelecionadoParaCotar.id) {
        return {
          ...item,
          fornecedoresCotacao: item.fornecedoresCotacao.filter(f => f.id !== fcId)
        };
      }
      return item;
    });

    setInsumosGenericos(atualizados);
    const atual = atualizados.find(i => i.id === insumoSelecionadoParaCotar.id);
    if (atual) setInsumoSelecionadoParaCotar(atual);
    exibirToast('Fornecedor removido da cotação.');
  };

  // Atualizar preço respondido de um fornecedor dentro do modal de insumo
  const handleAtualizarPrecoInsumoFornecedor = (
    insumoId: string, 
    fcId: string, 
    novoPreco: number, 
    prazo?: number, 
    condicoes?: string
  ) => {
    const atualizados = insumosGenericos.map(item => {
      if (item.id === insumoId) {
        const fornecedoresAtualizados = item.fornecedoresCotacao.map(fc => {
          if (fc.id === fcId) {
            return {
              ...fc,
              precoInformado: novoPreco,
              prazoEntregaDias: prazo ?? fc.prazoEntregaDias,
              condicoesPagamento: condicoes ?? fc.condicoesPagamento,
              status: (novoPreco > 0 ? 'RESPONDIDO' : 'PENDENTE') as StatusFornecedorCotacao,
              dataResposta: new Date().toISOString().split('T')[0]
            };
          }
          return fc;
        });
        return { ...item, fornecedoresCotacao: fornecedoresAtualizados };
      }
      return item;
    });

    setInsumosGenericos(atualizados);
    if (insumoSelecionadoParaCotar && insumoSelecionadoParaCotar.id === insumoId) {
      const atual = atualizados.find(i => i.id === insumoId);
      if (atual) setInsumoSelecionadoParaCotar(atual);
    }
  };

  // Salvar criação ou edição de insumo genérico
  const handleSalvarInsumoGenerico = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNome.trim() || !formCodigo.trim()) {
      alert('Preencha pelo menos o Código e o Nome do insumo genérico.');
      return;
    }

    const qtd = parseFloat(formQuantidade.replace(',', '.')) || 1;
    const precoRef = formPrecoRef ? parseFloat(formPrecoRef.replace(',', '.')) : undefined;

    if (insumoEmEdicao) {
      // Editar
      setInsumosGenericos(insumosGenericos.map(item => {
        if (item.id === insumoEmEdicao.id) {
          return {
            ...item,
            codigo: formCodigo.trim().toUpperCase(),
            nome: formNome.trim(),
            unidade: formUnidade.trim(),
            tipo: formTipo,
            quantidadeEstimada: qtd,
            especificacaoTecnica: formEspecificacao.trim() || undefined,
            precoReferenciaEstimado: precoRef
          };
        }
        return item;
      }));
      exibirToast(`Insumo genérico "${formNome}" atualizado com sucesso!`);
    } else {
      // Criar Novo Insumo Genérico
      const novo: InsumoGenerico = {
        id: `gen-${Date.now()}`,
        codigo: formCodigo.trim().toUpperCase(),
        nome: formNome.trim(),
        unidade: formUnidade.trim(),
        tipo: formTipo,
        quantidadeEstimada: qtd,
        especificacaoTecnica: formEspecificacao.trim() || undefined,
        precoReferenciaEstimado: precoRef,
        dataCriacao: new Date().toISOString().split('T')[0],
        fornecedoresCotacao: []
      };
      setInsumosGenericos([novo, ...insumosGenericos]);
      exibirToast(`Novo insumo genérico "${novo.nome}" criado com sucesso!`);
    }

    setModalNovoInsumoAberto(false);
    setInsumoEmEdicao(null);
  };

  // Abrir modal de criação
  const abrirModalCriarInsumo = () => {
    setInsumoEmEdicao(null);
    setFormCodigo(`GEN-${Math.floor(100 + Math.random() * 900)}`);
    setFormNome('');
    setFormUnidade('un');
    setFormTipo('MATERIAL');
    setFormQuantidade('100');
    setFormEspecificacao('');
    setFormPrecoRef('');
    setModalNovoInsumoAberto(true);
  };

  // Abrir modal de edição de insumo genérico
  const abrirModalEditarInsumo = (item: InsumoGenerico) => {
    setInsumoEmEdicao(item);
    setFormCodigo(item.codigo);
    setFormNome(item.nome);
    setFormUnidade(item.unidade);
    setFormTipo(item.tipo);
    setFormQuantidade(item.quantidadeEstimada.toString());
    setFormEspecificacao(item.especificacaoTecnica || '');
    setFormPrecoRef(item.precoReferenciaEstimado ? item.precoReferenciaEstimado.toString() : '');
    setModalNovoInsumoAberto(true);
  };

  // Excluir insumo genérico
  const excluirInsumoGenerico = (id: string, nome: string) => {
    if (!confirm(`Deseja realmente excluir o insumo genérico "${nome}"?`)) return;
    setInsumosGenericos(insumosGenericos.filter(i => i.id !== id));
    exibirToast(`Insumo genérico "${nome}" removido.`);
  };

  // Adotar Preço Vencedor e Salvar nas Pastas de Fornecedor
  const handleAdotarPrecoVencedor = (insumo: InsumoGenerico, fc: FornecedorCotacao) => {
    if (!fc.precoInformado || fc.precoInformado <= 0) {
      alert('Este fornecedor ainda não informou um preço válido para ser adotado.');
      return;
    }

    const novoInsumoProprio: InsumoProprio = {
      id: `ins-${Date.now()}`,
      fornecedor: fc.nomeFornecedor,
      base: fc.nomeFornecedor,
      whatsappFornecedor: fc.whatsapp,
      codigo: insumo.codigo,
      nome: insumo.nome,
      descricao: insumo.nome,
      unidade: insumo.unidade,
      precoUnitario: fc.precoInformado,
      tipo: insumo.tipo,
      dataAtualizacao: new Date().toISOString().split('T')[0]
    };

    if (onAdotarInsumoFornecedor) {
      onAdotarInsumoFornecedor(novoInsumoProprio);
    } else {
      // Salva diretamente no localStorage de insumos de fornecedores
      try {
        const salvo = localStorage.getItem('seobra_insumos_fornecedores');
        const listaAtual: InsumoProprio[] = salvo ? JSON.parse(salvo) : [];
        listaAtual.push(novoInsumoProprio);
        localStorage.setItem('seobra_insumos_fornecedores', JSON.stringify(listaAtual));
      } catch {
        // ignore
      }
    }

    // Marca como vencedor no insumo genérico
    setInsumosGenericos(insumosGenericos.map(item => {
      if (item.id === insumo.id) {
        return {
          ...item,
          fornecedorVencedorId: fc.id,
          fornecedoresCotacao: item.fornecedoresCotacao.map(f => ({
            ...f,
            status: (f.id === fc.id ? 'SELECIONADO' : f.status) as StatusFornecedorCotacao
          }))
        };
      }
      return item;
    }));

    exibirToast(`🏆 Preço de ${fc.nomeFornecedor} (${formatarMoeda(fc.precoInformado)}) adotado e salvo na pasta do fornecedor!`);
  };

  return (
    <div className="space-y-5 animate-fade-in text-slate-800">
      
      {/* Toast Feedback */}
      {toastMensagem && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-amber-400 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMensagem}</span>
        </div>
      )}

      {/* HEADER DA SEÇÃO COM IDENTIDADE E VISÕES */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-slate-950 font-black shadow-sm shrink-0">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">
                  Insumos Genéricos & Cotação de Fornecedores
                </h3>
                <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  Módulo RFQ
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Cadastre insumos genéricos sem vínculo inicial com fornecedor, adicione futuros contatos para cotação e 
                utilize a <strong>Lista Final por Fornecedor</strong> para disparar cotações agrupadas via WhatsApp ou PDF.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={abrirModalCriarInsumo}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>CRIAR INSUMO GENÉRICO</span>
            </button>
          </div>
        </div>

        {/* NAVEGAÇÃO ENTRE AS 3 VISÕES DA COTAÇÃO */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs font-bold">
          
          <button
            type="button"
            onClick={() => setVisaoAtiva('genericos')}
            className={`py-2 px-3.5 rounded-xl transition flex items-center gap-2 cursor-pointer ${
              visaoAtiva === 'genericos'
                ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>1. Insumos Genéricos & Futuros Fornecedores</span>
            <span className="text-[10px] bg-slate-900/10 px-1.5 py-0.2 rounded-full font-mono">
              {insumosGenericos.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setVisaoAtiva('lista-fornecedor')}
            className={`py-2 px-3.5 rounded-xl transition flex items-center gap-2 cursor-pointer ${
              visaoAtiva === 'lista-fornecedor'
                ? 'bg-emerald-600 text-white font-black shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-emerald-500" />
            <span>2. Lista Final para Cotação por Fornecedor</span>
            <span className="text-[10px] bg-emerald-100 text-emerald-900 px-2 py-0.2 rounded-full font-black border border-emerald-300">
              {listaFinalPorFornecedor.length} fornecedores
            </span>
          </button>

          <button
            type="button"
            onClick={() => setVisaoAtiva('comparativo')}
            className={`py-2 px-3.5 rounded-xl transition flex items-center gap-2 cursor-pointer ${
              visaoAtiva === 'comparativo'
                ? 'bg-blue-600 text-white font-black shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>3. Mapa Comparativo & Menor Preço</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VISÃO 1: INSUMOS GENÉRICOS (COM BOTÃO DE COTAÇÃO E FUTUROS FORNECEDORES)
         ========================================================================= */}
      {visaoAtiva === 'genericos' && (
        <div className="space-y-4">
          
          {/* Barra de Filtros e Busca */}
          <div className="bg-white border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nome, código ou especificação..."
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-500">Tipo:</span>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option value="TODOS">Todos os Tipos</option>
                <option value="MATERIAL">Materiais</option>
                <option value="MAO_DE_OBRA">Mão de Obra</option>
                <option value="EQUIPAMENTO">Equipamentos</option>
                <option value="SERVICO">Serviços</option>
              </select>
            </div>
          </div>

          {/* Grid / Lista de Insumos Genéricos */}
          {insumosFiltrados.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-12 text-center">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700">Nenhum insumo genérico encontrado</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Crie um novo insumo genérico para cadastrar especificações e adicionar contatos de fornecedores para cotação.
              </p>
              <button
                type="button"
                onClick={abrirModalCriarInsumo}
                className="mt-4 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Criar Primeiro Insumo Genérico</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3.5">
              {insumosFiltrados.map((item) => {
                const totalFornecedores = item.fornecedoresCotacao.length;
                const respondidos = item.fornecedoresCotacao.filter(f => f.precoInformado && f.precoInformado > 0);
                const menorPreco = respondidos.length > 0
                  ? Math.min(...respondidos.map(f => f.precoInformado!))
                  : null;

                return (
                  <div 
                    key={item.id}
                    className="bg-white border border-slate-200 hover:border-amber-400 rounded-2xl p-4 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Dados Básicos do Insumo Genérico */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-[11px] font-black text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">
                          {item.codigo}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                          {item.tipo}
                        </span>
                        <span className="text-xs font-bold text-slate-700">
                          Qtd: <strong className="text-slate-950 font-mono">{item.quantidadeEstimada} {item.unidade}</strong>
                        </span>
                        {item.precoReferenciaEstimado && (
                          <span className="text-xs text-slate-500 font-medium">
                            Ref: {formatarMoeda(item.precoReferenciaEstimado)}/{item.unidade}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-black text-slate-900 leading-snug">
                        {item.nome}
                      </h4>

                      {item.especificacaoTecnica && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1 italic">
                          "{item.especificacaoTecnica}"
                        </p>
                      )}

                      {/* Mini resumo dos fornecedores vinculados */}
                      <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                        <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full">
                          <Users className="w-3 h-3 text-slate-500" />
                          {totalFornecedores} {totalFornecedores === 1 ? 'fornecedor futuro' : 'fornecedores futuros'}
                        </span>

                        {menorPreco !== null && (
                          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Award className="w-3 h-3 text-emerald-600" />
                            Menor Preço: <strong className="font-mono">{formatarMoeda(menorPreco)}</strong>
                          </span>
                        )}

                        {item.fornecedorVencedorId && (
                          <span className="text-[11px] font-black text-amber-900 bg-amber-100 border border-amber-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3 text-amber-700 stroke-[3]" />
                            Preço Adotado na Obra
                          </span>
                        )}
                      </div>
                    </div>

                    {/* AÇÕES E BOTÃO DE COTAÇÃO SOLICITADO */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap sm:flex-nowrap">
                      
                      {/* BOTÃO PRINCIPAL SOLICITADO PELO USUÁRIO */}
                      <button
                        type="button"
                        onClick={() => setInsumoSelecionadoParaCotar(item)}
                        className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
                        title="Adicionar e gerenciar futuros fornecedores para este insumo genérico"
                      >
                        <MessageCircle className="w-4 h-4 stroke-[2.5]" />
                        <span>INSUMOS PARA COTAÇÃO & FUTUROS FORNECEDORES</span>
                        <span className="w-5 h-5 rounded-full bg-emerald-800/80 text-[10px] flex items-center justify-center font-mono">
                          {totalFornecedores}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => abrirModalEditarInsumo(item)}
                        className="p-2.5 text-slate-500 hover:text-amber-800 hover:bg-amber-50 rounded-xl transition cursor-pointer border border-slate-200"
                        title="Editar Insumo Genérico"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => excluirInsumoGenerico(item.id, item.nome)}
                        className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer border border-slate-200"
                        title="Excluir Insumo Genérico"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VISÃO 2: LISTA FINAL PARA COTAÇÃO POR FORNECEDOR (AGRUPADA)
          Solicitação chave: "Esses contatos seriam usados em uma lista final para cotação por fornecedor"
         ========================================================================= */}
      {visaoAtiva === 'lista-fornecedor' && (
        <div className="space-y-4">
          
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-emerald-950">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                Lista Consolidada para Disparo
              </span>
              <h4 className="text-sm font-black mt-1">
                Mapa de Cotações Agrupadas por Fornecedor
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                O sistema reuniu automaticamente todos os insumos genéricos atribuídos a cada fornecedor. 
                Envie a lista completa via WhatsApp com um só clique ou gere a Folha de Cotação em PDF.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-white/80 border border-emerald-300 rounded-xl px-3 py-1.5 text-right">
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">Total Fornecedores</span>
                <span className="text-lg font-black font-mono text-emerald-950">{listaFinalPorFornecedor.length}</span>
              </div>
            </div>
          </div>

          {listaFinalPorFornecedor.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-700">Nenhum fornecedor adicionado aos insumos ainda</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Volte para a aba de Insumos Genéricos e clique no botão <strong>"Insumos para Cotação & Futuros Fornecedores"</strong> para vincular fornecedores.
              </p>
              <button
                type="button"
                onClick={() => setVisaoAtiva('genericos')}
                className="mt-4 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Ir para Insumos Genéricos</span>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {listaFinalPorFornecedor.map((forn) => {
                const msgWhatsApp = gerarMensagemWhatsAppConsolidada(forn);

                return (
                  <div 
                    key={forn.fornecedorNome}
                    className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs"
                  >
                    {/* Header do Fornecedor */}
                    <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Building2 className="w-4 h-4 text-emerald-600" />
                          <h4 className="text-base font-black text-slate-900">
                            {forn.fornecedorNome}
                          </h4>
                          {forn.contatoVendedor && (
                            <span className="text-xs text-slate-600 font-medium">
                              (Contato: <strong>{forn.contatoVendedor}</strong>)
                            </span>
                          )}
                          <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
                            {forn.totalItens} {forn.totalItens === 1 ? 'item a cotar' : 'itens a cotar'}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-600 flex-wrap">
                          {forn.whatsapp && (
                            <span className="flex items-center gap-1 font-mono">
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                              {forn.whatsapp}
                            </span>
                          )}
                          {forn.email && (
                            <span className="text-slate-500">
                              ✉️ {forn.email}
                            </span>
                          )}
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            forn.statusGeral === 'RESPONDIDO_TOTAL'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : forn.statusGeral === 'RESPONDIDO_PARCIAL'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {forn.totalRespondidos} de {forn.totalItens} respondidos
                          </span>
                        </div>
                      </div>

                      {/* Botões de Ação para o Fornecedor Consolidado */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {forn.whatsapp && (
                          <button
                            type="button"
                            onClick={() => dispararWhatsApp(forn.whatsapp, msgWhatsApp)}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                            title="Disparar mensagem no WhatsApp com a lista completa de itens a cotar"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Enviar Pacote no WhatsApp</span>
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => copiarTexto(msgWhatsApp, `Pacote de Cotação - ${forn.fornecedorNome}`)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                          title="Copiar texto da cotação com todos os itens"
                        >
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>Copiar Lista</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFornecedorParaFolha(forn)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition flex items-center gap-1.5 border border-slate-200 cursor-pointer"
                          title="Gerar Folha de Cotação para Impressão ou PDF"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-500" />
                          <span>Folha PDF</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFornecedorParaDigitarPrecos(forn)}
                          className="px-3 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                          title="Digitar preços respondidos por este fornecedor"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Digitar Preços</span>
                        </button>
                      </div>
                    </div>

                    {/* Tabela de Itens deste Fornecedor */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="bg-slate-100/60 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200">
                            <th className="py-2.5 px-4 font-bold">Código</th>
                            <th className="py-2.5 px-4 font-bold">Insumo Genérico</th>
                            <th className="py-2.5 px-4 font-bold text-center">Quantidade</th>
                            <th className="py-2.5 px-4 font-bold">Especificação Técnica</th>
                            <th className="py-2.5 px-4 font-bold text-right">Preço Cotado (R$)</th>
                            <th className="py-2.5 px-4 font-bold text-right">Subtotal Previsto</th>
                            <th className="py-2.5 px-4 font-bold text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {forn.itens.map((item) => {
                            const subtotal = item.precoInformado ? item.precoInformado * item.quantidade : null;

                            return (
                              <tr key={item.insumoGenericoId} className="hover:bg-slate-50/70 transition">
                                <td className="py-2.5 px-4 font-mono font-bold text-amber-900">
                                  {item.insumoCodigo}
                                </td>
                                <td className="py-2.5 px-4 font-bold text-slate-900">
                                  {item.insumoNome}
                                </td>
                                <td className="py-2.5 px-4 text-center font-mono font-medium">
                                  {item.quantidade} {item.unidade}
                                </td>
                                <td className="py-2.5 px-4 text-slate-500 italic max-w-xs truncate">
                                  {item.especificacaoTecnica || '-'}
                                </td>
                                <td className="py-2.5 px-4 text-right font-mono font-bold">
                                  {item.precoInformado ? (
                                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                      {formatarMoeda(item.precoInformado)}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 italic">Pendente</span>
                                  )}
                                </td>
                                <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-800">
                                  {subtotal ? formatarMoeda(subtotal) : '-'}
                                </td>
                                <td className="py-2.5 px-4 text-center">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    item.status === 'SELECIONADO'
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                      : item.status === 'RESPONDIDO'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-slate-100 text-slate-600'
                                  }`}>
                                    {item.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                        {forn.valorTotalEstimado > 0 && (
                          <tfoot>
                            <tr className="bg-slate-50 font-bold border-t border-slate-200">
                              <td colSpan={5} className="py-2.5 px-4 text-right text-slate-700 uppercase text-[11px]">
                                Total do Pacote Respondido pelo Fornecedor:
                              </td>
                              <td className="py-2.5 px-4 text-right font-mono text-emerald-800 font-black text-sm">
                                {formatarMoeda(forn.valorTotalEstimado)}
                              </td>
                              <td></td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VISÃO 3: MAPA COMPARATIVO & DECISÃO DE MENOR PREÇO
         ========================================================================= */}
      {visaoAtiva === 'comparativo' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-blue-600" />
              <span>Mapa Comparativo de Preços dos Insumos Genéricos</span>
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Compare as respostas de cotação lado a lado. O menor preço é destacado em verde. 
              Ao clicar em <strong>"Adotar como Vencedor"</strong>, o insumo é salvo diretamente na pasta do fornecedor!
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <th className="py-3 px-4 font-bold">Código & Insumo Genérico</th>
                    <th className="py-3 px-4 font-bold text-center">Qtd Obra</th>
                    <th className="py-3 px-4 font-bold">Cotações dos Fornecedores</th>
                    <th className="py-3 px-4 font-bold text-center">Menor Preço</th>
                    <th className="py-3 px-4 font-bold text-center">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {insumosGenericos.map((item) => {
                    const respondidos = item.fornecedoresCotacao.filter(f => f.precoInformado && f.precoInformado > 0);
                    const menorPreco = respondidos.length > 0 
                      ? Math.min(...respondidos.map(f => f.precoInformado!)) 
                      : null;
                    const fornecedorVencedor = respondidos.find(f => f.precoInformado === menorPreco);

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-3 px-4">
                          <span className="font-mono text-[10px] font-black text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                            {item.codigo}
                          </span>
                          <div className="font-bold text-slate-900 mt-0.5">{item.nome}</div>
                          {item.especificacaoTecnica && (
                            <span className="text-[11px] text-slate-400 italic line-clamp-1">
                              {item.especificacaoTecnica}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-medium">
                          {item.quantidadeEstimada} {item.unidade}
                        </td>
                        <td className="py-3 px-4">
                          {item.fornecedoresCotacao.length === 0 ? (
                            <span className="text-slate-400 italic">Sem fornecedores</span>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {item.fornecedoresCotacao.map((fc) => {
                                const isMenor = fc.precoInformado === menorPreco && menorPreco !== null;
                                return (
                                  <div
                                    key={fc.id}
                                    className={`px-2 py-1 rounded-lg border text-xs flex items-center gap-1.5 ${
                                      isMenor
                                        ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-black'
                                        : fc.precoInformado
                                        ? 'bg-slate-50 border-slate-200 text-slate-700 font-medium'
                                        : 'bg-slate-50 border-dashed border-slate-300 text-slate-400'
                                    }`}
                                  >
                                    <span>{fc.nomeFornecedor}:</span>
                                    <strong className="font-mono">
                                      {fc.precoInformado ? formatarMoeda(fc.precoInformado) : 'Pendente'}
                                    </strong>
                                    {isMenor && (
                                      <Award className="w-3 h-3 text-emerald-600" />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-black text-emerald-800 text-sm">
                          {menorPreco !== null ? formatarMoeda(menorPreco) : '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {fornecedorVencedor ? (
                            <button
                              type="button"
                              onClick={() => handleAdotarPrecoVencedor(item, fornecedorVencedor)}
                              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1 cursor-pointer mx-auto"
                              title="Salvar este insumo com este preço na pasta do fornecedor correspondente"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>Adotar Vencedor</span>
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">Aguardando preços</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL INTERATIVO: GERENCIAR FUTUROS FORNECEDORES DO INSUMO GENÉRICO
          (Acionado pelo botão "INSUMOS PARA COTAÇÃO & FUTUROS FORNECEDORES")
         ========================================================================= */}
      {insumoSelecionadoParaCotar && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-auto animate-scale-up">
            
            {/* Header do Modal */}
            <div className="p-5 bg-slate-900 text-white flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shrink-0">
                  <MessageCircle className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded border border-amber-400/30">
                      {insumoSelecionadoParaCotar.codigo}
                    </span>
                    <h3 className="text-lg font-black text-white">
                      Futuros Fornecedores & Cotação do Insumo
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Item: <strong>{insumoSelecionadoParaCotar.nome}</strong> • Quantidade: <strong className="font-mono">{insumoSelecionadoParaCotar.quantidadeEstimada} {insumoSelecionadoParaCotar.unidade}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setInsumoSelecionadoParaCotar(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Conteúdo do Modal */}
            <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
              
              {/* Formulário: Adicionar Novo Fornecedor a este Insumo */}
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4">
                <h4 className="text-xs font-black uppercase text-amber-950 tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4 h-4 stroke-[3] text-amber-700" />
                  <span>Adicionar Futuro Fornecedor para Cotar este Insumo</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 mt-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                      Fornecedor / Razão Social *
                    </label>
                    <input
                      type="text"
                      list="fornecedores-sugeridos"
                      placeholder="Ex: Votorantim, Depósito Silva"
                      value={novoFornNome}
                      onChange={(e) => setNovoFornNome(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-400"
                    />
                    <datalist id="fornecedores-sugeridos">
                      {nomesFornecedoresConhecidos.map(n => (
                        <option key={n} value={n} />
                      ))}
                    </datalist>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                      WhatsApp com DDD (Ex: 11999998888)
                    </label>
                    <input
                      type="text"
                      placeholder="5511999998888"
                      value={novoFornZap}
                      onChange={(e) => setNovoFornZap(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                      Nome do Vendedor / Contato
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Carlos Santos"
                      value={novoFornContato}
                      onChange={(e) => setNovoFornContato(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase block mb-1">
                      Email (opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="vendas@fornecedor.com"
                      value={novoFornEmail}
                      onChange={(e) => setNovoFornEmail(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAdicionarFornecedorAoInsumo}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Adicionar à Cotação</span>
                  </button>
                </div>
              </div>

              {/* Lista de Fornecedores Atuais deste Insumo */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span>Fornecedores Vinculados a este Insumo ({insumoSelecionadoParaCotar.fornecedoresCotacao.length})</span>
                  </h4>
                  <span className="text-[11px] text-slate-500 italic">
                    Estes contatos também alimentam a <strong>Lista Final por Fornecedor</strong>
                  </span>
                </div>

                {insumoSelecionadoParaCotar.fornecedoresCotacao.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs text-slate-500">Nenhum fornecedor vinculado a este insumo ainda.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {insumoSelecionadoParaCotar.fornecedoresCotacao.map((fc) => {
                      const msgZapItem = gerarMensagemWhatsAppItem(insumoSelecionadoParaCotar, fc);

                      return (
                        <div 
                          key={fc.id}
                          className="bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Building2 className="w-4 h-4 text-amber-600" />
                              <strong className="text-sm font-black text-slate-900">{fc.nomeFornecedor}</strong>
                              {fc.contatoVendedor && (
                                <span className="text-xs text-slate-600">({fc.contatoVendedor})</span>
                              )}
                              {fc.whatsapp && (
                                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                                  <Phone className="w-3 h-3" />
                                  {fc.whatsapp}
                                </span>
                              )}
                            </div>

                            {/* Campo de Preço Respondido */}
                            <div className="flex items-center gap-3 mt-2 flex-wrap text-xs">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-600">Preço Respondido (R$):</span>
                                <input
                                  type="number"
                                  step="0.01"
                                  placeholder="0,00"
                                  defaultValue={fc.precoInformado ?? ''}
                                  onBlur={(e) => {
                                    const val = parseFloat(e.target.value);
                                    if (!isNaN(val)) {
                                      handleAtualizarPrecoInsumoFornecedor(
                                        insumoSelecionadoParaCotar.id,
                                        fc.id,
                                        val
                                      );
                                    }
                                  }}
                                  className="w-24 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-xs font-mono font-bold focus:ring-2 focus:ring-amber-400"
                                />
                              </div>

                              {fc.precoInformado && fc.precoInformado > 0 && (
                                <div className="text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                  Total Previsto: {formatarMoeda(fc.precoInformado * insumoSelecionadoParaCotar.quantidadeEstimada)}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Ações para este fornecedor */}
                          <div className="flex items-center gap-2 shrink-0 flex-wrap">
                            {fc.whatsapp && (
                              <button
                                type="button"
                                onClick={() => dispararWhatsApp(fc.whatsapp, msgZapItem)}
                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                                title="Enviar mensagem deste item no WhatsApp"
                              >
                                <Send className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => copiarTexto(msgZapItem, `Cotação ${fc.nomeFornecedor}`)}
                              className="p-1.5 text-slate-500 hover:text-slate-800 bg-slate-100 rounded-xl transition cursor-pointer"
                              title="Copiar texto da mensagem"
                            >
                              <Copy className="w-4 h-4" />
                            </button>

                            {fc.precoInformado && fc.precoInformado > 0 && (
                              <button
                                type="button"
                                onClick={() => handleAdotarPrecoVencedor(insumoSelecionadoParaCotar, fc)}
                                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-1 cursor-pointer"
                                title="Adotar este preço e salvar na pasta do fornecedor"
                              >
                                <Award className="w-3.5 h-3.5" />
                                <span>Adotar</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleRemoverFornecedorDoInsumo(fc.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 bg-slate-100 rounded-xl transition cursor-pointer"
                              title="Remover fornecedor deste insumo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer do Modal */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setInsumoSelecionadoParaCotar(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition cursor-pointer"
              >
                Concluir & Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: CRIAR OU EDITAR INSUMO GENÉRICO
         ========================================================================= */}
      {modalNovoInsumoAberto && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden animate-scale-up">
            <form onSubmit={handleSalvarInsumoGenerico}>
              <div className="p-5 bg-amber-400 text-slate-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  <h3 className="font-black text-base">
                    {insumoEmEdicao ? 'Editar Insumo Genérico' : 'Novo Insumo Genérico para Cotação'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setModalNovoInsumoAberto(false)}
                  className="p-1 rounded-lg hover:bg-amber-500/50 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-3.5 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 uppercase text-[10px] block mb-1">
                      Código Genérico *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: GEN-CIM-01"
                      value={formCodigo}
                      onChange={(e) => setFormCodigo(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-700 uppercase text-[10px] block mb-1">
                      Tipo do Insumo
                    </label>
                    <select
                      value={formTipo}
                      onChange={(e) => setFormTipo(e.target.value as TipoInsumo)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-amber-400"
                    >
                      <option value="MATERIAL">Material</option>
                      <option value="MAO_DE_OBRA">Mão de Obra</option>
                      <option value="EQUIPAMENTO">Equipamento</option>
                      <option value="SERVICO">Serviço</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 uppercase text-[10px] block mb-1">
                    Nome Completo do Insumo Genérico *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Cimento Portland CP II-32 (Saco 50kg)"
                    value={formNome}
                    onChange={(e) => setFormNome(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-700 uppercase text-[10px] block mb-1">
                      Unidade de Medida
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: sc, kg, m³, m²"
                      value={formUnidade}
                      onChange={(e) => setFormUnidade(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-center font-bold focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 uppercase text-[10px] block mb-1">
                      Quantidade Estimada
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      placeholder="100"
                      value={formQuantidade}
                      onChange={(e) => setFormQuantidade(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-center font-bold focus:ring-2 focus:ring-amber-400"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700 uppercase text-[10px] block mb-1">
                      Preço Ref. R$ (opc.)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="38,00"
                      value={formPrecoRef}
                      onChange={(e) => setFormPrecoRef(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-mono text-center font-bold focus:ring-2 focus:ring-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-700 uppercase text-[10px] block mb-1">
                    Especificação Técnica / Marcas de Referência / Exigências
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ex: Entrega no canteiro, paletizado, descarga inclusa, conforme NBR 16697..."
                    value={formEspecificacao}
                    onChange={(e) => setFormEspecificacao(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalNovoInsumoAberto(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xs cursor-pointer"
                >
                  {insumoEmEdicao ? 'Salvar Alterações' : 'Criar Insumo Genérico'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: FOLHA DE COTAÇÃO PARA IMPRESSÃO / PDF
         ========================================================================= */}
      {fornecedorParaFolha && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 space-y-4 my-auto print:p-0">
            <div className="flex items-center justify-between border-b pb-3 print:hidden">
              <h4 className="font-black text-slate-900 text-sm flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-600" />
                <span>Folha de Cotação - {fornecedorParaFolha.fornecedorNome}</span>
              </h4>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir / Salvar PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFornecedorParaFolha(null)}
                  className="p-1 text-slate-400 hover:text-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Documento Impresso Formatado */}
            <div className="border border-slate-300 rounded-xl p-6 text-slate-800 text-xs space-y-4 bg-white">
              <div className="flex justify-between items-start border-b pb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">SOLICITAÇÃO DE COTAÇÃO DE PREÇOS (RFQ)</h2>
                  <p className="text-xs text-slate-500">Gestão e Orçamentos de Engenharia Civil</p>
                </div>
                <div className="text-right text-[11px] text-slate-500">
                  <p>Data: <strong>{new Date().toLocaleDateString('pt-BR')}</strong></p>
                  <p>Prazo Limite: <strong>3 dias úteis</strong></p>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 grid grid-cols-2 gap-2 text-xs">
                <p><strong>Fornecedor:</strong> {fornecedorParaFolha.fornecedorNome}</p>
                <p><strong>Contato/Vendedor:</strong> {fornecedorParaFolha.contatoVendedor || '-'}</p>
                <p><strong>WhatsApp / Tel:</strong> {fornecedorParaFolha.whatsapp || '-'}</p>
                <p><strong>Email:</strong> {fornecedorParaFolha.email || '-'}</p>
              </div>

              <table className="w-full text-left text-xs border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-300">
                    <th className="p-2 border-r">Item</th>
                    <th className="p-2 border-r">Descrição do Insumo</th>
                    <th className="p-2 border-r text-center">Qtd</th>
                    <th className="p-2 border-r text-center">Un</th>
                    <th className="p-2 border-r text-right">Preço Unit. (R$)</th>
                    <th className="p-2 text-center">Marca Cotada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {fornecedorParaFolha.itens.map((item, idx) => (
                    <tr key={item.insumoGenericoId} className="h-9">
                      <td className="p-2 border-r font-mono text-center">{idx + 1}</td>
                      <td className="p-2 border-r font-medium">
                        <strong>{item.insumoNome}</strong> ({item.insumoCodigo})
                        {item.especificacaoTecnica && (
                          <div className="text-[10px] text-slate-500 italic">{item.especificacaoTecnica}</div>
                        )}
                      </td>
                      <td className="p-2 border-r text-center font-mono font-bold">{item.quantidade}</td>
                      <td className="p-2 border-r text-center font-mono">{item.unidade}</td>
                      <td className="p-2 border-r text-right font-mono font-bold">
                        {item.precoInformado ? formatarMoeda(item.precoInformado) : 'R$ ____________'}
                      </td>
                      <td className="p-2 text-center text-slate-400">________________</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t pt-4 grid grid-cols-2 gap-4 text-[11px] text-slate-600">
                <div>
                  <p><strong>Condições de Pagamento:</strong> ________________________</p>
                  <p className="mt-2"><strong>Prazo de Entrega:</strong> _____ dias corridos</p>
                </div>
                <div className="text-right">
                  <p className="mt-6 border-t border-slate-400 pt-1 inline-block w-48 text-center">
                    Assinatura / Carimbo do Fornecedor
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: DIGITAR PREÇOS RESPONDIDOS DO FORNECEDOR (EM LOTE)
         ========================================================================= */}
      {fornecedorParaDigitarPrecos && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-scale-up">
            <div className="p-5 bg-emerald-600 text-white flex items-center justify-between">
              <div>
                <h3 className="font-black text-base">
                  Digitar Preços Recebidos: {fornecedorParaDigitarPrecos.fornecedorNome}
                </h3>
                <p className="text-xs text-emerald-100">
                  Preencha os valores unitários enviados pelo fornecedor via WhatsApp ou proposta.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFornecedorParaDigitarPrecos(null)}
                className="p-1 rounded-lg hover:bg-emerald-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 max-h-[60vh] overflow-y-auto">
              {fornecedorParaDigitarPrecos.itens.map((item) => (
                <div key={item.insumoGenericoId} className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <span className="font-mono text-[10px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                      {item.insumoCodigo}
                    </span>
                    <h5 className="font-bold text-slate-900 text-xs mt-0.5">{item.insumoNome}</h5>
                    <span className="text-[11px] text-slate-500">
                      Qtd Obra: {item.quantidade} {item.unidade}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600">Preço R$:</span>
                    <input
                      type="number"
                      step="0.01"
                      defaultValue={item.precoInformado ?? ''}
                      placeholder="0,00"
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        if (!isNaN(val)) {
                          handleAtualizarPrecoInsumoFornecedor(
                            item.insumoGenericoId,
                            item.fornecedorCotacaoId,
                            val
                          );
                        }
                      }}
                      className="w-28 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setFornecedorParaDigitarPrecos(null);
                  exibirToast('Preços atualizados com sucesso!');
                }}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
              >
                Salvar Preços
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
