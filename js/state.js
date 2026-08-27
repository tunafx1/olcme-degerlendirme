import { APP_CONFIG, DEFAULT_FIREBASE_CONFIG } from "./config.js";
import { DEFAULT_INSTITUTION, DEFAULT_AI_CONFIG, MOCK_STUDENTS, MOCK_EXAMS, MOCK_REPORTS } from "./data/mockData.js";
import { hexToRgb, showToast } from "./utils/helpers.js";
import { FirebaseService } from "./services/firebaseService.js";

class Store {
  constructor() {
    this.listeners = new Set();
    this.state = {
      currentTab: "dashboard", // dashboard, students, exams, aiAnalysis, reports, institution, aiSettings, firebaseSettings
      currentUser: {
        id: "usr_admin_1",
        adSoyad: "Yönetici Öğretmen",
        email: "admin@kurum.k12.tr",
        rol: "admin"
      },
      institution: this.loadFromStorage(APP_CONFIG.storageKeys.INSTITUTION, DEFAULT_INSTITUTION),
      students: this.loadFromStorage(APP_CONFIG.storageKeys.STUDENTS, MOCK_STUDENTS),
      exams: this.loadFromStorage(APP_CONFIG.storageKeys.EXAMS, MOCK_EXAMS),
      reports: this.loadFromStorage(APP_CONFIG.storageKeys.REPORTS, MOCK_REPORTS),
      aiConfig: (() => {
        const loaded = this.loadFromStorage(APP_CONFIG.storageKeys.AI_CONFIG, DEFAULT_AI_CONFIG);
        if (!loaded.geminiApiKey && DEFAULT_AI_CONFIG.geminiApiKey) {
          loaded.geminiApiKey = DEFAULT_AI_CONFIG.geminiApiKey;
          loaded.simulationMode = false;
        }
        return loaded;
      })(),
      firebaseConfig: (() => {
        const loaded = this.loadFromStorage(APP_CONFIG.storageKeys.FIREBASE_CONFIG, DEFAULT_FIREBASE_CONFIG);
        return loaded || DEFAULT_FIREBASE_CONFIG;
      })(),
      isFirebaseConnected: true,
      selectedExamIds: new Set(),
      selectedStudentIdForAnalysis: null,
      activeModal: null, // modal name or null
      activeModalData: null,
      activeReportForView: null,
      isLoading: false
    };

    // Temayı ilk yüklemede uygula
    this.applyTheme(this.state.institution.temaRengi);

    // Firebase'i otomatik başlat
    if (this.state.firebaseConfig) {
      FirebaseService.init(this.state.firebaseConfig);
    }
  }

