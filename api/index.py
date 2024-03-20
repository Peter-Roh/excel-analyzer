from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from langchain.chat_models import ChatOllama
from langchain.document_loaders import CSVLoader
from langchain.embeddings import OllamaEmbeddings, CacheBackedEmbeddings
from langchain.vectorstores.faiss import FAISS
from langchain.storage import LocalFileStore
from langchain.prompts import ChatPromptTemplate
from langchain.schema.runnable import RunnablePassthrough

from pydantic import BaseModel

import shutil
from datetime import datetime

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

class UploadResult(BaseModel):
    path: str

@app.post("/api/py/upload", response_model=UploadResult)
async def upload(file: UploadFile = File(...)):
    current_time_string = datetime.now().strftime("%Y%m%d%H%M%S%f")
    path = f"./api/file/data_{current_time_string}.csv"
    with open(path, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)
    return UploadResult(path=path)

class AnalyzeInput(BaseModel):
    path: str
    question: str

class Data(BaseModel):
    data: str

@app.post("/api/py/analyze",
    response_model=Data
)
async def analyze(input: AnalyzeInput):
    loader = CSVLoader(input.path)
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

    response = chain.invoke(input.question)

    return Data(data=response.content)
