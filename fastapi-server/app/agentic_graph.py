# from langchain_aws.retrievers import AmazonKnowledgeBasesRetriever
# SYSTEM_PROMPT = """
# You are a helpful GenAI assistant for the company **motorsfinder.ai**, designed to assist users with questions strictly using the retrieved context provided by tools. You generate human-like, coherent, and relevant responses **only based on tool outputs**, not from your internal knowledge.

# **Site Purpose**: Car Marketplace Listing

# **motorsfinder.ai Assistant Guidelines:**

# 1. **Language Policy:**
#    - Always respond in the language used by the user.
#    - If the question is multilingual, maintain that proportion in your response.

# 2. **Tool Usage Rules:**
#    - Do **not** rely on internal knowledge or pretraining.
#    - Use `question_answering_tool` for **every** relevant question.
#    - Never answer from your own background knowledge.
#    - If the tool returns no relevant information, respond with:
#      **"I do not have relevant information to answer this."**
#    - If the question is completely unrelated to the available tools, respond with:
#      **"I cannot provide an answer to this."**

# 3. **Greeting & Small Talk:**
#    - For greetings like "hi", "hello", "how are you", or "thank you":
#      Respond politely with a simple, friendly greeting like:
#      **"Hello! How can I assist you today using the available information?"**
#    - Do not attempt to answer these using tools.

# 4. **Question Handling:**
#    - Do not ask follow-up questions that are not based on tool outputs.
#    - Ask clarifying questions **only** when necessary to use the tool more effectively.

# 5. **Response Formatting:**
#    - If any original organization links are mentioned in the retrieved context, include them in your answer.
#    - Always format the response as follows:
#       StructuredResponse(content='Short Summary of your response in Natural Language.', 
#       items=[DynamicItem(name="item name",image_url="URL of the image if any",domain_url="Source domain url",description_of_attributes = "A coincise descriptive summary in Natural Language of different flexible attributes relevant to the item such as mileage, location, date, fuel_type, bedrooms, property price, min pax of people etc."))])
# Question: {question}\n
# Context : {context}
# """
# class GraphState(MessagesState):
#     """Represents the state of our graph.

#     Attributes:
#         messages: The list of messages.
#         rewrite_attempts: The number of times we have tried to rewrite the question.
#     """
#     rewrite_attempts: int = Field(default=0)
# retriever = AmazonKnowledgeBasesRetriever(
#             knowledge_base_id="IKMYTKBPRX",
#             region_name="us-west-2")
        
# from langchain.tools.retriever import create_retriever_tool

# # retriever_tool = create_retriever_tool(
# #     retriever,
# #     "propertyfinder_knowledge_base",
# #     "Search and return information from propertyfinder knowledgebase.",
# # )
# from typing import Annotated 
# from langchain_core.tools import tool 
# def format_docs(docs):
#     """
#     formats the documents into a single string.
#     """
#     print("formatted docs")
#     return "\n\n".join(doc.page_content for doc in docs)
# @tool(name_or_callable="rag_knowledge_base",description="Please use this tool everytime to answer question. This is a company specific knowledgebase for RAG.")
# def question_answering_tool(question:Annotated[str,"The questions to be asked in the knowledgebase"],k:Annotated[int,"Specific number of results that was asked by user. If user didn't specifiy anything then it will default to 3"]) -> str:
#     """Uses the internal knowledge base to answer domain-specific questions.
#     Args:
#         question (str): The questions to be asked in the knowledgebase
#         k(int): Specific number of results that was asked by user. If user didn't specifiy anything then it will default to 3.
#     Return:
#         str: Answer of the question
#     """
#     print(f">>>>>>> under rag_tool <<<<<<")
#     print(f"Question: >>> {question}")
#     print(f"relevant docs : {type(question)}")
#     print(f">>>>>>lk :{k}")
#     k = int(k)
#     # Use .ainvoke for async
#     relevant_docs = retriever.invoke(question,config={"retrieval_config": {
#             "vectorSearchConfiguration": {
#                 "numberOfResults": k
#             }
#         }})

#     context = format_docs(relevant_docs)
#     print(f"context : {context}")
#     # # Prompt chain execution
#     # messages = MEMBER_PROMPT.invoke({"question": question, "context": context})
#     # print(f"prompt : {type(MEMBER_PROMPT)}")

