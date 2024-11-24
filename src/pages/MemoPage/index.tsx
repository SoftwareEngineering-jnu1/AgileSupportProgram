import React, { useState } from 'react';
import style from './Memo.module.css';

interface ModalData {
  id: number;
  title: string;
  content: string;
}

const MemoPage: React.FC = () => {
  const [savedModals, setSaveModals] = useState<ModalData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<ModalData | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentNote(null);
    setNoteTitle('');
    setModalContent('');
  };

  const handleSaveModal = () => {
    if (currentNote) {
      setSaveModals(savedModals.map(modal => modal.id === currentNote.id ? {...modal, title: noteTitle, content: modalContent} : modal));
    }
      else {
      const newModal: ModalData = {
        id: Date.now(),
        title: noteTitle,
        content: modalContent,
      };
      setSaveModals([...savedModals, newModal]);
      setIsModalOpen(false);
      }
      handleCloseModal();
  };

  const editNote = (modal: ModalData) => {
    setCurrentNote(modal);
    setNoteTitle(modal.title);
    setModalContent(modal.content);
    handleOpenModal();
  };

  return (
    <div className={style.memopagediv}>
      <button onClick={handleOpenModal}>메모 생성</button>

      {isModalOpen && (
        <div className={style.overlay}>
          <div className={style.modaldiv}>
            <span className={style.close} onClick={handleCloseModal}>&times;</span>
            <input className={style.title}
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="제목을 입력해주세요"
            />
            <input className={style.textarea}
              value={modalContent}
              onChange={(e) => setModalContent(e.target.value)}
              placeholder="내용"
              ></input>
            <button className={style.savebutton} onClick={handleSaveModal}>Save</button>
          </div>
        </div>
      )}

      <div className={style.savemodal}>
        {savedModals.map((modal) => (
          <div key={modal.id} className={style.modalitem} onClick={() => editNote(modal)}>
            <h3>제목: {modal.title}</h3>
            <p>{modal.content}</p>
          </div>
        )
      )}
      </div>
    </div>
  );
};

export default MemoPage;
