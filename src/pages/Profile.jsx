import './AuthPage.css';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { currentUser, loading } = useSelector((state) => state.auth);
  const role = currentUser?.role || 'user';

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Profile</h2>
        {loading && <p>Loading profile…</p>}
        {currentUser ? (
          <div>
            <p>
              <strong>Name:</strong> {currentUser.userName || currentUser.email}
            </p>
            <p>
              <strong>Email:</strong> {currentUser.email}
            </p>
            <p>
              <strong>Role:</strong> {role}
            </p>
            <p>
              {role === 'admin'
                ? 'Admin users can manage users, configure settings, and see admin-only options.'
                : role === 'mr'
                ? 'MR users can add visit logs, review history, and share location-validated reports.'
                : 'Normal users can update their account, manage services, and access user-only content.'}
            </p>
            {currentUser.approved === false && (
              <p className="status-warning">Your account is pending approval.</p>
            )}
          </div>
        ) : (
          <p>User not found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
