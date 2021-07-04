import { InventoryTab } from './inventoryTab'
import InventoryList from './inventoryList'
import { FormType } from '../../types/formtype'
import React, { useState } from 'react'

import './style.sass'

type InventoryProps = {
  inventoryTabs: [],         // Список категорий
  inventoryList: Array<any>, // Список объектов
  activeCategory: FormType,  // Активная категория
  onClickHandler: Function,  // Функция обработки нажатия на объект
}

/**
 * Модульный интерфейс инвентаря.
 */
const Inventory = (props: InventoryProps) => {

  /**
   * Данные и состояния интерфейса.
   */
  const [activate, setActivate] = useState(props.activeCategory)

  /**
   * Вкладки категорий.
   */
  const InventoryTabs = props.inventoryTabs.map((data, index) => {
    return <InventoryTab data={data} activate={activate} setActivate={setActivate} key={index} />
  })
  
  return (
    <div id="inventory" className="inventory">
      <span className="inventory__title">Ваш инвентарь:</span>
      <div className="inventory__tabs">
        {InventoryTabs}
      </div>
      <div className="inventory__divider"></div>
      <div className="inventory__list">
        <InventoryList inventoryList={props.inventoryList} activate={activate} onClickHandler={props.onClickHandler} />
      </div>
    </div>
  )

}

export default Inventory