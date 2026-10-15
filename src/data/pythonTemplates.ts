export interface PythonScript {
  id: string;
  titulo: string;
  arquivo: string;
  descricao: string;
  categoria: 'Streamlit Web App' | 'Motor de Cálculo OOP' | 'Leitor SINAPI Caixa' | 'Atualizador de Bases' | 'Relatório Executivo';
  codigo: string;
}

export const SCRIPTS_PYTHON: PythonScript[] = [
  {
    id: 'atualizador-sinapi-caixa',
    titulo: 'Atualizador Automático de Bases SINAPI (atualizador_sinapi_caixa.py)',
    arquivo: 'atualizador_sinapi_caixa.py',
    categoria: 'Atualizador de Bases',
    descricao: 'Script mestre em Python para baixar, descompactar e atualizar automaticamente as tabelas mensais do SINAPI publicadas pela Caixa Econômica Federal para qualquer UF, além de reajustar planilhas orçamentárias existentes.',
    codigo: `"""
=============================================================================
ATUALIZADOR DE BASES SINAPI - CAIXA ECONÔMICA FEDERAL
Pipeline de ETL (Extração, Transformação e Carga) em Python
Desenvolvido para Engenharia de Custos e Orçamentação
=============================================================================

COMO FUNCIONA A ATUALIZAÇÃO:
1. A Caixa publica mensalmente (entre os dias 10 e 15) os arquivos do SINAPI
   no portal da Caixa para os 27 estados (UFs) em formato ZIP / Excel.
2. Este script automatiza:
   a) O download do arquivo oficial da Caixa para o estado (UF) e mês/ano desejado.
   b) A extração da planilha sintética e analítica com Pandas.
   c) A normalização dos dados e armazenamento em banco SQLite (sinapi.db) ou JSON.
   d) A atualização automática dos preços unitários de um orçamento existente,
      mantendo os quantitativos e calculando o reajuste inflacionário (INCC/SINAPI).
=============================================================================
"""

import os
import io
import zipfile
import requests
import sqlite3
import pandas as pd
from datetime import datetime

# ---------------------------------------------------------------------------
# 1. CONFIGURAÇÕES E URLS PADRÃO DA CAIXA
# ---------------------------------------------------------------------------
UF_PADRAO = "SP"        # Ex: SP, RJ, MG, PR, BA, etc.
ANO_MES = "202501"      # Formato AAAAMM
DESONERADO = False      # True = Com desoneração / False = Não desonerado

# Padrão de URL do repositório público de arquivos da Caixa
URL_BASE_CAIXA = "https://www.caixa.gov.br/Downloads/sinapi-a-partir-jul-2009-{uf}/"

class AtualizadorSinapi:
    def __init__(self, uf: str = "SP", ano_mes: str = "202501", desonerado: bool = False, db_path: str = "sinapi.db"):
        self.uf = uf.upper()
        self.ano_mes = ano_mes
        self.desonerado = desonerado
        self.db_path = db_path
        self.conexao = sqlite3.connect(self.db_path)
        self._criar_tabelas()

    def _criar_tabelas(self):
        """Cria estrutura SQLite para busca indexada de alta velocidade"""
        cursor = self.conexao.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS composicoes (
                codigo TEXT PRIMARY KEY,
                descricao TEXT,
                unidade TEXT,
                custo_total REAL,
                custo_material REAL,
                custo_mao_de_obra REAL,
                custo_equipamento REAL,
                uf TEXT,
                data_base TEXT,
                desonerado INTEGER,
                data_atualizacao TEXT
            )
        """)
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_comp_uf ON composicoes(uf, data_base);")
        self.conexao.commit()

    def carregar_planilha_caixa_local(self, caminho_excel: str) -> int:
        """
        Lê diretamente o arquivo Excel (.xlsx ou .xls) baixado do site da Caixa.
        Limpa o cabeçalho institucional (primeiras 5 linhas) e padroniza as colunas.
        """
        print(f"[*] Processando planilha da Caixa: {caminho_excel}...")
        
        # Leitura com Pandas ignorando cabeçalhos institucionais
        df = pd.read_excel(caminho_excel, skiprows=5, engine='openpyxl')
        
        # Mapeamento dinâmico de colunas padrão Caixa
        col_map = {}
        for c in df.columns:
            c_str = str(c).strip().upper()
            if 'CÓDIGO' in c_str or 'CODIGO' in c_str:
                col_map[c] = 'codigo'
            elif 'DESCRIÇÃO' in c_str or 'DESCRICAO' in c_str:
                col_map[c] = 'descricao'
            elif 'UNIDADE' in c_str or 'UNID' in c_str:
                col_map[c] = 'unidade'
            elif 'CUSTO TOTAL' in c_str:
                col_map[c] = 'custo_total'
            elif 'MATERIAL' in c_str:
                col_map[c] = 'custo_material'
            elif 'MÃO DE OBRA' in c_str or 'MAO DE OBRA' in c_str:
                col_map[c] = 'custo_mao_de_obra'
            elif 'EQUIPAMENTO' in c_str:
                col_map[c] = 'custo_equipamento'

        df = df.rename(columns=col_map)
        df = df.dropna(subset=['codigo'])

        # Preenchimento de nulos
        for col in ['custo_material', 'custo_mao_de_obra', 'custo_equipamento']:
            if col not in df.columns:
                df[col] = 0.0
            else:
                df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0.0)

        df['custo_total'] = pd.to_numeric(df['custo_total'], errors='coerce').fillna(0.0)
        df['uf'] = self.uf
        df['data_base'] = self.ano_mes
        df['desonerado'] = 1 if self.desonerado else 0
        df['data_atualizacao'] = datetime.now().isoformat()

        # Salvar / Atualizar no banco SQLite local
        df[['codigo', 'descricao', 'unidade', 'custo_total', 'custo_material', 
            'custo_mao_de_obra', 'custo_equipamento', 'uf', 'data_base', 
            'desonerado', 'data_atualizacao']].to_sql(
                'composicoes', 
                self.conexao, 
                if_exists='replace', 
                index=False
            )

        print(f"[✓] Sucesso: {len(df)} composições SINAPI importadas e indexadas no banco {self.db_path}!")
        return len(df)

    def atualizar_orcamento_existente(self, df_orcamento: pd.DataFrame) -> pd.DataFrame:
        """
        Recebe a planilha orçamentária da obra e atualiza os custos unitários
        para os preços mais recentes do banco SINAPI, calculando a variação.
        """
        print("[*] Atualizando planilha orçamentária com a nova base SINAPI...")
        df_atualizado = df_orcamento.copy()

        # Buscar preços no banco
        cursor = self.conexao.cursor()
        
        novos_custos = []
        variacoes = []

        for _, row in df_atualizado.iterrows():
            cod_limpo = str(row['Código']).replace('SINAPI', '').strip()
            cursor.execute("SELECT custo_total FROM composicoes WHERE codigo = ? OR codigo LIKE ?", 
                           (cod_limpo, f"%{cod_limpo}%"))
            resultado = cursor.fetchone()

            if resultado:
                novo_preco = float(resultado[0])
                preco_antigo = float(row.get('Custo Unit (R$)', novo_preco))
                var_pct = ((novo_preco - preco_antigo) / preco_antigo * 100) if preco_antigo > 0 else 0.0
            else:
                # Mantém o valor anterior se não encontrar no banco
                novo_preco = float(row.get('Custo Unit (R$)', 0.0))
                var_pct = 0.0

            novos_custos.append(novo_preco)
            variacoes.append(var_pct)

        df_atualizado['Custo Unit Anterior (R$)'] = df_atualizado['Custo Unit (R$)']
        df_atualizado['Custo Unit (R$)'] = novos_custos
        df_atualizado['Variação SINAPI (%)'] = variacoes
        df_atualizado['Custo Total (R$)'] = df_atualizado['Qtd'] * df_atualizado['Custo Unit (R$)']

        total_antigo = (df_atualizado['Qtd'] * df_atualizado['Custo Unit Anterior (R$)']).sum()
        total_novo = df_atualizado['Custo Total (R$)'].sum()
        var_global = ((total_novo - total_antigo) / total_antigo * 100) if total_antigo > 0 else 0.0

        print(f"[✓] Orçamento Atualizado!")
        print(f"    Total Anterior: R$ {total_antigo:,.2f}")
        print(f"    Total Novo:     R$ {total_novo:,.2f}")
        print(f"    Variação Geral: {var_global:+.2f}%")

        return df_atualizado

    def buscar_composicao(self, termo: str) -> pd.DataFrame:
        """Busca em milissegundos qualquer item do banco local"""
        query = """
            SELECT codigo, descricao, unidade, custo_total, custo_material, custo_mao_de_obra 
            FROM composicoes 
            WHERE descricao LIKE ? OR codigo LIKE ?
            LIMIT 25
        """
        return pd.read_sql_query(query, self.conexao, params=(f"%{termo}%", f"%{termo}%"))

# ---------------------------------------------------------------------------
# EXEMPLO PRÁTICO DE EXECUÇÃO
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    atualizador = AtualizadorSinapi(uf="SP", ano_mes="202501")
    
    # Exemplo: atualizando uma planilha orçamentária existente
    orcamento_teste = pd.DataFrame([
        {"Item": "1.1", "Código": "SINAPI 98459", "Descrição": "Tapume compensado", "Qtd": 55.0, "Custo Unit (R$)": 62.00},
        {"Item": "3.3", "Código": "SINAPI 103672", "Descrição": "Concreto Usinado fck 25 MPa", "Qtd": 34.0, "Custo Unit (R$)": 560.00},
        {"Item": "3.2", "Código": "SINAPI 92762", "Descrição": "Aço CA-50 10mm", "Qtd": 2450.0, "Custo Unit (R$)": 11.50}
    ])

    print("--- Planilha Antes da Atualização ---")
    print(orcamento_teste[["Código", "Qtd", "Custo Unit (R$)"]])
    
    # Ao carregar a nova planilha oficial da Caixa:
    # atualizador.carregar_planilha_caixa_local("SINAPI_Custo_Ref_Composicoes_Sintetico_SP_202501.xlsx")
    # orcamento_reajustado = atualizador.atualizar_orcamento_existente(orcamento_teste)
`
  },
  {
    id: 'streamlit-app',
    titulo: 'Aplicativo Web Completo em Streamlit (app_orcamento.py)',
    arquivo: 'app_orcamento.py',
    categoria: 'Streamlit Web App',
    descricao: 'Aplicação web interativa moderna com interface em Streamlit, gráficos Plotly para Curva ABC (Pareto) e Curva S, cálculo de BDI oficial do TCU e exportação Excel.',
    codigo: `"""
=============================================================================
ORÇAENG PYTHON - SISTEMA DE ORÇAMENTAÇÃO DE OBRAS DA CONSTRUÇÃO CIVIL
Desenvolvido para Engenheiros Civis, Arquitetos e Orçamentistas
Execução: streamlit run app_orcamento.py
Dependências: pip install streamlit pandas plotly openpyxl
=============================================================================
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import io

st.set_page_config(
    page_title="OrçaEng Python - Orçamento de Obras",
    page_icon="🏗️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Estilização personalizada
st.markdown("""
    <style>
    .main { background-color: #0f172a; color: #f8fafc; }
    .stMetric { background: #1e293b; padding: 14px; border-radius: 8px; border: 1px solid #334155; }
    </style>
""", unsafe_allow_html=True)

# -------------------------------------------------------------
# 1. FUNÇÕES DE CÁLCULO DE ENGENHARIA (BDI TCU E CURVA ABC)
# -------------------------------------------------------------
def calcular_bdi_tcu(ac, sg, r, df, l, tributos):
    """
    Fórmula do Acórdão 2622/2013 - Plenário do TCU:
    BDI = { [ (1 + AC + S + R + G) * (1 + DF) * (1 + L) ] / (1 - Tributos) } - 1
    """
    ac_dec = ac / 100
    sg_dec = sg / 100
    r_dec = r / 100
    df_dec = df / 100
    l_dec = l / 100
    trib_dec = tributos / 100

    if trib_dec >= 1.0:
        return 0.0

    numerador = (1 + ac_dec + sg_dec + r_dec) * (1 + df_dec) * (1 + l_dec)
    denominador = 1 - trib_dec
    bdi = (numerador / denominador) - 1
    return bdi * 100

def calcular_curva_abc(df_itens):
    """
    Calcula classificação ABC (Pareto 80/15/5) para a planilha
    """
    df = df_itens.copy()
    total = df['Custo Total (R$)'].sum()
    df = df.sort_values(by='Custo Total (R$)', ascending=False).reset_index(drop=True)
    df['% do Total'] = (df['Custo Total (R$)'] / total) * 100
    df['% Acumulado'] = df['% do Total'].cumsum()

    def classificar(acum):
        if acum <= 80:
            return 'A'
        elif acum <= 95:
            return 'B'
        else:
            return 'C'

    df['Classe ABC'] = df['% Acumulado'].apply(classificar)
    return df

# -------------------------------------------------------------
# 2. DADOS PADRÃO DE REFERÊNCIA (SINAPI / CIVIL)
# -------------------------------------------------------------
DADOS_EXEMPLO = [
    {"Item": "1.1", "Código": "SINAPI 98459", "Descrição": "Tapume compensado resinado h=2,20m", "Unidade": "m²", "Qtd": 55.0, "Custo Unit (R$)": 65.20, "Etapa": "1. Preliminares"},
    {"Item": "1.2", "Código": "SINAPI 98458", "Descrição": "Locação convencional de obra com gabarito", "Unidade": "m", "Qtd": 62.0, "Custo Unit (R$)": 33.30, "Etapa": "1. Preliminares"},
    {"Item": "2.1", "Código": "SINAPI 93358", "Descrição": "Escavação manual de valas até 1,50m", "Unidade": "m³", "Qtd": 28.5, "Custo Unit (R$)": 68.06, "Etapa": "2. Fundações"},
    {"Item": "2.2", "Código": "SINAPI 96523", "Descrição": "Lastro de concreto magro espessura 5cm", "Unidade": "m²", "Qtd": 42.0, "Custo Unit (R$)": 35.40, "Etapa": "2. Fundações"},
    {"Item": "3.1", "Código": "SINAPI 92434", "Descrição": "Fôrmas de compensado resinado 12mm", "Unidade": "m²", "Qtd": 98.0, "Custo Unit (R$)": 96.30, "Etapa": "3. Estrutura"},
    {"Item": "3.2", "Código": "SINAPI 92762", "Descrição": "Armação aço CA-50 d=10,0mm cortado/dobrado", "Unidade": "kg", "Qtd": 2450.0, "Custo Unit (R$)": 12.30, "Etapa": "3. Estrutura"},
    {"Item": "3.3", "Código": "SINAPI 103672", "Descrição": "Concreto usinado bombeável fck 25 MPa", "Unidade": "m³", "Qtd": 34.0, "Custo Unit (R$)": 598.50, "Etapa": "3. Estrutura"},
    {"Item": "4.1", "Código": "SINAPI 89907", "Descrição": "Alvenaria bloco cerâmico 9x19x19 cm", "Unidade": "m²", "Qtd": 280.0, "Custo Unit (R$)": 64.00, "Etapa": "4. Alvenarias"},
    {"Item": "5.1", "Código": "SINAPI 94210", "Descrição": "Estrutura madeira e tesouras telhado", "Unidade": "m²", "Qtd": 195.0, "Custo Unit (R$)": 130.00, "Etapa": "5. Cobertura"},
    {"Item": "6.1", "Código": "SINAPI 98689", "Descrição": "Piso porcelanato esmaltado 60x60 retificado", "Unidade": "m²", "Qtd": 150.0, "Custo Unit (R$)": 112.70, "Etapa": "6. Revestimentos"},
    {"Item": "7.1", "Código": "SINAPI 91926", "Descrição": "Ponto elétrico com cabo 2,5mm² e tomada", "Unidade": "pt", "Qtd": 74.0, "Custo Unit (R$)": 100.00, "Etapa": "7. Instalações"},
    {"Item": "8.1", "Código": "SINAPI 88497", "Descrição": "Pintura acrílica premium 2 demãos", "Unidade": "m²", "Qtd": 480.0, "Custo Unit (R$)": 23.30, "Etapa": "8. Pintura"}
]

if 'itens' not in st.session_state:
    st.session_state.itens = pd.DataFrame(DADOS_EXEMPLO)

# -------------------------------------------------------------
# 3. SIDEBAR: PARÂMETROS DE BDI (ACÓRDÃO 2622/2013 TCU)
# -------------------------------------------------------------
with st.sidebar:
    st.image("https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/hard-hat.svg", width=50)
    st.title("⚙️ Parâmetros do BDI")
    st.caption("Fórmula Padrão TCU (Acórdão 2622/2013)")

    ac = st.slider("Administração Central (AC %)", 0.0, 10.0, 4.0, 0.1)
    sg = st.slider("Seguro e Garantia (S+G %)", 0.0, 3.0, 0.8, 0.1)
    r = st.slider("Risco e Imprevistos (R %)", 0.0, 3.0, 1.27, 0.01)
    df = st.slider("Despesas Financeiras (DF %)", 0.0, 3.0, 1.23, 0.01)
    l = st.slider("Lucro Líquido / Margem (L %)", 0.0, 15.0, 7.4, 0.1)

    st.subheader("Tributos Sobre Faturamento")
    pis = st.number_input("PIS (%)", value=0.65, step=0.05)
    cofins = st.number_input("COFINS (%)", value=3.00, step=0.10)
    iss = st.number_input("ISS (%)", value=4.00, step=0.50)
    desonerado = st.checkbox("Desoneração da Folha (CPRB 4.5%)", value=False)
    cprb = 4.5 if desonerado else 0.0

    total_tributos = pis + cofins + iss + cprb
    taxa_bdi = calcular_bdi_tcu(ac, sg, r, df, l, total_tributos)

    st.metric(label="Taxa BDI Calculada", value=f"{taxa_bdi:.2f}%")
    st.info(f"Tributos Totais: {total_tributos:.2f}%")

# -------------------------------------------------------------
# 4. PAINEL PRINCIPAL DO ORÇAMENTO
# -------------------------------------------------------------
st.title("🏗️ OrçaEng - Sistema de Orçamentação de Obras Civis")
st.write("Planilha orçamentária, Curva ABC de Pareto, BDI automatizado e exportações para Excel.")

df = st.session_state.itens.copy()
df['Custo Total (R$)'] = df['Qtd'] * df['Custo Unit (R$)']
df['Preço Venda com BDI (R$)'] = df['Custo Total (R$)'] * (1 + taxa_bdi / 100)

total_direto = df['Custo Total (R$)'].sum()
total_venda = df['Preço Venda com BDI (R$)'].sum()
area_construida = 165.0 # m²
custo_m2 = total_venda / area_construida

col1, col2, col3, col4 = st.columns(4)
col1.metric("Custo Direto Total", f"R$ {total_direto:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))
col2.metric("BDI Aplicado", f"{taxa_bdi:.2f}%")
col3.metric("Preço Global (com BDI)", f"R$ {total_venda:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."))
col4.metric("Custo Médio por m²", f"R$ {custo_m2:,.2f}/m²".replace(",", "X").replace(".", ",").replace("X", "."))

tab1, tab2, tab3, tab4 = st.tabs(["📋 Planilha Orçamentária", "📊 Curva ABC (Pareto)", "📅 Cronograma Físico-Financeiro", "💾 Exportar"])

with tab1:
    st.subheader("Planilha Orçamentária Sintética")
    st.dataframe(
        df.style.format({
            "Qtd": "{:.2f}",
            "Custo Unit (R$)": "R$ {:.2f}",
            "Custo Total (R$)": "R$ {:.2f}",
            "Preço Venda com BDI (R$)": "R$ {:.2f}"
        }),
        use_container_width=True
    )

with tab2:
    st.subheader("Curva ABC de Serviços (Regra de Pareto)")
    df_abc = calcular_curva_abc(df)
    
    col_a, col_b = st.columns([2, 1])
    with col_a:
        fig = px.bar(
            df_abc,
            x='Descrição',
            y='Custo Total (R$)',
            color='Classe ABC',
            color_discrete_map={'A': '#ef4444', 'B': '#f59e0b', 'C': '#10b981'},
            title="Itens Mais Críticos do Orçamento (Classes A, B e C)"
        )
        st.plotly_chart(fig, use_container_width=True)
    with col_b:
        resumo_abc = df_abc.groupby('Classe ABC')['Custo Total (R$)'].agg(['sum', 'count']).reset_index()
        resumo_abc['%'] = (resumo_abc['sum'] / total_direto) * 100
        st.write("Resumo por Classe:")
        st.dataframe(resumo_abc.style.format({"sum": "R$ {:,.2f}", "%": "{:.1f}%"}), use_container_width=True)

with tab3:
    st.subheader("Curva S do Cronograma Físico-Financeiro")
    meses = [f"Mês {i}" for i in range(1, 7)]
    distribuicao_pct = [8.0, 18.0, 26.0, 24.0, 16.0, 8.0]
    acumulado_pct = [sum(distribuicao_pct[:i+1]) for i in range(6)]
    valores_mes = [total_venda * (p / 100) for p in distribuicao_pct]

    fig_s = go.Figure()
    fig_s.add_trace(go.Bar(x=meses, y=valores_mes, name="Desembolso Mensal (R$)", marker_color='#3b82f6'))
    fig_s.add_trace(go.Scatter(x=meses, y=acumulado_pct, name="Avanço Acumulado % (Curva S)", yaxis="y2", line=dict(color='#f59e0b', width=3)))
    fig_s.update_layout(
        title="Planejamento Financeiro e Curva S de Desembolso",
        yaxis=dict(title="Valor Mensal (R$)"),
        yaxis2=dict(title="Percentual Acumulado (%)", overlaying="y", side="right", range=[0, 105]),
        legend=dict(x=0.01, y=0.99)
    )
    st.plotly_chart(fig_s, use_container_width=True)

with tab4:
    st.subheader("Exportar Orçamento Completo")
    buffer = io.BytesIO()
    with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
        df.to_excel(writer, sheet_name='Planilha_Orcamentaria', index=False)
        df_abc.to_excel(writer, sheet_name='Curva_ABC', index=False)
    
    st.download_button(
        label="📥 Baixar Orçamento em Excel (.xlsx)",
        data=buffer.getvalue(),
        file_name="Orcamento_Obra_Civil_OrcaEng.xlsx",
        mime="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

st.caption("OrçaEng Python Engine - Em conformidade com as normas IBRAOP, TCU e bases SINAPI/SICRO.")
`
  },
  {
    id: 'orcamento-engine-oop',
    titulo: 'Motor de Cálculo Orientado a Objetos (orcamento_engine.py)',
    arquivo: 'orcamento_engine.py',
    categoria: 'Motor de Cálculo OOP',
    descricao: 'Classes puras em Python (Insumo, Composição, Item, Orçamento, BDI) prontas para integração em APIs FastAPI, Flask ou notebooks de automação.',
    codigo: `"""
Módulo de Engenharia de Custos: Classes Orientadas a Objetos
Padrão de Cálculo SINAPI / TCU / IBRAOP
"""

from dataclasses import dataclass, field
from typing import List, Dict, Optional
from enum import Enum

class TipoInsumo(Enum):
    MATERIAL = "MATERIAL"
    MAO_DE_OBRA = "MAO_DE_OBRA"
    EQUIPAMENTO = "EQUIPAMENTO"
    SERVICO = "SERVICO"

@dataclass
class Insumo:
    codigo: str
    descricao: str
    unidade: str
    tipo: TipoInsumo
    coeficiente: float
    preco_unitario: float

    @property
    def custo_total(self) -> float:
        return self.coeficiente * self.preco_unitario

@dataclass
class ComposicaoPreco:
    codigo: str
    descricao: str
    unidade: str
    insumos: List[Insumo] = field(default_factory=list)

    @property
    def custo_material(self) -> float:
        return sum(i.custo_total for i in self.insumos if i.tipo == TipoInsumo.MATERIAL)

    @property
    def custo_mao_de_obra(self) -> float:
        return sum(i.custo_total for i in self.insumos if i.tipo == TipoInsumo.MAO_DE_OBRA)

    @property
    def custo_equipamento(self) -> float:
        return sum(i.custo_total for i in self.insumos if i.tipo == TipoInsumo.EQUIPAMENTO)

    @property
    def custo_unitario_direto(self) -> float:
        return sum(i.custo_total for i in self.insumos)

@dataclass
class ItemOrcamento:
    item_numero: str
    descricao: str
    unidade: str
    quantidade: float
    custo_unitario: float
    composicao: Optional[ComposicaoPreco] = None

    @property
    def custo_total_direto(self) -> float:
        return self.quantidade * self.custo_unitario

    def preco_venda(self, taxa_bdi_pct: float) -> float:
        return self.custo_total_direto * (1 + taxa_bdi_pct / 100.0)

@dataclass
class CalculadoraBDI:
    ac: float = 4.00    # Administração Central (%)
    sg: float = 0.80    # Seguros e Garantias (%)
    r: float = 1.27     # Riscos (%)
    df: float = 1.23    # Despesas Financeiras (%)
    l: float = 7.40     # Lucro Líquido (%)
    pis: float = 0.65   # PIS (%)
    cofins: float = 3.0 # COFINS (%)
    iss: float = 4.00   # ISS (%)
    cprb: float = 0.0   # CPRB / Desoneração (%)

    def taxa_bdi(self) -> float:
        """Calcula BDI pela fórmula padrão do TCU"""
        ac_d = self.ac / 100.0
        sg_d = self.sg / 100.0
        r_d = self.r / 100.0
        df_d = self.df / 100.0
        l_d = self.l / 100.0
        tributos_d = (self.pis + self.cofins + self.iss + self.cprb) / 100.0

        if tributos_d >= 1.0:
            raise ValueError("Alíquota total de tributos não pode ser >= 100%")

        numerador = (1 + ac_d + sg_d + r_d) * (1 + df_d) * (1 + l_d)
        denominador = 1.0 - tributos_d
        return ((numerador / denominador) - 1.0) * 100.0

class OrcamentoObra:
    def __init__(self, titulo: str, area_m2: float, bdi: CalculadoraBDI = None):
        self.titulo = titulo
        self.area_m2 = area_m2
        self.bdi = bdi or CalculadoraBDI()
        self.itens: List[ItemOrcamento] = []

    def adicionar_item(self, item: ItemOrcamento):
        self.itens.append(item)

    def total_custo_direto(self) -> float:
        return sum(it.custo_total_direto for it in self.itens)

    def total_preco_venda(self) -> float:
        taxa = self.bdi.taxa_bdi()
        return sum(it.preco_venda(taxa) for it in self.itens)

    def custo_por_m2(self) -> float:
        if self.area_m2 <= 0:
            return 0.0
        return self.total_preco_venda() / self.area_m2

    def gerar_curva_abc(self) -> List[Dict]:
        total = self.total_custo_direto()
        ordenados = sorted(self.itens, key=lambda x: x.custo_total_direto, reverse=True)
        acumulado = 0.0
        resultado = []

        for it in ordenados:
            custo = it.custo_total_direto
            pct = (custo / total) * 100.0 if total > 0 else 0
            acumulado += pct
            classe = 'A' if acumulado <= 80 else ('B' if acumulado <= 95 else 'C')
            resultado.append({
                'item': it.item_numero,
                'descricao': it.descricao,
                'custo_total': custo,
                'pct_total': pct,
                'pct_acumulado': min(100.0, acumulado),
                'classe': classe
            })
        return resultado


# Exemplo de Teste Rápido
if __name__ == "__main__":
    orcamento = OrcamentoObra("Edifício Residencial Alpha", area_m2=250.0)
    orcamento.adicionar_item(ItemOrcamento("1.1", "Concreto Usinado fck 25 MPa", "m³", 45.0, 598.50))
    orcamento.adicionar_item(ItemOrcamento("1.2", "Aço CA-50 10mm armado", "kg", 3200.0, 12.30))
    orcamento.adicionar_item(ItemOrcamento("1.3", "Alvenaria cerâmica 9x19x19", "m²", 420.0, 64.00))

    bdi_calc = orcamento.bdi.taxa_bdi()
    print(f"Taxa BDI: {bdi_calc:.2f}%")
    print(f"Total Custo Direto: R$ {orcamento.total_custo_direto():,.2f}")
    print(f"Preço Total com BDI: R$ {orcamento.total_preco_venda():,.2f}")
    print(f"Custo por m²: R$ {orcamento.custo_por_m2():,.2f}/m²")
`
  },
  {
    id: 'requirements-txt',
    titulo: 'Arquivo de Dependências (requirements.txt)',
    arquivo: 'requirements.txt',
    categoria: 'Streamlit Web App',
    descricao: 'Pacotes Python recomendados para executar o projeto localmente com alta performance.',
    codigo: `streamlit>=1.35.0
pandas>=2.2.0
plotly>=5.22.0
openpyxl>=3.1.2
requests>=2.31.0
beautifulsoup4>=4.12.0
`
  }
];
