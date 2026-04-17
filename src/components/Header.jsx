import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';

const Header = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      navigate('/login', { replace: true, state: { message: 'Logout successful' } });
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const dashboardPath = currentUser
    ? currentUser.role === 'admin'
      ? '/admin-dashboard'
      : '/dashboard'
    : '/login';

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/">
          MR Visit Tracker
        </Link>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {currentUser ? <Link to={dashboardPath}>Dashboard</Link> : <Link to="/login">Login</Link>}
          {currentUser && !currentUser.profileCompleted && <Link to="/complete-profile">Onboarding</Link>}
          {currentUser ? <Link to="/profile">Profile</Link> : <Link to="/signup">Sign Up</Link>}
          {currentUser && <button className="logout-button" onClick={handleLogout}>Logout</button>}
        </nav>
      </div>
    </header>
  );
};

export default Header;
