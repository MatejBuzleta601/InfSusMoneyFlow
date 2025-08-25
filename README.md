# MoneyFlow
MoneyFlow je web servis koji omogućuje praćenje i bilježenje osobnih financija.

## Opis
Cilj projekta je olakšati korisnicima evidenciju prihoda i troškova te pružiti pregled kroz tablice i grafove.
Backend je izrađen u Flasku i pomoću Postmana sam ga testirao prije nego sam krenuo sa frontendom. Frontend sam radio u HTML + CSS koristeći Bootstrap linkove za CSS.
Docker se koristi za pokretanje aplikacije na lokalno računalo.

## Funkcionalnosti
- Dodavanje novih transakcija (prihod/trošak)
- Uređivanje postojećih transakcija
- Brisanje transakcija
- Prikaz svih transakcija u tablici
- Grafički prikaz ukupnih prihoda i troškova
- Validacija unosa (iznos ne može biti negativni broj)

## Use Case

![Use Case](Use%20case%20MoneyFlow.png)


## Kako pokrenuti aplikaciju
1. Instalirajte Docker na svoje računalo
2. Klonirajte repozitorij:
```git clone https://github.com/MatejBuzleta601/InfSusMoneyFlow```
```cd InfSusMoneyFlow```
3. Pokrenite Docker Compose (Docker treba biti otvoren u pozadini):
```docker-compose up --build```
4. Otvorite preglednik:
Ovo je link za aplikaciju: http://localhost:5000

## Tehnologije
- Backend: Postman (za testiranje API), Python, Flask, PonyORM, SQLite
- Frontend: HTML, CSS, JS, Bootstrap
- Docker: Dockerfile, Docker Compose

## Autor
Matej Bužleta, 0303121909, FIPU 2024/2025
