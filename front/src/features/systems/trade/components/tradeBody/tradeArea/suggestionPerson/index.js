import React, { memo } from 'react'
import { useSelector } from 'react-redux'

import icons from '/utils/icons'

/**
 * Предложение второго игрока с кем происходит обмен.
 * 
 * @param {Object} props 
 * @returns {JSX.Element}
 */
const SuggestionPersonInner = (props) => {

  /**
   * Данные и состояния интерфейса.
   */
  const { personName, coast, suggestionList } = props.data
  const activatePerson = useSelector(state => state.tradeReducer.activatePerson)

  /**
   * Список предметов предложенных вторым игроком с кем происходит обмен.
   */
  const suggestionListShow = suggestionList.map((data, index) => {
    const { name, icon, count } = data

    return (
      <div className="inventory__item" key={index}>
        <div className="item__icon">{ icon }</div>
        <span className="item__name">{ name + ' ' + (count < 2 ? '' : `(${count})`) }</span>
      </div>
    )
  })

  return (
    <div className="suggestion">
      <div className="suggestion__header">
        { activatePerson ? icons.interface.close : icons.interface.open }
        <span className="suggestion__person">{personName}&nbsp;</span>
        предлагает:
      </div>
      <div className="trade__divider"></div>
      <div className="suggestion__list">
        { 
          suggestionListShow.length ? 
          suggestionListShow : 
          <span className="empty">Список пуст</span> 
        }
      </div>
    </div>
  )
}

export const SuggestionPerson = memo(SuggestionPersonInner)