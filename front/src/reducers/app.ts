const defaultState = {
  isBrowserFocus: false,
  isInputFieldFocus: false,
  fixedUi: ["chat"],
  usableUi: ["chat"],
  showedUIOld: [],
};

export const appReducer = (state = defaultState, action: any) => {
  switch (action.type) {
    case "UPDATE_APP_BROWSERFOCUS": {
      return {
        ...state,
        isBrowserFocus: action.data,
      };
    }

    case "UPDATE_APP_INPUTFIELDFOCUS": {
      return {
        ...state,
        isInputFieldFocus: action.data,
      };
    }

    case "SHOW_COMPONENT": {
      let newShowedUI = [...state.usableUi];
      const isHave = newShowedUI.find((comp) => comp === action.data);
      if (!isHave) {
        newShowedUI.push(action.data);
      } else {
        return state;
      }

      return {
        ...state,
        usableUi: [...newShowedUI],
      };
    }

    case "HIDE_COMPONENT": {
      let newShowedUI = state.usableUi.filter((el) => el !== action.data);

      return {
        ...state,
        usableUi: [...newShowedUI],
      };
    }

    case "HIDE_INTERFACE": {
      return {
        ...state,
        usableUi: [],
        showedUIOld: [...state.usableUi],
      };
    }

    case "SHOW_INTERFACE": {
      return {
        ...state,
        usableUi: [...state.showedUIOld],
        showedUIOld: [],
      };
    }

    default:
      return state;
  }
};
