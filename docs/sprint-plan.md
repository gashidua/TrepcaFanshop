# 🛠️ TrepçaFanshop – Sprint Plan

## 📌 Gjendja Aktuale

### ✅ Çka funksionon tani?
- **CRUD për produktet:**  
  - Useri mund të krijojë, lexojë, përditësojë dhe fshijë produktet nga katalogu.  
  - Testuar manualisht dhe via Swagger API.  
- **Basket Logic bazë:**  
  - Shtim dhe heqje produktesh nga shporta.  
  - Përditësimi i totalit dhe numrit të produkteve.  
- **Menaxhimi i porosive (Orders):**  
  - Lista e porosive ekzistuese mund të shikohet dhe menaxhohet.  
- **Repository CSV:**  
  - Lexim dhe shkrim i të dhënave për produktet dhe porositë, duke siguruar persistencë bazike.  
- **Testim fillestar i API-së:**  
  - Endpoint-et kryesore janë testuar me sukses në Swagger.  
- **Dokumentim fillestar:**  
  - Screenshot për referencë për secilin endpoint dhe funksionalitet.

### ⚠️ Çka nuk funksionon?
- **Input validation e pamjaftueshme:**  
  - Çmimet dhe sasia nuk kontrollohen plotësisht.  
  - Fusha të detyrueshme mund të jenë bosh.  
- **Error handling i paplotë:**  
  - Nëse user provon të shtojë produkt joekzistent ose me sasi negative, aplikacioni mund të crashojë.  
- **Basket logic i kufizuar:**  
  - Nuk kontrollon stokun para shtimit të produktit.  
  - Nuk jep mesazh gabimi të qartë.  
- **Documentation:**  
  - API dhe logjika e re nuk është përditësuar plotësisht me ndryshimet e fundit.

### 🖥️ A kompajlohet dhe ekzekutohet programi?
- Po, programi kompajlohet dhe ekzekutohet normalisht.

---

## 🚀 Plani i Sprintit

### 🌟 Feature e Re: Validim i avancuar dhe basket logic
- **Qëllimi:** Sigurojmë që useri të shtojë produkt në basket pa gabime dhe me kontroll të sasisë dhe stokut.  
- **Përshkrimi i përdorimit:**  
  1. Useri zgjedh produktin nga lista.  
  2. Shkruan sasinë që dëshiron të shtojë.  
  3. Programi kontrollon validitetin e sasisë (>0) dhe stokun.  
  4. Nëse kushtet plotësohen, basket-i përditësohet; përndryshe shfaqet mesazh gabimi.

- **Shembuj konkretë:**  
  - Shtimi i “T-Shirt TrepçaFanshop”, sasia = 3 → shtohet në basket.  
  - Shtimi me sasi 0 → gabim: “Sasia duhet të jetë më shumë se 0”.  
  - Shtimi mbi stokun aktual → gabim: “Sasia e kërkuar tejkalon stokun aktual”.

- **Dependencies:**  
  - Basket Logic duhet të jetë funksionale.  
  - CRUD për produktet duhet të jetë i implementuar.  
  - Repository CSV duhet të jetë i qasshëm.

---

### 🛡️ Error Handling
- **Raste kritike që mund të crashojnë programin:**  
  1. Shtimi i produktit me sasi 0 ose negative.  
  2. Leximi i produktit/porosisë që nuk ekziston në CSV.  
  3. Përditësimi i porosisë për produkt të fshirë ose të pavlefshëm.  

- **Strategjia për trajtim:**  
  - Try-catch në Controllers dhe Services.  
  - Mesazhe gabimi user-friendly.  
  - Logim gabimesh për debug dhe audit.  

- **3 raste specifike:**  
  1. User provon sasi = 0 → mesazh: “Sasia duhet të jetë më shumë se 0”.  
  2. User provon produkt joekzistent → mesazh: “Produkti nuk ekziston”.  
  3. User provon sasi mbi stok → mesazh: “Sasia e kërkuar tejkalon stokun aktual”.

---

### 🧪 Teste
- **Metodat që do testohen:**  
  - `AddToBasket()`  
  - `UpdateProduct()`  
  - `GetOrderById()`  
  - `GetAllProducts()`  

- **Corner cases:**  
  - Sasia = 0 ose negative  
  - Produkt joekzistent ose i fshirë  
  - Sasia kërkuar > stoku aktual  
  - CSV file mungon ose është i korruptuar  

- **Strategjia e testimit:**  
  - Testim manual në Swagger për çdo endpoint.  
  - Kontroll i HTTP status codes: 200, 400, 404, 500.  
  - Screenshot të rezultateve për dokumentim.  
  - Raportim gabimesh dhe përmirësime iterative.  

---

## 📅 Afati
- **Deadline:** Martë, 8 Prill 2026, ora 08:30  
- **Assigned To:** Dua

---

## 🔮 Pritshmëritë për javën e ardhshme
- Përmirësim i basket logic dhe validation.  
- Trajtim i plotë i gabimeve për Orders.  
- Refaktorim i metodave dhe organizimi i kodit.  
- Testim i detajuar me corner cases.  
- Përditësim i dokumentacionit me screenshot.

---

## 🌐 Pritshmëritë për javët në vijim
- Integrim i pagesave me partnerë (p.sh. banka).  
- Funksionalitete të avancuara të admin panel.  
- Integrim me frontend/UI për përdoruesit.  
- Testim dhe debug për prodhim.  
- Përmirësime të vazhdueshme sipas feedback-ut.

---

## ⚠️ Risqe & Mitigim
| Risk | Mitigation |
|------|------------|
| Gabime në basket | Testim i vazhdueshëm & corner cases |
| Probleme me CSV | Backup i të dhënave & validim inputeve |
| Gabime gjatë refaktorimit | Code review & testim pas çdo ndryshimi |
| Mungesë kohe | Prioritizim i task-ve kritike |
| API inconsistencies | Testim i vazhdueshëm në Swagger |

---

## 📊 Plan i Ekzekutimit
- Sprint i ndarë në 3 faza:  
  1. **Development Phase:** Implementim i feature të reja dhe përmirësim i gabimeve.  
  2. **Testing Phase:** Testim i çdo funksionaliteti me corner cases dhe validim inputesh.  
  3. **Documentation Phase:** Përditësim i dokumentacionit, screenshot dhe logime gabimesh.

- **Prioritetet e Sprintit:**  
  1. Error handling dhe input validation.  
  2. Basket & Orders logic.  
  3. Refaktorim i metodave.  
  4. Testim dhe dokumentim.  

- **Kontroll i progresit:**  
  - Daily check-in për review të kodit.  
  - Screenshot i rezultateve për dokumentim.  
  - Version control (GitHub) me commits për çdo përmirësim.




