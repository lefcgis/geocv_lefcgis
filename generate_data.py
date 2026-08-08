"""
generate_data.py
Procesa los datos del CV de Luis Eduardo Ferrer Cruz y genera:
  - data/locations.geojson   → GeoJSON con todos los puntos
  - data/connections.geojson → Líneas Lima → localidades internacionales
  - data/summary.json        → Estadísticas generales

Requiere: pip install geopandas shapely pandas
"""

import json
import math
from pathlib import Path

# ── datos fuente (espejo de locations.js) ─────────────────
HOME = {"lat": -12.0464, "lon": -77.0428, "city": "Lima, Perú"}

RECORDS = [
    # Trabajos
    {"id": 1,  "type": "trabajo",   "org": "Walsh Perú By SGS",                  "role": "Gerente de SIG e Innovación",           "period": "Jul 2022 – Actualidad", "city": "Lima, Perú",                      "lat": -12.1211, "lon": -76.9967},
    {"id": 2,  "type": "trabajo",   "org": "MINCETUR",                           "role": "Especialista en Geocodificación",        "period": "Mar 2022 – Jul 2022",   "city": "Lima, Perú",                      "lat": -12.0979, "lon": -77.0146},
    {"id": 3,  "type": "trabajo",   "org": "CDC PERÚ – Ministerio de Salud",     "role": "Analista Geoespacial",                   "period": "Jun 2021 – Jul 2021",   "city": "Lima, Perú",                      "lat": -12.0853, "lon": -77.0498},
    {"id": 4,  "type": "trabajo",   "org": "COES Educación – Ministerio de Educación","role": "Especialista SIG",                  "period": "Oct 2020 – May 2021",   "city": "Lima, Perú",                      "lat": -12.0981, "lon": -77.0271},
    {"id": 5,  "type": "trabajo",   "org": "Ministerio de Cultura",              "role": "Consultor SIG",                          "period": "Feb 2020 – Mar 2020",   "city": "Lima, Perú",                      "lat": -12.0866, "lon": -77.0018},
    {"id": 6,  "type": "trabajo",   "org": "Línea GIS S.A.C.",                   "role": "Especialista GIS",                       "period": "Ene 2019 – Ago 2020",   "city": "Lima, Perú",                      "lat": -12.1472, "lon": -77.0100},
    {"id": 7,  "type": "trabajo",   "org": "Universidad Peruana Cayetano Heredia / UNESCO","role": "Consultor",                    "period": "Oct 2019 – Ene 2020",   "city": "Lima, Perú",                      "lat": -12.0237, "lon": -77.0567},
    {"id": 8,  "type": "trabajo",   "org": "What3Words",                         "role": "Consultor",                              "period": "Mar 2017 – Jun 2017",   "city": "Lima, Perú",                      "lat": -12.0600, "lon": -77.0416},
    {"id": 9,  "type": "trabajo",   "org": "Ministerio de Educación",            "role": "Analista SIG",                           "period": "2013 – 2020",           "city": "Lima, Perú",                      "lat": -12.0851, "lon": -77.0007},
    {"id": 10, "type": "trabajo",   "org": "Municipalidad Provincial del Callao","role": "Cadista GIS",                            "period": "Nov 2011 – Ene 2013",   "city": "Callao, Perú",                    "lat": -12.0634, "lon": -77.1472},
    # Eventos
    {"id": 111,"type": "evento",    "org": "Python Norte 2026",                  "role": "Ponente",                                "period": "Jul 2026",              "city": "Ananindeua, Pará, Brasil",         "lat":  -1.3882, "lon": -48.4145},
    {"id": 110,"type": "evento",    "org": "Python Norte 2025",                  "role": "Ponente",                                "period": "Jul 2025",              "city": "Belém do Pará, Brasil",            "lat":  -1.4379, "lon": -48.4615},
    {"id": 101,"type": "evento",    "org": "FOSS4G Belém 2024 – QGIS LATAM",     "role": "Ponente",                                "period": "Dic 2024",              "city": "Belém do Pará, Brasil",            "lat":  -1.4216, "lon": -48.4565},
    {"id": 102,"type": "evento",    "org": "QGIS User Conference 2023",           "role": "Ponente",                                "period": "Abr 2023",              "city": "'s-Hertogenbosch, Holanda",        "lat":  51.6963, "lon":   5.2937},
    {"id": 103,"type": "evento",    "org": "LatinR",                              "role": "Ponente",                                "period": "Sep 2019",              "city": "Santiago de Chile, Chile",         "lat": -33.4412, "lon": -70.6406},
    {"id": 104,"type": "evento",    "org": "13as Jornadas SIG Libre – Universitat de Girona","role": "Ponente",                    "period": "May 2019",              "city": "Gerona, España",                   "lat":  41.9858, "lon":   2.8272},
    {"id": 105,"type": "evento",    "org": "Geoinquiet@s Argentina",              "role": "Ponente",                                "period": "Abr 2019",              "city": "Buenos Aires, Argentina",          "lat": -34.6051, "lon": -58.3883},
    {"id": 106,"type": "evento",    "org": "12as Jornadas SIG Libre – Universitat de Girona","role": "Ponente",                    "period": "Jun 2018",              "city": "Gerona, España",                   "lat":  41.9858, "lon":   2.8272},
    {"id": 107,"type": "evento",    "org": "Offord Centre for Child Studies",     "role": "Capacitación EDI",                       "period": "Feb 2015",              "city": "Hamilton, Ontario, Canadá",        "lat":  43.2608, "lon": -79.8561},
    {"id": 108,"type": "evento",    "org": "PUCE",                                "role": "Estudiante",                             "period": "Ago 2010",              "city": "Quito, Ecuador",                   "lat":  -0.2099, "lon": -78.4922},
    {"id": 109,"type": "evento",    "org": "Uniwersytet Warszawski",              "role": "Workshop",                               "period": "May 2019",              "city": "Varsovia, Polonia",                "lat":  52.2394, "lon":  21.0169},
    # Educación
    {"id": 201,"type": "educacion", "org": "Universidad Nacional de Ingeniería (UNI)","role": "Maestría en Business Analytics e IA Aplicada","period": "2025 – En curso","city": "Lima, Perú",                  "lat": -12.0191, "lon": -77.0494},
    {"id": 202,"type": "educacion",    "org": "Universidad Nacional Mayor de San Marcos (UNMSM)","role": "Geógrafo",           "period": "2013",                  "city": "Lima, Perú",                      "lat": -12.0567, "lon": -77.0851},
    # Voluntariado
    {"id": 301,"type": "voluntariado","org": "Asociación QGIS Perú",                         "role": "Vicepresidente (Directorio)","period": "Oct 2020 – Actualidad", "city": "Lima, Perú",                  "lat": -12.0580, "lon": -77.0550, "url": "https://qgis.pe"},
    {"id": 302,"type": "voluntariado","org": "Asociación QGIS España",                        "role": "Vocal (Directorio)",         "period": "Jun 2019 – Actualidad", "city": "España",                      "lat":  40.4168, "lon":  -3.7038},
    {"id": 303,"type": "voluntariado","org": "Beneficencia de Lima",                          "role": "Voluntario",                 "period": "Por confirmar",          "city": "Lima, Perú",                  "lat": -12.0516, "lon": -77.0283, "desc": "Restauración de monumentos históricos."},
]

