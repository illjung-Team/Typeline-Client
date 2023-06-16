import React from "react";
import styled from "styled-components";

const Gotoday = () => {
  return <Gotodaybutton>오늘</Gotodaybutton>;
};

export default Gotoday;

const Gotodaybutton = styled.button`
  font-weight: 600;
  font-size: 18px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 43px;
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 8px;
`;
