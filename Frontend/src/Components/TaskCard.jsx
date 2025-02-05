// src/Components/TaskCard.jsx
import React, { useState } from "react";
import SubTaskCard from "./SubTaskCard";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../redux/taskSlice";

const TaskCard = ({ task }) => {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  // Format dueDate (assuming task.dueDate is an ISO string)
  const [editDueDate, setEditDueDate] = useState(task.dueDate.slice(0, 10));
  const [subTaskTitle, setSubTaskTitle] = useState("");
  const [subTaskError, setSubTaskError] = useState("");
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);

  // Update task handler
  const handleUpdate = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const updatedTask = {
        title: editTitle,
        description: editDescription,
        dueDate: editDueDate,
      };
      const response = await axios.put(
        `http://localhost:5000/api/tasks/${task._id}`,
        updatedTask,
        config
      );
      if (response.status === 200) {
        alert("Task updated successfully");
        setEditing(false);
        dispatch(fetchTasks());
      }
    } catch (error) {
      console.error("Update task error:", error);
      alert("Failed to update task.");
    }
  };

  // Delete task handler
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.delete(
          `http://localhost:5000/api/tasks/${task._id}`,
          config
        );
        if (response.status === 200) {
          alert("Task deleted successfully");
          dispatch(fetchTasks());
        }
      } catch (error) {
        console.error("Delete task error:", error);
        alert("Failed to delete task.");
      }
    }
  };

  // Add sub-task handler
  const handleAddSubTask = async () => {
    if (!subTaskTitle) {
      setSubTaskError("Subtask title is required");
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.post(
        "http://localhost:5000/api/subtasks",
        { taskId: task._id, title: subTaskTitle },
        config
      );
      if (response.status === 201) {
        alert("Subtask added successfully");
        setSubTaskTitle("");
        dispatch(fetchTasks());
      }
    } catch (error) {
      console.error("Add subtask error:", error);
      alert("Failed to add subtask.");
    }
  };

  // Handlers for subtask actions passed down to SubTaskCard

  const handleToggleSubTaskStatus = async (subTaskId) => {
    try {
      // Find the subtask from the task's subTasks list to get its current status
      const subTask = task.subTasks.find((st) => st._id === subTaskId);
      const newStatus = subTask.status === "Pending" ? "Completed" : "Pending";
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.put(
        `http://localhost:5000/api/subtasks/${subTaskId}/status`,
        { status: newStatus },
        config
      );
      if (response.status === 200) {
        alert("Subtask status updated");
        dispatch(fetchTasks());
      }
    } catch (error) {
      console.error("Toggle subtask status error:", error);
      alert("Failed to update subtask status");
    }
  };

  const handleEditSubTask = async (subTaskId) => {
    const subTask = task.subTasks.find((st) => st._id === subTaskId);
    const newTitle = prompt("Enter new title for subtask:", subTask.title);
    if (newTitle && newTitle.trim() !== "") {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.put(
          `http://localhost:5000/api/subtasks/${subTaskId}`,
          { title: newTitle },
          config
        );
        if (response.status === 200) {
          alert("Subtask updated");
          dispatch(fetchTasks());
        }
      } catch (error) {
        console.error("Update subtask error:", error);
        alert("Failed to update subtask");
      }
    }
  };

  const handleDeleteSubTask = async (subTaskId) => {
    if (window.confirm("Are you sure you want to delete this subtask?")) {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.delete(
          `http://localhost:5000/api/subtasks/${subTaskId}`,
          config
        );
        if (response.status === 200) {
          alert("Subtask deleted");
          dispatch(fetchTasks());
        }
      } catch (error) {
        console.error("Delete subtask error:", error);
        alert("Failed to delete subtask");
      }
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "5px",
      }}
    >
      {editing ? (
        <div>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description"
          />
          <input
            type="date"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
          />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
          <button onClick={() => setEditing(true)}>Update</button>
          <button onClick={handleDelete} style={{ marginLeft: "5px" }}>
            Delete
          </button>
        </div>
      )}

      <div style={{ marginTop: "10px" }}>
        <h3>Subtasks</h3>
        {task.subTasks && task.subTasks.length > 0 ? (
          task.subTasks.map((subTask) => (
            <SubTaskCard
              key={subTask._id}
              subTask={subTask}
              onToggleStatus={handleToggleSubTaskStatus}
              onEdit={handleEditSubTask}
              onDelete={handleDeleteSubTask}
            />
          ))
        ) : (
          <p>No subtasks available</p>
        )}
        <div style={{ marginTop: "10px" }}>
          <input
            type="text"
            placeholder="New Subtask Title"
            value={subTaskTitle}
            onChange={(e) => {
              setSubTaskTitle(e.target.value);
              setSubTaskError("");
            }}
          />
          <button onClick={handleAddSubTask} style={{ marginLeft: "5px" }}>
            Add Subtask
          </button>
          {subTaskError && <p style={{ color: "red" }}>{subTaskError}</p>}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
