import styled from "styled-components";

import Button from "@components/common/Button";
import NonSprintPage from "@components/Board/NonSprintPage";
import { useEffect, useState } from "react";
import SprintPage from "@components/Board/SprintPage";
import Modal from "@components/common/Modal";

import { MdOutlineTitle } from "react-icons/md";
import ModalIssueItem from "@components/Board/ModalIssueItem";
import ReviewContentBox from "@components/Board/ReviewContentBox";
import InputWithDropdown from "@components/Board/InputWithDropdown";

import { useProject } from "@context/ProjectContext";
import { fetchInstance } from "@api/instance";
import Cookies from "js-cookie";

interface DtoDataType {
  issueId: number;
  issueTitle: string;
  mainMemberNameAndColor: Record<string, string>;
  progressStatus: string;
}

interface SprintDataType {
  sprintName: string;
  sprintEndDate: string;
  projectName: string;
  kanbanboardIssueDTO: DtoDataType[];
}

const BoardPage = () => {
  const { projectId } = useProject();
  const [hasSprint, setHasSprint] = useState<boolean>(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [sprintName, setSprintName] = useState<string>("");
  const [epicList, setEpicList] = useState<string[]>([""]);
  const [epicTitle, setEpicTitle] = useState<string | null>(null);

  const [sprintData, setSprintData] = useState<SprintDataType>();

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    fetchInstance
      .get(`/project/${projectId}/kanbanboard/newsprint`)
      .then((response) => {
        setEpicList(response.data.data);
      })
      .catch((error) => {
        console.log("스프린트 생성 모달 열기:", error);
      });
  };

  const toggleReviewModal = () => {
    setIsReviewModalOpen(!isReviewModalOpen);
  };

  const handleSprintNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSprintName(e.target.value);
  };

  const handleIssueSelect = (label: string) => {
    setEpicTitle(label === epicTitle ? null : label);
  };

  const createSprint = () => {
    const payload = {
      sprintName,
      epicTitle,
    };
    fetchInstance
      .post(`/project/${projectId}/kanbanboard/newsprint`, payload)
      .then((response) => {
        Cookies.set(`project_${projectId}_epicId`, response.data.data.epicId);
        setIsModalOpen(!isModalOpen);
      })
      .catch((error) => {
        console.error("스프린트 생성 실패:", error);
      });
  };

  const fetchSprintData = async () => {
    const epicId = Cookies.get(`project_${projectId}_epicId`);
    if (epicId) {
      try {
        const response = await fetchInstance.get(
          `/project/${projectId}/kanbanboard/${epicId}`
        );
        setSprintData(response.data.data);
        setHasSprint(true);
      } catch (error) {
        console.error("스프린트 데이터 로드 실패:", error);
        setHasSprint(false);
      }
    }
  };

  useEffect(() => {
    fetchSprintData();
  }, []);

  return (
    <Wrapper>
      <TopContainer>
        {hasSprint ? (
          <Button
            padding="5px 15px"
            style={{ fontWeight: "bold" }}
            onClick={() => toggleReviewModal()}
          >
            스프린트 리뷰
          </Button>
        ) : (
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
        {hasSprint && sprintData ? (
          <SprintPage
            name={sprintData.sprintName}
            endDate={sprintData.sprintEndDate}
            data={sprintData.kanbanboardIssueDTO}
            reloadData={fetchSprintData}
          />
        ) : (
          <NonSprintPage />
        )}
      </MiddleContainer>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={toggleModal}>
          <h3>새 스프린트를 생성하시겠습니까?</h3>
          <Content>
            <span>스프린트 이름</span>
            <SprintTitleWrapper>
              <SprintTitleIcon />
              <SprintTitleInput
                placeholder="프로젝트 이름을 입력해주세요"
                onChange={handleSprintNameChange}
              />
            </SprintTitleWrapper>
            <span>스프린트에 추가할 에픽 선택</span>
            <SelectIssueWrapper>
              {epicList.map((epic) => {
                return (
                  <ModalIssueItem
                    label={epic}
                    isChecked={epicTitle === `${epic}`}
                    onCheck={() => handleIssueSelect(`${epic}`)}
                  />
                );
              })}
            </SelectIssueWrapper>
          </Content>
          <ButtonBox>
            <Button
              padding="6px 6px"
              bgColor="#7895B2"
              fontSize="16px"
              style={{ fontWeight: "bold" }}
              onClick={() => createSprint()}
            >
              생성
            </Button>
          </ButtonBox>
        </Modal>
      )}
      {isReviewModalOpen && (
        <Modal isOpen={isReviewModalOpen} onClose={toggleReviewModal}>
          <ReviewBox>
            <ReviewContentBox category="Stop" />
            <ReviewContentBox category="Start" />
            <ReviewContentBox category="Continue" />
          </ReviewBox>
          <BottomBox>
            <InputWithDropdown />
            <Button
              padding="3px 30px"
              bgColor="#AEBDCA"
              fontSize="16px"
              style={{ fontWeight: "bold" }}
            >
              스프린트 리뷰
            </Button>
          </BottomBox>
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

const ReviewBox = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const BottomBox = styled.div`
  width: 100%;
  height: 30px;
  display: flex;
  justify-content: space-between;
`;
