import React, { useRef, useEffect } from 'react';

import './style.sass';

import CountSelect from '/components/countSelect'
import WaitingWindow from './components/waitingWindow'

import KeyBoardLayout from '/components/keyBoardLayout'

import TradeBody from './components/tradeBody';
import { TradeFooter } from './components/tradeFooter';
import { useDispatch, useSelector } from 'react-redux';

import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

/**
 * Интерфейс обмена между игроками.
 * 
 * @returns {JSX.Element}
 */
const Trade = () => {

  /**
   * Состояния/данные интерфейса.
   */
  const { personId, personName } = useSelector(state => state.tradeReducer.suggestionPerson)
  const { activatePlayer, activatePerson, playerSubmit, personSubmit } = useSelector(state => state.tradeReducer)
  const activatePlayerRef = useRef(false)
  const activatePersonRef = useRef(false)
  const layoutName = 'trade'

  /**
   * Вызывается при изменении состояний готовности игроков.
   */
  useEffect(() => {
    activatePlayerRef.current = activatePlayer
    activatePersonRef.current = activatePerson
  }, [activatePlayer, activatePerson])
  
  /**
   * Ссылки на DOM элементы.
   */
  const notificationEl = useRef();

  /**
   * Вспомогательный `dispatch`.
   */
  const dispatch = useDispatch()

  /**
   * Вызывается при изменении состояний согласия игроков.
   */
  useEffect(() => {
    if ((playerSubmit === true && personSubmit === false)) {
      dispatch({type: "SHOW_COMPONENT", data: "waitingWindow"})
    }
  }, [playerSubmit, personSubmit])

  /**
   * Обработчик нажатия на кнопку "Принять".
   */
  const handlerToAccept = () => {
    if (activatePlayerRef.current && activatePersonRef.current) {
      dispatch({type: 'ACCEPT_TRADE_TO_PLAYER'})
      
      window.mp.send('cef::chat:send', `/TradePlayerSubmit ${personId}`);
    }
  }

  /**
   * Обработка нажатия кнопки "Отмена".
   */
  const handlerClose = () => {
    const playerTradeClose = `/TradePlayerCloseWindow ${personId}`

    window.mp.send('cef::chat:send', playerTradeClose)
    window.mp.send('cef::chat:send', '/browserFocused false')

    dispatch({ type: 'TRADE_NULLIFY' })
  }

  /**
   * Обработчик выбора количества.
   * 
   * @param {object} data 
   * @param {number} count 
   */
  const countSelectHandler = (data, count) => {
    const playerItemId = data.id
    const playerItemCount = count
    const message = `/TradePlayerAddItem ${personId} ${playerItemId} ${playerItemCount}`
    
    window.mp.send('cef::chat:send', message);
    dispatch({ type: 'ADD_TRADE_PLAYER_ITEM', data, count })
  }

  return (
    <KeyBoardLayout
      name={layoutName}
      hotKeys={{
        close: {
          ["Escape"]: handlerClose
        },
        other: {
          ["KeyE"]: handlerToAccept
        }
      }}
    >
      <div id="trade" ref={notificationEl}>
        <div className="trade__inner">
          <WaitingWindow personId={personId} personName={personName} />
          <CountSelect onAccept={countSelectHandler} />
          <DndProvider backend={HTML5Backend}>
            <TradeBody />
          </DndProvider>
          <TradeFooter handlers={{handlerToAccept, handlerClose}} />
        </div>
      </div>
    </KeyBoardLayout>
  )

}

export default Trade;