const API_URL = 'http://localhost:5000/transakcije';

let trenutniEditId = null; // čuvamo ID transakcije koja se uređuje

const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');

// Funkcija za dohvat transakcija i popunjavanje tablice
async function dohvatiTransakcije() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Neuspješan dohvat transakcija');

        const transakcije = await response.json();
        const tbody = document.querySelector('#transakcije-table tbody');
        tbody.innerHTML = ''; // očisti tablicu prije dodavanja novih redova

        let prihodi = 0;
        let troskovi = 0;

        transakcije.forEach(transakcija => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${transakcija.id}</td>
                <td>${transakcija.vrsta}</td>
                <td>${transakcija.iznos.toFixed(2)}</td>
                <td>${transakcija.opis}</td>
                <td>${new Date(transakcija.datum).toLocaleString()}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="urediTransakciju(${transakcija.id})">Uredi</button>
                    <button class="btn btn-sm btn-danger" onclick="obrisiTransakciju(${transakcija.id})">Obriši</button>
                </td>
            `;
            tbody.appendChild(tr);

            if (transakcija.vrsta === 'prihod') prihodi += transakcija.iznos;
            if (transakcija.vrsta === 'trošak') troskovi += transakcija.iznos;
        });

        // Prikaz graf
        const ctx = document.getElementById('transakcijeChart').getContext('2d');
        if (window.transakcijeChartInstance) window.transakcijeChartInstance.destroy();

        window.transakcijeChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Prihodi', 'Troškovi'],
                datasets: [{
                    label: 'Iznosi',
                    data: [prihodi, troskovi],
                    backgroundColor: ['#4caf50', '#f44336']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Prihodi vs Troškovi' }
                }
            }
        });

    } catch (err) {
        console.error(err);
        alert('Došlo je do greške prilikom dohvaćanja transakcija.');
    }
}

// Funkcija za slanje nove transakcije ili update
async function submitTransakcija(e) {
    e.preventDefault();

    const vrsta = document.getElementById('vrsta').value;
    const iznos = parseFloat(document.getElementById('iznos').value);
    const opis = document.getElementById('opis').value;
    const datum = document.getElementById('datum').value;

    try {
        let response;
        if (trenutniEditId) {
            // UPDATE
            response = await fetch(`${API_URL}/${trenutniEditId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vrsta, iznos, opis, datum })
            });
        } else {
            // POST
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vrsta, iznos, opis, datum })
            });
        }

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Nepoznata greška');
        }

        document.getElementById('transakcija-form').reset();
        trenutniEditId = null; // reset nakon updatea ili dodavanja
		submitBtn.textContent = "Dodaj transakciju"; // reset gumba
		cancelBtn.style.display = "none"; // sakrij odustani
        dohvatiTransakcije();

    } catch (err) {
        console.error(err);
        alert('Greška: ' + err.message);
    }
}

// Funkcija za brisanje transakcije
async function obrisiTransakciju(id) {
    if (!confirm("Jesi li siguran da želiš obrisati ovu transakciju?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Greška pri brisanju');
        }
        if (trenutniEditId === id) trenutniEditId = null; // ako je bila u edit modu
        dohvatiTransakcije();
    } catch (err) {
        console.error(err);
        alert('Greška: ' + err.message);
    }
}

// Funkcija za uređivanje transakcije
async function urediTransakciju(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Transakcija nije pronađena');

        const transakcija = await response.json();

        document.getElementById('vrsta').value = transakcija.vrsta;
        document.getElementById('iznos').value = transakcija.iznos;
        document.getElementById('opis').value = transakcija.opis;
        document.getElementById('datum').value = new Date(transakcija.datum).toISOString().slice(0,16);

        trenutniEditId = id; // aktiviramo edit mode
		submitBtn.textContent = "Spremi promjene"; // promjena teksta gumba
		cancelBtn.style.display = "inline-block"; // pokaži odustani

    } catch (err) {
        console.error(err);
        alert('Greška: ' + err.message);
    }
}

cancelBtn.addEventListener('click', () => {
    trenutniEditId = null;
    document.getElementById('transakcija-form').reset();
    submitBtn.textContent = "Dodaj transakciju";
    cancelBtn.style.display = "none";
});

// Event listener za formu
document.getElementById('transakcija-form').addEventListener('submit', submitTransakcija);

// Početno dohvaćanje transakcija
dohvatiTransakcije();


