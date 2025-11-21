# 📄 PDF Q&A System  
A lightweight, local, privacy-friendly **PDF Question–Answering System** powered by **LM Studio**, **LangChain**, **FAISS**, and **Local LLMs**.

This project allows you to **upload any PDF**, ask natural-language questions, and receive accurate answers derived directly from the document.  
The system runs completely **offline**, making it ideal for research, study notes, and secure document processing.

---
## 🚀 Features

- **Upload any PDF** and instantly index its content  
- **Ask questions** and get concise, context-aware answers  
- Uses **Semantic Chunking** for smarter splitting of document text  
- **FAISS Vector Store** for fast similarity-based retrieval  
- **Local LLM inference** using LM Studio (no API keys, no cloud calls)  
- Simple and clean **web-based UI**  
- Privacy-first — *your PDF never leaves your computer*  

---

## 🧠 How It Works

1. **PDF Upload**  
   - The system loads your PDF using `PDFPlumberLoader`.

2. **Semantic Chunking**  
   - The PDF is split into meaning-preserving chunks using `SemanticChunker`.

3. **Embedding + Vector Store**  
   - Each chunk is embedded with Sentence-Transformers  
   - FAISS creates an efficient similarity index

4. **Local Language Model (LLM)**  
   - LM Studio runs a local LLM such as `tinyllama-1.1b-chat-v1.0`  
   - The app queries the LM Studio server at `http://localhost:1234/v1`

5. **Retrieval-Augmented Generation (RAG)**  
   - Relevant chunks are retrieved  
   - The LLM generates a clean, concise answer based on the provided context

---

## 🛠️ Tech Stack

### **Backend / LLM Stack**
- 🧩 **LangChain**
- 🔍 **FAISS Vector Store**
- 📑 **PDFPlumber**
- 🧠 **HuggingFace Embeddings**
- 💡 **LM Studio Local LLM Server**
- 🐍 **Python**

### **Frontend**
- 🌐 Simple HTML/CSS/JS interface  
- Runs at ` localhost:5173 `

---

## 📦 Installation & Setup

### **1️⃣ Install Python Dependencies**
```bash
pip install -U langchain langchain-core langchain-community langchain-experimental langchain-openai pdfplumber faiss-cpu sentence-transformers
