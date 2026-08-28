/**
 * Ana Uygulama Orkestrasyonu ve Controller (app.js)
 */

import { store } from "./state.js";
import { renderDashboardView } from "./views/dashboardView.js";
import { renderStudentsView, renderStudentRows } from "./views/studentsView.js";
import { renderExamsView, renderExamRows } from "./views/examsView.js";
import { renderAiAnalysisView } from "./views/aiAnalysisView.js";
import { renderReportsView, renderReportRows } from "./views/reportsView.js";
import { renderInstitutionView } from "./views/institutionView.js";
import { renderAiSettingsView } from "./views/aiSettingsView.js";
import { renderFirebaseSettingsView } from "./views/firebaseSettingsView.js";
import { CURRICULUM_DATA } from "./data/curriculumData.js";
import { AIService } from "./services/aiService.js";
import { PDFService } from "./services/pdfService.js";
import { FirebaseService } from "./services/firebaseService.js";
import { generateId, formatDate, calculateNet, showToast, escapeHtml } from "./utils/helpers.js";
import { parseExcelFile, processGainRows } from "./utils/excelParser.js";

class App {
  constructor() {
    this.currentActiveReport = null;
    this.init();
  }

  init() {
    // State değişikliklerini dinle
    store.subscribe((state, event, data) => {
      this.handleStateUpdate(state, event, data);
    });

    // İlk görünümü render et
    this.renderCurrentView();
    this.updateSidebarActiveState();

    // Firebase başlatmayı dene (varsa)
    const fbConfig = store.getState().firebaseConfig;
    if (fbConfig) {
      FirebaseService.init(fbConfig);
    }
  }

  navigate(tabName, options = {}) {
    store.setTab(tabName);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (options.openModal === "addExam") {
      setTimeout(() => this.openAddExamModal(options.studentId), 100);
    }
  }

  handleStateUpdate(state, event, data) {
    if (event === "TAB_CHANGED") {
      this.renderCurrentView();
      this.updateSidebarActiveState();
    } else if (event === "EXAM_SELECTION_CHANGED") {
      this.updateMultiExamBar(data);
    } else if (event === "STUDENTS_UPDATED" && state.currentTab === "students") {
      this.renderCurrentView();
    } else if (event === "EXAMS_UPDATED" && state.currentTab === "exams") {
      this.renderCurrentView();
    } else if (event === "REPORTS_UPDATED" && state.currentTab === "reports") {
      this.renderCurrentView();
    } else if (event === "STORE_RESET" || event === "DATA_CLEARED") {
      this.renderCurrentView();
    }
  }

  renderCurrentView() {
    const state = store.getState();
    const contentArea = document.getElementById("main-content-area");
    if (!contentArea) return;

    let html = "";
    switch (state.currentTab) {
      case "dashboard":
        html = renderDashboardView();
        break;
      case "students":
        html = renderStudentsView();
        break;
      case "exams":
        html = renderExamsView();
        break;
      case "aiAnalysis":
        html = renderAiAnalysisView();
        break;
      case "reports":
        html = renderReportsView();
        break;
      case "institution":
        html = renderInstitutionView();
        break;
      case "aiSettings":
        html = renderAiSettingsView();
        break;
      case "firebaseSettings":
        html = renderFirebaseSettingsView();
        break;
      default:
        html = renderDashboardView();
    }

    contentArea.innerHTML = html;
  }

