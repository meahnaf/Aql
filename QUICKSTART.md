# 🚀 Quick Start Guide - BayanAI

## **How It Works Right Now**

### **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│  React + TypeScript + Tailwind + RTL Arabic Support         │
│  - Login/Register                                            │
│  - Dashboard (stats)                                         │
│  - Chat (RAG with citations)                                │
│  - Documents (upload/manage)                                │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│  FastAPI + Python                                            │
│  - JWT Authentication                                        │
│  - Document Upload (PDF/DOCX/TXT)                           │
│  - Text Processing & Chunking                               │
│  - OpenAI Embeddings (text-embedding-3-small)               │
│  - Hybrid Search (BM25 + Vector)                            │
│  - RAG Chat (GPT-4 + Citations)                             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                        DATABASE                              │
│  PostgreSQL 15 + pgvector                                    │
│  - users (auth)                                              │
│  - documents (metadata)                                      │
│  - document_chunks (text + embeddings)                       │
└─────────────────────────────────────────────────────────────┘
```

### **Data Flow**

**1. Document Upload:**
```
User uploads PDF → Extract text → Chunk (1000 chars, 200 overlap) 
→ Generate embeddings → Store in PostgreSQL with pgvector
```

**2. Search Query:**
```
User question → Generate query embedding
→ Vector search (cosine similarity, 60% weight)
→ BM25 search (keyword matching, 40% weight)
→ Combine & rerank → Return top results
```

**3. Chat/RAG:**
```
User question → Hybrid search for context
→ Top 5 chunks → Build prompt with context
→ GPT-4 generates answer → Return with citations
```

---

## **Setup Instructions**

### **Prerequisites**
- Docker Desktop installed
- OpenAI API key
- 8GB RAM minimum

### **Step 1: Clone & Setup**

```bash
cd c:\Users\AHNAF\OneDrive\Desktop\Saudi_Job_Hunt\SAUDI_PROJ\CascadeProjects\windsurf-project

# Copy environment file
copy .env.example .env
```

### **Step 2: Configure Environment**

Edit `.env` file:
```env
DATABASE_URL=postgresql://bayanai:bayanai123@postgres:5432/bayanai
OPENAI_API_KEY=sk-your-actual-openai-key-here
JWT_SECRET=change-this-to-random-string
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### **Step 3: Start with Docker**

```bash
# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f backend
```

### **Step 4: Access Application**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

### **Step 5: Create Admin User**

1. Go to http://localhost:5173
2. Click "Register"
3. Create account (first user is admin by default)
4. Login

---

## **Alternative: Local Development**

### **Backend Setup**

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
set DATABASE_URL=postgresql://bayanai:bayanai123@localhost:5432/bayanai
set OPENAI_API_KEY=sk-your-key

# Run migrations (if needed)
# alembic upgrade head

# Start server
uvicorn app.main:app --reload --port 8000
```

### **Frontend Setup**

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

### **Database Setup (Local)**

```bash
# Install PostgreSQL 15 with pgvector extension
# Or use Docker:
docker run -d \
  --name bayanai-postgres \
  -e POSTGRES_USER=bayanai \
  -e POSTGRES_PASSWORD=bayanai123 \
  -e POSTGRES_DB=bayanai \
  -p 5432:5432 \
  pgvector/pgvector:pg15
```

---

## **Testing the System**

### **1. Upload a Document**

```bash
# Using curl
curl -X POST http://localhost:8000/api/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@sample.pdf" \
  -F "language=en"
```

### **2. Search Documents**

```bash
curl -X POST http://localhost:8000/api/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "what is the policy?", "limit": 5}'
```

### **3. Chat with RAG**

```bash
curl -X POST http://localhost:8000/api/chat \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What are the main points?",
    "language": "en"
  }'
```

---

## **Features Implemented**

✅ **Authentication**
- JWT-based auth
- Login/Register
- Role-based access (Admin/User)

✅ **Document Management**
- Upload PDF, DOCX, TXT
- Automatic language detection
- Chunking with overlap
- Vector embeddings

✅ **Hybrid Search**
- BM25 keyword search
- Vector similarity search
- Combined reranking

✅ **RAG Chat**
- Context-aware responses
- Citation tracking
- Bilingual support (Arabic/English)

✅ **UI/UX**
- RTL Arabic support
- Language switching
- Responsive design
- Modern Tailwind UI

---

## **Current Limitations**

⚠️ **Not Yet Implemented:**
- Azure Blob Storage (using local storage)
- User management dashboard
- Document versioning
- Advanced analytics
- Multi-user collaboration

---

## **Troubleshooting**

### **Port Already in Use**
```bash
# Stop existing containers
docker-compose down

# Or change ports in docker-compose.yml
```

### **Database Connection Error**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Restart database
docker-compose restart postgres
```

### **OpenAI API Error**
- Verify API key in `.env`
- Check API quota/billing
- Ensure key has access to embeddings & GPT-4

### **Frontend Build Errors**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## **Next Steps**

1. **Test with sample documents** (Arabic + English)
2. **Deploy to Railway/Render** (Day 7)
3. **Add metrics dashboard** (Day 8)
4. **Create demo video** (Day 9)

---

## **Tech Stack Summary**

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | React 18 + TypeScript | UI framework |
| Styling | Tailwind CSS | Modern styling + RTL |
| Backend | FastAPI | Async Python API |
| Database | PostgreSQL 15 | Relational data |
| Vector DB | pgvector | Semantic search |
| Embeddings | OpenAI text-embedding-3-small | 1536-dim vectors |
| LLM | GPT-4 Turbo | RAG responses |
| Search | BM25 + Vector | Hybrid retrieval |
| Auth | JWT | Secure authentication |
| Deployment | Docker | Containerization |

---

**Built for Saudi/GCC Enterprise Market** 🇸🇦
