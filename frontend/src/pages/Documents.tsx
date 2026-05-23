import { useState, useEffect } from 'react'
import { Upload, FileText, Trash2, Download } from 'lucide-react'
import Layout from '../components/Layout'
import { documentsAPI, Document } from '../lib/api'
import { useLanguage } from '../contexts/LanguageContext'

export default function Documents() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const { language, t } = useLanguage()

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const response = await documentsAPI.list()
      setDocuments(response.data.documents || [])
    } catch (error) {
      console.error('Failed to fetch documents', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      await documentsAPI.upload(file, language)
      await fetchDocuments()
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      await documentsAPI.delete(id)
      await fetchDocuments()
    } catch (error) {
      alert('Failed to delete document')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('documents')}</h1>
            <p className="mt-2 text-gray-600">
              {language === 'ar' 
                ? 'إدارة قاعدة المعرفة الخاصة بك' 
                : 'Manage your knowledge base'}
            </p>
          </div>
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
              disabled={uploading}
            />
            <div className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 flex items-center space-x-2 rtl:space-x-reverse">
              <Upload className="w-5 h-5" />
              <span>{uploading ? t('loading') : t('upload')}</span>
            </div>
          </label>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('loading')}</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">{t('noResults')}</p>
            <p className="text-sm text-gray-500 mt-2">
              {language === 'ar' 
                ? 'ابدأ برفع مستنداتك' 
                : 'Start by uploading your documents'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'ar' ? 'اسم الملف' : 'Filename'}
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'ar' ? 'النوع' : 'Type'}
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'ar' ? 'الحجم' : 'Size'}
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'ar' ? 'اللغة' : 'Language'}
                  </th>
                  <th className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {language === 'ar' ? 'الإجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FileText className="w-5 h-5 text-gray-400 ltr:mr-3 rtl:ml-3" />
                        <span className="text-sm font-medium text-gray-900">{doc.original_filename}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.file_type.toUpperCase()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(doc.file_size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        doc.language === 'ar' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {doc.language === 'ar' ? 'العربية' : 'English'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
