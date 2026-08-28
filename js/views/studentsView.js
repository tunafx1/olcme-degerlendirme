/**
 * Öğrenci Yönetimi Görünümü
 */

import { store } from "../state.js";
import { generateId, formatDate } from "../utils/helpers.js";

export function renderStudentsView() {
  const state = store.getState();
  const students = state.students;

  return `
    <div class="view-container animate-fade-in">
      <!-- ÜST BAŞLIK VE BUTONLAR -->
      <div class="view-header">
        <div>
          <h1 class="view-title">Öğrenci Yönetimi</h1>
          <p class="view-subtitle">Kurumdaki öğrencileri listeleyin, yeni öğrenci kaydedin ve sınav geçmişlerini inceleyin.</p>
        </div>
        <div class="view-actions">
          <button class="btn btn-primary" onclick="window.app.openStudentModal()">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
            <span>Yeni Öğrenci Ekle</span>
          </button>
        </div>
      </div>

      <!-- FİLTRE VE ARAMA ÇUBUĞU -->
      <div class="filter-bar card">
        <div class="filter-search">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="student-search-input" class="search-input" placeholder="İsim veya öğrenci no ile ara..." oninput="window.app.filterStudents()" />
        </div>
        <div class="filter-tags">
          <button class="filter-btn active" data-class="all" onclick="window.app.filterStudentsByClass('all', this)">Tüm Sınıflar</button>
          <button class="filter-btn" data-class="8" onclick="window.app.filterStudentsByClass('8', this)">8. Sınıf (LGS)</button>
          <button class="filter-btn" data-class="11" onclick="window.app.filterStudentsByClass('11', this)">11. Sınıf</button>
          <button class="filter-btn" data-class="12" onclick="window.app.filterStudentsByClass('12', this)">12. Sınıf (YKS)</button>
        </div>
      </div>

      <!-- ÖĞRENCİ TABLOSU / KARTLARI -->
      <div class="card">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="data-table" id="students-table">
              <thead>
                <tr>
                  <th>Öğrenci Bilgisi</th>
                  <th>Sınıf / Şube</th>
                  <th>Numara</th>
                  <th>Kayıtlı Sınav</th>
                  <th>Veli Bilgisi</th>
                  <th style="text-align: right;">İşlemler</th>
                </tr>
              </thead>
              <tbody id="students-tbody">
                ${renderStudentRows(students, state.exams)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function renderStudentRows(students, exams) {
  if (!students || students.length === 0) {
    return `
      <tr>
        <td colspan="6" class="text-center py-5">
          <div class="empty-state">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
            <h3>Öğrenci Bulunamadı</h3>
            <p>Arama kriterlerine uygun öğrenci yok veya henüz kayıt yapılmadı.</p>
            <button class="btn btn-primary btn-sm mt-3" onclick="window.app.openStudentModal()">Yeni Öğrenci Ekle</button>
          </div>
        </td>
      </tr>
    `;
  }

  const state = store.getState();
  const reports = state.reports || [];

  return students
    .map((s) => {
      const studentExams = exams.filter((e) => e.ogrenciId === s.id);
      const studentReports = reports.filter((r) => r && (r.ogrenciId === s.id || (r.ogrenciAdSoyad && r.ogrenciAdSoyad.toLowerCase() === (s.adSoyad || "").toLowerCase())));
      const initials = (s.adSoyad || "")
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

      return `
      <tr class="student-row" data-id="${s.id}" data-class="${s.sinif}">
        <td>
          <div class="user-avatar-group">
            <div class="user-avatar-initials">${initials}</div>
            <div>
              <div class="font-bold text-dark cursor-pointer" onclick="window.app.openStudentProfile('${s.id}')">${s.adSoyad}</div>
              <div style="font-size: 12px; color: var(--text-muted);">Kayıt: ${formatDate(s.olusturmaTarihi)}</div>
            </div>
          </div>
        </td>
        <td><span class="badge badge-secondary">${s.sinif}. Sınıf / ${s.sube}</span></td>
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
        <td>
          <div style="font-size: 13px;">${s.veliAdSoyad || "-"}</div>
          <div style="font-size: 11px; color: var(--text-muted);">${s.veliTelefon || "-"}</div>
        </td>
        <td style="text-align: right;">
          <div class="btn-group">
            <button class="btn btn-sm btn-outline" onclick="window.app.openStudentProfile('${s.id}')" title="Sınav Geçmişi & Profil">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
              <span>Profil</span>
            </button>
            <button class="btn btn-sm btn-ghost" onclick="window.app.openStudentModal('${s.id}')" title="Düzenle">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
            </button>
            <button class="btn btn-sm btn-ghost text-danger" onclick="window.app.deleteStudentConfirm('${s.id}')" title="Sil">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
    })
    .join("");
}
