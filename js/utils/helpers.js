/**
 * Yardımcı Araçlar ve Fonksiyonlar
 */

export function generateId(prefix = "id") {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 7);
  return `${prefix}_${timestamp}_${randomStr}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  } catch (e) {
    return dateStr;
  }
}

export function calculateNet(dogru = 0, yanlis = 0, examType = "lgs") {
  const d = Number(dogru) || 0;
  const y = Number(yanlis) || 0;
  const penalty = examType === "yks" ? 4 : 3; // LGS'de 3 yanlış 1 doğru, YKS'de 4 yanlış 1 doğru
  const net = d - (y / penalty);
  return Math.max(0, Number(net.toFixed(2)));
}

/**
 * Kazanım metinlerini küçük/büyük harf, Türkçe karakter, noktalama ve MEB kod farkı gözetmeksizin normalize eder
 */
export function normalizeKazanimText(text) {
  if (!text) return "";
  let s = String(text).trim();
  // Başlangıçtaki soru numarası, şık veya MEB kodlarını temizle (örn: "1 -", "T.8.1.2.", "M.5.2.1.")
  s = s.replace(/^(?:(?:\d+|[A-ZÇĞİÖŞÜ])\s*[\.\-\)\:]\s*)+/i, "");
  s = s.replace(/^[A-ZÇĞİÖŞÜ]\.\d+(?:\.\d+)*[\.\-\:\s]*/i, "");
  // Türkçe karakter standardizasyonu (İ/i, I/ı)
  s = s.replace(/İ/g, "i").replace(/I/g, "ı").toLowerCase();
  // Karşılaştırma için Türkçe karakter katlama
  s = s.replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c").replace(/ı/g, "i");
  // Noktalama ve özel karakterleri boşlukla değiştir
  s = s.replace(/[\.\,\;\:\!\?\'\"\(\)\[\]\{\}\-\–\—\/\\\_]/g, " ");
  // Fazla boşlukları teke indir
  s = s.replace(/\s+/g, " ").trim();
  return s;
}

/**
 * İki kazanımın aynı veya eşdeğer kazanım olup olmadığını akıllı benzerlik (Jaccard + Kök Eşleşmesi) ile doğrular
 */
export function areKazanimlarEquivalent(textA, textB) {
  const normA = normalizeKazanimText(textA);
  const normB = normalizeKazanimText(textB);
  if (!normA || !normB) return false;
  if (normA === normB) return true;

  // Uzun metinlerde alt dize kapsama kontrolü
  if (normA.length >= 15 && normB.length >= 15) {
    if (normA.includes(normB) || normB.includes(normA)) return true;
  }

  // Anlamlı kelime kümesi benzerliği (Stopwords filtrelenmiş Jaccard)
  const stopWords = new Set(["ve", "ile", "veya", "de", "da", "icin", "bu", "bir", "cok", "en", "gibi", "gore", "ait", "ilgili", "yonelik", "eder", "yapar", "cozer", "belirler", "kavrar", "anlar", "kullanir", "yapabilme", "cozebilme"]);
  const tokensA = new Set(normA.split(" ").filter(w => w.length >= 3 && !stopWords.has(w)));
  const tokensB = new Set(normB.split(" ").filter(w => w.length >= 3 && !stopWords.has(w)));

  if (tokensA.size === 0 || tokensB.size === 0) {
    return normA === normB;
  }

  let intersection = 0;
  tokensA.forEach(t => {
    for (const tb of tokensB) {
      if (t === tb || (t.length >= 5 && tb.length >= 5 && (t.startsWith(tb.substring(0, Math.min(tb.length, 5))) || tb.startsWith(t.substring(0, Math.min(t.length, 5)))))) {
        intersection++;
        break;
      }
    }
  });

  const union = tokensA.size + tokensB.size - intersection;
  const jaccard = union > 0 ? intersection / union : 0;
  const dice = (tokensA.size + tokensB.size) > 0 ? (2 * intersection) / (tokensA.size + tokensB.size) : 0;

  return jaccard >= 0.50 || dice >= 0.60;
}

/**
 * Sınavın ders netlerinin doğrulanmış gerçek toplamını hesaplar
 */
export function getVerifiedExamTotalNet(exam) {
  if (exam && exam.dersSonuclari && Array.isArray(exam.dersSonuclari) && exam.dersSonuclari.length > 0) {
    const sum = exam.dersSonuclari.reduce((acc, d) => acc + (Number(d.net) || 0), 0);
    return Number(sum.toFixed(2));
  }
  return Number(Number(exam?.toplamNet || 0).toFixed(2));
}

export function showToast(message, type = "info", duration = 3500) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast-item toast-${type} animate-slide-in`;

  const icons = {
    success: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    warning: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info: `<svg class="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  };

  toast.innerHTML = `
    <div class="toast-icon-wrap">${icons[type] || icons.info}</div>
    <div class="toast-content">${escapeHtml(message)}</div>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast-fade-out");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

export function escapeHtml(str) {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function hexToRgb(hex) {
  if (!hex) return "37, 99, 235";
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  const num = parseInt(c, 16);
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}

export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
