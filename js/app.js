/* ── GeoCV — Luis Eduardo Ferrer Cruz ── */

const TYPE_COLOR = {
  trabajo:      '#388bfd',
  evento:       '#d29922',
  educacion:    '#2ea043',
  voluntariado: '#5e07b5'
};

const TYPE_LABEL = {
  trabajo:      'Casos de éxito',
  evento:       'Workshops',
  educacion:    'Formación académica',
  voluntariado: 'Voluntariado'
};

// ── Map init ──────────────────────────────────────────────
const map = L.map('map', {
  center: [-12.0464, -77.0428],
  zoom: 4,
  zoomControl: false,
  preferCanvas: true
});

L.control.zoom({ position: 'bottomleft' }).addTo(map);

// ── Bing quadkey helper ───────────────────────────────────
function toQuadKey(x, y, z) {
  let q = '';
  for (let i = z; i > 0; i--) {
    let d = 0;
    const mask = 1 << (i - 1);
    if ((x & mask) !== 0) d++;
    if ((y & mask) !== 0) d += 2;
    q += d;
  }
  return q;
}

const BingLayer = L.TileLayer.extend({
  getTileUrl(coords) {
    return `http://ecn.t3.tiles.virtualearth.net/tiles/a${toQuadKey(coords.x, coords.y, coords.z)}.jpeg?g=0&dir=dir_n`;
  }
});

// ── Basemaps (orden: basemaps.txt) ────────────────────────
const BASEMAPS = [
  {
    label: 'OSM Standard',
    layer: L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    })
  },
  {
    label: 'Google Satélite',
    layer: L.tileLayer('https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}', {
      attribution: '© Google',
      maxZoom: 20
    })
  },
  {
    label: 'Google Maps',
    layer: L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
      attribution: '© Google',
      maxZoom: 20
    })
  },
  {
    label: 'Bing Aerial',
    layer: new BingLayer('', { attribution: '© Microsoft Bing', maxZoom: 19 })
  },
  {
    label: 'CartoDB Dark',
    layer: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© <a href="https://carto.com/">CARTO</a> © <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      subdomains: 'abcd', maxZoom: 19
    })
  }
];

// CartoDB Dark activo por defecto (índice 4)
let activeBasemapIdx = 4;
BASEMAPS[activeBasemapIdx].layer.addTo(map);

// Paleta de líneas según basemap: luz→azul cartográfico, oscuro→verde (default), satélite→ámbar
const BASEMAP_LINE_COLORS = {
  0: { intl: '#0057a8', local: '#5b7fa8' },  // OSM Standard (fondo claro)
  1: { intl: '#f0b429', local: '#b09060' },  // Google Satélite (fondo oscuro)
  2: { intl: '#0057a8', local: '#5b7fa8' },  // Google Maps (fondo claro)
  3: { intl: '#f0b429', local: '#b09060' },  // Bing Aerial (fondo oscuro)
  4: { intl: '#45f542', local: '#719470' }   // CartoDB Dark (predeterminado)
};

// ── Basemap switcher UI ───────────────────────────────────
function buildBasemapCtrl() {
  const ctrl = document.createElement('div');
  ctrl.id = 'basemap-ctrl';

  // Header (clickable toggle)
  const header = document.createElement('button');
  header.className = 'bm-header';
  header.innerHTML = '<span>Basemap</span><span class="bm-arrow">›</span>';
  ctrl.appendChild(header);

  // Collapsible list
  const list = document.createElement('div');
  list.className = 'bm-list';
  list.style.display = 'none';         // collapsed by default

  BASEMAPS.forEach((bm, idx) => {
    const btn = document.createElement('button');
    btn.className = 'bm-btn' + (idx === activeBasemapIdx ? ' active' : '');
    btn.textContent = bm.label;
    btn.addEventListener('click', () => {
      if (idx === activeBasemapIdx) return;
      map.removeLayer(BASEMAPS[activeBasemapIdx].layer);
      activeBasemapIdx = idx;
      BASEMAPS[activeBasemapIdx].layer.addTo(map);
      BASEMAPS[activeBasemapIdx].layer.bringToBack();
      list.querySelectorAll('.bm-btn').forEach((b, i) =>
        b.classList.toggle('active', i === idx)
      );
      drawLines(currentFilter);
    });
    list.appendChild(btn);
  });

  ctrl.appendChild(list);

  header.addEventListener('click', () => {
    const open = list.style.display !== 'none';
    list.style.display = open ? 'none' : 'flex';
    header.querySelector('.bm-arrow').style.transform = open ? '' : 'rotate(90deg)';
  });

  document.getElementById('map-container').appendChild(ctrl);
}
buildBasemapCtrl();

