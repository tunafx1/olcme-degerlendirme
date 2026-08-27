# Antigravity (Gemini) Düzeltme Promptu — LGS Puanı Yanlış Okunuyor

Bu metni Antigravity'de Gemini'ye ilk mesaj olarak ver. Kod tabanı sana yüklü durumda (`js/bundle.js` içindeki `PDFParserService` sınıfı). Amaç: toplu sınav sonuç PDF'leri yüklendiğinde **Doğru/Yanlış/Net değerleri doğru okunduğu halde LGS Puanı sütununun yanlış/tutarsız çıkması** sorununu kalıcı olarak çözmek.

---

## PROMPT (kopyala-yapıştır)

Bu projede `js/bundle.js` dosyasındaki `PDFParserService` sınıfı, çok sayfalı (örn. 68-70 öğrencilik) toplu sınav sonuç belgesi PDF'lerini okuyup her öğrencinin doğru/yanlış/net ve LGS puanını ayrıştırıyor. **Doğru, yanlış ve net değerleri her zaman isabetli çıkıyor ama LGS Puanı alanı sık sık yanlış çıkıyor** (bazen tüm öğrenciler için aynı/formülle hesaplanmış bir değer, bazen de belgedeki gerçek puandan farklı bir sayı görünüyor). Görevin bu kök nedeni bulup kalıcı olarak düzeltmek.

### 1. Önce kök nedeni doğrula

`js/bundle.js` içinde şu fonksiyonları incele (satır numaraları yaklaşık, dosya değişmiş olabilir, isimden bul):

- `class PDFParserService` → `static async parseMultiStudentPDF(file, onProgress)`
- `static parseTurkishExamDocument(text)`

`parseMultiStudentPDF` içinde her PDF sayfası şu şekilde işleniyor:

```js
const midX = pageWidth * 0.48;
const headerBottomY = pageHeight * 0.45;
// metin parçaları y >= headerBottomY ise headerItems'a,
// değilse x < midX ise leftColumnItems'a, x >= midX ise rightColumnItems'a atılıyor
```

Sonra bu üç grup birbirinden **bağımsız olarak** satırlara dönüştürülüp (`assembleAndUnwrapLines`) alt alta ekleniyor:

```js
pageStructuredText = "=== ÜST BİLGİ ===" + headerLines
                    + "=== SOL SÜTUN ===" + leftLines
                    + "=== SAĞ SÜTUN ===" + rightLines
```

**Sorun şu:** Karne belgelerinde "Puan Türü: LGS  [Öğrenci Puanı]  [Şube Ort.]  [Okul Ort.]  [Genel Ort.]" satırı genellikle sayfanın x=%48 sınırını yatay olarak kestiği ya da y=%45 sınırının hemen altında/üstünde kaldığı için, bu tek satırdaki metin parçaları **iki farklı gruba (header/left/right) bölünüyor**. Sonuçta "LGS" etiketi bir grupta, asıl puan rakamı başka bir grupta, farklı bir satırda çıkıyor. `parseTurkishExamDocument` içindeki puan regex'leri (`/^LGS\b/`, `/\bLGS\s*[:=\s]+\d/` vb.) aynı satırda hem "LGS" kelimesini hem de rakamı aradığı için bu satır artık eşleşmiyor ve kod son çare olarak `calculateLgsScore(dersSonuclari)` fonksiyonuyla **kendi hesapladığı yaklaşık bir puanı** kullanıyor. Bu hesaplama MEB'in resmi LGS dönüşüm tablosunu birebir yansıtmadığından, gerçek belgedeki puandan farklı (hatalı görünen) bir sonuç veriyor — doğru/yanlış/net etkilenmiyor çünkü onlar ayrı bir mantıkla, satır kaymasından etkilenmeyen bir şekilde okunuyor.

Bunu doğrulamak için: `/mnt/user-data/uploads` klasöründeki (veya sağladığım) örnek "...Sınav Sonuç Belgesi.pdf" dosyasını PDF.js ile aç, bir sayfanın `getTextContent()` çıktısını konsola yazdır, "LGS" ve puan rakamının (örn. `481` veya `464` ile başlayan 3 haneli + virgüllü sayı) **x/y koordinatlarını** karşılaştır. `midX`/`headerBottomY` sınırının bu ikisini gerçekten ayırdığını göster.

### 2. Kalıcı çözümü uygula

Kod yazılmadan önce önerilen mimariyi (koordinat bölme yerine tüm sayfayı satır satır, yukarıdan aşağıya, soldan sağa tek bir akış halinde birleştirme) uygula:

