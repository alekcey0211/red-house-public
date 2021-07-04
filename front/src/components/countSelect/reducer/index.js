const defaultState = {
  count: 1,
  max: 1
}

export const countSelectReducer = (state = defaultState, action) => { 

  switch (action.type) {
    case 'COUNTSELECT_UPDATE_COUNT': {
      return {
        ...state,
        count: action.data
      }
    }
    case 'COUNTSELECT_UPDATE': {
      return {
        ...state,
        max: action.data.count,
        data: action.data
      }
    }
  }

  return state;

}