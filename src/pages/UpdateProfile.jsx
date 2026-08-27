import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthPage.css';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserAction } from '../redux/slices/authSlice';
const initialFormData = {
  userName: '',
  email: '',
  mobileNo: '',
  password: '',
  showPassword: false,
};

const UpdateProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const { currentUser } = useSelector((state) => state.auth);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  console.log('Current user in UpdateProfilessssss:', currentUser);
  const onchangeHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  useEffect(() => {
    if (currentUser) {
      setFormData({
        userName: currentUser.userName || '',
        email: currentUser.email || '',
        mobileNo: currentUser.mobileNo || 'jkjj',
        password: '',
        showPassword: false,
      });
    } else {
      setFormData(initialFormData);
      setMessage('Please log in to update your profile.');
    }
  }, [currentUser]);

  const validateForm = () => {
    const validation = {};
    if (!formData.userName.trim()) validation.userName = 'Name is required';
    if (!formData.email.trim()) validation.email = 'Email is required';
    if (!formData.mobileNo.trim()) validation.mobileNo = 'Mobile number is required';
    return validation;
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    const validation = validateForm();
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      setMessage('');
      return;
    }
    if (!currentUser) {
      setMessage('Please log in before updating your profile.');
      return;
    }
    await dispatch(updateUserAction(formData));
    setMessage('Profile changes saved locally in this demo.');
  };

  return (
    <div className="auth-page" id="profile">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Update profile</h2>
        <p className="form-subtitle">Edit your profile details and save changes.</p>

        <label className="form-control">
          <span>Full name</span>
          <input
            type="text"
            name="userName"
            value={formData.userName}
            onChange={onchangeHandler}
            placeholder="Enter your name"
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
            type="tel"
            name="mobileNo"
            value={formData.mobileNo}
            onChange={onchangeHandler}
            placeholder="Enter your mobile number"
          />
          {errors.mobileNo && <small className="field-error">{errors.mobileNo}</small>}
        </label>

        <label className="form-control">
          <span>Enter Current Password To Update Profile</span>
          <input
            type={formData.showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={onchangeHandler}
            placeholder="Enter a new password"
          />
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
          Save changes
        </button>
        {message && <div className="success-message">{message}</div>}
      </form>
    </div>
  );
};

export default UpdateProfile;
