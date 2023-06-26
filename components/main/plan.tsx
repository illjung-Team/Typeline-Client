import React from "react";
import styled from "styled-components";
import { faTrashCan, faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useRef, useEffect } from "react";
import usedivInput from "../../hooks/usedivInput";
import useSWRMutation from "swr/mutation";
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
  focusEndOfDiv,
  i,
}: any) => {
  const { data: session }: any = useSession();
  const { selectedDay, getdayparams } = useDayStore();
  const [icon, setIcon] = useState(false);

  const divRef: any = useRef(null);

  const {
    value: memo,
    setdivValue: setMemoValue,
    reset: resetContent,
  } = usedivInput(data?.memo);

  const [cursor, setCursor] = useState(memo.split("\n").length);

  const deletefetcher = async (url: any, { arg }: any) =>
    await api
      .delete(url, {
        data: {
          schedule_id: arg,
          user_id: session.user.id,
        },
      })
      .then((res) => res.data);

  const updatefetcher = async (url: any, { arg }: any) => {
    console.log(arg, memo);
    await api
      .patch(url, {
        schedule_id: arg,
        user_id: session.user.id,
        memo: memo,
      })
      .then((res) => res.data);
  };
  const updatetodofetcher = async (url: any, { arg }: any) => {
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

  const onSubmit = async (e: any) => {
    console.log("cursor", cursor);
    if (
      e.code === "Backspace" &&
      (divRef.current.innerHTML === "" || divRef.current.innerHTML === "<br>")
    ) {
      e.preventDefault();
      await deletePlan();
      focusEndOfDiv(previd);
    }
    if (e.code === "ArrowUp") {
      if (cursor === 1) {
        e.preventDefault();
        focusEndOfDiv(previd);
      } else {
        setCursor((i) => i - 1);
      }
    }
    if (e.code === "ArrowDown") {
      if (cursor === memo.split("\n").length) {
        e.preventDefault();
        focusEndOfDiv(nextid);
      } else {
        setCursor((i) => i + 1);
      }
    }

    if (e.code === "Enter" && !e.shiftKey) {
      e.preventDefault();
      memo && (await updatetrigger(data?.schedule_id));
      focusInput();
      datemutate();
      monthmutate();
    }
  };

  const handleInput = (e: any) => {
    if (divRef.current) {
      const newMemo = divRef.current.innerHTML;
      setMemoValue(newMemo);
      setCursor(newMemo.split("\n").length);
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
          {data?.memo.split("<br>").join("\n")}
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
    white-space: pre-wrap;
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
