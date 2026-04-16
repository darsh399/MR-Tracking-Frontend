import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.dataReducer);
  const role = currentUser?.isAdmin ? 'admin' : 'user';
  const name = currentUser?.fullName || currentUser?.userName || currentUser?.email || 'User';
  console.log('Dashboard user data:', currentUser);
  const adminCards = [
    {
      title: 'User management',
      description: 'Review and control user access, roles, and account status from a dedicated admin panel.',
    },
    {
      title: 'Reports & metrics',
      description: 'Track important system activity and analytics on the admin dashboard.',
    },
    {
      title: 'Admin settings',
      description: 'Configure site settings, approvals, and advanced control options.',
    },
  ];

  const userCards = [
    {
      title: 'My account',
      description: 'View and update your profile, email, and password information.',
    },
    {
      title: 'My services',
      description: 'Access your available services and manage your personal workflows.',
    },
    {
      title: 'Activity',
      description: 'Track your recent actions and stay on top of your work.',
    },
  ];

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-copy">
          <p className="eyebrow">Welcome back</p>
          <h1>{role === 'admin' ? `Admin dashboard` : `User dashboard`}</h1>
          <p>
            {role === 'admin'
              ? 'This section is designed for admin users who need access to management tools, reports, and user controls.'
              : 'This section is built for normal users to manage their account, access services, and keep their profile updated.'}
          </p>
          <div className="dashboard-actions">
            <Link className="button primary" to="/profile">
              View profile
            </Link>
            <Link className="button outline" to="/update-profile">
              Update profile
            </Link>
            <Link className="button outline" to="/users">
              View All Users
            </Link>
          </div>
        </div>

        <div className="dashboard-summary">
          <span className={`role-badge ${role}`}>{role.toUpperCase()}</span>
          <h2>Hello, {name}</h2>
          <p className="role-description">
            {role === 'admin'
              ? 'You have admin access to manage users and configure the application.'
              : 'You have normal user access to your personal dashboard and services.'}
          </p>
        </div>
      </section>

      <section className="dashboard-cards">
        {(role === 'admin' ? adminCards : userCards).map((item) => (
          <article key={item.title} className="dashboard-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
