import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  MessageCircle, 
  Plus, 
  Trash2, 
  Check, 
  Copy, 
  ExternalLink, 
  DollarSign, 
  TrendingDown, 
  Award, 
  Phone, 
  Building2, 
  Package, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { CotacaoInsumo, FornecedorCotacao, InsumoProprio, StatusFornecedorCotacao } from '../types/orcamento';
import { formatarMoeda } from '../utils/bdiCalculator';

interface CotacaoInsumoModalProps {
  insumoInicial?: InsumoProprio | null;
  insumosCadastrados: InsumoProprio[];
  onFechar: () => void;
  onSalvarInsumoCotado: (novoInsumo: InsumoProprio) => void;
}

export const CotacaoInsumoModal: React.FC<CotacaoInsumoModalProps> = ({
  insumoInicial,
  insumosCadastrados,
  onFechar,
  onSalvarInsumoCotado
}) => {
  // Dados do Insumo a ser cotado
  const [nomeInsumo, setNomeInsumo] = useState(insumoInicial ? insumoInicial.nome : '');
  const [codigoInsumo, setCodigoInsumo] = useState(insumoInicial ? insumoInicial.codigo : '');
  const [unidade, setUnidade] = useState(insumoInicial ? insumoInicial.unidade : 'm²');
  const [quantidade, setQuantidade] = useState('100');
  const [especificacao, setEspecificacao] = useState(
    insumoInicial ? `Especificação técnica para ${insumoInicial.nome}. Entrega no canteiro da obra.` : 'Entrega no canteiro da obra. Pagamento faturado ou à vista.'
  );

  // Lista de fornecedores para perguntar o valor
  const [fornecedores, setFornecedores] = useState<FornecedorCotacao[]>(() => {
    if (insumoInicial && insumoInicial.whatsappFornecedor) {
      return [
        {
          id: `fc-${Date.now()}-1`,
          nomeFornecedor: insumoInicial.fornecedor,
          contatoVendedor: 'Vendedor Responsável',
          whatsapp: insumoInicial.whatsappFornecedor,
          status: 'PENDENTE'
        }
      ];
    }
    return [
      {
        id: `fc-${Date.now()}-1`,
        nomeFornecedor: 'Votorantim Cimentos S/A',
        contatoVendedor: 'Equipe Comercial',
        whatsapp: '5511998765432',
        status: 'PENDENTE'
      },
      {
        id: `fc-${Date.now()}-2`,
        nomeFornecedor: 'Gerdau Aços Brasil',
        contatoVendedor: 'Vendas Diretas',
        whatsapp: '5511987654321',
        status: 'PENDENTE'
      }
    ];
  });

  // Novo fornecedor a ser adicionado manualmente
  const [novoNomeForn, setNovoNomeForn] = useState('');
  const [novoContato, setNovoContato] = useState('');
  const [novoZap, setNovoZap] = useState('');

  // Notificação copiado
  const [copiadoId, setCopiadoId] = useState<string | null>(null);
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  // Gerador de mensagem formatada para WhatsApp conforme regras solicitadas:
  // "A mensagem deve ser:
  // Olá, tudo bem? Gostaria de pedir a cotação dos seguintes insumos:
  // E aí seria os insumos sem o código, mas com o seu nome. A unidade. O Preço de avista e a prazo, sem prazo de entrega.
  // Além disso, quando for fazer uma cotação, não é para aparecer o preço já cadastrado"
  const gerarMensagemWhatsApp = (fornecedor: FornecedorCotacao) => {
    return (
      `Olá, tudo bem? Gostaria de pedir a cotação dos seguintes insumos:\n\n` +
      `1) ${nomeInsumo || 'Material/Serviço'}\n` +
      `   - Unidade: ${unidade}\n` +
      `   - Preço à vista:\n` +
      `   - Preço a prazo:\n\n` +
      `Ficamos no aguardo. Muito obrigado!`
    );
  };

  const abrirConversaWhatsApp = (fornecedor: FornecedorCotacao) => {
    const zapLimpo = fornecedor.whatsapp.replace(/\D/g, '');
    if (!zapLimpo) {
      alert('Por favor, informe o WhatsApp com DDD deste fornecedor.');
      return;
    }

    const numeroCompleto = zapLimpo.length <= 11 ? `55${zapLimpo}` : zapLimpo;
    const msg = encodeURIComponent(gerarMensagemWhatsApp(fornecedor));
    const url = `https://wa.me/${numeroCompleto}?text=${msg}`;

    // Atualiza status para ENVIADO
    setFornecedores(prev => prev.map(f => {
      if (f.id === fornecedor.id) {
        return {
          ...f,
          status: f.status === 'RESPONDIDO' ? 'RESPONDIDO' : 'ENVIADO',
          dataEnvio: new Date().toLocaleDateString('pt-BR')
        };
      }
      return f;
    }));

    window.open(url, '_blank');
  };

  const copiarMensagem = (fornecedor: FornecedorCotacao) => {
    const texto = gerarMensagemWhatsApp(fornecedor);
    navigator.clipboard.writeText(texto);
    setCopiadoId(fornecedor.id);
    setTimeout(() => setCopiadoId(null), 2500);
  };

  const handleAdicionarFornecedor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoNomeForn.trim() || !novoZap.trim()) {
      alert('Informe o Nome da Empresa/Fornecedor e o WhatsApp de contato.');
      return;
    }

    const novo: FornecedorCotacao = {
      id: `fc-${Date.now()}`,
      nomeFornecedor: novoNomeForn.trim(),
      contatoVendedor: novoContato.trim() || 'Vendedor Comercial',
      whatsapp: novoZap.trim(),
      status: 'PENDENTE'
    };

    setFornecedores(prev => [...prev, novo]);
    setNovoNomeForn('');
    setNovoContato('');
    setNovoZap('');
  };

  const importarFornecedorCadastrado = (fornNome: string) => {
    const insumosDoForn = insumosCadastrados.filter(i => i.fornecedor === fornNome);
    if (insumosDoForn.length === 0) return;
    const fRef = insumosDoForn[0];

    // Se já estiver na lista, não duplica
    if (fornecedores.some(f => f.nomeFornecedor.toLowerCase() === fornNome.toLowerCase())) {
      alert(`O fornecedor ${fornNome} já está na lista de cotação.`);
      return;
    }

    const novo: FornecedorCotacao = {
      id: `fc-${Date.now()}`,
      nomeFornecedor: fRef.fornecedor,
      contatoVendedor: 'Contato Cadastrado',
      whatsapp: fRef.whatsappFornecedor || '',
      status: 'PENDENTE'
    };

    setFornecedores(prev => [...prev, novo]);
  };

  const removerFornecedor = (id: string) => {
    setFornecedores(prev => prev.filter(f => f.id !== id));
  };

  const calcularDesconto = (avista?: number, prazo?: number) => {
    if (prazo && avista && prazo > 0 && avista > 0 && avista < prazo) {
      return ((prazo - avista) / prazo) * 100;
    }
    return 0;
  };

  const atualizarPrecoAvista = (id: string, precoStr: string) => {
    const valor = parseFloat(precoStr.replace(',', '.')) || 0;
    setFornecedores(prev => prev.map(f => {
      if (f.id === id) {
        const prazo = f.precoPrazo || 0;
        const condicao = f.tipoPagamentoSelecionado || 'PRAZO';
        const desconto = calcularDesconto(valor, prazo);
        const precoConsiderado = condicao === 'AVISTA' && valor > 0 ? valor : (prazo > 0 ? prazo : valor);
        return {
          ...f,
          precoAvista: valor > 0 ? valor : undefined,
          descontoAvistaPercentual: parseFloat(desconto.toFixed(2)),
          tipoPagamentoSelecionado: condicao,
          precoInformado: precoConsiderado > 0 ? precoConsiderado : undefined,
          status: precoConsiderado > 0 ? 'RESPONDIDO' : f.status,
          dataResposta: precoConsiderado > 0 ? new Date().toLocaleDateString('pt-BR') : f.dataResposta
        };
      }
      return f;
    }));
  };

  const atualizarPrecoPrazo = (id: string, precoStr: string) => {
    const valor = parseFloat(precoStr.replace(',', '.')) || 0;
    setFornecedores(prev => prev.map(f => {
      if (f.id === id) {
        const avista = f.precoAvista || 0;
        const condicao = f.tipoPagamentoSelecionado || 'PRAZO';
        const desconto = calcularDesconto(avista, valor);
        const precoConsiderado = condicao === 'AVISTA' && avista > 0 ? avista : valor;
        return {
          ...f,
          precoPrazo: valor > 0 ? valor : undefined,
          descontoAvistaPercentual: parseFloat(desconto.toFixed(2)),
          tipoPagamentoSelecionado: condicao,
          precoInformado: precoConsiderado > 0 ? precoConsiderado : undefined,
          status: precoConsiderado > 0 ? 'RESPONDIDO' : f.status,
          dataResposta: precoConsiderado > 0 ? new Date().toLocaleDateString('pt-BR') : f.dataResposta
        };
      }
      return f;
    }));
  };

  const alternarCondicaoPagamento = (id: string, cond: 'AVISTA' | 'PRAZO') => {
    setFornecedores(prev => prev.map(f => {
      if (f.id === id) {
        const avista = f.precoAvista || 0;
        const prazo = f.precoPrazo || 0;
        let precoConsiderado = prazo > 0 ? prazo : avista;
        if (cond === 'AVISTA' && avista > 0) {
          precoConsiderado = avista;
        } else if (cond === 'PRAZO' && prazo > 0) {
          precoConsiderado = prazo;
        }
        return {
          ...f,
          tipoPagamentoSelecionado: cond,
          precoInformado: precoConsiderado > 0 ? precoConsiderado : undefined,
          condicoesPagamento: cond === 'AVISTA' ? 'À vista' : 'A prazo'
        };
      }
      return f;
    }));
  };

  const atualizarPrazoFornecedor = (id: string, diasStr: string) => {
    const dias = parseInt(diasStr, 10) || 0;
    setFornecedores(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          prazoEntregaDias: dias > 0 ? dias : undefined
        };
      }
      return f;
    }));
  };

  const atualizarCondicoes = (id: string, cond: string) => {
    setFornecedores(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          condicoesPagamento: cond
        };
      }
      return f;
    }));
  };

  // Cálculo do Mapa de Cotação (Menor Preço, Médio e Vencedor)
  const fornecedoresComPreco = fornecedores.filter(f => f.precoInformado !== undefined && f.precoInformado > 0);
  
  let menorPreco = Infinity;
  let maiorPreco = 0;
  let fornecedorVencedor: FornecedorCotacao | null = null;
  let somaPrecos = 0;

  for (const f of fornecedoresComPreco) {
    const p = f.precoInformado ?? 0;
    somaPrecos += p;
    if (p < menorPreco) {
      menorPreco = p;
      fornecedorVencedor = f;
    }
    if (p > maiorPreco) {
      maiorPreco = p;
    }
  }

  const precoMedio = fornecedoresComPreco.length > 0 ? somaPrecos / fornecedoresComPreco.length : 0;
  const qtdNum = parseFloat(quantidade) || 1;
  const economiaTotal = maiorPreco > menorPreco && menorPreco !== Infinity 
    ? (maiorPreco - menorPreco) * qtdNum 
    : 0;
  const economiaPercentual = maiorPreco > 0 && menorPreco !== Infinity
    ? ((maiorPreco - menorPreco) / maiorPreco) * 100
    : 0;

  // Adoção do Preço Vencedor
  const handleAdotarVencedor = (fornecedor: FornecedorCotacao) => {
    if (!fornecedor.precoInformado || fornecedor.precoInformado <= 0) {
      alert('Este fornecedor ainda não tem preço informado.');
      return;
    }

    const novoInsumo: InsumoProprio = {
      id: `ins-cotado-${Date.now()}`,
      fornecedor: fornecedor.nomeFornecedor,
      base: fornecedor.nomeFornecedor,
      whatsappFornecedor: fornecedor.whatsapp,
      codigo: codigoInsumo.trim().toUpperCase() || 'COT-01',
      nome: nomeInsumo.trim() || 'Insumo Cotado',
      descricao: nomeInsumo.trim() || 'Insumo Cotado',
      unidade: unidade.trim() || 'un',
      precoUnitario: fornecedor.precoInformado,
      precoAvista: fornecedor.precoAvista,
      precoPrazo: fornecedor.precoPrazo,
      descontoAvistaPercentual: fornecedor.descontoAvistaPercentual,
      tipoPagamentoSelecionado: fornecedor.tipoPagamentoSelecionado || 'PRAZO',
      prazoEntregaDias: fornecedor.prazoEntregaDias || 3,
      condicoesPagamento: fornecedor.condicoesPagamento || (fornecedor.tipoPagamentoSelecionado === 'AVISTA' ? 'À vista' : 'A prazo'),
      tipo: 'MATERIAL',
      dataAtualizacao: new Date().toISOString().split('T')[0]
    };

    onSalvarInsumoCotado(novoInsumo);
    setMensagemSucesso(`Insumo cadastrado e salvo com sucesso na pasta de "${fornecedor.nomeFornecedor}" por ${formatarMoeda(fornecedor.precoInformado)}/${unidade}!`);
    setTimeout(() => {
      onFechar();
    }, 2000);
  };

  // Fornecedores disponíveis para importar rápido
  const fornecedoresExistentes = Array.from(new Set(insumosCadastrados.map(i => i.fornecedor)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-slate-800">
      <div className="bg-white border-2 border-amber-400 rounded-3xl w-full max-w-4xl max-h-[92vh] shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-slate-950 text-amber-400 rounded-xl font-black shadow-xs">
              <MessageCircle className="w-5 h-5 stroke-[2.5]" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-slate-950">
                  Insumo para Cotação com Fornecedores
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-950 text-white font-mono">
                  WhatsApp RFQ
                </span>
              </div>
              <p className="text-xs text-slate-900 font-medium mt-0.5">
                Digite contatos e nomes de fornecedores para perguntar o valor e comparar as propostas recebidas.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onFechar}
            className="p-1.5 rounded-xl bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 transition cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Notificação de Sucesso */}
        {mensagemSucesso && (
          <div className="bg-emerald-50 border-b border-emerald-300 px-6 py-3 flex items-center gap-2 text-emerald-900 text-xs font-bold animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 stroke-[2.5]" />
            <span>{mensagemSucesso}</span>
          </div>
        )}

        {/* Corpo Scrollável */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs">
          
          {/* SEÇÃO 1: DADOS DO INSUMO A COTAR */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-2">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-600" />
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider">
                  1. O que você vai cotar (Especificação do Insumo)
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Estes dados serão montados automaticamente na mensagem do WhatsApp
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Nome do Insumo */}
              <div className="sm:col-span-5">
                <label className="font-bold text-slate-700 block mb-1">
                  Nome do Insumo / Material / Serviço <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Cimento Portland CP II-32 (Saco 50kg), Bloco Cerâmico 9x19x19..."
                  value={nomeInsumo}
                  onChange={e => setNomeInsumo(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Código de Referência */}
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Código Ref.</label>
                <input
                  type="text"
                  placeholder="Ex: CIM-01"
                  value={codigoInsumo}
                  onChange={e => setCodigoInsumo(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Unidade */}
              <div className="sm:col-span-2">
                <label className="font-bold text-slate-700 block mb-1">Unidade</label>
                <input
                  type="text"
                  placeholder="Ex: m², kg, sc, un, m³"
                  value={unidade}
                  onChange={e => setUnidade(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Quantidade Estimada */}
              <div className="sm:col-span-3">
                <label className="font-bold text-slate-700 block mb-1">Qtd. Estimada para a Obra</label>
                <input
                  type="number"
                  placeholder="Ex: 250"
                  value={quantidade}
                  onChange={e => setQuantidade(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-teal-800 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Observação / Requisitos para o Fornecedor */}
              <div className="sm:col-span-12">
                <label className="font-bold text-slate-700 block mb-1">
                  Condições de Entrega & Pagamento para perguntar
                </label>
                <input
                  type="text"
                  placeholder="Ex: Entrega no canteiro da obra. Pagamento à vista com desconto ou 28 dias faturado."
                  value={especificacao}
                  onChange={e => setEspecificacao(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* SEÇÃO 2: CADASTRO RÁPIDO DE FORNECEDORES PARA PERGUNTAR O VALOR */}
          <div className="bg-white border-2 border-amber-300/80 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-100 pb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-600" />
                <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider">
                  2. Digitar Fornecedores e Contatos de WhatsApp para Perguntar o Valor
                </h4>
              </div>
              <span className="text-[11px] text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded-full font-mono">
                {fornecedores.length} {fornecedores.length === 1 ? 'fornecedor na lista' : 'fornecedores na lista'}
              </span>
            </div>

            {/* Formulário Inline para adicionar fornecedor */}
            <form onSubmit={handleAdicionarFornecedor} className="bg-amber-50/50 border border-amber-200 rounded-xl p-3.5 space-y-3">
              <span className="text-[11px] font-bold text-slate-800 block">
                + Adicionar Novo Fornecedor para Esta Cotação:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                <div className="sm:col-span-4">
                  <input
                    type="text"
                    required
                    placeholder="Nome da Empresa / Fornecedor *"
                    value={novoNomeForn}
                    onChange={e => setNovoNomeForn(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>
                <div className="sm:col-span-3">
                  <input
                    type="text"
                    placeholder="Nome do Vendedor / Contato"
                    value={novoContato}
                    onChange={e => setNovoContato(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="sm:col-span-3">
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="WhatsApp (ex: 11998765432) *"
                      value={novoZap}
                      onChange={e => setNovoZap(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-2 px-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black rounded-xl text-xs transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Adicionar</span>
                  </button>
                </div>
              </div>

              {/* Atalhos para importar fornecedores das pastas existentes */}
              {fornecedoresExistentes.length > 0 && (
                <div className="pt-2 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-500">Ou importar das pastas cadastradas:</span>
                  {fornecedoresExistentes.map(fn => (
                    <button
                      key={fn}
                      type="button"
                      onClick={() => importarFornecedorCadastrado(fn)}
                      className="px-2 py-0.5 rounded-lg bg-white hover:bg-amber-100 text-slate-800 border border-slate-300 hover:border-amber-400 font-semibold transition cursor-pointer"
                    >
                      + {fn}
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* TABELA DE FORNECEDORES, DISPARO WHATSAPP E REGISTRO DO VALOR INFORMADO */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-xs bg-white">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-[10px] uppercase font-mono font-semibold text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 w-44">Fornecedor / Contato</th>
                    <th className="py-3 px-2 w-32 text-center">Perguntar WhatsApp</th>
                    <th className="py-3 px-2 w-28 text-right bg-emerald-50/50">Preço À Vista</th>
                    <th className="py-3 px-2 w-28 text-right bg-blue-50/50">Preço A Prazo</th>
                    <th className="py-3 px-2 w-24 text-center">Desconto</th>
                    <th className="py-3 px-2 w-36 text-center">Condição</th>
                    <th className="py-3 px-2 w-28 text-right font-black bg-amber-50/60">Considerado</th>
                    <th className="py-3 px-2 text-center w-12">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {fornecedores.map((forn) => {
                    const isMenor = fornecedorVencedor && fornecedorVencedor.id === forn.id && fornecedoresComPreco.length > 1;
                    const precoAvista = forn.precoAvista || 0;
                    const precoPrazo = forn.precoPrazo || (forn.precoInformado && !forn.precoAvista ? forn.precoInformado : 0);
                    const desconto = forn.descontoAvistaPercentual !== undefined ? forn.descontoAvistaPercentual : calcularDesconto(precoAvista, precoPrazo);
                    const condicao = forn.tipoPagamentoSelecionado || 'PRAZO';
                    const considerado = condicao === 'AVISTA' && precoAvista > 0 ? precoAvista : (precoPrazo > 0 ? precoPrazo : (forn.precoInformado || 0));

                    return (
                      <tr 
                        key={forn.id} 
                        className={`transition ${isMenor ? 'bg-emerald-50/50 font-medium' : 'hover:bg-slate-50'}`}
                      >
                        
                        {/* Nome do Fornecedor e Contato */}
                        <td className="py-3 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                              {forn.nomeFornecedor}
                              {isMenor && (
                                <span className="p-0.5 bg-emerald-600 text-white rounded text-[9px] font-black" title="Menor Preço Cotado!">
                                  <Award className="w-3 h-3" />
                                </span>
                              )}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {forn.contatoVendedor || 'Vendedor'} • <span className="font-mono">{forn.whatsapp}</span>
                            </span>
                          </div>
                        </td>

                        {/* Botões de Disparo WhatsApp */}
                        <td className="py-3 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => abrirConversaWhatsApp(forn)}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] shadow-xs transition flex items-center gap-1 cursor-pointer"
                              title="Abrir WhatsApp com mensagem técnica"
                            >
                              <MessageCircle className="w-3 h-3 stroke-[2.5]" />
                              <span>Cotar</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => copiarMensagem(forn)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded transition cursor-pointer"
                              title="Copiar mensagem"
                            >
                              {copiadoId === forn.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Preço À Vista (R$) */}
                        <td className="py-3 px-2 text-right bg-emerald-50/30">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            value={forn.precoAvista !== undefined ? forn.precoAvista : ''}
                            onChange={e => atualizarPrecoAvista(forn.id, e.target.value)}
                            className="w-20 text-right font-mono font-bold text-xs py-1 px-1.5 rounded-lg border border-emerald-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                          />
                        </td>

                        {/* Preço A Prazo (R$) */}
                        <td className="py-3 px-2 text-right bg-blue-50/30">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="0,00"
                            value={forn.precoPrazo !== undefined ? forn.precoPrazo : (forn.precoInformado && !forn.precoAvista ? forn.precoInformado : '')}
                            onChange={e => atualizarPrecoPrazo(forn.id, e.target.value)}
                            className="w-20 text-right font-mono font-bold text-xs py-1 px-1.5 rounded-lg border border-blue-300 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </td>

                        {/* % Desconto no À Vista */}
                        <td className="py-3 px-2 text-center whitespace-nowrap">
                          {desconto > 0 ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono font-bold text-[10px] border border-emerald-300">
                              {desconto.toFixed(1)}% OFF
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px]">-</span>
                          )}
                        </td>

                        {/* Condição: À Vista ou A Prazo (Padrão: A Prazo se nenhuma for clicada) */}
                        <td className="py-3 px-2 text-center whitespace-nowrap">
                          <div className="inline-flex rounded-lg border border-slate-300 p-0.5 bg-slate-100">
                            <button
                              type="button"
                              onClick={() => alternarCondicaoPagamento(forn.id, 'AVISTA')}
                              className={`px-2 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                                condicao === 'AVISTA' 
                                  ? 'bg-emerald-600 text-white shadow-2xs font-black' 
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              À Vista
                            </button>
                            <button
                              type="button"
                              onClick={() => alternarCondicaoPagamento(forn.id, 'PRAZO')}
                              className={`px-2 py-0.5 text-[10px] font-bold rounded transition cursor-pointer ${
                                condicao === 'PRAZO' 
                                  ? 'bg-blue-600 text-white shadow-2xs font-black' 
                                  : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              A Prazo
                            </button>
                          </div>
                        </td>

                        {/* Preço Considerado */}
                        <td className="py-3 px-2 text-right bg-amber-50/50 whitespace-nowrap">
                          <span className="font-mono font-black text-slate-900 text-xs">
                            {considerado > 0 ? formatarMoeda(considerado) : '-'}
                          </span>
                        </td>

                        {/* Excluir da Lista */}
                        <td className="py-3 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => removerFornecedor(forn.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition cursor-pointer"
                            title="Remover fornecedor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>

                      </tr>
                    );
                  })}

                  {fornecedores.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        Nenhum fornecedor adicionado à cotação. Use o formulário acima para adicionar contatos.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* SEÇÃO 3: MAPA COMPARATIVO DE PREÇOS (PARETO DA COTAÇÃO) */}
          {fornecedoresComPreco.length > 0 && (
            <div className="bg-gradient-to-br from-emerald-50/80 via-teal-50/50 to-amber-50/60 border-2 border-emerald-400/80 rounded-2xl p-5 space-y-4 shadow-sm animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200 pb-2">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-700 stroke-[2.5]" />
                  <h4 className="font-black text-slate-900 uppercase text-xs tracking-wider">
                    3. Comparativo de Cotações Recebidas ({fornecedoresComPreco.length} respostas)
                  </h4>
                </div>
                <span className="text-xs font-black text-emerald-800 font-mono">
                  Economia potencial: {formatarMoeda(economiaTotal)} ({economiaPercentual.toFixed(1)}%)
                </span>
              </div>

              {/* Grid com Destaque do Menor Preço e Médio */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Cartão Menor Preço (Vencedor) */}
                <div className="bg-white border-2 border-emerald-500 rounded-xl p-3.5 shadow-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 font-mono">
                      ⭐ MENOR PREÇO (VENCEDOR)
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-mono">
                      1º Lugar
                    </span>
                  </div>
                  <div className="text-xl font-black text-emerald-800 font-mono">
                    {formatarMoeda(menorPreco)} <span className="text-xs font-normal text-slate-500">/{unidade}</span>
                  </div>
                  <div className="text-xs font-bold text-slate-800 truncate">
                    {fornecedorVencedor?.nomeFornecedor}
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    Custo total estimado: <strong>{formatarMoeda(menorPreco * qtdNum)}</strong>
                  </span>
                </div>

                {/* Preço Médio */}
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block">
                    PREÇO MÉDIO COTADO
                  </span>
                  <div className="text-xl font-black text-slate-800 font-mono">
                    {formatarMoeda(precoMedio)} <span className="text-xs font-normal text-slate-500">/{unidade}</span>
                  </div>
                  <span className="text-xs text-slate-600 block">
                    Média de {fornecedoresComPreco.length} fornecedores
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Total médio: <strong>{formatarMoeda(precoMedio * qtdNum)}</strong>
                  </span>
                </div>

                {/* Maior Preço */}
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 font-mono block">
                    MAIOR PREÇO ENCONTRADO
                  </span>
                  <div className="text-xl font-black text-rose-700 font-mono">
                    {formatarMoeda(maiorPreco)} <span className="text-xs font-normal text-slate-500">/{unidade}</span>
                  </div>
                  <span className="text-xs text-rose-600 font-semibold block">
                    {maiorPreco > menorPreco ? `+${economiaPercentual.toFixed(1)}% acima do menor` : 'Cotação única'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Total maior: <strong>{formatarMoeda(maiorPreco * qtdNum)}</strong>
                  </span>
                </div>
              </div>

              {/* Botão de Decisão: Adotar Fornecedor Vencedor */}
              {fornecedorVencedor && (
                <div className="bg-white border border-emerald-300 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div>
                    <h5 className="font-black text-slate-900 text-xs">
                      Deseja adotar a cotação de "{fornecedorVencedor.nomeFornecedor}" ({formatarMoeda(fornecedorVencedor.precoInformado!)}/{unidade})?
                    </h5>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Ao clicar abaixo, este insumo será salvo automaticamente na pasta deste fornecedor com o código e preço acordados.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAdotarVencedor(fornecedorVencedor!)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Salvar Insumo com Preço Vencedor</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer com Fechar e Instrução */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>As mensagens são enviadas diretamente via WhatsApp Web ou aplicativo oficial.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onFechar}
              className="px-4 py-2 rounded-xl text-slate-700 hover:bg-slate-200/80 font-bold text-xs cursor-pointer"
            >
              Fechar Cotação
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
