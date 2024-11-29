import { useState } from "react";
import styled from "styled-components";

const InputWithDropdown = () => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Select");
  const [inputValue, setInputValue] = useState("");

  const toggleDropdown = () => setDropdownVisible(!isDropdownVisible);

  const handleSelect = (option: string) => {
    setSelectedOption(option);
    setDropdownVisible(false);
  };

  return (
    <Wrapper>
      <Input
        type="text"
        placeholder="의견 추가.."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <DropdownWrapper>
        <DropdownButton onClick={toggleDropdown}>
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
`;

const DropdownButton = styled.button`
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
