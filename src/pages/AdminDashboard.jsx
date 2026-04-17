import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { loadAdminStats, loadAdminUsers, approveAdminUser } from '../redux/slices/adminSlice';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import './AdminDashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, users, loading, error } = useSelector((state) => state.admin);
  console.log('Admin stats:', users);
  useEffect(() => {
    dispatch(loadAdminStats());
    dispatch(loadAdminUsers());
  }, [dispatch]);

  const visitLabels = stats?.visitsPerDay.map((item) => item._id) || [];
  const visitValues = stats?.visitsPerDay.map((item) => item.count) || [];
  const doctorLabels = stats?.topDoctors.map((item) => item._id) || [];
  const doctorValues = stats?.topDoctors.map((item) => item.count) || [];
  const performanceLabels = stats?.mrPerformance.map((item) => item.userName) || [];
  const performanceValues = stats?.mrPerformance.map((item) => item.visits) || [];

  return (
    <div className="admin-dashboard-page">
      <section className="page-header">
        <h1>Admin Dashboard</h1>
        <p>Monitor MR performance, visit metrics, doctor popularity, and account approvals.</p>
      </section>

      {loading && <p className="status-message">Loading admin metrics…</p>}
      {error && <p className="error-message">{error}</p>}

      <div className="admin-stat-grid">
        <article className="stat-card">
          <h3>Total MRs</h3>
          <p>{stats?.totalMRs ?? '—'}</p>
        </article>
        <article className="stat-card">
          <h3>Total Visits</h3>
          <p>{stats?.totalVisits ?? '—'}</p>
        </article>
        <article className="stat-card">
          <h3>Total Doctors</h3>
          <p>{stats?.totalDoctors ?? '—'}</p>
        </article>
        <article className="stat-card">
          <h3>Active Users</h3>
          <p>{stats?.activeUsers ?? '—'}</p>
        </article>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>Visits per day</h3>
          <Bar
            data={{ labels: visitLabels, datasets: [{ label: 'Visits', data: visitValues, backgroundColor: '#3b82f6' }] }}
            options={{ responsive: true, plugins: { legend: { display: false } } }}
          />
        </div>
        <div className="chart-card">
          <h3>Top visited doctors</h3>
          <Doughnut
            data={{
              labels: doctorLabels,
              datasets: [{ data: doctorValues, backgroundColor: ['#2563eb', '#f97316', '#22c55e', '#8b5cf6', '#f43f5e'] }],
            }}
            options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
          />
        </div>
      </div>

      <div className="top-performers">
        <h2>Top MR performance</h2>
        <table>
          <thead>
            <tr>
              <th>MR Name</th>
              <th>Visits</th>
            </tr>
          </thead>
          <tbody>
            {stats?.mrPerformance?.map((item) => (
              <tr key={item.userName}>
                <Link to={`/user/${item._id}`} className="performance-link">
                <td>{item.userName}</td>
                <td>{item.visits}</td>
                </Link>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pending-users">
        <h2>Pending approvals</h2>
        <div className="pending-list">
          {users.filter((user) => !user.approved).length === 0 ? (
            <p>No pending users at this time.</p>
          ) : (
            users
              .filter((user) => !user.approved)
              .map((user) => (
                <div key={user._id} className="pending-card">
                  <h4>{user.userName || user.email}</h4>
                  <p>{user.email}</p>
                  <p>{user.role.toUpperCase()}</p>
                  <p><button onClick={() => dispatch(approveAdminUser(user._id))}>Approve</button></p>
                  <p><button onClick={() => dispatch(rejectAdminUser(user._id))}>Reject</button></p>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
