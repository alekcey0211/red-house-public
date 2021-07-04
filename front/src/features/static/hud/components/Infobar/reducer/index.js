
const defaultState = {
  settings: {
    activeLimit: 4,    // По умолчанию 4
    showDuration: 5,   // По умолчанию 5
    inHurryDuration: 3 // По умолчанию 3
  },
  messages: [
    // {
    //   type: 'default',
    //   message: 'какое то сообщение',
    //   alreadyShow: false
    // },
    // {
    //   type: 'additem',
    //   message: 'меч',
    //   count: 1,
    //   alreadyShow: false
    // },
    // {
    //   type: 'deleteitem',
    //   message: 'меч',
    //   count: 1,
    //   alreadyShow: false
    // }
  ]
}

export const infobarReducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'INFOBAR_ADD_MESSAGE': {
      const limit = 50
      const messages = [...state.messages]

      /**
       * Удаляем одно сообщение если количество побило лимит.
       */
      while (messages.length > limit) {
        messages.shift()
      }

      /**
       * Объект одного предмета/сообщения.
       */
      let data = {
        ...action.data,
        unique: String(Math.random()),
        alreadyShow: false
      }

      /**
       * Поиск индекса дубликата.
       */
      const index = messages.findIndex(item => item.type === data.type
        && item.message === data.message
        && !item.alreadyShow)

      /**
       * Если был найден дубликат предмета.
       */
      if (index !== -1) {
        if (data.type == 'default') {
          data = false
        } else {
          data.count = messages[index].count + data.count
  
          messages.splice(index, 1)
        }
      }

      return {
        ...state,
        messages: data ? messages.concat(data) : messages
      }

    }
    case 'INFOBAR_UPDATE_MESSAGE_SHOW': {
      let newMessages = [...state.messages]

      const index = newMessages.findIndex(item => item.unique === action.data)

      if (index != -1) {
        newMessages[index].alreadyShow = true
      }

      return {
        ...state,
        messages: newMessages
      }
    }
    case 'INFOBAR_UPDATE_SETTINGS': {
      const { activeLimit, showDuration, inHurryDuration } = action.data
      const defaultSettings = state.settings

      return {
        ...state,
        settings: {
          ...settings,
          activeLimit: activeLimit ? activeLimit : defaultSettings.activeLimit,
          showDuration: showDuration ? showDuration : defaultSettings.showDuration,
          inHurryDuration: inHurryDuration ? inHurryDuration : defaultSettings.inHurryDuration
        }
      }
    }
    default:
      return state
  }
}