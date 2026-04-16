import { useState } from 'react';
import './Login.css';
import { useDispatch } from 'react-redux';
import { loginUserAction } from '../redux/action/dataAction';
import { useNavigate, useLocation } from 'react-router-dom';
const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        showPassword: false
    });
    const dispatch = useDispatch();
    const navigation = useNavigate();
    const location = useLocation();
    const logoutMessage = location.state?.message;
    const onchangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const showPasswordHandler = () => {
        setFormData({
            ...formData,
            showPassword: !formData.showPassword
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUserAction(formData))
            .then((response) => {
                console.log('Login successful:', response);
                navigation('/profile');
            })
            .catch((error) => {
                console.error('Login failed:', error.message || error);
            });
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h2>Login</h2>
                {logoutMessage && <div className="success-message">{logoutMessage}</div>}
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
                    type={formData.showPassword ? "text" : "password"}
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
                        {formData.showPassword ? "Hide" : "Show"} Password
                    </label>
                </div>

                <button type="submit" className="primary-button">Login</button>
            </form>
        </div>
    );
};

export default Login;