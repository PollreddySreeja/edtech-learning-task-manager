import React, { useState, useEffect } from "react";
import axios from "axios";

export default function StudentDashboard({ onLogout }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [tasks, setTasks] = useState([]);
  const [teacher, setTeacher] = useState(null);

  const loadTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const loadTeacher = async () => {
    try {
      if (user.teacherId) {
        const res = await axios.get(
          `http://localhost:5000/users/${user.teacherId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTeacher(res.data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadTasks();
    loadTeacher();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/tasks/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadTasks();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div style={{ padding: "25px" }}>
      <h1>Student Dashboard —</h1>

      {/* ROLE DISPLAY */}
      <p><b>Logged in as:</b> Student</p>
      {teacher && (
        <p><b>Your Teacher:</b> {teacher.email}</p>
      )}

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

      <h2>All Tasks</h2>

      <table border="1" width="100%">
        <thead>
          <tr>
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
              <td>{t.title}</td>
              <td>{t.description}</td>
              <td>{t.dueDate?.slice(0, 10)}</td>
              <td>{t.status}</td>

              <td>
                <button
                  onClick={() =>
                    handleStatusUpdate(
                      t._id,
                      t.status === "Completed"
                        ? "Not started"
                        : "Completed"
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
