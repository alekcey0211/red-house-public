import React from 'react'
import { useSelector } from 'react-redux'

import './style.sass'

import { CraftItem } from './craftItem'
import { CraftItemNull } from './craftItemNull'

/**
 * Панель вывода предметов в крафте.
 * 
 * @returns {JSX.Element}
 */
const CraftItemsPanel = () => {

  /**
   * Состояния/данные интерфейса.
   */
  const craftItems = useSelector(state => state.craftReducer.craftItems)

  /**
   * Предметы крафта.
   */
  const CraftItems = craftItems.map((data, index) => {
    if (data.active) {
      return <CraftItem data={data} index={index} key={index} />
    } else {
      return <CraftItemNull index={index} key={index} />
    }
  })

  return (
    <div className='craft__items'>
      {CraftItems}
    </div>
  )
  
}

export default CraftItemsPanel