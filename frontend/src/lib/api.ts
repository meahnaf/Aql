import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  full_name: string
}

export interface ChatRequest {
  message: string
  language: string
  conversation_history?: Array<{ role: string; content: string }>
}

export interface Citation {
  document_id: string
  document_name: string
  chunk_index: number
  content: string
  score: number
}

export interface ChatResponse {
  answer: string
  citations: Citation[]
  language: string
}

export interface SearchRequest {
  query: string
  language?: string
  limit?: number
}

export interface Document {
  id: string
  filename: string
  original_filename: string
  file_type: string
  file_size: number
  language: string
  created_at: string
  chunk_count?: number
}

export const authAPI = {
  login: (data: LoginData) => api.post('/api/auth/login', data),
  register: (data: RegisterData) => api.post('/api/auth/register', data),
  me: () => api.get('/api/auth/me'),
}

export const documentsAPI = {
  upload: (file: File, language: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('language', language)
    return api.post('/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  list: (skip = 0, limit = 50) => api.get(`/api/documents?skip=${skip}&limit=${limit}`),
  delete: (id: string) => api.delete(`/api/documents/${id}`),
}

export const chatAPI = {
  send: (data: ChatRequest) => api.post<ChatResponse>('/api/chat', data),
}

export const searchAPI = {
  search: (data: SearchRequest) => api.post('/api/search', data),
}

export default api