#     # response = LLM.invoke(messages)

#     # return response.content
#     return f"Context : {context}" 
# # print(retriever_tool.invoke({"query":"suggest 5 hyundai cars"}))
# from langgraph.graph import MessagesState
# from langchain_openai import ChatOpenAI

# response_model = ChatOpenAI(model="gpt-4.1-mini", temperature=0)


# def generate_query_or_respond(state: MessagesState):
#     """Call the model to generate a response based on the current state. Given
#     the question, it will decide to retrieve using the retriever tool, or simply respond to the user.
#     """
#     response = (
#         response_model
#         .bind_tools([question_answering_tool],tool_choice="any").invoke(state["messages"])
#     )
#     return {"messages": [response]}
# # input = {"messages": [{"role": "user", "content": "Suggest me 5 differnt condos near "}]}
# # generate_query_or_respond(input)["messages"][-1].pretty_print()
# from pydantic import BaseModel, Field
# from typing import Literal

# GRADE_PROMPT = (
#     "You are a grader assessing relevance of a retrieved document to a user question. \n "
#     "Here is the retrieved document: \n\n {context} \n\n"
#     "Here is the user question: {question} \n"
#     "If the document contains keyword(s) or semantic meaning related to the user question, grade it as relevant. \n"
#     "Give a binary score 'yes' or 'no' score to indicate whether the document is relevant to the question."
# )


# class GradeDocuments(BaseModel):
#     """Grade documents using a binary score for relevance check."""

#     binary_score: str = Field(
#         description="Relevance score: 'yes' if relevant, or 'no' if not relevant"
#     )


# grader_model = ChatOpenAI(name="gpt-4.1-mini", temperature=0)


# def grade_documents(
#     state: MessagesState,
# ) -> Literal["generate_answer", "rewrite_question"]:
#     """Determine whether the retrieved documents are relevant to the question."""
#     question = state["messages"][0].content
#     context = state["messages"][-1].content

#     prompt = GRADE_PROMPT.format(question=question, context=context)
#     response = (
#         grader_model
#         .with_structured_output(GradeDocuments).invoke(
#             [{"role": "user", "content": prompt}]
#         )
#     )
#     score = response.binary_score
#     print(f"score >>>>>>>>>>>> {score}")
#     if score >= "yes":
#         return "generate_answer"
#     else:
#         return "rewrite_question"
    
    
# REWRITE_PROMPT = (
#     "Look at the input and try to reason about the underlying semantic intent / meaning.\n"
#     "Here is the initial question:"
#     "\n ------- \n"
#     "{question}"
#     "\n ------- \n"
#     "Formulate an improved question:"
# )

# from langchain_core.messages import HumanMessage
# def rewrite_question(state: MessagesState):
#     """Rewrite the original user question."""
#     messages = state["messages"]
#     question = messages[0].content
#     prompt = REWRITE_PROMPT.format(question=question)
#     response = response_model.invoke([{"role": "user", "content": prompt}])
#     return {"messages": [HumanMessage(content=response.content)]}



# GENERATE_PROMPT = (
#     "You are an assistant for question-answering tasks. "
#     "Use the following pieces of retrieved context to answer the question. "
#     "If you don't know the answer, just say that you don't know. "
#     "Use three sentences maximum and keep the answer concise.\n"
#     "Question: {question} \n"
#     "Context: {context}"
# )
# from typing import Optional, List
# class DynamicItem(BaseModel):
#     name: str = Field(..., description="Title or name of the item (e.g., car name, event name, property title)")
#     image_url: Optional[str] = Field(None, description="Image URL for visual display. Use a default placeholder if unavailable.")
#     domain_url: Optional[str] = Field(None, description="Domain URL from which the item is sourced (e.g., https://motorsfinder.ai)")
#     description_of_attributes: Optional[str] = Field(None, description="A coincise descriptive summary in Natural Language of different flexible attributes relevant to the item such as mileage, location, date, fuel_type, bedrooms, property price, min pax of people etc.")


