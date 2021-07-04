const defaultState = {
  show: false,
  title: null,
}

export const requestPanelReducer = (state = defaultState, action) => {

  switch (action.type) {
    case 'REQUESTPANEL_SHOW': {
      const { title } = action.data

      setTimeout(() => {
        window.storage.dispatch({ type: 'PARTY_OFFSET', data: true })
      }, 1)

      return {
        ...state,
        show: true,
        title: title,
      }
    }
    case 'REQUESTPANEL_HIDE': {
      setTimeout(() => {
        window.storage.dispatch({ type: 'REQUESTPANEL_UPDATE_NULLIFY' })
      }, 1000)

      setTimeout(() => {
        window.storage.dispatch({ type: 'PARTY_OFFSET', data: false })
      }, 1)

      return {
        ...state,
        show: false
      }
    }
    case 'REQUESTPANEL_NULLIFY': {
      return {
        ...state,
        title: null
      }
    }
  }

  return state;
  
}
