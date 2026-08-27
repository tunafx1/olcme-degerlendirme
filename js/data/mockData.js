/**
 * Zengin Başlangıç / Demo Verileri
 */

export const DEFAULT_INSTITUTION = {
  id: "kurum_default",
  ad: "Atabey Eğitim Kurumları",
  kurumKodu: "ATB-2026-94",
  adres: "Mustafa Kemal Mah. 2118. Cad. No: 14 Çankaya / Ankara",
  telefon: "+90 (312) 444 0 999",
  email: "iletisim@atabeyegitim.k12.tr",
  web: "www.atabeyegitim.k12.tr",
  temaRengi: "#2563eb",
  ikincilRenk: "#0f172a",
  vurguRengi: "#38bdf8",
  logoUrl: "" // Boş ise sistem vektörel logoyu dinamik render eder
};

export const DEFAULT_AI_CONFIG = {
  provider: "openai", // "gemini" | "openai" | "claude"
  geminiApiKey: "",
  geminiModel: "gemini-1.5-flash",
  openaiApiKey: "",
  openaiModel: "gpt-4o-mini",
  claudeApiKey: "",
  claudeModel: "claude-3-5-sonnet-20241022",
  temperature: 0.7,
  simulationMode: false
};

export const MOCK_STUDENTS = [
  {
    id: "ogr_1",
    adSoyad: "Ali Kerem Kaya",
    sinif: "8",
    sube: "8-A",
    numara: "412",
    veliAdSoyad: "Mehmet Kaya",
    veliTelefon: "+90 532 111 22 33",
    olusturmaTarihi: "2026-08-01"
  },
  {
    id: "ogr_2",
    adSoyad: "Zeynep Sena Yıldız",
    sinif: "8",
    sube: "8-B",
    numara: "518",
    veliAdSoyad: "Fatma Yıldız",
    veliTelefon: "+90 533 222 33 44",
    olusturmaTarihi: "2026-08-02"
  },
  {
    id: "ogr_3",
    adSoyad: "Emirhan Demir",
    sinif: "12",
    sube: "12-SAY",
    numara: "104",
    veliAdSoyad: "Mustafa Demir",
    veliTelefon: "+90 542 333 44 55",
    olusturmaTarihi: "2026-08-03"
  },
  {
    id: "ogr_4",
    adSoyad: "Elif Nur Çelik",
    sinif: "11",
    sube: "11-EA",
    numara: "231",
    veliAdSoyad: "Ahmet Çelik",
    veliTelefon: "+90 505 444 55 66",
    olusturmaTarihi: "2026-08-04"
  },
  {
    id: "ogr_5",
    adSoyad: "Burak Arda Şahin",
    sinif: "8",
    sube: "8-A",
    numara: "345",
    veliAdSoyad: "Gülten Şahin",
    veliTelefon: "+90 555 555 66 77",
    olusturmaTarihi: "2026-08-05"
  }
];