1. **Yeni bir yardımcı fonksiyon ekle**: `buildFullPageLines(items)` — sayfadaki **tüm** metin parçalarını (header/left/right ayrımı yapmadan) `y` koordinatına göre gruplandırıp (aynı satırdakileri `x`'e göre soldan sağa sıralayarak) tam satırlar halinde birleştirsin. Mevcut `assembleAndUnwrapLines` fonksiyonunun mantığını (satır gruplama + "unwrap" birleştirme) koru, sadece girdi olarak `headerItems`/`leftColumnItems`/`rightColumnItems` yerine sayfanın **tüm** `items` listesini ver.
2. **Puan tespitini bu tam satırlar üzerinden yap.** `parseMultiStudentPDF` içinde artık hem eski üç sütunlu metni (kazanım/konu ayrıştırması bunu kullanıyorsa bozma) hem de bu yeni "tam sayfa düz satır" listesini `parseTurkishExamDocument`'e birlikte geçir (örn. ikinci bir parametre `fullPageLines` olarak, ya da `pageStructuredText`'in başına `=== TAM SAYFA (PUAN TESPİTİ İÇİN) ===` bölümü olarak ekle).
3. **`parseTurkishExamDocument` içindeki puan bulma adımlarını bu tam satır listesi üzerinde çalıştır**, öncelik sırası:
   1. `"Öğrenci Puanı"`, `"Öğrencinin Puanı"`, `"Puanı"` gibi künye alanı eşleşmesi (mevcut regex'ler aynen kalabilir).
   2. `"LGS"` veya `"Puan Türü: LGS"` ile başlayan/geçen tam satırı bul; bu satırdaki **ilk** üç haneli ondalıklı sayıyı (`/\b([1-5]\d{2}[.,]\d{1,4})\b/`) al — bu ilk sayı her zaman öğrencinin kendi puanıdır, sonraki sayılar şube/okul/genel ortalamasıdır.
   3. Yukarıdakiler bulunamazsa, **`calculateLgsScore` ile sahte/hesaplanmış bir değer üretme**. Bunun yerine puanı `null` bırak ve arayüzde/rapor çıktısında `"Okunamadı (Belgeyi Kontrol Edin)"` gibi açık bir uyarı göster. Kullanıcının yanlış bir puanı fark etmeden kullanması engellenmeli. (Mevcut `calculateLgsScore` fonksiyonunu tamamen silme; sadece otomatik LGS puanı olarak kullanılmasını durdur — istersen ayrı bir "tahmini puan (doğrulanmamış)" etiketiyle referans amaçlı gösterilebilir.)
4. **Sayfa/öğrenci döngüsünde durum sızıntısını önle.** `pageNum` döngüsünün her adımında `studentPuan` ve ilgili tüm yerel değişkenlerin sıfırdan başladığından emin ol (bir önceki öğrencinin puanının bir sonrakine miras kalmadığını kontrol et — mevcut kodda `let studentPuan = null;` her çağrıda yeniden tanımlanıyor, bunun `parseTurkishExamDocument` her sayfa için ayrı ayrı çağrıldığından bozulmadığını doğrula).

### 3. Test ve doğrulama

- Repo içindeki örnek PDF'i (`*Sinav Sonuç Belgesi.pdf`) yükleyip önce/sonra LGS puanını konsola/loglara yazdırarak PDF'teki gerçek değerle **birebir** eşleştiğini göster.
- Eğer elimde çok sayfalı/çok öğrencili bir PDF varsa, her sayfa için ayrı ayrı çıkan puanların birbirinden farklı ve PDF'teki karneyle uyumlu olduğunu (hepsi aynı sabit değere düşmediğini) doğrula.
- `calculateLgsScore` fallback'ine düşen (belgeden okunamayan) durumları test etmek için bilerek bozuk/eksik bir PDF metni ile dene ve arayüzde net bir "okunamadı" uyarısı çıktığını doğrula.
- Değişikliği yaparken dosyanın geri kalanındaki kazanım/konu ayrıştırma mantığını (`leftColumnItems`/`rightColumnItems` kullanan kısımlar) **bozma**; sadece LGS puanı tespiti tam sayfa akışını kullanacak şekilde ek/yeni bir veri kaynağı olarak eklensin.

Değişikliği yaptıktan sonra bana hangi satırları değiştirdiğini, neden bu şekilde çözdüğünü ve nasıl test ettiğini özetle.
