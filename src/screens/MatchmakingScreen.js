import Peer from 'peerjs'
import {
  getUserId, getNickname,
  enterQueue, findOpponent, claimOpponent,
  watchMyEntry, leaveQueue,
} from '../engine/Lobby.js'

export function MatchmakingScreen({ onBack, onGameReady }) {
  const userId   = getUserId()
  const nickname = getNickname() || 'Player'

  let peer         = null
  let cleanupQueue = null
  let unwatchEntry = null
  let done         = false

  const el = document.createElement('div')
  el.className = 'screen'
  el.innerHTML = `
    <button class="btn-ghost back-btn">← Назад</button>
    <div class="mm-logo">♟</div>
    <p class="screen-title">Поиск соперника</p>
    <h2 class="screen-heading mm-title">Подключение…</h2>
    <div class="mm-spinner"><div class="mm-ring"></div></div>
    <p class="mm-sub" id="mm-sub">Инициализируем соединение</p>
    <button class="btn-secondary mm-cancel" id="mm-cancel" style="margin-top:24px">Отмена</button>
  `

  const titleEl  = el.querySelector('.mm-title')
  const subEl    = el.querySelector('#mm-sub')

  function setStatus(title, sub) {
    titleEl.textContent = title
    subEl.textContent   = sub
  }

  function cleanup() {
    done = true
    cleanupQueue?.()
    unwatchEntry?.()
    leaveQueue(userId).catch(() => {})
    try { peer?.destroy() } catch (_) {}
    peer = null
  }

  el.querySelector('.back-btn').addEventListener('click', () => { cleanup(); onBack() })
  el.querySelector('#mm-cancel').addEventListener('click', () => { cleanup(); onBack() })

  startMatchmaking()
  return el

  // ── Matchmaking flow ──────────────────────────────────────────

  async function startMatchmaking() {
    setStatus('Поиск…', 'Создаём соединение')

    // 1. Create a PeerJS peer so we have our peer ID ready
    peer = new Peer()
    try {
      await new Promise((resolve, reject) => {
        peer.on('open', resolve)
        peer.on('error', reject)
      })
    } catch {
      if (!done) setStatus('Ошибка сети', 'Попробуйте ещё раз')
      return
    }
    if (done) return

    const myPeerId = peer.id

    // 2. Look for a waiting opponent
    setStatus('Поиск…', 'Ищем соперника')
    const opponent = await findOpponent(userId)

    if (opponent) {
      const claimed = await claimOpponent(opponent.id)
      if (claimed && !done) {
        await joinAsGuest(opponent)
        return
      }
    }

    // 3. No opponent — become the host and wait
    if (done) return
    setStatus('Ожидание…', 'Ждём соперника')

    // Register in queue before listening for connections to avoid race
    peer.on('connection', conn => {
      conn.on('open', () => {
        conn.on('data', msg => {
          if (msg.type === 'hello' && !done) {
            done = true
            const opponentNickname = msg.nickname || 'Соперник'
            conn.send({ type: 'start', yourColor: 'black', opponentNickname: nickname })
            cleanupQueue?.()
            leaveQueue(userId).catch(() => {})
            unwatchEntry?.()
            try { peer?.disconnect() } catch (_) {}
            peer = null
            setStatus('Найден!', `Соперник: ${opponentNickname}`)
            onGameReady({ mode: 'online', color: 'white', conn, opponentNickname })
          }
        })
      })
    })

    cleanupQueue = await enterQueue(userId, nickname, myPeerId)

    // Watch our own entry — if someone claims us, update the UI
    unwatchEntry = watchMyEntry(userId, data => {
      if (data?.status === 'matched' && !done) {
        setStatus('Найден!', 'Соперник подключается…')
      }
    })

    // Auto-timeout after 3 minutes
    setTimeout(() => {
      if (!done) {
        cleanup()
        setStatus('Не найдено', 'Соперник не найден. Попробуйте позже.')
        el.querySelector('#mm-cancel').textContent = '← В меню'
      }
    }, 180_000)
  }

  async function joinAsGuest(opponent) {
    setStatus('Найден!', `Соперник: ${opponent.nickname || '…'}`)

    const conn = peer.connect(opponent.peerId)

    await new Promise((resolve, reject) => {
      conn.on('open', resolve)
      conn.on('error', reject)
    }).catch(() => {
      if (!done) setStatus('Ошибка', 'Не удалось подключиться')
    })
    if (done) return

    conn.send({ type: 'hello', nickname })

    conn.on('data', msg => {
      if (msg.type === 'start' && !done) {
        done = true
        const opponentNickname = opponent.nickname || 'Соперник'
        leaveQueue(userId).catch(() => {})
        try { peer?.disconnect() } catch (_) {}
        peer = null
        onGameReady({ mode: 'online', color: 'black', conn, opponentNickname })
      }
    })

    conn.on('error', () => {
      if (!done) setStatus('Ошибка', 'Соединение разорвано')
    })
  }
}
