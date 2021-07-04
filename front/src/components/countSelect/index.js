import React, { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import KeyBoardLayout from '/components/keyBoardLayout'
import Button from '/components/styled/button'

import './style.sass'

/**
 * Вспомогательный интерфейс выбора количества.
 * 
 * @param {object} props
 * @returns {JSX.Element}
 */
const CountSelect = props => {

  /**
   * Состояния/данные интерфейса.
   */
  const { max, data, count } = useSelector(state => state.countSelectReducer)
  const countRef = useRef(1)
  const layoutName = 'countSelect'

  /**
   * При изменении состояния `count`.
   */
  useEffect(() => {
    countRef.current = count
  }, [count])

  /**
   * Вспомогательный dispatch.
   */
  const dispatch = useDispatch()

  /**
   * Ссылки на DOM элементы. 
   */
  const inputRef = useRef()

  /**
   * Обработчик изменения input-а.
   */
  const changeHandler = () => {
    dispatch({type: 'COUNTSELECT_UPDATE_COUNT', data: Number(inputRef.current.value)})
  }

  /**
   * Обработчик принятия.
   */
  const acceptHandler = () => {
    props.onAccept(data, countRef.current)

    window.storage.dispatch({type: 'COUNTSELECT_UPDATE_COUNT', data: 1})
    window.storage.dispatch({type: "HIDE_COMPONENT", data: layoutName})
  }

  /**
   * Обработчик закрытия.
   */
  const closeHandler = () => {
    dispatch({type: 'COUNTSELECT_UPDATE_COUNT', data: 1})
    dispatch({type: "HIDE_COMPONENT", data: layoutName})
  }

  return (
    <KeyBoardLayout
      name={layoutName}
      hotKeys={{
        other: {
          ["KeyE"]: acceptHandler
        },
        close: {
          ["Escape"]: closeHandler
        }
      }}
    >
      <div id="countSelect">
        <div className="window">
          <div className="window__inner">
            <span className="title">Сколько?</span>
            <div className="select">
              <input 
                type="range" 
                value={count} 
                min="1" 
                max={max} 
                ref={inputRef} 
                onChange={changeHandler} 
              />
              <span className="select__count">{count}</span>
            </div>
            <div className="actions">
              <Button 
                type="action"
                triggerKey="E"
                onClick={acceptHandler}
                description="Принять"
                style={{
                  marginRight: "20px"
                }}
              />
              <Button 
                type="action"
                triggerKey="Esc"
                onClick={closeHandler}
                description="Отменить"
              />
            </div>
          </div>
        </div>
      </div>
    </KeyBoardLayout>
  )

}

export default CountSelect