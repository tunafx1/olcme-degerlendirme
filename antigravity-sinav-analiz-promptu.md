# Antigravity (Gemini) Build Promptu — Öğrenci Sınav Karnesi Analiz ve Raporlama Sistemi

Bu metni Antigravity'de Gemini'ye ilk mesaj olarak ver. Prompt, Gemini'nin işe başlamadan önce senden gerekli tüm bilgileri (API anahtarları, veritabanı bağlantısı, kurum bilgileri vb.) sırayla sormasını zorunlu kılacak şekilde yazıldı.

---

## PROMPT (kopyala-yapıştır)

Benim için bir eğitim kurumu yönetim paneli uygulaması geliştir. Uygulamanın adı **[Kurum Adı] Sınav Analiz Sistemi** olacak.

**ÖNEMLİ — İşe başlamadan önce yapman gereken:** Kod yazmaya başlamadan önce, projeyi kurmak için ihtiyaç duyacağın tüm bilgileri, anahtarları ve kararları benden sırayla iste. Varsayım yaparak ilerleme, eksik bir bilgi varsa mutlaka sor. Aşağıdaki listeyi bir kontrol listesi gibi kullan ve eksik olan her şeyi bana tek tek veya gruplar halinde sor:

1. **Firebase projesi bilgileri:** Yeni bir Firebase projesi mi oluşturacağım, yoksa mevcut bir proje mi kullanacağım? Mevcut ise `firebaseConfig` (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId) bilgilerini benden iste.
2. **AI sağlayıcı API anahtarı:** Hangi AI sağlayıcısını (Google Gemini API, OpenAI API, Anthropic Claude API) varsayılan olarak kullanmamı istediğimi sor ve o sağlayıcının API anahtarını benden iste. Sistemi birden fazla sağlayıcı arasında admin panelinden seçilebilir yapacaksan bile, geliştirme/test aşaması için en az bir anahtara ihtiyacın olduğunu belirt.
3. **Kurum bilgileri:** Kurum adı, adresi, telefonu, kurum kodu, tema/marka rengi (hex kod), ve varsa kurum logosu (dosya olarak).
4. **Kimlik doğrulama:** Firebase Authentication için e-posta/şifre girişini mi kullanacağız, yoksa başka bir yöntem (Google girişi vb.) de eklemem gerekiyor mu?
5. **Barındırma/dağıtım tercihi:** Uygulamayı nerede yayınlamamı istiyorsun (Firebase Hosting, Vercel, başka bir yer) ve buna dair bir hesap/anahtar gerekiyor mu?
6. **Örnek veri:** Test amaçlı örnek öğrenci ve sınav verisi oluşturmamı ister misin, yoksa gerçek veriyle mi başlayacağız?
7. **Ek entegrasyonlar:** E-posta gönderimi (örn. veliye rapor gönderme), SMS bildirimi gibi ek bir servis istiyor musun? İstiyorsan ilgili API anahtarını sor.

Bu bilgileri aldıktan sonra, eksik kalan başka teknik bir detay (ör. PDF şablonunun tam rengi, çalışma programının gün sayısı vb.) ortaya çıkarsa, ilerleme sırasında da bana sormaya devam et — hiçbir zaman sessizce varsayım yapıp geçme.

### 1. Genel Amaç
Kurumdaki öğrencilerin sınav sonuçlarını (kazanım bazlı veya kazanımsız/sadece net-puan bazlı) sisteme yükleyip, seçilebilir bir yapay zeka API bağlantısı üzerinden öğrencinin eksik olduğu konuları tespit eden, bu eksiklere yönelik haftalık ders çalışma programı ve genel değerlendirme yorumu üreten, sonucu kurum logolu ve renkli tasarımlı bir PDF olarak dışa aktarabilen bir web uygulaması istiyorum.

### 2. Kullanıcı Rolleri
- **Admin (Kurum Yöneticisi):** Tüm öğrencileri, sınavları, AI ayarlarını ve kurum bilgilerini yönetir.
- **Öğretmen (opsiyonel rol):** Sadece kendi öğrencilerinin sınavlarını yükleyip rapor alabilir.
- Giriş sistemi Firebase Authentication (e-posta/şifre) ile yapılacak.

