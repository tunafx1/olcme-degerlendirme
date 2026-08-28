import { APP_CONFIG, DEFAULT_FIREBASE_CONFIG } from "../config.js";
import { store } from "../state.js";
import { showToast } from "../utils/helpers.js";

export class FirebaseService {
  static app = null;
  static auth = null;
  static db = null;
  static storage = null;
  static isInitialized = false;
  static unsubscribers = [];
  static lastQuotaExceeded = false;
  static lastSyncTime = null;

  /**
   * Firebase SDK'yı başlatır
   */
  static init(config, storeInstance) {
    if (!config || !config.apiKey || !config.projectId) {
      this.isInitialized = false;
      return false;
    }

    const targetDb = config.databaseId || "olcme-uygulama";
    try {
      if (window.firebase && window.firebase.initializeApp) {
        if (!this.app) {
          if (window.firebase.apps && window.firebase.apps.length > 0) {
            this.app = window.firebase.apps[0];
          } else {
            this.app = window.firebase.initializeApp(config);
          }
          this.auth = window.firebase.auth ? window.firebase.auth() : null;
          try {
            this.db = window.firebase.app().firestore(targetDb);
          } catch (dbErr) {
            try {
              this.db = window.firebase.firestore(this.app, targetDb);
            } catch (err2) {
              this.db = window.firebase.firestore ? window.firebase.firestore() : null;
            }
          }
          this.storage = window.firebase.storage ? window.firebase.storage() : null;
        }
        this.isInitialized = true;
        console.log(`[Firebase] Firestore (${targetDb}) veritabanına başarıyla bağlanıldı.`);

        if (storeInstance) {
          this.setupRealtimeListeners(storeInstance);
        }
        return true;
      }
      return false;
    } catch (e) {
      console.warn("[Firebase] Başlatma uyarısı:", e.message);
      this.isInitialized = false;
      return false;
    }
  }

  static setupRealtimeListeners(storeInstance) {
    this.unsubscribers.forEach((unsub) => { try { unsub(); } catch (e) {} });
    this.unsubscribers = [];

    if (!this.isInitialized || !this.db) return;

    const collections = [
      { name: "ogrenciler", stateKey: "students", storageKey: APP_CONFIG.storageKeys.STUDENTS, event: "STUDENTS_SYNCED" },
      { name: "sinavlar", stateKey: "exams", storageKey: APP_CONFIG.storageKeys.EXAMS, event: "EXAMS_SYNCED" },
      { name: "raporlar", stateKey: "reports", storageKey: APP_CONFIG.storageKeys.REPORTS, event: "REPORTS_SYNCED" }
    ];

    collections.forEach(({ name, stateKey, storageKey, event }) => {
      try {
        const unsub = this.db.collection(name).onSnapshot(
          (snapshot) => {
            this.lastQuotaExceeded = false;
            this.lastSyncTime = new Date();
            const docs = [];
            snapshot.forEach((doc) => {
              docs.push({ id: doc.id, ...doc.data() });
            });

            const currentJson = JSON.stringify(storeInstance.state[stateKey]);
            const newJson = JSON.stringify(docs);
            if (currentJson !== newJson) {
              storeInstance.state[stateKey] = docs;
              storeInstance.saveToStorage(storageKey, docs);
              storeInstance.notify(event, docs);
              console.log(`[Firestore Canlı Senkronizasyon] ${name} güncellendi (${docs.length} kayıt).`);
            }
          },
          (err) => {
            if (err.code === "resource-exhausted" || (err.message && err.message.includes("Quota"))) {
              this.lastQuotaExceeded = true;
              console.warn("[Firestore Quota Warning] Günlük okuma kotası aşıldı (RESOURCE_EXHAUSTED).");
            } else {
              console.warn(`[Firestore onSnapshot ${name}]:`, err.message);
            }
          }
        );
        this.unsubscribers.push(unsub);
      } catch (e) {
        console.warn(`[Firestore setupRealtimeListeners ${name}]:`, e);
      }
    });

    try {
      const unsubKurum = this.db.collection("kurumlar").onSnapshot(
        (snapshot) => {
          snapshot.forEach((doc) => {
            const data = doc.data();
            if (data && JSON.stringify(data) !== JSON.stringify(storeInstance.state.institution)) {
              storeInstance.state.institution = { ...storeInstance.state.institution, ...data };
              storeInstance.saveToStorage(APP_CONFIG.storageKeys.INSTITUTION, storeInstance.state.institution);
              if (data.temaRengi) storeInstance.applyTheme(data.temaRengi);
              storeInstance.notify("INSTITUTION_SYNCED", storeInstance.state.institution);
            }
          });
        },
        (err) => {
          if (err.code === "resource-exhausted") this.lastQuotaExceeded = true;
        }
      );
      this.unsubscribers.push(unsubKurum);
    } catch (e) {}
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

