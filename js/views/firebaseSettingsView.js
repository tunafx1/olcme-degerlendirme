/**
 * Firebase Bağlantı ve Dağıtım Yapılandırma Görünümü
 */

import { store } from "../state.js";
import { FirebaseService } from "../services/firebaseService.js";
import { showToast } from "../utils/helpers.js";

export function renderFirebaseSettingsView() {
  const state = store.getState();
  const fb = state.firebaseConfig || {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
  };

  const isConnected = state.isFirebaseConnected;

  return `
    <div class="view-container animate-fade-in">
      <!-- ÜST BAŞLIK -->
      <div class="view-header">
        <div>
          <h1 class="view-title">Firebase & Veritabanı Yapılandırması</h1>
          <p class="view-subtitle">Uygulamanın Firestore veritabanı, Firebase Authentication ve Firebase Storage bulut entegrasyonu ayarları.</p>
        </div>
        <div class="view-actions">
          <span class="badge ${isConnected ? "badge-success" : "badge-secondary"}">
            ${isConnected ? "● Firebase Canlı Bağlantı Aktif" : "○ Yerel / LocalStorage Modu"}
          </span>
        </div>
      </div>

      <!-- BİLGİLENDİRME KARTI -->
      <div class="alert alert-info mb-4">
        <div class="alert-icon">🔥</div>
        <div class="alert-text">
          <strong>Hibrit Mimari:</strong> Firebase yapılandırması girilmediğinde uygulama tarayıcınızın yerel depolama alanında (LocalStorage) kesintisiz ve sıfır kurulumla çalışır. Firebase bilgilerinizi girdiğinizde verileriniz otomatik olarak bulut Firestore ve Storage'a yedeklenebilir.
        </div>
      </div>

      <!-- FIREBASE FORM KARTI -->
      <div class="card mb-4">
        <div class="card-header">
          <div class="card-title-group">
            <h2 class="card-title">Firebase Config Parametreleri</h2>
            <span class="card-subtitle">Firebase Console &gt; Project Settings &gt; General &gt; Your Apps bölümünden temin edebilirsiniz</span>
          </div>
        </div>
        <div class="card-body">
          <form id="firebase-config-form" onsubmit="window.app.saveFirebaseConfig(event)">
            <div class="grid-2-col">
              <div class="form-group">
                <label class="form-label">API Key (apiKey): *</label>
                <input type="text" id="fb-apiKey" class="form-control" value="${fb.apiKey || ""}" placeholder="AIzaSy..." required />
              </div>
              <div class="form-group">
                <label class="form-label">Project ID (projectId): *</label>
                <input type="text" id="fb-projectId" class="form-control" value="${fb.projectId || ""}" placeholder="sinav-analiz-projesi" required />
              </div>
            </div>

            <div class="grid-2-col">
              <div class="form-group">
                <label class="form-label">Auth Domain (authDomain):</label>
                <input type="text" id="fb-authDomain" class="form-control" value="${fb.authDomain || ""}" placeholder="proje-id.firebaseapp.com" />
              </div>
              <div class="form-group">
                <label class="form-label">Storage Bucket (storageBucket):</label>
                <input type="text" id="fb-storageBucket" class="form-control" value="${fb.storageBucket || ""}" placeholder="proje-id.appspot.com" />
              </div>
            </div>

            <div class="grid-2-col">
              <div class="form-group">
                <label class="form-label">Messaging Sender ID (messagingSenderId):</label>
                <input type="text" id="fb-messagingSenderId" class="form-control" value="${fb.messagingSenderId || ""}" placeholder="1234567890" />
              </div>
              <div class="form-group">
                <label class="form-label">App ID (appId):</label>
                <input type="text" id="fb-appId" class="form-control" value="${fb.appId || ""}" placeholder="1:1234567890:web:abcdef..." />
              </div>
            </div>

            <div class="form-actions mt-4 d-flex justify-between items-center">
              <button type="button" class="btn btn-outline" onclick="window.app.testFirebaseConnection()">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span>Bağlantıyı Test Et</span>
              </button>
              <div class="btn-group">
                <button type="button" class="btn btn-ghost text-danger" onclick="window.app.clearFirebaseConfig()">Bilgileri Temizle (Yerel Moda Dön)</button>
                <button type="submit" class="btn btn-primary btn-lg shadow-glow">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  <span>Firebase Ayarlarını Kaydet</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <!-- .ENV VE GÜVENLİK YÖNERGESİ -->
      <div class="card">
        <div class="card-header">
          <div class="card-title-group">
            <h2 class="card-title">Ortam Değişkenleri (.env) ve Güvenlik Kuralları</h2>
            <span class="card-subtitle">Projeyi Vercel / Firebase Hosting üzerinde yayınlarken kullanılacak ayarlar</span>
          </div>
        </div>
        <div class="card-body">
          <p>Projeyi sunucuda canlıya alırken ortam değişkenlerini <code>.env</code> dosyasına yazabilirsiniz. Kod içine sabit yazılmaz:</p>
          <pre class="code-snippet"><code>VITE_FIREBASE_API_KEY="${fb.apiKey || "AIzaSy..."}"
VITE_FIREBASE_PROJECT_ID="${fb.projectId || "proje-id"}"
VITE_FIREBASE_AUTH_DOMAIN="${fb.authDomain || "proje-id.firebaseapp.com"}"
VITE_FIREBASE_STORAGE_BUCKET="${fb.storageBucket || "proje-id.appspot.com"}"
VITE_FIREBASE_MESSAGING_SENDER_ID="${fb.messagingSenderId || "123456"}"
VITE_FIREBASE_APP_ID="${fb.appId || "1:123456:web:..."}"
VITE_GEMINI_API_KEY="${state.aiConfig.geminiApiKey || "AIzaSy..."}"</code></pre>
        </div>
      </div>
    </div>
  `;
}
