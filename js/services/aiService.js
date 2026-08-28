/**
 * Yapay Zekâ Analiz Servisi
 * Google Gemini API, OpenAI API ve Anthropic Claude API Entegrasyonu
 * + Akıllı Çevrimdışı / Simülasyon Motoru (Fallback)
 */

export class AIService {
  /**
   * Öğrenci ve Sınav(lar) için yapay zekâ analizini yürütür
   * @param {Object} student - Öğrenci bilgileri
   * @param {Array} exams - Analiz edilecek 1 veya daha fazla sınav
   * @param {Object} aiConfig - AI sağlayıcı yapılandırması
   * @returns {Promise<Object>} Yapılandırılmış analiz çıktısı
   */
  static async analyzeExams(student, exams, aiConfig) {
    if (!student || !exams || exams.length === 0) {
      throw new Error("Analiz için en az bir öğrenci ve bir sınav seçilmelidir.");
    }

    const provider = aiConfig?.provider || "gemini";
    const promptText = this.buildPrompt(student, exams);

    // API Anahtarı kontrolü
    const hasKey = this.checkApiKey(provider, aiConfig);

    if (!hasKey) {
      // Simülasyon motorunu çalıştır (gerçekçi algoritmik analiz)
      console.log(`[AI Servisi] API anahtarı girilmediği için yerleşik Akıllı Analiz Motoru çalıştırılıyor...`);
      await new Promise((r) => setTimeout(r, 1800)); // Doğal yükleme hissi
      return this.generateSimulatedAnalysis(student, exams);
    }

    try {
      if (provider === "gemini") {
        return await this.callGemini(promptText, aiConfig);
      } else if (provider === "openai") {
        return await this.callOpenAI(promptText, aiConfig);
      } else if (provider === "claude") {
        return await this.callClaude(promptText, aiConfig);
      } else {
        return this.generateSimulatedAnalysis(student, exams);
      }
    } catch (err) {
      console.warn(`[AI Servisi] ${provider} çağrısı başarısız oldu (${err.message}). Simülasyon motoruna geçiliyor...`);
      // Hata durumunda da analizi aksatmamak için simüle veriyi döndür ve kullanıcıyı uyar
      const simulated = this.generateSimulatedAnalysis(student, exams);
      simulated._fallbackUsed = true;
      simulated._errorMessage = err.message;
      return simulated;
    }
  }

  static checkApiKey(provider, config) {
    if (!config) return false;
    if (provider === "gemini") return !!config.geminiApiKey?.trim();
    if (provider === "openai") return !!config.openaiApiKey?.trim();
    if (provider === "claude") return !!config.claudeApiKey?.trim();
    return false;
  }

