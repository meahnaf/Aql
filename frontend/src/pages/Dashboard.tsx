import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, FileText, Search, TrendingUp } from 'lucide-react'
import Layout from '../components/Layout'
import { documentsAPI } from '../lib/api'
import { useLanguage } from '../contexts/LanguageContext'

export default function Dashboard() {
  const [stats, setStats] = useState({ documents: 0, queries: 0 })
  const { t } = useLanguage()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await documentsAPI.list(0, 1)
        setStats({ documents: response.data.total || 0, queries: 0 })
      } catch (error) {
        console.error('Failed to fetch stats', error)
      }
    }
    fetchStats()
  }, [])

  const cards = [
    {
      title: t('chat'),
      description: 'Ask questions about your documents',
      icon: MessageSquare,
      link: '/chat',
      color: 'bg-blue-500',
    },
    {
      title: t('documents'),
      description: 'Manage your knowledge base',
      icon: FileText,
      link: '/documents',
      color: 'bg-green-500',
    },
    {
      title: t('search'),
      description: 'Search across all documents',
      icon: Search,
      link: '/chat',
      color: 'bg-purple-500',
    },
  ]

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
          <p className="mt-2 text-gray-600">
            Welcome to your enterprise knowledge assistant
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-3xl font-bold text-gray-900">{stats.documents}</p>
              </div>
              <FileText className="w-12 h-12 text-primary-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Queries Today</p>
                <p className="text-3xl font-bold text-gray-900">{stats.queries}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Languages</p>
                <p className="text-3xl font-bold text-gray-900">2</p>
              </div>
              <Search className="w-12 h-12 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link
              key={card.title}
              to={card.link}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
            >
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}
