import React, { memo } from 'react'
import { useDispatch } from 'react-redux'

import icons from '/utils/icons'

/**
 * Предмет крафта.
 */
const CraftItemInner = (props) => {

  /**
   * Состояния/данные интерфейса.
   */
  const dispatch = useDispatch()
  const { icon, name, count } = props.data.data

  /**
   * Обработчик нажатия на предмет.
   */
  const handler = () => {
    dispatch({ type: 'DELETE_ITEM_FROM_CRAFT', index: props.index, data: props.data.data })
  }

  /**
   * Обработчик нажатия на увеличение количества предмета.
   */
  const handlerAdd = () => {
    dispatch({ type: 'ADD_ITEM_IN_CRAFT', data: props.data.data, craft: true, index: props.index })
  }

  /**
   * Обработчик нажатия на уменьшение количества предмета.
   */
  const handlerDelete = () => {
    dispatch({ type: 'DELETE_ONE_ITEM_FROM_CRAFT', data: props.data.data, index: props.index })
  }

  return (
    <div className='craft__item active'>
      <div className="item__body" onClick={handler}>
        <div className="item__icon">{icon}</div>
        <span className="item__name">{name}</span>
      </div>
      <div className="item__count">
        <span className="count">{count}</span>
        <div className="change">
          <button onClick={handlerAdd}>{ icons.global.arrowMini }</button>
          <button onClick={handlerDelete}>{ icons.global.arrowMini }</button>
        </div>
      </div>
    </div>
  )
}

export const CraftItem = memo(CraftItemInner)