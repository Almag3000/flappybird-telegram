let currentMapId = null;
let currentTab = "codes";
let activeFilter = "all";
let searchQuery = "";

const listView = document.getElementById("list-view");
const detailView = document.getElementById("detail-view");
const searchInput = document.getElementById("search");
const mapList = document.getElementById("map-list");
const searchResults = document.getElementById("search-results");

function init() {
  renderMapList(MAPS);
  searchInput.addEventListener("input", onSearch);
  document.getElementById("back-btn").addEventListener("click", showList);
  setupInstallBanner();
  handleHashNavigation();
  window.addEventListener("hashchange", handleHashNavigation);
}

function handleHashNavigation() {
  const hash = location.hash.replace("#", "");
  if (hash && MAPS.find((m) => m.id === hash)) {
    showDetail(hash);
  } else {
    showList();
  }
}

function showList() {
  currentMapId = null;
  listView.style.display = "block";
  detailView.style.display = "none";
  if (location.hash) history.pushState(null, "", location.pathname);
  searchInput.focus();
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
  if (map.codes.length === 0) {
    el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🔓</div><div>Нет данных о кодах</div></div>`;
    return;
  }

  el.innerHTML = `
    <div class="legend">
      <div class="legend-item"><div class="legend-dot" style="background:var(--fixed)"></div> Постоянный</div>
      <div class="legend-item"><div class="legend-dot" style="background:var(--random)"></div> Случайный (каждую сессию)</div>
      <div class="legend-item"><div class="legend-dot" style="background:var(--key)"></div> Ключ / Карта</div>
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
          <div class="code-card type-${c.type}">
            <div class="code-top">
              <div class="code-target">${c.target}</div>
              <div class="code-badge type-${c.type}">${type.icon} ${type.label}</div>
            </div>
            ${codeDisplay}
            <div class="code-location">📍 ${c.location}</div>
            ${c.note ? `<div class="code-note">💡 ${c.note}</div>` : ""}
          </div>`;
      }).join("")}
    </div>`;
}

function renderWeapons(map) {
  const el = document.getElementById("tab-weapons");
  if (map.weapons.length === 0) {
    el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🔫</div><div>Нет данных об оружии</div></div>`;
    return;
  }
  el.innerHTML = `<div class="items-list">
    ${map.weapons.map((w) => {
      const zoneClass = w.zone === "Ограниченная зона" ? "restricted" : "free";
      const zoneLabel = w.zone === "Ограниченная зона" ? "⛔ Ограниченная зона" : "✅ Свободная зона";
      return `
        <div class="item-card">
          <div class="item-icon">${w.icon}</div>
          <div class="item-info">
            <div class="item-name">${w.name}</div>
            <div class="item-location">📍 ${w.location}</div>
            <div class="item-zone ${zoneClass}">${zoneLabel}</div>
          </div>
        </div>`;
    }).join("")}
  </div>`;
}

function renderTools(map) {
  const el = document.getElementById("tab-tools");
  if (map.tools.length === 0) {
    el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">🔧</div><div>Нет данных об инструментах</div></div>`;
    return;
  }
  el.innerHTML = `<div class="items-list">
    ${map.tools.map((t) => `
      <div class="item-card">
        <div class="item-icon">${t.icon}</div>
        <div class="item-info">
          <div class="item-name">${t.name}</div>
          <div class="item-location">📍 ${t.location}</div>
        </div>
      </div>`).join("")}
  </div>`;
}

function renderZones(map) {
  const el = document.getElementById("tab-zones");
  el.innerHTML = `<div class="zones-grid">
    ${map.zones.map((z) => `
      <div class="zone-chip"><div class="zone-dot"></div>${z}</div>
    `).join("")}
  </div>`;
}

function renderTips(map) {
  const el = document.getElementById("tab-tips");
  if (!map.tips || map.tips.length === 0) {
    el.innerHTML = `<div class="empty-state"><div class="empty-state-icon">💡</div><div>Нет советов</div></div>`;
    return;
  }
  el.innerHTML = `<div class="tips-list">
    ${map.tips.map((t) => `<div class="tip-item">${t}</div>`).join("")}
  </div>`;
}

function switchTab(tabId) {
  currentTab = tabId;
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === tabId);
  });
  document.querySelectorAll(".tab-content").forEach((el) => {
    el.classList.toggle("active", el.id === `tab-${tabId}`);
  });
}

function onSearch(e) {
  const q = e.target.value.trim().toLowerCase();
  searchQuery = q;

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
        (c.location && c.location.toLowerCase().includes(q)) ||
        (c.note && c.note.toLowerCase().includes(q))
      ) {
        codeResults.push({ map, item: c, type: "code" });
      }
    });
    [...map.weapons, ...map.tools].forEach((item) => {
      if (
        item.name.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q)
      ) {
        itemResults.push({ map, item, type: "item" });
      }
    });
  });

  searchResults.style.display = "block";
  mapList.style.display = filteredMaps.length > 0 ? "grid" : "none";
  renderMapList(filteredMaps);

  let html = "";

  if (codeResults.length > 0) {
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

  if (itemResults.length > 0) {
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

  if (!html && filteredMaps.length === 0) {
    html = `<div class="no-results">🔍 Ничего не найдено по запросу «${q}»</div>`;
  }

  searchResults.innerHTML = html;
}

let deferredPrompt = null;

function setupInstallBanner() {
  const banner = document.getElementById("install-banner");
  const installBtn = document.getElementById("install-btn");
  const closeBtn = document.getElementById("install-close");

  if (localStorage.getItem("pwa-dismissed")) {
    banner.classList.add("hidden");
    return;
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    banner.classList.remove("hidden");
    banner.style.display = "flex";
  });

  installBtn.addEventListener("click", async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    deferredPrompt = null;
    banner.classList.add("hidden");
  });

  closeBtn.addEventListener("click", () => {
    banner.classList.add("hidden");
    localStorage.setItem("pwa-dismissed", "1");
  });
}

document.addEventListener("DOMContentLoaded", init);
