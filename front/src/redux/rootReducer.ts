import { combineReducers } from "redux";

import { chatReducer } from "../features/client/chat/reducer";
import { animListReducer } from "../features/client/animList/reducer";
import { watermarkReducer } from "../features/static/watermark/reducer";
import { tradeReducer } from "../features/systems/trade/reducer";
import { hudReducer } from "../features/static/hud/reducer";
import { countSelectReducer } from "../components/countSelect/reducer";
import { selectBoxReducer } from "../features/utils/selectBox/reducer";
import { infobarReducer } from "../features/static/hud/components/Infobar/reducer";
import { hintPanelReducer } from "../features/static/hud/components/HintPanel/reducer";
import { interactionMenuReducer } from "../features/systems/interactionMenu/reducer";
import { requestPanelReducer } from "../features/utils/requestPanel/reducer";
import { craftReducer } from '../features/crafts/craft/reducer'

import { appReducer } from "../reducers/app";
import { commandReducer } from "../reducers/command";

export const rootReducer = combineReducers({
  craftReducer,
  hintPanelReducer,
  requestPanelReducer,
  interactionMenuReducer,
  infobarReducer,
  selectBoxReducer,
  countSelectReducer,
  animListReducer,
  chatReducer,
  commandReducer,
  appReducer,
  hudReducer,
  tradeReducer,
  watermarkReducer,
});
