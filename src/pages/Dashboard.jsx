import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const role = currentUser?.role || 'user';
  const name = currentUser?.userName || currentUser?.email || 'User';

  const adminCards = [
    {
      title: 'Admin analytics',
      description: 'Access the admin dashboard with metrics, approvals, and management tools.',
      link: '/admin/dashboard',
    },
    {
      title: 'User approvals',
      description: 'Review pending MR registrations and approve or suspend accounts.',
      link: '/admin/dashboard',
    },
    {
      title: 'Visit reports',
      description: 'See visit summaries and doctor activity from the admin console.',
      link: '/admin/dashboard',
    },
  ];

  const mrCards = [
    {
      title: 'Add a visit',
      description: 'Record a new MR doctor visit and capture your geolocation automatically.',
      link: '/mr/add-visit',
    },
    {
      title: 'Visit history',
      description: 'Review your past visit records and location validation status.',
      link: '/mr/visit-history',
    },
    {
      title: 'Profile settings',
      description: 'Update your profile and manage your MR account information.',
      link: '/profile',
    },
  ];

  const defaultCards = [
    {
      title: 'Profile',
      description: 'View and update your account details.',
      link: '/profile',
    },
    {
      title: 'Visit history',
      description: 'Track your past activity and assignments.',
      link: '/mr/visit-history',
    },
    {
      title: 'Support',
      description: 'Reach out to the team for help with your account or workflows.',
      link: '/profile',
    },
  ];

  return (
    <div className="dashboard-page">
      <section className="dashboard-hero">
        <div className="dashboard-copy">
          <p className="eyebrow">Welcome back</p>
          <h1>{role === 'admin' ? 'Admin dashboard' : role === 'mr' ? 'MR dashboard' : 'User dashboard'}</h1>
          <p>
            {role === 'admin'
              ? 'Use the admin panel to manage users, approvals, and visit analytics.'
              : role === 'mr'
              ? 'Use your MR dashboard to log visits, validate locations, and review history.'
              : 'Use your dashboard to manage your account and explore available tools.'}
          </p>
          <div className="dashboard-actions">
            <Link className="button primary" to={role === 'admin' ? '/admin/dashboard' : role === 'mr' ? '/dashboard' : '/profile'}>
              Open dashboard
            </Link>
            <Link className="button outline" to="/profile">
              Profile settings
            </Link>
          </div>
        </div>

        <div className="dashboard-summary">
          <span className={`role-badge ${role}`}>{role.toUpperCase()}</span>
          <h2>Hello, {name}</h2>
          <p className="role-description">
            {role === 'admin'
              ? 'Admin access gives you the ability to view all system activity and manage users.'
              : role === 'mr'
              ? 'Record visits and keep your activity up to date with the MR pipeline.'
              : 'Manage your profile and account details in this space.'}
          </p>
        </div>
      </section>

      <section className="dashboard-cards">
        {(role === 'admin' ? adminCards : role === 'mr' ? mrCards : defaultCards).map((item) => (
          <article key={item.title} className="dashboard-card">
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <Link to={item.link} className="card-link">
              View
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
