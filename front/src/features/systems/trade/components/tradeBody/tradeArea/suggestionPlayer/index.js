import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import InventoryList from '/components/inventory/inventoryList'

import icons from '/utils/icons'

/**
 * Предложение первого (текущего) игрока.
 * 
 * @param {Object} props 
 * @returns {JSX.Element}
 */
const SuggestionPlayerInner = (props) => {

  /**
   * Вспомогательный `dispatch`.
   */
  const dispatch = useDispatch()
  
  /**
   * Данные и состояния интерфейса.
   */
  const { playerName, coast, suggestionList } = props.data
  const playerActivate = useSelector(state => state.tradeReducer.activatePlayer)
  const personId = useSelector(state => state.tradeReducer.suggestionPerson.personId)

  /**
   * Обработчик нажатия на замок.
   */
  const lockClickHandler = () => {
    const message = `/TradePlayerLockActivate ${personId}`

    window.mp.send('cef::chat:send', message)
    dispatch({ type: 'TRADE_ACTIVATE_PLAYER' })
  }

  /**
   * Обработчик клика на предмет.
   * 
   * @param {Object} props 
   */
  const handlerItem = (props) => {
    if (!playerActivate) {
      const { playerItemId, playerItemCount } = props
      const message = `/TradePlayerDeleteItem ${personId} ${playerItemId} ${playerItemCount}`
      
      window.mp.send('cef::chat:send', message)
      dispatch({type: 'DELETE_TRADE_PLAYER_ITEM', data: props})
    }
  }

  return (
    <div className="suggestion">
      <div className="suggestion__header">
        <div onClick={lockClickHandler}>
            {playerActivate ? icons.interface.close : icons.interface.open}
        </div>
        <span className="suggestion__person">{playerName}&nbsp;</span>
        предлагает:
      </div>
      <div className="trade__divider"></div>
      <div className="suggestion__list" >
        <InventoryList inventoryList={suggestionList} onClickHandler={handlerItem} emptyList={'Список пуст'}/>
      </div>
    </div>
  )
}

export const SuggestionPlayer = memo(SuggestionPlayerInner)