import { Chess } from 'chess.js'
import { Board } from '../components/Board.js'

// Step 3: visual only — board renders starting position, no moves yet
export function GameScreen({ config, onBack }) {
  const { level, color } = config
  const playerColor = color          // 'white' | 'black'
  const botName = level?.label ?? 'Computer'
  const orientation = playerColor    // board faces player's color

  const chess = new Chess()

  const el = document.createElement('div')
  el.className = 'game-screen'

  function render() {
    el.innerHTML = ''

    // ── Header ──────────────────────────────────────────────
    const header = document.createElement('div')
    header.className = 'game-header'
    header.innerHTML = `
      <button class="btn-ghost back-btn">← Menu</button>
      <span class="game-level-badge">${level?.icon ?? '🤖'} ${botName}</span>
    `
    header.querySelector('.back-btn').addEventListener('click', onBack)

    // ── Opponent info ────────────────────────────────────────
    const opponentColor = playerColor === 'white' ? 'black' : 'white'
    const opponentInfo = playerInfo({
      name: botName,
      color: opponentColor,
      isBot: true,
      captures: [],
    })

    // ── Board ────────────────────────────────────────────────
    const boardContainer = document.createElement('div')
    boardContainer.className = 'board-container'
    const { el: boardEl } = Board({ fen: chess.fen(), orientation })
    boardContainer.appendChild(boardEl)

    // ── Player info ──────────────────────────────────────────
    const myInfo = playerInfo({
      name: 'You',
      color: playerColor,
      isBot: false,
      captures: [],
    })

    // ── Status bar ───────────────────────────────────────────
    const status = document.createElement('div')
    status.className = 'game-status'
    status.textContent = playerColor === 'white' ? 'Your turn — White' : 'Waiting for bot…'

    el.appendChild(header)
    el.appendChild(opponentInfo)
    el.appendChild(boardContainer)
    el.appendChild(myInfo)
    el.appendChild(status)
  }

  render()
  return el
}

function playerInfo({ name, color, isBot, captures }) {
  const div = document.createElement('div')
  div.className = 'player-info'
  const king = color === 'white' ? '♔' : '♚'
  div.innerHTML = `
    <span class="player-king ${color}">${king}</span>
    <span class="player-name">${name}</span>
    <span class="player-captures">${captures.join(' ')}</span>
  `
  return div
}