  /**
   * Pedagojik AI Prompt Şablonunu Oluşturur
   */
  static buildPrompt(student, exams) {
    const isMultiExam = exams.length > 1;

    // Çoklu sınav varsa ortak / tekrar eden yanlış kazanımları tespit et
    const topicStats = {};
    exams.forEach((exam, examIdx) => {
      (exam.dersSonuclari || []).forEach((d) => {
        (d.konular || []).forEach((k) => {
          const yuzde = k.basariYuzdesi !== undefined ? Number(k.basariYuzdesi) : (k.soruSayisi > 0 ? Number(((k.dogru / k.soruSayisi) * 100).toFixed(0)) : 0);
          const isDeficient = k.durum === "yanlis" || k.durum === "bos" || k.yanlis > 0 || k.bos > 0 || yuzde < 100 || (k.soruSayisi > 0 && k.dogru < k.soruSayisi);
          if (isDeficient && k.kazanimAdi && k.kazanimAdi.trim().length > 2) {
            const key = `${(d.ders || "").trim().toLowerCase()}___${k.kazanimAdi.trim().toLowerCase()}`;
            if (!topicStats[key]) {
              topicStats[key] = {
                ders: (d.ders || "").trim(),
                kazanimAdi: k.kazanimAdi.trim(),
                examIndices: new Set(),
                examNames: [],
                totalWrong: 0,
                totalBos: 0
              };
            }
            topicStats[key].examIndices.add(examIdx);
            if (!topicStats[key].examNames.includes(exam.sinavAdi)) {
              topicStats[key].examNames.push(exam.sinavAdi);
            }
            topicStats[key].totalWrong += Number(k.yanlis) || (k.durum === "yanlis" ? 1 : 0);
            topicStats[key].totalBos += Number(k.bos) || (k.durum === "bos" ? 1 : 0);
          }
        });
      });
    });

    const recurringTopics = Object.values(topicStats).filter((t) => t.examIndices.size >= 2);

    let examSummary = exams
      .map((exam, index) => {
        let details = `\n--- SINAV ${index + 1}: ${exam.sinavAdi} (Tarih: ${exam.tarih}, Toplam Net: ${exam.toplamNet || "-"}, LGS Puanı: ${exam.puan || "-"}) ---`;
        (exam.dersSonuclari || []).forEach((d) => {
          details += `\n* Ders: ${d.ders} | Doğru: ${d.dogru}, Yanlış: ${d.yanlis}, Boş: ${d.bos}, Net: ${d.net}`;
          if (d.konular && d.konular.length > 0) {
            const eksikler = d.konular
              .filter((k) => k.durum === "yanlis" || k.durum === "bos" || k.yanlis > 0 || k.bos > 0 || (k.basariYuzdesi !== undefined && k.basariYuzdesi < 100) || (k.soruSayisi > 0 && k.dogru < k.soruSayisi))
              .map((k) => `${k.kazanimAdi} (Soru: ${k.soruSayisi || 1}, Doğru: ${k.dogru || 0}, Yanlış: ${k.yanlis || 0}, Başarı: %${k.basariYuzdesi !== undefined ? k.basariYuzdesi : 0})`);
            if (eksikler.length > 0) {
              details += `\n  - Bu Dersteki TÜM Eksik/Yanlış Kazanımlar (${eksikler.length} adet):\n    • ` + eksikler.join("\n    • ");
            }
          }
        });
        return details;
      })
      .join("\n");

    let recurringWarningPrompt = "";
    if (isMultiExam && recurringTopics.length > 0) {
      recurringWarningPrompt = `\n🚨 DİKKAT: 2 VEYA DAHA FAZLA SINAVDA TEKRAR EDEN (KRONİK) YANLIŞ KAZANIMLAR (${recurringTopics.length} adet):
(Bu kazanımlar öğrencinin birden fazla sınavda peş peşe yanlış yaptığı ve henüz öğrenemediği kalıcı eksiklerdir!)
${recurringTopics.map((t) => `• [${t.ders}] ${t.kazanimAdi} (${t.examIndices.size} sınavda da yanlış yapıldı: ${t.examNames.join(", ")})`).join("\n")}
`;
    }

    return `Sen Türkiye'nin en seçkin LGS Eğitim Koçu, Rehberlik ve Ölçme Değerlendirme Uzmanısın.
Aşağıda sınav sonuç karnesi verilen 8. sınıf öğrencisi için eksik analizini yap ve LGS mantığına uygun 7 günlük profesyonel bir Haftalık Çalışma Çizelgesi Tablosu (Etüt Matrisi) hazırla.

ÖĞRENCİ:
- Adı Soyadı: ${student.adSoyad} (${student.sinif}. Sınıf / ${student.sube} - No: ${student.numara})

SINAV VERİLERİ VE KAZANIM ANALİZİ:
${examSummary}
${recurringWarningPrompt}
${isMultiExam ? "NOT: Birden fazla sınav seçilmiştir. Sınavlar arasındaki net artış/azalışlarını, gelişim seyrini ve özellikle birden fazla sınavda tekrar eden ortak/kronik yanlış kazanımları 'gelisimAnalizi' alanında detaylıca karşılaştır." : ""}

KURALLAR:
1. Öğrencinin yüzdelik başarısı %100 olmayan (eksik olan) TÜM kazanımlarını 'eksikKonular' listesine önem ve öncelik sırasına göre ekle.
   ${recurringTopics.length > 0 ? `- 🚨 ÇOK ÖNEMLİ: 2+ sınavda tekrar eden ortak yanlış kazanımları 'eksikKonular' listesinin EN BAŞINA ekle. Bu kazanımlara "isRecurring": true, "recurringCount": ${recurringTopics.length}, "recurringExams": ["Sınav 1 Adı", "Sınav 2 Adı"], "seviye": "kritik" ve "oneri": "🚨 Tekrarlayan Yanlış Telafisi: ..." olarak ata.` : ""}
2. Öğrenciyi motive eden, güçlü derslerini takdir eden, eksiklere nokta atışı rehberlik yapan profesyonel bir 'genelYorum' yaz.
3. ${isMultiExam ? "'gelisimAnalizi' alanında sınavlar arasındaki net artış/azalışlarını, hangi derslerde yükseliş/düşüş olduğunu ve özellikle aynı kazanımlarda yapılan tekrarlayan yanlışları derinlemesine değerlendir." : ""}
4. 'haftalikTablo' içinde Pazartesi'den Pazar'a kadar 7 GÜNÜN HER BİRİ İÇİN 3 Ayrı Etüt (1. Etüt: Konu Tekrarı & Eksik Telafi, 2. Etüt: Yeni Nesil Soru Çözümü, 3. Etüt: Günlük Tekrar / Paragraf / Hata Defteri) oluştur.
   - 1. Etütler mutlaka öğrencinin %100 altında kalan ${recurringTopics.length > 0 ? "ve özellikle birden fazla sınavda tekrar eden ortak" : ""} eksik kazanımlarına odaklanmalıdır.
   - Cumartesi Sabahı: 90 Soruluk Tam LGS Denemesi ve öğleden sonra Video Çözüm Analizi olmalı.
   - Pazar Günü: Hata Defteri Tekrarı ve dinlenme olmalı.

YANIT FORMATI:
SADECE aşağıdaki JSON nesnesi formatında yanıt ver:
{
  "eksikKonular": [
    {
      "ders": "Türkçe",
      "konu": "Bağlamdan Kelime ve Sözcükte Anlam Tahmini",
      "seviye": "kritik",
      "isRecurring": true,
      "recurringCount": 2,
      "recurringExams": ["1. Deneme", "2. Deneme"],
      "oneri": "Konu özeti + 35 yeni nesil anlam sorusu ile acil telafi"
    }
  ],
  "genelYorum": "Metin...",
  "gelisimAnalizi": "${isMultiExam ? "Sınavlar arası karşılaştırma, net değişimleri ve kronik kazanım değerlendirmesi..." : ""}",
  "haftalikTablo": [
    {
      "gun": "Pazartesi",
      "gunlukOdak": "Türkçe & Matematik",
      "etut1": { "saat": "17:30 - 18:30", "ders": "Türkçe", "konu": "🎯 Bağlamdan Anlam & Söz Öbeği Pratiği", "hedef": "35 Soru" },
      "etut2": { "saat": "18:45 - 19:45", "ders": "Matematik", "konu": "Çarpanlar ve Katlar / EBOB-EKOK", "hedef": "30 Soru" },
      "etut3": { "saat": "20:00 - 20:45", "ders": "Paragraf & Okuma", "konu": "20 Yeni Nesil Paragraf + Kitap (20 dk)", "hedef": "20 Soru" },
      "gunlukToplamSoru": 85
    }
  ],
  "haftalikOzet": {
    "toplamSoruHedefi": "580 - 650 Soru",
    "toplamEtutSuresi": "21.5 Saat",
    "denemeSayisi": "1 Tam LGS Denemesi + 2 Branş Denemesi",
    "kitapOkuma": "120 dk Kitap + 100 Paragraf",
    "kocTavsiyesi": "Hafta boyu denemelerde ve testlerde yanlış yapılan her soru 'Hata Defteri'ne yapıştırılmalı ve pazar günü mutlaka yeniden çözülmelidir."
  }
}`;
  }

