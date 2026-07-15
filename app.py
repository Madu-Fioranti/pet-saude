# -*- coding: utf-8 -*-
"""
Mapeia PET - Saúde Digital
Aplicativo para análise inteligente do fluxo e estresse digital nas UBSs de Bariri - SP.
"""

import streamlit as st
import pandas as pd
import folium
from streamlit_folium import st_folium
import google.generativeai as genai
import json

# ==========================================================
# 1. CONFIGURAÇÃO DA PÁGINA E LOGO (INSERIDOS AQUI)
# ==========================================================
st.set_page_config(
    page_title="Mapeia PET",
    page_icon="Captura de tela 2026-07-15 081603.png",  # Logo na aba do navegador
    layout="wide",
    initial_sidebar_state="expanded"
)

# Adiciona a logo no canto superior esquerdo (acima da barra lateral)
st.logo("Captura de tela 2026-07-15 081603.png")


# ==========================================================
# 2. ESTILIZAÇÃO CSS (AGORA COM A FONTE MONTSERRAT)
# ==========================================================
st.markdown("""
<style>
    /* Importa a fonte para combinar com a logo */
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap');

    /* 1. Aplica a nova fonte de forma suave, sem forçar em cima dos ícones */
    .stApp {
        font-family: 'Montserrat', sans-serif;
    }

    /* 2. PROTEGE os ícones nativos do Streamlit para eles voltarem a aparecer */
    span.material-symbols-rounded, 
    span.material-icons, 
    .stIcon {
        font-family: 'Material Symbols Rounded' !important;
    }

    /* ========================================= */
    /* O RESTO DO SEU CSS CONTINUA NORMAL ABAIXO */
    /* ========================================= */
    
    .main-title {
        font-size: 2.5rem;
        font-weight: 700;
        color: #002B49;
        margin-bottom: 0.5rem;
    }
    .subtitle {
        font-size: 1.1rem;
        color: #00B259;
        margin-bottom: 2rem;
        font-weight: 600;
    }
    .metric-card {
        background-color: #F3F4F6;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 5px solid #00B259;
        margin-bottom: 1rem;
    }
    .metric-card-alert {
        background-color: #FEF2F2;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 5px solid #EF4444;
        margin-bottom: 1rem;
    }
    .sidebar-title {
        font-weight: bold;
        color: #002B49;
    }
    .stAlert {
        border-radius: 0.5rem;
    }
</style>
""", unsafe_allow_html=True)



