import { useDispatch } from "react-redux"

/**
 * Вызов `dispatch`.
 * 
 * Имитация вызова с сервера.
 * 
 * @param {String} type - Тип `dispatch` (UI Event)
 * @param {Object} data - Данные, которые будут переданы с сервера
 * @param {Number} time - Таймаут запуска `dispatch`
 */
const call = (type, data, time = 1) => {

  /**
   * Вспомогательный dispatch.
   */
  const dispatch = useDispatch()
  
  /**
   * Вызов.
   */
  setTimeout(() => {
    dispatch({ 
      type, 
      data: {
        ...data
      }
    })
  }, time * 1000)

}

export default call