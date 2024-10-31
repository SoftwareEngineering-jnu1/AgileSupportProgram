import styled from "styled-components";

import { Link } from "react-router-dom";
import { RouterPath } from "@routes/path";

import { MdViewTimeline } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { FaNoteSticky } from "react-icons/fa6";
import { IoLogoGithub } from "react-icons/io5";

const Menubar = () => {
  return (
    <Wrapper>
      <Container>
        <Link
          to={RouterPath.timelinePage}
          style={{
            textDecoration: "none",
            color: "#AEBDCA",
            fontWeight: "bold",
            textAlign: "start",
            fontSize: "40px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <MdViewTimeline />
            타임라인
          </div>
        </Link>
        <Link
          to={RouterPath.boardPage}
          style={{
            textDecoration: "none",
            color: "#AEBDCA",
            fontWeight: "bold",
            textAlign: "start",
            fontSize: "40px",
          }}
        >
          <Space>
            <hr />
          </Space>
          <div style={{ display: "flex", alignItems: "center" }}>
            <MdDashboard />
            칸반보드
          </div>
        </Link>
        <Link
          to={RouterPath.memoPage}
          style={{
            textDecoration: "none",
            color: "#AEBDCA",
            fontWeight: "bold",
            textAlign: "start",
            fontSize: "40px",
          }}
        >
          <Space>
            <hr />
          </Space>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FaNoteSticky />
            메모
          </div>
        </Link>
      </Container>
      <GitLinkWrapper>
        <GitLink onClick={() => window.open("https://github.com/")}>
          <IoLogoGithub size={50} />
          Git
        </GitLink>
      </GitLinkWrapper>
    </Wrapper>
  );
};

export default Menubar;

const Wrapper = styled.div`
  width: 300px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background-color: #f5efe6;
`;

const Container = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  padding-top: 30px;
`;

const Space = styled.div`
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
  font-size: 40px;
  &:hover {
    cursor: pointer;
  }
`;
