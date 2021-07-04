import { useDispatch } from "react-redux"
import call from '../_call'

/**
 * Тест интерфейса "Craft".
 */
const craftTest = () => {

  console.log('craftTest')

  const dispatch = useDispatch()

  /**
   * Настройки 
   */
  const settings = {
    craftName: "Готовка",
    craftDescription: "Здесь вы можете приготовить еду",
    activeCategory: 139, //default FormType.FkFormType_All
    activeCategores: [139, 30] // список активных категорий
  }

  /**
   * Инвентарь
   */
  const inventory = [{
    id: 1234,
    name: 'Картошка',
    category: 139,
    count: 3,
    isFood: true
  },
  {
    id: 13234,
    name: '27',
    category: 27,
    count: 3,
    isFood: true
  },
  {
    id: 12344,
    name: '139',
    category: 27,
    count: 3,
    isFood: true
  }
]

  /**
   * Иммитация отправки с сервера 
   */
  const test = call('CRAFT_ADD_ALL_ITEMS', {settings, inventory})
  
  return test
}

export default craftTest