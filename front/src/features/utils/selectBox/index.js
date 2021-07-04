import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import KeyBoardLayout from '/components/KeyBoardLayout'
import Border from '/components/styled/border'
import Button from '/components/styled/button'

import './style.sass'

/**
 * Интерфейс окна выбора варианта.
 * 
 * @returns {JSX.Element}
 */
const SelectBox = () => {

  /**
   * Состояния/данные интерфейса.
   */
  const { canClose, title, subtitle, buttons } = useSelector(state => state.selectBoxReducer)
  const layoutName = 'selectBox'

  /**
   * Вспомогательный `dispatch`.
   */
  const dispatch = useDispatch()

  /**
   * Обработчик выбора.
   * 
   * @param {string} value
   */
  const selectHandler = value => {
    window.mp.send('cef::chat:send', `/SelectBox ${value}`)

    closeHandler(false)
  }

  /**
   * Обработчик закрытия интерфейса.
   */
  const closeHandler = (removeCursor = true) => {
    if (removeCursor) {
      window.mp.send('cef::chat:send', '/browserFocused false')
    }
    
    dispatch({type: 'SELECTBOX_NULLIFY', data: false})
    dispatch({type: 'HIDE_COMPONENT', data: layoutName})

    return layoutName
  }

  /**
   * Список компонентов кнопок.
   */
  const ButtonComponents = buttons?.map(({ text, value }, index) => {
    return <Button 
              value={value} 
              key={index} 
              onClick={() => selectHandler(value)}
            >
              { text }
            </Button>
  })

  return (
    <KeyBoardLayout
      name={layoutName}
      hotKeys={{
        close: {
          ["Escape"]: closeHandler
        }
      }}
    >
      <Border>
        <div id="selectBox">
          {
            title &&
            <span className="title">{ title }</span>
          }
          {
            subtitle &&
            <span className="subtitle">{ subtitle }</span>
          }
          { 
            ButtonComponents && 
            <div className="buttons">
              { ButtonComponents }
            </div>
          }
          {
            canClose &&
            <div className="close" onClick={closeHandler}>&times;</div>
          }
        </div>
      </Border>
    </KeyBoardLayout>
  )

}

export default SelectBox