export const MOCK_EXAMS = [
  {
    id: "snv_1",
    ogrenciId: "ogr_1",
    kurumId: "kurum_default",
    sinavAdi: "1. Kurumsal LGS Deneme Sınavı",
    tarih: "2026-08-05",
    tur: "kazanimli",
    toplamSoru: 90,
    toplamNet: 64.67,
    puan: 412.50,
    dersSonuclari: [
      {
        ders: "Türkçe",
        dogru: 17,
        yanlis: 3,
        bos: 0,
        net: 16.00,
        konular: [
          { kazanimAdi: "Sözcükte Anlam — Gerçek ve mecaz anlam ayrımı", durum: "dogru" },
          { kazanimAdi: "Cümlede Anlam — Örtük anlam ve neden-sonuç", durum: "dogru" },
          { kazanimAdi: "Paragrafta Anlam — Yardımcı düşünce ve ana fikir", durum: "yanlis" },
          { kazanimAdi: "Fiilimsiler — Zarf-fiil ve sıfat-fiil görevleri", durum: "yanlis" },
          { kazanimAdi: "Cümlenin Ögeleri — Vurgulanan öge tespiti", durum: "yanlis" },
          { kazanimAdi: "Yazım Kuralları ve Noktalama", durum: "dogru" },
          { kazanimAdi: "Sözel Mantık & Muhakeme", durum: "dogru" }
        ]
      },
      {
        ders: "Matematik",
        dogru: 12,
        yanlis: 6,
        bos: 2,
        net: 10.00,
        konular: [
          { kazanimAdi: "Çarpanlar ve Katlar — EBOB/EKOK yeni nesil problemler", durum: "dogru" },
          { kazanimAdi: "Üslü İfadeler — Bilimsel gösterim ve üs işlemleri", durum: "dogru" },
          { kazanimAdi: "Kareköklü İfadeler — Karekök içinde toplama ve yaklaşık değer", durum: "yanlis" },
          { kazanimAdi: "Veri Analizi — Daire grafiği sütun dönüşümleri", durum: "dogru" },
          { kazanimAdi: "Cebirsel İfadeler ve Özdeşlikler — Tam kare modellemeleri", durum: "yanlis" },
          { kazanimAdi: "Doğrusal Denklemler — Eğim ve denklem kurma", durum: "yanlis" },
          { kazanimAdi: "Eşitsizlikler — Günlük hayat eşitsizlik problemleri", durum: "bos" },
          { kazanimAdi: "Üçgenler — Pisagor bağıntısı ve kenarortay", durum: "yanlis" },
          { kazanimAdi: "Dönüşüm Geometrisi — Yansıma ve öteleme", durum: "bos" }
        ]
      },
      {
        ders: "Fen Bilimleri",
        dogru: 16,
        yanlis: 4,
        bos: 0,
        net: 14.67,
        konular: [
          { kazanimAdi: "Mevsimler ve İklim — Eksen eğikliği ve gölge boyu", durum: "dogru" },
          { kazanimAdi: "DNA ve Genetik Kod — Çaprazlama olasılıkları", durum: "dogru" },
          { kazanimAdi: "Basınç — Sıvı basıncında derinlik ve yoğunluk grafikleri", durum: "yanlis" },
          { kazanimAdi: "Madde ve Endüstri — Asit-baz tepkimeleri ve pH cetveli", durum: "yanlis" },
          { kazanimAdi: "Basit Makineler — Eğik düzlemde kuvvet kazancı", durum: "dogru" },
          { kazanimAdi: "Enerji Dönüşümleri — Fotosentez hızını etkileyen faktörler", durum: "yanlis" }
        ]
      },
      {
        ders: "T.C. İnkılap Tarihi",
        dogru: 9,
        yanlis: 1,
        bos: 0,
        net: 8.67,
        konular: [
          { kazanimAdi: "Bir Kahraman Doğuyor — Mustafa Kemal'in fikir dünyası", durum: "dogru" },
          { kazanimAdi: "Milli Uyanış — Amasya ve Erzurum genelgeleri", durum: "yanlis" },
          { kazanimAdi: "Milli Bir Destan — Sakarya ve Büyük Taarruz", durum: "dogru" }
        ]
      },
      {
        ders: "Din Kültürü ve Ahlak Bilgisi",
        dogru: 9,
        yanlis: 1,
        bos: 0,
        net: 8.67,
        konular: [
          { kazanimAdi: "Kader İnancı — İrade ve sorumluluk", durum: "dogru" },
          { kazanimAdi: "Zekat ve Sadaka — Kimlere zekat verilir", durum: "yanlis" },
          { kazanimAdi: "Din ve Hayat — Temel hak ve hürriyetler", durum: "dogru" }
        ]
      },
      {
        ders: "İngilizce",
        dogru: 8,
        yanlis: 2,
        bos: 0,
        net: 7.33,
        konular: [
          { kazanimAdi: "Friendship — Making and accepting invitations", durum: "dogru" },
          { kazanimAdi: "Teen Life — Personal preferences and daily chores", durum: "yanlis" },
          { kazanimAdi: "The Internet — Internet safety rules", durum: "yanlis" },
          { kazanimAdi: "In the Kitchen — Recipes and sequencing words", durum: "dogru" }
        ]
      }
    ]
  },
  {
    id: "snv_2",
    ogrenciId: "ogr_1",
    kurumId: "kurum_default",
    sinavAdi: "2. Türkiye Geneli LGS Deneme Sınavı",
    tarih: "2026-08-18",
    tur: "kazanimli",
    toplamSoru: 90,
    toplamNet: 72.33,
    puan: 438.20,
    dersSonuclari: [
      {
        ders: "Türkçe",
        dogru: 19,
        yanlis: 1,
        bos: 0,
        net: 18.67,
        konular: [
          { kazanimAdi: "Sözcükte Anlam — Gerçek ve mecaz anlam ayrımı", durum: "dogru" },
          { kazanimAdi: "Cümlede Anlam — Örtük anlam ve neden-sonuç", durum: "dogru" },
          { kazanimAdi: "Paragrafta Anlam — Yardımcı düşünce ve ana fikir", durum: "dogru" },
          { kazanimAdi: "Fiilimsiler — Zarf-fiil ve sıfat-fiil görevleri", durum: "dogru" },
          { kazanimAdi: "Cümlenin Ögeleri — Vurgulanan öge tespiti", durum: "yanlis" },
          { kazanimAdi: "Yazım Kuralları ve Noktalama", durum: "dogru" },
          { kazanimAdi: "Sözel Mantık & Muhakeme", durum: "dogru" }
        ]
      },
      {
        ders: "Matematik",
        dogru: 15,
        yanlis: 4,
        bos: 1,
        net: 13.67,
        konular: [
          { kazanimAdi: "Çarpanlar ve Katlar — EBOB/EKOK yeni nesil problemler", durum: "dogru" },
          { kazanimAdi: "Üslü İfadeler — Bilimsel gösterim ve üs işlemleri", durum: "dogru" },
          { kazanimAdi: "Kareköklü İfadeler — Karekök içinde toplama ve yaklaşık değer", durum: "dogru" },
          { kazanimAdi: "Veri Analizi — Daire grafiği sütun dönüşümleri", durum: "dogru" },
          { kazanimAdi: "Cebirsel İfadeler ve Özdeşlikler — Tam kare modellemeleri", durum: "yanlis" },
          { kazanimAdi: "Doğrusal Denklemler — Eğim ve denklem kurma", durum: "yanlis" },
          { kazanimAdi: "Eşitsizlikler — Günlük hayat eşitsizlik problemleri", durum: "dogru" },
          { kazanimAdi: "Üçgenler — Pisagor bağıntısı ve kenarortay", durum: "yanlis" },
          { kazanimAdi: "Dönüşüm Geometrisi — Yansıma ve öteleme", durum: "bos" }
        ]
      },
      {
        ders: "Fen Bilimleri",
        dogru: 18,
        yanlis: 2,
        bos: 0,
        net: 17.33,
        konular: [
          { kazanimAdi: "Mevsimler ve İklim — Eksen eğikliği ve gölge boyu", durum: "dogru" },
          { kazanimAdi: "DNA ve Genetik Kod — Çaprazlama olasılıkları", durum: "dogru" },
          { kazanimAdi: "Basınç — Sıvı basıncında derinlik ve yoğunluk grafikleri", durum: "dogru" },
          { kazanimAdi: "Madde ve Endüstri — Asit-baz tepkimeleri ve pH cetveli", durum: "yanlis" },
          { kazanimAdi: "Basit Makineler — Eğik düzlemde kuvvet kazancı", durum: "dogru" },
          { kazanimAdi: "Enerji Dönüşümleri — Fotosentez hızını etkileyen faktörler", durum: "yanlis" }
        ]
      },
      {
        ders: "T.C. İnkılap Tarihi",
        dogru: 10,
        yanlis: 0,
        bos: 0,
        net: 10.00,
        konular: [
          { kazanimAdi: "Bir Kahraman Doğuyor — Mustafa Kemal'in fikir dünyası", durum: "dogru" },
          { kazanimAdi: "Milli Uyanış — Amasya ve Erzurum genelgeleri", durum: "dogru" },
          { kazanimAdi: "Milli Bir Destan — Sakarya ve Büyük Taarruz", durum: "dogru" }
        ]
      },
      {
        ders: "Din Kültürü ve Ahlak Bilgisi",
        dogru: 9,
        yanlis: 1,
        bos: 0,
        net: 8.67,
        konular: [
          { kazanimAdi: "Kader İnancı — İrade ve sorumluluk", durum: "dogru" },
          { kazanimAdi: "Zekat ve Sadaka — Kimlere zekat verilir", durum: "dogru" },
          { kazanimAdi: "Din ve Hayat — Temel hak ve hürriyetler", durum: "yanlis" }
        ]
      },
      {
        ders: "İngilizce",
        dogru: 5,
        yanlis: 3,
        bos: 2,
        net: 4.00,
        konular: [
          { kazanimAdi: "Friendship — Making and accepting invitations", durum: "dogru" },
          { kazanimAdi: "Teen Life — Personal preferences and daily chores", durum: "yanlis" },
          { kazanimAdi: "The Internet — Internet safety rules", durum: "yanlis" },
          { kazanimAdi: "In the Kitchen — Recipes and sequencing words", durum: "yanlis" }
        ]
      }
    ]
  },
  {
    id: "snv_3",
    ogrenciId: "ogr_3",
    kurumId: "kurum_default",
    sinavAdi: "1. TYT Başarı Değerlendirme Sınavı",
    tarih: "2026-08-12",
    tur: "kazanimli",
    toplamSoru: 120,
    toplamNet: 88.75,
    puan: 395.40,
    dersSonuclari: [
      {
        ders: "Türkçe",
        dogru: 34,
        yanlis: 5,
        bos: 1,
        net: 32.75,
        konular: [
          { kazanimAdi: "Paragrafta Anlam & Yapı", durum: "yanlis" },
          { kazanimAdi: "Cümlenin Ögeleri", durum: "yanlis" },
          { kazanimAdi: "Yazım Kuralları ve Noktalama", durum: "dogru" }
        ]
      },
      {
        ders: "Matematik",
        dogru: 28,
        yanlis: 8,
        bos: 4,
        net: 26.00,
        konular: [
          { kazanimAdi: "Problemler — Yaş ve İşçi Problemleri", durum: "yanlis" },
          { kazanimAdi: "Fonksiyonlar — Bileşke ve Ters Fonksiyon", durum: "yanlis" },
          { kazanimAdi: "Kümeler ve Sayma Olasılık", durum: "yanlis" }
        ]
      },
      {
        ders: "Fen Bilimleri",
        dogru: 16,
        yanlis: 4,
        bos: 0,
        net: 15.00,
        konular: [
          { kazanimAdi: "Fizik — Elektrik ve Manyetizma", durum: "yanlis" },
          { kazanimAdi: "Kimya — Maddenin Halleri ve Karışımlar", durum: "dogru" },
          { kazanimAdi: "Biyoloji — Hücre Bölünmeleri ve Kalıtım", durum: "yanlis" }
        ]
      },
      {
        ders: "T.C. İnkılap Tarihi",
        dogru: 16,
        yanlis: 4,
        bos: 0,
        net: 15.00,
        konular: [
          { kazanimAdi: "Tarih — İlk Türk Devletleri ve İslam Medeniyeti", durum: "dogru" },
          { kazanimAdi: "Coğrafya — İklim Tipleri ve Harita Bilgisi", durum: "yanlis" },
          { kazanimAdi: "Felsefe — Bilgi ve Ahlak Felsefesi", durum: "dogru" }
        ]
      }
    ]
  }
];

