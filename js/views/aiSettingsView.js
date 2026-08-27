/**
 * Yapay Zekâ Sağlayıcı ve API Yapılandırma Görünümü
 */

import { store } from "../state.js";
import { APP_CONFIG } from "../config.js";

export function renderAiSettingsView() {
  const state = store.getState();
  const ai = state.aiConfig;
  const providers = APP_CONFIG.aiProviders;

  return `
    <div class="view-container animate-fade-in">
      <!-- ÜST BAŞLIK -->
      <div class="view-header">
        <div>
          <h1 class="view-title">Yapay Zekâ Sağlayıcı Ayarları</h1>
          <p class="view-subtitle">Öğrenci sınav sonuçlarını analiz etmek için kullanılacak yapay zekâ modelini seçin ve API anahtarınızı yapılandırın.</p>
        </div>
      </div>

      <!-- GÜVENLİK VE BİLGİLENDİRME KARTI -->
      <div class="alert alert-info mb-4">
        <div class="alert-icon">🔒</div>
        <div class="alert-text">
          <strong>Güvenlik Notu:</strong> API anahtarlarınız yalnızca tarayıcınızın yerel güvenli depolama alanında (veya yapılandırılmışsa özel `.env` / Firebase Firestore üzerinde) tutulur, hiçbir üçüncü şahıs sunucuya aktarılmaz. Henüz anahtarınız yoksa sistemin yerleşik <strong>Akıllı Pedagojik Motoru</strong> otomatik olarak devreye girer.
        </div>
      </div>

      <!-- SAĞLAYICI SEÇİM KARTLARI -->
      <div class="provider-selection-grid mb-4">
        ${providers
          .map((p) => {
            const isSelected = (ai.provider || "gemini") === p.id;
            return `
            <div class="provider-card ${isSelected ? "selected" : ""}" onclick="window.app.selectAiProvider('${p.id}')">
              <div class="provider-card-header">
                <span class="provider-name">${p.name}</span>
                <span class="badge ${isSelected ? "badge-primary" : "badge-light"}">${p.badge}</span>
              </div>
              <div class="provider-models">
                ${p.models.map((m) => `<div class="provider-model-item">• ${m.name}</div>`).join("")}
              </div>
              <div class="provider-radio">
                <input type="radio" name="ai-provider" value="${p.id}" ${isSelected ? "checked" : ""} />
                <span>${isSelected ? "Aktif Sağlayıcı" : "Seç"}</span>
              </div>
            </div>
          `;
          })
          .join("")}
      </div>

      <!-- API ANAHTARI VE MODEL DETAY FORMU -->
      <div class="card">
        <div class="card-header">
          <div class="card-title-group">
            <h2 class="card-title">Model ve API Parametreleri</h2>
            <span class="card-subtitle">Seçili yapay zekâ servisine ait bağlantı detayları</span>
          </div>
        </div>
        <div class="card-body">
          <form id="ai-config-form" onsubmit="window.app.saveAiSettings(event)">
            <!-- GEMINI ALANLARI -->
            <div id="fields-gemini" class="provider-fields ${ai.provider === "gemini" ? "active" : ""}">
              <div class="form-group">
                <label class="form-label">Google Gemini Model:</label>
                <select id="gemini-model" class="form-control">
                  <option value="gemini-1.5-flash" ${ai.geminiModel === "gemini-1.5-flash" ? "selected" : ""}>Gemini 1.5 Flash (Önerilen - Hızlı & Güçlü)</option>
                  <option value="gemini-1.5-pro" ${ai.geminiModel === "gemini-1.5-pro" ? "selected" : ""}>Gemini 1.5 Pro (Geniş Bağlam & Derin Analiz)</option>
                  <option value="gemini-2.0-flash-exp" ${ai.geminiModel === "gemini-2.0-flash-exp" ? "selected" : ""}>Gemini 2.0 Flash Experimental</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Google AI Studio API Anahtarı:</label>
                <div class="input-with-action">
                  <input type="password" id="gemini-api-key" class="form-control" value="${ai.geminiApiKey || ""}" placeholder="AIzaSy..." />
                  <button type="button" class="btn btn-outline btn-sm" onclick="window.app.togglePasswordVisibility('gemini-api-key')">Göster/Gizle</button>
                </div>
                <div class="form-hint">
                  API anahtarınızı ücretsiz almak için <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">Google AI Studio</a> adresini ziyaret edebilirsiniz.
                </div>
              </div>
            </div>

            <!-- OPENAI ALANLARI -->
            <div id="fields-openai" class="provider-fields ${ai.provider === "openai" ? "active" : ""}">
              <div class="form-group">
                <label class="form-label">OpenAI Model:</label>
                <select id="openai-model" class="form-control">
                  <option value="gpt-4o-mini" ${ai.openaiModel === "gpt-4o-mini" ? "selected" : ""}>GPT-4o Mini (Hızlı & Ekonomik)</option>
                  <option value="gpt-4o" ${ai.openaiModel === "gpt-4o" ? "selected" : ""}>GPT-4o (Amiral Gemisi Model)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">OpenAI API Anahtarı:</label>
                <div class="input-with-action">
                  <input type="password" id="openai-api-key" class="form-control" value="${ai.openaiApiKey || ""}" placeholder="sk-proj-..." />
                  <button type="button" class="btn btn-outline btn-sm" onclick="window.app.togglePasswordVisibility('openai-api-key')">Göster/Gizle</button>
                </div>
                <div class="form-hint">
                  API anahtarınızı <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener">OpenAI Platform</a> üzerinden alabilirsiniz.
                </div>
              </div>
            </div>

            <!-- CLAUDE ALANLARI -->
            <div id="fields-claude" class="provider-fields ${ai.provider === "claude" ? "active" : ""}">
              <div class="form-group">
                <label class="form-label">Anthropic Claude Model:</label>
                <select id="claude-model" class="form-control">
                  <option value="claude-3-5-sonnet-20241022" ${ai.claudeModel === "claude-3-5-sonnet-20241022" ? "selected" : ""}>Claude 3.5 Sonnet (Yüksek Mantıksal Başarı)</option>
                  <option value="claude-3-5-haiku-20241022" ${ai.claudeModel === "claude-3-5-haiku-20241022" ? "selected" : ""}>Claude 3.5 Haiku</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Anthropic API Anahtarı:</label>
                <div class="input-with-action">
                  <input type="password" id="claude-api-key" class="form-control" value="${ai.claudeApiKey || ""}" placeholder="sk-ant-..." />
                  <button type="button" class="btn btn-outline btn-sm" onclick="window.app.togglePasswordVisibility('claude-api-key')">Göster/Gizle</button>
                </div>
                <div class="form-hint">
                  API anahtarınızı <a href="https://console.anthropic.com/" target="_blank" rel="noopener">Anthropic Console</a> üzerinden alabilirsiniz.
                </div>
              </div>
            </div>

            <!-- ORTAK SICAKLIK / TEMPERATURE AYARI -->
            <div class="form-group mt-4">
              <label class="form-label d-flex justify-between">
                <span>Yaratıcılık / Sıcaklık Katsayısı (Temperature):</span>
                <span id="temp-value-display" class="font-bold">${ai.temperature || 0.7}</span>
              </label>
              <input type="range" id="ai-temperature" min="0" max="1" step="0.1" value="${ai.temperature || 0.7}" class="range-slider" oninput="document.getElementById('temp-value-display').innerText = this.value" />
              <div class="d-flex justify-between text-muted" style="font-size: 11px;">
                <span>0.0 (Tamamen Tutarlı & Deterministik)</span>
                <span>1.0 (Daha Yaratıcı & Zengin Rehberlik)</span>
              </div>
            </div>

            <div class="form-actions mt-4 d-flex justify-between items-center">
              <button type="button" class="btn btn-outline" onclick="window.app.testAiConnection()">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                <span>Bağlantıyı Test Et</span>
              </button>
              <button type="submit" class="btn btn-primary btn-lg shadow-glow">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
                <span>AI Ayarlarını Kaydet</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}
