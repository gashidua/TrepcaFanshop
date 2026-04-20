# 🏀 TrepcaFanshopApp

TrepcaFanshopApp është një sistem për menaxhimin e fanshop-it të klubit Trepça, i ndërtuar në C# duke përdorur ASP.NET Core Web API dhe arkitekturë të ndarë në shtresa.

Sistemi mbështet menaxhimin e produkteve, shportës dhe statistikave, si dhe demonstron praktika profesionale të zhvillimit të softuerit.

---

## 📁 Struktura e Projektit

### ⚙️ Core Application

#### 📌 Controllers
- `BasketController.cs` – menaxhimi i shportës përmes API
- `ProductsController.cs` – CRUD operacione për produktet
- `WeatherForecastController.cs` – test controller (template)

---

#### 💾 Data Layer
- `IRepository.cs` – interface për operacione bazike
- `FileRepository.cs` – implementim i ruajtjes në file
- `ProductRepository.cs` – repository specifik për produktet
- `BasketRepository.cs` – repository për shportën

---

#### 📂 Data Files
- `basket.csv` – të dhënat e shportës
- `product.csv` – të dhënat e produkteve

---

#### 🧠 Models
- `Product.cs` – entiteti i produktit
- `Basket.cs` – përfaqëson shportën
- `Stats.cs` – statistika të sistemit

---

#### ⚙️ Services
- `ProductService.cs` – logjika e biznesit për produktet
- `ProductServiceBase.cs` – abstraksion për product service
- `BasketService.cs` – logjika për shportën
- `BasketServiceBase.cs` – abstraksion për basket service
- `BasketItem.cs` / `BasketServiceItem.cs` – struktura ndihmëse për shportën
- `Login.cs` – logjika e autentifikimit

---

#### 🖥 UI Layer
- `ConsoleMenu.cs` – ndërfaqja me përdoruesin (console)

---

### 📚 Documentation (docs/)

- `architecture.md` – përshkrimi i arkitekturës
- `class-diagram.md` – diagrami i klasave (tekst)
- `class-diagram.png` – diagrami vizual
- `implementation.md` – implementimi teknik
- `improvement-report.md` – përmirësimet e sprintit
- `project-audit.md` – analizë e projektit
- `sprint-plan.md` – planifikimi i sprintit
- `sprint-report.md` – raporti i sprintit

📁 `docs/images/`
- `get1.png`, `get2.png`, `get3.png`, `get4.png` – API screenshots
- `post.png` – POST request demo
- `delete.png` – DELETE request demo
- `out.png` – output demo

---

### ⚙️ Konfigurim

- `launchSettings.json` – konfigurimi i ASP.NET Core
- `.editorconfig` – rregulla të kodimit
- `.gitignore` – file që përjashtohen nga Git

---

## ⚙️ Teknologjitë

- C#
- ASP.NET Core Web API
- Object-Oriented Programming (OOP)
- Repository Pattern
- Service Layer Architecture
- Dependency Injection
- File-based persistence (CSV)
- REST API
- Swagger (testim i endpoints)

---

## 💾 Menaxhimi i të Dhënave

Sistemi përdor:
- `FileRepository` për ruajtje në CSV
- repositories specifike për entitete

📌 Të dhënat ruhen në:
- `product.csv`
- `basket.csv`

---

## 🧱 Arkitektura

Sistemi është i ndarë në:

1. **Controllers** → API endpoints
2. **Services** → logjika e biznesit
3. **Data Layer** → menaxhimi i të dhënave
4. **Models** → struktura e entiteteve
5. **UI / Console** → ndërfaqe testuese

👉 Kjo arkitekturë siguron:
- separation of concerns
- scalability
- testability
- maintainability

---

## 🧪 Funksionalitetet Kryesore

- CRUD për produkte
- Menaxhim i shportës
- Shtim dhe fshirje i artikujve
- Statistikë e produkteve
- Login sistem bazik
- API endpoints për testim (Swagger)

---

## 🧠 SOLID Principles

- **S** – çdo klasë ka përgjegjësi të vetme
- **O** – sistemi është i zgjerueshëm
- **L** – implementimet mund të zëvendësohen
- **I** – interface të ndara për përgjegjësi specifike
- **D** – dependency injection në services

---

## 📌 Përmirësime të Implementuara

- Shtim i API Controllers
- Refaktorim në Service Layer
- Përmirësim i strukturës së repositories
- Shtim i dokumentimit teknik dhe UML
- Shtim i error handling dhe validimit
- Organizim i plotë i sprint deliverables

---


## Testing

Testet e implementuara verifikojnë funksionalitetin bazë të CRUD operacioneve dhe logjikës së biznesit. Megjithatë, test coverage për edge cases dhe integration scenarios është ende i kufizuar dhe mund të zgjerohet në të ardhmen.


---

## 🏁 Përfundim

TrepcaFanshopApp është një sistem i kompletuar që demonstron:

- arkitekturë profesionale me shtresa
- implementim të Web API
- përdorim të design patterns (Repository + Service)
- dokumentim të plotë teknik
- strukturë të gatshme për zhvillim në sistem real production

Ky projekt është zhvilluar si një sistem edukativ për të demonstruar parimet bazë të arkitekturës së softuerit dhe nuk përfaqëson një sistem production-ready.
