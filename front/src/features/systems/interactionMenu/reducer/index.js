const defaultState = {
  personID: null
}

export const interactionMenuReducer = (state = defaultState, action) => {

  switch (action.type) {
    case 'INTERACTIONMENU_SHOW': {
      const { personID } = action.data

      setTimeout(() => {
        window.storage.dispatch({type: 'SHOW_COMPONENT', data: 'interactionMenu'})
      }, 1)

      return {
        ...state,  
        personID
      }
    }
    case 'INTERACTIONMENU_HIDE': {
      setTimeout(() => {
        window.storage.dispatch({type: 'HIDE_COMPONENT', data: 'interactionMenu'})
      }, 1)

      return {
        ...state,  
        personID: null
      }
    }
    case 'INTERACTIONMENU_NULLIFY': {
      return {
        ...state,
        personID: null
      }
    }
  }

  return state;
  
}