export const MOCK_REPORTS = [
  {
    id: "rep_1",
    ogrenciId: "ogr_1",
    ogrenciAdSoyad: "Ali Kerem Kaya",
    sinif: "8-A",
    numara: "412",
    kurumId: "kurum_default",
    kullanilanSinavIdler: ["snv_1", "snv_2"],
    sinavAdlari: ["1. Kurumsal LGS Deneme Sınavı", "2. Türkiye Geneli LGS Deneme Sınavı"],
    aiSaglayici: "Google Gemini 1.5 Pro",
    olusturmaTarihi: "2026-08-19",
    ozetNetler: {
      "1. Kurumsal LGS Deneme Sınavı": 64.67,
      "2. Türkiye Geneli LGS Deneme Sınavı": 72.33
    },
    eksikKonular: [
      { ders: "Matematik", konu: "Doğrusal Denklemler (Eğim ve Koordinat Sistemi)", seviye: "kritik", oneri: "Kavram haritası ve grafik çizim odaklı 50 soru çözümü" },
      { ders: "Matematik", konu: "Cebirsel İfadeler ve Özdeşlikler", seviye: "kritik", oneri: "Geometrik modelleme egzersizleri yapılmalı" },
      { ders: "Fen Bilimleri", konu: "Madde ve Endüstri (Asit-Baz Tepkimeleri / pH)", seviye: "orta", oneri: "Deney föyleri ve ayıraç tablosu tekrar edilmeli" },
      { ders: "İngilizce", konu: "The Internet & Teen Life (Kelime ve Kalıplar)", seviye: "orta", oneri: "Hedef kelime kartları ile günlük 15 dk tekrar" },
      { ders: "Türkçe", konu: "Cümlenin Ögeleri (Vurgu ve Ara Söz)", seviye: "hafif", oneri: "Örnek cümle çözümlemeleri ve 30 pekiştirme sorusu" }
    ],
    genelYorum: "Sevgili Ali Kerem Kaya, son iki deneme sınavı karşılaştırıldığında netlerinde **+7.66 netlik belirgin bir artış** gözlenmiştir. Özellikle Türkçe dersinde okuduğunu anlama ve fiilimsiler konusundaki toparlanma takdire şayandır. Matematik dersinde Kareköklü İfadeler ve Veri Analizi kazanımları başarıyla pekiştirilmiş olmakla birlikte, Doğrusal Denklemler ve Cebirsel İfadeler gibi üst düzey soyutlama gerektiren konularda hata tekrarı sürmektedir. Fen Bilimlerinde ise asit-baz tepkimelerindeki kavram yanılgıları giderildiğinde toplam netin 80 bandının üzerine rahatlıkla çıkacağı öngörülmektedir. Motivasyonunu yüksek tutarak aşağıdaki haftalık plana sadık kalman hedeflerine ulaşmanda belirleyici olacaktır.",
    gelisimAnalizi: "1. Denemede 64.67 olan toplam net, 2. Denemede 72.33'e yükselmiştir. Matematik neti 10.00'dan 13.67'ye (+3.67), Türkçe neti 16.00'dan 18.67'ye (+2.67), Fen neti 14.67'den 17.33'e (+2.66) yükselmiştir. İngilizce dersinde ise dikkat dağınıklığı kaynaklı bir düşüş (-3.33) görülmüş olup bu alana ek okuma parçaları eklenmiştir.",
    calismaProgrami: [
      { gun: "Pazartesi", saat: "17:30 - 18:45", ders: "Matematik", konu: "Doğrusal Denklemler ve Eğim Konu Tekrarı + Video Çözüm", hedefSoru: 30 },
      { gun: "Pazartesi", saat: "19:00 - 20:00", ders: "Türkçe", konu: "Cümlenin Ögeleri ve Vurgu Soru Çözümü", hedefSoru: 35 },
      { gun: "Salı", saat: "17:30 - 18:45", ders: "Fen Bilimleri", konu: "Asitler, Bazlar ve Tuzlar / pH Cetveli Kavram Tekrarı", hedefSoru: 30 },
      { gun: "Salı", saat: "19:00 - 20:00", ders: "İngilizce", konu: "The Internet Ünitesi Kelime Çalışması + Paragraf Soruları", hedefSoru: 25 },
      { gun: "Çarşamba", saat: "17:30 - 19:00", ders: "Matematik", konu: "Cebirsel İfadeler ve Özdeşlikler Yeni Nesil Soru Pratiği", hedefSoru: 35 },
      { gun: "Çarşamba", saat: "19:15 - 20:15", ders: "T.C. İnkılap Tarihi", konu: "Genel Tekrar ve Kavram Tarama Testi", hedefSoru: 30 },
      { gun: "Perşembe", saat: "17:30 - 18:45", ders: "Fen Bilimleri", konu: "Madde ve Endüstri Karma Test Çözümü", hedefSoru: 35 },
      { gun: "Perşembe", saat: "19:00 - 20:00", ders: "Matematik", konu: "Eşitsizlikler ve Doğrusal İlişkiler Pekiştirme", hedefSoru: 25 },
      { gun: "Cuma", saat: "17:30 - 19:00", ders: "Türkçe & Din K.", konu: "Sözel Mantık Egzersizleri ve Din Kültürü Denemesi", hedefSoru: 40 },
      { gun: "Cumartesi", saat: "10:00 - 12:30", ders: "Genel Deneme", konu: "Süre Tutularak 90 Soruluk Tam Kapsamlı LGS Denemesi", hedefSoru: 90 },
      { gun: "Cumartesi", saat: "14:30 - 16:00", ders: "Analiz & Telafi", konu: "Denemedeki Hatalı Soruların Öğretmenle / Video ile Çözümü", hedefSoru: 0 },
      { gun: "Pazar", saat: "11:00 - 13:00", ders: "Haftalık Tekrar", konu: "Hafta Boyunca Yapılan Hataların Defterden Tekrarı & Serbest Dinlenme", hedefSoru: 20 }
    ]
  }
];
