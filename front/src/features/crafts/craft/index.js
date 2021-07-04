import React, { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import KeyBoardLayout from '/components/KeyBoardLayout'

import Craft from './components/craft/craftDefault'
import { CookingInventory } from './components/inventory'

import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'

import './style.sass'

/**
 * Интерфейс крафта.
 * 
 * @returns {JSX.Element}
 */
const CraftBase = () => {

  /**
   * Состояния/данные интерфейса.
   */
	const craftItems = useSelector(state => state.craftReducer.craftItems)
  const craftItemsCount = craftItems.filter((item) => item.active).length
  const craftItemsRef = useRef([])
  const craftItemsCountRef = useRef(0)
  const layoutName = 'craft'

  /**
   * При изменении состояний `craftItems` и `craftItemsCount`.
   */
  useEffect(() => {
    craftItemsRef.current = craftItems
    craftItemsCountRef.current = craftItemsCount
  }, [craftItems, craftItemsCount])

  /**
   * Вспомогательный `dispatch`.
   */
  const dispatch = useDispatch()
  
  /**
	 * Обработчик кнопки "Принять"
	 */
	const handlerToAccept = () => {
    if (craftItemsCountRef.current > 0) {
			const newCraftItemsId = craftItemsRef.current
				.filter((item) => item.active)
				.map((item) => item.data.id)
				.join(',')

			const newCraftItemsCount = craftItemsRef.current
				.filter((item) => item.active)
				.map((item) => item.data.count)
				.join(',')

      window.mp.send('cef::chat:send', '/browserFocused false')
			window.mp.send('cef::chat:send', `/Craft ${newCraftItemsId} ${newCraftItemsCount}`)

			dispatch({ type: 'NULLIFY_COOKINGCRAFT' })
			dispatch({ type: 'HIDE_COMPONENT', data: layoutName })
		}
	}

  /**
   * Обработчик закрытия интефрейса.
   */
  const handlerClose = () => {
    window.mp.send('cef::chat:send', `/browserFocused false`)

		dispatch({ type: 'NULLIFY_COOKINGCRAFT' })
    dispatch({ type: 'HIDE_COMPONENT', data: layoutName })
  }


  return (
    <KeyBoardLayout
      name={layoutName}
      hotKeys={{
        close: {
          ["Escape"]: handlerClose
        },
        other: {
          ["KeyE"]: handlerToAccept
        }
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <div id="cooking">
          <CookingInventory />
          <Craft handlers={{handlerToAccept, handlerClose }} />
        </div>
      </DndProvider>
    </KeyBoardLayout>
  )

}

export default CraftBase;