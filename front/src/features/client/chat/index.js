import React, { useRef, useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { getMessageText, isHTML } from './utils'

import KeyBoardLayout from "/components/KeyBoardLayout"

import './style.sass'

/**
 * Интерфейс внутриигрового чата.
 * Модифицированная версия стандартного чата.
 * 
 * @returns {JSX.Element}
 */
const Chat = () => {

  /**
   * Состояния/данные интерфейса.
   */
  const { list, input, inputShow } = useSelector(state => state.chatReducer)
  const inputShowRef = useRef(false)

  const [history, setHistory]           = useState([])
  const [historyIndex, setHistoryIndex] = useState(null)

  const historyRef      = useRef(null)
  const historyIndexRef = useRef(null)

  /**
   * Ссылки на DOM элементы.
   */
  const listRef = useRef()
  const inputRef = useRef()
  
  /**
   * Вспомогательный `dispatch`.
   */
  const dispatch = useDispatch()

  /**
   * Вызывается каждый раз, когда меняется отображение поля ввода.
   */
  useEffect(() => {
    inputShowRef.current = inputShow
    inputRef.current.focus()

    if (inputShow)
      window.mp.send("cef::chat:send", "/focusInputField true")
    else
      window.mp.send("cef::chat:send", "/focusInputField false")

    dispatch({type: 'CHAT_UPDATE_INPUT', data: ''})

    /**
     * Вызывается при нажатии на клавишу в `input`.
     *
     * @param {object} event
     */
    const onKeyDown = (event) => {
      if (inputShow) {
        switch (event.code) {
          case "Enter":
            sendMessage()
            break
          case "Escape":
            escapeHandler()
            break
          case "ArrowUp":
            updateHistoryStep("up")
            break
          case "ArrowDown":
            updateHistoryStep("down")
            break
        }
      }
    }

    inputRef.current?.addEventListener("keydown", onKeyDown)

    return () => {
      inputRef.current?.removeEventListener("keydown", onKeyDown)
    }
  }, [inputShow])
  
  /**
   * Вызывается каждый раз, когда меняется список сообщений.
   */
  useEffect(() => {
    scrollToLastMessage()
  }, [list])

  /**
   * Вызывается каждый раз, когда меняется история отправленных сообщений.
   */
  useEffect(() => {
    historyRef.current = history

    if (history.length > 50) {
      history.pop()

      setHistory(history)
    }
  }, [history])

  /**
   * Вызывается каждый раз, когда меняется индекс/шаг выделенного сообщения истории.
   */
  useEffect(() => {
    historyIndexRef.current = historyIndex

    dispatch({type: 'CHAT_UPDATE_INPUT', data: historyRef.current[historyIndex]})

    inputRef.current.blur()

    setTimeout(() => {
      inputRef.current.focus()
    }, 1)
  }, [historyIndex])

  /**
   * Обновляет шаг/индекс истории.
   *
   * @param {string} dir
   */
  const updateHistoryStep = (dir) => {
    inputRef.current?.blur()

    setTimeout(() => {
      inputRef.current?.focus()
    }, 1)

    if (dir === "up") {
      if (historyIndexRef.current === null) {
        setHistoryIndex(0)
      } else if (historyIndexRef.current !== historyRef.current.length - 1) {
        setHistoryIndex(historyIndexRef.current + 1)
      }
    } else {
      if (historyIndexRef.current !== null) {
        if (historyIndexRef.current > 0) {
          setHistoryIndex(historyIndexRef.current - 1)
        }
      }
    }
  }

  /**
   * Скроллит список сообщений в самый низ.
   */
  const scrollToLastMessage = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }

  /**
   * Получаем список всех сообщений.
   * 
   * @returns {array}
   */
  const getMessages = () => {
    return list.map((message, index) => (
      <div
        key={index}
        
        className="message"
        
        dangerouslySetInnerHTML={{ __html: getMessageText(message) }}
      />
    ))
  }

  /**
   * Отправление сообщения.
   *
   * После отправки обнуляется поле ввода и обновляется фокус.
   */
  const sendMessage = () => {
    setHistoryIndex(null)

    const message = inputRef.current.value.trim()

    // FIXME: Переделать на regexp
    const withColor = getMessageText(message).includes('</span>') 

    if (message.length && !isHTML(message) && !withColor) {
      setHistory([message, ...historyRef.current])

      window.mp.send("cef::chat:send", message)
    }
    
    dispatch({type: 'CHAT_UPDATE_INPUT', data: ''})

    inputRef.current.focus()
  }

  /**
   * Обработчик нажатия на `Escape`.
   */
  const escapeHandler = () => {
    inputRef.current?.blur()

    dispatch({type: 'CHAT_HIDE'})

    window.mp.send("cef::chat:send", "/browserFocused false")
  }
  
  /**
   * Обработчик нажатия на `Enter`.
   */
  const enterHandler = () => {
    if (inputShowRef.current) {
      inputRef.current.focus()
    }
  }

  return (
    <KeyBoardLayout
      name={'chat'}
      hotKeys={{
        other: {
          ["Escape"]: escapeHandler,
          ["Enter"]: enterHandler,
        },
      }}
    >
      <div id="chat">
        <div className="list" ref={listRef}>
          {getMessages()}
        </div>

        <input
          type="text"
          placeholder="Напишите сообщение..."
          
          value={input || ''}
          className={`${inputShow && 'show'}`}

          onChange={(event) => {
            dispatch({type: 'CHAT_UPDATE_INPUT', data: event.target.value})
          }}
          
          ref={inputRef}
        />
      </div>
    </KeyBoardLayout>
  )

}

export default Chat