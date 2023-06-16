import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faXmark } from "@fortawesome/free-solid-svg-icons";

const Header = () => {
  async function minimizeWindow() {
    await window.electron.minimize();
  }
  async function closeWindow() {
    await window.electron.close();
  }

  return (
    <HeaderWrap>
      <Windowcontrol>
        <WindowIcon onClick={minimizeWindow}>
          <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
        </WindowIcon>
        <WindowIcon onClick={closeWindow}>
          <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
        </WindowIcon>
      </Windowcontrol>
    </HeaderWrap>
  );
};

export default Header;

const HeaderWrap = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  width: 100vw;
  top: 0;
  left: 0;
  height: 24px;
  color: #666666;
  -webkit-app-region: drag;
  z-index: 999;
`;
const Windowcontrol = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
  color: #666666;
  -webkit-app-region: none;
`;

const WindowIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 100%;
  padding: 2px;
  transition: all 0.1s;
  &:hover {
    background-color: #dddddd;
  }
`;
