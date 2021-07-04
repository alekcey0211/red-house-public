import React from 'react'

import Request from './components/Request'

import './style.sass'

/**
 * Интерфейс панель запросов.
 * 
 * @returns {JSX.Element}
 */
const RequestPanel = () => {

  return (
    <div id="requestPanel">
      <Request />
    </div>
  )

}

export default RequestPanel