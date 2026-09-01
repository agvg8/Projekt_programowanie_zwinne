# Projekt

System Zarządzania Projektami (ProjectsApp)
Aplikacja webowa realizowana w ramach przedmiotu Programowanie Zwinne, zaprojektowana zgodnie z metodyką Scrum. System umożliwia kompleksowe zarządzanie projektami, zadaniami oraz studentami.


Funkcje • Stos technologiczny • Szybki start • API • Struktura repo • Roadmapa

## 📖 O projekcie

Aplikacja webowa pozwalająca zespołom zakładać projekty, dzielić je na zadania, przypisywać je do konkretnych osób i śledzić postęp prac — a wszystko to okraszone wbudowanym czatem zespołowym i panelem administracyjnym.

Projekt jest realizowany w iteracjach (sprintach), zgodnie z podejściem Scrum:

- **Product Backlog** — lista zadań i historii użytkownika z przypisanymi priorytetami,
- **Sprint Planning** — wybór zadań do bieżącego sprintu i ich wycena,
- **Daily Scrum** — krótkie, codzienne spotkania statusowe,
- **Protokoły** — notatki sporządzane po każdym spotkaniu.

<br>

## ✨ Funkcje

- 🔐 **Logowanie i rejestracja** przez Keycloak (OAuth2 / OpenID Connect)
- 📋 **Zarządzanie projektami** — tworzenie, edycja, usuwanie, deadline, opis
- ✅ **Zarządzanie zadaniami** — statusy `TODO` / `IN_PROGRESS` / `DONE`, priorytety `LOW` / `MEDIUM` / `HIGH`
- 👤 **Przypisywanie zadań i projektów** do konkretnych użytkowników
- 📊 **Pasek postępu projektu**, liczony automatycznie na podstawie ukończonych zadań
- 💬 **Czat zespołowy** — rozmowy prywatne i grupowe w czasie rzeczywistym (WebSocket)
- 🛠️ **Panel administratora** — lista użytkowników, edycja danych i ról, usuwanie kont
- 📅 **Integracja z Kalendarzem Google** — dodawanie deadline'u projektu jednym kliknięciem
- 📧 **Cotygodniowe powiadomienia e-mail** o statusie projektów
- 🎨 **Personalizacja tła** aplikacji w ustawieniach
- 🔎 **Wyszukiwanie i paginacja** na listach projektów i zadań
- 📎 **Załączniki do projektów** (dostępne w API — upload/download plików)

<br>

## 🛠️ Stos technologiczny

<table>
<tr>
<td valign="top" width="50%">

**Backend**
- Spring Boot `3.2.5` (Java `21`)
- Maven
- PostgreSQL + Spring Data JPA / Hibernate
- Spring Security + OAuth2 Resource Server (Keycloak)
- Spring WebSocket — moduł czatu
- Spring Mail — powiadomienia tygodniowe
- springdoc-openapi — dokumentacja API (Swagger UI)

</td>
<td valign="top" width="50%">

**Frontend**
- React `19` + Vite `8`
- `keycloak-js` — integracja z Keycloak
- `react-router-dom`
- `react-icons` (Feather Icons)

</td>
</tr>
</table>

<br>

## 🔑 Role użytkowników

| Rola | Opis |
|---|---|
| 🧑‍💻 `USER` | Podstawowy użytkownik — przegląda projekty, zarządza swoimi zadaniami, korzysta z czatu |
| 🧑‍🔧 `MANAGER` | Rozszerzone uprawnienia do zarządzania projektami i zespołem |
| 🛡️ `ADMIN` | Pełny dostęp, w tym Panel Administratora do zarządzania kontami wszystkich użytkowników |

<br>

## 🚀 Szybki start

### Wymagania

- Java 21 (JDK)
- Maven (lub dołączony `mvnw`)
- Node.js + npm
- PostgreSQL (lokalnie, port `5432`)
- Keycloak `26.4.0`

### 1. Baza danych

