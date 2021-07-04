import React from 'react'
import { useSelector } from 'react-redux'

import InfoItem from './InfoItem'

import './style.sass'

/**
 * Интерфейс `Infobar`.
 * 
 * Показывает сообщения/уведомления в углу экрана.
 * 
 * @returns {JSX.Element}
 */
const Infobar = () => {
  
  /**
   * Состояния/данные интерфейса.
   */
  const { settings, messages } = useSelector(state => state.infobarReducer)

  /**
   * Вывод предметов.
   */
  const itemsActive = (messages.filter(item => !item.alreadyShow))
  const itemsOutput = itemsActive.map((item, index) => {
    if (index > settings.activeLimit - 1) return
    return <InfoItem 
              data={item} 
              duration={Boolean(itemsActive.length > settings.activeLimit) ? settings.inHurryDuration : settings.showDuration} 
              key={item.unique} />
  })

  return (
    <div id="infobar">
      { itemsOutput }
    </div>
  )

}

export default Infobar