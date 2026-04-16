import './AuthPage.css';
import { useSelector } from 'react-redux';

const Profile = () => {
  const { currentUser } = useSelector((state) => state.dataReducer);
  const role = currentUser?.role || 'user';

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Profile</h2>
        {currentUser ? (
          <div>
            <p>
              <strong>Name:</strong> {currentUser.fullName || currentUser.userName || currentUser.email}
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
                : 'Normal users can update their account, manage services, and access user-only content.'}
            </p>
          </div>
        ) : (
          <p>User not found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
