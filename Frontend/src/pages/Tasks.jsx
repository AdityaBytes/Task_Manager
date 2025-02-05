// src/Pages/Tasks.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks } from "../redux/taskSlice";
import TaskCard from "../Components/TaskCard";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks, loading, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  if (error) {
    return <p>Error loading tasks: {error}</p>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Tasks</h1>
      <button
        style={{
          padding: "10px 20px",
          marginBottom: "20px",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          fontSize: "16px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onClick={() => navigate("/tasks/new")}
      >
        Create Task
      </button>
      {tasks.length > 0 ? (
        tasks.map((task) => <TaskCard key={task._id} task={task} />)
      ) : (
        <p>No tasks available</p>
      )}
    </div>
  );
};

export default Tasks;
