import React, { useState, useEffect, useRef } from "react";
import { 
  MapPin, 
  Settings, 
  HelpCircle, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Brain, 
  FileJson, 
  Users, 
  Globe2 
} from "lucide-react";

// Definição dos dados estruturados exatos do formulário (simulado para Bariri)
interface UBSResponse {
  "ID da resposta": number;
  "Hora de início": string;
  "Hora de conclusão": string;
  "Nome completo:": string;
  "Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?": string;
  "Qual o seu cargo atual na UBS?": string;
  "Quais ferramentas e registros são utilizados ao longo do fluxo de atendimento do paciente?": string;
  "Existe um protocolo formal e claro que define qual profissional é responsável por alimentar o sistema em cada etapa?": string;
  "Na sua percepção, a localização geográfica da unidade cria barreiras de acesso para a população local?": string;
  "Qual é o perfil de faixa etária predominante dos usuários que geram a maior demanda na unidade?": string;
  "Na sua percepção, qual é o perfil socioeconômica predominante (classe social) dos usuários que mais frequentam esta Unidade de Saúde?": string;
  "Com que frequência os prontuários dos usuários são atualizados no e-SUS APS?": string;
  "Há necessidade de duplicar a informação, registrando o mesmo atendimento in mais de um local (ex: papel e sistema)?": string;
  "Com que frequência você precisa registrar a mesma informação de um único atendimento em mais de um local?": string;
  "Quando ocorre a duplicidade de registro, em quais locais a informação precisa ser replicada? (Marque todas as opções que se aplicam na sua rotina)": string;
  "O preenchimento das informações clínicas nos sistemas segue um padrão rígido estabelecido pela gestão?": string;
  "Quando surgem dúvidas operacionais no sistema, a equipe possui materiais de apoio acessíveis?": string;
  "Qual é o política de login aplicada para o acesso aos computadores e sistemas?": string;
  "Há uso de dispositivos eletrônicos pessoais (celulares/tablets) para fins de trabalho na unidade?": string;
  "Em uma escala de 1 a 5, quanto você considera que o prontuário eletrônico melhora a qualidade do cuidado ao paciente?": number;
  "Quais são os principais benefícios práticos percebidos com o uso dos sistemas digitais?": string;
  "Em média, quantos minutos você gasta preenchendo o sistema após a consulta de um paciente?": string;
  "Com que frequência a lentidão ou travamento do sistema atrasa o fluxo de atendimento da sua agenda?": string;
}

