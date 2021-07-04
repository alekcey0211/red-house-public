import React from "react";
import { connect, useDispatch } from "react-redux";

import { KeyBoardLayout } from '/components';
import { Border } from '/components/styled';
import Animation from "./components/Animation";

import "./styles.sass";

/**
 * Интерфейс проигрывания анимаций.
 * 
 * @param {object}
 * @returns {JSX.Element}
 */
const AnimList = (props) => {

  /**
   * Состояния/данные интерфейса.
   */
  const { animations, selectedGroup, groupIsSelected, search } = props;
  const layoutName = 'animList'

  /**
   * Вспомогательный `dispatch`.
   */
  const dispatch = useDispatch()

  /**
   * Выполняется при вводе в поле поиска. 
   */
  const handleChange = (event) => {
    props.updateSearch(event.target.value.toLowerCase())
  }

  /**
   * Закрывает окошко.
   */
  const handleClose = () => {
    window.mp.send('cef::chat:send', `/browserFocused false`)
    dispatch({type: 'HIDE_COMPONENT', data: layoutName})
  }

  /**
   * Получаем отфильтрованные поиском анимации.
   * 
   * @returns {array}
   */
  const getAnimations = () => {
    let items

    if (search && !groupIsSelected) {
      /**
       * Фильтруем по значению поиска.
       */
      items = animations.items.filter((animation) =>
        animation.name.toLowerCase().includes(search)
      )
    } else {
      if (groupIsSelected) {

        /**
         * Фильтруем по выбранной группе.
         */
        items = animations.items.filter((animation) =>
          animation.parents.includes(selectedGroup)
        )
        
        /**
         * Фильтруем по значению поиска.
         */
        items = items.filter((animation) =>
          animation.name.toLowerCase().includes(search)
        )
        
      } else {
        items = animations.groups
      }
    }

    return items
  };

  /**
   * Компоненты анимаций.
   */
  const AnimationComponents = getAnimations().map((animation, index) => {
    return <Animation key={index} data={animation} />;
  })

  return (
    <KeyBoardLayout
      name={layoutName}
      hotKeys={{
        close: {
          ["Escape"]: handleClose,
          ["KeyU"]: () => {
            return layoutName
          }
        }
      }}
    >
      <Border right="40px">
        <div id="animList">
          <div className="animations__inner">
            <div className="animations__header">
              <h1 className="title">{groupIsSelected ? selectedGroup : "Анимации"}</h1>
              <button className="close" onClick={handleClose}>&times;</button>
              <input
                type="text"
                spellCheck="false"
                value={search}
                placeholder="Поиск анимаций"
                onChange={handleChange}
              />
            </div>
            <div className="animations__list">
              {
                AnimationComponents.length ? 
                AnimationComponents : 
                <p>Список анимаций пуст</p>
              }
            </div>
            {
              groupIsSelected &&
              <>
                <span className="back" onClick={props.goBack}>
                  Назад
                </span>
                <span className="cancel" onClick={props.cancelAnim}>
                  Отменить
                </span>
              </>
            }
          </div>
        </div>
      </Border>
    </KeyBoardLayout>
  );

};

const mapStateToProps = (state) => {
  const defaultState = state.animListReducer;

  return {
    animations: defaultState.animations,
    selectedGroup: defaultState.selectedGroup,
    groupIsSelected: defaultState.groupIsSelected,
    search: defaultState.search,
  };
};

const mapDispatchToProps = (dispatch) => ({
  selectGroup: (data) =>
    dispatch({
      type: "ANIMLIST_SELECT_GROUP",
      data,
    }),
  goBack: (data) =>
    dispatch({
      type: "ANIMLIST_GO_BACK",
      data,
    }),
  cancelAnim: () => window.mp.send("cef::chat:send", `/anim IdleStop idle`),
  updateSearch: (data) =>
    dispatch({
      type: "ANIMLIST_UPDATE_SEARCH",
      data,
    }),
});

export default connect(mapStateToProps, mapDispatchToProps)(AnimList);
