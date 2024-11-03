import styled from "styled-components";
import { Outlet } from "react-router-dom";

import Header, { HEADER_HEIGHT } from "../Header";
import Menubar from "../Menubar";

export const Layout = () => (
  <Wrapper>
    <Header />
    <InnerWrapper>
      <Menubar />
      <Content>
        <Outlet />
      </Content>
    </InnerWrapper>
  </Wrapper>
);

export default Layout;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

const InnerWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: ${HEADER_HEIGHT};
`;

const Content = styled.div`
  width: calc(100vw - 300px);
`;
