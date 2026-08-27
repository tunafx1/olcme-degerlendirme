/**
 * Dashboard Görünümü (Ana Panel)
 */

import { store } from "../state.js";
import { formatDate } from "../utils/helpers.js";

export function renderDashboardView() {
  const state = store.getState();
  const studentsCount = state.students.length;
  const examsCount = state.exams.length;
  const reportsCount = state.reports.length;

  // Ortalama Net Hesapla
  let totalNet = 0;
  let examWithNetCount = 0;
  state.exams.forEach((e) => {
    if (e.toplamNet) {
      totalNet += Number(e.toplamNet);
      examWithNetCount++;
    }
  });
  const avgNet = examWithNetCount > 0 ? (totalNet / examWithNetCount).toFixed(1) : "0.0";

  // Son 5 Sınav
  const recentExams = state.exams.slice(0, 5);
  // Son 4 Rapor
  const recentReports = state.reports.slice(0, 4);

  return `
    <div class="view-container animate-fade-in">
      <!-- ÜST BAŞLIK VE HIZLI AKSİYONLAR -->
      <div class="dashboard-hero">
        <div class="dashboard-hero-content">
          <div class="dashboard-hero-badge">
            <span class="pulse-dot"></span>
            <span>${state.institution.ad} — Ölçme & Değerlendirme Merkezi</span>
          </div>
          <h1 class="dashboard-hero-title">Sınav Analiz ve Yapay Zekâ Raporlama Paneli</h1>
          <p class="dashboard-hero-desc">Öğrenci sınav sonuçlarını kazanım bazında analiz edin, eksikleri tespit edip yapay zekâ ile kişiye özel haftalık çalışma programları ve kurumsal PDF karneleri oluşturun.</p>
        </div>
        <div class="dashboard-hero-actions">
          <button class="btn btn-primary btn-lg shadow-glow" onclick="window.app.navigate('exams', { openModal: 'addExam' })">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
            <span>Yeni Sınav Girişi</span>
          </button>
          <button class="btn btn-secondary btn-lg" onclick="window.app.navigate('aiAnalysis')">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>
            <span>Yapay Zekâ Analizi Başlat</span>
          </button>
        </div>
      </div>

      <!-- İSTATİSTİK KARTLARI -->
      <div class="stats-grid">
        <div class="stat-card" onclick="window.app.navigate('students')">
          <div class="stat-icon-wrap stat-icon-blue">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">${studentsCount}</div>
            <div class="stat-label">Kayıtlı Öğrenci</div>
          </div>
          <div class="stat-arrow">&rarr;</div>
        </div>

        <div class="stat-card" onclick="window.app.navigate('exams')">
          <div class="stat-icon-wrap stat-icon-indigo">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">${examsCount}</div>
            <div class="stat-label">İşlenen Sınav</div>
          </div>
          <div class="stat-arrow">&rarr;</div>
        </div>

        <div class="stat-card" onclick="window.app.navigate('reports')">
          <div class="stat-icon-wrap stat-icon-emerald">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">${reportsCount}</div>
            <div class="stat-label">Üretilen AI Raporu</div>
          </div>
          <div class="stat-arrow">&rarr;</div>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrap stat-icon-amber">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">${avgNet} <small style="font-size: 13px; font-weight: normal; color: var(--text-muted);">Net</small></div>
            <div class="stat-label">Genel Net Ortalaması</div>
          </div>
        </div>
      </div>

      <!-- İKİ KOLONLU İÇERİK ALANI -->
      <div class="dashboard-grid">
        <!-- SOL: SON EKLENEN SINAVLAR -->
        <div class="card">
          <div class="card-header">
            <div class="card-title-group">
              <h2 class="card-title">Son Sınav Kayıtları</h2>
              <span class="card-subtitle">En son eklenen sınav sonuçları</span>
            </div>
            <button class="btn btn-sm btn-outline" onclick="window.app.navigate('exams')">Tümünü Gör</button>
          </div>
          <div class="card-body p-0">
            ${
              recentExams.length === 0
                ? `<div class="empty-state p-4"><p>Henüz kayıtlı sınav bulunmuyor.</p></div>`
                : `
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Sınav Adı</th>
                    <th>Öğrenci</th>
                    <th>Tarih</th>
                    <th>Toplam Net</th>
                    <th>İşlem</th>
                  </tr>
                </thead>
                <tbody>
                  ${recentExams
                    .map((exam) => {
                      const student = state.students.find((s) => s.id === exam.ogrenciId);
                      return `
                      <tr>
                        <td>
                          <strong>${exam.sinavAdi}</strong>
                          <div style="font-size: 11px; color: var(--text-muted);">${exam.tur === "kazanimli" ? "🎯 Kazanımlı" : "📊 Kazanımsız"}</div>
                        </td>
                        <td>${student ? student.adSoyad : "Bilinmiyor"} (${student ? student.sube : "-"})</td>
                        <td>${formatDate(exam.tarih)}</td>
                        <td><span class="badge badge-primary font-bold">${exam.toplamNet || "-"} Net</span></td>
                        <td>
                          <button class="btn btn-sm btn-ghost text-primary" onclick="window.app.analyzeSingleExam('${exam.id}')" title="AI Analizi Yap">
                            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3Z"/></svg>
                            Analiz Et
                          </button>
                        </td>
                      </tr>
                    `;
                    })
                    .join("")}
                </tbody>
              </table>
            `
            }
          </div>
        </div>

        <!-- SAĞ: SON ÜRETİLEN RAPORLAR & HIZLI ERİŞİM -->
        <div class="card">
          <div class="card-header">
            <div class="card-title-group">
              <h2 class="card-title">Son Oluşturulan Raporlar</h2>
              <span class="card-subtitle">AI karneleri ve çalışma programları</span>
            </div>
            <button class="btn btn-sm btn-outline" onclick="window.app.navigate('reports')">Tüm Arşiv</button>
          </div>
          <div class="card-body">
            ${
              recentReports.length === 0
                ? `<div class="empty-state"><p>Henüz oluşturulmuş rapor yok.</p></div>`
                : `
              <div class="recent-reports-list">
                ${recentReports
                  .map((rep) => {
                    const student = state.students.find((s) => s.id === rep.ogrenciId);
                    return `
                    <div class="report-mini-card">
                      <div class="report-mini-icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                      </div>
                      <div class="report-mini-info">
                        <div class="report-mini-name">${rep.ogrenciAdSoyad || (student ? student.adSoyad : "Öğrenci")}</div>
                        <div class="report-mini-meta">
                          <span>${formatDate(rep.olusturmaTarihi)}</span>
                          <span>•</span>
                          <span>${rep.kullanilanSinavIdler ? rep.kullanilanSinavIdler.length : 1} Sınav</span>
                        </div>
                      </div>
                      <div class="report-mini-actions">
                        <button class="btn btn-sm btn-outline" onclick="window.app.viewReportDetail('${rep.id}')">İncele</button>
                        <button class="btn btn-sm btn-primary" onclick="window.app.downloadReportPDF('${rep.id}')" title="PDF İndir">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        </button>
                      </div>
                    </div>
                  `;
                  })
                  .join("")}
              </div>
            `
            }
          </div>
        </div>
      </div>
    </div>
  `;
}