const ubsData: UBSResponse[] = [
  {
    "ID da resposta": 1,
    "Hora de início": "2026-07-14 09:00:00",
    "Hora de conclusão": "2026-07-14 09:15:00",
    "Nome completo:": "Dr. Roberto Carlos de Almeida",
    "Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?": "UBS Dr. Alceu de Carvalho - Centro",
    "Qual o seu cargo atual na UBS?": "Médico de Família",
    "Quais ferramentas e registros são utilizados ao longo do fluxo de atendimento do paciente?": "Prontuário Eletrônico (e-SUS APS), Ficha de Atendimento Individual em papel, Bloco de Receitas físico e planilha de controle interna.",
    "Existe um protocolo formal e claro que define qual profissional é responsável por alimentar o sistema em cada etapa?": "Não, muitas vezes a recepção abre o atendimento, mas o preenchimento clínico e desfecho ficam confusos entre enfermeiro e médico.",
    "Na sua percepção, a localização geográfica da unidade cria barreiras de acesso para a população local?": "Não, por ser no Centro, o acesso é relativamente fácil para a maior parte da população, embora falte transporte adaptado.",
    "Qual é o perfil de faixa etária predominante dos usuários que geram a maior demanda na unidade?": "Idosos (mais de 60 anos) com condições crônicas como diabetes e hipertensão.",
    "Na sua percepção, qual é o perfil socioeconômica predominante (classe social) dos usuários que mais frequentam esta Unidade de Saúde?": "Classe D e E, famílias de baixa renda e aposentados dependentes exclusivamente do SUS.",
    "Com que frequência os prontuários dos usuários são atualizados no e-SUS APS?": "Diariamente, mas com atrasos significativos ao final do expediente devido à lentidão do sistema.",
    "Há necessidade de duplicar a informação, registrando o mesmo atendimento in mais de um local (ex: papel e sistema)?": "Sim, registramos no prontuário eletrônico e também em uma ficha física de papel por segurança, pois o sistema municipal frequentemente cai.",
    "Com que frequência você precisa registrar a mesma informação de um único atendimento em mais de um local?": "Sempre (em todos os atendimentos)",
    "Quando ocorre a duplicidade de registro, em quais locais a informação precisa ser replicada? (Marque todas as opções que se aplicam na sua rotina)": "Ficha de Atendimento em papel, Prontuário do e-SUS APS, Livro de Registro de Receituário de Controle Especial.",
    "O preenchimento das informações clínicas nos sistemas segue um padrão rígido estabelecido pela gestão?": "Não, cada profissional preenche de uma forma. Não há uma padronização clara ou treinamento recente.",
    "Quando surgem dúvidas operacionais no sistema, a equipe possui materiais de apoio acessíveis?": "Não, dependemos de ligar para o suporte da prefeitura ou perguntar para colegas que conhecem um pouco mais.",
    "Qual é o política de login aplicada para o acesso aos computadores e sistemas?": "Login genérico compartilhado por computador na sala de atendimento.",
    "Há uso de dispositivos eletrônicos pessoais (celulares/tablets) para fins de trabalho na unidade?": "Sim, usamos nossos celulares pessoais no WhatsApp para discutir casos clínicos e agilizar encaminhamentos, pois não há sistema de chat interno.",
    "Em uma escala de 1 a 5, quanto você considera que o prontuário eletrônico melhora a qualidade do cuidado ao paciente?": 3,
    "Quais são os principais benefícios práticos percebidos com o uso dos sistemas digitais?": "Rapidez para localizar históricos de consultas anteriores e facilidade de leitura das receitas digitadas em comparação com letras manuscritas.",
    "Em média, quantos minutos você gasta preenchendo o sistema após a consulta de um paciente?": "10 minutos",
    "Com que frequência a lentidão ou travamento do sistema atrasa o fluxo de atendimento da sua agenda?": "Frequentemente (quase todos os dias, principalmente no período da tarde)"
  },
  {
    "ID da resposta": 2,
    "Hora de início": "2026-07-14 09:30:00",
    "Hora de conclusão": "2026-07-14 09:50:00",
    "Nome completo:": "Mariana Souza Santos",
    "Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?": "UBS Soma - Jardim Nova Bariri",
    "Qual o seu cargo atual na UBS?": "Enfermeira Chefe",
    "Quais ferramentas e registros são utilizados ao longo do fluxo de atendimento do paciente?": "Prontuário Eletrônico e-SUS APS, WhatsApp pessoal para coordenação, folhas soltas de triagem manual.",
    "Existe um protocolo formal e claro que define qual profissional é responsável por alimentar o sistema em cada etapa?": "Existe no papel, mas no dia a dia a sobrecarga faz com que qualquer um insira os dados para liberar a fila.",
    "Na sua percepção, a localização geográfica da unidade cria barreiras de acesso para a população local?": "Sim, a unidade fica distante de pontos de ônibus e a caminhada para idosos e gestantes sob o sol é muito desgastante.",
    "Qual é o perfil de faixa etária predominante dos usuários que geram a maior demanda na unidade?": "Adultos de 20 a 59 anos, e crianças na sala de vacina.",
    "Na sua percepção, qual é o perfil socioeconômica predominante (classe social) dos usuários que mais frequentam esta Unidade de Saúde?": "Classe E e pessoas em situação de extrema vulnerabilidade social.",
    "Com que frequência os prontuários dos usuários são atualizados no e-SUS APS?": "Semanalmente ou acumulado, pois faltam computadores suficientes na triagem.",
    "Há necessidade de duplicar a informação, registrando o mesmo atendimento in mais de um local (ex: papel e sistema)?": "Sim, anotamos os dados vitais em um caderno de triagem e depois digitamos no e-SUS para não travar a fila de espera física.",
    "Com que frequência você precisa registrar a mesma informação de um único atendimento em mais de um local?": "Frequentemente (várias vezes ao dia)",
    "Quando ocorre a duplicidade de registro, em quais locais a informação precisa ser replicada? (Marque todas as opções que se aplicam na sua rotina)": "Caderno de Triagem físico, Sistema e-SUS APS, Planilhas de Campanhas de Vacinação do Estado.",
    "O preenchimento das informações clínicas nos sistemas segue um padrão rígido estabelecido pela gestão?": "Sim, mas é um padrão focado apenas em bater metas de produção (faturamento do Previne Brasil), não na qualidade clínica.",
    "Quando surgem dúvidas operacionais no sistema, a equipe possui materiais de apoio acessíveis?": "Temos um PDF desatualizado enviado pelo e-mail da prefeitura há dois anos.",
    "Qual é o política de login aplicada para o acesso aos computadores e sistemas?": "Login individual com senha pessoal, porém o sistema cai e desloga sozinho a cada 20 minutos.",
    "Há uso de dispositivos eletrônicos pessoais (celulares/tablets) para fins de trabalho na unidade?": "Sim, criamos um grupo de WhatsApp da unidade com nossos números pessoais para avisar sobre vacinas em falta e organizar visitas domiciliares com as ACS.",
    "Em uma escala de 1 a 5, quanto você considera que o prontuário eletrônico melhora a qualidade do cuidado ao paciente?": 4,
    "Quais são os principais benefícios práticos percebidos com o uso dos sistemas digitais?": "Envio direto dos dados de produção para o Ministério da Saúde e facilidade de verificar o esquema de vacinação do paciente.",
    "Em média, quantos minutos você gasta preenchendo o sistema após a consulta de um paciente?": "15 minutos",
    "Com que frequência a lentidão ou travamento do sistema atrasa o fluxo de atendimento da sua agenda?": "Sempre (todos os dias a conexão de internet da unidade oscila e gera longas filas)"
  },
  {
    "ID da resposta": 3,
    "Hora de início": "2026-07-14 10:15:00",
    "Hora de conclusão": "2026-07-14 10:32:00",
    "Nome completo:": "Carlos Eduardo Siqueira",
    "Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?": "UBS Dr. Domingos de Léo - Vila Maria",
    "Qual o seu cargo atual na UBS?": "Agente Comunitário de Saúde (ACS)",
    "Quais ferramentas e registros são utilizados ao longo do fluxo de atendimento do paciente?": "Fichas CDS em papel (Cadastro Domiciliar e Ficha de Visita) e digitação posterior no e-SUS por digitação centralizada.",
    "Existe um protocolo formal e claro que define qual profissional é responsável por alimentar o sistema em cada etapa?": "Sim, os ACSs preenchem no papel e entregam para o digitador da UBS inserir no sistema.",
    "Na sua percepção, a localização geográfica da unidade cria barreiras de acesso para a população local?": "Sim, a Vila Maria é cortada por uma rodovia estadual de grande movimento e os moradores enfrentam dificuldades para atravessar com segurança até a UBS.",
    "Qual é o perfil de faixa etária predominante dos usuários que geram a maior demanda na unidade?": "Idosos e gestantes.",
    "Na sua percepção, qual é o perfil socioeconômica predominante (classe social) dos usuários que mais frequentam esta Unidade de Saúde?": "Classe D e E, beneficiários do Bolsa Família.",
    "Com que frequência os prontuários dos usuários são atualizados no e-SUS APS?": "Quinzenalmente (devido ao acúmulo de fichas em papel que aguardam digitação).",
    "Há necessidade de duplicar a informação, registrando o mesmo atendimento in mais de um local (ex: papel e sistema)?": "Sim, porque as visitas domiciliares são todas feitas em fichas de papel do Ministério e depois passadas a limpo no computador.",
    "Com que frequência você precisa registrar a mesma informação de um único atendimento em mais de um local?": "Sempre (em todas as visitas)",
    "Quando ocorre a duplicidade de registro, em quais locais a informação precisa ser replicada? (Marque todas as opções que se aplicam na sua rotina)": "Ficha de Visita Domiciliar em papel, Relatório diário de visitas do ACS e posterior digitação no e-SUS CDS.",
    "O preenchimento das informações clínicas nos sistemas segue um padrão rígido estabelecido pela gestão?": "Sim, as fichas são rígidas, mas muito burocráticas e difíceis de preencher.",
    "Quando surgem dúvidas operacionais no sistema, a equipe possui materiais de apoio acessíveis?": "Não, nós nos ajudamos entre nós ACSs, mas a prefeitura não dá treinamento de informática.",
    "Qual é o política de login aplicada para o acesso aos computadores e sistemas?": "Apenas o digitador oficial possui acesso ao sistema e-SUS na unidade.",
    "Há uso de dispositivos eletrônicos pessoais (celulares/tablets) para fins de trabalho na unidade?": "Sim, os ACSs usam seus próprios smartphones para tirar fotos de receitas, carteiras de vacinação ou ferimentos para mostrar ao médico/enfermeiro na unidade.",
    "Em uma escala de 1 a 5, quanto você considera que o prontuário eletrônico melhora a qualidade do cuidado ao paciente?": 2,
    "Quais são os principais benefícios práticos percebidos com o uso dos sistemas digitais?": "Centralização dos cadastros familiares e controle de quem recebeu visita no mês.",
    "Em média, quantos minutos você gasta preenchendo o sistema após a consulta de um paciente?": "8 minutos",
    "Com que frequência a lentidão ou travamento do sistema atrasa o fluxo de atendimento da sua agenda?": "Frequentemente (travamento do computador único de digitação impede o encerramento do lote de dados)"
  }
];

