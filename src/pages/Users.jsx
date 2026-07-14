import { useEffect, useState } from "react";
import API from "../services/axios";
import "./AdminPages.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("admin");
  const [validationErrors, setValidationErrors] = useState({});

  const fetchUsers = async () => {
    try {
      const { data } = await API.get("/users");
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Live-check for duplicate email against currently loaded users
  useEffect(() => {
    if (!newEmail) {
      setValidationErrors((v) => {
        const { email, ...rest } = v;
        return rest;
      });
      return;
    }

    const exists = users.some((u) => u.email && u.email.toLowerCase() === newEmail.toLowerCase());
    if (exists) {
      setValidationErrors((v) => ({ ...v, email: "User with this email already registered" }));
    } else {
      setValidationErrors((v) => {
        const { email, ...rest } = v;
        return rest;
      });
    }
  }, [newEmail, users]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      setDeleting((s) => [...s, id]);
      await API.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      setMessage("User deleted");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user");
    } finally {
      setDeleting((s) => s.filter((x) => x !== id));
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (creating) return;
    setError("");
    setMessage("");

    // Revalidate before submit
    const errs = {};
    if (!newName.trim()) errs.name = "Name is required";
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(newEmail)) errs.email = "Enter a valid email";
    if (newPassword.length < 8) errs.password = "Password must be at least 8 characters";
    else if (!/[0-9]/.test(newPassword) || !/[A-Za-z]/.test(newPassword)) errs.password = "Password must include letters and numbers";

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs);
      setError("Please fix the validation errors before creating.");
      return;
    }
    setValidationErrors({});

    try {
      setCreating(true);
      const { data } = await API.post("/users", {
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole,
      });

      const created = data.user;
      setUsers((prev) => [created, ...prev]);
      setMessage("User created successfully");
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("admin");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create user";
      if (err.response?.status === 409) {
        // Email already exists — show inline error on email field
        setValidationErrors((v) => ({ ...v, email: msg }));
      }
      setError(msg);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <h2 className="loading">Loading users...</h2>;

  return (
    <div className="admin-page">
      <h1>Users</h1>
      <form className="admin-form user-create-form" onSubmit={handleCreate} style={{ marginBottom: 12 }}>
        <div className="user-create-row">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} required />
            {validationErrors.name && <small className="field-error">{validationErrors.name}</small>}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <input placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
            {validationErrors.email && <small className="field-error">{validationErrors.email}</small>}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <input placeholder="Password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            {validationErrors.password && <small className="field-error">{validationErrors.password}</small>}
          </div>

          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="student">Student</option>
          </select>
          <button className="button-primary" type="submit" disabled={creating}>{creating ? "Creating..." : "Create"}</button>
        </div>
      </form>
      {message && <div className="admin-alert">{message}</div>}
      {error && <div className="admin-alert" style={{ background: "#fee2e2", color: "#991b1b" }}>{error}</div>}

      {users.length === 0 ? (
        <div className="admin-card">No users found</div>
      ) : (
        <div className="admin-card">
          <ul>
            {users.map((u) => (
              <li key={u._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong>{u.name}</strong>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>{u.email} • {u.role}</div>
                </div>
                <div>
                  <button className="button-danger" onClick={() => handleDelete(u._id)} disabled={deleting.includes(u._id)}>
                    {deleting.includes(u._id) ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
