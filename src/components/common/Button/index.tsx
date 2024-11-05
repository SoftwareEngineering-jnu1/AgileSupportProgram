import React from "react";
import styled from "styled-components";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  padding: string;
  fontSize?: string;
  bgColor?: string;
  radius?: string;
  color?: string;
}

const Button = ({
  onClick,
  title,
  bgColor = "#AEBDCA",
  padding,
  radius = "10px",
  color = "#fff",
  fontSize = "18px",
  ...rest
}: ButtonProps) => {
  return (
    <CustomButton
      onClick={onClick}
      bgColor={bgColor}
      padding={padding}
      radius={radius}
      color={color}
      fontSize={fontSize}
      {...rest}
    >
      {title}
    </CustomButton>
  );
};

export default Button;

const CustomButton = styled.button<{
  bgColor: string;
  radius: string;
  padding: string;
  color: string;
  fontSize: string;
}>`
  background-color: ${(props) => props.bgColor};
  color: ${(props) => props.color};
  border-radius: ${(props) => props.radius};
  padding: ${(props) => props.padding};
  font-size: ${(props) => props.fontSize};
  border: none;
  cursor: pointer;
  transition: opacity 0.3s ease;
  &:hover {
    opacity: 0.8;
  }
`;