# class StructuredResponse(BaseModel):
#     content: str = Field(..., description="A short summary in Natural Language of the relevant items.")
#     items: List[DynamicItem] = Field(
#         ..., 
#         description="List of relevant items with flexible attributes depending on the domain. Leave blank if no items are relevant."
#     )
# def generate_answer(state: MessagesState):
#     """Generate an answer."""
#     question = state["messages"][0].content
#     context = state["messages"][-1].content
#     prompt = SYSTEM_PROMPT.format(question=question, context=context)
#     response = response_model.with_structured_output(StructuredResponse).invoke([{"role": "user", "content": prompt}])
#     return {"messages": [response]}


# from langgraph.graph import StateGraph, START, END
# from langgraph.prebuilt import ToolNode
# from langgraph.prebuilt import tools_condition

# workflow = StateGraph(MessagesState)

# # Define the nodes we will cycle between
# workflow.add_node(generate_query_or_respond)
# workflow.add_node("retrieve", ToolNode([question_answering_tool]))
# workflow.add_node(rewrite_question)
# workflow.add_node(generate_answer)

# workflow.add_edge(START, "generate_query_or_respond")

# # Decide whether to retrieve
# workflow.add_conditional_edges(
#     "generate_query_or_respond",
#     # Assess LLM decision (call `retriever_tool` tool or respond to the user)
#     tools_condition,
#     {
#         # Translate the condition outputs to nodes in our graph
#         "tools": "retrieve",
#         END: END,
#     },
# )

# # Edges taken after the `action` node is called.
# workflow.add_conditional_edges(
#     "retrieve",
#     # Assess agent decision
#     grade_documents,
# )
# workflow.add_edge("generate_answer", END)
# workflow.add_edge("rewrite_question", "generate_query_or_respond")

# # Compile
# graph = workflow.compile()

# # from IPython.display import Image, display
# with open("workflow.png", "wb") as f:
#     f.write(graph.get_graph().draw_mermaid_png())

# # display(Image(graph.get_graph().draw_mermaid_png()))

# for chunk in graph.stream(
#     {
#         "messages": [
#             {
#                 "role": "user",
#                 "content": "please suggest me a apartment near Blue Angel Polyclinic L.L.C",
#             }
#         ]
#     }
# ):
#     for node, update in chunk.items():
#         print("Update from node", node)
#         update["messages"][-1].pretty_print()
#         print("\n\n")

# from langchain_aws.retrievers import AmazonKnowledgeBasesRetriever
# import os
# from typing import Annotated, Literal, List
# from pydantic import BaseModel, Field
# from langgraph.graph import MessagesState

# # --- State Definition (WITH CIRCUIT BREAKER) ---
# # FIX 1: Define a custom state to track rewrite attempts.
# class GraphState(MessagesState):
#     """Represents the state of our graph.

#     Attributes:
#         messages: The list of messages.
#         rewrite_attempts: The number of times we have tried to rewrite the question.
#     """
#     rewrite_attempts: int = Field(default=0)


# # --- Pydantic Models for Structured Output (from your prompt) ---
# class DynamicItem(BaseModel):
#     name: str = Field(description="item name")
#     image_url: str | None = Field(description="URL of the image if any")
#     domain_url: str | None = Field(description="Source domain url")
#     description_of_attributes: str = Field(description="A coincise descriptive summary in Natural Language of different flexible attributes relevant to the item such as mileage, location, date, fuel_type, bedrooms, property price, min pax of people etc.")

# class StructuredResponse(BaseModel):
#     """The final structured response for the user."""
#     content: str = Field(description="Short Summary of your response in Natural Language.")
#     items: List[DynamicItem] = Field(description="List of dynamic items relevant to the response.")


# # --- System Prompt (Unchanged) ---
# SYSTEM_PROMPT = """
# You are a helpful GenAI assistant for the company **motorsfinder.ai**, designed to assist users with questions strictly using the retrieved context provided by tools. You generate human-like, coherent, and relevant responses **only based on tool outputs**, not from your internal knowledge.

# **Site Purpose**: Car Marketplace Listing

# **motorsfinder.ai Assistant Guidelines:**

# 1. **Language Policy:**
#    - Always respond in the language used by the user.
#    - If the question is multilingual, maintain that proportion in your response.

