# Demo Plan - TrepcaFanshopApp

## 1. Titulli i projektit

**TrepcaFanshopApp**

TrepcaFanshopApp eshte nje aplikacion per menaxhimin e fanshop-it te klubit Trepca. Projekti eshte ndertuar ne C# me ASP.NET Core Web API dhe perdor nje arkitekture te ndare ne shtresa: Controllers, Services, Data Layer, Models dhe dokumentim teknik.

## 2. Problemi qe zgjidh

Fanshop-et kane nevoje per nje menyre te thjeshte per te menaxhuar produktet, shporten dhe te dhenat baze te shitjes. Pa nje sistem te organizuar, produktet mund te mbahen ne menyre te paqarte, ndryshimet behen me veshtiresi dhe eshte me e veshtire te shihet gjendja e produkteve ose vlera totale e shportes.

Ky projekt zgjidh kete problem duke ofruar nje API ku mund te menaxhohen produktet dhe shporta. Te dhenat ruhen ne file CSV, prandaj projekti mund te demonstroje persistencen e te dhenave pa pasur nevoje per databaze komplekse.

## 3. Perdoruesit kryesore

Perdoruesit kryesore te sistemit jane:

- administratori i fanshop-it, i cili menaxhon produktet;
- stafi i shitjes, qe mund te kontrolloje produktet dhe shporten;
- zhvilluesi ose studenti, qe teston API endpoints dhe logjiken e aplikacionit;
- ne te ardhmen, klientet qe do te mund te shohin produktet dhe te krijojne porosi.

## 4. Flow-i qe do ta demonstroj

Flow-i kryesor per demo live do te jete:

**Swagger -> Products API -> Create Product -> Get Products -> Search/Filter -> Update Product -> Basket Total**

Gjate demos do te tregoj:

1. Hapjen e aplikacionit dhe Swagger UI.
2. Leximin e produkteve ekzistuese me `GET /api/product`.
3. Shtimin e nje produkti te ri me `POST /api/product`.
4. Verifikimin qe produkti u ruajt duke thirrur perseri `GET /api/product`.
5. Kerkimin ose filtrimin e produkteve me `GET /api/product/search` ose `GET /api/product/filter`.
6. Perditesimin e produktit me `PUT /api/product/{id}`.
7. Shfaqjen e shportes ose totalit me `GET /api/basket/total`.

E zgjedh kete flow sepse tregon pjesen me te rendesishme te projektit: menaxhimin real te produkteve, validimin, ruajtjen ne CSV dhe komunikimin permes REST API.

## 5. Nje problem real qe e kam zgjidhur

Problemi ishte ruajtja dhe leximi i te dhenave pa perdorur databaze. Projekti kishte nevoje qe produktet dhe shporta te mos ekzistonin vetem ne memorie, por te ruheshin edhe pas ekzekutimit te aplikacionit.

Problemi ishte ne Data Layer, ku duhej nje menyre e pergjithshme per te lexuar dhe shkruar entitete te ndryshme ne file. Zgjidhja ishte implementimi i `FileRepository<T>`, i cili perdor generic programming dhe reflection per te ruajtur objektet ne CSV.

Gjithashtu u shtua krijimi automatik i folderit te te dhenave me `Directory.CreateDirectory(folderPath)`, ne menyre qe aplikacioni te mos deshtoje nese folderi nuk ekziston. Kjo e ben projektin me te qendrueshem gjate demos dhe me te lehte per ta hapur ne kompjuter tjeter.

## 6. Cka mbetet ende e dobet

Pjesa qe ende mund te permiresohet eshte lidhja me nje databaze reale dhe nderfaqja vizuale per perdoruesit final. Aktualisht projekti funksionon mire si Web API dhe mund te testohet me Swagger, por per nje sistem production-ready do te duhej:

- databaze si SQL Server ose PostgreSQL;
- autentifikim me role per admin dhe user;
- frontend per klientet dhe administratorin;
- validim me i avancuar;
- me shume teste per edge cases dhe integration scenarios.

## 7. Struktura e prezantimit (5-7 min)

**Hyrja (1 min)**

Do te prezantoj shkurt idene e projektit: nje sistem per menaxhimin e fanshop-it te Trepces, ku produktet dhe shporta menaxhohen permes API.

**Demo live (2-3 min)**

Do te hap Swagger dhe do te demonstroj flow-in kryesor: `GET products`, `POST product`, `search/filter`, `PUT product` dhe `basket total`.

**Shpjegimi teknik (1 min)**

Do te shpjegoj arkitekturen me shtresa: Controllers pranojne request-at, Services mbajne logjiken e biznesit, ndersa Repositories merren me ruajtjen e te dhenave ne CSV.

**Problemi dhe zgjidhja (1 min)**

Do te tregoj problemin e persistences se te dhenave dhe si `FileRepository<T>` e zgjidh kete permes nje implementimi generic.

**Mbyllja (30 sekonda)**

Do te permend cfare funksionon aktualisht dhe cfare mbetet per permiresim ne versionet e ardhshme.

## 8. Plan B per demo

Nese aplikacioni nuk hapet live ose Swagger nuk funksionon ne momentin e prezantimit, do te perdor:

- screenshots ekzistues ne repo per `GET`, `POST`, `PUT` dhe `DELETE`;
- README per te shpjeguar strukturen dhe funksionalitetet;
- file-t ne `docs/` per arkitekturen dhe diagramin;
- shembuj te output-it nga endpoints per te treguar cfare do te ktheje API.

Keshtu prezantimi mund te vazhdoje edhe nese ka problem teknik gjate demos live.

## 9. Checklist sipas kritereve te vleresimit

**Project prepared well for demo (40 pike)**

- Repo eshte i perditesuar ne GitHub.
- README shpjegon si hapet projekti dhe cilin flow duhet testuar.
- Flow-i kryesor eshte konkret: menaxhimi i produkteve dhe shportes permes Swagger/API.
- Projekti eshte testuar me `dotnet test` dhe testet kryesore kalojne.

**docs/demo-plan.md clarity and concreteness (30 pike)**

- Plani lidhet direkt me projektin real TrepcaFanshopApp.
- Permenden endpoints konkrete si `GET /api/product`, `POST /api/product`, `PUT /api/product/{id}` dhe `GET /api/basket/total`.
- Shpjegohet pse u zgjodh ky flow dhe cfare vlere tregon ne demo.
- Permendet nje problem real teknik dhe zgjidhja ne `FileRepository<T>`.

**Demo readiness, plan B, and organization (30 pike)**

- Prezantimi eshte ndare ne hyrje, demo live, shpjegim teknik, problem/zgjidhje dhe mbyllje.
- Ka plan B me screenshots, README, dokumentim dhe shembuj output-i.
- Demo eshte e organizuar qe te zgjase 5-7 minuta.
- Pikat e dobeta dhe permiresimet e ardhshme jane te shenuara qarte.