  updateSidebarActiveState() {
    const state = store.getState();
    document.querySelectorAll(".nav-link").forEach((link) => {
      const tab = link.getAttribute("data-tab");
      if (tab === state.currentTab) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  }

  // ==========================================
  // ÖĞRENCİ İŞLEMLERİ VE MODALLAR
  // ==========================================
  openStudentModal(studentId = null) {
    const state = store.getState();
    const student = studentId ? state.students.find((s) => s.id === studentId) : null;
    const isEdit = !!student;

    const modalHtml = `
      <div class="modal-backdrop" id="student-modal" onclick="if(event.target === this) window.app.closeModal('student-modal')">
        <div class="modal-dialog animate-scale-up">
          <div class="modal-header">
            <h3 class="modal-title">${isEdit ? "Öğrenci Bilgilerini Düzenle" : "Yeni Öğrenci Ekle"}</h3>
            <button class="modal-close" onclick="window.app.closeModal('student-modal')">&times;</button>
          </div>
          <form onsubmit="window.app.saveStudentForm(event, '${studentId || ""}')">
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Öğrenci Adı Soyadı: *</label>
                <input type="text" id="m-student-name" class="form-control" value="${student ? student.adSoyad : ""}" required placeholder="Örn: Ali Kerem Kaya" />
              </div>

              <div class="grid-3-col">
                <div class="form-group">
                  <label class="form-label">Sınıf: *</label>
                  <select id="m-student-class" class="form-control" required>
                    <option value="5" ${student && student.sinif === "5" ? "selected" : ""}>5. Sınıf</option>
                    <option value="6" ${student && student.sinif === "6" ? "selected" : ""}>6. Sınıf</option>
                    <option value="7" ${student && student.sinif === "7" ? "selected" : ""}>7. Sınıf</option>
                    <option value="8" ${student && student.sinif === "8" ? "selected" : !student ? "selected" : ""}>8. Sınıf (LGS)</option>
                    <option value="9" ${student && student.sinif === "9" ? "selected" : ""}>9. Sınıf</option>
                    <option value="10" ${student && student.sinif === "10" ? "selected" : ""}>10. Sınıf</option>
                    <option value="11" ${student && student.sinif === "11" ? "selected" : ""}>11. Sınıf</option>
                    <option value="12" ${student && student.sinif === "12" ? "selected" : ""}>12. Sınıf (YKS)</option>
                    <option value="Mezun" ${student && student.sinif === "Mezun" ? "selected" : ""}>Mezun</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Şube: *</label>
                  <input type="text" id="m-student-branch" class="form-control" value="${student ? student.sube : "8-A"}" required placeholder="Örn: 8-A" />
                </div>
                <div class="form-group">
                  <label class="form-label">Öğrenci No:</label>
                  <input type="text" id="m-student-number" class="form-control" value="${student ? student.numara : ""}" placeholder="Örn: 412" />
                </div>
              </div>

              <div class="grid-2-col">
                <div class="form-group">
                  <label class="form-label">Veli Adı Soyadı:</label>
                  <input type="text" id="m-student-parent-name" class="form-control" value="${student ? student.veliAdSoyad || "" : ""}" placeholder="Örn: Mehmet Kaya" />
                </div>
                <div class="form-group">
                  <label class="form-label">Veli Telefonu:</label>
                  <input type="text" id="m-student-parent-phone" class="form-control" value="${student ? student.veliTelefon || "" : ""}" placeholder="Örn: +90 532 111 22 33" />
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" onclick="window.app.closeModal('student-modal')">İptal</button>
              <button type="submit" class="btn btn-primary shadow-glow">
                ${isEdit ? "Değişiklikleri Kaydet" : "Öğrenciyi Kaydet"}
              </button>
            </div>
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

    if (!adSoyad) {
      showToast("Lütfen öğrenci adını giriniz.", "warning");
      return;
    }

    if (studentId) {
      store.updateStudent(studentId, { adSoyad, sinif, sube, numara, veliAdSoyad, veliTelefon });
    } else {
      const newStudent = {
        id: generateId("ogr"),
        adSoyad,
        sinif,
        sube,
        numara,
        veliAdSoyad,
        veliTelefon,
        olusturmaTarihi: new Date().toISOString().split("T")[0]
      };
      store.addStudent(newStudent);
    }

    this.closeModal("student-modal");
  }

  openStudentProfile(studentId) {
    const state = store.getState();
    const student = state.students.find((s) => s.id === studentId);
    if (!student) return;

    const studentExams = state.exams.filter((e) => e.ogrenciId === studentId);
    const studentReports = state.reports.filter((r) => r.ogrenciId === studentId);

    const modalHtml = `
      <div class="modal-backdrop" id="student-profile-modal" onclick="if(event.target === this) window.app.closeModal('student-profile-modal')">
        <div class="modal-dialog modal-lg animate-scale-up">
          <div class="modal-header">
            <div class="user-avatar-group">
              <div class="user-avatar-initials" style="width: 44px; height: 44px; font-size: 18px;">
                ${student.adSoyad.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 class="modal-title">${student.adSoyad}</h3>
                <div style="font-size: 12px; color: var(--text-muted);">${student.sinif}. Sınıf / ${student.sube} • No: ${student.numara || "-"}</div>
              </div>
            </div>
            <button class="modal-close" onclick="window.app.closeModal('student-profile-modal')">&times;</button>
          </div>
          <div class="modal-body">
            <!-- HIZLI İSTATİSTİKLER -->
            <div class="stats-grid mb-4">
              <div class="stat-card p-3">
                <div class="stat-value" style="font-size: 20px;">${studentExams.length}</div>
                <div class="stat-label">Toplam Sınav</div>
              </div>
              <div class="stat-card p-3">
                <div class="stat-value text-primary" style="font-size: 20px;">${studentReports.length}</div>
                <div class="stat-label">Oluşturulan Rapor</div>
              </div>
              <div class="stat-card p-3">
                <div class="stat-value" style="font-size: 13px;">${student.veliAdSoyad || "-"}</div>
                <div class="stat-label">Veli: ${student.veliTelefon || "-"}</div>
              </div>
            </div>

            <!-- ÖĞRENCİNİN SINAVLARI -->
            <div class="d-flex justify-between items-center mb-3">
              <h4 class="font-bold">Öğrenci Sınav Geçmişi</h4>
              <div class="btn-group">
                <button class="btn btn-sm btn-outline" onclick="window.app.closeModal('student-profile-modal'); window.app.openAddExamModal('${student.id}')">+ Sınav Ekle</button>
                <button class="btn btn-sm btn-primary" onclick="window.app.closeModal('student-profile-modal'); window.app.analyzeStudentAllExams('${student.id}')">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>
                  Yapay Zekâ Analizine Git
                </button>
              </div>
            </div>

            ${
              studentExams.length === 0
                ? `<div class="empty-state p-4"><p>Bu öğrenciye ait kayıtlı sınav bulunmuyor.</p></div>`
                : `
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Sınav Adı</th>
                    <th>Tarih</th>
                    <th>Tür</th>
                    <th>Toplam Net</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  ${studentExams
                    .map(
                      (e) => `
                    <tr>
                      <td><strong>${e.sinavAdi}</strong></td>
                      <td>${formatDate(e.tarih)}</td>
                      <td><span class="badge ${e.tur === "kazanimli" ? "badge-success" : "badge-secondary"}">${e.tur === "kazanimli" ? "Kazanımlı" : "Kazanımsız"}</span></td>
                      <td><strong class="text-primary">${e.toplamNet || "-"} Net</strong></td>
                      <td>
                        <button class="btn btn-sm btn-ghost text-primary" onclick="window.app.closeModal('student-profile-modal'); window.app.analyzeSingleExam('${e.id}')">Analiz Et</button>
                      </td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            `
            }
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" onclick="window.app.closeModal('student-profile-modal')">Kapat</button>
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
    const studentReports = state.reports.filter((r) => r && (r.ogrenciId === studentId || (r.ogrenciAdSoyad && r.ogrenciAdSoyad.toLowerCase() === studentName)));
    const latestExam = studentExams[studentExams.length - 1];

    const modalHtml = `
      <div class="modal-backdrop" id="student-ai-report-select-modal" onclick="if(event.target === this) window.app.closeModal('student-ai-report-select-modal')">
        <div class="modal-dialog animate-scale-up" style="max-width: 680px;">
          <div class="modal-header" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; border-top-left-radius: var(--radius-lg); border-top-right-radius: var(--radius-lg); padding: 18px 22px;">
            <div>
              <div class="d-flex items-center gap-2">
                <span style="font-size: 20px;">🤖</span>
                <h3 class="modal-title" style="color: #ffffff; font-size: 18px;">${student.adSoyad} — AI Sınav Raporu Seçimi</h3>
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
                        <div style="font-weight: 700; font-size: 13px; color: var(--text-dark);">${e.sinavAdi}</div>
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
                <div style="font-size: 11.5px; color: #047857;">"${singleExam.sinavAdi}" sınavının karne ve çalışma programı raporu hazır.</div>
              </div>
              <div class="d-flex gap-2">
                <button class="btn btn-outline btn-sm font-bold" onclick="window.app.executeStudentModalAiAnalysis('${student.id}', ['${singleExam.id}'], true)" title="Yapay zekâ ile analizi yeniden çalıştır">
                  🔄 Yeniden Analiz Et
                </button>
                <button class="btn btn-success shadow-glow font-bold" onclick="window.app.closeModal('student-ai-report-select-modal'); window.app.viewReportDetail('${existingReport.id}')">
                  📄 Mevcut AI Raporunu Aç (${singleExam.sinavAdi})
                </button>
              </div>
            </div>
          </div>
        `;
      } else {
        footerContainer.innerHTML = `
          <div class="d-flex justify-between items-center p-3" style="background: rgba(37, 99, 235, 0.05); border: 1.5px solid rgba(37, 99, 235, 0.25); border-radius: 8px;">
            <div>
              <div style="font-weight: 700; color: #1e40af; font-size: 13px;">🎯 Tek Sınav Analizi Seçildi: "${singleExam.sinavAdi}"</div>
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
    const student = store.getState().students.find((s) => s.id === studentId);
    if (!student) return;

    if (confirm(`"${student.adSoyad}" isimli öğrenciyi ve bu öğrenciye ait tüm sınav/rapor kayıtlarını silmek istediğinize emin misiniz?`)) {
      store.deleteStudent(studentId);
    }
  }

  filterStudents() {
    const query = document.getElementById("student-search-input")?.value.toLowerCase().trim() || "";
    const activeClassBtn = document.querySelector(".filter-tags .filter-btn.active");
    const classFilter = activeClassBtn?.getAttribute("data-class") || "all";

    const filtered = store.getState().students.filter((s) => {
      const matchQuery = s.adSoyad.toLowerCase().includes(query) || (s.numara && s.numara.includes(query));
      const matchClass = classFilter === "all" || s.sinif === classFilter;
      return matchQuery && matchClass;
    });

    const tbody = document.getElementById("students-tbody");
    if (tbody) {
      tbody.innerHTML = renderStudentRows(filtered, store.getState().exams);
    }
  }

  filterStudentsByClass(classVal, btn) {
    document.querySelectorAll(".filter-tags .filter-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    this.filterStudents();
  }

  // ==========================================
  // SINAV İŞLEMLERİ VE MODALLAR
  // ==========================================
  openAddExamModal(preSelectedStudentId = null) {
    const state = store.getState();
    const students = state.students;

    if (students.length === 0) {
      showToast("Önce en az bir öğrenci kaydetmelisiniz.", "warning");
      this.openStudentModal();
      return;
    }

    const defaultStudentId = preSelectedStudentId || (students[0] ? students[0].id : "");

    const modalHtml = `
      <div class="modal-backdrop" id="add-exam-modal" onclick="if(event.target === this) window.app.closeModal('add-exam-modal')">
        <div class="modal-dialog modal-xl animate-scale-up">
          <div class="modal-header">
            <h3 class="modal-title">Yeni Sınav Sonucu Ekle</h3>
            <button class="modal-close" onclick="window.app.closeModal('add-exam-modal')">&times;</button>
          </div>
          <div class="modal-body">
            <!-- SINAV GENEL BİLGİLERİ -->
            <div class="grid-3-col mb-4">
              <div class="form-group">
                <label class="form-label">Öğrenci Seçiniz: *</label>
                <select id="exam-form-student" class="form-control" required>
                  ${students
                    .map(
                      (s) => `
                    <option value="${s.id}" ${s.id === defaultStudentId ? "selected" : ""}>
                      ${s.adSoyad} (${s.sinif}. Sınıf / ${s.sube})
                    </option>
                  `
                    )
                    .join("")}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Sınav Adı / Başlığı: *</label>
                <input type="text" id="exam-form-name" class="form-control" required placeholder="Örn: 1. LGS Deneme Sınavı" value="1. Kurumsal Deneme Sınavı" />
              </div>
              <div class="form-group">
                <label class="form-label">Sınav Tarihi: *</label>
                <input type="date" id="exam-form-date" class="form-control" required value="${new Date().toISOString().split("T")[0]}" />
              </div>
            </div>

            <!-- GİRİŞ MODU SEKMELERİ -->
            <div class="tabs-nav mb-4">
              <button class="tab-btn active" data-exam-tab="gain" onclick="window.app.switchExamTab('gain', this)">
                🎯 Kazanım Bazlı Giriş (Detaylı)
              </button>
              <button class="tab-btn" data-exam-tab="classic" onclick="window.app.switchExamTab('classic', this)">
                📊 Kazanımsız (Klasik Doğru/Yanlış)
              </button>
              <button class="tab-btn" data-exam-tab="excel" onclick="window.app.switchExamTab('excel', this)">
                📁 Excel / CSV ile İçe Aktar
              </button>
            </div>

            <!-- TAB 1: KAZANIM BAZLI GİRİŞ -->
            <div id="tab-exam-gain" class="exam-tab-content active">
              <div class="gain-editor-toolbar d-flex justify-between items-center mb-3">
                <div class="d-flex items-center gap-2">
                  <label class="font-bold" style="font-size: 13px;">Ders Seçiniz:</label>
                  <select id="gain-subject-select" class="form-control" style="width: 200px;" onchange="window.app.onGainSubjectChanged(this.value)">
                    ${Object.keys(CURRICULUM_DATA)
                      .map((d) => `<option value="${d}">${d}</option>`)
                      .join("")}
                  </select>
                </div>
                <button type="button" class="btn btn-sm btn-outline" onclick="window.app.addCustomGainRow()">+ Özel Kazanım Satırı Ekle</button>
              </div>

              <div class="gain-table-wrap">
                <table class="data-table" id="gain-editor-table">
                  <thead>
                    <tr>
                      <th style="width: 20%;">Ders</th>
                      <th style="width: 25%;">Konu Başlığı</th>
                      <th style="width: 35%;">Ölçülen Kazanım</th>
                      <th style="width: 20%; text-align: center;">Öğrenci Durumu</th>
                    </tr>
                  </thead>
                  <tbody id="gain-editor-tbody">
                    <!-- Dinamik doldurulur -->
                  </tbody>
                </table>
              </div>
            </div>

            <!-- TAB 2: KLASİK NET BAZLI GİRİŞ -->
            <div id="tab-exam-classic" class="exam-tab-content" style="display: none;">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Ders</th>
                    <th style="width: 120px;">Doğru</th>
                    <th style="width: 120px;">Yanlış</th>
                    <th style="width: 120px;">Boş</th>
                    <th style="width: 120px;">Hesaplanan Net</th>
                  </tr>
                </thead>
                <tbody id="classic-editor-tbody">
                  ${["Türkçe", "Matematik", "Fen Bilimleri", "T.C. İnkılap Tarihi", "Din Kültürü", "İngilizce"]
                    .map(
                      (ders, idx) => `
                    <tr class="classic-subject-row" data-subject="${ders}">
                      <td><strong>${ders}</strong></td>
                      <td><input type="number" min="0" max="100" class="form-control classic-d" value="${idx === 0 ? 18 : idx === 1 ? 14 : 16}" oninput="window.app.calculateClassicRowNet(this)" /></td>
                      <td><input type="number" min="0" max="100" class="form-control classic-y" value="${idx === 0 ? 2 : idx === 1 ? 4 : 3}" oninput="window.app.calculateClassicRowNet(this)" /></td>
                      <td><input type="number" min="0" max="100" class="form-control classic-b" value="0" oninput="window.app.calculateClassicRowNet(this)" /></td>
                      <td><strong class="text-primary classic-net" style="font-size: 15px;">0.00</strong></td>
                    </tr>
                  `
                    )
                    .join("")}
                </tbody>
              </table>
            </div>

            <!-- TAB 3: EXCEL / CSV İÇE AKTAR -->
            <div id="tab-exam-excel" class="exam-tab-content" style="display: none;">
              <div class="excel-drop-zone p-5 text-center" onclick="document.getElementById('excel-file-input').click()">
                <input type="file" id="excel-file-input" accept=".xlsx, .xls, .csv" style="display: none;" onchange="window.app.handleExcelImport(this.files[0])" />
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="var(--primary-color)" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="8" y1="13" x2="16" y2="13"/><line x1="8" y1="17" x2="16" y2="17"/></svg>
                <h3 class="mt-3 font-bold">Excel (.xlsx) veya CSV Dosyasını Sürükleyip Bırakın</h3>
                <p class="text-muted" style="font-size: 13px;">Dosyada 'Ders', 'Kazanım / Konu', 'Durum (D/Y/B)' sütunları bulunmalıdır.</p>
                <div class="badge badge-primary mt-2">Dosya Seçmek İçin Tıklayın</div>
              </div>
              <div id="excel-preview-area" class="mt-4" style="display: none;">
                <h4 class="font-bold mb-2">Ayrıştırılan Kazanım Verisi Önizlemesi:</h4>
                <div id="excel-preview-content" class="table-responsive"></div>
              </div>
            </div>

            <!-- CANLI TOPLAM NET ÖZETİ -->
            <div class="exam-live-summary-bar mt-4">
              <div class="d-flex items-center gap-4">
                <div>Toplam Soru: <strong id="exam-summary-total-q">0</strong></div>
                <div>Doğru: <strong class="text-success" id="exam-summary-d">0</strong></div>
                <div>Yanlış: <strong class="text-danger" id="exam-summary-y">0</strong></div>
                <div>Boş: <strong class="text-muted" id="exam-summary-b">0</strong></div>
              </div>
              <div class="exam-summary-net-badge">
                <span>Hesaplanan Toplam Net:</span>
                <strong id="exam-summary-total-net" style="font-size: 20px;">0.00 Net</strong>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" onclick="window.app.closeModal('add-exam-modal')">İptal</button>
            <button type="button" class="btn btn-primary shadow-glow" onclick="window.app.saveExamForm()">Sınavı Kaydet</button>
          </div>
        </div>
      </div>
    `;

    this.renderModalContainer(modalHtml);
    this.populateGainEditor("Matematik");
    this.recalculateAllClassicRows();
  }

  switchExamTab(tabName, btn) {
    document.querySelectorAll(".tabs-nav .tab-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    document.querySelectorAll(".exam-tab-content").forEach((el) => (el.style.display = "none"));
    const activeTab = document.getElementById(`tab-exam-${tabName}`);
    if (activeTab) activeTab.style.display = "block";
  }

  onGainSubjectChanged(subjectName) {
    this.populateGainEditor(subjectName);
  }

  populateGainEditor(subjectName) {
    const list = CURRICULUM_DATA[subjectName] || [];
    const tbody = document.getElementById("gain-editor-tbody");
    if (!tbody) return;

    tbody.innerHTML = list
      .map((item, idx) => {
        return `
        <tr class="gain-editor-row" data-subject="${subjectName}" data-topic="${escapeHtml(item.konu)}" data-gain="${escapeHtml(item.kazanim)}">
          <td><strong style="color: var(--primary-color);">${subjectName}</strong></td>
          <td><strong>${item.konu}</strong></td>
          <td style="font-size: 13px;">${item.kazanim}</td>
          <td style="text-align: center;">
            <div class="gain-status-toggle">
              <label class="status-btn status-d ${idx % 4 !== 0 ? "active" : ""}">
                <input type="radio" name="gain_status_${idx}" value="dogru" ${idx % 4 !== 0 ? "checked" : ""} onchange="window.app.onGainStatusToggle(this)" />
                <span>✓ D</span>
              </label>
              <label class="status-btn status-y ${idx % 4 === 0 ? "active" : ""}">
                <input type="radio" name="gain_status_${idx}" value="yanlis" ${idx % 4 === 0 ? "checked" : ""} onchange="window.app.onGainStatusToggle(this)" />
                <span>✗ Y</span>
              </label>
              <label class="status-btn status-b">
                <input type="radio" name="gain_status_${idx}" value="bos" onchange="window.app.onGainStatusToggle(this)" />
                <span>○ B</span>
              </label>
            </div>
          </td>
        </tr>
      `;
      })
      .join("");

    this.recalculateGainSummary();
  }

  addCustomGainRow() {
    const subjectName = document.getElementById("gain-subject-select")?.value || "Matematik";
    const tbody = document.getElementById("gain-editor-tbody");
    if (!tbody) return;

    const rowId = "custom_" + Date.now();
    const tr = document.createElement("tr");
    tr.className = "gain-editor-row";
    tr.setAttribute("data-subject", subjectName);
    tr.innerHTML = `
      <td><strong style="color: var(--primary-color);">${subjectName}</strong></td>
      <td><input type="text" class="form-control form-control-sm custom-topic" placeholder="Konu başlığı..." /></td>
      <td><input type="text" class="form-control form-control-sm custom-gain" placeholder="Ölçülen kazanım açıklaması..." /></td>
      <td style="text-align: center;">
        <div class="gain-status-toggle">
          <label class="status-btn status-d active">
            <input type="radio" name="gain_status_${rowId}" value="dogru" checked onchange="window.app.onGainStatusToggle(this)" />
            <span>✓ D</span>
          </label>
          <label class="status-btn status-y">
            <input type="radio" name="gain_status_${rowId}" value="yanlis" onchange="window.app.onGainStatusToggle(this)" />
            <span>✗ Y</span>
          </label>
          <label class="status-btn status-b">
            <input type="radio" name="gain_status_${rowId}" value="bos" onchange="window.app.onGainStatusToggle(this)" />
            <span>○ B</span>
          </label>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
    this.recalculateGainSummary();
  }

  onGainStatusToggle(radio) {
    const parentToggle = radio.closest(".gain-status-toggle");
    if (parentToggle) {
      parentToggle.querySelectorAll(".status-btn").forEach((b) => b.classList.remove("active"));
      radio.parentElement.classList.add("active");
    }
    this.recalculateGainSummary();
  }

  recalculateGainSummary() {
    let d = 0,
      y = 0,
      b = 0;
    document.querySelectorAll(".gain-editor-row").forEach((row) => {
      const checkedRadio = row.querySelector("input[type='radio']:checked");
      if (checkedRadio) {
        if (checkedRadio.value === "dogru") d++;
        else if (checkedRadio.value === "yanlis") y++;
        else if (checkedRadio.value === "bos") b++;
      }
    });

    const net = calculateNet(d, y, "lgs");
    document.getElementById("exam-summary-total-q").innerText = d + y + b;
    document.getElementById("exam-summary-d").innerText = d;
    document.getElementById("exam-summary-y").innerText = y;
    document.getElementById("exam-summary-b").innerText = b;
    document.getElementById("exam-summary-total-net").innerText = `${net} Net`;
  }

  calculateClassicRowNet(input) {
    const row = input.closest(".classic-subject-row");
    if (!row) return;

    const d = Number(row.querySelector(".classic-d").value) || 0;
    const y = Number(row.querySelector(".classic-y").value) || 0;
    const net = calculateNet(d, y, "lgs");
    row.querySelector(".classic-net").innerText = net.toFixed(2);
    this.recalculateAllClassicRows();
  }

  recalculateAllClassicRows() {
    let d = 0,
      y = 0,
      b = 0,
      totalNet = 0;
    document.querySelectorAll(".classic-subject-row").forEach((row) => {
      const rowD = Number(row.querySelector(".classic-d").value) || 0;
      const rowY = Number(row.querySelector(".classic-y").value) || 0;
      const rowB = Number(row.querySelector(".classic-b").value) || 0;
      const net = calculateNet(rowD, rowY, "lgs");
      row.querySelector(".classic-net").innerText = net.toFixed(2);

      d += rowD;
      y += rowY;
      b += rowB;
      totalNet += net;
    });

    const totalEl = document.getElementById("exam-summary-total-q");
    if (totalEl) {
      totalEl.innerText = d + y + b;
      document.getElementById("exam-summary-d").innerText = d;
      document.getElementById("exam-summary-y").innerText = y;
      document.getElementById("exam-summary-b").innerText = b;
      document.getElementById("exam-summary-total-net").innerText = `${totalNet.toFixed(2)} Net`;
    }
  }

  async handleExcelImport(file) {
    if (!file) return;
    try {
      showToast("Excel dosyası okunuyor...", "info");
      const rows = await parseExcelFile(file);
      const dersSonuclari = processGainRows(rows);

      const previewDiv = document.getElementById("excel-preview-area");
      const contentDiv = document.getElementById("excel-preview-content");
      if (previewDiv && contentDiv) {
        previewDiv.style.display = "block";
        contentDiv.innerHTML = `
          <table class="data-table">
            <thead>
              <tr><th>Ders</th><th>Kazanım Sayısı</th><th>Doğru</th><th>Yanlış</th><th>Boş</th><th>Net</th></tr>
            </thead>
            <tbody>
              ${dersSonuclari
                .map(
                  (d) => `
                <tr>
                  <td><strong>${d.ders}</strong></td>
                  <td>${d.konular ? d.konular.length : 0} Kazanım</td>
                  <td class="text-success">${d.dogru}</td>
                  <td class="text-danger">${d.yanlis}</td>
                  <td>${d.bos}</td>
                  <td><strong class="text-primary">${d.net}</strong></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        `;
        this.importedExcelDersSonuclari = dersSonuclari;
        showToast("Excel dosyası başarıyla ayrıştırıldı!", "success");
      }
    } catch (err) {
      showToast("Excel yükleme hatası: " + err.message, "error");
    }
  }

  saveExamForm() {
    const ogrenciId = document.getElementById("exam-form-student")?.value;
    const sinavAdi = document.getElementById("exam-form-name")?.value.trim();
    const tarih = document.getElementById("exam-form-date")?.value;

    if (!ogrenciId || !sinavAdi || !tarih) {
      showToast("Lütfen öğrenci, sınav adı ve tarih alanlarını eksiksiz doldurunuz.", "warning");
      return;
    }

    // Aktif tab'e göre dersSonuclari oluştur
    const activeTabBtn = document.querySelector(".tabs-nav .tab-btn.active");
    const activeTab = activeTabBtn?.getAttribute("data-exam-tab") || "gain";

    let dersSonuclari = [];
    let examTur = "kazanimli";

    if (activeTab === "gain") {
      examTur = "kazanimli";
      const dersMap = {};

      document.querySelectorAll(".gain-editor-row").forEach((row) => {
        const subject = row.getAttribute("data-subject") || "Matematik";
        const topic = row.querySelector(".custom-topic")?.value || row.getAttribute("data-topic") || "Konu";
        const gain = row.querySelector(".custom-gain")?.value || row.getAttribute("data-gain") || topic;
        const status = row.querySelector("input[type='radio']:checked")?.value || "dogru";

        if (!dersMap[subject]) {
          dersMap[subject] = { ders: subject, dogru: 0, yanlis: 0, bos: 0, net: 0, konular: [] };
        }

        dersMap[subject].konular.push({ kazanimAdi: `${topic} — ${gain}`, durum: status });
        if (status === "dogru") dersMap[subject].dogru++;
        else if (status === "yanlis") dersMap[subject].yanlis++;
        else dersMap[subject].bos++;
      });

      dersSonuclari = Object.values(dersMap).map((d) => {
        d.net = calculateNet(d.dogru, d.yanlis, "lgs");
        return d;
      });
    } else if (activeTab === "classic") {
      examTur = "kazanimsiz";
      document.querySelectorAll(".classic-subject-row").forEach((row) => {
        const ders = row.getAttribute("data-subject");
        const dogru = Number(row.querySelector(".classic-d").value) || 0;
        const yanlis = Number(row.querySelector(".classic-y").value) || 0;
        const bos = Number(row.querySelector(".classic-b").value) || 0;
        const net = calculateNet(dogru, yanlis, "lgs");

        dersSonuclari.push({ ders, dogru, yanlis, bos, net, konular: [] });
      });
    } else if (activeTab === "excel" && this.importedExcelDersSonuclari) {
      dersSonuclari = this.importedExcelDersSonuclari;
    }

    // Toplam neti hesapla
    let totalNet = 0;
    let totalQuestions = 0;
    dersSonuclari.forEach((d) => {
      totalNet += d.net || 0;
      totalQuestions += (d.dogru || 0) + (d.yanlis || 0) + (d.bos || 0);
    });

    const newExam = {
      id: generateId("snv"),
      ogrenciId,
      kurumId: store.getState().institution.id,
      sinavAdi,
      tarih,
      tur: examTur,
      toplamSoru: totalQuestions,
      toplamNet: Number(totalNet.toFixed(2)),
      dersSonuclari
    };

    store.addExam(newExam);
    this.closeModal("add-exam-modal");
  }

  viewExamDetail(examId) {
    const state = store.getState();
    const exam = state.exams.find((e) => e.id === examId);
    if (!exam) return;
    const student = state.students.find((s) => s.id === exam.ogrenciId);

    const modalHtml = `
      <div class="modal-backdrop" id="exam-detail-modal" onclick="if(event.target === this) window.app.closeModal('exam-detail-modal')">
        <div class="modal-dialog modal-lg animate-scale-up">
          <div class="modal-header">
            <div>
              <h3 class="modal-title">${exam.sinavAdi}</h3>
              <div style="font-size: 12px; color: var(--text-muted);">${student ? student.adSoyad : "Öğrenci"} • ${formatDate(exam.tarih)}</div>
            </div>
            <button class="modal-close" onclick="window.app.closeModal('exam-detail-modal')">&times;</button>
          </div>
          <div class="modal-body">
            <div class="d-flex justify-between items-center mb-3">
              <span class="badge ${exam.tur === "kazanimli" ? "badge-success" : "badge-secondary"} font-bold">
                ${exam.tur === "kazanimli" ? "🎯 Kazanım Bazlı Sınav" : "📊 Kazanımsız Sınav"}
              </span>
              <span class="badge badge-primary font-bold" style="font-size: 15px;">Toplam Net: ${exam.toplamNet || "-"} Net</span>
            </div>

            <table class="data-table mb-4">
              <thead>
                <tr><th>Ders</th><th>Doğru</th><th>Yanlış</th><th>Boş</th><th>Net</th></tr>
              </thead>
              <tbody>
                ${(exam.dersSonuclari || [])
                  .map(
                    (d) => `
                  <tr>
                    <td><strong>${d.ders}</strong></td>
                    <td class="text-success">${d.dogru}</td>
                    <td class="text-danger">${d.yanlis}</td>
                    <td class="text-muted">${d.bos}</td>
                    <td><strong class="text-primary">${d.net}</strong></td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>

            ${
              exam.tur === "kazanimli"
                ? `
              <h4 class="font-bold mb-2">Kazanım Detayları:</h4>
              <div class="table-responsive" style="max-height: 250px; overflow-y: auto;">
                <table class="data-table">
                  <thead><tr><th>Ders</th><th>Kazanım</th><th>Durum</th></tr></thead>
                  <tbody>
                    ${(exam.dersSonuclari || [])
                      .flatMap((d) =>
                        (d.konular || []).map(
                          (k) => `
                      <tr>
                        <td><strong>${d.ders}</strong></td>
                        <td style="font-size: 13px;">${k.kazanimAdi}</td>
                        <td>
                          <span class="badge ${k.durum === "dogru" ? "badge-success" : k.durum === "yanlis" ? "badge-danger" : "badge-light"}">
                            ${k.durum === "dogru" ? "✓ Doğru" : k.durum === "yanlis" ? "✗ Yanlış" : "○ Boş"}
                          </span>
                        </td>
                      </tr>
                    `
                        )
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
            `
                : ""
            }
          </div>
          <div class="modal-footer">
            <button class="btn btn-outline" onclick="window.app.closeModal('exam-detail-modal')">Kapat</button>
            <button class="btn btn-primary" onclick="window.app.closeModal('exam-detail-modal'); window.app.analyzeSingleExam('${exam.id}')">
              Yapay Zekâ Analizini Başlat
            </button>
          </div>
        </div>
      </div>
    `;

    this.renderModalContainer(modalHtml);
  }

  deleteExamConfirm(examId) {
    const exam = store.getState().exams.find((e) => e.id === examId);
    if (!exam) return;
    if (confirm(`"${exam.sinavAdi}" kaydını silmek istediğinize emin misiniz?`)) {
      store.deleteExam(examId);
    }
  }

  // Çoklu seçim fonksiyonları
  toggleExamCheckbox(examId) {
    store.toggleExamSelection(examId);
  }

  toggleSelectAllExams(isChecked) {
    if (isChecked) {
      store.getState().exams.forEach((e) => store.state.selectedExamIds.add(e.id));
      store.notify("EXAM_SELECTION_CHANGED", Array.from(store.state.selectedExamIds));
    } else {
      store.clearExamSelection();
    }
    this.renderCurrentView();
  }

  clearSelectedExams() {
    store.clearExamSelection();
    document.querySelectorAll(".exam-checkbox").forEach((cb) => (cb.checked = false));
    const allCb = document.getElementById("select-all-exams");
    if (allCb) allCb.checked = false;
    this.updateMultiExamBar([]);
  }

  updateMultiExamBar(selectedIds) {
    const bar = document.getElementById("multi-exam-bar");
    const badge = document.getElementById("selected-count-badge");
    if (bar && badge) {
      if (selectedIds.length > 0) {
        bar.classList.add("active");
        badge.innerText = `${selectedIds.length} Sınav Seçildi`;
      } else {
        bar.classList.remove("active");
      }
    }
  }

  startAnalysisFromSelection() {
    const selectedExams = store.getSelectedExams();
    if (selectedExams.length === 0) {
      showToast("Lütfen en az bir sınav seçiniz.", "warning");
      return;
    }
    store.state.selectedStudentIdForAnalysis = selectedExams[0].ogrenciId;
    this.navigate("aiAnalysis");
  }

  analyzeSingleExam(examId) {
    store.clearExamSelection();
    store.toggleExamSelection(examId);
    const exam = store.getState().exams.find((e) => e.id === examId);
    if (exam) {
      store.state.selectedStudentIdForAnalysis = exam.ogrenciId;
    }
    this.navigate("aiAnalysis");
  }

  analyzeStudentAllExams(studentId) {
    store.clearExamSelection();
    store.state.selectedStudentIdForAnalysis = studentId;
    const studentExams = store.getState().exams.filter((e) => e.ogrenciId === studentId);
    studentExams.forEach((e) => store.state.selectedExamIds.add(e.id));
    this.navigate("aiAnalysis");
  }

  filterExams() {
    const query = document.getElementById("exam-search-input")?.value.toLowerCase().trim() || "";
    const studentFilter = document.getElementById("exam-student-filter")?.value || "all";
    const selectedIds = Array.from(store.getState().selectedExamIds);

    const filtered = store.getState().exams.filter((e) => {
      const student = store.getState().students.find((s) => s.id === e.ogrenciId);
      const studentName = student ? student.adSoyad.toLowerCase() : "";
      const matchQuery = e.sinavAdi.toLowerCase().includes(query) || studentName.includes(query);
      const matchStudent = studentFilter === "all" || e.ogrenciId === studentFilter;
      return matchQuery && matchStudent;
    });

    const tbody = document.getElementById("exams-tbody");
    if (tbody) {
      tbody.innerHTML = renderExamRows(filtered, store.getState().students, selectedIds);
    }
  }

  // ==========================================
  // YAPAY ZEKÂ ANALİZİ & RAPOR OLUŞTURMA
  // ==========================================
  onAiStudentChanged(studentId) {
    store.state.selectedStudentIdForAnalysis = studentId;
    store.clearExamSelection();
    const studentExams = store.getState().exams.filter((e) => e.ogrenciId === studentId);
    studentExams.forEach((e) => store.state.selectedExamIds.add(e.id));
    this.renderCurrentView();
  }

  async executeAiAnalysis() {
    const state = store.getState();
    const studentId = document.getElementById("ai-student-select")?.value;
    const student = state.students.find((s) => s.id === studentId);

    // Seçilen sınav checkbox'larını topla
    const checkedBoxes = document.querySelectorAll("input[name='ai-selected-exams']:checked");
    const chosenExamIds = Array.from(checkedBoxes).map((cb) => cb.value);
    const chosenExams = state.exams.filter((e) => chosenExamIds.includes(e.id));

    if (!student || chosenExams.length === 0) {
      showToast("Lütfen analiz için en az bir sınav seçiniz.", "warning");
      return;
    }

    // Yükleme ekranını aç
    const wizardCard = document.getElementById("ai-wizard-card");
    const loadingScreen = document.getElementById("ai-loading-screen");
    const resultContainer = document.getElementById("ai-result-container");

    if (wizardCard) wizardCard.style.display = "none";
    if (loadingScreen) loadingScreen.style.display = "block";
    if (resultContainer) resultContainer.style.display = "none";

    try {
      // Yapay Zekâ Analizini Çalıştır
      const aiResult = await AIService.analyzeExams(student, chosenExams, state.aiConfig);

      // Yeni Rapor Nesnesi Oluştur ve Kaydet
      const newReport = {
        id: generateId("rep"),
        ogrenciId: student.id,
        ogrenciAdSoyad: student.adSoyad,
        sinif: `${student.sinif}. Sınıf / ${student.sube}`,
        numara: student.numara,
        kurumId: state.institution.id,
        kullanilanSinavIdler: chosenExams.map((e) => e.id),
        sinavAdlari: chosenExams.map((e) => e.sinavAdi),
        aiSaglayici: aiResult._isSimulated
          ? "Akıllı Pedagojik AI Motoru"
          : state.aiConfig.provider === "gemini"
          ? `Google Gemini (${state.aiConfig.geminiModel})`
          : state.aiConfig.provider === "openai"
          ? `OpenAI (${state.aiConfig.openaiModel})`
          : `Anthropic Claude (${state.aiConfig.claudeModel})`,
        olusturmaTarihi: new Date().toISOString().split("T")[0],
        eksikKonular: aiResult.eksikKonular || [],
        genelYorum: aiResult.genelYorum || "",
        gelisimAnalizi: aiResult.gelisimAnalizi || "",
        calismaProgrami: aiResult.calismaProgrami || []
      };

      store.addReport(newReport);
      this.currentActiveReport = { report: newReport, student, exams: chosenExams, institution: state.institution };

      // Sonuç ekranını render et
      if (loadingScreen) loadingScreen.style.display = "none";
      if (resultContainer) resultContainer.style.display = "block";

      const target = document.getElementById("report-render-target");
      if (target) {
        target.innerHTML = PDFService.renderReportHTML(newReport, student, chosenExams, state.institution);
      }

      document.getElementById("res-report-subtitle").innerText = `${student.adSoyad} • ${chosenExams.length} Sınav İncelendi`;

      if (aiResult._fallbackUsed) {
        showToast("Canlı API çağrısı yapılamadığı için Yerleşik Pedagojik Motor ile üretildi.", "info");
      } else {
        showToast("Yapay zekâ analizi ve haftalık program hazırlandı!", "success");
      }
    } catch (err) {
      if (loadingScreen) loadingScreen.style.display = "none";
      if (wizardCard) wizardCard.style.display = "block";
      showToast("AI Analiz hatası: " + err.message, "error");
    }
  }

  downloadActiveReportPDF() {
    if (!this.currentActiveReport) return;
    const { report, student } = this.currentActiveReport;
    const fileName = `${student.adSoyad.replace(/\s+/g, "_")}_Sinav_Analiz_Raporu.pdf`;
    showToast("PDF hazırlanıyor ve indiriliyor...", "info");
    PDFService.exportToPDF("printable-report-sheet", fileName);
  }

  printActiveReport() {
    PDFService.printReport("printable-report-sheet");
  }

  // ==========================================
  // RAPOR ARŞİVİ VE DETAY GÖRÜNTÜLEME
  // ==========================================
  viewReportDetail(reportId) {
    const state = store.getState();
    const report = state.reports.find((r) => r.id === reportId);
    if (!report) return;

    const student = state.students.find((s) => s.id === report.ogrenciId) || {
      adSoyad: report.ogrenciAdSoyad || "Öğrenci",
      sinif: "8",
      sube: "8-A",
      numara: report.numara || ""
    };
    const exams = state.exams.filter((e) => (report.kullanilanSinavIdler || []).includes(e.id));
    const effectiveExams = exams.length > 0 ? exams : state.exams.slice(0, 1);

    this.currentActiveReport = { report, student, exams: effectiveExams, institution: state.institution };

    const modalHtml = `
      <div class="modal-backdrop" id="report-view-modal" onclick="if(event.target === this) window.app.closeModal('report-view-modal')">
        <div class="modal-dialog modal-xl animate-scale-up">
          <div class="modal-header">
            <div>
              <h3 class="modal-title">Öğrenci Sınav Karnesi & Analiz Raporu</h3>
              <div style="font-size: 12px; color: var(--text-muted);">${student.adSoyad} • Oluşturulma: ${formatDate(report.olusturmaTarihi)}</div>
            </div>
            <div class="btn-group">
              <button class="btn btn-sm btn-outline" onclick="window.app.printActiveReport()">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Yazdır
              </button>
              <button class="btn btn-sm btn-primary shadow-glow" onclick="window.app.downloadActiveReportPDF()">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                PDF İndir
              </button>
              <button class="modal-close" onclick="window.app.closeModal('report-view-modal')">&times;</button>
            </div>
          </div>
          <div class="modal-body p-0">
            <div class="report-modal-sheet-container">
              ${PDFService.renderReportHTML(report, student, effectiveExams, state.institution)}
            </div>
          </div>
        </div>
      </div>
    `;

    this.renderModalContainer(modalHtml);
  }

  downloadReportPDF(reportId) {
    this.viewReportDetail(reportId);
    setTimeout(() => {
      this.downloadActiveReportPDF();
    }, 400);
  }

  deleteReportConfirm(reportId) {
    if (confirm("Bu analiz raporunu arşivden silmek istediğinize emin misiniz?")) {
      store.deleteReport(reportId);
    }
  }

  filterReports() {
    const query = document.getElementById("report-search-input")?.value.toLowerCase().trim() || "";
    const studentFilter = document.getElementById("report-student-filter")?.value || "all";

    const filtered = store.getState().reports.filter((r) => {
      const student = store.getState().students.find((s) => s.id === r.ogrenciId);
      const studentName = (r.ogrenciAdSoyad || (student ? student.adSoyad : "")).toLowerCase();
      const matchQuery = studentName.includes(query);
      const matchStudent = studentFilter === "all" || r.ogrenciId === studentFilter;
      return matchQuery && matchStudent;
    });

    const tbody = document.getElementById("reports-tbody");
    if (tbody) {
      tbody.innerHTML = renderReportRows(filtered, store.getState().students);
    }
  }

  // ==========================================
  // KURUM AYARLARI VE TEMA İŞLEMLERİ
  // ==========================================
  selectThemeColor(hex) {
    document.querySelectorAll(".palette-swatch").forEach((s) => s.classList.remove("active"));
    const hidden = document.getElementById("inst-theme-color");
    if (hidden) hidden.value = hex;

    const customInput = document.getElementById("inst-custom-color");
    if (customInput) customInput.value = hex;

    store.applyTheme(hex);
    this.updateInstitutionLivePreview();
  }

  async handleLogoFileSelected(file) {
    if (!file) return;
    try {
      showToast("Logo yükleniyor...", "info");
      const url = await FirebaseService.uploadLogo(file, store.getState().institution.id);
      store.updateInstitution({ logoUrl: url });
      this.renderCurrentView();
      showToast("Kurum logosu başarıyla yüklendi!", "success");
    } catch (err) {
      showToast("Logo yüklenemedi: " + err.message, "error");
    }
  }

  removeLogo() {
    store.updateInstitution({ logoUrl: "" });
    this.renderCurrentView();
  }

  updateInstitutionLivePreview() {
    const name = document.getElementById("inst-name")?.value || store.getState().institution.ad;
    const address = document.getElementById("inst-address")?.value || "";
    const phone = document.getElementById("inst-phone")?.value || "";
    const color = document.getElementById("inst-theme-color")?.value || "#2563eb";

    const prevName = document.getElementById("prev-inst-name");
    const prevAddr = document.getElementById("prev-inst-address");
    const prevPhone = document.getElementById("prev-inst-phone");
    const prevBadge = document.getElementById("prev-badge-title");

    if (prevName) prevName.innerText = name;
    if (prevAddr) prevAddr.innerText = `📍 ${address || "Adres bilgisi"}`;
    if (prevPhone) prevPhone.innerText = `📞 ${phone || "-"}`;
    if (prevBadge) prevBadge.style.background = color;
  }

  saveInstitutionSettings(e) {
    e.preventDefault();
    const ad = document.getElementById("inst-name").value.trim();
    const kurumKodu = document.getElementById("inst-code").value.trim();
    const telefon = document.getElementById("inst-phone").value.trim();
    const adres = document.getElementById("inst-address").value.trim();
    const email = document.getElementById("inst-email").value.trim();
    const web = document.getElementById("inst-web").value.trim();
    const temaRengi = document.getElementById("inst-theme-color").value;

    store.updateInstitution({ ad, kurumKodu, telefon, adres, email, web, temaRengi });
  }

  resetSampleDataConfirm() {
    if (confirm("Örnek demo öğrencileri, sınavları ve raporları yeniden yüklemek istediğinize emin misiniz?")) {
      store.resetToSampleData();
    }
  }

  clearAllDataConfirm() {
    if (confirm("DİKKAT: Tüm öğrenci, sınav ve rapor kayıtları tamamen silinecektir. Emin misiniz?")) {
      store.clearAllData();
    }
  }

  // ==========================================
  // YAPAY ZEKÂ VE FIREBASE AYARLARI
  // ==========================================
  selectAiProvider(providerId) {
    document.querySelectorAll(".provider-card").forEach((c) => c.classList.remove("selected"));
    document.querySelectorAll(".provider-fields").forEach((f) => f.classList.remove("active"));

    const targetField = document.getElementById(`fields-${providerId}`);
    if (targetField) targetField.classList.add("active");

    store.updateAiConfig({ provider: providerId });
    this.renderCurrentView();
  }

  togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    if (input) {
      input.type = input.type === "password" ? "text" : "password";
    }
  }

  saveAiSettings(e) {
    e.preventDefault();
    const provider = store.getState().aiConfig.provider || "gemini";
    const temperature = Number(document.getElementById("ai-temperature")?.value) || 0.7;

    const geminiModel = document.getElementById("gemini-model")?.value;
    const geminiApiKey = document.getElementById("gemini-api-key")?.value.trim();

    const openaiModel = document.getElementById("openai-model")?.value;
    const openaiApiKey = document.getElementById("openai-api-key")?.value.trim();

    const claudeModel = document.getElementById("claude-model")?.value;
    const claudeApiKey = document.getElementById("claude-api-key")?.value.trim();

    store.updateAiConfig({
      provider,
      temperature,
      geminiModel,
      geminiApiKey,
      openaiModel,
      openaiApiKey,
      claudeModel,
      claudeApiKey
    });
  }

  async testAiConnection() {
    const state = store.getState();
    const provider = state.aiConfig.provider || "gemini";
    showToast(`${provider.toUpperCase()} bağlantısı test ediliyor...`, "info");

    try {
      const dummyStudent = { adSoyad: "Test Öğrenci", sinif: "8", sube: "8-A", numara: "100" };
      const dummyExams = state.exams.slice(0, 1);
      const res = await AIService.analyzeExams(dummyStudent, dummyExams, state.aiConfig);

      if (res && res.eksikKonular) {
        showToast("✓ Yapay Zekâ bağlantısı ve API doğrulaması başarılı!", "success");
      }
    } catch (err) {
      showToast("Bağlantı hatası: " + err.message, "error");
    }
  }

  saveFirebaseConfig(e) {
    e.preventDefault();
    const config = {
      apiKey: document.getElementById("fb-apiKey").value.trim(),
      projectId: document.getElementById("fb-projectId").value.trim(),
      authDomain: document.getElementById("fb-authDomain").value.trim(),
      storageBucket: document.getElementById("fb-storageBucket").value.trim(),
      messagingSenderId: document.getElementById("fb-messagingSenderId").value.trim(),
      appId: document.getElementById("fb-appId").value.trim()
    };

    store.updateFirebaseConfig(config);
    FirebaseService.init(config);
    showToast("Firebase yapılandırması kaydedildi.", "success");
  }

  async testFirebaseConnection() {
    const config = {
      apiKey: document.getElementById("fb-apiKey")?.value.trim(),
      projectId: document.getElementById("fb-projectId")?.value.trim()
    };

    showToast("Firebase bağlantısı test ediliyor...", "info");
    const res = await FirebaseService.testConnection(config);
    if (res.success) {
      showToast(res.message, "success");
    } else {
      showToast(res.message, "error");
    }
  }

  clearFirebaseConfig() {
    store.updateFirebaseConfig(null);
    showToast("Firebase bilgileri temizlendi. Yerel depolama moduna geçildi.", "info");
    this.renderCurrentView();
  }

  // ==========================================
  // MODAL YARDIMCILARI
  // ==========================================
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
}

// Global uygulama nesnesini başlat
window.app = new App();
