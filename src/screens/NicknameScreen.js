import { setNickname } from '../engine/Lobby.js'

export function NicknameScreen({ onDone, onBack }) {
  const el = document.createElement('div')
  el.className = 'screen'

  el.innerHTML = `
    <div class="nickname-logo">♟</div>
    <p class="screen-title">Chess Online</p>
    <h2 class="screen-heading">Как вас зовут?</h2>
    <div class="nickname-form">
      <input class="nickname-input" id="nick-input" type="text"
             placeholder="Ваш ник" maxlength="20"
             autocomplete="off" autocapitalize="words" spellcheck="false"/>
      <button class="btn-primary" id="nick-btn">Начать →</button>
    </div>
    <p class="nickname-hint">Ник виден соперникам в онлайн-игре</p>
    ${onBack ? '<button class="btn-ghost" id="nick-back" style="margin-top:16px">Отмена</button>' : ''}
  `

  const input = el.querySelector('#nick-input')
  const btn   = el.querySelector('#nick-btn')

  input.addEventListener('keydown', e => { if (e.key === 'Enter') btn.click() })

  btn.addEventListener('click', () => {
    const name = input.value.trim()
    if (!name) { input.classList.add('shake'); setTimeout(() => input.classList.remove('shake'), 400); input.focus(); return }
    setNickname(name)
    onDone(name)
  })

  el.querySelector('#nick-back')?.addEventListener('click', onBack)

  setTimeout(() => input.focus(), 100)
  return el
}
