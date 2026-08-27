import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import './Header.css';
import { logout } from '../redux/slices/authSlice';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import { useDarkMode } from '../context/DarkModeContext';
import { deleteUserAction } from '../redux/slices/authSlice';
const DarkModeToggle = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <button
      type="button"
      className="dark-mode-header-toggle"
      onClick={toggleDarkMode}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
};

const Header = () => {
  const { currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
console.log('Current user in Header:', currentUser);
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

  const handleDeleteAccount = async () => {
    const userId = currentUser?.id || currentUser?._id;
    if (!userId) {
      console.error('Unable to delete account: missing user ID', currentUser);
      alert('Unable to delete account right now. Please refresh and try again.');
      return;
    }

    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await dispatch(deleteUserAction(userId)).unwrap();
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        navigate('/signup', { replace: true, state: { message: 'Account deleted successfully' } });
      } catch (error) {
        console.error('Account deletion failed', error);
        alert('Failed to delete account. Please try again later.');
      }
    }
  };

  const dashboardPath = currentUser
    ? currentUser.role === 'admin'
      ? '/admin-dashboard'
      : '/dashboard'
    : '/login';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userInitial = currentUser?.userName?.charAt(0).toUpperCase() || 'U';
  const isAuthenticated = Boolean(currentUser);

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" to="/">
          <img src={logo} alt="MediTrack Pro Logo" className="logo-image" />
        </Link>

        <nav className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
          <NavLink end to="/" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to={dashboardPath} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>
                Dashboard
              </NavLink>
              <NavLink to="/doctors" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>
                Doctors
              </NavLink>
              <NavLink to="/visits" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>
                Visits
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>
                About Us
              </NavLink>
              <NavLink to="/contact" className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMobileMenuOpen(false)}>
                Contact
              </NavLink>
            </>
          )}
        </nav>

        <button
          type="button"
          className={`mobile-menu-toggle ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <DarkModeToggle />

        <div className="header-action-group" ref={dropdownRef}>
          {currentUser ? (
            <button
              type="button"
              className="profile-button"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              <span>{userInitial}</span>
            </button>
          ) : (
            <div className="auth-buttons">
              <Link className="text-button" to="/login">Login</Link>
              <Link className="primary-button" to="/signup">Sign Up</Link>
            </div>
          )}

          {currentUser && (
            <div className={`profile-dropdown ${dropdownOpen ? 'open' : ''}`}>
              <div className="dropdown-header">
                <strong>{currentUser.userName}</strong>
                <span>{currentUser.role.toUpperCase()}</span>
              </div>
              <Link className="dropdown-item" to="/update-profile" onClick={() => setDropdownOpen(false)}>
                Update Profile
              </Link>
              {currentUser.role !== 'admin' && (
                <Link className="dropdown-item" to="/leaves" onClick={() => setDropdownOpen(false)}>
                  Leaves
                </Link>
              )}
              <Link className="dropdown-item" to="/reset-password" onClick={() => setDropdownOpen(false)}>
                Reset Password
              </Link>
              <button type="button" className="dropdown-item delete-item" onClick={handleDeleteAccount}>
                Delete Account
              </button>
              <button type="button" className="dropdown-item logout-item" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
