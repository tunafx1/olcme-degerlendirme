/**
 * Yapılandırma ve Ortam Ayarları
 */

export const APP_CONFIG = {
  appName: "Sınav Analiz ve Raporlama Sistemi",
  version: "2.0.0",
  storageKeys: {
    INSTITUTION: "sinav_analiz_institution",
    STUDENTS: "sinav_analiz_students",
    EXAMS: "sinav_analiz_exams",
    REPORTS: "sinav_analiz_reports",
    AI_CONFIG: "sinav_analiz_ai_config",
    FIREBASE_CONFIG: "sinav_analiz_firebase_config",
    USER: "sinav_analiz_user",
    THEME: "sinav_analiz_theme"
  },
  aiProviders: [
    {
      id: "gemini",
      name: "Google Gemini AI",
      models: [
        { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash (Çok Hızlı & Önerilen)" },
        { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Derin Pedagojik Analiz)" },
        { id: "gemini-2.0-flash-exp", name: "Gemini 2.0 Flash (Yeni Nesil)" }
      ],
      defaultModel: "gemini-1.5-flash",
      badge: "Önerilen",
      keyPlaceholder: "AIzaSy..."
    },
    {
      id: "openai",
      name: "OpenAI",
      models: [
        { id: "gpt-4o-mini", name: "GPT-4o Mini (Hızlı & Ekonomik)" },
        { id: "gpt-4o", name: "GPT-4o (Yüksek Doğruluk)" }
      ],
      defaultModel: "gpt-4o-mini",
      badge: "Popüler",
      keyPlaceholder: "sk-proj-..."
    },
    {
      id: "claude",
      name: "Anthropic Claude",
      models: [
        { id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet (Akıllı Değerlendirme)" },
        { id: "claude-3-5-haiku-20241022", name: "Claude 3.5 Haiku (Hızlı Çözüm)" }
      ],
      defaultModel: "claude-3-5-sonnet-20241022",
      badge: "Gelişmiş",
      keyPlaceholder: "sk-ant-api..."
    }
  ]
};

export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyBOUf2znKqBrzxJ0yCQIAb84ey-3uuwttk",
  authDomain: "olcme-uygulama.firebaseapp.com",
  projectId: "olcme-uygulama",
  storageBucket: "olcme-uygulama.firebasestorage.app",
  messagingSenderId: "974627458616",
  appId: "1:974627458616:web:dde306f8ae29a1f605a0cd",
  measurementId: "G-C4215L1F8D"
};
