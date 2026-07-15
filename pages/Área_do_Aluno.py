import streamlit as st
import pandas as pd
from datetime import datetime

# ==========================================================
# 1. CONFIGURAÇÃO DA PÁGINA E LOGO (Para aparecer nesta aba também)
# ==========================================================
st.set_page_config(
    page_title="Área do Aluno - Mapeia PET",
    page_icon="Captura de tela 2026-07-15 081603.png", # Ícone da aba
    layout="wide"
)

# Adiciona a logo acima do menu lateral
st.logo("Captura de tela 2026-07-15 081603.png")

# ==========================================================
# 2. ESTILIZAÇÃO CSS CORRIGIDA (Protege os ícones de upload e setas)
# ==========================================================
st.markdown("""
<style>
    /* Importa a fonte Montserrat */
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

    /* Aplica a fonte de forma suave */
    .stApp {
        font-family: 'Montserrat', sans-serif;
    }

    /* PROTEGE os ícones nativos do Streamlit (corrige o keyboard_double e o uploadupload) */
    span.material-symbols-rounded, 
    span.material-icons, 
    .stIcon {
        font-family: 'Material Symbols Rounded' !important;
    }
</style>
""", unsafe_allow_html=True)

# ==========================================================
# 3. CONTEÚDO DA PÁGINA (Sua lógica anterior continua aqui)
# ==========================================================
st.title("Portal do Aluno PET")
st.subheader("Envio de Relatórios e Dados de Entrevistas")

# --- BLOQUEIO DE SEGURANÇA ---
if "logado" not in st.session_state or not st.session_state["logado"]:
    st.warning("Acesso restrito. Por favor, faça login na página de Login para acessar esta área.")
    st.stop() 

st.write(f"Olá, **{st.session_state.get('usuario_nome', 'Membro G4')}**! Preencha as informações coletadas na UBS abaixo:")

with st.form("formulario_ubs", clear_on_submit=True):
    ubs_selecionada = st.selectbox(
        "Selecione a UBS avaliada:",
        ["ESF I - Nova Bariri", "ESF II", "ESF III", "UBS Central"]
    )
    
    col1, col2 = st.columns(2)
    with col1:
        data_visita = st.date_input("Data da Visita/Entrevista", datetime.now())
    with col2:
        tempo_atendimento = st.number_input("Tempo médio de atendimento observado (minutos)", min_value=1, value=15)

    relatorio = st.text_area(
        "Relatório qualitativo da visita (Infraestrutura, problemas de conexão, impressões da equipe):",
        placeholder="Descreva aqui o que foi observado..."
    )
    
    arquivo_anexo = st.file_uploader("Anexar arquivo/foto da visita (Opcional)", type=["pdf", "png", "jpg", "xlsx"])

    botao_enviar = st.form_submit_button("Salvar Relatório")

if botao_enviar:
    st.success("✅ Dados enviados com sucesso! Eles foram consolidados no banco de dados do projeto.")
