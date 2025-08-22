from flask import Flask, request, jsonify
from pony.orm import Database, Required, db_session, commit
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

db = Database()
db.bind(provider='sqlite', filename='db.sqlite', create_db=True)

class Transakcija(db.Entity):
    vrsta = Required(str)
    iznos = Required(float)
    opis = Required(str)
    datum = Required(datetime)
    datum_kreiranja = Required(datetime, default=lambda: datetime.now())
    datum_promjene = Required(datetime, default=lambda: datetime.now())

db.generate_mapping(create_tables=True)

@app.route('/')
def home():
    return "MoneyFlow backend radi!"

@app.route('/transakcije', methods=['POST'])
@db_session
def add_transakcija():
    data = request.json

    required_fields = ['vrsta', 'iznos', 'opis', 'datum']
    for f in required_fields:
        if f not in data:
            return jsonify({"error": f"Nedostaje polje: {f}"}), 400

    try:
        datum_obj = datetime.fromisoformat(data['datum'])
    except ValueError:
        return jsonify({"error": "Datum nije u ISO formatu, npr. 2025-08-19T12:00:00"}), 400

    try:
        iznos = float(data['iznos'])
    except (TypeError, ValueError):
        return jsonify({"error": "iznos mora biti broj"}), 400

    if iznos < 0:
        return jsonify({"error": "Iznos ne smije biti negativan"}), 400

    nova = Transakcija(
        vrsta=data['vrsta'],
        iznos=iznos,
        opis=data['opis'],
        datum=datum_obj
    )
    commit()
    return jsonify({"id": nova.id})


@app.route('/transakcije', methods=['GET'])
@db_session
def get_transakcije():
    vrsta = request.args.get('vrsta')
    sort_by = request.args.get('sort_by')
    order = request.args.get('order', 'asc')

    query = Transakcija.select(lambda t: t.vrsta == vrsta) if vrsta else Transakcija.select()

    lista = list(query)

    if sort_by:
        reverse = True if order == 'desc' else False
        if sort_by == 'iznos':
            lista.sort(key=lambda t: t.iznos, reverse=reverse)
        elif sort_by == 'datum':
            lista.sort(key=lambda t: t.datum, reverse=reverse)

    rezultat = []
    for transakcija in lista:
        rezultat.append({
            "id": transakcija.id,
            "vrsta": transakcija.vrsta,
            "iznos": transakcija.iznos,
            "opis": transakcija.opis,
            "datum": transakcija.datum.isoformat(),
            "datum_kreiranja": transakcija.datum_kreiranja.isoformat(),
            "datum_promjene": transakcija.datum_promjene.isoformat()
        })
    return jsonify(rezultat)

@app.route('/transakcije/<int:transakcija_id>', methods=['GET'])
@db_session
def get_transakcija(transakcija_id):
    transakcija = Transakcija.get(id=transakcija_id)
    if not transakcija:
        return jsonify({"error": "Transakcija nije pronađena"}), 404

    return jsonify({
        "id": transakcija.id,
        "vrsta": transakcija.vrsta,
        "iznos": transakcija.iznos,
        "opis": transakcija.opis,
        "datum": transakcija.datum.isoformat(),
        "datum_kreiranja": transakcija.datum_kreiranja.isoformat(),
        "datum_promjene": transakcija.datum_promjene.isoformat()
    })

@app.route('/transakcije/<int:transakcija_id>', methods=['PUT'])
@db_session
def update_transakcija(transakcija_id):
    transakcija = Transakcija.get(id=transakcija_id)
    if not transakcija:
        return jsonify({"error": "Transakcija nije pronađena"}), 404

    data = request.json or {}

    if "vrsta" in data:
        if data["vrsta"] not in ("prihod", "trošak"):
            return jsonify({"error": "vrsta mora biti 'prihod' ili 'trošak'"}), 400
        transakcija.vrsta = data["vrsta"]

    if "iznos" in data:
        try:
            transakcija.iznos = float(data["iznos"])
        except (TypeError, ValueError):
            return jsonify({"error": "iznos mora biti broj"}), 400

    if transakcija.iznos < 0:
        return jsonify({"error": "Iznos ne smije biti negativan"}), 400


    if "opis" in data:
        transakcija.opis = data["opis"]

    if "datum" in data:
        try:
            transakcija.datum = datetime.fromisoformat(data["datum"])
        except ValueError:
            return jsonify({"error": "Datum nije u ISO formatu, npr. 2025-08-19T12:00:00"}), 400

    transakcija.datum_promjene = datetime.now()
    commit()

    return jsonify({
        "id": transakcija.id,
        "vrsta": transakcija.vrsta,
        "iznos": transakcija.iznos,
        "opis": transakcija.opis,
        "datum": transakcija.datum.isoformat(),
        "datum_kreiranja": transakcija.datum_kreiranja.isoformat(),
        "datum_promjene": transakcija.datum_promjene.isoformat()
    })

@app.route('/transakcije/<int:transakcija_id>', methods=['DELETE'])
@db_session
def delete_transakcija(transakcija_id):
    transakcija = Transakcija.get(id=transakcija_id)
    if not transakcija:
        return jsonify({"error": "Transakcija nije pronađena"}), 404

    transakcija.delete()
    commit()
    return jsonify({"message": f"Transakcija {transakcija_id} obrisana"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
