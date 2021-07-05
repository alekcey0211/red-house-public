import React from 'react'

/**
 * Тесты.
 */
import craft from './tests/craft'
import callboard from './tests/callboard'
import requestPanel from './tests/requestPanel'
import animList from './tests/animList'
import chat from './tests/chat'
import trade from './tests/trade'
import selectBox from './tests/selectBox'

/**
 * Хаб тестов - имитирует отправки с сервера.
 */
const TestHub = () => {

  /**
   * Тест, который будет запущен (def. пусто)
   */
  const runTest = ""

  /**
   * Список тестов
   */
  const tests = {
    craft,
    callboard,
    requestPanel,
    animList,
    chat,
    trade,
    selectBox,
  }

  /**
   * Запуск теста.
   */
  if(runTest !== "") tests[runTest]()
  //console.log('Test')

  return (
    <></>
  )
}

export default React.memo(TestHub)