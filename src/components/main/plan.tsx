import React from "react";
import styled from "styled-components";
import { faTrashCan, faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";
import usedivInput from "../../hooks/usedivInput";
import useSWRMutation from "swr/mutation";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useDayStore } from "../../store/currentday";
import api from "../../axios";

const Plan: any = ({
  data,
  datemutate,
  monthmutate,
  nextid,
  previd,
  focusInput,
  i,
}) => {
  const { data: session }: any = useSession();
  const { selectedDay, getdayparams } = useDayStore();
  const [icon, setIcon] = useState(false);

  const divRef = useRef(null);

  const {
    value: memo,
    setdivValue: setMemoValue,
    reset: resetContent,
  } = usedivInput(data?.memo);

  const deletefetcher = async (url, { arg }) =>
    await api
      .delete(url, {
        data: {
          schedule_id: arg,
          user_id: session.user.id,
        },
      })
      .then((res) => res.data);

  const updatefetcher = async (url, { arg }) => {
    console.log(arg, memo);
    await api
      .patch(url, {
        schedule_id: arg,
        user_id: session.user.id,
        memo: memo,
      })
      .then((res) => res.data);
  };
  const updatetodofetcher = async (url, { arg }) => {
    await api
      .patch(url, {
        schedule_id: arg,
        user_id: session.user.id,
        status: !data?.status,
      })
      .then((res) => res.data);
  };

  const { trigger: deletetrigger } = useSWRMutation(`schedule`, deletefetcher);
  const { trigger: updatetrigger } = useSWRMutation(`schedule`, updatefetcher);
  const { trigger: updatetodotrigger } = useSWRMutation(
    `schedule/status`,
    updatetodofetcher
  );

  const deletePlan = async () => {
    await deletetrigger(data.schedule_id);
    datemutate();
    monthmutate();
  };
  const updateTodo = async () => {
    await updatetodotrigger(data.schedule_id);
    datemutate();
    monthmutate();
  };

  function focusEndOfDiv(elementId) {
    const element: any = document.getElementById(elementId);

    if (element) {
      element.focus();
      const length = element.textContent.length;
      console.log("1");
      if (element.setSelectionRange) {
        element.setSelectionRange(length, length);
        console.log("1");
      } else if (element.createTextRange) {
        const range = element.createTextRange();
        range.collapse(true);
        range.moveEnd("character", length);
        range.moveStart("character", length);
        range.select();
        console.log("2");
      }
    } else {
      focusInput();
    }
  }

  function focusUp() {
    focusEndOfDiv(previd);
  }
  function focusDown() {
    focusEndOfDiv(nextid);
  }

  const onSubmit = async (e: any) => {
    // console.log(e.code);

    // if (e.shiftKey && e.key === "Enter") {
    //   e.preventDefault();
    //   const div = divRef.current;
    //   const selection = window.getSelection();
    //   const range = selection.getRangeAt(0);

    //   // 줄 바꿈 노드(br)를 생성합니다.
    //   const br = document.createElement("br");

    //   // 캐럿 위치에 줄 바꿈을 삽입합니다.
    //   range.insertNode(br);

    //   // 줄 바꿈 이후로 캐럿을 이동합니다.
    //   range.setStartAfter(br);
    //   range.setEndAfter(br);

    //   // 기존 선택 영역을 제거합니다.
    //   selection.removeAllRanges();

    //   // 업데이트된 선택 영역을 추가합니다.
    //   selection.addRange(range);

    //   // input 이벤트를 수동으로 트리거합니다.
    //   div.dispatchEvent(new Event("input"));
    // }

    if (e.code === "ArrowUp") {
      // e.preventDefault();
      focusUp();
    }
    if (e.code === "ArrowDown") {
      // e.preventDefault();
      focusDown();
    }

    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault();
      console.log("memo", memo);
      memo && (await updatetrigger(data?.schedule_id));
      // setAdd(true);
      focusInput();
      datemutate();
      monthmutate();
    }
  };

  const handleInput = () => {
    if (divRef.current) {
      const newMemo = divRef.current.innerHTML;
      setMemoValue(newMemo);
      console.log(memo);
    }
  };

  useEffect(() => {
    if (!data.status) {
      divRef.current.contentEditable = true;
      // divRef.current.focus();
    }
  }, []);

  // useEffect(() => {
  //   console.log("focus");
  //   add && focusInput();
  // }, [edit]);

  // useEffect(() => {
  //   focusEndOfDiv(data?.schedule_id);
  // }, []);

  return (
    <PlanWrap
      onMouseEnter={() => {
        setIcon(true);
      }}
      onMouseLeave={() => {
        setIcon(false);
      }}
    >
      {data.status ? (
        <div className="icon">
          <FontAwesomeIcon icon={faCheck} />
        </div>
      ) : (
        <div className="dot">•</div>
      )}
      {data.status ? (
        <div className="done" spellCheck={false}>
          {data?.memo}
        </div>
      ) : (
        <div
          className="content"
          id={data.schedule_id}
          ref={divRef}
          contentEditable={true}
          onFocus={handleInput}
          onInput={handleInput}
          onKeyDown={onSubmit}
          spellCheck={false}
        >
          {data?.memo}
        </div>
      )}
      <div className="iconwrap">
        {icon && (
          <>
            <div className="icon" onClick={deletePlan}>
              <FontAwesomeIcon icon={faTrashCan} />
            </div>
            <div className="icon" onClick={updateTodo}>
              <FontAwesomeIcon icon={faCircleCheck} />
            </div>
          </>
        )}
      </div>
    </PlanWrap>
  );
};

export default Plan;

const PlanWrap = styled.div`
  display: flex;
  padding: 4px 4px;
  align-items: flex-start;
  color: ${({ color }) => color};
  font-size: 16px;
  line-height: 20px;
  border-radius: 4px;
  .icon {
    cursor: pointer;
    color: #666666;
    width: 24px;
    height: 24px;
    display: flex;
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
  }
  .iconwrap {
    display: flex;
    width: 48px;
  }
  .content {
    margin-top: 2px;
    cursor: text;
    width: 257px;
    word-break: break-all;
    flex: 1;
  }
  .done {
    margin-top: 2px;
    width: 257px;
    word-break: break-all;
    flex: 1;
    color: #666666;
    text-decoration-line: line-through;
  }
  form {
    display: flex;
    flex: 1;
  }
  input {
    flex: 1;
  }
`;
