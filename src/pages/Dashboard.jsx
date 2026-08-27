import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Dashboard.css';
import MrDashboard from './MrDashboard';
import AdminDashboard from './AdminDashboard';
const Dashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  const role = currentUser?.role || 'user';
  const name = currentUser?.userName || currentUser?.email || 'User';
  const profileCompleted = currentUser?.profileCompleted;


  return(
    <div className="dashboard-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
          ← Back
        </button>
      </div>
      <section className="page-header">
        <h1>Welcome, {name}!</h1>
        <p>This is your dashboard where you can manage your visits and view your performance metrics.</p>
      </section>
      {!profileCompleted ? (
        <section className="dashboard-notice">
          <h2>Complete onboarding</h2>
          <p>Your employee profile is incomplete. Finish onboarding to access all dashboard features.</p>
          <Link to="/complete-profile" className="button-primary">
            Complete onboarding
          </Link>
        </section>
      ) : (
        (role === 'admin' ? <AdminDashboard /> : <MrDashboard />)
      )}
    </div>
  )
}

export default Dashboard;