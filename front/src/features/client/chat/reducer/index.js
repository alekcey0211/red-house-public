const defaultState = {
  list: [],         // По умолчанию []
  input: null,      // По умолчанию null
	listLimit: 50,    // По умолчанию 50
  inputShow: false, // По умолчанию false
}

export const chatReducer = (state = defaultState, action) => {

	switch (action.type) {

    case 'CHAT_SHOW':
      return {
        ...state,
        inputShow: true,
      }

    case 'CHAT_HIDE':
      return {
        ...state,
        inputShow: false,
      }

    case 'CHAT_UPDATE_INPUT':
      return {
        ...state,
        input: action.data,
      }

    case 'CHAT_CLEAR':
      return {
        ...state,
        list: [],
      }

		case 'CHAT_ADD_MESSAGE':
			const limit = state.listLimit
			const list  = [...state.list]

      /**
       * Отправленное сообщение.
       */
      const { message } = action.data

			/**
			 * Добавляем сообщение в соответствующую группу, также в `Все`.
			 */
      list.push(message)

			/**
			 * Удаляем старые сообщения списка, если их количество стало больше лимита.
			 */
			while (list.length > limit) {
				list.shift()
			}

			return {
				...state,
				list,
			}

	}

	return state
	
}
