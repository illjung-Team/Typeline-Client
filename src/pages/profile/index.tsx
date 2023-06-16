import React from "react";
import Head from "next/head";
import styled from "styled-components";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { signOut } from "next-auth/react";

function Home() {
  const { data: session }: any = useSession();

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-typescript)</title>
      </Head>
      <ProfileWrap>
        <Title>계정</Title>
        <InFo>
          <InFoKey>이메일</InFoKey>
          <InFoValue>{session?.user.email}</InFoValue>
        </InFo>
        <InFo>
          <InFoKey>이름</InFoKey>
          <InFoValue>{session?.user.name}</InFoValue>
        </InFo>
        <ButtonArea>
          <AuthButton
            onClick={() => {
              signOut();
            }}
          >
            <FontAwesomeIcon icon={faArrowRight} />
            <span>로그아웃</span>
          </AuthButton>
          <AuthButton color="#EA0000">
            <FontAwesomeIcon icon={faArrowRight} />
            <span>
              <p>회원탈퇴</p>
            </span>
          </AuthButton>
        </ButtonArea>
      </ProfileWrap>
    </React.Fragment>
  );
}

const ProfileWrap = styled.div`
  display: flex;
  padding: 30px 16px;
  flex-direction: column;
`;
const Title = styled.div`
  font-weight: 600;
  font-size: 24px;
  color: #333333;
  margin-bottom: 25px;
`;
const InFo = styled.div`
  padding: 8px 4px;
  display: flex;
  flex-direction: row;
  font-weight: 600;
  font-size: 24px;
  color: #333333;
  border-bottom: 1px solid #dddddd;
`;
const InFoKey = styled.div`
  width: 80px;
  display: flex;
  font-weight: 600;
  font-size: 16px;
  color: #333333;
`;
const InFoValue = styled.div`
  margin-left: 16px;
  display: flex;
  font-weight: 400;
  font-size: 16px;
  color: #333333;
`;
const ButtonArea = styled.div`
  margin-top: auto;
  display: flex;
  flex-direction: column;
`;
const AuthButton = styled.button`
  color: ${({ color }) => color};
  padding: 4px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  transition: all 0.1s;
  &:hover {
    background-color: #dddddd;
  }
  span {
    margin-left: 4px;
  }
`;

export default Home;
