import React, { useState, useEffect, useRef } from 'react'

import './style.sass'

/**
 * Компонент выбора ползунком.
 *  
 * @param {object} props
 * @param {number} props.min - Минимально допустимое значение.
 * @param {number} props.max - Максимально допустимое значени.
 * @param {number} props.value - Изначальное значение.
 * @param {function} props.onChange - Колбэк функция при изменении ползунка.
 * @returns {JSX.Element}
 */
const RangeSelect = (props) => {

  /**
   * Состояния/данные интерфейса.
   */
  const { min, max, onChange } = props
  const [value, setValue] = useState(props.value || min)
  const valueRef = useRef(value)

  /**
   * Ссылки на DOM элементы.
   */
  const inputRef = useRef(null)

  /**
   * Вызывается каждый раз при изменении состояния ползунка.
   */
  useEffect(() => {
    valueRef.current = value
  }, [value])

  /**
   * Обработчик изменения ползунка.
   */
  const changeHandler = () => {
    setValue(inputRef.current.value)

    setTimeout(() => {
      onChange(valueRef.current)
    }, 1)
  }

  return (
    <div className="rangeSelect">
      <input 
        type="range" 
        value={value} 
        min={min} 
        max={max} 
        ref={inputRef} 
        onChange={changeHandler} 
      />
      <span>{ value }</span>
    </div>
  )

}

export default RangeSelect