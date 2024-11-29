import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { IoClose } from "react-icons/io5";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  const [modalVisible, setModalVisible] = useState(isOpen);

  const closeModal = () => {
    setModalVisible(false);
    onClose();
  };

  useEffect(() => {
    setModalVisible(isOpen);
  }, [isOpen]);

  return (
    <>
      {modalVisible && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <CloseBox onClick={closeModal}>
              <IoClose />
            </CloseBox>
            {children}
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default Modal;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const ModalOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  background: #eee;
  border-radius: 10px;
  padding: 30px;
  text-align: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

const CloseBox = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;
