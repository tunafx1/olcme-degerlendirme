# 🎓 Öğrenci Sınav Karnesi Analiz ve Raporlama Sistemi

Kurumlar, okullar ve etüt merkezleri için geliştirilmiş, **kazanım bazlı ölçme-değerlendirme**, **çoklu yapay zekâ eksik analizi**, **kişiselleştirilmiş haftalık ders çalışma programı oluşturma** ve **kurumsal PDF karne dışa aktarma** platformudur.

---

## 🌟 Öne Çıkan Özellikler

1. **Çoklu Sınav ve Kazanım Yönetimi:**
   - **Kazanımlı Sınav Girişi:** MEB & ÖSYM standart müfredatı (Türkçe, Matematik, Fen, İnkılap, İngilizce, Din Kültürü vb.) ile kazanım bazında Doğru/Yanlış/Boş girişi.
   - **Kazanımsız (Klasik) Sınav Girişi:** Hızlı ders bazlı net/puan hesaplama.
   - **Excel & CSV İçe Aktarma:** Excel dosyalarını tek tıkla yükleyip otomatik kazanım tablosuna dönüştürme.
   - **Çoklu Sınav Seçimi (Checkbox):** Birden fazla sınavı aynı anda seçip **karşılaştırmalı gelişim analizi** talep etme.

2. **Yapay Zekâ Entegrasyonu (Admin Panelinden Seçilebilir):**
   - **Google Gemini API** (Gemini 1.5 Flash / Pro / 2.0 Flash)
   - **OpenAI API** (GPT-4o / GPT-4o-mini)
   - **Anthropic Claude API** (Claude 3.5 Sonnet / Haiku)
   - **Yerleşik Pedagojik Simülasyon Motoru:** API anahtarı girilmediğinde bile çevrimdışı ve kesintisiz akıllı eksik konu analizi & haftalık çalışma programı üretimi.

3. **Yüksek Çözünürlüklü Kurumsal PDF Karnesi:**
   - Kurum logosu, kurum kodu, antet ve dinamik marka renkleri.
   - Net ve başarı yüzdesi tabloları.
   - Renkli önem rozetleriyle eksik konu ve telafi önerileri.
   - Psikolojik danışmanlık/rehberlik dilinde motive edici AI değerlendirme yorumu.
   - Gün gün, saat aralıklı ve soru hedefli haftalık çalışma programı tablosu.
   - Çoklu sınav gelişim grafiği ve trend yorumu.
   - Tek tıkla PDF İndirme (jsPDF) veya doğrudan tarayıcıdan yazdırma (Print).

4. **Kurum & Tema Özelleştirme:**
   - Kurum logosu yükleme (Firebase Storage veya Base64).
   - Canlı renk paleti seçici (tüm panel ve PDF renkleri anında seçilen kurumsal renge uyarlanır).
   - Canlı antet önizleme kutusu.

5. **Hibrit Veri Modeli:**
   - **Sıfır Kurulum / Yerel Mod:** Herhangi bir konfigürasyon yapmadan doğrudan tarayıcıda LocalStorage ile tam fonksiyonel çalışma.
   - **Firebase Bulut Modu:** `firebaseConfig` bilgileri girildiğinde otomatik olarak Firestore, Auth ve Storage ile senkronize olabilme.

---

## 🚀 Hızlı Başlangıç

### Yöntem 1: Doğrudan Tarayıcıda Açma (Sıfır Kurulum)
`index.html` dosyasını herhangi bir modern web tarayıcısında (Google Chrome, Microsoft Edge, Mozilla Firefox) çift tıklayarak açabilirsiniz.

### Yöntem 2: Yerel Sunucu ile Çalıştırma
Herhangi bir statik web sunucusu ile projeyi çalıştırabilirsiniz (örneğin VS Code Live Server veya npx serve):
```bash
npx serve .
```

---

## 🔑 API Anahtarları ve Yapılandırma

API anahtarlarınızı doğrudan uygulama içindeki **"AI Sağlayıcı Ayarları"** ve **"Firebase Yapılandırması"** menülerinden girebilir veya sunucuya dağıtırken `.env` dosyasını kullanabilirsiniz.

---

## 📄 Lisans
Bu proje eğitim kurumları ve ölçme-değerlendirme uzmanları için özel olarak geliştirilmiştir.
