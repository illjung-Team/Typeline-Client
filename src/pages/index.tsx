import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import styled from "styled-components";
import { useDayStore } from "../store/currentday";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useInput from "../hooks/useInput";
import { fa0, faPlus } from "@fortawesome/free-solid-svg-icons";
import Plan from "../components/main/plan";
import useSWR, { mutate } from "swr";
import { useSession } from "next-auth/react";
import useSWRMutation from "swr/mutation";
import api from "../axios";

function Home() {
  const { selectedDay, getdayparams } = useDayStore();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const { data: session }: any = useSession();
  const [add, setAdd] = useState(true);
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  const getdayfetcher = (url) =>
    api
      .get(url, {
        params: getdayparams(),
        data: {
          user_id: session.user.id,
        },
      })
      .then((res: any) => res.data)
      .catch((error) => error.response.status === 404 && []);

  const getmonthfetcher = (url) => {
    api.get(url).then((res) => res.data);
  };

  const {
    data: dateData,
    error: dateDataError,
    isLoading: dateDataIsLoading,
    mutate: datemutate,
  } = useSWR(`schedule/day`, getdayfetcher);

  const { trigger: monthmutate } = useSWRMutation(
    `schedule/month`,
    getmonthfetcher
  );

  const {
    value: content,
    setinputValue: setContentValue,
    reset: resetContent,
  } = useInput("");

  const postfetcher = async (body) =>
    api.post(`schedule`, body).then((res) => {
      console.log(res.data);
    });

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
      memo: content.replace(/\n/g, "<br>"),
    });
    datemutate();
    monthmutate();
    resetContent();
    focusInput();
  };

  const PlanList = dateData?.map((e, i, m) => (
    <Plan
      data={e}
      key={i}
      nextid={m[i + 1]?.schedule_id}
      previd={m[i - 1]?.schedule_id}
      datemutate={datemutate}
      monthmutate={monthmutate}
      setAdd={setAdd}
      add={add}
      focusInput={focusInput}
    ></Plan>
  ));

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
        <ScrollArea>
          {PlanList}
          {add && (
            <PlanInputWrap add={add}>
              <div className="dot">•</div>
              <form onSubmit={onSubmit}>
                <input
                  id="input"
                  ref={inputRef}
                  className="contents"
                  type="text"
                  placeholder="내용을 입력하세요"
                  value={content}
                  onChange={setContentValue}
                />
              </form>
            </PlanInputWrap>
          )}
          {content && (
            <PlanPlusWrap color="#AAAAAA" onClick={onAdd}>
              <div className="icon">
                <FontAwesomeIcon icon={faPlus} />
              </div>
              일정 텍스트
            </PlanPlusWrap>
          )}
        </ScrollArea>
      </DateinfoWrap>
    </React.Fragment>
  );
}

const DateinfoWrap = styled.div`
  display: flex;
  padding: 30px 2px 0 16px;
  flex-direction: column;
`;
const ScrollArea = styled.div`
  display: flex;
  flex-direction: column;
  height: 370px;
  overflow: scroll;
`;
const PlanInputWrap = styled.div<any>`
  /* display: ${({ add }) => (add ? "flex" : "none")}; */
  display: flex;
  flex-direction: row;
  color: ${({ color }) => color};
  padding: 4px;
  .icon {
    width: 24px;
    height: 24px;
    display: flex;
    position: relative;
    bottom: 3px;
    font-size: 36px;
    justify-content: center;
    align-items: center;
  }
  .dot {
    position: relative;
    bottom: 2px;
    font-size: 36px;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #aaaaaa;
  }
  form {
    display: flex;
    flex: 1;
  }
  input {
    flex: 1;
    margin-bottom: 2px;
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
