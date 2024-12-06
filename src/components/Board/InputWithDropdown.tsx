//import { fetchInstance } from "@api/instance";
import { useState } from "react";
import styled from "styled-components";

interface InputWithDropdownProps {
  onSubmit: (category: string, comment: string) => void;
}

const InputWithDropdown = ({ onSubmit }: InputWithDropdownProps) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Stop");
  const [inputValue, setInputValue] = useState("");

  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setDropdownVisible(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      onSubmit(selectedOption, inputValue.trim());
      setInputValue(""); // 입력 필드 초기화
    }
  };

  return (
    <Wrapper>
      <Input
        type="text"
        placeholder="의견 추가.."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <DropdownWrapper onClick={toggleDropdown}>
        <DropdownButton isVisible={isDropdownVisible}>
          {selectedOption}
        </DropdownButton>
        <DropdownMenu isVisible={isDropdownVisible}>
          {["Stop", "Start", "Continue"].map((option) => (
            <DropdownItem key={option} onClick={() => handleSelect(option)}>
              {option}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </DropdownWrapper>
    </Wrapper>
  );
};

export default InputWithDropdown;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  border: 1px solid #ccc;
  border-radius: 20px;
  padding: 5px;
  background-color: #f9f9f9;
  width: 350px;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: 16px;
  background-color: transparent;
  padding: 5px;
`;

const DropdownWrapper = styled.div`
  position: relative;
  cursor: pointer;
`;

const DropdownButton = styled.button<{ isVisible: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  font-size: 16px;
  display: flex;
  align-items: center;

  &:after {
    content: "▼";
    font-size: 12px;
    margin-left: 5px;
    transform: ${(props) =>
      props.isVisible ? "rotate(180deg)" : "rotate(0deg)"};
    transition: transform 0.3s ease; /* 부드러운 회전 애니메이션 */
  }

  &:hover {
    opacity: 0.8;
  }
`;

const DropdownMenu = styled.ul<{ isVisible: boolean }>`
  display: ${(props) => (props.isVisible ? "block" : "none")};
  position: absolute;
  top: 100%;
  left: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
  width: 160px;
`;

const DropdownItem = styled.li`
  padding: 10px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;
