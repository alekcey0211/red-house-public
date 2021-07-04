import React, { useState, useEffect } from 'react'

import { generateRandomString } from './utils'

import icons from '/utils/icons'

import './style.sass'

/**
 * Компонент выбора.
 *  
 * @param {object} props - Свойства компонента.
 * @param {object} prop.style - Объект со стилями.
 * @param {array} props.items - Массив с предметами.
 * @param {functtion} props.callback - Колбэк функция.
 * @returns {JSX.Element}
 */
const Select = (props) => {

  /**
   * Данные и состояния интерфейса.
   */
  const { style, items, callback } = props
  const componentId = generateRandomString()
  const [show, setShow] = useState(false)
  const [selected, setSelected] = useState(items[0])

  /**
   * Вызывается при создании компонента.
   */
  useEffect(() => {
    document.addEventListener('mousedown', onClick)

    return () => {
      document.removeEventListener('mousedown', onClick)
    }
  }, [])

  /**
   * Обработчик клика.
   * 
   * @param {Object} event
   */
  const onClick = (event) => {
    const inArea = event.target.closest(`#${componentId}`)
    const isItem = event.target.className.includes('dropdown__item')

    if (!inArea && !isItem) {
      close()
    }
  }

  /**
   * При выборе элемента.
   * 
   * @param {Object} item 
   */
  const onSelect = item => {
    setSelected(item)
    callback(item)

    close()
  }

  /**
   * Открытие списка.
   */
  const open = () => {
    setShow(true)
  }

  /**
   * Закрытие списка.
   */
  const close = () => {
    setShow(false)
  }

  /**
   * Переключение отображения списка.
   */
  const toggle = () => {
    setShow(!show)
  }

  /**
   * Предметы списка.
   * 
   * @returns {Array}
   */
  const Items = () => {
    return items.map(item => {
      return (
        <div 
          key={item.value}
          className="dropdown__item" 
          onClick={() => onSelect(item)}
        >{ item.text }</div>
      )
    })
  }

  return (
    <div className={`select ${show ? 'select--active' : ''}`} style={{...style}}>
      <div className="select__field" onClick={open}>
        { selected.text }
        <div className="icon">
          { icons.global.arrowMini }
        </div>
      </div>
      {
        show &&
        <div id={componentId} className="select__dropdown">
         { Items() }
        </div>
      }
    </div>
  )

}

export default Select