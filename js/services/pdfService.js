/**
 * Kurumsal PDF Rapor Üretim ve Dışa Aktarma Servisi
 * jsPDF + html2canvas ve Doğrudan Yüksek Çözünürlüklü Baskı (Print) Desteği
 */

import { formatDate } from "../utils/helpers.js";

export class PDFService {
  /**
   * Rapor DOM elementini A4 PDF dosyası olarak indirir
   */
  static async exportToPDF(reportElementId, fileName = "Sinav_Analiz_Raporu.pdf") {
    const element = document.getElementById(reportElementId);
    if (!element) {
      throw new Error("Rapor şablonu bulunamadı.");
    }

    // jsPDF ve html2canvas kütüphanelerini kontrol et
    if (window.html2canvas && (window.jspdf || window.jsPDF)) {
      try {
        const { jsPDF } = window.jspdf || window;
        
        // Elementin klonunu geçici bir gizli kapsayıcıda stillendirerek render et
        const canvas = await window.html2canvas(element, {
          scale: 2, // Retina / Yüksek çözünürlük
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          windowWidth: 1200
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4"
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 5) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(fileName);
        return true;
      } catch (err) {
        console.warn("[PDF Service] jsPDF dönüştürme hatası, sistem print modalı açılıyor:", err);
      }
    }

    // Fallback: Tarayıcının yerel yüksek kaliteli PDF yazdırma motoru
    this.printReport(reportElementId);
    return true;
  }

  /**
   * Tarayıcı yerel yazdırma modalını açar
   */
  static printReport(reportElementId) {
    window.print();
  }

  /**
   * Rapor verisinden dinamik HTML şablonu üretir
   */
  static renderReportHTML(report, student, exams, institution) {
    const isMulti = exams.length > 1;
    const themeColor = institution.temaRengi || "#2563eb";

    // Logo HTML
    let logoHtml = "";
    if (institution.logoUrl) {
      logoHtml = `<img src="${institution.logoUrl}" alt="${institution.ad}" class="report-header-logo-img" />`;
    } else {
      logoHtml = `
        <div class="report-header-logo-badge" style="background: ${themeColor};">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#fff" stroke-width="2">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
            <path d="M6 6h10M6 10h10"/>
          </svg>
        </div>
      `;
    }

    // Sınav Sonuç Tablosu
    let examRows = "";
    exams.forEach((exam) => {
      examRows += `
        <div class="report-exam-card">
          <div class="report-exam-card-title">
            <span><strong>${exam.sinavAdi}</strong> (${formatDate(exam.tarih)})</span>
            <span class="badge badge-primary">Toplam Net: <strong>${exam.toplamNet || "-"}</strong></span>
          </div>
          <table class="report-table">
            <thead>
              <tr>
                <th>Ders</th>
                <th>Doğru</th>
                <th>Yanlış</th>
                <th>Boş</th>
                <th>Net</th>
                <th>Başarı %</th>
              </tr>
            </thead>
            <tbody>
              ${(exam.dersSonuclari || [])
                .map((d) => {
                  const total = Number(d.dogru) + Number(d.yanlis) + Number(d.bos);
                  const successRate = total > 0 ? Math.round((Number(d.dogru) / total) * 100) : 0;
                  return `
                  <tr>
                    <td><strong>${d.ders}</strong></td>
                    <td class="text-success">${d.dogru}</td>
                    <td class="text-danger">${d.yanlis}</td>
                    <td class="text-muted">${d.bos}</td>
                    <td><strong class="text-primary">${d.net}</strong></td>
                    <td>
                      <div class="report-progress-wrap">
                        <div class="report-progress-bar" style="width: ${successRate}%; background: ${themeColor}"></div>
                        <span class="report-progress-text">%${successRate}</span>
                      </div>
                    </td>
                  </tr>
                `;
                })
                .join("")}
            </tbody>
          </table>
        </div>
      `;
    });

    // Eksik Konular HTML
    let eksikHtml = "";
    if (report.eksikKonular && report.eksikKonular.length > 0) {
      eksikHtml = `
        <div class="report-section">
          <div class="report-section-header" style="border-color: ${themeColor};">
            <h3 style="color: ${themeColor};">🎯 Tespit Edilen Eksik Konu ve Kazanımlar</h3>
            <span class="report-section-sub">Öncelik sırasına göre telafi edilmesi gereken konu başlıkları</span>
          </div>
          <div class="report-deficiencies-grid">
            ${report.eksikKonular
              .map((ek) => {
                const badgeClass =
                  ek.seviye === "kritik"
                    ? "badge-danger"
                    : ek.seviye === "orta"
                    ? "badge-warning"
                    : "badge-info";
                const badgeText =
                  ek.seviye === "kritik" ? "Kritik Eksik" : ek.seviye === "orta" ? "Orta Düzey" : "Hafif Eksik";
                return `
                <div class="report-deficiency-item">
                  <div class="report-deficiency-header">
                    <span class="report-deficiency-subject">${ek.ders}</span>
                    <span class="badge ${badgeClass}">${badgeText}</span>
                  </div>
                  <div class="report-deficiency-title">${ek.konu}</div>
                  ${ek.oneri ? `<div class="report-deficiency-tip">💡 <strong>Çalışma Önerisi:</strong> ${ek.oneri}</div>` : ""}
                </div>
              `;
              })
              .join("")}
          </div>
        </div>
      `;
    }

    // AI Genel Değerlendirme Yorumu
    const yorumHtml = `
      <div class="report-section">
        <div class="report-section-header" style="border-color: ${themeColor};">
          <h3 style="color: ${themeColor};">📝 Pedagojik Değerlendirme & Rehberlik Yorumu</h3>
          <span class="report-section-sub">Yapay Zekâ Destekli Bireysel Performans Analizi</span>
        </div>
        <div class="report-comment-box">
          <div class="report-comment-quote-icon" style="color: ${themeColor};">“</div>
          <div class="report-comment-text">${report.genelYorum || "Değerlendirme yorumu mevcut değil."}</div>
        </div>
        ${
          report.gelisimAnalizi
            ? `
          <div class="report-trend-box">
            <div class="report-trend-title">📈 Sınavlar Arası Gelişim & Karşılaştırma Seyri:</div>
            <div class="report-trend-text">${report.gelisimAnalizi}</div>
          </div>
        `
            : ""
        }
      </div>
    `;

    // Haftalık Çalışma Programı Tablosu
    let programHtml = "";
    if (report.calismaProgrami && report.calismaProgrami.length > 0) {
      programHtml = `
        <div class="report-section page-break-inside-avoid">
          <div class="report-section-header" style="border-color: ${themeColor};">
            <h3 style="color: ${themeColor};">📅 Kişiselleştirilmiş Haftalık Ders Çalışma Programı</h3>
            <span class="report-section-sub">Eksik kazanımlara göre yapılandırılmış haftalık hedef planı</span>
          </div>
          <table class="report-table report-schedule-table">
            <thead>
              <tr style="background: ${themeColor}15; color: ${themeColor};">
                <th style="width: 14%;">Gün</th>
                <th style="width: 16%;">Saat Aralığı</th>
                <th style="width: 18%;">Ders</th>
                <th>Çalışılacak Konu / Etkinlik</th>
                <th style="width: 12%; text-align: center;">Hedef Soru</th>
              </tr>
            </thead>
            <tbody>
              ${report.calismaProgrami
                .map(
                  (item) => `
                <tr>
                  <td><strong>${item.gun}</strong></td>
                  <td class="text-muted"><span class="badge badge-light">${item.saat}</span></td>
                  <td><strong style="color: ${themeColor};">${item.ders}</strong></td>
                  <td>${item.konu}</td>
                  <td style="text-align: center;"><span class="badge badge-primary">${item.hedefSoru > 0 ? item.hedefSoru + " Soru" : "-"}</span></td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;
    }

    return `
      <div class="report-a4-sheet" id="printable-report-sheet">
        <!-- KURUMSAL ANTET / HEADER -->
        <div class="report-header">
          <div class="report-header-left">
            ${logoHtml}
            <div class="report-institution-info">
              <h1 class="report-institution-title">${institution.ad}</h1>
              <div class="report-institution-meta">
                <span>📍 ${institution.adres || "Adres Belirtilmedi"}</span>
                <span>📞 ${institution.telefon || "-"}</span>
                ${institution.kurumKodu ? `<span>🏢 Kod: ${institution.kurumKodu}</span>` : ""}
              </div>
            </div>
          </div>
          <div class="report-header-right">
            <div class="report-badge-title" style="background: ${themeColor};">ÖĞRENCİ SINAV KARNESİ & GELİŞİM RAPORU</div>
            <div class="report-date-badge">Rapor Tarihi: ${formatDate(report.olusturmaTarihi)}</div>
          </div>
        </div>

        <!-- ÖĞRENCİ KÜNYESİ -->
        <div class="report-student-card" style="border-top-color: ${themeColor};">
          <div class="student-meta-item">
            <span class="meta-label">Öğrenci Adı Soyadı:</span>
            <span class="meta-value"><strong>${student.adSoyad}</strong></span>
          </div>
          <div class="student-meta-item">
            <span class="meta-label">Sınıf / Şube:</span>
            <span class="meta-value">${student.sinif}. Sınıf (${student.sube})</span>
          </div>
          <div class="student-meta-item">
            <span class="meta-label">Öğrenci Numarası:</span>
            <span class="meta-value">${student.numara || "-"}</span>
          </div>
          <div class="student-meta-item">
            <span class="meta-label">İncelenen Sınav Sayısı:</span>
            <span class="meta-value"><span class="badge badge-primary">${exams.length} Sınav</span></span>
          </div>
        </div>

        <!-- BÖLÜM 1: SINAV SONUÇLARI -->
        <div class="report-section">
          <div class="report-section-header" style="border-color: ${themeColor};">
            <h3 style="color: ${themeColor};">📊 Sınav Net ve Başarı Dağılımı</h3>
            <span class="report-section-sub">Ders bazında doğru, yanlış, boş ve net istatistikleri</span>
          </div>
          <div class="report-exams-container">
            ${examRows}
          </div>
        </div>

        <!-- BÖLÜM 2: EKSİK KONU VE KAZANIMLAR -->
        ${eksikHtml}

        <!-- BÖLÜM 3: AI DEĞERLENDİRME & REHBERLİK YORUMU -->
        ${yorumHtml}

        <!-- BÖLÜM 4: HAFTALIK ÇALIŞMA PROGRAMI -->
        ${programHtml}

        <!-- RAPOR ALTBİLGİ / FOOTER -->
        <div class="report-footer">
          <div class="report-footer-left">
            <span>Bu rapor <strong>${institution.ad}</strong> Ölçme ve Değerlendirme Sistemi tarafından ${report.aiSaglayici || "AI Destekli"} olarak üretilmiştir.</span>
          </div>
          <div class="report-footer-right">
            <div class="report-signature-block">
              <span class="sig-title">Rehberlik / Ölçme Değerlendirme Servisi</span>
              <span class="sig-line">İmza / Mühür</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
