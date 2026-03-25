@startuml
skinparam class {
    BackgroundColor<<Entity>> LightBlue
    BackgroundColor<<Controller>> LightGreen
    BackgroundColor<<Boundary>> LightYellow
    ArrowColor DarkSlateGray
    BorderColor Black
}

package "TrepcaFanshop System" {

    ' ==============================
    ' Models / Entities
    ' ==============================
    class Product <<Entity>> {
        - Id: int
        - Name: string
        - Price: double
        + GetName(): string
        + GetPrice(): double
        + SetPrice(p: double)
        + DisplayInfo(): string
    }

    class Basket <<Entity>> {
        - Id: int
        - Products: List<Product>
        + AddProduct(p: Product)
        + RemoveProduct(p: Product)
        + GetProducts(): List<Product>
        + CalculateTotal(): double
    }

    ' ==============================
    ' Services / Controllers
    ' ==============================
    class Login <<Controller>> {
        - Username: string
        - Password: string
        + SignIn(u: string, p: string): bool
        + SignOut(): void
        + ResetPassword(): void
    }

    class Program <<Controller>> {
        + Main(args: string)
    }

    ' ==============================
    ' UI / Boundary
    ' ==============================
    class LoginForm <<Boundary>> {
        + Display(): void
        + GetCredentials(): (string, string)
    }

    class BasketView <<Boundary>> {
        + ShowProducts(products: List<Product>): void
        + ShowTotal(total: double): void
    }

    ' ==============================
    ' Relationships / Multiplicities
    ' ==============================
    Basket "0..*" o-- "1" Product : contains
    Program "1" --> "1" Login : uses
    Program "1" --> "1" Basket : manages
    Login ..> Product : accesses
    LoginForm ..> Login : interacts
    BasketView ..> Basket : displays
}
@enduml