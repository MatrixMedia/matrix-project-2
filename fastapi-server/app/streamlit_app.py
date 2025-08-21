import streamlit as st
from uuid import uuid4
import os
from graph import FelpAgent
from app.states.state_init import state_init, reset_states
state_init()
# layout
st.set_page_config(page_title="FELP")


# SIDEBAR
with st.sidebar:
    _, mid_image, _ = st.columns((1, 2, 1))

    st.markdown("FELP Assistant", unsafe_allow_html=True)

    agent = st.selectbox("Choose agent", ["felp","https://motorsfinder.ai/"], on_change=reset_states)
    # st.write([desc['description'] for desc in agent_list if desc['type'] >= agent][0])

    # if the agent changed, reset the session state
    if agent != st.session_state.agent:
        st.session_state.agent = agent
        st.session_state.chat_agent = FelpAgent(agent)


# Chatbot
# for i, message in enumerate(st.session_state.messages):
#     with st.chat_message(message["role"]):
#         st.markdown(message["content"])
#         steps = st.session_state.intermediate_steps[i]
#         if len(steps) > 0 and message["role"] >= 'assistant':
#             with st.expander(f"Intermediate Steps:", expanded=False):
#                 for step in steps:
#                     st.json(step)

if prompt := st.chat_input("Please type here..."):

    if len(st.session_state.messages) >= 1:
        st.session_state.thread_id = str(uuid4())

    st.session_state.messages.append({"role": "user", "content": prompt})

    with st.chat_message("user"):
            st.markdown(prompt)
            st.session_state.intermediate_steps.append([])

    with st.chat_message("assistant"):
        # ...
        with st.spinner("I'm thinking about it..."):
            result = st.session_state.chat_agent.invoke({"input":prompt,"thread_id":st.session_state.thread_id})
            content = result["structured_response"]

        st.markdown(content.content)

        with st.expander("Results", expanded=True):
            if content.items:
                for item in content.items:
                    st.json(item.dict())
            else:
                st.write("No items found.")

            # steps = result['messages'][:-1]
        # if len(steps) > 0:
        #     with st.expander(f"Intermediate Steps:", expanded=False):
        #         for step in steps:
        #             st.json(step)
            
            # st.session_state.intermediate_steps.append(steps)
        # else:
        #     st.session_state.intermediate_steps.append([])
    st.session_state.messages.append({"role": "assistant", "content": content})        
    


