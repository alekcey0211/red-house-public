import React, { useState } from 'react'

import './style.sass'

import icons from '/utils/icons'

/**
 * Компонент выбора (горизонтальный).
 *  
 * @param {object} props
 * @returns {JSX.Element}
 */
const HorizontalSelect = (props) => {

  /**
   * Состояния/данные интерфейса.
   */
  const { items, changeCallback } = props
  let [itemIndex, setItemIndex] = useState((() => {
    return typeof props.default !== 'undefined' ? props.items.findIndex(i => i == props.default) : 0
  })())

  /**
   * Обработчик выбора предыдущего.
   */
  const prevHandler = () => {
    if (itemIndex === 0) {
      itemIndex = items.length - 1
      setItemIndex(itemIndex)
    } else {
      setItemIndex(--itemIndex)
    }
    changeCallback(items[itemIndex])
  }

  /**
   * Обработчик выбора следующего.
   */
  const nextHandler = () => {
    if (itemIndex === items.length - 1) {
      itemIndex = 0
      setItemIndex(itemIndex)
    } else {
      setItemIndex(++itemIndex)
    }
    changeCallback(items[itemIndex])
  }

  return (
    <div className="horizontal-select">
      <span className="select__arrow arrow--left" onClick={prevHandler}>{ icons.global.arrow }</span>
      <span className="select__value">{ items[itemIndex] }</span>
      <span className="select__arrow arrow--right" onClick={nextHandler}>{ icons.global.arrow }</span>
    </div>
  )

}

export default HorizontalSelect