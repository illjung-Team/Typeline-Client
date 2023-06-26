import Calendarbox from "../components/calendar/calendar";
import styled from "styled-components";
import Header from "../components/header";
import Loginpage from "../components/loginpage/loginpage";
import { useSession } from "next-auth/react";

const Layout = ({ children }: any) => {
  const { data: session, status }: any = useSession();

  return (
    <>
      <Header></Header>
      {status === "authenticated" ? (
        <LayoutWrap>
          <Calendarbox></Calendarbox>
          {children}
        </LayoutWrap>
      ) : (
        <Loginpage />
      )}
    </>
  );
};

export default Layout;

const LayoutWrap = styled.div`
  display: grid;
  width: 854px;
  grid-template-columns: 480px 374px;
  grid-template-rows: 480px;
  overflow: hidden;
  /* border: 1px solid #333333; */
`;
