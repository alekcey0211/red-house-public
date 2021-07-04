import call from '../_call'

/**
 * Тест интерфейса "Craft".
 */
const selectBoxTest = () => {

  const data = {
    canClose: true, 
    title: "TEST TITLE", 
    subtitle: "TEST SUBTITLE", 
    buttons: [
      {
        text: "Button 1",
        value: "Value 1"
      },
      {
        text: "Button 2",
        value: "Value 2"
      }
    ]
  }

  /**
   * Иммитация отправки с сервера.
   */
  return call('SELECTBOX_INIT', data)
  
}

export default selectBoxTest;