import React, { memo } from 'react'

import './style.sass'

/**
 * Вкладка инвентаря.
 * 
 * @param {Object} props 
 * @returns 
 */
const InventoryTabInner = (props) => {

  /**
   * Данные и состояния интерфейса.
   */
  console.log(props.data.name)
  const { name, icon } = props.data
  const active = props.activate
  const setActivate = props.setActivate
  const isActivate = props.data.isActivate
  
  /**
   * Узнаем className вкладки.
   * 
   * @returns {String}
   */
  const className = () => {
    let className = 'tab'

    if (isActivate) className += ' available'
    if (active === name) className += ' active'

    return className
  }

  /**
   * Обработчик клика.
   */
  const handler = () => {
    if (isActivate) setActivate(name)
  }

  return (
    <div className={className()} onClick={handler}>
      { icon }
    </div>
  )

}

export const InventoryTab = memo(InventoryTabInner)
