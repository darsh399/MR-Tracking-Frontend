import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { logoutUserAction } from '../redux/action/dataAction';
const Header = () => {
  const { currentUser } = useSelector((state) => state.dataReducer);
  const dispatch = useDispatch();
  const navigation = useNavigate();

  console.log('User data in Header:', currentUser);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUserAction());
      navigation('/login', { replace: true, state: { message: 'Logout successful' } });
    } catch (error) {
      console.error('Logout failed', error);
    }
  }
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/">
          MyApp
        </Link>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          {currentUser ? <Link to="/dashboard">Dashboard</Link> : <Link to="/login">Login</Link>}
          {currentUser ? <Link to="/profile">Profile</Link> : <Link to="/signup">Sign Up</Link>}
          {currentUser && <button className="logout-button" onClick={handleLogout}>Logout</button>}
        </nav>
      </div>
    </header>
  );
};

export default Header;
