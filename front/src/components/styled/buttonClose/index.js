import React from 'react'

import './style.sass'

/**
 * Кнопка закрытия интерфейса.
 * 
 * @param {Object} props 
 * @returns {JSX.Element}
 */
const ButtonClose = (props) => {
  
  return (
    <button className='buttonClose' style={{...props.style}} onClick={props.onClick}>×</button>
  )
  
}

export default ButtonClose