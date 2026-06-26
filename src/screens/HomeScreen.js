import { getNickname, subscribeOnlineCount, isFirebaseConfigured } from '../engine/Lobby.js'

export function HomeScreen({ onSelectMode, onChangeNickname }) {
  const nickname = getNickname() || 'Игрок'
  const firebase = isFirebaseConfigured()

  const el = document.createElement('div')
  el.className = 'screen'

  el.innerHTML = `
    <div class="home-user-bar">
      <span>👤</span>
      <span class="home-user-name">${nickname}</span>
      <button class="home-change-nick" id="change-nick">изменить</button>
    </div>
    <div class="home-logo">♔</div>
    <p class="screen-title">Chess Online</p>
    <div class="home-modes">
      <button class="mode-card" data-mode="bot">
        <span class="mode-icon">🤖</span>
        <span class="mode-label">vs Бот</span>
        <span class="mode-desc">Тренируйся против ИИ</span>
      </button>
      <button class="mode-card" data-mode="online">
        <span class="mode-icon">🔗</span>
        <span class="mode-label">По коду</span>
        <span class="mode-desc">Игра с другом по коду</span>
      </button>
      <button class="mode-card" data-mode="local">
        <span class="mode-icon">👥</span>
        <span class="mode-label">Локальная</span>
        <span class="mode-desc">2 игрока на одном устройстве</span>
      </button>
      ${firebase ? `
      <button class="mode-card mode-card-match" data-mode="match">
        <span class="mode-icon">🔍</span>
        <span class="mode-label">Найти соперника</span>
        <span class="mode-desc">Быстрый поиск игры</span>
      </button>
      ` : ''}
    </div>
    ${firebase ? `
    <div class="home-online-badge">
      <span class="online-dot"></span>
      <span id="online-count">…</span>&nbsp;игроков онлайн
    </div>
    ` : ''}
  `

  el.querySelector('#change-nick').addEventListener('click', onChangeNickname)
  el.querySelectorAll('.mode-card').forEach(btn =>
    btn.addEventListener('click', () => onSelectMode(btn.dataset.mode))
  )

  if (firebase) {
    const countEl = el.querySelector('#online-count')
    const unsub = subscribeOnlineCount(n => {
      if (countEl?.isConnected) countEl.textContent = n
      else unsub()
    })
  }

  return el
}
