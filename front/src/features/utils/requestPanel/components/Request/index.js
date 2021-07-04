import React, { useRef } from 'react'
import { useSelector } from 'react-redux'

import Button from '/components/styled/button'
import Border from '/components/styled/border'

import './style.sass'

/**
 * Компонент `request` интерфейса `requestPanel`.
 * 
 * @returns {JSX.Element}
 */
const Request = () => {

  /**
   * Состояния/данные интерфейса.
   */
  const { show, title } = useSelector(state => state.requestPanelReducer)

  /**
   * Ссылки на DOM элементы.
   */
  const requestRef = useRef(null)

  return (
    show &&
    <div className="request" ref={requestRef}>
      <Border style={{padding: '15px'}}>
        <div className="request__inner">
          <span className="request__title">{ title }</span>
            <div className="request__actions">
            <Button 
              type="action" 
              triggerKey="Y" 
              description="Согласиться"
              style={{
                pointerEvents: 'none',
                marginRight: '25px',
                fontFamily: 'Din-pro',
                fontSize: '16px'
              }}
              innerStyle={{
                fontFamily: 'Din-pro',
                fontSize: '16px',
                fontWeight: 700
              }}
            />
            <Button 
              type="action" 
              triggerKey="N" 
              description="Отказаться"
              style={{
                pointerEvents: 'none',
                fontFamily: 'Din-pro',
                fontSize: '16px'
              }} 
              innerStyle={{
                fontFamily: 'Din-pro',
                fontSize: '16px',
                fontWeight: 700
              }}
            />
          </div>    
        </div>
      </Border>
    </div>
  )

}

export default Request