import { formatDate, escapeHtml, getVerifiedExamTotalNet, areKazanimlarEquivalent } from "../utils/helpers.js";

export class PDFService {
  /**
   * DOM-ölçümlü dinamik PDF sayfalama motoru.
   * Her .report-a4-page bloğunun gerçek yüksekliğini ölçerek N sayfa üretir.
   *
   * @param {HTMLElement} containerEl     - Offscreen render edilmiş kapsayıcı
   * @param {number}      maxPageHeightPx - Kullanılabilir A4 yüksekliği (px, 794px genişlik üzerinden)
   * @returns {HTMLElement[]}
   */
  static paginateContent(containerEl, maxPageHeightPx = 1090) {
    const makePageWrapper = () => {
      const w = document.createElement("div");
      w.style.width = "794px";
      w.style.minHeight = `${maxPageHeightPx}px`;
      w.style.maxHeight = `${maxPageHeightPx}px`;
      w.style.background = "#ffffff";
      w.style.overflow = "hidden";
      w.style.position = "relative";
      w.style.boxSizing = "border-box";
      w.style.padding = "0";
      return w;
    };

    const topPages = Array.from(containerEl.querySelectorAll(".report-a4-page"));
    if (topPages.length === 0) return [containerEl];

    const resultPages = [];

    topPages.forEach((pageEl) => {
      const children = Array.from(pageEl.children);
      const footerEl = pageEl.querySelector(".report-page-footer-mini");
      const footerHeight = footerEl ? footerEl.offsetHeight + 16 : 30;
      const usableHeight = maxPageHeightPx - footerHeight;

      let currentPage = makePageWrapper();
      let currentPageInner = document.createElement("div");
      currentPageInner.style.width = "100%";
      currentPageInner.style.boxSizing = "border-box";
      currentPageInner.style.padding = "18px 24px 0 24px";
      currentPage.appendChild(currentPageInner);
      let currentFill = 18;

      children.forEach((child) => {
        if (child === footerEl) return;

        const elHeight = child.scrollHeight || child.offsetHeight || 0;

        if (currentFill + elHeight > usableHeight && currentFill > 18) {
          if (footerEl) {
            const fc = footerEl.cloneNode(true);
            fc.style.marginTop = "auto";
            fc.style.paddingLeft = "24px";
            fc.style.paddingRight = "24px";
            fc.style.paddingBottom = "10px";
            currentPage.appendChild(fc);
          }
          resultPages.push(currentPage);

          currentPage = makePageWrapper();
          currentPageInner = document.createElement("div");
          currentPageInner.style.width = "100%";
          currentPageInner.style.boxSizing = "border-box";
          currentPageInner.style.padding = "18px 24px 0 24px";
          currentPage.appendChild(currentPageInner);
          currentFill = 18;
        }

        currentPageInner.appendChild(child.cloneNode(true));
        currentFill += elHeight;
      });

      if (footerEl) {
        const fc = footerEl.cloneNode(true);
        fc.style.marginTop = "auto";
        fc.style.paddingLeft = "24px";
        fc.style.paddingRight = "24px";
        fc.style.paddingBottom = "10px";
        currentPage.appendChild(fc);
      }
      resultPages.push(currentPage);
    });

    return resultPages;
  }

