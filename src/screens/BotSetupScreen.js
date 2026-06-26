const LEVELS = [
  { id: 'beginner', label: 'Beginner', icon: '🌱', desc: 'Just learning',     skill: 1,  moveTime: 100  },
  { id: 'easy',     label: 'Easy',     icon: '😊', desc: 'Casual play',       skill: 5,  moveTime: 300  },
  { id: 'medium',   label: 'Medium',   icon: '🧠', desc: 'Some challenge',    skill: 10, moveTime: 1000 },
  { id: 'hard',     label: 'Hard',     icon: '💪', desc: 'Strong opponent',   skill: 16, moveTime: 2000 },
  { id: 'master',   label: 'Master',   icon: '👑', desc: 'Near perfect play', skill: 20, moveTime: 5000 },
]

export function BotSetupScreen({ onStart, onBack }) {
  let selectedLevel = 'easy'
  let selectedColor = 'white'

  const el = document.createElement('div')
  el.className = 'screen'

  function render() {
    el.innerHTML = `
      <button class="btn-ghost back-btn">← Back</button>
      <p class="screen-title">New game</p>
      <h2 class="screen-heading">vs Computer</h2>

      <div class="setup-block">
        <p class="setup-label">Difficulty</p>
        <div class="level-list">
          ${LEVELS.map(l => `
            <button class="level-item ${selectedLevel === l.id ? 'selected' : ''}" data-level="${l.id}">
              <span class="level-icon">${l.icon}</span>
              <span class="level-info">
                <span class="level-name">${l.label}</span>
                <span class="level-desc">${l.desc}</span>
              </span>
              ${selectedLevel === l.id ? '<span class="level-check">✓</span>' : ''}
            </button>
          `).join('')}
        </div>
      </div>

      <div class="setup-block">
        <p class="setup-label">Play as</p>
        <div class="color-picker">
          <button class="color-btn ${selectedColor === 'white' ? 'selected' : ''}" data-color="white">
            <span class="color-piece">♔</span>
            <span>White</span>
          </button>
          <button class="color-btn ${selectedColor === 'random' ? 'selected' : ''}" data-color="random">
            <span class="color-piece">🎲</span>
            <span>Random</span>
          </button>
          <button class="color-btn ${selectedColor === 'black' ? 'selected' : ''}" data-color="black">
            <span class="color-piece">♚</span>
            <span>Black</span>
          </button>
        </div>
      </div>

      <button class="btn-primary start-btn">Start Game</button>
    `

    el.querySelector('.back-btn').addEventListener('click', onBack)

    el.querySelectorAll('.level-item').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedLevel = btn.dataset.level
        render()
      })
    })

    el.querySelectorAll('.color-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedColor = btn.dataset.color
        render()
      })
    })

    el.querySelector('.start-btn').addEventListener('click', () => {
      const level = LEVELS.find(l => l.id === selectedLevel)
      let color = selectedColor
      if (color === 'random') color = Math.random() < 0.5 ? 'white' : 'black'
      onStart({ level, color })
    })
  }

  render()
  return el
}