# 2. **Tool Usage Rules:**
#    - Do **not** rely on internal knowledge or pretraining.
#    - Use `question_answering_tool` for **every** relevant question.
#    - Never answer from your own background knowledge.
#    - If the tool returns no relevant information, respond with:
#      **"I do not have relevant information to answer this."**
#    - If the question is completely unrelated to the available tools, respond with:
#      **"I cannot provide an answer to this."**

# 3. **Greeting & Small Talk:**
#    - For greetings like "hi", "hello", "how are you", or "thank you":
#      Respond politely with a simple, friendly greeting like:
#      **"Hello! How can I assist you today using the available information?"**
#    - Do not attempt to answer these using tools.

# 4. **Question Handling:**
#    - Do not ask follow-up questions that are not based on tool outputs.
#    - Ask clarifying questions **only** when necessary to use the tool more effectively.

# 5. **Response Formatting:**
#    - If any original organization links are mentioned in the retrieved context, include them in your answer.
#    - Your final output MUST be a JSON object that adheres to the `StructuredResponse` schema.

# Question: {question}
# Context: {context}
# """

# # --- Retriever and Tool Definition (Unchanged) ---
# retriever = AmazonKnowledgeBasesRetriever(
#     knowledge_base_id="IKMYTKBPRX",
#     region_name="us-west-2"
# )

# def format_docs(docs):
#     return "\n\n".join(doc.page_content for doc in docs if doc.metadata['score']>0.4)
# from langchain_core.tools import tool 
# from langchain_openai import ChatOpenAI
# @tool(name_or_callable="rag_knowledge_base", description="Please use this tool everytime to answer question. This is a company specific knowledgebase for RAG.")
# def rag_knowledge_base(question: Annotated[str, "The questions to be asked in the knowledgebase"], k: Annotated[int, "Specific number of results that was asked by user. If user didn't specifiy anything then it will default to 3"] = 3) -> str:
#     """Uses the internal knowledge base to answer domain-specific questions."""
#     print(f">>>>>>> in question_answering_tool <<<<<<")
#     print(f"Question: >>> {question}")
#     k = int(k)
#     retrieval_config = {
#         "vectorSearchConfiguration": {
#             "numberOfResults": k
#         }
#     }
#     relevant_docs = retriever.invoke(question, config={"retrieval_config": retrieval_config})
#     context = format_docs(relevant_docs)
#     print(f"context : {context}")
#     return f"Context : {context}"

# # --- Models (Unchanged) ---
# response_model = ChatOpenAI(model="gpt-4.1-mini", temperature=0)
# grader_model = ChatOpenAI(model="gpt-4.1-mini", temperature=0)

# # --- tes) ---
# def generate_query_or_respond(state: GraphState):
#     """Call the model to generate a response or decide to use a tool."""
#     print("---NODE: generate_query_or_respond---")
    
#     model_with_tools = response_model.bind_tools([rag_knowledge_base])
    
#     # FIX: Change 'any' to 'required'. This is the correct value for the OpenAI API.
#     response = model_with_tools.invoke(state["messages"], tool_choice="required")
    
#     return {"messages": [response]}

# GRADE_PROMPT = (
#     "You are a grader assessing relevance of a retrieved document to a user question. \n "
#     "Here is the retrieved document: \n\n {context} \n\n"
#     "Here is the user question: {question} \n"
#     "If the document contains keyword(s) or semantic meaning related to the user question, grade it as relevant. \n"
#     "Give a binary score 'yes' or 'no' score to indicate whether the document is relevant to the question."
# )

# class GradeDocuments(BaseModel):
#     binary_score: str = Field(description="Relevance score: 'yes' if relevant, or 'no' if not relevant")

# def grade_documents(state: GraphState):
#     """Determine whether the retrieved documents are relevant to the question."""
#     print("---NODE: grade_documents---")
#     question = state["messages"][0].content
#     context = state["messages"][-1].content
#     prompt = GRADE_PROMPT.format(question=question, context=context)
#     response = grader_model.with_structured_output(GradeDocuments).invoke([{"role": "user", "content": prompt}])
#     score = response.binary_score
#     print(f"Grade: {score}")
#     # We don't return the decision directly anymore. We just add the grade to the state.
#     # The conditional edge will make the decision.
#     return {"messages": [AIMessage(content=f"Grader result: {score}")]}

