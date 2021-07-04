const defaultState = {}

export const commandReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "COMMAND": {
      setTimeout(() => {
        window.storage.dispatch({
          type: action.data.commandType,
          data: action.data.alter[0].length ? JSON.parse(action.data.alter[0]) : null
        })
      }, 1)

      return {
        ...state,
      }
    }
  }

  return state
}