  /**
   * Sınav Karnesi / PDF Metninden Veri ve Kazanım Ayıklama Promptu
   */
  static buildPdfExtractionPrompt(pageStructuredText) {
    return `Sen Türkiye'deki MEB ve LGS standartlarında sınav sonuç karnelerini, optik değerlendirme raporlarını ve sınav belgelerini (Workwin, KDS, Özdebir, Töder, Çanta vb.) analiz eden KUSURSUZ bir Yapay Zekâ Veri Ayıklama Uzmanısın.

Aşağıda bir öğrencinin sınav sonuç belgesinden çıkarılan ham metin, ders net tabloları ve kazanım listeleri yer almaktadır.
Bu metni dikkatle inceleyerek öğrencinin bilgilerini, ders netlerini, LGS puanını ve EN ÖNEMLİSİ her dersin altındaki TÜM KAZANIMLARI eksiksiz, sıfır hata ile JSON formatında ayrıştır.

=== BELGE HAM METNİ VE KAZANIMLARI ===
${pageStructuredText}

GÖREVLER VE DİKKAT EDİLECEK KURALLAR:
1. ÖĞRENCİ BİLGİLERİ:
   - adSoyad: Öğrencinin tam adı soyadı (Büyük/küçük harf düzgün formatta).
   - sinif: Sınıf seviyesi (genellikle "8" veya "7").
   - sube: Şubesi (örn. "8/A", "8-B").
   - numara: Öğrenci okul numarası.
   - okul: Okul adı.

2. SINAV BİLGİLERİ:
   - sinavAdi: Sınavın tam adı (örn. "8. Sınıf Gelişim Takip Sınavı-6", "Workwin Deneme 2025-2026").
   - tarih: Sınav tarihi (YYYY-MM-DD formatında, örn: "2026-03-15").
   - puan: Öğrencinin kendi karnesindeki LGS Puanı (Örn: "465,834" veya "481,988"). Okul/genel ortalamaları değil, öğrencinin kendi puanını al.
   - toplamNet: Toplam net sayısı (Örn: 82.00).

3. DERS SONUÇLARI (TÜRKÇE, MATEMATİK, FEN BİLİMLERİ, T.C. İNKILAP TARİHİ VE ATATÜRKÇÜLÜK, DİN KÜLTÜRÜ VE AHLAK BİLGİSİ, YABANCI DİL (İNGİLİZCE)):
   - Her ders için dogru, yanlis, bos ve net sayılarını çıkar.
   - Her dersin altındaki "konular" dizisine o derse ait BÜTÜN KAZANIMLARI eksiksiz tek tek ekle:
     * kazanimAdi: Kazanımın tam, eksiksiz, birleştirilmiş adı (kesilmiş satırları düzgün birleştir, satır sonundaki sayıları metinden temizle).
     * soruSayisi: O kazanımdan çıkan toplam soru adedi (sayı).
     * dogru: Öğrencinin doğru sayısı.
     * yanlis: Öğrencinin yanlış sayısı.
     * bos: Boş sayısı (soruSayisi - dogru - yanlis).
     * basariYuzdesi: Başarı yüzdesi (0-100 arası sayı).
     * durum: Başarı yüzdesi %100 değilse veya yanlış/boş varsa "yanlis", tam doğruysa "dogru", hepsi boşsa "bos".
     * seviye: basariYuzdesi < 50 ise "kritik", 50 ile 85 arasında ise "orta", 85 ve üstü ise "hafif".

YANIT FORMATI:
SADECE geçerli bir JSON nesnesi döndür (ekstra metin, açıklama veya backtick ekleme):
{
  "ogrenci": {
    "adSoyad": "Bora Ateş Zafer",
    "sinif": "8",
    "sube": "8/A",
    "numara": "222",
    "okul": "Özel Ege Atabey Ortaokulu"
  },
  "sinav": {
    "sinavAdi": "8. Sınıf Gelişim Takip Sınavı",
    "tarih": "2026-03-15",
    "puan": "465,834",
    "toplamNet": 82.00,
    "toplamSoru": 90,
    "dersSonuclari": [
      {
        "ders": "Türkçe",
        "dogru": 18,
        "yanlis": 2,
        "bos": 0,
        "net": 17.33,
        "konular": [
          {
            "kazanimAdi": "Bağlamdan yararlanarak bilmediği kelime ve kelime gruplarının anlamını tahmin eder.",
            "soruSayisi": 1,
            "dogru": 0,
            "yanlis": 1,
            "bos": 0,
            "basariYuzdesi": 0,
            "durum": "yanlis",
            "seviye": "kritik"
          }
        ]
      }
    ]
  }
}`;
  }