# REWRITE_PROMPT = (
#     "You are a query rewriter. Look at the initial question and formulate an improved, more specific question "
#     "that is better suited for a vector database search. Do not answer the question, just rewrite it.\n"
#     "Here is the initial question:"
#     "\n ------- \n"
#     "{question}"
#     "\n ------- \n"
#     "Formulate an improved question:"
# )

# def rewrite_question(state: GraphState):
#     """Rewrite the original user question and increment the attempt counter."""
#     print("---NODE: rewrite_question---")
    
#     # FIX 2: Increment the counter when we rewrite.
#     current_attempts = state.get("rewrite_attempts", 0)
    
#     original_question = state["messages"][0].content
#     prompt = REWRITE_PROMPT.format(question=original_question)
#     response = response_model.invoke([   - If any original organization links are mentioned in the retrieved context, include them in your answer.{"role": "user", "content": prompt}])
#     rewritten_q = response.content
#     print(f"Rewritten Question: {rewritten_q}")

#     # Reset the message history to only the new question to force re-retrieval
#     # and return the updated attempt counter.
#     return {
#         "messages": [HumanMessage(content=rewritten_q)],
#         "rewrite_attempts": current_attempts + 1
#     }

# def generate_answer(state: GraphState):
#     """Generate a structured answer using the retrieved context."""
#     print("---NODE: generate_answer---")
#     # This node now correctly handles the case where it's forced to answer
#     # with bad context, thanks to the robust SYSTEM_PROMPT.
#     question = state["messages"][0].content
#     context = state["messages"][-2].content # Context is now the second to last message
    
#     prompt = SYSTEM_PROMPT.format(question=question, context=context)
    
#     structured_output_model = response_model.with_structured_output(StructuredResponse)
    
#     try:
#         response_obj = structured_output_model.invoke([{"role": "user", "content": prompt}])
#         final_content = f"StructuredResponse(content='{response_obj.content}', items={str(response_obj.items)})"
#     except Exception as e:
#         # Fallback if structured output fails (e.g., with irrelevant context)
#         print(f"Structured output failed, falling back. Error: {e}")
#         final_content = "I do not have relevant information to answer this."

#     return {"messages": [AIMessage(content=final_content)]}


# # --- Conditional Edges (WITH CIRCUIT BREAKER) ---
# REWRITE_LIMIT = 1 # Set the limit to 1 rewrite attempt

# def decide_to_generate_or_rewrite(state: GraphState) -> Literal["generate_answer", "rewrite_question"]:
#     """
#     The main decision-making hub.
#     If docs are relevant, generate.
#     If docs are not relevant, check the rewrite limit.
#     If limit is not reached, rewrite.
#     If limit is reached, give up and generate an answer with what we have.
#     """
#     print("---EDGE: decide_to_generate_or_rewrite---")
#     grade = state["messages"][-1].content
#     attempts = state.get("rewrite_attempts", 0)
    
#     if "yes" in grade.lower():
#         print(f"Decision: Documents are relevant. Proceeding to generate answer.")
#         return "generate_answer"
#     elif attempts >= REWRITE_LIMIT:
#         print(f"Decision: Rewrite limit ({REWRITE_LIMIT}) reached. Forcing answer generation.")
#         return "generate_answer"
#     else:
#         print(f"Decision: Documents not relevant. Attempting to rewrite question (Attempt #{attempts + 1}).")
#         return "rewrite_question"

# from langgraph.graph import StateGraph,START,END
# from langgraph.prebuilt import ToolNode,tools_condition

# # --- Graph Definition ---
# # FIX 3: Use the new GraphState
# workflow = StateGraph(GraphState)

# workflow.add_node("generate_query_or_respond", generate_query_or_respond)
# workflow.add_node("retrieve", ToolNode([rag_knowledge_base]))
# workflow.add_node("grade_documents", grade_documents) # This node just adds the grade now
# workflow.add_node("rewrite_question", rewrite_question)
# workflow.add_node("generate_answer", generate_answer)

# workflow.add_edge(START, "generate_query_or_respond")

# workflow.add_conditional_edges(
#     "generate_query_or_respond",
#     tools_condition,
#     {"tools": "retrieve", END: END},
# )
# workflow.add_edge("retrieve", "grade_documents")