  loadFromStorage(key, fallback) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      console.warn(`LocalStorage okuma hatası (${key}):`, e);
      return fallback;
    }
  }

  saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error(`LocalStorage yazma hatası (${key}):`, e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event, data) {
    this.listeners.forEach((listener) => {
      try {
        listener(this.state, event, data);
      } catch (err) {
        console.error("State listener hatası:", err);
      }
    });
  }

  getState() {
    return this.state;
  }

  setTab(tabName) {
    this.state.currentTab = tabName;
    this.notify("TAB_CHANGED", tabName);
  }

  // --- TEMA VE KURUM İŞLEMLERİ ---
  applyTheme(hexColor) {
    if (!hexColor) return;
    const root = document.documentElement;
    const rgb = hexToRgb(hexColor);
    root.style.setProperty("--primary-color", hexColor);
    root.style.setProperty("--primary-rgb", rgb);
  }

  updateInstitution(data) {
    this.state.institution = { ...this.state.institution, ...data };
    this.saveToStorage(APP_CONFIG.storageKeys.INSTITUTION, this.state.institution);
    FirebaseService.saveDocument("kurumlar", this.state.institution.id, this.state.institution);
    if (data.temaRengi) {
      this.applyTheme(data.temaRengi);
    }
    this.notify("INSTITUTION_UPDATED", this.state.institution);
    showToast("Kurum bilgileri ve tema başarıyla güncellendi.", "success");
  }

  // --- ÖĞRENCİ İŞLEMLERİ ---
  addStudent(student) {
    this.state.students = [student, ...this.state.students];
    this.saveToStorage(APP_CONFIG.storageKeys.STUDENTS, this.state.students);
    FirebaseService.saveDocument("ogrenciler", student.id, student);
    this.notify("STUDENTS_UPDATED", this.state.students);
    showToast(`${student.adSoyad} isimli öğrenci başarıyla kaydedildi.`, "success");
  }

  updateStudent(studentId, updatedData) {
    this.state.students = this.state.students.map((s) => {
      if (s.id === studentId) {
        const updated = { ...s, ...updatedData };
        FirebaseService.saveDocument("ogrenciler", studentId, updated);
        return updated;
      }
      return s;
    });
    this.saveToStorage(APP_CONFIG.storageKeys.STUDENTS, this.state.students);
    this.notify("STUDENTS_UPDATED", this.state.students);
    showToast("Öğrenci bilgileri güncellendi.", "success");
  }

  deleteStudent(studentId) {
    const student = this.state.students.find((s) => s.id === studentId);
    this.state.students = this.state.students.filter((s) => s.id !== studentId);
    // Öğrenciye ait sınavları ve raporları da temizle
    this.state.exams = this.state.exams.filter((e) => e.ogrenciId !== studentId);
    this.state.reports = this.state.reports.filter((r) => r.ogrenciId !== studentId);

    this.saveToStorage(APP_CONFIG.storageKeys.STUDENTS, this.state.students);
    this.saveToStorage(APP_CONFIG.storageKeys.EXAMS, this.state.exams);
    this.saveToStorage(APP_CONFIG.storageKeys.REPORTS, this.state.reports);

    FirebaseService.deleteDocument("ogrenciler", studentId);

    this.notify("STUDENTS_UPDATED", this.state.students);
    showToast(`${student ? student.adSoyad : "Öğrenci"} ve bağlı tüm veriler silindi.`, "info");
  }

  // --- SINAV İŞLEMLERİ ---
  addExam(exam) {
    this.state.exams = [exam, ...this.state.exams];
    this.saveToStorage(APP_CONFIG.storageKeys.EXAMS, this.state.exams);
    FirebaseService.saveDocument("sinavlar", exam.id, exam);
    this.notify("EXAMS_UPDATED", this.state.exams);
    showToast(`"${exam.sinavAdi}" sınav sonucu başarıyla kaydedildi.`, "success");
  }

  updateExam(examId, updatedData) {
    this.state.exams = this.state.exams.map((e) => {
      if (e.id === examId) {
        const updated = { ...e, ...updatedData };
        FirebaseService.saveDocument("sinavlar", examId, updated);
        return updated;
      }
      return e;
    });
    this.saveToStorage(APP_CONFIG.storageKeys.EXAMS, this.state.exams);
    this.notify("EXAMS_UPDATED", this.state.exams);
    showToast("Sınav kaydı güncellendi.", "success");
  }

  deleteExam(examId) {
    this.state.exams = this.state.exams.filter((e) => e.id !== examId);
    this.state.selectedExamIds.delete(examId);
    this.saveToStorage(APP_CONFIG.storageKeys.EXAMS, this.state.exams);
    FirebaseService.deleteDocument("sinavlar", examId);
    this.notify("EXAMS_UPDATED", this.state.exams);
    showToast("Sınav kaydı silindi.", "info");
  }

  // --- ÇOKLU SINAV SEÇİMİ ---
  toggleExamSelection(examId) {
    if (this.state.selectedExamIds.has(examId)) {
      this.state.selectedExamIds.delete(examId);
    } else {
      this.state.selectedExamIds.add(examId);
    }
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

  // --- RAPOR İŞLEMLERİ ---
  addReport(report) {
    this.state.reports = [report, ...this.state.reports];
    this.saveToStorage(APP_CONFIG.storageKeys.REPORTS, this.state.reports);
    FirebaseService.saveDocument("raporlar", report.id, report);
    this.notify("REPORTS_UPDATED", this.state.reports);
    showToast("Analiz raporu başarıyla oluşturuldu ve arşive kaydedildi.", "success");
  }

  deleteReport(reportId) {
    this.state.reports = this.state.reports.filter((r) => r.id !== reportId);
    this.saveToStorage(APP_CONFIG.storageKeys.REPORTS, this.state.reports);
    FirebaseService.deleteDocument("raporlar", reportId);
    this.notify("REPORTS_UPDATED", this.state.reports);
    showToast("Rapor arşivden silindi.", "info");
  }

  // --- AI AYARLARI ---
  updateAiConfig(config) {
    this.state.aiConfig = { ...this.state.aiConfig, ...config };
    this.saveToStorage(APP_CONFIG.storageKeys.AI_CONFIG, this.state.aiConfig);
    this.notify("AI_CONFIG_UPDATED", this.state.aiConfig);
    showToast("Yapay zekâ yapılandırması kaydedildi.", "success");
  }

  // --- FIREBASE AYARLARI ---
  updateFirebaseConfig(config) {
    this.state.firebaseConfig = config;
    this.saveToStorage(APP_CONFIG.storageKeys.FIREBASE_CONFIG, config);
    this.notify("FIREBASE_CONFIG_UPDATED", config);
  }

  // --- MODAL YÖNETİMİ ---
  openModal(modalName, modalData = null) {
    this.state.activeModal = modalName;
    this.state.activeModalData = modalData;
    this.notify("MODAL_OPENED", { modalName, modalData });
  }

  closeModal() {
    this.state.activeModal = null;
    this.state.activeModalData = null;
    this.notify("MODAL_CLOSED", null);
  }

  // --- DEMO VERİ SIFIRLAMA / YÜKLEME ---
  resetToSampleData() {
    this.state.students = [...MOCK_STUDENTS];
    this.state.exams = [...MOCK_EXAMS];
    this.state.reports = [...MOCK_REPORTS];
    this.state.institution = { ...DEFAULT_INSTITUTION };

    this.saveToStorage(APP_CONFIG.storageKeys.STUDENTS, this.state.students);
    this.saveToStorage(APP_CONFIG.storageKeys.EXAMS, this.state.exams);
    this.saveToStorage(APP_CONFIG.storageKeys.REPORTS, this.state.reports);
    this.saveToStorage(APP_CONFIG.storageKeys.INSTITUTION, this.state.institution);

    this.applyTheme(this.state.institution.temaRengi);
    this.notify("STORE_RESET", null);
    showToast("Örnek demo verileri ve kurum ayarları başarıyla yüklendi!", "success");
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
    showToast("Tüm öğrenci, sınav ve rapor kayıtları temizlendi.", "info");
  }
}

export const store = new Store();
