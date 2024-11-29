import styled from "styled-components";

import Button from "@components/common/Button";
import NonSprintPage from "@components/Board/NonSprintPage";
import { useState } from "react";
import SprintPage from "@components/Board/SprintPage";
import Modal from "@components/common/Modal";

import { MdOutlineTitle } from "react-icons/md";
import ModalIssueItem from "@components/Board/ModalIssueItem";

const BoardPage = () => {
  const [hasSprint, setHasSprint] = useState<boolean>(false);
  return (
    <Wrapper>
      <TopCantainer>
        {hasSprint ? (
          <Button
            padding="5px 15px"
            style={{ fontWeight: "bold" }}
            onClick={(e) => setHasSprint(!hasSprint)}
          >
            스프린트 시작
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
      </TopCantainer>
      <MiddleCantainer>
        {hasSprint ? <SprintPage /> : <NonSprintPage />}
      </MiddleCantainer>
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

const TopCantainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
`;

const MiddleCantainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  padding: 20px 0;
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
