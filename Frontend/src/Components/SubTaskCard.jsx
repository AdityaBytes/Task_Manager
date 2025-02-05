// src/Components/SubTaskCard.jsx
import React from "react";

const SubTaskCard = ({ subTask, onToggleStatus, onEdit, onDelete }) => {
  return (
    <div
      style={{
        marginLeft: "2rem",
        border: "1px dashed #ccc",
        padding: "0.5rem",
        marginBottom: "5px",
      }}
    >
      <p>{subTask.title}</p>
      <p>Status: {subTask.status}</p>
      <button onClick={() => onToggleStatus(subTask._id)}>
        Mark as {subTask.status === "Pending" ? "Completed" : "Pending"}
      </button>
      <button onClick={() => onEdit(subTask._id)} style={{ marginLeft: "5px" }}>
        Edit
      </button>
      <button onClick={() => onDelete(subTask._id)} style={{ marginLeft: "5px" }}>
        Delete
      </button>
    </div>
  );
};

export default SubTaskCard;
