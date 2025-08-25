# MoneyFlow
MoneyFlow je web servis koji omogućuje praćenje i bilježenje osobnih financija.
Cilj projekta je olakšati korisnicima evidenciju prihoda i troškova te pružiti pregled kroz tablice i grafove.

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
```git clone https://github.com/MatejBuzleta601/InfSusMoneyFlow
cd InfSusMoneyFlow```
3. Pokrenite Docker Compose:
```docker-compose up --build```
4. Otvorite preglednik:
Ovo je link za aplikaciju: http://localhost:5000