  /**
   * PDF Sayfa Metnini AI ile Kusursuz Ayrıştırır
   */
  static async extractExamDataFromPdfText(pageStructuredText, aiConfig, abortSignal = null) {
    const provider = aiConfig?.provider || (aiConfig?.geminiApiKey ? "gemini" : (aiConfig?.openaiApiKey ? "openai" : "gemini"));
    const promptText = this.buildPdfExtractionPrompt(pageStructuredText);

    const hasKey = this.checkApiKey(provider, aiConfig);
    if (!hasKey) {
      throw new Error(`Seçilen ${provider.toUpperCase()} için API anahtarı girilmedi. Lütfen Ayarlar menüsünden API anahtarınızı tanımlayınız.`);
    }

    let result = null;
    if (provider === "gemini") {
      result = await this.callGemini(promptText, aiConfig, abortSignal);
    } else if (provider === "openai") {
      result = await this.callOpenAI(promptText, aiConfig, abortSignal);
    } else if (provider === "claude") {
      result = await this.callClaude(promptText, aiConfig, abortSignal);
    } else {
      throw new Error(`Desteklenmeyen AI sağlayıcı: ${provider}`);
    }

    return result;
  }

  /**
   * Google Gemini API Çağrısı
   */
  static async callGemini(promptText, config, abortSignal = null) {
    const model = config.geminiModel || "gemini-1.5-flash";
    const apiKey = config.geminiApiKey;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      signal: abortSignal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          temperature: config.temperature || 0.2,
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Gemini API Hatası (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidateText) throw new Error("Gemini API boş yanıt döndürdü.");

    return this.cleanAndParseJSON(candidateText);
  }

