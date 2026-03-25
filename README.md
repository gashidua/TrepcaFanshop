# TrepcaFanshop

TrepcaFanshop është një aplikacion për menaxhimin e fanshop-it të Trepçës, i ndërtuar duke ndjekur **parime moderne të arkitekturës së softuerit**, me fokus në modularitet, mirëmbajtje dhe shkallëzim të lehtë.

---

## 📁 Struktura e Projektit

- `Models/`  
  Përmban entitetet e biznesit si `Product` dhe `Basket`.

- `Services/`  
  Përmban logjikën e biznesit, p.sh. `Login.cs`.

- `UI/`  
  Përmban ndërfaqen me përdoruesin, si `Menu.cs`, `LoginForm`, `BasketView`.

- `Data/`  
  Përmban implementimin e **Repository Pattern**:
  - `IRepository<T>` (kontrata)
  - `FileRepository<T>` (implementim gjenerik)
  - Repository specifike për entitete

- `docs/`  
  Përmban dokumentimin:
  - UML Class Diagram
  - Dokumentin e arkitekturës

- `program.cs`  
  Entry point i aplikacionit, me vetëm inicializim të komponentëve.

- `.gitignore`  
  Përjashton file dhe folder të panevojshëm nga repository.

---

## ⚙️ Teknologjitë dhe Konceptet

- C#
- Object-Oriented Programming (OOP)
- Repository Pattern
- Separation of Concerns
- Generic Programming
- Reflection (për CSV mapping)

---

## 💾 Menaxhimi i të Dhënave

Projekti përdor një implementim të `FileRepository<T>` që:

- Ruajnë të dhënat në **file CSV**
- Lexojnë automatikisht të dhënat nga file
- Krijojnë file të veçanta për çdo entitet:
  - `Product.csv`
  - `Basket.csv`

Kjo mundëson **persistencë të të dhënave pa përdorur databazë**, duke e bërë sistemin të thjeshtë dhe të zgjerueshëm.

---

## 🧱 Arkitektura

Projekti është i ndarë në shtresa:

- **Models** → Strukturat e të dhënave  
- **Data** → Qasja në të dhëna (Repository Pattern)  
- **Services** → Logjika e biznesit  
- **UI** → Ndërfaqja me përdoruesin  
- **Program** → Inicializimi i aplikacionit  

Kjo ndarje mundëson:
- mirëmbajtje më të lehtë  
- testim më të mirë  
- zgjerim të thjeshtë në të ardhmen  

---

## 🏗️ Aplikimi i parimeve SOLID

Projekti demonstron implementim të parimeve **SOLID**:

- **S – Single Responsibility Principle (SRP):** Çdo klasë ka një përgjegjësi të vetme (p.sh. `Product`, `Basket`, `Login`)  
- **O – Open/Closed Principle (OCP):** `FileRepository<T>` mund të zgjerohen për entitete të reja pa modifikuar bazën  
- **L – Liskov Substitution Principle (LSP):** `BasketRepository` dhe `ProductRepository` trashëgojnë `FileRepository<T>` dhe mund të zëvendësojnë bazën pa thyer logjikën  
- **I – Interface Segregation Principle (ISP):** `IRepository<T>` ka vetëm metodat e nevojshme për CRUD  
- **D – Dependency Inversion Principle (DIP):** `Services` varen nga interfaces (`IRepository<T>`) dhe jo nga implementime konkrete (`FileRepository`)


---

## 🧪 Praktikat Profesionale

- Ndarje e qartë e shtresave (Layered Architecture)
- Përdorimi i interface (`IRepository<T>`) për fleksibilitet
- Program.cs minimalist (vetëm inicializim)
- Repository Pattern për menaxhim të të dhënave
- Strukturë e pastër dhe e organizuar e projektit
- Dokumentim me UML dhe arkitekturë të detajuar

---

## 🚀 Përfundim

TrepcaFanshop është ndërtuar si një projekt që demonstron:
- dizajn të mirë të softuerit  
- përdorim të praktikave profesionale  
- dhe një strukturë të gatshme për zgjerim në aplikacione reale