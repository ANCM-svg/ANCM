import streamlit as st
import google.generativeai as genai

# Couleurs de la charte ANCM
ANCM_YELLOW = "#fac729"
ANCM_RED = "#e75e5f"

st.set_page_config(page_title="ANCM - Guide Hébergement", page_icon="🌍")

# Interface personnalisée
st.markdown(f"<h1 style='color: {ANCM_RED};'>52e Festival Les Cultures du Monde</h1>", unsafe_content_type=True)
st.subheader("Hébergements & Distances (Gannat)")

# Affichage des infos concrètes
col1, col2, col3 = st.columns(3)
with col1:
    st.metric("Lycée G. Eiffel", "900m", "Resto des Nations")
with col2:
    st.metric("S. du Bouzol", "1.2km", "15 min à pied")
with col3:
    st.metric("P. Occitanes", "1.5km", "18 min à pied")

# Configuration de l'IA (Utilise le secret configuré plus tard sur Streamlit)
if "GEMINI_API_KEY" in st.secrets:
    genai.configure(api_key=st.secrets["GEMINI_API_KEY"])
    
    if "messages" not in st.session_state:
        st.session_state.messages = []

    for message in st.session_state.messages:
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

    if prompt := st.chat_input("Une question sur les trajets ou les lieux ?"):
        st.session_state.messages.append({"role": "user", "content": prompt})
        with st.chat_message("user"):
            st.markdown(prompt)

        model = genai.GenerativeModel('gemini-1.5-flash', 
            system_instruction="Tu es l'assistant de l'ANCM. Les lieux sont : Lycée Eiffel (cantine), Bouzol, Portes Occitanes. La place du festival est la Place de la Victoire.")
        
        response = model.generate_content(prompt)
        with st.chat_message("assistant"):
            st.markdown(response.text)
        st.session_state.messages.append({"role": "assistant", "content": response.text})
else:
    st.error("Clé API manquante. Veuillez la configurer dans les secrets Streamlit.")
