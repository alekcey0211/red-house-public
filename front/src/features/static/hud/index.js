import React from 'react'
import { useSelector } from 'react-redux'

import TimeInfo from './components/TimeInfo'
import Infobar from './components/Infobar'
import HintPanel from './components/HintPanel'

import './style.sass'

/**
 * Интерфейс `худ`.
 * 
 * Находится в закрепленном состоянии.
 */
const Hud = () => {

  /**
   * Состояния/данные интерфейса.
   */
  const show  = useSelector(state => state.hudReducer.show)

  return (
    show &&
    <div id="hud">
      <TimeInfo />
      <Infobar />
      <HintPanel />
    </div>
  )

}

export default Hud