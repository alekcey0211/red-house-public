import React from 'react';
import Border from '/components/styled/border'; 

//import './style.sass'

const NavigationBorder = (props) => {

  const wrapperStyle = {
    position: 'relative',
    minWidth: '830px',
    width: '100%'
  }

  const style = {
    padding: '15px',
    display: 'flex',
    flexDirection: 'row'
  }
  return (
    <Border wrapperStyle={wrapperStyle} style={style}>
      {props.children}
    </Border>
  );
};

export default NavigationBorder;