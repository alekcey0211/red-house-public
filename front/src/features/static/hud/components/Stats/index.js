import React, { useRef } from 'react';
import { useSelector } from 'react-redux';

import Bar from './Bar'

import './style.sass'

/**
 * Интерфейс `stats`.
 * 
 * Находится в правой части экрана.
 * Появляется только тогда, когда элементы `stats` падают слишком низко.
 * При низких значениях `stats` не прячется, в ином случае исчезает через некоторое время.
 */
const Stats = () => {

  /**
   * Состояния/данные интерфейса.
   */
  const stats = useSelector(state => state.hudReducer.stats)

  /**
   * Ссылки на DOM элементы.
   */
  const statsRef = useRef()

  return (
    <div id="stats" ref={statsRef}>
      <Bar type='hunger' value={stats?.hunger}/>
      <Bar type='thirst' value={stats?.thirst} />
    </div>
  )

}

export default Stats;