### 3. Kurum Ayarları Modülü
- Kurum adı, adresi, telefon, kurum kodu gibi bilgilerin girildiği bir ayarlar ekranı.
- Kurum logosunun bilgisayardan (PC) dosya seçilerek yüklenebilmesi (Firebase Storage'a kaydedilecek).
- Bu logo ve kurum bilgileri, oluşturulan tüm PDF raporların üst kısmında (header/antet) otomatik görünecek.
- Kurumun tema rengi (örn. ana renk, vurgu rengi) seçilebilir olsun, PDF ve panel tasarımı bu renge göre uyarlansın.

### 4. Öğrenci ve Sınav Yönetimi
- Öğrenci ekleme/düzenleme/silme (ad, soyad, sınıf, şube, öğrenci no).
- Sınav sonucu yükleme ekranı, iki modu desteklemeli:
  - **Kazanım bazlı yükleme:** Ders → Konu → Kazanım → Doğru/Yanlış/Boş bilgisi girilebilen tablo yapısı (manuel giriş veya Excel/CSV içe aktarma).
  - **Kazanımsız (klasik) yükleme:** Sadece ders bazında net, doğru, yanlış, boş sayıları.
- Aynı öğrenciye ait birden fazla sınav kaydı tarih sırasına göre listelenebilmeli.
- Sınav listesinden **çoklu seçim** yapılabilmeli (checkbox ile 2 veya daha fazla sınav seçip birleşik/karşılaştırmalı rapor talep edilebilmeli).

### 5. Yapay Zeka Entegrasyonu (Admin Panelinden Seçilebilir)
- Admin panelinde bir "AI Sağlayıcı Ayarları" ekranı olsun.
- Buradan hangi AI API'sinin kullanılacağı seçilebilsin (örn. Google Gemini API, OpenAI API, Anthropic Claude API) ve ilgili API anahtarı güvenli şekilde girilebilsin.
- Seçilen AI sağlayıcısına, öğrencinin sınav verileri (kazanım bazlı ise kazanım kırılımı, değilse ders/net verisi) gönderilerek şu çıktılar istenecek:
  1. **Eksik konu/kazanım tespiti** — öğrencinin hangi derste hangi konularda zayıf olduğu.
  2. **Genel değerlendirme yorumu** — öğrencinin genel performansı hakkında öğretmen/veli diline uygun, yapıcı bir metin yorum.
  3. **Haftalık ders çalışma programı** — tespit edilen eksiklere yönelik, gün gün / saat aralıklarıyla önerilen bir çalışma planı (tablo formatında).
- Birden fazla sınav seçildiğinde AI'a tüm seçilen sınavların verisi birlikte gönderilip **gelişim/karşılaştırmalı analiz** (öğrencinin zaman içindeki ilerlemesi, tekrar eden zayıf konular) istenecek.
- AI çağrısı başarısız olursa kullanıcıya hata mesajı gösterilsin ve tekrar deneme seçeneği sunulsun.

### 6. PDF Rapor Çıktısı
- Rapor, renkli ve görsel olarak düzenli bir tasarımda PDF olarak dışa aktarılabilmeli (başlık alanı, kurum logosu, renkli grafik/tablo blokları, bölüm başlıkları net ayrılmış).
- PDF içeriği şu bölümlerden oluşmalı:
  1. Üst bilgi: Kurum logosu, kurum adı/adresi, öğrenci adı-soyadı, sınıf, rapor tarihi.
  2. Sınav sonuç özeti (tablo/grafik: doğru-yanlış-boş, net, ders bazlı dağılım).
  3. Eksik konu/kazanım listesi (renkli etiketlerle önem derecesine göre gruplanmış — örn. kritik/orta/hafif eksik).
  4. AI genel değerlendirme yorumu (yazılı metin bölümü).
  5. Haftalık çalışma programı tablosu.
  6. (Çoklu sınav seçildiyse) Karşılaştırmalı gelişim grafiği ve yorumu.
- PDF oluşturma tarayıcı tarafında (örn. jsPDF + html2canvas veya benzeri) yapılabilir; tasarım şablonu HTML/CSS ile hazırlanıp PDF'e dönüştürülsün.
- Kullanıcı PDF'i indirebilmeli ve isteğe bağlı olarak sisteme kayıtlı geçmiş raporlar listesinden tekrar görüntüleyip yeniden indirebilmeli.

### 7. Firebase Yapısı
Aşağıdaki Firestore koleksiyon yapısını kullan:

```
kurumlar/{kurumId}
  - ad, logoUrl, adres, telefon, temaRengi

kullanicilar/{userId}
  - rol (admin/ogretmen), kurumId, adSoyad, email

ogrenciler/{ogrenciId}
  - kurumId, adSoyad, sinif, sube, numara

sinavlar/{sinavId}
  - ogrenciId, kurumId, sinavAdi, tarih, tur (kazanimli/kazanimsiz)
  - dersSonuclari: [ { ders, dogru, yanlis, bos, net, konular: [...] } ]

raporlar/{raporId}
  - ogrenciId, kurumId, kullanilanSinavIdler: [...]
  - aiSaglayici, olusturmaTarihi
  - eksikKonular, genelYorum, calismaProgrami
  - pdfUrl (Firebase Storage'da saklanan PDF linki)
```

- Firebase Storage: kurum logoları `logos/{kurumId}` altında, oluşturulan PDF raporlar `raporlar/{kurumId}/{raporId}.pdf` altında saklansın.
- Geçmiş raporlar, ilgili öğrenci profilinden veya admin panelindeki "Rapor Geçmişi" ekranından tarih sırasıyla listelenip filtrelenebilmeli (öğrenciye göre, tarihe göre, sınava göre).
- Firestore güvenlik kuralları: her kurum sadece kendi verisine erişebilsin (kurumId bazlı izolasyon).

### 8. Tasarım Beklentisi
- Modern, temiz, kurumsal bir admin paneli arayüzü (sol menü: Öğrenciler, Sınavlar, Raporlar, AI Ayarları, Kurum Ayarları).
- Responsive tasarım (PC ve tablet için).
- Renk paleti kurum ayarlarından seçilen temaRengi ile senkronize olsun.

### 9. Güvenlik Notu
- API anahtarlarını ve Firebase yapılandırma bilgilerini asla kod içine sabit (hardcoded) yazma; ortam değişkenleri (`.env`) üzerinden yönet ve bana `.env` dosyasına ne yazmam gerektiğini açıkça söyle.
- `.env` dosyasının `.gitignore` içinde olduğundan emin ol.

---

Lütfen bu yapıyı adım adım kur: önce yukarıdaki kontrol listesindeki bilgileri benden topla, ardından veri modeli ve Firebase bağlantısını kur, sonra öğrenci/sınav yönetimi ekranlarını, sonra AI entegrasyonunu, en son PDF export modülünü tamamla. Her aşamada çalışan bir önizleme sun ve bir sonraki adıma geçmeden önce eksik bir bilgi olup olmadığını kontrol et.
