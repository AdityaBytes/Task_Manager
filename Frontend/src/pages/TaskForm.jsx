import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const TaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ title: "", description: "", dueDate: "", general: "" });
  const navigate = useNavigate();

  // Retrieve the token from Redux state
  const token = useSelector((state) => state.auth.token);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!title || !description || !dueDate) {
      setError({
        title: title ? "" : "Title is required.",
        description: description ? "" : "Description is required.",
        dueDate: dueDate ? "" : "Due date is required.",
        general: "",
      });
      return;
    }

    setLoading(true);
    setError({ title: "", description: "", dueDate: "", general: "" });

    // Check if token exists in Redux state
    if (!token) {
      setError({ general: "Authentication token is missing. Please log in." });
      setLoading(false);
      return;
    }

    // Configure axios headers with the token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      // Send a POST request to create a new task
      const response = await axios.post(
        "http://localhost:5000/api/tasks",
        { title, description, dueDate },
        config
      );

      if (response.status === 201) {
        alert("Task created successfully");
        setTitle("");
        setDescription("");
        setDueDate("");
        navigate("/tasks");
      } else {
        setError({ general: "Failed to create task. Please try again later." });
      }
    } catch (error) {
      console.error("Task creation error:", error);
      setError({ general: error.response?.data?.error || "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#f0f4f8", padding: "20px" }}>
      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "500px",
          margin: "auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "5px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Create New Task</h1>

        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            style={{ width: "100%", padding: "10px", margin: "10px 0", border: "1px solid #ccc", borderRadius: "5px" }}
          />
          {error.title && <p style={{ color: "red", fontSize: "12px" }}>{error.title}</p>}
        </div>

        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
            style={{ width: "100%", padding: "10px", margin: "10px 0", border: "1px solid #ccc", borderRadius: "5px" }}
          />
          {error.description && <p style={{ color: "red", fontSize: "12px" }}>{error.description}</p>}
        </div>

        <div>
          <label htmlFor="dueDate">Due Date:</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={loading}
            style={{ width: "100%", padding: "10px", margin: "10px 0", border: "1px solid #ccc", borderRadius: "5px" }}
          />
          {error.dueDate && <p style={{ color: "red", fontSize: "12px" }}>{error.dueDate}</p>}
        </div>

        {error.general && <p style={{ color: "red", fontSize: "12px" }}>{error.general}</p>}

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer"
          }}
          disabled={loading}
        >
          {loading ? "Creating Task..." : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
