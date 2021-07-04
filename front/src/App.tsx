import * as React from "react"
import { connect } from "react-redux"

import { WindowSkymp } from "./types/window"
import { storage } from "./utils"

/**
 * Статика.
 *
 * Интерфейсы, которые статичные и не требует взаимодействия.
 */
import Hud from "./features/static/hud"
import Watermark from "./features/static/watermark"

/**
 * Клиент.
 *
 * Интерфейсы, с которыми взаимодействует сам пользователь.
 * Как правило запускается НЕ со стороны серверных действий, а с помощью клиента.
 */
import Chat from "./features/client/chat"
import AnimList from "./features/client/animList"

/**
 * Крафты.
 *
 * Интерфейсы (а также вспомогательные), в которых реализованы крафт чего либо.
 */
import CraftBase from "./features/crafts/craft"

/**
 * Системы.
 *
 * Интерфейсы, которые реализовывают некую игровую систему/механику.
 */

import Trade from "./features/systems/trade";
import InteractionMenu from "./features/systems/interactionMenu";

/**
 * Утилиты.
 *
 * Вспомогательные интерфейсы для корректной работы отображения на сервере.
 */
import SelectBox from "./features/utils/selectBox";
import RequestPanel from "./features/utils/requestPanel";
import StartGame from "./features/utils/startGame";

/**
 * Дополнительное.
 */
import TestHub from './test'

declare global {
  interface Window extends WindowSkymp {}
}

class App extends React.Component {
  props: any

  constructor(props: any) {
    super(props)
  }

  componentDidMount() {
    const storageData = storage.load("setting")

    if (storageData) {
      const { language, hotKeys } = storageData
      this.props.loadSettings({ language, hotKeys })
    }

    window.addEventListener("focus", this.onWindowFocus.bind(this))
    window.addEventListener("blur", this.onWindowFocus.bind(this))

    /**
     * Отправляем на сервер статус фокуса.
     *
     * Сохраняем в `state` состояния фокусировки.
     * Нужно для сокращения количества запросов.
     *
     * true  - Если сфокусировано поле ввода.
     * false - Если сфокусировано не поле ввода.
     * 
     * @param {object} event
     */
    const sendFocusStatus = (event) => {
      if (
        ["input", "textarea"].includes(
          document.activeElement.tagName.toLowerCase()
        )
      ) {
        if (!this.props.isInputFieldFocus && event.code !== 'Escape') {
          window.mp.send("cef::chat:send", "/focusInputField true")
          this.props.updateInputFieldFocus(true)
        }
      } else {
        if (this.props.isInputFieldFocus) {
          window.mp.send("cef::chat:send", "/focusInputField false")
          this.props.updateInputFieldFocus(false)
        }
      }
    }

    window.addEventListener("click", sendFocusStatus)
    window.addEventListener("keyup", sendFocusStatus)
  }

  componentWillUnmount() {
    window.removeEventListener("focus", this.onWindowFocus.bind(this))
    window.removeEventListener("blur", this.onWindowFocus.bind(this))
  }

  onWindowFocus(e: any) {
    const focus = document.hasFocus()
    this.props.updateBrowserFocus(focus)
  }

  render(): JSX.Element {
    return (
      <div className="App">
        {/* Статика */}
        <Hud />
        <Watermark />

        {/* Клиент */}
        <Chat />
        <AnimList />

        {/* Крафты */}
        <CraftBase />

        {/* Системы */}
        <Trade />
        <InteractionMenu />

        {/* Утилиты */}
        <SelectBox />
        <RequestPanel />
        <StartGame />

        {/* Тесты */}
        <TestHub/>
      </div>
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    isBrowserFocus: state.appReducer.isBrowserFocus,
    isInputFieldFocus: state.appReducer.isInputFieldFocus,
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  updateBrowserFocus: (data: any) =>
    dispatch({
      type: "UPDATE_APP_BROWSERFOCUS",
      data,
    }),
  updateInputFieldFocus: (data: any) =>
    dispatch({
      type: "UPDATE_APP_INPUTFIELDFOCUS",
      data,
    }),
  loadSettings: (data: any) =>
    dispatch({
      type: "LOAD_SETTINGS",
      data,
    }),
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
