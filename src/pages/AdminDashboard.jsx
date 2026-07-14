import "./AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome back, admin. Use the sidebar links to manage courses, sections, lessons, users, and analytics.</p>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <p>Create new courses, add sections, upload lessons, and manage users from the left menu.</p>
          <strong>Fast access</strong>
        </div>

        <div className="dashboard-card">
          <h3>Site Health</h3>
          <p>Track enrollment trends, course activity, and user growth from the analytics panel.</p>
          <strong>Monitoring</strong>
        </div>

        <div className="dashboard-card">
          <h3>Content Overview</h3>
          <p>Keep course structure clean with properly ordered sections and lesson uploads.</p>
          <strong>Organized</strong>
        </div>
      </div>

      <div className="admin-banner">
        <h2>Need a new course?</h2>
        <p>Create course content, enable preview lessons, and upload thumbnails and videos securely for your students.</p>
      </div>
    </div>
  );
}

export default AdminDashboard;