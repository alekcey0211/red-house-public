const defaultState = {
  show: true,
  stats: {
    hunger: 100,
    thirst: 100
  }
}

export const hudReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'HUD_UPDATE_STATS': {
      const { hunger, thirst } = action.data

      return {
        ...state,
        stats: {
          ...state.stats,
          hunger,
          thirst,
        }
      }
    }
  }

  return state
}
