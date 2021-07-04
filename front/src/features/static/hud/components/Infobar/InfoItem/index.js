import React, { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'

import getIcon from '/utils/Icon'

/**
 * Предмет интерфейса `InfoBar`.
 * 
 * @param {object} props 
 * @returns {JSX.Element}
 */
const InfoItem = (props) => {

  /**
   * Состояния/данные интерфейса.
   */
  const { data, duration } = props
  const { type, message, count, unique, category } = data

  /**
   * Ссылки на DOM элементы.
   */
  const itemRef = useRef()

  /**
   * Вспомогательный `dispatch`.
   */
  const dispatch = useDispatch()

  /**
   * Вызывается во время создания компонента.
   */
  useEffect(() => {
    setTimeout(() => {
      if (itemRef.current) {
        itemRef.current.classList.add('show')
      }
    }, 1)

    setTimeout(() => {
      if (itemRef.current) {
        itemRef.current.classList.remove('show')
        itemRef.current.classList.add('removing')
      }
    }, duration * 1000)

    setTimeout(() => {
      dispatch({type: 'INFOBAR_UPDATE_MESSAGE_SHOW', data: unique})
    }, (duration * 1000) + 500)
  })

  /**
   * Получаем иконку сообщения.
   */
  const getItemIcon = () => {
    return category ? getIcon(category) : null
  }

  /**
   * Вывод сообщения/уведомления.
   */
  const output = () => {
    switch (type) {
      case 'default':
        return message
      case 'additem':
        return `${message} (${count}) - добавлено`
      case 'deleteitem':
        return `${message} (${count}) - удалено`
    }
  }
  
  return (
    <div className="infobar__item" ref={itemRef} key={unique}>
      { getItemIcon() }
      <span>{ output() }</span>
    </div>
  )

}

export default InfoItem