import styled from "styled-components";

interface ReviewContentBoxProps {
  category: string;
}

const ReviewContentBox = ({ category }: ReviewContentBoxProps) => {
  return (
    <Wrapper>
      <Title>{category}</Title>
      <Content></Content>
    </Wrapper>
  );
};

export default ReviewContentBox;

const Wrapper = styled.div`
  height: 300px;
  width: 200px;
`;

const Title = styled.span`
  font-weight: bold;
  font-size: 18px;
`;

const Content = styled.div`
  width: 100%;
  height: 250px;
  background-color: #ffe5e3;
  margin-top: 10px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;
