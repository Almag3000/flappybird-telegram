import './styles/global.css'
import './styles/menu.css'
import { Router } from './router.js'
import { HomeScreen } from './screens/HomeScreen.js'
import { BotSetupScreen } from './screens/BotSetupScreen.js'
import { OnlineScreen } from './screens/OnlineScreen.js'

const app = document.getElementById('app')
const router = new Router(app)

function showHome() {
  router.show(HomeScreen({
    onSelectMode(mode) {
      if (mode === 'bot')    showBotSetup()
      if (mode === 'online') showOnline()
      if (mode === 'local')  showBotSetup('local')
    }
  }))
}

function showBotSetup(mode = 'bot') {
  router.show(BotSetupScreen({
    onBack: showHome,
    onStart(config) {
      console.log('Start game:', config)
      // Step 3: will navigate to GameScreen
    }
  }))
}

function showOnline() {
  router.show(OnlineScreen({ onBack: showHome }))
}

showHome()
