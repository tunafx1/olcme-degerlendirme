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

    let examSummary = exams
      .map((exam, index) => {
        let details = `\n--- SINAV ${index + 1}: ${exam.sinavAdi} (Tarih: ${exam.tarih}, Tür: ${exam.tur}, Toplam Net: ${exam.toplamNet || "Hesaplanmadı"}) ---`;
        if (exam.dersSonuclari && exam.dersSonuclari.length > 0) {
          exam.dersSonuclari.forEach((d) => {
            details += `\n* Ders: ${d.ders} | Doğru: ${d.dogru}, Yanlış: ${d.yanlis}, Boş: ${d.bos}, Net: ${d.net}`;
            if (d.konular && d.konular.length > 0) {
              const yanlislar = d.konular.filter((k) => k.durum === "yanlis").map((k) => k.kazanimAdi);
              const boslar = d.konular.filter((k) => k.durum === "bos").map((k) => k.kazanimAdi);
              if (yanlislar.length > 0) details += `\n  - Yanlış Yapılan Kazanımlar: ${yanlislar.join("; ")}`;
              if (boslar.length > 0) details += `\n  - Boş Bırakılan Kazanımlar: ${boslar.join("; ")}`;
            }
          });
        }
        return details;
      })
      .join("\n");

    return `Sen uzman bir Eğitim Koçu, Rehberlik Uzmanı ve Ölçme Değerlendirme Analistisin.
Aşağıda bilgileri ve sınav sonuçları verilen öğrenci için kapsamlı, pedagojik, teşvik edici ve bilimsel bir eksik analizi ve haftalık ders çalışma programı hazırla.

ÖĞRENCİ BİLGİLERİ:
- Adı Soyadı: ${student.adSoyad}
- Sınıf / Şube: ${student.sinif}. Sınıf (${student.sube})
- Öğrenci No: ${student.numara}

SINAV VERİLERİ:
${examSummary}

${isMultiExam ? "NOT: Birden fazla sınav seçilmiştir. Sınavlar arasındaki net artış/azalışlarını, gelişim seyrini ve kalıcı eksikleri 'gelisimAnalizi' alanında detaylandır." : ""}

GÖREVLERİN:
1. Öğrencinin sınav sonuçlarını analiz ederek eksik olduğu konu ve kazanımları önem derecesine göre grupla (kritik, orta, hafif). Her biri için kısa ve net bir çalışma önerisi belirt.
2. Öğrencinin genel performansını değerlendiren, rehberlik ve psikolojik danışmanlık diline uygun, motive edici, veli ve öğrenciye hitap eden yapıcı bir 'genelYorum' metni yaz.
3. Tespit edilen eksik konulara öncelik veren, Pazartesi'den Pazar'a kadar gün gün, saat aralıklı, ders, konu ve hedef soru sayısını içeren kişiselleştirilmiş 10-14 maddelik 'calismaProgrami' oluştur.

YANIT FORMATI:
Lütfen yanıtını SADECE geçerli bir JSON nesnesi olarak ver (Markdown backtick dışında ekstra hiçbir açıklama metni yazma).
JSON Formatı:
{
  "eksikKonular": [
    { "ders": "Matematik", "konu": "Doğrusal Denklemler", "seviye": "kritik", "oneri": "Eğim ve grafik çizim odaklı 40 soru" }
  ],
  "genelYorum": "Metin...",
  "gelisimAnalizi": "${isMultiExam ? "Sınavlar arası karşılaştırma ve trend yorumu..." : ""}",
  "calismaProgrami": [
    { "gun": "Pazartesi", "saat": "17:30 - 18:45", "ders": "Matematik", "konu": "Doğrusal Denklemler Konu Tekrarı", "hedefSoru": 30 }
  ]
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

    const eksikKonular = [];
    const dersBasariMap = {};

    // Sınavlardaki yanlış ve boşları topla
    exams.forEach((exam) => {
      (exam.dersSonuclari || []).forEach((d) => {
        if (!dersBasariMap[d.ders]) {
          dersBasariMap[d.ders] = { dogru: 0, yanlis: 0, bos: 0, net: 0, count: 0, konular: [] };
        }
        dersBasariMap[d.ders].dogru += Number(d.dogru) || 0;
        dersBasariMap[d.ders].yanlis += Number(d.yanlis) || 0;
        dersBasariMap[d.ders].bos += Number(d.bos) || 0;
        dersBasariMap[d.ders].net += Number(d.net) || 0;
        dersBasariMap[d.ders].count++;

        if (d.konular && d.konular.length > 0) {
          d.konular.forEach((k) => {
            if (k.durum === "yanlis" || k.durum === "bos") {
              dersBasariMap[d.ders].konular.push({
                konu: k.kazanimAdi,
                durum: k.durum,
                ders: d.ders
              });
            }
          });
        }
      });
    });

    // Eksik konuları önem derecesine göre belirle
    Object.keys(dersBasariMap).forEach((dersAdi) => {
      const info = dersBasariMap[dersAdi];
      const avgNet = info.net / info.count;
      const wrongRatio = info.yanlis / Math.max(1, info.dogru + info.yanlis + info.bos);

      if (info.konular.length > 0) {
        info.konular.forEach((k, idx) => {
          let seviye = "orta";
          let oneri = "Kavram tekrarı ve 30 pekiştirme sorusu";

          if (k.durum === "yanlis" && (wrongRatio > 0.3 || idx === 0)) {
            seviye = "kritik";
            oneri = "Özet konu anlatım föyü + video soru çözümü + 45 yeni nesil soru";
          } else if (k.durum === "bos") {
            seviye = "orta";
            oneri = "Temel kavram haritası çıkarma ve 25 rehber soru çözümü";
          } else {
            seviye = "hafif";
            oneri = "Haftalık tarama testlerinde bu kazanıma öncelik verilmesi";
          }

          eksikKonular.push({
            ders: k.ders,
            konu: k.konu,
            seviye: seviye,
            oneri: oneri
          });
        });
      } else {
        // Kazanımsız sınav veya eşleşmemiş ders ise (yanlış veya boş varsa MUTLAKA eksik konu üret)
        if (info.yanlis > 0 || info.bos > 0 || wrongRatio > 0.1 || avgNet < 10) {
          eksikKonular.push({
            ders: dersAdi,
            konu: `${dersAdi}: Eksik Soru & Kavram Analizi`,
            seviye: (info.yanlis > 1 || wrongRatio > 0.25) ? "kritik" : "orta",
            oneri: `Haftalık ${dersAdi} dersine ayrılan sürenin artırılması ve kademeli pekiştirme testleri çözümü`
          });
        }
      }
    });

    // En fazla 7-8 kritik/orta eksik göster
    const sortedEksikler = eksikKonular
      .sort((a, b) => (a.seviye === "kritik" ? -1 : 1))
      .slice(0, 7);

    // Genel Yorum Oluştur
    let genelYorum = `Sevgili ${student.adSoyad}, `;
    if (isMulti) {
      const netFark = (latestExam.toplamNet || 0) - (firstExam.toplamNet || 0);
      if (netFark >= 0) {
        genelYorum += `uygulanan ${exams.length} sınav boyunca gösterdiğin performans incelendiğinde netlerinde **+${netFark.toFixed(2)} netlik istikrarlı bir yükseliş** kaydedildiği görülmektedir. Özellikle temel kavramları kavramadaki kararlılığın ve soru çözme hızın dikkat çekmektedir. `;
      } else {
        genelYorum += `yapılan son deneme sınavlarında dalgalanmalar gözlemlenmiştir. Bu durum konu eksiklerinden ziyade sınav anı odaklanması ve soru analiz sürecindeki acelecilikten kaynaklanmaktadır. `;
      }
    } else {
      genelYorum += `"${latestExam.sinavAdi}" sonuçların titizlikle incelenmiştir. Mevcut başarı ortalaman hedeflerine ulaşmak için güçlü bir temele sahip olduğunu göstermektedir. `;
    }

    genelYorum += `Tespit edilen eksik kazanımlara yönelik hazırlanan haftalık çalışma programına ve soru hedeflerine özenle uyduğun takdirde bir sonraki sınavda çok daha yüksek bir başarı çıtasına ulaşacağın kesindir. Başarılarının devamını dileriz.`;

    // Gelişim Analizi Metni (Çoklu Sınav için)
    let gelisimAnalizi = "";
    if (isMulti) {
      gelisimAnalizi = `İlk sınav (${firstExam.sinavAdi}) toplam neti ${firstExam.toplamNet || "-"} iken, son sınavda (${latestExam.sinavAdi}) net ${latestExam.toplamNet || "-"} olarak gerçekleşmiştir. Süreç içinde yanlış yapılan konuların bir kısmında belirgin telafi sağlanmış, kalan eksikler ise hazırlanan çalışma programına öncelikli olarak dağıtılmıştır.`;
    }

    // Haftalık Çalışma Programı
    const calismaProgrami = [
      { gun: "Pazartesi", saat: "17:30 - 18:45", ders: sortedEksikler[0]?.ders || "Matematik", konu: sortedEksikler[0]?.konu || "Konu Tekrarı & Pekiştirme", hedefSoru: 30 },
      { gun: "Pazartesi", saat: "19:00 - 20:00", ders: "Türkçe", konu: "Paragrafta Anlam ve Hızlı Okuma Egzersizleri", hedefSoru: 35 },
      { gun: "Salı", saat: "17:30 - 18:45", ders: sortedEksikler[1]?.ders || "Fen Bilimleri", konu: sortedEksikler[1]?.konu || "Kavram Haritası & Video Çözüm", hedefSoru: 30 },
      { gun: "Salı", saat: "19:00 - 20:00", ders: "İngilizce", konu: "Hedef Ünite Kelime Kartları & Diyalog Tamamlama", hedefSoru: 25 },
      { gun: "Çarşamba", saat: "17:30 - 19:00", ders: sortedEksikler[2]?.ders || "Matematik", konu: sortedEksikler[2]?.konu || "Yeni Nesil Problem Pratiği", hedefSoru: 35 },
      { gun: "Çarşamba", saat: "19:15 - 20:15", ders: "T.C. İnkılap Tarihi", konu: "Dönem Olayları ve Harita Yorumlama Testi", hedefSoru: 30 },
      { gun: "Perşembe", saat: "17:30 - 18:45", ders: sortedEksikler[3]?.ders || "Fen Bilimleri", konu: sortedEksikler[3]?.konu || "Deney Föyleri ve Karma Test Çözümü", hedefSoru: 35 },
      { gun: "Perşembe", saat: "19:00 - 20:00", ders: "Matematik", konu: "Hata Defterindeki Soruların Yeniden Çözümü", hedefSoru: 25 },
      { gun: "Cuma", saat: "17:30 - 19:00", ders: "Türkçe & Din K.", konu: "Sözel Mantık Çıkarımları ve Branş Denemesi", hedefSoru: 40 },
      { gun: "Cumartesi", saat: "10:00 - 12:30", ders: "Genel Deneme", konu: "Gerçek Sınav Provası (Süre Tutularak Tam Deneme)", hedefSoru: 90 },
      { gun: "Cumartesi", saat: "14:30 - 16:00", ders: "Analiz & Telafi", konu: "Deneme Sınavındaki Hatalı/Boş Soruların İncelenmesi", hedefSoru: 0 },
      { gun: "Pazar", saat: "11:00 - 13:00", ders: "Haftalık Değerlendirme", konu: "Haftalık Soru Hedeflerinin Kontrolü & Dinlenme", hedefSoru: 20 }
    ];

    return {
      eksikKonular: sortedEksikler.length > 0 ? sortedEksikler : [
        { ders: "Matematik", konu: "Genel Problem Çözümü", seviye: "orta", oneri: "Haftalık 50 soru çözümü" },
        { ders: "Türkçe", konu: "Paragraf Yorumlama", seviye: "hafif", oneri: "Günlük 20 paragraf sorusu" }
      ],
      genelYorum,
      gelisimAnalizi,
      calismaProgrami,
      _isSimulated: true
    };
  }
}
