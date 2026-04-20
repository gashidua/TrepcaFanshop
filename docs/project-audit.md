# Project Audit — TrepcaFanshopApp

---

## 1. Përshkrimi i shkurtër i projektit

TrepcaFanshopApp është një aplikacion për menaxhimin e produkteve të një fanshop-i sportiv. Sistemi është ndërtuar duke përdorur arkitekturë të shtresuar (Layered Architecture) me ndarje në Models, Data (Repository), Services dhe UI.

Qëllimi kryesor i sistemit është të mundësojë administrimin e produkteve në mënyrë të thjeshtë, të organizuar dhe të zgjerueshme.

Ky projekt përfaqëson një implementim edukativ të një sistemi menaxhimi, i fokusuar në kuptimin e koncepteve bazike të arkitekturës së softuerit dhe ndarjes së përgjegjësive.

### Funksionalitetet kryesore:
- Shtimi i produkteve të reja
- Shfaqja e listës së produkteve
- Përditësimi i produkteve ekzistuese
- Fshirja e produkteve
- Ruajtja e të dhënave në file (CSV/JSON format)

### Përdoruesit kryesorë:
- Admin i fanshop-it
- Përdorues për testim/lexim të produkteve

### Arkitektura aktuale:
- Models → entitetet (Product, Basket, etj.)
- Data (Repository) → menaxhimi i ruajtjes së të dhënave
- Services → logjika e biznesit
- UI → ndërfaqja me përdoruesin
- Program → inicializimi i sistemit

---

## 2. Çka funksionon mirë

1. ✔️ CRUD operacionet funksionojnë në mënyrë stabile
2. ✔️ Arkitekturë e ndarë në shtresa (Separation of Concerns)
3. ✔️ Përdorimi i Repository Pattern për abstraksion të të dhënave
4. ✔️ Aplikacioni është i thjeshtë për ekzekutim dhe testim
5. ✔️ Logjikë bazike e biznesit e implementuar në Services

---

## 3. Dobësitë e projektit

### 🔴 1. Mungon centralized logging
Nuk ka sistem për regjistrimin e eventeve dhe gabimeve, gjë që e vështirëson debugging në sisteme më të mëdha.

---

### 🔴 2. File-based storage jo e shkallëzuar
Përdorimi i file-ve për ruajtje është i thjeshtë, por nuk është i përshtatshëm për sisteme me shumë përdorues ose concurrency.

---

### 🔴 3. Mungesë e concurrency control
Nuk ka mekanizma për menaxhimin e qasjes së njëkohshme në të dhëna.

---

### 🔴 4. Validimi i inputit është bazik
Edhe pse ekziston validim, nuk mbulon të gjitha edge cases (p.sh. formatet e avancuara, sanitizim i inputit).

---

### 🔴 5. Mungon advanced security layer
Nuk ka authentication, authorization apo role-based access control.

---

### 🔴 6. Nuk ka unit tests të mjaftueshme
Testimi ekziston, por nuk mbulon plotësisht edge cases dhe integrimin midis shtresave.

---

## 4. Përmirësimet që janë implementuar

### ✅ 1. Service Layer

**Problemi:**
UI ishte i lidhur direkt me repository.

**Zgjidhja:**
U krijua Service Layer për të menaxhuar logjikën e biznesit.

**Pse ka rëndësi:**
- decoupling of layers
- improves maintainability
- supports scalability
- reduces tight coupling between UI and data layer

---

### ✅ 2. Validimi i inputit

**Problemi:**
Input invalid lejohej në sistem.

**Zgjidhja:**
U shtua validim për emrin dhe çmimin.

**Pse ka rëndësi:**
- siguron integritet të të dhënave
- parandalon gabime logjike në sistem

---

### ✅ 3. Error Handling

**Problemi:**
Sistemi mund të crash-ojë në raste gabimesh.

**Zgjidhja:**
U implementua try-catch dhe handling më i sigurt i gabimeve.

**Pse ka rëndësi:**
- rrit stabilitetin e sistemit
- përmirëson user experience

---

### ✅ 4. Kontroll i ID-ve

**Problemi:**
Operacione mbi ID jo-ekzistuese.

**Zgjidhja:**
Kontroll para update/delete.

**Pse ka rëndësi:**
- shmang runtime errors
- përmirëson logjikën e aplikacionit

---

### ✅ 5. Përmirësim i dokumentimit

**Problemi:**
Dokumentimi ishte bazik.

**Zgjidhja:**
U shtua README dhe dokumentim më i qartë i strukturës.

**Pse ka rëndësi:**
- e bën projektin më të kuptueshëm
- ndihmon zhvillues të tjerë

---

## 5. Një pjesë që ende nuk e kuptoj plotësisht

Një pjesë që ende dua ta kuptoj më mirë është implementimi i arkitekturave më të avancuara si Clean Architecture dhe përdorimi i Dependency Injection në nivel më profesional.

Në veçanti:
- si menaxhohen dependencies në projekte të mëdha
- si bëhet izolimi i plotë i shtresave
- si realizohet testimi i avancuar me mocking

---

## Përfundim

Sistemi aktual është i përshtatshëm për një aplikacion edukativ dhe demonstron mirë konceptet bazike të arkitekturës së softuerit. Megjithatë, për përdorim në nivel enterprise, nevojiten përmirësime në skalabilitet, logging dhe siguri.
