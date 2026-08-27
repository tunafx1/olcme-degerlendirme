/**
 * Rapor Arşivi ve Geçmiş Raporlar Görünümü
 */

import { store } from "../state.js";
import { formatDate } from "../utils/helpers.js";

export function renderReportsView() {
  const state = store.getState();
  const reports = state.reports;
  const students = state.students;

  return `
    <div class="view-container animate-fade-in">
      <!-- ÜST BAŞLIK -->
      <div class="view-header">
        <div>
          <h1 class="view-title">Rapor Arşivi</h1>
          <p class="view-subtitle">Daha önce üretilen tüm yapay zekâ analiz raporlarını ve karneleri listeleyin, yeniden görüntüleyin veya PDF olarak indirin.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-primary" onclick="window.app.navigate('aiAnalysis')">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3 1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>
            <span>Yeni Analiz Başlat</span>
          </button>
        </div>
      </div>

      <!-- FİLTRE VE ARAMA -->
      <div class="filter-bar card">
        <div class="filter-search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="report-search-input" class="search-input" placeholder="Öğrenci adı ile rapor ara..." oninput="window.app.filterReports()" />
        </div>
        <div class="filter-select-wrap">
          <select id="report-student-filter" class="form-control" onchange="window.app.filterReports()">
            <option value="all">Tüm Öğrenciler</option>
            ${students.map((s) => `<option value="${s.id}">${s.adSoyad}</option>`).join("")}
          </select>
        </div>
      </div>

      <!-- RAPORLAR LİSTESİ -->
      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table" id="reports-table">
              <thead>
                <tr>
                  <th>Öğrenci Bilgisi</th>
                  <th>Analiz Edilen Sınavlar</th>
                  <th>AI Sağlayıcı</th>
                  <th>Oluşturma Tarihi</th>
                  <th>Eksik Sayısı</th>
                  <th style="text-align: right;">İşlemler</th>
                </tr>
              </thead>
              <tbody id="reports-tbody">
                ${renderReportRows(reports, students)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderReportRows(reports, students) {
  if (!reports || reports.length === 0) {
    return `
      <tr>
        <td colspan="6" class="text-center py-5">
          <div class="empty-state">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><polyline points="14 11 12 11 10 11"/></svg>
            <h3>Kayıtlı Rapor Yok</h3>
            <p>Henüz yapay zekâ analiz raporu oluşturulmadı.</p>
            <button class="btn btn-primary btn-sm mt-3" onclick="window.app.navigate('aiAnalysis')">İlk Raporu Oluştur</button>
          </div>
        </td>
      </tr>
    `;
  }

  return reports
    .map((rep) => {
      const student = students.find((s) => s.id === rep.ogrenciId);
      const studentName = rep.ogrenciAdSoyad || (student ? student.adSoyad : "Öğrenci");
      const examCount = rep.kullanilanSinavIdler ? rep.kullanilanSinavIdler.length : 1;
      const defCount = rep.eksikKonular ? rep.eksikKonular.length : 0;

      return `
      <tr class="report-row" data-id="${rep.id}" data-student="${rep.ogrenciId}">
        <td>
          <div class="font-bold text-dark cursor-pointer" onclick="window.app.viewReportDetail('${rep.id}')">${studentName}</div>
          <div style="font-size: 12px; color: var(--text-muted);">${rep.sinif || (student ? `${student.sinif}. Sınıf` : "")} ${rep.numara ? `• No: ${rep.numara}` : ""}</div>
        </td>
        <td>
          <span class="badge ${examCount > 1 ? "badge-primary" : "badge-secondary"}">
            ${examCount > 1 ? `📈 ${examCount} Sınav (Karşılaştırmalı)` : `📊 ${examCount} Sınav`}
          </span>
        </td>
        <td>
          <div style="font-size: 13px;">${rep.aiSaglayici || "AI Destekli"}</div>
        </td>
        <td>${formatDate(rep.olusturmaTarihi)}</td>
        <td>
          <span class="badge badge-warning font-bold">${defCount} Eksik Konu</span>
        </td>
        <td style="text-align: right;">
          <div class="btn-group">
            <button class="btn btn-sm btn-outline" onclick="window.app.viewReportDetail('${rep.id}')" title="Raporu İncele">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              <span>İncele</span>
            </button>
            <button class="btn btn-sm btn-primary" onclick="window.app.downloadReportPDF('${rep.id}')" title="PDF Olarak İndir">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              <span>PDF İndir</span>
            </button>
            <button class="btn btn-sm btn-ghost text-danger" onclick="window.app.deleteReportConfirm('${rep.id}')" title="Sil">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
    })
    .join("");
}
