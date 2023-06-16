import React from "react";
import Head from "next/head";
import styled from "styled-components";
import { useDayStore } from "../store/login";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useInput from "../hooks/useInput";
import { useState } from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Plan from "../components/main/plan";
import { v4 as uuidv4 } from "uuid";
import { useDataStore } from "../store/userdata";

function Home() {
  const { selectedDay, dayChange } = useDayStore();
  const { userdata, addData, deleteData } = useDataStore();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

  const {
    value: content,
    setinputValue: setContentValue,
    reset: resetContent,
  } = useInput("");

  function focusInput() {
    var inputElement = document.getElementById("input");
    inputElement.focus();
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (content === "") {
      return;
    }
    addData({
      id: uuidv4(),
      content,
    });
    resetContent();
    focusInput();
  };

  const onAdd = () => {
    if (content === "") {
      return;
    }
    addData({
      id: uuidv4(),
      content,
    });
    resetContent();
    focusInput();
  };

  const PlanList = userdata.map((e) => <Plan data={e}></Plan>);

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-typescript)</title>
      </Head>
      <DateinfoWrap>
        <Title>
          <p>
            {selectedDay.getFullYear()}년 {selectedDay.getMonth() + 1}월{" "}
            {selectedDay.getDate()}일
          </p>
          <span>│{weekdays[selectedDay.getDay()]}요일</span>
        </Title>
        {PlanList}
        <PlanInputWrap>
          <div className="icon">•</div>
          <form onSubmit={onSubmit}>
            <input
              id="input"
              className="contents"
              type="text"
              placeholder="내용을 입력하세요"
              value={content}
              onChange={setContentValue}
            />
          </form>
        </PlanInputWrap>
        {content && (
          <PlanPlusWrap color="#AAAAAA" onClick={onAdd}>
            <div className="icon">
              <FontAwesomeIcon icon={faPlus} />
            </div>
            일정 텍스트
          </PlanPlusWrap>
        )}
      </DateinfoWrap>
    </React.Fragment>
  );
}

const DateinfoWrap = styled.div`
  display: flex;
  padding: 30px 16px;
  flex-direction: column;
  overflow: scroll;
`;
const PlanInputWrap = styled.div`
  display: flex;
  padding: 4px 4px;
  flex-direction: row;
  color: ${({ color }) => color};
  .icon {
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  form {
    display: flex;
    flex: 1;
  }
  input {
    flex: 1;
  }
`;
const PlanPlusWrap = styled.div`
  cursor: text;
  display: flex;
  padding: 4px 4px;
  flex-direction: row;
  color: ${({ color }) => color};
  align-items: center;
  font-size: 16px;
  opacity: 0%;
  transition: all 0.1s;
  .icon {
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &:hover {
    opacity: 100%;
  }
`;
const PlanWrap = styled.div`
  cursor: text;
  display: flex;
  padding: 4px 4px;
  flex-direction: row;
  color: ${({ color }) => color};
  align-items: center;
  font-size: 16px;
  .icon {
    margin: 0 4px;
    opacity: 0%;
  }
  .dot {
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  span {
    flex: 1;
  }
`;
const Title = styled.div`
  margin-left: 12px;
  display: flex;
  align-items: center;
  margin-bottom: 25px;
  p {
    /* width: 180px; */
    font-weight: 600;
    font-size: 24px;
    color: #333333;
  }
  span {
    font-weight: 400;
    font-size: 24px;
    color: #666666;
  }
`;

export default Home;
