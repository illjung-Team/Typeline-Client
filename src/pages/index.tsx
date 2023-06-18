import React, { useEffect, useState } from "react";
import Head from "next/head";
import styled from "styled-components";
import { useDayStore } from "../store/currentday";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useInput from "../hooks/useInput";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Plan from "../components/main/plan";
import { v4 as uuidv4 } from "uuid";
import { useDataStore } from "../store/userdata";
import { useIdStore } from "../store/userid";
import axios from "axios";
import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";
import useSWRMutation from "swr/mutation";

function Home() {
  const { selectedDay, getdayparams } = useDayStore();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const { data: session }: any = useSession();

  const getdayfetcher = (url, body, params) =>
    axios.get(url, { params, data: body }).then((res) => res.data);

  const getmonthfetcher = (url) => {
    axios.get(url).then((res) => res.data);
  };

  const {
    data: dateData,
    error: dateDataError,
    isLoading: dateDataIsLoading,
    mutate: datemutate,
  } = useSWR(`http://localhost:3001/schedule/day`, (url) =>
    getdayfetcher(
      url,
      {
        user_id: session.user.id,
      },
      getdayparams()
    )
  );

  const { trigger } = useSWRMutation(
    `http://localhost:3001/schedule/month`,
    getmonthfetcher
  );

  const {
    value: content,
    setinputValue: setContentValue,
    reset: resetContent,
  } = useInput("");

  const postfetcher = async (body) =>
    axios.post(`http://localhost:3001/schedule`, body).then((res) => {
      console.log(res.data);
    });

  function focusInput() {
    var inputElement = document.getElementById("input");
    inputElement.focus();
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onAdd();
  };

  const onAdd = async () => {
    if (content === "") {
      return;
    }
    await postfetcher({
      ...getdayparams(),
      user_id: session.user.id,
      memo: content,
    });
    datemutate();
    trigger();
    resetContent();
    focusInput();
  };

  const PlanList = dateData?.map((e, i) => <Plan data={e} key={i}></Plan>);

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-typescript)</title>
      </Head>
      <DateinfoWrap>
        <Title>
          <p>
            {getdayparams().yyyy}년 {getdayparams().mm}월 {getdayparams().dd}일
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
