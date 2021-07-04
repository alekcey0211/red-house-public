const defaultState = {
  show: true, // По умолчанию true
  items: []   // По умолчанию []
}

export const hintPanelReducer = (state = defaultState, action) => {

	switch (action.type) {

    case 'HINTPANEL_INIT':
      const items = action.data

      return {
        ...state,
        items,
      }

    case 'HINTPANEL_SHOW':
      return {
        ...state,
        show: true,
      }

    case 'HINTPANEL_HIDE':
      return {
        ...state,
        show: false,
      }

	}

	return state
	
}
