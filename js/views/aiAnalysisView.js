/**
 * Yapay Zekâ Analiz ve Canlı Rapor Üretim Görünümü
 */

import { store } from "../state.js";
import { formatDate } from "../utils/helpers.js";
import { APP_CONFIG } from "../config.js";

export function renderAiAnalysisView() {
  const state = store.getState();
  const students = state.students;
  const exams = state.exams;
  const aiConfig = state.aiConfig;
  const currentProvider = APP_CONFIG.aiProviders.find((p) => p.id === aiConfig.provider) || APP_CONFIG.aiProviders[0];

  // Seçili öğrenci veya sınavlar
  const selectedExams = store.getSelectedExams();
  let defaultStudentId = state.selectedStudentIdForAnalysis;

  if (!defaultStudentId && selectedExams.length > 0) {
    defaultStudentId = selectedExams[0].ogrenciId;
  } else if (!defaultStudentId && students.length > 0) {
    defaultStudentId = students[0].id;
  }

  const currentStudent = students.find((s) => s.id === defaultStudentId);
  const studentExams = currentStudent ? exams.filter((e) => e.ogrenciId === currentStudent.id) : [];

  return `
    <div class="view-container animate-fade-in" id="ai-analysis-root">
      <!-- ÜST BAŞLIK -->
      <div class="view-header">
        <div>
          <h1 class="view-title">Yapay Zekâ Sınav Analizi</h1>
          <p class="view-subtitle">Öğrencinin sınav sonuçlarını yapay zekâya aktararak eksik konu tespiti, pedagojik rehberlik yorumu ve haftalık çalışma programı üretin.</p>
        </div>
        <div class="view-actions">
          <div class="ai-provider-badge">
            <span class="ai-pulse-dot"></span>
            <span>Aktif AI: <strong>${currentProvider.name}</strong></span>
          </div>
          <button class="btn btn-outline btn-sm" onclick="window.app.navigate('aiSettings')">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span>Modeli Değiştir</span>
          </button>
        </div>
      </div>

      <!-- ANALİZ AYARLARI KARTI (WIZARD) -->
      <div class="card mb-4" id="ai-wizard-card">
        <div class="card-header">
          <div class="card-title-group">
            <h2 class="card-title">1. Öğrenci ve Sınav Seçimi</h2>
            <span class="card-subtitle">Analize dahil edilecek öğrenciyi ve sınav kayıtlarını belirleyin</span>
          </div>
        </div>
        <div class="card-body">
          <div class="grid-2-col">
            <!-- ÖĞRENCİ SEÇİMİ -->
            <div class="form-group">
              <label class="form-label">Öğrenci Seçiniz:</label>
              <select id="ai-student-select" class="form-control" onchange="window.app.onAiStudentChanged(this.value)">
                ${students
                  .map(
                    (s) => `
                  <option value="${s.id}" ${currentStudent && s.id === currentStudent.id ? "selected" : ""}>
                    ${s.adSoyad} (${s.sinif}. Sınıf / ${s.sube} - No: ${s.numara})
                  </option>
                `
                  )
                  .join("")}
              </select>
            </div>

            <!-- SEÇİLİ ÖĞRENCİ ÖZETİ -->
            <div class="student-mini-summary-box">
              ${
                currentStudent
                  ? `
                <div class="student-summary-info">
                  <div class="student-summary-name">${currentStudent.adSoyad}</div>
                  <div class="student-summary-meta">Sınıf: ${currentStudent.sinif}. Sınıf / ${currentStudent.sube} • Toplam ${studentExams.length} Sınav</div>
                </div>
              `
                  : `<p class="text-muted">Lütfen bir öğrenci seçin.</p>`
              }
            </div>
          </div>

          <!-- SINAV LİSTESİ SEÇİM ALANI (CHECKBOXES) -->
          <div class="form-group mt-4">
            <label class="form-label d-flex justify-between items-center">
              <span>Analiz Edilecek Sınav(lar):</span>
              <span class="text-muted" style="font-size: 12px;">(Birden fazla sınav seçerek karşılaştırmalı gelişim raporu alabilirsiniz)</span>
            </label>

            <div class="ai-exam-selection-list">
              ${
                studentExams.length === 0
                  ? `<div class="empty-state p-4"><p>Bu öğrenciye ait kayıtlı sınav bulunmuyor. <a href="javascript:void(0)" onclick="window.app.openAddExamModal('${currentStudent ? currentStudent.id : ""}')">Sınav eklemek için tıklayın.</a></p></div>`
                  : studentExams
                      .map((exam) => {
                        const isChecked = state.selectedExamIds.has(exam.id) || selectedExams.length === 0;
                        return `
                    <label class="ai-exam-select-item ${isChecked ? "active" : ""}">
                      <input type="checkbox" name="ai-selected-exams" value="${exam.id}" ${isChecked ? "checked" : ""} onchange="this.parentElement.classList.toggle('active', this.checked)" />
                      <div class="ai-exam-item-details">
                        <div class="font-bold">${exam.sinavAdi}</div>
                        <div class="text-muted" style="font-size: 12px;">Tarih: ${formatDate(exam.tarih)} • Tür: ${exam.tur === "kazanimli" ? "Kazanımlı" : "Kazanımsız"}</div>
                      </div>
                      <div class="ai-exam-item-net">
                        <span class="badge badge-primary">${exam.toplamNet || "-"} Net</span>
                      </div>
                    </label>
                  `;
                      })
                      .join("")
              }
            </div>
          </div>

          <!-- ANALİZİ BAŞLAT BUTONU -->
          <div class="ai-action-footer">
            <button id="btn-run-ai-analysis" class="btn btn-primary btn-lg shadow-glow" onclick="window.app.executeAiAnalysis()" ${studentExams.length === 0 ? "disabled" : ""}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>
              <span>Yapay Zekâ Analizini Başlat & Rapor Üret</span>
            </button>
          </div>
        </div>
      </div>

      <!-- ANALİZ YÜKLENİYOR EKRANI (LIVELOADER) -->
      <div id="ai-loading-screen" class="card ai-loading-container" style="display: none;">
        <div class="ai-loading-pulse">
          <div class="ai-orb"></div>
        </div>
        <h3 class="ai-loading-title">Yapay Zekâ Analizi Gerçekleştiriliyor...</h3>
        <p class="ai-loading-desc">Sınav kazanımları inceleniyor, eksikler tespit ediliyor ve öğrenciye özel haftalık çalışma programı derleniyor.</p>
        <div class="ai-progress-steps">
          <div class="ai-step active" id="step-1">✓ Sınav ve kazanım verileri derlendi</div>
          <div class="ai-step active" id="step-2">⚡ Pedagojik AI modeli çalıştırılıyor</div>
          <div class="ai-step" id="step-3">🎯 Eksik kazanımlar ve öneriler belirleniyor</div>
          <div class="ai-step" id="step-4">📅 Haftalık çalışma programı hazırlanıyor</div>
        </div>
      </div>

      <!-- CANLI ANALİZ SONUÇLARI VE RAPOR ÖNİZLEME ALANI -->
      <div id="ai-result-container" style="display: none;">
        <!-- Sonuç Başlığı ve Aksiyonlar -->
        <div class="result-header card mb-4">
          <div class="result-header-content">
            <div class="badge badge-success mb-2">✓ Analiz Başarıyla Tamamlandı</div>
            <h2 class="result-title" id="res-report-title">Öğrenci Sınav Karnesi & Gelişim Raporu</h2>
            <p class="text-muted" id="res-report-subtitle"></p>
          </div>
          <div class="result-header-actions">
            <button class="btn btn-outline" onclick="window.app.printActiveReport()">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              <span>Yazdır (Print)</span>
            </button>
            <button class="btn btn-primary shadow-glow" onclick="window.app.downloadActiveReportPDF()">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>Kurumsal PDF İndir</span>
            </button>
          </div>
        </div>

        <!-- RAPOR BASKI ŞABLONU KAPLAYICISI -->
        <div class="report-preview-wrapper card p-0" id="report-render-target">
          <!-- Dinamik olarak render edilecek -->
        </div>
      </div>
    </div>
  `;
}
