export function OnlineScreen({ onBack }) {
  const el = document.createElement('div')
  el.className = 'screen'
  el.innerHTML = `
    <button class="btn-ghost back-btn">← Back</button>
    <p class="screen-title">Multiplayer</p>
    <h2 class="screen-heading">Online</h2>
    <div class="card online-coming-soon">
      <span class="coming-icon">🚧</span>
      <p class="coming-title">Coming Soon</p>
      <p class="coming-desc">Online multiplayer is in development.<br>Stay tuned!</p>
    </div>
    <button class="btn-secondary" id="local-link" style="margin-top:20px">Play Local 2P instead</button>
  `
  el.querySelector('.back-btn').addEventListener('click', onBack)
  el.querySelector('#local-link').addEventListener('click', onBack)
  return el
}
