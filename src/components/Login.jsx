import { useEffect, useState } from 'react';
import './Login.css';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../redux/slices/authSlice';
import { useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    showPassword: false,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const logoutMessage = location.state?.message;
  const { error, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onchangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const showPasswordHandler = () => {
    setFormData({
      ...formData,
      showPassword: !formData.showPassword,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(login(formData)).unwrap();
      const role = result.user?.role;
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'mr') {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (loginError) {
      console.error('Login failed:', loginError);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {logoutMessage && <div className="success-message">{logoutMessage}</div>}
        {error && <div className="error-message">{error}</div>}

        <label htmlFor="email">Email</label>
        <input
          type="text"
          onChange={onchangeHandler}
          name="email"
          placeholder="Enter Email"
          value={formData.email}
        />

        <label htmlFor="password">Password</label>
        <input
          type={formData.showPassword ? 'text' : 'password'}
          onChange={onchangeHandler}
          name="password"
          placeholder="Enter Password"
          value={formData.password}
        />

        <div className="checkbox-row">
          <label>
            <input
              type="checkbox"
              onChange={showPasswordHandler}
              name="showPassword"
              checked={formData.showPassword}
            />
            {formData.showPassword ? 'Hide' : 'Show'} Password
          </label>
        </div>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;