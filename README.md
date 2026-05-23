# BayanAI - Enterprise AI Knowledge Assistant

**Bilingual Arabic/English RAG Platform for Enterprise Knowledge Retrieval**

## 🎯 Overview

BayanAI is an enterprise-grade bilingual AI assistant designed for Gulf businesses. It ingests Arabic and English documents, performs hybrid semantic retrieval, and answers questions with citations in both languages.

## 🏗️ Architecture

### Backend
- **FastAPI** - Async Python web framework
- **PostgreSQL + pgvector** - Vector database for semantic search
- **LangChain** - RAG pipeline orchestration
- **OpenAI + multilingual-e5** - Embeddings

### Frontend
- **React + TypeScript** - Modern UI framework
- **Tailwind CSS** - Styling with RTL Arabic support
- **Vite** - Fast build tool

### Infrastructure
- **Docker** - Containerization
- **Azure Blob Storage** - Document storage
- **Railway/Render** - Deployment

## ✨ Key Features

1. **Bilingual Document Upload** - PDF, DOCX, TXT (Arabic + English)
2. **Hybrid Retrieval** - BM25 keyword search + Vector similarity + Reranking
3. **Semantic Search** - Ask in English about Arabic docs, vice versa
4. **Citations** - Source file, chunk reference, highlighted snippets
5. **RTL Arabic UI** - Full bidirectional support
6. **Role-Based Access** - Admin upload, user query

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/meahnaf/Aql.git
cd project

# Start with Docker
docker-compose up -d

# Access application
Frontend: http://localhost:5173
Backend: http://localhost:8000
API Docs: http://localhost:8000/docs
```

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI, Python 3.11+ |
| Database | PostgreSQL 15 + pgvector |
| AI/ML | LangChain, OpenAI, multilingual-e5 |
| Frontend | React 18, TypeScript, Tailwind |
| Storage | Azure Blob Storage |
| Deployment | Docker, Railway/Render |

## 🎨 Project Structure

```
windsurf-project/
├── backend/              # FastAPI application
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── core/        # Config, security
│   │   ├── models/      # Database models
│   │   ├── services/    # Business logic
│   │   └── main.py      # App entry
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/            # React application
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/       # Page views
│   │   ├── services/    # API clients
│   │   └── App.tsx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 🔧 Environment Variables

```env
# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/bayanai
OPENAI_API_KEY=sk-...
AZURE_STORAGE_CONNECTION_STRING=...
JWT_SECRET=your-secret-key

# Frontend
VITE_API_URL=http://localhost:8000
```

## 📝 Resume Description

**Built a bilingual Arabic/English enterprise AI assistant using FastAPI, React, PostgreSQL, and RAG pipelines with hybrid semantic retrieval.**

**Implemented multilingual document ingestion, vector search, BM25 retrieval, citation-based responses, and RTL Arabic UI support for enterprise knowledge querying.**

**Designed scalable AI microservices using Docker and Azure storage integrations for enterprise-grade deployment.**

## 🎯 Use Cases

- **HR Policies** - Query Arabic HR documents in English
- **Legal Contracts** - Search bilingual legal documents
- **Technical Manuals** - Multilingual technical documentation
- **Company Knowledge Base** - Enterprise-wide knowledge retrieval

## 📄 License

MIT License

## 👨‍💻 Author

Built for Saudi/GCC enterprise market
