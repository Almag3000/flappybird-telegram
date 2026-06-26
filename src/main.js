import './styles/global.css'
import './styles/menu.css'
import './styles/board.css'
import './styles/game.css'
import './styles/online.css'
import './styles/matchmaking.css'
import { Router }            from './router.js'
import { HomeScreen }        from './screens/HomeScreen.js'
import { NicknameScreen }    from './screens/NicknameScreen.js'
import { BotSetupScreen }    from './screens/BotSetupScreen.js'
import { OnlineSetupScreen } from './screens/OnlineSetupScreen.js'
import { MatchmakingScreen } from './screens/MatchmakingScreen.js'
import { GameScreen }        from './screens/GameScreen.js'
import { GameOnlineScreen }  from './screens/GameOnlineScreen.js'
import {
  getNickname, getUserId, registerPresence, isFirebaseConfigured,
} from './engine/Lobby.js'

const app    = document.getElementById('app')
const router = new Router(app)

if (isFirebaseConfigured()) registerPresence(getUserId())

function showHome() {
  router.show(HomeScreen({
    onSelectMode(mode) {
      if (mode === 'bot')    showBotSetup()
      if (mode === 'local')  showGame({ mode: 'local', color: 'white', level: null })
      if (mode === 'online') showOnlineSetup()
      if (mode === 'match')  showMatchmaking()
    },
    onChangeNickname: showNicknameChange,
  }))
}

function showNicknameChange() {
  router.show(NicknameScreen({ onBack: showHome, onDone: () => showHome() }))
}

function showBotSetup() {
  router.show(BotSetupScreen({
    onBack:  showHome,
    onStart: (config) => showGame({ ...config, mode: 'bot' }),
  }))
}

function showOnlineSetup() {
  router.show(OnlineSetupScreen({
    onBack:      showHome,
    onGameReady: (config) => router.show(GameOnlineScreen({ config, onBack: showHome })),
  }))
}

function showMatchmaking() {
  router.show(MatchmakingScreen({
    onBack:      showHome,
    onGameReady: (config) => router.show(GameOnlineScreen({ config, onBack: showHome })),
  }))
}

function showGame(config) {
  router.show(GameScreen({ config, onBack: showHome }))
}

if (!getNickname()) {
  router.show(NicknameScreen({ onDone: () => showHome() }))
} else {
  showHome()
}
