import call from '../_call'

/**
 * Тест интерфейса "chat".
 */
const animListTest = () => {

  /**
   * Иммитация отправки с сервера.
   */
  return call('ANIMLIST_SHOW')
  
}

export default animListTest;