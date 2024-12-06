import styled from "styled-components";

interface ReviewContentBoxProps {
  category: string;
  comments: string[];
}
const ReviewContentBox = ({ category, comments }: ReviewContentBoxProps) => {
  return (
    <Wrapper>
      <Title>{category}</Title>
      <Content category={category}>
        {comments.map((comment) => (
          <Comment>{comment}</Comment>
        ))}
      </Content>
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

const Content = styled.div<{ category: string }>`
  width: 100%;
  padding: 10px 10px;
  text-align: start;
  height: 250px;
  background-color: ${(props) =>
    props.category === "Stop"
      ? "#ffe5e3"
      : props.category === "Start"
      ? "#C8E9FF" //"#e3eaff"
      : props.category === "Continue"
      ? "#CAF0B9" //"#e3f7e5"
      : "#ffffff"};
  margin-top: 10px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Comment = styled.div`
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1.3;
`;
