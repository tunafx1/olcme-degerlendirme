# 🎓 Öğrenci Sınav Karnesi Analiz ve Raporlama Sistemi

Kurumlar, okullar ve etüt merkezleri için geliştirilmiş, **kazanım bazlı ölçme-değerlendirme**, **çoklu yapay zekâ eksik analizi**, **kişiselleştirilmiş haftalık ders çalışma programı oluşturma** ve **kurumsal PDF karne dışa aktarma** platformudur.

---

## 🌟 Öne Çıkan Özellikler

1. **Çoklu Sınav ve Kazanım Yönetimi:**
   - **PDF Karne İçe Aktarma:** Tek veya 70+ öğrencilik toplu sınav sonuç PDF'i yüklenir; öğrenci, ders netleri, LGS puanı ve kazanımlar otomatik ayrıştırılır (isteğe bağlı AI desteği).
   - **Sınav Yönetimi:** Aynı adlı sınavlar gruplanır; sınav birleştirme, yeniden adlandırma ve sınıf kademesi filtresi.
   - **Çoklu Sınav Seçimi (Checkbox):** Birden fazla sınavı aynı anda seçip **karşılaştırmalı gelişim analizi** ve tekrar eden (kronik) kazanım hataları talep etme.
   - **JSON Yedekleme:** Tüm verinin JSON olarak dışa/içe aktarımı.

2. **Yapay Zekâ Entegrasyonu (Admin Panelinden Seçilebilir):**
   - **Google Gemini API** (Gemini 2.5 Flash / Pro)
   - **OpenAI API** (GPT-4o / GPT-4o-mini)
   - **Anthropic Claude API** (Claude Sonnet 5.5 / Haiku 5.5)
   - **Yerleşik Pedagojik Simülasyon Motoru:** API anahtarı girilmediğinde veya AI çağrısı başarısız olduğunda devreye girer. Rapor, kullanılan motoru dürüstçe etiketler ve çağrı hatasında kullanıcı uyarılır.

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

API anahtarlarını uygulama içindeki **"AI Sağlayıcı Ayarları"** ve **"Firebase Yapılandırması"** menülerinden girin. Uygulamada derleme adımı olmadığından `.env` dosyası okunmaz; anahtarlar tarayıcının `localStorage` alanında saklanır.

---

## 📄 Lisans
Bu proje eğitim kurumları ve ölçme-değerlendirme uzmanları için özel olarak geliştirilmiştir.
