import React from 'react'

/**
 * Кнопка интерфейса `interactionMenu`.
 * 
 * @param {object} props
 * @returns {JSX.Element}
 */
const Button = (props) => {

  /**
   * Состояния/данные интерфейса.
   */
  const { children, disabled, callback, actionType } = props

  /**
   * Обработчик клика.
   */
  const handlerClick = () => {
    if (!disabled) {
      callback(actionType)
    }
  }

  return (
    <div className={`button ${disabled ? 'button--disabled' : ''}`} onClick={handlerClick}>
      <div className="button__inner">{ children }</div>
    </div>
  )

}

export default Button