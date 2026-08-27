/**
 * Kurum Ayarları ve Tema Özelleştirme Görünümü
 */

import { store } from "../state.js";

const PRESET_PALETTES = [
  { name: "Safir Mavi", hex: "#2563eb" },
  { name: "Zümrüt Yeşili", hex: "#059669" },
  { name: "İndigo / Gece Mavisi", hex: "#4f46e5" },
  { name: "Koyu Bordo", hex: "#991b1b" },
  { name: "Asil Mor", hex: "#7c3aed" },
  { name: "Okyanus Teal", hex: "#0d9488" },
  { name: "Amber / Bronz", hex: "#d97706" }
];

export function renderInstitutionView() {
  const state = store.getState();
  const inst = state.institution;

  return `
    <div class="view-container animate-fade-in">
      <!-- ÜST BAŞLIK -->
      <div class="view-header">
        <div>
          <h1 class="view-title">Kurum Ayarları & Marka Kimliği</h1>
          <p class="view-subtitle">Kurumunuzun adını, logosunu, iletişim bilgilerini ve panel/PDF raporlarında kullanılacak kurumsal tema rengini yapılandırın.</p>
        </div>
      </div>

      <div class="grid-2-col">
        <!-- SOL FORM ALANI -->
        <div class="card">
          <div class="card-header">
            <div class="card-title-group">
              <h2 class="card-title">Kurum Bilgileri</h2>
              <span class="card-subtitle">Bu bilgiler tüm PDF raporların üst antetinde yer alır</span>
            </div>
          </div>
          <div class="card-body">
            <form id="institution-form" onsubmit="window.app.saveInstitutionSettings(event)">
              <div class="form-group">
                <label class="form-label">Kurum / Okul Adı: *</label>
                <input type="text" id="inst-name" class="form-control" value="${inst.ad || ""}" required placeholder="Örn: Atabey Eğitim Kurumları" oninput="window.app.updateInstitutionLivePreview()" />
              </div>

              <div class="grid-2-col">
                <div class="form-group">
                  <label class="form-label">Kurum Kodu / MEB Kodu:</label>
                  <input type="text" id="inst-code" class="form-control" value="${inst.kurumKodu || ""}" placeholder="Örn: ATB-2026-94" oninput="window.app.updateInstitutionLivePreview()" />
                </div>
                <div class="form-group">
                  <label class="form-label">Telefon:</label>
                  <input type="text" id="inst-phone" class="form-control" value="${inst.telefon || ""}" placeholder="Örn: 0 (312) 444 0 999" oninput="window.app.updateInstitutionLivePreview()" />
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Adres:</label>
                <textarea id="inst-address" class="form-control" rows="2" placeholder="Kurumun açık adresi..." oninput="window.app.updateInstitutionLivePreview()">${inst.adres || ""}</textarea>
              </div>

              <div class="grid-2-col">
                <div class="form-group">
                  <label class="form-label">E-posta:</label>
                  <input type="email" id="inst-email" class="form-control" value="${inst.email || ""}" placeholder="iletisim@kurum.k12.tr" />
                </div>
                <div class="form-group">
                  <label class="form-label">Web Sitesi:</label>
                  <input type="text" id="inst-web" class="form-control" value="${inst.web || ""}" placeholder="www.kurum.k12.tr" />
                </div>
              </div>

              <!-- TEMA RENGİ SEÇİMİ -->
              <div class="form-group mt-4">
                <label class="form-label">Kurumsal Tema Rengi:</label>
                <div class="theme-palette-picker">
                  ${PRESET_PALETTES.map(
                    (p) => `
                    <button type="button" class="palette-swatch ${inst.temaRengi === p.hex ? "active" : ""}" style="background: ${p.hex};" title="${p.name}" onclick="window.app.selectThemeColor('${p.hex}')">
                      ${inst.temaRengi === p.hex ? "✓" : ""}
                    </button>
                  `
                  ).join("")}
                  <div class="custom-color-picker-wrap">
                    <input type="color" id="inst-custom-color" value="${inst.temaRengi || "#2563eb"}" onchange="window.app.selectThemeColor(this.value)" title="Özel Renk Seç" />
                    <span>Özel</span>
                  </div>
                </div>
                <input type="hidden" id="inst-theme-color" value="${inst.temaRengi || "#2563eb"}" />
              </div>

              <!-- LOGO YÜKLEME ALANI -->
              <div class="form-group mt-4">
                <label class="form-label">Kurum Logosu (PNG / JPEG / SVG):</label>
                <div class="logo-upload-zone" id="logo-drop-zone">
                  <input type="file" id="inst-logo-input" accept="image/*" style="display: none;" onchange="window.app.handleLogoFileSelected(this.files[0])" />
                  <div class="logo-zone-content" onclick="document.getElementById('inst-logo-input').click()">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <div class="font-bold mt-2">Bilgisayardan Logo Seç veya Sürükle</div>
                    <div class="text-muted" style="font-size: 12px;">PDF raporların antetinde görünecektir (Önerilen: Şeffaf PNG)</div>
                  </div>
                </div>
                ${
                  inst.logoUrl
                    ? `
                  <div class="logo-preview-box mt-3">
                    <img src="${inst.logoUrl}" alt="Kurum Logosu" class="logo-preview-img" />
                    <button type="button" class="btn btn-sm btn-ghost text-danger" onclick="window.app.removeLogo()">Logoyu Kaldır</button>
                  </div>
                `
                    : ""
                }
              </div>

              <div class="form-actions mt-4">
                <button type="submit" class="btn btn-primary btn-lg shadow-glow">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                  <span>Kurum Ayarlarını Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- SAĞ: CANLI ANTET VE PDF ÖNİZLEME KARTI -->
        <div>
          <div class="card mb-4">
            <div class="card-header">
              <div class="card-title-group">
                <h2 class="card-title">Canlı Rapor Antet Önizlemesi</h2>
                <span class="card-subtitle">Yaptığınız değişikliklerin PDF çıktısına yansıması</span>
              </div>
            </div>
            <div class="card-body">
              <div class="live-preview-box" id="live-header-preview">
                <div class="report-header p-3" style="border: 1px dashed var(--border-color); border-radius: 8px; background: #fff;">
                  <div class="report-header-left">
                    <div id="prev-logo-container">
                      ${
                        inst.logoUrl
                          ? `<img src="${inst.logoUrl}" class="report-header-logo-img" />`
                          : `<div class="report-header-logo-badge" style="background: ${inst.temaRengi || "#2563eb"};"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#fff" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10M6 10h10"/></svg></div>`
                      }
                    </div>
                    <div class="report-institution-info">
                      <h3 class="report-institution-title" id="prev-inst-name" style="font-size: 16px;">${inst.ad}</h3>
                      <div class="report-institution-meta" style="font-size: 11px;">
                        <span id="prev-inst-address">📍 ${inst.adres || "Adres bilgisi"}</span>
                        <span id="prev-inst-phone">📞 ${inst.telefon || "-"}</span>
                      </div>
                    </div>
                  </div>
                  <div class="report-header-right">
                    <div class="report-badge-title" id="prev-badge-title" style="background: ${inst.temaRengi || "#2563eb"}; font-size: 9px; padding: 4px 8px;">ÖĞRENCİ SINAV KARNESİ</div>
                    <div class="report-date-badge" style="font-size: 10px;">Rapor Tarihi: 27 Ağustos 2026</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- YEDEKLEME VE VERİ SIFIRLAMA KARTI -->
          <div class="card">
            <div class="card-header">
              <div class="card-title-group">
                <h2 class="card-title">Veri Yönetimi & Demo</h2>
                <span class="card-subtitle">Verileri sıfırlama veya örnek şablonu yeniden yükleme</span>
              </div>
            </div>
            <div class="card-body">
              <div class="d-flex flex-column gap-3">
                <button class="btn btn-outline" onclick="window.app.resetSampleDataConfirm()">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>
                  <span>Örnek Demo Verilerini Yeniden Yükle</span>
                </button>
                <button class="btn btn-outline text-danger" onclick="window.app.clearAllDataConfirm()">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  <span>Tüm Öğrenci ve Sınav Kayıtlarını Sıfırla</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