// ── Custom SVG markers ────────────────────────────────────
function makeIcon(type, isHome) {
  const color = isHome ? '#e05c5c' : TYPE_COLOR[type];
  const size  = isHome ? 36 : 28;
  const svg = isHome
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="${color}" fill-opacity="0.25" stroke="${color}" stroke-width="2"/>
        <circle cx="18" cy="18" r="6"  fill="${color}"/>
      </svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 28 28">
        <circle cx="14" cy="14" r="12" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.5"/>
        <circle cx="14" cy="14" r="5"  fill="${color}"/>
      </svg>`;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size/2, size/2],
    popupAnchor: [0, -(size/2 + 4)]
  });
}

// ── Popup HTML ────────────────────────────────────────────
function popupHTML(item) {
  const tools = item.tools
    ? `<div class="popup-tools">${item.tools.map(t => `<span class="tool-tag">${t}</span>`).join('')}</div>`
    : '';
  const roleHTML = item.url
    ? `<a class="popup-role" href="${item.url}" target="_blank" rel="noopener">${item.role}</a>`
    : `<div class="popup-role">${item.role}</div>`;
  return `
    <div class="popup-title">${item.org}</div>
    ${roleHTML}
    <div class="popup-period">📅 ${item.period} &nbsp;|&nbsp; 📍 ${item.city}</div>
    <div class="popup-desc">${item.desc}</div>
    ${tools}`;
}

// ── Draw markers ──────────────────────────────────────────
const markerMap = {};   // id → L.marker

function drawMarkers(filter) {
  Object.values(markerMap).forEach(m => map.removeLayer(m));
  Object.keys(markerMap).forEach(k => delete markerMap[k]);

  const allItems = [
    ...cvData.experience,
    ...cvData.events,
    ...cvData.education,
    ...cvData.voluntariado
  ];

  allItems.forEach(item => {
    if (filter !== 'all' && item.type !== filter) return;

    const marker = L.marker([item.lat, item.lon], { icon: makeIcon(item.type, false) })
      .addTo(map)
      .bindPopup(popupHTML(item), { maxWidth: 280 });

    marker.on('click', () => highlightCard(item.id));
    markerMap[item.id] = marker;
  });
}

// ── Home marker ───────────────────────────────────────────
const homeMarker = L.marker([-12.0464, -77.0428], { icon: makeIcon(null, true), zIndexOffset: 1000 })
  .addTo(map)
  .bindPopup(`
    <div class="popup-title">Lima, Perú</div>
    <div class="popup-role" style="color:#e05c5c">Residencia Actual</div>
    <div class="popup-desc">Geógrafo · GIS Manager · Maestrante UNI</div>`
  );

// ── Connection lines Home → all records ──────────────────
const HOME_LATLNG  = [-12.0464, -77.0428];
const HOME_KEY     = `${HOME_LATLNG[0]},${HOME_LATLNG[1]}`;

function isLocal(item) {
  return Math.abs(item.lat - HOME_LATLNG[0]) < 0.25 &&
         Math.abs(item.lon - HOME_LATLNG[1]) < 0.25;
}

const lineGroup = L.layerGroup().addTo(map);

function drawLines(filter) {
  lineGroup.clearLayers();

  const allItems = [
    ...cvData.experience,
    ...cvData.events,
    ...cvData.education,
    ...cvData.voluntariado
  ];

  const seen = new Set();
  allItems.forEach(item => {
    if (filter !== 'all' && item.type !== filter) return;

    const key = `${item.lat},${item.lon}`;
    if (key === HOME_KEY || seen.has(key)) return;
    seen.add(key);

    const local = isLocal(item);
    const lc = BASEMAP_LINE_COLORS[activeBasemapIdx];
    lineGroup.addLayer(L.polyline(
      [HOME_LATLNG, [item.lat, item.lon]],
      {
        color:     local ? lc.local : lc.intl,
        weight:    local ? 0.8 : 1,
        opacity:   local ? 0.25 : 0.35,
        dashArray: '6 5',
        className: 'connection-path'
      }
    ));
  });
}
drawLines('all');

// ── Sidebar cards ─────────────────────────────────────────
function buildCards(filter) {
  const container = document.getElementById('sidebar-content');
  container.innerHTML = '';

  const sections = [
    { label: 'Experiencia Laboral',    key: 'experience',    items: cvData.experience },
    { label: 'Eventos & Conferencias', key: 'events',        items: cvData.events },
    { label: 'Formación Académica',    key: 'education',     items: cvData.education },
    { label: 'Voluntariado',           key: 'voluntariado',  items: cvData.voluntariado }
  ];

  sections.forEach(sec => {
    const filtered = filter === 'all'
      ? sec.items
      : sec.items.filter(i => i.type === filter);
    if (!filtered.length) return;

    const title = document.createElement('div');
    title.className = 'section-title';
    title.textContent = sec.label;
    container.appendChild(title);

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = `cv-card type-${item.type}`;
      card.dataset.id = item.id;

      const tools = item.tools
        ? `<div class="card-tools">${item.tools.map(t => `<span class="tool-tag">${t}</span>`).join('')}</div>`
        : '';

      card.innerHTML = `
        <div class="card-header">
          <div class="card-org">${item.org}</div>
          <div class="card-period">${item.period}</div>
        </div>
        <div class="card-role">${item.role}</div>
        <div class="card-city">📍 ${item.city}</div>
        <div class="card-desc">${item.desc}</div>
        ${tools}`;

      card.addEventListener('click', () => {
        const wasActive = card.classList.contains('active');
        document.querySelectorAll('.cv-card').forEach(c => c.classList.remove('active'));
        if (!wasActive) {
          card.classList.add('active');
          flyToMarker(item.id, item.lat, item.lon);
        }
      });

      container.appendChild(card);
    });
  });
}

function highlightCard(id) {
  document.querySelectorAll('.cv-card').forEach(c => c.classList.remove('active'));
  const card = document.querySelector(`.cv-card[data-id="${id}"]`);
  if (card) {
    card.classList.add('active');
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function flyToMarker(id, lat, lon) {
  map.flyTo([lat, lon], 16, { duration: 1.4 });
  setTimeout(() => {
    if (markerMap[id]) markerMap[id].openPopup();
  }, 1300);
}

// ── Filter tabs ───────────────────────────────────────────
let currentFilter = 'all';

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    buildCards(currentFilter);
    drawMarkers(currentFilter);
    drawLines(currentFilter);
  });
});

// ── Sidebar toggle ────────────────────────────────────────
const sidebar   = document.getElementById('sidebar');
const toggleBtn = document.getElementById('toggle-btn');

toggleBtn.addEventListener('click', () => {
  const collapsed = sidebar.classList.toggle('collapsed');
  toggleBtn.classList.toggle('collapsed', collapsed);
  toggleBtn.textContent = collapsed ? '›' : '‹';
  setTimeout(() => map.invalidateSize(), 310);
});

// ── Stats ─────────────────────────────────────────────────
function updateStats() {
  const years = new Date().getFullYear() - 2009;
  document.getElementById('stat-years').textContent = years;
  document.getElementById('stat-jobs').textContent  = cvData.experience.length;
  document.getElementById('stat-events').textContent = cvData.events.length + cvData.education.length;
  document.getElementById('stat-countries').textContent = 9;
}

// ── Init ──────────────────────────────────────────────────
drawMarkers('all');
drawLines('all');
buildCards('all');
updateStats();

// fit map to show all markers on load
const allCoords = [
  ...cvData.experience.map(i => [i.lat, i.lon]),
  ...cvData.events.map(i => [i.lat, i.lon]),
  ...cvData.education.map(i => [i.lat, i.lon]),
  ...cvData.voluntariado.map(i => [i.lat, i.lon])
];
let initialBounds = null;
if (allCoords.length) {
  initialBounds = L.latLngBounds(allCoords).pad(0.15);
  map.fitBounds(initialBounds);
}

// ── Home control ──────────────────────────────────────────
const HomeControl = L.Control.extend({
  options: { position: 'bottomleft' },
  onAdd() {
    const btn = L.DomUtil.create('button', 'home-ctrl-btn');
    btn.title = 'Volver a vista inicial';
    btn.innerHTML = '⌂';
    L.DomEvent.disableClickPropagation(btn);
    L.DomEvent.on(btn, 'click', () => {
      if (initialBounds) map.flyToBounds(initialBounds, { duration: 1.2 });
    });
    return btn;
  }
});
new HomeControl().addTo(map);

// ── Lightbox ──────────────────────────────────────────────
const lightbox      = document.getElementById('lightbox');
const lightboxClose = document.getElementById('lightbox-close');
const avatarImg     = document.getElementById('avatar-img');

avatarImg.addEventListener('click', () => lightbox.classList.add('open'));
lightboxClose.addEventListener('click', () => lightbox.classList.remove('open'));
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) lightbox.classList.remove('open');
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') lightbox.classList.remove('open');
});
