import { ComposicaoPreco } from '../types/orcamento';

export const BANCO_SINAPI: ComposicaoPreco[] = [
  // 1. SERVIÇOS PRELIMINARES E CANTEIRO
  {
    codigo: 'SINAPI 98459',
    descricao: 'TAPUME COM CHAPA DE MADEIRA COMPENSADA, E = 6 MM, COM PONTALETES DE MADEIRA, FIXAÇÃO COM PREGOS',
    unidade: 'm²',
    origem: 'SINAPI',
    custoMaterial: 42.80,
    custoMaoDeObra: 22.40,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 65.20,
    insumos: [
      { codigo: '4430', descricao: 'CHAPA COMPENSADO RESINADO 6MM', unidade: 'm²', tipo: 'MATERIAL', coeficiente: 1.10, precoUnitario: 32.50, custoTotal: 35.75 },
      { codigo: '4491', descricao: 'PONTALETE DE PINUS 7,5 X 7,5 CM', unidade: 'm', tipo: 'MATERIAL', coeficiente: 0.65, precoUnitario: 8.80, custoTotal: 5.72 },
      { codigo: '5068', descricao: 'PREGO COM CABECA 18 X 27', unidade: 'kg', tipo: 'MATERIAL', coeficiente: 0.08, precoUnitario: 16.60, custoTotal: 1.33 },
      { codigo: '88262', descricao: 'CARPINTEIRO DE FORMAS COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.45, precoUnitario: 28.50, custoTotal: 12.83 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS COMPLEMENTARES', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.45, precoUnitario: 21.27, custoTotal: 9.57 },
    ]
  },
  {
    codigo: 'SINAPI 98458',
    descricao: 'LOCAÇÃO CONVENCIONAL DE OBRA COM GABARITO DE TABUAS CORRIDAS FIXADAS EM PONTALETES',
    unidade: 'm',
    origem: 'SINAPI',
    custoMaterial: 18.50,
    custoMaoDeObra: 14.80,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 33.30,
    insumos: [
      { codigo: '4491', descricao: 'PONTALETE PINUS 7,5 X 7,5 CM', unidade: 'm', tipo: 'MATERIAL', coeficiente: 0.50, precoUnitario: 8.80, custoTotal: 4.40 },
      { codigo: '4438', descricao: 'TABUA DE PINUS 2,5 X 15 CM', unidade: 'm', tipo: 'MATERIAL', coeficiente: 1.15, precoUnitario: 11.20, custoTotal: 12.88 },
      { codigo: '5068', descricao: 'PREGO DE ACO COM CABECA', unidade: 'kg', tipo: 'MATERIAL', coeficiente: 0.07, precoUnitario: 17.40, custoTotal: 1.22 },
      { codigo: '88262', descricao: 'CARPINTEIRO COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.30, precoUnitario: 28.50, custoTotal: 8.55 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.30, precoUnitario: 21.27, custoTotal: 6.38 },
    ]
  },
  {
    codigo: 'SINAPI 98460',
    descricao: 'PLACA DE IDENTIFICACAO DE OBRA EM CHAPA DE ACO GALVANIZADO 2,0 X 1,2 M',
    unidade: 'm²',
    origem: 'SINAPI',
    custoMaterial: 185.00,
    custoMaoDeObra: 45.00,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 230.00,
    insumos: [
      { codigo: '4813', descricao: 'CHAPA GALVANIZADA N 26 COM PINTURA E ADESIVO', unidade: 'm²', tipo: 'MATERIAL', coeficiente: 1.05, precoUnitario: 160.00, custoTotal: 168.00 },
      { codigo: '4491', descricao: 'PONTALETE DE EUCALIPTO TRATADO D=10CM', unidade: 'm', tipo: 'MATERIAL', coeficiente: 1.50, precoUnitario: 11.33, custoTotal: 17.00 },
      { codigo: '88262', descricao: 'CARPINTEIRO COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.90, precoUnitario: 28.50, custoTotal: 25.65 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.90, precoUnitario: 21.27, custoTotal: 19.14 },
    ]
  },

  // 2. MOVIMENTO DE TERRA E FUNDAÇÃO
  {
    codigo: 'SINAPI 93358',
    descricao: 'ESCAVAÇÃO MANUAL DE VALA COM PROFUNDIDADE ATÉ 1,50 M EM TERRA DE 1ª CATEGORIA',
    unidade: 'm³',
    origem: 'SINAPI',
    custoMaterial: 0.00,
    custoMaoDeObra: 68.06,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 68.06,
    insumos: [
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS COMPLEMENTARES', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 3.20, precoUnitario: 21.27, custoTotal: 68.06 },
    ]
  },
  {
    codigo: 'SINAPI 93382',
    descricao: 'REATERRO MANUAL APILOADO COM SOQUETE DE VALAS EM CAMADAS DE ATÉ 20 CM',
    unidade: 'm³',
    origem: 'SINAPI',
    custoMaterial: 0.00,
    custoMaoDeObra: 38.29,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 38.29,
    insumos: [
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS COMPLEMENTARES', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 1.80, precoUnitario: 21.27, custoTotal: 38.29 },
    ]
  },
  {
    codigo: 'SINAPI 96523',
    descricao: 'LASTRO DE CONCRETO MAGRO, ESPESSURA 5 CM, PREPARO MECÂNICO COM BETONEIRA',
    unidade: 'm²',
    origem: 'SINAPI',
    custoMaterial: 22.40,
    custoMaoDeObra: 11.20,
    custoEquipamento: 1.80,
    custoUnitarioDireto: 35.40,
    insumos: [
      { codigo: '1379', descricao: 'CIMENTO PORTLAND COMPOSTO CP II-32', unidade: 'kg', tipo: 'MATERIAL', coeficiente: 11.50, precoUnitario: 0.72, custoTotal: 8.28 },
      { codigo: '370', descricao: 'AREIA MEDIA - POSTO JAZIDA/FORNECEDOR', unidade: 'm³', tipo: 'MATERIAL', coeficiente: 0.038, precoUnitario: 110.00, custoTotal: 4.18 },
      { codigo: '4721', descricao: 'PEDRA BRITADA N. 2 (19 A 38 MM)', unidade: 'm³', tipo: 'MATERIAL', coeficiente: 0.052, precoUnitario: 95.00, custoTotal: 4.94 },
      { codigo: '88309', descricao: 'PEDREIRO COM ENCARGOS COMPLEMENTARES', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.20, precoUnitario: 27.80, custoTotal: 5.56 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS COMPLEMENTARES', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.25, precoUnitario: 21.27, custoTotal: 5.32 },
      { codigo: '88830', descricao: 'BETONEIRA CAPACIDADE 400 L - CHP DIURNO', unidade: 'h', tipo: 'EQUIPAMENTO', coeficiente: 0.08, precoUnitario: 14.00, custoTotal: 1.12 },
    ]
  },

  // 3. ESTRUTURA (CONCRETO ARMADO)
  {
    codigo: 'SINAPI 103672',
    descricao: 'CONCRETAGEM DE ELEMENTOS ESTRUTURAIS, FCK 25 MPA, CONCRETO USINADO BOMBEADO',
    unidade: 'm³',
    origem: 'SINAPI',
    custoMaterial: 475.00,
    custoMaoDeObra: 75.50,
    custoEquipamento: 48.00,
    custoUnitarioDireto: 598.50,
    insumos: [
      { codigo: '11145', descricao: 'CONCRETO USINADO BOMBEAVEL CLASSE C25, BRITA 1 E 2, SLUMP 10 +/- 2 CM', unidade: 'm³', tipo: 'MATERIAL', coeficiente: 1.05, precoUnitario: 450.00, custoTotal: 472.50 },
      { codigo: '88309', descricao: 'PEDREIRO COM ENCARGOS COMPLEMENTARES', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 1.20, precoUnitario: 27.80, custoTotal: 33.36 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS COMPLEMENTARES', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 2.00, precoUnitario: 21.27, custoTotal: 42.54 },
      { codigo: '103673', descricao: 'BOMBA DE CONCRETO LANÇADORA REBOQUE (LOCAÇÃO)', unidade: 'h', tipo: 'EQUIPAMENTO', coeficiente: 0.60, precoUnitario: 80.00, custoTotal: 48.00 },
    ]
  },
  {
    codigo: 'SINAPI 92762',
    descricao: 'ARMAÇÃO DE PILAR OU VIGA DE UMA ESTRUTURA CONVENCIONAL DE CONCRETO ARMADO COM AÇO CA-50 DE 10,0 MM',
    unidade: 'kg',
    origem: 'SINAPI',
    custoMaterial: 8.85,
    custoMaoDeObra: 3.45,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 12.30,
    insumos: [
      { codigo: '337', descricao: 'ACO CA-50, 10,0 MM, VERGALHAO', unidade: 'kg', tipo: 'MATERIAL', coeficiente: 1.08, precoUnitario: 7.80, custoTotal: 8.42 },
      { codigo: '43132', descricao: 'ARAME RECOZIDO 16 BWG, D = 1,65 MM', unidade: 'kg', tipo: 'MATERIAL', coeficiente: 0.025, precoUnitario: 17.20, custoTotal: 0.43 },
      { codigo: '88245', descricao: 'ARMADOR COM ENCARGOS COMPLEMENTARES', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.075, precoUnitario: 26.50, custoTotal: 1.99 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS COMPLEMENTARES', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.068, precoUnitario: 21.27, custoTotal: 1.45 },
    ]
  },
  {
    codigo: 'SINAPI 92761',
    descricao: 'ARMAÇÃO DE ESTRUTURA COM AÇO CA-60 DE 5,0 MM - CORTE, DOBRA E MONTAGEM',
    unidade: 'kg',
    origem: 'SINAPI',
    custoMaterial: 9.20,
    custoMaoDeObra: 3.80,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 13.00,
    insumos: [
      { codigo: '343', descricao: 'ACO CA-60, 5,0 MM, EM ROLO', unidade: 'kg', tipo: 'MATERIAL', coeficiente: 1.10, precoUnitario: 8.00, custoTotal: 8.80 },
      { codigo: '43132', descricao: 'ARAME RECOZIDO 16 BWG', unidade: 'kg', tipo: 'MATERIAL', coeficiente: 0.02, precoUnitario: 17.20, custoTotal: 0.34 },
      { codigo: '88245', descricao: 'ARMADOR COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.08, precoUnitario: 26.50, custoTotal: 2.12 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.07, precoUnitario: 21.27, custoTotal: 1.49 },
    ]
  },
  {
    codigo: 'SINAPI 92434',
    descricao: 'MONTAGEM E DESMONTAGEM DE FÔRMA DE PILARES RETANGULARES, CHAPA COMPENSADA RESINADA 12 MM, 3 USOS',
    unidade: 'm²',
    origem: 'SINAPI',
    custoMaterial: 54.20,
    custoMaoDeObra: 42.10,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 96.30,
    insumos: [
      { codigo: '4431', descricao: 'CHAPA COMPENSADO RESINADO 12MM (3 REAPROVEITAMENTOS)', unidade: 'm²', tipo: 'MATERIAL', coeficiente: 0.45, precoUnitario: 68.00, custoTotal: 30.60 },
      { codigo: '4491', descricao: 'SARRAFO E PONTALETE PINUS', unidade: 'm', tipo: 'MATERIAL', coeficiente: 2.10, precoUnitario: 8.50, custoTotal: 17.85 },
      { codigo: '2692', descricao: 'DESMOLDANTE PARA FORMAS DE MADEIRA', unidade: 'l', tipo: 'MATERIAL', coeficiente: 0.05, precoUnitario: 14.00, custoTotal: 0.70 },
      { codigo: '88262', descricao: 'CARPINTEIRO DE FORMAS COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.85, precoUnitario: 28.50, custoTotal: 24.22 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.84, precoUnitario: 21.27, custoTotal: 17.87 },
    ]
  },
  {
    codigo: 'SINAPI 92440',
    descricao: 'MONTAGEM E DESMONTAGEM DE FÔRMA DE VIGAS E LAJES, CHAPA COMPENSADA PLASTIFICADA 14 MM',
    unidade: 'm²',
    origem: 'SINAPI',
    custoMaterial: 62.50,
    custoMaoDeObra: 38.60,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 101.10,
    insumos: [
      { codigo: '4432', descricao: 'CHAPA COMPENSADO PLASTIFICADO 14MM', unidade: 'm²', tipo: 'MATERIAL', coeficiente: 0.35, precoUnitario: 95.00, custoTotal: 33.25 },
      { codigo: '4491', descricao: 'PONTALETES E ESCORAS DE PINUS', unidade: 'm', tipo: 'MATERIAL', coeficiente: 2.80, precoUnitario: 8.50, custoTotal: 23.80 },
      { codigo: '88262', descricao: 'CARPINTEIRO COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.75, precoUnitario: 28.50, custoTotal: 21.38 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.75, precoUnitario: 21.27, custoTotal: 15.95 },
    ]
  },

  // 4. ALVENARIAS E VEDAÇÕES
  {
    codigo: 'SINAPI 89907',
    descricao: 'ALVENARIA DE VEDAÇÃO DE BLOCOS CERÂMICOS FURADOS 9X19X19 CM, E = 9 CM, ASSENTAMENTO COM ARGAMASSA TRAÇO 1:2:8',
    unidade: 'm²',
    origem: 'SINAPI',
    custoMaterial: 35.60,
    custoMaoDeObra: 28.40,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 64.00,
    insumos: [
      { codigo: '684', descricao: 'BLOCO CERAMICO FURADO 9 X 19 X 19 CM', unidade: 'mil', tipo: 'MATERIAL', coeficiente: 0.026, precoUnitario: 950.00, custoTotal: 24.70 },
      { codigo: '88629', descricao: 'ARGAMASSA TRACO 1:2:8 (CIMENTO, CAL E AREIA) PARA ASSENTAMENTO', unidade: 'm³', tipo: 'MATERIAL', coeficiente: 0.016, precoUnitario: 480.00, custoTotal: 7.68 },
      { codigo: '37329', descricao: 'TELA DE ACO SOLDADA GALVANIZADA PARA AMARRACAO DE ALVENARIA', unidade: 'm', tipo: 'MATERIAL', coeficiente: 0.45, precoUnitario: 4.80, custoTotal: 2.16 },
      { codigo: '88309', descricao: 'PEDREIRO COM ENCARGOS COMPLEMENTARES', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.58, precoUnitario: 27.80, custoTotal: 16.12 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS COMPLEMENTARES', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.55, precoUnitario: 21.27, custoTotal: 11.70 },
    ]
  },
  {
    codigo: 'SINAPI 89912',
    descricao: 'ALVENARIA DE VEDAÇÃO DE BLOCOS CERÂMICOS FURADOS 14X19X39 CM, E = 14 CM, JUNTA 10 MM',
    unidade: 'm²',
    origem: 'SINAPI',
    custoMaterial: 48.20,
    custoMaoDeObra: 32.50,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 80.70,
    insumos: [
      { codigo: '685', descricao: 'BLOCO CERAMICO FURADO 14 X 19 X 39 CM', unidade: 'un', tipo: 'MATERIAL', coeficiente: 13.5, precoUnitario: 2.80, custoTotal: 37.80 },
      { codigo: '88629', descricao: 'ARGAMASSA TRACO 1:2:8 PARA ASSENTAMENTO', unidade: 'm³', tipo: 'MATERIAL', coeficiente: 0.018, precoUnitario: 480.00, custoTotal: 8.64 },
      { codigo: '88309', descricao: 'PEDREIRO COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.65, precoUnitario: 27.80, custoTotal: 18.07 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.62, precoUnitario: 21.27, custoTotal: 13.19 },
    ]
  },
  {
    codigo: 'SINAPI 93184',
    descricao: 'VERGA OU CONTRAVERGA PRÉ-MOLDADA EM CONCRETO PARA PORTAS E JANELAS ATÉ 1,5 M DE VÃO',
    unidade: 'm',
    origem: 'SINAPI',
    custoMaterial: 22.00,
    custoMaoDeObra: 14.50,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 36.50,
    insumos: [
      { codigo: '103672', descricao: 'CONCRETO FCK 20 MPA', unidade: 'm³', tipo: 'MATERIAL', coeficiente: 0.014, precoUnitario: 450.00, custoTotal: 6.30 },
      { codigo: '92762', descricao: 'ACO CA-50 8,0 MM', unidade: 'kg', tipo: 'MATERIAL', coeficiente: 1.10, precoUnitario: 8.85, custoTotal: 9.74 },
      { codigo: '88309', descricao: 'PEDREIRO COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.28, precoUnitario: 27.80, custoTotal: 7.78 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.28, precoUnitario: 21.27, custoTotal: 5.96 },
    ]
  },

  // 5. COBERTURA E TELHADO
  {
    codigo: 'SINAPI 94215',
    descricao: 'TELHAMENTO COM TELHA CERÂMICA TIPO PORTUGUESA OU COLONIAL, INCLUINDO TRANSPORTE E FIXAÇÃO',
    unidade: 'm²',
    origem: 'SINAPI',
    custoMaterial: 44.50,
    custoMaoDeObra: 24.30,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 68.80,
    insumos: [
      { codigo: '7192', descricao: 'TELHA CERAMICA PORTUGUESA NATURAL', unidade: 'mil', tipo: 'MATERIAL', coeficiente: 0.017, precoUnitario: 2200.00, custoTotal: 37.40 },
      { codigo: '5068', descricao: 'PREGO COM CABECA', unidade: 'kg', tipo: 'MATERIAL', coeficiente: 0.04, precoUnitario: 17.40, custoTotal: 0.70 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.45, precoUnitario: 21.27, custoTotal: 9.57 },
      { codigo: '88323', descricao: 'TELHADISTA COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.50, precoUnitario: 28.50, custoTotal: 14.25 },
    ]
  },
  {
    codigo: 'SINAPI 94210',
    descricao: 'ESTRUTURA DE MADEIRA PARA TELHADO, COM TESOURAS, ESPIGÕES, CUMEEIRAS E RIPAMENTO COMPLETO',
    unidade: 'm²',
    origem: 'SINAPI',
    custoMaterial: 88.00,
    custoMaoDeObra: 42.00,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 130.00,
    insumos: [
      { codigo: '4450', descricao: 'MADEIRA MACICA SERRADA DE PRIMEIRA (PEROBA/VIGAS/CAIBROS/RIPAS)', unidade: 'm³', tipo: 'MATERIAL', coeficiente: 0.024, precoUnitario: 3400.00, custoTotal: 81.60 },
      { codigo: '5068', descricao: 'PREGOS E PARAFUSOS ESTRUTURAIS', unidade: 'kg', tipo: 'MATERIAL', coeficiente: 0.35, precoUnitario: 18.00, custoTotal: 6.30 },
      { codigo: '88262', descricao: 'CARPINTEIRO COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.85, precoUnitario: 28.50, custoTotal: 24.22 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.80, precoUnitario: 21.27, custoTotal: 17.02 },
    ]
  },
  {
    codigo: 'SINAPI 94228',
    descricao: 'RUFO EM CHAPA DE AÇO GALVANIZADO NÚMERO 24, CORTE 33 CM, INCLUINDO FIXAÇÃO E VEDAÇÃO',
    unidade: 'm',
    origem: 'SINAPI',
    custoMaterial: 28.50,
    custoMaoDeObra: 15.20,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 43.70,
    insumos: [
      { codigo: '4813', descricao: 'RUFO DE CHAPA GALVANIZADA', unidade: 'm', tipo: 'MATERIAL', coeficiente: 1.05, precoUnitario: 22.00, custoTotal: 23.10 },
      { codigo: '145', descricao: 'SELANTE PU PARA CALHAS E RUFOS', unidade: 'un', tipo: 'MATERIAL', coeficiente: 0.15, precoUnitario: 28.00, custoTotal: 4.20 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.30, precoUnitario: 21.27, custoTotal: 6.38 },
      { codigo: '88323', descricao: 'TELHADISTA/FUNILEIRO COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.30, precoUnitario: 28.50, custoTotal: 8.55 },
    ]
  },

  // 6. REVESTIMENTOS DE PAREDE E PISO
  {
    codigo: 'SINAPI 87878',
    descricao: 'CHAPISCO APLICADO EM ALVENARIA COM COLHER DE PEDREIRO, ARGAMASSA TRAÇO 1:3 COM PREPARO MANUAL',
    unidade: 'm²',
    origem: 'SINAPI',
    custoMaterial: 3.40,
    custoMaoDeObra: 4.80,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 8.20,
    insumos: [
      { codigo: '1379', descricao: 'CIMENTO PORTLAND CP II-32', unidade: 'kg', tipo: 'MATERIAL', coeficiente: 2.45, precoUnitario: 0.72, custoTotal: 1.76 },
      { codigo: '370', descricao: 'AREIA MEDIA LAVADA', unidade: 'm³', tipo: 'MATERIAL', coeficiente: 0.006, precoUnitario: 110.00, custoTotal: 0.66 },
      { codigo: '88309', descricao: 'PEDREIRO COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.10, precoUnitario: 27.80, custoTotal: 2.78 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.09, precoUnitario: 21.27, custoTotal: 1.91 },
    ]
  },
  {
    codigo: 'SINAPI 87529',
    descricao: 'MASSA ÚNICA (EMBOÇO/REBOCO), PARA RECEBIMENTO DE PINTURA, EM ARGAMASSA TRAÇO 1:2:8, ESPESSURA 20 MM',
    unidade: 'm²',
    origem: 'SINAPI',
    custoMaterial: 11.20,
    custoMaoDeObra: 22.80,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 34.00,
    insumos: [
      { codigo: '88629', descricao: 'ARGAMASSA TRACO 1:2:8 CIMENTO, CAL E AREIA', unidade: 'm³', tipo: 'MATERIAL', coeficiente: 0.025, precoUnitario: 420.00, custoTotal: 10.50 },
      { codigo: '88309', descricao: 'PEDREIRO COM ENCARGOS COMPLEMENTARES', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.50, precoUnitario: 27.80, custoTotal: 13.90 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS COMPLEMENTARES', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.40, precoUnitario: 21.27, custoTotal: 8.51 },
    ]
  },
  {
    codigo: 'SINAPI 87620',
    descricao: 'CONTRAPISO EM ARGAMASSA TRAÇO 1:4 (CIMENTO E AREIA), PREPARO MECÂNICO, ESPESSURA 3,0 CM',
    unidade: 'm²',
    origem: 'SINAPI',
    custoMaterial: 16.80,
    custoMaoDeObra: 16.50,
    custoEquipamento: 1.20,
    custoUnitarioDireto: 34.50,
    insumos: [
      { codigo: '1379', descricao: 'CIMENTO PORTLAND CP II-32', unidade: 'kg', tipo: 'MATERIAL', coeficiente: 9.80, precoUnitario: 0.72, custoTotal: 7.06 },
      { codigo: '370', descricao: 'AREIA MEDIA POSTO JAZIDA', unidade: 'm³', tipo: 'MATERIAL', coeficiente: 0.038, precoUnitario: 110.00, custoTotal: 4.18 },
      { codigo: '88309', descricao: 'PEDREIRO COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.32, precoUnitario: 27.80, custoTotal: 8.90 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.34, precoUnitario: 21.27, custoTotal: 7.23 },
    ]
  },
  {
    codigo: 'SINAPI 98689',
    descricao: 'REVESTIMENTO CERÂMICO / PORCELANATO ESMALTADO RETIFICADO 60X60 CM OU SUPERIOR EM PISOS INTERNOS, ARGAMASSA AC-III',
    unidade: 'm²',
    origem: 'SINAPI',
    custoMaterial: 78.50,
    custoMaoDeObra: 34.20,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 112.70,
    insumos: [
      { codigo: '1288', descricao: 'PORCELANATO ESMALTADO RETIFICADO 60X60 PEI 4/5', unidade: 'm²', tipo: 'MATERIAL', coeficiente: 1.08, precoUnitario: 65.00, custoTotal: 70.20 },
      { codigo: '3732', descricao: 'ARGAMASSA COLANTE TIPO AC-III', unidade: 'kg', tipo: 'MATERIAL', coeficiente: 6.00, precoUnitario: 1.15, custoTotal: 6.90 },
      { codigo: '3435', descricao: 'REJUNTE RESINADO / EPOXI', unidade: 'kg', tipo: 'MATERIAL', coeficiente: 0.25, precoUnitario: 8.00, custoTotal: 2.00 },
      { codigo: '88256', descricao: 'LADRILHISTA / AZULEJISTA COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.65, precoUnitario: 29.20, custoTotal: 18.98 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.68, precoUnitario: 21.27, custoTotal: 14.46 },
    ]
  },
  {
    codigo: 'SINAPI 98692',
    descricao: 'RODAPÉ CERÂMICO/PORCELANATO H = 8 CM, ASSENTADO COM ARGAMASSA COLANTE',
    unidade: 'm',
    origem: 'SINAPI',
    custoMaterial: 11.20,
    custoMaoDeObra: 8.50,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 19.70,
    insumos: [
      { codigo: '1289', descricao: 'RODAPE DE PORCELANATO 8 CM', unidade: 'm', tipo: 'MATERIAL', coeficiente: 1.05, precoUnitario: 9.50, custoTotal: 9.98 },
      { codigo: '3732', descricao: 'ARGAMASSA COLANTE AC-III', unidade: 'kg', tipo: 'MATERIAL', coeficiente: 0.80, precoUnitario: 1.15, custoTotal: 0.92 },
      { codigo: '88256', descricao: 'AZULEJISTA COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.16, precoUnitario: 29.20, custoTotal: 4.67 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.16, precoUnitario: 21.27, custoTotal: 3.40 },
    ]
  },

  // 7. PINTURA
  {
    codigo: 'SINAPI 88489',
    descricao: 'APLICAÇÃO DE MASSA CORRIDA / ACRÍLICA DUAS DEMÃOS EM PAREDES INTERNAS E EXTERNAS COM LIXAMENTO',
    unidade: 'm²',
    origem: 'SINAPI',
    custoMaterial: 6.80,
    custoMaoDeObra: 14.60,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 21.40,
    insumos: [
      { codigo: '4046', descricao: 'MASSA ACRILICA / CORRIDA PARA PAREDE', unidade: 'kg', tipo: 'MATERIAL', coeficiente: 0.70, precoUnitario: 7.20, custoTotal: 5.04 },
      { codigo: '3767', descricao: 'LIXA EM FOLHA PARA PAREDE N 150/220', unidade: 'un', tipo: 'MATERIAL', coeficiente: 0.40, precoUnitario: 1.80, custoTotal: 0.72 },
      { codigo: '88310', descricao: 'PINTOR COM ENCARGOS COMPLEMENTARES', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.32, precoUnitario: 28.40, custoTotal: 9.09 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.24, precoUnitario: 21.27, custoTotal: 5.10 },
    ]
  },
  {
    codigo: 'SINAPI 88497',
    descricao: 'PINTURA COM TINTA LÁTEX ACRÍLICA PREMIUM, DUAS DEMÃOS, EM PAREDES INTERNAS/EXTERNAS',
    unidade: 'm²',
    origem: 'SINAPI',
    custoMaterial: 9.50,
    custoMaoDeObra: 13.80,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 23.30,
    insumos: [
      { codigo: '7356', descricao: 'TINTA ACRILICA PREMIUM FOSCA OU ACETINADA', unidade: 'l', tipo: 'MATERIAL', coeficiente: 0.28, precoUnitario: 30.00, custoTotal: 8.40 },
      { codigo: '6085', descricao: 'SELADOR ACRILICO OU FUNDO PREPARADOR', unidade: 'l', tipo: 'MATERIAL', coeficiente: 0.12, precoUnitario: 14.00, custoTotal: 1.68 },
      { codigo: '88310', descricao: 'PINTOR COM ENCARGOS COMPLEMENTARES', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.30, precoUnitario: 28.40, custoTotal: 8.52 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.22, precoUnitario: 21.27, custoTotal: 4.68 },
    ]
  },

  // 8. ESQUADRIAS
  {
    codigo: 'SINAPI 91341',
    descricao: 'PORTA DE MADEIRA PARA PINTURA, COMPLETA: FOLHA 80X210 CM, BATENTES, GUARNIÇÕES E FECHADURA TETRA',
    unidade: 'un',
    origem: 'SINAPI',
    custoMaterial: 420.00,
    custoMaoDeObra: 125.00,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 545.00,
    insumos: [
      { codigo: '4986', descricao: 'KIT PORTA PRONTA 80X210 CM COM MARCO E ALIZARES', unidade: 'un', tipo: 'MATERIAL', coeficiente: 1.00, precoUnitario: 350.00, custoTotal: 350.00 },
      { codigo: '3104', descricao: 'FECHADURA DE EMBUTIR COMPLETA EM INOX COM TRINCO', unidade: 'cj', tipo: 'MATERIAL', coeficiente: 1.00, precoUnitario: 68.00, custoTotal: 68.00 },
      { codigo: '88262', descricao: 'CARPINTEIRO / MONTADOR COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 2.80, precoUnitario: 28.50, custoTotal: 79.80 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 2.10, precoUnitario: 21.27, custoTotal: 44.67 },
    ]
  },
  {
    codigo: 'SINAPI 94569',
    descricao: 'JANELA DE ALUMÍNIO DE CORRER 2 OU 4 FOLHAS COM VIDRO LISO TRANSPARENTE 4 MM, LINHA SUPREMA/25',
    unidade: 'm²',
    origem: 'SINAPI',
    custoMaterial: 440.00,
    custoMaoDeObra: 75.00,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 515.00,
    insumos: [
      { codigo: '39023', descricao: 'JANELA DE CORRER ALUMINIO ANODIZADO COM VIDRO 4 MM', unidade: 'm²', tipo: 'MATERIAL', coeficiente: 1.00, precoUnitario: 425.00, custoTotal: 425.00 },
      { codigo: '145', descricao: 'ESPUMA DE POLIURETANO EXPANSIVA E SELANTE PU', unidade: 'un', tipo: 'MATERIAL', coeficiente: 0.35, precoUnitario: 32.00, custoTotal: 11.20 },
      { codigo: '88309', descricao: 'PEDREIRO / INSTALADOR COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 1.50, precoUnitario: 27.80, custoTotal: 41.70 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 1.50, precoUnitario: 21.27, custoTotal: 31.90 },
    ]
  },

  // 9. INSTALAÇÕES HIDROSSANITÁRIAS E ELÉTRICAS
  {
    codigo: 'SINAPI 89957',
    descricao: 'PONTO DE ESGOTO EM PVC COM TUBOS DE 40 MM, 50 MM E 100 MM E CONEXÕES ATÉ CAIXA SIFONADA',
    unidade: 'pt',
    origem: 'SINAPI',
    custoMaterial: 85.00,
    custoMaoDeObra: 62.00,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 147.00,
    insumos: [
      { codigo: '9845', descricao: 'TUBOS E CONEXOES PVC ESGOTO SERIE NORMAL', unidade: 'cj', tipo: 'MATERIAL', coeficiente: 1.00, precoUnitario: 65.00, custoTotal: 65.00 },
      { codigo: '117', descricao: 'CAIXA SIFONADA PVC 100X100X50 MM COM GRELHA INOX', unidade: 'un', tipo: 'MATERIAL', coeficiente: 0.35, precoUnitario: 42.00, custoTotal: 14.70 },
      { codigo: '88267', descricao: 'ENCANADOR / BOMBEIRO COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 1.40, precoUnitario: 27.50, custoTotal: 38.50 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 1.10, precoUnitario: 21.27, custoTotal: 23.40 },
    ]
  },
  {
    codigo: 'SINAPI 89961',
    descricao: 'PONTO DE ÁGUA FRIA EM TUBO PVC SOLDÁVEL 20 MM OU 25 MM, INCLUINDO RASGO E CHUMBAMENTO',
    unidade: 'pt',
    origem: 'SINAPI',
    custoMaterial: 48.00,
    custoMaoDeObra: 45.00,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 93.00,
    insumos: [
      { codigo: '9846', descricao: 'TUBOS E CONEXOES PVC SOLDAVEL 25 MM', unidade: 'cj', tipo: 'MATERIAL', coeficiente: 1.00, precoUnitario: 38.00, custoTotal: 38.00 },
      { codigo: '88267', descricao: 'ENCANADOR COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 1.00, precoUnitario: 27.50, custoTotal: 27.50 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.80, precoUnitario: 21.27, custoTotal: 17.02 },
    ]
  },
  {
    codigo: 'SINAPI 91926',
    descricao: 'PONTO DE ILUMINAÇÃO / TOMADA COM ELETRODUTO CORRUGADO FLEXÍVEL, FIOS 2,5 MM² E CAIXA 4X2',
    unidade: 'pt',
    origem: 'SINAPI',
    custoMaterial: 52.00,
    custoMaoDeObra: 48.00,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 100.00,
    insumos: [
      { codigo: '1014', descricao: 'CABO DE COBRE FLEXIVEL 2,5 MM² ISOLAMENTO 750V', unidade: 'm', tipo: 'MATERIAL', coeficiente: 15.0, precoUnitario: 2.20, custoTotal: 33.00 },
      { codigo: '2688', descricao: 'ELETRODUTO CORRUGADO AMARELO DN 25 MM (3/4")', unidade: 'm', tipo: 'MATERIAL', coeficiente: 5.0, precoUnitario: 2.60, custoTotal: 13.00 },
      { codigo: '88264', descricao: 'ELETRICISTA COM ENCARGOS COMPLEMENTARES', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 1.00, precoUnitario: 28.50, custoTotal: 28.50 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.90, precoUnitario: 21.27, custoTotal: 19.14 },
    ]
  },
  {
    codigo: 'SINAPI 101878',
    descricao: 'QUADRO DE DISTRIBUIÇÃO DE ENERGIA DE EMBUTIR EM PVC PARA 18 DISJUNTORES COM BARRAMENTOS E DISJUNTORES DIN',
    unidade: 'un',
    origem: 'SINAPI',
    custoMaterial: 490.00,
    custoMaoDeObra: 160.00,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 650.00,
    insumos: [
      { codigo: '11823', descricao: 'QUADRO DISTRIBUICAO PVC 18 MODULOS COM BARRAMENTO TRIFASICO', unidade: 'un', tipo: 'MATERIAL', coeficiente: 1.00, precoUnitario: 180.00, custoTotal: 180.00 },
      { codigo: '10145', descricao: 'DISJUNTORES TERMOMAGNETICOS DIN MONO/BIPOLARES', unidade: 'cj', tipo: 'MATERIAL', coeficiente: 1.00, precoUnitario: 220.00, custoTotal: 220.00 },
      { codigo: '10149', descricao: 'DPS E DISPOSITIVO DR TETRAPOLAR 40A/30MA', unidade: 'cj', tipo: 'MATERIAL', coeficiente: 1.00, precoUnitario: 90.00, custoTotal: 90.00 },
      { codigo: '88264', descricao: 'ELETRICISTA COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 3.50, precoUnitario: 28.50, custoTotal: 99.75 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 2.80, precoUnitario: 21.27, custoTotal: 59.56 },
    ]
  },

  // 10. LOUÇAS, METAIS E LIMPEZA
  {
    codigo: 'SINAPI 95305',
    descricao: 'BACIA SANITÁRIA COM CAIXA ACOPLADA, LOUÇA BRANCA, ASSENTO E ACESSÓRIOS DE LIGAÇÃO',
    unidade: 'un',
    origem: 'SINAPI',
    custoMaterial: 420.00,
    custoMaoDeObra: 78.00,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 498.00,
    insumos: [
      { codigo: '6138', descricao: 'BACIA SANITARIA COM CAIXA ACOPLADA 3/6L', unidade: 'un', tipo: 'MATERIAL', coeficiente: 1.00, precoUnitario: 340.00, custoTotal: 340.00 },
      { codigo: '375', descricao: 'TUBO DE LIGACAO, PARAFUSOS E ANEL DE VEDACAO', unidade: 'cj', tipo: 'MATERIAL', coeficiente: 1.00, precoUnitario: 45.00, custoTotal: 45.00 },
      { codigo: '88267', descricao: 'ENCANADOR COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 1.80, precoUnitario: 27.50, custoTotal: 49.50 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 1.30, precoUnitario: 21.27, custoTotal: 27.65 },
    ]
  },
  {
    codigo: 'SINAPI 99814',
    descricao: 'LIMPEZA GERAL FINAL DE OBRA PARA ENTREGA DAS CHAVES',
    unidade: 'm²',
    origem: 'SINAPI',
    custoMaterial: 1.80,
    custoMaoDeObra: 5.50,
    custoEquipamento: 0.00,
    custoUnitarioDireto: 7.30,
    insumos: [
      { codigo: '3812', descricao: 'PRODUTOS DE LIMPEZA E DESENGRAXANTES ESPECIAIS', unidade: 'un', tipo: 'MATERIAL', coeficiente: 0.05, precoUnitario: 35.00, custoTotal: 1.75 },
      { codigo: '88316', descricao: 'SERVENTE COM ENCARGOS', unidade: 'h', tipo: 'MAO_DE_OBRA', coeficiente: 0.25, precoUnitario: 21.27, custoTotal: 5.32 },
    ]
  }
];
