import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Select from '/components/select'
import Button from '/components/styled/button'

import './style.sass'

/**
 * Подвал интерфейса `Trade`.
 * 
 * @param {object} props
 * @returns {JSX.Element}
 */
const TradeFooterInner = (props) => {

  /**
   * Состояния/данные интерфейса.
   */
  const { activatePlayer, activatePerson, playerSubmit, personSubmit } = useSelector(state => state.tradeReducer)
  const suggestionPlayerList = useSelector(state => state.tradeReducer.suggestionPlayer.suggestionList)
  const suggestionPersonList = useSelector(state => state.tradeReducer.suggestionPerson.suggestionList)
  const { handlers } = props

  /**
   * Вспомогательный `dispatch`
   */
  const dispatch = useDispatch()

  /**
   * Завершение трейда
   */
  if (playerSubmit && personSubmit) {
    const newSuggestionPlayerItemsId = suggestionPlayerList
      .map((item) => item.id)
      .join(',')

    const newSuggestionPlayerItemsCount = suggestionPlayerList
      .map((item) => item.count)
      .join(',')

    const newSuggestionPersonItemsId = suggestionPersonList
      .map((item) => item.id)
      .join(',')

    const newSuggestionPersonItemsCount = suggestionPersonList
      .map((item) => item.count)
      .join(',')

    const playerMessageAdd = `/TradePlayerDelete ${newSuggestionPlayerItemsId} ${newSuggestionPlayerItemsCount}`
    const playerMessageDelete = `/TradePlayerAdd ${newSuggestionPersonItemsId} ${newSuggestionPersonItemsCount}`

    window.mp.send('cef::chat:send', playerMessageAdd)
    window.mp.send('cef::chat:send', playerMessageDelete)
    window.mp.send('cef::chat:send', '/browserFocused false')

    dispatch({ type: 'TRADE_NULLIFY' })
  }

  return (
    <div className="trade__footer">
      <div className="trade__actions">
        <Button
          type="action"
          onClick={handlers.handlerToAccept}
          triggerKey="E"
          isActive={activatePlayer && activatePerson}
          description="Принять обмен"
          style={{
            marginRight: '30px'
          }}
        ></Button>
        <Button
          type="action"
          onClick={handlers.handlerClose}
          triggerKey="Esc"
          description="Отменить"
        ></Button>
      </div>
    </div>
  )
}

export const TradeFooter = memo(TradeFooterInner)