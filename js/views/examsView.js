/**
 * Sınav Yönetimi ve Çoklu Sınav Seçim Görünümü
 */

import { store } from "../state.js";
import { formatDate } from "../utils/helpers.js";

export function renderExamsView() {
  const state = store.getState();
  const exams = state.exams;
  const students = state.students;
  const selectedIds = Array.from(state.selectedExamIds);

  return `
    <div class="view-container animate-fade-in">
      <!-- ÜST BAŞLIK VE BUTONLAR -->
      <div class="view-header">
        <div>
          <h1 class="view-title">Sınav Yönetimi</h1>
          <p class="view-subtitle">Öğrencilerin kazanımlı veya klasik sınav sonuçlarını girin, Excel ile aktarın ve çoklu seçimle karşılaştırmalı analiz başlatın.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-primary" onclick="window.app.openAddExamModal()">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
            <span>Yeni Sınav Sonucu Ekle</span>
          </button>
        </div>
      </div>

      <!-- BİLGİLENDİRME / ÇOKLU SEÇİM İPUCU -->
      <div class="alert alert-info mb-4">
        <div class="alert-icon">💡</div>
        <div class="alert-text">
          <strong>İpucu:</strong> Karşılaştırmalı gelişim analizi ve zaman içindeki net seyrini görmek için tablodaki kutucukları işaretleyerek <strong>aynı veya farklı sınavları çoklu seçebilir</strong> ve tek tıkla yapay zekâya gönderebilirsiniz.
        </div>
      </div>

      <!-- FİLTRE VE ARAMA -->
      <div class="filter-bar card">
        <div class="filter-search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="exam-search-input" class="search-input" placeholder="Sınav adı veya öğrenci ara..." oninput="window.app.filterExams()" />
        </div>
        <div class="filter-select-wrap">
          <select id="exam-student-filter" class="form-control" onchange="window.app.filterExams()">
            <option value="all">Tüm Öğrenciler</option>
            ${students.map((s) => `<option value="${s.id}">${s.adSoyad} (${s.sube})</option>`).join("")}
          </select>
        </div>
      </div>

      <!-- SINAV TABLOSU -->
      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table" id="exams-table">
              <thead>
                <tr>
                  <th style="width: 40px; text-align: center;">
                    <input type="checkbox" id="select-all-exams" onchange="window.app.toggleSelectAllExams(this.checked)" />
                  </th>
                  <th>Sınav Bilgisi</th>
                  <th>Öğrenci</th>
                  <th>Sınav Tarihi</th>
                  <th>Tür</th>
                  <th>Toplam Net</th>
                  <th style="text-align: right;">İşlemler</th>
                </tr>
              </thead>
              <tbody id="exams-tbody">
                ${renderExamRows(exams, students, selectedIds)}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ÇOKLU SEÇİM YÜZEN AKSİYON ÇUBUĞU (FLOATING ACTION BAR) -->
      <div id="multi-exam-bar" class="floating-action-bar ${selectedIds.length > 0 ? "active" : ""}">
        <div class="floating-bar-info">
          <span class="badge badge-primary font-bold" id="selected-count-badge">${selectedIds.length} Sınav Seçildi</span>
          <span class="floating-bar-text">Karşılaştırmalı gelişim raporu ve eksik konu analizi oluşturmaya hazır.</span>
        </div>
        <div class="floating-bar-actions">
          <button class="btn btn-sm btn-ghost text-white" onclick="window.app.clearSelectedExams()">Seçimi Temizle</button>
          <button class="btn btn-sm btn-accent shadow-glow" onclick="window.app.startAnalysisFromSelection()">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>
            <span>Yapay Zekâ Analizini Başlat</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

export function renderExamRows(exams, students, selectedIds) {
  if (!exams || exams.length === 0) {
    return `
      <tr>
        <td colspan="7" class="text-center py-5">
          <div class="empty-state">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <h3>Sınav Kaydı Bulunamadı</h3>
            <p>Arama kriterlerine uygun sınav yok veya henüz sınav eklenmedi.</p>
            <button class="btn btn-primary btn-sm mt-3" onclick="window.app.openAddExamModal()">Yeni Sınav Ekle</button>
          </div>
        </td>
      </tr>
    `;
  }

  return exams
    .map((exam) => {
      const student = students.find((s) => s.id === exam.ogrenciId);
      const isSelected = selectedIds.includes(exam.id);

      return `
      <tr class="exam-row ${isSelected ? "row-selected" : ""}" data-id="${exam.id}" data-student="${exam.ogrenciId}">
        <td style="text-align: center;">
          <input type="checkbox" class="exam-checkbox" value="${exam.id}" ${isSelected ? "checked" : ""} onchange="window.app.toggleExamCheckbox('${exam.id}')" />
        </td>
        <td>
          <div class="font-bold text-dark cursor-pointer" onclick="window.app.viewExamDetail('${exam.id}')">${exam.sinavAdi}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${(exam.dersSonuclari || []).length} Ders Kaydı</div>
        </td>
        <td>
          <strong>${student ? student.adSoyad : "Bilinmeyen Öğrenci"}</strong>
          <div style="font-size: 12px; color: var(--text-muted);">${student ? `${student.sinif}. Sınıf / ${student.sube}` : "-"}</div>
        </td>
        <td>${formatDate(exam.tarih)}</td>
        <td>
          <span class="badge ${exam.tur === "kazanimli" ? "badge-success" : "badge-secondary"}">
            ${exam.tur === "kazanimli" ? "🎯 Kazanımlı" : "📊 Kazanımsız"}
          </span>
        </td>
        <td>
          <strong class="text-primary" style="font-size: 15px;">${exam.toplamNet || "-"} Net</strong>
        </td>
        <td style="text-align: right;">
          <div class="btn-group">
            <button class="btn btn-sm btn-ghost text-primary" onclick="window.app.analyzeSingleExam('${exam.id}')" title="Yapay Zekâ ile Analiz Et">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>
              <span>Analiz</span>
            </button>
            <button class="btn btn-sm btn-ghost" onclick="window.app.viewExamDetail('${exam.id}')" title="İncele">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
            <button class="btn btn-sm btn-ghost text-danger" onclick="window.app.deleteExamConfirm('${exam.id}')" title="Sil">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
    })
    .join("");
}
