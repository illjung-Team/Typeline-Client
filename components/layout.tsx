import styled from "styled-components";
import Loginpage from "../pages/login";
import { useSession } from "next-auth/react";

const Layout = ({ children }: any) => {
  const { data: session, status }: any = useSession();

  return (
    <>
      {status === "authenticated" ? (
        <LayoutWrap>{children}</LayoutWrap>
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
