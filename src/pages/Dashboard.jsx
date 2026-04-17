import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Dashboard.css';
import MrDashboard from './MrDashboard';
import AdminDashboard from './AdminDashboard';
const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const role = currentUser?.role || 'user';
  const name = currentUser?.userName || currentUser?.email || 'User';
  const profileCompleted = currentUser?.profileCompleted;


  return(
    <div className="dashboard-page">
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