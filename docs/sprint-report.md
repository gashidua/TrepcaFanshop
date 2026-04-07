# Sprint 2 Report — Dua Gashi

## Përmbledhje e Sprintit

Gjatë Sprint 2 kam realizuar një fazë të rëndësishme në zhvillimin e aplikacionit **TrepçaFanshopApp**, duke kaluar nga një implementim bazik në një sistem më të strukturuar, të qëndrueshëm dhe të testueshëm. Qëllimi kryesor i këtij sprinti ishte implementimi i një **feature të re funksionale**, përmirësimi i **error handling**, si dhe krijimi i **unit tests** për verifikimin e korrektësisë së funksionaliteteve kryesore.

Gjatë këtij procesi, është ndjekur në mënyrë rigoroze arkitektura **UI → Service → Repository**, e cila siguron ndarje të qartë të përgjegjësive, rrit modularitetin dhe lehtëson mirëmbajtjen dhe zgjerimin e aplikacionit në të ardhmen. Ky organizim arkitekturor ka bërë të mundur që logjika e biznesit të jetë e izoluar nga ndërfaqja e përdoruesit dhe nga mënyra e ruajtjes së të dhënave.

Përveç implementimit të feature-ve të reja, një fokus i veçantë i është kushtuar trajtimit të gabimeve (error handling), me qëllim që aplikacioni të mos ndërpritet në asnjë rast dhe të ofrojë mesazhe të qarta dhe të kuptueshme për përdoruesin. Paralelisht, janë zhvilluar edhe teste automatike (unit tests), të cilat sigurojnë që funksionaliteti i aplikacionit të jetë korrekt dhe i qëndrueshëm edhe pas ndryshimeve të mëtejshme në kod.

---

## Çka Përfundova

### 1. Implementimi i Feature-ve të Reja

Një nga arritjet kryesore të këtij sprinti është implementimi i disa feature-ve të reja funksionale që rrisin ndjeshëm përdorshmërinë dhe fleksibilitetin e aplikacionit.

#### 1.1 Kërkimi i Produkteve

Është implementuar funksionaliteti i kërkimit të produkteve, i cili i mundëson përdoruesit të gjejë produkte në mënyrë të shpejtë dhe efikase bazuar në fjalë kyçe. Kërkimi realizohet duke kontrolluar:

- Emrin e produktit  
- Kategorinë e produktit  

Ky funksionalitet është ndërtuar në Service layer dhe përdor metoda të LINQ për të filtruar listën e produkteve. Kërkimi është case-insensitive, duke e bërë më fleksibël dhe më të lehtë për përdoruesin.

---

#### 1.2 Filtrimi sipas Çmimit

Është implementuar një mekanizëm filtrimi që lejon përdoruesin të shfaqë vetëm produktet që kanë çmim më të madh ose të barabartë me një vlerë të caktuar. Ky funksionalitet është i dobishëm për përdoruesit që kanë një buxhet të caktuar dhe duan të fokusohen vetëm në produkte të caktuara.

Filtrimi realizohet në Service layer dhe përdor LINQ për të selektuar produktet që plotësojnë kushtin e dhënë.

---

#### 1.3 Sortimi i Produkteve

Aplikacioni mbështet sortimin e produkteve sipas kritereve të ndryshme:

- Sipas çmimit në rend rritës (ascending)  
- Sipas çmimit në rend zbritës (descending)  
- Sipas emrit të produktit  

Ky funksionalitet i jep përdoruesit kontroll më të madh mbi mënyrën e shfaqjes së të dhënave dhe e bën aplikacionin më fleksibël dhe më profesional.

---

#### 1.4 Statistikat e Produkteve

Është implementuar një modul për llogaritjen e statistikave mbi produktet, i cili përfshin:

- Totalin e çmimeve të produkteve  
- Mesataren e çmimeve  
- Çmimin minimal  
- Çmimin maksimal  
- Numrin total të produkteve  

