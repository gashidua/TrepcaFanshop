# Sprint 2 Report — [Dua Gashi]

## Përmbledhje e Sprintit
Gjatë Sprint 2 kam punuar intensivisht në **zhvillimin dhe testimin e TrepçaFanshopApp**, duke implementuar feature të reja, trajtuar gabime, optimizuar kodin dhe krijuar unit tests për funksionalitetin kryesor. Qëllimi kryesor i këtij sprinti ishte të shtoja **feature të re funksionale** dhe të siguroja që programi të mos crash-ojë në asnjë situatë, duke ndjekur arkitekturën **UI → Service → Repository** dhe duke krijuar një bazë solide për testim dhe dokumentim.

---

## Çka Përfundova

1. **Feature e Re – Kërkim dhe Filtrim i Produkteve**
   - Useri mund të kërkojë produktet sipas:
     - **Emrit** (p.sh. "Fanella")  
     - **Kategorisë** (p.sh. "Merch")  
     - **Çmimit** (p.sh. "shfaq produktet mbi 10€")  
   - Kërkimi kalon nëpër shtresat **UI → Service → Repository**, duke ndarë përgjegjësitë si më poshtë:
     - **UI:** Merr input nga useri dhe shfaq rezultatet.  
     - **Service:** Përmban logjikën e kërkimit dhe filtrimet.  
     - **Repository:** Lexon/menaxhon të dhënat nga file JSON.  

2. **Statistika e Produkteve**
   - Implementova funksion që kalkulon:
     - **Totali i çmimeve të produkteve**  
     - **Mesatarja e çmimeve**  
     - **Çmimi maksimal dhe minimal**  
     - **Numri total i produkteve**
   - Kjo funksionalitet është i përdorshëm për të krijuar **raporte të shpejta për stock**.

3. **Sortim i Produkteve**
   - Useri mund të zgjedhë mënyrën e sortimit:
     - Sipas **Emrit A-Z**  
     - Sipas **Çmimit, nga më i ulëti te më i larti ose anasjelltas**  
     - Sipas **Datës së shtimit të produktit**  
   - Implementimi është i modularizuar në **Service**, duke mos ngarkuar UI apo Repository me logjikë të panevojshme.

4. **Eksport i Rezultateve**
   - Useri mund të eksportojë rezultatet në **file `raport.txt`**, i cili përmban:
     - Listën e produkteve të filtruar  
     - Statistikat e produkteve (totali, mesatarja, max, min, numri i produkteve)  
   - File ruhet në folderin `DataFiles` dhe krijohet automatikisht nëse nuk ekziston.

5. **Trajtim i Gabimeve (Error Handling)**
   - Programi **nuk crash-on kurrë**, pavarësisht gabimeve të userit.  
   - Rastet e trajtuara:
     - **File mungon:** Shfaq mesazhin `"File nuk u gjet, po krijoj file të ri..."`  
     - **Input i gabuar:** Useri shkruan `"abc"` për çmim → `"Ju lutem shkruani numër valid"`  
     - **ID nuk ekziston:** Useri kërkon item #999 → `"Itemi nuk u gjet"`  
   - Try-catch është vendosur:
     - Në **Repository** rreth `File.ReadAllText` dhe `File.WriteAllText`  
     - Në **Service** rreth parsimit të inputit dhe kërkimit  
     - Në **UI** rreth çdo input nga useri

6. **Unit Tests**
   - Shtova **minimum 3 teste për feature-n e re**:
     - Shto produkt valid → kthehet sukses  
     - Shto produkt me emër bosh → kthehet error  
     - Kërko produkt që ekziston → gjendet, kërko produkt që nuk ekziston → nuk gjendet  
   - Unit tests sigurojnë që **funksionaliteti kryesor të mos prishet** gjatë ndryshimeve të mëtejshme.

7. **Përmirësime të tjera**
   - Optimizova **ProductService** dhe **ConsoleMenu** për lexueshmëri dhe modularitet.  
   - Trajtova të gjitha **warnings** që dilnin në build për `nullable` ose `uninitialized fields`.  
   - Integrim i **Swagger UI** për testimin e API-ve me input/output vizual.

---

## Çka Mbeti
- Të gjitha kërkesat e detyrës janë plotësuar.  
- Nuk ka feature të papërfunduar.  
- Disa optimizime vizuale në UI mund të bëhen në të ardhmen, por nuk janë pjesë e kërkesave të detyrës.

---

## Çka Mësova
- Si të implementoj një **feature komplekse që kalon nëpër shtresat UI → Service → Repository** pa prishur logjikën e programit.  
- Si të trajtoj **gabimet e userit dhe file-ve** në mënyrë profesionale.  
- Si të krijoj **unit tests** të sakta dhe të besueshme për funksionalitetin kryesor.  
- Si të përdor **Swagger** dhe **Console UI** për të testuar dhe verifikuar funksionalitetin.  
- Menaxhimi i **projekteve .NET, dependencies dhe package references** për të shmangur circular dependencies.
