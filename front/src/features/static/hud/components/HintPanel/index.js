import React from 'react'
import { useSelector } from 'react-redux'

import './style.sass'

/**
 * Интерфейс панели подсказок.
 * 
 * @returns {JSX.Element}
 */
const HintPanel = () => {

  /**
   * Состояния/данные интерфейса.
   */
  const { show, items } = useSelector(state => state.hintPanelReducer)

  /**
   * Список предметов.
   */
  const itemsList = items.map(({key, action}, index) => {
    return (
      <div className="row" key={index}>
        <div className="key">{ key }</div>
        <div className="action">{ action }</div>
      </div>      
    )
  }) 

  return (
    show &&
    <div id="hintPanel">
      { itemsList }
    </div>
  )
  
}

export default HintPanel