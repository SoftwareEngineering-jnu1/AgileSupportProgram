import styled from "styled-components";

import Button from "@components/common/Button";
import NonSprintPage from "@components/Board/NonSprintPage";
import { useState } from "react";
import SprintPage from "@components/Board/SprintPage";

const BoardPage = () => {
  const [hasSprint, setHasSprint] = useState<boolean>(false);
  return (
    <Wrapper>
      <TopCantainer>
        {hasSprint ? (
          <Button
            title="스프린트 시작"
            padding="5px 15px"
            style={{ fontWeight: "bold" }}
            onClick={(e) => setHasSprint(!hasSprint)}
          />
        ) : (
          <Button
            title="스프린트 만들기"
            padding="5px 15px"
            style={{ fontWeight: "bold" }}
            onClick={(e) => setHasSprint(!hasSprint)}
          />
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