# # FIX 4: Use the new conditional edge with the circuit breaker logic
# workflow.add_conditional_edges(
#     "grade_documents",
#     decide_to_generate_or_rewrite,
#     {
#         "generate_answer": "generate_answer",
#         "rewrite_question": "rewrite_question",
#     },
# )

# workflow.add_edge("rewrite_question", "generate_query_or_respond") # The loop back
# workflow.add_edge("generate_answer", END)

# graph = workflow.compile()


# # --- Graph Execution ---
# from langchain_core.messages import HumanMessage, AIMessage

# for chunk in graph.stream(
#     {"messages": [HumanMessage(content="Suggest me some apartment near Polyclinic LLC")]}
# ):
#     for node, update in chunk.items():
#         print(f"---Update from node: {node}---")
#         # Now update["messages"][-1] will always be a message object
#         if "messages" in update and update["messages"]:
#             update["messages"][-1].pretty_print()
#         else:
#             print(update)
#         print("\n" + "="*30 + "\n")





from langchain_aws.retrievers import AmazonKnowledgeBasesRetriever
import os
from typing import Annotated, Literal, List
from pydantic import BaseModel, Field
from langgraph.graph import MessagesState, StateGraph, START, END
from langgraph.prebuilt import ToolNode, tools_condition
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.sqlite import SqliteSaver # For memory
import sqlite3

# --- State Definition (Unchanged) ---
class GraphState(MessagesState):
    """Represents the state of our graph."""
    rewrite_attempts: int = Field(default=0)
    # NEW: Add a field to store the routing decision
    routing_decision: str | None = Field(default=None)

# --- Pydantic Models (Unchanged) ---
class DynamicItem(BaseModel):
    name: str = Field(description="item name")
    image_url: str | None = Field(description="URL of the image if any")
    domain_url: str | None = Field(description="Source domain url")
    description_of_attributes: str = Field(description="A coincise descriptive summary in Natural Language of different flexible attributes relevant to the item such as mileage, location, date, fuel_type, bedrooms, property price, min pax of people etc.")

class StructuredResponse(BaseModel):
    content: str = Field(description="Short Summary of your response in Natural Language.")
    items: List[DynamicItem] = Field(description="List of dynamic items relevant to the response.")

# --- System Prompt (Unchanged) ---
SYSTEM_PROMPT = """
You are a helpful GenAI assistant for the company **motorsfinder.ai**, designed to assist users with questions strictly using the retrieved context provided by tools. You generate human-like, coherent, and relevant responses **only based on tool outputs**, not from your internal knowledge.
**Site Purpose**: Car Marketplace Listing
**motorsfinder.ai Assistant Guidelines:**
1. **Language Policy:**
   - Always respond in the language used by the user.
2. **Tool Usage Rules:**
   - Do **not** rely on internal knowledge or pretraining.
   - If the tool returns no relevant information, respond with:
     **"I do not have relevant information to answer this."**
3. **Response Formatting:**
   - Your final output MUST be a JSON object that adheres to the `StructuredResponse` schema.

Question: {question}
Context: {context}
"""

# --- Retriever and Tool (Unchanged) ---
retriever = AmazonKnowledgeBasesRetriever(
    knowledge_base_id="IKMYTKBPRX",
    region_name="us-west-2"
)

def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs if doc.metadata.get('score', 0.0) > 0.4)

@tool(name_or_callable="rag_knowledge_base", description="...")
def rag_knowledge_base(question: Annotated[str, "..."], k: Annotated[int, "..."] = 3) -> str:
    print(f">>>>>>> in rag_knowledge_base <<<<<<")
    print(f"Question: >>> {question}")
    k = int(k)
    retrieval_config = {"vectorSearchConfiguration": {"numberOfResults": k}}
    relevant_docs = retriever.invoke(question, config={"retrieval_config": retrieval_config})
    context = format_docs(relevant_docs)
    if not context.strip():
        return "Context: No relevant documents found."
    return f"Context : {context}"

# --- Models (Unchanged) ---
response_model = ChatOpenAI(model="gpt-4.1-mini", temperature=0)
grader_model = ChatOpenAI(model="gpt-4.1-mini", temperature=0)

