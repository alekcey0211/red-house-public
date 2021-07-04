import React from 'react'
import { useDispatch } from 'react-redux'

import Border from '/components/styled/border'
import Button from '/components/styled/button'
import KeyBoardLayout from '/components/keyBoardLayout'

import './style.sass'

/**
 * Окно ожидания в интерфейсе `Trade`.
 * 
 * @param {object} props
 * @returns {JSX.Element}
 */
const WaitingWindow = (props) => {

  /**
   * Состояния/данные интерфейса.
   */
  const { personId, personName } = props
  const layoutName = "waitingWindow"

  /**
   * Вспомогательный `dispatch`.
   */
  const dispatch = useDispatch()

  /**
   * Обработчик нажатия на `Отменить`.
   */
  const cancelTrigger = () => {
    dispatch({type: "TRADE_NULLIFY"})

    window.mp.send('cef::chat:send', `/TradePlayerCloseWindow ${personId}`);
    window.mp.send('cef::chat:send', `/browserFocused false`);

    window.storage.dispatch({type: "HIDE_COMPONENT", data: layoutName})

    return layoutName
  }

  return (
    <KeyBoardLayout
      name={layoutName}
      hotKeys={{
        close: {
          ["Escape"]: cancelTrigger
        }
      }}
    >
      <div id="waitingWindow">
        <Border 
          style={{
            padding: "20px"
          }}
        >
          <div className="text">
            <span className="title">Ожидаем <span className="name">{ personName }</span></span>
          </div>
          <div className="loading">
            <div className="bubble"></div>
            <div className="bubble"></div>
            <div className="bubble"></div>
          </div>
          <Button 
            type="action"
            triggerKey="Esc" 
            onClick={cancelTrigger} 
            description="Отменить"
            style={{
              width: "min-content",
              margin: "20px auto 0px auto"
            }}
          />
        </Border>
      </div>
    </KeyBoardLayout>
  )

}

export default WaitingWindow