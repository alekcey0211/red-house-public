import call from '../_call'

/**
 * Тест интерфейса "Craft".
 */
const tradeTest = () => {

  /**
   * Данные
   */
  const meta = {
    playerName: "Djoker255", 
    playerID: 123, 
    playerMoney: 420, 
    personName: "Targon", 
    personID: 321, 
    personMoney: 730 
  }

  /**
   * Инвентарь
   */
  const inventory = [{
    id: 412481, 
    name: "Картофель", 
    category: 46, 
    count: 10, 
    isFood: true
  }]

  /**
   * Иммитация отправки с сервера.
   */
  return call('TRADE_ADD_ALL_ITEMS', {meta, inventory})
  
}

export default tradeTest;