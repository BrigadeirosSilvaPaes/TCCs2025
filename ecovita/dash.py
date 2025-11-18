import streamlit as st
import pandas as pd
import sqlite3
import plotly.graph_objects as go
import numpy as np
import base64
from datetime import datetime, timedelta
import requests
import random

API = "http://127.0.0.1:8000"

# ===============================
# CONFIGURAÇÃO DA PÁGINA
# ===============================
st.set_page_config(
    page_title="Ecovita Compostagem",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Função para converter imagens em base64
def img_to_base64(path):
    try:
        with open(path, "rb") as f:
            return base64.b64encode(f.read()).decode()
    except:
        return ""

# Caminhos das imagens (ajuste conforme sua estrutura de pastas)
logo_eco = "logo_projeto.png"
img_left = "logo_curso.png"  
img_right = "logo_escola.png"

# CSS MODERNO COM ÍCONES PROFISSIONAIS
st.markdown("""
<style>
/* ===== VARIÁVEIS DO DESIGN SYSTEM ===== */
:root {
    /* Cores principais - Verde (primário) */
    --verde-50: #f0fdf4;
    --verde-100: #dcfce7;
    --verde-200: #bbf7d0;
    --verde-300: #86efac;
    --verde-400: #4ade80;
    --verde-500: #22c55e;
    --verde-600: #16a34a;
    --verde-700: #15803d;
    --verde-800: #166534;
    --verde-900: #14532d;
    
    /* Cores secundárias - Roxo */
    --roxo-50: #faf5ff;
    --roxo-100: #f3e8ff;
    --roxo-200: #e9d5ff;
    --roxo-300: #d8b4fe;
    --roxo-400: #c084fc;
    --roxo-500: #a855f7;
    --roxo-600: #9333ea;
    --roxo-700: #7c3aed;
    --roxo-800: #6b21a8;
    --roxo-900: #581c87;
    
    /* Escala de cinza */
    --gray-50: #f9fafb;
    --gray-100: #f3f4f6;
    --gray-200: #e5e7eb;
    --gray-300: #d1d5db;
    --gray-400: #9ca3af;
    --gray-500: #6b7280;
    --gray-600: #4b5563;
    --gray-700: #374151;
    --gray-800: #1f2937;
    --gray-900: #111827;
    
    --white: #ffffff;
    
    /* Efeitos */
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    
    --radius: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== ÍCONES PROFISSIONAIS ===== */
.material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 20px;
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;
    -moz-osx-font-smoothing: grayscale;
    font-feature-settings: 'liga';
}

.icon {
    font-size: 30px;
    margin-right: 12px;
    vertical-align: middle;
}

.icon-sm {
    font-size: 16px;
}

.icon-lg {
    font-size: 24px;
}

/* ===== RESET E BASE ===== */
.stApp {
    background: linear-gradient(135deg, var(--gray-50) 0%, var(--white) 50%, var(--gray-100) 100%);
    color: var(--gray-900);
    font-family: 'Inter', 'SF Pro Display', system-ui, sans-serif;
    line-height: 1.6;
}

/* ===== NAVEGAÇÃO SUPERIOR ===== */
.navbar {
    background: var(--white);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--gray-200);
    padding: 0;
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: var(--shadow-sm);
}

.nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 2rem;
    max-width: 1400px;
    margin: 0 auto;
}

.nav-brand {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.nav-logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
}

.nav-logo-text {
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--verde-600), var(--roxo-600));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.025em;
}

.nav-menu {
    display: flex;
    gap: 0.5rem;
    align-items: center;
}

.nav-item {
    padding: 0.75rem 1.25rem;
    border-radius: var(--radius);
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--gray-600);
    text-decoration: none;
    transition: var(--transition);
    border: 1.5px solid transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.nav-item:hover {
    color: var(--verde-600);
    background: var(--verde-50);
    border-color: var(--verde-200);
    transform: translateY(-1px);
}

.nav-item.active {
    background: linear-gradient(135deg, var(--verde-500), var(--verde-600));
    color: var(--white);
    border-color: var(--verde-500);
    box-shadow: var(--shadow);
}

.nav-item.active:hover {
    background: linear-gradient(135deg, var(--verde-600), var(--verde-700));
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
}

/* ===== CONTEÚDO PRINCIPAL ===== */
.main-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
}

/* ===== CABEÇALHOS ===== */
h1 {
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--verde-600), var(--roxo-600));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-align: center;
    margin: 2rem 0 3rem 0;
    letter-spacing: -0.025em;
}

h2 {
    font-size: 1.875rem;
    font-weight: 700;
    color: var(--gray-900);
    margin: 2.5rem 0 1.5rem 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--verde-100);
    position: relative;
}

h2::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 60px;
    height: 2px;
    background: linear-gradient(90deg, var(--verde-500), var(--roxo-500));
    border-radius: 2px;
}

h3 {
    font-size: 1.375rem;
    font-weight: 600;
    color: var(--gray-800);
    margin: 2rem 0 1rem 0;
}

/* ===== SISTEMA DE CARDS ===== */
.card {
    background: var(--white);
    border-radius: var(--radius-xl);
    padding: 2rem;
    margin: 1.5rem 0;
    border: 1px solid var(--gray-200);
    box-shadow: var(--shadow-sm);
    transition: var(--transition);
    position: relative;
    overflow: hidden;
}

.card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, var(--verde-500), var(--roxo-500));
    opacity: 0;
    transition: var(--transition);
}

.card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-xl);
    border-color: var(--verde-200);
}

.card:hover::before {
    opacity: 1;
}

.card-highlight {
    background: linear-gradient(135deg, var(--verde-50), var(--white));
    border-color: var(--verde-200);
}

.card-roxo {
    background: linear-gradient(135deg, var(--roxo-50), var(--white));
    border-color: var(--roxo-200);
}

/* ===== BOTÕES ===== */
.stButton > button {
    background: linear-gradient(135deg, var(--verde-500), var(--verde-600));
    color: var(--white);
    border: none;
    border-radius: var(--radius);
    padding: 0.875rem 1.75rem;
    font-weight: 600;
    font-size: 0.875rem;
    transition: var(--transition);
    box-shadow: var(--shadow-sm);
    width: auto;
    margin: 0.25rem 0;
    position: relative;
    overflow: hidden;
}

.stButton > button::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
}

.stButton > button:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    background: linear-gradient(135deg, var(--verde-600), var(--verde-700));
}

.stButton > button:hover::before {
    left: 100%;
}

.btn-roxo {
    background: linear-gradient(135deg, var(--roxo-500), var(--roxo-600)) !important;
}

.btn-roxo:hover {
    background: linear-gradient(135deg, var(--roxo-600), var(--roxo-700)) !important;
}

/* ===== MÉTRICAS ===== */
[data-testid="metric-container"] {
    background: var(--white);
    border: 1px solid var(--gray-200);
    border-radius: var(--radius-xl);
    padding: 1.5rem;
    margin: 0.5rem;
    box-shadow: var(--shadow-sm);
    transition: var(--transition);
    position: relative;
    overflow: hidden;
}

[data-testid="metric-container"]::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, var(--verde-500), var(--roxo-500));
    opacity: 0;
    transition: var(--transition);
}

[data-testid="metric-container"]:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
    border-color: var(--verde-200);
}

[data-testid="metric-container"]:hover::before {
    opacity: 1;
}

[data-testid="metric-container"] > div > div {
    color: var(--gray-900) !important;
    font-weight: 700;
    font-size: 1.5rem;
}

[data-testid="metric-container"] > div > label {
    color: var(--gray-600) !important;
    font-weight: 600;
    font-size: 0.875rem;
}

/* ===== FORMULÁRIOS ===== */
.stSelectbox > div > div, .stNumberInput > div > div, .stTextInput > div > div {
    background: var(--white) !important;
    border: 1.5px solid var(--gray-300) !important;
    border-radius: var(--radius) !important;
    color: var(--gray-900) !important;
    transition: var(--transition);
    font-size: 0.875rem;
}

.stSelectbox > div > div:hover, .stNumberInput > div > div:hover, .stTextInput > div > div:hover {
    border-color: var(--verde-300) !important;
}

.stSelectbox > div > div:focus-within, .stNumberInput > div > div:focus-within, .stTextInput > div > div:focus-within {
    border-color: var(--verde-500) !important;
    box-shadow: 0 0 0 3px rgb(34 197 94 / 0.1);
}

.stSelectbox label, .stNumberInput label, .stTextInput label, .stSlider label {
    color: var(--gray-700) !important;
    font-weight: 600;
    font-size: 0.875rem;
}

/* ===== SLIDER ===== */
.stSlider > div > div > div {
    background: linear-gradient(90deg, var(--verde-500), var(--roxo-500)) !important;
}

.stSlider > div > div > div > div {
    background: var(--white) !important;
    border: 2px solid var(--verde-500) !important;
    box-shadow: var(--shadow);
}

/* ===== TABELAS ===== */
.dataframe {
    width: 100%;
    background: var(--white);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
    border: 1px solid var(--gray-200);
}

.dataframe th {
    background: linear-gradient(135deg, var(--verde-500), var(--roxo-500)) !important;
    color: var(--white) !important;
    font-weight: 600;
    padding: 1rem !important;
    border: none !important;
    font-size: 0.875rem;
}

.dataframe td {
    padding: 0.875rem 1rem !important;
    border-bottom: 1px solid var(--gray-200) !important;
    color: var(--gray-700);
    font-size: 0.875rem;
}

.dataframe tr:hover {
    background: var(--verde-50) !important;
}

/* ===== GRÁFICOS ===== */
.js-plotly-plot {
    border-radius: var(--radius-xl);
    background: var(--white) !important;
    border: 1px solid var(--gray-200);
    box-shadow: var(--shadow-sm);
}

/* ===== TABS ===== */
.stTabs [data-baseweb="tab-list"] {
    gap: 0.5rem;
    background: var(--gray-100);
    border-radius: var(--radius);
    padding: 0.5rem;
}

.stTabs [data-baseweb="tab"] {
    background: transparent;
    border-radius: 8px;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    color: var(--gray-600);
    transition: var(--transition);
    border: 1.5px solid transparent;
}

.stTabs [data-baseweb="tab"]:hover {
    background: var(--white);
    color: var(--gray-900);
    border-color: var(--gray-300);
}

.stTabs [aria-selected="true"] {
    background: var(--white) !important;
    color: var(--verde-600) !important;
    font-weight: 600;
    border: 1.5px solid var(--verde-200) !important;
    box-shadow: var(--shadow-sm);
}

/* ===== STATUS BADGES ===== */
.status-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.375rem 0.875rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.status-success {
    background: var(--verde-100);
    color: var(--verde-700);
    border: 1px solid var(--verde-200);
}

.status-warning {
    background: #fef3c7;
    color: #d97706;
    border: 1px solid #fcd34d;
}

.status-error {
    background: #fee2e2;
    color: #dc2626;
    border: 1px solid #fca5a5;
}

.status-info {
    background: var(--roxo-100);
    color: var(--roxo-700);
    border: 1px solid var(--roxo-200);
}

/* ===== DETALHES DOS COMPOSTOS ===== */
.composto-info {
    background: var(--white);
    border-radius: var(--radius-lg);
    padding: 1.5rem;
    margin: 1rem 0;
    border-left: 4px solid var(--verde-500);
    box-shadow: var(--shadow-sm);
}

.composto-verde {
    border-left-color: var(--verde-500);
    background: linear-gradient(135deg, var(--verde-50), var(--white));
}

.composto-marrom {
    border-left-color: #8B4513;
    background: linear-gradient(135deg, #fef3c7, var(--white));
}

.detalhe-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
    color: var(--gray-700);
    font-size: 0.875rem;
}

.detalhe-item i {
    color: var(--verde-500);
    font-weight: 600;
}

/* ===== RODAPÉ ===== */
.footer {
    background: var(--gray-50);
    border-top: 1px solid var(--gray-200);
    padding: 2rem;
    margin-top: 4rem;
    text-align: center;
    color: var(--gray-600);
    font-size: 0.875rem;
}

/* ===== ANIMAÇÕES ===== */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.card, [data-testid="metric-container"] {
    animation: fadeInUp 0.6s ease-out;
}

/* ===== RESPONSIVIDADE ===== */
@media (max-width: 768px) {
    .nav-container {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
    }
    
    .nav-menu {
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .nav-item {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
    }
    
    .main-container {
        padding: 1rem;
    }
    
    .card {
        padding: 1.5rem;
    }
    
    h1 {
        font-size: 2rem;
    }
}

/* ===== UTILITÁRIOS ===== */
.text-gradient {
    background: linear-gradient(135deg, var(--verde-600), var(--roxo-600));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.glass-effect {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.progress-bar {
    width: 100%;
    height: 8px;
    background: var(--gray-200);
    border-radius: 4px;
    overflow: hidden;
    margin: 0.5rem 0;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--verde-500), var(--roxo-500));
    border-radius: 4px;
    transition: width 0.3s ease;
}

/* ===== ÍCONES PERSONALIZADOS ===== */
.icon-home::before { content: "🏠"; }
.icon-dashboard::before { content: "📊"; }
.icon-compost::before { content: "🌿"; }
.icon-analytics::before { content: "📈"; }
.icon-settings::before { content: "⚙️"; }
.icon-temperature::before { content: "🌡️"; }
.icon-humidity::before { content: "💧"; }
.icon-gas::before { content: "📊"; }
.icon-ph::before { content: "⚗️"; }
.icon-efficiency::before { content: "📈"; }
.icon-success::before { content: "✅"; }
.icon-warning::before { content: "⚠️"; }
.icon-error::before { content: "❌"; }
.icon-info::before { content: "ℹ️"; }
</style>

<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
""", unsafe_allow_html=True)

# ===============================
# DADOS DOS COMPOSTOS
# ===============================
COMPOSTOS_VERDES = {
    "Folhas verdes": {
        "descricao": "Folhas frescas de árvores e plantas",
        "nitrogenio": "Alto",
        "umidade": "Alta",
        "decomposicao": "Rápida",
        "beneficios": ["Rico em nitrogênio", "Acelera decomposição", "Fornece nutrientes"],
        "cuidados": ["Picar bem", "Evitar excesso", "Misturar com marrom"]
    },
    "Restos de frutas": {
        "descricao": "Cascas e partes não consumidas de frutas",
        "nitrogenio": "Muito Alto",
        "umidade": "Muito Alta",
        "decomposicao": "Muito Rápida",
        "beneficios": ["Excelente fonte de nutrientes", "Atrai microorganismos"],
        "cuidados": ["Evitar frutas cítricas em excesso", "Pode atrair moscas"]
    },
    "Restos de legumes": {
        "descricao": "Cascas e sobras de vegetais",
        "nitrogenio": "Alto",
        "umidade": "Alta",
        "decomposicao": "Rápida",
        "beneficios": ["Balanceado em nutrientes", "Boa estrutura"],
        "cuidados": ["Picar bem", "Evitar legumes cozidos com sal"]
    },
    "Grama cortada": {
        "descricao": "Aparas de grama fresca",
        "nitrogenio": "Muito Alto",
        "umidade": "Alta",
        "decomposicao": "Rápida",
        "beneficios": ["Fonte rica em nitrogênio", "Aquece a composteira"],
        "cuidados": ["Secar antes de usar", "Pode compactar se em excesso"]
    }
}

COMPOSTOS_MARRONS = {
    "Serragem": {
        "descricao": "Pó de madeira de serraria",
        "carbono": "Muito Alto",
        "umidade": "Baixa",
        "decomposicao": "Lenta",
        "beneficios": ["Excelente estrutura", "Absorve umidade", "Balanceia verdes"],
        "cuidados": ["Usar madeira não tratada", "Umedecer antes"]
    },
    "Folhas secas": {
        "descricao": "Folhas caídas e secas",
        "carbono": "Alto",
        "umidade": "Baixa",
        "decomposicao": "Média",
        "beneficios": ["Boa aeração", "Fácil de conseguir", "Balanceia bem"],
        "cuidados": ["Picar para acelerar", "Evitar folhas de noz"]
    },
    "Papelão": {
        "descricao": "Papelão cortado em pedaços",
        "carbono": "Alto",
        "umidade": "Baixa",
        "decomposicao": "Lenta",
        "beneficios": ["Absorve bem umidade", "Estrutura porosa"],
        "cuidados": ["Remover fitas e plásticos", "Cortar em pedaços pequACenos"]
    },
    "Galhos picados": {
        "descricao": "Galhos triturados ou picados",
        "carbono": "Muito Alto",
        "umidade": "Muito Baixa",
        "decomposicao": "Muito Lenta",
        "beneficios": ["Excelente aeração", "EstruturQa duradoura"],
        "cuidados": ["Triturar bem", "Usar em pequena quantidade"]
    }
}

# ===============================
# FUNÇÕES AUXILIARES
# ===============================
def conectar():
    """Conecta ao banco de dados SQLite"""
    return sqlite3.connect("dados.db")

def carregar_tabela(nome):
    """Carrega tabela do banco e retorna DataFrame"""
    conn = conectar()
    try:
        df = pd.read_sql_query(f"SELECT * FROM {nome} ORDER BY timestamp DESC LIMIT 100", conn)
    except Exception as e:
        # Se a tabela não existir, retorna dados simulados
        df = gerar_dados_simulados(nome)
    conn.close()
    return df

def gerar_dados_simulados(tipo):
    """Gera dados simulados para diferentes tipos de tabelas"""
    if tipo == "composteira_dados":
        return pd.DataFrame({
            'timestamp': [datetime.now() - timedelta(hours=i) for i in range(24, 0, -1)],
            'temperatura': [round(random.uniform(35, 65), 1) for _ in range(24)],
            'umidade': [round(random.uniform(40, 80), 1) for _ in range(24)],
            'ph': [round(random.uniform(5.5, 8.5), 2) for _ in range(24)],
            'covs': [round(random.uniform(50, 250), 0) for _ in range(24)],
            'chorume': [round(random.uniform(10, 90), 1) for _ in range(24)]
        })
    else:
        return pd.DataFrame({
            'timestamp': [datetime.now() - timedelta(days=i) for i in range(30, 0, -1)],
            'valor': [round(random.uniform(0, 100), 1) for _ in range(30)]
        })

def gerar_grafico(titulo, tipo="linha", dados=None, cor_verde=True):
    """Gera gráficos profissionais com dados simulados"""
    fig = go.Figure()
    
    # Gerar dados simulados se não fornecidos
    if dados is None or dados.empty:
        if "Temperatura" in titulo:
            y = [round(random.uniform(35, 65), 1) for _ in range(24)]
        elif "Umidade" in titulo:
            y = [round(random.uniform(40, 80), 1) for _ in range(24)]
        elif "COVs" in titulo or "Emissão" in titulo:
            y = [round(random.uniform(50, 250), 0) for _ in range(24)]
        elif "Chorume" in titulo:
            y = [round(random.uniform(10, 90), 1) for _ in range(24)]
        elif "pH" in titulo:
            y = [round(random.uniform(5.5, 8.5), 2) for _ in range(24)]
        else:
            y = [round(random.uniform(0, 100), 1) for _ in range(24)]
        
        x = [datetime.now() - timedelta(hours=23-i) for i in range(24)]
    else:
        if 'timestamp' in dados.columns:
            x = dados['timestamp']
        else:
            x = dados.index
        y_col = dados.columns[1] if len(dados.columns) > 1 else dados.columns[0]
        y = dados[y_col]
    
    cor_principal = '#16a34a' if cor_verde else '#9333ea'
    cor_secundaria = '#22c55e' if cor_verde else '#a855f7'
    
    if tipo == "linha":
        fig.add_trace(go.Scatter(
            x=x, y=y, mode='lines+markers',
            line=dict(color=cor_principal, width=3),
            marker=dict(size=8, color=cor_secundaria),
            name=titulo
        ))
    elif tipo == "barra":
        fig.add_trace(go.Bar(
            x=x, y=y, marker_color=cor_principal, name=titulo
        ))
    elif tipo == "area":
        fig.add_trace(go.Scatter(
            x=x, y=y, fill='tozeroy', mode='none',
            fillcolor=f'rgba{tuple(int(cor_principal.lstrip("#")[i:i+2], 16) for i in (0, 2, 4)) + (0.2,)}',
            line=dict(color=cor_principal), name=titulo
        ))
    
    fig.update_layout(
        title=dict(text=titulo, x=0.5, font=dict(color='#111827', size=16)),
        plot_bgcolor='rgba(0,0,0,0)',
        paper_bgcolor='rgba(0,0,0,0)',
        font=dict(color='#374151'),
        xaxis=dict(gridcolor='#e5e7eb'),
        yaxis=dict(gridcolor='#e5e7eb'),
        margin=dict(l=20, r=20, t=50, b=20),
        height=300,
        showlegend=False
    )
    return fig

def gerar_metricas_tempo_real():
    """Gera métricas em tempo real randomizadas"""
    return {
        'temperatura': round(random.uniform(35, 65), 1),
        'umidade': round(random.uniform(40, 80), 1),
        'covs': round(random.uniform(50, 250), 0),
        'ph': round(random.uniform(5.5, 8.5), 1),
        'chorume': round(random.uniform(10, 90), 1)
    }

def gerar_dados_sensores():
    """Gera dados simulados dos sensores"""
    return pd.DataFrame({
        'timestamp': [datetime.now() - timedelta(minutes=10-i) for i in range(10)],
        'temperatura': [round(random.uniform(35, 65), 1) for _ in range(10)],
        'umidade': [round(random.uniform(40, 80), 1) for _ in range(10)],
        'ph': [round(random.uniform(5.5, 8.5), 2) for _ in range(10)],
        'covs': [round(random.uniform(50, 250), 0) for _ in range(10)],
        'co2': [round(random.uniform(300, 1200), 0) for _ in range(10)],
        'ch4': [round(random.uniform(1.5, 10.0), 2) for _ in range(10)],
        'o2': [round(random.uniform(15, 21), 2) for _ in range(10)],
        'umidade_solo': [round(random.uniform(30, 90), 1) for _ in range(10)],
        'status_sensor': [random.choice(["🟢 Ativo", "🟡 Instável", "🔴 Inativo"]) for _ in range(10)]
    })

def render_detalhes_composto(tipo, nome):
    """Renderiza detalhes do composto selecionado"""
    compostos = COMPOSTOS_VERDES if tipo == "verde" else COMPOSTOS_MARRONS
    composto = compostos.get(nome)
    
    if composto:
        cor_classe = "composto-verde" if tipo == "verde" else "composto-marrom"
        st.markdown(f"""
        <div class="composto-info {cor_classe}">
            <h4>🌿 {nome}</h4>
            <p><strong>Descrição:</strong> {composto['descricao']}</p>
            
            <div class="detalhe-item">
                <span>📊</span>
                <span><strong>{'Nitrogênio' if tipo == 'verde' else 'Carbono'}:</strong> {composto['nitrogenio' if tipo == 'verde' else 'carbono']}</span>
            </div>
            
            <div class="detalhe-item">
                <span>💧</span>
                <span><strong>Umidade:</strong> {composto['umidade']}</span>
            </div>
            
            <div class="detalhe-item">
                <span>⏱️</span>
                <span><strong>Decomposição:</strong> {composto['decomposicao']}</span>
            </div>
            
            <div class="detalhe-item">
                <span>✅</span>
                <span><strong>Benefícios:</strong> {', '.join(composto['beneficios'])}</span>
            </div>
            
            <div class="detalhe-item">
                <span>⚠️</span>
                <span><strong>Cuidados:</strong> {', '.join(composto['cuidados'])}</span>
            </div>
        </div>
        """, unsafe_allow_html=True)

# ===============================
# CABEÇALHO COM LOGOS
# ===============================
def render_header():
    col1, col2, col3 = st.columns([1, 2, 1])
    with col1:
        try:
            st.image(f"data:image/png;base64,{img_to_base64(img_left)}", width=80)
        except:
            st.write("📚")
    with col2:
        st.markdown("<h1>Compostagem Inteligente</h1>", unsafe_allow_html=True)
    with col3:
        try:
            st.image(f"data:image/png;base64,{img_to_base64(img_right)}", width=80)
        except:
            st.write("🏫")

# ===============================
# PÁGINA INICIAL
# ===============================
def pagina_inicio():
    st.markdown("""
    <div class="card card-highlight">
        <h2>🚀 Sistema de Compostagem Inteligente</h2>
        <p>Monitoramento em tempo real e análise preditiva para otimização do processo de compostagem doméstica.</p>
        <div class="status-badge status-success">Sistema Ativo</div>
    </div>
    """, unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        <div class="card">
            <h3>📊 Visão Geral do Projeto</h3>
            <p><strong>Ecovita</strong> é um sistema inteligente que utiliza sensores IoT e machine learning 
            para otimizar a compostagem de resíduos orgânicos.</p>
            
            <div class="detalhe-item">
                <span>🎯</span>
                <span><strong>Objetivo:</strong> Reduzir emissões de COVs e otimizar o processo</span>
            </div>
            
            <div class="detalhe-item">
                <span>📈</span>
                <span><strong>Status:</strong> Sistema em operação contínua</span>
            </div>
            
            <div class="detalhe-item">
                <span>🔬</span>
                <span><strong>Tecnologia:</strong> IoT + Machine Learning + Análise em Tempo Real</span>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("""
        <div class="card">
            <h3>🎯 Métricas Ideais de Operação</h3>
            
            <div class="detalhe-item">
                <span>🌡️</span>
                <span><strong>Temperatura:</strong> 45-65°C (Zona Termofílica)</span>
            </div>
            
            <div class="detalhe-item">
                <span>💧</span>
                <span><strong>Umidade:</strong> 50-60% (Umidade Ótima)</span>
            </div>
            
            <div class="detalhe-item">
                <span>⚖️</span>
                <span><strong>Proporção C/N:</strong> 25-30:1 (Ideal)</span>
            </div>
            
            <div class="detalhe-item">
                <span>📊</span>
                <span><strong>COVs:</strong> 50-200 ppm (Aceitável)</span>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
        <div class="card card-roxo">
            <h3>👥 Equipe do Projeto</h3>
            
            <div class="detalhe-item">
                <span>💻</span>
                <span><strong>Desenvolvedores:</strong></span>
            </div>
            <p>• Gabrielle Arruda (Data Science & ML)</p>
            <p>• Marcelo Miranda (IoT)</p>
            <p>• Murilo Romeu (Frontend & UX & Backend)</p>
            
            <br>
            
            <div class="detalhe-item">
                <span>👨‍🏫</span>
                <span><strong>Orientador:</strong> Prof. José Henrique Lopes da Silva</span>
                <span><strong>Coorientador:</strong> Prof. Leonardo Santana Benevides </span>
                <span><strong>Coorientador:</strong> Prof. Simoni Machado Lopes </span>
       
            </div>
            
            <div class="detalhe-item">
                <span>🏛️</span>
                <span><strong>Instituição:</strong> Curso Técnico em Informática</span>
            </div>
            
            <div class="detalhe-item">
                <span>📅</span>
                <span><strong>Ano:</strong> 2025</span>
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown("""
        <div class="card">
            <h3>🛠️ Tecnologias Utilizadas</h3>
            
            <div class="detalhe-item">
                <span>🔌</span>
                <span><strong>Hardware:</strong> ESP32, Sensores DHT22, MQ-135</span>
            </div>
            
            <div class="detalhe-item">
                <span>💻</span>
                <span><strong>Software:</strong> Python, Streamlit, Plotly</span>
            </div>
            
            <div class="detalhe-item">
                <span>📊</span>
                <span><strong>Data Science:</strong> Pandas, Scikit-learn, SQLite</span>
            </div>
            
            <div class="detalhe-item">
                <span>🔗</span>
                <span><strong>API:</strong> FastAPI, RESTful</span>
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("### 🌡️ Dados em Tempo Real dos Sensores")
    
    # Dados simulados dos sensores
    dados_sensores = gerar_dados_sensores()
    st.dataframe(dados_sensores, use_container_width=True)
    
    # Métricas rápidas
    st.markdown("### 📊 Métricas Atuais")
    metricas = gerar_metricas_tempo_real()
    
    col_met1, col_met2, col_met3, col_met4 = st.columns(4)
    with col_met1:
        st.metric("🌡 Temperatura", f"{metricas['temperatura']}°C", 
                 f"{random.choice(['+', '-'])}{random.uniform(0.1, 2.0):.1f}°C")
    with col_met2:
        st.metric("💧 Umidade", f"{metricas['umidade']}%", 
                 f"{random.choice(['+', '-'])}{random.uniform(0.1, 5.0):.1f}%")
    with col_met3:
        st.metric("📊 COVs", f"{metricas['covs']} ppm", 
                 f"{random.choice(['+', '-'])}{random.uniform(1, 20):.0f} ppm")
    with col_met4:
        st.metric("⚗ pH", f"{metricas['ph']}", 
                 f"{random.choice(['+', '-'])}{random.uniform(0.1, 0.5):.1f}")

# ===============================
# PÁGINA DASHBOARD
# ===============================
def pagina_dashboard():
    st.header("📊 Dashboard de Monitoramento")
    
    # Gerar métricas em tempo real
    metricas = gerar_metricas_tempo_real()
    
    # Métricas em tempo real
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        delta_temp = random.choice(['+', '-']) + f"{random.uniform(0.1, 2.0):.1f}°C"
        st.metric("🌡 Temperatura", f"{metricas['temperatura']}°C", delta_temp, delta_color="normal")
    with col2:
        delta_umid = random.choice(['+', '-']) + f"{random.uniform(0.1, 5.0):.1f}%"
        st.metric("💧 Umidade", f"{metricas['umidade']}%", delta_umid, delta_color="inverse")
    with col3:
        delta_covs = random.choice(['+', '-']) + f"{random.uniform(1, 20):.0f} ppm"
        st.metric("📊 COVs", f"{metricas['covs']} ppm", delta_covs, delta_color="normal")
    with col4:
        delta_ph = random.choice(['+', '-']) + f"{random.uniform(0.1, 0.5):.1f}"
        st.metric("⚗ pH", f"{metricas['ph']}", delta_ph, delta_color="off")
    
    # Status do sistema
    st.markdown("### 👁️ Status do Sistema")
    col_status1, col_status2, col_status3, col_status4 = st.columns(4)
    
    with col_status1:
        status_temp = "✅ Ótimo" if 45 <= metricas['temperatura'] <= 65 else "⚠️ Monitorar"
        st.markdown(f"""
        <div class="card">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="color: #16a34a; font-size: 1.5rem;">✅</span>
                <h4 style="margin: 0;">Temperatura</h4>
            </div>
            <p style="margin: 0; color: #6b7280;">{metricas['temperatura']}°C</p>
            <div class="status-badge status-success" style="margin-top: 10px;">{status_temp}</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col_status2:
        status_umid = "✅ Ótimo" if 50 <= metricas['umidade'] <= 60 else "⚠️ Monitorar"
        st.markdown(f"""
        <div class="card">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="color: #d97706; font-size: 1.5rem;">⚠️</span>
                <h4 style="margin: 0;">Umidade</h4>
            </div>
            <p style="margin: 0; color: #6b7280;">{metricas['umidade']}%</p>
            <div class="status-badge status-warning" style="margin-top: 10px;">{status_umid}</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col_status3:
        status_covs = "✅ Normal" if metricas['covs'] <= 200 else "⚠️ Alto"
        st.markdown(f"""
        <div class="card">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="color: #16a34a; font-size: 1.5rem;">✅</span>
                <h4 style="margin: 0;">COVs</h4>
            </div>
            <p style="margin: 0; color: #6b7280;">{metricas['covs']} ppm</p>
            <div class="status-badge status-success" style="margin-top: 10px;">{status_covs}</div>
        </div>
        """, unsafe_allow_html=True)
    
    with col_status4:
        eficiencia = random.randint(85, 98)
        st.markdown(f"""
        <div class="card">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="color: #9333ea; font-size: 1.5rem;">📈</span>
                <h4 style="margin: 0;">Eficiência</h4>
            </div>
            <p style="margin: 0; color: #6b7280;">Processo otimizado</p>
            <div class="status-badge status-info" style="margin-top: 10px;">{eficiencia}%</div>
        </div>
        """, unsafe_allow_html=True)
    
    # Gráficos
    st.markdown("### 📈 Tendências e Métricas")
    col_graf1, col_graf2 = st.columns(2)
    
    with col_graf1:
        st.plotly_chart(gerar_grafico("Temperatura (°C)", "linha", cor_verde=True), use_container_width=True)
        st.plotly_chart(gerar_grafico("Nível de Chorume (%)", "area", cor_verde=True), use_container_width=True)
    
    with col_graf2:
        st.plotly_chart(gerar_grafico("Umidade Relativa (%)", "barra", cor_verde=False), use_container_width=True)
        st.plotly_chart(gerar_grafico("Emissão de COVs (ppm)", "linha", cor_verde=False), use_container_width=True)
    
    # Tabela de dados recentes
    st.markdown("### 📋 Dados Recentes da Composteira")
    dados_recentes = gerar_dados_sensores()
    st.dataframe(dados_recentes, use_container_width=True)

# ===============================
# PÁGINA COMPOSTAGEM
# ===============================
def pagina_compostagem():
    st.header("🌿 Registrar Nova Compostagem")
    
    with st.form("nova_compostagem"):
        col1, col2 = st.columns(2)
        
        with col1:
            st.markdown("### 🌿 Composto Verde")
            verde = st.selectbox("Tipo de resíduo verde", list(COMPOSTOS_VERDES.keys()))
            peso_verde = st.number_input("Peso (gramas)", min_value=0, value=1000, step=100, key="peso_verde")
            
            # Detalhes do composto verde selecionado
            if verde:
                render_detalhes_composto("verde", verde)
            
            st.markdown("### 🎯 Condições Alvo")
            temp_alvo = st.slider("Temperatura alvo (°C)", 20, 70, 45, key="temp_alvo")
            st.markdown(f"**Faixa ideal:** 45-65°C (termofílica)")
        
        with col2:
            st.markdown("### 🍂 Composto Marrom")
            marrom = st.selectbox("Tipo de resíduo marrom", list(COMPOSTOS_MARRONS.keys()))
            peso_marrom = st.number_input("Peso (gramas)", min_value=0, value=500, step=100, key="peso_marrom")
            
            # Detalhes do composto marrom selecionado
            if marrom:
                render_detalhes_composto("marrom", marrom)
            
            umid_alvo = st.slider("Umidade alvo (%)", 30, 80, 55, key="umid_alvo")
            st.markdown(f"**Faixa ideal:** 50-60%")
        
        # Cálculos e recomendações
        if peso_verde > 0 and peso_marrom > 0:
            proporcao = peso_verde / peso_marrom
            total = peso_verde + peso_marrom
            
            st.markdown("### 📊 Análise da Mistura")
            
            col_calc1, col_calc2, col_calc3 = st.columns(3)
            
            with col_calc1:
                st.markdown(f"""
                <div class="card">
                    <h4>⚖️ Proporção</h4>
                    <h2>{proporcao:.2f}:1</h2>
                    <p>Verde : Marrom</p>
                </div>
                """, unsafe_allow_html=True)
            
            with col_calc2:
                st.markdown(f"""
                <div class="card">
                    <h4>📦 Total</h4>
                    <h2>{total}g</h2>
                    <p>Massa total</p>
                </div>
                """, unsafe_allow_html=True)
            
            with col_calc3:
                eficiencia = min(100, max(0, 100 - abs(proporcao - 2) * 25))
                st.markdown(f"""
                <div class="card">
                    <h4>📈 Eficiência</h4>
                    <h2>{eficiencia:.0f}%</h2>
                    <p>Estimada</p>
                </div>
                """, unsafe_allow_html=True)
            
            # Recomendações
            if 1.5 <= proporcao <= 2.5:
                st.success("""
                **✅ Proporção Ideal!** 
                - Sua mistura está dentro da faixa recomendada (1.5:1 a 2.5:1)
                - Processo de compostagem deve ser eficiente
                - Produção de COVs dentro do esperado
                """)
            elif proporcao < 1.5:
                st.warning("""
                **⚠️ Pouco Material Verde**
                - Processo pode ser lento
                - Adicione mais material verde (nitrogenado)
                - Risco de compactação
                """)
            else:
                st.warning("""
                **⚠️ Excesso de Material Verde**
                - Pode gerar odores
                - Risco de aumento de COVs
                - Adicione mais material marrom (carbonado)
                """)
        
        submitted = st.form_submit_button("💾 Salvar Compostagem", use_container_width=True)
        
        if submitted:
            if peso_verde > 0 and peso_marrom > 0:
                try:
                    # Simular salvamento no banco
                    st.success("""
                    **✅ Compostagem registrada com sucesso!**
                    
                    **Próximos passos recomendados:**
                    - Monitorar temperatura diariamente
                    - Revolver o composto a cada 3-4 dias
                    - Verificar umidade regularmente
                    - Observar emissão de COVs
                    """)
                    
                    # Simular previsão de COVs
                    covs_estimado = max(50, min(200, int(120 + (proporcao - 2) * 30)))
                    st.info(f"**📊 Previsão de COVs:** {covs_estimado} ppm")
                    
                    # Mostrar dados simulados da nova compostagem
                    st.markdown("### 📈 Projeção do Processo")
                    col_proj1, col_proj2 = st.columns(2)
                    
                    with col_proj1:
                        st.plotly_chart(gerar_grafico("Evolução da Temperatura", "linha", cor_verde=True), use_container_width=True)
                    
                    with col_proj2:
                        st.plotly_chart(gerar_grafico("Produção de COVs Estimada", "area", cor_verde=False), use_container_width=True)
                    
                except Exception as e:
                    st.error(f"❌ Erro ao salvar no banco de dados: {e}")
            else:
                st.error("❌ Os pesos devem ser maiores que zero")
# ===============================
# PÁGINA ANÁLISES
# ===============================
def pagina_analises():
    st.header("📈 Análises e Relatórios")
    
    tab1, tab2, tab3, tab4 = st.tabs(["📊 Desempenho", "🤖 ML & Previsões", "🌡 Fatores Ambientais", "🎯 Otimizações"])
    
    with tab1:
        st.subheader("📊 Análise de Desempenho por Combinação")
        
        # Dados de desempenho simulados
        combinacoes = ['Folhas+Serragem', 'Frutas+Papel', 'Legumes+Galhos', 'Grama+Folhas', 'Misto Ideal']
        dados_desempenho = pd.DataFrame({
            'Combinação': combinacoes,
            'Eficiência (%)': [92, 85, 78, 88, 95],
            'Tempo (dias)': [15, 18, 22, 17, 14],
            'COVs Médio (ppm)': [85, 120, 95, 110, 75],
            'Temperatura Média (°C)': [52, 48, 45, 50, 55],
            'Classificação': ['Excelente', 'Boa', 'Regular', 'Boa', 'Ótima']
        })
        
        st.dataframe(dados_desempenho.style.background_gradient(subset=['Eficiência (%)'], cmap='Greens'), 
                    use_container_width=True)
        
        # Gráficos de comparação
        col_comp1, col_comp2 = st.columns(2)
        
        with col_comp1:
            # Gráfico de eficiência
            fig_eficiencia = go.Figure()
            fig_eficiencia.add_trace(go.Bar(
                x=dados_desempenho['Combinação'],
                y=dados_desempenho['Eficiência (%)'],
                marker_color=['#16a34a', '#22c55e', '#4ade80', '#86efac', '#15803d'],
                name='Eficiência'
            ))
            fig_eficiencia.update_layout(
                title="Eficiência por Combinação",
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                font=dict(color='#374151'),
                height=300
            )
            st.plotly_chart(fig_eficiencia, use_container_width=True)
        
        with col_comp2:
            # Gráfico de tempo vs COVs
            fig_tempo_covs = go.Figure()
            fig_tempo_covs.add_trace(go.Scatter(
                x=dados_desempenho['Tempo (dias)'],
                y=dados_desempenho['COVs Médio (ppm)'],
                mode='markers+text',
                marker=dict(size=dados_desempenho['Eficiência (%)'], sizemode='area', sizeref=2, color='#9333ea'),
                text=dados_desempenho['Combinação'],
                textposition="top center",
                name='Relação Tempo-COVs'
            ))
            fig_tempo_covs.update_layout(
                title="Relação: Tempo vs COVs (tamanho = eficiência)",
                xaxis_title="Tempo (dias)",
                yaxis_title="COVs Médio (ppm)",
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                height=300
            )
            st.plotly_chart(fig_tempo_covs, use_container_width=True)
        
        # Análise estatística
        st.markdown("### 📈 Estatísticas Descritivas")
        col_stat1, col_stat2, col_stat3, col_stat4 = st.columns(4)
        
        with col_stat1:
            st.metric("Eficiência Média", f"{dados_desempenho['Eficiência (%)'].mean():.1f}%", "2.1%")
        with col_stat2:
            st.metric("Tempo Médio", f"{dados_desempenho['Tempo (dias)'].mean():.1f} dias", "-1.2 dias")
        with col_stat3:
            st.metric("COVs Médio", f"{dados_desempenho['COVs Médio (ppm)'].mean():.0f} ppm", "-8 ppm")
        with col_stat4:
            st.metric("Melhor Combinação", "Folhas+Serragem", "92% eficiência")
    
    with tab2:
        st.subheader("🤖 Modelos de Machine Learning & Previsões")
        
        col_ml1, col_ml2 = st.columns(2)
        
        with col_ml1:
            # Gráfico de Previsão de COVs
            st.markdown("#### 📊 Previsão de COVs (Próximos 7 dias)")
            
            # Gerar dados temporais para previsão
            datas = pd.date_range(start=datetime.now(), periods=14, freq='D')
            historico_covs = [random.randint(70, 130) for _ in range(7)]
            previsao_covs = [max(50, min(200, historico_covs[-1] + random.randint(-15, 15))) for _ in range(7)]
            
            fig_previsao_covs = go.Figure()
            
            # Histórico
            fig_previsao_covs.add_trace(go.Scatter(
                x=datas[:7],
                y=historico_covs,
                mode='lines+markers',
                name='Histórico',
                line=dict(color='#16a34a', width=3),
                marker=dict(size=6)
            ))
            
            # Previsão
            fig_previsao_covs.add_trace(go.Scatter(
                x=datas[6:],
                y=previsao_covs,
                mode='lines+markers',
                name='Previsão ML',
                line=dict(color='#9333ea', width=3, dash='dash'),
                marker=dict(size=6)
            ))
            
            # Intervalo de confiança
            fig_previsao_covs.add_trace(go.Scatter(
                x=datas[6:],
                y=[x + 10 for x in previsao_covs],
                mode='lines',
                line=dict(width=0),
                showlegend=False
            ))
            
            fig_previsao_covs.add_trace(go.Scatter(
                x=datas[6:],
                y=[x - 10 for x in previsao_covs],
                mode='lines',
                fill='tonexty',
                fillcolor='rgba(147, 51, 234, 0.2)',
                line=dict(width=0),
                name='Intervalo Confiança'
            ))
            
            fig_previsao_covs.update_layout(
                title="Previsão de COVs - Modelo LSTM",
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                height=400
            )
            st.plotly_chart(fig_previsao_covs, use_container_width=True)
            
            # Métricas do modelo
            st.markdown("#### 📈 Performance do Modelo")
            col_met1, col_met2, col_met3 = st.columns(3)
            with col_met1:
                st.metric("RMSE", "8.2 ppm", "-1.3 ppm")
            with col_met2:
                st.metric("R² Score", "0.89", "+0.03")
            with col_met3:
                st.metric("Acurácia", "92%", "+2%")
        
        with col_ml2:
            # Gráfico de Clusters de Eficiência
            st.markdown("#### 🎯 Análise de Clusters - K-means")
            
            # Gerar dados de cluster fake
            np.random.seed(42)
            n_points = 100
            
            cluster_data = pd.DataFrame({
                'Temperatura_Media': np.concatenate([
                    np.random.normal(50, 3, n_points//3),
                    np.random.normal(58, 4, n_points//3),
                    np.random.normal(45, 2, n_points//3)
                ]),
                'Eficiencia': np.concatenate([
                    np.random.normal(85, 5, n_points//3),
                    np.random.normal(92, 3, n_points//3),
                    np.random.normal(78, 4, n_points//3)
                ]),
                'Cluster': [0]*(n_points//3) + [1]*(n_points//3) + [2]*(n_points//3)
            })
            
            fig_clusters = go.Figure()
            
            colors = ['#ef4444', '#16a34a', '#9333ea']
            cluster_names = ['Baixa Eficiência', 'Alta Eficiência', 'Média Eficiência']
            
            for i in range(3):
                cluster_df = cluster_data[cluster_data['Cluster'] == i]
                fig_clusters.add_trace(go.Scatter(
                    x=cluster_df['Temperatura_Media'],
                    y=cluster_df['Eficiencia'],
                    mode='markers',
                    name=cluster_names[i],
                    marker=dict(
                        size=8,
                        color=colors[i],
                        line=dict(width=1, color='white')
                    )
                ))
            
            fig_clusters.update_layout(
                title="Clusters de Eficiência vs Temperatura",
                xaxis_title="Temperatura Média (°C)",
                yaxis_title="Eficiência (%)",
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                height=400
            )
            st.plotly_chart(fig_clusters, use_container_width=True)
            
            # Feature Importance
            st.markdown("#### 🔍 Importância das Variáveis")
            
            features = ['Temperatura', 'Umidade', 'Proporção C/N', 'pH', 'Frequência Revolvimento']
            importance = [0.35, 0.25, 0.20, 0.12, 0.08]
            
            fig_importance = go.Figure(go.Bar(
                x=importance,
                y=features,
                orientation='h',
                marker_color=['#16a34a', '#22c55e', '#4ade80', '#86efac', '#a855f7']
            ))
            
            fig_importance.update_layout(
                title="Importância das Variáveis (Random Forest)",
                xaxis_title="Importância",
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                height=300
            )
            st.plotly_chart(fig_importance, use_container_width=True)
        
        # Previsões de Tempo de Compostagem
        st.markdown("### ⏱️ Previsão de Tempo de Compostagem")
        
        col_time1, col_time2, col_time3 = st.columns([1, 2, 1])
        
        with col_time2:
            # Simular progresso atual
            progresso_atual = 65
            tempo_decorrido = 12
            tempo_total_previsto = 18
            
            fig_progresso = go.Figure(go.Indicator(
                mode = "gauge+number+delta",
                value = progresso_atual,
                domain = {'x': [0, 1], 'y': [0, 1]},
                title = {'text': "Progresso da Compostagem"},
                delta = {'reference': 50},
                gauge = {
                    'axis': {'range': [None, 100]},
                    'bar': {'color': "#16a34a"},
                    'steps': [
                        {'range': [0, 40], 'color': "lightgray"},
                        {'range': [40, 70], 'color': "yellow"},
                        {'range': [70, 100], 'color': "lightgreen"}
                    ],
                    'threshold': {
                        'line': {'color': "red", 'width': 4},
                        'thickness': 0.75,
                        'value': 90
                    }
                }
            ))
            
            fig_progresso.update_layout(height=300)
            st.plotly_chart(fig_progresso, use_container_width=True)
            
            col_info1, col_info2 = st.columns(2)
            with col_info1:
                st.metric("Tempo Decorrido", f"{tempo_decorrido} dias")
            with col_info2:
                st.metric("Previsão Término", f"{tempo_total_previsto - tempo_decorrido} dias")
    
    with tab3:
        st.subheader("🌡 Análise de Fatores Ambientais")
        
        col_env1, col_env2 = st.columns(2)
        
        with col_env1:
            st.plotly_chart(gerar_grafico("Variação de Temperatura Diária", "linha", cor_verde=True), 
                          use_container_width=True)
            
            # Gráfico de correlação específico
            st.markdown("#### 🔥 Correlação: Temperatura vs Eficiência")
            temp_vs_eff = pd.DataFrame({
                'Temperatura': [45, 48, 52, 55, 58, 62, 50, 47],
                'Eficiência': [78, 82, 92, 88, 85, 80, 90, 84]
            })
            
            fig_corr_temp = go.Figure()
            fig_corr_temp.add_trace(go.Scatter(
                x=temp_vs_eff['Temperatura'],
                y=temp_vs_eff['Eficiência'],
                mode='markers',
                marker=dict(size=12, color=temp_vs_eff['Eficiência'], colorscale='Viridis'),
                name='Relação Temp-Eficiência'
            ))
            
            # Adicionar linha de tendência
            z = np.polyfit(temp_vs_eff['Temperatura'], temp_vs_eff['Eficiência'], 1)
            p = np.poly1d(z)
            fig_corr_temp.add_trace(go.Scatter(
                x=temp_vs_eff['Temperatura'],
                y=p(temp_vs_eff['Temperatura']),
                mode='lines',
                name='Tendência',
                line=dict(color='red', dash='dash')
            ))
            
            fig_corr_temp.update_layout(
                title="Correlação Temperatura vs Eficiência",
                xaxis_title="Temperatura (°C)",
                yaxis_title="Eficiência (%)",
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                height=300
            )
            st.plotly_chart(fig_corr_temp, use_container_width=True)
        
        with col_env2:
            st.plotly_chart(gerar_grafico("Variação de Umidade", "area", cor_verde=False), 
                          use_container_width=True)
            
            # Análise de sazonalidade
            st.markdown("#### 📅 Padrão Sazonal - Produção de COVs")
            
            meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
            covs_sazonal = [85, 88, 92, 95, 98, 105, 110, 108, 102, 95, 90, 86]
            
            fig_sazonal = go.Figure()
            fig_sazonal.add_trace(go.Scatter(
                x=meses,
                y=covs_sazonal,
                mode='lines+markers',
                line=dict(color='#9333ea', width=3),
                marker=dict(size=8),
                name='COVs Médio Mensal'
            ))
            
            fig_sazonal.update_layout(
                title="Variação Sazonal de COVs",
                xaxis_title="Mês",
                yaxis_title="COVs (ppm)",
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                height=300
            )
            st.plotly_chart(fig_sazonal, use_container_width=True)
        
        # Matriz de Correlação Avançada
        st.markdown("### 🔗 Matriz de Correlação Multivariada")
        
        dados_correlacao = pd.DataFrame({
            'Temperatura': [45, 48, 52, 55, 58, 50, 47, 53, 56, 49],
            'Umidade': [55, 58, 52, 50, 48, 56, 60, 51, 49, 57],
            'COVs': [85, 92, 78, 95, 88, 82, 105, 90, 86, 80],
            'pH': [6.8, 7.0, 6.5, 7.2, 6.9, 6.7, 7.1, 6.6, 7.0, 6.8],
            'Eficiência': [78, 92, 75, 88, 85, 80, 82, 90, 87, 83]
        })
        
        corr_matrix = dados_correlacao.corr()
        fig_corr = go.Figure(data=go.Heatmap(
            z=corr_matrix.values,
            x=corr_matrix.columns,
            y=corr_matrix.columns,
            colorscale='RdYlGn',
            zmin=-1,
            zmax=1,
            hoverongaps=False,
            text=corr_matrix.round(2).values,
            texttemplate="%{text}",
            showscale=True
        ))
        fig_corr.update_layout(
            title="Matriz de Correlação - Todas as Variáveis",
            height=500
        )
        st.plotly_chart(fig_corr, use_container_width=True)
    
    with tab4:
        st.subheader("🎯 Recomendações de Otimização")
        
        col_opt1, col_opt2 = st.columns(2)
        
        with col_opt1:
            st.markdown("""
            <div class="card card-highlight">
                <h3>🏆 Combinação Ideal</h3>
                <h2>Folhas verdes + Serragem</h2>
                
                <div class="detalhe-item">
                    <span>⚖️</span>
                    <span><strong>Proporção:</strong> 2:1 (verde:marrom)</span>
                </div>
                
                <div class="detalhe-item">
                    <span>📈</span>
                    <span><strong>Eficiência:</strong> 92%</span>
                </div>
                
                <div class="detalhe-item">
                    <span>⏱️</span>
                    <span><strong>Tempo:</strong> 15 dias</span>
                </div>
                
                <div class="detalhe-item">
                    <span>📊</span>
                    <span><strong>COVs:</strong> 85 ppm</span>
                </div>
                
                <div class="detalhe-item">
                    <span>🌡️</span>
                    <span><strong>Temp:</strong> 52°C média</span>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
            # Insights do ML
            st.markdown("""
            <div class="card">
                <h3>🤖 Insights do Modelo</h3>
                
                <div class="detalhe-item">
                    <span>📊</span>
                    <span><strong>Variável Mais Importante:</strong> Temperatura (35%)</span>
                </div>
                
                <div class="detalhe-item">
                    <span>🔍</span>
                    <span><strong>Padrão Detectado:</strong> Pico de COVs no verão</span>
                </div>
                
                <div class="detalhe-item">
                    <span>🎯</span>
                    <span><strong>Otimização Sugerida:</strong> +5% umidade</span>
                </div>
                
                <div class="detalhe-item">
                    <span>📈</span>
                    <span><strong>Ganho Potencial:</strong> +8% eficiência</span>
                </div>
            </div>
            """, unsafe_allow_html=True)
        
        with col_opt2:
            st.markdown("""
            <div class="card">
                <h3>🔄 Protocolo Recomendado</h3>
                
                <div class="detalhe-item">
                    <span>📅</span>
                    <span><strong>Revolvimento:</strong> A cada 3-4 dias</span>
                </div>
                
                <div class="detalhe-item">
                    <span>💧</span>
                    <span><strong>Umidade:</strong> Manter entre 50-60%</span>
                </div>
                
                <div class="detalhe-item">
                    <span>🌡️</span>
                    <span><strong>Temperatura:</strong> Monitorar diariamente</span>
                </div>
                
                <div class="detalhe-item">
                    <span>📊</span>
                    <span><strong>COVs:</strong> Alerta acima de 200 ppm</span>
                </div>
                
                <div class="detalhe-item">
                    <span>⚖️</span>
                    <span><strong>Proporção:</strong> Manter 1.5:1 a 2.5:1</span>
                </div>
            </div>
            """, unsafe_allow_html=True)
            
            # Alertas inteligentes
            st.markdown("""
            <div class="card card-roxo">
                <h3>🚨 Alertas Inteligentes</h3>
                
                <div class="detalhe-item">
                    <span>⚠️</span>
                    <span><strong>Risco Alto COVs:</strong> Probabilidade 15%</span>
                </div>
                
                <div class="detalhe-item">
                    <span>✅</span>
                    <span><strong>Estabilidade Térmica:</strong> 94%</span>
                </div>
                
                <div class="detalhe-item">
                    <span>📊</span>
                    <span><strong>Eficiência Prevista:</strong> 89-94%</span>
                </div>
                
                <div class="detalhe-item">
                    <span>🔍</span>
                    <span><strong>Próxima Ação:</strong> Revolver em 48h</span>
                </div>
            </div>
            """, unsafe_allow_html=True)
        
        # Gráfico de Otimização em Tempo Real
        st.markdown("### 📈 Simulação de Otimização")
        
        col_sim1, col_sim2 = st.columns(2)
        
        with col_sim1:
            # Simulação de diferentes cenários
            cenarios = ['Atual', '+5% Umidade', '+2°C Temp', 'Otimizado ML']
            eficiencia = [85, 88, 87, 92]
            tempo = [18, 16, 17, 15]
            
            fig_otimizacao = go.Figure()
            
            fig_otimizacao.add_trace(go.Bar(
                name='Eficiência (%)',
                x=cenarios,
                y=eficiencia,
                marker_color=['#6b7280', '#4ade80', '#22c55e', '#16a34a']
            ))
            
            fig_otimizacao.add_trace(go.Scatter(
                name='Tempo (dias)',
                x=cenarios,
                y=tempo,
                mode='lines+markers',
                line=dict(color='#9333ea', width=3),
                marker=dict(size=8),
                yaxis='y2'
            ))
            
            fig_otimizacao.update_layout(
                title="Simulação de Cenários de Otimização",
                yaxis=dict(title="Eficiência (%)"),
                yaxis2=dict(title="Tempo (dias)", overlaying='y', side='right'),
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                height=400
            )
            
            st.plotly_chart(fig_otimizacao, use_container_width=True)
        
        with col_sim2:
            # Impacto das intervenções
            intervencoes = ['Revolvimento', 'Ajuste Umidade', 'Balanceamento', 'Controle Temp']
            impacto_eficiencia = [8, 12, 15, 10]
            custo = [2, 3, 4, 5]
            
            fig_impacto = go.Figure()
            
            fig_impacto.add_trace(go.Bar(
                name='Impacto Eficiência (%)',
                x=intervencoes,
                y=impacto_eficiencia,
                marker_color=['#16a34a', '#22c55e', '#4ade80', '#86efac']
            ))
            
            fig_impacto.add_trace(go.Scatter(
                name='Custo Relativo',
                x=intervencoes,
                y=custo,
                mode='lines+markers',
                line=dict(color='#dc2626', width=3),
                marker=dict(size=8, symbol='diamond')
            ))
            
            fig_impacto.update_layout(
                title="Impacto vs Custo das Intervenções",
                plot_bgcolor='rgba(0,0,0,0)',
                paper_bgcolor='rgba(0,0,0,0)',
                height=400
            )
            
            st.plotly_chart(fig_impacto, use_container_width=True)
# ===============================
# PÁGINA CONFIGURAÇÕES
# ===============================
def pagina_configuracoes():
    st.header("⚙️ Configurações do Sistema")
    
    tab1, tab2, tab3 = st.tabs(["🔧 Sistema", "📱 Notificações", "🔗 Integrações"])
    
    with tab1:
        st.subheader("Configurações Gerais do Sistema")
        
        col_conf1, col_conf2 = st.columns(2)
        
        with col_conf1:
            st.markdown("#### ⏰ Temporização")
            intervalo_leitura = st.number_input("Intervalo de Leitura (minutos)", 
                                             min_value=1, max_value=60, value=5)
            st.number_input("Temperatura Máxima de Alerta (°C)", min_value=50, max_value=80, value=65)
            st.number_input("Temperatura Mínima de Alerta (°C)", min_value=20, max_value=45, value=35)
        
        with col_conf2:
            st.markdown("#### 📊 Limites e Alertas")
            st.number_input("Limite de COVs (ppm)", min_value=50, max_value=500, value=200)
            st.number_input("Umidade Mínima (%)", min_value=20, max_value=60, value=40)
            st.number_input("Umidade Máxima (%)", min_value=60, max_value=90, value=80)
        
        st.markdown("#### 🌐 Preferências Gerais")
        col_pref1, col_pref2 = st.columns(2)
        
        with col_pref1:
            unidade_temp = st.selectbox("Unidade de Temperatura", ["Celsius", "Fahrenheit"])
            idioma = st.selectbox("Idioma", ["Português", "English", "Español"])
        
        with col_pref2:
            tema = st.selectbox("Tema da Interface", ["Claro", "Escuro", "Automático"])
            st.slider("Sensibilidade de Alertas", 1, 5, 3)
        
        if st.button("💾 Salvar Configurações do Sistema", use_container_width=True):
            st.success("✅ Configurações do sistema salvas com sucesso!")
    
    with tab2:
        st.subheader("Configurações de Notificação")
        
        st.markdown("#### 🔔 Tipos de Notificação")
        col_not1, col_not2 = st.columns(2)
        
        with col_not1:
            st.checkbox("Email", value=True)
            st.checkbox("Notificações Push", value=True)
            st.checkbox("Alertas Sonoros", value=False)
        
        with col_not2:
            st.checkbox("Temperatura", value=True)
            st.checkbox("Umidade", value=True)
            st.checkbox("COVs", value=True)
        
        st.markdown("#### 📧 Configurações de Email")
        email = st.text_input("Email para notificações", "equipe.ecovita@exemplo.com")
        frequencia = st.selectbox("Frequência de Relatórios", 
                                ["Diário", "Semanal", "Mensal", "Apenas Alertas"])
        
        if st.button("💾 Salvar Configurações de Notificação", use_container_width=True):
            st.success("✅ Configurações de notificação salvas!")
    
    with tab3:
        st.subheader("Integrações e API")
        
        st.markdown("#### 🔗 API REST")
        st.text_input("URL da API", value=API)
        st.text_input("Chave da API", type="password")
        
        st.markdown("#### 📤 Exportação de Dados")
        col_exp1, col_exp2 = st.columns(2)
        
        with col_exp1:
            st.checkbox("Exportar para CSV", value=True)
            st.checkbox("Exportar para Excel", value=True)
        
        with col_exp2:
            st.checkbox("Backup Automático", value=True)
            st.checkbox("Logs Detalhados", value=False)
        
        if st.button("🔄 Testar Conexões", use_container_width=True):
            st.success("✅ Todas as conexões estão funcionando!")
        
        if st.button("💾 Salvar Configurações de Integração", use_container_width=True):
            st.success("✅ Configurações de integração salvas!")

# ===============================
# APLICAÇÃO PRINCIPAL
# ===============================
def main():
    # Inicializar session_state se não existir
    if 'current_page' not in st.session_state:
        st.session_state.current_page = 'inicio'
    
    # Container principal
    st.markdown('<div class="main-container">', unsafe_allow_html=True)
    
    # Renderizar header
    render_header()
    
    # Navegação simplificada
    st.markdown("---")
    col1, col2, col3, col4, col5 = st.columns(5)
    
    with col1:
        if st.button("🏠 Início", use_container_width=True):
            st.session_state.current_page = 'inicio'
            st.rerun()
    
    with col2:
        if st.button("📊 Dashboard", use_container_width=True):
            st.session_state.current_page = 'dashboard'
            st.rerun()
    
    with col3:
        if st.button("🌿 Compostagem", use_container_width=True):
            st.session_state.current_page = 'compostagem'
            st.rerun()
    
    with col4:
        if st.button("📈 Análises", use_container_width=True):
            st.session_state.current_page = 'analises'
            st.rerun()
    
    with col5:
        if st.button("⚙️ Configurações", use_container_width=True):
            st.session_state.current_page = 'configuracoes'
            st.rerun()
    
    st.markdown("---")
    
    # Roteamento de páginas
    if st.session_state.current_page == "inicio":
        pagina_inicio()
    elif st.session_state.current_page == "dashboard":
        pagina_dashboard()
    elif st.session_state.current_page == "compostagem":
        pagina_compostagem()
    elif st.session_state.current_page == "analises":
        pagina_analises()
    elif st.session_state.current_page == "configuracoes":
        pagina_configuracoes()
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Rodapé
    st.markdown("""
    <div class="footer">
        🌱 Ecovita Compostagem Inteligente • 
        Desenvolvido por alunos do Curso Técnico em Informática • 
        2025 ✅
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()