## NEW: Prompt and Node for the Router
ROUTER_PROMPT = ChatPromptTemplate.from_messages(
    [
        ("system",
         "You are an expert at routing a user question to a vectorstore or directly to an answer node. "
         "Based on the conversation history, classify the user's question. "
         "If the question is a follow-up that can be answered using the information already present in the chat history, classify it as 'answer_direct'. "
         "Examples: 'Which of those is the cheapest?', 'What about the red one?', 'Tell me more.'\n"
         "If the question introduces a new topic or asks for new information that requires a search, classify it as 'vectorstore'. "
         "Examples: 'Suggest me some Hyundai cars', 'What about Toyotas?', 'Search for apartments in Dubai.'\n"
         "Do not respond to the user's question. Simply classify it as 'answer_direct' or 'vectorstore'."),
        ("human", "{question_and_history}"),
    ]
)

# In your script, update the router node

def route_question_node(state: GraphState) -> dict: # MODIFIED: Return type is now dict
    """
    Routes the question to either retrieve new documents or answer directly
    from the existing conversation history.
    """
    print("---NODE: route_question---")
    
    # ... (the logic to get the route is the same) ...
    history = "\n".join([msg.content for msg in state["messages"][:-1]])
    question = state["messages"][-1].content
    full_input_text = f"CHAT HISTORY:\n{history}\n\nLATEST QUESTION: {question}"
    router_chain = ROUTER_PROMPT | response_model
    route_content = router_chain.invoke({"question_and_history": full_input_text}).content
    
    if "answer_direct" in route_content.lower():
        print("Decision: Route to answer_direct")
        decision = "answer_direct"
    else:
        print("Decision: Route to vectorstore")
        decision = "vectorstore"
        
    # MODIFIED: Return a dictionary to update the 'routing_decision' field in the state
    return {"routing_decision": decision}

## MODIFIED: Renamed from generate_query_or_respond
def generate_tool_call_node(state: GraphState):
    """Forces a tool call to the vectorstore."""
    print("---NODE: generate_tool_call---")
    model_with_tools = response_model.bind_tools([rag_knowledge_base])
    response = model_with_tools.invoke(state["messages"], tool_choice="required")
    return {"messages": [response]}

# --- GRADING AND REWRITING NODES (Unchanged) ---
GRADE_PROMPT = (
    "You are a grader assessing relevance of a retrieved document to a user question. \n "
    "Here is the retrieved document: \n\n {context} \n\n"
    "Here is the user question: {question} \n"
    "If the document contains keyword(s) or semantic meaning related to the user question, grade it as relevant. \n"
    "Give a binary score 'yes' or 'no' score to indicate whether the document is relevant to the question."
)
class GradeDocuments(BaseModel):
    binary_score: str = Field(description="Relevance score: 'yes' if relevant, or 'no' if not relevant")

def grade_documents(state: GraphState):
    print("---NODE: grade_documents---")
    question = state["messages"][0].content
    context = state["messages"][-1].content
    prompt = GRADE_PROMPT.format(question=question, context=context)
    response = grader_model.with_structured_output(GradeDocuments).invoke([{"role": "user", "content": prompt}])
    score = response.binary_score
    print(f"Grade: {score}")
    return {"messages": [AIMessage(content=f"Grader result: {score}")]}

REWRITE_PROMPT = (
    "You are a query rewriter. Look at the initial question and formulate an improved, more specific question "
    "that is better suited for a vector database search. Do not answer the question, just rewrite it.\n"
    "Here is the initial question:"
    "\n ------- \n"
    "{question}"
    "\n ------- \n"
    "Formulate an improved question:"
)
def rewrite_question(state: GraphState):
    print("---NODE: rewrite_question---")
    current_attempts = state.get("rewrite_attempts", 0)
    original_question = state["messages"][0].content
    prompt = REWRITE_PROMPT.format(question=original_question)
    response = response_model.invoke([{"role": "user", "content": prompt}])
    rewritten_q = response.content
    print(f"Rewritten Question: {rewritten_q}")
    return {"messages": [HumanMessage(content=rewritten_q)], "rewrite_attempts": current_attempts + 1}

