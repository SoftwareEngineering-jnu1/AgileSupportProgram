import styled from 'styled-components';
import { MdOutlineTitle } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

export const Modalepic = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;
  `;

export const ModalepicContent = styled.div`
  background: #EEEEEE;
  padding: 20px;
  border-radius: 5px;
  width: 400px; // 원하는 너비로 설정
  max-width: 90%; // 화면이 작을 때의 최대 너비
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: #f6f3ed;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  padding: 15px;
`

export const ButtonPart = styled.div`
  cursor: pointer;
`;

export const Divider = styled.div`
  margin: 0 8px;
  color: #000;
`;

export const EpicDetailContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 25%; 
  border-left: 1px solid #ccc; 
  box-sizing: border-box;
  background-color: #f8f8f8; /* 배경색 흰색 or 회색? */
}
`;

export const IssueDetailContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 25%; 
  border-left: 1px solid #ccc; 
  box-sizing: border-box;
  background-color: #f8f8f8; /* 배경색 흰색 or 회색? */
}
`;


export const Content = styled.form`
  display: flex;
  flex-direction: column;
  text-align: start;
`;

export const EditingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; /* 텍스트와 버튼 사이 간격 */
`;

export const TitleWrapper = styled.div`
  position: relative;
  width: 350px;
  margin: 5px 0 10px;
`;

export const TitleIcon = styled(MdOutlineTitle)`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #7e7e7e;
`;

export const TitleInput = styled.input`
  width: 100%;
  padding: 10px 15px 10px 35px;
  border: none;
  border-radius: 5px;
  outline: none;
  font-size: 14px;
  color: #7e7e7e;
`;

export const ButtonBox = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const DateWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0;
`;

export const DateInput = styled.input`
  flex: 1;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #fff;
  border-radius: 4px;
`;

export const AssignIcon = styled(FaUserCircle)`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #7e7e7e;
`;