import React from "react";
import styled from "styled-components";
import { faTrashCan, faCircleCheck } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useDataStore } from "../../store/userdata";
import useInput from "../../hooks/useInput";

const Plan: any = ({ data }) => {
  const [icon, setIcon] = useState(false);
  const [edit, setEdit] = useState(false);
  const { deleteData } = useDataStore();

  const {
    value: content,
    setinputValue: setContentValue,
    reset: resetContent,
  } = useInput(data.content);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <PlanWrap
      onMouseEnter={() => {
        setIcon(true);
      }}
      onMouseLeave={() => {
        setIcon(false);
      }}
    >
      <div className="dot">•</div>
      {edit ? (
        <form onSubmit={onSubmit}>
          <input
            id="input"
            className="contents"
            type="text"
            value={content}
            onChange={setContentValue}
          />
        </form>
      ) : (
        <div
          className="content"
          onClick={() => {
            setEdit(true);
          }}
        >
          {data.content}
        </div>
      )}

      <div className="iconwrap">
        {icon && (
          <>
            <div
              className="icon"
              onClick={() => {
                deleteData(data.id);
              }}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </div>
            <div className="icon">
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
  flex-direction: row;
  color: ${({ color }) => color};
  align-items: center;
  font-size: 16px;
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
    cursor: text;
    flex: 1;
  }
  form {
    display: flex;
    flex: 1;
  }
  input {
    flex: 1;
  }
`;
