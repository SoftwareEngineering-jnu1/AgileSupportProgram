import styled from "styled-components";

import { Link, useLocation } from "react-router-dom";
import { RouterPath } from "@routes/path";

import { MdViewTimeline } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { FaNoteSticky } from "react-icons/fa6";
import { IoLogoGithub } from "react-icons/io5";

const Menubar = () => {
  const location = useLocation();
  const pagePath = location.pathname;
  return (
    <Wrapper>
      <Container>
        <MenuLink
          to={RouterPath.timelinePage}
          active={pagePath === RouterPath.timelinePage}
        >
          <MdViewTimeline style={{ marginRight: "8px", fontSize: "1.2em" }} />
          타임라인
        </MenuLink>
        <Space>
          <hr />
        </Space>
        <MenuLink
          to={RouterPath.boardPage}
          active={pagePath === RouterPath.boardPage}
        >
          <MdDashboard style={{ marginRight: "8px", fontSize: "1.2em" }} />
          칸반보드
        </MenuLink>
        <Space>
          <hr />
        </Space>
        <MenuLink
          to={RouterPath.memoPage}
          active={pagePath === RouterPath.memoPage}
        >
          <FaNoteSticky style={{ marginRight: "8px", fontSize: "1.2em" }} />
          메모
        </MenuLink>
      </Container>
      <GitLinkWrapper>
        <GitLink onClick={() => window.open("https://github.com/")}>
          <IoLogoGithub size={30} style={{ marginRight: "8px" }} />
          Git
        </GitLink>
      </GitLinkWrapper>
    </Wrapper>
  );
};

export default Menubar;

const Wrapper = styled.div`
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  // border-right: 1px solid #efefef;
  box-shadow: 4px 0 5px #efefef;
  background-color: #efefef;
`;

const Container = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  padding-top: 30px;
`;

const MenuLink = styled(Link)<{ active: boolean }>`
  text-decoration: none;
  color: ${(props) => (props.active ? "#000" : "#999")};
  font-size: 30px;
  transition: color 0.3s ease;
  display: flex; /* 추가 */
  align-items: center; /* 추가 */
  &:hover {
    color: #000;
  }
`;

const Space = styled.div`
  padding: 5px 0;
  width: 100%;
  height: 20px;
`;

const GitLinkWrapper = styled.div`
  width: 70%;
  display: flex;
  justify-content: start;
  padding-bottom: 30px;
`;

const GitLink = styled.a`
  display: flex;
  color: #aebdca;
  fontweight: bold;
  font-size: 26px;
  &:hover {
    cursor: pointer;
  }
`;
