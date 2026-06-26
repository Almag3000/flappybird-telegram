let currentMapId = null;
let currentTab = "codes";

const listView = document.getElementById("list-view");
const detailView = document.getElementById("detail-view");
const searchInput = document.getElementById("search");
const mapList = document.getElementById("map-list");
const searchResults = document.getElementById("search-results");

function init() {
  renderMapList(MAPS);
  searchInput.addEventListener("input", onSearch);
  document.getElementById("back-btn").addEventListener("click", showList);
  setupModal();
  setupInstallBanner();
  handleHashNavigation();
  window.addEventListener("hashchange", handleHashNavigation);
}

function handleHashNavigation() {
  const hash = location.hash.replace("#", "");
  if (hash && MAPS.find((m) => m.id === hash)) {
    showDetail(hash);
  } else if (!hash) {
    showList();
  }
}

function showList() {
  currentMapId = null;
  listView.style.display = "block";
  detailView.style.display = "none";
  if (location.hash) history.pushState(null, "", location.pathname);
}

function showDetail(mapId) {
  const map = MAPS.find((m) => m.id === mapId);
  if (!map) return;
  currentMapId = mapId;
  listView.style.display = "none";
  detailView.style.display = "block";
  location.hash = mapId;
  renderDetail(map);
  window.scrollTo({ top: 0, behavior: "instant" });
}

