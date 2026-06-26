// Web Audio API — synthetic chess sounds, no audio files needed

let ctx = null
function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

function click(freq = 220, dur = 0.06, gain = 0.25) {
  try {
    const c   = getCtx()
    const osc = c.createOscillator()
    const g   = c.createGain()
    osc.connect(g)
    g.connect(c.destination)
    osc.frequency.value = freq
    osc.type = 'triangle'
    g.gain.setValueAtTime(gain, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + dur)
  } catch (_) {}
}

function tone(freq, dur, gain = 0.2, type = 'sine') {
  try {
    const c   = getCtx()
    const osc = c.createOscillator()
    const g   = c.createGain()
    osc.connect(g)
    g.connect(c.destination)
    osc.frequency.value = freq
    osc.type = type
    g.gain.setValueAtTime(gain, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + dur)
  } catch (_) {}
}

function sequence(notes, interval = 0.12) {
  try {
    const c = getCtx()
    notes.forEach(([freq, dur, gain], i) => {
      const osc = c.createOscillator()
      const g   = c.createGain()
      osc.connect(g)
      g.connect(c.destination)
      osc.frequency.value = freq
      osc.type = 'sine'
      const t = c.currentTime + i * interval
      g.gain.setValueAtTime(gain ?? 0.2, t)
      g.gain.exponentialRampToValueAtTime(0.001, t + dur)
      osc.start(t)
      osc.stop(t + dur)
    })
  } catch (_) {}
}

export const Sounds = {
  move()    { click(440, 0.05, 0.18) },
  capture() { click(200, 0.10, 0.30) },
  check()   { tone(660, 0.25, 0.25, 'square') },
  castle()  { click(350, 0.07, 0.20); setTimeout(() => click(440, 0.05, 0.15), 80) },
  promote() { sequence([[523, 0.15], [659, 0.15], [784, 0.25, 0.3]]) },
  win()     { sequence([[523, 0.12, 0.25], [659, 0.12, 0.25], [784, 0.12, 0.25], [1047, 0.35, 0.3]], 0.14) },
  lose()    { sequence([[523, 0.12, 0.2], [440, 0.12, 0.2], [370, 0.12, 0.2], [294, 0.35, 0.25]], 0.15) },
  draw()    { sequence([[440, 0.15, 0.2], [440, 0.25, 0.15]], 0.2) },
}
