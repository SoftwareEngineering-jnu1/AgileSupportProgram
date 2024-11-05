import styled from "styled-components";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { RouterPath } from "@routes/path";

export const HEADER_HEIGHT = "100px";
const Header = () => {
  return (
    <HeaderCantainer>
      <Link to={RouterPath.projectList}>
        <Logo src="/로고.png"></Logo>
      </Link>
      <ProjectTitle>프로젝트 이름</ProjectTitle>
      <Link to={RouterPath.myPage} style={{ color: "#000" }}>
        <FaUserCircle size={40} />
      </Link>
    </HeaderCantainer>
  );
};

export default Header;

const HeaderCantainer = styled.div`
  width: 100%;
  height: ${HEADER_HEIGHT};
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #7e7e7e;
  padding: 0 25px;
  position: fixed;
  background-color: #fff;
  z-index: 1000;
`;

const Logo = styled.img`
  width: 70px;
  height: 60px;
`;

const ProjectTitle = styled.span`
  font-size: 30px;
  font-family: "NanumSquareEB", sans-serif;
  font-weight: bold;
`;
