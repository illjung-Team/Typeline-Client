import React, { useState } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDayStore } from "../../store/currentday";
import { useMonthStore } from "../../store/currentmonth";
import useSWR from "swr";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleLeft,
  faSortDown,
} from "@fortawesome/free-solid-svg-icons";
import api from "../../axios";
import { mutate } from "swr";

const Calendarbox: any = () => {
  const { data: session }: any = useSession();
  const { selectedDay, dayChange } = useDayStore();
  const { monthChange, getmonthparams } = useMonthStore();
  const [view, setView] = useState("month");
  const router = useRouter();

  function focusInput() {
    let inputElement = document.getElementById("input");
    inputElement?.focus();
  }
  const getmonthfetcher = () =>
    api
      .get(`schedule/month`, {
        params: { ...getmonthparams(), userId: session.user.id },
      })
      .then((res) => res.data)
      .catch((error) => error.response.status === 404 && []);

  const {
    data: monthData,
    error: monthDataError,
    isLoading: monthDataIsLoading,
    mutate: monthmutate,
  } = useSWR(`month`, getmonthfetcher);

  const onActiveStartDateChange = (data: any) => {
    monthChange(data.activeStartDate);
    monthmutate();
  };

  const onViewChange = (data: any) => {
    setView(data.view);
  };

  const navigationLabel = ({ date, label, locale, view }: any) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    switch (view) {
      case "month":
        return (
          <Label>
            {`${year}년 ${month + 1}월`}
            <Drop icon={faSortDown}></Drop>
          </Label>
        );
      case "year":
        return (
          <Label>
            {`${year}년`}
            <Drop icon={faSortDown}></Drop>
          </Label>
        );
      case "decade":
        return (
          <Label>
            {`${Math.floor(year / 10) * 10}년대`}
            <Drop icon={faSortDown}></Drop>
          </Label>
        );
      case "century":
        return <Label>{`${Math.floor(year / 100) + 1}세기`}</Label>;
    }
  };

  const formatShortWeekday = (locale: any, date: any) => {
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    // if (date.getDay() === 0) {
    //   return <div></div>;
    // }
    return weekdays[date.getDay()];
  };

  const formatDay: any = (locale: any, date: any) => {
    if (
      date.getFullYear() === new Date().getFullYear() &&
      date.getDate() === new Date().getDate() &&
      date.getMonth() === new Date().getMonth()
    ) {
      return (
        <Todaytile className="highlight">
          {date.getDate() === 1
            ? `${date.getMonth() + 1}월 ${date.getDate()}일`
            : `${date.getDate()}`}
        </Todaytile>
      );
    }
    if (date.getDay() === 0) {
      return (
        <Weekendtile className="weekend">
          {date.getDate() === 1
            ? `${date.getMonth() + 1}월 ${date.getDate()}일`
            : `${date.getDate()}`}
        </Weekendtile>
      );
    }
    return (
      <Weekdaytile>
        {date.getDate() === 1
          ? `${date.getMonth() + 1}월 ${date.getDate()}일`
          : `${date.getDate()}`}
      </Weekdaytile>
    );
  };

  const tileContent: any = ({ date, view }: any) => {
    const tileinfo = () => {
      return {
        yyyy: String(date.getFullYear()),
        mm: String(date.getMonth() + 1),
        dd: String(date.getDate()),
      };
    };
    const List = monthData?.map((e: any) => {
      if (
        tileinfo().yyyy == e.yyyy &&
        tileinfo().mm == e.mm &&
        tileinfo().dd == e.dd
      ) {
        return (
          <Planlist>
            <p>•</p>
            {e.status ? (
              <span className="isdone">{e.memo}</span>
            ) : (
              <span>{e.memo}</span>
            )}
          </Planlist>
        );
      }
    });
    if (view === "month") {
      return (
        <PlanlistWrap>
          <div>{List}</div>
        </PlanlistWrap>
      );
    }
  };

  const onClickDay = (date: Date) => {
    dayChange(date);
    mutate("day");
    focusInput();
    router.push("/");
  };

  const goToday: any = (date: Date) => {
    dayChange(new Date());
    mutate("day");
    router.push("/");
  };

  return (
    <CalendarWrap>
      <Calendar
        formatShortWeekday={formatShortWeekday}
        defaultValue={selectedDay}
        // activeStartDate={new Date()}
        navigationLabel={navigationLabel}
        formatDay={formatDay}
        // formatMonthYear={formatMonthYear}
        // formatLongDate={formatLongDate}
        showFixedNumberOfWeeks={true}
        tileContent={tileContent}
        onClickDay={onClickDay}
        onActiveStartDateChange={onActiveStartDateChange}
        nextLabel={<Next icon={faAngleRight} />}
        prevLabel={<Prev icon={faAngleLeft} />}
        onViewChange={onViewChange}
        calendarType={"US"}
      ></Calendar>
      <Gotodaybutton onClick={goToday}>오늘</Gotodaybutton>
      <UserImg
        src={session?.user.image}
        onClick={() => {
          router.push("/profile");
        }}
      ></UserImg>
    </CalendarWrap>
  );
};

