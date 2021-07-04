import React from 'react'
import { FormType } from '../../../types/formtype'
import { InventoryListItem } from './InventoryListItem'

import './style.sass'

type inventoryListType = {
  inventoryList: Array<any>, // Список объектов инвентаря
  activate?: FormType,       // Активная категория
  onClickHandler: Function,  // Функция обработки нажатия на объект
  emptyList?: String         // Надпись при пустом листе
}

/**
 * Список предметов в инвентаре.
 * 
 * @param {object} props
 * @returns {JSX.Element}
 */
const InventoryList = (props) => {

  /**
   * Отфильтрованный список.
   */
  const InventoryListFiltered = props.inventoryList.filter((data) => {
    return (!props.activate || data.category == props.activate || props.activate === FormType.FkFormType_All)
  })

  /**
   * Вывод списка.
   */
  const InventoryList = InventoryListFiltered.map((data) => {
    return <InventoryListItem data={data} onClickHandler={props.onClickHandler} key={data.id} />
  })

  // FIXME: Вынести функцию
  return (
      InventoryList[0] ?
      InventoryList.sort((a, b) => {
        if (a.props.data.name > b.props.data.name) return 1
        if (a.props.data.name < b.props.data.name) return -1
      }) :
      <span className="empty">{props.emptyList}</span>
  )

}

export default InventoryList