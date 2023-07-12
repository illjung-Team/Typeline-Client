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
import { mutate } from "swr";

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

  const deletefetcher = async (arg: any) =>
    await api
      .delete(`schedule`, {
        data: {
          schedule_id: data.schedule_id,
          user_id: session.user.id,
        },
      })
      .then((res) => res.data);

  const updatefetcher = async (arg: any) =>
    await api
      .patch(`schedule`, {
        schedule_id: arg,
        user_id: session.user.id,
        memo: memo,
      })
      .then((res) => res.data);

  const updatetodofetcher = async (url: any, { arg }: any) => {
    await api
      .patch(`schedule/status`, {
        schedule_id: arg,
        user_id: session.user.id,
        status: !data?.status,
      })
      .then((res) => res.data);
  };

  const { trigger: updatetodotrigger } = useSWRMutation(
    `day`,
    updatetodofetcher
  );

  const updateTodo = async () => {
    await updatetodotrigger(data.schedule_id);
    // datemutate();
    monthmutate();
  };

  const deletePlan = async () => {
    datemutate(async (beforedata: any) => {
      const deletedPlans = beforedata.filter(
        (e: any) => e.schedule_id !== data.schedule_id
      );
      return deletedPlans;
    }, false);
    mutate(
      "month",
      async (beforedata: any) => {
        const deletedPlans = beforedata.filter(
          (e: any) => e.schedule_id !== data.schedule_id
        );
        return deletedPlans;
      },
      false
    );
    // monthmutate({
    //   optimisticData: (beforedata: any) => {
    //     const deletedPlans = beforedata.filter(
    //       (e: any) => e.schedule_id !== data.schedule_id
    //     );
    //     return deletedPlans;
    //   },
    //   revalidate: false,
    // }); // 작동 안함.
    try {
      await deletefetcher(data.schedule_id);
      datemutate();
      monthmutate();
    } catch (error) {
      console.error("plan 삭제 실패:", error);
      datemutate();
      monthmutate();
    }
  };

  const updatePlan = async () => {
    datemutate(async (beforedata: any) => {
      const updatedPlans = beforedata.map((e: any) => {
        if (e.schedule_id === data.schedule_id) {
          return {
            schedule_id: e.schedule_id,
            ...getdayparams(),
            user_id: session.user.id,
            memo: memo,
            status: false,
          };
        }
        return e;
      });
      return updatedPlans;
    }, false);
    mutate(
      "month",
      async (beforedata: any) => {
        const updatedPlans = beforedata.map((e: any) => {
          if (e.schedule_id === data.schedule_id) {
            return {
              schedule_id: e.schedule_id,
              ...getdayparams(),
              user_id: session.user.id,
              memo: memo,
              status: false,
            };
          }
          return e;
        });
        return updatedPlans;
      },
      false
    );
    try {
      await updatefetcher(data.schedule_id);
      datemutate();
      mutate("month");
    } catch (error) {
      console.error("plan 삭제 실패:", error);
      datemutate();
      mutate("month");
    }
  };

  const onSubmit = async (e: any) => {
    console.log("cursor", cursor);
    if (
      e.code === "Backspace" &&
      (divRef.current.innerHTML === "" || divRef.current.innerHTML === "<br>")
    ) {
      e.preventDefault();
      deletePlan();
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
      memo && updatePlan();
      focusInput();
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

  return (
    <PlanWrap
      onMouseEnter={() => {
        setIcon(true);
      }}
      onMouseLeave={() => {
        setIcon(false);
      }}
    >
      {data?.status ? (
        <div className="icon">
          <FontAwesomeIcon icon={faCheck} />
        </div>
      ) : (
        <div className="dot">•</div>
      )}
      {data?.status ? (
        <div className="done" spellCheck={false}>
          {data?.memo.split("<br>").join("\n")}{" "}
        </div>
      ) : (
        <div
          className="content"
          id={data?.schedule_id}
          ref={divRef}
          suppressContentEditableWarning
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
