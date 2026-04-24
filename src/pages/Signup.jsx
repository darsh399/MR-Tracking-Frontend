import { useEffect, useState } from 'react';
import './AuthPage.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signup, clearError } from '../redux/slices/authSlice';

const Signup = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    mobileNo: '',
    companyName: '',
    password: '',
    confirmPassword: '',
    role: 'mr',
    showPassword: false,
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onchangeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const validation = {};
    if (!formData.userName.trim()) validation.userName = 'Full name is required';
    if (!formData.email.trim()) validation.email = 'Email is required';
    if (!formData.mobileNo.trim()) validation.mobileNo = 'Mobile number is required';
    if (formData.role === 'admin' && !formData.companyName.trim()) validation.companyName = 'Company name is required for admins';
    if (!formData.password) validation.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) validation.confirmPassword = 'Passwords must match';
    return validation;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validation = validateForm();
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      setMessage('');
      return;
    }

    const submitData = {
      userName: formData.userName,
      email: formData.email,
      mobileNo: formData.mobileNo,
      companyName: formData.companyName,
      password: formData.password,
      role: formData.role,
    };

    try {
      await dispatch(signup(submitData)).unwrap();
      setMessage('Signup successful. Please log in.');
      setFormData({
        userName: '',
        email: '',
        mobileNo: '',
        companyName: '',
        password: '',
        confirmPassword: '',
        role: 'mr',
        showPassword: false,
      });
      navigate('/login');
    } catch (signupError) {
      console.error('Signup failed:', signupError);
      setMessage('');
    }
  };

  return (
    <div className="auth-page" id="signup">
      <div style={{ position: 'absolute', top: '20px', left: '20px' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '10px 20px', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}>
          ← Back
        </button>
      </div>
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create an account</h2>
        <p className="form-subtitle">Select your user type and complete the form below.</p>

        {error && <div className="error-message">{error}</div>}
        {message && <div className="success-message">{message}</div>}

        <label className="form-control">
          <span>Full name</span>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={onchangeHandler}
            placeholder="Enter your full name"
          />
          {errors.userName && <small className="field-error">{errors.userName}</small>}
        </label>

        <label className="form-control">
          <span>Email address</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onchangeHandler}
            placeholder="Enter your email"
          />
          {errors.email && <small className="field-error">{errors.email}</small>}
        </label>

        <label className="form-control">
          <span>Mobile number</span>
          <input
            type="text"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={onchangeHandler}
            placeholder="Enter your mobile number"
          />
          {errors.mobileNo && <small className="field-error">{errors.mobileNo}</small>}
        </label>

        <label className="form-control">
          <span>User type</span>
          <select name="role" value={formData.role} onChange={onchangeHandler}>
            <option value="mr">MR user</option>
            <option value="admin">Admin user</option>
          </select>
        </label>

        <label className="form-control">
          <span>Company name</span>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={onchangeHandler}
            placeholder="Company name"
          />
          {errors.companyName && <small className="field-error">{errors.companyName}</small>}
          <small className="field-note">
            Required for admin registration. MR users can set company affiliation here if available.
          </small>
        </label>

        <label className="form-control">
          <span>Password</span>
          <input
            type={formData.showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={onchangeHandler}
            placeholder="Enter a password"
          />
          {errors.password && <small className="field-error">{errors.password}</small>}
        </label>

        <label className="form-control">
          <span>Confirm password</span>
          <input
            type={formData.showPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={onchangeHandler}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <small className="field-error">{errors.confirmPassword}</small>}
        </label>

        <div className="checkbox-row">
          <label>
            <input
              type="checkbox"
              name="showPassword"
              checked={formData.showPassword}
              onChange={onchangeHandler}
            />
            Show password
          </label>
        </div>

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? 'Creating account…' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