Ky funksionalitet është veçanërisht i dobishëm për analizë dhe raportim, duke i dhënë përdoruesit një pasqyrë të përgjithshme mbi gjendjen e produkteve.

---

#### 1.5 Eksportimi i të Dhënave

Është implementuar funksionaliteti për eksportimin e të dhënave në një file tekst (`raport.txt`). Ky file përmban:

- Listën e produkteve të selektuara  
- Statistikat e llogaritura  

File krijohet automatikisht nëse nuk ekziston dhe mund të përdoret për ruajtje ose shpërndarje të të dhënave.

---

### 2. Implementimi i Arkitekturës UI → Service → Repository

Një aspekt shumë i rëndësishëm i këtij sprinti ka qenë respektimi i arkitekturës me tre shtresa:

#### UI Layer
- Merr input nga përdoruesi  
- Shfaq rezultatet në ekran  
- Nuk përmban logjikë biznesi  

#### Service Layer
- Përmban logjikën kryesore të aplikacionit  
- Realizon validime dhe përpunim të të dhënave  
- Thërret metodat e Repository  

#### Repository Layer
- Menaxhon ruajtjen dhe leximin e të dhënave nga file (CSV)  
- Izolon logjikën e aksesit në të dhëna  

Kjo ndarje e përgjegjësive e bën aplikacionin më të organizuar dhe të lehtë për mirëmbajtje.

---

### 3. Error Handling

Një nga objektivat kryesore të këtij sprinti ishte sigurimi që aplikacioni të mos crash-ojë në asnjë situatë.

#### Rastet e trajtuara:
- File mungon → krijohet automatikisht  
- Input i pavlefshëm → shfaqet mesazh gabimi  
- ID nuk ekziston → njoftohet useri  

#### Implementimi teknik:
- Try-catch në Repository për operacione me file  
- Validime në Service layer  
- Kontroll input-i në UI  

Qëllimi është që aplikacioni të vazhdojë punën pa u ndërprerë dhe të ofrojë mesazhe të qarta për përdoruesin.

---

### 4. Unit Tests

Janë implementuar teste automatike për verifikimin e funksionaliteteve kryesore.

#### Testet përfshijnë:
- Shtim produkti valid  
- Validim inputi (emër bosh)  
- Kërkim produktesh ekzistuese dhe jo-ekzistuese  
- Llogaritje statistikash  
- Filtrim sipas çmimit  

Testet janë ndërtuar duke përdorur **xUnit** dhe mbulojnë si rastet normale ashtu edhe rastet kufitare.

---

### 5. Përmirësime dhe Refaktorim

Gjatë këtij sprinti janë bërë përmirësime të rëndësishme në kod:

- Refaktorim i `ProductService` për qartësi  
- Eliminim i exception-eve që shkaktonin crash  
- Përmirësim i emërtimit të variablave  
- Organizim më i mirë i strukturës së projektit  

Këto përmirësime e bëjnë kodin më të lexueshëm dhe më të mirëmbajtshëm.

---

## Çka Mbeti

Të gjitha kërkesat kryesore të sprintit janë përmbushur. Nuk ka funksionalitete kritike të papërfunduara.

Për të ardhmen mund të shtohen:
- Përmirësime në UI  
- Filtra më të avancuar  
- Integrim me databazë reale  
- Frontend grafik  

---

## Çka Mësova

Gjatë këtij sprinti kam mësuar:

- Implementimin e arkitekturës me shtresa  
- Ndarjen e përgjegjësive në UI, Service dhe Repository  
- Trajtimin profesional të gabimeve  
- Krijimin e unit tests  
- Përdorimin e LINQ për manipulimin e të dhënave  
- Organizimin e projekteve .NET  

Ky sprint ka qenë një hap i rëndësishëm drejt ndërtimit të një aplikacioni të plotë dhe profesional.
