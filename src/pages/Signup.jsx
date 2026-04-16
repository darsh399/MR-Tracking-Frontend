import { useState } from 'react';
import './AuthPage.css';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUserAction } from '../redux/action/dataAction';
const Signup = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    mobileNo: '',
    password: '',
    confirmPassword: '',
    isAdmin: false,
    showPassword: false,
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onchangeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'isAdmin' ? value === 'true' : type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const validation = {};
    if (!formData.userName.trim()) validation.userName = 'Full name is required';
    if (!formData.email.trim()) validation.email = 'Email is required';
    if (!formData.mobileNo.trim()) validation.mobileNo = 'Mobile number is required';
    if (!formData.password) validation.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) validation.confirmPassword = 'Passwords must match';
    return validation;
  };

  const handleSubmit = (event) => {
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
      password: formData.password,
      isAdmin: formData.isAdmin,
    };

    dispatch(registerUserAction(submitData));
    setMessage('Signup request sent.');
   setFormData({
  userName: '',
  email: '',
  mobileNo: '',
  password: '',
  confirmPassword: '',
  isAdmin: false,
  showPassword: false,
}); 
  navigate('/login');
  };
  return (
    <div className="auth-page" id="signup">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Create an account</h2>
        <p className="form-subtitle">Select your user type and complete the form below.</p>

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
          <select name="isAdmin" value={String(formData.isAdmin)} onChange={onchangeHandler}>
            <option value="false">Normal user</option>
            <option value="true">Admin user</option>
          </select>
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

        <button type="submit" className="primary-button">
          Register
        </button>
        {message && <div className="success-message">{message}</div>}
      </form>
    </div>
  );
};

export default Signup;
