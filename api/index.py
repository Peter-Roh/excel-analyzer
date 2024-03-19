from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from langchain.chat_models import ChatOllama
from langchain.document_loaders import CSVLoader
from langchain.embeddings import OllamaEmbeddings, CacheBackedEmbeddings
from langchain.vectorstores.faiss import FAISS
from langchain.storage import LocalFileStore
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough

from pydantic import BaseModel

app = FastAPI(
    title="Excel Analyzer",
    description="Analyze excel file with the power of ai."
)

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

llm = ChatOllama(
    model="mistral:latest",
    temperature=0.1,
)

embeddings = OllamaEmbeddings(
    model="mistral:latest"
)

cache_dir = LocalFileStore("./.cache/")
cached_embeddings = CacheBackedEmbeddings.from_bytes_store(embeddings, cache_dir)

# TODO LOAD FILE



loader = CSVLoader("./api/file/data.csv")

class AnalyzeInput(BaseModel):
    q: str

class Data(BaseModel):
    data: str

@app.post("/api/py/analyze",
    response_model=Data
)
async def analyze(q: AnalyzeInput):
    docs = loader.load_and_split()
    vectorStore = FAISS.from_documents(docs, cached_embeddings)
    retriever = vectorStore.as_retriever()

    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are a data analyst. Answer questions using only the given context. Answer in Korean. Don't give me english answer. Don't try to translate the name of the column used in the data. Explain briefly about what the data is about first. And then explain about the data overall. If you don't know the answer, just say you don't know. Do NOT make it up. And also, do not talk about anything else:\n{context}"),
        ("human", "{question}")
    ])

    chain = {
        "context": retriever,
        "question": RunnablePassthrough()
        } | prompt | llm

    response = chain.invoke(q.q)

    return Data(data=response.content)
