import React, { useState } from 'react';
import style from './Memo.module.css';

interface ModalData {
  id: number;
  content: string;
}

const MemoPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [savedModals, setSaveModals] = useState<ModalData[]>([]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setModalContent('');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveModal = () => {
    if (modalContent.trim()) {
      const newModal: ModalData = {
        id: Date.now(),
        content: modalContent,
      };
      setSaveModals([...savedModals, newModal]);
      setIsModalOpen(false);
    }
  };

  return (
    <div className={style.memopagediv}>
      <button onClick={handleOpenModal}>메모 생성</button>

      {isModalOpen && (
        <div className={style.overlay}>
          <div className={style.modaldiv}>
            <span className={style.close} onClick={handleCloseModal}>&times;</span>
            <textarea className={style.textarea}
              value={modalContent}
              onChange={(e) => setModalContent(e.target.value)}
              placeholder="내용"
              ></textarea>
            <button onClick={handleSaveModal}>Save</button>
          </div>
        </div>
      )}

      <div className={style.savemodal}>
        {savedModals.map((modal) => (
          <div key={modal.id} className={style.modalitem}>
            <h3>제목</h3>
            <p>{modal.content}</p>
          </div>
        )
      )}
      </div>
    </div>
  );
};

export default MemoPage;