# ==========================================================
# O RESTANTE DO SEU CÓDIGO CONTINUA INTACTO A PARTIR DAQUI
# ==========================================================
# Configuração da página do Streamlit
st.set_page_config(
    page_title="SUS-Digital Maps Bariri",
    page_icon="",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Estilização CSS personalizada para dar um acabamento premium ao Streamlit
st.markdown("""
<style>
    .main-title {
        font-family: 'Inter', sans-serif;
        font-size: 2.5rem;
        font-weight: 700;
        color: #1E3A8A;
        margin-bottom: 0.5rem;
    }
    .subtitle {
        font-family: 'Inter', sans-serif;
        font-size: 1.1rem;
        color: #4B5563;
        margin-bottom: 2rem;
    }
    .metric-card {
        background-color: #F3F4F6;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 5px solid #10B981;
        margin-bottom: 1rem;
    }
    .metric-card-alert {
        background-color: #FEF2F2;
        padding: 1rem;
        border-radius: 0.5rem;
        border-left: 5px solid #EF4444;
        margin-bottom: 1rem;
    }
    .sidebar-title {
        font-weight: bold;
        color: #1E3A8A;
    }
    .stAlert {
        border-radius: 0.5rem;
    }
</style>
""", unsafe_allow_html=True)

# 1. ESTRUTURA DE DADOS REALISTA (6 Simulações baseadas nas UBSs/ESFs de Bariri)
@st.cache_data
def carregar_dados_simulados():
    dados = [
        {
            "ID da resposta": 1,
            "Hora de início": "2026-07-14 08:00:00",
            "Hora de conclusão": "2026-07-14 08:05:00",
            "Nome completo:": "Mariana de Souza Oliveira",
            "Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?": "UBS Central (José Francisco Belluzzo)",
            "Qual o seu cargo atual na UBS?": "Enfermeiro",
            "Quais ferramentas e registros são utilizados ao longo do fluxo de atendimento do paciente?": "Prontuário Eletrônico/e-SUS APS e Prontuário Físico (Papel)",
            "Existe um protocolo formal e claro que define qual profissional é responsável por alimentar o sistema em cada etapa?": "Existe um protocolo, mas o registro acaba sendo compartilhado/flexível na rotina.",
            "Na sua percepção, a localização geográfica da unidade cria barreiras de acesso para a população local?": "Não, a localização é central ou de fácil acesso para todos.",
            "Qual é o perfil de faixa etária predominante dos usuários que geram a maior demanda na unidade?": "Predominantemente Idosos (Terceira Idade)",
            "Na sua percepção, qual é o perfil socioeconômica predominante (classe social) dos usuários que mais frequentam esta Unidade de Saúde?": "Perfil Misto: A unidade atende a todas as classes sociais de forma equilibrada.",
            "Com que frequência os prontuários dos usuários são atualizados no e-SUS APS?": "Imediatamente após a finalização de cada atendimento.",
            "Há necessidade de duplicar a informação, registrando o mesmo atendimento in mais de um local (ex: papel e sistema)?": "Às vezes, apenas em situações específicas ou quando o sistema cai.",
            "Com que frequência você precisa registrar a mesma informação de um único atendimento em mais de um local?": "Às vezes: Apenas quando o sistema principal cai.",
            "Quando ocorre a duplicidade de registro, em quais locais a informação precisa ser replicada? (Marque todas as opções que se aplicam na sua rotina)": "Sistema oficial (e-SUS APS) + Prontuário de papel (Ficha física do paciente).",
            "O preenchimento das informações clínicas nos sistemas segue um padrão rígido estabelecido pela gestão?": "Há uma padronização básica, mas com muita variação pessoal.",
            "Quando surgem dúvidas operacionais no sistema, a equipe possui materiais de apoio acessíveis?": "Existem manuais, mas são confusos ou de difícil localização.",
            "Qual é o política de login aplicada para o acesso aos computadores e sistemas?": "Login 100% individual (usuário e senha exclusivos por servidor).",
            "Há uso de dispositivos eletrônicos pessoais (celulares/tablets) para fins de trabalho na unidade?": "Não, utilizamos estritamente os equipamentos fornecidos pela unidade.",
            "Em uma escala de 1 a 5, quanto você considera que o prontuário eletrônico melhora a qualidade do cuidado ao paciente?": 4,
            "Quais são os principais benefícios práticos percebidos com o uso dos sistemas digitais?": "Rapidez no acesso ao histórico do paciente; Maior segurança.",
            "Em média, quantos minutos você gasta preenchendo o sistema após a consulta de um paciente?": "4 minutos",
            "Com que frequência a lentidão ou travamento do sistema atrasa o fluxo de atendimento da sua agenda?": "Várias vezes na semana."
        },
        {
            "ID da resposta": 2,
            "Hora de início": "2026-07-14 09:10:00",
            "Hora de conclusão": "2026-07-14 09:15:00",
            "Nome completo:": "Dr. Carlos Eduardo Medeiros",
            "Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?": "ESF I - Nova Bariri",
            "Qual o seu cargo atual na UBS?": "Médico",
            "Quais ferramentas e registros são utilizados ao longo do fluxo de atendimento do paciente?": "Prontuário Eletrônico/e-SUS APS",
            "Existe um protocolo formal e claro que define qual profissional é responsável por alimentar o sistema em cada etapa?": "Sim, existe um protocolo rígido e todos seguem.",
            "Na sua percepção, a localização geográfica da unidade cria barreiras de acesso para a população local?": "Não, a localização é central ou de fácil acesso para todos.",
            "Qual é o perfil de faixa etária predominante dos usuários que geram a maior demanda na unidade?": "Distribuição mista (bem equilibrada entre todas as idades)",
            "Na sua percepção, qual é o perfil socioeconômica predominante (classe social) dos usuários que mais frequentam esta Unidade de Saúde?": "Classe Média-Baixa: Trabalhadores assalariados, autônomos e famílias com orçamento mais apertado.",
            "Com que frequência os prontuários dos usuários são atualizados no e-SUS APS?": "Imediatamente após a finalização de cada atendimento.",
            "Há necessidade de duplicar a informação, registrando o mesmo atendimento in mais de um local (ex: papel e sistema)?": "Não, o registro é feito exclusivamente em uma única plataforma oficial.",
            "Com que frequência você precisa registrar a mesma informação de um único atendimento em mais de um local?": "Nunca: O registro é feito exclusivamente uma única vez no sistema oficial.",
            "Quando ocorre a duplicidade de registro, em quais locais a informação precisa ser replicada? (Marque todas as opções que se aplicam na sua rotina)": "Não se aplica (Não realizo registros duplicados).",
            "O preenchimento das informações clínicas nos sistemas segue um padrão rígido estabelecido pela gestão?": "Sim, os registros são estritamente padronizados.",
            "Quando surgem dúvidas operacionais no sistema, a equipe possui materiais de apoio acessíveis?": "Sim, existem guias/manuais claros e de fácil acesso.",
            "Qual é o política de login aplicada para o acesso aos computadores e sistemas?": "Login 100% individual (usuário e senha exclusivos por servidor).",
            "Há uso de dispositivos eletrônicos pessoais (celulares/tablets) para fins de trabalho na unidade?": "Sim, por conveniência, embora a unidade disponibilize aparelhos.",
            "Em uma escala de 1 a 5, quanto você considera que o prontuário eletrônico melhora a qualidade do cuidado ao paciente?": 5,
            "Quais são os principais benefícios práticos percebidos com o uso dos sistemas digitais?": "Agilidade na tomada de decisão clínica; Melhor coordenação entre equipes de saúde.",
            "Em média, quantos minutos você gasta preenchendo o sistema após a consulta de um paciente?": "3 minutos",
            "Com que frequência a lentidão ou travamento do sistema atrasa o fluxo de atendimento da sua agenda?": "Raramente"
        },
        {
            "ID da resposta": 3,
            "Hora de início": "2026-07-14 10:20:00",
            "Hora de conclusão": "2026-07-14 10:30:00",
            "Nome completo:": "Sandra Regina Alencar",
            "Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?": "ESF II - Paulo de Tarso Mazzo",
            "Qual o seu cargo atual na UBS?": "Auxiliar administrativo",
            "Quais ferramentas e registros são utilizados ao longo do fluxo de atendimento do paciente?": "Prontuário Eletrônico/e-SUS APS e Caderno de Anotações Interno/Pré-consulta.",
            "Existe um protocolo formal e claro que define qual profissional é responsável por alimentar o sistema em cada etapa?": "Não existe protocolo formal; a responsabilidade é distribuída informalmente.",
            "Na sua percepção, a localização geográfica da unidade cria barreiras de acesso para a população local?": "Parcialmente, impacta apenas grupos específicos (ex: moradores distantes).",
            "Qual é o perfil de faixa etária predominante dos usuários que geram a maior demanda na unidade?": "Predominantemente Idosos (Terceira Idade)",
            "Na sua percepção, qual é o perfil socioeconômica predominante (classe social) dos usuários que mais frequentam esta Unidade de Saúde?": "Classe Baixa / Vulnerabilidade Social.",
            "Com que frequência os prontuários dos usuários são atualizados no e-SUS APS?": "Em blocos, ao final do turno ou do expediente do dia.",
            "Há necessidade de duplicar a informação, registrando o mesmo atendimento in mais de um local (ex: papel e sistema)?": "Sim, frequentemente realizamos o registro duplo (retrabalho habitual).",
            "Com que frequência você precisa registrar a mesma informação de um único atendimento em mais de um local?": "Sempre: Faz parte da rotina diária registrar o mesmo dado em dois ou mais lugares.",
            "Quando ocorre a duplicidade de registro, em quais locais a informação precisa ser replicada? (Marque todas as opções que se aplicam na sua rotina)": "Sistema oficial (e-SUS APS) + Caderno de anotações físico da unidade (Ata/Livro preto).",
            "O preenchimento das informações clínicas nos sistemas segue um padrão rígido estabelecido pela gestão?": "Não há padronização; cada profissional registra a seu critério.",
            "Quando surgem dúvidas operacionais no sistema, a equipe possui materiais de apoio acessíveis?": "Não há materiais; dependemos do suporte técnico de terceiros ou colegas.",
            "Qual é o política de login aplicada para o acesso aos computadores e sistemas?": "Login compartilhado por setor (ex: recepção usa a mesma credencial).",
            "Há uso de dispositivos eletrônicos pessoais (celulares/tablets) para fins de trabalho na unidade?": "Sim, usamos equipamentos próprios devido à falta ou falha dos corporativos.",
            "Em uma escala de 1 a 5, quanto você considera que o prontuário eletrônico melhora a qualidade do cuidado ao paciente?": 3,
            "Quais são os principais benefícios práticos percebidos com o uso dos sistemas digitais?": "Rapidez no acesso ao histórico do paciente.",
            "Em média, quantos minutos você gasta preenchendo o sistema após a consulta de um paciente?": "8 minutos",
            "Com que frequência a lentidão ou travamento do sistema atrasa o fluxo de atendimento da sua agenda?": "Diariamente"
        },
        {
            "ID da resposta": 4,
            "Hora de início": "2026-07-14 11:00:00",
            "Hora de conclusão": "2026-07-14 11:06:00",
            "Nome completo:": "Thiago Alves Pedrosa",
            "Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?": "ESF III - Dr. Renato Figueiredo",
            "Qual o seu cargo atual na UBS?": "Técnico de enfermagem",
            "Quais ferramentas e registros são utilizados ao longo do fluxo de atendimento do paciente?": "Prontuário Eletrônico/e-SUS APS",
            "Existe um protocolo formal e claro que define qual profissional é responsável por alimentar o sistema em cada etapa?": "Existe um protocolo, mas o registro acaba sendo compartilhado/flexível na rotina.",
            "Na sua percepção, a localização geográfica da unidade cria barreiras de acesso para a população local?": "Parcialmente, impacta apenas grupos específicos (ex: moradores distantes).",
            "Qual é o perfil de faixa etária predominante dos usuários que geram a maior demanda na unidade?": "Distribuição mista (bem equilibrada entre todas as idades)",
            "Na sua percepção, qual é o perfil socioeconômica predominante (classe social) dos usuários que mais frequentam esta Unidade de Saúde?": "Classe Média-Baixa: Trabalhadores assalariados, autônomos e famílias com orçamento mais apertado.",
            "Com que frequência os prontuários dos usuários são atualizados no e-SUS APS?": "Imediatamente após a finalização de cada atendimento.",
            "Há necessidade de duplicar a informação, registrando o mesmo atendimento in mais de um local (ex: papel e sistema)?": "Às vezes, apenas em situações específicas ou quando o sistema cai.",
            "Com que frequência você precisa registrar a mesma informação de um único atendimento em mais de um local?": "Raramente: Ocorre apenas em casos muito específicos ou exceções isoladas.",
            "Quando ocorre a duplicidade de registro, em quais locais a informação precisa ser replicada? (Marque todas as opções que se aplicam na sua rotina)": "Sistema oficial (e-SUS APS) + Planilhas internas / Formulários paralelos da prefeitura.",
            "O preenchimento das informações clínicas nos sistemas segue um padrão rígido estabelecido pela gestão?": "Há uma padronização básica, mas com muita variação pessoal.",
            "Quando surgem dúvidas operacionais no sistema, a equipe possui materiais de apoio acessíveis?": "Sim, existem guias/manuais claros e de fácil acesso.",
            "Qual é o política de login aplicada para o acesso aos computadores e sistemas?": "Login 100% individual (usuário e senha exclusivos por servidor).",
            "Há uso de dispositivos eletrônicos pessoais (celulares/tablets) para fins de trabalho na unidade?": "Não, utilizamos estritamente os equipamentos fornecidos pela unidade.",
            "Em uma escala de 1 a 5, quanto você considera que o prontuário eletrônico melhora a qualidade do cuidado ao paciente?": 4,
            "Quais são os principais benefícios práticos percebidos com o uso dos sistemas digitais?": "Maior segurança e confiabilidade da informação; Agilidade na tomada de decisão.",
            "Em média, quantos minutos você gasta preenchendo o sistema após a consulta de um paciente?": "4 minutos",
            "Com que frequência a lentidão ou travamento do sistema atrasa o fluxo de atendimento da sua agenda?": "Várias vezes na semana."
        },
        {
            "ID da resposta": 5,
            "Hora de início": "2026-07-14 13:15:00",
            "Hora de conclusão": "2026-07-14 13:22:00",
            "Nome completo:": "Dra. Beatriz Helena Castro",
            "Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?": "ESF IV - Dr. Francisco Leoni Neto",
            "Qual o seu cargo atual na UBS?": "Dentista",
            "Quais ferramentas e registros são utilizados ao longo do fluxo de atendimento do paciente?": "Prontuário Eletrônico/e-SUS APS",
            "Existe um protocolo formal e claro que define qual profissional é responsável por alimentar o sistema em cada etapa?": "Sim, existe um protocolo rígido e todos seguem.",
            "Na sua percepção, a localização geográfica da unidade cria barreiras de acesso para a população local?": "Não, a localização é central ou de fácil acesso para todos.",
            "Qual é o perfil de faixa etária predominante dos usuários que geram a maior demanda na unidade?": "Predominantemente Jovens e Adultos",
            "Na sua percepção, qual é o perfil socioeconômica predominante (classe social) dos usuários que mais frequentam esta Unidade de Saúde?": "Classe Média-Baixa: Trabalhadores assalariados, autônomos e famílias com orçamento mais apertado.",
            "Com que frequência os prontuários dos usuários são atualizados no e-SUS APS?": "Em blocos, ao final do turno ou do expediente do dia.",
            "Há necessidade de duplicar a informação, registrando o mesmo atendimento in mais de um local (ex: papel e sistema)?": "Não, o registro é feito exclusivamente em uma única plataforma oficial.",
            "Com que frequência você precisa registrar a mesma informação de um único atendimento em mais de um local?": "Nunca: O registro é feito exclusivamente uma única vez no sistema oficial.",
            "Quando ocorre a duplicidade de registro, em quais locais a informação precisa ser replicada? (Marque todas as opções que se aplicam na sua rotina)": "Não se aplica (Não realizo registros duplicados).",
            "O preenchimento das informações clínicas nos sistemas segue um padrão rígido estabelecido pela gestão?": "Sim, os registros são estritamente padronizados.",
            "Quando surgem dúvidas operacionais no sistema, a equipe possui materiais de apoio acessíveis?": "Existem manuais, mas são confusos ou de difícil localização.",
            "Qual é o política de login aplicada para o acesso aos computadores e sistemas?": "Login 100% individual (usuário e senha exclusivos por servidor).",
            "Há uso de dispositivos eletrônicos pessoais (celulares/tablets) para fins de trabalho na unidade?": "Não, utilizamos estritamente os equipamentos fornecidos pela unidade.",
            "Em uma escala de 1 a 5, quanto você considera que o prontuário eletrônico melhora a qualidade do cuidado ao paciente?": 4,
            "Quais são os principais benefícios práticos percebidos com o uso dos sistemas digitais?": "Rapidez no acesso ao histórico do paciente; Melhor coordenação.",
            "Em média, quantos minutos você gasta preenchendo o sistema após a consulta de um paciente?": "7 minutos",
            "Com que frequência a lentidão ou travamento do sistema atrasa o fluxo de atendimento da sua agenda?": "Raramente"
        },
        {
            "ID da resposta": 6,
            "Hora de início": "2026-07-14 14:00:00",
            "Hora de conclusão": "2026-07-14 14:12:00",
            "Nome completo:": "Marcos Antônio Silveira",
            "Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?": "ESF V - Livramento",
            "Qual o seu cargo atual na UBS?": "Gerente ou coordenador da UBS",
            "Quais ferramentas e registros são utilizados ao longo do fluxo de atendimento do paciente?": "Prontuário Eletrônico/e-SUS APS e Sistema próprio da Prefeitura (SIS)",
            "Existe um protocolo formal e claro que define qual profissional é responsável por alimentar o sistema em cada etapa?": "Existe um protocolo, mas o registro acaba sendo compartilhado/flexível na rotina.",
            "Na sua percepção, a localização geográfica da unidade cria barreiras de acesso para a população local?": "Sim, dificulta significativamente o acesso da comunidade.",
            "Qual é o perfil de faixa etária predominante dos usuários que geram a maior demanda na unidade?": "Distribuição mista (bem equilibrada entre todas as idades)",
            "Na sua percepção, qual é o perfil socioeconômica predominante (classe social) dos usuários que mais frequentam esta Unidade de Saúde?": "Extrema Vulnerabilidade: População em situação de rua, extrema pobreza ou alta vulnerabilidade social.",
            "Com que frequência os prontuários dos usuários são atualizados no e-SUS APS?": "Em blocos, ao final do turno ou do expediente do dia.",
            "Há necessidade de duplicar a informação, registrando o mesmo atendimento in mais de um local (ex: papel e sistema)?": "Sim, frequentemente realizamos o registro duplo (retrabalho habitual).",
            "Com que frequência você precisa registrar a mesma informação de um único atendimento em mais de um local?": "Frequentemente: Acontece na maioria dos atendimentos por exigência de fluxo ou falta de confiança no sistema.",
            "Quando ocorre a duplicidade de registro, em quais locais a informação precisa ser replicada? (Marque todas as opções que se aplicam na sua rotina)": "Dois sistemas digitais diferentes (ex: e-SUS + Sistema próprio do município).",
            "O preenchimento das informações clínicas nos sistemas segue um padrão rígido estabelecido pela gestão?": "Há uma padronização básica, mas com muita variação pessoal.",
            "Quando surgem dúvidas operacionais no sistema, a equipe possui materiais de apoio acessíveis?": "Não há materiais; dependemos do suporte técnico de terceiros ou colegas.",
            "Qual é o política de login aplicada para o acesso aos computadores e sistemas?": "Login 100% individual (usuário e senha exclusivos por servidor).",
            "Há uso de dispositivos eletrônicos pessoais (celulares/tablets) para fins de trabalho na unidade?": "Sim, usamos equipamentos próprios devido à falta ou falha dos corporativos.",
            "Em uma escala de 1 a 5, quanto você considera que o prontuário eletrônico melhora a qualidade do cuidado ao paciente?": 3,
            "Quais são os principais benefícios práticos percebidos com o uso dos sistemas digitais?": "Melhor coordenação entre equipes de saúde.",
            "Em média, quantos minutos você gasta preenchendo o sistema após a consulta de um paciente?": "10 minutos",
            "Com que frequência a lentidão ou travamento do sistema atrasa o fluxo de atendimento da sua agenda?": "Diariamente"
        }
    ]
    return pd.DataFrame(dados)

df_ubs = carregar_dados_simulados()

# Coordenadas realistas/estimadas das 6 Unidades de Saúde de Bariri - SP
coordenadas_ubs = {
    "UBS Central (José Francisco Belluzzo)": {"lat": -22.0735, "lon": -48.7460},
    "ESF I - Nova Bariri": {"lat": -22.0812, "lon": -48.7335},
    "ESF II - Paulo de Tarso Mazzo": {"lat": -22.0625, "lon": -48.7490},
    "ESF III - Dr. Renato Figueiredo": {"lat": -22.0700, "lon": -48.7500},
    "ESF IV - Dr. Francisco Leoni Neto": {"lat": -22.0650, "lon": -48.7300},
    "ESF V - Livramento": {"lat": -22.0800, "lon": -48.7550}
}

# Cabeçalho da Página Principal
st.markdown("<h1 class='main-title'>SUS-Digital Maps Bariri</h1>", unsafe_allow_html=True)
st.markdown("<p class='subtitle'>Projeto PET-Saúde Digital — Análise e Diagnóstico de Estresse Digital e Infraestrutura Tecnológica de Saúde em Bariri - SP</p>", unsafe_allow_html=True)

# BARRA LATERAL (Sidebar)
st.sidebar.markdown("<h2 class='sidebar-title'>Configurações & Filtros</h2>", unsafe_allow_html=True)

# Configuração da API Key do Gemini
api_key = st.sidebar.text_input("Chave de API do Gemini (Opcional)", type="password", help="Insira sua API Key do Google Gemini para habilitar análises generativas em tempo real.")

# Seleção da UBS via Sidebar (Sincronizado com o Mapa)
ubs_nomes = list(coordenadas_ubs.keys())
ubs_selecionada = st.sidebar.selectbox(
    "Selecione uma UBS para analisar:",
    ubs_nomes,
    index=0
)

st.sidebar.markdown("---")
st.sidebar.markdown("""
### Sobre o PET-Saúde Digital UNESP / USP
Este projeto analisa os fatores humanos, infraestrutura e conectividade que influenciam a digitalização do SUS no município de Bariri - SP, visando propor melhorias de processos, redução de redundâncias e capacitação das equipes de saúde da família.
""")

# Filtrar a linha correspondente à UBS selecionada
linha_filtrada = df_ubs[df_ubs["Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?"] == ubs_selecionada].iloc[0]

# Extração de Métricas Chave da UBS Selecionada (Fix: '4 minutos' -> 4)
tempo_gasto = int(linha_filtrada["Em média, quantos minutos você gasta preenchendo o sistema após a consulta de um paciente?"].split(" ")[0])
duplicidade = "Sim" in str(linha_filtrada["Há necessidade de duplicar a informação, registrando o mesmo atendimento in mais de um local (ex: papel e sistema)?"])
dispositivos_pessoais = "Sim" in str(linha_filtrada["Há uso de dispositivos eletrônicos pessoais (celulares/tablets) para fins de trabalho na unidade?"])
lentidao_agenda = linha_filtrada["Com que frequência a lentidão ou travamento do sistema atrasa o fluxo de atendimento da sua agenda?"]
percepcao_cuidado = linha_filtrada["Em uma escala de 1 a 5, quanto você considera que o prontuário eletrônico melhora a qualidade do cuidado ao paciente?"]

# DEFINIÇÃO DO LAYOUT EM DUAS COLUNAS
col_esquerda, col_direita = st.columns([1.1, 1.0])

with col_esquerda:
    st.subheader("Georreferenciamento de Bariri e UBSs")
    
    # Criar mapa Folium centralizado em Bariri, SP
    mapa = folium.Map(location=[-22.0744, -48.7403], zoom_start=14, tiles="OpenStreetMap")
    
    # Adicionar marcadores das UBSs com Popups estilizados
    for nome, coord in coordenadas_ubs.items():
        # Destaque de cor para a UBS selecionada
        cor_marcador = "darkred" if nome == ubs_selecionada else "blue"
        icone_tipo = "star" if nome == ubs_selecionada else "info-sign"
        
        popup_html = f"""
        <div style='font-family: Arial, sans-serif; width: 220px;'>
            <h4 style='color: #1E3A8A; margin: 0 0 5px 0;'>{nome}</h4>
            <p style='margin: 0; font-size: 12px;'><b>Clique na barra lateral ou selecione esta UBS para rodar a análise de IA.</b></p>
        </div>
        """
        
        folium.Marker(
            location=[coord["lat"], coord["lon"]],
            popup=folium.Popup(popup_html, max_width=250),
            tooltip=nome,
            icon=folium.Icon(color=cor_marcador, icon=icone_tipo)
        ).add_to(mapa)
        
    # Renderizar o mapa Folium no Streamlit
    mapa_dados = st_folium(mapa, width="100%", height=400, key="mapa_bariri")
    
    st.markdown("### Indicadores Rápidos da Unidade")
    
    # Seção de Métricas Dinâmicas com cores e alertas
    m_col1, m_col2, m_col3 = st.columns(3)
    
    with m_col1:
        st.metric(
            label="Tempo Pós-Consulta",
            value=f"{tempo_gasto} min",
            delta="Acima da Média" if tempo_gasto > 8 else "Ideal",
            delta_color="inverse"
        )
        
    with m_col2:
        if duplicidade:
            st.markdown("""
            <div class='metric-card-alert'>
                <p style='margin:0; font-size: 0.8rem; color: #991B1B;'><b>🔴 DUPLICIDADE</b></p>
                <p style='margin:0; font-size: 1.1rem; font-weight: bold; color: #991B1B;'>Duplo Registro</p>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown("""
            <div class='metric-card'>
                <p style='margin:0; font-size: 0.8rem; color: #065F46;'><b>🟢 REGISTRO</b></p>
                <p style='margin:0; font-size: 1.1rem; font-weight: bold; color: #065F46;'>100% Oficial</p>
            </div>
            """, unsafe_allow_html=True)
            
    with m_col3:
        if dispositivos_pessoais:
            st.markdown("""
            <div class='metric-card-alert'>
                <p style='margin:0; font-size: 0.8rem; color: #991B1B;'><b>EQUIP. PESSOAL</b></p>
                <p style='margin:0; font-size: 1.1rem; font-weight: bold; color: #991B1B;'>Uso não corporativo</p>
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown("""
            <div class='metric-card'>
                <p style='margin:0; font-size: 0.8rem; color: #065F46;'><b> SEGURANÇA</b></p>
                <p style='margin:0; font-size: 1.1rem; font-weight: bold; color: #065F46;'>Dispos. Oficiais</p>
            </div>
            """, unsafe_allow_html=True)

    # Detalhes textuais das respostas reais fornecidas
    with st.expander("Ver Respostas Brutas Coletadas no Formulário"):
        st.write(linha_filtrada.to_dict())

# MODO DE DEMONSTRAÇÃO (SAFETY FALLBACK LOCAL)
def obter_analise_demonstracao_local(ubs_nome):
    analises = {
        "UBS Central (José Francisco Belluzzo)": {
            "estresse": "MODERADO. A equipe de enfermagem da UBS Central apresenta estresse digital esporádico. Embora o login seja individualizado e os equipamentos oficiais garantam segurança de dados, o retrabalho gerado por duplicidade (papel + sistema) durante quedas de rede causa desgaste.",
            "diagnostico": "Com gasto de apenas 4 minutos pós-consulta, o impacto na agenda só é sentido quando a internet cai. A atualização imediata no e-SUS mostra bom fluxo de trabalho, mas a dependência de manuais confusos atrasa a resolução de dúvidas, gerando filas momentâneas.",
            "proposta": "1. **Material de Apoio Rápido**: Criação de 'Guia de Bolso e-SUS' plastificado pelo PET-Saúde. \n2. **Protocolo de Queda de Rede**: Estabelecer rotina clara de contingência em papel para evitar duplicidade desnecessária em dias estáveis."
        },
        "ESF I - Nova Bariri": {
            "estresse": "BAIXO. O médico desta ESF demonstra alto engajamento tecnológico. O estresse está mitigado pelo não uso de registro duplo (100% e-SUS). Há, contudo, risco ético pontual pelo uso de celulares por conveniência.",
            "diagnostico": "O tempo de 3 minutos de preenchimento revela excelência operacional. A ausência de travamentos e o registro em tempo real evitam gargalos físicos na recepção, maximizando o volume de consultas disponíveis na agenda diária.",
            "proposta": "1. **Multiplicador Digital**: Convidar o médico desta unidade para atuar como tutor/mentor das demais UBSs em eventos do PET. \n2. **Conscientização LGPD**: Palestra curta sobre segurança da informação em dispositivos próprios (mesmo por conveniência)."
        },
        "ESF II - Paulo de Tarso Mazzo": {
            "estresse": "ALTO. Foco em triagem administrativa. A política de login compartilhado fere normas de rastreabilidade. A obrigatoriedade de transcrever o 'Livro Preto' (Ata) para o e-SUS APS em blocos ao fim do dia gera extrema carga cognitiva à recepção.",
            "diagnostico": "Os 8 minutos gastos (acima da média ideal administrativa) atrasam severamente o fluxo, criando longas filas de espera de uma população socialmente vulnerável e de idosos. A lentidão diária do sistema exige que o trabalho seja repetido, consumindo tempo precioso do paciente na unidade.",
            "proposta": "1. **Fim do Caderno Físico**: Intervenção direta com a gestão para abolir o Livro de Ata paralelo na recepção. \n2. **Ajuste de Logins**: Solicitar TI para configurar logins rotativos rápidos na recepção em vez de login geral."
        },
        "ESF III - Dr. Renato Figueiredo": {
            "estresse": "MODERADO. A equipe técnica lida com duplicidade (e-SUS + planilhas da prefeitura) e protocolos flexíveis, gerando incerteza sobre quem deve preencher o quê. Felizmente, não usam aparelhos pessoais, resguardando os dados.",
            "diagnostico": "Com gasto de 4 minutos no sistema, a agilidade do técnico ajuda, mas o gargalo principal ocorre várias vezes na semana com travamentos. O uso de formulários paralelos esgota a equipe técnica, que deveria estar focada na assistência e vacinação.",
            "proposta": "1. **Mapeamento de Planilhas**: O grupo PET pode auditar as planilhas paralelas da prefeitura para integrar suas variáveis ao próprio e-SUS (como marcadores ou evolução). \n2. **Definição de Fluxo**: Criar um POP (Procedimento Operacional Padrão) visual sobre quem alimenta qual tela."
        },
        "ESF IV - Dr. Francisco Leoni Neto": {
            "estresse": "BAIXO A MODERADO. A equipe odontológica tem fluxos de registro eficientes e sem dupla inserção, trabalhando apenas com sistemas oficiais. O estresse deriva puramente da falta de materiais de apoio claros para a área bucal.",
            "diagnostico": "A dentista gasta em média 7 minutos preenchendo após o atendimento, o que é razoável considerando as especificidades do odontograma eletrônico. O fluxo só é interrompido por dúvidas no sistema (por manuais confusos), sem grandes impactos por lentidão de rede.",
            "proposta": "1. **Tutorial e-SUS Odonto**: Desenvolvimento de tutoriais em vídeo/PDF curtos pelo PET-Saúde focados exclusivamente nas abas de odontologia. \n2. **Revisão de Horários**: Sugerir à gestão pequenos blocos de 5 minutos entre consultas para respiro digital dos dentistas."
        },
        "ESF V - Livramento": {
            "estresse": "CRÍTICO. O gestor coordena uma unidade de extrema vulnerabilidade geográfica. O estresse atinge o ápice pela redundância tecnológica: uso simultâneo de dois sistemas (e-SUS e SIS da prefeitura). A equipe usa dispositivos pessoais por falhas de maquinário.",
            "diagnostico": "Com 10 minutos gastos e o sistema travando diariamente, há colapso da agenda. O fato de os registros serem feitos em bloco no final do expediente significa que os dados não estão disponíveis para outros profissionais durante o dia, anulando a coordenação do cuidado.",
            "proposta": "1. **Integração de Sistemas**: Advocacia pela interoperabilidade imediata via API entre o SIS Municipal e o e-SUS, sugerindo abandono do SIS se redundante. \n2. **Auditoria de TI**: Relatório formal do PET à Secretaria de Saúde detalhando a sucateação dos computadores e os riscos de uso contínuo de aparelhos pessoais."
        }
    }
    return analises.get(ubs_nome, {
        "estresse": "Não especificado.",
        "diagnostico": "Não especificado.",
        "proposta": "Não especificada."
    })

with col_direita:
    st.subheader("Painel de Inteligência SUS-Digital (IA)")
    
    # Detecção do Modo (IA real vs. Demonstração)
    if api_key:
        st.info("Conexão ativa com o Google Gemini. Processando em tempo real...")
        
        try:
            # 3. CONEXÃO COM O GEMINI 1.5 FLASH
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel("gemini-1.5-flash")
            
            # Preparar o prompt estruturado com todas as respostas da UBS selecionada
            prompt = f"""
Você é um Especialista em Saúde Pública e IA aplicada ao SUS. Analise os seguintes dados reais coletados de um profissional da Unidade Básica de Saúde "{ubs_selecionada}" no município de Bariri - SP, coletados para o projeto PET-Saúde Digital.

DADOS DA UBS:
- UBS: {linha_filtrada["Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?"]}
- Cargo do profissional: {linha_filtrada["Qual o seu cargo atual na UBS?"]}
- Ferramentas utilizadas: {linha_filtrada["Quais ferramentas e registros são utilizados ao longo do fluxo de atendimento do paciente?"]}
- Protocolo de preenchimento: {linha_filtrada["Existe um protocolo formal e claro que define qual profissional é responsável por alimentar o sistema em cada etapa?"]}
- Localização e Barreiras: {linha_filtrada["Na sua percepção, a localização geográfica da unidade cria barreiras de acesso para a população local?"]}
- Faixa Etária Demanda: {linha_filtrada["Qual é o perfil de faixa etária predominante dos usuários que geram a maior demanda na unidade?"]}
- Perfil Socioeconômico: {linha_filtrada["Na sua percepção, qual é o perfil socioeconômica predominante (classe social) dos usuários que mais frequentam esta Unidade de Saúde?"]}
- Frequência de Atualização do e-SUS: {linha_filtrada["Com que frequência os prontuários dos usuários são atualizados no e-SUS APS?"]}
- Necessidade de Duplicação: {linha_filtrada["Há necessidade de duplicar a informação, registrando o mesmo atendimento in mais de um local (ex: papel e sistema)?"]}
- Frequência de Duplicação: {linha_filtrada["Com que frequência você precisa registrar a mesma informação de um único atendimento em mais de um local?"]}
- Onde duplica: {linha_filtrada["Quando ocorre a duplicidade de registro, em quais locais a informação precisa ser replicada? (Marque todas as opções que se aplicam na sua rotina)"]}
- Padrão Clínico da Gestão: {linha_filtrada["O preenchimento das informações clínicas nos sistemas segue um padrão rígido estabelecido pela gestão?"]}
- Apoio e Tutoriais: {linha_filtrada["Quando surgem dúvidas operacionais no sistema, a equipe possui materiais de apoio acessíveis?"]}
- Política de Logins: {linha_filtrada["Qual é o política de login aplicada para o acesso aos computadores e sistemas?"]}
- Dispositivos Pessoais na Rotina: {linha_filtrada["Há uso de dispositivos eletrônicos pessoais (celulares/tablets) para fins de trabalho na unidade?"]}
- Impacto do Prontuário no Cuidado (1-5): {linha_filtrada["Em uma escala de 1 a 5, quanto você considera que o prontuário eletrônico melhora a qualidade do cuidado ao paciente?"]}
- Benefícios percebidos: {linha_filtrada["Quais são os principais benefícios práticos percebidos com o uso dos sistemas digitais?"]}
- Minutos gastos preenchendo pós-consulta: {linha_filtrada["Em média, quantos minutos você gasta preenchendo o sistema após a consulta de um paciente?"]}
- Impacto da Lentidão na Agenda: {linha_filtrada["Com que frequência a lentidão ou travamento do sistema atrasa o fluxo de atendimento da sua agenda?"]}

Gere um diagnóstico de Saúde Digital extremamente profissional e analítico para esta unidade, em português.
Seu relatório DEVE conter exatamente estas três seções estruturadas:

1. **NÍVEL DE ESTRESSE DIGITAL DA EQUIPE**: avalie o impacto psicológico e operacional da lentidão do sistema municipal, os gargalos de login, o retrabalho gerado pela duplicidade (papel + sistema) e os riscos éticos/privacidade relacionados ao uso de WhatsApp e dispositivos pessoais na comunicação interna por falta de plataformas corporativas oficiais.
2. **DIAGNÓSTICO DE TEMPO E IMPACTO NA AGENDA**: analise com profundidade o tempo gasto pós-consulta no sistema e descreva o impacto prático sobre a agenda da UBS, incluindo o tempo de espera dos pacientes na fila física, possíveis gargalos na recepção e perda de consultas por lentidão técnica.
3. **PROPOSTA DE AÇÃO DE BAIXO CUSTO (PET-Saúde Digital)**: recomende soluções viáveis, práticas e de custo nulo ou baixíssimo que o grupo PET-Saúde Digital de Bariri possa implantar diretamente na unidade (ex: treinamento, organização de fluxos, eliminação de formulários em papel redundantes, materiais de suporte rápidos).
"""
            
            with st.spinner("Analisando dados com a inteligência do Gemini..."):
                resposta_gemini = model.generate_content(prompt)
                texto_analise = resposta_gemini.text
                
            st.success("Análise em tempo real concluída!")
            st.markdown(texto_analise)
            
        except Exception as e:
            st.error(f"Erro ao conectar com a API do Gemini: {e}")
            st.warning("Ativando Modo de Demonstração local (Safety Fallback) para não interromper a apresentação.")
            api_key = None # Forçar fallback local
            
    # 4. MODO DE DEMONSTRAÇÃO (SAFETY FALLBACK)
    if not api_key:
        st.warning("Modo de Demonstração Ativado (Análise Local Inteligente)")
        
        analise_local = obter_analise_demonstracao_local(ubs_selecionada)
        
        st.markdown(f"### Análise de Diagnóstico: *{ubs_selecionada}*")
        
        st.markdown("#### Nível de Estresse Digital da Equipe")
        st.markdown(analise_local["estresse"])
        
        st.markdown("#### Diagnóstico de Tempo e Impacto na Agenda")
        st.markdown(analise_local["diagnostico"])
        
        st.markdown("#### Proposta de Ação de Baixo Custo (PET-Saúde Digital)")
        st.markdown(analise_local["proposta"])

st.markdown("---")
st.markdown("<p style='text-align: center; font-size: 0.8rem; color: #9CA3AF;'>Projeto PET-Saúde Digital Bariri / UNESP — Apresentação de Resultados 2026. Desenvolvido com Streamlit e GenAI.</p>", unsafe_allow_html=True)
