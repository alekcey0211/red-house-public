import React from 'react'

import './style.sass'

/**
 * Полоска отображения шкалы `stats`.
 */
const Bar = (props) => {

  /**
   * Состояния/данные интерфейса.
   */
  const value = props.value;
  const type  = props.type;

  /**
   * Определяем, на сколько процентов заполнена шкала.
   * 
   * Если больше 100, то стави 100, в ином случае оставляем.
   */
  const getWidthString = () => {
    return `${value > 100 ? 100 : value}%`;
  }

  return (
    <div className={`bar ${type}`}>
      <div
        className={`line ${type}`}
        style={{ width: getWidthString() }}
      />
      <div className="info">
        <div className={`icon ${type}`} />
        <div className='value'>{value}</div>
      </div>
    </div>
  );

}

export default Bar;