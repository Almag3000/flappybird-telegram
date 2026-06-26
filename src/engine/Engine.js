// Stockfish 18 Lite (single-threaded WASM) — UCI wrapper
// Worker file: /stockfish-18-lite-single.js
// Hash #,worker tells the script it's running as a Web Worker

export class Engine {
  constructor() {
    this._ready    = false
    this._queue    = []
    this._onBest   = null
    this._timeout  = null

    try {
      this._worker = new Worker('/stockfish-18-lite-single.js#,worker')
      this._worker.onmessage = ({ data }) => this._onMessage(data)
      this._worker.onerror   = (e) => console.warn('Stockfish error:', e)
    } catch (e) {
      console.warn('Stockfish worker failed to load:', e)
      this._worker = null
    }

    this._cmd('uci')
    this._cmd('isready')
  }

  _cmd(str) {
    if (this._worker) this._worker.postMessage(str)
  }

  _onMessage(data) {
    if (typeof data !== 'string') return

    if (data === 'readyok') {
      this._ready = true
    }

    if (data.startsWith('bestmove')) {
      clearTimeout(this._timeout)
      const move = data.split(' ')[1]
      if (this._onBest && move && move !== '(none)') {
        const cb   = this._onBest
        this._onBest = null
        cb(move)
      } else if (this._onBest) {
        // No valid move (game over on engine side)
        this._onBest = null
      }
    }
  }

  setLevel({ skill, moveTime }) {
    this._moveTime = moveTime
    this._cmd(`setoption name Skill Level value ${skill}`)
    if (skill < 20) {
      this._cmd('setoption name UCI_LimitStrength value true')
      // Map skill 0-20 → ELO 700-3000
      const elo = Math.round(700 + (skill / 20) * 2300)
      this._cmd(`setoption name UCI_Elo value ${elo}`)
    } else {
      this._cmd('setoption name UCI_LimitStrength value false')
    }
  }

  findBestMove(fen, moveTime, callback) {
    if (!this._worker) {
      // Fallback: random legal move
      setTimeout(() => callback(null), 300)
      return
    }

    this._onBest = callback

    // Safety timeout: if engine hangs, call back with null
    clearTimeout(this._timeout)
    this._timeout = setTimeout(() => {
      this._cmd('stop')
      if (this._onBest) {
        const cb = this._onBest
        this._onBest = null
        cb(null)
      }
    }, moveTime + 5000)

    this._cmd('ucinewgame')
    this._cmd(`position fen ${fen}`)
    this._cmd(`go movetime ${moveTime}`)
  }

  destroy() {
    clearTimeout(this._timeout)
    try { this._cmd('quit') } catch (_) {}
    setTimeout(() => { try { this._worker?.terminate() } catch (_) {} }, 200)
  }
}
