import React, { memo } from 'react'

import './style.sass';

/**
 * Предмет инвентаря.
 * 
 * @param {object} props
 * @returns {JSX.Element}
 */
const InventoryListItemInner = (props) => {

  /**
   * Состояния/данные интерфейса.
   */
  const { icon, name, count } = props.data
 
  /**
   * Обработчик нажатия на предмет.
   */
  const handler = () => {
    props.onClickHandler(props.data)
  }

  return (
    <div className="inventory__item" onClick={handler} >
      <div className="item__icon">{icon}</div>
      <span className="item__name">{name} { count < 2 ? '' : ('(' + count + ')')}</span>
    </div>
  )

}

export const InventoryListItem = memo(InventoryListItemInner)