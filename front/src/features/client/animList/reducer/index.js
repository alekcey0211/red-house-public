import data from '../data.js'

const defaultState = {
  animations: data,
  selectedGroup: '',
  groupIsSelected: false,
  search: ''
}

export const animListReducer = (state = defaultState, action) => {

  switch (action.type) {
    case 'ANIMLIST_SHOW': {
      setTimeout(() => {
        window.storage.dispatch({type: 'SHOW_COMPONENT', data: 'animList'})
      }, 1)

      return {
        ...state
      }
    }
    case 'ANIMLIST_SELECT_GROUP': {
      return {
        ...state,
        selectedGroup: action.data,
        groupIsSelected: true,
        search: ''
      }
    }
    case 'ANIMLIST_UPDATE_ANIMATIONS': {
      return {
        ...state,
        animations: {
          ...state.animations,
          items: action.data
        }
      }
    }
    case 'ANIMLIST_GO_BACK': {
      return {
        ...state,
        selectedGroup: defaultState.groupIsSelected,
        groupIsSelected: false,
        search: ''
      }
    }
    case 'ANIMLIST_UPDATE_SEARCH': {
      return {
        ...state,
        search: action.data
      }
    }
  }

  return state;
  
}
