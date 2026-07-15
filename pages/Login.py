import streamlit as st
st.set_page_config(
    page_title="Área do Aluno - Mapeia PET",
    page_icon="Captura de tela 2026-07-15 081603.png", # Ícone da aba
    layout="wide"
)

# Adiciona a logo acima do menu lateral
st.logo("Captura de tela 2026-07-15 081603.png")
st.set_page_config(page_title="Login - Mapeia PET")

st.title("Login do Sistema")

usuario = st.text_input("Usuário (E-mail)")
senha = st.text_input("Senha", type="password")

if st.button("Entrar"):
    # Validação simples (você pode colocar as senhas dos alunos aqui ou conectar a um banco)
    if usuario == "g4@petsaude.br" and senha == "pet123":
        st.session_state["logado"] = True
        st.session_state["usuario_nome"] = "Membro G4"
        st.success("Login realizado com sucesso! Vá para a 'Área do Aluno' no menu lateral.")
    else:
        st.error("Usuário ou senha incorretos.")
