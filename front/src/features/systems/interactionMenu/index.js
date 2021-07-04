import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Button from './components/Button'

import KeyBoardLayout from '/components/keyBoardLayout'

import buttons from './data'

import './style.sass'

/**
 * Интерфейс взаимодействия с игроком.
 * 
 * @returns {JSX.Element}
 */
const InteractionMenu = () => {

  /**
   * Состояния/данные интерфейса.
   */
  const { personID } = useSelector(state => state.interactionMenuReducer)
  const layoutName = 'interactionMenu'

  /**
   * Вспомогательный `dispatch`.
   */
  const dispatch = useDispatch()

  /**
   * Обработчик закрытия интерфейса.
   */
  const handlerClose = () => {
    window.mp.send('cef::chat:send', `/InteractionMenuClose`)
    window.mp.send('cef::chat:send', `/browserFocused false`)

    dispatch({type: 'INTERACTIONMENU_NULLIFY'})

    return layoutName
  }

  /**
   * Обработчик нажатия на кнопку.
   * 
   * @param {string} actionType
   */
  const onSend = (actionType) => {
    window.mp.send('cef::chat:send', `/InteractionMenuAction ${personID} ${actionType}`)
    window.mp.send('cef::chat:send', `/browserFocused false`)

    dispatch({type: 'INTERACTIONMENU_NULLIFY'})
    dispatch({type: 'HIDE_COMPONENT', data: layoutName})
  }

  /**
   * Отображает список кнопок из списка.
   * 
   * @param {array} list 
   */
  const ButtonComponentsList = (list) => {
    return list.map(({actionType, text, disabled}, index) => {
      return <Button 
                disabled={disabled} 
                callback={onSend}
                actionType={actionType}
                key={index}
              >{ text }</Button>
    })
  }

  return (
    <KeyBoardLayout
      name={layoutName}
      hotKeys={{
        close: {
          ["Escape"]: handlerClose
        }
      }}
    >
      <div id="interactionMenu">
        <div className="group">
          { ButtonComponentsList(buttons.left) }
        </div>
        <div className="group">
          { ButtonComponentsList(buttons.right) }
        </div>
      </div>
    </KeyBoardLayout>
  )

}

export default InteractionMenu