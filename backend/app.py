from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import OllamaEmbeddings
from langchain.chains.retrieval_qa.base import RetrievalQA
from langchain.llms import Ollama

# === CONFIG ===
UPLOAD_FOLDER = "uploaded_pdfs"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ollama_ready = True  # assuming Ollama is installed & model pulled
embeddings = OllamaEmbeddings(model="nomic-embed-text")
retriever = None

app = FastAPI()

# === CORS (allow frontend access) ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Set frontend URL later for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# 📌 ROUTE 1: Upload PDF
# =========================================================
@app.post("/upload_pdf")
async def upload_pdf(file: UploadFile = File(...)):
    global retriever

    if not ollama_ready:
        return {"error": "Ollama is not ready. Start Ollama first."}

    # Remove old PDFs
    for old_file in os.listdir(UPLOAD_FOLDER):
        try:
            os.remove(os.path.join(UPLOAD_FOLDER, old_file))
        except:
            pass

    # Save uploaded PDF
    new_file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(new_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Load & split PDF text
    loader = PyPDFLoader(new_file_path)
    documents = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200
    )
    docs = text_splitter.split_documents(documents)

    # Generate vector embeddings & retriever
    vectorstore = FAISS.from_documents(docs, embeddings)
    retriever = vectorstore.as_retriever()

    return {"message": f"PDF '{file.filename}' uploaded & processed successfully!"}


# =========================================================
# 📌 ROUTE 2: Ask Question
# =========================================================
@app.post("/ask_question")
async def ask_question(data: dict):
    global retriever

    if retriever is None:
        return {"error": "Upload a PDF first."}

    question = data.get("question", "")
    if question == "":
        return {"error": "Question cannot be empty."}

    # Use LLM for Q&A
    llm = Ollama(model="tinyllama")  # change model if required

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever
    )

    try:
        output = qa_chain.invoke({"query": question})
        return {"answer": output["result"]}
    except Exception as e:
        print("Error:", e)
        return {"error": "Failed to answer question."}


# ====================================================