  /**
   * OpenAI API Çağrısı
   */
  static async callOpenAI(promptText, config, abortSignal = null) {
    const model = config.openaiModel || "gpt-4o-mini";
    const apiKey = config.openaiApiKey;
    const url = "https://api.openai.com/v1/chat/completions";

    const response = await fetch(url, {
      method: "POST",
      signal: abortSignal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: "system", content: "Sen Türkçe eğitim ve ölçme-değerlendirme uzmanısın. Yalnızca geçerli JSON nesnesi döndürürsün." },
          { role: "user", content: promptText }
        ],
        response_format: { type: "json_object" },
        temperature: config.temperature || 0.2
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`OpenAI API Hatası (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("OpenAI boş yanıt döndürdü.");

    return this.cleanAndParseJSON(content);
  }

  /**
   * Anthropic Claude API Çağrısı
   */
  static async callClaude(promptText, config, abortSignal = null) {
    const model = config.claudeModel || "claude-3-5-sonnet-20241022";
    const apiKey = config.claudeApiKey;
    const url = "https://api.anthropic.com/v1/messages";

    const response = await fetch(url, {
      method: "POST",
      signal: abortSignal,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "dangerously-allow-browser": "true"
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 4000,
        temperature: config.temperature || 0.2,
        messages: [{ role: "user", content: promptText }]
      })
    });

    if (!response.ok) {
      const errBody = await response.text();
      throw new Error(`Claude API Hatası (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;
    if (!content) throw new Error("Claude boş yanıt döndürdü.");

    return this.cleanAndParseJSON(content);
  }

  /**
   * JSON temizleme ve güvenli parse
   */
  static cleanAndParseJSON(rawText) {
    let clean = rawText.trim();
    // Markdown ```json ... ``` etiketlerini temizle
    if (clean.startsWith("```json")) {
      clean = clean.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (clean.startsWith("```")) {
      clean = clean.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    try {
      return JSON.parse(clean);
    } catch (e) {
      // RegEx ile ilk { ve son } arasını bul
      const match = clean.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
      throw new Error("AI yanıtı JSON formatında çözümlenemedi: " + e.message);
    }
  }

  /**
   * Gelişmiş Pedagojik Simülasyon Motoru
   * Gerçek öğrenci sınav verilerini analiz edip tutarlı pedagojik çıktı üretir
   */
  static generateSimulatedAnalysis(student, exams) {
    const isMulti = exams.length > 1;
    const latestExam = exams[exams.length - 1];
    const firstExam = exams[0];

    // 1. ADIM: Sınavlardaki tüm eksik kazanımları ve sınav bazında tekrar sıklığını tara
    const topicStats = {};

    (exams || []).forEach((exam, examIdx) => {
      (exam.dersSonuclari || []).forEach((d) => {
        let hasWrongGain = false;
        (d.konular || []).forEach((k) => {
          const yuzde = k.basariYuzdesi !== undefined ? Number(k.basariYuzdesi) : (k.soruSayisi > 0 ? Number(((k.dogru / k.soruSayisi) * 100).toFixed(0)) : 0);
          const isDeficient = k.durum === "yanlis" || k.durum === "bos" || k.yanlis > 0 || k.bos > 0 || yuzde < 100 || (k.soruSayisi > 0 && k.dogru < k.soruSayisi);

          if (isDeficient && k.kazanimAdi && k.kazanimAdi.trim().length > 2) {
            hasWrongGain = true;
            const cleanTopic = k.kazanimAdi.trim();
            const uniqueKey = `${(d.ders || "").toLowerCase()}___${cleanTopic.toLowerCase()}`;

            if (!topicStats[uniqueKey]) {
              topicStats[uniqueKey] = {
                ders: d.ders,
                konu: cleanTopic,
                examIndices: new Set(),
                examNames: [],
                totalWrong: 0,
                totalBos: 0,
                yuzde: yuzde
              };
            }
            topicStats[uniqueKey].examIndices.add(examIdx);
            if (!topicStats[uniqueKey].examNames.includes(exam.sinavAdi)) {
              topicStats[uniqueKey].examNames.push(exam.sinavAdi);
            }
            topicStats[uniqueKey].totalWrong += Number(k.yanlis) || 1;
            topicStats[uniqueKey].totalBos += Number(k.bos) || 0;
          }
        });

        // Eğer derste yanlış veya boş var ama kazanım listesi boşsa
        const neededMissingCount = (d.yanlis || 0) + (d.bos > 0 ? 1 : 0);
        if (neededMissingCount > 0 && !hasWrongGain) {
          const cleanTopic = `${d.ders}: Temel Soru & Kavram Analizi`;
          const uniqueKey = `${(d.ders || "").toLowerCase()}___${cleanTopic.toLowerCase()}`;

          if (!topicStats[uniqueKey]) {
            topicStats[uniqueKey] = {
              ders: d.ders,
              konu: cleanTopic,
              examIndices: new Set(),
              examNames: [],
              totalWrong: 0,
              totalBos: 0,
              yuzde: 0
            };
          }
          topicStats[uniqueKey].examIndices.add(examIdx);
          if (!topicStats[uniqueKey].examNames.includes(exam.sinavAdi)) {
            topicStats[uniqueKey].examNames.push(exam.sinavAdi);
          }
          topicStats[uniqueKey].totalWrong += Number(d.yanlis) || 1;
        }
      });
    });

    // 2. ADIM: 2 veya daha fazla sınavda tekrar eden ortak yanlışları (kronik eksikleri) ayıkla
    const recurringTopics = Object.values(topicStats).filter((t) => t.examIndices.size >= 2);
    const singleTopics = Object.values(topicStats).filter((t) => t.examIndices.size === 1);

    const eksikler = [];

    // Önce 2+ sınavda tekrar eden ortak yanlışları en üste ekle (Kritik Öncelikli)
    recurringTopics.forEach((t) => {
      eksikler.push({
        ders: t.ders,
        konu: t.konu,
        isRecurring: true,
        recurringCount: t.examIndices.size,
        recurringExams: t.examNames,
        seviye: "kritik",
        yuzde: t.yuzde,
        dogru: 0,
        yanlis: t.totalWrong,
        bos: t.totalBos,
        oneri: `🚨 ${t.examIndices.size} Sınavda Tekrar Eden Kronik Eksik: Konu özet föyü + video soru çözümü + 45 yeni nesil soru ile acil telafi`
      });
    });

    // Tekil sınav eksiklerini ekle
    singleTopics.forEach((t) => {
      eksikler.push({
        ders: t.ders,
        konu: t.konu,
        isRecurring: false,
        recurringCount: 1,
        recurringExams: t.examNames,
        seviye: t.yuzde < 50 ? "kritik" : (t.yuzde < 85 ? "orta" : "hafif"),
        yuzde: t.yuzde,
        dogru: 0,
        yanlis: t.totalWrong,
        bos: t.totalBos,
        oneri: `${t.ders} dersinde kavram tekrarı ve ${t.yuzde === 0 ? "35" : "25"} pekiştirme sorusu (${t.examNames[0] || "Deneme"})`
      });
    });

    if (eksikler.length === 0) {
      eksikler.push(
        { ders: "Türkçe", konu: "Yeni Nesil Paragraf ve Muhakeme", seviye: "hafif", oneri: "Günlük 25 paragraf ve deneme çözümü" },
        { ders: "Matematik", konu: "Yeni Nesil Beceri Temelli Sorular", seviye: "hafif", oneri: "Günde 30 ileri düzey soru" }
      );
    }

    // 3. ADIM: Genel Yorum ve Gelişim Analizi Metinlerini Üret
    let genelYorum = `Sevgili ${student.adSoyad}, `;
    if (isMulti) {
      const netFark = (Number(latestExam.toplamNet) || 0) - (Number(firstExam.toplamNet) || 0);
      genelYorum += `seçilen **${exams.length} sınavın** (${firstExam.sinavAdi} ➔ ${latestExam.sinavAdi}) sonuçları karşılaştırmalı olarak analiz edilmiştir. `;
      if (netFark >= 0) {
        genelYorum += `Süreç içinde netlerinde **+${netFark.toFixed(2)} netlik artış** kaydedildiği görülmektedir. `;
      } else {
        genelYorum += `Sınavlar arasında **${netFark.toFixed(2)} netlik dalgalanma** gözlenmiştir. `;
      }
      if (recurringTopics.length > 0) {
        genelYorum += `Yapılan analizde **${recurringTopics.length} adet kazanımda her iki sınavda da hata tekrarı yapıldığı (kronik eksik)** belirlenmiştir. Bu ortak eksikler aşağıdaki 7 günlük çalışma tablosunda 1. Etütlere mutlak öncelikle atanmıştır.`;
      } else {
        genelYorum += `Sınavlar arasında hata tekrarı yapılan ortak kazanım bulunmamakta olup, yeni eksiklerin telafisine odaklanılmıştır.`;
      }
    } else {
      genelYorum += `"${latestExam.sinavAdi}" sınav sonucun değerlendirilmiştir. `;
      if (latestExam.toplamNet && latestExam.toplamNet >= 80) {
        genelYorum += `Elde ettiğin **${latestExam.toplamNet} netlik yüksek başarı** ve puan performansın harikadır. `;
      } else {
        genelYorum += `Elde ettiğin **${latestExam.toplamNet || 70} netlik performans** düzenli çalışma ile daha da yükselecektir. `;
      }
      genelYorum += `Karnende yüzdelik başarısı %100'ün altında kalan ${eksikler.length} adet eksik kazanım tespit edilmiştir. Aşağıdaki 7 günlük çalışma çizelgesi doğrudan bu eksik kazanımlarını telafi etmek üzere hazırlanmıştır.`;
    }

    let gelisimAnalizi = "";
    if (isMulti) {
      const netFark = (Number(latestExam.toplamNet) || 0) - (Number(firstExam.toplamNet) || 0);
      const puan1 = Number(String(firstExam.puan || "").replace(",", ".")) || 0;
      const puan2 = Number(String(latestExam.puan || "").replace(",", ".")) || 0;
      const puanDiff = puan1 > 0 && puan2 > 0 ? (puan2 - puan1).toFixed(2) : null;

      gelisimAnalizi = `📊 **Genel Gelişim Seyri:** ${firstExam.sinavAdi} (${firstExam.toplamNet || "-"} Net) ➔ ${latestExam.sinavAdi} (${latestExam.toplamNet || "-"} Net) [Toplam Net Değişimi: ${netFark >= 0 ? "+" : ""}${netFark.toFixed(2)} Net${puanDiff !== null ? ` | Puan Değişimi: ${Number(puanDiff) >= 0 ? '+' : ''}${puanDiff} Puan` : ''}].\n`;
      if (recurringTopics.length > 0) {
        gelisimAnalizi += `\n🚨 **Tekrarlayan (Kronik) Kazanım Hataları:** Seçilen ${exams.length} sınavın çapraz analizinde **${recurringTopics.length} adet kazanımda** hata tekrarı saptanmıştır. Özellikle ${recurringTopics.map((t) => `"${t.ders}: ${t.konu}" (${t.examNames.join(" & ")})`).slice(0, 3).join(", ")} konuları öğrencinin kalıcı telafi gerektiren risk alanlarıdır.\n`;
        gelisimAnalizi += `\n💡 **Rehberlik & İyileştirme Stratejisi:** Tekrarlayan yanlış yapılan bu kazanımlar, soru çözüm föyleri ve yanlış soru defteri (Hata Defteri) yöntemiyle acilen pekiştirilmelidir. Öğrencinin haftalık çalışma çizelgesindeki 1. Etütler bu eksiklere göre kurgulanmıştır.`;
      } else {
        gelisimAnalizi += `\n✓ **Başarı Seyri:** Sınavlar arasında peş peşe hata yapılan ortak kronik bir eksik kazanım saptanmamıştır. Yeni nesil soru pratikleriyle mevcut başarı korunmalıdır.`;
      }
    }

    // 4. ADIM: 7 Günlük LGS Etüt Matrisi Tablosu (Öncelikli Eksik Kazanımlarla)
    const e1 = eksikler[0] ? `${eksikler[0].ders}: 🎯 ${eksikler[0].konu}` : "Türkçe: 🎯 Paragraf ve Sözcükte Anlam";
    const e2 = eksikler[1] ? `${eksikler[1].ders}: 🎯 ${eksikler[1].konu}` : "Fen Bilimleri: 🎯 Basınç ve Deneyleri";
    const e3 = eksikler[2] ? `${eksikler[2].ders}: 🎯 ${eksikler[2].konu}` : "Fen Bilimleri: 🎯 Periyodik Sistem ve Madde";
    const e4 = eksikler[3] ? `${eksikler[3].ders}: 🎯 ${eksikler[3].konu}` : "Din Kültürü: 🎯 Zekât ve Sadaka İbadeti";
    const e5 = eksikler[4] ? `${eksikler[4].ders}: 🎯 ${eksikler[4].konu}` : "Matematik: 🎯 Çarpanlar ve Katlar";

    const haftalikTablo = [
      {
        gun: "Pazartesi",
        gunlukOdak: (eksikler[0]?.ders || "Türkçe") + " & Matematik",
        etut1: { saat: "17:30 - 18:30", ders: eksikler[0]?.ders || "Türkçe", konu: e1, hedef: "35 Soru" },
        etut2: { saat: "18:45 - 19:45", ders: "Matematik", konu: "Çarpanlar ve Katlar / EBOB-EKOK", hedef: "30 Soru" },
        etut3: { saat: "20:00 - 20:45", ders: "Paragraf & Okuma", konu: "20 Yeni Nesil Paragraf + Kitap (20 dk)", hedef: "20 Soru" },
        gunlukToplamSoru: 85
      },
      {
        gun: "Salı",
        gunlukOdak: (eksikler[1]?.ders || "Fen Bilimleri") + " & İngilizce",
        etut1: { saat: "17:30 - 18:30", ders: eksikler[1]?.ders || "Fen Bilimleri", konu: e2, hedef: "35 Soru" },
        etut2: { saat: "18:45 - 19:45", ders: "İnkılap & İngilizce", konu: "İnkılap İlkeleri & İngilizce Reading", hedef: "30 Soru" },
        etut3: { saat: "20:00 - 20:45", ders: "Tekrar & Paragraf", konu: "Günlük Hata Kontrolü + 20 Paragraf", hedef: "20 Soru" },
        gunlukToplamSoru: 85
      },
      {
        gun: "Çarşamba",
        gunlukOdak: (eksikler[2]?.ders || "Fen Bilimleri") + " & Matematik",
        etut1: { saat: "17:30 - 18:30", ders: eksikler[2]?.ders || "Fen Bilimleri", konu: e3, hedef: "30 Soru" },
        etut2: { saat: "18:45 - 19:45", ders: "Matematik", konu: "Üslü ve Kareköklü İfadeler Yeni Nesil", hedef: "35 Soru" },
        etut3: { saat: "20:00 - 20:45", ders: "Kitap & Tekrar", konu: "Kitap Okuma (30 dk) + Hata Defteri", hedef: "15 Soru" },
        gunlukToplamSoru: 80
      },
      {
        gun: "Perşembe",
        gunlukOdak: (eksikler[3]?.ders || "Din Kültürü") + " & Türkçe",
        etut1: { saat: "17:30 - 18:30", ders: eksikler[3]?.ders || "Din Kültürü", konu: e4, hedef: "30 Soru" },
        etut2: { saat: "18:45 - 19:45", ders: "Türkçe", konu: "Cümlenin Ögeleri & Fiilimsiler", hedef: "35 Soru" },
        etut3: { saat: "20:00 - 20:45", ders: "Paragraf", konu: "20 Yeni Nesil Paragraf Çözümü", hedef: "20 Soru" },
        gunlukToplamSoru: 85
      },
      {
        gun: "Cuma",
        gunlukOdak: "Branş Denemeleri & Telafi",
        etut1: { saat: "17:30 - 18:30", ders: "Sayısal Branş", konu: e5 || "Matematik + Fen Branş Denemesi", hedef: "40 Soru" },
        etut2: { saat: "18:45 - 19:45", ders: "Sözel Branş", konu: "Türkçe + Sosyal Branş Denemesi", hedef: "40 Soru" },
        etut3: { saat: "20:00 - 20:45", ders: "Deneme Analizi", konu: "Hatalı Soruların Çözüm İncelemesi", hedef: "0 Soru" },
        gunlukToplamSoru: 80
      },
      {
        gun: "Cumartesi",
        gunlukOdak: "Tam LGS Deneme Sınavı",
        etut1: { saat: "09:30 - 11:45", ders: "Genel Deneme", konu: "Süre Tutularak 90 Soruluk Tam LGS Denemesi", hedef: "90 Soru" },
        etut2: { saat: "13:30 - 15:00", ders: "Deneme Analizi", konu: "Yanlış/Boş Soruların Video Çözümleri", hedef: "20 Soru" },
        etut3: { saat: "15:30 - 17:00", ders: "Özel Telafi", konu: "Haftanın %100 Altında Kalan Eksik Kazanımları Karma Test", hedef: "40 Soru" },
        gunlukToplamSoru: 150
      },
      {
        gun: "Pazar",
        gunlukOdak: "Haftalık Tekrar & Dinlenme",
        etut1: { saat: "10:30 - 12:00", ders: "Hata Defteri", konu: "Hafta Boyunca Yanlış Yapılan Soruların Tekrarı", hedef: "30 Soru" },
        etut2: { saat: "12:30 - 14:00", ders: "Genel Tekrar", konu: "Haftalık Soru Hedefi Kontrolü & Değerlendirme", hedef: "20 Soru" },
        etut3: { saat: "14:00 Sonrası", ders: "Serbest Zaman", konu: "Zihinsel Dinlenme, Aile ve Sosyal Zaman", hedef: "0 Soru" },
        gunlukToplamSoru: 50
      }
    ];

    const kocTavsiyesi = recurringTopics.length > 0
      ? `Özellikle ${recurringTopics.length} adet sınavlar arası tekrar eden ortak eksik kazanım (${recurringTopics[0].ders} - ${recurringTopics[0].konu} vb.) acil telafi edilmeli, hata defterindeki sorular pazar günü mutlaka sıfır hata ile yeniden çözülmelidir.`
      : "Hafta boyu denemelerde ve testlerde yanlış yapılan her soru 'Hata Defteri'ne yapıştırılmalı ve pazar günü mutlaka yeniden çözülmelidir.";

    return {
      eksikKonular: eksikler,
      genelYorum,
      gelisimAnalizi,
      haftalikTablo,
      haftalikOzet: {
        toplamSoruHedefi: "565 Soru",
        toplamEtutSuresi: "21.5 Saat",
        denemeSayisi: "1 Tam LGS Denemesi + 2 Branş Denemesi",
        kitapOkuma: "120 dk Kitap + 100 Paragraf",
        kocTavsiyesi
      },
      _isSimulated: true
    };
  }
}
}
