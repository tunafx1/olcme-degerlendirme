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

    // Çoklu Sınav Karşılaştırma Analiz Metrikleri
    let comparisonKpisHtml = "";
    let crossSubjectMatrixHtml = "";
    const firstExam = exams[0] || {};
    const latestExam = exams[exams.length - 1] || {};

    if (isMulti) {
      const net1 = Number(firstExam.toplamNet) || 0;
      const net2 = Number(latestExam.toplamNet) || 0;
      const netDiff = net2 - net1;

      const p1 = Number(String(firstExam.puan || "").replace(",", ".")) || 0;
      const p2 = Number(String(latestExam.puan || "").replace(",", ".")) || 0;
      const puanDiff = p1 > 0 && p2 > 0 ? (p2 - p1).toFixed(2) : null;

      const recurringList = (report.eksikKonular || []).filter((ek) => ek.isRecurring || (ek.recurringExams && ek.recurringExams.length > 1) || (ek.konu && ek.konu.includes("🚨")));

      comparisonKpisHtml = `
        <div class="report-comparison-kpis mb-2" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 8px;">
          <div style="background: rgba(37, 99, 235, 0.06); border: 1.5px solid rgba(37, 99, 235, 0.25); border-radius: 6px; padding: 6px 8px; text-align: center;">
            <div style="font-size: 9.5px; color: #1e40af; font-weight: 700;">Toplam Net Değişimi</div>
            <div style="font-size: 13px; font-weight: 800; color: #1d4ed8; margin: 2px 0;">
              ${firstExam.toplamNet || "-"} ➔ ${latestExam.toplamNet || "-"} Net
            </div>
            <span class="badge ${netDiff >= 0 ? 'badge-success' : 'badge-danger'} font-bold" style="font-size: 8.5px; padding: 1px 5px;">
              ${netDiff >= 0 ? '📈 +' : '📉 '}${netDiff.toFixed(2)} Net Fark
            </span>
          </div>

          <div style="background: rgba(168, 85, 247, 0.06); border: 1.5px solid rgba(168, 85, 247, 0.25); border-radius: 6px; padding: 6px 8px; text-align: center;">
            <div style="font-size: 9.5px; color: #7e22ce; font-weight: 700;">LGS Puan Gelişimi</div>
            <div style="font-size: 13px; font-weight: 800; color: #9333ea; margin: 2px 0;">
              ${firstExam.puan || "-"} ➔ ${latestExam.puan || "-"}
            </div>
            <span class="badge ${puanDiff !== null && Number(puanDiff) >= 0 ? 'badge-success' : 'badge-primary'} font-bold" style="font-size: 8.5px; padding: 1px 5px;">
              ${puanDiff !== null ? (Number(puanDiff) >= 0 ? '🏆 +' + puanDiff : '📉 ' + puanDiff) + ' Puan' : 'LGS Puan Takibi'}
            </span>
          </div>

          <div style="background: #fef2f2; border: 1.5px solid #fca5a5; border-radius: 6px; padding: 6px 8px; text-align: center;">
            <div style="font-size: 9.5px; color: #991b1b; font-weight: 800;">🚨 Tekrarlayan Hatalar</div>
            <div style="font-size: 13px; font-weight: 800; color: #dc2626; margin: 2px 0;">
              ${recurringList.length} Kazanım
            </div>
            <span class="badge badge-danger font-bold" style="font-size: 8.5px; padding: 1px 5px; background: #ef4444; color: #fff;">
              2+ Sınavda Ortak Yanlış
            </span>
          </div>

          <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 6px; padding: 6px 8px; text-align: center;">
            <div style="font-size: 9.5px; color: #475569; font-weight: 700;">Karşılaştırılan Sınav</div>
            <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 2px 0;">
              ${exams.length} Deneme Sınavı
            </div>
            <span class="badge badge-secondary font-bold" style="font-size: 8.5px; padding: 1px 5px;">
              Kazanım Eşleştirmeli
            </span>
          </div>
        </div>
      `;

      const allSubjects = [];
      exams.forEach((ex) => {
        (ex.dersSonuclari || []).forEach((d) => {
          if (d.ders && !allSubjects.includes(d.ders)) allSubjects.push(d.ders);
        });
      });

      let bestSubj = null;
      let worstSubj = null;
      let maxDelta = -Infinity;
      let minDelta = Infinity;

      const subjectRowsData = allSubjects.map((subj) => {
        const nets = exams.map((ex) => {
          const match = (ex.dersSonuclari || []).find((d) => d.ders === subj);
          return match ? Number(match.net) || 0 : null;
        });
        const fNet = nets[0];
        const lNet = nets[nets.length - 1];
        const delta = (fNet !== null && lNet !== null) ? (lNet - fNet) : 0;
        
        if (delta > maxDelta) {
          maxDelta = delta;
          bestSubj = { subj, delta };
        }
        if (delta < minDelta) {
          minDelta = delta;
          worstSubj = { subj, delta };
        }
        return { subj, nets, delta };
      });

      crossSubjectMatrixHtml = `
        <div class="report-section mb-2">
          <div class="report-section-header" style="border-color: ${themeColor}; margin-bottom: 4px; padding-left: 6px;">
            <div class="d-flex justify-between items-center w-full">
              <h3 style="color: ${themeColor}; font-size: 11.5px; margin: 0;">📊 Sınavlar Arası Ders Netleri ve Gelişim Trendi</h3>
              <span class="badge badge-primary font-bold" style="font-size: 8.5px; padding: 2px 6px;">${exams.length} Sınav Karşılaştırma Matrisi</span>
            </div>
          </div>
          <table class="report-table" style="font-size: 10.5px; margin-bottom: 4px;">
            <thead>
              <tr style="background: ${themeColor}12; color: ${themeColor};">
                <th style="width: 24%; text-align: left;">Ders Adı</th>
                ${exams.map((e) => `<th style="text-align: center;">${escapeHtml(e.sinavAdi.length > 20 ? e.sinavAdi.substring(0, 18) + '...' : e.sinavAdi)}</th>`).join("")}
                <th style="text-align: center; width: 14%;">Net Değişimi</th>
                <th style="text-align: center; width: 15%;">Trend</th>
              </tr>
            </thead>
            <tbody>
              ${subjectRowsData.map(({ subj, nets, delta }) => {
                let trendBadge = "";
                if (delta > 0.2) {
                  trendBadge = `<span class="badge badge-success font-bold" style="font-size: 8.5px; padding: 1px 4px;">📈 +${delta.toFixed(2)} (Yükseliş)</span>`;
                } else if (delta < -0.2) {
                  trendBadge = `<span class="badge badge-danger font-bold" style="font-size: 8.5px; padding: 1px 4px;">📉 ${delta.toFixed(2)} (Düşüş)</span>`;
                } else {
                  trendBadge = `<span class="badge badge-secondary font-bold" style="font-size: 8.5px; padding: 1px 4px;">➡️ Dengeli</span>`;
                }

                return `
                  <tr>
                    <td style="font-weight: 700; color: #0f172a;">${subj}</td>
                    ${nets.map((n) => `<td style="text-align: center; font-weight: 600; color: #334155;">${n !== null ? n + ' Net' : '-'}</td>`).join("")}
                    <td style="text-align: center;">
                      <strong style="color: ${delta >= 0 ? '#059669' : '#dc2626'}; font-size: 11px;">
                        ${delta >= 0 ? '+' : ''}${delta.toFixed(2)}
                      </strong>
                    </td>
                    <td style="text-align: center;">${trendBadge}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
          <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px 8px; margin-top: 2px; font-size: 9.5px;">
            ${bestSubj && bestSubj.delta > 0 ? `<span>⭐ <strong>En Çok Gelişme Gösterilen Ders:</strong> ${bestSubj.subj} (<span style="color:#059669; font-weight:700;">+${bestSubj.delta.toFixed(2)} Net</span>)</span>` : `<span>⭐ <strong>Gelişim Durumu:</strong> Dersler Dengeli Takip Ediliyor</span>`}
            ${worstSubj && worstSubj.delta < 0 ? `<span>⚠️ <strong>En Çok Telafi Gerektiren Ders:</strong> ${worstSubj.subj} (<span style="color:#dc2626; font-weight:700;">${worstSubj.delta.toFixed(2)} Net</span>)</span>` : `<span>🎯 <strong>İstikrar:</strong> Ders Netleri Korunuyor</span>`}
          </div>
        </div>
      `;
    }

    // Sınav Sonuç Tablosu (Tek Sınav İçin)
    let examRows = "";
    if (!isMulti) {
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
    }

    // Eksik Konular HTML (Çoklu Sınavda Tekrarlayan ve Tekil Ayrımı)
    let eksikHtml = "";
    if (report.eksikKonular && report.eksikKonular.length > 0) {
      const recurringTopics = report.eksikKonular.filter((ek) => ek.isRecurring || (ek.recurringExams && ek.recurringExams.length > 1) || (ek.konu && ek.konu.includes("🚨")));
      const nonRecurringTopics = report.eksikKonular.filter((ek) => !recurringTopics.includes(ek));

      let recurringBlockHtml = "";
      if (isMulti) {
        if (recurringTopics.length > 0) {
          recurringBlockHtml = `
            <div class="report-section mb-2" style="background: #fff8f8; border: 1.5px solid #fca5a5; border-radius: 6px; padding: 7px 10px; margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #fecaca; padding-bottom: 4px; margin-bottom: 6px;">
                <div style="display: flex; align-items: center; gap: 6px;">
                  <span style="font-size: 15px;">🚨</span>
                  <div>
                    <h3 style="color: #991b1b; font-size: 11.5px; margin: 0; font-weight: 800;">
                      2+ Sınavda Tekrarlayan (Kronik) Yanlış Kazanımlar (${recurringTopics.length} Kazanım)
                    </h3>
                    <span style="font-size: 9px; color: #b91c1c;">
                      Bu kazanımlar öğrencinin birden fazla sınavda üst üste yanlış yaptığı acil telafi gerektiren kalıcı eksiklerdir!
                    </span>
                  </div>
                </div>
                <span class="badge badge-danger font-bold" style="font-size: 8.5px; padding: 2px 6px; background: #ef4444; color: #fff;">
                  Öncelikli Eylem Alanı
                </span>
              </div>

              <div class="report-recurring-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px;">
                ${recurringTopics.map((ek) => {
                  const examList = ek.recurringExams && ek.recurringExams.length > 0
                    ? ek.recurringExams
                    : exams.map((e) => e.sinavAdi);
                  const cleanKonu = (ek.konu || "").replace(/🚨/g, "").replace(/Tekrar Eden/g, "").trim();

                  return `
                    <div class="report-deficiency-item recurring-card" style="padding: 5px 8px; background: #ffffff; border: 1px solid #fca5a5; border-radius: 4px; box-shadow: 0 1px 2px rgba(220, 38, 38, 0.05);">
                      <div class="report-deficiency-header mb-1" style="display: flex; justify-content: space-between; align-items: center;">
                        <span class="report-deficiency-subject" style="font-size: 10.5px; font-weight: 800; color: #991b1b;">${ek.ders}</span>
                        <div class="d-flex gap-1 items-center">
                          <span class="badge badge-danger font-bold" style="font-size: 7.5px; padding: 1px 4px; background: #ef4444; color: #fff;">
                            🚨 Tekrarlayan Yanlış (${ek.recurringCount || examList.length} Sınav)
                          </span>
                          <span class="badge badge-danger font-bold" style="font-size: 7.5px; padding: 1px 4px;">Kritik</span>
                        </div>
                      </div>
                      <div class="report-deficiency-title" style="font-size: 10px; font-weight: 700; color: #1e293b; line-height: 1.25;">
                        ${cleanKonu}
                      </div>
                      <div class="recurring-exams-bar" style="margin-top: 3px; padding: 2px 5px; background: #fef2f2; border: 1px dashed #f87171; border-radius: 3px; font-size: 9px; color: #991b1b; display: flex; align-items: center; gap: 3px; flex-wrap: wrap;">
                        <strong>📌 Hata Yapılan Sınavlar:</strong>
                        ${examList.map((name) => `<span class="badge badge-danger font-bold" style="font-size: 8px; padding: 0 4px; background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;">${escapeHtml(name)}</span>`).join("")}
                      </div>
                      ${ek.oneri ? `<div class="report-deficiency-tip" style="font-size: 9px; color: #475569; background: #f8fafc; padding: 2px 5px; border-radius: 2px; border: 1px solid #e2e8f0; margin-top: 3px;">💡 <strong>Eylem Planı:</strong> ${escapeHtml(ek.oneri.replace(/🚨.*?:/g, "").trim())}</div>` : ""}
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          `;
        } else {
          recurringBlockHtml = `
            <div class="report-section mb-2" style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 6px; padding: 7px 10px; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">✅</span>
                <div>
                  <strong style="color: #166534; font-size: 11px;">Mükemmel: Tekrarlayan (Kronik) Eksik Bulunmamaktadır!</strong>
                  <div style="font-size: 9.5px; color: #15803d;">Seçilen ${exams.length} sınavın karşılaştırmalı analizinde öğrencinin peş peşe hata yaptığı kronik bir kazanım saptanmamıştır. Aşağıda tekil sınav eksiklerinin telafi programı listelenmiştir.</div>
                </div>
              </div>
            </div>
          `;
        }
      }

      let nonRecurringBlockHtml = "";
      if (nonRecurringTopics.length > 0) {
        nonRecurringBlockHtml = `
          <div class="report-section" style="margin-bottom: 8px;">
            <div class="report-section-header" style="border-color: ${themeColor};">
              <h3 style="color: ${themeColor}; font-size: 11.5px;">🎯 ${isMulti ? "Tek Sınavda Tespit Edilen Diğer Eksik Kazanımlar" : "Tespit Edilen Eksik Konu ve Kazanımlar"} (${nonRecurringTopics.length} Kazanım)</h3>
              <span class="report-section-sub">Öncelik sırasına göre telafi edilmesi gereken konu başlıkları</span>
            </div>
            <div class="report-deficiencies-grid">
              ${nonRecurringTopics
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
                      <div style="display: flex; gap: 4px; align-items: center;">
                        ${ek.recurringExams && ek.recurringExams.length > 0 ? `<span class="badge badge-light" style="font-size: 8px; padding: 0 4px; color: #64748b;">${escapeHtml(ek.recurringExams[0])}</span>` : ""}
                        <span class="badge ${badgeClass}">${badgeText}</span>
                      </div>
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

      eksikHtml = recurringBlockHtml + nonRecurringBlockHtml;
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
          <div class="report-trend-box mt-1" style="background: rgba(37, 99, 235, 0.04); border: 1.5px solid rgba(37, 99, 235, 0.2); border-radius: 4px; padding: 6px 10px;">
            <div class="report-trend-title" style="font-weight: 800; color: #1e40af; font-size: 11px;">📈 Gelişim Seyri ve Karşılaştırma Yorumu:</div>
            <div class="report-trend-text" style="font-size: 10px; line-height: 1.4; color: #334155;">${report.gelisimAnalizi.replace(/\n/g, '<br/>')}</div>
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
