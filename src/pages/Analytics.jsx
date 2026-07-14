import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

import API from "../services/axios";
import "./AdminPages.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

export default function Analytics() {
  const [dashboard, setDashboard] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [dashRes, monthlyRes] = await Promise.all([
        API.get("/admin/dashboard"),
        API.get("/admin/analytics/monthly-enrollments"),
      ]);

      setDashboard(dashRes.data.dashboard || null);
      setMonthly(monthlyRes.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <h2 className="loading">Loading analytics...</h2>;

  const labels = monthly.map((d) => `Month ${d._id.month}`);
  const data = {
    labels,
    datasets: [
      {
        label: "Enrollments",
        data: monthly.map((d) => d.total),
        backgroundColor: "#60a5fa",
      },
    ],
  };

  return (
    <div className="admin-page">
      <h1>Analytics</h1>

      {dashboard && (
        <div className="admin-card">
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 150px" }}>
              <h4>Total Users</h4>
              <p>{dashboard.totalUsers}</p>
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <h4>Total Courses</h4>
              <p>{dashboard.totalCourses}</p>
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <h4>Total Lessons</h4>
              <p>{dashboard.totalLessons}</p>
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <h4>Enrollments</h4>
              <p>{dashboard.totalEnrollments}</p>
            </div>
          </div>
        </div>
      )}

      <div className="admin-card" style={{ marginTop: 16 }}>
        <h3>Monthly Enrollments</h3>
        <Bar data={data} options={{ responsive: true, plugins: { legend: { position: "bottom" }, title: { display: false } } }} />
      </div>
    </div>
  );
}
