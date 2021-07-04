import React from 'react'

import TradeArea from './tradeArea'
import TradeInventory from './tradeInventory'

import './style.sass'

const TradeBody = () => {

  return (
    <div className="trade__body">
      <TradeInventory />
      <TradeArea />
    </div>
  )

}

export default TradeBody