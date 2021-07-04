import React, { useState } from 'react';
//import Tab from './Tab'


/**
 * 
 * @param {*} props 
 * @param {*} props.tabItems - массив из элементов навигации
 * @param {*} props.tabComponent - компонент
 * @param {*} props.activate - (необ.) первый активный элемент. По умолчанию берётся первый элемент из tabItems
 * @param {*} props.styled - стиль для блока элемента навигации
 * @returns 
 */
const useNavigation = ({
  tabItems,
  tabComponent,
  activate = tabItems[0],
  styled,
  innerStyled
}, ...props) => {
  /**
   * Состояние активного элемента навигации
   */
  const [isActivate, setActivate] = useState(activate)

  const handler = () => {

  }
 
  /**
   * Массив элементов навигации
   */
  const TabItems = tabItems.map((item, index) => {
    const handlerActivate = () => {
      setActivate(item)
    }
    /**
     * Данные, которые будут переданы в tabComponent
     */
    const props = {isActivate, ...item}
   
    return (
      <div className={innerStyled} onClick={handlerActivate} key={index}>
        {tabComponent(props)}
      </div>

    )
  })
 
  /**
   * Компонент навигации
   * @returns 
   */
  const NavigationComponent = () => {
    return (
      <>
        {TabItems}
     </>
    );
  }
  return [NavigationComponent, isActivate, setActivate]
};

export default useNavigation;