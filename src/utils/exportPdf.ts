import { jsPDF } from 'jspdf';
import { ProjetoOrcamento } from '../types/orcamento';
import { calcularTaxaBDI, formatarMoeda } from './bdiCalculator';

export function exportarOrcamentoParaPdf(projeto: ProjetoOrcamento) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const taxaBDI = calcularTaxaBDI(projeto.bdiConfig);
  const fatorBDI = 1 + (taxaBDI / 100);

  let totalDireto = 0;
  let totalComBdi = 0;

  projeto.etapas.forEach(e => {
    e.itens.forEach(i => {
      const custo = i.quantidade * i.custoUnitario;
      totalDireto += custo;
      totalComBdi += custo * fatorBDI;
    });
  });

  // Cabeçalho institucional
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 36, 'F');

  doc.setTextColor(248, 250, 252);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('ORÇAENG - RELATÓRIO EXECUTIVO DE ORÇAMENTO', 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`Obra: ${projeto.nome}`, 14, 22);
  doc.text(`Responsável Técnico: ${projeto.responsavelTecnico} | ${projeto.creaCau}`, 14, 28);
  doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')} | Base: ${projeto.dataBase}`, 14, 33);

  // Cards de Resumo
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  
  // Card 1: Total Direto
  doc.roundedRect(14, 42, 58, 22, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('CUSTO DIRETO TOTAL', 18, 48);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(formatarMoeda(totalDireto), 18, 57);

  // Card 2: BDI
  doc.roundedRect(76, 42, 58, 22, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('BDI APLICADO (TCU)', 80, 48);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(217, 119, 6);
  doc.text(`${taxaBDI.toFixed(2)}%`, 80, 57);

  // Card 3: Preço de Venda
  doc.roundedRect(138, 42, 58, 22, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('PREÇO GLOBAL DA OBRA', 142, 48);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text(formatarMoeda(totalComBdi), 142, 57);

  // Informações adicionais
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Área Construída: ${projeto.areaConstruidaM2} m² | Custo por m²: ${formatarMoeda(totalComBdi / projeto.areaConstruidaM2)}/m²`, 14, 71);

  // Tabela de Etapas
  doc.setLineWidth(0.2);
  doc.setDrawColor(203, 213, 225);
  doc.line(14, 74, 196, 74);

  let y = 82;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('RESUMO POR ETAPAS CONSTRUTIVAS', 14, y);
  y += 6;

  // Header da tabela
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, 182, 7, 'F');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);
  doc.text('Etapa', 16, y + 5);
  doc.text('Custo Direto (R$)', 105, y + 5);
  doc.text('Preço com BDI (R$)', 140, y + 5);
  doc.text('Peso (%)', 180, y + 5);
  y += 7;

  projeto.etapas.forEach((etapa) => {
    let subtotalDireto = 0;
    etapa.itens.forEach(i => subtotalDireto += (i.quantidade * i.custoUnitario));
    const subtotalVenda = subtotalDireto * fatorBDI;
    const peso = totalComBdi > 0 ? (subtotalVenda / totalComBdi) * 100 : 0;

    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(30, 41, 59);
    doc.text(etapa.nome.substring(0, 48), 16, y + 5);
    doc.text(formatarMoeda(subtotalDireto), 105, y + 5);
    doc.text(formatarMoeda(subtotalVenda), 140, y + 5);
    doc.text(`${peso.toFixed(1)}%`, 180, y + 5);

    doc.setDrawColor(241, 245, 249);
    doc.line(14, y + 7, 196, y + 7);
    y += 7;
  });

  // Linha final
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('TOTAL GERAL ORÇADO:', 16, y + 4);
  doc.text(formatarMoeda(totalDireto), 105, y + 4);
  doc.text(formatarMoeda(totalComBdi), 140, y + 4);
  doc.text('100.0%', 180, y + 4);

  // Rodapé técnico
  const rodapeY = 285;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('OrçaEng Pro - Relatório gerado em conformidade com o Acórdão 2622/2013-TCU e metodologia SINAPI.', 14, rodapeY);

  doc.save(`Relatorio_Orcamento_${projeto.nome.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}