## MODIFIED: generate_answer now uses the full history as context
def generate_answer_node(state: GraphState):
    """Generate a structured answer using the available context from the conversation."""
    print("---NODE: generate_answer---")
    
    # The last message is the current question
    question = state["messages"][-1].content
    
    # The context is the ENTIRE conversation history up to the current question
    # This is what allows it to answer follow-up questions correctly.
    context = "\n\n".join([msg.content for msg in state["messages"][:-1]])
    
    prompt = SYSTEM_PROMPT.format(question=question, context=context)
    
    structured_output_model = response_model.with_structured_output(StructuredResponse)
    
    try:
        response_obj = structured_output_model.invoke([{"role": "user", "content": prompt}])
        final_content = f"StructuredResponse(content='{response_obj.content}', items={str(response_obj.items)})"
    except Exception as e:
        print(f"Structured output failed, falling back. Error: {e}")
        final_content = "I do not have relevant information to answer this."

    return {"messages": [AIMessage(content=final_content)]}

# --- Conditional Edge (Unchanged) ---
REWRITE_LIMIT = 1
def decide_to_generate_or_rewrite(state: GraphState) -> Literal["generate_answer", "rewrite_question"]:
    print("---EDGE: decide_to_generate_or_rewrite---")
    grade = state["messages"][-1].content
    attempts = state.get("rewrite_attempts", 0)
    if "yes" in grade.lower():
        return "generate_answer"
    elif attempts >= REWRITE_LIMIT:
        return "generate_answer"
    else:
        return "rewrite_question"

# --- Graph Definition (MODIFIED) ---
workflow = StateGraph(GraphState)

# Add all nodes, including the new router
workflow.add_node("router", route_question_node)
workflow.add_node("generate_tool_call", generate_tool_call_node)
workflow.add_node("retrieve", ToolNode([rag_knowledge_base]))
workflow.add_node("grade_documents", grade_documents)
workflow.add_node("rewrite_question", rewrite_question)
workflow.add_node("generate_answer", generate_answer_node)

# The graph now starts at the router
workflow.add_edge(START, "router")

# MODIFIED: The conditional edge now reads the decision from the state
def select_route(state: GraphState):
    """Helper function to read the routing decision from the state."""
    return state["routing_decision"]

workflow.add_conditional_edges(
    "router",
    select_route, # Use the helper function to read the state
    {
        "vectorstore": "generate_tool_call",
        "answer_direct": "generate_answer",
    },
)

# Define the rest of the vectorstore path
workflow.add_conditional_edges(
    "generate_tool_call",
    tools_condition,
    {"tools": "retrieve", END: END},
)
workflow.add_edge("retrieve", "grade_documents")
workflow.add_conditional_edges(
    "grade_documents",
    decide_to_generate_or_rewrite,
    {
        "generate_answer": "generate_answer",
        "rewrite_question": "rewrite_question",
    },
)
workflow.add_edge("rewrite_question", "generate_tool_call")

# The final answer node always goes to the end
workflow.add_edge("generate_answer", END)

# Compile the graph WITH memory for follow-up questions
conn = sqlite3.connect("memory.sqlite", check_same_thread=False)
memory = SqliteSaver(conn=conn)
graph = workflow.compile(checkpointer=memory)

# --- Graph Execution (MODIFIED for testing follow-ups) ---

# Define a unique ID for the conversation
conversation_id = "test_conversation_123"

# --- First Question ---
print("\n--- Question 1 ---")
config = {"configurable": {"thread_id": conversation_id}}
input1 = {"messages": [HumanMessage(content="Suggest me some Hyundai cars")]}
for chunk in graph.stream(input1, config=config):
    for node, update in chunk.items():
        print(f"---Update from node: {node}---")
        if "messages" in update and update["messages"]:
            update["messages"][-1].pretty_print()
        else:
            print(update)
        print("\n" + "="*30 + "\n")

# --- Follow-up Question ---
print("\n--- Question 2 (Follow-up) ---")
input2 = {"messages": [HumanMessage(content="Which of those is the cheapest?")]}
for chunk in graph.stream(input2, config=config): # Use the same config
    for node, update in chunk.items():
        print(f"---Update from node: {node}---")
        if "messages" in update and update["messages"]:
            update["messages"][-1].pretty_print()
        else:
            print(update)
        print("\n" + "="*30 + "\n")