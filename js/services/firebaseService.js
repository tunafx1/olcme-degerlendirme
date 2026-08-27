/**
 * Firebase Servis Katmanı
 * Firebase Auth, Firestore ve Firebase Storage Entegrasyonu
 * (Bağlantı yoksa veya offline moddaysa LocalStorage üzerinde kesintisiz çalışır)
 */

export class FirebaseService {
  static app = null;
  static auth = null;
  static db = null;
  static storage = null;
  static isInitialized = false;

  /**
   * Firebase SDK'yı başlatır
   */
  static async init(config) {
    if (!config || !config.apiKey || !config.projectId) {
      this.isInitialized = false;
      return false;
    }

    try {
      if (window.firebase && window.firebase.initializeApp) {
        if (!this.app) {
          // Zaten bir app varsa onu al veya yeni başlat
          if (window.firebase.apps && window.firebase.apps.length > 0) {
            this.app = window.firebase.apps[0];
          } else {
            this.app = window.firebase.initializeApp(config);
          }
          this.auth = window.firebase.auth ? window.firebase.auth() : null;
          this.db = window.firebase.firestore ? window.firebase.firestore() : null;
          this.storage = window.firebase.storage ? window.firebase.storage() : null;
        }
        this.isInitialized = true;
        console.log("[Firebase] Başarıyla başlatıldı:", config.projectId);
        return true;
      }
      return false;
    } catch (e) {
      console.warn("[Firebase] Başlatma uyarısı:", e.message);
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * Firebase bağlantı testi
   */
  static async testConnection(config) {
    if (!config || !config.apiKey || !config.projectId) {
      return { success: false, message: "Eksik yapılandırma bilgisi (apiKey ve projectId zorunludur)." };
    }

    try {
      const testUrl = `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents?key=${config.apiKey}`;
      const res = await fetch(testUrl);
      if (res.status === 200 || res.status === 403 || res.status === 404) {
        return { success: true, message: `Firebase projesine (${config.projectId}) başarıyla bağlanıldı!` };
      } else {
        const text = await res.text();
        return { success: false, message: `Firebase bağlantı hatası (${res.status}): ${text}` };
      }
    } catch (err) {
      return { success: false, message: "Bağlantı testi başarısız: " + err.message };
    }
  }

  /**
   * Firestore Doküman Kaydetme
   */
  static async saveDocument(collectionName, docId, data) {
    if (this.isInitialized && this.db) {
      try {
        await this.db.collection(collectionName).doc(docId).set(data, { merge: true });
        console.log(`[Firestore] ${collectionName}/${docId} kaydedildi.`);
      } catch (err) {
        console.warn(`[Firestore] ${collectionName} yazma uyarısı:`, err.message);
      }
    }
  }

  /**
   * Firestore Doküman Silme
   */
  static async deleteDocument(collectionName, docId) {
    if (this.isInitialized && this.db) {
      try {
        await this.db.collection(collectionName).doc(docId).delete();
        console.log(`[Firestore] ${collectionName}/${docId} silindi.`);
      } catch (err) {
        console.warn(`[Firestore] ${collectionName} silme uyarısı:`, err.message);
      }
    }
  }

  /**
   * Firestore Koleksiyon Okuma
   */
  static async fetchCollection(collectionName, kurumId = null) {
    if (this.isInitialized && this.db) {
      try {
        let query = this.db.collection(collectionName);
        if (kurumId) {
          query = query.where("kurumId", "==", kurumId);
        }
        const snapshot = await query.get();
        const docs = [];
        snapshot.forEach((doc) => docs.push({ id: doc.id, ...doc.data() }));
        return docs;
      } catch (err) {
        console.warn(`[Firestore] ${collectionName} okuma uyarısı:`, err.message);
      }
    }
    return null;
  }

  /**
   * Logo Dosyası Yükleme (Firebase Storage veya Base64 Fallback)
   */
  static async uploadLogo(file, kurumId = "kurum_default") {
    if (!file) throw new Error("Dosya seçilmedi");

    if (this.isInitialized && this.storage) {
      try {
        const ref = this.storage.ref().child(`logos/${kurumId}_${Date.now()}_${file.name}`);
        const snapshot = await ref.put(file);
        const downloadUrl = await snapshot.ref.getDownloadURL();
        return downloadUrl;
      } catch (err) {
        console.warn("[Firebase Storage] Logo yükleme hatası, Base64 fallback uygulanıyor:", err);
      }
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error("Logo dosyası okunamadı"));
      reader.readAsDataURL(file);
    });
  }

  /**
   * PDF Rapor Yükleme (Firebase Storage)
   */
  static async uploadPdf(pdfBlob, kurumId = "kurum_default", raporId = "rapor") {
    if (this.isInitialized && this.storage) {
      try {
        const ref = this.storage.ref().child(`raporlar/${kurumId}/${raporId}.pdf`);
        const snapshot = await ref.put(pdfBlob, { contentType: "application/pdf" });
        return await snapshot.ref.getDownloadURL();
      } catch (err) {
        console.warn("[Firebase Storage] PDF yükleme hatası:", err);
      }
    }
    return null;
  }
}
