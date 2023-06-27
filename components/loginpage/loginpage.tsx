import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Loginpage = () => {
  const { status }: any = useSession();

  const handleSignup = async () => {
    await signIn("google");
  };

  return (
    <LoginpageWrap>
      {status === "loading" ? (
        <div className="loaderWrapper">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <Title>TYPELINE</Title>
          <GoogleAuth
            onClick={(e) => {
              e.preventDefault();
              handleSignup();
            }}
          >
            <Image
              src="/images/google.svg"
              width={18}
              height={18}
              alt="Picture of the author"
            ></Image>
            <span>Google로 로그인</span>
          </GoogleAuth>
        </>
      )}
    </LoginpageWrap>
  );
};

export default Loginpage;

const LoginpageWrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 854px;
  height: 480px;
  background: #ffffff;
`;

const Title = styled.span`
  font-weight: 900;
  font-size: 48px;
  margin-bottom: 80px;
`;

const GoogleAuth = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 352px;
  height: 60px;
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 8px;
  font-weight: 600;
  font-size: 18px;
  transition: all 0.1s;
  &:hover {
    background-color: #dddddd;
  }
  span {
    margin-left: 18px;
  }
`;
