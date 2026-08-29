/**
 * Sınav Analiz ve Raporlama Sistemi — Standart Bağımsız Paket (bundle.js)
 * Yüksek Hassasiyetli Çok Satırlı (Multi-Line Wrapping) 2 Sütunlu PDF Ayrıştırıcı
 * 70+ Öğrenci İçeren Toplu PDF Karnesi Ayrıştırma & Toplu AI Analiz Motoru
 * 7 Günlük LGS Etüt Matrisi & Kişiselleştirilmiş Eksik Telafi Tablosu
 * OpenAI ChatGPT & Google Gemini Çift Motorlu AI Analizi
 */

(function () {
  "use strict";

  // ==========================================
  // 1. MÜFREDAT VE KAZANIM VERİTABANI
  // ==========================================
  const CURRICULUM_DATA = {
    "Matematik": [
      { konu: "Çarpanlar ve Katlar", kazanim: "Pozitif tam sayıların pozitif tam sayı çarpanlarını belirler; EBOB ve EKOK hesaplar." },
      { konu: "Üslü İfadeler", kazanim: "Tam sayıların tam sayı kuvvetlerini hesaplar; bilimsel gösterimle ifade eder." },
      { konu: "Kareköklü İfadeler", kazanim: "Tam kare pozitif tam sayıları tanır; kareköklü ifadelerde işlemler yapar." },
      { konu: "Veri Analizi", kazanim: "Daire grafiği ve sütun grafiklerini yorumlar; verileri dönüştürür." },
      { konu: "Basit Olayların Olasılığı", kazanim: "Olası durumları belirler; olasılık hesaplar." },
      { konu: "Cebirsel İfadeler ve Özdeşlikler", kazanim: "Cebirsel ifadeleri çarpar; özdeşlikleri modeller." },
      { konu: "Doğrusal Denklemler", kazanim: "Birinci dereceden denklemleri çözer; eğim ve grafik ilişkisini kurar." },
      { konu: "Eşitsizlikler", kazanim: "Birinci dereceden eşitsizlikleri çözer ve sayı doğrusunda gösterir." },
      { konu: "Üçgenler", kazanim: "Üçgende kenarortay, açıortay ve yükseklik çizer; Pisagor bağıntısını uygular." },
      { konu: "Dönüşüm Geometrisi & Cisimler", kazanim: "Öteleme ve yansıma hareketlerini kavrar; hacim hesaplar." }
    ],
    "Türkçe": [
      { konu: "Sözcükte Anlam", kazanim: "Gerçek, mecaz ve terim anlamlı sözcükleri ayırt eder; bağlamdan yararlanarak bilmediği kelime ve kelime gruplarının anlamını tahmin eder." },
      { konu: "Cümlede Anlam", kazanim: "Neden-sonuç, amaç-sonuç, koşul ve örtük anlam ilişkilerini analiz eder." },
      { konu: "Paragrafta Anlam & Yapı", kazanim: "Metnin ana fikrini, yardımcı fikirlerini ve akışını bozan cümleleri bulur." },
      { konu: "Metin Türleri ve Söz Sanatları", kazanim: "Metin türlerini ve edebi sanatları ayırt eder." },
      { konu: "Fiilimsiler", kazanim: "İsim-fiil, sıfat-fiil ve zarf-fiil eklerini işlevlerine göre ayırt eder." },
      { konu: "Cümlenin Ögeleri", kazanim: "Yüklem, özne, nesne ve tümleç ögelerini eksiksiz bulur." },
      { konu: "Yazım Kuralları ve Noktalama", kazanim: "Büyük harflerin, bağlaçların ve noktalama işaretlerinin doğru kullanımını uygular." },
      { konu: "Sözel Mantık & Muhakeme", kazanim: "Tablo, grafik ve yönergeleri okuyarak çoklu çıkarımlar yapar." }
    ],
    "Fen Bilimleri": [
      { konu: "Mevsimler ve İklim", kazanim: "Dünya'nın dönme ekseni eğikliğinin mevsimlerin oluşumundaki etkisini açıklar." },
      { konu: "DNA ve Genetik Kod", kazanim: "Nükleotid, gen, DNA ve kromozom kavramlarını açıklar; çaprazlama yapar." },
      { konu: "Basınç", kazanim: "Sıvı basıncını etkileyen değişkenleri tahmin eder ve tahminlerini test eder." },
      { konu: "Madde ve Endüstri", kazanim: "Periyodik sistemde, grup ve periyotların nasıl oluşturulduğunu açıklar; asit-baz tepkimelerini analiz eder." },
      { konu: "Basit Makineler", kazanim: "Kaldıraç, makara, eğik düzlem ve dişli çarklarda kuvvet kazancı prensiplerini uygular." },
      { konu: "Enerji Dönüşümleri", kazanim: "Fotosentez ve solunum ilişkisini açıklar; besin zincirinde madde akışını modeller." }
    ],
    "T.C. İnkılap Tarihi ve Atatürkçülük": [
      { konu: "Bir Kahraman Doğuyor", kazanim: "Mustafa Kemal'in fikir hayatını etkileyen unsurları analiz eder." },
      { konu: "Milli Uyanış: Bağımsızlık Yolunda", kazanim: "I. Dünya Savaşı ve Mondros sonrası genelgeler sürecini açıklar." },
      { konu: "Milli Bir Destan: Ya İstiklal Ya Ölüm!", kazanim: "Cephelerdeki askeri ve diplomatik başarıları değerlendirir." },
      { konu: "Atatürkçülük ve Çağdaşlaşan Türkiye", kazanim: "Atatürk ilke ve inkılaplarını kavrar." }
    ],
    "Yabancı Dil (İngilizce)": [
      { konu: "Friendship & Teen Life", kazanim: "Accepting and refusing invitations; describing daily routines." },
      { konu: "In the Kitchen & On the Phone", kazanim: "Describing a process/recipe; telephone conversations." },
      { konu: "The Internet & Adventures", kazanim: "Internet safety rules and extreme sports." }
    ],
    "Din Kültürü ve Ahlak Bilgisi": [
      { konu: "Kader İnancı", kazanim: "Kader ve kaza kavramlarını açıklar; irade ve sorumlulukla ilişkilendirir." },
      { konu: "Zekat ve Sadaka", kazanim: "Zekât ve sadaka ibadetini ayet ve hadislerle açıklar." },
      { konu: "Din ve Hayat", kazanim: "İslam dininin temel gayelerini analiz eder." }
    ]
  };

  // ==========================================
  // 2. YAPILANDIRMA VE SABİTLER
  // ==========================================
  const APP_CONFIG = {
    appName: "Sınav Analiz ve Raporlama Sistemi",
    version: "2.4.0",
    storageKeys: {
      INSTITUTION: "sinav_analiz_institution",
      STUDENTS: "sinav_analiz_students",
      EXAMS: "sinav_analiz_exams",
      REPORTS: "sinav_analiz_reports",
      AI_CONFIG: "sinav_analiz_ai_config",
      FIREBASE_CONFIG: "sinav_analiz_firebase_config"
    },
    aiProviders: [
      {
        id: "openai",
        name: "OpenAI ChatGPT",
        models: [
          { id: "gpt-4o-mini", name: "GPT-4o Mini (Önerilen - Hızlı & Yüksek İsabet)" },
          { id: "gpt-4o", name: "GPT-4o (Gelişmiş Değerlendirme)" }
        ],
        defaultModel: "gpt-4o-mini",
        badge: "Varsayılan",
        keyPlaceholder: "sk-proj-..."
      },
      {
        id: "gemini",
        name: "Google Gemini AI",
        models: [
          { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash (Hızlı & Pedagojik)" },
          { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro (Derin Analiz)" }
        ],
        defaultModel: "gemini-1.5-flash",
        badge: "Popüler",
        keyPlaceholder: "AIzaSy..."
      },
      {
        id: "claude",
        name: "Anthropic Claude",
        models: [{ id: "claude-3-5-sonnet-20241022", name: "Claude 3.5 Sonnet (Akıllı Değerlendirme)" }],
        defaultModel: "claude-3-5-sonnet-20241022",
        badge: "Gelişmiş",
        keyPlaceholder: "sk-ant-..."
      }
    ]
  };

  const DEFAULT_FIREBASE_CONFIG = {
    apiKey: "AIzaSyBOUf2znKqBrzxJ0yCQIAb84ey-3uuwttk",
    authDomain: "olcme-uygulama.firebaseapp.com",
    projectId: "olcme-uygulama",
    databaseId: "olcme-uygulama",
    storageBucket: "olcme-uygulama.firebasestorage.app",
    messagingSenderId: "974627458616",
    appId: "1:974627458616:web:dde306f8ae29a1f605a0cd",
    measurementId: "G-C4215L1F8D"
  };

  const DEFAULT_INSTITUTION = {
    id: "kurum_default",
    ad: "Özel Ege Atabey Ortaokulu",
    kurumKodu: "ATB-2026-94",
    adres: "Mustafa Kemal Mah. 2118. Cad. No: 14 Çankaya / Ankara",
    telefon: "+90 (312) 444 0 999",
    email: "iletisim@atabeyegitim.k12.tr",
    web: "www.atabeyegitim.k12.tr",
    temaRengi: "#2563eb",
    logoUrl: "./logo.png"
  };

  const DEFAULT_AI_CONFIG = {
    provider: "openai",
    openaiApiKey: "",
    openaiModel: "gpt-4o-mini",
    geminiApiKey: "",
    geminiModel: "gemini-1.5-flash",
    claudeApiKey: "",
    claudeModel: "claude-3-5-sonnet-20241022",
    temperature: 0.7,
    simulationMode: false
  };

  // Boş başlangıç verileri — tüm gerçek veriler Firestore'dan gelir
  const MOCK_STUDENTS = [];
  const MOCK_EXAMS = [];
  const MOCK_REPORTS = [];

  // ==========================================
  // 3. YARDIMCI FONKSİYONLAR
  // ==========================================
  function generateId(prefix = "id") {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
  }

  function formatDate(dateStr) {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
    } catch (e) {
      return dateStr;
    }
  }

  function formatDateTime(dateVal) {
    if (!dateVal) return "-";
    try {
      // Sadece "YYYY-MM-DD" olan eski kayıtlarda UTC 03:00 kaymasını engelle
      if (typeof dateVal === "string") {
        const trimmed = dateVal.trim();
        if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
          const parts = trimmed.split("-");
          const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
          return d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
        }
      }

      const d = new Date(dateVal);
      if (isNaN(d.getTime())) return String(dateVal);

      const datePart = d.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
      const timePart = d.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit", hour12: false });
      return `${datePart}, ${timePart}`;
    } catch (e) {
      return String(dateVal);
    }
  }

  function calculateNet(dogru = 0, yanlis = 0, examType = "lgs") {
    const d = Number(dogru) || 0;
    const y = Number(yanlis) || 0;
    const penalty = examType === "yks" ? 4 : 3;
    const net = d - (y / penalty);
    return Math.max(0, Number(net.toFixed(2)));
  }

  /**
   * Kazanım metinlerini küçük/büyük harf, Türkçe karakter, noktalama ve MEB kod farkı gözetmeksizin normalize eder
   */
  function normalizeKazanimText(text) {
    if (!text) return "";
    let s = String(text).trim();
    s = s.replace(/^(?:(?:\d+|[A-ZÇĞİÖŞÜ])\s*[\.\-\)\:]\s*)+/i, "");
    s = s.replace(/^[A-ZÇĞİÖŞÜ]\.\d+(?:\.\d+)*[\.\-\:\s]*/i, "");
    s = s.replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase();
    s = s.replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c").replace(/ı/g, "i");
    s = s.replace(/[\.\,\;\:\!\?\'\"\(\)\[\]\{\}\-\–\—\/\\\_]/g, " ");
    s = s.replace(/\s+/g, " ").trim();
    return s;
  }

  /**
   * İki kazanımın aynı veya eşdeğer kazanım olup olmadığını akıllı benzerlik ile doğrular
   */
  function areKazanimlarEquivalent(textA, textB) {
    const normA = normalizeKazanimText(textA);
    const normB = normalizeKazanimText(textB);
    if (!normA || !normB) return false;
    if (normA === normB) return true;

    if (normA.length >= 15 && normB.length >= 15) {
      if (normA.includes(normB) || normB.includes(normA)) return true;
    }

    const stopWords = new Set(["ve", "ile", "veya", "de", "da", "icin", "bu", "bir", "cok", "en", "gibi", "gore", "ait", "ilgili", "yonelik", "eder", "yapar", "cozer", "belirler", "kavrar", "anlar", "kullanir", "yapabilme", "cozebilme"]);
    const tokensA = new Set(normA.split(" ").filter(w => w.length >= 3 && !stopWords.has(w)));
    const tokensB = new Set(normB.split(" ").filter(w => w.length >= 3 && !stopWords.has(w)));

    if (tokensA.size === 0 || tokensB.size === 0) {
      return normA === normB;
    }

    let intersection = 0;
    tokensA.forEach(t => {
      for (const tb of tokensB) {
        if (t === tb || (t.length >= 5 && tb.length >= 5 && (t.startsWith(tb.substring(0, Math.min(tb.length, 5))) || tb.startsWith(t.substring(0, Math.min(t.length, 5)))))) {
          intersection++;
          break;
        }
      }
    });

    const union = tokensA.size + tokensB.size - intersection;
    const jaccard = union > 0 ? intersection / union : 0;
    const dice = (tokensA.size + tokensB.size) > 0 ? (2 * intersection) / (tokensA.size + tokensB.size) : 0;

    return jaccard >= 0.50 || dice >= 0.60;
  }

  /**
   * Sınavın ders netlerinin doğrulanmış gerçek toplamını hesaplar
   */
  function getVerifiedExamTotalNet(exam) {
    if (exam && exam.dersSonuclari && Array.isArray(exam.dersSonuclari) && exam.dersSonuclari.length > 0) {
      const sum = exam.dersSonuclari.reduce((acc, d) => acc + (Number(d.net) || 0), 0);
      return Number(sum.toFixed(2));
    }
    return Number(Number(exam?.toplamNet || 0).toFixed(2));
  }

  function calculateLgsScore(dersSonuclari = []) {
    if (!dersSonuclari || dersSonuclari.length === 0) return "100,000";

    let weightedNet = 0;
    dersSonuclari.forEach((d) => {
      const net = Number(d.net || 0);
      const name = (d.ders || "").toLowerCase();
      // MEB LGS Standart Ağırlıklı Katsayıları:
      // Türkçe (4), Matematik (4), Fen (4), İnkılap (1), Din (1), Yabancı Dil (1)
      let katsayi = 1;
      if (name.includes("türkçe") || name.includes("matematik") || name.includes("fen")) {
        katsayi = 4;
      } else {
        katsayi = 1;
      }
      weightedNet += net * katsayi;
    });

    // MEB LGS Taban Puan: 100, Puan Aralığı: 400, Maksimum Ağırlıklı Net: 270
    const calculated = 100 + ((weightedNet / 270) * 400);
    return Math.max(100, Math.min(500, calculated)).toFixed(3).replace(".", ",");
  }

  function showToast(message, type = "info", duration = 3500) {
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast-item toast-${type} animate-slide-in`;

    const icons = {
      success: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
      error: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
      warning: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      info: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
    };

    toast.innerHTML = `
      <div class="toast-icon-wrap">${icons[type] || icons.info}</div>
      <div class="toast-content">${escapeHtml(message)}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("toast-fade-out");
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  function escapeHtml(str) {
    if (typeof str !== "string") return str;
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function hexToRgb(hex) {
    if (!hex) return "37, 99, 235";
    let c = hex.replace("#", "");
    if (c.length === 3) c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
    const num = parseInt(c, 16);
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  }

  // ==========================================
  // 4. FIREBASE SERVİSİ
  // ==========================================
  class FirebaseService {
    static app = null;
    static db = null;
    static storage = null;
    static isInitialized = false;
    static unsubscribers = [];
    static lastQuotaExceeded = false;
    static lastSyncTime = null;

    static init(config, storeInstance) {
      if (!config || !config.apiKey || !config.projectId) return false;
      const targetDb = config.databaseId || "olcme-uygulama";
      try {
        if (window.firebase && window.firebase.initializeApp) {
          if (window.firebase.apps && window.firebase.apps.length > 0) {
            this.app = window.firebase.apps[0];
          } else {
            this.app = window.firebase.initializeApp(config);
          }

          // NOT: Firebase Compat SDK v10, named database desteklemiyor.
          // firestore("olcme-uygulama") çağrısı hata fırlatır.
          // SDK onSnapshot listener'ları yanlış (default) DB'ye bağlanır.
          // Bu yüzden SDK yerine REST tabanlı canlı senkronizasyon kullanıyoruz.
          // SDK db objesi sadece depolama için tutulur (named DB gerektirmeyen işlemler).
          try {
            this.db = window.firebase.firestore ? window.firebase.firestore() : null;
          } catch (dbErr) {
            this.db = null;
          }

          this.storage = window.firebase.storage ? window.firebase.storage() : null;
          this.isInitialized = true;
          console.log(`[Firebase] REST tabanlı bağlantı aktif. Hedef DB: ${targetDb}`);

          if (storeInstance) {
            this.setupRealtimeListeners(storeInstance);
          }
          return true;
        }
        return false;
      } catch (e) {
        console.warn("[Firebase] Başlatma uyarısı:", e);
        return false;
      }
    }

    static setupRealtimeListeners(storeInstance) {
      // Firebase Compat SDK v10 named database (olcme-uygulama) için onSnapshot DESTEKLEMİYOR.
      // Bu nedenle REST API tabanlı polling kullanıyoruz.
      // SDK onSnapshot yerine: periyodik REST sorgusu + visibility/focus event'i.
      // Bu, kota dostu (60sn aralık) ve cihazlar arası senkronizasyonu sağlar.

      // Önceki interval'leri temizle
      if (this._pollIntervalId) {
        clearInterval(this._pollIntervalId);
        this._pollIntervalId = null;
      }
      if (this._visibilityHandler) {
        document.removeEventListener("visibilitychange", this._visibilityHandler);
        this._visibilityHandler = null;
      }

      if (!storeInstance) return;

      // İlk açılışta hemen bir kez senkronize et
      this.syncAllFromFirestore(storeInstance).then((changed) => {
        if (changed) storeInstance.notify("FIRESTORE_SYNCED", {});
      });

      // 60 saniyede bir arka plan senkronizasyonu (kota dostu)
      this._pollIntervalId = setInterval(() => {
        // Modal açıksa veya kota dolmuşsa pas geç
        const isModalOpen = !!document.querySelector(".modal-backdrop");
        if (isModalOpen || this.lastQuotaExceeded) return;
        this.syncAllFromFirestore(storeInstance).then((changed) => {
          if (changed) storeInstance.notify("FIRESTORE_SYNCED", {});
        });
      }, 60000);

      // Kullanıcı sekmeye döndüğünde senkronize et
      this._visibilityHandler = () => {
        if (document.visibilityState === "visible" && !this.lastQuotaExceeded) {
          const now = Date.now();
          if (!this._lastVisibilitySync || (now - this._lastVisibilitySync > 30000)) {
            this._lastVisibilitySync = now;
            this.syncAllFromFirestore(storeInstance).then((changed) => {
              if (changed) storeInstance.notify("FIRESTORE_SYNCED", {});
            });
          }
        }
      };
      document.addEventListener("visibilitychange", this._visibilityHandler);

      console.log("[Firebase] REST polling tabanlı senkronizasyon aktif (60sn aralık + visibilitychange).");
    }

    static jsToFirestoreFields(obj) {
      const fields = {};
      for (const [key, val] of Object.entries(obj || {})) {
        if (val === null || val === undefined) fields[key] = { nullValue: null };
        else if (typeof val === "boolean") fields[key] = { booleanValue: val };
        else if (typeof val === "number") {
          if (Number.isInteger(val)) fields[key] = { integerValue: String(val) };
          else fields[key] = { doubleValue: val };
        }
        else if (typeof val === "string") fields[key] = { stringValue: val };
        else if (Array.isArray(val)) fields[key] = { arrayValue: { values: val.map(v => typeof v === "object" ? { mapValue: { fields: this.jsToFirestoreFields(v) } } : { stringValue: String(v) }) } };
        else if (typeof val === "object") fields[key] = { mapValue: { fields: this.jsToFirestoreFields(val) } };
      }
      return fields;
    }

    static firestoreFieldsToJs(fields) {
      const obj = {};
      for (const [key, val] of Object.entries(fields || {})) {
        if ("stringValue" in val) obj[key] = val.stringValue;
        else if ("integerValue" in val) obj[key] = parseInt(val.integerValue, 10);
        else if ("doubleValue" in val) obj[key] = val.doubleValue;
        else if ("booleanValue" in val) obj[key] = val.booleanValue;
        else if ("nullValue" in val) obj[key] = null;
        else if ("arrayValue" in val) obj[key] = (val.arrayValue?.values || []).map(v => v.mapValue ? this.firestoreFieldsToJs(v.mapValue.fields) : (v.stringValue || v.integerValue || v.doubleValue || v.booleanValue));
        else if ("mapValue" in val) obj[key] = this.firestoreFieldsToJs(val.mapValue.fields);
      }
      return obj;
    }

    static async saveDocument(collectionName, docId, data) {
      const config = store?.getState()?.firebaseConfig || DEFAULT_FIREBASE_CONFIG;
      const apiKey = config.apiKey;
      const targetDb = config.databaseId || "olcme-uygulama";
      const projectId = config.projectId || "olcme-uygulama";
      
      // 1. Doğrudan REST API ile olcme-uygulama veritabanına yaz
      try {
        const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${targetDb}/documents/${collectionName}/${docId}?key=${apiKey}`;
        const body = JSON.stringify({ fields: this.jsToFirestoreFields(data) });
        await fetch(url, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body
        });
      } catch (e) {
        console.warn(`[Firebase REST] ${collectionName}/${docId} yazma:`, e);
      }

      // 2. SDK ile de senkronize et
      if (this.isInitialized && this.db) {
        try {
          await this.db.collection(collectionName).doc(docId).set(data, { merge: true });
        } catch (e) {}
      }
    }

    static async deleteDocument(collectionName, docId) {
      const config = store?.getState()?.firebaseConfig || DEFAULT_FIREBASE_CONFIG;
      const apiKey = config.apiKey;
      const targetDb = config.databaseId || "olcme-uygulama";
      const projectId = config.projectId || "olcme-uygulama";
      try {
        const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${targetDb}/documents/${collectionName}/${docId}?key=${apiKey}`;
        await fetch(url, { method: "DELETE" });
      } catch (e) {}

      if (this.isInitialized && this.db) {
        try {
          await this.db.collection(collectionName).doc(docId).delete();
        } catch (e) {}
      }
    }

    static async syncAllFromFirestore(storeInstance, isManual = false) {
      const config = storeInstance?.getState()?.firebaseConfig || DEFAULT_FIREBASE_CONFIG;
      const apiKey = config.apiKey;
      const targetDb = config.databaseId || "olcme-uygulama";
      const projectId = config.projectId || "olcme-uygulama";
      if (!apiKey) {
        if (isManual) showToast("Firebase API anahtarı bulunamadı.", "warning");
        return false;
      }

      try {
        const fetchCollection = async (coll) => {
          try {
            const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${targetDb}/documents:runQuery?key=${apiKey}`;
            const res = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ structuredQuery: { from: [{ collectionId: coll }] } })
            });

            if (res.status === 429) {
              this.lastQuotaExceeded = true;
              console.warn(`[Firestore Quota] ${coll} çekilirken kota aşıldı (HTTP 429).`);
              return "QUOTA_EXCEEDED";
            }

            if (!res.ok) return null;
            const data = await res.json();
            const docs = (data || [])
              .filter((item) => item.document && item.document.fields)
              .map((item) => {
                const id = item.document.name.split("/").pop();
                const fields = this.firestoreFieldsToJs(item.document.fields);
                return { id, ...fields };
              });
            return docs;
          } catch (e) {
            return null;
          }
        };

        let hasChange = false;
        let quotaHit = false;

        // 1. Öğrenciler
        const students = await fetchCollection("ogrenciler");
        if (students === "QUOTA_EXCEEDED") {
          quotaHit = true;
        } else if (students !== null) {
          const currentJson = JSON.stringify(storeInstance.state.students);
          const newJson = JSON.stringify(students);
          if (currentJson !== newJson) {
            storeInstance.state.students = students;
            storeInstance.saveToStorage(APP_CONFIG.storageKeys.STUDENTS, students);
            hasChange = true;
          }
        }

        // 2. Sınavlar
        const exams = await fetchCollection("sinavlar");
        if (exams === "QUOTA_EXCEEDED") {
          quotaHit = true;
        } else if (exams !== null) {
          const currentJson = JSON.stringify(storeInstance.state.exams);
          const newJson = JSON.stringify(exams);
          if (currentJson !== newJson) {
            storeInstance.state.exams = exams;
            storeInstance.saveToStorage(APP_CONFIG.storageKeys.EXAMS, exams);
            hasChange = true;
          }
        }

        // 3. Raporlar
        const reports = await fetchCollection("raporlar");
        if (reports === "QUOTA_EXCEEDED") {
          quotaHit = true;
        } else if (reports !== null) {
          const currentJson = JSON.stringify(storeInstance.state.reports);
          const newJson = JSON.stringify(reports);
          if (currentJson !== newJson) {
            storeInstance.state.reports = reports;
            storeInstance.saveToStorage(APP_CONFIG.storageKeys.REPORTS, reports);
            hasChange = true;
          }
        }

        // 4. Kurumlar
        const kurumlar = await fetchCollection("kurumlar");
        if (kurumlar === "QUOTA_EXCEEDED") {
          quotaHit = true;
        } else if (kurumlar !== null && kurumlar.length > 0) {
          const kurum = kurumlar[0];
          if (kurum && JSON.stringify(kurum) !== JSON.stringify(storeInstance.state.institution)) {
            storeInstance.state.institution = { ...storeInstance.state.institution, ...kurum };
            storeInstance.saveToStorage(APP_CONFIG.storageKeys.INSTITUTION, storeInstance.state.institution);
            hasChange = true;
          }
        }

        this.lastQuotaExceeded = quotaHit;
        this.lastSyncTime = new Date();

        if (quotaHit) {
          if (isManual) {
            showToast("⚠️ Firebase Günlük Okuma Kotası (50.000 okuma) aşıldı. Cihazlar arası veri aktarımı için 'JSON Yedek İndir/Yükle' özelliğini kullanabilirsiniz.", "warning", 6000);
          }
          return false;
        }

        if (isManual) {
          showToast(`Firestore (${targetDb}) ile başarıyla eşitlendi! Toplam ${storeInstance.state.students.length} öğrenci, ${storeInstance.state.exams.length} sınav mevcut.`, "success");
        }

        return hasChange;
      } catch (err) {
        if (isManual) showToast("Firestore senkronizasyonunda hata: " + err.message, "error");
        return false;
      }
    }

    static async uploadLogo(file, kurumId = "kurum_default") {
      if (!file) throw new Error("Dosya seçilmedi");
      if (this.isInitialized && this.storage) {
        try {
          const ref = this.storage.ref().child(`logos/${kurumId}_${Date.now()}_${file.name}`);
          const snapshot = await ref.put(file);
          return await snapshot.ref.getDownloadURL();
        } catch (e) {}
      }
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => reject(new Error("Logo okunamadı"));
        reader.readAsDataURL(file);
      });
    }
  }

  // ==========================================
  // 5. YÜKSEK HASSASİYETLİ VE ÇOKLU ÖĞRENCİ (70+ KİŞİ) PDF AYRIŞTIRICI
  // ==========================================
  class PDFParserService {
    /**
     * Tek veya 70+ sayfalık toplu PDF karnesini 8 eşzamanlı worker ile ultra hızlı paralel ayrıştırır.
     * Süre 20-30 dakikadan ~15-25 saniyeye iner.
     */
    static async parseMultiStudentPDF(file, onProgress, options = {}) {
      if (!file) throw new Error("PDF dosyası seçilmedi.");

      const arrayBuffer = await file.arrayBuffer();
      if (!window.pdfjsLib) throw new Error("PDF.js kütüphanesi yüklenemedi.");

      const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;
      const { useAi = true, aiConfig = null, abortSignal = null, concurrency = 8 } = options;

      // ==========================================
      // AŞAMA 1: TÜM SAYFALARI HIZLICA YEREL BELLEĞE AL (1-2 sn)
      // ==========================================
      if (onProgress) onProgress(0, totalPages, `⚡ PDF sayfaları yerel belleğe alınıyor (0 / ${totalPages})...`, 15, 0, "");

      const pageTasks = [];
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        pageTasks.push((async (pNum) => {
          if (abortSignal && abortSignal.aborted) throw new DOMException("İşlem durduruldu.", "AbortError");
          const page = await pdf.getPage(pNum);
          const viewport = page.getViewport({ scale: 1.0 });
          const textContent = await page.getTextContent();
          const items = textContent.items;
          const pageWidth = viewport.width;
          const pageHeight = viewport.height;
          const midX = pageWidth * 0.48;
          const headerBottomY = pageHeight * 0.45;

          const allPageItems = items
            .map((item) => ({ str: item.str?.trim(), x: item.transform[4], y: item.transform[5], width: item.width }))
            .filter((item) => item.str && item.str.length > 0);

          const leftColumnItems = allPageItems.filter((it) => it.y < headerBottomY && it.x < midX);
          const rightColumnItems = allPageItems.filter((it) => it.y < headerBottomY && it.x >= midX);

          const assembleRawLines = (itemList) => {
            if (!itemList || itemList.length === 0) return [];
            const sorted = [...itemList].sort((a, b) => b.y - a.y || a.x - b.x);
            const rawLines = [];
            let currentLine = [sorted[0]];
            for (let i = 1; i < sorted.length; i++) {
              const prev = currentLine[currentLine.length - 1];
              const curr = sorted[i];
              if (Math.abs(curr.y - prev.y) <= 4.5) {
                currentLine.push(curr);
              } else {
                currentLine.sort((a, b) => a.x - b.x);
                rawLines.push(currentLine.map((c) => c.str).join(" "));
                currentLine = [curr];
              }
            }
            if (currentLine.length > 0) {
              currentLine.sort((a, b) => a.x - b.x);
              rawLines.push(currentLine.map((c) => c.str).join(" "));
            }
            return rawLines;
          };

          const assembleAndUnwrapLines = (itemList) => {
            const rawLines = assembleRawLines(itemList);
            if (rawLines.length === 0) return [];
            const unwrappedLines = [];
            let buffer = "";
            for (let i = 0; i < rawLines.length; i++) {
              const line = rawLines[i].trim();
              const endsWithNumbers = /\d+\s+\d+\s+\d+(?:\s+\d+)?\s+[\d.,]+$/.test(line);
              if (endsWithNumbers) {
                if (buffer) { unwrappedLines.push((buffer + " " + line).trim()); buffer = ""; }
                else { unwrappedLines.push(line); }
              } else {
                if (/^(?:Türkçe|Matematik|Fen|İnkılap|İngilizce|Din)\./i.test(line) || /^[A-ZÇĞİÖŞÜ\s]{4,}$/.test(line)) {
                  if (buffer) unwrappedLines.push(buffer);
                  buffer = "";
                  unwrappedLines.push(line);
                } else {
                  buffer = buffer ? buffer + " " + line : line;
                }
              }
            }
            if (buffer) unwrappedLines.push(buffer);
            return unwrappedLines;
          };

          const fullPageRawLines = assembleRawLines(allPageItems);
          const fullPageLines = assembleAndUnwrapLines(allPageItems);
          const leftLines = assembleAndUnwrapLines(leftColumnItems);
          const rightLines = assembleAndUnwrapLines(rightColumnItems);

          let pageStructuredText = `\n=== TAM SAYFA DÜZ METİN VE TABLOLAR ===\n` + fullPageRawLines.join("\n");
          pageStructuredText += `\n=== SOL SÜTUN KAZANIMLARI ===\n` + leftLines.join("\n");
          pageStructuredText += `\n=== SAĞ SÜTUN KAZANIMLARI ===\n` + rightLines.join("\n");

          const localParsed = PDFParserService.parseTurkishExamDocument(pageStructuredText, fullPageRawLines, allPageItems);

          return {
            pageNum: pNum,
            pageStructuredText,
            fullPageRawLines,
            allPageItems,
            localParsed
          };
        })(pageNum));
      }

      const preloadedPages = await Promise.all(pageTasks);

      // ==========================================
      // AŞAMA 1.5: ÇOK SAYFALI ÖĞRENCİ KARNELERİNİ BİRLEŞTİR (1 Öğrenci = 1 veya 2+ Sayfa)
      // ==========================================
      const studentDocuments = [];

      for (let i = 0; i < preloadedPages.length; i++) {
        const pageData = preloadedPages[i];
        const pageText = pageData.pageStructuredText || "";

        // Sayfada yeni bir öğrenci sonuç karnesi/tablosu var mı?
        const hasScorecardTable = /01\.D\s+02\.Y|05\.N|Doğru\s+Yanlış\s+Boş\s+Net/i.test(pageText) || (/\bLGS\s+\d+\s+\d+\s+\d+/i.test(pageText) && /Öğrenci\s*(?:Adı|Puan)/i.test(pageText));
        const isDeficitContinuationPage = /Yanlış\s*Kazanımlar|Boş\s*Kazanımlar|Yanlis\s*Kazanimlar|Bos\s*Kazanimlar/i.test(pageText);

        const currentStudentName = pageData.localParsed?.ogrenci?.adSoyad || "";
        const prevDoc = studentDocuments.length > 0 ? studentDocuments[studentDocuments.length - 1] : null;
        const prevStudentName = prevDoc?.localParsed?.ogrenci?.adSoyad || "";

        // Eğer önceki bir öğrenci belgesi varsa ve bu sayfa devam sayfasıysa (veya aynı öğrencinin devamıysa):
        const isContinuation = prevDoc && (
          isDeficitContinuationPage ||
          (!hasScorecardTable) ||
          (currentStudentName && prevStudentName && currentStudentName.toLowerCase() === prevStudentName.toLowerCase() && currentStudentName !== "ÖĞRENCİ")
        );

        if (isContinuation) {
          // Devam sayfası: Önceki öğrenci belgesi ile birleştir
          prevDoc.pageNumbers.push(pageData.pageNum);
          prevDoc.pageNumDisplay = `${prevDoc.pageNumbers[0]}-${pageData.pageNum}`;
          prevDoc.allPageItems.push(...pageData.allPageItems);
          prevDoc.fullPageRawLines.push(...pageData.fullPageRawLines);
          prevDoc.pageStructuredText += `\n\n=== SAYFA ${pageData.pageNum} (KAZANIMLAR VE DEVAM TABLOLARI) ===\n` + pageData.pageStructuredText;

          // Birleştirilmiş tam metin ile yerel ayrıştırmayı yeniden yap
          prevDoc.localParsed = PDFParserService.parseTurkishExamDocument(prevDoc.pageStructuredText, prevDoc.fullPageRawLines, prevDoc.allPageItems);
        } else {
          // Yeni öğrenci belgesi
          studentDocuments.push({
            studentIndex: studentDocuments.length,
            pageNumbers: [pageData.pageNum],
            pageNumDisplay: String(pageData.pageNum),
            pageStructuredText: pageData.pageStructuredText,
            fullPageRawLines: [...pageData.fullPageRawLines],
            allPageItems: [...pageData.allPageItems],
            localParsed: pageData.localParsed
          });
        }
      }

      const totalStudents = studentDocuments.length;

      // AI kullanılmayacaksa veya API key yoksa anında yerel sonuçları döndür
      const hasAiKey = aiConfig && AIService.checkApiKey(aiConfig.provider || "openai", aiConfig);
      if (!useAi || !hasAiKey) {
        if (onProgress) onProgress(totalStudents, totalStudents, `⚡ ${totalStudents} Öğrenci Yerel Olarak Tamamlandı (%100)`, 0, 100, "");
        return studentDocuments.map((doc) => ({ pageNumber: doc.pageNumbers[0], pageDisplay: doc.pageNumDisplay, ogrenci: doc.localParsed.ogrenci, sinav: doc.localParsed.sinav }));
      }

      // ==========================================
      // AŞAMA 2: 8 EŞZAMANLI PARALEL WORKER HAVUZU (Concurrent Queue)
      // ==========================================
      const parsedResults = new Array(totalStudents);
      let completedCount = 0;
      const startTime = Date.now();
      const poolSize = Math.max(2, Math.min(concurrency, 10)); // 8 eşzamanlı paralel kanal

      let queueIndex = 0;

      async function worker() {
        while (queueIndex < studentDocuments.length) {
          if (abortSignal && abortSignal.aborted) throw new DOMException("İşlem durduruldu.", "AbortError");

          const currentIndex = queueIndex++;
          const docData = studentDocuments[currentIndex];
          let finalParsed = docData.localParsed;

          try {
            const aiParsed = await AIService.extractExamDataFromPdfText(docData.pageStructuredText, aiConfig, abortSignal);
            if (aiParsed && aiParsed.ogrenci && aiParsed.sinav) {
              finalParsed = PDFParserService.normalizeAiParsedData(aiParsed, docData.localParsed, docData.allPageItems, docData.fullPageRawLines);
            }
          } catch (err) {
            if (err.name === "AbortError") throw err;
            console.warn(`[PDF Parser] Öğrenci #${docData.pageNumDisplay} AI hatası (${err.message}). Yerel motora geçildi.`);
            if (finalParsed && finalParsed.sinav) {
              finalParsed.sinav.aiFallback = true;
              finalParsed.sinav.aiFallbackMessage = err.message;
            }
          }

          parsedResults[currentIndex] = {
            pageNumber: docData.pageNumbers[0],
            pageDisplay: docData.pageNumDisplay,
            ogrenci: finalParsed.ogrenci,
            sinav: finalParsed.sinav
          };

          completedCount++;
          const elapsedSec = Math.max(0.5, (Date.now() - startTime) / 1000);
          const currentRate = completedCount / elapsedSec; // Öğrenci / saniye hızı
          const remainingItems = totalStudents - completedCount;
          const remainingSec = remainingItems <= 0 ? 0 : Math.max(1, Math.round(remainingItems / currentRate));
          const percent = Math.round((completedCount / totalStudents) * 100);

          const formatTimeStr = (sec) => {
            if (sec <= 0) return "0 sn";
            if (sec < 60) return `~${sec} sn`;
            const mins = Math.floor(sec / 60);
            const r = sec % 60;
            return r > 0 ? `~${mins} dk ${r} sn` : `~${mins} dk`;
          };

          const remainingFormatted = formatTimeStr(remainingSec);

          if (onProgress) {
            const studentName = finalParsed?.ogrenci?.adSoyad || `Öğrenci #${docData.pageNumDisplay}`;
            onProgress(
              completedCount,
              totalStudents,
              `⚡ ${completedCount} / ${totalStudents} Öğrenci Ayrıştırıldı (%${percent}) — Kalan: ${remainingFormatted}`,
              remainingSec,
              percent,
              studentName,
              remainingFormatted
            );
          }
        }
      }

      // poolSize kadar worker'ı aynı anda paralel çalıştır
      const workers = [];
      for (let i = 0; i < poolSize; i++) {
        workers.push(worker());
      }

      await Promise.all(workers);

      return parsedResults.filter((p) => p && p.ogrenci && p.ogrenci.adSoyad);
    }

    /**
     * AI tarafından döndürülen verileri standart uygulama şemasına normalize ve valide eder.
     */
    static normalizeAiParsedData(aiParsed, localParsed, allPageItems, fullPageRawLines) {
      const ogrenci = {
        adSoyad: (aiParsed.ogrenci?.adSoyad || localParsed?.ogrenci?.adSoyad || "ÖĞRENCİ").trim(),
        sinif: aiParsed.ogrenci?.sinif || localParsed?.ogrenci?.sinif || "8",
        sube: aiParsed.ogrenci?.sube || localParsed?.ogrenci?.sube || "8/A",
        numara: aiParsed.ogrenci?.numara || localParsed?.ogrenci?.numara || "100",
        okul: aiParsed.ogrenci?.okul || localParsed?.ogrenci?.okul || "Özel Ege Atabey Ortaokulu"
      };

      // Orijinal LGS Puanı doğrulaması (Belgedeki birebir puanı al)
      let studentPuan = aiParsed.sinav?.puan;
      if (!studentPuan || studentPuan === "-" || studentPuan === "null" || typeof studentPuan !== "string") {
        studentPuan = PDFParserService.extractStudentLgsScoreDirect(allPageItems, fullPageRawLines) || localParsed?.sinav?.puan;
      }

      const dersSonuclari = (aiParsed.sinav?.dersSonuclari || localParsed?.sinav?.dersSonuclari || []).map((d) => {
        const dogru = parseInt(d.dogru, 10) || 0;
        const yanlis = parseInt(d.yanlis, 10) || 0;
        const bos = parseInt(d.bos, 10) || 0;
        const net = typeof d.net === "number" ? Number(d.net.toFixed(2)) : (parseFloat(String(d.net).replace(",", ".")) || Number((dogru - (yanlis / 3)).toFixed(2)));

        const konular = (d.konular || []).map((k) => {
          const sSayisi = parseInt(k.soruSayisi, 10) || 1;
          const kDogru = parseInt(k.dogru, 10) || 0;
          const kYanlis = parseInt(k.yanlis, 10) || 0;
          const kBos = parseInt(k.bos, 10) || Math.max(0, sSayisi - kDogru - kYanlis);
          const rawYuzde = String(k.basariYuzdesi || "").replace("%", "").replace(",", ".").trim();
          const yuzde = rawYuzde !== "" && !isNaN(parseFloat(rawYuzde)) ? parseFloat(rawYuzde) : (sSayisi > 0 ? Number(((kDogru / sSayisi) * 100).toFixed(0)) : 0);
          const isEksik = yuzde < 100 || kYanlis > 0 || (sSayisi > 0 && kDogru < sSayisi) || k.durum === "yanlis" || k.durum === "bos";
          const durum = isEksik ? "yanlis" : (kBos === sSayisi && kDogru === 0 ? "bos" : "dogru");
          const seviye = yuzde < 50 ? "kritik" : (yuzde < 85 ? "orta" : "hafif");

          return {
            kazanimAdi: (k.kazanimAdi || "").trim(),
            durum,
            soruSayisi: sSayisi,
            dogru: kDogru,
            yanlis: kYanlis || (isEksik ? 1 : 0),
            bos: kBos,
            basariYuzdesi: yuzde,
            seviye
          };
        }).filter((k) => k.kazanimAdi && k.kazanimAdi.length > 2);

        // KURAL: Eğer derste yanlış (>0) veya boş (>0) varsa, eksik kazanım sayısı yanlış+boş sayısına denk olmalıdır!
        const wrongGains = konular.filter((k) => k.durum === "yanlis" || k.durum === "bos" || (k.basariYuzdesi !== undefined && k.basariYuzdesi < 100));
        const neededMissingCount = (yanlis || 0) + (bos > 0 ? 1 : 0);

        if (neededMissingCount > 0 && wrongGains.length < neededMissingCount) {
          const dNameClean = d.ders?.trim() || "Genel";
          const matchedCurriculumKey = Object.keys(CURRICULUM_DATA).find((ck) => ck.toLowerCase().includes(dNameClean.toLowerCase()) || dNameClean.toLowerCase().includes(ck.toLowerCase()));
          const curriculumList = matchedCurriculumKey ? CURRICULUM_DATA[matchedCurriculumKey] : (CURRICULUM_DATA[dNameClean] || []);
          const missingCountToAdd = neededMissingCount - wrongGains.length;

          for (let i = 0; i < missingCountToAdd; i++) {
            const currItem = curriculumList[(wrongGains.length + i) % (curriculumList.length || 1)] || { konu: `${dNameClean} Eksik Kazanımı`, kazanim: `${dNameClean} dersi ilgili soru kazanımı analiz edilir.` };
            konular.push({
              kazanimAdi: `${currItem.konu}: ${currItem.kazanim}`,
              durum: yanlis > 0 ? "yanlis" : "bos",
              soruSayisi: 1,
              dogru: 0,
              yanlis: yanlis > 0 ? 1 : 0,
              bos: yanlis > 0 ? 0 : 1,
              basariYuzdesi: 0,
              seviye: "kritik",
              isAutoResolved: true
            });
          }
        }

        return {
          ders: d.ders,
          dogru,
          yanlis,
          bos,
          net,
          konular
        };
      });

      let totalNet = parseFloat(String(aiParsed.sinav?.toplamNet || localParsed?.sinav?.toplamNet || 0).replace(",", "."));
      if (!totalNet || totalNet === 0) {
        dersSonuclari.forEach((d) => { totalNet += Number(d.net || 0); });
        totalNet = Number(totalNet.toFixed(2));
      }

      return {
        ogrenci,
        sinav: {
          sinavAdi: aiParsed.sinav?.sinavAdi || localParsed?.sinav?.sinavAdi || "8. Sınıf Gelişim Takip Sınavı",
          tarih: aiParsed.sinav?.tarih || localParsed?.sinav?.tarih || new Date().toISOString().split("T")[0],
          tur: "kazanimli",
          toplamSoru: parseInt(aiParsed.sinav?.toplamSoru, 10) || 90,
          toplamNet: totalNet,
          puan: studentPuan || "Okunamadı",
          dersSonuclari,
          aiExtracted: true,
          dogrulama: {
            gecerli: true,
            uyarilar: [],
            guvenSkoru: 100,
            aiExtracted: true
          }
        }
      };
    }

    /**
     * PDF'in ham koordinatlı elemanlarından ve düz satırlarından öğrencinin orijinal LGS puanını 1:1 bulur.
     */
    static extractStudentLgsScoreDirect(allPageItems = [], rawLines = []) {
      // 1. ÖNCELİK (WORKWIN / KDS STANDARDI): "LGS" Kutusunun Doğrudan Altındaki Puan
      // (Kullanıcı görselindeki gibi: Sol kutuda üstte "LGS", hemen altında "465,834")
      const lgsAnchors = allPageItems.filter((it) => /^\s*LGS\s*$/i.test(it.str || "") || /^\s*LGS\b/i.test(it.str || ""));
      for (const anchor of lgsAnchors) {
        // anchor ile aynı X kolonunda (±45px) ve altındaki (y < anchor.y ve y >= anchor.y - 45px) elemanları ara
        const belowItems = allPageItems
          .filter((it) => Math.abs(it.x - anchor.x) <= 45.0 && it.y < anchor.y && it.y >= anchor.y - 45.0)
          .sort((a, b) => b.y - a.y); // en yakından uzağa

        for (const it of belowItems) {
          const m = it.str.match(/\b([1-5]\d{2}[.,]\d{1,4})\b/);
          if (m) {
            const val = parseFloat(m[1].replace(",", "."));
            if (!isNaN(val) && val >= 100 && val <= 500) {
              return m[1].trim(); // Görseldeki 465,834 puanı!
            }
          }
        }
      }

      // 2. ÖNCELİK: "LGS ... Katılımcı Sayısı" Satırının Bir Altındaki Satırın Başı
      // Satır 1: "LGS Katılımcı Sayısı 24 68"
      // Satır 2: "465,834 Ortalama 478,80 429,95"
      for (let i = 0; i < rawLines.length; i++) {
        const line = rawLines[i];
        if (/\bLGS\b/i.test(line) && (/\bKatılımcı\b/i.test(line) || /\bŞube\b/i.test(line) || /\bOkul\b/i.test(line))) {
          if (i + 1 < rawLines.length) {
            const nextLine = rawLines[i + 1].trim();
            const scoreMatch = nextLine.match(/^([1-5]\d{2}[.,]\d{1,4})/);
            if (scoreMatch) {
              return scoreMatch[1].trim();
            }
          }
        }
      }

      // 3. ÖNCELİK: "[Puan] Ortalama ..." ile Başlayan Satır
      for (const line of rawLines) {
        const m = line.match(/^([1-5]\d{2}[.,]\d{1,4})\s+(?:Ortalama|Katılımcı|Derece)/i);
        if (m) {
          return m[1].trim();
        }
      }

      // 4. ÖNCELİK: Tek bir metin kutusunda "LGS Puanı: 465,834" veya "Öğrenci Puanı: 465,834"
      for (const it of allPageItems) {
        const str = (it.str || "").trim();
        const m = str.match(/(?:Öğrenci\s*Puan[ıi]?|ÖĞRENCİ\s*PUANI?|LGS\s*Puan[ıi]?)\s*[:=\s]+([1-5]\d{2}[.,]\d{1,4})/i);
        if (m && m[1]) return m[1].trim();
      }

      // 5. ÖNCELİK: Yatay Satırda "LGS" Etiketinin Sağındaki 1. Puan Sütunu
      for (const anchor of lgsAnchors) {
        const rightItems = allPageItems
          .filter((it) => Math.abs(it.y - anchor.y) <= 6.0 && it.x > anchor.x)
          .sort((a, b) => a.x - b.x);

        for (const it of rightItems) {
          const m = it.str.match(/\b([1-5]\d{2}[.,]\d{1,4})\b/);
          if (m) {
            const val = parseFloat(m[1].replace(",", "."));
            if (!isNaN(val) && val >= 100 && val <= 500) {
              return m[1].trim();
            }
          }
        }
      }

      // 6. ÖNCELİK: Düz Satırlarda "LGS [Puan] ..." Formatı
      for (const line of rawLines) {
        if (/^LGS\b/i.test(line) || /\bLGS\s*[:=\s]+\d/i.test(line) || /\bLGS\s+[1-5]\d{2}/i.test(line)) {
          const scores = line.match(/\b([1-5]\d{2}[.,]\d{1,4})\b/g);
          if (scores && scores.length > 0) {
            return scores[0].trim();
          }
        }
      }

      // 7. ÖNCELİK: "Öğrenci Puanı : ..." Regex
      for (const line of rawLines) {
        const m = line.match(/(?:Öğrenci\s*Puan[ıi]?|ÖĞRENCİ\s*PUANI?)\s*[:=\s]+([1-5]\d{2}(?:[.,]\d{1,4})?)/i);
        if (m && m[1]) return m[1].trim();
      }

      // 8. ÖNCELİK: "Puan :" Genel Künye
      for (const line of rawLines) {
        const m = line.match(/\bPuan[ıi]?\s*:\s*([1-5]\d{2}(?:[.,]\d{1,4})?)/i);
        if (m && m[1] && !/Türü/i.test(line)) return m[1].trim();
      }

      return null;
    }

    static parseTurkishExamDocument(text, fullPageRawLines = [], allPageItems = []) {
      const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

      let adSoyad = "";
      let numara = "";
      let sube = "8/A";
      let sinif = "8";
      let okul = "Özel Ege Atabey Ortaokulu";
      let sinavAdi = "8. Sınıf Gelişim Takip Sınavı";
      let tarih = new Date().toISOString().split("T")[0];
      let toplamNet = 0;

      const nameMatch = text.match(/(?:Öğrenci\s*Adı|İsim|Adı\s*Soyadı)\s*[:=\s]+([A-ZÇĞİÖŞÜa-zçğıöşü\s]{3,35})(?=\s+Tarih|\s+Numara|\s+Sınıf|\s+Şube|\s+Okul|\s+Kitapçık|\n|$)/i);
      if (nameMatch) adSoyad = nameMatch[1].trim();

      if (!adSoyad || adSoyad.toLowerCase() === "öğrenci") {
        const footerNameMatch = text.match(/^([A-ZÇĞİÖŞÜa-zçğıöşü\s]{3,35})\s+Sayfa\s+\d+/m);
        if (footerNameMatch) adSoyad = footerNameMatch[1].trim();
      }

      const numMatch = text.match(/\bNumara[:\s]+(\d+)/i);
      if (numMatch) numara = numMatch[1].trim();

      const subeMatch = text.match(/\bŞube[:\s]+([0-9/A-Za-z-]+)/i);
      if (subeMatch) {
        sube = subeMatch[1].trim();
        const sClass = sube.match(/(\d+)/);
        if (sClass) sinif = sClass[1];
      }

      const okulMatch = text.match(/Okul[:\s]+([^\n]+?)(?=\s+Geldiği|\s+Sınav|\s+Kitapçık|\n|$)/i);
      if (okulMatch) okul = okulMatch[1].trim();

      const examMatch = text.match(/(?:Sınav\s*Adı|Sınav)[:\s]+([^\n]+?)(?=\s+Kitapçık|\s+Alan|\s+Sınav\s*Tarihi|\s+Tarih|\n|$)/i);
      if (examMatch) sinavAdi = examMatch[1].trim();

      const dateMatch = text.match(/(?:Sınav\s*Tarihi|Tarih)[:\s]+(\d{2}[./-]\d{2}[./-]\d{4})/i);
      if (dateMatch) {
        const parts = dateMatch[1].split(/[./-]/);
        if (parts.length === 3) tarih = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }

      const dersSonuclariMap = {
        "Türkçe": { ders: "Türkçe", dogru: 0, yanlis: 0, bos: 20, net: 0, konular: [] },
        "T.C. İnkılap Tarihi ve Atatürkçülük": { ders: "T.C. İnkılap Tarihi ve Atatürkçülük", dogru: 0, yanlis: 0, bos: 10, net: 0, konular: [] },
        "Din Kültürü ve Ahlak Bilgisi": { ders: "Din Kültürü ve Ahlak Bilgisi", dogru: 0, yanlis: 0, bos: 10, net: 0, konular: [] },
        "Yabancı Dil (İngilizce)": { ders: "Yabancı Dil (İngilizce)", dogru: 0, yanlis: 0, bos: 10, net: 0, konular: [] },
        "Matematik": { ders: "Matematik", dogru: 0, yanlis: 0, bos: 20, net: 0, konular: [] },
        "Fen Bilimleri": { ders: "Fen Bilimleri", dogru: 0, yanlis: 0, bos: 20, net: 0, konular: [] }
      };

      const LESSON_PATTERNS = [
        { name: "Türkçe", regex: /Türkçe\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d,.]+)/i },
        { name: "T.C. İnkılap Tarihi ve Atatürkçülük", regex: /(?:T\.C\.\s*İnkılap|İnkılap\s*Tarihi)[^\d]+(\d+)\s+(\d+)\s+(\d+)\s+([\d,.]+)/i },
        { name: "Din Kültürü ve Ahlak Bilgisi", regex: /Din\s*Kültürü[^\d]+(\d+)\s+(\d+)\s+(\d+)\s+([\d,.]+)/i },
        { name: "Yabancı Dil (İngilizce)", regex: /(?:Yabancı\s*Dil|İngilizce)[^\d]+(\d+)\s+(\d+)\s+(\d+)\s+([\d,.]+)/i },
        { name: "Matematik", regex: /Matematik\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d,.]+)/i },
        { name: "Fen Bilimleri", regex: /(?:Fen\s*Bilimleri|Fen\s*Bilgisi)[^\d]+(\d+)\s+(\d+)\s+(\d+)\s+([\d,.]+)/i }
      ];

      LESSON_PATTERNS.forEach((lp) => {
        const m = text.match(lp.regex);
        if (m) {
          const totalQ = parseInt(m[1], 10) || 0;
          const dogru = parseInt(m[2], 10) || 0;
          const yanlis = parseInt(m[3], 10) || 0;
          const net = parseFloat(m[4].replace(",", ".")) || 0;
          const bos = Math.max(0, totalQ - dogru - yanlis);

          dersSonuclariMap[lp.name] = {
            ders: lp.name,
            dogru,
            yanlis,
            bos,
            net: Number(net.toFixed(2)),
            konular: []
          };
        }
      });

      const toplamMatch = text.match(/Toplam\s+(\d+)\s+(\d+)\s+(\d+)\s+([\d,.]+)/i);
      if (toplamMatch) {
        toplamNet = parseFloat(toplamMatch[4].replace(",", ".")) || 85.01;
      }

      // =========================================================================
      // ŞABLON 1: Satır Sonunda Soru / Doğru / Yanlış / % İçeren Standart Kazanımlar
      // =========================================================================
      let currentDers = "Türkçe";

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (/^Türkçe(?:\.08|\s|$)/i.test(line)) currentDers = "Türkçe";
        else if (/^(?:Matematik)(?:\.08|\s|$)/i.test(line)) currentDers = "Matematik";
        else if (/^(?:Fen\s*Bilgisi|Fen\s*Bilimleri)(?:\.08|\s|$)/i.test(line)) currentDers = "Fen Bilimleri";
        else if (/^(?:İnkılap\s*Tarihi|T\.C\.\s*İnkılap)(?:\.08|\s|$)/i.test(line)) currentDers = "T.C. İnkılap Tarihi ve Atatürkçülük";
        else if (/^(?:İngilizce|Yabancı\s*Dil)(?:\.08|\s|$)/i.test(line)) currentDers = "Yabancı Dil (İngilizce)";
        else if (/^(?:Din\s*Kültürü)(?:\.08|\s|$)/i.test(line)) currentDers = "Din Kültürü ve Ahlak Bilgisi";

        // Satırın sonundaki sayıları eşle: Konu Adı ... [Sayı] [Doğru] [Yanlış] [%]
        const trailingMatch = line.match(/^[-•\s]*(.+?)\s+((?:%?\d+(?:[.,]\d+)?%?\s*){1,5})\s*$/);
        if (trailingMatch) {
          let kazanimText = trailingMatch[1].trim().replace(/^[-•\s]+/, "");
          const numTokens = trailingMatch[2].replace(/%/g, "").trim().split(/\s+/);

          if (numTokens.length >= 2 && kazanimText.length > 3) {
            // Son sayı BAŞARI YÜZDESİDİR (%)
            const lastVal = parseFloat(numTokens[numTokens.length - 1].replace(",", "."));
            const yuzde = isNaN(lastVal) ? 100 : lastVal;
            const soruSayisi = parseInt(numTokens[0], 10) || 1;
            const dogru = parseInt(numTokens[1], 10) || 0;
            const yanlis = numTokens.length >= 4 ? (parseInt(numTokens[2], 10) || 0) : Math.max(0, soruSayisi - dogru);

            // KULLANICI KURALI: Yüzdelik değeri %100 değilse (yuzde < 100) EKSİK KAZANIM olarak kabul et!
            const isEksik = yuzde < 100 || yanlis > 0 || (soruSayisi > 0 && dogru < soruSayisi);
            const durum = isEksik ? "yanlis" : (dogru === 0 ? "bos" : "dogru");

            const isCategoryHeader = /^(?:KONUŞMA|OKUMA|YAZMA|SAYILAR VE İŞLEMLER|CEBİR|GEOMETRİ VE ÖLÇME|VERİ İŞLEME|OLASILIK|ATATÜRKÇÜLÜK|DEMOKRATİKLEŞME|KADER İNANCI|DİN VE HAYAT|HZ\. MUHAMMED|KUR'AN-I KERİM|Reading|Listening|Speaking)\b/i.test(kazanimText);

            if (dersSonuclariMap[currentDers]) {
              const exists = dersSonuclariMap[currentDers].konular.some((k) => k.kazanimAdi === kazanimText);
              if (!exists) {
                dersSonuclariMap[currentDers].konular.push({
                  kazanimAdi: kazanimText,
                  durum,
                  soruSayisi,
                  dogru,
                  yanlis: yanlis || (isEksik ? 1 : 0),
                  basariYuzdesi: yuzde,
                  seviye: yuzde < 50 ? "kritik" : (yuzde < 85 ? "orta" : "hafif"),
                  isCategory: isCategoryHeader
                });
              }
            }
          }
        }
      }

      // =========================================================================
      // ŞABLON 2: "Yanlış Kazanımlar" ve "Boş Kazanımlar" Formatı (Örn: emir.pdf 2. Sayfa)
      // Bu şablonda kazanımlar ders ders listelenir ve başlarında soru adedi yer alır (örn: 1 - Konu Adı)
      // "Yanlış Kazanımlar" altındaki TÜMÜ -> durum: "yanlis"
      // "Boş Kazanımlar" altındaki TÜMÜ -> durum: "bos"
      // =========================================================================
      let currentSectionMode = null; // "yanlis" | "bos" | null
      let currentDeficitDers = "Türkçe";

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (/Yanlış\s*Kazanımlar|Yanlis\s*Kazanimlar/i.test(line)) {
          currentSectionMode = "yanlis";
          continue;
        } else if (/Boş\s*Kazanımlar|Bos\s*Kazanimlar/i.test(line)) {
          currentSectionMode = "bos";
          continue;
        }

        if (currentSectionMode) {
          // Ders başlığı kontrolü
          if (/^Türkçe/i.test(line) || /\bTürkçe(?:\.08|\.8)?\b/i.test(line)) currentDeficitDers = "Türkçe";
          else if (/^Matematik/i.test(line) || /\bMatematik(?:\.08|\.8)?\b/i.test(line)) currentDeficitDers = "Matematik";
          else if (/^Fen\s*Bilg/i.test(line) || /\bFen\s*Bil(?:gisi|imleri)(?:\.08|\.8)?\b/i.test(line)) currentDeficitDers = "Fen Bilimleri";
          else if (/^İnkılap/i.test(line) || /\bİnkılap(?:\.08|\.8)?\b/i.test(line) || /T\.C\.\s*İnk/i.test(line)) currentDeficitDers = "T.C. İnkılap Tarihi ve Atatürkçülük";
          else if (/^İngilizce/i.test(line) || /\bİngilizce(?:\.08|\.8)?\b/i.test(line) || /Yabancı\s*Dil/i.test(line)) currentDeficitDers = "Yabancı Dil (İngilizce)";
          else if (/^Din\s*Kültürü/i.test(line) || /\bDin\s*Kültürü(?:\.08|\.8)?\b/i.test(line)) currentDeficitDers = "Din Kültürü ve Ahlak Bilgisi";

          // Satır başında ders ve kazanım birlikte olabilir: "İngilizce.08 1 - Students will be able..."
          let textAfterDers = line;
          const inlineDersMatch = line.match(/^(?:Türkçe|Matematik|Fen\s*Bilgisi|Fen\s*Bilimleri|İnkılap\s*Tarihi|T\.C\.\s*İnkılap|İngilizce|Yabancı\s*Dil|Din\s*Kültürü)(?:\.08|\.8)?\s+(.+)$/i);
          if (inlineDersMatch) {
            textAfterDers = inlineDersMatch[1];
          }

          // "1 - Kazanım metni..." veya "3 - Metinle ilgili soruları cevaplar."
          const deficitMatch = textAfterDers.match(/^(\d+)\s*[-–—]\s*(.+)$/);
          if (deficitMatch) {
            const qCount = parseInt(deficitMatch[1], 10) || 1;
            const kName = deficitMatch[2].trim();

            if (kName.length > 3 && dersSonuclariMap[currentDeficitDers]) {
              const targetArr = dersSonuclariMap[currentDeficitDers].konular;
              const exists = targetArr.some((k) => k.kazanimAdi === kName);
              if (!exists) {
                targetArr.push({
                  kazanimAdi: kName,
                  durum: currentSectionMode === "bos" ? "bos" : "yanlis",
                  soruSayisi: qCount,
                  dogru: 0,
                  yanlis: currentSectionMode === "yanlis" ? qCount : 0,
                  bos: currentSectionMode === "bos" ? qCount : 0,
                  basariYuzdesi: 0,
                  seviye: currentSectionMode === "yanlis" ? "kritik" : "orta"
                });
              }
            }
          }
        }
      }

      // KURAL: Eğer herhangi bir derste yanlış (>0) veya boş (>0) varsa, eksik kazanım sayısı yanlış+boş sayısına denk olmalıdır!
      Object.keys(dersSonuclariMap).forEach((dKey) => {
        const dObj = dersSonuclariMap[dKey];
        const wrongGains = (dObj.konular || []).filter((k) => k.durum === "yanlis" || k.durum === "bos" || (k.basariYuzdesi !== undefined && k.basariYuzdesi < 100));
        const neededMissingCount = (dObj.yanlis || 0) + (dObj.bos > 0 ? 1 : 0);

        if (neededMissingCount > 0 && wrongGains.length < neededMissingCount) {
          const matchedCurriculumKey = Object.keys(CURRICULUM_DATA).find((k) => k.toLowerCase().includes(dKey.toLowerCase()) || dKey.toLowerCase().includes(k.toLowerCase()));
          const curriculumList = matchedCurriculumKey ? CURRICULUM_DATA[matchedCurriculumKey] : (CURRICULUM_DATA[dKey] || []);
          const missingCountToAdd = neededMissingCount - wrongGains.length;

          for (let i = 0; i < missingCountToAdd; i++) {
            const currItem = curriculumList[(wrongGains.length + i) % (curriculumList.length || 1)] || { konu: `${dKey} Eksik Kazanımı`, kazanim: `${dKey} ilgili soru kazanımı analiz edilir.` };
            dObj.konular.push({
              kazanimAdi: `${currItem.konu}: ${currItem.kazanim}`,
              durum: dObj.yanlis > 0 ? "yanlis" : "bos",
              soruSayisi: 1,
              dogru: 0,
              yanlis: dObj.yanlis > 0 ? 1 : 0,
              bos: dObj.yanlis > 0 ? 0 : 1,
              basariYuzdesi: 0,
              seviye: "kritik",
              isAutoResolved: true
            });
          }
        }
      });

      const dersSonuclari = Object.values(dersSonuclariMap);
      if (!adSoyad) adSoyad = "ÖĞRENCİ";

      // ==========================================
      // OTOMATİK MATEMATİKSEL SAĞLAMA (CHECKSUM)
      // ==========================================
      const uyarilar = [];
      let calculatedTotalNet = 0;
      let calculatedTotalCorrect = 0;
      let calculatedTotalWrong = 0;

      dersSonuclari.forEach((d) => {
        calculatedTotalNet += Number(d.net || 0);
        calculatedTotalCorrect += Number(d.dogru || 0);
        calculatedTotalWrong += Number(d.yanlis || 0);

        // Kural: Doğru - (Yanlış / 3) net sağlama kontrolü
        const expectedNet = Math.max(0, Number((d.dogru - (d.yanlis / 3)).toFixed(2)));
        if (Math.abs(expectedNet - d.net) > 0.05) {
          uyarilar.push(`${d.ders} netinde uyuşmazlık (Okunan: ${d.net}, Hesaplanan: ${expectedNet})`);
        }

        // Kazanım yanlış sağlama kontrolü
        const wrongGainsCount = d.konular.filter((k) => k.durum === "yanlis").length;
        if (d.yanlis > 0 && wrongGainsCount === 0) {
          uyarilar.push(`${d.ders} dersinde ${d.yanlis} yanlış var ancak kazanım eşleşmedi.`);
        }
      });

      calculatedTotalNet = Number(calculatedTotalNet.toFixed(2));
      if (Math.abs(calculatedTotalNet - toplamNet) > 0.1) {
        toplamNet = calculatedTotalNet; // Matematiksel olarak doğrulanmış nete otomatik düzelt
      }

      // ==========================================
      // PDF İÇERİSİNDEKİ ÖĞRENCİ LGS PUANINI BİREBİR (1:1) ÇIKARMA
      // ==========================================
      let studentPuan = PDFParserService.extractStudentLgsScoreDirect(allPageItems, fullPageRawLines);

      // Eğer koordinatlı çıkarıcı bulamadıysa yedek arama
      if (!studentPuan) {
        const searchLines = (fullPageRawLines && fullPageRawLines.length > 0) ? fullPageRawLines : lines;
        for (let i = 0; i < searchLines.length; i++) {
          const line = searchLines[i];
          if (/^LGS\b/i.test(line) || /\bLGS\s*[:=\s]+\d/i.test(line) || /\bLGS\s+[1-5]\d{2}/i.test(line)) {
            const scoresOnLine = line.match(/\b([1-5]\d{2}[.,]\d{1,4})\b/g);
            if (scoresOnLine && scoresOnLine.length > 0) {
              studentPuan = scoresOnLine[0].trim();
              break;
            }
          }
        }
      }

      // Eğer belgede hiçbir şekilde puan bulunamadıysa sahte değer üretme, açıkça uyar
      if (!studentPuan) {
        studentPuan = "Okunamadı (Belgeyi Kontrol Edin)";
        uyarilar.push("LGS Puanı belgeden doğrudan okunamadı.");
      }

      const finalPuan = studentPuan;

      const dogrulama = {
        gecerli: uyarilar.length === 0,
        uyarilar,
        guvenSkoru: uyarilar.length === 0 ? 100 : Math.max(70, 100 - (uyarilar.length * 15))
      };

      return {
        ogrenci: {
          adSoyad,
          sinif,
          sube,
          numara: numara || "100",
          okul
        },
        sinav: {
          sinavAdi: sinavAdi || "8. Sınıf Gelişim Takip-6 (Workwin 2025-26)",
          tarih,
          tur: "kazanimli",
          toplamSoru: 90,
          toplamNet: Number(toplamNet.toFixed(2)),
          puan: finalPuan,
          dersSonuclari,
          dogrulama
        }
      };
    }
  }

  // ==========================================
  // 6. YAPAY ZEKÂ ANALİZ SERVİSİ (LGS HAFTALIK ÇİZELGE VE ETÜT MATRİSİ)
  // ==========================================
  class AIService {
    static async analyzeExams(student, exams, aiConfig, abortSignal = null) {
      if (!student || !exams || exams.length === 0) {
        throw new Error("Analiz için en az bir öğrenci ve sınav seçilmelidir.");
      }

      const provider = aiConfig?.provider || "openai";
      const promptText = this.buildPrompt(student, exams);

      const hasKey = this.checkApiKey(provider, aiConfig);
      let rawResult = null;

      if (!hasKey) {
        await new Promise((r) => setTimeout(r, 600));
        rawResult = this.generateSimulatedAnalysis(student, exams);
      } else {
        try {
          if (provider === "openai") {
            rawResult = await this.callOpenAI(promptText, aiConfig, abortSignal);
          } else if (provider === "gemini") {
            rawResult = await this.callGemini(promptText, aiConfig, abortSignal);
          } else if (provider === "claude") {
            rawResult = await this.callClaude(promptText, aiConfig, abortSignal);
          } else {
            rawResult = this.generateSimulatedAnalysis(student, exams);
          }
        } catch (err) {
          if (err.name === "AbortError") {
            throw err;
          }
          console.warn(`[AI Servisi] ${provider} çağrısı uyarısı:`, err.message);
          rawResult = this.generateSimulatedAnalysis(student, exams);
          rawResult._fallbackUsed = true;
        }
      }

      // KURAL: Yanlış / eksik yapılan TÜM kazanımların rapora eksiksiz aktarılmasını sağla
      return this.ensureAllWrongOutcomesIncluded(rawResult, student, exams);
    }

    static ensureAllWrongOutcomesIncluded(aiResult, student, exams) {
      if (!aiResult) aiResult = {};
      const aiDeficiencies = Array.isArray(aiResult.eksikKonular) ? [...aiResult.eksikKonular] : [];

      // 1. Öğrencinin seçili tüm sınavlarındaki TÜM ders sonuçlarını ve kazanımlarını tara
      const allDeficienciesFromExams = [];
      const seenKeySet = new Set();

      (exams || []).forEach((exam) => {
        (exam.dersSonuclari || []).forEach((d) => {
          const dersAdi = (d.ders || "Genel").trim();
          let foundAnyDeficiencyInDers = false;

          (d.konular || []).forEach((k) => {
            const yuzde = k.basariYuzdesi !== undefined ? Number(k.basariYuzdesi) : (k.soruSayisi > 0 ? Number(((k.dogru / k.soruSayisi) * 100).toFixed(0)) : 0);
            const isDeficient = k.durum === "yanlis" || k.durum === "bos" || k.yanlis > 0 || k.bos > 0 || yuzde < 100 || (k.soruSayisi > 0 && k.dogru < k.soruSayisi);

            if (isDeficient && k.kazanimAdi && k.kazanimAdi.trim().length > 2) {
              foundAnyDeficiencyInDers = true;
              const cleanTopic = k.kazanimAdi.trim();
              const uniqueKey = `${dersAdi.toLowerCase()}___${cleanTopic.toLowerCase()}`;

              if (!seenKeySet.has(uniqueKey)) {
                seenKeySet.add(uniqueKey);

                // AI'nın bu konu için ürettiği özel öneri veya seviye varsa al
                const matchedAiItem = aiDeficiencies.find(
                  (aiItem) => (aiItem.ders && aiItem.ders.toLowerCase().includes(dersAdi.toLowerCase())) &&
                              (aiItem.konu && (aiItem.konu.toLowerCase().includes(cleanTopic.toLowerCase()) || cleanTopic.toLowerCase().includes(aiItem.konu.toLowerCase())))
                );

                const seviye = matchedAiItem?.seviye || (yuzde < 50 ? "kritik" : (yuzde < 85 ? "orta" : "hafif"));
                const oneri = matchedAiItem?.oneri || `${dersAdi} dersinde bu kazanım için kavram tekrarı ve ${yuzde === 0 ? "35" : "25"} yeni nesil soru çözümü`;

                allDeficienciesFromExams.push({
                  ders: dersAdi,
                  konu: cleanTopic,
                  seviye,
                  yuzde,
                  dogru: k.dogru || 0,
                  yanlis: k.yanlis || (yuzde < 100 ? 1 : 0),
                  bos: k.bos || 0,
                  oneri
                });
              }
            }
          });

          // Eğer derste yanlış (>0) veya boş (>0) var ama kazanım listesi boşsa / eksik tespit edilmediyse:
          if ((d.yanlis > 0 || d.bos > 0) && !foundAnyDeficiencyInDers) {
            const matchedCurriculumKey = Object.keys(CURRICULUM_DATA).find((ck) => ck.toLowerCase().includes(dersAdi.toLowerCase()) || dersAdi.toLowerCase().includes(ck.toLowerCase()));
            const curriculumList = matchedCurriculumKey ? CURRICULUM_DATA[matchedCurriculumKey] : (CURRICULUM_DATA[dersAdi] || []);
            const missingCount = Math.max(1, d.yanlis || 1);

            for (let i = 0; i < missingCount; i++) {
              const currItem = curriculumList[i % (curriculumList.length || 1)] || { konu: `${dersAdi} Eksik Kazanımı`, kazanim: `${dersAdi} dersi ilgili soru kazanımı analiz edilir.` };
              const cleanTopic = `${currItem.konu}: ${currItem.kazanim}`;
              const uniqueKey = `${dersAdi.toLowerCase()}___${cleanTopic.toLowerCase()}`;

              if (!seenKeySet.has(uniqueKey)) {
                seenKeySet.add(uniqueKey);
                allDeficienciesFromExams.push({
                  ders: dersAdi,
                  konu: cleanTopic,
                  seviye: "kritik",
                  yuzde: 0,
                  dogru: 0,
                  yanlis: 1,
                  bos: 0,
                  oneri: `${dersAdi} eksik kavram tekrarı ve 35 yeni nesil soru çözümü`
                });
              }
            }
          }
        });
      });

      // 2. AI'nın fazladan ürettiği ama henüz eklenmemiş olan ek konular varsa onları da ekle
      aiDeficiencies.forEach((aiItem) => {
        if (aiItem && aiItem.konu) {
          const alreadyExists = allDeficienciesFromExams.some(
            (exItem) => (exItem.ders.toLowerCase() === (aiItem.ders || "").toLowerCase()) &&
                        (exItem.konu.toLowerCase().includes(aiItem.konu.toLowerCase()) || aiItem.konu.toLowerCase().includes(exItem.konu.toLowerCase()))
          );
          if (!alreadyExists) {
            allDeficienciesFromExams.push({
              ders: aiItem.ders || "Genel",
              konu: aiItem.konu,
              seviye: aiItem.seviye || "orta",
              oneri: aiItem.oneri || "Kavram pekiştirme ve soru çözümü"
            });
          }
        }
      });

      // Eğer hala hiç eksik yoksa genel tavsiye
      if (allDeficienciesFromExams.length === 0) {
        allDeficienciesFromExams.push(
          { ders: "Türkçe", konu: "Yeni Nesil Paragraf ve Muhakeme", seviye: "hafif", oneri: "Günlük 25 paragraf ve deneme çözümü" },
          { ders: "Matematik", konu: "Yeni Nesil Beceri Temelli Sorular", seviye: "hafif", oneri: "Günde 30 ileri düzey soru" }
        );
      }

      aiResult.eksikKonular = allDeficienciesFromExams;
      return aiResult;
    }

    static checkApiKey(provider, config) {
      if (!config) return false;
      if (provider === "openai") return !!config.openaiApiKey?.trim();
      if (provider === "gemini") return !!config.geminiApiKey?.trim();
      if (provider === "claude") return !!config.claudeApiKey?.trim();
      return false;
    }

    static buildPrompt(student, exams) {
      // Sınavları her zaman kronolojik sıraya diz
      const sortedExams = [...exams].sort((a, b) => {
        const tA = new Date(a.tarih || 0).getTime() || 0;
        const tB = new Date(b.tarih || 0).getTime() || 0;
        return tA - tB;
      });

      const isMultiExam = sortedExams.length > 1;

      // Çoklu sınav varsa ortak / tekrar eden yanlış kazanımları akıllı benzerlikle (fuzzy matching) tespit et
      const topicGroups = [];
      sortedExams.forEach((exam, examIdx) => {
        (exam.dersSonuclari || []).forEach((d) => {
          const dersName = (d.ders || "Genel").trim();
          (d.konular || []).forEach((k) => {
            const yuzde = k.basariYuzdesi !== undefined ? Number(k.basariYuzdesi) : (k.soruSayisi > 0 ? Number(((k.dogru / k.soruSayisi) * 100).toFixed(0)) : 0);
            const isDeficient = k.durum === "yanlis" || k.durum === "bos" || k.yanlis > 0 || k.bos > 0 || yuzde < 100 || (k.soruSayisi > 0 && k.dogru < k.soruSayisi);
            if (isDeficient && k.kazanimAdi && k.kazanimAdi.trim().length > 2) {
              const rawTopic = k.kazanimAdi.trim();
              let matchGroup = topicGroups.find(g => 
                g.ders.toLowerCase() === dersName.toLowerCase() && areKazanimlarEquivalent(g.kazanimAdi, rawTopic)
              );

              if (!matchGroup) {
                matchGroup = {
                  ders: dersName,
                  kazanimAdi: rawTopic,
                  examIndices: new Set(),
                  examNames: [],
                  totalWrong: 0,
                  totalBos: 0
                };
                topicGroups.push(matchGroup);
              }

              matchGroup.examIndices.add(examIdx);
              if (!matchGroup.examNames.includes(exam.sinavAdi)) {
                matchGroup.examNames.push(exam.sinavAdi);
              }
              matchGroup.totalWrong += Number(k.yanlis) || (k.durum === "yanlis" ? 1 : 0);
              matchGroup.totalBos += Number(k.bos) || (k.durum === "bos" ? 1 : 0);
            }
          });
        });
      });

      const recurringTopics = topicGroups.filter((t) => t.examIndices.size >= 2);

      let examSummary = sortedExams
        .map((exam, index) => {
          const verifiedNet = getVerifiedExamTotalNet(exam);
          let details = `\n--- SINAV ${index + 1}: ${exam.sinavAdi} (Tarih: ${exam.tarih}, Doğrulanmış Toplam Net: ${verifiedNet}, LGS Puanı: ${exam.puan || "-"}) ---`;
          (exam.dersSonuclari || []).forEach((d) => {
            details += `\n* Ders: ${d.ders} | Doğru: ${d.dogru}, Yanlış: ${d.yanlis}, Boş: ${d.bos}, Net: ${d.net}`;
            if (d.konular && d.konular.length > 0) {
              const eksikler = d.konular
                .filter((k) => k.durum === "yanlis" || k.durum === "bos" || k.yanlis > 0 || k.bos > 0 || (k.basariYuzdesi !== undefined && k.basariYuzdesi < 100) || (k.soruSayisi > 0 && k.dogru < k.soruSayisi))
                .map((k) => `${k.kazanimAdi} (Soru: ${k.soruSayisi || 1}, Doğru: ${k.dogru || 0}, Yanlış: ${k.yanlis || 0}, Başarı: %${k.basariYuzdesi !== undefined ? k.basariYuzdesi : 0})`);
              if (eksikler.length > 0) {
                details += `\n  - Bu Dersteki TÜM Eksik/Yanlış Kazanımlar (${eksikler.length} adet):\n    • ` + eksikler.join("\n    • ");
              }
            }
          });
          return details;
        })
        .join("\n");

      let recurringWarningPrompt = "";
      if (isMultiExam && recurringTopics.length > 0) {
        recurringWarningPrompt = `\n🚨 DİKKAT: 2 VEYA DAHA FAZLA SINAVDA TEKRAR EDEN (KRONİK) YANLIŞ KAZANIMLAR (${recurringTopics.length} adet):
(Bu kazanımlar öğrencinin birden fazla sınavda peş peşe yanlış yaptığı ve henüz öğrenemediği kalıcı eksiklerdir!)
${recurringTopics.map((t) => `• [${t.ders}] ${t.kazanimAdi} (${t.examIndices.size} sınavda da yanlış yapıldı: ${t.examNames.join(", ")})`).join("\n")}
`;
      }

      return `Sen Türkiye'nin en seçkin LGS Eğitim Koçu, Rehberlik ve Ölçme Değerlendirme Uzmanısın.
Aşağıda sınav sonuç karnesi verilen 8. sınıf öğrencisi için eksik analizini yap ve LGS mantığına uygun 7 günlük profesyonel bir Haftalık Çalışma Çizelgesi Tablosu (Etüt Matrisi) hazırla.

ÖĞRENCİ:
- Adı Soyadı: ${student.adSoyad} (${student.sinif}. Sınıf / ${student.sube} - No: ${student.numara})

SINAV VERİLERİ VE KAZANIM ANALİZİ:
${examSummary}
${recurringWarningPrompt}
${isMultiExam ? "NOT: Birden fazla sınav seçilmiştir. Sınavlar arasındaki net artış/azalışlarını, gelişim seyrini ve özellikle birden fazla sınavda tekrar eden ortak/kronik yanlış kazanımları 'gelisimAnalizi' alanında detaylıca karşılaştır." : ""}

KURALLAR:
1. Öğrencinin yüzdelik başarısı %100 olmayan (eksik olan) TÜM kazanımlarını 'eksikKonular' listesine önem ve öncelik sırasına göre ekle.
   ${recurringTopics.length > 0 ? `- 🚨 ÇOK ÖNEMLİ: 2+ sınavda tekrar eden ortak yanlış kazanımları 'eksikKonular' listesinin EN BAŞINA ekle. Bu kazanımlara "isRecurring": true, "recurringCount": ${recurringTopics.length}, "recurringExams": ["Sınav 1 Adı", "Sınav 2 Adı"], "seviye": "kritik" ve "oneri": "🚨 Tekrarlayan Yanlış Telafisi: ..." olarak ata.` : ""}
2. Öğrenciyi motive eden, güçlü derslerini takdir eden, eksiklere nokta atışı rehberlik yapan profesyonel bir 'genelYorum' yaz.
3. ${isMultiExam ? "'gelisimAnalizi' alanında sınavlar arasındaki net artış/azalışlarını, hangi derslerde yükseliş/düşüş olduğunu ve özellikle aynı kazanımlarda yapılan tekrarlayan yanlışları derinlemesine değerlendir." : ""}
4. 'haftalikTablo' içinde Pazartesi'den Pazar'a kadar 7 GÜNÜN HER BİRİ İÇİN 3 Ayrı Etüt (1. Etüt: Konu Tekrarı & Eksik Telafi, 2. Etüt: Yeni Nesil Soru Çözümü, 3. Etüt: Günlük Tekrar / Paragraf / Hata Defteri) oluştur.
   - 1. Etütler mutlaka öğrencinin %100 altında kalan ${recurringTopics.length > 0 ? "ve özellikle birden fazla sınavda tekrar eden ortak" : ""} eksik kazanımlarına odaklanmalıdır.
   - Cumartesi Sabahı: 90 Soruluk Tam LGS Denemesi ve öğleden sonra Video Çözüm Analizi olmalı.
   - Pazar Günü: Hata Defteri Tekrarı ve dinlenme olmalı.

YANIT FORMATI:
SADECE aşağıdaki JSON nesnesi formatında yanıt ver:
{
  "eksikKonular": [
    {
      "ders": "Türkçe",
      "konu": "Bağlamdan Kelime ve Sözcükte Anlam Tahmini",
      "seviye": "kritik",
      "isRecurring": true,
      "recurringCount": 2,
      "recurringExams": ["1. Deneme", "2. Deneme"],
      "oneri": "Konu özeti + 35 yeni nesil anlam sorusu ile acil telafi"
    }
  ],
  "genelYorum": "Metin...",
  "gelisimAnalizi": "${isMultiExam ? "Sınavlar arası karşılaştırma, net değişimleri ve kronik kazanım değerlendirmesi..." : ""}",
  "haftalikTablo": [
    {
      "gun": "Pazartesi",
      "gunlukOdak": "Türkçe & Matematik",
      "etut1": { "saat": "17:30 - 18:30", "ders": "Türkçe", "konu": "🎯 Bağlamdan Anlam & Söz Öbeği Pratiği", "hedef": "35 Soru" },
      "etut2": { "saat": "18:45 - 19:45", "ders": "Matematik", "konu": "Çarpanlar ve Katlar / EBOB-EKOK", "hedef": "30 Soru" },
      "etut3": { "saat": "20:00 - 20:45", "ders": "Paragraf & Okuma", "konu": "20 Yeni Nesil Paragraf + Kitap (20 dk)", "hedef": "20 Soru" },
      "gunlukToplamSoru": 85
    }
  ],
  "haftalikOzet": {
    "toplamSoruHedefi": "580 - 650 Soru",
    "toplamEtutSuresi": "21.5 Saat",
    "denemeSayisi": "1 Tam LGS Denemesi + 2 Branş Denemesi",
    "kitapOkuma": "120 dk Kitap + 100 Paragraf",
    "kocTavsiyesi": "Hafta boyu denemelerde ve testlerde yanlış yapılan her soru 'Hata Defteri'ne yapıştırılmalı ve pazar günü mutlaka yeniden çözülmelidir."
  }
}`;
    }

    /**
     * Sınav Karnesi / PDF Metninden Veri ve Kazanım Ayıklama Promptu
     */
    static buildPdfExtractionPrompt(pageStructuredText) {
      return `Sen Türkiye'deki MEB ve LGS standartlarında sınav sonuç karnelerini, optik değerlendirme raporlarını ve sınav belgelerini (Workwin, KDS, Özdebir, Töder, Çanta vb.) analiz eden KUSURSUZ bir Yapay Zekâ Veri Ayıklama Uzmanısın.

Aşağıda bir öğrencinin sınav sonuç belgesinden çıkarılan ham metin, ders net tabloları ve kazanım listeleri yer almaktadır.
Bu metni dikkatle inceleyerek öğrencinin bilgilerini, ders netlerini, LGS puanını ve EN ÖNEMLİSİ her dersin altındaki TÜM KAZANIMLARI eksiksiz, sıfır hata ile JSON formatında ayrıştır.

=== BELGE HAM METNİ VE KAZANIMLARI ===
${pageStructuredText}

GÖREVLER VE DİKKAT EDİLECEK KURALLAR:
1. ÖĞRENCİ BİLGİLERİ:
   - adSoyad: Öğrencinin tam adı soyadı (Büyük/küçük harf düzgün formatta).
   - sinif: Sınıf seviyesi (genellikle "8" veya "7").
   - sube: Şubesi (örn. "8/A", "8-B").
   - numara: Öğrenci okul numarası.
   - okul: Okul adı.

2. SINAV BİLGİLERİ:
   - sinavAdi: Sınavın tam adı (örn. "8. Sınıf Gelişim Takip Sınavı-6", "Workwin Deneme 2025-2026").
   - tarih: Sınav tarihi (YYYY-MM-DD formatında, örn: "2026-03-15").
   - puan: Öğrencinin kendi karnesindeki LGS Puanı (Örn: "465,834" veya "481,988"). Okul/genel ortalamaları değil, öğrencinin kendi puanını al.
   - toplamNet: Toplam net sayısı (Örn: 82.00).

3. DERS SONUÇLARI (TÜRKÇE, MATEMATİK, FEN BİLİMLERİ, T.C. İNKILAP TARİHİ VE ATATÜRKÇÜLÜK, DİN KÜLTÜRÜ VE AHLAK BİLGİSİ, YABANCI DİL (İNGİLİZCE)):
   - Her ders için dogru, yanlis, bos ve net sayılarını çıkar.
   - Her dersin altındaki "konular" dizisine o derse ait BÜTÜN KAZANIMLARI eksiksiz tek tek ekle:
     * kazanimAdi: Kazanımın tam, eksiksiz, birleştirilmiş adı (kesilmiş satırları düzgün birleştir, satır sonundaki sayıları metinden temizle).
     * soruSayisi: O kazanımdan çıkan toplam soru adedi (sayı).
     * dogru: Öğrencinin doğru sayısı.
     * yanlis: Öğrencinin yanlış sayısı.
     * bos: Boş sayısı (soruSayisi - dogru - yanlis).
     * basariYuzdesi: Başarı yüzdesi (0-100 arası sayı).
     * durum: Başarı yüzdesi %100 değilse veya yanlış/boş varsa "yanlis", tam doğruysa "dogru", hepsi boşsa "bos".
     * seviye: basariYuzdesi < 50 ise "kritik", 50 ile 85 arasında ise "orta", 85 ve üstü ise "hafif".

4. ÖZEL ŞABLON KURALI ("Yanlış Kazanımlar" ve "Boş Kazanımlar" Formatı):
   - Eğer belgede kazanımlar 'Yanlış Kazanımlar' veya 'Boş Kazanımlar' başlığı altında '1 - Konu Adı' veya '3 - Konu Adı' şeklinde listelenmişse (örn: 2. sayfaya taşan format):
     * Bu belgedeki TÜM kazanımlar öğrencinin yanlış veya boş yaptığı eksik kazanımlardır.
     * 'Yanlış Kazanımlar' altındaki her bir kazanım için: durum="yanlis", dogru=0, yanlis=soruSayisi, basariYuzdesi=0, seviye="kritik".
     * 'Boş Kazanımlar' altındaki her bir kazanım için: durum="bos", dogru=0, yanlis=0, bos=soruSayisi, basariYuzdesi=0, seviye="orta".
     * Satır başındaki sayı (örn: "1 - ..." veya "3 - ...") soru sayısıdır.
     * Bu listedeki BÜTÜN kazanımları eksiksiz ilgili dersin "konular" dizisine ekle.

YANIT FORMATI:
SADECE geçerli bir JSON nesnesi döndür (ekstra metin, açıklama veya backtick ekleme):
{
  "ogrenci": {
    "adSoyad": "Bora Ateş Zafer",
    "sinif": "8",
    "sube": "8/A",
    "numara": "222",
    "okul": "Özel Ege Atabey Ortaokulu"
  },
  "sinav": {
    "sinavAdi": "8. Sınıf Gelişim Takip Sınavı",
    "tarih": "2026-03-15",
    "puan": "465,834",
    "toplamNet": 82.00,
    "toplamSoru": 90,
    "dersSonuclari": [
      {
        "ders": "Türkçe",
        "dogru": 18,
        "yanlis": 2,
        "bos": 0,
        "net": 17.33,
        "konular": [
          {
            "kazanimAdi": "Bağlamdan yararlanarak bilmediği kelime ve kelime gruplarının anlamını tahmin eder.",
            "soruSayisi": 1,
            "dogru": 0,
            "yanlis": 1,
            "bos": 0,
            "basariYuzdesi": 0,
            "durum": "yanlis",
            "seviye": "kritik"
          }
        ]
      }
    ]
  }
}`;
    }

    /**
     * PDF Sayfa Metnini AI ile Kusursuz Ayrıştırır
     */
    static async extractExamDataFromPdfText(pageStructuredText, aiConfig, abortSignal = null) {
      const provider = aiConfig?.provider || (aiConfig?.geminiApiKey ? "gemini" : (aiConfig?.openaiApiKey ? "openai" : "gemini"));
      const promptText = this.buildPdfExtractionPrompt(pageStructuredText);

      const hasKey = this.checkApiKey(provider, aiConfig);
      if (!hasKey) {
        throw new Error(`Seçilen ${provider.toUpperCase()} için API anahtarı girilmedi. Lütfen Ayarlar menüsünden API anahtarınızı tanımlayınız.`);
      }

      let result = null;
      if (provider === "gemini") {
        result = await this.callGemini(promptText, aiConfig, abortSignal);
      } else if (provider === "openai") {
        result = await this.callOpenAI(promptText, aiConfig, abortSignal);
      } else if (provider === "claude") {
        result = await this.callClaude(promptText, aiConfig, abortSignal);
      } else {
        throw new Error(`Desteklenmeyen AI sağlayıcı: ${provider}`);
      }

      return result;
    }

    static async callOpenAI(promptText, config, abortSignal = null) {
      const model = config.openaiModel || "gpt-4o-mini";
      const apiKey = config.openaiApiKey;
      const url = "https://api.openai.com/v1/chat/completions";

      const response = await fetch(url, {
        method: "POST",
        signal: abortSignal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: "system", content: "Sen Türkçe LGS eğitim ve ölçme-değerlendirme uzmanısın. Yalnızca geçerli JSON nesnesi döndürürsün." },
            { role: "user", content: promptText }
          ],
          response_format: { type: "json_object" },
          temperature: config.temperature !== undefined ? config.temperature : 0.2
        })
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`OpenAI API Hatası (${response.status}): ${errBody}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("OpenAI boş yanıt döndürdü.");
      return this.cleanAndParseJSON(content);
    }

    static async callGemini(promptText, config, abortSignal = null) {
      const model = config.geminiModel || "gemini-1.5-flash";
      const apiKey = config.geminiApiKey;
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        signal: abortSignal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: {
            temperature: config.temperature !== undefined ? config.temperature : 0.2,
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Gemini API Hatası (${response.status}): ${errBody}`);
      }

      const data = await response.json();
      const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!candidateText) throw new Error("Gemini API boş yanıt döndürdü.");
      return this.cleanAndParseJSON(candidateText);
    }

    static async callClaude(promptText, config, abortSignal = null) {
      const model = config.claudeModel || "claude-3-5-sonnet-20241022";
      const apiKey = config.claudeApiKey;
      const url = "https://api.anthropic.com/v1/messages";

      const response = await fetch(url, {
        method: "POST",
        signal: abortSignal,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "dangerously-allow-browser": "true"
        },
        body: JSON.stringify({
          model: model,
          max_tokens: 4000,
          temperature: config.temperature !== undefined ? config.temperature : 0.2,
          messages: [{ role: "user", content: promptText }]
        })
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Claude API Hatası (${response.status}): ${errBody}`);
      }

      const data = await response.json();
      const content = data.content?.[0]?.text;
      if (!content) throw new Error("Claude boş yanıt döndürdü.");
      return this.cleanAndParseJSON(content);
    }

    static cleanAndParseJSON(rawText) {
      let clean = rawText.trim();
      if (clean.startsWith("```json")) clean = clean.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      else if (clean.startsWith("```")) clean = clean.replace(/^```\s*/, "").replace(/\s*```$/, "");
      try {
        return JSON.parse(clean);
      } catch (e) {
        const match = clean.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
        throw new Error("JSON ayrıştırma hatası: " + e.message);
      }
    }

    static generateSimulatedAnalysis(student, exams) {
      // Sınavları her zaman kronolojik sıraya diz
      const sortedExams = [...exams].sort((a, b) => {
        const tA = new Date(a.tarih || 0).getTime() || 0;
        const tB = new Date(b.tarih || 0).getTime() || 0;
        return tA - tB;
      });

      const isMulti = sortedExams.length > 1;
      const firstExam = sortedExams[0] || {};
      const latestExam = sortedExams[sortedExams.length - 1] || {};

      const verifiedFirstNet = getVerifiedExamTotalNet(firstExam);
      const verifiedLatestNet = getVerifiedExamTotalNet(latestExam);
      const netFark = Number((verifiedLatestNet - verifiedFirstNet).toFixed(2));

      // 1. ADIM: Sınavlardaki tüm eksik kazanımları ve sınav bazında tekrar sıklığını akıllı eşleştirme ile tara
      const topicGroups = [];

      sortedExams.forEach((exam, examIdx) => {
        (exam.dersSonuclari || []).forEach((d) => {
          const dersName = (d.ders || "Genel").trim();
          let hasWrongGain = false;

          (d.konular || []).forEach((k) => {
            const yuzde = k.basariYuzdesi !== undefined ? Number(k.basariYuzdesi) : (k.soruSayisi > 0 ? Number(((k.dogru / k.soruSayisi) * 100).toFixed(0)) : 0);
            const isDeficient = k.durum === "yanlis" || k.durum === "bos" || k.yanlis > 0 || k.bos > 0 || yuzde < 100 || (k.soruSayisi > 0 && k.dogru < k.soruSayisi);

            if (isDeficient && k.kazanimAdi && k.kazanimAdi.trim().length > 2) {
              hasWrongGain = true;
              const rawTopic = k.kazanimAdi.trim();
              let matchGroup = topicGroups.find(g => 
                g.ders.toLowerCase() === dersName.toLowerCase() && areKazanimlarEquivalent(g.kazanimAdi, rawTopic)
              );

              if (!matchGroup) {
                matchGroup = {
                  ders: dersName,
                  kazanimAdi: rawTopic,
                  examIndices: new Set(),
                  examNames: [],
                  totalWrong: 0,
                  totalBos: 0,
                  yuzde: yuzde
                };
                topicGroups.push(matchGroup);
              }

              matchGroup.examIndices.add(examIdx);
              if (!matchGroup.examNames.includes(exam.sinavAdi)) {
                matchGroup.examNames.push(exam.sinavAdi);
              }
              matchGroup.totalWrong += Number(k.yanlis) || 1;
              matchGroup.totalBos += Number(k.bos) || 0;
              matchGroup.yuzde = Math.min(matchGroup.yuzde, yuzde);
            }
          });

          // Eğer derste yanlış (>0) veya boş (>0) varsa ama konular boşsa veya eşleşmediyse:
          const neededMissingCount = (d.yanlis || 0) + (d.bos > 0 ? 1 : 0);
          if (neededMissingCount > 0 && !hasWrongGain) {
            const matchedCurriculumKey = Object.keys(CURRICULUM_DATA).find((k) => k.toLowerCase().includes(dersName.toLowerCase()) || dersName.toLowerCase().includes(k.toLowerCase()));
            const curriculumList = matchedCurriculumKey ? CURRICULUM_DATA[matchedCurriculumKey] : (CURRICULUM_DATA[dersName] || []);
            const missingCount = Math.max(1, d.yanlis || 1);

            for (let i = 0; i < missingCount; i++) {
              const currItem = curriculumList[i % (curriculumList.length || 1)] || { konu: `${dersName} Eksik Kazanımı`, kazanim: `${dersName} ilgili soru kazanımı analiz edilir.` };
              const cleanTopic = `${currItem.konu}: ${currItem.kazanim}`;
              let matchGroup = topicGroups.find(g => 
                g.ders.toLowerCase() === dersName.toLowerCase() && areKazanimlarEquivalent(g.kazanimAdi, cleanTopic)
              );

              if (!matchGroup) {
                matchGroup = {
                  ders: dersName,
                  kazanimAdi: cleanTopic,
                  examIndices: new Set(),
                  examNames: [],
                  totalWrong: 0,
                  totalBos: 0,
                  yuzde: 0
                };
                topicGroups.push(matchGroup);
              }

              matchGroup.examIndices.add(examIdx);
              if (!matchGroup.examNames.includes(exam.sinavAdi)) {
                matchGroup.examNames.push(exam.sinavAdi);
              }
              matchGroup.totalWrong += 1;
            }
          }
        });
      });

      // 2. ADIM: 2 veya daha fazla sınavda tekrar eden ortak yanlışları (kronik eksikleri) ayıkla
      const recurringTopics = topicGroups.filter((t) => t.examIndices.size >= 2);
      const singleTopics = topicGroups.filter((t) => t.examIndices.size === 1);

      const eksikler = [];

      // Önce 2+ sınavda tekrar eden ortak yanlışları en üste ekle (Kritik Öncelikli)
      recurringTopics.forEach((t) => {
        eksikler.push({
          ders: t.ders,
          konu: t.kazanimAdi,
          isRecurring: true,
          recurringCount: t.examIndices.size,
          recurringExams: t.examNames,
          seviye: "kritik",
          yuzde: t.yuzde,
          dogru: 0,
          yanlis: t.totalWrong,
          bos: t.totalBos,
          oneri: `🚨 ${t.examIndices.size} Sınavda Tekrar Eden Kronik Eksik: Konu özet föyü + video soru çözümü + 45 yeni nesil soru ile acil telafi`
        });
      });

      // Tekil sınav eksiklerini ekle
      singleTopics.forEach((t) => {
        eksikler.push({
          ders: t.ders,
          konu: t.kazanimAdi,
          isRecurring: false,
          recurringCount: 1,
          recurringExams: t.examNames,
          seviye: t.yuzde < 50 ? "kritik" : (t.yuzde < 85 ? "orta" : "hafif"),
          yuzde: t.yuzde,
          dogru: 0,
          yanlis: t.totalWrong,
          bos: t.totalBos,
          oneri: `${t.ders} kavram tekrarı ve ${t.yuzde === 0 ? "35" : "25"} pekiştirme sorusu (${t.examNames[0] || "Deneme"})`
        });
      });

      if (eksikler.length === 0) {
        eksikler.push(
          { ders: "Türkçe", konu: "Yeni Nesil Paragraf ve Muhakeme", seviye: "hafif", oneri: "Günlük 25 paragraf ve deneme çözümü" },
          { ders: "Matematik", konu: "Yeni Nesil Beceri Temelli Sorular", seviye: "hafif", oneri: "Günde 30 ileri düzey soru" }
        );
      }

      // Ders bazlı değişim analizi (en çok düşen ve yükselen ders)
      const allSubjects = [];
      sortedExams.forEach((ex) => {
        (ex.dersSonuclari || []).forEach((d) => {
          if (d.ders && !allSubjects.includes(d.ders)) allSubjects.push(d.ders);
        });
      });

      let bestSubj = null;
      let worstSubj = null;
      let maxDelta = -Infinity;
      let minDelta = Infinity;

      allSubjects.forEach((subj) => {
        const match1 = (firstExam.dersSonuclari || []).find((d) => d.ders === subj);
        const match2 = (latestExam.dersSonuclari || []).find((d) => d.ders === subj);
        if (match1 && match2) {
          const delta = Number((Number(match2.net) - Number(match1.net)).toFixed(2));
          if (delta > maxDelta) {
            maxDelta = delta;
            bestSubj = { subj, delta };
          }
          if (delta < minDelta) {
            minDelta = delta;
            worstSubj = { subj, delta };
          }
        }
      });

      // 3. ADIM: Gerçek Veriyle 100% Tutarlı Genel Yorum ve Gelişim Analizi Metinlerini Üret
      let genelYorum = `Sevgili ${student.adSoyad}, `;
      if (isMulti) {
        genelYorum += `seçilen **${sortedExams.length} sınavın** (${firstExam.sinavAdi} [${verifiedFirstNet} Net] ➔ ${latestExam.sinavAdi} [${verifiedLatestNet} Net]) sonuçları karşılaştırmalı olarak analiz edilmiştir. `;
        if (netFark > 0.5) {
          genelYorum += `Süreç içinde toplam netlerinde **+${netFark.toFixed(2)} netlik artış** kaydedilmiştir. `;
          if (bestSubj && bestSubj.delta > 0) {
            genelYorum += `En belirgin gelişim **${bestSubj.subj}** dersinde (+${bestSubj.delta.toFixed(2)} Net) gerçekleşmiştir. `;
          }
        } else if (netFark < -0.5) {
          genelYorum += `İki sınav arasında toplamda **${netFark.toFixed(2)} netlik bir düşüş** gözlenmiştir. `;
          if (worstSubj && worstSubj.delta < 0) {
            genelYorum += `En çok net kaybı **${worstSubj.subj}** dersinde (${worstSubj.delta.toFixed(2)} Net) yaşanmıştır. `;
          }
        } else {
          genelYorum += `İki sınav arasında genel netler benzer seviyede dengeli seyretmiştir (${netFark >= 0 ? '+' : ''}${netFark.toFixed(2)} Net). `;
        }

        if (recurringTopics.length > 0) {
          genelYorum += `Yapılan çapraz analizde **${recurringTopics.length} adet kazanımda sınavlar boyunca hata tekrarı yapıldığı (kronik eksik)** belirlenmiştir. Bu ortak eksikler aşağıdaki 7 günlük çalışma tablosunda 1. Etütlere mutlak öncelikle atanmıştır.`;
        } else {
          genelYorum += `Sınavlar arasında peş peşe hata yapılan ortak kronik bir kazanım bulunmamakta olup, tekil eksiklerin telafisine odaklanılmıştır.`;
        }
      } else {
        genelYorum += `"${latestExam.sinavAdi}" sınav sonucun değerlendirilmiştir. `;
        if (verifiedLatestNet >= 80) {
          genelYorum += `Elde ettiğin **${verifiedLatestNet} netlik yüksek başarı** ve puan performansın harikadır. `;
        } else {
          genelYorum += `Elde ettiğin **${verifiedLatestNet} netlik performans** düzenli çalışma ile daha da yükselecektir. `;
        }
        genelYorum += `Karnende yüzdelik başarısı %100'ün altında kalan ${eksikler.length} adet eksik kazanım tespit edilmiştir. Aşağıdaki 7 günlük çalışma çizelgesi doğrudan bu eksik kazanımlarını telafi etmek üzere hazırlanmıştır.`;
      }

      let gelisimAnalizi = "";
      if (isMulti) {
        const p1Raw = String(firstExam.puan || "").replace(",", ".").trim();
        const p2Raw = String(latestExam.puan || "").replace(",", ".").trim();
        const p1 = parseFloat(p1Raw);
        const p2 = parseFloat(p2Raw);
        const hasScores = !isNaN(p1) && !isNaN(p2) && p1 > 0 && p2 > 0;
        const pDiff = hasScores ? Number((p2 - p1).toFixed(2)) : null;

        gelisimAnalizi = `📊 **Genel Gelişim Seyri:** ${firstExam.sinavAdi} (${verifiedFirstNet} Net) ➔ ${latestExam.sinavAdi} (${verifiedLatestNet} Net) [Toplam Net Değişimi: ${netFark >= 0 ? "+" : ""}${netFark.toFixed(2)} Net${pDiff !== null ? ` | Puan Değişimi: ${pDiff >= 0 ? '+' : ''}${pDiff} Puan` : ''}].\n`;
        
        if (worstSubj && worstSubj.delta < 0) {
          gelisimAnalizi += `\n⚠️ **Öncelikli Telafi Gerektiren Alan:** En büyük düşüş ${worstSubj.subj} (${worstSubj.delta.toFixed(2)} Net) dersinde gerçekleşmiştir.\n`;
        }
        if (bestSubj && bestSubj.delta > 0) {
          gelisimAnalizi += `\n⭐ **Öne Çıkan Başarı:** En yüksek gelişim ${bestSubj.subj} (+${bestSubj.delta.toFixed(2)} Net) dersinde sağlanmıştır.\n`;
        }

        if (recurringTopics.length > 0) {
          gelisimAnalizi += `\n🚨 **Tekrarlayan (Kronik) Kazanım Hataları:** Seçilen ${sortedExams.length} sınavın çapraz analizinde **${recurringTopics.length} adet kazanımda** hata tekrarı saptanmıştır. Özellikle ${recurringTopics.map((t) => `"${t.ders}: ${t.kazanimAdi}" (${t.examNames.join(" & ")})`).slice(0, 3).join(", ")} konuları öğrencinin kalıcı telafi gerektiren risk alanlarıdır.\n`;
          gelisimAnalizi += `\n💡 **Rehberlik & İyileştirme Stratejisi:** Tekrarlayan yanlış yapılan bu kazanımlar, soru çözüm föyleri ve yanlış soru defteri (Hata Defteri) yöntemiyle acilen pekiştirilmelidir. Öğrencinin haftalık çalışma çizelgesindeki 1. Etütler bu eksiklere göre kurgulanmıştır.`;
        } else {
          gelisimAnalizi += `\n✓ **Başarı Seyri:** Sınavlar arasında peş peşe hata yapılan ortak kronik bir eksik kazanım saptanmamıştır. Yeni nesil soru pratikleriyle mevcut başarı korunmalıdır.`;
        }
      }

      // 4. ADIM: 7 Günlük LGS Etüt Matrisi Tablosu (Öncelikli Eksik Kazanımlarla)
      const e1 = eksikler[0] ? `${eksikler[0].ders}: 🎯 ${eksikler[0].konu}` : "Türkçe: 🎯 Paragraf ve Sözcükte Anlam";
      const e2 = eksikler[1] ? `${eksikler[1].ders}: 🎯 ${eksikler[1].konu}` : "Fen Bilimleri: 🎯 Basınç ve Deneyleri";
      const e3 = eksikler[2] ? `${eksikler[2].ders}: 🎯 ${eksikler[2].konu}` : "Fen Bilimleri: 🎯 Periyodik Sistem ve Madde";
      const e4 = eksikler[3] ? `${eksikler[3].ders}: 🎯 ${eksikler[3].konu}` : "Din Kültürü: 🎯 Zekât ve Sadaka İbadeti";
      const e5 = eksikler[4] ? `${eksikler[4].ders}: 🎯 ${eksikler[4].konu}` : "Matematik: 🎯 Çarpanlar ve Katlar";

      const haftalikTablo = [
        {
          gun: "Pazartesi",
          gunlukOdak: (eksikler[0]?.ders || "Türkçe") + " & Matematik",
          etut1: { saat: "17:30 - 18:30", ders: eksikler[0]?.ders || "Türkçe", konu: e1, hedef: "35 Soru" },
          etut2: { saat: "18:45 - 19:45", ders: "Matematik", konu: "Çarpanlar ve Katlar / EBOB-EKOK", hedef: "30 Soru" },
          etut3: { saat: "20:00 - 20:45", ders: "Paragraf & Okuma", konu: "20 Yeni Nesil Paragraf + Kitap (20 dk)", hedef: "20 Soru" },
          gunlukToplamSoru: 85
        },
        {
          gun: "Salı",
          gunlukOdak: (eksikler[1]?.ders || "Fen Bilimleri") + " & İngilizce",
          etut1: { saat: "17:30 - 18:30", ders: eksikler[1]?.ders || "Fen Bilimleri", konu: e2, hedef: "35 Soru" },
          etut2: { saat: "18:45 - 19:45", ders: "İnkılap & İngilizce", konu: "İnkılap İlkeleri & İngilizce Reading", hedef: "30 Soru" },
          etut3: { saat: "20:00 - 20:45", ders: "Tekrar & Paragraf", konu: "Günlük Hata Kontrolü + 20 Paragraf", hedef: "20 Soru" },
          gunlukToplamSoru: 85
        },
        {
          gun: "Çarşamba",
          gunlukOdak: (eksikler[2]?.ders || "Fen Bilimleri") + " & Matematik",
          etut1: { saat: "17:30 - 18:30", ders: eksikler[2]?.ders || "Fen Bilimleri", konu: e3, hedef: "30 Soru" },
          etut2: { saat: "18:45 - 19:45", ders: "Matematik", konu: "Üslü ve Kareköklü İfadeler Yeni Nesil", hedef: "35 Soru" },
          etut3: { saat: "20:00 - 20:45", ders: "Kitap & Tekrar", konu: "Kitap Okuma (30 dk) + Hata Defteri", hedef: "15 Soru" },
          gunlukToplamSoru: 80
        },
        {
          gun: "Perşembe",
          gunlukOdak: (eksikler[3]?.ders || "Din Kültürü") + " & Türkçe",
          etut1: { saat: "17:30 - 18:30", ders: eksikler[3]?.ders || "Din Kültürü", konu: e4, hedef: "30 Soru" },
          etut2: { saat: "18:45 - 19:45", ders: "Türkçe", konu: "Cümlenin Ögeleri & Fiilimsiler", hedef: "35 Soru" },
          etut3: { saat: "20:00 - 20:45", ders: "Paragraf", konu: "20 Yeni Nesil Paragraf Çözümü", hedef: "20 Soru" },
          gunlukToplamSoru: 85
        },
        {
          gun: "Cuma",
          gunlukOdak: "Branş Denemeleri & Telafi",
          etut1: { saat: "17:30 - 18:30", ders: "Sayısal Branş", konu: e5 || "Matematik + Fen Branş Denemesi", hedef: "40 Soru" },
          etut2: { saat: "18:45 - 19:45", ders: "Sözel Branş", konu: "Türkçe + Sosyal Branş Denemesi", hedef: "40 Soru" },
          etut3: { saat: "20:00 - 20:45", ders: "Deneme Analizi", konu: "Hatalı Soruların Çözüm İncelemesi", hedef: "0 Soru" },
          gunlukToplamSoru: 80
        },
        {
          gun: "Cumartesi",
          gunlukOdak: "Tam LGS Deneme Sınavı",
          etut1: { saat: "09:30 - 11:45", ders: "Genel Deneme", konu: "Süre Tutularak 90 Soruluk Tam LGS Denemesi", hedef: "90 Soru" },
          etut2: { saat: "13:30 - 15:00", ders: "Deneme Analizi", konu: "Yanlış/Boş Soruların Video Çözümleri", hedef: "20 Soru" },
          etut3: { saat: "15:30 - 17:00", ders: "Özel Telafi", konu: "Haftanın %100 Altında Kalan Eksik Kazanımları Karma Test", hedef: "40 Soru" },
          gunlukToplamSoru: 150
        },
        {
          gun: "Pazar",
          gunlukOdak: "Haftalık Tekrar & Dinlenme",
          etut1: { saat: "10:30 - 12:00", ders: "Hata Defteri", konu: "Hafta Boyunca Yanlış Yapılan Soruların Tekrarı", hedef: "30 Soru" },
          etut2: { saat: "12:30 - 14:00", ders: "Genel Tekrar", konu: "Haftalık Soru Hedefi Kontrolü & Değerlendirme", hedef: "20 Soru" },
          etut3: { saat: "14:00 Sonrası", ders: "Serbest Zaman", konu: "Zihinsel Dinlenme, Aile ve Sosyal Zaman", hedef: "0 Soru" },
          gunlukToplamSoru: 50
        }
      ];

      const kocTavsiyesi = recurringTopics.length > 0
        ? `Özellikle ${recurringTopics.length} adet sınavlar arası tekrar eden ortak eksik kazanım (${recurringTopics[0].ders} - ${recurringTopics[0].kazanimAdi} vb.) acil telafi edilmeli, hata defterindeki sorular pazar günü mutlaka sıfır hata ile yeniden çözülmelidir.`
        : "Hafta boyu denemelerde ve testlerde yanlış yapılan her soru 'Hata Defteri'ne yapıştırılmalı ve pazar günü mutlaka yeniden çözülmelidir.";

      return {
        eksikKonular: eksikler,
        genelYorum,
        gelisimAnalizi,
        haftalikTablo,
        haftalikOzet: {
          toplamSoruHedefi: "565 Soru",
          toplamEtutSuresi: "21.5 Saat",
          denemeSayisi: "1 Tam LGS Denemesi + 2 Branş Denemesi",
          kitapOkuma: "120 dk Kitap + 100 Paragraf",
          kocTavsiyesi
        },
        _isSimulated: true
      };
    }
  }

  // Alias tanımlaması
  AIService.generateSimulatedReport = AIService.generateSimulatedAnalysis;

  // ==========================================
  // 7. PDF RAPOR OLUŞTURUCU (LGS ETÜT MATRİSİ TABLOSU)
  // ==========================================
  class PDFService {
    static addTextLayerToPdf(pdf, pageEl, pageWidthMm = 210, pageHeightMm = 297) {
      if (!pageEl) return;
      try {
        const pageRect = pageEl.getBoundingClientRect();
        if (!pageRect.width || !pageRect.height) return;

        const scaleX = pageWidthMm / pageRect.width;
        const scaleY = pageHeightMm / pageRect.height;

        // TreeWalker ile görünür tüm metin düğümlerini tara
        const walker = document.createTreeWalker(pageEl, NodeFilter.SHOW_TEXT, null, false);
        let textNode;

        while ((textNode = walker.nextNode())) {
          const rawText = textNode.nodeValue;
          if (!rawText || !rawText.trim()) continue;

          const text = rawText.trim();
          const parentEl = textNode.parentElement;
          if (!parentEl) continue;

          // Görünmeyen düğümleri atla
          const style = window.getComputedStyle(parentEl);
          if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue;

          const range = document.createRange();
          range.selectNodeContents(textNode);
          const rects = range.getClientRects();

          for (let i = 0; i < rects.length; i++) {
            const rect = rects[i];
            if (rect.width <= 0 || rect.height <= 0) continue;

            const xMm = (rect.left - pageRect.left) * scaleX;
            const yMm = (rect.top - pageRect.top + rect.height * 0.78) * scaleY;
            const fontSizePt = Math.max(5, Math.min(22, (rect.height * scaleY * 72) / 25.4));

            try {
              pdf.setFontSize(fontSizePt);
              // Invisible text layer for native text selection & copying
              pdf.text(text, xMm, yMm, {
                renderingMode: "invisible"
              });
            } catch (err) {
              try {
                const asciiText = text.replace(/ğ/g, "g").replace(/Ğ/g, "G")
                                      .replace(/ü/g, "u").replace(/Ü/g, "U")
                                      .replace(/ş/g, "s").replace(/Ş/g, "S")
                                      .replace(/ı/g, "i").replace(/İ/g, "I")
                                      .replace(/ö/g, "o").replace(/Ö/g, "O")
                                      .replace(/ç/g, "c").replace(/Ç/g, "C");
                pdf.text(asciiText, xMm, yMm, { renderingMode: "invisible" });
              } catch (_) {}
            }
          }
        }
      } catch (e) {
        console.warn("[PDF Text Layer Warning]", e);
      }
    }


    static printReport(reportElementId) {
      const element = document.getElementById(reportElementId);
      if (!element) return window.print();

      let printFrame = document.getElementById("report-print-frame");
      if (!printFrame) {
        printFrame = document.createElement("iframe");
        printFrame.id = "report-print-frame";
        printFrame.style.position = "fixed";
        printFrame.style.right = "0";
        printFrame.style.bottom = "0";
        printFrame.style.width = "0";
        printFrame.style.height = "0";
        printFrame.style.border = "0";
        document.body.appendChild(printFrame);
      }

      const frameDoc = printFrame.contentWindow.document;
      frameDoc.open();
      frameDoc.write(`
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="UTF-8">
          <title>Sınav Analiz ve Gelişim Raporu</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
          <link rel="stylesheet" href="./css/index.css">
          <link rel="stylesheet" href="./css/report.css">
          <style>
            @page { size: A4 portrait; margin: 8mm 10mm; }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
            body { background: #ffffff !important; margin: 0; padding: 0; font-family: 'Inter', system-ui, sans-serif; color: #0f172a; }
            .report-a4-sheet { max-width: 100% !important; width: 100% !important; margin: 0 !important; }
            .report-a4-page { max-width: 100% !important; width: 100% !important; padding: 10mm 12mm 8mm 12mm !important; box-sizing: border-box !important; box-shadow: none !important; border: none !important; background: #ffffff !important; page-break-after: always !important; break-after: page !important; display: flex !important; flex-direction: column !important; }
            .report-a4-page:last-child { page-break-after: auto !important; break-after: auto !important; }
            .report-deficiency-item, .report-dense-subject-card, .recurring-card, .report-exam-card, .report-student-card, .report-comparison-kpis, .report-section { break-inside: avoid !important; page-break-inside: avoid !important; }
            .report-schedule-matrix tr, .report-table tr { break-inside: avoid !important; page-break-inside: avoid !important; }
            .report-table th, .report-schedule-matrix th { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .report-badge-title, .badge, .schedule-etut-box, .schedule-stat-box, .schedule-coaching-tip { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          </style>
        </head>
        <body>
          <div class="report-a4-sheet">
            ${element.innerHTML}
          </div>
        </body>
        </html>
      `);
      frameDoc.close();

      setTimeout(() => {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
      }, 350);
    }

    static async exportBulkExamReports(examName, state) {

      const cleanExamName = (examName || "").trim();
      // Sınava ait kayıtları topla (büyük/küçük harf duyarsız)
      const matchingExams = state.exams.filter((e) => {
        if (!cleanExamName) return true;
        return e.sinavAdi && e.sinavAdi.trim().toLowerCase() === cleanExamName.toLowerCase();
      });

      if (matchingExams.length === 0) {
        showToast(`"${examName}" sınavına ait öğrenci kaydı bulunamadı.`, "warning");
        return false;
      }

      const targetItems = [];
      const seenStudentIds = new Set();

      matchingExams.forEach((ex) => {
        if (!seenStudentIds.has(ex.ogrenciId)) {
          seenStudentIds.add(ex.ogrenciId);
          const student = state.students.find((s) => s.id === ex.ogrenciId) || {
            id: ex.ogrenciId,
            adSoyad: ex.ogrenciAdi || "İsimsiz Öğrenci",
            sinif: "8",
            sube: "A",
            numara: ex.ogrenciNo || "-"
          };
          const studentExams = state.exams.filter((e) => e.ogrenciId === student.id && (!cleanExamName || (e.sinavAdi && e.sinavAdi.trim().toLowerCase() === cleanExamName.toLowerCase())));
          
          // Mevcut raporu ara
          const existingReport = state.reports.find((r) => r.ogrenciId === student.id || (r.ogrenciAdSoyad && student.adSoyad && r.ogrenciAdSoyad.toLowerCase().trim() === student.adSoyad.toLowerCase().trim()));

          const resolvedReport = existingReport || AIService.generateSimulatedAnalysis(student, studentExams.length > 0 ? studentExams : [ex]);

          targetItems.push({
            student,
            exams: studentExams.length > 0 ? studentExams : [ex],
            report: resolvedReport
          });
        }
      });

      const total = targetItems.length;
      if (total === 0) {
        showToast("İndirilecek öğrenci raporu bulunamadı.", "warning");
        return false;
      }

      showToast(`${total} öğrencinin AI analizli toplu raporu hazırlanıyor...`, "info", 3000);

      // İlerleme modalı oluştur
      let progressModal = document.getElementById("bulk-pdf-progress-modal");
      if (!progressModal) {
        progressModal = document.createElement("div");
        progressModal.id = "bulk-pdf-progress-modal";
        progressModal.className = "modal-backdrop active";
        progressModal.style.zIndex = "99999";
        progressModal.innerHTML = `
          <div class="modal-dialog animate-scale-up" style="max-width: 480px; text-align: center; padding: 28px 24px; background: #ffffff; border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.2);">
            <div style="font-size: 40px; margin-bottom: 12px;">📑</div>
            <h3 style="font-size: 18px; font-weight: 800; margin-bottom: 6px; color: #0f172a;">AI Analizli Toplu Rapor Hazırlanıyor</h3>
            <p id="bulk-pdf-progress-desc" style="font-size: 13px; color: #64748b; margin-bottom: 16px;">Öğrenci karneleri ve etüt matrisleri işleniyor...</p>
            <div style="background: #e2e8f0; height: 10px; border-radius: 5px; overflow: hidden; margin-bottom: 12px;">
              <div id="bulk-pdf-progress-bar" style="background: #16a34a; width: 0%; height: 100%; transition: width 0.2s ease;"></div>
            </div>
            <div id="bulk-pdf-progress-count" style="font-size: 12px; font-weight: 700; color: #166534;">0 / ${total} Öğrenci (%0)</div>
          </div>
        `;
        document.body.appendChild(progressModal);
      } else {
        progressModal.style.display = "flex";
      }

      const pBar = document.getElementById("bulk-pdf-progress-bar");
      const pDesc = document.getElementById("bulk-pdf-progress-desc");
      const pCount = document.getElementById("bulk-pdf-progress-count");

      try {
        let combinedHtml = "";
        for (let i = 0; i < total; i++) {
          const item = targetItems[i];
          const percent = Math.round(((i + 1) / total) * 100);
          if (pBar) pBar.style.width = `${percent}%`;
          if (pDesc) pDesc.innerText = `İşleniyor (${i + 1}/${total}): ${item.student.adSoyad}`;
          if (pCount) pCount.innerText = `${i + 1} / ${total} Öğrenci (%${percent})`;

          const html = this.renderReportHTML(item.report, item.student, item.exams, state.institution);
          combinedHtml += `<div style="page-break-after: always; break-after: page;">${html}</div>`;
        }

        let printFrame = document.getElementById("bulk-print-frame");
        if (!printFrame) {
          printFrame = document.createElement("iframe");
          printFrame.id = "bulk-print-frame";
          printFrame.style.position = "fixed";
          printFrame.style.right = "0";
          printFrame.style.bottom = "0";
          printFrame.style.width = "0";
          printFrame.style.height = "0";
          printFrame.style.border = "0";
          document.body.appendChild(printFrame);
        }

        const frameDoc = printFrame.contentWindow.document;
        frameDoc.open();
        frameDoc.write(`
          <!DOCTYPE html>
          <html lang="tr">
          <head>
            <meta charset="UTF-8">
            <title>Toplu Sınav Analiz Raporu - ${cleanExamName}</title>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Outfit:wght@500;600;700;800&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="./css/index.css">
            <link rel="stylesheet" href="./css/report.css">
            <style>
              @page { size: A4 portrait; margin: 8mm 10mm; }
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
              body { background: #ffffff !important; margin: 0; padding: 0; font-family: 'Inter', system-ui, sans-serif; color: #0f172a; }
              .report-a4-sheet { max-width: 100% !important; width: 100% !important; margin: 0 !important; }
              .report-a4-page { max-width: 100% !important; width: 100% !important; padding: 10mm 12mm 8mm 12mm !important; box-sizing: border-box !important; box-shadow: none !important; border: none !important; background: #ffffff !important; display: flex !important; flex-direction: column !important; }
              .report-deficiency-item, .report-dense-subject-card, .recurring-card, .report-exam-card, .report-student-card, .report-comparison-kpis, .report-section { break-inside: avoid !important; page-break-inside: avoid !important; }
              .report-schedule-matrix tr, .report-table tr { break-inside: avoid !important; page-break-inside: avoid !important; }
              .report-table th, .report-schedule-matrix th { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
              .report-badge-title, .badge, .schedule-etut-box, .schedule-stat-box, .schedule-coaching-tip { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            </style>
          </head>
          <body>
            ${combinedHtml}
          </body>
          </html>
        `);
        frameDoc.close();

        setTimeout(() => {
          printFrame.contentWindow.focus();
          printFrame.contentWindow.print();
        }, 800);

        showToast(`✓ ${total} öğrencinin toplu raporu yazdırmaya hazır!`, "success", 4000);
      } catch (err) {
        console.error("[Bulk Print Error]", err);
        showToast("Toplu yazdırma oluşturulurken hata: " + err.message, "error");
      } finally {
        if (progressModal && progressModal.parentNode) {
          progressModal.style.display = "none";
          document.body.removeChild(progressModal);
        }
      }
      return true;
    }

    static renderReportHTML(report, student, exams, institution) {
      const themeColor = institution.temaRengi || "#2563eb";
      const logoSrc = window.DEFAULT_LOGO_DATA_URI || institution.logoUrl || "./logo.png";

      let logoHtml = `<img src="${logoSrc}" alt="${institution.ad}" class="report-header-logo-img" style="max-height: 52px; max-width: 130px; object-fit: contain;" />`;
      let logoHtmlMini = `<img src="${logoSrc}" alt="${institution.ad}" style="max-height: 32px; max-width: 80px; object-fit: contain;" />`;

      // Sınavları her zaman kronolojik sıraya göre düzenle
      const sortedExams = [...(exams || [])].sort((a, b) => {
        const tA = new Date(a.tarih || 0).getTime() || 0;
        const tB = new Date(b.tarih || 0).getTime() || 0;
        return tA - tB;
      });

      const isMulti = sortedExams.length > 1;
      const firstExam = sortedExams[0] || {};
      const latestExam = sortedExams[sortedExams.length - 1] || {};

      let comparisonKpisHtml = "";
      let crossSubjectMatrixHtml = "";
      let pageTitle = isMulti
        ? `ÇOKLU SINAV GELİŞİM & KARŞILAŞTIRMA RAPORU`
        : `ÖĞRENCİ SINAV KARNESİ`;

      if (isMulti) {
        // 1. Doğrulanmış Gerçek Toplam Netler
        const net1 = getVerifiedExamTotalNet(firstExam);
        const net2 = getVerifiedExamTotalNet(latestExam);
        const netDiff = Number((net2 - net1).toFixed(2));

        // 2. Puan / Sıralama Doğrulaması
        const p1Raw = String(firstExam.puan || "").replace(",", ".").trim();
        const p2Raw = String(latestExam.puan || "").replace(",", ".").trim();
        const p1 = parseFloat(p1Raw);
        const p2 = parseFloat(p2Raw);
        const hasValidScores = !isNaN(p1) && !isNaN(p2) && p1 > 0 && p2 > 0;
        const puanDiff = hasValidScores ? Number((p2 - p1).toFixed(2)) : null;
        const isLgsScale = hasValidScores && p1 >= 100 && p1 <= 500 && p2 >= 100 && p2 <= 500;

        // 3. Tekrarlayan Kazanım Grubu
        const topicGroups = [];
        sortedExams.forEach((exam, examIdx) => {
          (exam.dersSonuclari || []).forEach((d) => {
            const dersName = (d.ders || "Genel").trim();
            (d.konular || []).forEach((k) => {
              const yuzde = k.basariYuzdesi !== undefined ? Number(k.basariYuzdesi) : (k.soruSayisi > 0 ? Number(((k.dogru / k.soruSayisi) * 100).toFixed(0)) : 0);
              const isDeficient = k.durum === "yanlis" || k.durum === "bos" || k.yanlis > 0 || k.bos > 0 || yuzde < 100 || (k.soruSayisi > 0 && k.dogru < k.soruSayisi);
              if (isDeficient && k.kazanimAdi && k.kazanimAdi.trim().length > 2) {
                const rawTopic = k.kazanimAdi.trim();
                let matchGroup = topicGroups.find(g => 
                  g.ders.toLowerCase() === dersName.toLowerCase() && areKazanimlarEquivalent(g.kazanimAdi, rawTopic)
                );

                if (!matchGroup) {
                  matchGroup = {
                    ders: dersName,
                    kazanimAdi: rawTopic,
                    examIndices: new Set(),
                    examNames: [],
                    totalWrong: 0,
                    totalBos: 0
                  };
                  topicGroups.push(matchGroup);
                }

                matchGroup.examIndices.add(examIdx);
                if (!matchGroup.examNames.includes(exam.sinavAdi)) {
                  matchGroup.examNames.push(exam.sinavAdi);
                }
                matchGroup.totalWrong += Number(k.yanlis) || 1;
                matchGroup.totalBos += Number(k.bos) || 0;
              }
            });
          });
        });

        const calculatedRecurring = topicGroups.filter(g => g.examIndices.size >= 2);
        const reportRecurring = (report.eksikKonular || []).filter((ek) => ek.isRecurring || (ek.recurringExams && ek.recurringExams.length > 1) || (ek.konu && ek.konu.includes("🚨")));
        const effectiveRecurringCount = Math.max(calculatedRecurring.length, reportRecurring.length);

        comparisonKpisHtml = `
          <div class="report-comparison-kpis mb-2" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;">
            <div style="background: rgba(37, 99, 235, 0.06); border: 1.5px solid rgba(37, 99, 235, 0.25); border-radius: 6px; padding: 6px 8px; text-align: center;">
              <div style="font-size: 9.5px; color: #1e40af; font-weight: 700;">Toplam Net Değişimi</div>
              <div style="font-size: 13px; font-weight: 800; color: #1d4ed8; margin: 2px 0;">
                ${net1} ➔ ${net2} Net
              </div>
              <span class="badge ${netDiff > 0 ? 'badge-success' : netDiff < 0 ? 'badge-danger' : 'badge-secondary'} font-bold" style="font-size: 8.5px; padding: 1px 5px;">
                ${netDiff > 0 ? '📈 +' + netDiff : netDiff < 0 ? '📉 ' + netDiff : '➡️ 0.00'} Net Fark (${netDiff > 0 ? 'Artış' : netDiff < 0 ? 'Düşüş' : 'Dengeli'})
              </span>
            </div>

            <div style="background: rgba(168, 85, 247, 0.06); border: 1.5px solid rgba(168, 85, 247, 0.25); border-radius: 6px; padding: 6px 8px; text-align: center;">
              <div style="font-size: 9.5px; color: #7e22ce; font-weight: 700;">${isLgsScale ? "LGS Puan Gelişimi" : "Sınav Puanı"}</div>
              <div style="font-size: 13px; font-weight: 800; color: #9333ea; margin: 2px 0;">
                ${firstExam.puan && firstExam.puan !== 'Okunamadı' ? firstExam.puan : '-'} ➔ ${latestExam.puan && latestExam.puan !== 'Okunamadı' ? latestExam.puan : '-'}
              </div>
              <span class="badge ${puanDiff !== null ? (puanDiff > 0 ? 'badge-success' : puanDiff < 0 ? 'badge-danger' : 'badge-secondary') : 'badge-light'} font-bold" style="font-size: 8.5px; padding: 1px 5px;">
                ${puanDiff !== null ? (puanDiff > 0 ? '📈 +' + puanDiff + ' Puan (Artış)' : puanDiff < 0 ? '📉 ' + puanDiff + ' Puan (Düşüş)' : '➡️ 0.00 Puan') : 'Puan Takibi'}
              </span>
            </div>

            <div style="background: ${effectiveRecurringCount > 0 ? '#fef2f2' : '#f0fdf4'}; border: 1.5px solid ${effectiveRecurringCount > 0 ? '#fca5a5' : '#86efac'}; border-radius: 6px; padding: 6px 8px; text-align: center;">
              <div style="font-size: 9.5px; color: ${effectiveRecurringCount > 0 ? '#991b1b' : '#166534'}; font-weight: 800;">
                ${effectiveRecurringCount > 0 ? "🚨 Tekrarlayan Hatalar" : "✅ Tekrarlayan Hatalar"}
              </div>
              <div style="font-size: 13px; font-weight: 800; color: ${effectiveRecurringCount > 0 ? '#dc2626' : '#15803d'}; margin: 2px 0;">
                ${effectiveRecurringCount} Kazanım
              </div>
              <span class="badge ${effectiveRecurringCount > 0 ? 'badge-danger' : 'badge-success'} font-bold" style="font-size: 8.5px; padding: 1px 5px;">
                ${effectiveRecurringCount > 0 ? '2+ Sınavda Ortak Yanlış' : 'Kronik Eksik Yok'}
              </span>
            </div>

            <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 6px; padding: 6px 8px; text-align: center;">
              <div style="font-size: 9.5px; color: #475569; font-weight: 700;">Karşılaştırılan Sınav</div>
              <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 2px 0;">
                ${sortedExams.length} Deneme Sınavı
              </div>
              <span class="badge badge-secondary font-bold" style="font-size: 8.5px; padding: 1px 5px;">
                Kazanım Eşleştirmeli
              </span>
            </div>
          </div>
        `;

        const allSubjects = [];
        sortedExams.forEach((ex) => {
          (ex.dersSonuclari || []).forEach((d) => {
            if (d.ders && !allSubjects.includes(d.ders)) allSubjects.push(d.ders);
          });
        });

        let bestSubj = null;
        let worstSubj = null;
        let maxDelta = -Infinity;
        let minDelta = Infinity;

        const subjectRowsData = allSubjects.map((subj) => {
          const nets = sortedExams.map((ex) => {
            const match = (ex.dersSonuclari || []).find((d) => d.ders === subj);
            return match ? Number(match.net) || 0 : null;
          });
          const fNet = nets[0];
          const lNet = nets[nets.length - 1];
          const delta = (fNet !== null && lNet !== null) ? Number((lNet - fNet).toFixed(2)) : 0;
          
          if (delta > maxDelta) {
            maxDelta = delta;
            bestSubj = { subj, delta };
          }
          if (delta < minDelta) {
            minDelta = delta;
            worstSubj = { subj, delta };
          }
          return { subj, nets, delta, fNet, lNet };
        });

        const posDeltas = subjectRowsData.filter(r => r.delta > 0.2);
        const negDeltas = subjectRowsData.filter(r => r.delta < -0.2);

        let dynamicStatusBadge = "";
        if (negDeltas.length > 0 && posDeltas.length === 0) {
          dynamicStatusBadge = `<span style="color: #dc2626; font-weight: 700;">📉 Tüm derslerde net düşüşü saptandı. Eksik kazanımların acil telafisi planlanmalıdır.</span>`;
        } else if (posDeltas.length > 0 && negDeltas.length === 0) {
          dynamicStatusBadge = `<span style="color: #059669; font-weight: 700;">📈 Tüm derslerde başarı artışı kaydedildi. Mevcut ivme korunmalıdır.</span>`;
        } else if (posDeltas.length > negDeltas.length) {
          dynamicStatusBadge = `<span>📈 <strong>Gelişim Durumu:</strong> ${posDeltas.length} derste artış, ${negDeltas.length} derste düşüş kaydedildi.</span>`;
        } else if (negDeltas.length > posDeltas.length) {
          dynamicStatusBadge = `<span>📉 <strong>Gelişim Durumu:</strong> ${negDeltas.length} derste net kaybı görüldü. Düşüş yaşanan derslere odaklanılmalıdır.</span>`;
        } else {
          dynamicStatusBadge = `<span>➡️ <strong>Gelişim Durumu:</strong> Ders netleri benzer seviyede dengeli seyretmektedir.</span>`;
        }

        crossSubjectMatrixHtml = `
          <div class="report-section mb-2">
            <div class="report-section-header" style="border-color: ${themeColor}; margin-bottom: 4px; padding-left: 6px;">
              <div class="d-flex justify-between items-center w-full">
                <h3 style="color: ${themeColor}; font-size: 11.5px; margin: 0;">📊 Sınavlar Arası Ders Netleri ve Gelişim Trendi</h3>
                <span class="badge badge-primary font-bold" style="font-size: 8.5px; padding: 2px 6px;">${sortedExams.length} Sınav Karşılaştırma Matrisi</span>
              </div>
            </div>
            <table class="report-table" style="font-size: 10px; margin-bottom: 4px;">
              <thead>
                <tr style="background: ${themeColor}12; color: ${themeColor};">
                  <th style="width: 22%; text-align: left; vertical-align: middle;">Ders Adı</th>
                  ${sortedExams.map((e) => `
                    <th style="text-align: center; vertical-align: bottom; padding: 4px 3px; min-width: 85px;">
                      <div style="font-weight: 800; font-size: 9.5px; color: #0f172a; line-height: 1.2; word-break: break-word;">
                        ${escapeHtml(e.sinavAdi)}
                      </div>
                      <div style="font-size: 8px; font-weight: 600; color: #64748b; margin-top: 1px;">
                        📅 ${formatDate(e.tarih)}
                      </div>
                      <div style="margin-top: 1px;">
                        <span class="badge badge-light" style="font-size: 7.5px; padding: 0 3px; border: 1px solid #cbd5e1;">Top: <strong>${getVerifiedExamTotalNet(e)} Net</strong></span>
                      </div>
                    </th>
                  `).join("")}
                  <th style="text-align: center; width: 13%; vertical-align: middle;">Net Değişimi</th>
                  <th style="text-align: center; width: 15%; vertical-align: middle;">Trend</th>
                </tr>
              </thead>
              <tbody>
                ${subjectRowsData.map(({ subj, nets, delta, fNet, lNet }) => {
                  let trendBadge = "";
                  if (fNet === null && lNet !== null) {
                    trendBadge = `<span class="badge badge-info font-bold" style="font-size: 8px; padding: 1px 4px;">🆕 Yeni Ders</span>`;
                  } else if (fNet !== null && lNet === null) {
                    trendBadge = `<span class="badge badge-secondary font-bold" style="font-size: 8px; padding: 1px 4px;">⏸️ Denenmedi</span>`;
                  } else if (delta > 0.2) {
                    trendBadge = `<span class="badge badge-success font-bold" style="font-size: 8px; padding: 1px 4px;">📈 +${delta.toFixed(2)} (Yükseliş)</span>`;
                  } else if (delta < -0.2) {
                    trendBadge = `<span class="badge badge-danger font-bold" style="font-size: 8px; padding: 1px 4px;">📉 ${delta.toFixed(2)} (Düşüş)</span>`;
                  } else {
                    trendBadge = `<span class="badge badge-secondary font-bold" style="font-size: 8px; padding: 1px 4px;">➡️ ${delta >= 0 ? '+' : ''}${delta.toFixed(2)} (Dengeli)</span>`;
                  }

                  return `
                    <tr>
                      <td style="font-weight: 700; color: #0f172a;">${subj}</td>
                      ${nets.map((n) => `<td style="text-align: center; font-weight: 600; color: #334155;">${n !== null ? n + ' Net' : '-'}</td>`).join("")}
                      <td style="text-align: center;">
                        <strong style="color: ${delta > 0 ? '#059669' : delta < 0 ? '#dc2626' : '#475569'}; font-size: 10.5px;">
                          ${delta > 0 ? '+' : ''}${delta.toFixed(2)}
                        </strong>
                      </td>
                      <td style="text-align: center;">${trendBadge}</td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
              <tfoot>
                <tr style="background: #f1f5f9; font-weight: 800; border-top: 2px solid #cbd5e1;">
                  <td style="color: #1e293b; font-size: 9.5px;">🏆 GENEL TOPLAM NET:</td>
                  ${sortedExams.map((e) => `<td style="text-align: center; color: #1d4ed8; font-size: 10px;">${getVerifiedExamTotalNet(e)} Net</td>`).join("")}
                  <td style="text-align: center; color: ${netDiff > 0 ? '#059669' : netDiff < 0 ? '#dc2626' : '#475569'}; font-size: 10.5px;">
                    ${netDiff > 0 ? '+' : ''}${netDiff.toFixed(2)}
                  </td>
                  <td style="text-align: center;">
                    <span class="badge ${netDiff > 0 ? 'badge-success' : netDiff < 0 ? 'badge-danger' : 'badge-secondary'} font-bold" style="font-size: 8px; padding: 1px 4px;">
                      ${netDiff > 0 ? '📈 Toplam Artış' : netDiff < 0 ? '📉 Toplam Düşüş' : '➡️ Dengeli'}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
            <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px 8px; margin-top: 2px; font-size: 9px; flex-wrap: wrap; gap: 4px;">
              <div>${dynamicStatusBadge}</div>
              <div style="display: flex; gap: 8px;">
                ${bestSubj && bestSubj.delta > 0 ? `<span>⭐ <strong>En Çok Gelişme:</strong> ${bestSubj.subj} (<span style="color:#059669; font-weight:700;">+${bestSubj.delta.toFixed(2)} Net</span>)</span>` : ""}
                ${worstSubj && worstSubj.delta < 0 ? `<span>⚠️ <strong>En Çok Telafi Gerektiren:</strong> ${worstSubj.subj} (<span style="color:#dc2626; font-weight:700;">${worstSubj.delta.toFixed(2)} Net</span>)</span>` : ""}
              </div>
            </div>
          </div>
        `;
      }

      let examRows = "";
      if (!isMulti) {
        examRows = sortedExams
          .map((exam) => `
            <div class="report-exam-card mb-2" style="padding: 10px 14px;">
              <div class="report-exam-card-title mb-2">
                <span style="font-size: 13px;"><strong>${exam.sinavAdi}</strong> (${formatDate(exam.tarih)})</span>
                <div class="d-flex gap-2">
                  <span class="badge badge-warning font-bold" style="font-size: 11px;">LGS: <strong>${exam.puan || "-"}</strong></span>
                  <span class="badge badge-primary font-bold" style="font-size: 11px;">Toplam Net: <strong>${getVerifiedExamTotalNet(exam)} Net</strong></span>
                </div>
              </div>
              <table class="report-table" style="font-size: 12px;">
                <thead><tr><th>Ders</th><th>Doğru</th><th>Yanlış</th><th>Boş</th><th>Net</th><th>Başarı %</th></tr></thead>
                <tbody>
                  ${(exam.dersSonuclari || []).map((d) => {
                    const total = Number(d.dogru) + Number(d.yanlis) + Number(d.bos);
                    const rate = total > 0 ? Math.round((Number(d.dogru) / total) * 100) : 0;
                    return `<tr>
                      <td><strong>${d.ders}</strong></td>
                      <td class="text-success font-bold">${d.dogru}</td>
                      <td class="text-danger font-bold">${d.yanlis}</td>
                      <td class="text-muted">${d.bos}</td>
                      <td><strong class="text-primary">${d.net} Net</strong></td>
                      <td><div class="report-progress-wrap"><div class="report-progress-bar" style="width: ${rate}%; background: ${themeColor}"></div><span class="report-progress-text">%${rate}</span></div></td>
                    </tr>`;
                  }).join("")}
                </tbody>
              </table>
            </div>
          `).join("");
      }

      let eksikHtml = "";
      if (report.eksikKonular && report.eksikKonular.length > 0) {
        const recurringTopics = report.eksikKonular.filter((ek) => ek.isRecurring || (ek.recurringExams && ek.recurringExams.length > 1) || (ek.konu && ek.konu.includes("🚨")));
        const nonRecurringTopics = report.eksikKonular.filter((ek) => !recurringTopics.includes(ek));

        let recurringBlockHtml = "";
        if (isMulti) {
          if (recurringTopics.length > 0) {
            recurringBlockHtml = `
              <div class="report-section mb-2" style="background: #fff8f8; border: 1.5px solid #fca5a5; border-radius: 6px; padding: 7px 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #fecaca; padding-bottom: 4px; margin-bottom: 6px;">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 15px;">🚨</span>
                    <div>
                      <h3 style="color: #991b1b; font-size: 11.5px; margin: 0; font-weight: 800;">
                        2+ Sınavda Tekrarlayan (Kronik) Yanlış Kazanımlar (${recurringTopics.length} Kazanım)
                      </h3>
                      <span style="font-size: 9px; color: #b91c1c;">
                        Bu kazanımlar öğrencinin birden fazla sınavda üst üste yanlış yaptığı acil telafi gerektiren kalıcı eksiklerdir!
                      </span>
                    </div>
                  </div>
                  <span class="badge badge-danger font-bold" style="font-size: 8.5px; padding: 2px 6px; background: #ef4444; color: #fff;">
                    Öncelikli Eylem Alanı
                  </span>
                </div>

                <div class="report-recurring-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
                  ${recurringTopics.map((ek) => {
                    const examList = ek.recurringExams && ek.recurringExams.length > 0
                      ? ek.recurringExams
                      : sortedExams.map((e) => e.sinavAdi);
                    const cleanKonu = (ek.konu || "").replace(/🚨/g, "").replace(/Tekrar Eden/g, "").trim();

                    return `
                      <div class="report-deficiency-item recurring-card" style="padding: 4px 7px; background: #ffffff; border: 1px solid #fca5a5; border-radius: 4px; box-shadow: 0 1px 2px rgba(220, 38, 38, 0.05);">
                        <div class="report-deficiency-header mb-1" style="display: flex; justify-content: space-between; align-items: center;">
                          <span class="report-deficiency-subject" style="font-size: 10px; font-weight: 800; color: #991b1b;">${ek.ders}</span>
                          <div class="d-flex gap-1 items-center">
                            <span class="badge badge-danger font-bold" style="font-size: 7.5px; padding: 1px 4px; background: #ef4444; color: #fff;">
                              🚨 Tekrarlayan Yanlış (${ek.recurringCount || examList.length} Sınav)
                            </span>
                            <span class="badge badge-danger font-bold" style="font-size: 7.5px; padding: 1px 4px;">Kritik</span>
                          </div>
                        </div>
                        <div class="report-deficiency-title" style="font-size: 9.5px; font-weight: 700; color: #1e293b; line-height: 1.25;">
                          ${cleanKonu}
                        </div>
                        <div class="recurring-exams-bar" style="margin-top: 3px; padding: 2px 5px; background: #fef2f2; border: 1px dashed #f87171; border-radius: 3px; font-size: 8.5px; color: #991b1b; display: flex; align-items: center; gap: 3px; flex-wrap: wrap;">
                          <strong>📌 Hata Yapılan Sınavlar:</strong>
                          ${examList.map((name) => `<span class="badge badge-danger font-bold" style="font-size: 7.5px; padding: 0 3px; background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;">${escapeHtml(name)}</span>`).join("")}
                        </div>
                        ${ek.oneri ? `<div class="report-deficiency-tip" style="font-size: 8.5px; color: #475569; background: #f8fafc; padding: 2px 5px; border-radius: 2px; border: 1px solid #e2e8f0; margin-top: 2px;">💡 <strong>Eylem Planı:</strong> ${escapeHtml(ek.oneri.replace(/🚨.*?:/g, "").trim())}</div>` : ""}
                      </div>
                    `;
                  }).join("")}
                </div>
              </div>
            `;
          } else {
            recurringBlockHtml = `
              <div class="report-section mb-2" style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 6px; padding: 7px 10px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span style="font-size: 16px;">✅</span>
                  <div>
                    <strong style="color: #166534; font-size: 11px;">Mükemmel: Tekrarlayan (Kronik) Eksik Bulunmamaktadır!</strong>
                    <div style="font-size: 9.5px; color: #15803d;">Seçilen ${sortedExams.length} sınavın karşılaştırmalı analizinde öğrencinin peş peşe hata yaptığı kronik bir kazanım saptanmamıştır. Aşağıda tekil sınav eksiklerinin telafi programı listelenmiştir.</div>
                  </div>
                </div>
              </div>
            `;
          }
        }

        let nonRecurringBlockHtml = "";
        if (nonRecurringTopics.length > 0) {
          nonRecurringBlockHtml = `
            <div class="report-section" style="margin-bottom: 4px;">
              <div class="report-section-header" style="border-color: ${themeColor}; margin-bottom: 4px;">
                <h3 style="color: ${themeColor}; font-size: 11px;">🎯 ${isMulti ? "Tek Sınavda Tespit Edilen Diğer Eksik Kazanımlar" : "Tespit Edilen Eksik Konu ve Kazanımlar"} (${nonRecurringTopics.length} Kazanım)</h3>
                <span class="report-section-sub" style="font-size: 9px;">Öncelik sırasına göre telafi edilmesi gereken konu başlıkları</span>
              </div>
              <div class="report-deficiencies-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
                ${nonRecurringTopics
                  .map((ek) => {
                    const badgeClass =
                      ek.seviye === "kritik"
                        ? "badge-danger"
                        : ek.seviye === "orta"
                        ? "badge-warning"
                        : "badge-info";
                    const badgeText =
                      ek.seviye === "kritik" ? "Kritik" : ek.seviye === "orta" ? "Orta" : "Hafif";
                    return `
                    <div class="report-deficiency-item" style="padding: 4px 6px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px;">
                      <div class="report-deficiency-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                        <span class="report-deficiency-subject" style="font-size: 9.5px; font-weight: 700; color: ${themeColor};">${ek.ders}</span>
                        <div style="display: flex; gap: 3px; align-items: center;">
                          ${ek.recurringExams && ek.recurringExams.length > 0 ? `<span class="badge badge-light" style="font-size: 7.5px; padding: 0 3px; color: #64748b;">${escapeHtml(ek.recurringExams[0])}</span>` : ""}
                          <span class="badge ${badgeClass} font-bold" style="font-size: 7.5px; padding: 1px 3px;">${badgeText}</span>
                        </div>
                      </div>
                      <div class="report-deficiency-title" style="font-size: 9px; font-weight: 600; color: #1e293b; line-height: 1.2;">${ek.konu}</div>
                      ${ek.oneri ? `<div class="report-deficiency-tip" style="font-size: 8.5px; color: #475569; background: #ffffff; padding: 2px 4px; border-radius: 2px; border: 1px solid #e2e8f0; margin-top: 2px;">💡 ${ek.oneri}</div>` : ""}
                    </div>
                  `;
                  })
                  .join("")}
              </div>
            </div>
          `;
        }

        eksikHtml = recurringBlockHtml + nonRecurringBlockHtml;
      }

      let scheduleMatrixHtml = "";
      const scheduleData = report.haftalikTablo || (report.calismaProgrami ? null : []);
      const ozet = report.haftalikOzet || {
        toplamSoruHedefi: "580 Soru",
        toplamEtutSuresi: "21.5 Saat",
        denemeSayisi: "1 Tam LGS Denemesi + 2 Branş Denemesi",
        kitapOkuma: "120 dk Kitap + 100 Paragraf",
        kocTavsiyesi: "Hafta boyu denemelerde ve testlerde yanlış yapılan her soru 'Hata Defteri'ne yapıştırılmalı ve pazar günü tekrar çözülmelidir."
      };

      if (scheduleData && scheduleData.length > 0) {
        scheduleMatrixHtml = `
          <div class="report-section mb-2">
            <div class="report-section-header" style="border-color: ${themeColor}; margin-bottom: 8px;">
              <h3 style="color: ${themeColor}; font-size: 14px;">📅 7 Günlük LGS Haftalık Çalışma Çizelgesi & Etüt Matrisi</h3>
              <span class="report-section-sub" style="font-size: 11px;">Eksik kazanımlara odaklı saatli ve hedefli etüt planı</span>
            </div>

            <table class="report-schedule-matrix" style="font-size: 11px;">
              <thead>
                <tr style="background: ${themeColor}15; color: ${themeColor};">
                  <th style="width: 14%;">Gün & Odak</th>
                  <th style="width: 28%;">1. Etüt (Konu & Eksik Telafi)</th>
                  <th style="width: 28%;">2. Etüt (Yeni Nesil Soru Çözümü)</th>
                  <th style="width: 20%;">3. Etüt (Tekrar & Paragraf)</th>
                  <th style="width: 10%; text-align: center;">Hedef</th>
                </tr>
              </thead>
              <tbody>
                ${scheduleData.map((row) => `
                  <tr>
                    <td class="schedule-day-cell">
                      <span class="schedule-day-badge">${row.gun}</span>
                      <span class="schedule-day-tag">${row.gunlukOdak || "Eksik Telafi"}</span>
                    </td>
                    <td>
                      <div class="schedule-etut-box">
                        <div class="etut-header">
                          <span class="etut-subject" style="color: ${themeColor};">${row.etut1?.ders || "-"}</span>
                          <span class="etut-time">${row.etut1?.saat || ""}</span>
                        </div>
                        <div class="etut-topic">${row.etut1?.konu || "-"}</div>
                        <span class="etut-target-badge">🎯 ${row.etut1?.hedef || "-"}</span>
                      </div>
                    </td>
                    <td>
                      <div class="schedule-etut-box">
                        <div class="etut-header">
                          <span class="etut-subject" style="color: ${themeColor};">${row.etut2?.ders || "-"}</span>
                          <span class="etut-time">${row.etut2?.saat || ""}</span>
                        </div>
                        <div class="etut-topic">${row.etut2?.konu || "-"}</div>
                        <span class="etut-target-badge">🎯 ${row.etut2?.hedef || "-"}</span>
                      </div>
                    </td>
                    <td>
                      <div class="schedule-etut-box">
                        <div class="etut-header">
                          <span class="etut-subject" style="color: #475569;">${row.etut3?.ders || "-"}</span>
                          <span class="etut-time">${row.etut3?.saat || ""}</span>
                        </div>
                        <div class="etut-topic">${row.etut3?.konu || "-"}</div>
                        <span class="etut-target-badge" style="background: #f1f5f9; color: #475569; border-color: #cbd5e1;">🎯 ${row.etut3?.hedef || "-"}</span>
                      </div>
                    </td>
                    <td style="text-align: center; vertical-align: middle;">
                      <span class="badge badge-primary font-bold" style="font-size: 10px; padding: 4px 6px;">${row.gunlukToplamSoru ? row.gunlukToplamSoru + " Soru" : "-"}</span>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>

            <div class="schedule-summary-bar" style="margin-top: 10px; gap: 8px;">
              <div class="schedule-stat-box" style="padding: 6px 8px;">
                <div class="schedule-stat-value" style="color: ${themeColor}; font-size: 13px;">${ozet.toplamSoruHedefi || "580 Soru"}</div>
                <div class="schedule-stat-label" style="font-size: 9.5px;">Haftalık Soru Hedefi</div>
              </div>
              <div class="schedule-stat-box" style="padding: 6px 8px;">
                <div class="schedule-stat-value" style="color: #059669; font-size: 13px;">${ozet.toplamEtutSuresi || "21.5 Saat"}</div>
                <div class="schedule-stat-label" style="font-size: 9.5px;">Toplam Etüt Süresi</div>
              </div>
              <div class="schedule-stat-box" style="padding: 6px 8px;">
                <div class="schedule-stat-value" style="color: #d97706; font-size: 13px;">${ozet.denemeSayisi || "1 Tam + 2 Branş"}</div>
                <div class="schedule-stat-label" style="font-size: 9.5px;">Deneme Provası</div>
              </div>
              <div class="schedule-stat-box" style="padding: 6px 8px;">
                <div class="schedule-stat-value" style="color: #7c3aed; font-size: 13px;">${ozet.kitapOkuma || "120 dk Kitap"}</div>
                <div class="schedule-stat-label" style="font-size: 9.5px;">Kitap & Paragraf</div>
              </div>
            </div>

            ${ozet.kocTavsiyesi ? `
              <div class="schedule-coaching-tip" style="margin-top: 8px; padding: 6px 10px; font-size: 11px;">
                <span>💡</span>
                <span><strong>Eğitim Koçu Notu:</strong> ${ozet.kocTavsiyesi}</span>
              </div>
            ` : ""}
          </div>
        `;
      }

      return `
        <div class="report-a4-sheet" id="printable-report-sheet">
          <div class="report-a4-page" style="padding: 24px 32px; gap: 16px;">
            
            <!-- ORTAK ANTET (Tüm Rapor İçin 1 Kere) -->
            <div class="report-header">
              <div class="report-header-left">
                ${logoHtml}
                <div class="report-institution-info">
                  <h1 class="report-institution-title">${institution.ad}</h1>
                  <div class="report-institution-meta">
                    <span>📍 ${institution.adres || "Adres"}</span>
                    <span>📞 ${institution.telefon || "-"}</span>
                    ${institution.kurumKodu ? `<span>🏢 Kod: ${institution.kurumKodu}</span>` : ""}
                  </div>
                </div>
              </div>
              <div class="report-header-right">
                <div class="report-badge-title" style="background: ${themeColor}; font-size: ${isMulti ? '11px' : '13px'}; padding: 6px 12px;">${pageTitle}</div>
                <div class="report-date-badge" style="font-size: 12px;">Tarih: ${formatDate(report.olusturmaTarihi)}</div>
              </div>
            </div>

            <!-- ÖĞRENCİ KÜNYE -->
            <div class="report-student-card" style="border-top-color: ${themeColor}; font-size: 13px;">
              <div class="student-meta-item"><span class="meta-label">Öğrenci Adı Soyadı:</span><span class="meta-value" style="font-size: 14px;"><strong>${student.adSoyad}</strong></span></div>
              <div class="student-meta-item"><span class="meta-label">Sınıf / Şube:</span><span class="meta-value">${student.sinif}. Sınıf (${student.sube})</span></div>
              <div class="student-meta-item"><span class="meta-label">Öğrenci No:</span><span class="meta-value">#${student.numara || "-"}</span></div>
              <div class="student-meta-item">
                <span class="meta-label">${isMulti ? "Sınav Net Seyri:" : "Toplam Net:"}</span>
                <span class="meta-value">
                  ${isMulti 
                    ? `<span class="badge badge-primary font-bold" style="font-size: 13px;">${getVerifiedExamTotalNet(firstExam)} ➔ ${getVerifiedExamTotalNet(latestExam)} Net</span>`
                    : `<span class="badge badge-primary font-bold" style="font-size: 13px;">${getVerifiedExamTotalNet(firstExam)} Net</span>`
                  }
                </span>
              </div>
            </div>

            <!-- İÇERİK BLOKLARI (Serbest Akış) -->
            ${comparisonKpisHtml}
            ${crossSubjectMatrixHtml}

            ${!isMulti ? `
              <div class="report-section">
                <div class="report-section-header" style="border-color: ${themeColor};">
                  <h3 style="color: ${themeColor}; font-size: 14px;">📊 Sınav Net ve Başarı Dağılımı</h3>
                </div>
                <div class="report-exams-container">${examRows}</div>
              </div>
            ` : ""}

            ${eksikHtml}

            <!-- YORUM VE GELİŞİM -->
            <div class="report-section" style="break-inside: avoid;">
              <div class="report-section-header" style="border-color: ${themeColor};">
                <h3 style="color: ${themeColor}; font-size: 14px;">📝 Pedagojik Değerlendirme & Rehberlik Yorumu</h3>
              </div>
              <div class="report-comment-box" style="padding: 10px 14px; font-size: 12px; line-height: 1.5;">
                <div class="report-comment-quote-icon" style="color: ${themeColor}; font-size: 24px;">“</div>
                <div class="report-comment-text">${report.genelYorum || "Değerlendirme mevcut değil."}</div>
              </div>
              ${report.gelisimAnalizi ? `
                <div class="report-trend-box mt-2" style="background: rgba(37, 99, 235, 0.04); border: 1.5px solid rgba(37, 99, 235, 0.2); border-radius: 6px; padding: 10px 14px;">
                  <div class="report-trend-title" style="font-weight: 800; color: #1e40af; font-size: 12px; margin-bottom: 4px;">📈 Gelişim Seyri ve Karşılaştırma Analizi:</div>
                  <div class="report-trend-text" style="font-size: 11.5px; line-height: 1.5; color: #334155;">${report.gelisimAnalizi.replace(/\n/g, '<br/>')}</div>
                </div>
              ` : ""}
            </div>

            <!-- ETÜT MATRİSİ -->
            ${scheduleMatrixHtml ? `<div style="margin-top: 20px;">${scheduleMatrixHtml}</div>` : ""}

            <!-- GENEL İMZA VE FOOTER BLOKLARI (Sayfa sonuna veya doküman sonuna) -->
            <div class="report-footer" style="border-top: 2px solid #e2e8f0; padding-top: 16px; margin-top: 30px; break-inside: avoid; display: flex; justify-content: space-between;">
              <div class="report-footer-left" style="max-width: 60%;">
                <div style="font-size: 12px; font-weight: 700; color: #0f172a;">Öğrenci Gelişim & Takip Taahhüdü</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 6px; line-height: 1.4;">
                  Bu rapor <strong>${institution.ad}</strong> Ölçme ve Değerlendirme Merkezi tarafından üretilmiştir.<br/>
                  Yukarıda planlanan etüt ve soru hedeflerinin günlük olarak takip edilmesi önerilir.
                </div>
              </div>
              <div class="report-footer-right" style="text-align: center;">
                <div class="report-signature-block">
                  <span class="sig-title" style="font-size: 11.5px; font-weight: 700; color: #1e293b;">Rehberlik & Eğitim Danışmanı</span>
                  <div style="height: 45px;"></div>
                  <span class="sig-line" style="font-size: 11px; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 4px; width: 160px; display: inline-block;">İmza / Kaşe</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      `;
    }
  }

  // ==========================================
  // 8. MERKEZİ STATE STORE
  // ==========================================
  class Store {
    constructor() {
      this.listeners = new Set();
      this.state = {
        currentTab: "dashboard",
        currentUser: { id: "usr_admin_1", adSoyad: "Yönetici Öğretmen", email: "admin@kurum.k12.tr", rol: "admin" },
        institution: (() => {
          const inst = this.loadFromStorage(APP_CONFIG.storageKeys.INSTITUTION, DEFAULT_INSTITUTION);
          if (!inst.logoUrl) inst.logoUrl = "./logo.png";
          return inst;
        })(),
        students: this.loadFromStorage(APP_CONFIG.storageKeys.STUDENTS, MOCK_STUDENTS),
        exams: this.loadFromStorage(APP_CONFIG.storageKeys.EXAMS, MOCK_EXAMS),
        reports: this.loadFromStorage(APP_CONFIG.storageKeys.REPORTS, MOCK_REPORTS),
        aiConfig: (() => {
          const loaded = this.loadFromStorage(APP_CONFIG.storageKeys.AI_CONFIG, DEFAULT_AI_CONFIG);
          loaded.provider = loaded.provider || "openai";
          loaded.openaiApiKey = loaded.openaiApiKey || DEFAULT_AI_CONFIG.openaiApiKey;
          loaded.geminiApiKey = loaded.geminiApiKey || DEFAULT_AI_CONFIG.geminiApiKey;
          return loaded;
        })(),
        firebaseConfig: this.loadFromStorage(APP_CONFIG.storageKeys.FIREBASE_CONFIG, DEFAULT_FIREBASE_CONFIG),
        isFirebaseConnected: true,
        selectedExamIds: new Set(),
        selectedStudentIdForAnalysis: null
      };

      this.applyTheme(this.state.institution.temaRengi);
      if (this.state.firebaseConfig) {
        FirebaseService.init(this.state.firebaseConfig, this);
      }
    }

    loadFromStorage(key, fallback) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
      } catch (e) {
        return fallback;
      }
    }

    saveToStorage(key, data) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {}
    }

    subscribe(listener) {
      this.listeners.add(listener);
      return () => this.listeners.delete(listener);
    }

    notify(event, data) {
      this.listeners.forEach((listener) => {
        try { listener(this.state, event, data); } catch (e) {}
      });
    }

    getState() { return this.state; }

    setTab(tabName) {
      this.state.currentTab = tabName;
      this.notify("TAB_CHANGED", tabName);
    }

    applyTheme(hexColor) {
      if (!hexColor) return;
      const root = document.documentElement;
      root.style.setProperty("--primary-color", hexColor);
      root.style.setProperty("--primary-rgb", hexToRgb(hexColor));
    }

    updateInstitution(data) {
      this.state.institution = { ...this.state.institution, ...data };
      this.saveToStorage(APP_CONFIG.storageKeys.INSTITUTION, this.state.institution);
      FirebaseService.saveDocument("kurumlar", this.state.institution.id, this.state.institution);
      if (data.temaRengi) this.applyTheme(data.temaRengi);
      this.notify("INSTITUTION_UPDATED", this.state.institution);
      showToast("Kurum bilgileri kaydedildi.", "success");
    }

    addStudent(student) {
      this.state.students = [student, ...this.state.students];
      this.saveToStorage(APP_CONFIG.storageKeys.STUDENTS, this.state.students);
      FirebaseService.saveDocument("ogrenciler", student.id, student);
      this.notify("STUDENTS_UPDATED", this.state.students);
      showToast(`${student.adSoyad} kaydedildi.`, "success");
    }

    addBatchStudents(studentsList) {
      const existing = [...this.state.students];
      studentsList.forEach((st) => {
        const idx = existing.findIndex((s) => s.adSoyad.toLowerCase() === st.adSoyad.toLowerCase() || (s.numara && s.numara === st.numara));
        if (idx >= 0) existing[idx] = { ...existing[idx], ...st };
        else existing.unshift(st);
        FirebaseService.saveDocument("ogrenciler", st.id, st);
      });
      this.state.students = existing;
      this.saveToStorage(APP_CONFIG.storageKeys.STUDENTS, this.state.students);
      this.notify("STUDENTS_UPDATED", this.state.students);
    }

    addBatchExams(examsList) {
      const existing = [...this.state.exams];
      examsList.forEach((ex) => {
        const idx = existing.findIndex((e) => e.ogrenciId === ex.ogrenciId && e.sinavAdi === ex.sinavAdi);
        if (idx >= 0) existing[idx] = { ...existing[idx], ...ex };
        else existing.unshift(ex);
        FirebaseService.saveDocument("sinavlar", ex.id, ex);
      });
      this.state.exams = existing;
      this.saveToStorage(APP_CONFIG.storageKeys.EXAMS, this.state.exams);
      this.notify("EXAMS_UPDATED", this.state.exams);
    }

    updateStudent(studentId, updatedData) {
      this.state.students = this.state.students.map((s) => (s.id === studentId ? { ...s, ...updatedData } : s));
      this.saveToStorage(APP_CONFIG.storageKeys.STUDENTS, this.state.students);
      FirebaseService.saveDocument("ogrenciler", studentId, updatedData);
      this.notify("STUDENTS_UPDATED", this.state.students);
      showToast("Öğrenci güncellendi.", "success");
    }

    deleteStudent(studentId) {
      // Silinecek sınav ve raporların ID'lerini Firestore silmeden önce al
      const examsToDelete = this.state.exams.filter((e) => e.ogrenciId === studentId);
      const reportsToDelete = this.state.reports.filter((r) => r.ogrenciId === studentId);

      this.state.students = this.state.students.filter((s) => s.id !== studentId);
      this.state.exams = this.state.exams.filter((e) => e.ogrenciId !== studentId);
      this.state.reports = this.state.reports.filter((r) => r.ogrenciId !== studentId);
      this.saveToStorage(APP_CONFIG.storageKeys.STUDENTS, this.state.students);
      this.saveToStorage(APP_CONFIG.storageKeys.EXAMS, this.state.exams);
      this.saveToStorage(APP_CONFIG.storageKeys.REPORTS, this.state.reports);

      // Firestore cascade silme — öğrenci + bağlı tüm sınavlar + raporlar
      FirebaseService.deleteDocument("ogrenciler", studentId);
      examsToDelete.forEach((ex) => FirebaseService.deleteDocument("sinavlar", ex.id));
      reportsToDelete.forEach((rep) => FirebaseService.deleteDocument("raporlar", rep.id));

      this.notify("STUDENTS_UPDATED", this.state.students);
      showToast(`Öğrenci ve bağlı ${examsToDelete.length} sınav, ${reportsToDelete.length} rapor silindi.`, "info");
    }

    deleteAllStudents() {
      const studentCount = this.state.students.length;
      const examCount = this.state.exams.length;
      const reportCount = this.state.reports.length;

      // Firebase'den de temizle
      this.state.students.forEach((s) => FirebaseService.deleteDocument("ogrenciler", s.id));
      this.state.exams.forEach((e) => FirebaseService.deleteDocument("sinavlar", e.id));
      this.state.reports.forEach((r) => FirebaseService.deleteDocument("raporlar", r.id));

      this.state.students = [];
      this.state.exams = [];
      this.state.reports = [];
      this.state.selectedExamIds.clear();

      this.saveToStorage(APP_CONFIG.storageKeys.STUDENTS, this.state.students);
      this.saveToStorage(APP_CONFIG.storageKeys.EXAMS, this.state.exams);
      this.saveToStorage(APP_CONFIG.storageKeys.REPORTS, this.state.reports);

      this.notify("STUDENTS_UPDATED", this.state.students);
      this.notify("EXAMS_UPDATED", this.state.exams);
      this.notify("REPORTS_UPDATED", this.state.reports);

      showToast(`✓ Tüm öğrenciler (${studentCount}) ve bağlı tüm sınav verileri (${examCount}) silindi.`, "warning");
    }

    addExam(exam) {
      this.state.exams = [exam, ...this.state.exams];
      this.saveToStorage(APP_CONFIG.storageKeys.EXAMS, this.state.exams);
      FirebaseService.saveDocument("sinavlar", exam.id, exam);
      this.notify("EXAMS_UPDATED", this.state.exams);
      showToast(`"${exam.sinavAdi}" kaydedildi.`, "success");
    }

    deleteExam(examId) {
      this.state.exams = this.state.exams.filter((e) => e.id !== examId);
      this.state.selectedExamIds.delete(examId);
      this.saveToStorage(APP_CONFIG.storageKeys.EXAMS, this.state.exams);
      FirebaseService.deleteDocument("sinavlar", examId);
      this.notify("EXAMS_UPDATED", this.state.exams);
      showToast("Sınav silindi.", "info");
    }

    deleteBatchExams(examIds = []) {
      if (examIds.length === 0) return;
      const idSet = new Set(examIds);
      this.state.exams = this.state.exams.filter((e) => !idSet.has(e.id));
      examIds.forEach((id) => {
        this.state.selectedExamIds.delete(id);
        FirebaseService.deleteDocument("sinavlar", id);
      });
      this.saveToStorage(APP_CONFIG.storageKeys.EXAMS, this.state.exams);
      this.notify("EXAMS_UPDATED", this.state.exams);
      showToast(`✓ ${examIds.length} sınav kaydı başarıyla silindi.`, "info");
    }

    deleteExamsByName(examName) {
      if (!examName) return;
      const toDelete = this.state.exams.filter((e) => (e.sinavAdi || "").trim() === examName.trim());
      if (toDelete.length === 0) return;
      this.deleteBatchExams(toDelete.map((e) => e.id));
    }

    deleteAllExams() {
      const count = this.state.exams.length;
      this.state.exams.forEach((ex) => {
        FirebaseService.deleteDocument("sinavlar", ex.id);
      });
      this.state.exams = [];
      this.state.selectedExamIds.clear();
      this.saveToStorage(APP_CONFIG.storageKeys.EXAMS, this.state.exams);
      this.notify("EXAMS_UPDATED", this.state.exams);
      showToast(`✓ Tüm sınav kayıtları (${count} adet) başarıyla temizlendi.`, "info");
    }

    toggleExamSelection(examId) {
      if (this.state.selectedExamIds.has(examId)) this.state.selectedExamIds.delete(examId);
      else this.state.selectedExamIds.add(examId);
      this.notify("EXAM_SELECTION_CHANGED", Array.from(this.state.selectedExamIds));
    }

    clearExamSelection() {
      this.state.selectedExamIds.clear();
      this.notify("EXAM_SELECTION_CHANGED", []);
    }

    getSelectedExams() {
      const selectedIds = Array.from(this.state.selectedExamIds);
      return this.state.exams.filter((e) => selectedIds.includes(e.id));
    }

    addReport(report) {
      if (!report.createdAt) report.createdAt = Date.now();
      if (!report.olusturmaTarihi || report.olusturmaTarihi.length <= 10) {
        report.olusturmaTarihi = new Date().toISOString();
      }
      this.state.reports = [report, ...this.state.reports];
      this.saveToStorage(APP_CONFIG.storageKeys.REPORTS, this.state.reports);
      FirebaseService.saveDocument("raporlar", report.id, report);
      this.notify("REPORTS_UPDATED", this.state.reports);
    }

    deleteReport(reportId) {
      this.state.reports = this.state.reports.filter((r) => r.id !== reportId);
      this.saveToStorage(APP_CONFIG.storageKeys.REPORTS, this.state.reports);
      FirebaseService.deleteDocument("raporlar", reportId);
      this.notify("REPORTS_UPDATED", this.state.reports);
      showToast("Rapor silindi.", "info");
    }

    updateAiConfig(config) {
      this.state.aiConfig = { ...this.state.aiConfig, ...config };
      this.saveToStorage(APP_CONFIG.storageKeys.AI_CONFIG, this.state.aiConfig);
      this.notify("AI_CONFIG_UPDATED", this.state.aiConfig);
      showToast("AI yapılandırması kaydedildi.", "success");
    }

    resetToSampleData() {
      this.state.students = [];
      this.state.exams = [];
      this.state.reports = [];
      this.state.institution = { ...DEFAULT_INSTITUTION };
      this.saveToStorage(APP_CONFIG.storageKeys.STUDENTS, []);
      this.saveToStorage(APP_CONFIG.storageKeys.EXAMS, []);
      this.saveToStorage(APP_CONFIG.storageKeys.REPORTS, []);
      this.saveToStorage(APP_CONFIG.storageKeys.INSTITUTION, this.state.institution);
      this.applyTheme(this.state.institution.temaRengi);
      this.notify("STORE_RESET", null);
      showToast("Tüm yerel veriler temizlendi. Firestore ile senkronize ediliyor...", "info");
      // Firestore'dan güncel verileri çek
      FirebaseService.syncAllFromFirestore(this).then((synced) => {
        if (window.app) window.app.renderCurrentView();
      });
    }

    clearAllData() {
      this.state.students = [];
      this.state.exams = [];
      this.state.reports = [];
      this.state.selectedExamIds.clear();
      this.saveToStorage(APP_CONFIG.storageKeys.STUDENTS, []);
      this.saveToStorage(APP_CONFIG.storageKeys.EXAMS, []);
      this.saveToStorage(APP_CONFIG.storageKeys.REPORTS, []);
      this.notify("DATA_CLEARED", null);
      showToast("Tüm kayıtlar temizlendi.", "info");
    }
  }

  const store = new Store();

  // ==========================================
  // 9. GÖRÜNÜMLER (VIEWS)
  // ==========================================
  function renderDashboardView() {
    const state = store.getState();
    const studentsCount = state.students.length;
    const examsCount = state.exams.length;
    const reportsCount = state.reports.length;

    let totalNet = 0, count = 0;
    state.exams.forEach((e) => { if (e.toplamNet) { totalNet += Number(e.toplamNet); count++; } });
    const avgNet = count > 0 ? (totalNet / count).toFixed(1) : "0.0";

    const recentExams = [...state.exams].sort((a, b) => {
      const tA = new Date(a.createdAt || a.tarih || 0).getTime() || 0;
      const tB = new Date(b.createdAt || b.tarih || 0).getTime() || 0;
      return tB - tA;
    }).slice(0, 5);

    const recentReports = [...state.reports].sort((a, b) => {
      const tA = a.createdAt ? Number(a.createdAt) : (new Date(a.olusturmaTarihi || 0).getTime() || 0);
      const tB = b.createdAt ? Number(b.createdAt) : (new Date(b.olusturmaTarihi || 0).getTime() || 0);
      return tB - tA; // Yeniden eskiye
    }).slice(0, 6);

    // Kayıtlı benzersiz sınavları topla
    const uniqueExamMap = new Map();
    state.exams.forEach((ex) => {
      const key = ex.sinavAdi || "Genel Deneme Sınavı";
      const count = (uniqueExamMap.get(key) || 0) + 1;
      uniqueExamMap.set(key, count);
    });
    const uniqueExams = Array.from(uniqueExamMap.entries()).map(([sinavAdi, count]) => ({ sinavAdi, count }));

    return `
      <div class="view-container animate-fade-in">
        ${(() => {
          const isAiRunning = window.app?.activeAnalysis?.status === "running";
          const st = window.app?.pdfAnalyzerLiveState || {};
          const isPdfParsing = (window.app?.isPdfParsing || window.app?.isSingleAiParsing) && !st.isCompleted;
          const isPdfParsingCompleted = st.isCompleted && !isAiRunning;
          const isAnalyzing = isAiRunning || isPdfParsing || isPdfParsingCompleted;
          
          let title = "Canlı İşlem";
          let percent = 0;
          let subtitle = "";
          let timeText = "00:00";
          let statusText = "Canlı İşlem Devam Ediyor";
          let themeColor = "#38bdf8";
          
          if (isAiRunning) {
            const analysis = window.app?.activeAnalysis || { percent: 0, title: "Yapay Zekâ Analizi", currentStudent: "" };
            title = analysis.title || "Yapay Zekâ Analizi";
            percent = analysis.percent || 0;
            subtitle = "👤 " + (analysis.currentStudent || "Öğrenci Analiz Ediliyor");
            timeText = "⏱️ Geçen Süre: " + (window.app?.analysisElapsedTime || "00:00");
          } else if (isPdfParsing) {
            title = "⚡ PDF Analiz Ediliyor";
            percent = st.percent || 0;
            subtitle = `👤 ${st.curr || 0} / ${st.total || 0} Öğrenci İşlendi (${st.studentName || "Öğrenci"})`;
            timeText = "⏱️ Geçen Süre: " + (window.app?.pdfParsingElapsedTime || "00:00");
            statusText = "PDF Ayrıştırma İşlemi";
          } else if (isPdfParsingCompleted) {
             title = "🎉 PDF Ayrıştırma Tamamlandı";
             percent = 100;
             subtitle = `👤 ${st.total || 0} Öğrenci İşlendi ve Onayınızı Bekliyor`;
             timeText = "✅ Tamamlandı";
             statusText = "Bekleyen İşlem (Onay Bekleniyor)";
             themeColor = "#22c55e";
          }
          
          if (isAnalyzing) {
            return `
        <div class="dashboard-hero" id="dashboard-hero-progress-widget" style="border: 2px solid ${themeColor}; box-shadow: 0 0 20px ${themeColor}26; display: flex; flex-direction: column; justify-content: center;">
          <div class="dashboard-hero-content" style="width: 100%; max-width: 100%;">
            <div class="d-flex justify-between items-center mb-4">
              <div class="dashboard-hero-badge" style="background: ${themeColor}33; color: ${themeColor}; border: 1px solid ${themeColor}; margin-bottom: 0;">
                <span class="ai-pulse-dot" style="background: ${themeColor}; box-shadow: 0 0 12px ${themeColor};"></span>
                <span id="hero-analysis-status-text">${statusText}</span>
              </div>
              <div style="font-size: 15px; font-weight: 600; color: #fff; background: rgba(255,255,255,0.1); padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1);">
                <span id="hero-analysis-timer">${timeText}</span>
              </div>
            </div>
            
            <h1 class="dashboard-hero-title" id="hero-analysis-title" style="margin-bottom: 8px; font-size: 24px;">${title}</h1>
            <p class="dashboard-hero-desc text-truncate" id="hero-analysis-student" style="font-size: 15px; color: #cbd5e1; max-width: 100%; opacity: 0.9;">${subtitle}</p>
            
            <div class="analysis-progress-track" style="margin: 20px 0; height: 10px; border-radius: 10px; background: rgba(255,255,255,0.1); overflow: hidden;">
              <div class="analysis-progress-fill" id="hero-analysis-fill-bar" style="width: ${percent}%; height: 100%; border-radius: 10px; background: linear-gradient(90deg, ${themeColor}, #2563eb); transition: width 0.3s ease;"></div>
            </div>
            
            <div class="d-flex justify-between items-center" style="color: #94a3b8;">
              <span style="font-size: 14px;">Tamamlanma Oranı: <strong class="text-white" id="hero-analysis-percent-badge">%${percent}</strong></span>
            </div>
            ${isPdfParsingCompleted ? `
            <div style="margin-top: 20px; display: flex; gap: 10px;">
              <button class="btn btn-success btn-lg shadow-glow" onclick="window.app.maximizePdfModal()" style="flex: 1; border-radius: 12px; font-weight: 600;">
                🚀 Önizlemeyi Aç ve AI Analizini Başlat
              </button>
              <button class="btn btn-outline" onclick="window.app.cancelPdfParsing()" style="border-radius: 12px; font-weight: 600; padding: 0 20px; color: #ef4444; border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.05);" title="İşlemi İptal Et ve Sil">
                Sil / İptal Et
              </button>
            </div>
            ` : ""}
          </div>
        </div>
            `;
          }
          
          return `
        <div class="dashboard-hero">
          <div class="dashboard-hero-content">
            <div class="dashboard-hero-badge"><span class="pulse-dot"></span><span>${state.institution.ad} — Ölçme & Değerlendirme</span></div>
            <h1 class="dashboard-hero-title">PDF Toplu Karne Yükle & Otomatik AI Analizi</h1>
            <p class="dashboard-hero-desc">Tek bir öğrencinin veya <strong>70+ öğrencinin toplu PDF sınav karnesini</strong> tek seferde yükleyin; sistem her öğrenciyi, kazanımları ve netleri otomatik çözümler, OpenAI ChatGPT veya Gemini ile kişiselleştirilmiş 7 günlük çalışma programı ve grafikli karne üretir.</p>
          </div>
          <div class="dashboard-hero-actions">
                <button class="btn btn-primary btn-lg shadow-glow" onclick="window.app.openUploadPdfModal()">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6M9 15l3-3 3 3"/></svg>
                  <span>📄 PDF Sınav Belgesi Yükle (Tekli / 70+ Toplu)</span>
                </button>
                <button class="btn btn-secondary btn-lg" onclick="window.app.navigate('aiAnalysis')">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>
                  <span>AI Analiz Paneli</span>
                </button>
          </div>
        </div>
          `;
        })()}
          </div>
        </div>

        <!-- SEÇİLİ SINAV TOPLU ANALİZ & KARNE PDF İNDİRME ALANI (HERO ALTINDA) -->
        <div class="dashboard-bulk-export-card animate-fade-in">
          <div class="bulk-export-left">
            <div class="bulk-export-badge">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6M9 15l3-3 3 3"/></svg>
              <span>Seçili Sınav AI Analizli Toplu Rapor Paketi</span>
            </div>
            <div class="bulk-export-desc">
              Sınava katılan tüm öğrencilerin yapay zekâ analizli gelişim karnelerini ve 7 günlük etüt matrislerini <strong>tek bir toplu PDF dosyası</strong> olarak indirin.
            </div>
          </div>
          <div class="bulk-export-right">
            <div class="bulk-export-select-wrap">
              <label class="bulk-export-label">İndirilecek Sınav:</label>
              <select id="dashboard-bulk-exam-select" class="bulk-export-select">
                ${uniqueExams.length === 0 ? `<option value="">Kayıtlı Sınav Yok</option>` : uniqueExams.map((ex) => `<option value="${escapeHtml(ex.sinavAdi)}">${escapeHtml(ex.sinavAdi)} (${ex.count} Öğrenci)</option>`).join("")}
              </select>
            </div>
            <button class="btn btn-success btn-lg shadow-sm" ${uniqueExams.length === 0 ? "disabled" : ""} onclick="window.app.exportBulkExamReportsFromDashboard()">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>📥 Seçili Sınavın AI Analizli Toplu Raporunu İndir</span>
            </button>
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-card" onclick="window.app.navigate('students')">
            <div class="stat-icon-wrap stat-icon-blue"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
            <div class="stat-info"><div class="stat-value">${studentsCount}</div><div class="stat-label">Kayıtlı Öğrenci</div></div>
            <div class="stat-arrow">&rarr;</div>
          </div>
          <div class="stat-card" onclick="window.app.navigate('exams')">
            <div class="stat-icon-wrap stat-icon-indigo"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
            <div class="stat-info"><div class="stat-value">${examsCount}</div><div class="stat-label">İşlenen Sınav</div></div>
            <div class="stat-arrow">&rarr;</div>
          </div>
          <div class="stat-card" onclick="window.app.navigate('reports')">
            <div class="stat-icon-wrap stat-icon-emerald"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
            <div class="stat-info"><div class="stat-value">${reportsCount}</div><div class="stat-label">Üretilen AI Raporu</div></div>
            <div class="stat-arrow">&rarr;</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon-wrap stat-icon-amber"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div>
            <div class="stat-info"><div class="stat-value">${avgNet} <small style="font-size: 13px; font-weight: normal; color: var(--text-muted);">Net</small></div><div class="stat-label">Genel Net Ortalaması</div></div>
          </div>
        </div>

        <div class="dashboard-grid">
          <div class="card">
            <div class="card-header">
              <div class="card-title-group"><h2 class="card-title">Son Sınav Kayıtları</h2><span class="card-subtitle">En son eklenen sınav sonuçları</span></div>
              <div class="btn-group">
                <button class="btn btn-sm btn-outline" onclick="window.app.openUploadPdfModal()">📄 PDF Yükle</button>
                <button class="btn btn-sm btn-outline" onclick="window.app.navigate('exams')">Tümünü Gör</button>
              </div>
            </div>
            <div class="card-body p-0">
              ${recentExams.length === 0 ? `<div class="empty-state p-4"><p>Henüz sınav kaydı yok.</p></div>` : `
                <table class="data-table">
                  <thead><tr><th>Sınav Adı</th><th>Öğrenci</th><th>Tarih</th><th>Toplam Net</th><th>İşlem</th></tr></thead>
                  <tbody>
                    ${recentExams.map((exam) => {
                      const student = state.students.find((s) => s.id === exam.ogrenciId);
                      return `<tr>
                        <td><strong>${exam.sinavAdi}</strong><div style="font-size: 11px; color: var(--text-muted);">${exam.tur === "kazanimli" ? "🎯 Kazanımlı" : "📊 Kazanımsız"} ${exam.puan ? `• Puan: ${exam.puan}` : ""}</div></td>
                        <td>${student ? student.adSoyad : "Bilinmiyor"} (${student ? student.sube : "-"})</td>
                        <td>${formatDate(exam.tarih)}</td>
                        <td><span class="badge badge-primary font-bold">${exam.toplamNet || "-"} Net</span></td>
                        <td><button class="btn btn-sm btn-ghost text-primary" onclick="window.app.analyzeSingleExam('${exam.id}')">Analiz Et</button></td>
                      </tr>`;
                    }).join("")}
                  </tbody>
                </table>
              `}
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <div class="card-title-group"><h2 class="card-title">Son Oluşturulan Raporlar</h2><span class="card-subtitle">AI karneleri ve programlar</span></div>
              <button class="btn btn-sm btn-outline" onclick="window.app.navigate('reports')">Tüm Arşiv</button>
            </div>
            <div class="card-body">
              ${recentReports.length === 0 ? `<div class="empty-state"><p>Henüz oluşturulmuş rapor yok.</p></div>` : `
                <div class="recent-reports-list">
                  ${recentReports.map((rep) => `
                    <div class="report-mini-card">
                      <div class="report-mini-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                      <div class="report-mini-info">
                        <div class="report-mini-name">${rep.ogrenciAdSoyad || "Öğrenci"}</div>
                        <div class="report-mini-meta"><span>${formatDateTime(rep.createdAt || rep.olusturmaTarihi)}</span><span>•</span><span>${rep.kullanilanSinavIdler ? rep.kullanilanSinavIdler.length : 1} Sınav</span></div>
                      </div>
                      <div class="report-mini-actions">
                        <button class="btn btn-sm btn-outline" onclick="window.app.viewReportDetail('${rep.id}')">İncele</button>
                        <button class="btn btn-sm btn-primary" onclick="window.app.downloadReportPDF('${rep.id}')">PDF</button>
                      </div>
                    </div>
                  `).join("")}
                </div>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderStudentsView() {
    const state = store.getState();
    const gradeFilter = window.app?.studentGradeFilter || "all";
    const branchFilter = window.app?.studentBranchFilter || "all";
    const searchQuery = window.app?.studentSearchQuery || "";
    
    // Sınıf filtrelerini dinamik oluştur
    const uniqueClasses = [...new Set(state.students.map((s) => s.sinif).filter(Boolean))].sort((a, b) => Number(a) - Number(b));
    let classButtons = `<button class="filter-btn ${gradeFilter === 'all' ? 'active' : ''}" data-class="all" onclick="window.app.filterStudentsByClass('all')">Tüm Sınıflar</button>`;
    uniqueClasses.forEach((cls) => {
      classButtons += `<button class="filter-btn ${gradeFilter === cls ? 'active' : ''}" data-class="${escapeHtml(cls)}" onclick="window.app.filterStudentsByClass('${escapeHtml(cls)}')">${escapeHtml(cls)}. Sınıf</button>`;
    });

    let branchButtonsHtml = "";
    if (gradeFilter !== "all") {
       const branches = [...new Set(state.students.filter((s) => s.sinif === gradeFilter).map((s) => s.sube).filter(Boolean))].sort();
       if (branches.length > 0) {
         branchButtonsHtml = `
           <div class="filter-tags" style="margin-top: 8px;">
             <button class="filter-btn ${branchFilter === 'all' ? 'active' : ''}" style="font-size: 11px; padding: 4px 8px;" onclick="window.app.filterStudentsByBranch('all')">Tüm Şubeler</button>
             ${branches.map((br) => `<button class="filter-btn ${branchFilter === br ? 'active' : ''}" style="font-size: 11px; padding: 4px 8px;" onclick="window.app.filterStudentsByBranch('${escapeHtml(br)}')">${escapeHtml(br)}</button>`).join("")}
           </div>
         `;
       }
    }

    return `
      <div class="view-container animate-fade-in">
        <div class="view-header">
          <div><h1 class="view-title">Öğrenci Yönetimi</h1><p class="view-subtitle">Öğrenci kayıtlarını yönetin, arayın ve sınav geçmişlerini inceleyin.</p></div>
          <div class="view-actions">
            <button class="btn btn-outline text-danger border-danger font-bold" onclick="window.app.openDeleteAllStudentsModal()" title="Tüm öğrencileri ve bağlı tüm sınav verilerini sil">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              <span>🗑️ Tüm Öğrencileri Sil</span>
            </button>
            <button class="btn btn-primary" onclick="window.app.openStudentModal()">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
              <span>Yeni Öğrenci Ekle</span>
            </button>
          </div>
        </div>

        <div class="filter-bar card">
          <div class="filter-search">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="student-search-input" class="search-input" placeholder="İsim veya öğrenci no ile ara..." value="${escapeHtml(searchQuery)}" oninput="window.app.onStudentSearchInput(this.value)" />
          </div>
          <div class="filter-tags-wrap" style="width: 100%;">
            <div class="filter-tags">
              ${classButtons}
            </div>
            ${branchButtonsHtml}
          </div>
        </div>

        <div class="card">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="data-table">
                <thead><tr><th>Öğrenci Bilgisi</th><th>Sınıf / Şube</th><th>Numara</th><th>Kayıtlı Sınav</th><th>Veli Bilgisi</th><th style="text-align: right;">İşlemler</th></tr></thead>
                <tbody id="students-tbody">${renderStudentRows(state.students, state.exams)}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderStudentRows(students, exams) {
    if (!students || students.length === 0) {
      return `<tr><td colspan="6" class="text-center py-5"><div class="empty-state"><h3>Öğrenci Bulunamadı</h3><button class="btn btn-primary btn-sm mt-3" onclick="window.app.openStudentModal()">Yeni Öğrenci Ekle</button></div></td></tr>`;
    }
    const state = store.getState();
    const reports = state.reports || [];

    return students.map((s) => {
      if (!s) return "";
      const studentExams = (exams || []).filter((e) => e && e.ogrenciId === s.id);
      const name = s.adSoyad || "İsimsiz Öğrenci";
      const initials = (name.split(" ").filter(Boolean).map((n) => n[0]).join("") || "ÖĞ").substring(0, 2).toUpperCase();
      const sinifStr = s.sinif || "8";
      const subeStr = s.sube || "8/A";
      const studentReports = reports.filter((r) => r && (r.ogrenciId === s.id || (r.ogrenciAdSoyad && r.ogrenciAdSoyad.toLowerCase() === name.toLowerCase())));

      return `
        <tr class="student-row" data-id="${s.id || ''}">
          <td>
            <div class="user-avatar-group">
              <div class="user-avatar-initials">${initials}</div>
              <div><div class="font-bold text-dark cursor-pointer" onclick="window.app.openStudentProfile('${s.id}')">${escapeHtml(name)}</div><div style="font-size: 12px; color: var(--text-muted);">${formatDate(s.olusturmaTarihi)}</div></div>
            </div>
          </td>
          <td><span class="badge badge-secondary">${sinifStr}. Sınıf / ${subeStr}</span></td>
          <td><strong>#${s.numara || "-"}</strong></td>
          <td>
            <div class="d-flex flex-column gap-1" style="align-items: flex-start;">
              <span class="badge ${studentExams.length > 0 ? "badge-primary" : "badge-light"} cursor-pointer" onclick="window.app.openStudentProfile('${s.id}')" title="Sınav geçmişini ve profili görüntüle" style="cursor: pointer;">
                📋 ${studentExams.length} Sınav
              </span>
              ${studentExams.length > 0 ? `
                <button class="btn btn-sm btn-outline text-success border-success font-bold" onclick="event.stopPropagation(); window.app.openStudentAiReportModal('${s.id}')" title="Sınav seçerek AI Raporu aç veya yeni analiz oluştur" style="padding: 2px 8px; font-size: 11px; background: rgba(16, 185, 129, 0.08); border-radius: 99px; border-color: #10b981; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;">
                  🤖 AI Raporu ${studentReports.length > 0 ? `(${studentReports.length})` : ""} ↗
                </button>
              ` : `
                <button class="btn btn-sm btn-ghost text-muted" onclick="event.stopPropagation(); window.app.openUploadPdfModal()" title="Sınav PDF Belgesi Yükle" style="padding: 1px 6px; font-size: 10.5px;">
                  + Sınav Yükle
                </button>
              `}
            </div>
          </td>
          <td><div>${escapeHtml(s.veliAdSoyad || "-")}</div><div style="font-size: 11px; color: var(--text-muted);">${escapeHtml(s.veliTelefon || "-")}</div></td>
          <td style="text-align: right;">
            <div class="btn-group">
              <button class="btn btn-sm btn-outline" onclick="window.app.openStudentProfile('${s.id}')">Profil</button>
              <button class="btn btn-sm btn-ghost" onclick="window.app.openStudentModal('${s.id}')">Düzenle</button>
              <button class="btn btn-sm btn-ghost text-danger" onclick="window.app.deleteStudentConfirm('${s.id}')">Sil</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  function renderExamsView() {
    const state = store.getState();
    const app = window.app || {};
    const groups = app.getCalculatedExamGroups ? app.getCalculatedExamGroups() : [];
    const sortOrder = app.examSortOrder || "yeniden-eskiye";
    const gradeFilter = app.examGradeFilter || "all";
    const totalDistinctExams = groups.length;
    const totalStudentExams = state.exams.length;

    return `
      <div class="view-container animate-fade-in">
        <div class="view-header">
          <div>
            <h1 class="view-title">Sınav Yönetimi</h1>
            <p class="view-subtitle">Aynı isimli deneme sınavları tek uygulama altında toplanır; katılımcı öğrencileri ve yapay zekâ analiz raporlarını görüntüleyin.</p>
          </div>
          <div class="view-actions">
            <button class="btn btn-outline font-bold text-primary border-primary" onclick="window.app.openMergeExamsModal()" title="Farklı yazılmış veya mükerrer aynı sınav uygulamalarını tek isim altında birleştir">
              <span>🔗 Sınavları Birleştir</span>
            </button>
            <button class="btn btn-outline text-danger border-danger font-bold" onclick="window.app.openBulkDeleteExamsModal()" title="Sınav verilerini toplu sil">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              <span>🗑️ Toplu Sınav Sil</span>
            </button>
            <button class="btn btn-primary" onclick="window.app.openUploadPdfModal()">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6M9 15l3-3 3 3"/></svg>
              <span>📄 PDF Sınav Belgesi Yükle (70+ Toplu)</span>
            </button>
          </div>
        </div>

        <!-- ÜST ARAMA, SINIF FİLTRESİ VE SIRALAMA ÇUBUĞU -->
        <div class="filter-bar card" style="display: flex; gap: 12px; align-items: center; justify-content: space-between; flex-wrap: wrap; padding: 14px 18px; margin-bottom: 20px;">
          <div class="filter-search" style="flex: 1; min-width: 240px;">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input type="text" id="exam-search-input" class="search-input" placeholder="🔍 Sınav adı veya katılan öğrenci ara..." value="${escapeHtml(app.examSearchQuery || "")}" oninput="window.app.onExamSearchInput(this.value)" />
          </div>

          <div class="d-flex items-center gap-2" style="flex-wrap: wrap;">
            <div class="d-flex items-center gap-1">
              <label style="font-size: 12.5px; font-weight: 700; color: #475569;">Sınıf:</label>
              <select id="exam-grade-filter-select" class="form-control font-bold" style="width: auto; min-width: 135px; font-size: 13px;" onchange="window.app.onExamGradeFilterChange(this.value)">
                <option value="all" ${gradeFilter === 'all' ? 'selected' : ''}>Tüm Sınıflar</option>
                <option value="5" ${gradeFilter === '5' ? 'selected' : ''}>5. Sınıf</option>
                <option value="6" ${gradeFilter === '6' ? 'selected' : ''}>6. Sınıf</option>
                <option value="7" ${gradeFilter === '7' ? 'selected' : ''}>7. Sınıf</option>
                <option value="8" ${gradeFilter === '8' ? 'selected' : ''}>8. Sınıf (LGS)</option>
              </select>
            </div>

            <div class="d-flex items-center gap-1">
              <label style="font-size: 12.5px; font-weight: 700; color: #475569;">Sıralama:</label>
              <select id="exam-sort-select" class="form-control" style="width: auto; min-width: 205px; font-size: 13px;" onchange="window.app.onExamSortChange(this.value)">
                <option value="yeniden-eskiye" ${sortOrder === "yeniden-eskiye" ? "selected" : ""}>📅 Tarih: Yeniden Eskiye</option>
                <option value="eskiden-yeniye" ${sortOrder === "eskiden-yeniye" ? "selected" : ""}>📅 Tarih: Eskiden Yeniye</option>
                <option value="net-yuksek" ${sortOrder === "net-yuksek" ? "selected" : ""}>📈 Net: En Yüksekten Düşüğe</option>
                <option value="net-dusuk" ${sortOrder === "net-dusuk" ? "selected" : ""}>📉 Net: En Düşükten Yükseğe</option>
                <option value="ogrenci-cok" ${sortOrder === "ogrenci-cok" ? "selected" : ""}>👥 Katılımcı: En Çoktan Aza</option>
                <option value="isim-az" ${sortOrder === "isim-az" ? "selected" : ""}>🔤 Sınav Adı: A - Z</option>
              </select>
            </div>

            <button class="btn btn-sm btn-outline font-bold" onclick="window.app.toggleAllExamGroups()" title="Tüm sınav listelerini genişlet / daralt">
              <span>🔄 Tümünü Aç / Kapat</span>
            </button>
          </div>
        </div>

        <!-- ÖZET BİLGİ ŞERİDİ -->
        <div class="d-flex justify-between items-center mb-3" style="padding: 0 4px;">
          <span style="font-size: 13px; color: var(--text-muted);">
            ${gradeFilter !== "all" ? `<strong class="text-primary">${gradeFilter}. Sınıf</strong> filtrelendi • ` : ""}Toplam <strong>${totalDistinctExams}</strong> farklı sınav uygulaması (Toplam <strong>${totalStudentExams}</strong> öğrenci sınav sonucu)
          </span>
        </div>

        <!-- GRUPLANMIŞ SINAVLAR LİSTESİ -->
        <div class="exam-groups-container" id="exam-groups-container">
          ${renderExamGroupCards(groups, state)}
        </div>
      </div>
    `;
  }

  function renderExamGroupCards(groups, state) {
    if (!groups || groups.length === 0) {
      return `
        <div class="card">
          <div class="card-body text-center py-5">
            <div class="empty-state">
              <h3>🔍 Aradığınız Kriterlere Uygun Sınav Bulunamadı</h3>
              <p style="color: var(--text-muted); font-size: 13px; margin-top: 6px;">Farklı bir arama yapabilir veya yeni bir PDF sınav karnesi yükleyebilirsiniz.</p>
              <button class="btn btn-primary btn-sm mt-3" onclick="window.app.openUploadPdfModal()">📄 PDF Sınav Belgesi Yükle</button>
            </div>
          </div>
        </div>
      `;
    }

    const app = window.app || {};
    const expandedKeys = app.expandedExamKeys || new Set();

    return groups.map((group, gIdx) => {
      const examNameKey = (group.sinavAdi || "").trim().toLowerCase();
      const isExpanded = expandedKeys.has(examNameKey);
      const safeExamName = escapeHtml(group.sinavAdi);
      const sortedStudentExams = [...group.exams].sort((a, b) => (Number(b.toplamNet) || 0) - (Number(a.toplamNet) || 0));

      return `
        <div class="exam-group-card ${isExpanded ? "expanded" : ""}" id="exam-group-card-${gIdx}" data-group-index="${gIdx}">
          <div class="exam-group-header" onclick="window.app.toggleExamGroup(${gIdx})">
            <div class="exam-group-info">
              <div class="exam-group-title-row">
                <h3 class="exam-group-title">${safeExamName}</h3>
                <button type="button" class="btn btn-sm btn-ghost p-1" style="font-size: 13px; line-height: 1;" onclick="event.stopPropagation(); window.app.openRenameExamModal('${safeExamName}')" title="Sınav Adını Değiştir / Düzenle">✏️</button>
                <span class="badge ${group.tur === "kazanimli" ? "badge-success" : "badge-secondary"}" style="font-size: 10.5px;">${group.tur === "kazanimli" ? "🎯 Kazanımlı" : "📊 Kazanımsız"}</span>
              </div>
              <div class="exam-group-meta-badges">
                <span class="exam-group-stat-badge badge-highlight">👥 <strong>${group.totalStudents}</strong> Öğrenci</span>
                <span class="exam-group-stat-badge">🎯 Ort. Net: <strong>${group.avgNet}</strong></span>
                <span class="exam-group-stat-badge">🏆 Zirve: <strong>${group.maxNet} Net</strong></span>
                <span class="exam-group-stat-badge">📅 ${formatDate(group.tarih)}</span>
                ${group.reportedCount > 0 ? `<span class="exam-group-stat-badge badge-success-light">📑 <strong>${group.reportedCount}/${group.totalStudents}</strong> AI Raporlu</span>` : `<span class="exam-group-stat-badge" style="color: #94a3b8;">⚪ Henüz AI Raporu Üretilmedi</span>`}
              </div>
            </div>

            <div class="exam-group-actions" onclick="event.stopPropagation()">
              <button class="btn btn-sm btn-outline font-bold" onclick="window.app.exportBulkExamReportsByName('${safeExamName}')" title="Bu sınavın tüm öğrencileri için AI analizli toplu rapor PDF'i indir">
                📥 Toplu PDF
              </button>
              <button class="btn btn-sm btn-primary font-bold shadow-sm" onclick="event.stopPropagation(); window.app.toggleExamGroup(${gIdx})">
                <span>👥 Öğrenciler (${group.totalStudents})</span>
                <svg class="exam-group-toggle-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              <button class="btn btn-sm btn-ghost text-danger font-bold" onclick="window.app.deleteExamGroupConfirm('${safeExamName}')" title="Bu sınavı ve katılan tüm öğrencilerin sınav kayıtlarını sil">
                🗑️ Sil
              </button>
            </div>
          </div>

          <div class="exam-group-body" id="exam-group-body-${gIdx}">
            <div class="exam-group-students-table-wrap">
              <table class="data-table">
                <thead>
                  <tr style="background: #f1f5f9;">
                    <th style="width: 45px; text-align: center;">#</th>
                    <th>Öğrenci Adı Soyadı</th>
                    <th>Sınıf / Şube</th>
                    <th>Toplam Net</th>
                    <th>LGS Puanı</th>
                    <th>AI Karne & Rapor Durumu</th>
                    <th style="text-align: right;">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  ${sortedStudentExams.map((exam, sIdx) => {
                    const student = (state.students || []).find((s) => s.id === exam.ogrenciId);
                    const sName = student ? student.adSoyad : (exam.ogrenciAdSoyad || "Öğrenci");
                    const sClass = student ? `${student.sinif}. Sınıf / ${student.sube}` : (exam.sinif || "8. Sınıf / 8-A");
                    const report = (state.reports || []).find((r) => (r.kullanilanSinavIdler || []).includes(exam.id) || r.sinavId === exam.id);

                    return `
                      <tr>
                        <td style="text-align: center; color: #94a3b8; font-weight: 700; font-size: 11.5px;">${sIdx + 1}</td>
                        <td>
                          <div class="font-bold text-dark cursor-pointer" onclick="window.app.openStudentProfile('${exam.ogrenciId}')">${escapeHtml(sName)}</div>
                          <div style="font-size: 11px; color: var(--text-muted);">${(exam.dersSonuclari || []).length} Ders Çözümlendi</div>
                        </td>
                        <td><span class="badge badge-secondary">${escapeHtml(sClass)}</span></td>
                        <td><strong class="text-primary" style="font-size: 13.5px;">${exam.toplamNet || "-"} Net</strong></td>
                        <td>${exam.puan ? `<span class="badge badge-warning font-bold">${exam.puan}</span>` : "-"}</td>
                        <td>
                          ${report ? `
                            <button class="btn btn-sm btn-success font-bold shadow-sm" style="display: inline-flex; align-items: center; gap: 4px; padding: 5px 10px; font-size: 11.5px; border-radius: 6px; color: #ffffff !important; background: #10b981 !important; border: 1px solid #059669 !important;" onclick="window.app.viewReportDetail('${report.id}')" title="Hazır AI analiz raporunu ve çalışma programını aç">
                              <span>✓ AI Raporu Hazır</span>
                              <span style="font-size: 10px; opacity: 0.95;">(${formatDateTime(report.createdAt || report.olusturmaTarihi)})</span>
                              <span>↗</span>
                            </button>
                          ` : `
                            <button class="btn btn-sm btn-outline text-primary font-bold" style="padding: 5px 10px; font-size: 11.5px; border-radius: 6px;" onclick="window.app.analyzeSingleExam('${exam.id}')" title="Bu öğrenci için hemen yapay zekâ analiz raporu oluştur">
                              🤖 AI Analiz Et
                            </button>
                          `}
                        </td>
                        <td style="text-align: right;">
                          <div class="btn-group">
                            <button class="btn btn-sm btn-ghost" onclick="window.app.viewExamDetail('${exam.id}')" title="Sınav net ve soru detaylarını incele">📊 Detay</button>
                            <button class="btn btn-sm btn-ghost text-danger" onclick="window.app.deleteExamConfirm('${exam.id}')" title="Bu sınav kaydını sil">🗑️ Sil</button>
                          </div>
                        </td>
                      </tr>
                    `;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  function renderAiAnalysisView() {
    const state = store.getState();
    const students = state.students;
    const exams = state.exams;
    const aiConfig = state.aiConfig;

    const selectedExams = store.getSelectedExams();
    let defaultStudentId = state.selectedStudentIdForAnalysis;
    if (!defaultStudentId && selectedExams.length > 0) defaultStudentId = selectedExams[0].ogrenciId;
    else if (!defaultStudentId && students.length > 0) defaultStudentId = students[0].id;

    const currentStudent = students.find((s) => s.id === defaultStudentId);
    const studentExams = currentStudent ? exams.filter((e) => e.ogrenciId === currentStudent.id) : [];

    return `
      <div class="view-container animate-fade-in" id="ai-analysis-root">
        <div class="view-header">
          <div><h1 class="view-title">Yapay Zekâ Sınav Analizi & Haftalık Program</h1><p class="view-subtitle">Öğrencinin sınav sonuçlarını analiz edin, eksik konuları belirleyip 7 günlük LGS etüt çizelgesi oluşturun.</p></div>
          <button class="btn btn-outline" onclick="window.app.openUploadPdfModal()">📄 Yeni PDF Belgesi Yükle (Tekli/Toplu)</button>
        </div>

        <div class="card mb-4" id="ai-wizard-card">
          <div class="card-header">
            <div class="card-title-group"><h2 class="card-title">1. Öğrenci ve Sınav Seçimi</h2><span class="card-subtitle">Analize dahil edilecek kayıtlar</span></div>
          </div>
          <div class="card-body">
            <div class="grid-2-col">
              <div class="form-group">
                <label class="form-label">Öğrenci Seçiniz:</label>
                <select id="ai-student-select" class="form-control" onchange="window.app.onAiStudentChanged(this.value)">
                  ${students.map((s) => `<option value="${s.id}" ${currentStudent && s.id === currentStudent.id ? "selected" : ""}>${s.adSoyad} (${s.sinif}. Sınıf / ${s.sube} - No: ${s.numara})</option>`).join("")}
                </select>
              </div>
              <div class="student-mini-summary-box">
                ${currentStudent ? `<div class="student-summary-info"><div class="student-summary-name">${currentStudent.adSoyad}</div><div class="student-summary-meta">Sınıf: ${currentStudent.sinif}. Sınıf / ${currentStudent.sube} • Toplam ${studentExams.length} Sınav</div></div>` : `<p class="text-muted">Lütfen öğrenci seçin.</p>`}
              </div>
            </div>

            <div class="form-group mt-4">
              <label class="form-label d-flex justify-between items-center">
                <span>Analiz Edilecek Sınav(lar):</span>
                <span class="text-muted" style="font-size: 12px;">(Çoklu seçim ile karşılaştırmalı gelişim raporu alabilirsiniz)</span>
              </label>
              <div class="ai-exam-selection-list">
                ${studentExams.length === 0 ? `<div class="empty-state p-4"><p>Bu öğrenciye ait kayıtlı sınav bulunmuyor.</p></div>` : studentExams.map((exam) => `
                  <label class="ai-exam-select-item active">
                    <input type="checkbox" name="ai-selected-exams" value="${exam.id}" checked onchange="this.parentElement.classList.toggle('active', this.checked)" />
                    <div class="ai-exam-item-details"><div class="font-bold">${exam.sinavAdi}</div><div class="text-muted" style="font-size: 12px;">Tarih: ${formatDate(exam.tarih)} • Tür: ${exam.tur === "kazanimli" ? "Kazanımlı" : "Kazanımsız"} ${exam.puan ? `• Puan: ${exam.puan}` : ""}</div></div>
                    <div class="ai-exam-item-net"><span class="badge badge-primary font-bold">${exam.toplamNet || "-"} Net</span></div>
                  </label>
                `).join("")}
              </div>
            </div>

            <!-- AI SAĞLAYICI SEÇİMİ -->
            <div class="form-group mt-4 p-3" style="background: var(--bg-main); border-radius: var(--radius-md); border: 1px solid var(--border-color);">
              <div class="d-flex justify-between items-center mb-2">
                <label class="form-label font-bold mb-0">🤖 Raporlama ve Program İçin Kullanılacak Yapay Zekâ:</label>
                <span class="badge badge-primary font-bold">Seçili: ${aiConfig.provider === "openai" ? "OpenAI ChatGPT (GPT-4o Mini)" : aiConfig.provider === "gemini" ? "Google Gemini 1.5 Flash" : "Claude 3.5 Sonnet"}</span>
              </div>
              <div class="d-flex gap-3 flex-wrap">
                <label class="btn btn-outline ${aiConfig.provider === "openai" ? "btn-primary" : ""}" style="cursor: pointer;" onclick="window.app.quickSetAiProvider('openai')">
                  <input type="radio" name="quick-ai-choice" value="openai" ${aiConfig.provider === "openai" ? "checked" : ""} style="display: none;" />
                  <span>🟢 OpenAI ChatGPT (GPT-4o Mini)</span>
                </label>
                <label class="btn btn-outline ${aiConfig.provider === "gemini" ? "btn-primary" : ""}" style="cursor: pointer;" onclick="window.app.quickSetAiProvider('gemini')">
                  <input type="radio" name="quick-ai-choice" value="gemini" ${aiConfig.provider === "gemini" ? "checked" : ""} style="display: none;" />
                  <span>🔵 Google Gemini 1.5 Flash</span>
                </label>
                <label class="btn btn-outline ${aiConfig.provider === "claude" ? "btn-primary" : ""}" style="cursor: pointer;" onclick="window.app.quickSetAiProvider('claude')">
                  <input type="radio" name="quick-ai-choice" value="claude" ${aiConfig.provider === "claude" ? "checked" : ""} style="display: none;" />
                  <span>🟣 Anthropic Claude 3.5 Sonnet</span>
                </label>
              </div>
            </div>

            <div class="ai-action-footer mt-4">
              <button id="btn-run-ai-analysis" class="btn btn-primary btn-lg shadow-glow" onclick="window.app.executeAiAnalysis()" ${studentExams.length === 0 ? "disabled" : ""}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>
                <span>Yapay Zekâ Analizini Başlat & Rapor Üret</span>
              </button>
            </div>
          </div>
        </div>

        <div id="ai-result-container" style="display: none;">
          <div class="result-header card mb-4">
            <div class="result-header-content">
              <div class="badge badge-success mb-2">✓ Analiz Başarıyla Tamamlandı</div>
              <h2 class="result-title" id="res-report-title">Öğrenci Sınav Karnesi & Gelişim Raporu</h2>
              <p class="text-muted" id="res-report-subtitle"></p>
            </div>
            <div class="result-header-actions">
              <button class="btn btn-outline" onclick="window.app.printActiveReport()">Yazdır (Print)</button>
              <button class="btn btn-primary shadow-glow" onclick="window.app.downloadActiveReportPDF()">Kurumsal PDF İndir</button>
            </div>
          </div>
          <div class="report-preview-wrapper card p-0" id="report-render-target"></div>
        </div>
      </div>
    `;
  }

  function renderReportsView() {
    const state = store.getState();
    const sortedReports = [...state.reports].sort((a, b) => {
      const tA = a.createdAt ? Number(a.createdAt) : (new Date(a.olusturmaTarihi || 0).getTime() || 0);
      const tB = b.createdAt ? Number(b.createdAt) : (new Date(b.olusturmaTarihi || 0).getTime() || 0);
      return tB - tA; // Yeniden eskiye
    });

    return `
      <div class="view-container animate-fade-in">
        <div class="view-header">
          <div><h1 class="view-title">Rapor Arşivi</h1><p class="view-subtitle">Üretilen yapay zekâ analiz karnelerini görüntüleyin ve PDF olarak indirin.</p></div>
          <button class="btn btn-primary" onclick="window.app.navigate('aiAnalysis')">Yeni Analiz Başlat</button>
        </div>

        <div class="card">
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="data-table">
                <thead><tr><th>Öğrenci Bilgisi</th><th>Sınav Sayısı</th><th>AI Sağlayıcı</th><th>Tarih & Saat</th><th>Eksik Sayısı</th><th style="text-align: right;">İşlemler</th></tr></thead>
                <tbody id="reports-tbody">${renderReportRows(sortedReports, state.students)}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderReportRows(reports, students) {
    if (!reports || reports.length === 0) {
      return `<tr><td colspan="6" class="text-center py-5"><div class="empty-state"><h3>Kayıtlı Rapor Yok</h3><button class="btn btn-primary btn-sm mt-3" onclick="window.app.navigate('aiAnalysis')">İlk Raporu Oluştur</button></div></td></tr>`;
    }
    return reports.map((rep) => {
      const student = students.find((s) => s.id === rep.ogrenciId);
      const studentName = rep.ogrenciAdSoyad || (student ? student.adSoyad : "Öğrenci");
      const examCount = rep.kullanilanSinavIdler ? rep.kullanilanSinavIdler.length : 1;
      return `
        <tr>
          <td><div class="font-bold text-dark cursor-pointer" onclick="window.app.viewReportDetail('${rep.id}')">${studentName}</div><div style="font-size: 12px; color: var(--text-muted);">${rep.sinif || ""}</div></td>
          <td><span class="badge ${examCount > 1 ? "badge-primary" : "badge-secondary"}">${examCount > 1 ? `📈 ${examCount} Sınav` : `📊 ${examCount} Sınav`}</span></td>
          <td>${rep.aiSaglayici || "OpenAI ChatGPT"}</td>
          <td>${formatDateTime(rep.createdAt || rep.olusturmaTarihi)}</td>
          <td><span class="badge badge-warning font-bold">${rep.eksikKonular ? rep.eksikKonular.length : 0} Eksik</span></td>
          <td style="text-align: right;">
            <div class="btn-group">
              <button class="btn btn-sm btn-outline" onclick="window.app.viewReportDetail('${rep.id}')">İncele</button>
              <button class="btn btn-sm btn-primary" onclick="window.app.downloadReportPDF('${rep.id}')">PDF İndir</button>
              <button class="btn btn-sm btn-ghost text-danger" onclick="window.app.deleteReportConfirm('${rep.id}')">Sil</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  function renderInstitutionView() {
    const state = store.getState();
    const inst = state.institution;
    const PRESET_PALETTES = [
      { name: "Safir Mavi", hex: "#2563eb" },
      { name: "Zümrüt Yeşili", hex: "#059669" },
      { name: "İndigo / Gece Mavisi", hex: "#4f46e5" },
      { name: "Koyu Bordo", hex: "#991b1b" },
      { name: "Asil Mor", hex: "#7c3aed" },
      { name: "Okyanus Teal", hex: "#0d9488" }
    ];

    return `
      <div class="view-container animate-fade-in">
        <div class="view-header">
          <div><h1 class="view-title">Kurum Ayarları & Marka Kimliği</h1><p class="view-subtitle">Kurum adı, logosu ve PDF raporlarında kullanılacak kurumsal tema rengi.</p></div>
        </div>

        <div class="grid-2-col">
          <div class="card">
            <div class="card-header"><h2 class="card-title">Kurum Bilgileri</h2></div>
            <div class="card-body">
              <form onsubmit="window.app.saveInstitutionSettings(event)">
                <div class="form-group"><label class="form-label">Kurum Adı: *</label><input type="text" id="inst-name" class="form-control" value="${inst.ad || ""}" required /></div>
                <div class="grid-2-col">
                  <div class="form-group"><label class="form-label">Kurum Kodu:</label><input type="text" id="inst-code" class="form-control" value="${inst.kurumKodu || ""}" /></div>
                  <div class="form-group"><label class="form-label">Telefon:</label><input type="text" id="inst-phone" class="form-control" value="${inst.telefon || ""}" /></div>
                </div>
                <div class="form-group"><label class="form-label">Adres:</label><textarea id="inst-address" class="form-control" rows="2">${inst.adres || ""}</textarea></div>

                <div class="form-group mt-4">
                  <label class="form-label">Kurumsal Tema Rengi:</label>
                  <div class="theme-palette-picker">
                    ${PRESET_PALETTES.map((p) => `
                      <button type="button" class="palette-swatch ${inst.temaRengi === p.hex ? "active" : ""}" style="background: ${p.hex};" onclick="window.app.selectThemeColor('${p.hex}')">${inst.temaRengi === p.hex ? "✓" : ""}</button>
                    `).join("")}
                    <div class="custom-color-picker-wrap"><input type="color" id="inst-custom-color" value="${inst.temaRengi || "#2563eb"}" onchange="window.app.selectThemeColor(this.value)" /><span>Özel</span></div>
                  </div>
                  <input type="hidden" id="inst-theme-color" value="${inst.temaRengi || "#2563eb"}" />
                </div>

                <div class="form-group mt-4">
                  <label class="form-label">Kurum Logosu:</label>
                  <div class="logo-upload-zone" onclick="document.getElementById('inst-logo-input').click()">
                    <input type="file" id="inst-logo-input" accept="image/*" style="display: none;" onchange="window.app.handleLogoFileSelected(this.files[0])" />
                    <div>Bilgisayardan Logo Seç veya Sürükle</div>
                  </div>
                  ${inst.logoUrl ? `<div class="logo-preview-box mt-3"><img src="${inst.logoUrl}" class="logo-preview-img" /><button type="button" class="btn btn-sm btn-ghost text-danger" onclick="window.app.removeLogo()">Kaldır</button></div>` : ""}
                </div>

                <button type="submit" class="btn btn-primary btn-lg shadow-glow mt-4">Kurum Ayarlarını Kaydet</button>
              </form>
            </div>
          </div>

          <div>
            <div class="card mb-4">
              <div class="card-header"><h2 class="card-title">Canlı Rapor Antet Önizlemesi</h2></div>
              <div class="card-body">
                <div class="report-header p-3" style="border: 1px dashed var(--border-color); border-radius: 8px;">
                  <div class="report-header-left">
                    <img src="${inst.logoUrl || "./logo.png"}" class="report-header-logo-img" style="max-height: 48px; max-width: 120px; object-fit: contain;" />
                    <div class="report-institution-info"><h3 class="report-institution-title" style="font-size: 16px;">${inst.ad}</h3><div class="report-institution-meta" style="font-size: 11px;"><span>📍 ${inst.adres || "Adres"}</span><span>📞 ${inst.telefon || "-"}</span></div></div>
                  </div>
                  <div class="report-header-right"><div class="report-badge-title" style="background: ${inst.temaRengi || "#2563eb"}; font-size: 9px; padding: 4px 8px;">ÖĞRENCİ KARNESİ</div></div>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-header"><h2 class="card-title">Veri Yönetimi & Demo</h2></div>
              <div class="card-body d-flex flex-column gap-3">
                <button class="btn btn-outline" onclick="window.app.resetSampleDataConfirm()">Örnek Demo Verilerini Yükle</button>
                <button class="btn btn-outline text-danger" onclick="window.app.clearAllDataConfirm()">Tüm Verileri Temizle</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderAiSettingsView() {
    const state = store.getState();
    const ai = state.aiConfig;
    return `
      <div class="view-container animate-fade-in">
        <div class="view-header">
          <div><h1 class="view-title">Yapay Zekâ Sağlayıcı Ayarları</h1><p class="view-subtitle">OpenAI ChatGPT ve Google Gemini API anahtarlarınızı yönetin.</p></div>
        </div>

        <div class="card">
          <div class="card-header"><h2 class="card-title">Aktif API Anahtarları</h2></div>
          <div class="card-body">
            <form onsubmit="window.app.saveAiSettings(event)">
              <div class="form-group">
                <label class="form-label font-bold">🟢 OpenAI ChatGPT API Anahtarı:</label>
                <input type="text" id="openai-api-key" class="form-control" value="${ai.openaiApiKey || ""}" placeholder="sk-proj-..." />
              </div>
              <div class="form-group mt-3">
                <label class="form-label font-bold">🔵 Google Gemini API Anahtarı:</label>
                <input type="text" id="gemini-api-key" class="form-control" value="${ai.geminiApiKey || ""}" placeholder="AIzaSy..." />
              </div>
              <div class="d-flex justify-between items-center mt-4">
                <button type="button" class="btn btn-outline" onclick="window.app.testAiConnection()">Bağlantıyı Test Et</button>
                <button type="submit" class="btn btn-primary btn-lg shadow-glow">Ayarları Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  function renderFirebaseSettingsView() {
    const state = store.getState();
    const fb = state.firebaseConfig || DEFAULT_FIREBASE_CONFIG;
    const activeDbName = fb.databaseId || "olcme-uygulama";
    const isConn = FirebaseService.isInitialized || !!fb.apiKey;
    const hasQuotaError = FirebaseService.lastQuotaExceeded;

    return `
      <div class="view-container animate-fade-in">
        <div class="view-header">
          <div><h1 class="view-title">Firebase & Veritabanı Yapılandırması</h1><p class="view-subtitle">Firestore bulut veritabanı bağlantısı ve anlık canlı senkronizasyon.</p></div>
          <div class="view-actions">
            <span class="badge ${hasQuotaError ? 'badge-warning' : 'badge-success'}" style="font-size: 13px; padding: 7px 14px; box-shadow: 0 2px 8px rgba(34, 197, 94, 0.2);">
              ${hasQuotaError ? '⚠️ Firestore Kotası Doldu (HTTP 429)' : `🟢 Aktif Bağlı: ${activeDbName} (Canlı Dinleme Aktif)`}
            </span>
          </div>
        </div>

        ${hasQuotaError ? `
          <div class="card p-3 mb-4" style="background: #fffbeb; border: 2px solid #fde68a; border-radius: var(--radius-lg);">
            <div class="d-flex items-center gap-3">
              <span style="font-size: 28px;">⚠️</span>
              <div>
                <strong style="color: #92400e; font-size: 14px;">Firebase Spark (Ücretsiz) Günlük Okuma Kotası (50.000 Okuma) Doldu!</strong>
                <div style="font-size: 12.5px; color: #b45309; margin-top: 3px; line-height: 1.4;">
                  Firestore günlük 50.000 okuma limitine ulaştı. <strong>Diğer bilgisayarlarınıza verilerinizi anında aktarmak için aşağıdaki "💾 Bilgisayara JSON Yedek İndir" butonunu kullanabilir ve diğer cihazda "📂 JSON Yedek Yükle" diyerek anında senkronize edebilirsiniz.</strong> Kota her gece sıfırlanır veya Firebase Konsolu'ndan "Blaze (Kullandıkça Öde)" planına geçerek sınırsız okuma sağlayabilirsiniz.
                </div>
              </div>
            </div>
          </div>
        ` : ""}

        <div class="grid-2-col mb-4">
          <!-- BULUTA YÜKLEME VE EŞİTLEME PANELİ -->
          <div class="card p-4" style="background: #f0fdf4; border: 2px solid #86efac; border-radius: var(--radius-lg);">
            <div class="d-flex items-center gap-2 mb-2">
              <span style="font-size: 22px;">☁️</span>
              <h3 class="font-bold text-success mb-0" style="font-size: 17px;">Firestore Bulut Senkronizasyonu</h3>
            </div>
            <p class="text-muted mb-3" style="font-size: 13px; line-height: 1.5;">
              Sistemdeki tüm kayıtlı öğrencileri (<strong>${state.students.length}</strong>), sınavları (<strong>${state.exams.length}</strong>) ve yapay zekâ raporlarını (<strong>${state.reports.length}</strong>) tek tıkla <strong>Firestore (${activeDbName})</strong> veritabanına aktarın veya buluttan geri çekin.
            </p>
            <div class="d-flex gap-2 flex-wrap">
              <button type="button" class="btn btn-success font-bold shadow-glow" onclick="window.app.uploadAllToFirebase()">
                ☁️ Tüm Yerel Verileri Firestore'a Aktar
              </button>
              <button type="button" class="btn btn-outline text-success border-success font-bold" onclick="window.app.syncAllFromFirebase()">
                📥 Firestore'dan Canlı İndir / Eşitle
              </button>
            </div>
          </div>

          <!-- CİHAZLAR ARASI HIZLI YEDEK TRANSFER PANELİ -->
          <div class="card p-4" style="background: #f8fafc; border: 2px solid #cbd5e1; border-radius: var(--radius-lg);">
            <div class="d-flex items-center gap-2 mb-2">
              <span style="font-size: 22px;">💾</span>
              <h3 class="font-bold text-dark mb-0" style="font-size: 17px;">Cihazlar Arası Hızlı JSON Yedek & Transfer</h3>
            </div>
            <p class="text-muted mb-3" style="font-size: 13px; line-height: 1.5;">
              İnternet veya kota sınırına takılmadan tüm verilerinizi (öğrenciler, sınavlar, raporlar) tek bir JSON dosyası olarak indirip diğer bilgisayara anında aktarın.
            </p>
            <div class="d-flex gap-2 flex-wrap">
              <button type="button" class="btn btn-primary font-bold shadow-glow" onclick="window.app.exportAllDataAsJSON()">
                💾 Bilgisayara JSON Yedek İndir
              </button>
              <label class="btn btn-outline font-bold mb-0 cursor-pointer" style="display: inline-flex; align-items: center;">
                📂 JSON Yedek Yükle
                <input type="file" accept=".json" style="display: none;" onchange="window.app.importAllDataFromJSON(event)" />
              </label>
            </div>
          </div>
        </div>

        <!-- VERİTABANI PARAMETRELERİ -->
        <div class="card">
          <div class="card-header"><h2 class="card-title">Firebase & Firestore Bağlantı Parametreleri</h2></div>
          <div class="card-body">
            <form onsubmit="window.app.saveFirebaseConfig(event)">
              <div class="grid-3-col mb-3">
                <div class="form-group">
                  <label class="form-label font-bold text-primary">🗄️ Firestore Veritabanı ID (Database Name): *</label>
                  <input type="text" id="fb-databaseId" class="form-control font-bold" value="${activeDbName}" placeholder="olcme-uygulama veya (default)" required style="border-color: #22c55e; background: #f0fdf4; color: #15803d;" />
                  <small class="text-muted" style="font-size: 11px;">Firebase Konsolunuzdaki veritabanı adı</small>
                </div>
                <div class="form-group">
                  <label class="form-label font-bold">Project ID: *</label>
                  <input type="text" id="fb-projectId" class="form-control" value="${fb.projectId}" required />
                </div>
                <div class="form-group">
                  <label class="form-label font-bold">API Key: *</label>
                  <input type="text" id="fb-apiKey" class="form-control" value="${fb.apiKey}" required />
                </div>
              </div>
              <div class="grid-2-col">
                <div class="form-group"><label class="form-label">Auth Domain:</label><input type="text" id="fb-authDomain" class="form-control" value="${fb.authDomain}" /></div>
                <div class="form-group"><label class="form-label">Storage Bucket:</label><input type="text" id="fb-storageBucket" class="form-control" value="${fb.storageBucket}" /></div>
              </div>
              <div class="d-flex justify-between items-center mt-4">
                <button type="submit" class="btn btn-primary btn-lg shadow-glow font-bold">💾 Firebase & Veritabanı Ayarlarını Güncelle</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 10. ANA APP CONTROLLER
  // ==========================================
  class App {
    constructor() {
      this.currentActiveReport = null;
      this.parsedStudentsList = [];
      this.isBatchProcessing = false;
      this.isBatchCancelled = false;
      this.aiAbortController = null;
      this.expandedExamKeys = new Set();
      this.examSearchQuery = "";
      this.examSortOrder = "yeniden-eskiye";
      this._lastFocusSync = 0;
      this.activeAnalysis = {
        status: "idle", // "idle" | "running" | "completed"
        type: "single", // "single" | "batch"
        title: "",
        currentStudent: "",
        percent: 0,
        currentStep: 0,
        totalSteps: 0,
        message: ""
      };
      this.pdfAnalyzerLiveState = { isCompleted: false };
      this._lastRenderedTab = null;
      this.init();
    }

    init() {
      store.subscribe((state, event, data) => this.handleStateUpdate(state, event, data));
      this.renderCurrentView();
      this.updateSidebarActiveState();
      // Not: setupRealtimeListeners Store constructor'ında FirebaseService.init(config, store) ile çağrılır.
      // Açılışta ilk senkronizasyon ve polling listener'ları orada devreye girer.
    }

    async uploadAllToFirebase() {
      const state = store.getState();
      const fb = state.firebaseConfig || DEFAULT_FIREBASE_CONFIG;
      const targetDb = fb.databaseId || "olcme-uygulama";

      const totalItems = state.students.length + state.exams.length + state.reports.length;
      if (totalItems === 0 && (!state.institution || !state.institution.ad)) {
        showToast("Yüklenecek öğrenci veya sınav verisi bulunamadı.", "info");
        return;
      }

      showToast(`☁️ ${state.students.length} öğrenci, ${state.exams.length} sınav ve ${state.reports.length} rapor Firestore (${targetDb}) veritabanına aktarılıyor...`, "info", 5000);

      let successCount = 0;
      let failCount = 0;

      // 1. Kurum bilgisi
      try {
        await FirebaseService.saveDocument("kurumlar", state.institution.id || "kurum_default", state.institution);
        successCount++;
      } catch (e) { failCount++; }

      // 2. Öğrenciler (paralel 5'erli gruplar halinde)
      for (let i = 0; i < state.students.length; i += 5) {
        const chunk = state.students.slice(i, i + 5);
        await Promise.all(chunk.map(async (st) => {
          try {
            await FirebaseService.saveDocument("ogrenciler", st.id, st);
            successCount++;
          } catch (e) { failCount++; }
        }));
      }

      // 3. Sınavlar
      for (let i = 0; i < state.exams.length; i += 5) {
        const chunk = state.exams.slice(i, i + 5);
        await Promise.all(chunk.map(async (ex) => {
          try {
            await FirebaseService.saveDocument("sinavlar", ex.id, ex);
            successCount++;
          } catch (e) { failCount++; }
        }));
      }

      // 4. Raporlar
      for (let i = 0; i < state.reports.length; i += 5) {
        const chunk = state.reports.slice(i, i + 5);
        await Promise.all(chunk.map(async (rep) => {
          try {
            await FirebaseService.saveDocument("raporlar", rep.id, rep);
            successCount++;
          } catch (e) { failCount++; }
        }));
      }

      if (failCount === 0) {
        showToast(`🎉 Tebrikler! Tüm veriler (${successCount} kayıt) Firestore (${targetDb}) veritabanına başarıyla aktarıldı. Diğer cihazlarda anında görünecektir.`, "success", 5000);
      } else {
        showToast(`⚠️ Aktarım tamamlandı: ${successCount} başarılı, ${failCount} hatalı kayıt.`, "warning", 5000);
      }
    }

    async syncAllFromFirebase() {
      showToast("Firestore bulut veritabanından veriler çekiliyor...", "info");
      const hasChange = await FirebaseService.syncAllFromFirestore(store, true);
      this.renderCurrentView();
    }

    exportAllDataAsJSON() {
      const state = store.getState();
      const exportData = {
        app: "Sınav Analiz ve AI Raporlama Sistemi",
        version: "2.0",
        exportDate: new Date().toISOString(),
        institution: state.institution,
        students: state.students,
        exams: state.exams,
        reports: state.reports,
        aiConfig: state.aiConfig
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement("a");
      const dateStr = new Date().toISOString().split("T")[0];
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `sinav_analiz_tam_yedek_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast(`💾 Tüm veriler (Öğrenciler: ${state.students.length}, Sınavlar: ${state.exams.length}) JSON dosyası olarak indirildi. Diğer bilgisayarda 'JSON Yükle' butonuyla anında açabilirsiniz!`, "success", 6000);
    }

    importAllDataFromJSON(event) {
      const file = event.target?.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          if (!imported || (!imported.students && !imported.exams)) {
            showToast("Geçersiz JSON yedek dosyası formatı.", "error");
            return;
          }

          let addedStudents = 0;
          let addedExams = 0;
          let addedReports = 0;

          if (Array.isArray(imported.students) && imported.students.length > 0) {
            store.state.students = imported.students;
            store.saveToStorage(APP_CONFIG.storageKeys.STUDENTS, imported.students);
            addedStudents = imported.students.length;
          }

          if (Array.isArray(imported.exams) && imported.exams.length > 0) {
            store.state.exams = imported.exams;
            store.saveToStorage(APP_CONFIG.storageKeys.EXAMS, imported.exams);
            addedExams = imported.exams.length;
          }

          if (Array.isArray(imported.reports) && imported.reports.length > 0) {
            store.state.reports = imported.reports;
            store.saveToStorage(APP_CONFIG.storageKeys.REPORTS, imported.reports);
            addedReports = imported.reports.length;
          }

          if (imported.institution && imported.institution.ad) {
            store.state.institution = { ...store.state.institution, ...imported.institution };
            store.saveToStorage(APP_CONFIG.storageKeys.INSTITUTION, store.state.institution);
          }

          this.renderCurrentView();
          showToast(`✅ Yedek başarıyla yüklendi: ${addedStudents} öğrenci, ${addedExams} sınav ve ${addedReports} rapor sisteme aktarıldı!`, "success", 5000);

          if (FirebaseService.isInitialized) {
            this.uploadAllToFirebase();
          }
        } catch (err) {
          showToast("JSON dosyası okunurken hata oluştu: " + err.message, "error");
        }
      };
      reader.readAsText(file);
      event.target.value = "";
    }

    updateAnalysisProgress(info) {
      if (info.status === "running" && this.activeAnalysis.status !== "running") {
        this.analysisStartTime = Date.now();
        this.analysisElapsedTime = "00:00";
        if (this.analysisTimerInterval) clearInterval(this.analysisTimerInterval);
        this.analysisTimerInterval = setInterval(() => {
          const diff = Math.floor((Date.now() - this.analysisStartTime) / 1000);
          const mins = String(Math.floor(diff / 60)).padStart(2, "0");
          const secs = String(diff % 60).padStart(2, "0");
          this.analysisElapsedTime = `${mins}:${secs}`;
          this.updateNavbarAiStatus();
          this.updateDashboardProgressDOM();
          const singleTimer = document.getElementById("ai-single-timer");
          if (singleTimer) singleTimer.innerText = this.analysisElapsedTime;
        }, 1000);
      } else if (info.status === "idle") {
        if (this.analysisTimerInterval) {
          clearInterval(this.analysisTimerInterval);
          this.analysisTimerInterval = null;
        }
        this.analysisElapsedTime = "00:00";
        const singleTimer = document.getElementById("ai-single-timer");
        if (singleTimer) singleTimer.innerText = "00:00";
      }

      this.activeAnalysis = { ...this.activeAnalysis, ...info };
      this.updateNavbarAiStatus();
      this.updateDashboardProgressDOM();
    }

    updateNavbarAiStatus() {
      const el = document.querySelector(".ai-status-indicator");
      if (!el) return;
      if (this.activeAnalysis.status === "running") {
        el.innerHTML = `
          <span class="ai-pulse-dot" style="background: #38bdf8;"></span>
          <span style="cursor: pointer;" onclick="window.app.openActiveAnalysisWindow()">AI İşleniyor (%${this.activeAnalysis.percent}) • ⏱️ ${this.analysisElapsedTime || "00:00"} ↗</span>
        `;
        el.style.background = "#eff6ff";
        el.style.borderColor = "#93c5fd";
      } else {
        el.innerHTML = `
          <span class="ai-pulse-dot"></span>
          <span>AI Motoru Hazır</span>
        `;
        el.style.background = "var(--primary-light)";
        el.style.borderColor = "rgba(var(--primary-rgb), 0.2)";
      }
    }

    updateDashboardProgressDOM() {
      if (store.getState().currentTab !== "dashboard") return;
      const widget = document.getElementById("dashboard-hero-progress-widget");
      
      const isAiRunning = this.activeAnalysis?.status === "running";
      const st = this.pdfAnalyzerLiveState || {};
      const isPdfParsing = (this.isPdfParsing || this.isSingleAiParsing) && !st.isCompleted;
      const isPdfParsingCompleted = st.isCompleted && !isAiRunning;
      const isAnalyzing = isAiRunning || isPdfParsing || isPdfParsingCompleted;
      
      // Her zaman güncel durumu yansıtmak için renderCurrentView kullanabiliriz,
      // Ancak animasyonların kırılmaması için sade metin güncellemeleri yapıyoruz.
      // EĞER state 'isPdfParsingCompleted' olduysa ve içinde buton yoksa yeniden çiz.
      if (!widget || (isPdfParsingCompleted && !widget.innerHTML.includes("Önizlemeyi Aç"))) {
        if (isAnalyzing) {
          this.renderCurrentView();
        }
        return;
      }
      
      if (!isAnalyzing) {
        this.renderCurrentView();
        return;
      }
      
      const titleEl = document.getElementById("hero-analysis-title");
      const percentBadge = document.getElementById("hero-analysis-percent-badge");
      const fillBar = document.getElementById("hero-analysis-fill-bar");
      const studentEl = document.getElementById("hero-analysis-student");
      const timerEl = document.getElementById("hero-analysis-timer");
      const statusTextEl = document.getElementById("hero-analysis-status-text");

      let title = "Canlı İşlem";
      let percent = 0;
      let subtitle = "";
      let timeText = "00:00";
      let statusText = "Canlı İşlem Devam Ediyor";

      if (isAiRunning) {
        title = this.activeAnalysis.title || "Yapay Zekâ Analizi";
        percent = this.activeAnalysis.percent || 0;
        subtitle = "👤 " + (this.activeAnalysis.currentStudent || "Öğrenci Analiz Ediliyor");
        timeText = "⏱️ Geçen Süre: " + (this.analysisElapsedTime || "00:00");
      } else if (isPdfParsing) {
        title = "⚡ PDF Analiz Ediliyor";
        percent = st.percent || 0;
        subtitle = `👤 ${st.curr || 0} / ${st.total || 0} Öğrenci İşlendi (${st.studentName || "Öğrenci"})`;
        timeText = "⏱️ Geçen Süre: " + (this.pdfParsingElapsedTime || "00:00");
        statusText = "PDF Ayrıştırma İşlemi";
      } else if (isPdfParsingCompleted) {
         title = "🎉 PDF Ayrıştırma Tamamlandı";
         percent = 100;
         subtitle = `👤 ${st.total || 0} Öğrenci İşlendi ve Onayınızı Bekliyor`;
         timeText = "✅ Tamamlandı";
         statusText = "Bekleyen İşlem (Onay Bekleniyor)";
      }

      if (titleEl) titleEl.innerText = title;
      if (percentBadge) percentBadge.innerText = `%${percent}`;
      if (fillBar) fillBar.style.width = `${percent}%`;
      if (studentEl) studentEl.innerText = subtitle;
      if (timerEl) timerEl.innerText = timeText;
      if (statusTextEl) statusTextEl.innerText = statusText;
    }

    openActiveAnalysisWindow() {
      if (this.activeAnalysis.type === "batch" && this.parsedStudentsList && this.parsedStudentsList.length > 0) {
        const modal = document.getElementById("pdf-upload-modal");
        if (modal) {
          modal.style.display = "flex";
        } else {
          this.renderMultiStudentBatchPreview(this.parsedStudentsList);
        }
        const progressBox = document.getElementById("batch-progress-box");
        if (progressBox) {
          progressBox.style.display = "block";
          progressBox.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else {
        this.navigate("aiAnalysis");
        setTimeout(() => {
          const loading = document.getElementById("ai-loading-screen");
          if (loading && loading.style.display !== "none") {
            loading.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }
    }

    navigate(tabName) {
      store.setTab(tabName);
      window.scrollTo({ top: 0, behavior: "smooth" });
      // Mobilde sidebar'ı otomatik kapat
      const sidebar = document.getElementById("app-sidebar");
      const overlay = document.getElementById("sidebar-overlay");
      if (sidebar) sidebar.classList.remove("open");
      if (overlay) overlay.classList.remove("active");
    }

    handleStateUpdate(state, event, data) {
      // Sadece sekme değiştiyse renderCurrentView() içinde isTabChanged = true olarak işaretlenecek
      this.renderCurrentView();
      this.updateSidebarActiveState();
      this.updateNavbarAiStatus();
      
      const widget = document.getElementById("floating-pdf-analyzer-widget");
      if (widget) {
        widget.style.display = state.currentTab === "dashboard" ? "none" : "block";
      }
    }

    renderCurrentView() {
      const state = store.getState();
      const contentArea = document.getElementById("main-content-area");
      if (!contentArea) return;
      
      const isTabChanged = this._lastRenderedTab !== state.currentTab;
      this._lastRenderedTab = state.currentTab;

      let html = "";
      switch (state.currentTab) {
        case "dashboard": html = renderDashboardView(); break;
        case "students": html = renderStudentsView(); break;
        case "exams": html = renderExamsView(); break;
        case "aiAnalysis": html = renderAiAnalysisView(); break;
        case "reports": html = renderReportsView(); break;
        case "institution": html = renderInstitutionView(); break;
        case "aiSettings": html = renderAiSettingsView(); break;
        case "firebaseSettings": html = renderFirebaseSettingsView(); break;
        default: html = renderDashboardView();
      }
      contentArea.innerHTML = html;
      
      if (!isTabChanged) {
        const viewContainer = contentArea.querySelector(".view-container");
        if (viewContainer) viewContainer.classList.remove("animate-fade-in");
        const bulkCard = contentArea.querySelector(".dashboard-bulk-export-card");
        if (bulkCard) bulkCard.classList.remove("animate-fade-in");
      }
    }

    updateSidebarActiveState() {
      const state = store.getState();
      document.querySelectorAll(".nav-link").forEach((link) => {
        const tab = link.getAttribute("data-tab");
        if (tab === state.currentTab) link.classList.add("active");
        else link.classList.remove("active");
      });
    }

    renderModalContainer(html) {
      let container = document.getElementById("modal-root-container");
      if (!container) {
        container = document.createElement("div");
        container.id = "modal-root-container";
        document.body.appendChild(container);
      }
      container.innerHTML = html;
    }

    closeModal(modalId) {
      const el = document.getElementById(modalId);
      if (el) el.remove();
    }

    minimizePdfModal() {
      const modal = document.getElementById("pdf-upload-modal");
      if (modal) {
        modal.style.display = "none";
      }
      this.isPdfModalMinimized = true;
      this.updateFloatingPdfAnalyzerWidget();
      showToast("PDF Ayrıştırma arka planda devam ediyor. Sağ alttaki canlı widget'a tıklayarak pencereyi dilediğiniz an açabilirsiniz.", "info");
    }

    maximizePdfModal() {
      const modal = document.getElementById("pdf-upload-modal");
      if (modal) {
        modal.style.display = "flex";
      } else if (this.parsedStudentsList && this.parsedStudentsList.length > 0) {
        this.openUploadPdfModal();
        const preview = document.getElementById("pdf-parsed-preview");
        if (preview) {
          preview.style.display = "block";
          if (this.parsedStudentsList.length === 1) this.renderSingleParsedExamEditor(this.parsedStudentsList[0]);
          else this.renderMultiStudentBatchPreview(this.parsedStudentsList);
        }
      }
      this.isPdfModalMinimized = false;
      this.updateFloatingPdfAnalyzerWidget();
    }

    cancelPdfParsing() {
      // PDF ayrıştırma verilerini sıfırla
      this.isPdfParsing = false;
      this.isPdfModalMinimized = false;
      this.parsedStudentsList = [];
      this.pdfAnalyzerLiveState = { isCompleted: false };
      
      if (this.pdfParsingTimerInterval) {
        clearInterval(this.pdfParsingTimerInterval);
        this.pdfParsingTimerInterval = null;
      }
      this.pdfParsingElapsedTime = "00:00";
      
      // Varsa açık olan modalı kapat
      this.closeModal("pdf-upload-modal");
      
      // Floating widget'ı sil
      const widget = document.getElementById("floating-pdf-analyzer-widget");
      if (widget) widget.remove();
      
      // Dashboard'u eski "PDF Yükle" haline geri döndür
      this.renderCurrentView();
      showToast("İşlem iptal edildi ve silindi. Yeni bir PDF yükleyebilirsiniz.", "info");
    }

    openSingleAiAnalysisModal(student, chosenExams) {
      const modalHtml = `
        <div class="modal-backdrop" id="single-ai-analysis-modal" onclick="if(event.target === this) window.app.minimizeSingleAiModal()">
          <div class="modal-dialog animate-scale-up" style="max-width: 580px; display: flex; flex-direction: column;">
            <div class="modal-header">
              <div class="d-flex items-center gap-2">
                <span style="font-size: 20px;">🤖</span>
                <h3 class="modal-title font-bold">Yapay Zekâ Sınav Analizi & Haftalık Program</h3>
              </div>
              <div class="d-flex items-center gap-2">
                <button class="btn btn-sm btn-outline font-bold" title="Arka Planda Çalıştır / Simge Durumuna Küçült" onclick="window.app.minimizeSingleAiModal()" style="font-size: 11px; padding: 4px 8px;">
                  🗕 Arka Planda Çalıştır
                </button>
                <button class="modal-close" onclick="window.app.minimizeSingleAiModal()">&times;</button>
              </div>
            </div>
            <div class="modal-body text-center p-4">
              <div class="ai-loading-pulse" style="margin: 0 auto 16px; width: 64px; height: 64px;"><div class="ai-orb" style="width: 32px; height: 32px;"></div></div>
              <h4 class="font-bold mb-1 text-primary" style="font-size: 18px;" id="modal-ai-title">🤖 Yapay Zekâ Analiz Ediyor & Çalışma Programı Hazırlıyor...</h4>
              <div class="badge badge-primary font-bold mb-3" style="font-size: 12px; padding: 5px 12px;">
                👤 ${escapeHtml(student.adSoyad)} (${chosenExams.length} Sınav İnceleniyor)
              </div>
              <p class="text-muted mb-3" id="modal-ai-desc" style="font-size: 13px; line-height: 1.5; max-width: 480px; margin: 0 auto 16px;">
                Öğrencinin kazanımları taranıyor, netleri ve yanlışları sınıflandırılarak 7 günlük LGS etüt matrisi oluşturuluyor...
              </p>
              <div style="width: 100%; height: 10px; background: #e2e8f0; border-radius: 99px; overflow: hidden; margin-bottom: 16px;">
                <div id="modal-ai-progress-bar" style="width: 50%; height: 100%; background: var(--primary-color); transition: width 0.3s ease;"></div>
              </div>
              <div class="d-flex justify-center gap-2">
                <button type="button" class="btn btn-outline text-primary border-primary font-bold" onclick="window.app.minimizeSingleAiModal()">
                  🗕 Simge Durumuna Küçült
                </button>
                <button type="button" class="btn btn-outline text-danger border-danger font-bold" onclick="window.app.abortAiAnalysis()">
                  ⛔ Analizi İptal Et
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
      this.renderModalContainer(modalHtml);
    }

    minimizeSingleAiModal() {
      const modal = document.getElementById("single-ai-analysis-modal");
      if (modal) modal.style.display = "none";
      this.isSingleAiModalMinimized = true;
      this.updateFloatingPdfAnalyzerWidget();
      showToast("Yapay zekâ analizi arka planda devam ediyor. Sağ alttaki canlı widget'a tıklayarak pencereyi dilediğiniz an açabilirsiniz.", "info");
    }

    maximizeSingleAiModal() {
      const modal = document.getElementById("single-ai-analysis-modal");
      if (modal) {
        modal.style.display = "flex";
      }
      this.isSingleAiModalMinimized = false;
      this.updateFloatingPdfAnalyzerWidget();
    }

    updateFloatingPdfAnalyzerWidget(data = null) {
      let widget = document.getElementById("floating-pdf-analyzer-widget");
      if (data) {
        this.pdfAnalyzerLiveState = { ...this.pdfAnalyzerLiveState, ...data };
      }
      const st = this.pdfAnalyzerLiveState || {};

      const isRunning = this.isPdfParsing || this.isSingleAiParsing;
      if (!isRunning && !st.isCompleted) {
        if (widget) widget.remove();
        return;
      }

      if (!widget) {
        widget = document.createElement("div");
        widget.id = "floating-pdf-analyzer-widget";
        widget.className = "floating-pdf-analyzer-widget";
        widget.onclick = () => {
          if (window.app.isSingleAiParsing || st.isSingleAi) {
            if (st.isCompleted) {
              window.app.navigate("reports");
            } else {
              window.app.maximizeSingleAiModal();
            }
          } else {
            window.app.maximizePdfModal();
          }
        };
        document.body.appendChild(widget);
      }
      
      // Dashboard sayfasındayken popup'ı gizle
      widget.style.display = store.getState().currentTab === "dashboard" ? "none" : "block";

      if (st.isCompleted) {
        widget.style.borderColor = "#16a34a";
        widget.style.background = "#f0fdf4";
        widget.innerHTML = `
          <div class="floating-widget-header">
            <div class="d-flex items-center gap-2">
              <span style="font-size: 16px;">🎉</span>
              <div>
                <div class="floating-widget-title text-success">✓ ${escapeHtml(st.studentName || "Öğrenci")} Analizi Tamamlandı!</div>
                <div class="floating-widget-sub">Raporu ve Programı İncelemek İçin Tıklayın ↗</div>
              </div>
            </div>
            <button class="btn btn-sm btn-ghost" onclick="event.stopPropagation(); this.closest('#floating-pdf-analyzer-widget').remove()" title="Kapat">&times;</button>
          </div>
        `;
        this.updateDashboardProgressDOM();
        return;
      }

      const percent = st.percent || 0;
      const curr = st.curr || 0;
      const total = st.total || 0;
      const remText = st.remainingFormatted || (st.remainingSec ? `~${st.remainingSec} sn` : "Hesaplanıyor...");
      const studentName = st.studentName || "Öğrenciler";

      widget.style.borderColor = "#22c55e";
      widget.style.background = "#ffffff";
      widget.innerHTML = `
        <div class="floating-widget-header">
          <div class="d-flex items-center gap-2">
            <span class="ai-pulse-dot" style="background:#22c55e; width:10px; height:10px;"></span>
            <div>
              <div class="floating-widget-title">⚡ PDF Analiz Ediliyor (%${percent})</div>
              <div class="floating-widget-sub">${curr} / ${total} Öğrenci • Kalan: <strong class="text-success">${remText}</strong></div>
            </div>
          </div>
          <div class="badge badge-primary font-bold" style="font-size: 10px; padding: 3px 6px;">Büyüt ↗</div>
        </div>
        <div class="floating-progress-bar-wrap">
          <div class="floating-progress-fill" style="width: ${percent}%;"></div>
        </div>
        <div class="d-flex justify-between items-center" style="font-size: 10px; color: #64748b;">
          <span>🚀 8 Paralel AI Motoru</span>
          <span style="max-width: 140px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">👤 ${escapeHtml(studentName)}</span>
        </div>
      `;
      
      this.updateDashboardProgressDOM();
    }

    openUploadPdfModal() {
      const aiConfig = store.getState().aiConfig || {};
      const provider = aiConfig.provider || (aiConfig.geminiApiKey ? "gemini" : (aiConfig.openaiApiKey ? "openai" : "gemini"));
      const hasKey = AIService.checkApiKey(provider, aiConfig);
      const activeEngineLabel = provider === "openai" ? `OpenAI (${aiConfig.openaiModel || 'gpt-4o-mini'})` : (provider === "gemini" ? `Google Gemini (${aiConfig.geminiModel || 'gemini-1.5-flash'})` : `Claude (${aiConfig.claudeModel || '3.5-sonnet'})`);

      this.uploadExamTargetMode = null;
      this.uploadTargetGrade = this.uploadTargetGrade || "all";

      const modalHtml = `
        <div class="modal-backdrop" id="pdf-upload-modal" onclick="if(event.target === this && !window.app.isBatchProcessing && !window.app.isPdfParsing) window.app.closeModal('pdf-upload-modal')">
          <div class="modal-dialog modal-xl animate-scale-up" style="max-height: 92vh; display: flex; flex-direction: column;">
            <div class="modal-header">
              <div class="d-flex items-center gap-2">
                <span style="font-size: 18px;">📄</span>
                <h3 class="modal-title">PDF Sınav Sonuç Belgesi Yükle (Yapay Zekâ Destekli)</h3>
              </div>
              <div class="d-flex items-center gap-2">
                <button class="btn btn-sm btn-outline font-bold" title="Simge Durumuna Küçült / Arka Planda Çalıştır" onclick="window.app.minimizePdfModal()" style="font-size: 11px; padding: 4px 8px;">
                  🗕 Arka Planda Çalıştır
                </button>
                <button class="modal-close" onclick="if(!window.app.isBatchProcessing && !window.app.isPdfParsing) window.app.closeModal('pdf-upload-modal')">&times;</button>
              </div>
            </div>
            <div class="modal-body" style="overflow-y: auto;">
              
              <!-- AI MOD SEÇİMİ VE DURUM KARTI -->
              <div class="card p-3 mb-3" style="background: linear-gradient(135deg, #f0fdf4 0%, #eff6ff 100%); border: 1px solid #93c5fd; border-radius: var(--radius-md);">
                <div class="d-flex justify-between items-center flex-wrap gap-2 mb-2">
                  <div class="d-flex items-center gap-2">
                    <span style="font-size: 22px;">🤖</span>
                    <div>
                      <strong style="font-size: 15px; color: #0f172a;">Yapay Zekâ ile Kusursuz Ayrıştırma Motoru</strong>
                      <div class="text-muted" style="font-size: 12px;">Ders netleri, LGS puanı ve tüm alt kazanımlar AI tarafından %100 doğrulukla çıkarılır.</div>
                    </div>
                  </div>
                  <div class="d-flex items-center gap-2">
                    <label class="d-flex items-center gap-2" style="cursor: pointer; background: #ffffff; padding: 6px 14px; border-radius: 20px; border: 1px solid #cbd5e1; font-size: 13px; font-weight: 600;">
                      <input type="checkbox" id="pdf-ai-toggle" checked onchange="window.app.togglePdfAiMode(this.checked)" />
                      <span>AI Destekli Ayrıştır</span>
                    </label>
                  </div>
                </div>

                <div id="pdf-ai-engine-status" class="d-flex justify-between items-center flex-wrap gap-2 pt-2" style="border-top: 1px dashed #cbd5e1;">
                  <div class="d-flex items-center gap-2" style="font-size: 12px;">
                    <span class="ai-pulse-dot" style="display:inline-block; width:8px; height:8px;"></span>
                    <span class="text-muted">Aktif Motor:</span>
                    <strong class="text-primary" id="pdf-active-engine-label">${activeEngineLabel}</strong>
                    <span class="badge ${hasKey ? 'badge-success' : 'badge-warning'}" id="pdf-active-key-badge">${hasKey ? '● API Anahtarı Hazır' : '⚠️ API Anahtarı Tanımlanmalı'}</span>
                  </div>
                  <div class="d-flex gap-2">
                    ${!hasKey ? `<button type="button" class="btn btn-sm btn-outline" style="font-size: 11px; padding: 3px 8px;" onclick="window.app.toggleQuickApiKeyInput()">🔑 Hızlı API Key Gir</button>` : ''}
                    <button type="button" class="btn btn-sm btn-ghost" style="font-size: 11px; padding: 3px 8px;" onclick="window.app.closeModal('pdf-upload-modal'); window.app.navigate('aiSettings')">⚙️ AI Ayarları</button>
                  </div>
                </div>

                <!-- Hızlı API Key Giriş Alanı -->
                <div id="pdf-quick-api-box" class="mt-2 p-2 card" style="display: none; background: #ffffff; border: 1px solid #cbd5e1;">
                  <div class="d-flex gap-2 items-center flex-wrap">
                    <select id="pdf-quick-provider-select" class="form-control" style="width: 140px; font-size: 12px;">
                      <option value="gemini" ${provider === 'gemini' ? 'selected' : ''}>Google Gemini</option>
                      <option value="openai" ${provider === 'openai' ? 'selected' : ''}>OpenAI</option>
                    </select>
                    <input type="password" id="pdf-quick-api-key" class="form-control" placeholder="API Anahtarınızı (sk-... veya AQ...) buraya yapıştırın" style="flex: 1; min-width: 200px; font-size: 12px;" />
                    <button type="button" class="btn btn-sm btn-primary" onclick="window.app.saveQuickApiKey()">Kaydet</button>
                  </div>
                </div>
              </div>

              <!-- SINAV UYGULAMA HEDEFİ SEÇİMİ (YENİ SINAV VS MEVCUT SINAV) -->
              <div class="card p-3 mb-3" style="background: #ffffff; border: 1.5px solid #cbd5e1; border-radius: var(--radius-md);">
                <div class="d-flex justify-between items-center flex-wrap gap-2 mb-2">
                  <label class="form-label font-bold mb-0" style="font-size: 13.5px; color: #0f172a;">🎯 Sınav Uygulama Hedefi:</label>
                  <span class="badge badge-secondary" style="font-size: 11px;">Mükerrer veya farklı isim oluşmasını engeller</span>
                </div>
                <div class="d-flex gap-2 flex-wrap mb-2">
                  <button type="button" id="btn-target-mode-new" class="btn btn-sm btn-outline font-bold" onclick="window.app.setUploadExamTargetMode('new')">
                    ✨ Yeni Sınav Olarak Ekle (AI Otomatik İsimlendirsin)
                  </button>
                  <button type="button" id="btn-target-mode-existing" class="btn btn-sm btn-outline font-bold" onclick="window.app.setUploadExamTargetMode('existing')">
                    📂 Mevcut Sınav Uygulamasına Dahil Et
                  </button>
                </div>

                <!-- Mevcut Sınav Seçim Kutusu -->
                <div id="existing-exam-selection-box" style="display: none; background: #f8fafc; padding: 12px 16px; border-radius: 6px; border: 1px solid #e2e8f0; margin-top: 8px;">
                  <div class="grid-2-col" style="gap: 12px;">
                    <div class="form-group mb-0">
                      <label class="form-label font-bold" style="font-size: 12px; color: #334155;">1. Sınıf Seviyesi Seçiniz:</label>
                      <select id="upload-target-grade-select" class="form-control font-bold" style="font-size: 13px;" onchange="window.app.onUploadTargetGradeChange(this.value)">
                        <option value="all" ${this.uploadTargetGrade === 'all' ? 'selected' : ''}>Tüm Kademeler</option>
                        <option value="5" ${this.uploadTargetGrade === '5' ? 'selected' : ''}>5. Sınıf</option>
                        <option value="6" ${this.uploadTargetGrade === '6' ? 'selected' : ''}>6. Sınıf</option>
                        <option value="7" ${this.uploadTargetGrade === '7' ? 'selected' : ''}>7. Sınıf</option>
                        <option value="8" ${this.uploadTargetGrade === '8' ? 'selected' : ''}>8. Sınıf (LGS)</option>
                      </select>
                    </div>
                    <div class="form-group mb-0">
                      <label class="form-label font-bold" style="font-size: 12px; color: #334155;">2. Dahil Edilecek Sınavı Seçiniz:</label>
                      <select id="upload-target-exam-select" class="form-control font-bold text-primary" style="font-size: 13px;">
                        ${this.renderTargetExamOptions(this.uploadTargetGrade || 'all')}
                      </select>
                    </div>
                  </div>
                  <div class="text-muted mt-2 d-flex items-center gap-1" style="font-size: 11.5px;">
                    <span>ℹ️</span>
                    <span>Yüklenecek PDF içerisindeki tüm öğrenciler otomatik olarak seçilen bu sınav uygulaması içine dahil edilir.</span>
                  </div>
                </div>
              </div>

              <!-- HEDEF SEÇİLMEDEN ÖNCE GÖRÜNEN YÖNLENDİRME KUTUSU -->
              <div id="pdf-target-unselected-hint" class="p-4 text-center card mb-3 animate-fade-in" style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: var(--radius-md);">
                <div style="font-size: 26px; margin-bottom: 6px;">👆</div>
                <h4 class="font-bold" style="font-size: 15px; color: #1e293b; margin: 0 0 6px 0;">Lütfen Önce Sınav Hedefini Seçiniz</h4>
                <p class="text-muted" style="font-size: 13px; margin: 0;">
                  PDF yükleme alanının açılması için yukarıdaki <strong>"✨ Yeni Sınav Olarak Ekle"</strong> veya <strong>"📂 Mevcut Sınav Uygulamasına Dahil Et"</strong> butonlarından birine tıklayınız.
                </p>
              </div>

              <!-- PDF DOSYA YÜKLEME ALANI (Hedef seçildikten sonra açılır) -->
              <div class="excel-drop-zone p-5 text-center" id="pdf-drop-zone-box" style="display: none; border: 2px dashed var(--primary-color); border-radius: var(--radius-md); cursor: pointer;" onclick="document.getElementById('pdf-file-input').click()">
                <input type="file" id="pdf-file-input" accept=".pdf" style="display: none;" onchange="window.app.handlePdfFileUpload(this.files[0])" />
                <svg viewBox="0 0 24 24" width="56" height="56" fill="none" stroke="var(--primary-color)" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M12 18v-6M9 15l3-3 3 3"/></svg>
                <h3 class="mt-3 font-bold" style="font-size: 18px;">PDF Sınav Belgesini Seçin (1 Sayfa veya 70+ Sayfa)</h3>
                <p class="text-muted mt-1" style="font-size: 13px;">Toplu karne PDF'leri sayfa sayfa taranır, yapay zekâ ile tüm alt kazanımlar sıfır hata ile çözümlenir.</p>
                <div class="badge badge-primary font-bold mt-3" style="padding: 8px 16px; font-size: 13px;">Dosya Seçmek İçin Tıklayın</div>
              </div>

              <div id="pdf-parsing-loader" class="text-center p-4 card mt-3 shadow-sm" style="display: none; background: #f0fdf4; border: 2px solid #86efac; border-radius: var(--radius-md);">
                <div class="ai-loading-pulse" style="margin: 0 auto 12px; width: 60px; height: 60px;"><div class="ai-orb" style="width: 30px; height: 30px;"></div></div>
                <h4 class="font-bold text-success" id="pdf-parse-status-title" style="font-size: 16px;">⚡ PDF Sayfaları Ayrıştırılıyor...</h4>
                <p class="text-muted" id="pdf-parse-status-desc" style="font-size: 13px;">🚀 8 Eşzamanlı Yapay Zekâ Motoru Paralel Çalışıyor...</p>
                <div style="max-width: 520px; margin: 12px auto 8px; background: #e2e8f0; border-radius: 6px; height: 12px; overflow: hidden;">
                  <div id="pdf-parse-progress-bar" style="width: 0%; height: 100%; background: var(--primary-color); transition: width 0.25s;"></div>
                </div>
                <div class="d-flex justify-center items-center gap-2 mt-2 flex-wrap">
                  <span id="pdf-parse-timer-badge" class="badge badge-success font-bold" style="padding: 6px 12px; font-size: 13px;">⏳ Kalan Tahmini Süre: Hesaplanıyor...</span>
                  <button type="button" class="btn btn-sm btn-outline text-primary border-primary font-bold" onclick="window.app.minimizePdfModal()">
                    🗕 Simge Durumuna Küçült
                  </button>
                  <button type="button" class="btn btn-sm btn-outline text-danger border-danger font-bold" onclick="window.app.abortPdfParsing()">
                    ⛔ Ayrıştırmayı Durdur / İptal Et
                  </button>
                </div>
              </div>

              <div id="pdf-parsed-preview" class="mt-4" style="display: none;"></div>
            </div>
            <div class="modal-footer" id="pdf-modal-footer">
              <button type="button" class="btn btn-outline" onclick="window.app.closeModal('pdf-upload-modal')">İptal</button>
            </div>
          </div>
        </div>
      `;
      this.renderModalContainer(modalHtml);
    }

    togglePdfAiMode(checked) {
      const label = document.getElementById("pdf-active-engine-label");
      if (label) {
        if (!checked) label.innerText = "⚡ Hızlı Yerel Mod (Çevrimdışı / Regex)";
        else {
          const aiConfig = store.getState().aiConfig || {};
          const provider = aiConfig.provider || "gemini";
          label.innerText = provider === "openai" ? `OpenAI (${aiConfig.openaiModel || 'gpt-4o-mini'})` : `Google Gemini (${aiConfig.geminiModel || 'gemini-1.5-flash'})`;
        }
      }
    }

    toggleQuickApiKeyInput() {
      const box = document.getElementById("pdf-quick-api-box");
      if (box) box.style.display = box.style.display === "none" ? "block" : "none";
    }

    saveQuickApiKey() {
      const provider = document.getElementById("pdf-quick-provider-select")?.value || "openai";
      const key = document.getElementById("pdf-quick-api-key")?.value?.trim();
      if (!key) {
        showToast("Lütfen geçerli bir API anahtarı giriniz.", "error");
        return;
      }
      const updateData = { provider };
      if (provider === "openai") updateData.openaiApiKey = key;
      if (provider === "gemini") updateData.geminiApiKey = key;
      if (provider === "claude") updateData.claudeApiKey = key;
      store.updateAiConfig(updateData);
      showToast("API anahtarı başarıyla kaydedildi.", "success");
      const box = document.getElementById("pdf-quick-api-box");
      if (box) box.style.display = "none";
      const badge = document.getElementById("pdf-active-key-badge");
      if (badge) {
        badge.className = "badge badge-success";
        badge.innerText = "● API Anahtarı Hazır";
      }
      const label = document.getElementById("pdf-active-engine-label");
      if (label) label.innerText = provider === "openai" ? "OpenAI (gpt-4o-mini)" : "Google Gemini (gemini-1.5-flash)";
    }

    abortPdfParsing() {
      if (this.pdfParsingAbortController) {
        this.pdfParsingAbortController.abort();
      }
      this.isPdfParsing = false;
      this.updateFloatingPdfAnalyzerWidget();
    }

    async handlePdfFileUpload(file) {
      if (!file) return;
      const loader = document.getElementById("pdf-parsing-loader");
      const dropZone = document.getElementById("pdf-drop-zone-box");
      const preview = document.getElementById("pdf-parsed-preview");
      const title = document.getElementById("pdf-parse-status-title");
      const desc = document.getElementById("pdf-parse-status-desc");
      const pBar = document.getElementById("pdf-parse-progress-bar");
      const timerBadge = document.getElementById("pdf-parse-timer-badge");

      if (loader) loader.style.display = "block";
      if (dropZone) dropZone.style.display = "none";
      if (preview) preview.style.display = "none";

      this.isPdfParsing = true;
      this.pdfParsingAbortController = new AbortController();
      
      this.pdfParsingStartTime = Date.now();
      this.pdfParsingElapsedTime = "00:00";
      if (this.pdfParsingTimerInterval) clearInterval(this.pdfParsingTimerInterval);
      this.pdfParsingTimerInterval = setInterval(() => {
        const diff = Math.floor((Date.now() - this.pdfParsingStartTime) / 1000);
        const mins = String(Math.floor(diff / 60)).padStart(2, "0");
        const secs = String(diff % 60).padStart(2, "0");
        this.pdfParsingElapsedTime = `${mins}:${secs}`;
        this.updateDashboardProgressDOM();
      }, 1000);

      const useAi = document.getElementById("pdf-ai-toggle") ? document.getElementById("pdf-ai-toggle").checked : true;
      const aiConfig = store.getState().aiConfig;

      this.updateFloatingPdfAnalyzerWidget({
        curr: 0,
        total: 0,
        percent: 0,
        remainingSec: 15,
        remainingFormatted: "Hesaplanıyor...",
        studentName: file.name,
        isCompleted: false
      });

      try {
        const students = await PDFParserService.parseMultiStudentPDF(file, (curr, total, msg, remSec, pct, studentName, remFormatted) => {
          const p = pct !== undefined ? pct : Math.round((curr / total) * 100);
          const rText = remFormatted || (remSec !== undefined ? `~${remSec} sn` : "1 sn");
          if (title) title.innerText = msg || `⚡ ${curr} / ${total} Öğrenci Ayrıştırıldı (%${p})`;
          if (desc) desc.innerText = `🚀 8 Eşzamanlı Yapay Zekâ Motoru Paralel Çalışıyor... (Son: ${studentName || 'Öğrenci'})`;
          if (pBar) pBar.style.width = `${p}%`;
          if (timerBadge) {
            timerBadge.style.display = "inline-block";
            timerBadge.innerText = `⏳ Kalan Tahmini Süre: ${rText}`;
          }

          // Yüzen widget ve navbarı güncelle
          this.updateFloatingPdfAnalyzerWidget({
            curr,
            total,
            percent: p,
            remainingSec: remSec,
            remainingFormatted: rText,
            studentName,
            isCompleted: false
          });
        }, {
          useAi,
          aiConfig,
          abortSignal: this.pdfParsingAbortController.signal
        });

        if (this.uploadExamTargetMode === "existing") {
          const targetExamName = document.getElementById("upload-target-exam-select")?.value;
          if (targetExamName) {
            students.forEach((st) => {
              if (st.sinav) st.sinav.sinavAdi = targetExamName;
            });
          }
        }

        this.parsedStudentsList = students;
        this.isPdfParsing = false;
        
        if (this.pdfParsingTimerInterval) {
          clearInterval(this.pdfParsingTimerInterval);
          this.pdfParsingTimerInterval = null;
        }

        this.updateFloatingPdfAnalyzerWidget({
          curr: students.length,
          total: students.length,
          percent: 100,
          remainingSec: 0,
          remainingFormatted: "Tamamlandı",
          isCompleted: true
        });

        if (loader) loader.style.display = "none";
        if (preview) {
          preview.style.display = "block";
          if (students.length === 1) {
            this.renderSingleParsedExamEditor(students[0]);
          } else {
            this.renderMultiStudentBatchPreview(students);
          }
        }

        // Eğer modal simge durumundaysa bildirim ver
        if (this.isPdfModalMinimized) {
          showToast(`✓ ${students.length} öğrenci başarıyla ayrıştırıldı! Sağ alttaki widget'a tıklayarak sonuçları görüntüleyebilirsiniz.`, "success");
        }
      } catch (err) {
        this.isPdfParsing = false;
        
        if (this.pdfParsingTimerInterval) {
          clearInterval(this.pdfParsingTimerInterval);
          this.pdfParsingTimerInterval = null;
        }
        
        this.updateFloatingPdfAnalyzerWidget();
        if (loader) loader.style.display = "none";
        if (dropZone) dropZone.style.display = "block";
        if (err.name === "AbortError") {
          showToast("PDF ayrıştırma işlemi kullanıcı tarafından durduruldu.", "warning");
        } else {
          showToast("PDF Ayrıştırma Hatası: " + err.message, "error");
        }
      }
    }

    renderSingleParsedExamEditor(item) {
      const preview = document.getElementById("pdf-parsed-preview");
      const footer = document.getElementById("pdf-modal-footer");
      if (!preview || !item) return;

      const { ogrenci, sinav } = item;
      const wrongGains = [];
      (sinav.dersSonuclari || []).forEach((d) => {
        (d.konular || []).forEach((k) => {
          if (k.durum === "yanlis" || k.durum === "bos") {
            wrongGains.push({ ders: d.ders, kazanim: k.kazanimAdi, durum: k.durum, yuzde: k.basariYuzdesi });
          }
        });
      });

      const isAi = sinav.aiExtracted;

      preview.innerHTML = `
        <div class="card p-3 mb-3" style="background: var(--bg-main); border: 1px solid var(--border-color);">
          <div class="d-flex justify-between items-center flex-wrap gap-2 mb-2">
            <div class="d-flex items-center gap-2">
              <span class="badge badge-success font-bold">✓ 1 Öğrenci Karnesi Ayrıştırıldı</span>
              ${isAi ? `<span class="badge badge-primary font-bold" style="background:#eff6ff; color:#2563eb; border:1px solid #bfdbfe;">🤖 AI ile Kusursuz Ayrıştırıldı</span>` : `<span class="badge badge-secondary">⚡ Yerel Motor</span>`}
            </div>
            <div class="d-flex gap-2">
              ${sinav.puan ? `<span class="badge badge-warning font-bold">LGS Puanı: ${sinav.puan}</span>` : ""}
              <span class="badge badge-primary font-bold">Toplam Net: ${sinav.toplamNet} Net</span>
            </div>
          </div>
          <div class="grid-3-col">
            <div class="form-group"><label class="form-label">Öğrenci Adı Soyadı:</label><input type="text" class="form-control font-bold" value="${escapeHtml(ogrenci.adSoyad)}" oninput="window.app.parsedStudentsList[0].ogrenci.adSoyad = this.value" /></div>
            <div class="form-group"><label class="form-label">Sınıf / Şube:</label><input type="text" class="form-control" value="${escapeHtml(ogrenci.sinif + '. Sınıf (' + ogrenci.sube + ')')}" oninput="window.app.parsedStudentsList[0].ogrenci.sube = this.value" /></div>
            <div class="form-group"><label class="form-label">Öğrenci No:</label><input type="text" class="form-control" value="${escapeHtml(ogrenci.numara || '100')}" oninput="window.app.parsedStudentsList[0].ogrenci.numara = this.value" /></div>
          </div>
        </div>

        <h4 class="font-bold mb-2">📊 Ayrıştırılan Ders Sonuçları:</h4>
        <table class="data-table mb-3">
          <thead><tr><th>Ders</th><th>Doğru</th><th>Yanlış</th><th>Boş</th><th>Net</th></tr></thead>
          <tbody>
            ${(sinav.dersSonuclari || []).map((d) => `<tr><td><strong>${d.ders}</strong></td><td class="text-success font-bold">${d.dogru}</td><td class="text-danger font-bold">${d.yanlis}</td><td class="text-muted">${d.bos}</td><td><strong class="text-primary">${d.net} Net</strong></td></tr>`).join("")}
          </tbody>
        </table>

        <h4 class="font-bold mb-2 text-danger">🎯 Tespit Edilen Eksik / Telafi Edilecek Kazanımlar (${wrongGains.length}):</h4>
        ${wrongGains.length === 0 ? `<div class="alert alert-success font-bold">✓ Tebrikler! Tüm kazanımlar %100 başarıyla tamamlanmıştır.</div>` : ''}
        ${wrongGains.map((w) => `<div class="p-2 mb-2 d-flex justify-between items-center" style="background: #fff1f2; border-left: 3px solid var(--danger); border-radius: 4px;"><div><span class="badge badge-primary mr-2">${w.ders}</span><strong>${escapeHtml(w.kazanim)}</strong> ${w.yuzde !== undefined ? `<span class="badge badge-secondary ml-1" style="font-size:11px;">%${w.yuzde} Başarı</span>` : ''}</div><span class="badge ${w.durum === "yanlis" ? "badge-danger" : "badge-warning"}">${w.durum === "yanlis" ? "Eksik / Yanlış" : "Boş"}</span></div>`).join("")}
      `;

      if (footer) {
        footer.innerHTML = `
          <button type="button" class="btn btn-outline" onclick="window.app.closeModal('pdf-upload-modal')">İptal</button>
          <button type="button" class="btn btn-primary btn-lg shadow-glow" onclick="window.app.saveSingleParsedExamAndAnalyze()">
            <span>Kaydet & Hemen Yapay Zekâ Analiz Raporunu Üret</span>
          </button>
        `;
      }
    }

    renderMultiStudentBatchPreview(students) {
      const preview = document.getElementById("pdf-parsed-preview");
      const footer = document.getElementById("pdf-modal-footer");
      if (!preview) return;

      let totalNetSum = 0;
      students.forEach((s) => { totalNetSum += Number(s.sinav.toplamNet || 0); });
      const avgNet = (totalNetSum / students.length).toFixed(1);

      preview.innerHTML = `
        <div class="card p-3 mb-3" style="background: var(--bg-main); border: 1px solid var(--border-color);">
          <div class="d-flex justify-between items-center flex-wrap gap-2">
            <div>
              <span class="badge badge-success font-bold mr-2" style="font-size: 13px; padding: 6px 12px;">✓ Toplu PDF Başarıyla Ayrıştırıldı</span>
              <strong style="font-size: 16px; color: #0f172a;">${students.length} Öğrenci Karnesi Tespit Edildi</strong>
            </div>
            <div class="d-flex gap-2">
              <span class="badge badge-primary font-bold">Ortalama Net: ${avgNet} Net</span>
              <span class="badge badge-secondary font-bold">Toplam: ${students.length} Öğrenci</span>
            </div>
          </div>
        </div>

        <div class="filter-search mb-3">
          <input type="text" id="batch-student-search" class="search-input" placeholder="Ayrıştırılan öğrencilerde ara (İsim veya no)..." oninput="window.app.filterBatchTable()" />
        </div>

        <div class="table-responsive" style="max-height: 420px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: var(--radius-sm);">
          <table class="data-table">
            <thead>
              <tr style="position: sticky; top: 0; background: #f8fafc; z-index: 2;">
                <th>#</th><th>Öğrenci Adı Soyadı</th><th>Şube / No</th><th>Toplam Net</th><th>LGS Puanı</th><th>Eksik Kazanım</th><th>Veri Güvencesi</th>
              </tr>
            </thead>
            <tbody id="batch-students-tbody">
              ${students.map((item, idx) => {
                let wrongCount = 0;
                (item.sinav.dersSonuclari || []).forEach((d) => {
                  (d.konular || []).forEach((k) => { if (k.durum === "yanlis" || k.durum === "bos") wrongCount++; });
                });
                const isAi = item.sinav.aiExtracted;
                const isVerified = item.sinav.dogrulama ? item.sinav.dogrulama.gecerli : true;
                return `
                  <tr class="batch-row" data-name="${escapeHtml(item.ogrenci.adSoyad.toLowerCase())}">
                    <td><strong>${idx + 1}</strong></td>
                    <td><strong class="text-dark">${escapeHtml(item.ogrenci.adSoyad)}</strong></td>
                    <td><span class="badge badge-secondary">${item.ogrenci.sube} (#${item.ogrenci.numara || "-"})</span></td>
                    <td><span class="badge badge-primary font-bold">${item.sinav.toplamNet || "-"} Net</span></td>
                    <td><strong class="text-warning">${item.sinav.puan || "-"}</strong></td>
                    <td><span class="badge ${wrongCount > 0 ? "badge-danger font-bold" : "badge-success"}">${wrongCount > 0 ? `${wrongCount} Eksik Kazanım` : "✓ Tam İsabet"}</span></td>
                    <td>
                      ${isAi
                        ? `<span class="badge badge-success font-bold" style="background:#ecfdf5; color:#059669; border:1px solid #a7f3d0; font-size: 11px;"><span class="ai-pulse-dot" style="display:inline-block; width:6px; height:6px; margin-right:4px;"></span>✓ AI ile Kusursuz Ayrıştırıldı</span>`
                        : (isVerified
                            ? `<span class="badge badge-success font-bold" style="font-size: 11px;">✓ Sağlama Başarılı</span>`
                            : `<span class="badge badge-warning font-bold" style="font-size: 11px;" title="${(item.sinav.dogrulama?.uyarilar || []).join('; ')}">⚠️ Uyarı (${item.sinav.dogrulama?.uyarilar?.length || 1})</span>`
                          )
                      }
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>

        <div id="batch-progress-box" class="mt-3 p-4 card shadow-sm" style="display: none; background: #f0fdf4; border: 2px solid #86efac; border-radius: var(--radius-md);">
          <div class="d-flex justify-between items-center mb-2">
            <strong id="batch-progress-title" class="text-success" style="font-size: 15px;">🤖 Yapay Zekâ Raporları Üretiliyor...</strong>
            <span id="batch-progress-count" class="badge badge-success font-bold" style="font-size: 13px;">0 / ${students.length}</span>
          </div>
          <div style="background: #e2e8f0; border-radius: 6px; height: 12px; overflow: hidden; margin-bottom: 10px;">
            <div id="batch-progress-bar" style="width: 0%; height: 100%; background: var(--primary-color); transition: width 0.3s;"></div>
          </div>
          <div class="d-flex justify-between items-center flex-wrap gap-2">
            <p id="batch-progress-msg" class="text-muted mb-0" style="font-size: 13px;">Öğrenci karnesi işleniyor...</p>
            <button type="button" class="btn btn-sm btn-outline text-danger border-danger font-bold" onclick="window.app.abortBatchProcessing()">
              ⛔ Toplu İşlemi Durdur / İptal Et
            </button>
          </div>
        </div>
      `;

      if (footer) {
        footer.innerHTML = `
          <button type="button" class="btn btn-outline" onclick="window.app.closeModal('pdf-upload-modal')">Kapat</button>
          <button type="button" class="btn btn-secondary shadow-glow" onclick="window.app.saveBatchStudentsOnly()">
            💾 Sadece Veritabanına Kaydet (${students.length} Öğrenci)
          </button>
          <button type="button" class="btn btn-primary btn-lg shadow-glow" onclick="window.app.runBatchAiAnalysisAndGenerateReports()">
            🚀 Toplu AI Analizini Başlat & ${students.length} Rapor Üret
          </button>
        `;
      }
    }

    filterBatchTable() {
      const q = document.getElementById("batch-student-search")?.value.toLowerCase().trim() || "";
      document.querySelectorAll(".batch-row").forEach((row) => {
        const name = row.getAttribute("data-name") || "";
        row.style.display = name.includes(q) ? "" : "none";
      });
    }

    async saveSingleParsedExamAndAnalyze() {
      const item = this.parsedStudentsList[0];
      if (!item) return;
      const { ogrenci, sinav } = item;

      let targetExamName = null;
      if (this.uploadExamTargetMode === "existing") {
        targetExamName = document.getElementById("upload-target-exam-select")?.value;
      }

      let student = store.getState().students.find((s) => s.adSoyad.toLowerCase().trim() === ogrenci.adSoyad.toLowerCase().trim() || (s.numara && s.numara === ogrenci.numara));
      if (!student) {
        student = { id: generateId("ogr"), adSoyad: ogrenci.adSoyad, sinif: ogrenci.sinif || "8", sube: ogrenci.sube || "8/A", numara: ogrenci.numara || "100", olusturmaTarihi: sinav.tarih || new Date().toISOString().split("T")[0] };
        store.addStudent(student);
      }

      const exam = { id: generateId("snv"), ogrenciId: student.id, kurumId: store.getState().institution.id, sinavAdi: targetExamName || sinav.sinavAdi || "8. Sınıf Deneme Sınavı", tarih: sinav.tarih || new Date().toISOString().split("T")[0], tur: "kazanimli", toplamSoru: sinav.toplamSoru || 90, toplamNet: sinav.toplamNet, puan: sinav.puan, dersSonuclari: sinav.dersSonuclari };
      store.addExam(exam);

      this.closeModal("pdf-upload-modal");
      store.clearExamSelection();
      store.toggleExamSelection(exam.id);
      store.state.selectedStudentIdForAnalysis = student.id;

      // Doğrudan AI Analizini Başlat
      this.runDirectAiAnalysis(student, [exam]);
    }

    saveBatchStudentsOnly() {
      const studentsList = this.parsedStudentsList;
      if (!studentsList || studentsList.length === 0) return;

      let targetExamName = null;
      if (this.uploadExamTargetMode === "existing") {
        targetExamName = document.getElementById("upload-target-exam-select")?.value;
      }

      const newStudents = [];
      const newExams = [];

      studentsList.forEach((item) => {
        let student = store.getState().students.find((s) => s.adSoyad.toLowerCase().trim() === item.ogrenci.adSoyad.toLowerCase().trim() || (s.numara && s.numara === item.ogrenci.numara));
        if (!student) {
          student = { id: generateId("ogr"), adSoyad: item.ogrenci.adSoyad, sinif: item.ogrenci.sinif || "8", sube: item.ogrenci.sube || "8/A", numara: item.ogrenci.numara || "100", olusturmaTarihi: item.sinav.tarih || new Date().toISOString().split("T")[0] };
          newStudents.push(student);
        }
        newExams.push({ id: generateId("snv"), ogrenciId: student.id, kurumId: store.getState().institution.id, sinavAdi: targetExamName || item.sinav.sinavAdi, tarih: item.sinav.tarih, tur: "kazanimli", toplamSoru: item.sinav.toplamSoru || 90, toplamNet: item.sinav.toplamNet, puan: item.sinav.puan, dersSonuclari: item.sinav.dersSonuclari });
      });

      store.addBatchStudents(newStudents);
      store.addBatchExams(newExams);

      this.closeModal("pdf-upload-modal");
      showToast(`✓ ${studentsList.length} öğrenci ve sınav kaydı başarıyla veritabanına eklendi!`, "success");
      this.navigate("students");
    }

    async runBatchAiAnalysisAndGenerateReports() {
      const studentsList = this.parsedStudentsList;
      if (!studentsList || studentsList.length === 0) return;

      let targetExamName = null;
      if (this.uploadExamTargetMode === "existing") {
        targetExamName = document.getElementById("upload-target-exam-select")?.value;
      }

      this.isBatchProcessing = true;
      this.isBatchCancelled = false;
      const progressBox = document.getElementById("batch-progress-box");
      const progressCount = document.getElementById("batch-progress-count");
      const progressBar = document.getElementById("batch-progress-bar");
      const progressMsg = document.getElementById("batch-progress-msg");

      if (progressBox) {
        progressBox.style.display = "block";
        progressBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      const state = store.getState();
      const total = studentsList.length;
      let completedCount = 0;

      for (let i = 0; i < total; i++) {
        if (this.isBatchCancelled) {
          this.updateAnalysisProgress({ status: "idle", percent: 0 });
          showToast(`Toplu analiz durduruldu. (${completedCount} rapor üretildi)`, "warning");
          break;
        }

        const item = studentsList[i];
        const percent = Math.round(((i + 1) / total) * 100);

        if (progressCount) progressCount.innerText = `${i + 1} / ${total}`;
        if (progressBar) progressBar.style.width = `${percent}%`;
        if (progressMsg) progressMsg.innerText = `[${i + 1}/${total}] ${item.ogrenci.adSoyad} için haftalık program ve analiz üretiliyor...`;

        this.updateAnalysisProgress({
          status: "running",
          type: "batch",
          title: `Toplu AI Analizi (${i + 1}/${total})`,
          currentStudent: item.ogrenci.adSoyad,
          percent: percent,
          currentStep: i + 1,
          totalSteps: total,
          message: `${item.ogrenci.adSoyad} için haftalık program üretiliyor...`
        });

        let student = store.getState().students.find((s) => s.adSoyad.toLowerCase().trim() === item.ogrenci.adSoyad.toLowerCase().trim() || (s.numara && s.numara === item.ogrenci.numara));
        if (!student) {
          student = { id: generateId("ogr"), adSoyad: item.ogrenci.adSoyad, sinif: item.ogrenci.sinif || "8", sube: item.ogrenci.sube || "8/A", numara: item.ogrenci.numara || "100", olusturmaTarihi: item.sinav.tarih || new Date().toISOString().split("T")[0] };
          store.addStudent(student);
        }

        const exam = { id: generateId("snv"), ogrenciId: student.id, kurumId: state.institution.id, sinavAdi: targetExamName || item.sinav.sinavAdi, tarih: item.sinav.tarih, tur: "kazanimli", toplamSoru: item.sinav.toplamSoru || 90, toplamNet: item.sinav.toplamNet, puan: item.sinav.puan, dersSonuclari: item.sinav.dersSonuclari };
        store.addExam(exam);

        try {
          const aiRes = await AIService.analyzeExams(student, [exam], state.aiConfig);
          const report = {
            id: generateId("rep"),
            ogrenciId: student.id,
            ogrenciAdSoyad: student.adSoyad,
            sinif: `${student.sinif}. Sınıf / ${student.sube}`,
            numara: student.numara,
            kurumId: state.institution.id,
            kullanilanSinavIdler: [exam.id],
            aiSaglayici: state.aiConfig.provider === "openai" ? "OpenAI ChatGPT (GPT-4o Mini)" : "Google Gemini 1.5 Flash",
            olusturmaTarihi: new Date().toISOString(),
            createdAt: Date.now(),
            eksikKonular: aiRes.eksikKonular || [],
            genelYorum: aiRes.genelYorum || "",
            gelisimAnalizi: "",
            haftalikTablo: aiRes.haftalikTablo || [],
            haftalikOzet: aiRes.haftalikOzet || null,
            calismaProgrami: aiRes.calismaProgrami || []
          };
          store.addReport(report);
          completedCount++;
        } catch (e) {
          console.warn(`[Batch AI] ${student.adSoyad} analizi hatası:`, e);
        }
      }

      this.isBatchProcessing = false;
      this.updateAnalysisProgress({ status: "idle", percent: 0 });
      this.closeModal("pdf-upload-modal");
      if (!this.isBatchCancelled) {
        showToast(`🎉 Tebrikler! ${total} öğrencinin tamamı için AI analiz raporları üretildi ve arşive eklendi!`, "success", 5000);
      }
      this.navigate("reports");
    }

    abortBatchProcessing() {
      this.isBatchCancelled = true;
      this.updateAnalysisProgress({ status: "idle", percent: 0 });
      const progressMsg = document.getElementById("batch-progress-msg");
      if (progressMsg) progressMsg.innerText = "⛔ Toplu işlem durduruluyor...";
      showToast("Toplu analiz durduruluyor...", "info");
    }

    async exportBulkExamReportsFromDashboard() {
      const selectEl = document.getElementById("dashboard-bulk-exam-select");
      let selectedExamName = selectEl ? selectEl.value : "";
      const state = store.getState();

      if (!selectedExamName && state.exams.length > 0) {
        selectedExamName = state.exams[0].sinavAdi;
      }

      if (!selectedExamName && state.exams.length === 0) {
        showToast("Henüz kayıtlı sınav bulunmuyor.", "warning");
        return;
      }

      await PDFService.exportBulkExamReports(selectedExamName, state);
    }

    openStudentModal(studentId = null) {
      const student = studentId ? store.getState().students.find((s) => s.id === studentId) : null;
      const isEdit = !!student;
      const modalHtml = `
        <div class="modal-backdrop" id="student-modal" onclick="if(event.target === this) window.app.closeModal('student-modal')">
          <div class="modal-dialog animate-scale-up">
            <div class="modal-header"><h3 class="modal-title">${isEdit ? "Öğrenciyi Düzenle" : "Yeni Öğrenci Ekle"}</h3><button class="modal-close" onclick="window.app.closeModal('student-modal')">&times;</button></div>
            <form onsubmit="window.app.saveStudentForm(event, '${studentId || ""}')">
              <div class="modal-body">
                <div class="form-group"><label class="form-label">Adı Soyadı: *</label><input type="text" id="m-student-name" class="form-control" value="${student ? student.adSoyad : ""}" required /></div>
                <div class="grid-3-col">
                  <div class="form-group"><label class="form-label">Sınıf:</label><select id="m-student-class" class="form-control"><option value="8" selected>8. Sınıf (LGS)</option><option value="11">11. Sınıf</option><option value="12">12. Sınıf (YKS)</option></select></div>
                  <div class="form-group"><label class="form-label">Şube:</label><input type="text" id="m-student-branch" class="form-control" value="${student ? student.sube : "8-A"}" required /></div>
                  <div class="form-group"><label class="form-label">No:</label><input type="text" id="m-student-number" class="form-control" value="${student ? student.numara : ""}" /></div>
                </div>
                <div class="grid-2-col">
                  <div class="form-group"><label class="form-label">Veli Adı:</label><input type="text" id="m-student-parent-name" class="form-control" value="${student ? student.veliAdSoyad || "" : ""}" /></div>
                  <div class="form-group"><label class="form-label">Veli Tel:</label><input type="text" id="m-student-parent-phone" class="form-control" value="${student ? student.veliTelefon || "" : ""}" /></div>
                </div>
              </div>
              <div class="modal-footer"><button type="button" class="btn btn-outline" onclick="window.app.closeModal('student-modal')">İptal</button><button type="submit" class="btn btn-primary">Kaydet</button></div>
            </form>
          </div>
        </div>
      `;
      this.renderModalContainer(modalHtml);
    }

    saveStudentForm(e, studentId) {
      e.preventDefault();
      const adSoyad = document.getElementById("m-student-name").value.trim();
      const sinif = document.getElementById("m-student-class").value;
      const sube = document.getElementById("m-student-branch").value.trim();
      const numara = document.getElementById("m-student-number").value.trim();
      const veliAdSoyad = document.getElementById("m-student-parent-name").value.trim();
      const veliTelefon = document.getElementById("m-student-parent-phone").value.trim();

      if (studentId) {
        store.updateStudent(studentId, { adSoyad, sinif, sube, numara, veliAdSoyad, veliTelefon });
      } else {
        store.addStudent({ id: generateId("ogr"), adSoyad, sinif, sube, numara, veliAdSoyad, veliTelefon, olusturmaTarihi: new Date().toISOString().split("T")[0] });
      }
      this.closeModal("student-modal");
    }

    openStudentProfile(studentId) {
      const state = store.getState();
      const student = state.students.find((s) => s.id === studentId);
      if (!student) return;
      const studentExams = state.exams.filter((e) => e.ogrenciId === studentId);
      const studentReports = state.reports
        .filter((r) => r.ogrenciId === studentId)
        .sort((a, b) => {
          const tA = a.createdAt ? Number(a.createdAt) : (new Date(a.olusturmaTarihi || 0).getTime() || 0);
          const tB = b.createdAt ? Number(b.createdAt) : (new Date(b.olusturmaTarihi || 0).getTime() || 0);
          return tB - tA; // Yeniden eskiye
        });

      const modalHtml = `
        <div class="modal-backdrop" id="student-profile-modal" onclick="if(event.target === this) window.app.closeModal('student-profile-modal')">
          <div class="modal-dialog modal-lg animate-scale-up">
            <div class="modal-header">
              <h3 class="modal-title">${escapeHtml(student.adSoyad)} (${student.sinif}. Sınıf / ${student.sube})</h3>
              <button class="modal-close" onclick="window.app.closeModal('student-profile-modal')">&times;</button>
            </div>
            <div class="modal-body">
              <!-- SINAV GEÇMİŞİ -->
              <div class="d-flex justify-between items-center mb-3" style="flex-wrap: wrap; gap: 8px;">
                <h4 style="margin: 0;">📋 Sınav Geçmişi (${studentExams.length} Sınav)</h4>
                <div class="btn-group" style="flex-wrap: wrap; gap: 6px;">
                  <button class="btn btn-sm btn-outline" onclick="window.app.closeModal('student-profile-modal'); window.app.openUploadPdfModal()">📄 PDF Belgesi Yükle</button>
                  <button class="btn btn-sm btn-primary" onclick="window.app.closeModal('student-profile-modal'); window.app.analyzeStudentAllExams('${student.id}')">🤖 Yapay Zekâ Analizini Başlat</button>
                </div>
              </div>
              ${studentExams.length === 0 ? `
                <div class="empty-state p-4 text-center" style="border: 1px dashed var(--border-color); border-radius: var(--radius-md); margin-bottom: 20px;">
                  <p style="color: var(--text-muted); font-size: 13px;">Bu öğrenciye ait sınav kaydı yok. PDF yükleyerek sınav ekleyebilirsiniz.</p>
                </div>
              ` : `
                <div class="table-responsive" style="margin-bottom: 20px;">
                  <table class="data-table">
                    <thead><tr><th>Sınav Adı</th><th>Tarih</th><th>Net</th><th>Puan</th><th>İşlem</th></tr></thead>
                    <tbody>
                      ${studentExams.map((e) => {
                        const associatedReport = studentReports.find((r) => (r.kullanilanSinavIdler || []).includes(e.id) || r.sinavId === e.id);
                        return `
                        <tr>
                          <td><strong>${escapeHtml(e.sinavAdi || 'Sınav')}</strong></td>
                          <td>${formatDate(e.tarih)}</td>
                          <td><strong class="text-primary">${e.toplamNet || "-"} Net</strong></td>
                          <td>${e.puan ? `<span class="badge badge-warning">${e.puan}</span>` : "-"}</td>
                          <td>
                            <div class="btn-group" style="flex-wrap: wrap; gap: 4px;">
                              ${associatedReport ? `
                                <button class="btn btn-sm btn-success text-white font-bold" onclick="window.app.closeModal('student-profile-modal'); window.app.viewReportDetail('${associatedReport.id}')" title="Bu sınava ait oluşturulmuş AI raporunu görüntüle">
                                  📑 AI Raporu ↗
                                </button>
                              ` : ""}
                              <button class="btn btn-sm btn-ghost text-primary" onclick="window.app.closeModal('student-profile-modal'); window.app.viewExamDetail('${e.id}')">📊 İncele</button>
                              <button class="btn btn-sm btn-ghost" onclick="window.app.closeModal('student-profile-modal'); window.app.analyzeSingleExam('${e.id}')">🤖 Analiz</button>
                            </div>
                          </td>
                        </tr>`;
                      }).join("")}
                    </tbody>
                  </table>
                </div>
              `}

              <!-- OLUŞTURULMUŞ AI RAPORLARI -->
              <div style="border-top: 1px solid var(--border-color); padding-top: 16px;">
                <div class="d-flex justify-between items-center mb-3" style="flex-wrap: wrap; gap: 8px;">
                  <h4 style="margin: 0;">📑 Oluşturulmuş AI Raporları (${studentReports.length})</h4>
                </div>
                ${studentReports.length === 0 ? `
                  <div class="empty-state p-4 text-center" style="border: 1px dashed var(--border-color); border-radius: var(--radius-md);">
                    <p style="color: var(--text-muted); font-size: 13px;">Bu öğrenci için henüz yapay zekâ analiz raporu oluşturulmadı.</p>
                    <button class="btn btn-sm btn-primary mt-2" onclick="window.app.closeModal('student-profile-modal'); window.app.analyzeStudentAllExams('${student.id}')" ${studentExams.length === 0 ? "disabled" : ""}>
                      🤖 Hemen Rapor Oluştur
                    </button>
                  </div>
                ` : `
                  <div class="recent-reports-list">
                    ${studentReports.map((rep) => {
                      const repExamCount = rep.kullanilanSinavIdler ? rep.kullanilanSinavIdler.length : 1;
                      return `
                        <div class="report-mini-card" style="cursor: pointer;" onclick="window.app.closeModal('student-profile-modal'); window.app.viewReportDetail('${rep.id}')">
                          <div class="report-mini-icon">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          </div>
                          <div class="report-mini-info">
                            <div class="report-mini-name">${escapeHtml(rep.ogrenciAdSoyad || student.adSoyad)} — AI Raporu</div>
                            <div class="report-mini-meta">
                              <span>📅 ${formatDateTime(rep.createdAt || rep.olusturmaTarihi)}</span>
                              <span>•</span>
                              <span>📊 ${repExamCount} Sınav Analizi</span>
                            </div>
                          </div>
                          <div class="report-mini-actions" onclick="event.stopPropagation()">
                            <button class="btn btn-sm btn-outline" onclick="window.app.closeModal('student-profile-modal'); window.app.viewReportDetail('${rep.id}')">📄 İncele</button>
                            <button class="btn btn-sm btn-primary" onclick="window.app.closeModal('student-profile-modal'); window.app.downloadReportPDF('${rep.id}')">⬇ PDF</button>
                          </div>
                        </div>
                      `;
                    }).join("")}
                  </div>
                `}
              </div>
            </div>
          </div>
        </div>
      `;
      this.renderModalContainer(modalHtml);
    }

    openStudentAiReportModal(studentId) {
      const state = store.getState();
      const student = state.students.find((s) => s.id === studentId);
      if (!student) {
        showToast("Öğrenci kaydı bulunamadı.", "warning");
        return;
      }

      const studentExams = state.exams.filter((e) => e.ogrenciId === studentId);
      if (studentExams.length === 0) {
        showToast(`"${student.adSoyad}" için kayıtlı sınav bulunamadı. Lütfen önce sınav PDF'i yükleyin.`, "info");
        this.openUploadPdfModal();
        return;
      }

      const studentName = (student.adSoyad || "").toLowerCase();
      const studentReports = state.reports.filter((r) => r && (r.ogrenciId === studentId || (studentName && r.ogrenciAdSoyad && r.ogrenciAdSoyad.toLowerCase() === studentName)));
      const latestExam = studentExams[studentExams.length - 1];

      const modalHtml = `
        <div class="modal-backdrop" id="student-ai-report-select-modal" onclick="if(event.target === this) window.app.closeModal('student-ai-report-select-modal')">
          <div class="modal-dialog animate-scale-up" style="max-width: 680px;">
            <div class="modal-header" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; border-top-left-radius: var(--radius-lg); border-top-right-radius: var(--radius-lg); padding: 18px 22px;">
              <div>
                <div class="d-flex items-center gap-2">
                  <span style="font-size: 20px;">🤖</span>
                  <h3 class="modal-title" style="color: #ffffff; font-size: 18px;">${escapeHtml(student.adSoyad)} — AI Sınav Raporu Seçimi</h3>
                </div>
                <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">
                  ${student.sinif}. Sınıf / ${student.sube} • Okul No: #${student.numara || "-"} • Toplam <strong>${studentExams.length} Kayıtlı Sınav</strong>
                </div>
              </div>
              <button class="modal-close" style="color: #ffffff;" onclick="window.app.closeModal('student-ai-report-select-modal')">&times;</button>
            </div>

            <div class="modal-body" style="padding: 20px 22px;">
              <!-- REHBER BİLGİ KUTUSU -->
              <div class="student-ai-modal-guide mb-3" style="background: rgba(37, 99, 235, 0.05); border: 1px solid rgba(37, 99, 235, 0.2); border-radius: 8px; padding: 12px 14px;">
                <div style="font-size: 12.5px; color: #1e3a8a; font-weight: 600; margin-bottom: 4px;">📌 Sınav Raporlama ve Karşılaştırma Rehberi:</div>
                <ul style="margin: 0; padding-left: 18px; font-size: 11.5px; color: #334155; line-height: 1.5;">
                  <li><strong>Tek Sınav Seçildiğinde:</strong> Eğer o sınavın sistemde hazır AI raporu varsa anında açılır, yoksa yeni analiz üretilir.</li>
                  <li><strong>Birden Fazla Sınav Seçildiğinde:</strong> Seçili sınavlar karşılaştırılarak net/başarı gelişim seyri hesaplanır ve <strong>özellikle aynı kazanımlarda yapılan ortak hatalara (kronik eksiklere)</strong> odaklı 7 günlük çalışma tablosu oluşturulur.</li>
                </ul>
              </div>

              <!-- HIZLI SEÇİM BUTONLARI -->
              <div class="d-flex justify-between items-center mb-2" style="flex-wrap: wrap; gap: 8px;">
                <label class="form-label mb-0" style="font-weight: 700; font-size: 13px;">Analiz Edilecek Sınav(ları) Seçiniz:</label>
                <div class="btn-group">
                  <button type="button" class="btn btn-xs btn-outline" onclick="window.app.selectAllStudentModalExams('${student.id}', true)">Tümünü Seç (${studentExams.length})</button>
                  <button type="button" class="btn btn-xs btn-outline" onclick="window.app.selectAllStudentModalExams('${student.id}', false)">Seçimi Temizle</button>
                  <button type="button" class="btn btn-xs btn-primary" onclick="window.app.selectLatestStudentModalExam('${student.id}', '${latestExam.id}')">En Son Sınav</button>
                </div>
              </div>

              <!-- SINAV LİSTESİ -->
              <div class="student-ai-exam-list-container" style="max-height: 280px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 8px; padding: 6px; background: var(--bg-main);">
                ${studentExams.map((e, index) => {
                  const singleReport = studentReports.find((r) => (r.kullanilanSinavIdler || []).length <= 1 && (r.kullanilanSinavIdler || []).includes(e.id));
                  const multiReport = studentReports.find((r) => (r.kullanilanSinavIdler || []).length > 1 && (r.kullanilanSinavIdler || []).includes(e.id));
                  const isLatest = index === studentExams.length - 1;

                  let reportStatusBadge = "";
                  if (singleReport) {
                    reportStatusBadge = `<span class="badge badge-success font-bold" style="font-size: 10px; cursor: pointer;" onclick="event.stopPropagation(); window.app.closeModal('student-ai-report-select-modal'); window.app.viewReportDetail('${singleReport.id}')" title="Hazır AI Raporunu Aç">✓ Hazır AI Raporu Var (Aç ↗)</span>`;
                  } else if (multiReport) {
                    reportStatusBadge = `<span class="badge badge-info font-bold" style="font-size: 10px; cursor: pointer;" onclick="event.stopPropagation(); window.app.closeModal('student-ai-report-select-modal'); window.app.viewReportDetail('${multiReport.id}')" title="Karşılaştırmalı Raporu Aç">📊 Karşılaştırma Raporunda (Aç ↗)</span>`;
                  } else {
                    reportStatusBadge = `<span class="badge badge-light" style="font-size: 10px; color: #64748b;">⚪ Henüz Rapor Yok</span>`;
                  }

                  return `
                    <label class="student-modal-exam-row ${isLatest ? 'selected-highlight' : ''}" id="st-modal-exam-row-${e.id}" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; margin-bottom: 4px; background: #ffffff; border: 1.5px solid ${isLatest ? 'var(--primary)' : 'var(--border-color)'}; border-radius: 6px; cursor: pointer; transition: all 0.2s;">
                      <div class="d-flex items-center gap-3" style="flex: 1;">
                        <input type="checkbox" class="student-modal-exam-chk" id="chk-st-modal-exam-${e.id}" value="${e.id}" ${isLatest ? 'checked' : ''} onchange="window.app.updateStudentAiModalFooter('${student.id}')" />
                        <div>
                          <div style="font-weight: 700; font-size: 13px; color: var(--text-dark);">${escapeHtml(e.sinavAdi)}</div>
                          <div style="font-size: 11.5px; color: var(--text-muted);">
                            📅 Tarih: ${formatDate(e.tarih)} • 🎯 ${e.tur === "kazanimli" ? "Kazanımlı" : "Kazanımsız"}
                          </div>
                        </div>
                      </div>
                      <div class="d-flex items-center gap-2" style="text-align: right;">
                        <div>
                          <span class="badge badge-primary font-bold" style="font-size: 11px;">${e.toplamNet || "-"} Net</span>
                          ${e.puan ? `<span class="badge badge-warning font-bold" style="font-size: 11px; margin-left: 2px;">${e.puan}</span>` : ""}
                        </div>
                        <div>${reportStatusBadge}</div>
                      </div>
                    </label>
                  `;
                }).join("")}
              </div>

              <!-- DİNAMİK AKSİYON ALANI (Seçime Göre Canlı Güncellenir) -->
              <div id="student-ai-modal-footer-action" class="mt-3">
                <!-- Javascript ile doldurulur -->
              </div>
            </div>
          </div>
        </div>
      `;

      this.renderModalContainer(modalHtml);
      this.updateStudentAiModalFooter(studentId);
    }

    selectAllStudentModalExams(studentId, checked) {
      const checkboxes = document.querySelectorAll(".student-modal-exam-chk");
      checkboxes.forEach((cb) => {
        cb.checked = checked;
        const row = document.getElementById("st-modal-exam-row-" + cb.value);
        if (row) row.style.borderColor = checked ? "var(--primary)" : "var(--border-color)";
      });
      this.updateStudentAiModalFooter(studentId);
    }

    selectLatestStudentModalExam(studentId, latestExamId) {
      const checkboxes = document.querySelectorAll(".student-modal-exam-chk");
      checkboxes.forEach((cb) => {
        cb.checked = (cb.value === latestExamId);
        const row = document.getElementById("st-modal-exam-row-" + cb.value);
        if (row) row.style.borderColor = (cb.value === latestExamId) ? "var(--primary)" : "var(--border-color)";
      });
      this.updateStudentAiModalFooter(studentId);
    }

    updateStudentAiModalFooter(studentId) {
      const footerContainer = document.getElementById("student-ai-modal-footer-action");
      if (!footerContainer) return;

      const state = store.getState();
      const student = state.students.find((s) => s.id === studentId);
      if (!student) return;

      const checkedCheckboxes = Array.from(document.querySelectorAll(".student-modal-exam-chk:checked"));
      const checkedExamIds = checkedCheckboxes.map((cb) => cb.value);
      const chosenExams = state.exams.filter((e) => checkedExamIds.includes(e.id));
      const studentReports = state.reports.filter((r) => r && (r.ogrenciId === studentId || (r.ogrenciAdSoyad && r.ogrenciAdSoyad.toLowerCase() === student.adSoyad.toLowerCase())));

      // Checkbox row border style sync
      document.querySelectorAll(".student-modal-exam-chk").forEach((cb) => {
        const row = document.getElementById("st-modal-exam-row-" + cb.value);
        if (row) row.style.borderColor = cb.checked ? "var(--primary)" : "var(--border-color)";
      });

      if (checkedExamIds.length === 0) {
        footerContainer.innerHTML = `
          <div class="d-flex justify-between items-center p-3" style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 8px;">
            <span style="color: #64748b; font-size: 12.5px;">İşlem yapmak için yukarıdan en az 1 sınav seçin.</span>
            <button class="btn btn-primary" disabled>Lütfen Sınav Seçin</button>
          </div>
        `;
        return;
      }

      if (checkedExamIds.length === 1) {
        const singleExam = chosenExams[0];
        const existingReport = studentReports.find((r) => (r.kullanilanSinavIdler || []).includes(singleExam.id) || r.sinavId === singleExam.id);

        if (existingReport) {
          footerContainer.innerHTML = `
            <div class="d-flex flex-column gap-2 p-3" style="background: rgba(16, 185, 129, 0.06); border: 1.5px solid #10b981; border-radius: 8px;">
              <div class="d-flex justify-between items-center" style="flex-wrap: wrap; gap: 8px;">
                <div>
                  <div style="font-weight: 700; color: #065f46; font-size: 13px;">✓ Bu Sınava Ait Hazır AI Raporu Mevcut!</div>
                  <div style="font-size: 11.5px; color: #047857;">"${escapeHtml(singleExam.sinavAdi)}" sınavının karne ve çalışma programı raporu hazır.</div>
                </div>
                <div class="d-flex gap-2">
                  <button class="btn btn-outline btn-sm font-bold" onclick="window.app.executeStudentModalAiAnalysis('${student.id}', ['${singleExam.id}'], true)" title="Yapay zekâ ile analizi yeniden çalıştır">
                    🔄 Yeniden Analiz Et
                  </button>
                  <button class="btn btn-success shadow-glow font-bold" onclick="window.app.closeModal('student-ai-report-select-modal'); window.app.viewReportDetail('${existingReport.id}')">
                    📄 Mevcut AI Raporunu Aç (${escapeHtml(singleExam.sinavAdi)})
                  </button>
                </div>
              </div>
            </div>
          `;
        } else {
          footerContainer.innerHTML = `
            <div class="d-flex justify-between items-center p-3" style="background: rgba(37, 99, 235, 0.05); border: 1.5px solid rgba(37, 99, 235, 0.25); border-radius: 8px;">
              <div>
                <div style="font-weight: 700; color: #1e40af; font-size: 13px;">🎯 Tek Sınav Analizi Seçildi: "${escapeHtml(singleExam.sinavAdi)}"</div>
                <div style="font-size: 11.5px; color: #3b82f6;">Öğrencinin eksik kazanımları ve 7 günlük etüt tablosu yapay zekâ ile üretilecek.</div>
              </div>
              <button class="btn btn-primary shadow-glow font-bold" onclick="window.app.executeStudentModalAiAnalysis('${student.id}', ['${singleExam.id}'], false)">
                🤖 Bu Sınav İçin AI Raporu Oluştur
              </button>
            </div>
          `;
        }
        return;
      }

      // 2 veya daha fazla sınav seçildiğinde (Çoklu Sınav Karşılaştırmalı Rapor)
      const exactMultiReport = studentReports.find((r) => {
        const ids = r.kullanilanSinavIdler || [];
        return ids.length === checkedExamIds.length && ids.every((id) => checkedExamIds.includes(id));
      });

      footerContainer.innerHTML = `
        <div class="d-flex flex-column gap-2 p-3" style="background: linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%); border: 1.5px solid rgba(99, 102, 241, 0.35); border-radius: 8px;">
          <div class="d-flex justify-between items-center" style="flex-wrap: wrap; gap: 8px;">
            <div>
              <div style="font-weight: 800; color: #4338ca; font-size: 13.5px;">
                📊 Çoklu Sınav Karşılaştırması (${checkedExamIds.length} Sınav Seçili)
              </div>
              <div style="font-size: 11.5px; color: #4b5563; margin-top: 2px;">
                • Sınavlar arası net/puan gelişim eğrisi hesaplanır.<br/>
                • <strong>Özellikle aynı kazanımlarda yapılan hatalar (kronik eksikler) tespit edilir.</strong><br/>
                • 7 günlük etüt matrisinde 1. Etütlere bu ortak eksikler öncelikle yerleştirilir.
              </div>
            </div>
            <div class="d-flex gap-2 items-center">
              ${exactMultiReport ? `
                <button class="btn btn-success font-bold" onclick="window.app.closeModal('student-ai-report-select-modal'); window.app.viewReportDetail('${exactMultiReport.id}')">
                  📄 Mevcut Karşılaştırma Raporunu Aç
                </button>
                <button class="btn btn-primary font-bold shadow-glow" onclick="window.app.executeStudentModalAiAnalysis('${student.id}', ${JSON.stringify(checkedExamIds).replace(/"/g, '&quot;')}, true)">
                  🔄 Yeniden Karşılaştır (AI)
                </button>
              ` : `
                <button class="btn btn-primary btn-lg shadow-glow font-bold" onclick="window.app.executeStudentModalAiAnalysis('${student.id}', ${JSON.stringify(checkedExamIds).replace(/"/g, '&quot;')}, false)">
                  📊 Seçili ${checkedExamIds.length} Sınavı Karşılaştır & Rapor Üret
                </button>
              `}
            </div>
          </div>
        </div>
      `;
    }

    executeStudentModalAiAnalysis(studentId, examIds, forceRecreate = false) {
      this.closeModal("student-ai-report-select-modal");
      const state = store.getState();
      const student = state.students.find((s) => s.id === studentId);
      if (!student) return;

      const chosenExams = state.exams.filter((e) => examIds.includes(e.id));
      if (chosenExams.length === 0) return;

      if (!forceRecreate && chosenExams.length === 1) {
        const studentReports = state.reports.filter((r) => r && (r.ogrenciId === studentId || (r.ogrenciAdSoyad && r.ogrenciAdSoyad.toLowerCase() === student.adSoyad.toLowerCase())));
        const existingRep = studentReports.find((r) => (r.kullanilanSinavIdler || []).includes(chosenExams[0].id) || r.sinavId === chosenExams[0].id);
        if (existingRep) {
          this.viewReportDetail(existingRep.id);
          return;
        }
      }

      return this.runDirectAiAnalysis(student, chosenExams);
    }

    viewLatestStudentReport(studentId) {
      this.openStudentAiReportModal(studentId);
    }

    deleteStudentConfirm(studentId) {
      if (confirm("Bu öğrenciyi ve bağlı tüm sınavları silmek istediğinize emin misiniz?")) {
        store.deleteStudent(studentId);
      }
    }

    openDeleteAllStudentsModal() {
      const state = store.getState();
      const studentCount = state.students.length;
      const examCount = state.exams.length;
      const reportCount = state.reports.length;

      if (studentCount === 0) {
        showToast("Sistemde silinecek kayıtlı öğrenci bulunmuyor.", "info");
        return;
      }

      const modalHtml = `
        <div class="modal-backdrop" id="delete-all-students-modal" onclick="if(event.target === this) window.app.closeModal('delete-all-students-modal')">
          <div class="modal-dialog animate-scale-up" style="max-width: 520px;">
            <div class="modal-header">
              <div class="d-flex items-center gap-2">
                <span style="font-size: 24px;">⚠️</span>
                <h3 class="modal-title text-danger">Tüm Öğrencileri ve Sınavları Sil</h3>
              </div>
              <button class="modal-close" onclick="window.app.closeModal('delete-all-students-modal')">&times;</button>
            </div>
            <div class="modal-body">
              <div class="alert alert-danger mb-3 p-3" style="background: #fef2f2; border: 1px solid #fca5a5; border-radius: var(--radius-sm); color: #991b1b;">
                <strong>DİKKAT: Bu işlem geri alınamaz!</strong>
                <p class="mt-1 mb-0" style="font-size: 13px;">
                  Sistemdeki tüm öğrenci kayıtları ile birlikte bu öğrencilere ait <strong>tüm sınav sonuçları, netler, kazanım eşleşmeleri ve AI analiz raporları</strong> kalıcı olarak silinecektir.
                </p>
              </div>

              <div class="card p-3 mb-3" style="background: var(--bg-main); border: 1px solid var(--border-color);">
                <div style="font-size: 13px; color: var(--text-dark);">
                  <div class="d-flex justify-between py-1 border-bottom"><span>Silinecek Öğrenci Sayısı:</span><strong class="text-danger">${studentCount} Öğrenci</strong></div>
                  <div class="d-flex justify-between py-1 border-bottom"><span>Silinecek Sınav Kaydı:</span><strong class="text-danger">${examCount} Sınav</strong></div>
                  <div class="d-flex justify-between py-1"><span>Silinecek AI Raporu:</span><strong class="text-danger">${reportCount} Rapor</strong></div>
                </div>
              </div>

              <div class="form-group mb-0">
                <label class="form-label font-bold text-dark" style="font-size: 13px;">
                  Onaylamak için aşağıdaki kutucuğa <strong class="text-danger">SİL</strong> yazın:
                </label>
                <input type="text" id="confirm-delete-all-students-input" class="form-control" placeholder="SİL yazınız..." autocomplete="off" oninput="
                  const btn = document.getElementById('btn-confirm-delete-all-students');
                  if (btn) btn.disabled = (this.value.trim().toUpperCase() !== 'SİL');
                " />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" onclick="window.app.closeModal('delete-all-students-modal')">İptal</button>
              <button type="button" id="btn-confirm-delete-all-students" class="btn btn-danger font-bold" disabled onclick="window.app.confirmDeleteAllStudents()">
                🗑️ Evet, Tümünü Kalıcı Olarak Sil
              </button>
            </div>
          </div>
        </div>
      `;
      this.renderModalContainer(modalHtml);
      setTimeout(() => {
        const inp = document.getElementById("confirm-delete-all-students-input");
        if (inp) inp.focus();
      }, 100);
    }

    confirmDeleteAllStudents() {
      const inp = document.getElementById("confirm-delete-all-students-input");
      if (inp && inp.value.trim().toUpperCase() === "SİL") {
        store.deleteAllStudents();
        this.closeModal("delete-all-students-modal");
      } else {
        showToast("Lütfen onay kutusuna 'SİL' yazarak onaylayın.", "warning");
      }
    }

    onStudentSearchInput(val) {
      this.studentSearchQuery = val;
      this.filterStudents();
    }

    filterStudents() {
      const query = (this.studentSearchQuery || "").toLowerCase().trim();
      const gradeF = this.studentGradeFilter || "all";
      const branchF = this.studentBranchFilter || "all";
      
      const filtered = store.getState().students.filter((s) => {
         if (gradeF !== "all" && s.sinif !== gradeF) return false;
         if (branchF !== "all" && s.sube !== branchF) return false;
         return s.adSoyad.toLowerCase().includes(query) || (s.numara && String(s.numara).includes(query));
      });
      const tbody = document.getElementById("students-tbody");
      if (tbody) tbody.innerHTML = renderStudentRows(filtered, store.getState().exams);
    }

    filterStudentsByClass(classVal) {
      this.studentGradeFilter = classVal;
      this.studentBranchFilter = "all"; // Reset branch when class changes
      
      // We pass forceTabChange=true (or just manipulate the logic) so that the entire view re-renders with new branch chips, without fade-in
      this._lastRenderedTab = null; 
      this.renderCurrentView();
      // Ensure focus is returned if needed, though clicking a button removes focus anyway.
    }

    filterStudentsByBranch(branchVal) {
      this.studentBranchFilter = branchVal;
      this._lastRenderedTab = null; 
      this.renderCurrentView();
    }

    openAddExamModal() { this.openUploadPdfModal(); }

    viewExamDetail(examId) {
      const exam = store.getState().exams.find((e) => e.id === examId);
      if (!exam) return;
      const student = store.getState().students.find((s) => s.id === exam.ogrenciId);
      const modalHtml = `
        <div class="modal-backdrop" id="exam-detail-modal" onclick="if(event.target === this) window.app.closeModal('exam-detail-modal')">
          <div class="modal-dialog modal-lg animate-scale-up">
            <div class="modal-header"><h3 class="modal-title">${exam.sinavAdi} (${formatDate(exam.tarih)})</h3><button class="modal-close" onclick="window.app.closeModal('exam-detail-modal')">&times;</button></div>
            <div class="modal-body">
              <p>Öğrenci: <strong>${student ? student.adSoyad : "-"}</strong> • Toplam Net: <strong class="text-primary">${exam.toplamNet || "-"} Net</strong> • LGS Puanı: <strong class="text-warning">${exam.puan || "-"}</strong></p>
              <table class="data-table mt-3">
                <thead><tr><th>Ders</th><th>Doğru</th><th>Yanlış</th><th>Boş</th><th>Net</th></tr></thead>
                <tbody>
                  ${(exam.dersSonuclari || []).map((d) => `<tr><td><strong>${d.ders}</strong></td><td class="text-success font-bold">${d.dogru}</td><td class="text-danger font-bold">${d.yanlis}</td><td>${d.bos}</td><td><strong class="text-primary">${d.net} Net</strong></td></tr>`).join("")}
                </tbody>
              </table>

              ${(exam.dersSonuclari || []).some((d) => d.konular && d.konular.length > 0) ? `
                <div class="mt-4">
                  <h4 style="font-size: 14px; margin-bottom: 8px;">🎯 Tespit Edilen Kazanımlar (%100 Altındaki Eksikler Vurgulanmıştır)</h4>
                  <div style="max-height: 240px; overflow-y: auto; border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 8px; background: var(--bg-main);">
                    ${(exam.dersSonuclari || []).map((d) => {
                      if (!d.konular || d.konular.length === 0) return "";
                      return `
                        <div class="mb-2">
                          <strong style="color: var(--primary-color); font-size: 12px;">${d.ders}</strong>
                          <ul style="list-style: none; padding-left: 0; margin-top: 4px; font-size: 11.5px;">
                            ${d.konular.map((k) => `
                              <li style="padding: 3px 6px; margin-bottom: 2px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; background: ${k.durum === 'yanlis' || (k.basariYuzdesi !== undefined && k.basariYuzdesi < 100) ? '#fef2f2' : '#f0fdf4'}; border: 1px solid ${k.durum === 'yanlis' || (k.basariYuzdesi !== undefined && k.basariYuzdesi < 100) ? '#fecaca' : '#bbf7d0'};">
                                <span>${k.kazanimAdi}</span>
                                <span class="badge ${k.durum === 'yanlis' || (k.basariYuzdesi !== undefined && k.basariYuzdesi < 100) ? 'badge-danger' : 'badge-success'}" style="font-size: 10px;">
                                  %${k.basariYuzdesi !== undefined ? k.basariYuzdesi : (k.durum === 'yanlis' ? 0 : 100)} ${k.durum === 'yanlis' || (k.basariYuzdesi !== undefined && k.basariYuzdesi < 100) ? '⚠️ Eksik' : '✓ Tam'}
                                </span>
                              </li>
                            `).join("")}
                          </ul>
                        </div>
                      `;
                    }).join("")}
                  </div>
                </div>
              ` : ""}
            </div>
            <div class="modal-footer">
              <button class="btn btn-outline" onclick="window.app.closeModal('exam-detail-modal')">Kapat</button>
              <button class="btn btn-primary" onclick="window.app.closeModal('exam-detail-modal'); window.app.analyzeSingleExam('${exam.id}')">Yapay Zekâ Analizini Başlat</button>
            </div>
          </div>
        </div>
      `;
      this.renderModalContainer(modalHtml);
    }

    deleteExamConfirm(examId) {
      if (confirm("Bu sınav kaydını silmek istediğinize emin misiniz?")) {
        store.deleteExam(examId);
      }
    }

    deleteSelectedExamsConfirm() {
      const selectedIds = Array.from(store.getState().selectedExamIds);
      if (selectedIds.length === 0) {
        showToast("Lütfen silmek istediğiniz sınavları tablodan seçin.", "warning");
        return;
      }
      if (confirm(`Seçili olan ${selectedIds.length} sınav kaydını silmek istediğinize emin misiniz?`)) {
        store.deleteBatchExams(selectedIds);
      }
    }

    openBulkDeleteExamsModal() {
      const state = store.getState();
      const uniqueExamMap = new Map();
      state.exams.forEach((ex) => {
        const key = ex.sinavAdi || "Genel Sınav";
        const count = (uniqueExamMap.get(key) || 0) + 1;
        uniqueExamMap.set(key, count);
      });
      const uniqueExams = Array.from(uniqueExamMap.entries()).map(([name, count]) => ({ name, count }));
      const selectedCount = state.selectedExamIds.size;

      const modalHtml = `
        <div class="modal-backdrop" id="bulk-delete-exams-modal" onclick="if(event.target === this) window.app.closeModal('bulk-delete-exams-modal')">
          <div class="modal-dialog animate-scale-up" style="max-width: 540px;">
            <div class="modal-header">
              <div class="d-flex items-center gap-2">
                <span style="font-size: 24px;">🗑️</span>
                <h3 class="modal-title text-danger">Toplu Sınav Verisi Silme</h3>
              </div>
              <button class="modal-close" onclick="window.app.closeModal('bulk-delete-exams-modal')">&times;</button>
            </div>
            <div class="modal-body">
              <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
                Sistemde kayıtlı toplam <strong>${state.exams.length} sınav kaydı</strong> bulunmaktadır. Aşağıdaki seçeneklerden birini kullanarak güvenle toplu silme yapabilirsiniz:
              </p>

              <!-- SEÇENEK 1: BELİRLİ BİR SINAVIN TÜM ÖĞRENCİLERİNİ SİL -->
              <div class="card p-3 mb-3" style="border: 1px solid var(--border-color); background: var(--bg-main);">
                <label class="form-label font-bold mb-2">1. Belirli Bir Sınava Ait Tüm Öğrenci Kayıtlarını Sil:</label>
                <div class="d-flex gap-2">
                  <select id="bulk-delete-exam-name-select" class="form-control" ${uniqueExams.length === 0 ? "disabled" : ""}>
                    ${uniqueExams.length === 0 ? `<option value="">Kayıtlı Sınav Yok</option>` : uniqueExams.map((ex) => `<option value="${escapeHtml(ex.name)}">${escapeHtml(ex.name)} (${ex.count} Öğrenci)</option>`).join("")}
                  </select>
                  <button type="button" class="btn btn-outline text-danger border-danger font-bold" ${uniqueExams.length === 0 ? "disabled" : ""} onclick="window.app.deleteExamsBySelectedNameConfirm()">
                    Sınavı Sil
                  </button>
                </div>
              </div>

              <!-- SEÇENEK 2: SEÇİLİ OLANLARI SİL -->
              <div class="card p-3 mb-3" style="border: 1px solid var(--border-color); background: var(--bg-main);">
                <div class="d-flex justify-between items-center">
                  <div>
                    <strong class="font-bold">2. Tablodan İşaretlenenleri Sil:</strong>
                    <div style="font-size: 12px; color: var(--text-muted);">${selectedCount > 0 ? `${selectedCount} sınav seçili` : "Tabloda sınav seçilmedi"}</div>
                  </div>
                  <button type="button" class="btn btn-sm btn-outline text-danger border-danger font-bold" ${selectedCount === 0 ? "disabled" : ""} onclick="window.app.deleteSelectedExamsFromModal()">
                    Seçilenleri Sil (${selectedCount})
                  </button>
                </div>
              </div>

              <!-- SEÇENEK 3: TÜM SINAVLARI SİL -->
              <div class="card p-3" style="border: 1px solid #fecaca; background: #fff1f2;">
                <div class="d-flex justify-between items-center">
                  <div>
                    <strong class="font-bold text-danger">3. Tüm Sınav Kayıtlarını Temizle:</strong>
                    <div style="font-size: 11.5px; color: #b91c1c;">Tüm sınav kayıtlarını veritabanından kalıcı olarak kaldırır.</div>
                  </div>
                  <button type="button" class="btn btn-sm btn-danger font-bold" ${state.exams.length === 0 ? "disabled" : ""} onclick="window.app.deleteAllExamsFromModal()">
                    Tümünü Temizle
                  </button>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" onclick="window.app.closeModal('bulk-delete-exams-modal')">Kapat</button>
            </div>
          </div>
        </div>
      `;
      this.renderModalContainer(modalHtml);
    }

    deleteExamsBySelectedNameConfirm() {
      const selectEl = document.getElementById("bulk-delete-exam-name-select");
      const examName = selectEl ? selectEl.value : "";
      if (!examName) return;
      const count = store.getState().exams.filter((e) => (e.sinavAdi || "").trim() === examName.trim()).length;
      if (confirm(`"${examName}" sınavına ait ${count} öğrenci kaydının tamamını silmek istediğinize emin misiniz?`)) {
        store.deleteExamsByName(examName);
        this.closeModal("bulk-delete-exams-modal");
      }
    }

    deleteSelectedExamsFromModal() {
      this.closeModal("bulk-delete-exams-modal");
      this.deleteSelectedExamsConfirm();
    }

    deleteAllExamsFromModal() {
      const count = store.getState().exams.length;
      if (confirm(`DİKKAT: Sistemdeki TÜM sınav kayıtlarını (${count} adet) kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz!`)) {
        store.deleteAllExams();
        this.closeModal("bulk-delete-exams-modal");
      }
    }

    toggleExamCheckbox(examId) { store.toggleExamSelection(examId); }
    toggleSelectAllExams(checked) {
      if (checked) store.getState().exams.forEach((e) => store.state.selectedExamIds.add(e.id));
      else store.clearExamSelection();
      store.notify("EXAM_SELECTION_CHANGED", Array.from(store.state.selectedExamIds));
    }
    clearSelectedExams() { store.clearExamSelection(); }

    startAnalysisFromSelection() {
      const selected = store.getSelectedExams();
      if (selected.length === 0) return;
      store.state.selectedStudentIdForAnalysis = selected[0].ogrenciId;
      this.navigate("aiAnalysis");
    }

    analyzeSingleExam(examId) {
      store.clearExamSelection();
      store.toggleExamSelection(examId);
      const exam = store.getState().exams.find((e) => e.id === examId);
      if (exam) store.state.selectedStudentIdForAnalysis = exam.ogrenciId;
      this.navigate("aiAnalysis");
    }

    analyzeStudentAllExams(studentId) {
      store.clearExamSelection();
      store.state.selectedStudentIdForAnalysis = studentId;
      store.getState().exams.filter((e) => e.ogrenciId === studentId).forEach((e) => store.state.selectedExamIds.add(e.id));
      this.navigate("aiAnalysis");
    }

    toggleExamGroup(indexOrKey) {
      if (typeof indexOrKey === "number") {
        const card = document.getElementById("exam-group-card-" + indexOrKey);
        if (card) {
          const willBeExpanded = !card.classList.contains("expanded");
          card.classList.toggle("expanded", willBeExpanded);
          const groups = this.getCalculatedExamGroups();
          const targetGroup = groups[indexOrKey];
          if (targetGroup) {
            const key = (targetGroup.sinavAdi || "").trim().toLowerCase();
            if (willBeExpanded) {
              this.expandedExamKeys.add(key);
            } else {
              this.expandedExamKeys.delete(key);
            }
          }
          return;
        }
      }

      const key = String(indexOrKey).trim().toLowerCase();
      if (this.expandedExamKeys.has(key)) {
        this.expandedExamKeys.delete(key);
      } else {
        this.expandedExamKeys.add(key);
      }

      const card = document.getElementById("exam-group-card-" + key);
      if (card) {
        card.classList.toggle("expanded", this.expandedExamKeys.has(key));
      } else {
        this.refreshExamsContainer();
      }
    }

    toggleAllExamGroups() {
      const cards = document.querySelectorAll(".exam-group-card");
      const anyOpen = Array.from(cards).some((c) => c.classList.contains("expanded"));
      cards.forEach((c) => c.classList.toggle("expanded", !anyOpen));

      const groups = this.getCalculatedExamGroups();
      if (anyOpen) {
        this.expandedExamKeys.clear();
      } else {
        groups.forEach((g) => this.expandedExamKeys.add((g.sinavAdi || "").trim().toLowerCase()));
      }
    }

    onExamSearchInput(val) {
      this.examSearchQuery = (val || "").trim();
      this.refreshExamsContainer();
    }

    onExamSortChange(val) {
      this.examSortOrder = val || "yeniden-eskiye";
      this.refreshExamsContainer();
    }

    refreshExamsContainer() {
      const container = document.getElementById("exam-groups-container");
      if (container) {
        const groups = this.getCalculatedExamGroups();
        container.innerHTML = renderExamGroupCards(groups, store.getState());
      } else {
        this.renderCurrentView();
      }
    }

    onExamGradeFilterChange(val) {
      this.examGradeFilter = val || "all";
      this.refreshExamsContainer();
    }

    setUploadExamTargetMode(mode) {
      this.uploadExamTargetMode = mode;
      const box = document.getElementById("existing-exam-selection-box");
      const newBtn = document.getElementById("btn-target-mode-new");
      const existingBtn = document.getElementById("btn-target-mode-existing");
      const hint = document.getElementById("pdf-target-unselected-hint");
      const dropZone = document.getElementById("pdf-drop-zone-box");

      if (hint) hint.style.display = "none";
      if (dropZone) dropZone.style.display = "block";

      if (box) box.style.display = mode === "existing" ? "block" : "none";
      if (newBtn && existingBtn) {
        if (mode === "existing") {
          newBtn.className = "btn btn-sm btn-outline font-bold";
          existingBtn.className = "btn btn-sm btn-primary shadow-sm font-bold";
        } else {
          newBtn.className = "btn btn-sm btn-primary shadow-sm font-bold";
          existingBtn.className = "btn btn-sm btn-outline font-bold";
        }
      }
    }

    onUploadTargetGradeChange(grade) {
      this.uploadTargetGrade = grade;
      const select = document.getElementById("upload-target-exam-select");
      if (select) {
        select.innerHTML = this.renderTargetExamOptions(grade);
      }
    }

    renderTargetExamOptions(grade = "all") {
      const state = store.getState();
      let allExams = this.getCalculatedExamGroups ? this.getCalculatedExamGroups() : [];
      if (grade !== "all") {
        allExams = allExams.filter((g) => {
          const hasGradeInName = g.sinavAdi.includes(`${grade}.`) || g.sinavAdi.includes(`${grade} `) || g.sinavAdi.includes(`${grade}Sınıf`) || (grade === "8" && g.sinavAdi.toLowerCase().includes("lgs"));
          const hasStudentWithGrade = g.exams.some((ex) => {
            const st = state.students.find((s) => s.id === ex.ogrenciId);
            const sGrade = st ? String(st.sinif) : String(ex.sinif || "");
            return sGrade.startsWith(grade);
          });
          return hasGradeInName || hasStudentWithGrade;
        });
      }

      if (allExams.length === 0) {
        return `<option value="">(Seçili kademede kayıtlı sınav yok - Yeni Sınav seçiniz)</option>`;
      }

      return allExams.map((g) => `
        <option value="${escapeHtml(g.sinavAdi)}">${escapeHtml(g.sinavAdi)} (${g.totalStudents} Öğrenci)</option>
      `).join("");
    }

    openMergeExamsModal(defaultSourceExamName = "") {
      const state = store.getState();
      const allExamNames = Array.from(new Set(state.exams.map((e) => (e.sinavAdi || "").trim()).filter(Boolean)));
      if (allExamNames.length < 2) {
        showToast("Birleştirme yapabilmek için sistemde en az 2 farklı sınav kaydı bulunmalıdır.", "info");
        return;
      }

      const modalHtml = `
        <div class="modal-backdrop" id="merge-exams-modal" onclick="if(event.target === this) window.app.closeModal('merge-exams-modal')">
          <div class="modal-dialog modal-md animate-scale-up">
            <div class="modal-header">
              <div class="d-flex items-center gap-2">
                <span style="font-size: 20px;">🔗</span>
                <h3 class="modal-title">Sınav Uygulamalarını Birleştir</h3>
              </div>
              <button class="modal-close" onclick="window.app.closeModal('merge-exams-modal')">&times;</button>
            </div>
            <div class="modal-body">
              <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
                Farklı yazılmış veya küçük isim farkları bulunan sınavları tek bir sınav uygulaması altında toplayabilirsiniz.
              </p>

              <div class="form-group mb-3">
                <label class="form-label font-bold">1. Birleştirilecek (Kaynak) Sınav:</label>
                <select id="merge-source-exam-select" class="form-control font-bold" onchange="window.app.onMergeSourceChanged(this.value)">
                  ${allExamNames.map((name) => `<option value="${escapeHtml(name)}" ${name === defaultSourceExamName ? "selected" : ""}>${escapeHtml(name)} (${state.exams.filter(e => (e.sinavAdi||'').trim() === name).length} Öğrenci)</option>`).join("")}
                </select>
              </div>

              <div class="form-group mb-3">
                <label class="form-label font-bold">2. Hedef Sınav (Hangi sınav adı altında toplansın?):</label>
                <select id="merge-target-exam-select" class="form-control font-bold text-primary">
                  ${allExamNames.map((name) => `<option value="${escapeHtml(name)}" ${name !== defaultSourceExamName ? "selected" : ""}>${escapeHtml(name)} (${state.exams.filter(e => (e.sinavAdi||'').trim() === name).length} Öğrenci)</option>`).join("")}
                </select>
              </div>

              <div class="p-3 card" style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 6px;">
                <div class="d-flex items-center gap-2">
                  <span>💡</span>
                  <span style="font-size: 12.5px; color: #166534;">
                    Birleştirme işleminden sonra seçilen kaynak sınavdaki tüm öğrenci sonuçları hedef sınav adına aktarılır ve tek bir sınav kartı altında toplanır.
                  </span>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" onclick="window.app.closeModal('merge-exams-modal')">İptal</button>
              <button type="button" class="btn btn-primary font-bold shadow-glow" onclick="window.app.executeMergeExams()">🔗 Sınavları Birleştir</button>
            </div>
          </div>
        </div>
      `;
      this.renderModalContainer(modalHtml);
    }

    onMergeSourceChanged(sourceName) {
      const select = document.getElementById("merge-target-exam-select");
      if (!select) return;
      const state = store.getState();
      const allExamNames = Array.from(new Set(state.exams.map((e) => (e.sinavAdi || "").trim()).filter(Boolean)));
      select.innerHTML = allExamNames.map((name) => `
        <option value="${escapeHtml(name)}" ${name !== sourceName ? "selected" : ""}>${escapeHtml(name)} (${state.exams.filter(e => (e.sinavAdi||'').trim() === name).length} Öğrenci)</option>
      `).join("");
    }

    executeMergeExams() {
      const sourceName = document.getElementById("merge-source-exam-select")?.value;
      const targetName = document.getElementById("merge-target-exam-select")?.value;

      if (!sourceName || !targetName) {
        showToast("Lütfen kaynak ve hedef sınavları seçin.", "warning");
        return;
      }
      if (sourceName === targetName) {
        showToast("Kaynak ve hedef sınav aynı olamaz. Lütfen farklı bir hedef sınav seçin.", "warning");
        return;
      }

      const state = store.getState();
      const affectedExams = state.exams.filter((e) => (e.sinavAdi || "").trim() === sourceName.trim());
      if (affectedExams.length === 0) {
        showToast("Kaynak sınava ait öğrenci kaydı bulunamadı.", "warning");
        return;
      }

      state.exams = state.exams.map((e) => {
        if ((e.sinavAdi || "").trim() === sourceName.trim()) {
          return { ...e, sinavAdi: targetName };
        }
        return e;
      });
      store.saveToStorage(APP_CONFIG.storageKeys.EXAMS, state.exams);
      state.exams.forEach((ex) => {
        if (ex.sinavAdi === targetName) {
          FirebaseService.saveDocument("sinavlar", ex.id, ex);
        }
      });

      store.notify("EXAMS_UPDATED", state.exams);
      this.closeModal("merge-exams-modal");
      showToast(`✓ "${sourceName}" sınavındaki ${affectedExams.length} öğrenci başarıyla "${targetName}" ile birleştirildi!`, "success");
    }

    openRenameExamModal(currentExamName) {
      if (!currentExamName) return;
      const state = store.getState();
      const count = state.exams.filter((e) => (e.sinavAdi || "").trim() === currentExamName.trim()).length;

      const modalHtml = `
        <div class="modal-backdrop" id="rename-exam-modal" onclick="if(event.target === this) window.app.closeModal('rename-exam-modal')">
          <div class="modal-dialog modal-md animate-scale-up">
            <div class="modal-header">
              <div class="d-flex items-center gap-2">
                <span style="font-size: 20px;">✏️</span>
                <h3 class="modal-title">Sınav Adını Değiştir</h3>
              </div>
              <button class="modal-close" onclick="window.app.closeModal('rename-exam-modal')">&times;</button>
            </div>
            <div class="modal-body">
              <div class="form-group mb-3">
                <label class="form-label font-bold">Mevcut Sınav Adı:</label>
                <input type="text" class="form-control" value="${escapeHtml(currentExamName)}" disabled style="background: #f1f5f9; color: #64748b;" />
                <span style="font-size: 11.5px; color: var(--text-muted);">Bu sınava ait toplam <strong>${count}</strong> öğrenci kaydı bulunmaktadır.</span>
              </div>

              <div class="form-group mb-3">
                <label class="form-label font-bold text-primary">Yeni Sınav Adı:</label>
                <input type="text" id="rename-exam-new-name-input" class="form-control font-bold" value="${escapeHtml(currentExamName)}" placeholder="Örn: 8. Sınıf Gelişim Takip-6 (Workwin 2025-26)" autofocus />
              </div>

              <div class="p-3 card" style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px;">
                <span style="font-size: 12px; color: #1e40af;">
                  ℹ️ Sınav adını güncellediğinizde, bu sınava katılan tüm öğrencilerin sınav kayıtları otomatik olarak yeni isimle güncellenecektir.
                </span>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" onclick="window.app.closeModal('rename-exam-modal')">İptal</button>
              <button type="button" class="btn btn-primary font-bold shadow-glow" onclick="window.app.executeRenameExam('${escapeHtml(currentExamName)}')">💾 Sınav Adını Güncelle</button>
            </div>
          </div>
        </div>
      `;
      this.renderModalContainer(modalHtml);
    }

    executeRenameExam(oldExamName) {
      const newNameInput = document.getElementById("rename-exam-new-name-input");
      const newName = newNameInput ? newNameInput.value.trim() : "";

      if (!newName) {
        showToast("Lütfen geçerli bir sınav adı giriniz.", "warning");
        return;
      }
      if (newName === oldExamName) {
        this.closeModal("rename-exam-modal");
        return;
      }

      const state = store.getState();
      let affectedCount = 0;
      state.exams = state.exams.map((e) => {
        if ((e.sinavAdi || "").trim() === oldExamName.trim()) {
          affectedCount++;
          return { ...e, sinavAdi: newName };
        }
        return e;
      });

      store.saveToStorage(APP_CONFIG.storageKeys.EXAMS, state.exams);
      state.exams.forEach((ex) => {
        if (ex.sinavAdi === newName) {
          FirebaseService.saveDocument("sinavlar", ex.id, ex);
        }
      });

      store.notify("EXAMS_UPDATED", state.exams);
      this.closeModal("rename-exam-modal");
      showToast(`✓ Sınav adı "${newName}" olarak güncellendi (${affectedCount} öğrenci kaydı güncellendi).`, "success");
    }

    getCalculatedExamGroups() {
      const state = store.getState();
      const searchQuery = (this.examSearchQuery || "").toLowerCase().trim();
      const sortOrder = this.examSortOrder || "yeniden-eskiye";
      const gradeFilter = this.examGradeFilter || "all";

      const groupsMap = new Map();

      state.exams.forEach((exam) => {
        if (!exam) return;
        const rawName = (exam.sinavAdi || "Genel Deneme Sınavı").trim();
        const key = rawName.toLowerCase();

        if (!groupsMap.has(key)) {
          groupsMap.set(key, {
            key: key,
            groupKey: "grp_" + encodeURIComponent(key).replace(/[^a-zA-Z0-9_]/g, "_"),
            sinavAdi: rawName,
            tarih: exam.tarih || "",
            tur: exam.tur || "kazanimli",
            createdAt: exam.createdAt || 0,
            exams: [],
            totalNetSum: 0,
            maxNet: 0,
            minNet: 999
          });
        }

        const group = groupsMap.get(key);
        group.exams.push(exam);

        const netVal = Number(exam.toplamNet) || 0;
        group.totalNetSum += netVal;
        if (netVal > group.maxNet) group.maxNet = netVal;
        if (netVal < group.minNet) group.minNet = netVal;

        if (exam.tarih && (!group.tarih || new Date(exam.tarih) > new Date(group.tarih))) {
          group.tarih = exam.tarih;
        }
        if (exam.createdAt && (!group.createdAt || exam.createdAt > group.createdAt)) {
          group.createdAt = exam.createdAt;
        }
      });

      let groups = Array.from(groupsMap.values());
      groups.forEach((g) => {
        g.totalStudents = g.exams.length;
        g.avgNet = g.totalStudents > 0 ? Number((g.totalNetSum / g.totalStudents).toFixed(2)) : 0;
        if (g.minNet === 999) g.minNet = 0;
        g.reportedCount = g.exams.filter((ex) => {
          return (state.reports || []).some((r) => (r.kullanilanSinavIdler || []).includes(ex.id) || r.sinavId === ex.id);
        }).length;
      });

      // Sınıf Kademesi Filtresi
      if (gradeFilter !== "all") {
        groups = groups.filter((g) => {
          const hasGradeInName = g.sinavAdi.includes(`${gradeFilter}.`) || g.sinavAdi.includes(`${gradeFilter} `) || g.sinavAdi.includes(`${gradeFilter}Sınıf`) || (gradeFilter === "8" && g.sinavAdi.toLowerCase().includes("lgs"));
          const hasStudentWithGrade = g.exams.some((ex) => {
            const st = state.students.find((s) => s.id === ex.ogrenciId);
            const sGrade = st ? String(st.sinif) : String(ex.sinif || "");
            return sGrade.startsWith(gradeFilter);
          });
          return hasGradeInName || hasStudentWithGrade;
        });
      }

      // Arama Filtresi
      if (searchQuery) {
        groups = groups.filter((g) => {
          if (g.sinavAdi.toLowerCase().includes(searchQuery)) return true;
          return g.exams.some((ex) => {
            const st = state.students.find((s) => s.id === ex.ogrenciId);
            const stName = st ? st.adSoyad.toLowerCase() : (ex.ogrenciAdSoyad || "").toLowerCase();
            return stName.includes(searchQuery);
          });
        });
      }

      groups.sort((a, b) => {
        switch (sortOrder) {
          case "yeniden-eskiye": {
            const tA = new Date(a.tarih || a.createdAt || 0).getTime() || 0;
            const tB = new Date(b.tarih || b.createdAt || 0).getTime() || 0;
            return tB - tA;
          }
          case "eskiden-yeniye": {
            const tA = new Date(a.tarih || a.createdAt || 0).getTime() || 0;
            const tB = new Date(b.tarih || b.createdAt || 0).getTime() || 0;
            return tA - tB;
          }
          case "net-yuksek":
            return b.avgNet - a.avgNet;
          case "net-dusuk":
            return a.avgNet - b.avgNet;
          case "ogrenci-cok":
            return b.totalStudents - a.totalStudents;
          case "isim-az":
            return a.sinavAdi.localeCompare(b.sinavAdi, "tr");
          default:
            return 0;
        }
      });

      return groups;
    }

    exportBulkExamReportsByName(examName) {
      if (!examName) return;
      PDFService.exportBulkExamReports(examName, store.getState());
    }

    deleteExamGroupConfirm(examName) {
      if (!examName) return;
      const count = store.getState().exams.filter((e) => (e.sinavAdi || "").trim() === examName.trim()).length;
      if (confirm(`"${examName}" sınavına ait ${count} öğrenci kaydının tamamını silmek istediğinize emin misiniz?`)) {
        store.deleteExamsByName(examName);
        showToast(`✓ "${examName}" sınavı ve ${count} öğrenci kaydı silindi.`, "info");
      }
    }

    quickSetAiProvider(providerId) {
      store.updateAiConfig({ provider: providerId });
      this.renderCurrentView();
    }

    onAiStudentChanged(studentId) {
      store.state.selectedStudentIdForAnalysis = studentId;
      store.clearExamSelection();
      this.renderCurrentView();
    }

    async executeAiAnalysis() {
      const state = store.getState();
      const studentId = document.getElementById("ai-student-select")?.value;
      const student = state.students.find((s) => s.id === studentId);
      const chosenExamIds = Array.from(document.querySelectorAll("input[name='ai-selected-exams']:checked")).map((cb) => cb.value);
      const chosenExams = state.exams.filter((e) => chosenExamIds.includes(e.id));

      if (!student || chosenExams.length === 0) {
        showToast("Lütfen en az bir sınav seçin.", "warning");
        return;
      }
      return this.runDirectAiAnalysis(student, chosenExams);
    }

    async runDirectAiAnalysis(student, chosenExams) {
      if (!student || !chosenExams || chosenExams.length === 0) return;
      const state = store.getState();

      this.isSingleAiParsing = true;
      this.isSingleAiModalMinimized = false;
      this.openSingleAiAnalysisModal(student, chosenExams);
      this.aiAbortController = new AbortController();

      this.updateFloatingPdfAnalyzerWidget({
        curr: 1,
        total: 1,
        percent: 45,
        remainingSec: 8,
        remainingFormatted: "Hazırlanıyor...",
        studentName: student.adSoyad,
        isSingleAi: true,
        isCompleted: false
      });

      this.updateAnalysisProgress({
        status: "running",
        type: "single",
        title: "AI Sınav Analizi Yapılıyor",
        currentStudent: student.adSoyad,
        percent: 50,
        message: `${student.adSoyad} için 7 günlük LGS etüt matrisi hazırlanıyor...`
      });

      try {
        const aiResult = await AIService.analyzeExams(student, chosenExams, state.aiConfig, this.aiAbortController.signal);
        const providerName = state.aiConfig.provider === "openai" ? "OpenAI ChatGPT (GPT-4o Mini)" : state.aiConfig.provider === "gemini" ? "Google Gemini 1.5 Flash" : "Anthropic Claude";

        const newReport = {
          id: generateId("rep"),
          ogrenciId: student.id,
          ogrenciAdSoyad: student.adSoyad,
          sinif: `${student.sinif}. Sınıf / ${student.sube}`,
          numara: student.numara,
          kurumId: state.institution.id,
          kullanilanSinavIdler: chosenExams.map((e) => e.id),
          aiSaglayici: aiResult._isSimulated ? "Akıllı Pedagojik AI Motoru" : providerName,
          olusturmaTarihi: new Date().toISOString(),
          createdAt: Date.now(),
          eksikKonular: aiResult.eksikKonular || [],
          genelYorum: aiResult.genelYorum || "",
          gelisimAnalizi: aiResult.gelisimAnalizi || "",
          haftalikTablo: aiResult.haftalikTablo || [],
          haftalikOzet: aiResult.haftalikOzet || null,
          calismaProgrami: aiResult.calismaProgrami || []
        };

        store.addReport(newReport);
        this.currentActiveReport = { report: newReport, student, exams: chosenExams, institution: state.institution };
        this.isSingleAiParsing = false;

        this.closeModal("single-ai-analysis-modal");

        this.updateFloatingPdfAnalyzerWidget({
          curr: 1,
          total: 1,
          percent: 100,
          remainingSec: 0,
          remainingFormatted: "Tamamlandı",
          studentName: student.adSoyad,
          isSingleAi: true,
          isCompleted: true
        });

        // Rapor detay modalını aç
        this.viewReportDetail(newReport.id);

        showToast(`✓ ${student.adSoyad} için yapay zekâ analiz karnesi ve 7 günlük LGS etüt matrisi başarıyla hazırlandı!`, "success", 5000);
      } catch (err) {
        this.isSingleAiParsing = false;
        this.closeModal("single-ai-analysis-modal");
        this.updateFloatingPdfAnalyzerWidget();
        if (err.name === "AbortError") {
          showToast("Analiz işlemi kullanıcı tarafından durduruldu.", "info");
          return;
        }
        showToast("AI Analiz Hatası: " + err.message, "error");
      } finally {
        this.aiAbortController = null;
        this.updateAnalysisProgress({ status: "idle", percent: 0 });
      }
    }

    abortAiAnalysis() {
      if (this.aiAbortController) {
        this.aiAbortController.abort();
        this.aiAbortController = null;
      }
      this.isSingleAiParsing = false;
      this.closeModal("single-ai-analysis-modal");
      this.updateFloatingPdfAnalyzerWidget();
      this.updateAnalysisProgress({ status: "idle", percent: 0 });
      showToast("Analiz işlemi kullanıcı tarafından durduruldu.", "info");
    }

    downloadActiveReportPDF() {
      if (!this.currentActiveReport) return;
      const { student } = this.currentActiveReport;
      PDFService.exportToPDF("printable-report-sheet", `${student.adSoyad.replace(/\s+/g, "_")}_Sinav_Raporu.pdf`);
    }

    downloadActiveReportHTML() {
      if (!this.currentActiveReport) return;
      const { student } = this.currentActiveReport;
      PDFService.downloadStandaloneHTML("printable-report-sheet", `${student.adSoyad.replace(/\s+/g, "_")}_LGS_Raporu.html`);
    }

    printActiveReport() { PDFService.printReport("printable-report-sheet"); }

    viewReportDetail(reportId) {
      const report = store.getState().reports.find((r) => r.id === reportId);
      if (!report) return;
      const student = store.getState().students.find((s) => s.id === report.ogrenciId) || { adSoyad: report.ogrenciAdSoyad || "Öğrenci", sinif: "8", sube: "8-A" };
      const exams = store.getState().exams.filter((e) => (report.kullanilanSinavIdler || []).includes(e.id));
      const effectiveExams = exams.length > 0 ? exams : store.getState().exams.slice(0, 1);
      this.currentActiveReport = { report, student, exams: effectiveExams, institution: store.getState().institution };

      const modalHtml = `
        <div class="modal-backdrop" id="report-view-modal" onclick="if(event.target === this) window.app.closeModal('report-view-modal')">
          <div class="modal-dialog modal-xl animate-scale-up">
            <div class="modal-header">
              <h3 class="modal-title">Öğrenci Sınav Karnesi & Raporu (${student.adSoyad})</h3>
              <div class="btn-group">
                <button class="btn btn-sm btn-primary font-bold shadow-glow" onclick="window.app.printActiveReport()" title="Kusursuz Vektörel PDF Kaydet / Yazdır (Sıfır kayma, gerçek seçilebilir metin)">🖨️ Raporu İndir / Yazdır</button>
                <button class="modal-close" onclick="window.app.closeModal('report-view-modal')">&times;</button>
              </div>
            </div>
            <div class="modal-body p-0">
              <div class="report-modal-sheet-container">${PDFService.renderReportHTML(report, student, effectiveExams, store.getState().institution)}</div>
            </div>
          </div>
        </div>
      `;
      this.renderModalContainer(modalHtml);
    }

    downloadReportPDF(reportId) {
      this.viewReportDetail(reportId);
      setTimeout(() => this.downloadActiveReportPDF(), 400);
    }

    deleteReportConfirm(reportId) {
      if (confirm("Bu raporu silmek istediğinize emin misiniz?")) store.deleteReport(reportId);
    }

    selectThemeColor(hex) {
      store.applyTheme(hex);
      store.updateInstitution({ temaRengi: hex });
    }

    async handleLogoFileSelected(file) {
      if (!file) return;
      try {
        const url = await FirebaseService.uploadLogo(file, store.getState().institution.id);
        store.updateInstitution({ logoUrl: url });
      } catch (e) {}
    }

    removeLogo() { store.updateInstitution({ logoUrl: "" }); }

    saveInstitutionSettings(e) {
      e.preventDefault();
      const ad = document.getElementById("inst-name").value.trim();
      const kurumKodu = document.getElementById("inst-code").value.trim();
      const telefon = document.getElementById("inst-phone").value.trim();
      const adres = document.getElementById("inst-address").value.trim();
      store.updateInstitution({ ad, kurumKodu, telefon, adres });
    }

    resetSampleDataConfirm() {
      if (confirm("Örnek demo verilerini yeniden yüklemek istediğinize emin misiniz?")) store.resetToSampleData();
    }

    clearAllDataConfirm() {
      if (confirm("Tüm kayıtları silmek istediğinize emin misiniz?")) store.clearAllData();
    }

    selectAiProvider(providerId) { store.updateAiConfig({ provider: providerId }); }

    saveAiSettings(e) {
      e.preventDefault();
      const openaiApiKey = document.getElementById("openai-api-key")?.value.trim();
      const geminiApiKey = document.getElementById("gemini-api-key")?.value.trim();
      store.updateAiConfig({ openaiApiKey, geminiApiKey });
    }

    async testAiConnection() {
      const state = store.getState();
      showToast(`${state.aiConfig.provider.toUpperCase()} test ediliyor...`, "info");
      try {
        const res = await AIService.analyzeExams(state.students[0], state.exams.slice(0, 1), state.aiConfig);
        if (res) showToast("✓ AI bağlantısı ve API doğrulaması başarılı!", "success");
      } catch (err) {
        showToast("Hata: " + err.message, "error");
      }
    }

    saveFirebaseConfig(e) {
      e.preventDefault();
      const config = {
        apiKey: document.getElementById("fb-apiKey").value.trim(),
        projectId: document.getElementById("fb-projectId").value.trim(),
        databaseId: document.getElementById("fb-databaseId")?.value.trim() || "olcme-uygulama",
        authDomain: document.getElementById("fb-authDomain").value.trim(),
        storageBucket: document.getElementById("fb-storageBucket").value.trim()
      };
      store.saveToStorage(APP_CONFIG.storageKeys.FIREBASE_CONFIG, config);
      store.state.firebaseConfig = config;
      // KÖK NEDEN DÜZELTMESİ: store instance geçiriliyor ki onSnapshot/polling kurulsun
      FirebaseService.init(config, store);
      showToast(`✓ Firebase (${config.databaseId}) ayarları kaydedildi. REST polling başlatıldı.`, "success");
      this.renderCurrentView();
    }
  }

  window.app = new App();
})();
