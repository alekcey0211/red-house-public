import React, { useEffect, useState } from 'react';

import './style.sass';

/**
 * Компонент интерфейса `hud`. 
 * Показывает текущее время.
 */
const TimeInfo = () => {

  /**
   * Состояния/данные интерфейса.
   */
  const [time, setTime] = useState();
  const [date, setDate] = useState();
  const [day, setDay]   = useState();

  /**
   * Идентификатор интервала.
   */
  let intervalID;

  /**
   * Запускается вместе с интерфейсом.
   * Инициализирует скрипт, который вызывает обновление каждую секунду.
   */
  useEffect(() => {
    intervalID = setInterval(() => tick(), 1000)
  }, []);

  /**
   * Обновляет текущее время.
   */
  const tick = () => {
    setTime(getTime());
    setDate(getDate());
    setDay(getDay());
  }

  /**
   * Получаем текущее время в формате (чч:мм).
   * 
   * @returns {string}
   */
  const getTime = () => {
    let date    = new Date();
    let hours   = date.getHours();
    let minutes = date.getMinutes();
  
    if (minutes < 10) minutes = '0' + minutes;
    if (hours < 10) hours = '0' + hours;

    return hours + ":" + minutes;
  }

  /**
   * Получаем дату текущего дня.
   * 
   * @returns {string}
   */
  const getDate = () => {
    let date       = new Date();
    let dateOutput = date.toISOString().slice(0, 10).split('-').reverse().join('.');

    return dateOutput;
  }

  /**
   * Получаем текущее название дня.
   * 
   * @returns {string}
   */
  const getDay = () => {
    let date      = new Date();
    let days      = ['Воскресенье','Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    let dayOutput = days[date.getDay()];
    
    return dayOutput;
  }

  return (
    <div id="timeinfo">
      <span className="time">{ time }</span>&nbsp; 
      <span className="date">{ date }</span><br/>
      <span className="day">{ day }</span>
    </div>
  )
}

export default TimeInfo;