import React, { useState, useEffect } from "react";
import style from "./Memo.module.css";
import { IoIosAdd } from "react-icons/io";
import { BsSortDown } from "react-icons/bs";
import { IoIosArrowRoundUp } from "react-icons/io";
import { IoIosArrowRoundDown } from "react-icons/io";
import { PiNoteLight } from "react-icons/pi";

import { useProject } from "@context/ProjectContext";
import { fetchInstance } from "@api/instance";
import Modal from "@components/common/Modal";

interface ModalData {
  title: string;
  content: string;
  editDate: string;
  id: number;
  createDate: string;
}

const MemoPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentNote, setCurrentNote] = useState<ModalData | null>(null);
  const [noteTitle, setNoteTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [sortedNewst, setsortedNewst] = useState(true);

  const [memoContent, setMemoContent] = useState<ModalData[]>([]);
  const [reload, setReload] = useState(false);
  const { projectId, projectName } = useProject();

  useEffect(() => {
    fetchInstance
      .get(`project/${projectId}/memo`)
      .then((response) => {
        setMemoContent([...response.data.data[projectName!]].reverse());
      })
      .catch((err) => console.error("에러 발생:", err));
  }, [projectId, projectName, reload]);

  const triggerReload = () => {
    setReload((prev) => !prev); // reload 값을 토글하여 useEffect 실행
  };

  const handleSort = () => {
    const reversedContent = [...memoContent].reverse();
    setMemoContent(reversedContent); // 데이터를 reverse
    setsortedNewst(!sortedNewst); // 정렬 상태 변경
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentNote(null);
    setNoteTitle("");
    setModalContent("");
  };

  const editNote = async (memo: ModalData) => {
    try {
      const response = await fetchInstance.get(
        `project/${projectId}/memo/${memo.id}`
      );
      const data = response.data;

      setCurrentNote(memo);
      setNoteTitle(data.data.title || ""); // title이 없으면 빈 문자열
      setModalContent(data.data.content || ""); // content가 없으면 빈 문자열
      handleOpenModal();
    } catch (error) {
      console.error("메모 데이터를 가져오는 중 에러 발생:", error);
    }
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (projectId) {
        if (currentNote) {
          const updatedMemo = {
            title: noteTitle,
            content: modalContent,
          };

          await fetchInstance.post(
            `project/${projectId}/memo/${currentNote.id}`,
            updatedMemo
          );
        } else {
          const newMemo = {
            title: noteTitle,
            content: modalContent,
          };

          await fetchInstance.post(
            `project/${projectId}/memo/newmemo`,
            newMemo
          );
        }

        triggerReload();
        handleCloseModal();
      }
    } catch (error) {
      console.error("메모 저장 실패", error);
    }
  };

  return (
    <div className={style.memopagediv}>
      <div className={style.backgrounddiv}>
        {memoContent.length === 0 ? (
          <p className={style.pp}>
            {" "}
            <PiNoteLight className={style.memopagebackicon} /> <br />{" "}
            <span className={style.span}>생성된 메모가 없습니다</span>
            <br /> 메모를 생성해 데일리 스크럼을 기록하거나 간단한 메모를
            해보세요!
          </p>
        ) : (
          <div className={style.savemodal}>
            {memoContent.map((memo) => (
              <div
                key={memo.id}
                className={style.modalitem}
                onClick={() => editNote(memo)}
              >
                <h3>생성날짜: {memo.createDate}</h3>
                <h3>제목: {memo.title}</h3>
                <p className={style.memocontent}>{memo.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className={style.memoadd} onClick={handleOpenModal}>
        <IoIosAdd className={style.addicon} />
      </button>
      <div className={style.sortdiv}>
        <BsSortDown className={style.memosorticon} />
        <p> 만든 날짜 순</p>
        <p className={style.p2}>|</p>
        <p className={style.memosort} onClick={handleSort}>
          {sortedNewst ? (
            <IoIosArrowRoundDown className={style.sorticon} />
          ) : (
            <IoIosArrowRoundUp className={style.sorticon} />
          )}
        </p>
      </div>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <form onSubmit={handleSaveModal}>
            <input
              className={style.title}
              type="text"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="제목"
            />
            <textarea
              className={style.textarea}
              value={modalContent}
              onChange={(e) => setModalContent(e.target.value)}
              placeholder="내용"
            ></textarea>
            <button type="submit" className={style.savebutton}>
              저장
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default MemoPage;
