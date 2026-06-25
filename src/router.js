export class Router {
  constructor(appEl) {
    this.app = appEl
    this.current = null
  }

  show(screenEl) {
    this.app.innerHTML = ''
    this.app.appendChild(screenEl)
    this.current = screenEl
  }
}
