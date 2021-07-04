import call from '../_call'

/**
 * Тест интерфейса "Craft".
 */
const requestPanelTest = () => {

  /**
   * Иммитация отправки с сервера.
   */
  return call('REQUESTPANEL_SHOW', { 
    title: 'Ульфрик Буревестник предлагает вам обмен'
  })
  
}

export default requestPanelTest