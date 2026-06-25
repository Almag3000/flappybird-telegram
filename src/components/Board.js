import { Chess } from 'chess.js'
import { getPieceSVG } from './Pieces.js'

const FILES = ['a','b','c','d','e','f','g','h']
const RANKS = ['8','7','6','5','4','3','2','1']

export function Board({ fen, orientation = 'white' }) {
  const chess = new Chess(fen)
  const boardData = chess.board()

  const wrapper = document.createElement('div')
  wrapper.className = 'board-wrapper'

  // Coordinate labels: rank (left column)
  const rankLabels = document.createElement('div')
  rankLabels.className = 'board-rank-labels'
  const ranks = orientation === 'white' ? RANKS : [...RANKS].reverse()
  ranks.forEach(r => {
    const span = document.createElement('span')
    span.textContent = r
    rankLabels.appendChild(span)
  })

  // Board grid
  const boardEl = document.createElement('div')
  boardEl.className = 'board-grid'
  boardEl.dataset.orientation = orientation

  const rowOrder = orientation === 'white' ? [0,1,2,3,4,5,6,7] : [7,6,5,4,3,2,1,0]
  const colOrder = orientation === 'white' ? [0,1,2,3,4,5,6,7] : [7,6,5,4,3,2,1,0]

  for (const r of rowOrder) {
    for (const c of colOrder) {
      const sq = document.createElement('div')
      const isLight = (r + c) % 2 !== 0
      sq.className = `square ${isLight ? 'sq-light' : 'sq-dark'}`
      sq.dataset.square = FILES[c] + RANKS[r]

      const piece = boardData[r][c]
      if (piece) {
        const pieceEl = document.createElement('div')
        pieceEl.className = 'piece'
        pieceEl.innerHTML = getPieceSVG(piece.color, piece.type)
        sq.appendChild(pieceEl)
      }

      boardEl.appendChild(sq)
    }
  }

  // File labels (bottom row)
  const fileLabels = document.createElement('div')
  fileLabels.className = 'board-file-labels'
  const files = orientation === 'white' ? FILES : [...FILES].reverse()
  files.forEach(f => {
    const span = document.createElement('span')
    span.textContent = f
    fileLabels.appendChild(span)
  })

  // Layout: rank-labels | board
  const boardRow = document.createElement('div')
  boardRow.className = 'board-row'
  boardRow.appendChild(rankLabels)
  boardRow.appendChild(boardEl)

  // Spacer for rank label alignment with file labels
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
