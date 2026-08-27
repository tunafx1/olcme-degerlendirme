/**
 * Excel ve CSV Dosyası Ayrıştırma ve İçe Aktarma Modülü
 */

export function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("Dosya seçilmedi"));
      return;
    }

    const reader = new FileReader();

    if (file.name.endsWith(".csv")) {
      reader.onload = (e) => {
        try {
          const text = e.target.result;
          const rows = parseCSVText(text);
          resolve(rows);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error("CSV dosyası okunamadı"));
      reader.readAsText(file, "UTF-8");
    } else {
      // Excel XLSX/XLS formatı için SheetJS kontrolü
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          if (window.XLSX) {
            const workbook = window.XLSX.read(data, { type: "array" });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const json = window.XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            resolve(json);
          } else {
            // SheetJS henüz yüklenmediyse fallback CSV parser
            reject(new Error("Excel kütüphanesi yüklenemedi. Lütfen CSV formatında yükleyiniz."));
          }
        } catch (err) {
          reject(new Error("Excel dosyası ayrıştırılamadı: " + err.message));
        }
      };
      reader.onerror = () => reject(new Error("Dosya okunamadı"));
      reader.readAsArrayBuffer(file);
    }
  });
}

function parseCSVText(text) {
  const lines = text.split(/\r\n|\n/);
  const result = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    // Virgül veya noktalı virgül desteği
    const delimiter = line.includes(";") ? ";" : ",";
    const cols = line.split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ""));
    result.push(cols);
  }
  return result;
}

/**
 * Kazanım matrisi satırlarını yapılandırılmış dersSonuclari nesnesine çevirir
 * Beklenen Sütunlar: Ders | Konu / Kazanım | Durum (D / Y / B / Doğru / Yanlış / Boş)
 */
export function processGainRows(rows) {
  if (!rows || rows.length < 2) {
    throw new Error("Dosyada yeterli veri satırı bulunamadı.");
  }

  // İlk satır başlık mı kontrol et
  const header = rows[0].map(h => String(h).toLowerCase().trim());
  let startIndex = 0;
  if (header.some(h => h.includes("ders") || h.includes("kazanım") || h.includes("konu") || h.includes("durum"))) {
    startIndex = 1;
  }

  const dersMap = {};

  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 2) continue;

    const dersAdi = String(row[0] || "Genel").trim();
    const kazanimAdi = String(row[1] || `Kazanım ${i}`).trim();
    let durumRaw = String(row[2] || "dogru").toLowerCase().trim();

    let durum = "dogru";
    if (durumRaw.startsWith("y") || durumRaw === "0" || durumRaw.includes("yanlış") || durumRaw.includes("yanlis")) {
      durum = "yanlis";
    } else if (durumRaw.startsWith("b") || durumRaw === "-" || durumRaw.includes("boş") || durumRaw.includes("bos")) {
      durum = "bos";
    }

    if (!dersMap[dersAdi]) {
      dersMap[dersAdi] = {
        ders: dersAdi,
        dogru: 0,
        yanlis: 0,
        bos: 0,
        net: 0,
        konular: []
      };
    }

    dersMap[dersAdi].konular.push({ kazanimAdi, durum });
    if (durum === "dogru") dersMap[dersAdi].dogru++;
    else if (durum === "yanlis") dersMap[dersAdi].yanlis++;
    else dersMap[dersAdi].bos++;
  }

  // Netleri hesapla
  return Object.values(dersMap).map(d => {
    d.net = Math.max(0, Number((d.dogru - (d.yanlis / 3)).toFixed(2)));
    return d;
  });
}
