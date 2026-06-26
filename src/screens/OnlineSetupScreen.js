import Peer from 'peerjs'

function genCode() {
  // 6 uppercase chars, no I/O/0/1 to avoid confusion
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

function peerId(code) { return `chess-pwa-${code.toLowerCase()}` }

export function OnlineSetupScreen({ onBack, onGameReady }) {
  const el = document.createElement('div')
  el.className = 'screen'
  let peer = null
  let view = 'menu'   // 'menu' | 'creating' | 'joining'
  let code = ''

  function cleanup() {
    try { peer?.destroy() } catch (_) {}
    peer = null
  }

  function render() {
    el.innerHTML = ''

    const back = document.createElement('button')
    back.className = 'btn-ghost back-btn'
    back.textContent = '← Back'
    back.addEventListener('click', () => { cleanup(); view === 'menu' ? onBack() : setView('menu') })
    el.appendChild(back)

    if (view === 'menu') renderMenu()
    else if (view === 'creating') renderCreating()
    else if (view === 'joining')  renderJoining()
  }

  function setView(v) { view = v; render() }

  function renderMenu() {
    const wrap = document.createElement('div')
    wrap.className = 'screen'
    wrap.style.paddingTop = '0'
    wrap.innerHTML = `
      <p class="screen-title">Multiplayer</p>
      <h2 class="screen-heading">Online</h2>
      <div class="home-modes">
        <button class="mode-card" id="btn-create">
          <span class="mode-icon">🏠</span>
          <span class="mode-label">Create Game</span>
          <span class="mode-desc">Share code with a friend</span>
        </button>
        <button class="mode-card" id="btn-join">
          <span class="mode-icon">🔗</span>
          <span class="mode-label">Join Game</span>
          <span class="mode-desc">Enter a friend's room code</span>
        </button>
      </div>
    `
    wrap.querySelector('#btn-create').addEventListener('click', startCreate)
    wrap.querySelector('#btn-join').addEventListener('click', () => setView('joining'))
    el.appendChild(wrap)
  }

  function startCreate() {
    cleanup()
    code = genCode()
    setView('creating')

    peer = new Peer(peerId(code))

    peer.on('error', (err) => {
      if (err.type === 'unavailable-id') {
        // Code taken — regenerate
        code = genCode()
        render()
        peer = new Peer(peerId(code))
        peer.on('connection', handleHostConn)
      } else {
        showError(`Connection error: ${err.message}`)
      }
    })

    peer.on('connection', handleHostConn)
  }

  function handleHostConn(conn) {
    conn.on('open', () => {
      conn.send({ type: 'start', yourColor: 'black' })
      // disconnect from signaling only — keeps conn alive
      try { peer?.disconnect() } catch (_) {}
      peer = null
      onGameReady({ mode: 'online', color: 'white', conn })
    })
  }

  function renderCreating() {
    const wrap = document.createElement('div')
    wrap.innerHTML = `
      <p class="screen-title">Room created</p>
      <h2 class="screen-heading" style="font-size:1.3rem">Share this code</h2>
      <div class="room-code-box">
        <span class="room-code" id="room-code">${code}</span>
        <button class="btn-ghost copy-btn" id="copy-code">Copy</button>
      </div>
      <p class="online-waiting"><span class="pulse-dot"></span> Waiting for opponent…</p>
    `
    wrap.querySelector('#copy-code').addEventListener('click', () => {
      navigator.clipboard?.writeText(code).catch(() => {})
      wrap.querySelector('#copy-code').textContent = 'Copied!'
    })
    el.appendChild(wrap)
  }

  function renderJoining() {
    const wrap = document.createElement('div')
    wrap.innerHTML = `
      <p class="screen-title">Join game</p>
      <h2 class="screen-heading">Enter Code</h2>
      <div class="join-form">
        <input class="code-input" id="code-input" type="text" maxlength="6"
               placeholder="XXXXXX" autocomplete="off" autocapitalize="characters" spellcheck="false"/>
        <button class="btn-primary" id="join-btn">Join</button>
      </div>
      <p class="join-status" id="join-status"></p>
    `

    const input  = wrap.querySelector('#code-input')
    const joinBtn = wrap.querySelector('#join-btn')
    const status  = wrap.querySelector('#join-status')

    input.addEventListener('input', () => {
      input.value = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    })

    joinBtn.addEventListener('click', () => {
      const c = input.value.trim()
      if (c.length !== 6) { status.textContent = 'Code must be 6 characters'; return }
      joinBtn.disabled = true
      status.textContent = 'Connecting…'

      cleanup()
      peer = new Peer()
      peer.on('open', () => {
        const conn = peer.connect(peerId(c))
        conn.on('open', () => {
          conn.on('data', (msg) => {
            if (msg.type === 'start') {
              // disconnect from signaling only — keeps conn alive
              try { peer?.disconnect() } catch (_) {}
              peer = null
              onGameReady({ mode: 'online', color: msg.yourColor === 'black' ? 'black' : 'white', conn })
            }
          })
        })
        conn.on('error', () => {
          joinBtn.disabled = false
          status.textContent = 'Could not connect. Check the code.'
        })
      })
      peer.on('error', () => {
        joinBtn.disabled = false
        status.textContent = 'Network error. Try again.'
      })
    })

    el.appendChild(wrap)
  }

  function showError(msg) {
    const s = el.querySelector('.online-waiting') || el.querySelector('.join-status')
    if (s) s.textContent = msg
  }

  render()
  return el
}
