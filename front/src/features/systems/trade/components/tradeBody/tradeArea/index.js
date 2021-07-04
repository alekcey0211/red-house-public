import React from 'react'
import { useSelector } from 'react-redux'

import { SuggestionPlayer } from './suggestionPlayer'
import { SuggestionPerson } from './suggestionPerson'

/**
 * Область обмена между игроками в интерфейсе `Trade`.
 * 
 * @param {Object} props 
 * @returns {JSX.Element}
 */
const TradeArea = (props) => {

  /**
   * Данные и состояния интерфейса.
   */
  const { playerActivate, setPlayerActivate } = props
  const { suggestionPlayer, suggestionPerson } = useSelector(state => state.tradeReducer)

  return (
    <div className="trade__area">
      <SuggestionPlayer data={suggestionPlayer} playerActivate={playerActivate} setPlayerActivate={setPlayerActivate} />
      <SuggestionPerson data={suggestionPerson} />
    </div>
  )

}
export default TradeArea