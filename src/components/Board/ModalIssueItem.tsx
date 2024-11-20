import styled from "styled-components";

interface ModalIssueItemProps {
  isChecked: boolean;
  onCheck: () => void;
  label: string;
}

const ModalIssueItem = ({ isChecked, onCheck, label }: ModalIssueItemProps) => {
  return (
    <Wrapper>
      <Checkbox
        type="checkbox"
        checked={isChecked}
        onChange={onCheck}
        id={`epicCheckbox-${label}`}
      />
      <Label htmlFor={`epicCheckbox-${label}`} isChecked={isChecked}>
        {label}
      </Label>
    </Wrapper>
  );
};

export default ModalIssueItem;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  margin-right: 10px;
  cursor: pointer;
  appearance: none;
  border: 1.5px solid #777;
  border-radius: 3px;
  outline: none;
  position: relative;
  transition: all 0.3s;

  &:checked {
    background-color: #7895b2;
    border-color: #7895b2;
  }

  &:checked::after {
    content: "✔";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    color: white;
  }
`;

const Label = styled.label<{ isChecked: boolean }>`
  font-size: 16px;
  color: ${(props) => (props.isChecked ? "#7895B2" : "#777")};
  //   text-decoration: ${(props) =>
    props.isChecked ? "line-through" : "none"};
  cursor: pointer;
`;
