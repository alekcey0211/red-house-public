

const defaultState = {
  title: "Объявление",
  text: "тут какой то текст",
  name: "Djoker255"
}

export const startGameReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "START_GAME": {
      //const name = action.data.name ? action.data.name : state.name
      //const title = action.data.title ? action.data.title : state.title
      //const text = action.data.text ? action.data.text : state.text

      setTimeout(() => {
				window.storage.dispatch({type: 'SHOW_COMPONENT', data: 'startGame'})
			}, 1)

      // return {
      //   ...state,
      //   name,
      //   title,
      //   text
      // }
    }
  }
  return state;
}

