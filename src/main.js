import './styles/global.css'
import './styles/menu.css'
import './styles/board.css'
import './styles/game.css'
import { Router } from './router.js'
import { HomeScreen } from './screens/HomeScreen.js'
import { BotSetupScreen } from './screens/BotSetupScreen.js'
import { OnlineScreen } from './screens/OnlineScreen.js'
import { GameScreen } from './screens/GameScreen.js'

const app = document.getElementById('app')
const router = new Router(app)

function showHome() {
  router.show(HomeScreen({
    onSelectMode(mode) {
      if (mode === 'bot')    showBotSetup()
      if (mode === 'online') showOnline()
      if (mode === 'local')  showBotSetup()
    }
  }))
}

function showBotSetup() {
  router.show(BotSetupScreen({
    onBack: showHome,
    onStart(config) { showGame(config) }
  }))
}

function showOnline() {
  router.show(OnlineScreen({ onBack: showHome }))
}

function showGame(config) {
  router.show(GameScreen({ config, onBack: showHome }))
}

showHome()
