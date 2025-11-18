import React, { useState, useEffect } from "react";
import axios from "axios";

export default function TeacherDashboard({ onLogout }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Not started");
  const [filterStatus, setFilterStatus] = useState("all");

  // ---------------------------------------------------------------
  // LOAD ALL TASKS (Teacher sees all students)
  // ---------------------------------------------------------------
  const loadTasks = async () => {
    try {
      const url = `http://localhost:5000/tasks?teacherView=true&status=${filterStatus}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [filterStatus]);

  // ---------------------------------------------------------------
  // ADD TASK
  // ---------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:5000/tasks",
        {
          title,
          description,
          dueDate,
          status,
          userId: user._id, // ensure task belongs to this teacher's student
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTitle("");
      setDescription("");
      setDueDate("");
      setStatus("Not started");

      loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // ---------------------------------------------------------------
  // UPDATE TASK STATUS
  // ---------------------------------------------------------------
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/tasks/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadTasks();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ padding: "25px" }}>
      <h1>Teacher Dashboard —</h1>

      <button
        onClick={onLogout}
        style={{
          float: "right",
          background: "red",
          color: "white",
          padding: "7px 15px",
          borderRadius: "6px",
        }}
      >
        Logout
      </button>

      <h2>Create Task</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#f8f8f8",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "25px",
        }}
      >
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ width: "20%", marginRight: "10px" }}
        />

        <input
          type="text"
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: "20%", marginRight: "10px" }}
        />

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          style={{ marginRight: "10px" }}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ marginRight: "10px" }}
        >
          <option>Not started</option>
          <option>In progress</option>
          <option>Completed</option>
        </select>

        <button
          type="submit"
          style={{
            background: "#0066ff",
            color: "white",
            padding: "8px 20px",
            borderRadius: "6px",
          }}
        >
          Add Task
        </button>
      </form>

      {/* ------------------------ FILTER DROPDOWN ------------------------ */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ marginRight: "10px" }}>Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option value="Not started">Not started</option>
          <option value="In progress">In progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <h2>All Tasks</h2>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>Student</th>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Update</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((t) => (
            <tr key={t._id}>
              <td>{t.user?.email}</td>
              <td>{t.title}</td>
              <td>{t.description}</td>
              <td>{t.dueDate?.slice(0, 10)}</td>
              <td>{t.status}</td>

              <td>
                <button
                  onClick={() =>
                    handleStatusUpdate(
                      t._id,
                      t.status === "Completed" ? "Not started" : "Completed"
                    )
                  }
                  style={{
                    padding: "5px 12px",
                    background: "blue",
                    color: "white",
                    borderRadius: "5px",
                  }}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