  /**
   * Rapor DOM elementini dinamik sayfalama ile A4 PDF dosyası olarak indirir.
   */
  static async exportToPDF(reportElementId, fileName = "Sinav_Analiz_Raporu.pdf") {
    const element = document.getElementById(reportElementId);
    if (!element) {
      throw new Error("Rapor şablonu bulunamadı.");
    }

    if (!window.html2canvas || !(window.jspdf || window.jsPDF)) {
      this.printReport(reportElementId);
      return true;
    }

    try {
      const { jsPDF } = window.jspdf || window;

      const offscreen = document.createElement("div");
      offscreen.style.position = "fixed";
      offscreen.style.left = "-9999px";
      offscreen.style.top = "0";
      offscreen.style.width = "794px";
      offscreen.style.background = "#ffffff";
      offscreen.style.zIndex = "-9999";
      offscreen.innerHTML = element.outerHTML;
      document.body.appendChild(offscreen);

      // DOM layout hesaplaması için tarayıcıya zaman ver
      await new Promise((r) => setTimeout(r, 120));

      const pages = PDFService.paginateContent(offscreen, 1090);

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      for (let i = 0; i < pages.length; i++) {
        const pageEl = pages[i];

        if (pageEl.parentNode !== offscreen) {
          offscreen.appendChild(pageEl);
          await new Promise((r) => setTimeout(r, 40));
        }

        pageEl.style.width = "794px";
        pageEl.style.maxWidth = "794px";
        pageEl.style.boxShadow = "none";
        pageEl.style.borderRadius = "0";
        pageEl.style.margin = "0";

        const canvas = await window.html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
          scrollY: 0,
          scrollX: 0,
          height: 1090
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
      }

      document.body.removeChild(offscreen);
      pdf.save(fileName);
      return true;
    } catch (err) {
      console.warn("[PDF Service] jsPDF dönüştürme hatası, sistem print modalı açılıyor:", err);
      this.printReport(reportElementId);
      return true;
    }
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
    const themeColor = institution.temaRengi || "#2563eb";
    const logoSrc = window.DEFAULT_LOGO_DATA_URI || institution.logoUrl || "./logo.png";

    let logoHtml = `<img src="${logoSrc}" alt="${institution.ad}" class="report-header-logo-img" style="max-height: 52px; max-width: 130px; object-fit: contain;" />`;
    let logoHtmlMini = `<img src="${logoSrc}" alt="${institution.ad}" style="max-height: 32px; max-width: 80px; object-fit: contain;" />`;

    // Sınavları her zaman kronolojik sıraya göre düzenle
    const sortedExams = [...(exams || [])].sort((a, b) => {
      const tA = new Date(a.tarih || 0).getTime() || 0;
      const tB = new Date(b.tarih || 0).getTime() || 0;
      return tA - tB;
    });

    const isMulti = sortedExams.length > 1;
    const firstExam = sortedExams[0] || {};
    const latestExam = sortedExams[sortedExams.length - 1] || {};

    let comparisonKpisHtml = "";
    let crossSubjectMatrixHtml = "";
    let pageTitle = isMulti
      ? `ÇOKLU SINAV GELİŞİM & KARŞILAŞTIRMA RAPORU`
      : `ÖĞRENCİ SINAV KARNESİ`;

    if (isMulti) {
      // 1. Doğrulanmış Gerçek Toplam Netler
      const net1 = getVerifiedExamTotalNet(firstExam);
      const net2 = getVerifiedExamTotalNet(latestExam);
      const netDiff = Number((net2 - net1).toFixed(2));

      // 2. Puan / Sıralama Doğrulaması
      const p1Raw = String(firstExam.puan || "").replace(",", ".").trim();
      const p2Raw = String(latestExam.puan || "").replace(",", ".").trim();
      const p1 = parseFloat(p1Raw);
      const p2 = parseFloat(p2Raw);
      const hasValidScores = !isNaN(p1) && !isNaN(p2) && p1 > 0 && p2 > 0;
      const puanDiff = hasValidScores ? Number((p2 - p1).toFixed(2)) : null;
      const isLgsScale = hasValidScores && p1 >= 100 && p1 <= 500 && p2 >= 100 && p2 <= 500;

      // 3. Tekrarlayan Kazanım Grubu
      const topicGroups = [];
      sortedExams.forEach((exam, examIdx) => {
        (exam.dersSonuclari || []).forEach((d) => {
          const dersName = (d.ders || "Genel").trim();
          (d.konular || []).forEach((k) => {
            const yuzde = k.basariYuzdesi !== undefined ? Number(k.basariYuzdesi) : (k.soruSayisi > 0 ? Number(((k.dogru / k.soruSayisi) * 100).toFixed(0)) : 0);
            const isDeficient = k.durum === "yanlis" || k.durum === "bos" || k.yanlis > 0 || k.bos > 0 || yuzde < 100 || (k.soruSayisi > 0 && k.dogru < k.soruSayisi);
            if (isDeficient && k.kazanimAdi && k.kazanimAdi.trim().length > 2) {
              const rawTopic = k.kazanimAdi.trim();
              let matchGroup = topicGroups.find(g => 
                g.ders.toLowerCase() === dersName.toLowerCase() && areKazanimlarEquivalent(g.kazanimAdi, rawTopic)
              );

              if (!matchGroup) {
                matchGroup = {
                  ders: dersName,
                  kazanimAdi: rawTopic,
                  examIndices: new Set(),
                  examNames: [],
                  totalWrong: 0,
                  totalBos: 0
                };
                topicGroups.push(matchGroup);
              }

              matchGroup.examIndices.add(examIdx);
              if (!matchGroup.examNames.includes(exam.sinavAdi)) {
                matchGroup.examNames.push(exam.sinavAdi);
              }
              matchGroup.totalWrong += Number(k.yanlis) || 1;
              matchGroup.totalBos += Number(k.bos) || 0;
            }
          });
        });
      });

      const calculatedRecurring = topicGroups.filter(g => g.examIndices.size >= 2);
      const reportRecurring = (report.eksikKonular || []).filter((ek) => ek.isRecurring || (ek.recurringExams && ek.recurringExams.length > 1) || (ek.konu && ek.konu.includes("🚨")));
      const effectiveRecurringCount = Math.max(calculatedRecurring.length, reportRecurring.length);

      comparisonKpisHtml = `
        <div class="report-comparison-kpis mb-2" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;">
          <div style="background: rgba(37, 99, 235, 0.06); border: 1.5px solid rgba(37, 99, 235, 0.25); border-radius: 6px; padding: 6px 8px; text-align: center;">
            <div style="font-size: 9.5px; color: #1e40af; font-weight: 700;">Toplam Net Değişimi</div>
            <div style="font-size: 13px; font-weight: 800; color: #1d4ed8; margin: 2px 0;">
              ${net1} ➔ ${net2} Net
            </div>
            <span class="badge ${netDiff > 0 ? 'badge-success' : netDiff < 0 ? 'badge-danger' : 'badge-secondary'} font-bold" style="font-size: 8.5px; padding: 1px 5px;">
              ${netDiff > 0 ? '📈 +' + netDiff : netDiff < 0 ? '📉 ' + netDiff : '➡️ 0.00'} Net Fark (${netDiff > 0 ? 'Artış' : netDiff < 0 ? 'Düşüş' : 'Dengeli'})
            </span>
          </div>

          <div style="background: rgba(168, 85, 247, 0.06); border: 1.5px solid rgba(168, 85, 247, 0.25); border-radius: 6px; padding: 6px 8px; text-align: center;">
            <div style="font-size: 9.5px; color: #7e22ce; font-weight: 700;">${isLgsScale ? "LGS Puan Gelişimi" : "Sınav Puanı"}</div>
            <div style="font-size: 13px; font-weight: 800; color: #9333ea; margin: 2px 0;">
              ${firstExam.puan && firstExam.puan !== 'Okunamadı' ? firstExam.puan : '-'} ➔ ${latestExam.puan && latestExam.puan !== 'Okunamadı' ? latestExam.puan : '-'}
            </div>
            <span class="badge ${puanDiff !== null ? (puanDiff > 0 ? 'badge-success' : puanDiff < 0 ? 'badge-danger' : 'badge-secondary') : 'badge-light'} font-bold" style="font-size: 8.5px; padding: 1px 5px;">
              ${puanDiff !== null ? (puanDiff > 0 ? '📈 +' + puanDiff + ' Puan (Artış)' : puanDiff < 0 ? '📉 ' + puanDiff + ' Puan (Düşüş)' : '➡️ 0.00 Puan') : 'Puan Takibi'}
            </span>
          </div>

          <div style="background: ${effectiveRecurringCount > 0 ? '#fef2f2' : '#f0fdf4'}; border: 1.5px solid ${effectiveRecurringCount > 0 ? '#fca5a5' : '#86efac'}; border-radius: 6px; padding: 6px 8px; text-align: center;">
            <div style="font-size: 9.5px; color: ${effectiveRecurringCount > 0 ? '#991b1b' : '#166534'}; font-weight: 800;">
              ${effectiveRecurringCount > 0 ? "🚨 Tekrarlayan Hatalar" : "✅ Tekrarlayan Hatalar"}
            </div>
            <div style="font-size: 13px; font-weight: 800; color: ${effectiveRecurringCount > 0 ? '#dc2626' : '#15803d'}; margin: 2px 0;">
              ${effectiveRecurringCount} Kazanım
            </div>
            <span class="badge ${effectiveRecurringCount > 0 ? 'badge-danger' : 'badge-success'} font-bold" style="font-size: 8.5px; padding: 1px 5px;">
              ${effectiveRecurringCount > 0 ? '2+ Sınavda Ortak Yanlış' : 'Kronik Eksik Yok'}
            </span>
          </div>

          <div style="background: #f8fafc; border: 1.5px solid #cbd5e1; border-radius: 6px; padding: 6px 8px; text-align: center;">
            <div style="font-size: 9.5px; color: #475569; font-weight: 700;">Karşılaştırılan Sınav</div>
            <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin: 2px 0;">
              ${sortedExams.length} Deneme Sınavı
            </div>
            <span class="badge badge-secondary font-bold" style="font-size: 8.5px; padding: 1px 5px;">
              Kazanım Eşleştirmeli
            </span>
          </div>
        </div>
      `;

      const allSubjects = [];
      sortedExams.forEach((ex) => {
        (ex.dersSonuclari || []).forEach((d) => {
          if (d.ders && !allSubjects.includes(d.ders)) allSubjects.push(d.ders);
        });
      });

      let bestSubj = null;
      let worstSubj = null;
      let maxDelta = -Infinity;
      let minDelta = Infinity;

      const subjectRowsData = allSubjects.map((subj) => {
        const nets = sortedExams.map((ex) => {
          const match = (ex.dersSonuclari || []).find((d) => d.ders === subj);
          return match ? Number(match.net) || 0 : null;
        });
        const fNet = nets[0];
        const lNet = nets[nets.length - 1];
        const delta = (fNet !== null && lNet !== null) ? Number((lNet - fNet).toFixed(2)) : 0;
        
        if (delta > maxDelta) {
          maxDelta = delta;
          bestSubj = { subj, delta };
        }
        if (delta < minDelta) {
          minDelta = delta;
          worstSubj = { subj, delta };
        }
        return { subj, nets, delta, fNet, lNet };
      });

      const posDeltas = subjectRowsData.filter(r => r.delta > 0.2);
      const negDeltas = subjectRowsData.filter(r => r.delta < -0.2);

      let dynamicStatusBadge = "";
      if (negDeltas.length > 0 && posDeltas.length === 0) {
        dynamicStatusBadge = `<span style="color: #dc2626; font-weight: 700;">📉 Tüm derslerde net düşüşü saptandı. Eksik kazanımların acil telafisi planlanmalıdır.</span>`;
      } else if (posDeltas.length > 0 && negDeltas.length === 0) {
        dynamicStatusBadge = `<span style="color: #059669; font-weight: 700;">📈 Tüm derslerde başarı artışı kaydedildi. Mevcut ivme korunmalıdır.</span>`;
      } else if (posDeltas.length > negDeltas.length) {
        dynamicStatusBadge = `<span>📈 <strong>Gelişim Durumu:</strong> ${posDeltas.length} derste artış, ${negDeltas.length} derste düşüş kaydedildi.</span>`;
      } else if (negDeltas.length > posDeltas.length) {
        dynamicStatusBadge = `<span>📉 <strong>Gelişim Durumu:</strong> ${negDeltas.length} derste net kaybı görüldü. Düşüş yaşanan derslere odaklanılmalıdır.</span>`;
      } else {
        dynamicStatusBadge = `<span>➡️ <strong>Gelişim Durumu:</strong> Ders netleri benzer seviyede dengeli seyretmektedir.</span>`;
      }

      crossSubjectMatrixHtml = `
        <div class="report-section mb-2">
          <div class="report-section-header" style="border-color: ${themeColor}; margin-bottom: 4px; padding-left: 6px;">
            <div class="d-flex justify-between items-center w-full">
              <h3 style="color: ${themeColor}; font-size: 11.5px; margin: 0;">📊 Sınavlar Arası Ders Netleri ve Gelişim Trendi</h3>
              <span class="badge badge-primary font-bold" style="font-size: 8.5px; padding: 2px 6px;">${sortedExams.length} Sınav Karşılaştırma Matrisi</span>
            </div>
          </div>
          <table class="report-table" style="font-size: 10px; margin-bottom: 4px;">
            <thead>
              <tr style="background: ${themeColor}12; color: ${themeColor};">
                <th style="width: 22%; text-align: left; vertical-align: middle;">Ders Adı</th>
                ${sortedExams.map((e) => `
                  <th style="text-align: center; vertical-align: bottom; padding: 4px 3px; min-width: 85px;">
                    <div style="font-weight: 800; font-size: 9.5px; color: #0f172a; line-height: 1.2; word-break: break-word;">
                      ${escapeHtml(e.sinavAdi)}
                    </div>
                    <div style="font-size: 8px; font-weight: 600; color: #64748b; margin-top: 1px;">
                      📅 ${formatDate(e.tarih)}
                    </div>
                    <div style="margin-top: 1px;">
                      <span class="badge badge-light" style="font-size: 7.5px; padding: 0 3px; border: 1px solid #cbd5e1;">Top: <strong>${getVerifiedExamTotalNet(e)} Net</strong></span>
                    </div>
                  </th>
                `).join("")}
                <th style="text-align: center; width: 13%; vertical-align: middle;">Net Değişimi</th>
                <th style="text-align: center; width: 15%; vertical-align: middle;">Trend</th>
              </tr>
            </thead>
            <tbody>
              ${subjectRowsData.map(({ subj, nets, delta, fNet, lNet }) => {
                let trendBadge = "";
                if (fNet === null && lNet !== null) {
                  trendBadge = `<span class="badge badge-info font-bold" style="font-size: 8px; padding: 1px 4px;">🆕 Yeni Ders</span>`;
                } else if (fNet !== null && lNet === null) {
                  trendBadge = `<span class="badge badge-secondary font-bold" style="font-size: 8px; padding: 1px 4px;">⏸️ Denenmedi</span>`;
                } else if (delta > 0.2) {
                  trendBadge = `<span class="badge badge-success font-bold" style="font-size: 8px; padding: 1px 4px;">📈 +${delta.toFixed(2)} (Yükseliş)</span>`;
                } else if (delta < -0.2) {
                  trendBadge = `<span class="badge badge-danger font-bold" style="font-size: 8px; padding: 1px 4px;">📉 ${delta.toFixed(2)} (Düşüş)</span>`;
                } else {
                  trendBadge = `<span class="badge badge-secondary font-bold" style="font-size: 8px; padding: 1px 4px;">➡️ ${delta >= 0 ? '+' : ''}${delta.toFixed(2)} (Dengeli)</span>`;
                }

                return `
                  <tr>
                    <td style="font-weight: 700; color: #0f172a;">${subj}</td>
                    ${nets.map((n) => `<td style="text-align: center; font-weight: 600; color: #334155;">${n !== null ? n + ' Net' : '-'}</td>`).join("")}
                    <td style="text-align: center;">
                      <strong style="color: ${delta > 0 ? '#059669' : delta < 0 ? '#dc2626' : '#475569'}; font-size: 10.5px;">
                        ${delta > 0 ? '+' : ''}${delta.toFixed(2)}
                      </strong>
                    </td>
                    <td style="text-align: center;">${trendBadge}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
            <tfoot>
              <tr style="background: #f1f5f9; font-weight: 800; border-top: 2px solid #cbd5e1;">
                <td style="color: #1e293b; font-size: 9.5px;">🏆 GENEL TOPLAM NET:</td>
                ${sortedExams.map((e) => `<td style="text-align: center; color: #1d4ed8; font-size: 10px;">${getVerifiedExamTotalNet(e)} Net</td>`).join("")}
                <td style="text-align: center; color: ${netDiff > 0 ? '#059669' : netDiff < 0 ? '#dc2626' : '#475569'}; font-size: 10.5px;">
                  ${netDiff > 0 ? '+' : ''}${netDiff.toFixed(2)}
                </td>
                <td style="text-align: center;">
                  <span class="badge ${netDiff > 0 ? 'badge-success' : netDiff < 0 ? 'badge-danger' : 'badge-secondary'} font-bold" style="font-size: 8px; padding: 1px 4px;">
                    ${netDiff > 0 ? '📈 Toplam Artış' : netDiff < 0 ? '📉 Toplam Düşüş' : '➡️ Dengeli'}
                  </span>
                </td>
              </tr>
            </tfoot>
          </table>
          <div style="display: flex; justify-content: space-between; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 4px 8px; margin-top: 2px; font-size: 9px; flex-wrap: wrap; gap: 4px;">
            <div>${dynamicStatusBadge}</div>
            <div style="display: flex; gap: 8px;">
              ${bestSubj && bestSubj.delta > 0 ? `<span>⭐ <strong>En Çok Gelişme:</strong> ${bestSubj.subj} (<span style="color:#059669; font-weight:700;">+${bestSubj.delta.toFixed(2)} Net</span>)</span>` : ""}
              ${worstSubj && worstSubj.delta < 0 ? `<span>⚠️ <strong>En Çok Telafi Gerektiren:</strong> ${worstSubj.subj} (<span style="color:#dc2626; font-weight:700;">${worstSubj.delta.toFixed(2)} Net</span>)</span>` : ""}
            </div>
          </div>
        </div>
      `;
    }

    let examRows = "";
    if (!isMulti) {
      examRows = sortedExams
        .map((exam) => `
          <div class="report-exam-card mb-2" style="padding: 10px 14px;">
            <div class="report-exam-card-title mb-2">
              <span style="font-size: 13px;"><strong>${exam.sinavAdi}</strong> (${formatDate(exam.tarih)})</span>
              <div class="d-flex gap-2">
                <span class="badge badge-warning font-bold" style="font-size: 11px;">LGS: <strong>${exam.puan || "-"}</strong></span>
                <span class="badge badge-primary font-bold" style="font-size: 11px;">Toplam Net: <strong>${getVerifiedExamTotalNet(exam)} Net</strong></span>
              </div>
            </div>
            <table class="report-table" style="font-size: 12px;">
              <thead><tr><th>Ders</th><th>Doğru</th><th>Yanlış</th><th>Boş</th><th>Net</th><th>Başarı %</th></tr></thead>
              <tbody>
                ${(exam.dersSonuclari || []).map((d) => {
                  const total = Number(d.dogru) + Number(d.yanlis) + Number(d.bos);
                  const rate = total > 0 ? Math.round((Number(d.dogru) / total) * 100) : 0;
                  return `<tr>
                    <td><strong>${d.ders}</strong></td>
                    <td class="text-success font-bold">${d.dogru}</td>
                    <td class="text-danger font-bold">${d.yanlis}</td>
                    <td class="text-muted">${d.bos}</td>
                    <td><strong class="text-primary">${d.net} Net</strong></td>
                    <td><div class="report-progress-wrap"><div class="report-progress-bar" style="width: ${rate}%; background: ${themeColor}"></div><span class="report-progress-text">%${rate}</span></div></td>
                  </tr>`;
                }).join("")}
              </tbody>
            </table>
          </div>
        `).join("");
    }

    let eksikHtml = "";
    if (report.eksikKonular && report.eksikKonular.length > 0) {
      const recurringTopics = report.eksikKonular.filter((ek) => ek.isRecurring || (ek.recurringExams && ek.recurringExams.length > 1) || (ek.konu && ek.konu.includes("🚨")));
      const nonRecurringTopics = report.eksikKonular.filter((ek) => !recurringTopics.includes(ek));

      let recurringBlockHtml = "";
      if (isMulti) {
        if (recurringTopics.length > 0) {
          recurringBlockHtml = `
            <div class="report-section mb-2" style="background: #fff8f8; border: 1.5px solid #fca5a5; border-radius: 6px; padding: 7px 10px;">
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
                    : sortedExams.map((e) => e.sinavAdi);
                  const cleanKonu = (ek.konu || "").replace(/🚨/g, "").replace(/Tekrar Eden/g, "").trim();

                  return `
                    <div class="report-deficiency-item recurring-card" style="padding: 4px 7px; background: #ffffff; border: 1px solid #fca5a5; border-radius: 4px; box-shadow: 0 1px 2px rgba(220, 38, 38, 0.05);">
                      <div class="report-deficiency-header mb-1" style="display: flex; justify-content: space-between; align-items: center;">
                        <span class="report-deficiency-subject" style="font-size: 10px; font-weight: 800; color: #991b1b;">${ek.ders}</span>
                        <div class="d-flex gap-1 items-center">
                          <span class="badge badge-danger font-bold" style="font-size: 7.5px; padding: 1px 4px; background: #ef4444; color: #fff;">
                            🚨 Tekrarlayan Yanlış (${ek.recurringCount || examList.length} Sınav)
                          </span>
                          <span class="badge badge-danger font-bold" style="font-size: 7.5px; padding: 1px 4px;">Kritik</span>
                        </div>
                      </div>
                      <div class="report-deficiency-title" style="font-size: 9.5px; font-weight: 700; color: #1e293b; line-height: 1.25;">
                        ${cleanKonu}
                      </div>
                      <div class="recurring-exams-bar" style="margin-top: 3px; padding: 2px 5px; background: #fef2f2; border: 1px dashed #f87171; border-radius: 3px; font-size: 8.5px; color: #991b1b; display: flex; align-items: center; gap: 3px; flex-wrap: wrap;">
                        <strong>📌 Hata Yapılan Sınavlar:</strong>
                        ${examList.map((name) => `<span class="badge badge-danger font-bold" style="font-size: 7.5px; padding: 0 3px; background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;">${escapeHtml(name)}</span>`).join("")}
                      </div>
                      ${ek.oneri ? `<div class="report-deficiency-tip" style="font-size: 8.5px; color: #475569; background: #f8fafc; padding: 2px 5px; border-radius: 2px; border: 1px solid #e2e8f0; margin-top: 2px;">💡 <strong>Eylem Planı:</strong> ${escapeHtml(ek.oneri.replace(/🚨.*?:/g, "").trim())}</div>` : ""}
                    </div>
                  `;
                }).join("")}
              </div>
            </div>
          `;
        } else {
          recurringBlockHtml = `
            <div class="report-section mb-2" style="background: #f0fdf4; border: 1.5px solid #86efac; border-radius: 6px; padding: 7px 10px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 16px;">✅</span>
                <div>
                  <strong style="color: #166534; font-size: 11px;">Mükemmel: Tekrarlayan (Kronik) Eksik Bulunmamaktadır!</strong>
                  <div style="font-size: 9.5px; color: #15803d;">Seçilen ${sortedExams.length} sınavın karşılaştırmalı analizinde öğrencinin peş peşe hata yaptığı kronik bir kazanım saptanmamıştır. Aşağıda tekil sınav eksiklerinin telafi programı listelenmiştir.</div>
                </div>
              </div>
            </div>
          `;
        }
      }

      let nonRecurringBlockHtml = "";
      if (nonRecurringTopics.length > 0) {
        nonRecurringBlockHtml = `
          <div class="report-section" style="margin-bottom: 4px;">
            <div class="report-section-header" style="border-color: ${themeColor}; margin-bottom: 4px;">
              <h3 style="color: ${themeColor}; font-size: 11px;">🎯 ${isMulti ? "Tek Sınavda Tespit Edilen Diğer Eksik Kazanımlar" : "Tespit Edilen Eksik Konu ve Kazanımlar"} (${nonRecurringTopics.length} Kazanım)</h3>
              <span class="report-section-sub" style="font-size: 9px;">Öncelik sırasına göre telafi edilmesi gereken konu başlıkları</span>
            </div>
            <div class="report-deficiencies-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px;">
              ${nonRecurringTopics
                .map((ek) => {
                  const badgeClass =
                    ek.seviye === "kritik"
                      ? "badge-danger"
                      : ek.seviye === "orta"
                      ? "badge-warning"
                      : "badge-info";
                  const badgeText =
                    ek.seviye === "kritik" ? "Kritik" : ek.seviye === "orta" ? "Orta" : "Hafif";
                  return `
                  <div class="report-deficiency-item" style="padding: 4px 6px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px;">
                    <div class="report-deficiency-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
                      <span class="report-deficiency-subject" style="font-size: 9.5px; font-weight: 700; color: ${themeColor};">${ek.ders}</span>
                      <div style="display: flex; gap: 3px; align-items: center;">
                        ${ek.recurringExams && ek.recurringExams.length > 0 ? `<span class="badge badge-light" style="font-size: 7.5px; padding: 0 3px; color: #64748b;">${escapeHtml(ek.recurringExams[0])}</span>` : ""}
                        <span class="badge ${badgeClass} font-bold" style="font-size: 7.5px; padding: 1px 3px;">${badgeText}</span>
                      </div>
                    </div>
                    <div class="report-deficiency-title" style="font-size: 9px; font-weight: 600; color: #1e293b; line-height: 1.2;">${ek.konu}</div>
                    ${ek.oneri ? `<div class="report-deficiency-tip" style="font-size: 8.5px; color: #475569; background: #ffffff; padding: 2px 4px; border-radius: 2px; border: 1px solid #e2e8f0; margin-top: 2px;">💡 ${ek.oneri}</div>` : ""}
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

    let scheduleMatrixHtml = "";
    const scheduleData = report.haftalikTablo || (report.calismaProgrami ? null : []);
    const ozet = report.haftalikOzet || {
      toplamSoruHedefi: "580 Soru",
      toplamEtutSuresi: "21.5 Saat",
      denemeSayisi: "1 Tam LGS Denemesi + 2 Branş Denemesi",
      kitapOkuma: "120 dk Kitap + 100 Paragraf",
      kocTavsiyesi: "Hafta boyu denemelerde ve testlerde yanlış yapılan her soru 'Hata Defteri'ne yapıştırılmalı ve pazar günü tekrar çözülmelidir."
    };

    if (scheduleData && scheduleData.length > 0) {
      scheduleMatrixHtml = `
        <div class="report-section mb-2">
          <div class="report-section-header" style="border-color: ${themeColor}; margin-bottom: 8px;">
            <h3 style="color: ${themeColor}; font-size: 14px;">📅 7 Günlük LGS Haftalık Çalışma Çizelgesi & Etüt Matrisi</h3>
            <span class="report-section-sub" style="font-size: 11px;">Eksik kazanımlara odaklı saatli ve hedefli etüt planı</span>
          </div>

          <table class="report-schedule-matrix" style="font-size: 11px;">
            <thead>
              <tr style="background: ${themeColor}15; color: ${themeColor};">
                <th style="width: 14%;">Gün & Odak</th>
                <th style="width: 28%;">1. Etüt (Konu & Eksik Telafi)</th>
                <th style="width: 28%;">2. Etüt (Yeni Nesil Soru Çözümü)</th>
                <th style="width: 20%;">3. Etüt (Tekrar & Paragraf)</th>
                <th style="width: 10%; text-align: center;">Hedef</th>
              </tr>
            </thead>
            <tbody>
              ${scheduleData.map((row) => `
                <tr>
                  <td class="schedule-day-cell">
                    <span class="schedule-day-badge">${row.gun}</span>
                    <span class="schedule-day-tag">${row.gunlukOdak || "Eksik Telafi"}</span>
                  </td>
                  <td>
                    <div class="schedule-etut-box">
                      <div class="etut-header">
                        <span class="etut-subject" style="color: ${themeColor};">${row.etut1?.ders || "-"}</span>
                        <span class="etut-time">${row.etut1?.saat || ""}</span>
                      </div>
                      <div class="etut-topic">${row.etut1?.konu || "-"}</div>
                      <span class="etut-target-badge">🎯 ${row.etut1?.hedef || "-"}</span>
                    </div>
                  </td>
                  <td>
                    <div class="schedule-etut-box">
                      <div class="etut-header">
                        <span class="etut-subject" style="color: ${themeColor};">${row.etut2?.ders || "-"}</span>
                        <span class="etut-time">${row.etut2?.saat || ""}</span>
                      </div>
                      <div class="etut-topic">${row.etut2?.konu || "-"}</div>
                      <span class="etut-target-badge">🎯 ${row.etut2?.hedef || "-"}</span>
                    </div>
                  </td>
                  <td>
                    <div class="schedule-etut-box">
                      <div class="etut-header">
                        <span class="etut-subject" style="color: #475569;">${row.etut3?.ders || "-"}</span>
                        <span class="etut-time">${row.etut3?.saat || ""}</span>
                      </div>
                      <div class="etut-topic">${row.etut3?.konu || "-"}</div>
                      <span class="etut-target-badge" style="background: #f1f5f9; color: #475569; border-color: #cbd5e1;">🎯 ${row.etut3?.hedef || "-"}</span>
                    </div>
                  </td>
                  <td style="text-align: center; vertical-align: middle;">
                    <span class="badge badge-primary font-bold" style="font-size: 10px; padding: 4px 6px;">${row.gunlukToplamSoru ? row.gunlukToplamSoru + " Soru" : "-"}</span>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>

          <div class="schedule-summary-bar" style="margin-top: 10px; gap: 8px;">
            <div class="schedule-stat-box" style="padding: 6px 8px;">
              <div class="schedule-stat-value" style="color: ${themeColor}; font-size: 13px;">${ozet.toplamSoruHedefi || "580 Soru"}</div>
              <div class="schedule-stat-label" style="font-size: 9.5px;">Haftalık Soru Hedefi</div>
            </div>
            <div class="schedule-stat-box" style="padding: 6px 8px;">
              <div class="schedule-stat-value" style="color: #059669; font-size: 13px;">${ozet.toplamEtutSuresi || "21.5 Saat"}</div>
              <div class="schedule-stat-label" style="font-size: 9.5px;">Toplam Etüt Süresi</div>
            </div>
            <div class="schedule-stat-box" style="padding: 6px 8px;">
              <div class="schedule-stat-value" style="color: #d97706; font-size: 13px;">${ozet.denemeSayisi || "1 Tam + 2 Branş"}</div>
              <div class="schedule-stat-label" style="font-size: 9.5px;">Deneme Provası</div>
            </div>
            <div class="schedule-stat-box" style="padding: 6px 8px;">
              <div class="schedule-stat-value" style="color: #7c3aed; font-size: 13px;">${ozet.kitapOkuma || "120 dk Kitap"}</div>
              <div class="schedule-stat-label" style="font-size: 9.5px;">Kitap & Paragraf</div>
            </div>
          </div>

          ${ozet.kocTavsiyesi ? `
            <div class="schedule-coaching-tip" style="margin-top: 8px; padding: 6px 10px; font-size: 11px;">
              <span>💡</span>
              <span><strong>Eğitim Koçu Notu:</strong> ${ozet.kocTavsiyesi}</span>
            </div>
          ` : ""}
        </div>
      `;
    }

    return `
      <div class="report-a4-sheet" id="printable-report-sheet">
        <!-- 1. SAYFA: ÇOKLU SINAV KARŞILAŞTIRMA & ANALİZ -->
        <div class="report-a4-page report-page-1" id="report-page-1">
          <div class="report-page-content">
            <div class="report-header">
              <div class="report-header-left">
                ${logoHtml}
                <div class="report-institution-info">
                  <h1 class="report-institution-title">${institution.ad}</h1>
                  <div class="report-institution-meta">
                    <span>📍 ${institution.adres || "Adres"}</span>
                    <span>📞 ${institution.telefon || "-"}</span>
                    ${institution.kurumKodu ? `<span>🏢 Kod: ${institution.kurumKodu}</span>` : ""}
                  </div>
                </div>
              </div>
              <div class="report-header-right">
                <div class="report-badge-title" style="background: ${themeColor}; font-size: ${isMulti ? '9px' : '11px'};">${pageTitle}</div>
                <div class="report-date-badge">Tarih: ${formatDate(report.olusturmaTarihi)}</div>
              </div>
            </div>

            <div class="report-student-card" style="border-top-color: ${themeColor};">
              <div class="student-meta-item"><span class="meta-label">Öğrenci Adı Soyadı:</span><span class="meta-value"><strong>${student.adSoyad}</strong></span></div>
              <div class="student-meta-item"><span class="meta-label">Sınıf / Şube:</span><span class="meta-value">${student.sinif}. Sınıf (${student.sube})</span></div>
              <div class="student-meta-item"><span class="meta-label">Öğrenci No:</span><span class="meta-value">#${student.numara || "-"}</span></div>
              <div class="student-meta-item">
                <span class="meta-label">${isMulti ? "Sınav Net Seyri:" : "Toplam Net:"}</span>
                <span class="meta-value">
                  ${isMulti 
                    ? `<span class="badge badge-primary font-bold">${getVerifiedExamTotalNet(firstExam)} ➔ ${getVerifiedExamTotalNet(latestExam)} Net</span>`
                    : `<span class="badge badge-primary font-bold">${getVerifiedExamTotalNet(firstExam)} Net</span>`
                  }
                </span>
              </div>
            </div>

            ${comparisonKpisHtml}
            ${crossSubjectMatrixHtml}

            ${!isMulti ? `
              <div class="report-section">
                <div class="report-section-header" style="border-color: ${themeColor};">
                  <h3 style="color: ${themeColor};">📊 Sınav Net ve Başarı Dağılımı</h3>
                </div>
                <div class="report-exams-container">${examRows}</div>
              </div>
            ` : ""}

            ${eksikHtml}

            <div class="report-section mb-0">
              <div class="report-section-header" style="border-color: ${themeColor};">
                <h3 style="color: ${themeColor}; font-size: 11.5px;">📝 Pedagojik Değerlendirme & Rehberlik Yorumu</h3>
              </div>
              <div class="report-comment-box" style="padding: 6px 10px;">
                <div class="report-comment-quote-icon" style="color: ${themeColor}; font-size: 18px;">“</div>
                <div class="report-comment-text" style="font-size: 9.5px; line-height: 1.35;">${report.genelYorum || "Değerlendirme mevcut değil."}</div>
              </div>
              ${report.gelisimAnalizi ? `
                <div class="report-trend-box mt-1" style="background: rgba(37, 99, 235, 0.04); border: 1.5px solid rgba(37, 99, 235, 0.2); border-radius: 4px; padding: 4px 8px;">
                  <div class="report-trend-title" style="font-weight: 800; color: #1e40af; font-size: 10px;">📈 Gelişim Seyri ve Karşılaştırma Analizi:</div>
                  <div class="report-trend-text" style="font-size: 9px; line-height: 1.35; color: #334155;">${report.gelisimAnalizi.replace(/\n/g, '<br/>')}</div>
                </div>
              ` : ""}
            </div>
          </div>

          <div class="report-page-footer-mini">
            <span>Bu rapor <strong>${institution.ad}</strong> Ölçme ve Değerlendirme Merkezi tarafından üretilmiştir.</span>
            <span class="font-bold">Sayfa 1 / 2</span>
          </div>
        </div>

        <!-- 2. SAYFA: 7 GÜNLÜK LGS HAFTALIK ÇALIŞMA PLANI -->
        <div class="report-a4-page report-page-2" id="report-page-2">
          <div class="report-page-content">
            <div class="report-page-header-mini">
              <div class="d-flex items-center gap-2">
                ${logoHtmlMini}
                <div>
                  <strong style="color: #0f172a; font-size: 13px;">${institution.ad}</strong>
                  <div style="font-size: 10.5px; color: #64748b;">Öğrenci: <strong>${student.adSoyad}</strong> (${student.sinif}. Sınıf / ${student.sube})</div>
                </div>
              </div>
              <div class="d-flex items-center gap-2">
                <span class="badge badge-primary font-bold" style="font-size: 10px;">7 Günlük Bireysel Etüt Matrisi</span>
                <span style="font-size: 10px; color: #64748b;">Rapor Tarihi: ${formatDate(report.olusturmaTarihi)}</span>
              </div>
            </div>

            ${scheduleMatrixHtml}

            <!-- 2. SAYFA İMZA / MÜHÜR BLOĞU -->
            <div class="report-footer mt-auto" style="border-top: 1.5px solid #e2e8f0; padding-top: 10px; margin-top: auto;">
              <div class="report-footer-left">
                <div style="font-size: 11px; font-weight: 700; color: #0f172a;">Öğrenci Gelişim & Takip Taahhüdü</div>
                <div style="font-size: 9.5px; color: #64748b; margin-top: 2px;">
                  Yukarıda planlanan 7 günlük etüt ve soru hedeflerinin günlük olarak takip edilmesi ve pazar günü Hata Defteri kontrolünün yapılması önerilir.
                </div>
              </div>
              <div class="report-footer-right">
                <div class="report-signature-block">
                  <span class="sig-title" style="font-size: 10.5px; font-weight: 700; color: #1e293b;">Rehberlik & Eğitim Danışmanı</span>
                  <div style="height: 28px;"></div>
                  <span class="sig-line" style="font-size: 9.5px; color: #64748b; border-top: 1px dashed #cbd5e1; padding-top: 2px; width: 140px; display: inline-block; text-align: center;">İmza / Kaşe</span>
                </div>
              </div>
            </div>
          </div>

          <div class="report-page-footer-mini">
            <span>${institution.ad} • Yapay Zekâ Destekli Ölçme ve Değerlendirme Sistemi</span>
            <span class="font-bold">Sayfa 2 / 2</span>
          </div>
        </div>
      </div>
    `;
  }
}
