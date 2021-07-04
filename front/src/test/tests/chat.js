import call from '../_call'

/**
 * Тест интерфейса "Craft".
 */
const chatTest = () => {

  const data = {
    message: "#{ff0000}Targon: #{ffffff}Тестовое 1сообщение"
  }

  /**
   * Иммитация отправки с сервера.
   */
  const chat = {
    show: call('CHAT_SHOW'),
    hide: call('CHAT_HIDE'),
    clear: call('CHAT_CLEAR'),
    message: call('CHAT_ADD_MESSAGE', data)
  }

  return chat.show
  
}

export default chatTest;