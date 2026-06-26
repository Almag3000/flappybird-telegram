import { Chess } from 'chess.js'
import { Board } from '../components/Board.js'
import { getPieceSVG } from '../components/Pieces.js'
import { Engine } from '../engine/Engine.js'
import { Sounds } from '../engine/Sounds.js'

const FILES = 'abcdefgh'
const PCAP  = {
  p: { w: '♙', b: '♟' }, n: { w: '♘', b: '♞' },
  b: { w: '♗', b: '♝' }, r: { w: '♖', b: '♜' },
  q: { w: '♕', b: '♛' },
}

export function GameScreen({ config, onBack }) {
  const { level, color: playerColor, mode } = config
  const isBot  = mode === 'bot'
  const pCode  = playerColor[0]               // 'w' | 'b'
  const oCode  = pCode === 'w' ? 'b' : 'w'
  const botLabel = level?.label ?? 'Computer'
  const botIcon  = level?.icon  ?? '🤖'

  // Engine — only in bot mode
  const engine = isBot ? new Engine() : null
  if (engine && level) engine.setLevel(level)

  const state = {
    chess:            new Chess(),
    selected:         null,
    possibleMoves:    [],
    lastMove:         [],
    checkSquare:      null,
    pendingPromotion: null,
    captures:         { w: [], b: [] },
    botThinking:      false,
    gameOver:         false,
    result:           null,
  }

  const el = document.createElement('div')
  el.className = 'game-screen'

  el.innerHTML = `
    <div class="game-header">
      <button class="btn-ghost back-btn">← Menu</button>
      <span class="game-level-badge">${botIcon} ${isBot ? botLabel : 'Local 2P'}</span>
    </div>
    <div class="player-info" id="g-top"></div>
    <div class="board-container"  id="g-board"></div>
    <div class="player-info" id="g-bottom"></div>
    <div class="game-status"      id="g-status"></div>
  `
  el.querySelector('.back-btn').addEventListener('click', () => {
    engine?.destroy()
    onBack()
  })

  renderAll()

  // If bot plays first (player is black)
  if (isBot && state.chess.turn() !== pCode) {
    scheduleBotMove()
  }

  return el

  // ── Render ─────────────────────────────────────────────────

  function renderAll() {
    renderPlayers()
    renderBoard()
    renderStatus()
  }

  function renderPlayers() {
    const turn     = state.chess.turn()
    const opCapStr = state.captures[oCode].map(t => PCAP[t]?.[pCode] ?? '').join('')
    const myCapStr = state.captures[pCode].map(t => PCAP[t]?.[oCode] ?? '').join('')

    const opActive = !state.gameOver && !state.botThinking && turn === oCode
    const meActive = !state.gameOver && !state.botThinking && turn === pCode

    el.querySelector('#g-top').innerHTML = playerRow({
      symbol: oCode === 'w' ? '♔' : '♚',
      cls:    oCode === 'w' ? 'white' : 'black',
      name:   isBot ? botLabel : (oCode === 'w' ? 'White' : 'Black'),
      caps:   opCapStr,
      active: opActive,
      thinking: state.botThinking,
    })
    el.querySelector('#g-bottom').innerHTML = playerRow({
      symbol: pCode === 'w' ? '♔' : '♚',
      cls:    pCode === 'w' ? 'white' : 'black',
      name:   isBot ? 'You' : (pCode === 'w' ? 'White' : 'Black'),
      caps:   myCapStr,
      active: meActive,
      thinking: false,
    })
  }

  function playerRow({ symbol, cls, name, caps, active, thinking }) {
    const a = active ? ' active' : ''
    const t = thinking ? ' thinking' : ''
    return `
      <span class="player-king ${cls}${a}${t}">${symbol}</span>
      <span class="player-name${a}">${name}${thinking ? ' <span class="thinking-dots"><span>.</span><span>.</span><span>.</span></span>' : ''}</span>
      <span class="player-captures">${caps}</span>
    `
  }

  function renderBoard() {
    const container = el.querySelector('#g-board')
    container.innerHTML = ''
    const { el: boardEl } = Board({
      fen:         state.chess.fen(),
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
    if (state.botThinking) { s.textContent = 'Computer is thinking…'; return }
    const turn = state.chess.turn()
    s.textContent = state.chess.isCheck()
      ? `${turn === 'w' ? 'White' : 'Black'} is in check!`
      : `${turn === 'w' ? 'White' : 'Black'} to move`
  }

  // ── Interaction ─────────────────────────────────────────────

  function handleSquareClick(square) {
    if (state.gameOver || state.pendingPromotion || state.botThinking) return
    // In bot mode, only allow clicks on player's turn
    if (isBot && state.chess.turn() !== pCode) return

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
      const moving      = chess.get(state.selected)
      const isPromotion = moving?.type === 'p' &&
        ((turn === 'w' && square[1] === '8') || (turn === 'b' && square[1] === '1'))

      if (isPromotion) {
        state.pendingPromotion = { from: state.selected, to: square }
        state.selected         = null
        state.possibleMoves    = []
        renderBoard()
        showPromotionPopup(turn)
      } else {
        doMove({ from: state.selected, to: square })
      }
      return
    }

    if (piece && piece.color === turn) {
      state.selected      = square
      state.possibleMoves = chess.moves({ square, verbose: true }).map(m => m.to)
    } else {
      state.selected      = null
      state.possibleMoves = []
    }
    renderBoard()
  }

  // ── Move execution ──────────────────────────────────────────

  function doMove(moveObj) {
    const result = state.chess.move(moveObj)
    if (!result) return

    state.selected         = null
    state.possibleMoves    = []
    state.lastMove         = [result.from, result.to]
    state.pendingPromotion = null

    if (result.captured) state.captures[result.color].push(result.captured)

    // Sound
    if      (result.flags.includes('k') || result.flags.includes('q')) Sounds.castle()
    else if (result.captured)                                           Sounds.capture()
    else                                                                Sounds.move()

    // Haptic
    if (navigator.vibrate) navigator.vibrate(result.captured ? 30 : 15)

    // King in check
    state.checkSquare = null
    if (state.chess.isCheck()) {
      findKingSquare(state.chess.turn())
      Sounds.check()
    }

    // Game over check
    if (state.chess.isCheckmate()) {
      const winner = state.chess.turn() === 'w' ? 'Black' : 'White'
      state.gameOver = true
      state.result   = { type: 'checkmate', winner }
    } else if (state.chess.isStalemate()) {
      state.gameOver = true
      state.result   = { type: 'stalemate' }
    } else if (state.chess.isDraw()) {
      state.gameOver = true
      state.result   = { type: 'draw' }
    }

    renderAll()

    if (state.gameOver) {
      playEndSound()
      setTimeout(showResultOverlay, 600)
      return
    }

    // Trigger bot move if it's bot's turn
    if (isBot && state.chess.turn() === oCode) {
      scheduleBotMove()
    }
  }

  function scheduleBotMove() {
    state.botThinking = true
    renderPlayers()
    renderStatus()

    // Small delay so UI updates before engine starts
    setTimeout(() => {
      if (!engine) { state.botThinking = false; return }

      engine.findBestMove(state.chess.fen(), level.moveTime, (moveStr) => {
        state.botThinking = false
        if (state.gameOver) return

        if (!moveStr) {
          // Engine returned no move — game might be over
          renderAll()
          return
        }
        const from      = moveStr.slice(0, 2)
        const to        = moveStr.slice(2, 4)
        const promotion = moveStr[4] || undefined
        doMove({ from, to, promotion })
      })
    }, 80)
  }

  function findKingSquare(color) {
    const board = state.chess.board()
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c]
        if (p && p.type === 'k' && p.color === color) {
          state.checkSquare = FILES[c] + (8 - r)
          return
        }
      }
    }
  }

  // ── Promotion ───────────────────────────────────────────────

  function showPromotionPopup(color) {
    const popup = document.createElement('div')
    popup.className = 'promotion-popup'
    const choices = document.createElement('div')
    choices.className = 'promotion-choices'

    for (const type of ['q', 'r', 'b', 'n']) {
      const btn = document.createElement('button')
      btn.className = 'promotion-choice'
      btn.innerHTML = getPieceSVG(color, type)
      btn.addEventListener('click', () => {
        popup.remove()
        Sounds.promote()
        doMove({ ...state.pendingPromotion, promotion: type })
      })
      choices.appendChild(btn)
    }

    popup.appendChild(choices)
    el.appendChild(popup)
  }

  // ── Result ───────────────────────────────────────────────────

  function playEndSound() {
    const { type, winner } = state.result
    if (type !== 'checkmate') { Sounds.draw(); return }
    const myColor = pCode === 'w' ? 'White' : 'Black'
    winner === myColor ? Sounds.win() : Sounds.lose()
  }

  function showResultOverlay() {
    const { type, winner } = state.result
    const myColor = pCode === 'w' ? 'White' : 'Black'
    const iWin    = winner === myColor

    const icon  = type !== 'checkmate' ? '🤝' : iWin ? '🏆' : '😔'
    const title = type !== 'checkmate' ? 'Draw'
                : iWin ? 'You Win!' : 'You Lose'
    const desc  = type === 'checkmate' ? `Checkmate — ${winner} wins`
                : type === 'stalemate' ? 'Stalemate' : 'Game drawn'

    const overlay = document.createElement('div')
    overlay.className = 'result-overlay'
    overlay.innerHTML = `
      <div class="result-card">
        <div class="result-icon">${icon}</div>
        <div class="result-title">${title}</div>
        <div class="result-desc">${desc}</div>
        <div class="result-actions">
          <button class="btn-primary" id="r-again">Play Again</button>
          <button class="btn-ghost"   id="r-menu">Menu</button>
        </div>
      </div>
    `
    overlay.querySelector('#r-again').addEventListener('click', () => {
      overlay.remove()
      Object.assign(state, {
        chess: new Chess(), selected: null, possibleMoves: [], lastMove: [],
        checkSquare: null, pendingPromotion: null, captures: { w: [], b: [] },
        botThinking: false, gameOver: false, result: null,
      })
      renderAll()
      if (isBot && state.chess.turn() !== pCode) scheduleBotMove()
    })
    overlay.querySelector('#r-menu').addEventListener('click', () => {
      engine?.destroy()
      onBack()
    })
    el.appendChild(overlay)
  }
}
