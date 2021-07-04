import React from "react"
import styled from "styled-components"

const Action = styled.div`
display: flex;
flex-direction: row;
align-items: center;

cursor: pointer;

font-family: 'Futura-pt CB';
font-size: 22px;
line-height: 1;

color: #7B7B7B;

transition: color .3s;

  &.active {
    color: #fff;
  }

  &.active:hover {
    color: #B2B2B2;
  }

  &.active:hover > div {
    color: #B2B2B2;
  }

  &.active > div {
    color: #fff;
  }
`

const ActionButton = styled.div`
width: 30px;
height: 30px;

margin-right: 5px;
padding: 2px;

border-radius: 5px;

background-color: #000;
`

const ActionButtonInner = styled.div`
display: flex;
align-items: center;
justify-content: center;

width: 100%;
height: 100%;

font-family: 'Futura-pt CM';
font-size: 22px;
line-height: 1;

border: 2px solid rgba(128, 128, 128, .5);
border-radius: 5px;

transition: color .3s;
`

const DefaultButton = styled.div`
display: flex;
align-items: center;
justify-content: center;

font-family: 'Din-pro M';
font-size: 16px;

min-width: 130px;
height: 35px;

border: 1px solid #6A6A6A;

padding: 0 15px;

color: #fff;

cursor: pointer;

transition: background-color .3s;

&:hover {
  background-color: #3f3f3f;
}
`

/**
 * Компонент кнопки.
 * 
 * @param {object} props - Входящие параметры
 * @param {boolean} props.show - Отображение компонента (default: true)
 * @param {boolean} props.isActive - Находится ли в активном состоянии (default: true)
 * @param {string} props.type - Тип кнопки (default: default)
 * @param {function} props.onClick - Колбэк функция, вызывается при нажатии
 * @param {string} props.triggerKey - Клавиша вызова колбэк функции
 * @param {string} props.description - Описание действия
 * @returns {JSX.Element}
 */
const Button = ({show = true, type = 'default', isActive = true, ...props}) => {
  if (type == 'action') {
    return (
      show &&
      <Action style={props.style} className={`${isActive ? 'active' : ''}`} onClick={props.onClick}>
        <ActionButton>
          <ActionButtonInner style={props.innerStyle}>{ props.triggerKey }</ActionButtonInner>
        </ActionButton>
        { props.description }
      </Action>
    )
  } else {
    return (
      show &&
      <DefaultButton onClick={props.onClick}>
        { props.children }
      </DefaultButton>
    )
  }
}

export default Button
