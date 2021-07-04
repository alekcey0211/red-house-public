import React from 'react'
import CraftDefault from './craftDefault'

/**
 * Область крафта.
 * 
 * @param {Object} props 
 * @returns {JSX.Element}
 */
const Craft = (props) => {

  /**
   * Обработчики.
   */
  const { handlerToAccept, handlerClose } = props.handlers
  
  return (
    <CraftDefault handlers={{handlerToAccept, handlerClose }} />
  )

}

export default Craft