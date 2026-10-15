import { CurvaABCItem, EtapaOrcamento, ItemOrcamento } from '../types/orcamento';

/**
 * Calcula a Curva ABC de Serviços (Itens do Orçamento)
 */
export function calcularCurvaAbcServicos(etapas: EtapaOrcamento[]): {
  itens: CurvaABCItem[];
  totalGeral: number;
  totalClasseA: number;
  totalClasseB: number;
  totalClasseC: number;
  qtdClasseA: number;
  qtdClasseB: number;
  qtdClasseC: number;
} {
  const todosItens: ItemOrcamento[] = [];
  etapas.forEach(etapa => {
    etapa.itens.forEach(item => {
      todosItens.push(item);
    });
  });

  const totalGeral = todosItens.reduce((acc, it) => acc + (it.quantidade * it.custoUnitario), 0);

  // Ordenar decrescente pelo custo total
  const ordenados = [...todosItens].sort((a, b) => {
    const totalA = a.quantidade * a.custoUnitario;
    const totalB = b.quantidade * b.custoUnitario;
    return totalB - totalA;
  });

  let acumuladoValor = 0;
  let acumuladoPercentual = 0;

  let totalClasseA = 0;
  let totalClasseB = 0;
  let totalClasseC = 0;
  let qtdClasseA = 0;
  let qtdClasseB = 0;
  let qtdClasseC = 0;

  const resultado: CurvaABCItem[] = ordenados.map(item => {
    const custoTotal = item.quantidade * item.custoUnitario;
    const percentual = totalGeral > 0 ? (custoTotal / totalGeral) * 100 : 0;
    
    acumuladoValor += custoTotal;
    acumuladoPercentual = totalGeral > 0 ? (acumuladoValor / totalGeral) * 100 : 0;

    // Regra clássica de Pareto 80 / 15 / 5:
    // Classe A: até 80% do valor acumulado
    // Classe B: de 80% até 95% do valor acumulado
    // Classe C: acima de 95%
    let classe: 'A' | 'B' | 'C' = 'C';
    // Se o acumulado anterior era menor que 80%, ou percentual do item faz parte dos primeiros 80%:
    if (acumuladoPercentual <= 80 || (acumuladoPercentual - percentual < 80)) {
      classe = 'A';
      totalClasseA += custoTotal;
      qtdClasseA++;
    } else if (acumuladoPercentual <= 95 || (acumuladoPercentual - percentual < 95)) {
      classe = 'B';
      totalClasseB += custoTotal;
      qtdClasseB++;
    } else {
      classe = 'C';
      totalClasseC += custoTotal;
      qtdClasseC++;
    }

    return {
      id: item.id,
      codigo: item.codigo,
      descricao: item.descricao,
      unidade: item.unidade,
      quantidade: item.quantidade,
      custoUnitario: item.custoUnitario,
      custoTotal,
      percentual,
      percentualAcumulado: Math.min(100, acumuladoPercentual),
      classe,
      tipo: 'SERVICO'
    };
  });

  return {
    itens: resultado,
    totalGeral,
    totalClasseA,
    totalClasseB,
    totalClasseC,
    qtdClasseA,
    qtdClasseB,
    qtdClasseC
  };
}

/**
 * Calcula a Curva ABC de Insumos agregados
 */
export function calcularCurvaAbcInsumos(etapas: EtapaOrcamento[]): {
  insumos: CurvaABCItem[];
  totalGeral: number;
  totalMaoDeObra: number;
  totalMaterial: number;
  totalEquipamento: number;
} {
  const mapaInsumos: Record<string, {
    codigo: string;
    descricao: string;
    unidade: string;
    tipo: 'MATERIAL' | 'MAO_DE_OBRA' | 'EQUIPAMENTO' | 'SERVICO';
    quantidadeTotal: number;
    custoTotal: number;
    precoUnitario: number;
  }> = {};

  etapas.forEach(etapa => {
    etapa.itens.forEach(item => {
      if (item.composicao && item.composicao.insumos && item.composicao.insumos.length > 0) {
        item.composicao.insumos.forEach(insumo => {
          const chave = insumo.codigo || insumo.descricao;
          const qtdConsumida = insumo.coeficiente * item.quantidade;
          const custoConsumido = qtdConsumida * insumo.precoUnitario;

          if (!mapaInsumos[chave]) {
            mapaInsumos[chave] = {
              codigo: insumo.codigo,
              descricao: insumo.descricao,
              unidade: insumo.unidade,
              tipo: insumo.tipo,
              quantidadeTotal: 0,
              custoTotal: 0,
              precoUnitario: insumo.precoUnitario
            };
          }
          mapaInsumos[chave].quantidadeTotal += qtdConsumida;
          mapaInsumos[chave].custoTotal += custoConsumido;
        });
      } else {
        // Se item não tiver composição analítica detalhada, cria insumo sintético equivalente
        const chave = item.codigo || item.descricao;
        if (!mapaInsumos[chave]) {
          mapaInsumos[chave] = {
            codigo: item.codigo,
            descricao: item.descricao,
            unidade: item.unidade,
            tipo: 'MATERIAL',
            quantidadeTotal: 0,
            custoTotal: 0,
            precoUnitario: item.custoUnitario
          };
        }
        mapaInsumos[chave].quantidadeTotal += item.quantidade;
        mapaInsumos[chave].custoTotal += (item.quantidade * item.custoUnitario);
      }
    });
  });

  const lista = Object.values(mapaInsumos);
  const totalGeral = lista.reduce((acc, it) => acc + it.custoTotal, 0);

  let totalMaoDeObra = 0;
  let totalMaterial = 0;
  let totalEquipamento = 0;

  lista.forEach(i => {
    if (i.tipo === 'MAO_DE_OBRA') totalMaoDeObra += i.custoTotal;
    else if (i.tipo === 'EQUIPAMENTO') totalEquipamento += i.custoTotal;
    else totalMaterial += i.custoTotal;
  });

  const ordenados = lista.sort((a, b) => b.custoTotal - a.custoTotal);

  let acumuladoValor = 0;
  const itens: CurvaABCItem[] = ordenados.map((insumo, idx) => {
    const percentual = totalGeral > 0 ? (insumo.custoTotal / totalGeral) * 100 : 0;
    acumuladoValor += insumo.custoTotal;
    const percentualAcumulado = totalGeral > 0 ? (acumuladoValor / totalGeral) * 100 : 0;

    let classe: 'A' | 'B' | 'C' = 'C';
    if (percentualAcumulado <= 80 || (percentualAcumulado - percentual < 80)) {
      classe = 'A';
    } else if (percentualAcumulado <= 95 || (percentualAcumulado - percentual < 95)) {
      classe = 'B';
    } else {
      classe = 'C';
    }

    return {
      id: `insumo-${idx}`,
      codigo: insumo.codigo,
      descricao: insumo.descricao,
      unidade: insumo.unidade,
      quantidade: insumo.quantidadeTotal,
      custoUnitario: insumo.precoUnitario,
      custoTotal: insumo.custoTotal,
      percentual,
      percentualAcumulado: Math.min(100, percentualAcumulado),
      classe,
      tipo: insumo.tipo
    };
  });

  return {
    insumos: itens,
    totalGeral,
    totalMaoDeObra,
    totalMaterial,
    totalEquipamento
  };
}
