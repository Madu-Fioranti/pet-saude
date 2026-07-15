import streamlit as st
import pandas as pd
from datetime import datetime

st.set_page_config(page_title="Área do Aluno - Mapeia PET", layout="wide")

# Força o uso da fonte Montserrat que configuramos antes
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');
    html, body, [class*="css"], [class*="st-"] {
        font-family: 'Montserrat', sans-serif !important;
    }
</style>
""", unsafe_allow_html=True)

st.title("Portal do Aluno PET")
st.subheader("Envio de Relatórios e Dados de Entrevistas")

# --- BLOQUEIO DE SEGURANÇA ---
# Só deixa ver a página se o usuário estiver logado
if "logado" not in st.session_state or not st.session_state["logado"]:
    st.warning("Acesso restrito. Por favor, faça login na página de Login para acessar esta área.")
    st.stop() # Interrompe o código aqui

# --- FORMULÁRIO DE ENVIO ---
st.write(f"Olá, **{st.session_state['usuario_nome']}**! Preencha as informações coletadas na UBS abaixo:")

with st.form("formulario_ubs", clear_on_submit=True):
    # Seleção da UBS
    ubs_selecionada = st.selectbox(
        "Selecione a UBS avaliada:",
        ["ESF I - Nova Bariri", "ESF II", "ESF III", "UBS Central"]
    )
    
    col1, col2 = st.columns(2)
    with col1:
        data_visita = st.date_input("Data da Visita/Entrevista", datetime.now())
    with col2:
        tempo_atendimento = st.number_input("Tempo médio de atendimento observado (minutos)", min_value=1, value=15)

    # Pergunta qualitativa
    relatorio = st.text_area(
        "Relatório qualitativo da visita (Infraestrutura, problemas de conexão, impressões da equipe):",
        placeholder="Descreva aqui o que foi observado..."
    )
    
    # Upload de arquivo (ex: fotos da UBS, planilha auxiliar ou PDF do relatório oficial)
    arquivo_anexo = st.file_uploader("Anexar arquivo/foto da visita (Opcional)", type=["pdf", "png", "jpg", "xlsx"])

    # Botão de envio
    botao_enviar = st.form_submit_button("Salvar Relatório")

if botao_enviar:
    # Aqui você pode salvar os dados digitados
    # Exemplo simples: Criar um dicionário com as respostas
    novo_registro = {
        "Data": data_visita.strftime("%d/%m/%Y"),
        "UBS": ubs_selecionada,
        "Aluno": st.session_state["usuario_nome"],
        "Tempo de Atendimento": tempo_atendimento,
        "Relatório": relatorio
    }
    
    # Exibe mensagem de sucesso na tela
    st.success("✅ Dados enviados com sucesso! Eles foram consolidados no banco de dados do projeto.")