function renderMapList(maps) {
  if (maps.length === 0) {
    mapList.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-state-icon">🔍</div>
      <div class="empty-state-text">Ничего не найдено</div>
    </div>`;
    return;
  }
  mapList.innerHTML = maps.map((m) => `
    <div class="map-card" onclick="showDetail('${m.id}')">
      <div class="map-card-top">
        <div class="map-emoji">${m.image}</div>
        <div class="map-card-title">
          <div class="map-name">${m.name}</div>
          <div class="map-subtitle">${m.subtitle}</div>
          <div class="map-region">${m.region}</div>
        </div>
      </div>
      <div class="map-stats">
        <div class="stat-chip weapons">🔫 ${m.weapons.length} оружий</div>
        <div class="stat-chip">🔧 ${m.tools.length} инструментов</div>
        <div class="stat-chip codes">🔑 ${m.codes.length} кодов</div>
      </div>
    </div>
  `).join("");
}

function renderDetail(map) {
  document.getElementById("detail-emoji").textContent = map.image;
  document.getElementById("detail-name").textContent = map.name;
  document.getElementById("detail-subtitle").textContent = map.subtitle;
  document.getElementById("detail-region").textContent = map.region;
  document.getElementById("detail-mission").textContent = map.mission;
  renderCodes(map);
  renderWeapons(map);
  renderTools(map);
  renderZones(map);
  renderTips(map);
  switchTab("codes");
}

function renderCodes(map) {
  const el = document.getElementById("tab-codes");
  if (!map.codes.length) {
    el.innerHTML = emptyState("🔓", "Нет данных о кодах");
    return;
  }
  el.innerHTML = `
    <div class="legend">
      <div class="legend-item"><div class="legend-dot" style="background:var(--fixed)"></div>Постоянный</div>
      <div class="legend-item"><div class="legend-dot" style="background:var(--random)"></div>Случайный (меняется каждую сессию)</div>
      <div class="legend-item"><div class="legend-dot" style="background:var(--key)"></div>Ключ / Карта</div>
    </div>
    <div class="codes-list">
      ${map.codes.map((c) => {
        const type = CODE_TYPES[c.type];
        const codeDisplay = c.type === "fixed"
          ? `<div class="code-value fixed-code">${c.code}</div>`
          : c.type === "random"
          ? `<div class="code-value random-code">??? (случайный)</div>`
          : `<div class="code-value key-code">${c.code}</div>`;
        return `
          <div class="code-card type-${c.type}" onclick='openModal(${JSON.stringify(map.id)}, ${JSON.stringify(c)}, "code")'>
            <div class="code-top">
              <div class="code-target">${c.target}</div>
              <div class="code-badge type-${c.type}">${type.icon} ${type.label}</div>
            </div>
            ${codeDisplay}
            <div class="code-location">📍 ${c.location}</div>
            ${c.note ? `<div class="code-note">💡 ${c.note}</div>` : ""}
            <div class="map-link-hint">Нажми, чтобы увидеть на схеме →</div>
          </div>`;
      }).join("")}
    </div>`;
}

function renderWeapons(map) {
  const el = document.getElementById("tab-weapons");
  if (!map.weapons.length) {
    el.innerHTML = emptyState("🔫", "Нет данных об оружии");
    return;
  }
  el.innerHTML = `<div class="items-list">
    ${map.weapons.map((w) => {
      const zoneClass = w.zone === "Ограниченная зона" ? "restricted" : "free";
      const zoneLabel = w.zone === "Ограниченная зона" ? "⛔ Ограниченная зона" : "✅ Свободная зона";
      return `
        <div class="item-card clickable" onclick='openModal(${JSON.stringify(map.id)}, ${JSON.stringify(w)}, "weapon")'>
          <div class="item-icon">${w.icon}</div>
          <div class="item-info">
            <div class="item-name">${w.name}</div>
            <div class="item-location">📍 ${w.location}</div>
            <div class="item-zone ${zoneClass}">${zoneLabel}</div>
          </div>
          <div class="item-map-btn" title="Показать на схеме">🗺️</div>
        </div>`;
    }).join("")}
  </div>`;
}

function renderTools(map) {
  const el = document.getElementById("tab-tools");
  if (!map.tools.length) {
    el.innerHTML = emptyState("🔧", "Нет данных об инструментах");
    return;
  }
  el.innerHTML = `<div class="items-list">
    ${map.tools.map((t) => `
      <div class="item-card clickable" onclick='openModal(${JSON.stringify(map.id)}, ${JSON.stringify(t)}, "tool")'>
        <div class="item-icon">${t.icon}</div>
        <div class="item-info">
          <div class="item-name">${t.name}</div>
          <div class="item-location">📍 ${t.location}</div>
        </div>
        <div class="item-map-btn" title="Показать на схеме">🗺️</div>
      </div>`).join("")}
  </div>`;
}

function renderZones(map) {
  const el = document.getElementById("tab-zones");
  const zones = map.zoneLayout ? map.zoneLayout.zones : [];
  el.innerHTML = `<div class="zones-grid">
    ${zones.map((z) => `
      <div class="zone-chip" onclick='openModalByZone(${JSON.stringify(map.id)}, ${JSON.stringify(z.id)})'>
        <div class="zone-dot"></div>${z.name}
      </div>
    `).join("")}
  </div>`;
}

function renderTips(map) {
  const el = document.getElementById("tab-tips");
  if (!map.tips || !map.tips.length) {
    el.innerHTML = emptyState("💡", "Нет советов");
    return;
  }
  el.innerHTML = `<div class="tips-list">
    ${map.tips.map((t) => `<div class="tip-item">${t}</div>`).join("")}
  </div>`;
}

function emptyState(icon, text) {
  return `<div class="empty-state"><div class="empty-state-icon">${icon}</div><div class="empty-state-text">${text}</div></div>`;
}

function switchTab(tabId) {
  currentTab = tabId;
  document.querySelectorAll(".tab-btn").forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.tab === tabId)
  );
  document.querySelectorAll(".tab-content").forEach((el) =>
    el.classList.toggle("active", el.id === `tab-${tabId}`)
  );
}

// ── ZONE MAP MODAL ──────────────────────────────────────────
function setupModal() {
  const overlay = document.getElementById("modal-overlay");
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.getElementById("modal-close").addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

function openModal(mapId, item, type) {
  const map = MAPS.find((m) => m.id === mapId);
  if (!map || !map.zoneLayout) return;
  showModal(map, item, type);
}

function openModalByZone(mapId, zoneId) {
  const map = MAPS.find((m) => m.id === mapId);
  if (!map || !map.zoneLayout) return;
  showModal(map, null, null, zoneId);
}

function showModal(map, item, type, forcedZoneId) {
  const zoneId = forcedZoneId || (item && item.zoneId) || null;
  const zone = zoneId ? map.zoneLayout.zones.find((z) => z.id === zoneId) : null;

  // Header
  const typeLabel = type === "weapon" ? "Оружие" : type === "tool" ? "Инструмент" : type === "code" ? "Код / Ключ" : "Зона";
  document.getElementById("modal-type").textContent = item ? (item.icon || "📍") + " " + typeLabel : "🗺️ Зона";
  document.getElementById("modal-item-name").textContent = item ? item.name || item.target : (zone ? zone.name : map.name);
  document.getElementById("modal-item-location").textContent = item ? "📍 " + (item.location || "") : "";
  document.getElementById("modal-zone-name").textContent = zone ? "Зона: " + zone.name : "";

  // SVG map
  document.getElementById("modal-map-svg-wrap").innerHTML = buildZoneMapSVG(map, zoneId);

  // Items in this zone
  if (zoneId) {
    const zoneItems = [
      ...map.weapons.filter((w) => w.zoneId === zoneId).map((w) => ({ ...w, _type: "weapon" })),
      ...map.tools.filter((t) => t.zoneId === zoneId).map((t) => ({ ...t, _type: "tool" })),
      ...map.codes.filter((c) => c.zoneId === zoneId).map((c) => ({ ...c, _type: "code", name: c.target, icon: CODE_TYPES[c.type]?.icon || "🔑" })),
    ];
    const current = item ? (item.name || item.target) : null;
    const others = zoneItems.filter((i) => (i.name || i.target) !== current);
    const otherEl = document.getElementById("modal-zone-items");
    if (others.length) {
      otherEl.innerHTML = `<div class="modal-also-label">Ещё в этой зоне:</div>` +
        others.map((i) => `<div class="modal-also-item">${i.icon || "📦"} ${i.name || i.target}</div>`).join("");
      otherEl.style.display = "block";
    } else {
      otherEl.innerHTML = "";
      otherEl.style.display = "none";
    }
  } else {
    document.getElementById("modal-zone-items").style.display = "none";
  }

  const overlay = document.getElementById("modal-overlay");
  overlay.classList.add("visible");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("visible");
  document.body.style.overflow = "";
}

function buildZoneMapSVG(map, highlightZoneId) {
  const layout = map.zoneLayout;
  const W = layout.w;
  const H = layout.h;
  const PAD = 4;

  const zones = layout.zones.map((z) => {
    const isHighlight = z.id === highlightZoneId;
    const fill = isHighlight ? "#c8102e" : "#1e1e1e";
    const stroke = isHighlight ? "#ff3355" : "#333";
    const textColor = isHighlight ? "#fff" : "#888";
    const label = z.label || z.name;
    // Split label for multi-line
    const words = label.split(" ");
    let lines = [];
    let cur = "";
    const maxChars = Math.floor(z.w / 7.5);
    words.forEach((word) => {
      if ((cur + " " + word).trim().length > maxChars && cur) {
        lines.push(cur.trim());
        cur = word;
      } else {
        cur = (cur + " " + word).trim();
      }
    });
    if (cur) lines.push(cur.trim());

    const cx = z.x + z.w / 2;
    const cy = z.y + z.h / 2;
    const lineH = 10;
    const totalH = lines.length * lineH;
    const startY = cy - totalH / 2 + lineH / 2;

    const textEls = lines.map((line, i) =>
      `<text x="${cx}" y="${startY + i * lineH}" text-anchor="middle" dominant-baseline="middle"
        font-size="9" fill="${textColor}" font-family="system-ui,sans-serif">${line}</text>`
    ).join("");

    const pinEl = isHighlight
      ? `<circle cx="${cx}" cy="${z.y - 8}" r="5" fill="#ff3355" opacity="0.9"/>
         <circle cx="${cx}" cy="${z.y - 8}" r="8" fill="none" stroke="#ff3355" stroke-width="1.5" opacity="0.5">
           <animate attributeName="r" values="6;12;6" dur="1.5s" repeatCount="indefinite"/>
           <animate attributeName="opacity" values="0.6;0;0.6" dur="1.5s" repeatCount="indefinite"/>
         </circle>`
      : "";

    const rectEl = `<rect x="${z.x + PAD}" y="${z.y + PAD}" width="${z.w - PAD * 2}" height="${z.h - PAD * 2}"
      rx="5" ry="5" fill="${fill}" stroke="${stroke}" stroke-width="${isHighlight ? 2 : 1}"
      ${isHighlight ? 'filter="url(#glow)"' : ""}/>`;

    return rectEl + textEls + pinEl;
  }).join("");

  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;background:#0d0d0d;border-radius:10px">
    <defs>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    ${zones}
    ${!highlightZoneId ? `<text x="${W/2}" y="${H - 8}" text-anchor="middle" font-size="9" fill="#444" font-family="system-ui">Нажми на предмет, чтобы увидеть его зону</text>` : ""}
  </svg>`;
}

// ── SEARCH ──────────────────────────────────────────────────
function onSearch(e) {
  const q = e.target.value.trim().toLowerCase();
  if (!q) {
    searchResults.style.display = "none";
    mapList.style.display = "grid";
    renderMapList(MAPS);
    return;
  }

  const filteredMaps = MAPS.filter((m) =>
    m.name.toLowerCase().includes(q) ||
    m.subtitle.toLowerCase().includes(q) ||
    m.region.toLowerCase().includes(q)
  );

  const codeResults = [];
  const itemResults = [];

  MAPS.forEach((map) => {
    map.codes.forEach((c) => {
      if (
        c.target.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        (c.location && c.location.toLowerCase().includes(q))
      ) codeResults.push({ map, item: c });
    });
    [...map.weapons, ...map.tools].forEach((item) => {
      if (item.name.toLowerCase().includes(q) || item.location.toLowerCase().includes(q))
        itemResults.push({ map, item });
    });
  });

  searchResults.style.display = "block";
  mapList.style.display = filteredMaps.length ? "grid" : "none";
  renderMapList(filteredMaps);

  let html = "";
  if (codeResults.length) {
    html += `<div class="search-group-title">🔑 Коды и ключи</div>`;
    html += codeResults.map(({ map, item }) => `
      <div class="search-item" onclick="showDetail('${map.id}')">
        <div style="font-size:20px">${map.image}</div>
        <div>
          <div class="search-item-map">${map.name}</div>
          <div class="search-item-text">${item.target}</div>
          <div class="search-item-sub">📍 ${item.location}</div>
        </div>
      </div>`).join("");
  }
  if (itemResults.length) {
    html += `<div class="search-group-title">🔧 Предметы и оружие</div>`;
    html += itemResults.map(({ map, item }) => `
      <div class="search-item" onclick="showDetail('${map.id}')">
        <div style="font-size:20px">${item.icon || "📦"}</div>
        <div>
          <div class="search-item-map">${map.name}</div>
          <div class="search-item-text">${item.name}</div>
          <div class="search-item-sub">📍 ${item.location}</div>
        </div>
      </div>`).join("");
  }
  if (!html && !filteredMaps.length) {
    html = `<div class="no-results">🔍 Ничего не найдено по запросу «${q}»</div>`;
  }
  searchResults.innerHTML = html;
}

// ── PWA INSTALL ──────────────────────────────────────────────
let deferredPrompt = null;
function setupInstallBanner() {
  const banner = document.getElementById("install-banner");
  if (localStorage.getItem("pwa-dismissed")) { banner.classList.add("hidden"); return; }
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    banner.classList.remove("hidden");
    banner.style.display = "flex";
  });
  document.getElementById("install-btn").addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    banner.classList.add("hidden");
  });
  document.getElementById("install-close").addEventListener("click", () => {
    banner.classList.add("hidden");
    localStorage.setItem("pwa-dismissed", "1");
  });
}

document.addEventListener("DOMContentLoaded", init);
