# Improvement Report — TrepcaFanshopApp

---

## Përmbledhje

Gjatë këtij sprinti janë realizuar përmirësime të menduara që adresojnë dobësi reale të sistemit dhe përmirësojnë strukturën, stabilitetin dhe mirëmbajtjen e tij.

Fokusi kryesor ka qenë:
- ndarja e përgjegjësive (separation of concerns)
- rritja e besueshmërisë së aplikacionit
- sigurimi i integritetit të të dhënave

Përmirësimet nuk janë vetëm funksionale, por edhe arkitekturore, duke e afruar sistemin me praktika më profesionale të zhvillimit të softuerit.

Janë implementuar 4 përmirësime kryesore.

---

## ✅ 1. Introduktimi i Service Layer

### Problemi (Para)

UI ishte i lidhur direkt me shtresën e të dhënave (Repository), duke krijuar tight coupling dhe duke përzier logjikën e prezantimit me atë të biznesit.

Shembull:
UI → ProductRepository → Data Storage

Kjo sillte:
- përgjegjësi të tepërta në UI
- vështirësi në mirëmbajtje
- mungesë të një shtrese të dedikuar për logjikën e biznesit
- testim të kufizuar

---

### Ndryshimi (Pas)

U krijua ProductService si shtresë ndërmjetëse.

Struktura e re:
UI → ProductService → ProductRepository → Data Storage

---

### Përmirësimi

- ndarje e qartë e përgjegjësive  
- eliminim i varësisë direkte UI → Data  
- rritje e modularitetit  

---

### Pse ka rëndësi

Sistemi bëhet:
- më i testueshëm  
- më i mirëmbajtshëm  
- më i zgjerueshëm  

---

## ✅ 2. Përmirësimi i Validimit të Inputit

### Problemi (Para)

Lejohej input jo valid:
- emra bosh  
- çmime ≤ 0  
- pa kontroll të formatit  

Kjo mund të çonte në:
- të dhëna të pasakta në sistem  
- gabime gjatë ekzekutimit  
- sjellje të paparashikueshme  

---

### Ndryshimi (Pas)

U shtua validim në Service Layer:

```csharp
if (string.IsNullOrWhiteSpace(name))
    throw new Exception("Name is required");

if (price <= 0)
    throw new Exception("Price must be greater than 0");


### Përfundim

Përmirësimet e realizuara e kanë bërë sistemin më të strukturuar, më të qëndrueshëm dhe më të mirëmbajtshëm.

Megjithatë, për të arritur nivel production-ready, nevojiten përmirësime të mëtejshme si database, logging, security dhe testing.

Ky sprint ka qenë një hap i rëndësishëm drejt ndërtimit të një sistemi më profesional.
