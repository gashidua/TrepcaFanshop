# Project Audit — TrepcaFanshopApp

---

## 1. Përshkrimi i shkurtër i projektit

TrepcaFanshopApp është një aplikacion për menaxhimin e produkteve të një fanshop-i sportiv. Sistemi është ndërtuar në mënyrë të thjeshtë duke përdorur arkitekturë bazike me ndarje në shtresa si Models, Data dhe UI (Console).

Qëllimi kryesor i sistemit është të mundësojë administrimin e produkteve në mënyrë të thjeshtë dhe efikase.

Ky projekt përfaqëson një implementim fillestar të një sistemi menaxhimi, i fokusuar më shumë në funksionalitet sesa në arkitekturë të avancuar. Megjithatë, ai shërben si bazë e mirë për të kuptuar konceptet e ndarjes së shtresave dhe menaxhimit të të dhënave.

### Funksionalitetet kryesore:

- Shtimi i produkteve të reja
- Shfaqja e listës së produkteve
- Përditësimi i produkteve ekzistuese
- Fshirja e produkteve
- Ruajtja e të dhënave në file (JSON)

### Përdoruesit kryesorë:

- **Admin i fanshop-it** – personi që menaxhon produktet
- **Përdorues fundor (opsional)** – që vetëm i shikon produktet

### Arkitektura aktuale:

- **Models** → përfaqëson entitetet (Product)
- **Data (Repository)** → menaxhon leximin/shkrimin në file
- **UI (ConsoleMenu)** → ndërfaqja me përdoruesin

---

## 2. Çka funksionon mirë

1. ✔️ Implementimi i CRUD operacioneve është funksional dhe i testueshëm  
2. ✔️ Kodi është i ndarë në disa shtresa bazike (Models, Data, UI)  
3. ✔️ Struktura është e kuptueshme për projekte të vogla  
4. ✔️ Përdorimi i JSON si storage është i thjeshtë dhe praktik  
5. ✔️ Aplikacioni mund të ekzekutohet pa konfigurime të komplikuara  

---

## 3. Dobësitë e projektit

Pas analizës së projektit, janë identifikuar këto dobësi reale:

### 🔴 1. Mungon Service Layer
UI komunikon direkt me repository → kjo krijon coupling të lartë dhe e vështirëson mirëmbajtjen.

Kjo e bën sistemin të vështirë për testim dhe e lidh fort UI me logjikën e biznesit, duke ulur fleksibilitetin.

---

### 🔴 2. Validimi i inputit është i pamjaftueshëm
- Emri mund të jetë bosh  
- Çmimi mund të jetë negativ ose jo valid  
- Nuk ka kontroll për input jo-numerik  

---

### 🔴 3. Error handling i dobët
- Nëse file mungon → aplikacioni mund të crash  
- Nuk trajtohen exception-et në mënyrë të kontrolluar  

Kjo rrit rrezikun e runtime exceptions dhe e bën eksperiencën e përdoruesit jo të besueshme.

---

### 🔴 4. Kontroll i dobët i ID-ve
- Mund të kërkohet update/delete për ID që nuk ekziston  
- Nuk ka feedback të qartë për user-in  

---

### 🔴 5. Kod i duplikuar
- Disa pjesë të logjikës përsëriten në UI dhe repository  

---

### 🔴 6. Emërtimet nuk janë konsistente
- Disa metoda nuk janë self-explanatory  
- Nuk ndjekin gjithmonë standarde të qarta  

---

### 🔴 7. Dokumentimi është minimal
- README mungon ose është i dobët  
- Nuk ka shpjegim për setup dhe strukturën  

---

### 🔴 8. Nuk ka ndarje të qartë të përgjegjësive
- UI merr shumë përgjegjësi që duhet t’i ketë Service layer  

---

### 🔴 9. Nuk ka teste
- Nuk ka unit tests për logjikën  

Pa teste, është e vështirë të verifikohet korrektësia e sistemit dhe çdo ndryshim mund të sjellë bugs të reja.

---

### 🔴 10. Storage me file nuk është robust
- Nuk ka locking  
- Nuk ka validim të strukturës së JSON  

---

## 4. 5 përmirësime që do t’i implementoj

---

### ✅ Përmirësimi 1 — Krijimi i Service Layer

**Problemi:**  
UI komunikon direkt me repository → strukturë jo e pastër  

**Zgjidhja:**  
Krijimi i `ProductService` që menaxhon logjikën  

**Pse ka rëndësi:**  
- Ndarje e përgjegjësive  
- Lehtësi në mirëmbajtje dhe zgjerim  
- Ky ndryshim gjithashtu mundëson testim më të lehtë të logjikës pa varësi nga UI  

---

### ✅ Përmirësimi 2 — Validimi i inputit

**Problemi:**  
Lejohet input invalid  

**Zgjidhja:**  
Validim në Service layer:
- Name jo bosh  
- Price > 0  

**Pse ka rëndësi:**  
- Siguron integritet të të dhënave  
- Parandalon futjen e të dhënave të pavlefshme që mund të shkaktojnë probleme në funksionimin e sistemit  

---

### ✅ Përmirësimi 3 — Error Handling i avancuar

**Problemi:**  
Crash në rast gabimesh  

**Zgjidhja:**  
- try-catch  
- fallback logic  
- mesazhe për user-in  

**Pse ka rëndësi:**  
- Rrit stabilitetin e aplikacionit  
- E bën aplikacionin më robust dhe më rezistent ndaj situatave të papritura gjatë ekzekutimit  

---

### ✅ Përmirësimi 4 — Kontroll i ID-ve

**Problemi:**  
Operacione mbi ID jo-ekzistuese  

**Zgjidhja:**  
Kontroll para update/delete  

**Pse ka rëndësi:**  
- Parandalon bugs logjike  
- Përmirëson user experience  

---

### ✅ Përmirësimi 5 — Përmirësim i dokumentimit

**Problemi:**  
Mungon dokumentim i qartë  

**Zgjidhja:**  
- README i plotë  
- shpjegim i arkitekturës  

**Pse ka rëndësi:**  
- E bën projektin më të kuptueshëm për të tjerët  
- Dokumentimi i mirë është thelbësor për bashkëpunim në ekipe dhe për përdorimin e projektit nga zhvillues të tjerë  

---

## 5. Një pjesë që ende nuk e kuptoj plotësisht

Një aspekt që ende nuk e kuptoj plotësisht është implementimi i arkitekturave më të avancuara si Clean Architecture dhe përdorimi i Dependency Injection në projekte më të mëdha.

Dua të kuptoj më mirë:
- si lidhen shtresat në mënyrë profesionale  
- si menaxhohen dependency-t  
- si bëhet testimi i izoluar i komponentëve  

Kjo është një fushë që dua ta përmirësoj më tej, pasi është thelbësore për zhvillimin e aplikacioneve profesionale dhe scalable.
