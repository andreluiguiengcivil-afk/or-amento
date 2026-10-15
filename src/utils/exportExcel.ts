import * as XLSX from 'xlsx';
import { ProjetoOrcamento } from '../types/orcamento';
import { calcularTaxaBDI } from './bdiCalculator';
import { calcularCurvaAbcServicos } from './curvaAbcCalculator';

export function exportarOrcamentoParaExcel(projeto: ProjetoOrcamento) {
  const taxaBDI = calcularTaxaBDI(projeto.bdiConfig);
  const fatorBDI = 1 + (taxaBDI / 100);

  // 1. ABA PLANILHA ORÇAMENTÁRIA SINTÉTICA
  const dadosPlanilha: any[] = [
    ['ORÇAMENTO DE OBRAS DE CONSTRUÇÃO CIVIL'],
    ['Obra:', projeto.nome],
    ['Cliente:', projeto.cliente],
    ['Responsável Técnico:', projeto.responsavelTecnico, 'CREA/CAU:', projeto.creaCau],
    ['Local:', projeto.local],
    ['Data-Base:', projeto.dataBase, 'Área Construída:', `${projeto.areaConstruidaM2} m²`],
    ['Taxa de BDI Aplicada:', `${taxaBDI.toFixed(2)}%`],
    [],
    ['Item', 'Código', 'Descrição dos Serviços', 'Unid.', 'Qtd.', 'Custo Unit. (R$)', 'Custo Direto Total (R$)', 'BDI (%)', 'Preço Total c/ BDI (R$)']
  ];

  let totalCustoDiretoGeral = 0;
  let totalPrecoVendaGeral = 0;

  projeto.etapas.forEach(etapa => {
    let subtotalEtapaDireto = 0;
    let subtotalEtapaVenda = 0;

    etapa.itens.forEach(item => {
      const custoTotalItem = item.quantidade * item.custoUnitario;
      const precoVendaItem = custoTotalItem * fatorBDI;
      subtotalEtapaDireto += custoTotalItem;
      subtotalEtapaVenda += precoVendaItem;
    });

    totalCustoDiretoGeral += subtotalEtapaDireto;
    totalPrecoVendaGeral += subtotalEtapaVenda;

    // Linha da Etapa
    dadosPlanilha.push([
      etapa.nome,
      '',
      '',
      '',
      '',
      '',
      Number(subtotalEtapaDireto.toFixed(2)),
      `${taxaBDI.toFixed(2)}%`,
      Number(subtotalEtapaVenda.toFixed(2))
    ]);

    // Linhas dos itens
    etapa.itens.forEach(item => {
      const custoTotalItem = item.quantidade * item.custoUnitario;
      const precoVendaItem = custoTotalItem * fatorBDI;

      dadosPlanilha.push([
        item.itemNumero,
        item.codigo,
        item.descricao,
        item.unidade,
        item.quantidade,
        item.custoUnitario,
        Number(custoTotalItem.toFixed(2)),
        `${taxaBDI.toFixed(2)}%`,
        Number(precoVendaItem.toFixed(2))
      ]);
    });
  });

  // Linha Total Geral
  dadosPlanilha.push([]);
  dadosPlanilha.push([
    'TOTAL GERAL DA OBRA',
    '',
    '',
    '',
    '',
    '',
    Number(totalCustoDiretoGeral.toFixed(2)),
    `${taxaBDI.toFixed(2)}%`,
    Number(totalPrecoVendaGeral.toFixed(2))
  ]);
  dadosPlanilha.push([
    'CUSTO MÉDIO POR M²',
    '',
    '',
    '',
    '',
    '',
    Number((totalCustoDiretoGeral / projeto.areaConstruidaM2).toFixed(2)),
    '',
    Number((totalPrecoVendaGeral / projeto.areaConstruidaM2).toFixed(2))
  ]);

  // 2. ABA BDI DETALHADO
  const dadosBDI = [
    ['COMPOSIÇÃO ANALÍTICA DA TAXA DE B.D.I. (ACÓRDÃO 2622/2013 - TCU)'],
    ['Fórmula:', 'BDI = { [ (1 + AC + S + R + G) * (1 + DF) * (1 + L) ] / (1 - T) } - 1'],
    [],
    ['Item', 'Componente', 'Taxa Adotada (%)'],
    ['1', 'Administração Central (AC)', projeto.bdiConfig.ac],
    ['2', 'Seguros e Garantias (S+G)', projeto.bdiConfig.sg],
    ['3', 'Riscos e Imprevistos (R)', projeto.bdiConfig.r],
    ['4', 'Despesas Financeiras (DF)', projeto.bdiConfig.df],
    ['5', 'Lucro Operacional Líquido (L)', projeto.bdiConfig.l],
    [],
    ['TRIBUTOS INCIDENTES:', '', ''],
    ['6.1', 'PIS', projeto.bdiConfig.pis],
    ['6.2', 'COFINS', projeto.bdiConfig.cofins],
    ['6.3', 'ISS (Municipal)', projeto.bdiConfig.iss],
    ['6.4', 'CPRB (Desoneração)', projeto.bdiConfig.desonerado ? projeto.bdiConfig.cprb : 0.0],
    ['', 'Total dos Tributos (T)', (projeto.bdiConfig.pis + projeto.bdiConfig.cofins + projeto.bdiConfig.iss + (projeto.bdiConfig.desonerado ? projeto.bdiConfig.cprb : 0))],
    [],
    ['TAXA FINAL DE BDI CALCULADA:', `${taxaBDI.toFixed(2)}%`]
  ];

  // 3. ABA CURVA ABC
  const curvaAbc = calcularCurvaAbcServicos(projeto.etapas);
  const dadosABC = [
    ['CURVA ABC DE SERVIÇOS (CLASSIFICAÇÃO PARETO 80/15/5)'],
    ['Total Orçado (Custo Direto):', totalCustoDiretoGeral],
    [],
    ['Item', 'Código', 'Descrição do Serviço', 'Unid.', 'Qtd.', 'Custo Unit. (R$)', 'Custo Total (R$)', '% do Total', '% Acumulado', 'Classe ABC']
  ];

  curvaAbc.itens.forEach(it => {
    dadosABC.push([
      it.id,
      it.codigo,
      it.descricao,
      it.unidade,
      it.quantidade,
      it.custoUnitario,
      it.custoTotal,
      Number(it.percentual.toFixed(2)),
      Number(it.percentualAcumulado.toFixed(2)),
      it.classe
    ]);
  });

  // Criar Workbook e Worksheets
  const wb = XLSX.utils.book_new();

  const wsPlanilha = XLSX.utils.aoa_to_sheet(dadosPlanilha);
  const wsBDI = XLSX.utils.aoa_to_sheet(dadosBDI);
  const wsABC = XLSX.utils.aoa_to_sheet(dadosABC);

  XLSX.utils.book_append_sheet(wb, wsPlanilha, 'Planilha_Orcamentaria');
  XLSX.utils.book_append_sheet(wb, wsBDI, 'Composicao_BDI');
  XLSX.utils.book_append_sheet(wb, wsABC, 'Curva_ABC');

  // Download
  XLSX.writeFile(wb, `Orcamento_${projeto.nome.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`);
}
