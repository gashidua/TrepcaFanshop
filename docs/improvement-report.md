# Project Audit & Improvement Report — TrepcaFanshopApp

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

---

## 2. Çka funksionon mirë

- CRUD operacionet funksionojnë në mënyrë stabile  
- Arkitekturë e ndarë në shtresa (Separation of Concerns)  
- Përdorimi i Repository Pattern  
- Aplikacioni është i thjeshtë për ekzekutim  
- Logjikë bazike e biznesit e implementuar në Services  

---

## 3. Dobësitë e projektit

- Mungon centralized logging  
- File-based storage nuk është scalable  
- Nuk ka concurrency control  
- Validimi i inputit është bazik  
- Mungon security layer (auth/roles)  
- Nuk ka unit tests të mjaftueshme  
- Përdoret Exception i përgjithshëm  

---

## 4. Përmirësimet që do t’i implementoj

### 1. Service Layer
Problemi: UI ishte i lidhur direkt me repository  
Zgjidhja: Shtim i Service Layer  
Pse: ndarje e përgjegjësive dhe maintainability  

---

### 2. Validimi i inputit
Problemi: input jo valid  
Zgjidhja: validim në service  
Pse: ruan integritetin e të dhënave  

---

### 3. Error handling
Problemi: crash dhe ID invalid  
Zgjidhja: try-catch + kontrolle  
Pse: stabilitet më i mirë  

---

## 5. Pjesë që nuk e kuptoj plotësisht

Dependency Injection dhe arkitekturat më të avancuara (Clean Architecture), sidomos mënyra si lidhen shtresat në projekte më të mëdha dhe si bëhet testimi me mocking.

---

# Improvement Report

---

## Përmbledhje

Gjatë këtij sprinti janë realizuar përmirësime që përmirësojnë strukturën, stabilitetin dhe mirëmbajtjen e sistemit.

Fokusi ka qenë:
- ndarja e përgjegjësive  
- rritja e stabilitetit  
- përmirësimi i cilësisë së kodit  

Janë implementuar 4 përmirësime kryesore.

---

## 1. Service Layer

Para: UI → Repository  
Pas: UI → Service → Repository  

Rezultat:
- më pak coupling  
- më shumë modularitet  
- më lehtë për testim  

---

## 2. Validimi i inputit

Para:
- emra bosh  
- çmime invalid  

Pas:
- kontroll për null  
- kontroll për çmim > 0  

Rezultat:
- data më e saktë  
- më pak gabime  

---

## 3. Error Handling

Para:
- crash për ID jo-ekzistuese  

Pas:
- kontrolle + exception handling  

Rezultat:
- sistem më stabil  
- më pak runtime errors  

---

## 4. Interface për Repository

Para:
- varësi direkte nga implementimi  

Pas:
- përdorim i IProductRepository  

Rezultat:
- fleksibilitet më i madh  
- përgatitje për DI  

---

## Çka mbetet për përmirësim

- mungojnë testet  
- mungon logging  
- përdoret file storage  
- mungon security  
- nuk ka concurrency  

---

## Reflektim

Ky projekt më ka ndihmuar të kuptoj:
- rëndësinë e ndarjes së shtresave  
- si organizohet një sistem real  
- pse validimi dhe error handling janë kritike  

---

## Përfundim

Sistemi është përmirësuar dukshëm në strukturë dhe stabilitet.

Megjithatë, për të arritur nivel production-ready nevojiten:
- database  
- security  
- logging  
- testing  

Ky sprint ka qenë një hap i rëndësishëm drejt ndërtimit të një sistemi më profesional dhe më të qëndrueshëm.
