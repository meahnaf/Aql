import React, { createContext, useContext, useState, useEffect } from 'react'

type Language = 'en' | 'ar'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    appName: 'BayanAI',
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    dashboard: 'Dashboard',
    chat: 'Chat',
    documents: 'Documents',
    search: 'Search',
    upload: 'Upload Document',
    logout: 'Logout',
    askQuestion: 'Ask a question...',
    send: 'Send',
    uploadFile: 'Upload File',
    dragDrop: 'Drag and drop files here',
    selectLanguage: 'Select Language',
    arabic: 'Arabic',
    english: 'English',
    citations: 'Citations',
    noResults: 'No results found',
    loading: 'Loading...',
  },
  ar: {
    appName: 'بيان AI',
    login: 'تسجيل الدخول',
    register: 'التسجيل',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    fullName: 'الاسم الكامل',
    dashboard: 'لوحة التحكم',
    chat: 'المحادثة',
    documents: 'المستندات',
    search: 'بحث',
    upload: 'رفع مستند',
    logout: 'تسجيل الخروج',
    askQuestion: 'اطرح سؤالاً...',
    send: 'إرسال',
    uploadFile: 'رفع ملف',
    dragDrop: 'اسحب وأفلت الملفات هنا',
    selectLanguage: 'اختر اللغة',
    arabic: 'العربية',
    english: 'الإنجليزية',
    citations: 'المراجع',
    noResults: 'لا توجد نتائج',
    loading: 'جاري التحميل...',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang) {
      setLanguage(savedLang)
    }
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', language)
  }, [language])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr')
    document.documentElement.setAttribute('lang', lang)
  }

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}
