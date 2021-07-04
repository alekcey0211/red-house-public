import React from 'react';
import { connect, useSelector } from 'react-redux';

import icons from '/utils/icons.js';

import './styles.sass';

/**
 * Анимация интерфейса `animList`.
 */
const Animation = (props) => {

  /**
   * Состояния/данные интерфейса.
   */
  const animations = useSelector(state => state.animListReducer.animations)

  /**
   * Вызывается при нажатии на анимацию или группу.
   */
  const handleClick = () => {
    props.updateSearch('');

    if (props.data.type === 'group') {
      props.selectGroup(props.data.name);
    } else {
      initAnimation(props.data.code, props.data.codeType);
    }
  }

  /**
   * Инициализация анимации. 
   */
  const initAnimation = (code, codeType) => {
    window.mp.send('cef::chat:send', `/AnimList ${code} ${codeType}`);
  }

  /**
   * При добавлении/удалении анимации из `Избранное`.
   * 
   * @param {object} event 
   */
  const mark = (event) => {
    event.stopPropagation();

    let newAnimations = animations.items;

    // Добавление/удаление анимации из "Избранное"
    newAnimations.forEach((item, index) => {
      if (item.name === props.data.name) {
        newAnimations[index].marked = !item.marked;

        if (newAnimations[index].parents.includes('Избранное')) { 
          newAnimations[index].parents.splice(newAnimations[index].parents.indexOf('Избранное'), 1);
        } else {
          newAnimations[index].parents.push('Избранное');
        }
      }
    });

    props.updateAnimations(newAnimations);
  }

  /**
   * Получаем количество анимаций в группе.
   */
  const getCount = () => {
    return animations.items.filter(animation => animation.parents.includes(props.data.name)).length;
  }

  return (
    <div className={ `animation ${props.data.type === 'group' ? 'animation--group' : 'animation--item'}` } onClick={handleClick}>
      <span className="animation__text">{ props.data.name }</span>
      { props.data.type === 'group' ? 
        <span className="animation__count">{ getCount() }</span> : 
        <span className={ `animation__mark ${props.data.marked ? 'active' : ''} ` } onClick={mark}>{ icons.animList.star }</span> }
    </div>
  );

}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => ({
  selectGroup: (data) =>
    dispatch({
      type: 'ANIMLIST_SELECT_GROUP',
      data,
    }),
  updateAnimations: (data) =>
    dispatch({
      type: 'ANIMLIST_UPDATE_ANIMATIONS',
      data,
    }),
  updateSearch: (data) =>
    dispatch({
      type: 'ANIMLIST_UPDATE_SEARCH',
      data,
    }),
})

export default connect(mapStateToProps, mapDispatchToProps)(Animation);