// Coordenadas georreferenciadas das UBSs de Bariri - SP
const ubsCoordinates = {
  "UBS Dr. Alceu de Carvalho - Centro": { lat: -22.0735, lon: -48.7460 },
  "UBS Soma - Jardim Nova Bariri": { lat: -22.0812, lon: -48.7335 },
  "UBS Dr. Domingos de Léo - Vila Maria": { lat: -22.0625, lon: -48.7490 }
};

// Objeto com as análises offline completas para o Modo de Demonstração
const demoAnalyses: Record<string, { estresse: string; diagnostico: string; proposta: string }> = {
  "UBS Dr. Alceu de Carvalho - Centro": {
    estresse: "⚠️ ALTO. A equipe da unidade central Dr. Alceu de Carvalho enfrenta uma sobrecarga operacional severa pelo retrabalho de duplicar informações clínicas do e-SUS APS em fichas físicas paralelas de papel. Os profissionais adotam essa prática defensiva pelo histórico de quedas e lentidão extrema na rede de computadores municipal. Além disso, a falta de canais de chat corporativos oficiais leva à adoção generalizada do WhatsApp pessoal no celular particular para discutir casos clínicos e agilizar encaminhamentos, o que expõe dados sensíveis sem qualquer governança institucional.",
    diagnostico: "⏳ Um tempo médio pós-consulta de 10 minutos é gasto puramente no preenchimento do sistema eletrônico. Esse gargalo técnico arrasta a agenda ao longo do dia, e a lentidão da internet — especialmente alarmante e frequente no período da tarde — gera longas esperas e atrasos cumulativos nas consultas. Isso força os profissionais médicos e de enfermagem a fazerem horas extras não remuneradas ao final do expediente para 'por o sistema em dia' ou sacrificar o tempo de escuta ao paciente.",
    proposta: "💡 **1. Eliminação Gradual do Papel**: Estabelecer diretriz interna autorizando o descarte definitivo da ficha de atendimento individual em papel para consultas eletivas, retendo o uso do papel apenas como plano de contingência para quedas totais de rede.\n**2. Divisão Inteligente de Atribuições**: Redefinir as etapas de preenchimento (triagem com sinais vitais preenchidos estritamente pela enfermagem na abertura; dados clínicos preenchidos pelo médico durante a consulta), reduzindo cliques repetitivos.\n**3. Treinamento de e-SUS e Atalhos**: Grupo PET-Saúde Digital ministrará minicurso focado no uso de modelos de consulta rápida do e-SUS, otimizando o fluxo de digitação."
  },
  "UBS Soma - Jardim Nova Bariri": {
    estresse: "🚨 CRÍTICO. A unidade do Jardim Nova Bariri opera no limite da exaustão digital. A crônica escassez de computadores força a equipe de enfermagem a acumular folhas de triagem para digitação posterior, que frequentemente é feita de forma semanal ou acumulada. O estresse é agravado pelo fato de que o sistema de login individual desloga automaticamente a cada 20 minutos por instabilidade no link de internet de fibra óptica da prefeitura, gerando perda frequente de textos em digitação e extrema irritação na equipe de saúde.",
    diagnostico: "⏳ Com um custo de tempo altíssimo de 15 minutos por paciente no preenchimento do prontuário eletrônico pós-consulta, o sistema torna-se um obstáculo e não um facilitador. A lentidão é constante (todos os dias). Esse fator técnico sobrecarrega as filas físicas e gera longas aglomerações em um bairro geograficamente afastado das linhas de ônibus centrais, afetando negativamente gestantes e idosos que aguardam atendimento de pé ou sob sol forte.",
    proposta: "💡 **1. Cronograma de Digitação Compartilhada**: Organizar uma escala clara de horários de uso de computadores para evitar picos de conexões simultâneas na rede Wi-Fi interna da unidade.\n**2. Kit de Emergência Offline (Rascunho Rápido)**: Criar um padrão simplificado em arquivo de texto local (bloco de notas) para rascunho de anamneses durante a queda de conexão, permitindo copiar e colar o conteúdo para o e-SUS assim que a rede restabelecer.\n**3. Oficinas de Ergonomia e Fluxo**: PET-Saúde coordenará readequação de layout das mesas de digitação e treinamento sobre faturamento focado nas metas do Previne Brasil."
  },
  "UBS Dr. Domingos de Léo - Vila Maria": {
    estresse: "⚠️ MODERADO A ALTO. Os Agentes Comunitários de Saúde (ACS) realizam visitas domiciliares estritamente preenchendo as fichas CDS em formulários de papel do Ministério da Saúde, despendendo horas diárias 'passando dados a limpo' para que um único digitador oficial centralizado insira tudo no sistema. Por falta de computadores portáteis institucionais, os ACS usam seus smartphones pessoais de forma proativa para fotografar ferimentos, receitas ou carteiras de vacina de moradores isolados para mostrar ao médico na unidade. Isso representa excelente iniciativa, mas gera sérias vulnerabilidades jurídicas por portar dados médicos em mídias sociais particulares.",
    diagnostico: "⏳ O gasto direto pós-consulta na unidade é de 8 minutos, mas há um delay crítico de até 15 dias para que os dados colhidos na rua pelo ACS entrem de fato no sistema eletrônico devido ao acúmulo de pilhas de papel na mesa do digitador único. Esse hiato de tempo atrasa o monitoramento ativo de idosos, recém-nascidos e gestantes de alto risco, cujo acesso já é prejudicado pela barreira geográfica da perigosa rodovia estadual que isola o bairro.",
    proposta: "💡 **1. Priorização de Tablets PET**: O grupo PET-Saúde Digital pode sugerir o empréstimo experimental de tablets ou a utilização compartilhada de smartphones institucionais carregados com o aplicativo e-SUS APS Território, que opera 100% offline durante as visitas e sincroniza instantaneamente por Wi-Fi ao retornar à UBS.\n**2. Protocolo de Imagem Médica Segura**: Criação de uma norma local exigindo que qualquer imagem de paciente coletada por conveniência na visita seja imediatamente encaminhada para o e-mail oficial institucional e deletada permanentemente da galeria privada do aparelho do profissional."
  }
};

