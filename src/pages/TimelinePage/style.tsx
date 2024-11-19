import styled from 'styled-components';

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


export const EditingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; /* 텍스트와 버튼 사이 간격 */
`;