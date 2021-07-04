const defaultState = {
  canClose: true,  // По умолчанию true
  title: null,     // По умолчанию null
  subtitle: null,  // По умолчанию null
  buttons: []      // По умолчанию []
}

/**
 * Reducer интерфейса `selectBox`.
 * 
 * @param {object} state 
 * @param {object} action 
 * @returns {object}
 */
export const selectBoxReducer = (state = defaultState, action) => {

  switch (action.type) {
    case 'SELECTBOX_INIT': {
      setTimeout(() => {
        window.storage.dispatch({type: 'SHOW_COMPONENT', data: 'selectBox'})
      }, 1)

      return {
        ...state,
        canClose: action.data.canClose,
        title: action.data.title ? action.data.title : null,
        subtitle: action.data.subtitle ? action.data.subtitle : null,
        buttons: action.data.buttons ? action.data.buttons : []
      }
    }
    case 'SELECTBOX_NULLIFY': {
      return {
        ...state,
        title: null,
        subtitle: null,
        buttons: []
      }
    }
  }

  return state

}