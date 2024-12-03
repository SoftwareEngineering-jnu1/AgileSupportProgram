import styled from "styled-components";

import Button from "@components/common/Button";
import NonSprintPage from "@components/Board/NonSprintPage";
import { useState } from "react";
import SprintPage from "@components/Board/SprintPage";
import Modal from "@components/common/Modal";

import { MdOutlineTitle } from "react-icons/md";
import ModalIssueItem from "@components/Board/ModalIssueItem";

import { useProject } from "@context/ProjectContext";

const BoardPage = () => {
  const { projectId } = useProject();
  console.log(projectId);
  const [hasSprint, setHasSprint] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleIssueSelect = (label: string) => {
    setSelectedIssue(label === selectedIssue ? null : label); // 동일한 아이템 선택 시 해제
  };

  return (
    <Wrapper>
      <TopContainer>
        {hasSprint ? null : (
          <Button
            padding="5px 15px"
            style={{ fontWeight: "bold" }}
            onClick={() => {
              setHasSprint(!hasSprint);
              toggleModal();
            }}
          >
            스프린트 만들기
          </Button>
        )}
      </TopContainer>
      <MiddleContainer>
        {hasSprint ? <SprintPage /> : <NonSprintPage />}
      </MiddleContainer>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={toggleModal}>
          <h3>새 스프린트를 생성하시겠습니까?</h3>
          <Content>
            <span>스프린트 이름</span>
            <SprintTitleWrapper>
              <SprintTitleIcon />
              <SprintTitleInput placeholder="프로젝트 이름을 입력해주세요" />
            </SprintTitleWrapper>
            <span>스프린트에 추가할 에픽 선택</span>
            <SelectIssueWrapper>
              <ModalIssueItem
                label="발표 자료 제작"
                isChecked={selectedIssue === "발표 자료 제작"}
                onCheck={() => handleIssueSelect("발표 자료 제작")}
              />
              <ModalIssueItem
                label="개발 환경 설정"
                isChecked={selectedIssue === "개발 환경 설정"}
                onCheck={() => handleIssueSelect("개발 환경 설정")}
              />
              <ModalIssueItem
                label="기능 기획"
                isChecked={selectedIssue === "기능 기획"}
                onCheck={() => handleIssueSelect("기능 기획")}
              />
            </SelectIssueWrapper>
          </Content>
          <ButtonBox>
            <Button
              padding="6px 6px"
              bgColor="#7895B2"
              fontSize="16px"
              style={{ fontWeight: "bold" }}
            >
              생성
            </Button>
          </ButtonBox>
        </Modal>
      )}
    </Wrapper>
  );
};

export default BoardPage;

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
`;

const TopContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
`;

const MiddleContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
`;

const Content = styled.form`
  display: flex;
  flex-direction: column;
  text-align: start;
`;

const SprintTitleWrapper = styled.div`
  position: relative;
  width: 350px;
  margin: 5px 0 10px;
`;

const SprintTitleIcon = styled(MdOutlineTitle)`
  position: absolute;
  top: 50%;
  left: 10px;
  transform: translateY(-50%);
  color: #7e7e7e;
`;

const SprintTitleInput = styled.input`
  width: 100%;
  padding: 10px 15px 10px 35px;
  border: none;
  border-radius: 5px;
  outline: none;
  font-size: 14px;
  color: #7e7e7e;
`;

const SelectIssueWrapper = styled.div`
  width: 350px;
  margin: 5px 0;
  padding: 0 10px;
  background-color: #fff;
  border-radius: 5px;
  max-height: 150px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: flex-end;
`;
