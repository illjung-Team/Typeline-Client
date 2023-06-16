import React from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useDayStore } from "../../store/login";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useSWR from "swr";
import axios from "axios";

const Calendarbox: any = () => {
  const fetcher = (url, params) =>
    axios.get(url, { params }).then((res) => {
      return res.data;
    });

  const {
    data: monthData,
    error: monthDataError,
    isLoading: monthDataIsLoading,
  } = useSWR(`http://localhost:3001/api/schedule/month`, (url) =>
    fetcher(url, {
      yyyy: String(selectedDay.getFullYear()),
      mm: String(selectedDay.getMonth()),
    })
  );

  // console.log(monthData);

  const { data: session }: any = useSession();
  const { selectedDay, dayChange } = useDayStore();
  const router = useRouter();

  const formatShortWeekday = (locale, date) => {
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    return weekdays[date.getDay()];
  };

  const formatDay: any = (locale, date) => {
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
    if (date.getDay() === 6 || date.getDay() === 0) {
      return (
        <Weekendtile className="weekend">
          {date.getDate() === 1
            ? `${date.getMonth() + 1}월 ${date.getDate()}일`
            : `${date.getDate()}`}
        </Weekendtile>
      );
    }
    return date.getDate() === 1
      ? `${date.getMonth() + 1}월 ${date.getDate()}일`
      : `${date.getDate()}`;
  };

  const tileContent = ({ date, view }) => {
    return <Planlist>• 일정텍스트</Planlist>;
  };

  const onClickDay = (date: Date) => {
    dayChange(date);
    router.push("/");
  };
  const goToday: any = (date: Date) => {
    dayChange(new Date());
  };

  return (
    <CalendarWrap>
      <Calendar
        value={selectedDay}
        formatShortWeekday={formatShortWeekday}
        formatDay={formatDay}
        showFixedNumberOfWeeks={true}
        tileContent={tileContent}
        onClickDay={onClickDay}
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
  border-bottom: 1px solid #dddddd;
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
    border-width: 0px 1px 1px 0px;
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
  /* .react-calendar__navigation__label {
    width: 180px;
  } */
  .react-calendar__navigation {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
    width: 270px;
    margin-left: 32px;
  }
  .react-calendar__navigation__arrow {
    cursor: pointer;
    font-size: 28px;
  }
  .react-calendar {
    display: flex;
    flex-direction: column;
    padding-top: 24px;
  }
  .react-calendar__viewContainer {
    margin-top: auto;
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
`;

const Todaytile = styled.div`
  display: flex;
  padding: 0 4px;
  justify-content: center;
  align-items: center;
  color: white;
  height: 23px;
  background: #666666;
  border-radius: 4px;
`;
const Weekendtile = styled.div`
  color: #ea0000;
  -webkit-app-region: drag;
`;

const Planlist = styled.div`
  margin-top: auto;
  height: 32px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #666666;
  font-size: 10px;
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