Domyślnie backend łączy się z bazą `postgres` na `localhost:5432` (użytkownik/hasło: `postgres` / `postgres`). Schemat tabel tworzy się automatycznie przy starcie aplikacji.

### 2. Keycloak

```bash
# 1. Zainstaluj i uruchom Keycloak (wersja 26.4.0)
# 2. Zaloguj się na panel administratora: http://localhost:8080
# 3. W panelu bocznym: „Manage realms” → „Create realm”
# 4. Zaimportuj plik backend/programowanie-zwinne-realm.json
#    i nazwij realm: programowanie-zwinne
```

> 📄 Pełna instrukcja: [`backend/KeyCloak-README.md`](backend/KeyCloak-README.md)

### 3. Backend

```bash
cd backend
./mvnw spring-boot:run
```

➡️ API dostępne pod `http://localhost:8081`
➡️ Dokumentacja API (Swagger UI): `http://localhost:8081/swagger-ui.html`

### 4. Frontend

```bash
cd my-app
npm install
npm run dev
```

➡️ Aplikacja dostępna pod `http://localhost:5173`

<br>

### Podsumowanie adresów

| Usługa | Adres |
|---|---|
| Frontend | http://localhost:5173 |
| Backend / REST API | http://localhost:8081 |
| Swagger UI | http://localhost:8081/swagger-ui.html |
| Keycloak | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

<br>

## 📡 API

Pełna, interaktywna dokumentacja (Swagger UI) generowana jest automatycznie pod `/swagger-ui.html`. Najważniejsze zasoby REST:

| Zasób | Bazowa ścieżka | Opis |
|---|---|---|
| Uwierzytelnianie | `/auth` | Rejestracja użytkowników |
| Projekty | `/api/projekt` | CRUD projektów, przypisania, załączniki |
| Zadania | `/api/zadanie` | CRUD zadań, zmiana statusu/priorytetu, przypisania |
| Użytkownicy | `/api/uzytkownik` | Lista, edycja, usuwanie kont |
| Czat | `/api/chats`, `/ws/chat` | Konwersacje, wiadomości, kanał WebSocket |

<br>

## 📁 Struktura repozytorium

```
.
├── backend/               # Spring Boot — REST API, WebSocket, Keycloak, powiadomienia
│   └── src/main/java/com/project/backend/
│       ├── controller/     # kontrolery REST
│       ├── service/        # logika biznesowa
│       ├── model/          # encje JPA
│       ├── repository/     # repozytoria Spring Data
│       └── notification/   # cotygodniowe powiadomienia e-mail
├── my-app/                 # React + Vite — frontend SPA
│   └── src/
│       ├── pages/           # widoki (Dashboard, AddProject, AddTask, AdminPanel, ...)
│       ├── components/      # komponenty wielokrotnego użytku (modale, czat, sidebar)
│       └── api/             # klienci REST/WebSocket
└── README.md
```

<br>

## 🗺️ Roadmapa

- [ ] Podpięcie obsługi załączników projektów w interfejsie (API już gotowe)
- [ ] Dodanie pełnoekranowego formularza tworzenia projektu do nawigacji
- [ ] Ekran profilu użytkownika
- [ ] Wybór motywu kolorystycznego przez użytkownika
- [ ] Rozbudowa dokumentacji bezpieczeństwa i logowania zdarzeń

<br>

## 🧪 Testy

Backend zawiera testy jednostkowe i integracyjne (JUnit + Spring Boot Test) dla kontrolerów, serwisów, powiadomień tygodniowych oraz obsługi załączników:

```bash
cd backend
./mvnw test
```

<br>

## 👥 Autorzy

Projekt zespołowy realizowany w ramach przedmiotu **Programowanie Zwinne**.

<br>

<div align="center">

Zrobione z 🫒 oliwkową zielenią i 🌸 różem — zgodnie z paletą [`inspo_frontend.md`](inspo_frontend.md)

</div>
