import defaultState from './defaultState'
import icons from '../icons';
import getIcon from '/utils/Icon';
import { FormType } from '/types/formtype'
import { changeInventory } from '/utils/utilsReducer'

export const tradeReducer = (state = defaultState, action) => {

  switch (action.type) {
    case 'TRADE_ADD_ALL_ITEMS': {
      const { meta, inventory } = action.data
      const { playerName, playerID, personName, personID } = meta

      const newInventory = inventory.map((item) => {
        if (item.category === FormType.kFormType_Potion && item.isFood) return {
          ...item,
          category: FormType.FkFormType_Eat,
          icon: icons.tabs.eat
        }
        else return {
          ...item,
          icon: getIcon(item.category, item.type !== null ? item.type : null)
        }
      })

      // Показываем компонент
      setTimeout(() => {
        window.storage.dispatch({type: "SHOW_COMPONENT", data: "trade"})
      }, 1)

      return {
        ...state,
        inventoryList: newInventory,
        suggestionPlayer: {
          ...state.suggestionPlayer,
          playerId: playerID,
          playerName: playerName
        },
        suggestionPerson: {
          ...state.suggestionPerson,
          personId: personID,
          personName: personName
        }
      }
    }
    case 'UPDATE_TRADE_SHOW': {
      return {
        ...state,
        show: action.data
      }
    }
    case 'ADD_TRADE_PLAYER_ITEM': {
      const { inventoryList, suggestionPlayer } = state
      const { suggestionList } = suggestionPlayer
      const data = action.data
      const count = action.count

      const [newInventoryList, newSuggestionList] = changeInventory(
        data,
        inventoryList,
        suggestionList,
        count
      )

      return {
        ...state,
        inventoryList: newInventoryList,
        suggestionPlayer: {
          ...suggestionPlayer,
          suggestionList: newSuggestionList
        }
      }
    }
    case 'DELETE_TRADE_PLAYER_ITEM': {
      const { inventoryList, suggestionPlayer } = state
      const { suggestionList } = suggestionPlayer
      const data = action.data
      const { count } = data

      const [newSuggestionList, newInventoryList] = changeInventory(
        data,
        suggestionList,
        inventoryList,
        count
      )

      return {
        ...state,
        inventoryList: newInventoryList,
        suggestionPlayer: {
          ...suggestionPlayer,
          suggestionList: newSuggestionList
        }
      }
    }
    case 'TRADE_ADD_PERSON_ITEM': {
      const data = action.data
      const { suggestionPerson } = state
      const { suggestionList } = suggestionPerson

      const getItem = () => {
        if (data.category === FormType.kFormType_Potion && data.isFood) {
          return {
            ...data,
            category: FormType.FkFormType_Eat,
            icon: getIcon(FormType.FkFormType_Eat)
          }
        }
        else {
          return {
            ...data,
            icon: getIcon(data.category)
          }
        }
      }

      const personItem = getItem()
      const indexItem = suggestionList.findIndex(item => item.id === personItem.id)

      let newSuggestionList;

      // Если найден индекс предмета
      if (indexItem !== -1) {
        suggestionList[indexItem].count += personItem.count
        newSuggestionList = suggestionList
      } else {
        newSuggestionList = suggestionList.concat(personItem)
      }

      return {
        ...state,
        suggestionPerson: {
          ...suggestionPerson,
          suggestionList: newSuggestionList
        }
      }
    }
    case 'TRADE_DELETE_PERSON_ITEM': {
      const data = action.data
      const { suggestionPerson } = state
      const { suggestionList } = suggestionPerson

      const newSuggestionList = suggestionList.filter((item) => {
        if (item.id !== data.id) return item
      })
      
      return {
        ...state,
        suggestionPerson: {
          ...suggestionPerson,
          suggestionList: newSuggestionList
        }
      }
    }
    case 'TRADE_ACTIVATE_PLAYER': {
      const newActivatePlayer = !state.activatePlayer

      return {
        ...state,
        activatePlayer: newActivatePlayer
      }
    }
    case 'TRADE_ACTIVATE_PERSON': {
      const newActivatePerson = !state.activatePerson
      
      return {
        ...state,
        activatePerson: newActivatePerson
      }
    }
    case 'TRADE_NULLIFY': {
      const newSuggestionPlayer = {
        playerName: '',
        coast: 0,
        suggestionList: []
      }

      const newSuggestionPerson = {
        personName: '',
        coast: 0,
        suggestionList: []
      }

      // Закрываем компонент
      setTimeout(() => {
        window.storage.dispatch({type: "HIDE_COMPONENT", data: "trade"})
        window.storage.dispatch({type: "HIDE_COMPONENT", data: "waitingWindow"})
      }, 1)

      return {
        ...state,
        inventoryList: [],
        suggestionPlayer: newSuggestionPlayer,
        suggestionPerson: newSuggestionPerson,
        activatePlayer: false,
        activatePerson: false,
        playerSubmit: false,
        personSubmit: false
      }
    }
    case 'TRADE_ACCEPT_FROM_PERSON': {
      return {
        ...state,
        personSubmit: true
      }
    }
    case 'ACCEPT_TRADE_TO_PLAYER': {
      return {
        ...state,
        playerSubmit: true
      }
    }
    case 'State': {
      console.log(state)
    }
  }

  return state;

}
