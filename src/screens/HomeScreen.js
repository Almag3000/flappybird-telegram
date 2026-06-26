export function HomeScreen({ onSelectMode }) {
  const el = document.createElement('div')
  el.className = 'screen'
  el.innerHTML = `
    <div class="home-logo">♔</div>
    <p class="screen-title">Welcome to</p>
    <h1 class="screen-heading">Chess Online</h1>
    <div class="home-modes">
      <button class="mode-card" data-mode="bot">
        <span class="mode-icon">🤖</span>
        <span class="mode-label">vs Computer</span>
        <span class="mode-desc">Play against AI bots</span>
      </button>
      <button class="mode-card" data-mode="online">
        <span class="mode-icon">🌐</span>
        <span class="mode-label">Online</span>
        <span class="mode-desc">Play with a friend</span>
      </button>
      <button class="mode-card" data-mode="local">
        <span class="mode-icon">👥</span>
        <span class="mode-label">Local 2P</span>
        <span class="mode-desc">Pass & play on one device</span>
      </button>
    </div>
  `

  el.querySelectorAll('.mode-card').forEach(btn => {
    btn.addEventListener('click', () => onSelectMode(btn.dataset.mode))
  })

  return el
}
