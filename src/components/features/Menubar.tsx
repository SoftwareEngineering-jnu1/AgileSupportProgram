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
          <div style={{ display: "flex" }}>
            <MdViewTimeline style={{ marginRight: "8px", fontSize: "1.2em" }} />
            타임라인
          </div>
        </MenuLink>
        <Space>
          <hr />
        </Space>
        <MenuLink
          to={RouterPath.boardPage}
          active={pagePath === RouterPath.boardPage}
        >
          <div style={{ display: "flex" }}>
            <MdDashboard style={{ marginRight: "8px", fontSize: "1.2em" }} />
            칸반보드
          </div>
        </MenuLink>
        <Space>
          <hr />
        </Space>
        <MenuLink
          to={RouterPath.memoPage}
          active={pagePath === RouterPath.memoPage}
        >
          <div style={{ display: "flex" }}>
            <FaNoteSticky style={{ marginRight: "8px", fontSize: "1.2em" }} />
            메모
          </div>
        </MenuLink>
      </Container>
      <GitLinkWrapper>
        <GitLink onClick={() => window.open("https://github.com/")}>
          <IoLogoGithub size={30} />
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
  align-items: center;
  color: #aebdca;
  fontweight: bold;
  font-size: 26px;
  &:hover {
    cursor: pointer;
  }
`;
