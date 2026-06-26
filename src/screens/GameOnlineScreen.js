import { Chess } from 'chess.js'
import { Board } from '../components/Board.js'
import { getPieceSVG } from '../components/Pieces.js'
import { Sounds } from '../engine/Sounds.js'

const FILES = 'abcdefgh'
const PCAP  = {
  p: { w: '♙', b: '♟' }, n: { w: '♘', b: '♞' },
  b: { w: '♗', b: '♝' }, r: { w: '♖', b: '♜' },
  q: { w: '♕', b: '♛' },
}

export function GameOnlineScreen({ config, onBack }) {
  const { color: playerColor, conn } = config
  const pCode = playerColor[0]
  const oCode = pCode === 'w' ? 'b' : 'w'

  const state = {
    chess: new Chess(), selected: null, possibleMoves: [],
    lastMove: [], checkSquare: null, pendingPromotion: null,
    captures: { w: [], b: [] }, gameOver: false, result: null,
    opponentConnected: true,
  }

  const el = document.createElement('div')
  el.className = 'game-screen'

  el.innerHTML = `
    <div class="game-header">
      <button class="btn-ghost back-btn">← Menu</button>
      <span class="game-level-badge">🌐 Online • ${playerColor === 'white' ? 'You are White' : 'You are Black'}</span>
    </div>
    <div class="player-info" id="g-top"></div>
    <div class="board-container" id="g-board"></div>
    <div class="player-info" id="g-bottom"></div>
    <div class="game-status" id="g-status"></div>
  `
  el.querySelector('.back-btn').addEventListener('click', () => {
    try { conn?.send({ type: 'resign' }) } catch (_) {}
    onBack()
  })

  // Receive opponent moves
  if (conn) {
    conn.on('data', (msg) => {
      if (!msg || state.gameOver) return
      if (msg.type === 'move') {
        doMove({ from: msg.from, to: msg.to, promotion: msg.promotion }, false)
      } else if (msg.type === 'resign') {
        state.gameOver = true
        state.result   = { type: 'resign', winner: playerColor }
        renderAll()
        setTimeout(showResultOverlay, 400)
      }
    })

    conn.on('close', () => {
      if (!state.gameOver) {
        state.gameOver = true
        state.result   = { type: 'disconnect' }
        renderAll()
        setTimeout(showResultOverlay, 400)
      }
    })
  }

  renderAll()
  return el

  // ── Render ───────────────────────────────────────────────────

  function renderAll() { renderPlayers(); renderBoard(); renderStatus() }

  function renderPlayers() {
    const turn     = state.chess.turn()
    const opCapStr = state.captures[oCode].map(t => PCAP[t]?.[pCode] ?? '').join('')
    const myCapStr = state.captures[pCode].map(t => PCAP[t]?.[oCode] ?? '').join('')

    el.querySelector('#g-top').innerHTML = playerRow({
      symbol: oCode === 'w' ? '♔' : '♚',
      cls:    oCode === 'w' ? 'white' : 'black',
      name:   'Opponent',
      caps:   opCapStr,
      active: !state.gameOver && turn === oCode,
    })
    el.querySelector('#g-bottom').innerHTML = playerRow({
      symbol: pCode === 'w' ? '♔' : '♚',
      cls:    pCode === 'w' ? 'white' : 'black',
      name:   'You',
      caps:   myCapStr,
      active: !state.gameOver && turn === pCode,
    })
  }

  function playerRow({ symbol, cls, name, caps, active }) {
    const a = active ? ' active' : ''
    return `
      <span class="player-king ${cls}${a}">${symbol}</span>
      <span class="player-name${a}">${name}</span>
      <span class="player-captures">${caps}</span>
    `
  }

  function renderBoard() {
    const container = el.querySelector('#g-board')
    container.innerHTML = ''
    const { el: boardEl } = Board({
      fen: state.chess.fen(),
      orientation: playerColor,
      interactive: {
        selectedSquare: state.selected,
        possibleMoves:  state.possibleMoves,
        lastMove:       state.lastMove,
        checkSquare:    state.checkSquare,
        onSquareClick:  handleSquareClick,
      },
    })
    container.appendChild(boardEl)
  }

  function renderStatus() {
    const s = el.querySelector('#g-status')
    if (state.gameOver) { s.textContent = ''; return }
    const turn = state.chess.turn()
    if (turn !== pCode) { s.textContent = "Opponent's turn…"; return }
    s.textContent = state.chess.isCheck()
      ? `You are in check!`
      : `Your turn — ${playerColor === 'white' ? 'White' : 'Black'}`
  }

  // ── Interaction ───────────────────────────────────────────────

  function handleSquareClick(square) {
    if (state.gameOver || state.pendingPromotion) return
    if (state.chess.turn() !== pCode) return   // not your turn

    const chess = state.chess
    const piece = chess.get(square)
    const turn  = chess.turn()

    if (!state.selected) {
      if (piece && piece.color === turn) {
        state.selected      = square
        state.possibleMoves = chess.moves({ square, verbose: true }).map(m => m.to)
        renderBoard()
      }
      return
    }

    if (state.possibleMoves.includes(square)) {
      const moving = chess.get(state.selected)
      const isPromo = moving?.type === 'p' &&
        ((turn === 'w' && square[1] === '8') || (turn === 'b' && square[1] === '1'))

      if (isPromo) {
        state.pendingPromotion = { from: state.selected, to: square }
        state.selected = null; state.possibleMoves = []
        renderBoard()
        showPromotionPopup(turn)
      } else {
        doMove({ from: state.selected, to: square }, true)
      }
      return
    }

    if (piece && piece.color === turn) {
      state.selected = square
      state.possibleMoves = chess.moves({ square, verbose: true }).map(m => m.to)
    } else {
      state.selected = null; state.possibleMoves = []
    }
    renderBoard()
  }

  // ── Move execution ───────────────────────────────────────────

  function doMove(moveObj, sendToOpponent) {
    const result = state.chess.move(moveObj)
    if (!result) return

    state.selected = null; state.possibleMoves = []
    state.lastMove = [result.from, result.to]
    state.pendingPromotion = null

    if (result.captured) state.captures[result.color].push(result.captured)

    if      (result.flags.includes('k') || result.flags.includes('q')) Sounds.castle()
    else if (result.captured)                                           Sounds.capture()
    else                                                                Sounds.move()

    if (navigator.vibrate) navigator.vibrate(result.captured ? 30 : 15)

    state.checkSquare = null
    if (state.chess.isCheck()) { findKingSquare(state.chess.turn()); Sounds.check() }

    if (state.chess.isCheckmate()) {
      const winner = state.chess.turn() === 'w' ? 'Black' : 'White'
      state.gameOver = true
      state.result   = { type: 'checkmate', winner }
    } else if (state.chess.isStalemate()) {
      state.gameOver = true; state.result = { type: 'stalemate' }
    } else if (state.chess.isDraw()) {
      state.gameOver = true; state.result = { type: 'draw' }
    }

    if (sendToOpponent && conn) {
      try { conn.send({ type: 'move', from: result.from, to: result.to, promotion: result.promotion }) }
      catch (_) {}
    }

    renderAll()
    if (state.gameOver) setTimeout(showResultOverlay, 600)
  }

  function findKingSquare(color) {
    const board = state.chess.board()
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        const p = board[r][c]
        if (p && p.type === 'k' && p.color === color) {
          state.checkSquare = FILES[c] + (8 - r); return
        }
      }
  }

  function showPromotionPopup(color) {
    const popup = document.createElement('div')
    popup.className = 'promotion-popup'
    const choices = document.createElement('div')
    choices.className = 'promotion-choices'
    for (const type of ['q','r','b','n']) {
      const btn = document.createElement('button')
      btn.className = 'promotion-choice'
      btn.innerHTML = getPieceSVG(color, type)
      btn.addEventListener('click', () => {
        popup.remove()
        Sounds.promote()
        doMove({ ...state.pendingPromotion, promotion: type }, true)
      })
      choices.appendChild(btn)
    }
    popup.appendChild(choices)
    el.appendChild(popup)
  }

  function showResultOverlay() {
    const { type, winner } = state.result
    const myColor = pCode === 'w' ? 'White' : 'Black'
    const iWin    = type === 'resign' || type === 'disconnect' || winner === myColor

    const icon  = iWin ? '🏆' : type === 'stalemate' || type === 'draw' ? '🤝' : '😔'
    const title = type === 'resign'     ? 'Opponent Resigned!'
                : type === 'disconnect' ? 'Opponent Left'
                : type === 'checkmate'  ? (iWin ? 'You Win!' : 'You Lose')
                : 'Draw'
    const desc  = type === 'checkmate' ? `Checkmate — ${winner} wins`
                : type === 'stalemate' ? 'Stalemate'
                : type === 'resign'    ? 'Opponent resigned'
                : type === 'disconnect'? 'Connection lost'
                : 'Game drawn'

    const overlay = document.createElement('div')
    overlay.className = 'result-overlay'
    overlay.innerHTML = `
      <div class="result-card">
        <div class="result-icon">${icon}</div>
        <div class="result-title">${title}</div>
        <div class="result-desc">${desc}</div>
        <div class="result-actions">
          <button class="btn-primary" id="r-menu">Back to Menu</button>
        </div>
      </div>
    `
    overlay.querySelector('#r-menu').addEventListener('click', onBack)
    el.appendChild(overlay)
  }
}
