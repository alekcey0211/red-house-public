import React, { memo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Inventory from '/components/inventory'
import { Border } from '/components/styled'
import { FormType } from '/types/formtype'

/**
 * Инвентарь интерфейса "CookingCraft"
 * 
 * @returns {JSX.Element}
 */
const CookingInventoryInner = () => {

  /**
   * Состояния/данные интерфейса.
   */
  const { inventoryTabs, inventoryList, settings } = useSelector(state => state.craftReducer)
  
  /**
   * Вспомогательный `dispatch`.
   */
  const dispatch = useDispatch()

  /**
   * Обработчик нажатия на предмет.
   * 
   * @param {object} props 
   */
  const handler = (props) => {
    dispatch({ type: 'ADD_ITEM_IN_CRAFT', data: props })
  }

  return (
    <Border
      wrapperStyle={{
        position: 'static',
        width: '480px',
        marginRight: '30px'
      }}
      style={{
        height: '100%',
        padding: '30px'
      }}
    >
      <div className="cooking__inventory">
        <Inventory
          inventoryList={inventoryList}
          inventoryTabs={inventoryTabs}
          activeCategory={settings.activeCategory}
          onClickHandler={handler} />
      </div>
    </Border>
  )
  
}

export const CookingInventory = memo(CookingInventoryInner)