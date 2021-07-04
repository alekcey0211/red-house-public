import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  font-family: "Din-pro", sans-serif;
  font-size: 14px;
  font-weight: normal;
  font-style: normal;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 3px;
`;

const BorderStyle = styled.div`
  border: 2px solid rgba(128, 128, 128, 0.5);
`;

const Border = (props) => {
  const { top, left, right, bottom } = props;
  const { style, wrapperStyle } = props;
  return (
    <Wrapper style={{ ...wrapperStyle, top, left, right, bottom }}>
      <BorderStyle style={{ ...style }}>{props.children}</BorderStyle>
    </Wrapper>
  );
};
export default Border;