export default Calendarbox;

const CalendarWrap = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  background: #f8f8f8;
  box-sizing: border-box;
  border-right: 1px solid #bbbbbb;
  .react-calendar__navigation__next2-button {
    display: none;
  }
  .react-calendar__navigation__prev2-button {
    display: none;
  }
  .react-calendar__tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: black;
    font-weight: 600;
    font-size: 16px;
    background: white;
    width: 60px;
    height: 60px;
    border-width: 0px 0px 1px 1px;
    border-style: solid;
    border-color: #dddddd;
    background: #f8f8f8;
    padding: 2px 4px;
    transition: all 0.1s;
    &:hover {
      background-color: #dddddd;
    }
  }
  .react-calendar__month-view__weekdays {
    border-bottom: 2px solid #dddddd;
  }
  .react-calendar__year-view {
    border-top: 2px solid #dddddd;
  }
  .react-calendar__decade-view__years {
    border-top: 2px solid #dddddd;
  }
  .react-calendar__century-view__decades {
    border-top: 2px solid #dddddd;
  }
  .react-calendar__month-view__weekdays__weekday {
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    height: 28px;
    background: #f8f8f8;
    abbr {
      color: #888888;
      font-size: 16px;
      font-weight: 600;
      text-decoration: none;
    }
  }
  .react-calendar__navigation__label__labelText {
    cursor: pointer;
    font-weight: 600;
    font-size: 32px;
  }
  .react-calendar__navigation {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    width: 316px;
    margin-left: 12px;
  }
  .react-calendar__navigation__next-button {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    width: 45px;
    height: 45px;
    border-radius: 4px;
    &:hover {
      background-color: #dddddd;
    }
  }
  .react-calendar__navigation__prev-button {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 28px;
    width: 45px;
    height: 45px;
    border-radius: 4px;
    &:hover {
      background-color: #dddddd;
    }
  }
  .react-calendar {
    display: flex;
    flex-direction: column;
    padding-top: 24px;
  }
  .react-calendar__viewContainer {
    /* position: absolute;
    bottom: 0; */
    margin-top: auto;
  }
  .react-calendar__month-view {
    /* margin-top: auto; */
  }
  .react-calendar__month-view__days__day--neighboringMonth {
    color: #bbbbbb;
    .weekend {
      color: #eeaa90;
    }
    div {
      color: #bbbbbb;
    }
  }
  .react-calendar__year-view__months {
    /* height: 390px; */
  }
  .react-calendar__year-view__months__month {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 97px;
    font-size: 24px;
  }
  .react-calendar__decade-view__years__year {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 97px;
    font-size: 24px;
  }
  .react-calendar__century-view__decades__decade {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 97px;
    font-size: 24px;
  }
  .react-calendar__decade-view__years {
    background-color: #dddddd;
  }
  .react-calendar__century-view__decades {
    background-color: #dddddd;
  }
  .react-calendar__year-view__months {
  }
`;

const Todaytile = styled.div`
  display: flex;
  padding: 2px 4px;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: 4px;
  background: #666666;
`;
const Weekendtile = styled.div`
  color: #ea0000;
  padding: 2px 4px;
`;
const Label = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Weekdaytile = styled.div`
  padding: 2px 4px;
`;
const Next = styled(FontAwesomeIcon)``;
const Prev = styled(FontAwesomeIcon)``;
const Drop = styled(FontAwesomeIcon)`
  margin-left: 8px;
  margin-bottom: 12px;
  font-size: 20px;
`;

const PlanlistWrap = styled.div`
  height: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  color: #443b3b;
  font-size: 10px;
  overflow: hidden;
  white-space: nowrap;
  div {
    flex: 1;
  }
`;
const Planlist = styled.div`
  height: 15px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-left: 4px;
  color: #666666;
  font-size: 10px;
  span {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 60px;
  }
  p {
    font-size: 16px;
    margin-bottom: 2px;
  }
  .isdone {
    color: #666666;
    text-decoration-line: line-through;
  }
`;

const Sunday = styled.div`
  color: #ea0000;
`;

const Gotodaybutton = styled.button`
  position: absolute;
  top: 27px;
  right: 80px;
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
  transition: all 0.1s;
  &:hover {
    background-color: #dddddd;
  }
`;
const UserImg = styled.img`
  cursor: pointer;
  position: absolute;
  top: 27px;
  right: 24px;
  width: 43px;
  height: 43px;
  border-radius: 50%;
  background: #ffffff;
`;
