var cvData = {
  home: { lat: -12.0464, lon: -77.0428, city: "Lima, Perú" },

  experience: [
    {
      id: 1, type: "trabajo",
      org: "Walsh Perú By SGS", role: "Gerente de SIG e Innovación",
      period: "Jul 2022 – Actualidad", city: "Lima, Perú",
      lat: -12.1211, lon: -76.9967,
      url: "https://www.walshp.com.pe",
      tools: ["QGIS","PostGIS","GeoServer","Python","Pytorch","Leaflet","ArcGIS Pro"],
      desc: "Planificar, ejecutar y monitorear la Gerencia GIS e Innovación. QA/QC de bases de datos geoespaciales y algoritmos de aplicaciones web."
    },
    {
      id: 2, type: "trabajo",
      org: "MINCETUR", role: "Especialista en Geocodificación",
      period: "Mar 2022 – Jul 2022", city: "Lima, Perú",
      lat: -12.0979, lon: -77.0146,
      url: "https://www.mincetur.gob.pe",
      tools: ["QGIS","PostGIS","GeoServer","Python","C#",".Net","QField"],
      desc: "Diseño de bases de datos geoespaciales y geocodificación de establecimientos turísticos a nivel nacional. Desarrollo de visor web geoespacial."
    },
    {
      id: 3, type: "trabajo",
      org: "CDC PERÚ – Ministerio de Salud", role: "Analista Geoespacial",
      period: "Jun 2021 – Jul 2021", city: "Lima, Perú",
      lat: -12.0853, lon: -77.0498,
      url: "https://www.gob.pe/minsa",
      tools: ["R","QGIS","HERE Technologies"],
      desc: "Algoritmo de geocodificación de direcciones de casos COVID-19, a nivel nacional."
    },
    {
      id: 4, type: "trabajo",
      org: "COES Educación – Ministerio de Educación", role: "Especialista SIG",
      period: "Oct 2020 – May 2021", city: "Lima, Perú",
      lat: -12.0981, lon: -77.0271,
      url: "https://www.minedu.gob.pe",
      tools: ["QGIS","PostGIS","GeoServer","Leaflet","ArcGIS API JS"],
      desc: "Visores web geográficos para monitoreo de emergencias y desastres en el sector educación."
    },
    {
      id: 5, type: "trabajo",
      org: "Ministerio de Cultura", role: "Consultor SIG",
      period: "Feb 2020 – Mar 2020", city: "Lima, Perú",
      lat: -12.0866, lon: -77.0018,
      url: "https://www.gob.pe/cultura",
      tools: ["QGIS","Geopackage"],
      desc: "Actualización del Mapa Geoétnico en GEOCULTURA. Bases de datos vectoriales de Gestión de Riesgos."
    },
    {
      id: 6, type: "trabajo",
      org: "Línea GIS S.A.C.", role: "Especialista GIS",
      period: "Ene 2019 – Ago 2020", city: "Lima, Perú",
      lat: -12.1472, lon: -77.0100,
      url: null,
      tools: ["QGIS","PostGIS","GeoServer","Leaflet","ArcGIS"],
      desc: "Geomarketing: zonificación comercial, rutas óptimas, análisis de mercados territoriales y segmentación de consumidores."
    },
    {
      id: 7, type: "trabajo",
      org: "Universidad Peruana Cayetano Heredia / UNESCO", role: "Consultor",
      period: "Oct 2019 – Ene 2020", city: "Lima, Perú",
      lat: -12.0237, lon: -77.0567,
      url: "https://cayetano.edu.pe/",
      tools: ["QGIS","R"],
      desc: "Modelos de ordenamiento de servicios de educación superior tecnológica pública con enfoque territorial."
    },
    {
      id: 8, type: "trabajo",
      org: "What3Words", role: "Consultor",
      period: "Mar 2017 – Jun 2017", city: "Lima, Perú",
      lat: -12.060, lon: -77.0416,
      url: "https://what3words.com",
      tools: ["Geocodificación"],
      desc: "Consultoría para proyecto tecnológico de reconocimiento de voz multilenguaje en relación al sistema de geocodificación."
    },
    {
      id: 9, type: "trabajo",
      org: "Ministerio de Educación", role: "Analista SIG",
      period: "2013 – 2020", city: "Lima, Perú",
      lat: -12.0851, lon: -77.0007,
      url: "https://www.minedu.gob.pe",
      tools: ["ArcGIS","QGIS","R","SPSS"],
      desc: "Análisis espacial, geocodificación, cartografía temática para políticas educativas: poblaciones indígenas, rurales, educación inicial."
    },
    {
      id: 10, type: "trabajo",
      org: "Municipalidad Provincial del Callao", role: "Cadista GIS",
      period: "Nov 2011 – Ene 2013", city: "Callao, Perú",
      lat: -12.0634, lon: -77.1472,
      url: "https://www.municallao.gob.pe",
      tools: ["AutoCAD Map","ArcGIS"],
      desc: "Actualización catastral del Ex Fundo Oquendo-Taboada."
    }
  ],

  events: [
    {
      id: 111, type: "evento",
      org: "Python Norte 2026", role: "Ponente",
      period: "Jul 2026", city: "Ananindeua, Pará, Brasil",
      lat: -1.3882, lon: -48.4145,
      url: "https://pythonnorte.org/",
      desc: "Sede: Universidade da Amazônia (UNAMA), Campus Ananindeua. Palestras: «Espaço Geográfico, Inteligência Artificial e Amazônia: perspectivas desde a Geografia latino-americana» y «Construindo um servidor MCP com Python para análise geoespacial da Amazônia»."
    },
    {
      id: 110, type: "evento",
      org: "Python Norte 2025", role: "Ponente",
      period: "Jul 2025", city: "Belém do Pará, Brasil",
      lat: -1.4379, lon: -48.4615,
      url: "https://2025.pythonnorte.org/",
      desc: "Sede: Instituto Federal do Pará (IFPA), Campus Belém. Palestra: «Ranking Spotify 2024»."
    },
    {
      id: 101, type: "evento",
      org: "FOSS4G Belém 2024– QGIS LATAM", role: "Ponente",
      period: "Dic 2024", city: "Belém do Pará, Brasil",
      lat: -1.4216, lon: -48.4565,
      url: "https://2024.foss4g.org",
      desc: "Palestra: Uso de tecnologías disruptivas para la gestión cartográfica en la música Metal en el Perú (1980–2024), con QGIS, PostGIS y Python."
    },
    {
      id: 102, type: "evento",
      org: "QGIS User Conference 2023", role: "Ponente",
      period: "Abr 2023", city: "'s-Hertogenbosch, Holanda",
      lat: 51.6963, lon: 5.2937,
      url: "https://uc2023.qgis.nl/",
      desc: "Ponencia: Asociación QGIS Perú — Promoting GIS networks in Latin America and Europe."
    },
    {
      id: 103, type: "evento",
      org: "LatinR", role: "Ponente",
      period: "Sep 2019", city: "Santiago de Chile, Chile",
      lat: -33.4412, lon: -70.6406,
      url: "https://latin-r.com",
      desc: "Ponencia: Evangelización en el uso y manejo de información espacial para servicios educativos en ámbitos bilingües, con R y QGIS."
    },
    {
      id: 104, type: "evento",
      org: "13as Jornadas SIG Libre – Universitat de Girona", role: "Ponente",
      period: "May 2019", city: "Gerona, España",
      lat: 41.9858, lon: 2.8272,
      url: "https://www.jornadassiglibre.org/",
      desc: "Ponencia: Herramientas de código abierto para información espacial en lenguas originarias, nueva ruralidad e interculturalidad en el Perú."
    },
    {
      id: 105, type: "evento",
      org: "Geoinquiet@s Argentina", role: "Ponente",
      period: "Abr 2019", city: "Buenos Aires, Argentina",
      lat: -34.6051, lon: -58.3883,
      url: "https://geoinquietos.org",
      desc: "Ponencia: Herramientas de código abierto para información espacial en contextos bilingües e interculturalidad en el Perú."
    },
    {
      id: 106, type: "evento",
      org: "12as Jornadas SIG Libre – Universitat de Girona", role: "Ponente",
      period: "Jun 2018", city: "Gerona, España",
      lat: 41.9858, lon: 2.8272,
      url: "https://www.jornadassiglibre.org/",
      desc: "Ponencia: Juego Libre e Inteligencia Espacial para la calidad de los Entornos Familiares en un distrito de Lima."
    },
    {
      id: 107, type: "evento",
      org: "Offord Centre for Child Studies", role: "Capacitación EDI",
      period: "Feb 2015", city: "Hamilton, Ontario, Canadá",
      lat: 43.2608, lon: -79.8561,
      url: "https://offordcentre.com",
      desc: "Capacitación en análisis de datos estadísticos y espaciales del Instrumento de Desarrollo Temprano EDI."
    },
    {
      id: 108, type: "evento",
      org: "PUCE", role: "Ponente",
      period: "Ago 2010", city: "Quito, Ecuador",
      lat: -0.2099, lon: -78.4922,
      url: "https://www.puce.edu.ec",
      desc: "Participación como estudiante en evento de la Pontificia Universidad Católica del Ecuador."
    },
    {
      id: 109, type: "evento",
      org: "Uniwersytet Warszawski", role: "Workshop",
      period: "May 2019", city: "Varsovia, Polonia",
      lat: 52.2394, lon: 21.0169,
      url: "https://www.uw.edu.pl",
      desc: "Workshop en la Universidad de Varsovia como QGIS Perú"
    }
  ],

  voluntariado: [
    {
      id: 301, type: "voluntariado",
      org: "Asociación QGIS Perú", role: "Vicepresidente (Directorio)",
      period: "Oct 2020 – Actualidad", city: "Lima, Perú",
      lat: -12.0580, lon: -77.0550,
      url: "https://qgis.pe",
      desc: "Miembro del Directorio como Vicepresidente. Promoción del uso de QGIS y herramientas de código abierto en la comunidad geoespacial peruana."
    },
    {
      id: 302, type: "voluntariado",
      org: "Asociación QGIS España", role: "Vocal (Directorio)",
      period: "Jun 2019 – Actualidad", city: "España",
      lat: 40.4168, lon: -3.7038,
      url: "https://qgis.es",
      desc: "Miembro del Directorio como Vocal. Colaboración en la promoción de redes GIS entre América Latina y Europa."
    },
    {
      id: 303, type: "voluntariado",
      org: "Beneficencia de Lima", role: "Voluntario",
      period: "Por confirmar", city: "Lima, Perú",
      lat: -12.0417, lon: -77.0071,
      url: "https://www.beneficenciadelima.org/public/presbitero-maestro",
      desc: "Restauración de monumentos históricos."
    }
  ],

  education: [
    {
      id: 201, type: "educacion",
      org: "Universidad Nacional de Ingeniería (UNI)", role: "Maestría en Business Analytics e IA Aplicada",
      period: "2025 – En curso", city: "Lima, Perú",
      lat: -12.0191, lon: -77.0494,
      url: "https://www.uni.edu.pe",
      desc: "Mención honrosa: Primer puesto. Facultad de Ingeniería Industrial y de Sistemas – FIIS."
    },
    {
      id: 202, type: "educacion",
      org: "Universidad Nacional Mayor de San Marcos (UNMSM)", role: "Geógrafo",
      period: "2013", city: "Lima, Perú",
      lat: -12.0567, lon: -77.0851,
      url: "https://www.unmsm.edu.pe",
      desc: "Título Profesional de Geógrafo. Facultad de Ciencias Sociales."
    }
  ]
};
