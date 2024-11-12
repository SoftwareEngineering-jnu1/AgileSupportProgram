import { FaPlus } from "react-icons/fa6";

const AddIssue = () => {
  return (
    <div
      onClick={() => alert("Add Issue")}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        padding: "0 15px",
        marginTop: "10px",
        cursor: "pointer",
      }}
    >
      <FaPlus style={{ marginRight: "8px" }} />
      이슈 만들기
    </div>
  );
};

export default AddIssue;