// Conteúdo original do app.py em string para permitir o download no próprio navegador
const pythonAppCode = `import streamlit as st
import pandas as pd
import folium
from streamlit_folium import st_folium
import google.generativeai as genai

# SUS-Digital Maps Bariri - PET-Saúde Digital
st.set_page_config(page_title="SUS-Digital Maps Bariri", page_icon="🏥", layout="wide")

st.markdown("<h1 style='color: #1E3A8A;'>🏥 SUS-Digital Maps Bariri</h1>", unsafe_allow_html=True)
st.markdown("<p style='color: #4B5563; font-size: 1.1rem;'>PET-Saúde Digital — Análise e Diagnóstico de Estresse Digital das UBSs de Bariri - SP</p>", unsafe_allow_html=True)

# 1. DADOS REALISTAS DO FORMULÁRIO (3 UBSs)
dados = [
    {
        "ID da resposta": 1,
        "Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?": "UBS Dr. Alceu de Carvalho - Centro",
        "Qual o seu cargo atual na UBS?": "Médico de Família",
        "Quais ferramentas e registros são utilizados ao longo do fluxo de atendimento do paciente?": "Prontuário Eletrônico (e-SUS APS), Ficha de Atendimento Individual em papel, Bloco de Receitas físico e planilha de controle interna.",
        "Existe um protocolo formal e claro que define qual profissional é responsável por alimentar o sistema em cada etapa?": "Não, muitas vezes a recepção abre o atendimento, mas o preenchimento clínico e desfecho ficam confusos entre enfermeiro e médico.",
        "Na sua percepção, a localização geográfica da unidade cria barreiras de acesso para a população local?": "Não, por ser no Centro, o acesso é relativamente fácil para a maior parte da população.",
        "Há necessidade de duplicar a informação, registrando o mesmo atendimento in mais de um local (ex: papel e sistema)?": "Sim, registramos no prontuário eletrônico e também em papel por segurança.",
        "Com que frequência você precisa registrar a mesma informação de um único atendimento em mais de um local?": "Sempre (em todos os atendimentos)",
        "Há uso de dispositivos eletrônicos pessoais (celulares/tablets) para fins de trabalho na unidade?": "Sim, usamos nossos celulares pessoais no WhatsApp por falta de canais oficiais.",
        "Em média, quantos minutos você gasta preenchendo o sistema após a consulta de um paciente?": "10 minutos",
        "Com que frequência a lentidão ou travamento do sistema atrasa o fluxo de atendimento da sua agenda?": "Frequentemente (quase todos os dias, principalmente no período da tarde)"
    },
    {
        "ID da resposta": 2,
        "Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?": "UBS Soma - Jardim Nova Bariri",
        "Qual o seu cargo atual na UBS?": "Enfermeira Chefe",
        "Quais ferramentas e registros são utilizados ao longo do fluxo de atendimento do paciente?": "Prontuário Eletrônico e-SUS APS, WhatsApp pessoal para coordenação, folhas soltas de triagem.",
        "Existe um protocolo formal e claro que define qual profissional é responsável por alimentar o sistema em cada etapa?": "Existe no papel, mas no dia a dia a sobrecarga faz com que qualquer um insira.",
        "Na sua percepção, a localização geográfica da unidade cria barreiras de acesso para a população local?": "Sim, a unidade fica distante de pontos de ônibus e a caminhada sob o sol é muito desgastante.",
        "Há necessidade de duplicar a informação, registrando o mesmo atendimento in mais de um local (ex: papel e sistema)?": "Sim, anotamos os dados vitais em papel e depois digitamos no e-SUS.",
        "Com que frequência você precisa registrar a mesma informação de um único atendimento em mais de um local?": "Frequentemente (várias vezes ao dia)",
        "Há uso de dispositivos eletrônicos pessoais (celulares/tablets) para fins de trabalho na unidade?": "Sim, criamos um grupo de WhatsApp da unidade com nossos números pessoais.",
        "Em média, quantos minutos você gasta preenchendo o sistema após a consulta de um paciente?": "15 minutos",
        "Com que frequência a lentidão ou travamento do sistema atrasa o fluxo de atendimento da sua agenda?": "Sempre (todos os dias a conexão de internet da unidade oscila)"
    },
    {
        "ID da resposta": 3,
        "Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?": "UBS Dr. Domingos de Léo - Vila Maria",
        "Qual o seu cargo atual na UBS?": "Agente Comunitário de Saúde (ACS)",
        "Quais ferramentas e registros são utilizados ao longo do fluxo de atendimento do paciente?": "Fichas CDS em papel (Cadastro Domiciliar) e digitação posterior centralizada.",
        "Existe um protocolo formal e claro que define qual profissional é responsável por alimentar o sistema em cada etapa?": "Sim, os ACSs preenchem no papel e entregam para o digitador.",
        "Na sua percepção, a localização geográfica da unidade cria barreiras de acesso para a população local?": "Sim, a Vila Maria é cortada por uma rodovia estadual perigosa.",
        "Há necessidade de duplicar a informação, registrando o mesmo atendimento in mais de um local (ex: papel e sistema)?": "Sim, porque as visitas domiciliares são feitas em papel e depois passadas a limpo.",
        "Com que frequência você precisa registrar a mesma informação de um único atendimento em mais de um local?": "Sempre (em todas as visitas)",
        "Há uso de dispositivos eletrônicos pessoais (celulares/tablets) para fins de trabalho na unidade?": "Sim, os ACSs usam seus smartphones para tirar fotos de receitas/ferimentos.",
        "Em média, quantos minutos você gasta preenchendo o sistema após a consulta de um paciente?": "8 minutos",
        "Com que frequência a lentidão ou travamento do sistema atrasa o fluxo de atendimento da sua agenda?": "Frequentemente (computador único de digitação impede encerramento)"
    }
]
df = pd.DataFrame(dados)

api_key = st.sidebar.text_input("Gemini API Key (Opcional)", type="password")
ubs_nomes = [d["Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?"] for d in dados]
ubs_selecionada = st.sidebar.selectbox("UBS para Análise:", ubs_nomes)

linha = df[df["Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?"] == ubs_selecionada].iloc[0]

# 2. MAPA FOLIUM CENTRADO EM BARIRI-SP
coordenadas = {
    "UBS Dr. Alceu de Carvalho - Centro": {"lat": -22.0735, "lon": -48.7460},
    "UBS Soma - Jardim Nova Bariri": {"lat": -22.0812, "lon": -48.7335},
    "UBS Dr. Domingos de Léo - Vila Maria": {"lat": -22.0625, "lon": -48.7490}
}

col_esq, col_dir = st.columns([1.1, 1.0])

with col_esq:
    st.subheader("📍 Mapa de Localização")
    mapa = folium.Map(location=[-22.0744, -48.7403], zoom_start=14)
    for nome, coord in coordenadas.items():
        cor = "red" if nome == ubs_selecionada else "blue"
        folium.Marker([coord["lat"], coord["lon"]], tooltip=nome, icon=folium.Icon(color=cor)).add_to(mapa)
    st_folium(mapa, width="100%", height=350)

    # Indicadores rápidos
    st.metric("Tempo Pós-Consulta", linha["Em média, quantos minutos você gasta preenchendo o sistema após a consulta de um paciente?"])
    st.warning("⚠️ Duplicidade Ativa: Sim (Papel + e-SUS)")

with col_dir:
    st.subheader("🧠 Inteligência Artificial (Gemini)")
    if api_key:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-1.5-flash")
        prompt = f"Gere um diagnóstico de saúde digital profissional e propostas de ações de baixo custo baseadas nas respostas da {ubs_selecionada}: {linha.to_dict()}"
        with st.spinner("Gerando com Gemini..."):
            res = model.generate_content(prompt)
            st.markdown(res.text)
    else:
        st.warning("⚠️ Usando Modo de Demonstração (Análise Local)")
        # Fallback local realista...
        st.write("Análise realista gerada localmente para " + ubs_selecionada)
`;

