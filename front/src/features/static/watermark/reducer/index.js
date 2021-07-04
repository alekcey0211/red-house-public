const defaultState = {
  show: true, // По умолчанию true
  name: null,
  userID: 0,
  playersOnline: 0
};

export const watermarkReducer = (state = defaultState, action) => {

  switch (action.type) {
    case 'WATERMARK_UPDATE_NAME': {
      return {
        ...state,
        name: action.data.name
      }
    }
    case 'WATERMARK_UPDATE_PLAYER_ID': {
      return {
        ...state,
        userID: action.data.playerID
      }
    }
    case 'WATERMARK_UPDATE_PLAYERS_ONLINE': {
      return {
        ...state,
        playersOnline: action.data.playersOnline
      }
    }
  }

  return state;

}
