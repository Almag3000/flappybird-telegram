import { Chess } from 'chess.js'
import { getPieceSVG } from './Pieces.js'

const FILES = 'abcdefgh'
const RANKS = ['8','7','6','5','4','3','2','1']

export function Board({ fen, orientation = 'white', interactive = {} }) {
  const {
    selectedSquare,
    possibleMoves = [],
    lastMove      = [],
    checkSquare,
    onSquareClick,
  } = interactive

  const chess    = new Chess(fen)
  const boardData = chess.board()

  const wrapper = document.createElement('div')
  wrapper.className = 'board-wrapper'

  const rowOrder = orientation === 'white' ? [0,1,2,3,4,5,6,7] : [7,6,5,4,3,2,1,0]
  const colOrder = orientation === 'white' ? [0,1,2,3,4,5,6,7] : [7,6,5,4,3,2,1,0]

  // Rank labels (left column)
  const rankLabels = document.createElement('div')
  rankLabels.className = 'board-rank-labels'
  ;(orientation === 'white' ? RANKS : [...RANKS].reverse()).forEach(r => {
    const span = document.createElement('span')
    span.textContent = r
    rankLabels.appendChild(span)
  })

  // Board grid
  const boardEl = document.createElement('div')
  boardEl.className = 'board-grid'

  for (const r of rowOrder) {
    for (const c of colOrder) {
      const sq          = document.createElement('div')
      const isLight     = (r + c) % 2 !== 0
      const squareName  = FILES[c] + (8 - r)
      const piece       = boardData[r][c]
      const isPossible  = possibleMoves.includes(squareName)
      const isCapture   = isPossible && !!piece

      sq.className = `square ${isLight ? 'sq-light' : 'sq-dark'}`
      if (squareName === selectedSquare)     sq.classList.add('selected')
      if (isPossible && !isCapture)          sq.classList.add('possible-move')
      if (isCapture)                         sq.classList.add('possible-capture')
      if (lastMove.includes(squareName))     sq.classList.add('highlighted-move')
      if (squareName === checkSquare)        sq.classList.add('in-check')

      if (piece) {
        const pieceEl = document.createElement('div')
        pieceEl.className = 'piece'
        pieceEl.innerHTML = getPieceSVG(piece.color, piece.type)
        sq.appendChild(pieceEl)
      }

      if (onSquareClick) {
        sq.addEventListener('click', () => onSquareClick(squareName))
      }

      boardEl.appendChild(sq)
    }
  }

  // File labels (bottom row)
  const fileLabels = document.createElement('div')
  fileLabels.className = 'board-file-labels'
  ;(orientation === 'white' ? 'abcdefgh' : 'hgfedcba').split('').forEach(f => {
    const span = document.createElement('span')
    span.textContent = f
    fileLabels.appendChild(span)
  })

  const boardRow = document.createElement('div')
  boardRow.className = 'board-row'
  boardRow.appendChild(rankLabels)
  boardRow.appendChild(boardEl)

  const fileLabelRow = document.createElement('div')
  fileLabelRow.className = 'board-file-row'
  const spacer = document.createElement('div')
  spacer.className = 'board-label-spacer'
  fileLabelRow.appendChild(spacer)
  fileLabelRow.appendChild(fileLabels)

  wrapper.appendChild(boardRow)
  wrapper.appendChild(fileLabelRow)

  return { el: wrapper, boardEl }
}