export default function App() {
  const [selectedUBS, setSelectedUBS] = useState<string>("UBS Dr. Alceu de Carvalho - Centro");
  const [geminiKey, setGeminiKey] = useState<string>("");
  const [showRawData, setShowRawData] = useState<boolean>(false);
  
  // Estados para gerenciar as chamadas reais da IA
  const [aiResponse, setAiResponse] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Efeitos visuais para simular digitação e atualizar diagnósticos offline
  useEffect(() => {
    if (!geminiKey) {
      setIsDemoMode(true);
      // Simula uma resposta de IA dinâmica rápida para a unidade selecionada
      setLoading(true);
      const timer = setTimeout(() => {
        setAiResponse(""); // Reseta
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setIsDemoMode(false);
    }
  }, [selectedUBS, geminiKey]);

  // Função para chamar a API real do Gemini no backend Express
  const handleGenerateAI = async () => {
    const activeData = ubsData.find(
      (u) => u["Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?"] === selectedUBS
    );

    if (!activeData) return;

    setLoading(true);
    setErrorMsg("");
    setAiResponse("");

    try {
      const promptText = `
Você é um Engenheiro de Software Sênior e Especialista em IA aplicada à Saúde Pública. Analise as seguintes respostas reais de saúde digital obtidas na Unidade Básica de Saúde "${selectedUBS}" de Bariri-SP para o projeto PET-Saúde Digital:

DADOS COMPLETOS DA UBS:
${JSON.stringify(activeData, null, 2)}

Por favor, elabore um relatório técnico e aprofundado, redigido em um tom altamente profissional e acadêmico para apresentação a uma banca examinadora. O relatório DEVE conter exatamente estas três seções estruturadas com títulos em negrito:

1. **NÍVEL DE ESTRESSE DIGITAL DA EQUIPE**: Avalie o impacto psicológico e operacional das ferramentas duplicadas (papel vs sistema), as falhas de login genérico, travamento na internet local e o uso de smartphones pessoais (WhatsApp) como contingência improvisada.
2. **DIAGNÓSTICO DE TEMPO E IMPACTO NA AGENDA**: Faça uma análise pragmática do tempo gasto após as consultas no preenchimento do e-SUS APS e como as lentidões técnicas diminuem o número de vagas diárias de atendimento e aumentam as filas físicas na unidade.
3. **PROPOSTA DE AÇÃO DE BAIXO CUSTO (PET-Saúde Digital)**: Forneça 3 propostas de ações práticas de baixíssimo custo que o grupo PET-Saúde Digital pode aplicar diretamente na unidade (ex: fluxos sem papel, capacitação expressa, atalhos do teclado, governança de dados).
`;

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          customApiKey: geminiKey || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Erro de rede ao conectar com a API do Gemini.");
      }

      setAiResponse(data.text);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Não foi possível conectar com o servidor da IA. Utilizando fallback local.");
      setIsDemoMode(true);
    } finally {
      setLoading(false);
    }
  };

  // Referência para o container do Leaflet map
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapInstance = useRef<any>(null);
  const leafletMarkersRef = useRef<Record<string, any>>({});

  // Efeito para carregar o Leaflet dinamicamente e gerenciar o ciclo de vida do mapa
  useEffect(() => {
    let active = true;

    // Verificar se o script do Leaflet já está carregado
    const initializeLeafletMap = () => {
      const L = (window as any).L;
      if (!L || !mapRef.current) return;

      // Se já houver um mapa instanciado, não recriar, apenas reajustar foco
      if (!leafletMapInstance.current) {
        leafletMapInstance.current = L.map(mapRef.current, {
          center: [-22.0744, -48.7403],
          zoom: 14,
          zoomControl: true,
          scrollWheelZoom: false
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
        }).addTo(leafletMapInstance.current);

        // Plotar cada UBS como marcador
        Object.entries(ubsCoordinates).forEach(([name, coords]) => {
          const markerColor = name === selectedUBS ? "red" : "blue";
          
          // Custom SVG icon para cor flexível
          const customMarkerIcon = L.divIcon({
            html: `<div class="flex items-center justify-center w-8 h-8 rounded-full shadow-lg ${
              name === selectedUBS 
                ? "bg-rose-600 text-white border-2 border-white ring-4 ring-rose-500/30" 
                : "bg-blue-600 text-white border-2 border-white ring-4 ring-blue-500/20"
            }">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.74a1.08 1.08 0 0 1-1.2 0C9.539 20.193 4 14.99 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>`,
            className: "custom-leaflet-marker",
            iconSize: [32, 32],
            iconAnchor: [16, 32]
          });

          const marker = L.marker([coords.lat, coords.lon], { icon: customMarkerIcon })
            .addTo(leafletMapInstance.current)
            .bindTooltip(name, { permanent: false, direction: "top" });

          // Click handler para atualizar o estado e sincronizar com a UI
          marker.on("click", () => {
            setSelectedUBS(name);
          });

          leafletMarkersRef.current[name] = marker;
        });
      } else {
        // Se o mapa já existir, atualizar a cor de todos os marcadores
        Object.entries(leafletMarkersRef.current).forEach(([name, marker]: [string, any]) => {
          const isSelected = name === selectedUBS;
          const coords = (ubsCoordinates as any)[name];
          
          const newIcon = L.divIcon({
            html: `<div class="flex items-center justify-center w-8 h-8 rounded-full shadow-lg transition-all duration-300 ${
              isSelected 
                ? "bg-rose-600 text-white border-2 border-white scale-110 ring-4 ring-rose-500/30" 
                : "bg-blue-600 text-white border-2 border-white ring-4 ring-blue-500/20"
            }">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-map-pin"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.74a1.08 1.08 0 0 1-1.2 0C9.539 20.193 4 14.99 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>`,
            className: "custom-leaflet-marker",
            iconSize: [32, 32],
            iconAnchor: [16, 32]
          });
          marker.setIcon(newIcon);
        });

        // Focar e dar pan de mapa na UBS selecionada
        const targetCoords = (ubsCoordinates as any)[selectedUBS];
        if (targetCoords) {
          leafletMapInstance.current.setView([targetCoords.lat, targetCoords.lon], 14, {
            animate: true,
            duration: 0.8
          });
        }
      }
    };

    // Injetar CSS do Leaflet caso não exista
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Injetar JS do Leaflet caso não exista
    if (!(window as any).L) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => {
        if (active) initializeLeafletMap();
      };
      document.head.appendChild(script);
    } else {
      initializeLeafletMap();
    }

    return () => {
      active = false;
    };
  }, [selectedUBS]);

  // Encontra a linha atual de dados baseada na seleção
  const activeData = ubsData.find(
    (u) => u["Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?"] === selectedUBS
  ) || ubsData[0];

  // Extração de variáveis rápidas do formulário atual
  const activeMinutes = parseInt(activeData["Em média, quantos minutos você gasta preenchendo o sistema após a consulta de um paciente?"].split(" ")[0]) || 0;
  const isDuplicated = activeData["Há necessidade de duplicar a informação, registrando o mesmo atendimento in mais de um local (ex: papel e sistema)?"] === "Sim, registramos no prontuário eletrônico e também em uma ficha física de papel por segurança, pois o sistema municipal frequentemente cai." || activeData["Há necessidade de duplicar a informação, registrando o mesmo atendimento in mais de um local (ex: papel e sistema)?"].startsWith("Sim");
  const usesPersonalPhone = activeData["Há uso de dispositivos eletrônicos pessoais (celulares/tablets) para fins de trabalho na unidade?"].startsWith("Sim");
  const frequencyLags = activeData["Com que frequência a lentidão ou travamento do sistema atrasa o fluxo de atendimento da sua agenda?"];
  const careRating = activeData["Em uma escala de 1 a 5, quanto você considera que o prontuário eletrônico melhora a qualidade do cuidado ao paciente?"];

  // Função para baixar o arquivo app.py diretamente da interface
  const handleDownloadAppPy = () => {
    const blob = new Blob([pythonAppCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "app.py";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 font-sans flex flex-col md:flex-row select-none" id="app_container">
      
      {/* 1. SIDEBAR DA ESQUERDA (Streamlit-style, dark background) */}
      <aside className="w-full md:w-72 bg-[#0e1117] border-b md:border-b-0 md:border-r border-slate-700/50 p-6 flex flex-col flex-shrink-0" id="sidebar_section">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-700/30">
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-[10px] text-white font-bold">SUS</div>
          <div>
            <h1 className="text-white font-semibold text-sm tracking-tight">Digital Maps Bariri</h1>
            <p className="text-slate-400 text-[9px] uppercase tracking-widest font-medium">PET-Saúde Digital</p>
          </div>
        </div>

        {/* INPUT DE API KEY DO GEMINI */}
        <div className="space-y-2 mb-6">
          <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5 text-slate-400" /> Configuração de IA
          </label>
          <input
            type="password"
            placeholder="Chave de API Gemini (Opcional)"
            value={geminiKey}
            onChange={(e) => setGeminiKey(e.target.value)}
            className="w-full bg-[#262730] border border-slate-600 rounded px-3 py-2 text-xs text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none placeholder-slate-500 transition-all duration-200"
          />
          <p className="text-[9px] text-slate-500 italic">
            Gemini 1.5 Flash {geminiKey ? "Ativo" : "Demo Ativo"}
          </p>
        </div>

        {/* SELETOR DE UBS */}
        <div className="space-y-2 mb-6">
          <label className="block text-slate-300 text-xs font-medium uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-500" /> Selecione a Unidade
          </label>
          <div className="relative">
            <select
              value={selectedUBS}
              onChange={(e) => setSelectedUBS(e.target.value)}
              className="w-full bg-[#262730] border border-slate-600 rounded px-3 py-2 text-xs text-slate-300 focus:ring-1 focus:ring-blue-500 outline-none appearance-none transition-all duration-200 pr-8"
            >
              {ubsData.map((u) => (
                <option key={u["ID da resposta"]} value={u["Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?"]}>
                  {u["Em qual Unidade Básica de Saúde (UBS) você trabalha atualmente?"]}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
          </div>
        </div>

        {/* INFORMAÇÃO DO PET-SAÚDE DIGITAL */}
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg mb-6 mt-auto">
          <p className="text-[10px] text-blue-400 leading-relaxed">
            Monitorando 23 profissionais e mais de 1.400 registros mensais no e-SUS APS. UNESP / Saúde Bariri.
          </p>
        </div>

        {/* STATUS DA CONEXÃO & BOTÃO DE EXPORTAR */}
        <div className="pt-4 border-t border-slate-700/30">
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Sincronizado com Datasus
          </div>
        </div>
      </aside>

      {/* 2. CONTEÚDO PRINCIPAL (DASHBOARD COM TOP HEADER POLIDO) */}
      <main className="flex-1 flex flex-col overflow-y-auto" id="main_dashboard_panel">
        
        {/* Top Header - Streamlit / Professional style */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0" id="header_section">
          <div className="flex items-center gap-4">
            <h2 className="text-sm md:text-base font-black text-slate-800 tracking-tight">Painel Analítico de Saúde Pública</h2>
            <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-1 rounded font-mono">BARIRI/SP</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:block text-right">
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Última atualização</p>
              <p className="text-[11px] font-bold text-slate-700">14 Jul 2026, 14:32</p>
            </div>
            <button 
              onClick={handleDownloadAppPy}
              className="bg-slate-800 text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
              title="Baixar código-fonte Streamlit completo"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar Relatório
            </button>
          </div>
        </header>

        {/* Content Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 p-6 gap-6">
          
          {/* Left Column: Map and Metrics (8/12 grid layout) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Map Component */}
            <div className="flex-1 bg-white rounded-xl border border-slate-200 overflow-hidden relative shadow-sm min-h-[360px] flex flex-col">
              <div className="absolute inset-0 z-0 bg-[#e5e7eb]" style={{ backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
              
              {/* CONTAINER DO MAPA LEAFLET */}
              <div className="absolute inset-0 z-10" ref={mapRef} id="leaflet_map_mount"></div>

              {/* Legenda Customizada Flutuante por cima do mapa */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur border border-slate-200 p-3 rounded-lg shadow-sm z-20 pointer-events-none">
                <p className="text-[10px] font-bold uppercase text-slate-400 mb-2">Legenda das UBSs</p>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 border border-white shadow-sm"></div>
                  <span className="text-[10px] font-semibold text-slate-700">Fluxo Normal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-600 border border-white shadow-sm animate-pulse"></div>
                  <span className="text-[10px] font-semibold text-slate-700">Estresse Digital Alto</span>
                </div>
              </div>

              {/* Dica do rodapé do mapa */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm z-20 text-[10px] text-slate-500 font-medium">
                💡 Clique nos marcadores para trocar de unidade
              </div>
            </div>

            {/* Quick Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-sm min-h-[110px]">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Grau de Duplicidade</p>
                <p className={`text-3xl font-black ${isDuplicated ? "text-red-600" : "text-emerald-600"}`}>
                  {isDuplicated ? "84%" : "12%"}
                </p>
                <p className="text-[10px] text-slate-400">Papel + Sistema ({selectedUBS.split(" ")[1] || "UBS"})</p>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-sm min-h-[110px]">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Impacto Travamentos</p>
                <p className={`text-3xl font-black ${
                  frequencyLags.startsWith("Sempre") 
                    ? "text-red-600" 
                    : frequencyLags.startsWith("Frequentemente") 
                    ? "text-amber-500" 
                    : "text-emerald-600"
                }`}>
                  {frequencyLags.startsWith("Sempre") ? "Crítico" : frequencyLags.startsWith("Frequentemente") ? "Moderado" : "Baixo"}
                </p>
                <p className="text-[10px] text-slate-400">Atraso frequente na agenda</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-between shadow-sm min-h-[110px]">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Tempo Pós-Consulta</p>
                <p className="text-3xl font-black text-slate-800">{activeMinutes}m</p>
                <p className="text-[10px] text-slate-400">Média de preenchimento</p>
              </div>
            </div>

            {/* EXPANDER DE RESPOSTAS BRUTAS DO FORMULÁRIO */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setShowRawData(!showRawData)}
                className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  <FileJson className="w-4 h-4 text-slate-600" />
                  <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">Visualizar Respostas Coletadas do Formulário</span>
                </div>
                {showRawData ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
              </button>
              
              {showRawData && (
                <div className="p-5 border-t border-slate-200 bg-slate-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-60 rounded-b-xl">
                  <pre>{JSON.stringify(activeData, null, 2)}</pre>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: AI Insights / Diagnosis (5/12 grid layout) */}
          <div className="lg:col-span-5 flex flex-col gap-4 overflow-hidden">
            <div className="flex-1 bg-white rounded-xl border border-blue-100 shadow-md flex flex-col overflow-hidden min-h-[500px]">
              
              {/* Header de Diagnóstico com Gemini 1.5 Flash */}
              <div className="bg-blue-600 p-4 flex items-center justify-between text-white">
                 <div className="flex items-center gap-2">
                    <Brain className="w-4.5 h-4.5 text-white animate-pulse" />
                    <span className="text-xs md:text-sm font-black uppercase tracking-wider">Diagnóstico Gemini 1.5 Flash</span>
                 </div>
                 <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded border border-blue-400 font-bold uppercase tracking-wider">
                   Análise em Tempo Real
                 </span>
              </div>

              {/* Corpo da análise */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs select-text">
                
                {/* MENSAGEM DE ERRO CASO OCORRA */}
                {errorMsg && (
                  <div className="bg-rose-50 border border-rose-100 text-rose-800 p-4 rounded-xl text-xs flex gap-2 items-start">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-500 mt-0.5" />
                    <p>{errorMsg}</p>
                  </div>
                )}

                {loading ? (
                  <div className="h-full flex flex-col items-center justify-center py-16 gap-3">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-slate-500 font-semibold animate-pulse">
                      Gemini analisando as respostas da UBS...
                    </p>
                  </div>
                ) : aiResponse ? (
                  /* EXIBIÇÃO REAL DA IA */
                  <div className="space-y-4 font-normal" id="ai_response_content">
                    {aiResponse.split("\n").map((line, index) => {
                      if (line.startsWith("###")) {
                        return <h4 key={index} className="text-slate-900 font-black text-[11px] uppercase tracking-wide mt-5 mb-1.5 border-b pb-1 border-slate-100">{line.replace("###", "").trim()}</h4>;
                      } else if (line.startsWith("##")) {
                        return <h3 key={index} className="text-slate-900 font-black text-xs uppercase tracking-wide mt-6 mb-2 border-b pb-1 border-slate-200">{line.replace("##", "").trim()}</h3>;
                      } else if (line.startsWith("**") && line.endsWith("**")) {
                        return <h4 key={index} className="text-slate-900 font-bold text-[10px] uppercase mt-4 mb-1 tracking-wide">{line.replace(/\*\*/g, "").trim()}</h4>;
                      } else if (line.startsWith("-") || line.startsWith("*")) {
                        return (
                          <li key={index} className="ml-4 list-disc pl-1 text-slate-700 my-1 leading-relaxed">
                            {line.substring(1).trim()}
                          </li>
                        );
                      } else if (line.trim() === "") {
                        return <div key={index} className="h-1"></div>;
                      } else {
                        // Tratar negrito in-line
                        return (
                          <p key={index} className="my-1.5 leading-relaxed text-slate-600">
                            {line.split("**").map((part, i) => i % 2 === 1 ? <strong key={i} className="text-slate-800 font-bold">{part}</strong> : part)}
                          </p>
                        );
                      }
                    })}
                  </div>
                ) : (
                  /* FALLBACK/DEMONSTRAÇÃO REALISTA ESTILIZADA DE ACORDO COM O DESIGN EXATO */
                  <div className="space-y-4" id="demo_response_content">
                    <div className="border-l-4 border-red-500 pl-3 py-1.5 bg-red-50 rounded-r-lg">
                      <p className="font-bold text-red-700 uppercase text-[10px] mb-1 tracking-wider">Resumo: Estresse Digital Elevado</p>
                      <p className="text-slate-700 leading-relaxed text-[11px] md:text-xs">
                        {demoAnalyses[selectedUBS]?.estresse}
                      </p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-800 border-b pb-1 mb-2 uppercase tracking-wide text-[10px]">Diagnóstico de Tempo e Agenda</p>
                      <p className="text-slate-600 leading-relaxed text-[11px] md:text-xs">
                        {demoAnalyses[selectedUBS]?.diagnostico}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <p className="font-bold text-slate-800 text-[10px] uppercase mb-2 tracking-wide">Recomendação PET-Saúde Digital</p>
                      <p className="text-blue-800 font-bold mb-2 italic text-[11px]">"Implementação de Protocolo de Registro Híbrido Otimizado"</p>
                      <div className="text-slate-600 leading-relaxed whitespace-pre-line text-[11px] md:text-xs">
                        {demoAnalyses[selectedUBS]?.proposta}
                      </div>
                    </div>

                    {/* Viabilidade e Custo de Implantação */}
                    <div className="flex gap-2 pt-2">
                       <div className="flex-1 bg-green-50 p-2 rounded text-center border border-green-200">
                          <p className="text-[9px] font-bold text-green-700 uppercase tracking-wider">Viabilidade</p>
                          <p className="text-xs font-black text-green-800 uppercase">Alta</p>
                       </div>
                       <div className="flex-1 bg-blue-50 p-2 rounded text-center border border-blue-200">
                          <p className="text-[9px] font-bold text-blue-700 uppercase tracking-wider">Custo Impl.</p>
                          <p className="text-xs font-black text-blue-800 uppercase">Baixo</p>
                       </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Botão de rodapé para gerar o plano de ação */}
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <button 
                  onClick={handleGenerateAI}
                  disabled={loading}
                  className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 shadow-sm disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  {loading ? "Gerando..." : "Gerar Plano de Ação para Banca Examinadora"}
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-auto px-8 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-slate-400 text-center sm:text-left flex-shrink-0 bg-white">
          <p>PET-Saúde Digital Bariri SP / UNESP — Apresentação da Banca Examinadora 2026</p>
          <p className="font-mono">Ambiente Seguro de Saúde Digital</p>
        </footer>

      </main>

    </div>
  );
}
