# TrepçaFanshop – Implementation Documentation

## 1. Përshkrimi i Projektit

Ky projekt është një **Web API CRUD** për menaxhimin e produkteve dhe shportës në TrepçaFanshop.
Arkitektura e përdorur është:

**Models → Repositories → Services → Controllers → DataFiles → UI**

* Të dhënat ruhen në **CSV** (`DataFiles/Product.csv`, `DataFiles/Basket.csv`).
* Çdo veprim i rëndësishëm (Add, Update, Delete) mund të regjistrohet në **audit log**.
* Projektimi ndjek parimet **Clean Architecture**, duke ndarë qartë logjikën e biznesit nga ruajtja dhe API.

## 2. Funksionalitetet Kryesore

| Funksionalitet            | Metoda / Endpoint / UI      | Përshkrimi                                                                    |
| ------------------------- | --------------------------- | ----------------------------------------------------------------------------- |
| Listo të gjitha produktet | GET /api/products           | Liston të gjitha produktet. Opsionale: filtrim sipas emrit ose kategori.      |
| Kërko produkt sipas ID    | GET /api/products/{id}      | Kërkon një produkt specifik.                                                  |
| Shto produkt              | POST /api/products          | Shton një produkt të ri me validime: emri jo bosh, çmimi >0 dhe ≤10000, unik. |
| Update produkt            | PUT /api/products/{id}      | Modifikon produkt ekzistues, ruan `UpdatedAt`.                                |
| Delete produkt            | DELETE /api/products/{id}   | Fshin produkt nga CSV dhe regjistron log.                                     |
| Menaxhimi i shportës      | ConsoleMenu.cs / Basket API | Shton, liston dhe fshin produkte nga shporta.                                 |

## 3. Validime dhe Rregulla

* **Emri i produktit nuk mund të jetë bosh**
* **Çmimi > 0 dhe ≤ 10,000**
* **Emri duhet të jetë unik për produktet**
* `CreatedAt` dhe `UpdatedAt` ruhen për historikun e produkteve
* Loget regjistrojnë Add, Update dhe Delete për gjurmueshmëri

## 4. Rrjedha e të Dhënave

Client / UI / Swagger → Controllers → Services → Repositories → DataFiles (CSV) → Audit Log

* **Client / UI / Swagger**: Kërkon veprime mbi produktet dhe shportën.
* **Controllers**: Marrin kërkesat HTTP (ProductsController, BasketController) dhe thërrasin Service-t.
* **Services**: Kryejnë validime dhe logjikë biznesore (ProductService, BasketService).
* **Repositories**: Kryejnë CRUD direkt mbi CSV (`ProductRepository`, `BasketRepository`).
* **DataFiles**: CSV ruan të dhënat aktuale.
* **Audit Log**: Regjistron veprimet kritike për gjurmueshmëri.

## 5. Strukturë Folderash

TrepcaFanshopApp/
├─ Controllers/
│   ├─ BasketController.cs
│   ├─ ProductsController.cs
│   └─ WeatherForecastController.cs
├─ Data/
│   ├─ BasketRepository.cs
│   ├─ FileRepository.cs
│   ├─ IRepository.cs
│   ├─ ProductRepository.cs
├─ DataFiles/
│   ├─ Basket.csv
│   └─ Product.csv
├─ docs/
│   ├─ architecture.md
│   ├─ class-diagram.md
│   ├─ class-diagram.png
│   └─ implementation.md
├─ Images/
│   ├─ delete.png
│   ├─ get1.png
│   ├─ get2.png
│   ├─ get3.png
│   ├─ get4.png
│   ├─ post.png
│   └─ put.png
├─ Models/
│   ├─ basket.cs
│   └─ product.cs
├─ Services/
│   ├─ BasketItem.cs
│   ├─ BasketService.cs
│   ├─ BasketServiceBase.cs
│   ├─ BasketServiceItem.cs
│   ├─ login.cs
│   ├─ ProductService.cs
│   └─ productServiceBase.cs
├─ UI/
│   └─ ConsoleMenu.cs
├─ TrepcaFanshopApp/
│   ├─ Properties/
│   ├─ appsettings.json
│   ├─ Program.cs
│   ├─ TrepcaFanshopApp.csproj
│   └─ TrepcaFanshopApp.http
├─ .editorconfig
├─ .gitignore
├─ README.md
└─ WeatherForecast.cs

## 6. Shembuj JSON Output

### GET /api/products

[
{
"id": 1,
"emri": "CPU Intel i7",
"cmimi": 350,
"createdAt": "2026-03-30T21:00:00",
"updatedAt": null
}
]

### POST /api/products

{
"id": 6,
"emri": "SSD 1TB",
"cmimi": 150,
"createdAt": "2026-03-30T21:10:00",
"updatedAt": null
}

### PUT /api/products/6

{
"id": 6,
"emri": "SSD 1TB NVMe",
"cmimi": 170,
"createdAt": "2026-03-30T21:10:00",
"updatedAt": "2026-03-30T21:15:00"
}

### DELETE /api/products/6

HTTP Status: 204 No Content

## 7. Shembuj Audit Log (nëse përdoret)

2026-03-30 21:10:12 - Added product: 6 - SSD 1TB
2026-03-30 21:15:45 - Updated product: 6 - SSD 1TB NVMe
2026-03-30 21:20:05 - Deleted product: 6 - SSD 1TB NVMe

## 8. Screenshots

Screenshots nga **Swagger UI** janë të ruajtura në folderin `Images/`:

### GET Requests

![GET 1](../Images/get1.png)
![GET 2](../Images/get2.png)
![GET 3](../Images/get3.png)
![GET 4](../Images/get4.png)

### POST Request

![POST](../Images/post.png)

### PUT Request

![PUT](../Images/put.png)

### DELETE Request

![DELETE](../Images/delete.png)

* **GET /api/products** – liston produktet

* **POST /api/products** – shton produkt

* **PUT /api/products/{id}** – modifikon produkt

* **DELETE /api/products/{id}** – fshin produkt

* **UI ConsoleMenu.cs** – Menaxhon shportën: shtim, listim, fshirje produkteve në shportë
