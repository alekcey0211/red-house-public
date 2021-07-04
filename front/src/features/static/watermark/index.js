import React from 'react';
import { useSelector } from 'react-redux';

import icons from '/utils/icons';

import './style.sass';

/**
 * Интерфейс `Вотермарка`.
 * 
 * Находится в правом углу в закрепленном состоянии.
 * Не имеет hotkey для открытия/закрытия.
 * 
 * @returns {JSX.Element}
 */
const Watermark = () => {

  /**
   * Данные/состояния интерфейса.
   */
  const { name, userID, playersOnline } = useSelector(state => state.watermarkReducer)

  return (
    <div id="watermark">
      <span className="title">{ name }</span>
      <div className="info">
        <span>ID: { userID }</span>
        <span>{ icons.watermark.user } { playersOnline }</span>
      </div>
    </div>
  );

}

export default Watermark;