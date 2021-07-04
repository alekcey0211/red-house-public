import { defaultState } from './defaultState'
import icons from '/utils/icons'
import { FormType } from '/types/formtype'



export const craftReducer = (state = defaultState, action) => {
	switch (action.type) {

		/**
		 * Получение данных с сервера
		 */
		case 'CRAFT_ADD_ALL_ITEMS': {

			/**
			 * Данные.
			 */
			const { settings, inventory } = action.data
		
			/**
			 * Изменение активных категорий.
			 */
			const inventoryTabs = settings.activeCategores 
			? state.inventoryTabs.map(item => {
				if (0 <= settings.activeCategores.findIndex(data => data == item.name)) {
					return {
						...item,
						isActivate: true
					}
				} else {
					return {
						...item,
						isActivate: false
					}
				}
			})
			: state.inventoryTabs
		
			/**
			 * Формирование инвентаря.
			 * 
			 */
			const newInventory = inventory
				.filter((item) => settings.activeCategores.includes(item.category))
				.map((item) => {
					return {
						...item,
						icon:
							item.category === FormType.kFormType_Potion
								? icons.tabs.eat
								: icons.tabs.ingredients,
					}
				})

			/**
			 * Открытие интерфейса
			 */
			setTimeout(() => {
				window.storage.dispatch({type: 'SHOW_COMPONENT', data: 'craft'})
			}, 1)

			return {
				...state,
				settings: {
					craftName: settings.craftName,
					craftDescription: settings.craftDescription,
					activeCategory: settings.activeCategory
				},
				inventoryTabs: inventoryTabs,
				inventoryList: newInventory,
			}
		}

		/**
		 * Добавление ингридиента в крафт
		 */
		case 'ADD_ITEM_IN_CRAFT': {
			
			const { inventoryList, craftItems } = state
			const data = action.data
			
	
			let index
			let count
			if (action.craft) {//пришло из крафта
				index = action.index
				const itemIndex = inventoryList.findIndex((item) => item.id === data.id)
				if (itemIndex === -1) return state
				else count = inventoryList[itemIndex].count
				
				
			}
			else {//пришло из инвентаря
				count = data.count
				index = craftItems.findIndex((item) => {
					//console.log(item.data.id)
					if (item.active) return item.data.id === data.id
					else return false
					})
			}
			
			if (inventoryList.findIndex((item) => item.id === data.id) === -1) return state
			
			if (index === -1) { //не нашли
				if (count === 1) {// 1 элемент
					const newInventoryList = inventoryList.filter((item) => item.id !== data.id)
					const indexDelete = craftItems.findIndex((item) => !item.active)
					const item = {
						active: true,
						data: {
							...data,
							count: 1
						}
					}
					craftItems.splice(indexDelete, 1, item)
					return {
						...state,
						inventoryList: newInventoryList,
						craftItems: craftItems
					}
				}
				else {//больше 1 элемента
					const newInventoryList = inventoryList.map((item) => {
						if (item.id === data.id) return {
							...item,
							count: item.count - 1
						}
						else return item
					})
					const indexDelete = craftItems.findIndex((item) => !item.active)
					const item = {
						active: true,
						data: {
							...data,
							count: 1
						}
					}
					craftItems.splice(indexDelete, 1, item)
					return {
						...state,
						inventoryList: newInventoryList,
						craftItems: craftItems
					}
				}
			}
			else { //нашли
				if (count === 1) {//1 элемент
					const newInventoryList = inventoryList.filter((item) => item.id !== data.id)
					craftItems[index] = {
						...craftItems[index],
						data: {
							...craftItems[index].data,
							count: craftItems[index].data.count + 1
						}
					}
					return {
						...state,
						inventoryList: newInventoryList,
						craftItems: craftItems
					}
				}
				else {//больше 1 элемента
					const newInventoryList = inventoryList.map((item) => {
						if (item.id === data.id) return {
							...item,
							count: item.count - 1
						}
						else return item
					})
					craftItems[index] = {
						...craftItems[index],
						data: {
							...craftItems[index].data,
							count: craftItems[index].data.count + 1
						}
					}
					return {
						...state,
						inventoryList: newInventoryList,
						craftItems: craftItems
					}
				}
			}

		}

		/**
		 * Удаление одного ингридиента из крафта
		 */
		case 'DELETE_ONE_ITEM_FROM_CRAFT': {

			const { inventoryList, craftItems } = state
			const craftIndex = action.index
			const data = action.data
			if (data.count === 1) return state
			else {
				const index = inventoryList.findIndex((item) => item.id === data.id)
				if (index === -1) { //нет в инвентаре
					const itemInv = {
						...data,
						count: 1
					}
					inventoryList.push(itemInv)
					craftItems[craftIndex] = {
						...craftItems[craftIndex],
						data: {
							...craftItems[craftIndex].data,
							count: craftItems[craftIndex].data.count - 1
						}
					}
					return {
						...state,
						inventoryList: inventoryList,
						craftItems: craftItems
					}
				}
				else {//есть в инвентаре
					inventoryList[index] = {
						...inventoryList[index],
						count: inventoryList[index].count + 1
					}
					craftItems[craftIndex] = {
						...craftItems[craftIndex],
						data: {
							...craftItems[craftIndex].data,
							count: craftItems[craftIndex].data.count - 1
						}
					}
					return {
						...state,
						inventoryList: inventoryList,
						craftItems: craftItems
					}
				}
			}
			

		}

		/**
		 * Удаление ингридиента из крафта
		 */
		case 'DELETE_ITEM_FROM_CRAFT': {
			const { inventoryList, craftItems } = state
			const craftIndex = action.index
			craftItems[craftIndex] = { active: false }
			craftItems.sort((a, b) => {
				if (a.active === b.active) {
					return 0
				} else if (!a.active && b.active) return 1
				else if (a.active && !b.active) return -1
			})
			// newCraftItems = craftItems.map((item) => {
			//     if (item.active) return item
			// })
			const index = inventoryList.findIndex((item) => item.id === action.data.id)
			if (index === -1) inventoryList.push(action.data)
			else inventoryList[index] = {
				...inventoryList[index],
				count: inventoryList[index].count + action.data.count
			}
			
			return {
				...state,
				inventoryList: inventoryList,
				craftItems: craftItems,
			}
		} 

		/**
		 * Очистка интерфейса
		 */
		case 'NULLIFY_COOKINGCRAFT': {
			const craftItems = state.craftItems
			const newCraftItems = craftItems.map((item) => {
				if (item.active) return { active: false }
				else return item
			})
			return {
				...state,
				craftItems: newCraftItems,
				inventoryList: [],
			}
		}

	}

	return state
}
