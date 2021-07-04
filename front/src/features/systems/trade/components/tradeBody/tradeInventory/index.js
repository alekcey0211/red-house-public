import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { FormType } from '/types/formtype'
import Inventory from '/components/inventory'


const TradeInventory = () => {
  const dispatch = useDispatch()
  const { inventoryTabs, inventoryList, playerActivate } = useSelector(state => state.tradeReducer)
  const personId = useSelector(state => state.tradeReducer.suggestionPerson.personId)

  const [e, setE] = useState(false)

  useEffect(() => {
    setE(!!inventoryList)
  })

  const handler = (props) => {
    if (!playerActivate) {
      if (props.count > 4) {
        dispatch({ type: 'COUNTSELECT_UPDATE', data: props })
        dispatch({ type: "SHOW_COMPONENT", data: "countSelect" })
      } else {
        const playerItemId = props.id
        const message = `/TradePlayerAddItem ${personId} ${playerItemId} 1`
        
        window.mp.send('cef::chat:send', message);
        dispatch({ type: 'ADD_TRADE_PLAYER_ITEM', data: props, count: 1})
      }
    }
  }

  return (
    <Inventory inventoryList={inventoryList} inventoryTabs={inventoryTabs} activeCategory={FormType.FkFormType_All} onClickHandler={handler} />
  )
}
export default TradeInventory;