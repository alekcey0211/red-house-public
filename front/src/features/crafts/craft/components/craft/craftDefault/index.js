import React from 'react'
import { useSelector } from 'react-redux'

import CraftFooter from './craftFooter'

import CraftItemsPanel from './craftItems'

/**
 * Крафт интерфейса `CookingCraft`.
 * 
 * @param {object} props
 * @returns {JSX.Element}
 */
const CraftDefault = (props) => {

  /**
   * Состояния/данные интерфейса.
   */
  const { craftItems } = useSelector(state => state.craftReducer)
  const { craftName, craftDescription } = useSelector(state => state.craftReducer.settings)
  const count = craftItems.filter(e => e.active).length

  /**
   * Получаем заголовок в зависимости от выбранного инструмента.
   * 
   * @returns {string}
   */
  const getTitle = () => {
    return 'Готовка' 
  }

  /**
   * Получаем текст в зависимости от выбранного инструмента.
   * 
   * @returns {string}
   */
  const getSubtitle = () => {
    let message = 'Выберите из вашего инвентаря нужные ингредиенты'

    return message 
  }

  return (
    <div className='cooking__craft'>
      <div className="craft__inner">
        <div className="craft__body">
          <h1 className='craft__title'>{craftName}</h1>
          <p className='craft__subtitle'>{craftDescription}</p>
          <div className='craft__info'>
            <span>Ингредиенты:</span>
            <span className="count">{count}/8</span>
          </div>
          <CraftItemsPanel />
        </div>
        <CraftFooter handlers={props.handlers} />
      </div>
    </div>
  )
  
}

export default CraftDefault