# ── helpers ───────────────────────────────────────────────
def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi  = math.radians(lat2 - lat1)
    dlam  = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlam/2)**2
    return round(2 * R * math.asin(math.sqrt(a)), 1)

def great_circle_points(lat1, lon1, lat2, lon2, n=30):
    """Interpolate n points along a great-circle arc (for smooth curved lines)."""
    pts = []
    for i in range(n + 1):
        t = i / n
        pts.append([
            lat1 + (lat2 - lat1) * t,
            lon1 + (lon2 - lon1) * t
        ])
    return pts

# ── build GeoJSON: points ─────────────────────────────────
features = []

# home point
features.append({
    "type": "Feature",
    "geometry": {"type": "Point", "coordinates": [HOME["lon"], HOME["lat"]]},
    "properties": {"id": 0, "type": "home", "city": HOME["city"], "org": "Residencia", "role": "Lima, Perú"}
})

for r in RECORDS:
    features.append({
        "type": "Feature",
        "geometry": {"type": "Point", "coordinates": [r["lon"], r["lat"]]},
        "properties": {k: v for k, v in r.items() if k not in ("lat","lon")}
    })

points_geojson = {"type": "FeatureCollection", "features": features}

# ── build GeoJSON: connection lines ───────────────────────
abroad = [r for r in RECORDS if r["city"] not in ("Lima, Perú", "Callao, Perú")]
seen   = set()
line_features = []

for r in abroad:
    key = (round(r["lat"],2), round(r["lon"],2))
    if key in seen:
        continue
    seen.add(key)
    pts = great_circle_points(HOME["lat"], HOME["lon"], r["lat"], r["lon"])
    dist = haversine(HOME["lat"], HOME["lon"], r["lat"], r["lon"])
    line_features.append({
        "type": "Feature",
        "geometry": {"type": "LineString", "coordinates": [[p[1], p[0]] for p in pts]},
        "properties": {"from": "Lima, Perú", "to": r["city"], "dist_km": dist}
    })

lines_geojson = {"type": "FeatureCollection", "features": line_features}

# ── summary stats ─────────────────────────────────────────
countries = len({r["city"].split(",")[-1].strip() for r in RECORDS})
summary = {
    "name": "Luis Eduardo Ferrer Cruz",
    "total_records": len(RECORDS),
    "by_type": {
        t: len([r for r in RECORDS if r["type"] == t])
        for t in ("trabajo", "evento", "educacion", "voluntariado")
    },
    "countries_visited": countries,
    "total_km_traveled": sum(
        haversine(HOME["lat"], HOME["lon"], r["lat"], r["lon"])
        for r in RECORDS if r["city"] not in ("Lima, Perú","Callao, Perú")
    ),
    "abroad_cities": [r["city"] for r in abroad if (round(r["lat"],2),round(r["lon"],2)) not in
                      {k for i,k in enumerate([(round(x["lat"],2),round(x["lon"],2)) for x in abroad]) if i < list(abroad).index(r)}]
}

# ── write output ──────────────────────────────────────────
out = Path(__file__).parent / "data"
out.mkdir(exist_ok=True)

(out / "locations.geojson").write_text(
    json.dumps(points_geojson, ensure_ascii=False, indent=2), encoding="utf-8")

(out / "connections.geojson").write_text(
    json.dumps(lines_geojson, ensure_ascii=False, indent=2), encoding="utf-8")

(out / "summary.json").write_text(
    json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8")

import sys
out_txt = sys.stdout
print("OK data/locations.geojson")
print("OK data/connections.geojson")
print("OK data/summary.json")
print(f"\nResumen:")
print(f"  Registros totales : {summary['total_records']}")
print(f"  Paises            : {summary['countries_visited']}")
print(f"  km viajados (est.): {summary['total_km_traveled']:,.0f} km")
for t, n in summary['by_type'].items():
    print(f"  {t:<12}: {n}")
