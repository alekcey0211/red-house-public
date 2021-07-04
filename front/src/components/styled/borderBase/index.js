import React from "react";
import styled from "styled-components";

const Border = styled.div`
border: 2px solid rgba(128, 128, 128, 0.5);
padding: ${props => props.padding || '0px'};
`

const Wrapper = styled.div`
background-color: rgba(0, 0, 0, 0.8);
font-family: "Din-pro", sans-serif;
font-size: 14px;
font-weight: normal;
font-style: normal;
color: #fff;
padding: 3px;
position: ${props => props.position || 'static'};
width: '480px';
marginRight: "30px";
`
/**
 * Компонент обертки в `границы`.
 * 
 * @param {*} props 
 * @param {Boolean} props.show - Показать компонент BorderBase
 * @param {String} props.position - Позиционирование BorderBase
 * @param {String} props.width - Ширина BorderBase
 * @returns {JSX.Element}
 */
const BorderBase = (props) => {
  const show = props.show ? props.show : false

  return (
    show &&
    <Wrapper {...props} >
      <Border {...props}>{props.children}</Border>
    </Wrapper>
  )
}

export default BorderBase
