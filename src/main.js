import './styles/global.css'
import './styles/menu.css'
import './styles/board.css'
import './styles/game.css'
import './styles/online.css'
import { Router } from './router.js'
import { HomeScreen } from './screens/HomeScreen.js'
import { BotSetupScreen } from './screens/BotSetupScreen.js'
import { OnlineSetupScreen } from './screens/OnlineSetupScreen.js'
import { GameScreen } from './screens/GameScreen.js'
import { GameOnlineScreen } from './screens/GameOnlineScreen.js'

const app    = document.getElementById('app')
const router = new Router(app)

function showHome() {
  router.show(HomeScreen({
    onSelectMode(mode) {
      if (mode === 'bot')    showBotSetup()
      if (mode === 'local')  showGame({ mode: 'local', color: 'white', level: null })
      if (mode === 'online') showOnlineSetup()
    }
  }))
}

function showBotSetup() {
  router.show(BotSetupScreen({
    onBack:  showHome,
    onStart: (config) => showGame({ ...config, mode: 'bot' }),
  }))
}

function showOnlineSetup() {
  router.show(OnlineSetupScreen({
    onBack: showHome,
    onGameReady: (config) => {
      router.show(GameOnlineScreen({ config, onBack: showHome }))
    },
  }))
}

function showGame(config) {
  router.show(GameScreen({ config, onBack: showHome }))
}

showHome()
